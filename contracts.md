# Saukriti  Backend Integration Contracts

## Mocked  Real
The following data, currently in `/app/frontend/src/mock.js`, will be fetched from the backend instead:
- `PRODUCTS`, `FEATURED_PRODUCTS`, `NEW_ARRIVALS`, `BEST_SELLERS`  GET /api/products (with filters/tags)
- `CATEGORIES`  GET /api/categories
- `TESTIMONIALS`  GET /api/testimonials
- Newsletter form submit  POST /api/newsletter
- Quick-view / cart drawer / wishlist remain **client-side** (localStorage) for MVP.
- Checkout submit  POST /api/orders (saves order, returns order id; no payment processing).

Static UI data that stays in mock.js (not worth API for MVP): `TOP_BAR_MESSAGES`, `NAV_LINKS`, `NAV_RIGHT`, `SUBNAV`, `HERO_SLIDES`, `PROMO_BANNERS`, `WHY_CHOOSE`, `INSTA_FEED`, `FOOTER_LINKS`.

## API Contracts

Base: `${REACT_APP_BACKEND_URL}/api`

### GET /api/products
Query params: `category` (string, optional), `tag` (string, optional), `sort` (featured|new|low|high|rating), `min_price`, `max_price`, `q` (search), `limit`, `skip`.
Response:
```json
{ "items": [Product...], "total": 128 }
```

### GET /api/products/{id}
Response: `Product`

### GET /api/categories
Response: `[{ id, name, image }]`

### GET /api/testimonials
Response: `[{ id, name, city, rating, quote, product }]`

### POST /api/newsletter
Body: `{ "email": "user@example.com" }`
Response: `{ "ok": true }`

### POST /api/orders
Body:
```json
{
  "customer": { "name": "...", "email": "...", "phone": "...", "address": "..." },
  "items": [{ "id": "p-1", "qty": 2 }],
  "subtotal": 4380
}
```
Response: `{ "order_id": "uuid", "status": "received" }`

## Mongo Collections
- `products`  seeded from mock.js (idempotent on startup)
- `categories`
- `testimonials`
- `subscribers`
- `orders`

## Frontend Integration Plan
1. Create `/app/frontend/src/api/client.js`  axios instance with base URL `${REACT_APP_BACKEND_URL}/api`.
2. Replace direct imports of `PRODUCTS`/`CATEGORIES`/`TESTIMONIALS`/`FEATURED_PRODUCTS`/`NEW_ARRIVALS`/`BEST_SELLERS` with hooks/effects calling the backend.
3. `Newsletter`: POST email, toast success.
4. Keep cart/wishlist in localStorage; simply call POST /orders on checkout (deferred  cart drawer link points to `/checkout` placeholder).
5. Static arrays still imported from `mock.js`.

## Product Schema
```json
{
  "id": "p-1", "name": "...", "category": "decor", "image": "https://...",
  "price": 1170, "compareAtPrice": 1500, "rating": 4.6, "reviews": 124,
  "tags": ["new","sale"], "colors": ["#D4A574"], "sizes": ["S","M","L"],
  "description": "..."
}
```
