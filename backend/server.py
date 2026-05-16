from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime

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

class Category(BaseModel):
    id: str
    name: str
    image: str

class Testimonial(BaseModel):
    id: int
    name: str
    city: str
    rating: int
    quote: str
    product: str

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

# ---------- Helpers ----------
def strip_id(d):
    if d and "_id" in d:
        d.pop("_id", None)
    return d

# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Saukriti API \u00b7 ready"}

@api_router.get("/products")
async def list_products(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    sort: str = "featured",
    min_price: int = 0,
    max_price: int = 100000,
    q: Optional[str] = None,
    limit: int = Query(60, le=200),
    skip: int = 0,
):
    query = {"price": {"$gte": min_price, "$lte": max_price}}
    if category and category != "all":
        query["category"] = category
    if tag:
        query["tags"] = tag
    if q:
        query["name"] = {"$regex": q, "$options": "i"}

    sort_map = {
        "low": ("price", 1),
        "high": ("price", -1),
        "rating": ("rating", -1),
        "new": ("tags", -1),
        "featured": ("_seq", 1),
    }
    sort_field, sort_dir = sort_map.get(sort, ("_seq", 1))

    total = await db.products.count_documents(query)
    cursor = db.products.find(query).sort(sort_field, sort_dir).skip(skip).limit(limit)
    items = [strip_id(p) async for p in cursor]
    return {"items": items, "total": total}

@api_router.get("/products/{pid}")
async def get_product(pid: str):
    p = await db.products.find_one({"id": pid})
    if not p:
        raise HTTPException(404, "Product not found")
    return strip_id(p)

@api_router.get("/categories")
async def list_categories():
    cursor = db.categories.find({}).sort("_seq", 1)
    return [strip_id(c) async for c in cursor]

@api_router.get("/testimonials")
async def list_testimonials():
    cursor = db.testimonials.find({}).sort("id", 1)
    return [strip_id(t) async for t in cursor]

@api_router.post("/newsletter")
async def subscribe(payload: NewsletterIn):
    existing = await db.subscribers.find_one({"email": payload.email})
    if existing:
        return {"ok": True, "message": "Already subscribed"}
    await db.subscribers.insert_one({
        "id": str(uuid.uuid4()),
        "email": payload.email,
        "created_at": datetime.utcnow(),
    })
    return {"ok": True}

@api_router.post("/orders")
async def create_order(order: OrderIn):
    order_id = str(uuid.uuid4())
    doc = {
        "order_id": order_id,
        "customer": order.customer.model_dump(),
        "items": [i.model_dump() for i in order.items],
        "subtotal": order.subtotal,
        "status": "received",
        "created_at": datetime.utcnow(),
    }
    await db.orders.insert_one(doc)
    return {"order_id": order_id, "status": "received"}

# ---------- Seeding ----------
@app.on_event("startup")
async def seed_db():
    try:
        # Products
        if await db.products.count_documents({}) < len(PRODUCTS_SEED):
            await db.products.delete_many({})
            for i, p in enumerate(PRODUCTS_SEED):
                doc = dict(p); doc["_seq"] = i
                await db.products.insert_one(doc)
            await db.products.create_index("id", unique=True)
            logger.info(f"Seeded {len(PRODUCTS_SEED)} products")
        # Categories
        if await db.categories.count_documents({}) < len(CATEGORIES_SEED):
            await db.categories.delete_many({})
            for i, c in enumerate(CATEGORIES_SEED):
                doc = dict(c); doc["_seq"] = i
                await db.categories.insert_one(doc)
            logger.info(f"Seeded {len(CATEGORIES_SEED)} categories")
        # Testimonials
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
