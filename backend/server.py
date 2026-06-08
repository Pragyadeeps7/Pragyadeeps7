from fastapi import FastAPI, APIRouter, HTTPException, Query, Depends, Request, Response, Cookie
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, uuid, httpx
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta

from seed_data import PRODUCTS_SEED, CATEGORIES_SEED, TESTIMONIALS_SEED

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Saukriti API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

SESSION_DAYS = 7
SESSION_DATA_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"

# ---------- Models ----------
class Product(BaseModel):
    id: str
    name: str
    category: str
    image: str
    price: int
    compareAtPrice: Optional[int] = None
    rating: float
    reviews: int
    tags: List[str] = []
    colors: List[str] = []
    sizes: List[str] = []
    description: str = ""
    stock: int = 100

class ProductIn(BaseModel):
    name: str
    category: str
    image: str
    price: int
    compareAtPrice: Optional[int] = None
    description: str = ""
    tags: List[str] = []
    colors: List[str] = ["#D4A574"]
    sizes: List[str] = ["S", "M", "L"]
    stock: int = 100

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    price: Optional[int] = None
    compareAtPrice: Optional[int] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    sizes: Optional[List[str]] = None
    stock: Optional[int] = None

class NewsletterIn(BaseModel):
    email: EmailStr

class OrderItem(BaseModel):
    id: str
    qty: int

class CustomerInfo(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None

class OrderIn(BaseModel):
    customer: CustomerInfo
    items: List[OrderItem]
    subtotal: int

class OrderStatusIn(BaseModel):
    status: str  # received | packed | shipped | delivered | cancelled

class ReviewIn(BaseModel):
    product_id: str
    rating: int  # 1..5
    title: Optional[str] = None
    body: str

class UserOut(BaseModel):
    user_id: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    is_admin: bool = False

# ---------- Helpers ----------
def strip_id(d):
    if d and "_id" in d:
        d.pop("_id", None)
    return d

async def _get_user_from_token(session_token: Optional[str]) -> Optional[dict]:
    if not session_token:
        return None
    sess = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not sess:
        return None
    expires_at = sess.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at and expires_at < datetime.now(timezone.utc):
        return None
    user = await db.users.find_one({"user_id": sess["user_id"]}, {"_id": 0})
    return user

async def get_current_user(request: Request, session_token: Optional[str] = Cookie(default=None)) -> Optional[dict]:
    # Try cookie first, then Authorization header
    token = session_token
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth.split(" ", 1)[1].strip()
    return await _get_user_from_token(token)

async def require_user(user=Depends(get_current_user)) -> dict:
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

async def require_admin(user=Depends(require_user)) -> dict:
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin only")
    return user

# ---------- Auth Routes ----------
@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """Exchange a session_id (from Emergent Auth redirect) for our own session_token cookie."""
    body = await request.json()
    sid = body.get("session_id")
    if not sid:
        raise HTTPException(400, "Missing session_id")

    async with httpx.AsyncClient(timeout=15.0) as c:
        r = await c.get(SESSION_DATA_URL, headers={"X-Session-ID": sid})
    if r.status_code != 200:
        raise HTTPException(401, "Invalid session")
    data = r.json()
    email = data.get("email")
    name = data.get("name") or email
    picture = data.get("picture")
    session_token = data.get("session_token")
    if not email or not session_token:
        raise HTTPException(401, "Malformed session data")

    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        # Update name/picture if changed
        await db.users.update_one({"email": email}, {"$set": {"name": name, "picture": picture}})
        user_id = existing["user_id"]
        is_admin = existing.get("is_admin", False)
    else:
        # First registered user becomes admin
        is_admin = (await db.users.count_documents({}) == 0)
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id, "email": email, "name": name, "picture": picture,
            "is_admin": is_admin, "created_at": datetime.now(timezone.utc),
        })

    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_DAYS)
    await db.user_sessions.insert_one({
        "user_id": user_id, "session_token": session_token,
        "expires_at": expires_at, "created_at": datetime.now(timezone.utc),
    })

    response.set_cookie(
        key="session_token", value=session_token, httponly=True, secure=True,
        samesite="none", path="/", max_age=SESSION_DAYS * 24 * 60 * 60,
    )
    return {"user": {"user_id": user_id, "email": email, "name": name, "picture": picture, "is_admin": is_admin}}

@api_router.get("/auth/me")
async def auth_me(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"user_id": user["user_id"], "email": user["email"], "name": user["name"],
            "picture": user.get("picture"), "is_admin": user.get("is_admin", False)}

@api_router.post("/auth/logout")
async def auth_logout(response: Response, session_token: Optional[str] = Cookie(default=None)):
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token", path="/", samesite="none", secure=True)
    return {"ok": True}

# ---------- Public Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Saukriti API \u00b7 ready"}

@api_router.get("/products")
async def list_products(
    category: Optional[str] = None, tag: Optional[str] = None,
    sort: str = "featured", min_price: int = 0, max_price: int = 100000,
    q: Optional[str] = None, limit: int = Query(60, le=200), skip: int = 0,
):
    query = {"price": {"$gte": min_price, "$lte": max_price}}
    if category and category != "all":
        query["category"] = category
    if tag:
        query["tags"] = tag
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    sort_map = {"low": ("price", 1), "high": ("price", -1), "rating": ("rating", -1),
                "new": ("tags", -1), "featured": ("_seq", 1)}
    sort_field, sort_dir = sort_map.get(sort, ("_seq", 1))
    total = await db.products.count_documents(query)
    cursor = db.products.find(query, {"_id": 0}).sort(sort_field, sort_dir).skip(skip).limit(limit)
    items = [p async for p in cursor]
    return {"items": items, "total": total}

@api_router.get("/products/{pid}")
async def get_product(pid: str):
    p = await db.products.find_one({"id": pid}, {"_id": 0})
    if not p:
        raise HTTPException(404, "Product not found")
    return p

@api_router.get("/products/{pid}/reviews")
async def get_product_reviews(pid: str):
    cursor = db.reviews.find({"product_id": pid}, {"_id": 0}).sort("created_at", -1).limit(50)
    return [r async for r in cursor]

@api_router.post("/reviews")
async def create_review(payload: ReviewIn, user=Depends(require_user)):
    if not (1 <= payload.rating <= 5):
        raise HTTPException(400, "Rating must be 1-5")
    product = await db.products.find_one({"id": payload.product_id}, {"_id": 0})
    if not product:
        raise HTTPException(404, "Product not found")
    review = {
        "id": str(uuid.uuid4()),
        "product_id": payload.product_id,
        "product_name": product["name"],
        "user_id": user["user_id"],
        "user_name": user["name"],
        "user_picture": user.get("picture"),
        "rating": payload.rating,
        "title": payload.title or "",
        "body": payload.body,
        "created_at": datetime.now(timezone.utc),
        "approved": True,
    }
    await db.reviews.insert_one(review)
    # Recompute aggregate on product
    cursor = db.reviews.find({"product_id": payload.product_id, "approved": True}, {"_id": 0, "rating": 1})
    ratings = [r["rating"] async for r in cursor]
    if ratings:
        avg = round(sum(ratings) / len(ratings), 1)
        await db.products.update_one({"id": payload.product_id}, {"$set": {"rating": avg, "reviews": len(ratings) + product.get("reviews", 0) - max(0, len(ratings) - 1)}})
    review["created_at"] = review["created_at"].isoformat()
    return review

@api_router.get("/categories")
async def list_categories():
    cursor = db.categories.find({}, {"_id": 0}).sort("_seq", 1)
    return [c async for c in cursor]

@api_router.get("/testimonials")
async def list_testimonials():
    cursor = db.testimonials.find({}, {"_id": 0}).sort("id", 1)
    return [t async for t in cursor]

@api_router.post("/newsletter")
async def subscribe(payload: NewsletterIn):
    existing = await db.subscribers.find_one({"email": payload.email})
    if existing:
        return {"ok": True, "message": "Already subscribed"}
    await db.subscribers.insert_one({
        "id": str(uuid.uuid4()), "email": payload.email,
        "created_at": datetime.now(timezone.utc),
    })
    return {"ok": True}

@api_router.post("/orders")
async def create_order(order: OrderIn, user=Depends(get_current_user)):
    order_id = str(uuid.uuid4())
    doc = {
        "order_id": order_id,
        "customer": order.customer.model_dump(),
        "items": [i.model_dump() for i in order.items],
        "subtotal": order.subtotal,
        "status": "received",
        "user_id": user["user_id"] if user else None,
        "email": order.customer.email,
        "created_at": datetime.now(timezone.utc),
    }
    await db.orders.insert_one(doc)
    return {"order_id": order_id, "status": "received"}

@api_router.get("/orders/me")
async def my_orders(user=Depends(require_user)):
    # Orders linked to user_id OR matching email
    cursor = db.orders.find(
        {"$or": [{"user_id": user["user_id"]}, {"email": user["email"]}]},
        {"_id": 0}
    ).sort("created_at", -1)
    items = []
    async for o in cursor:
        if isinstance(o.get("created_at"), datetime):
            o["created_at"] = o["created_at"].isoformat()
        items.append(o)
    return items

@api_router.get("/orders/{oid}")
async def get_order(oid: str, user=Depends(require_user)):
    o = await db.orders.find_one({"order_id": oid}, {"_id": 0})
    if not o:
        raise HTTPException(404, "Order not found")
    if not user.get("is_admin") and o.get("user_id") != user["user_id"] and o.get("email") != user["email"]:
        raise HTTPException(403, "Not allowed")
    if isinstance(o.get("created_at"), datetime):
        o["created_at"] = o["created_at"].isoformat()
    return o

# ---------- Admin Routes ----------
@api_router.get("/admin/stats")
async def admin_stats(_=Depends(require_admin)):
    orders_count = await db.orders.count_documents({})
    products_count = await db.products.count_documents({})
    users_count = await db.users.count_documents({})
    subs_count = await db.subscribers.count_documents({})
    reviews_count = await db.reviews.count_documents({})
    revenue_pipeline = [{"$group": {"_id": None, "total": {"$sum": "$subtotal"}}}]
    revenue_doc = await db.orders.aggregate(revenue_pipeline).to_list(1)
    revenue = revenue_doc[0]["total"] if revenue_doc else 0
    # Recent orders
    recent_cursor = db.orders.find({}, {"_id": 0}).sort("created_at", -1).limit(5)
    recent = []
    async for o in recent_cursor:
        if isinstance(o.get("created_at"), datetime):
            o["created_at"] = o["created_at"].isoformat()
        recent.append(o)
    return {
        "orders": orders_count, "products": products_count, "users": users_count,
        "subscribers": subs_count, "reviews": reviews_count, "revenue": revenue,
        "recent_orders": recent,
    }

@api_router.get("/admin/orders")
async def admin_list_orders(status: Optional[str] = None, _=Depends(require_admin)):
    query = {}
    if status:
        query["status"] = status
    cursor = db.orders.find(query, {"_id": 0}).sort("created_at", -1).limit(200)
    items = []
    async for o in cursor:
        if isinstance(o.get("created_at"), datetime):
            o["created_at"] = o["created_at"].isoformat()
        items.append(o)
    return items

@api_router.patch("/admin/orders/{oid}")
async def admin_update_order(oid: str, payload: OrderStatusIn, _=Depends(require_admin)):
    valid = {"received", "packed", "shipped", "delivered", "cancelled"}
    if payload.status not in valid:
        raise HTTPException(400, "Invalid status")
    res = await db.orders.update_one({"order_id": oid}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(404, "Order not found")
    return {"ok": True, "status": payload.status}

@api_router.get("/admin/subscribers")
async def admin_list_subscribers(_=Depends(require_admin)):
    cursor = db.subscribers.find({}, {"_id": 0}).sort("created_at", -1).limit(500)
    items = []
    async for s in cursor:
        if isinstance(s.get("created_at"), datetime):
            s["created_at"] = s["created_at"].isoformat()
        items.append(s)
    return items

@api_router.get("/admin/reviews")
async def admin_list_reviews(_=Depends(require_admin)):
    cursor = db.reviews.find({}, {"_id": 0}).sort("created_at", -1).limit(200)
    items = []
    async for r in cursor:
        if isinstance(r.get("created_at"), datetime):
            r["created_at"] = r["created_at"].isoformat()
        items.append(r)
    return items

@api_router.delete("/admin/reviews/{rid}")
async def admin_delete_review(rid: str, _=Depends(require_admin)):
    res = await db.reviews.delete_one({"id": rid})
    if res.deleted_count == 0:
        raise HTTPException(404, "Review not found")
    return {"ok": True}

@api_router.post("/admin/products")
async def admin_create_product(p: ProductIn, _=Depends(require_admin)):
    pid = f"p-custom-{uuid.uuid4().hex[:8]}"
    doc = p.model_dump()
    doc.update({"id": pid, "rating": 5.0, "reviews": 0, "_seq": 99999})
    await db.products.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.patch("/admin/products/{pid}")
async def admin_update_product(pid: str, payload: ProductUpdate, _=Depends(require_admin)):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(400, "No fields to update")
    res = await db.products.update_one({"id": pid}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(404, "Product not found")
    return {"ok": True}

@api_router.delete("/admin/products/{pid}")
async def admin_delete_product(pid: str, _=Depends(require_admin)):
    res = await db.products.delete_one({"id": pid})
    if res.deleted_count == 0:
        raise HTTPException(404, "Product not found")
    return {"ok": True}

# ---------- Seeding ----------
@app.on_event("startup")
async def seed_db():
    try:
        if await db.products.count_documents({}) < len(PRODUCTS_SEED):
            await db.products.delete_many({})
            for i, p in enumerate(PRODUCTS_SEED):
                doc = dict(p); doc["_seq"] = i
                await db.products.insert_one(doc)
            await db.products.create_index("id", unique=True)
            logger.info(f"Seeded {len(PRODUCTS_SEED)} products")
        if await db.categories.count_documents({}) < len(CATEGORIES_SEED):
            await db.categories.delete_many({})
            for i, c in enumerate(CATEGORIES_SEED):
                doc = dict(c); doc["_seq"] = i
                await db.categories.insert_one(doc)
            logger.info(f"Seeded {len(CATEGORIES_SEED)} categories")
        if await db.testimonials.count_documents({}) < len(TESTIMONIALS_SEED):
            await db.testimonials.delete_many({})
            for t in TESTIMONIALS_SEED:
                await db.testimonials.insert_one(dict(t))
            logger.info(f"Seeded {len(TESTIMONIALS_SEED)} testimonials")
    except Exception as e:
        logger.exception(f"Seed error: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
