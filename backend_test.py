#!/usr/bin/env python3
"""
Backend API Test Suite for Saukriti E-commerce
Tests all backend endpoints with various scenarios
"""
import requests
import json
from typing import Dict, Any

# Read backend URL from frontend/.env
def get_backend_url():
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.split('=', 1)[1].strip()
    raise ValueError("REACT_APP_BACKEND_URL not found in /app/frontend/.env")

BASE_URL = get_backend_url() + "/api"
print(f"Testing backend at: {BASE_URL}\n")

# Test results tracking
test_results = {
    "passed": 0,
    "failed": 0,
    "errors": []
}

def test_endpoint(name: str, method: str, url: str, expected_status: int = 200, 
                  json_data: Dict = None, params: Dict = None, 
                  validate_fn=None) -> Any:
    """Generic test function for API endpoints"""
    try:
        print(f"Testing: {name}")
        if method == "GET":
            response = requests.get(url, params=params, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=json_data, timeout=10)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        print(f"  Status: {response.status_code} (expected {expected_status})")
        
        if response.status_code != expected_status:
            error_msg = f"❌ {name}: Expected status {expected_status}, got {response.status_code}"
            print(f"  {error_msg}")
            print(f"  Response: {response.text[:200]}")
            test_results["failed"] += 1
            test_results["errors"].append({
                "test": name,
                "error": error_msg,
                "status": response.status_code,
                "response": response.text[:500]
            })
            return None
        
        # Try to parse JSON
        try:
            data = response.json()
        except:
            error_msg = f"❌ {name}: Response is not valid JSON"
            print(f"  {error_msg}")
            test_results["failed"] += 1
            test_results["errors"].append({
                "test": name,
                "error": error_msg,
                "response": response.text[:500]
            })
            return None
        
        # Run custom validation if provided
        if validate_fn:
            validation_result = validate_fn(data)
            if validation_result is not True:
                error_msg = f"❌ {name}: Validation failed - {validation_result}"
                print(f"  {error_msg}")
                test_results["failed"] += 1
                test_results["errors"].append({
                    "test": name,
                    "error": error_msg,
                    "data": str(data)[:500]
                })
                return None
        
        print(f"  ✅ PASSED")
        test_results["passed"] += 1
        return data
        
    except Exception as e:
        error_msg = f"❌ {name}: Exception - {str(e)}"
        print(f"  {error_msg}")
        test_results["failed"] += 1
        test_results["errors"].append({
            "test": name,
            "error": error_msg,
            "exception": str(e)
        })
        return None

print("="*80)
print("BACKEND API TEST SUITE")
print("="*80)

# Test 1: Health check
print("\n--- Test 1: Health Check ---")
test_endpoint(
    "GET /api/ health check",
    "GET",
    f"{BASE_URL}/",
    validate_fn=lambda d: True if "message" in d else "Missing 'message' field"
)

# Test 2: GET /api/products - no params
print("\n--- Test 2: GET /api/products (no params) ---")
products_data = test_endpoint(
    "GET /api/products (no params)",
    "GET",
    f"{BASE_URL}/products",
    validate_fn=lambda d: (
        True if "items" in d and "total" in d and isinstance(d["items"], list)
        else "Missing 'items' or 'total' field or items is not a list"
    )
)
if products_data:
    print(f"  Total products: {products_data.get('total')}")
    print(f"  Items returned: {len(products_data.get('items', []))}")
    if products_data.get('total', 0) < 100:
        print(f"  ⚠️  Warning: Expected ~128 products, got {products_data.get('total')}")

# Test 3: GET /api/products?category=decor
print("\n--- Test 3: GET /api/products?category=decor ---")
decor_data = test_endpoint(
    "GET /api/products?category=decor",
    "GET",
    f"{BASE_URL}/products",
    params={"category": "decor"},
    validate_fn=lambda d: (
        True if all(item.get("category") == "decor" for item in d.get("items", []))
        else "Not all items have category='decor'"
    )
)
if decor_data:
    print(f"  Decor products: {len(decor_data.get('items', []))}")

# Test 4: GET /api/products?tag=new
print("\n--- Test 4: GET /api/products?tag=new ---")
new_data = test_endpoint(
    "GET /api/products?tag=new",
    "GET",
    f"{BASE_URL}/products",
    params={"tag": "new"},
    validate_fn=lambda d: (
        True if all("new" in item.get("tags", []) for item in d.get("items", []))
        else "Not all items have 'new' tag"
    )
)
if new_data:
    print(f"  New products: {len(new_data.get('items', []))}")

# Test 5: GET /api/products?sort=low
print("\n--- Test 5: GET /api/products?sort=low ---")
low_data = test_endpoint(
    "GET /api/products?sort=low",
    "GET",
    f"{BASE_URL}/products",
    params={"sort": "low", "limit": 10}
)
if low_data and low_data.get("items"):
    prices = [item.get("price") for item in low_data["items"]]
    is_sorted = all(prices[i] <= prices[i+1] for i in range(len(prices)-1))
    if is_sorted:
        print(f"  ✅ Prices sorted ascending: {prices[:5]}")
    else:
        print(f"  ❌ Prices NOT sorted ascending: {prices}")
        test_results["errors"].append({
            "test": "GET /api/products?sort=low",
            "error": "Prices not sorted in ascending order",
            "prices": prices
        })

# Test 6: GET /api/products?sort=high
print("\n--- Test 6: GET /api/products?sort=high ---")
high_data = test_endpoint(
    "GET /api/products?sort=high",
    "GET",
    f"{BASE_URL}/products",
    params={"sort": "high", "limit": 10}
)
if high_data and high_data.get("items"):
    prices = [item.get("price") for item in high_data["items"]]
    is_sorted = all(prices[i] >= prices[i+1] for i in range(len(prices)-1))
    if is_sorted:
        print(f"  ✅ Prices sorted descending: {prices[:5]}")
    else:
        print(f"  ❌ Prices NOT sorted descending: {prices}")
        test_results["errors"].append({
            "test": "GET /api/products?sort=high",
            "error": "Prices not sorted in descending order",
            "prices": prices
        })

# Test 7: GET /api/products?sort=rating
print("\n--- Test 7: GET /api/products?sort=rating ---")
rating_data = test_endpoint(
    "GET /api/products?sort=rating",
    "GET",
    f"{BASE_URL}/products",
    params={"sort": "rating", "limit": 10}
)
if rating_data and rating_data.get("items"):
    ratings = [item.get("rating") for item in rating_data["items"]]
    is_sorted = all(ratings[i] >= ratings[i+1] for i in range(len(ratings)-1))
    if is_sorted:
        print(f"  ✅ Ratings sorted descending: {ratings[:5]}")
    else:
        print(f"  ❌ Ratings NOT sorted descending: {ratings}")
        test_results["errors"].append({
            "test": "GET /api/products?sort=rating",
            "error": "Ratings not sorted in descending order",
            "ratings": ratings
        })

# Test 8: GET /api/products?min_price=1000&max_price=3000
print("\n--- Test 8: GET /api/products?min_price=1000&max_price=3000 ---")
price_range_data = test_endpoint(
    "GET /api/products?min_price=1000&max_price=3000",
    "GET",
    f"{BASE_URL}/products",
    params={"min_price": 1000, "max_price": 3000},
    validate_fn=lambda d: (
        True if all(1000 <= item.get("price", 0) <= 3000 for item in d.get("items", []))
        else "Not all items are within price range 1000-3000"
    )
)
if price_range_data:
    print(f"  Products in range: {len(price_range_data.get('items', []))}")

# Test 9: GET /api/products?q=vase
print("\n--- Test 9: GET /api/products?q=vase ---")
search_data = test_endpoint(
    "GET /api/products?q=vase",
    "GET",
    f"{BASE_URL}/products",
    params={"q": "vase"},
    validate_fn=lambda d: (
        True if all("vase" in item.get("name", "").lower() for item in d.get("items", []))
        else "Not all items contain 'vase' in name"
    )
)
if search_data:
    print(f"  Products matching 'vase': {len(search_data.get('items', []))}")
    if search_data.get("items"):
        print(f"  Sample: {search_data['items'][0].get('name')}")

# Test 10: GET /api/products?limit=5&skip=10
print("\n--- Test 10: GET /api/products?limit=5&skip=10 ---")
pagination_data = test_endpoint(
    "GET /api/products?limit=5&skip=10",
    "GET",
    f"{BASE_URL}/products",
    params={"limit": 5, "skip": 10},
    validate_fn=lambda d: (
        True if len(d.get("items", [])) <= 5
        else f"Expected max 5 items, got {len(d.get('items', []))}"
    )
)
if pagination_data:
    print(f"  Items returned: {len(pagination_data.get('items', []))}")

# Test 11: GET /api/products/{id} - valid product
print("\n--- Test 11: GET /api/products/p-1 (valid) ---")
product_detail = test_endpoint(
    "GET /api/products/p-1",
    "GET",
    f"{BASE_URL}/products/p-1",
    validate_fn=lambda d: (
        True if d.get("id") == "p-1" and "name" in d and "price" in d
        else "Missing required fields or wrong id"
    )
)
if product_detail:
    print(f"  Product: {product_detail.get('name')}")
    print(f"  Price: {product_detail.get('price')}")

# Test 12: GET /api/products/{id} - invalid product
print("\n--- Test 12: GET /api/products/doesnotexist (invalid) ---")
test_endpoint(
    "GET /api/products/doesnotexist",
    "GET",
    f"{BASE_URL}/products/doesnotexist",
    expected_status=404
)

# Test 13: GET /api/categories
print("\n--- Test 13: GET /api/categories ---")
categories_data = test_endpoint(
    "GET /api/categories",
    "GET",
    f"{BASE_URL}/categories",
    validate_fn=lambda d: (
        True if isinstance(d, list) and len(d) >= 8
        else f"Expected list with 8 categories, got {type(d)} with {len(d) if isinstance(d, list) else 0} items"
    )
)
if categories_data:
    print(f"  Categories count: {len(categories_data)}")
    # Check schema
    if categories_data and len(categories_data) > 0:
        cat = categories_data[0]
        has_required = "id" in cat and "name" in cat and "image" in cat
        if has_required:
            print(f"  ✅ Schema valid (id, name, image)")
        else:
            print(f"  ❌ Schema invalid: {cat.keys()}")
            test_results["errors"].append({
                "test": "GET /api/categories schema",
                "error": "Missing required fields",
                "sample": cat
            })

# Test 14: GET /api/testimonials
print("\n--- Test 14: GET /api/testimonials ---")
testimonials_data = test_endpoint(
    "GET /api/testimonials",
    "GET",
    f"{BASE_URL}/testimonials",
    validate_fn=lambda d: (
        True if isinstance(d, list) and len(d) >= 5
        else f"Expected list with 5 testimonials, got {type(d)} with {len(d) if isinstance(d, list) else 0} items"
    )
)
if testimonials_data:
    print(f"  Testimonials count: {len(testimonials_data)}")
    # Check schema
    if testimonials_data and len(testimonials_data) > 0:
        test = testimonials_data[0]
        required_fields = ["id", "name", "city", "rating", "quote", "product"]
        has_all = all(field in test for field in required_fields)
        if has_all:
            print(f"  ✅ Schema valid (id, name, city, rating, quote, product)")
        else:
            print(f"  ❌ Schema invalid: {test.keys()}")
            test_results["errors"].append({
                "test": "GET /api/testimonials schema",
                "error": "Missing required fields",
                "sample": test
            })

# Test 15: POST /api/newsletter - valid email
print("\n--- Test 15: POST /api/newsletter (valid email) ---")
newsletter_data = test_endpoint(
    "POST /api/newsletter",
    "POST",
    f"{BASE_URL}/newsletter",
    json_data={"email": "test_user_1@example.com"},
    validate_fn=lambda d: (
        True if d.get("ok") is True
        else "Expected {ok: true}"
    )
)

# Test 16: POST /api/newsletter - duplicate email (idempotent)
print("\n--- Test 16: POST /api/newsletter (duplicate email) ---")
newsletter_dup = test_endpoint(
    "POST /api/newsletter (duplicate)",
    "POST",
    f"{BASE_URL}/newsletter",
    json_data={"email": "test_user_1@example.com"},
    validate_fn=lambda d: (
        True if d.get("ok") is True
        else "Expected {ok: true} for duplicate"
    )
)

# Test 17: POST /api/newsletter - invalid email
print("\n--- Test 17: POST /api/newsletter (invalid email) ---")
test_endpoint(
    "POST /api/newsletter (invalid email)",
    "POST",
    f"{BASE_URL}/newsletter",
    json_data={"email": "not-an-email"},
    expected_status=422  # FastAPI validation error
)

# Test 18: POST /api/orders - create order
print("\n--- Test 18: POST /api/orders (create order) ---")
order_payload = {
    "customer": {
        "name": "Priya Sharma",
        "email": "priya.sharma@example.com",
        "phone": "9876543210",
        "address": "42, Rose Lane, Mumbai 400001"
    },
    "items": [
        {"id": "p-1", "qty": 2},
        {"id": "p-2", "qty": 1}
    ],
    "subtotal": 4500
}
order_data = test_endpoint(
    "POST /api/orders",
    "POST",
    f"{BASE_URL}/orders",
    json_data=order_payload,
    validate_fn=lambda d: (
        True if "order_id" in d and d.get("status") == "received" and isinstance(d.get("order_id"), str)
        else f"Missing order_id or status != 'received'. Got: {d}"
    )
)
if order_data:
    print(f"  Order ID: {order_data.get('order_id')}")
    print(f"  Status: {order_data.get('status')}")

# Summary
print("\n" + "="*80)
print("TEST SUMMARY")
print("="*80)
print(f"✅ Passed: {test_results['passed']}")
print(f"❌ Failed: {test_results['failed']}")
print(f"Total: {test_results['passed'] + test_results['failed']}")

if test_results['errors']:
    print("\n" + "="*80)
    print("FAILED TESTS DETAILS")
    print("="*80)
    for i, error in enumerate(test_results['errors'], 1):
        print(f"\n{i}. {error.get('test', 'Unknown test')}")
        print(f"   Error: {error.get('error', 'Unknown error')}")
        if 'status' in error:
            print(f"   Status: {error['status']}")
        if 'response' in error:
            print(f"   Response: {error['response'][:200]}")
        if 'exception' in error:
            print(f"   Exception: {error['exception']}")

print("\n" + "="*80)
if test_results['failed'] == 0:
    print("🎉 ALL TESTS PASSED!")
else:
    print(f"⚠️  {test_results['failed']} TEST(S) FAILED")
print("="*80)
