# Backend Integration Guide

## Architecture Overview

The EGWallet application uses a **separated frontend and backend architecture**:

- **Next.js Frontend** (This repository) - Deployed on Netlify
  - Landing page
  - User interface components
  - Website-only features (AI chat, exchange rates)
  
- **Express Backend** (Deployed on Render) - Single source of truth
  - User authentication
  - Wallet management
  - Transaction processing
  - Database operations (MongoDB)

## Why This Architecture?

This ensures **ONE unified backend** serves both:
- Web application (Next.js)
- Mobile applications (Android/iOS)

Users have **ONE account** that works across all platforms without any migration or synchronization issues.

## API Integration

### Frontend → Backend Communication

The Next.js frontend calls the Express backend for all user-related operations:

```typescript
// Auth operations
POST /auth/register  // Sign up
POST /auth/login     // Sign in

// User operations
GET  /me             // Get current user profile
GET  /wallets        // Get user wallets

// Transaction operations
POST /transfer       // Send money
GET  /transactions   // Get transaction history
```

### Website-Only APIs (Next.js)

These remain in Next.js because they're specific to the website:

```typescript
POST /api/chat            // AI chat support (uses OpenAI/similar)
GET  /api/exchange-rates  // Currency exchange rates (uses frankfurter.app)
```

## Configuration

### Environment Variables

Create `.env.local` in the Next.js project root:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

**Important**: 
- Use `NEXT_PUBLIC_` prefix for client-side access
- Never commit `.env.local` (already in `.gitignore`)
- For production, set this in Netlify environment variables

### Netlify Deployment

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add:
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://your-backend.onrender.com
   ```
3. Redeploy the site

## Express Backend Requirements

Your Express backend must implement these endpoints:

### 1. Authentication Endpoints

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "phone": "+1234567890",
  "signup_source": "web"  // or "android" or "ios"
}
```

**Response (Success - 201):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "phone": "+1234567890",
    "name": "John Doe",
    "email_verified": false,
    "phone_verified": false,
    "kyc_status": "pending",
    "signup_source": "web",
    "balance": {
      "USD": 0,
      "EUR": 0,
      "CNY": 0,
      "NGN": 0,
      "XAF": 0,
      "XOF": 0,
      "GHS": 0,
      "ZAR": 0
    },
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-here",
  "message": "Account created successfully"
}
```

**Response (Error - 409 if email/phone exists):**
```json
{
  "error": "Email already in use"
}
```

#### POST /auth/login
Authenticate a user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (Success - 200):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "phone": "+1234567890",
    "name": "John Doe",
    "email_verified": true,
    "phone_verified": true,
    "kyc_status": "approved",
    "signup_source": "web",
    "balance": {
      "USD": 5230.50,
      "EUR": 4810.20,
      "CNY": 15420.00,
      "NGN": 3200000.00,
      "XAF": 2500000.00,
      "XOF": 1800000.00,
      "GHS": 48000.00,
      "ZAR": 92000.00
    },
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-here",
  "message": "Sign in successful"
}
```

**Response (Error - 401 if invalid):**
```json
{
  "error": "Invalid credentials"
}
```

### 2. User Endpoints (Protected)

All these endpoints require JWT authentication:
```
Authorization: Bearer <token>
```

#### GET /me
Get current user profile.

**Response (200):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    // ... full user object
  }
}
```

#### GET /wallets
Get user's wallets across all currencies.

**Response (200):**
```json
{
  "wallets": [
    {
      "currency": "USD",
      "balance": 5230.50
    },
    {
      "currency": "EUR",
      "balance": 4810.20
    }
    // ... other currencies
  ]
}
```

### 3. Transaction Endpoints (Protected)

#### POST /transfer
Send money to another user.

**Request:**
```json
{
  "recipientId": "recipient-uuid",
  "amount": 100.00,
  "currency": "USD"
}
```

**Response (Success - 200):**
```json
{
  "transaction": {
    "id": "transaction-uuid",
    "user_id": "sender-uuid",
    "type": "send",
    "amount": 100.00,
    "currency": "USD",
    "from": "sender-uuid",
    "to": "recipient-uuid",
    "status": "pending",  // Web Beta: requires admin approval
    "source": "web",
    "created_at": "2024-01-01T00:00:00.000Z",
    "approved_at": null,
    "completed_at": null
  },
  "message": "Transfer request submitted. Pending admin approval."
}
```

**Response (Error - 403 if KYC not approved):**
```json
{
  "error": "KYC verification required before you can send money"
}
```

**Response (Error - 400 if insufficient balance):**
```json
{
  "error": "Insufficient balance"
}
```

#### GET /transactions
Get user's transaction history.

**Response (200):**
```json
{
  "transactions": [
    {
      "id": "transaction-uuid",
      "user_id": "user-uuid",
      "type": "send",
      "amount": 100.00,
      "currency": "USD",
      "from": "sender-uuid",
      "to": "recipient-uuid",
      "status": "completed",
      "source": "web",
      "created_at": "2024-01-01T00:00:00.000Z",
      "approved_at": "2024-01-01T00:05:00.000Z",
      "completed_at": "2024-01-01T00:10:00.000Z"
    }
    // ... more transactions
  ]
}
```

## Database Schema

### MongoDB Collections

#### users
```javascript
{
  _id: ObjectId,
  id: String (UUID),  // Used as user_id in frontend
  email: String (unique),
  phone: String (unique),
  password_hash: String,
  name: String,
  email_verified: Boolean,
  phone_verified: Boolean,
  kyc_status: String ("pending" | "approved" | "rejected"),
  signup_source: String ("web" | "android" | "ios"),
  created_at: Date
}
```

#### wallets
```javascript
{
  _id: ObjectId,
  wallet_id: String (UUID),
  user_id: String (UUID),  // Foreign key to users.id
  currency: String,
  balance: Number,
  created_at: Date,
  updated_at: Date
}
```

#### transactions
```javascript
{
  _id: ObjectId,
  id: String (UUID),  // transaction_id
  user_id: String (UUID),
  type: String ("send" | "receive"),
  amount: Number,
  currency: String,
  from: String (UUID),  // sender user_id
  to: String (UUID),    // recipient user_id
  status: String ("pending" | "approved" | "completed" | "rejected"),
  source: String ("web" | "android" | "ios"),
  created_at: Date,
  approved_at: Date (nullable),
  completed_at: Date (nullable),
  rejected_at: Date (nullable),
  rejection_reason: String (nullable)
}
```

## Security Requirements

### Password Hashing
```javascript
const bcrypt = require('bcrypt');
const saltRounds = 12;

// On registration
const password_hash = await bcrypt.hash(password, saltRounds);

// On login
const isValid = await bcrypt.compare(password, user.password_hash);
```

### JWT Tokens
```javascript
const jwt = require('jsonwebtoken');

// Generate token
const token = jwt.sign(
  { 
    userId: user.id,
    email: user.email 
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Verify token (middleware)
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};
```

### CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-netlify-site.netlify.app',
    'http://localhost:3001'  // for development
  ],
  credentials: true
}));
```

## Testing the Integration

### 1. Test Backend Separately
```bash
# Start Express backend
npm start

# Test endpoints
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test","phone":"+1234567890","signup_source":"web"}'
```

### 2. Test Frontend Integration
```bash
# Set environment variable
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local

# Start Next.js
npm run dev

# Open browser to http://localhost:3001
# Try to sign up/sign in
```

### 3. Check Network Tab
- Open browser DevTools → Network tab
- Try signing in
- You should see requests to your backend URL
- Check request/response payloads

## Deployment Checklist

### Express Backend (Render)
- [x] Deploy Express app to Render
- [x] Set environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `REDIS_URL`
  - `PORT`
- [x] Test all endpoints
- [x] Note the deployed URL (e.g., `https://your-backend.onrender.com`)

### Next.js Frontend (Netlify)
- [x] Push code to GitHub
- [x] Connect repository to Netlify
- [x] Set environment variable:
  - `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
- [x] Deploy
- [x] Test sign up/sign in flow

## Troubleshooting

### CORS Errors
**Problem:** Browser shows CORS error when calling backend.

**Solution:** 
1. Add Netlify URL to CORS whitelist in Express
2. Ensure preflight OPTIONS requests are handled
3. Check that credentials are enabled

### 401 Unauthorized
**Problem:** All API calls return 401.

**Solution:**
1. Check JWT token is being sent in Authorization header
2. Verify JWT_SECRET matches between token generation and verification
3. Check token hasn't expired

### Environment Variable Not Working
**Problem:** `process.env.NEXT_PUBLIC_API_URL` is undefined.

**Solution:**
1. Ensure variable starts with `NEXT_PUBLIC_`
2. Restart Next.js dev server after changing .env files
3. For production, set in Netlify dashboard

### Backend Returns 500
**Problem:** Backend crashes or returns 500 error.

**Solution:**
1. Check backend logs on Render
2. Verify MongoDB connection string is correct
3. Check all required fields are being sent from frontend

## Code Examples

### Frontend: Making Authenticated Request
```typescript
// lib/auth-context.tsx
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("egwallet_token")
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-backend.onrender.com"
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  return response
}

// Usage in component
const fetchWallets = async () => {
  const response = await apiCall("/wallets")
  if (response.ok) {
    const data = await response.json()
    setWallets(data.wallets)
  }
}
```

### Backend: Protected Route
```javascript
// routes/wallets.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wallet = require('../models/Wallet');

router.get('/', auth, async (req, res) => {
  try {
    const wallets = await Wallet.find({ user_id: req.user.userId });
    res.json({ wallets });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
```

## Support

If you encounter issues:

1. Check backend logs on Render
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test backend endpoints directly with Postman/curl
5. Ensure database is accessible

## Summary

✅ **Next.js handles:** UI, landing page, chat, exchange rates  
✅ **Express handles:** Auth, users, wallets, transactions  
✅ **MongoDB stores:** All user and transaction data  
✅ **One backend:** Serves both web and mobile apps  
✅ **One account:** Users can access from any platform  

This architecture provides a scalable, maintainable solution for the EGWallet ecosystem.
