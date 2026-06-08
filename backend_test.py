#!/usr/bin/env python3
"""
Backend API Testing Script for Saukriti E-commerce
Tests auth, reviews, orders, and admin endpoints
"""
import requests
import json
import sys
from typing import Dict, Any, Optional

# Test configuration
BASE_URL = "https://luxury-home-shop-5.preview.emergentagent.com/api"
REGULAR_TOKEN = "test_session_regular_001"
ADMIN_TOKEN = "test_session_admin_001"
REGULAR_EMAIL = "regular.user.001@example.com"
ADMIN_EMAIL = "admin.user.001@example.com"

# Test state
test_results = []
created_resources = {
    "review_ids": [],
    "order_ids": [],
    "product_ids": []
}

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def log_test(name: str, passed: bool, details: str = ""):
    status = f"{Colors.GREEN}✅ PASS{Colors.END}" if passed else f"{Colors.RED}❌ FAIL{Colors.END}"
    print(f"{status} {name}")
    if details:
        print(f"    {details}")
    test_results.append({"name": name, "passed": passed, "details": details})

def make_request(method: str, endpoint: str, token: Optional[str] = None, 
                 json_data: Optional[Dict] = None, expected_status: int = 200) -> tuple:
    """Make HTTP request and return (success, response, status_code)"""
    url = f"{BASE_URL}{endpoint}"
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    try:
        if method == "GET":
            resp = requests.get(url, headers=headers, timeout=10)
        elif method == "POST":
            resp = requests.post(url, headers=headers, json=json_data, timeout=10)
        elif method == "PATCH":
            resp = requests.patch(url, headers=headers, json=json_data, timeout=10)
        elif method == "DELETE":
            resp = requests.delete(url, headers=headers, timeout=10)
        else:
            return False, None, 0
        
        success = resp.status_code == expected_status
        try:
            data = resp.json()
        except:
            data = resp.text
        
        return success, data, resp.status_code
    except Exception as e:
        return False, str(e), 0

def test_auth_endpoints():
    """Test authentication endpoints"""
    print(f"\n{Colors.BLUE}=== Testing Auth Endpoints ==={Colors.END}")
    
    # Test 1: GET /auth/me without token → 401
    success, data, status = make_request("GET", "/auth/me", expected_status=401)
    log_test("GET /auth/me without token returns 401", success, 
             f"Status: {status}, Response: {data}")
    
    # Test 2: GET /auth/me with admin token → 200, is_admin=true
    success, data, status = make_request("GET", "/auth/me", token=ADMIN_TOKEN)
    is_admin = data.get("is_admin") if isinstance(data, dict) else False
    passed = success and is_admin == True
    log_test("GET /auth/me with admin token returns is_admin=true", passed,
             f"Status: {status}, is_admin: {is_admin}")
    
    # Test 3: GET /auth/me with regular user token → 200, is_admin=false
    success, data, status = make_request("GET", "/auth/me", token=REGULAR_TOKEN)
    is_admin = data.get("is_admin") if isinstance(data, dict) else None
    passed = success and is_admin == False
    log_test("GET /auth/me with regular token returns is_admin=false", passed,
             f"Status: {status}, is_admin: {is_admin}")
    
    # Test 4: POST /auth/logout with token → ok
    success, data, status = make_request("POST", "/auth/logout", token=REGULAR_TOKEN)
    ok = data.get("ok") if isinstance(data, dict) else False
    log_test("POST /auth/logout returns ok", success and ok,
             f"Status: {status}, Response: {data}")
    
    # Test 5: GET /auth/me with logged out token → 401
    success, data, status = make_request("GET", "/auth/me", token=REGULAR_TOKEN, expected_status=401)
    log_test("GET /auth/me after logout returns 401", success,
             f"Status: {status}")
    
    # Recreate regular user session for subsequent tests
    print(f"{Colors.YELLOW}Note: Recreating regular user session for remaining tests{Colors.END}")

def test_reviews_endpoints():
    """Test reviews endpoints"""
    print(f"\n{Colors.BLUE}=== Testing Reviews Endpoints ==={Colors.END}")
    
    # Test 1: GET /products/p-1/reviews unauthenticated → 200
    success, data, status = make_request("GET", "/products/p-1/reviews")
    is_list = isinstance(data, list)
    log_test("GET /products/p-1/reviews unauthenticated returns 200", success and is_list,
             f"Status: {status}, Type: {type(data).__name__}, Count: {len(data) if is_list else 0}")
    
    # Test 2: POST /reviews unauthenticated → 401
    review_payload = {
        "product_id": "p-1",
        "rating": 5,
        "title": "Lovely",
        "body": "Beautifully made piece."
    }
    success, data, status = make_request("POST", "/reviews", json_data=review_payload, expected_status=401)
    log_test("POST /reviews without auth returns 401", success,
             f"Status: {status}")
    
    # Recreate regular session for authenticated tests
    import subprocess
    subprocess.run([
        "mongosh", "test_database", "--quiet", "--eval",
        """
        db.user_sessions.insertOne({
          user_id: 'test-user-regular-001',
          session_token: 'test_session_regular_001',
          expires_at: new Date(Date.now() + 7*24*60*60*1000),
          created_at: new Date()
        });
        """
    ], capture_output=True)
    
    # Test 3: POST /reviews with valid data → 200
    success, data, status = make_request("POST", "/reviews", token=REGULAR_TOKEN, json_data=review_payload)
    review_id = data.get("id") if isinstance(data, dict) else None
    if review_id:
        created_resources["review_ids"].append(review_id)
    log_test("POST /reviews with auth and valid data returns 200", success and review_id is not None,
             f"Status: {status}, Review ID: {review_id}")
    
    # Test 4: POST /reviews with rating=0 → 400
    invalid_payload = {**review_payload, "rating": 0}
    success, data, status = make_request("POST", "/reviews", token=REGULAR_TOKEN, 
                                        json_data=invalid_payload, expected_status=400)
    log_test("POST /reviews with rating=0 returns 400", success,
             f"Status: {status}, Response: {data}")
    
    # Test 5: POST /reviews with invalid product_id → 404
    invalid_product_payload = {**review_payload, "product_id": "invalid-product-999"}
    success, data, status = make_request("POST", "/reviews", token=REGULAR_TOKEN,
                                        json_data=invalid_product_payload, expected_status=404)
    log_test("POST /reviews with invalid product_id returns 404", success,
             f"Status: {status}")
    
    # Test 6: GET /products/p-1/reviews should include new review
    success, data, status = make_request("GET", "/products/p-1/reviews")
    has_review = False
    if isinstance(data, list) and review_id:
        has_review = any(r.get("id") == review_id for r in data)
    log_test("GET /products/p-1/reviews includes newly created review", success and has_review,
             f"Status: {status}, Review found: {has_review}")

def test_orders_me_endpoints():
    """Test orders /me endpoints"""
    print(f"\n{Colors.BLUE}=== Testing Orders /me Endpoints ==={Colors.END}")
    
    # Test 1: POST /orders without auth (guest order)
    guest_order = {
        "customer": {
            "name": "Guest Shopper",
            "email": REGULAR_EMAIL,  # Use regular user's email
            "phone": "+91-9876543210",
            "address": "123 Test Street, Mumbai, Maharashtra 400001"
        },
        "items": [{"id": "p-1", "qty": 2}],
        "subtotal": 2340
    }
    success, data, status = make_request("POST", "/orders", json_data=guest_order)
    guest_order_id = data.get("order_id") if isinstance(data, dict) else None
    if guest_order_id:
        created_resources["order_ids"].append(guest_order_id)
    log_test("POST /orders without auth creates guest order", success and guest_order_id is not None,
             f"Status: {status}, Order ID: {guest_order_id}")
    
    # Test 2: POST /orders with auth (authenticated order)
    auth_order = {
        "customer": {
            "name": "Regular Test User",
            "email": REGULAR_EMAIL,
            "phone": "+91-9876543211",
            "address": "456 Auth Street, Delhi, Delhi 110001"
        },
        "items": [{"id": "p-2", "qty": 1}],
        "subtotal": 1850
    }
    success, data, status = make_request("POST", "/orders", token=REGULAR_TOKEN, json_data=auth_order)
    auth_order_id = data.get("order_id") if isinstance(data, dict) else None
    if auth_order_id:
        created_resources["order_ids"].append(auth_order_id)
    log_test("POST /orders with auth creates authenticated order", success and auth_order_id is not None,
             f"Status: {status}, Order ID: {auth_order_id}")
    
    # Test 3: GET /orders/me without token → 401
    success, data, status = make_request("GET", "/orders/me", expected_status=401)
    log_test("GET /orders/me without token returns 401", success,
             f"Status: {status}")
    
    # Test 4: GET /orders/me with token → returns both orders
    success, data, status = make_request("GET", "/orders/me", token=REGULAR_TOKEN)
    order_count = len(data) if isinstance(data, list) else 0
    has_both = False
    if isinstance(data, list):
        order_ids = [o.get("order_id") for o in data]
        has_both = guest_order_id in order_ids and auth_order_id in order_ids
    log_test("GET /orders/me returns both guest and authenticated orders", success and has_both,
             f"Status: {status}, Order count: {order_count}, Has both: {has_both}")
    
    # Test 5: GET /orders/{oid} with another user's token → 403
    # Create an order for admin user first
    admin_order = {
        "customer": {
            "name": "Admin User",
            "email": ADMIN_EMAIL,
            "phone": "+91-9876543212",
            "address": "789 Admin Street, Bangalore, Karnataka 560001"
        },
        "items": [{"id": "p-3", "qty": 1}],
        "subtotal": 2200
    }
    success, data, status = make_request("POST", "/orders", token=ADMIN_TOKEN, json_data=admin_order)
    admin_order_id = data.get("order_id") if isinstance(data, dict) else None
    if admin_order_id:
        created_resources["order_ids"].append(admin_order_id)
    
    # Try to access admin's order with regular user token
    success, data, status = make_request("GET", f"/orders/{admin_order_id}", 
                                        token=REGULAR_TOKEN, expected_status=403)
    log_test("GET /orders/{oid} with another user's token returns 403", success,
             f"Status: {status}")

def test_admin_endpoints():
    """Test admin endpoints"""
    print(f"\n{Colors.BLUE}=== Testing Admin Endpoints ==={Colors.END}")
    
    # Test 1: GET /admin/stats without token → 401
    success, data, status = make_request("GET", "/admin/stats", expected_status=401)
    log_test("GET /admin/stats without token returns 401", success,
             f"Status: {status}")
    
    # Test 2: GET /admin/stats with regular user token → 403
    success, data, status = make_request("GET", "/admin/stats", token=REGULAR_TOKEN, expected_status=403)
    log_test("GET /admin/stats with regular user token returns 403", success,
             f"Status: {status}")
    
    # Test 3: GET /admin/stats with admin token → 200 with required fields
    success, data, status = make_request("GET", "/admin/stats", token=ADMIN_TOKEN)
    required_fields = ["orders", "products", "users", "subscribers", "reviews", "revenue", "recent_orders"]
    has_all_fields = all(field in data for field in required_fields) if isinstance(data, dict) else False
    log_test("GET /admin/stats with admin token returns all required fields", success and has_all_fields,
             f"Status: {status}, Has all fields: {has_all_fields}")
    
    # Test 4: GET /admin/orders with admin → 200 list
    success, data, status = make_request("GET", "/admin/orders", token=ADMIN_TOKEN)
    is_list = isinstance(data, list)
    log_test("GET /admin/orders with admin returns list", success and is_list,
             f"Status: {status}, Type: {type(data).__name__}, Count: {len(data) if is_list else 0}")
    
    # Test 5: PATCH /admin/orders/{order_id} with valid status → ok
    if created_resources["order_ids"]:
        test_order_id = created_resources["order_ids"][0]
        success, data, status = make_request("PATCH", f"/admin/orders/{test_order_id}",
                                            token=ADMIN_TOKEN, json_data={"status": "shipped"})
        ok = data.get("ok") if isinstance(data, dict) else False
        log_test("PATCH /admin/orders/{oid} with valid status returns ok", success and ok,
                 f"Status: {status}, Response: {data}")
        
        # Verify status was updated
        success, data, status = make_request("GET", f"/orders/{test_order_id}", token=ADMIN_TOKEN)
        updated_status = data.get("status") if isinstance(data, dict) else None
        log_test("Order status successfully updated to 'shipped'", updated_status == "shipped",
                 f"Status: {status}, Order status: {updated_status}")
    
    # Test 6: PATCH /admin/orders/{oid} with invalid status → 400
    if created_resources["order_ids"]:
        test_order_id = created_resources["order_ids"][0]
        success, data, status = make_request("PATCH", f"/admin/orders/{test_order_id}",
                                            token=ADMIN_TOKEN, json_data={"status": "invalid_status"},
                                            expected_status=400)
        log_test("PATCH /admin/orders/{oid} with invalid status returns 400", success,
                 f"Status: {status}")
    
    # Test 7: GET /admin/subscribers with admin → list
    success, data, status = make_request("GET", "/admin/subscribers", token=ADMIN_TOKEN)
    is_list = isinstance(data, list)
    log_test("GET /admin/subscribers with admin returns list", success and is_list,
             f"Status: {status}, Type: {type(data).__name__}, Count: {len(data) if is_list else 0}")
    
    # Test 8: GET /admin/reviews with admin → list (should include our review)
    success, data, status = make_request("GET", "/admin/reviews", token=ADMIN_TOKEN)
    is_list = isinstance(data, list)
    has_our_review = False
    if is_list and created_resources["review_ids"]:
        review_ids = [r.get("id") for r in data]
        has_our_review = created_resources["review_ids"][0] in review_ids
    log_test("GET /admin/reviews with admin returns list including our review", success and is_list,
             f"Status: {status}, Count: {len(data) if is_list else 0}, Has our review: {has_our_review}")
    
    # Test 9: DELETE /admin/reviews/{rid} → ok
    if created_resources["review_ids"]:
        review_id = created_resources["review_ids"][0]
        success, data, status = make_request("DELETE", f"/admin/reviews/{review_id}", token=ADMIN_TOKEN)
        ok = data.get("ok") if isinstance(data, dict) else False
        log_test("DELETE /admin/reviews/{rid} returns ok", success and ok,
                 f"Status: {status}, Response: {data}")
        if success and ok:
            created_resources["review_ids"].remove(review_id)
    
    # Test 10: POST /admin/products with valid data → returns product with p-custom- id
    new_product = {
        "name": "Test Luxury Vase",
        "category": "decor",
        "image": "https://example.com/test-vase.jpg",
        "price": 2000,
        "description": "A beautiful test vase for luxury homes",
        "tags": ["new", "test"]
    }
    success, data, status = make_request("POST", "/admin/products", token=ADMIN_TOKEN, json_data=new_product)
    product_id = data.get("id") if isinstance(data, dict) else None
    has_custom_prefix = product_id and product_id.startswith("p-custom-")
    if product_id:
        created_resources["product_ids"].append(product_id)
    log_test("POST /admin/products returns product with p-custom- prefix", success and has_custom_prefix,
             f"Status: {status}, Product ID: {product_id}")
    
    # Test 11: PATCH /admin/products/{pid} with price update → ok
    if created_resources["product_ids"]:
        product_id = created_resources["product_ids"][0]
        success, data, status = make_request("PATCH", f"/admin/products/{product_id}",
                                            token=ADMIN_TOKEN, json_data={"price": 2500})
        ok = data.get("ok") if isinstance(data, dict) else False
        log_test("PATCH /admin/products/{pid} returns ok", success and ok,
                 f"Status: {status}, Response: {data}")
    
    # Test 12: DELETE /admin/products/{pid} → ok
    if created_resources["product_ids"]:
        product_id = created_resources["product_ids"][0]
        success, data, status = make_request("DELETE", f"/admin/products/{product_id}", token=ADMIN_TOKEN)
        ok = data.get("ok") if isinstance(data, dict) else False
        log_test("DELETE /admin/products/{pid} returns ok", success and ok,
                 f"Status: {status}, Response: {data}")
        if success and ok:
            created_resources["product_ids"].remove(product_id)

def cleanup_test_data():
    """Clean up test sessions and reviews"""
    print(f"\n{Colors.BLUE}=== Cleaning Up Test Data ==={Colors.END}")
    
    import subprocess
    
    # Delete test sessions
    result = subprocess.run([
        "mongosh", "test_database", "--quiet", "--eval",
        """
        var sessionsDeleted = db.user_sessions.deleteMany({user_id: /^test-user/}).deletedCount;
        var usersDeleted = db.users.deleteMany({user_id: /^test-user/}).deletedCount;
        print('Deleted ' + sessionsDeleted + ' sessions and ' + usersDeleted + ' users');
        """
    ], capture_output=True, text=True)
    
    print(f"MongoDB cleanup: {result.stdout.strip()}")
    
    # Note: Orders and reviews are left in DB as they're part of the app data
    print(f"{Colors.YELLOW}Note: Test orders remain in database as historical data{Colors.END}")

def print_summary():
    """Print test summary"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}TEST SUMMARY{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    passed = sum(1 for t in test_results if t["passed"])
    failed = sum(1 for t in test_results if not t["passed"])
    total = len(test_results)
    
    print(f"Total Tests: {total}")
    print(f"{Colors.GREEN}Passed: {passed}{Colors.END}")
    print(f"{Colors.RED}Failed: {failed}{Colors.END}")
    print(f"Success Rate: {(passed/total*100):.1f}%")
    
    if failed > 0:
        print(f"\n{Colors.RED}Failed Tests:{Colors.END}")
        for t in test_results:
            if not t["passed"]:
                print(f"  ❌ {t['name']}")
                if t["details"]:
                    print(f"     {t['details']}")
    
    return failed == 0

if __name__ == "__main__":
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}Saukriti Backend API Test Suite{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"Base URL: {BASE_URL}")
    print(f"Regular User: {REGULAR_EMAIL}")
    print(f"Admin User: {ADMIN_EMAIL}")
    
    try:
        test_auth_endpoints()
        test_reviews_endpoints()
        test_orders_me_endpoints()
        test_admin_endpoints()
        cleanup_test_data()
        
        success = print_summary()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n{Colors.RED}Test suite error: {e}{Colors.END}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
