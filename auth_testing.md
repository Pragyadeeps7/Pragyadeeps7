# Auth-Gated App Testing Playbook (Saukriti)

## Step 1: Create Test User & Session via mongosh
```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  is_admin: true,
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Backend API tests
- GET /api/auth/me with Bearer token
- GET /api/orders/me with Bearer token
- GET /api/admin/orders (admin only)
- POST /api/reviews with auth

## Step 3: Browser test
Set `session_token` cookie before visiting.

## Notes
- First user to sign in becomes admin (is_admin=true on creation)
- Auth-gated pages: /account, /admin/*
- Public pages still work without auth
