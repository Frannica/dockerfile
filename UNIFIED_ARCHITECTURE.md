# EGWallet – Unified Web & App Architecture

## Overview
EGWallet implements a unified account system where users have ONE account that works seamlessly across Web and Mobile platforms (Android/iOS). The web and mobile apps are just different clients accessing the same backend services.

## Core Principles

### Single Account Identity
- ONE EGWallet account per user
- Works across Web + Mobile (Android/iOS)
- Unique email + phone per account
- Same authentication across all platforms

## User Database Schema

### User Table
```typescript
{
  id: string                    // UUID (primary key)
  email: string                 // unique
  phone: string                 // unique
  password_hash: string         // bcrypt hashed
  name: string
  email_verified: boolean       // default: false
  phone_verified: boolean       // default: false
  kyc_status: "pending" | "approved" | "rejected"
  signup_source: "web" | "android" | "ios"
  created_at: string           // ISO timestamp
}
```

### Wallet Table
```typescript
{
  wallet_id: string            // UUID
  user_id: string              // Foreign key to User
  currency: string             // USD, EUR, CNY, NGN, XAF, XOF, GHS, ZAR
  balance: number              // Max: $250,000 per wallet
  created_at: string
  updated_at: string
}
```

### Transaction Table
```typescript
{
  id: string                   // UUID (transaction_id)
  user_id: string              // Foreign key to User
  type: "send" | "receive"
  amount: number
  currency: string
  from: string                 // sender user_id
  to: string                   // recipient user_id
  status: "pending" | "approved" | "completed" | "rejected"
  source: "web" | "android" | "ios"
  created_at: string
  approved_at: string | null
  completed_at: string | null
  rejected_at: string | null
  rejection_reason: string | null
}
```

## Authentication System

### Unified Endpoints
Both web and mobile use the same authentication endpoints:

#### POST /api/auth/signup
```typescript
Request: {
  email: string
  phone: string
  password: string
  name: string
  signup_source: "web" | "android" | "ios"
}

Response: {
  user: User (without password)
  message: string
  note: string
}
```

#### POST /api/auth/login
```typescript
Request: {
  email: string
  password: string
}

Response: {
  user: User (without password)
  token: string (JWT)
  message: string
}
```

## KYC (Know Your Customer)

### Requirements
- **Mandatory** before any money movement
- One KYC profile per user
- Shared across web + mobile
- Status: `pending`, `approved`, `rejected`

### KYC Data
- Full name
- Date of birth
- Address
- Government-issued ID
- Proof of address
- Selfie verification

### KYC Status Impact
- `pending`: Can create account, cannot transact
- `approved`: Full access to all features
- `rejected`: Must resubmit with corrections

## Web Beta Phase

### Current Limitations
Until mobile app launch, the web version operates with these restrictions:

1. **Account Creation**: ✅ Allowed
2. **KYC Submission**: ✅ Allowed
3. **Send Money**: 🕐 Requires admin approval
4. **Receive Money**: 🕐 Requires admin approval
5. **Virtual Cards**: ❌ Not available
6. **Instant Transfers**: ❌ Not available

### Transaction Workflow (Web Beta)
1. User submits transfer request
2. Transaction created with status: `pending`
3. Admin reviews and approves/rejects
4. If approved: status changes to `approved` → `completed`
5. If rejected: status changes to `rejected`

### Post-App Launch
After mobile app launches:
- Instant transfers enabled
- No admin approval needed
- Virtual cards activated
- Full feature parity

## Wallet Management

### Multi-Currency Support
Supported currencies:
- USD (US Dollar)
- EUR (Euro)
- CNY (Chinese Yuan)
- NGN (Nigerian Naira)
- XAF (Central African CFA Franc)
- XOF (West African CFA Franc)
- GHS (Ghanaian Cedi)
- ZAR (South African Rand)

### Balance Limits
- Maximum balance per wallet: **$250,000**
- Applies across all currencies
- KYC required before receiving funds

### Wallet Access
- Same wallet visible on web + mobile
- Real-time balance sync
- Transaction history unified

## Transaction System

### Transaction Types
- **Send**: User initiates outgoing transfer
- **Receive**: User receives incoming transfer

### Transaction Status Flow
```
pending → approved → completed
         ↓
      rejected
```

### Status Definitions
- `pending`: Awaiting admin approval (Web Beta)
- `approved`: Admin approved, processing payment
- `completed`: Funds transferred successfully
- `rejected`: Admin rejected, funds not transferred

### Transaction Properties
- Unique UUID per transaction
- Linked to user_id
- Source platform tracked (web/android/ios)
- Timestamps for each status change

## Admin System

### Admin Capabilities
1. **User Management**
   - View user accounts
   - View KYC submissions
   - Approve/reject KYC

2. **Transaction Management**
   - View pending transactions
   - Approve/reject transfers
   - View transaction history

3. **Reporting**
   - User statistics
   - Transaction volumes
   - KYC approval rates

### Admin Dashboard (Future)
- Real-time pending transactions
- KYC review queue
- Fraud detection alerts
- User activity monitoring

## Mobile App Integration

### Account Compatibility
- Mobile app users can log in with existing web accounts
- Web users can log in to mobile app seamlessly
- No migration or account linking required

### Data Sync
- Transactions created on web appear in mobile app
- Pending web transactions visible in mobile
- Balance updates reflect across all platforms

### Feature Parity
Once mobile app launches:
- All web features available on mobile
- Instant transfers on both platforms
- Virtual cards on both platforms
- Same transaction limits

## Messaging & User Communication

### Key Messages
1. **Account Creation**
   - "Your EGWallet account works on web and mobile"
   
2. **Web Beta**
   - "Web Beta: limited features until app launch"
   - "Transactions require admin approval for execution"
   
3. **KYC**
   - "Complete KYC verification to start using EGWallet"
   - "Maximum wallet balance: $250,000"

4. **Transfers**
   - "Transfer request submitted. Pending admin approval."
   - "Instant transfers will be available when the mobile app launches"

### UI Indicators
- Blue info boxes for Web Beta limitations
- Yellow warning for pending KYC
- Green checkmark for approved KYC
- Red alert for rejected KYC

## Compliance & Legal

### Privacy Policy
- Live and publicly accessible at `/privacy`
- Covers both web and mobile data collection
- GDPR compliant
- Updated regularly

### Terms of Service
- Aligned with both web and mobile use
- Covers transaction limitations
- Explains Web Beta restrictions
- Outlines KYC requirements

### Data Safety
- All passwords hashed with bcrypt
- Sensitive data encrypted at rest
- HTTPS/SSL for all communications
- Session tokens expire after inactivity

## API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Sign in user

### Transactions
- `POST /api/transfer` - Initiate transfer (pending approval)
- `GET /api/transactions` - Get user transaction history

### Exchange Rates
- `GET /api/exchange-rates` - Get current currency rates

### Chat
- `POST /api/chat` - AI support chat (5 languages)

## Security Best Practices

### Production Requirements
1. Use bcrypt for password hashing (min 12 rounds)
2. Implement JWT with expiration
3. Add rate limiting on all endpoints
4. Implement CSRF protection
5. Use environment variables for secrets
6. Enable HTTPS only
7. Implement 2FA (email + SMS)
8. Add IP-based fraud detection
9. Log all sensitive operations
10. Regular security audits

### Data Protection
- PII encrypted at rest
- Audit logs for all changes
- GDPR right to deletion
- Data retention policies
- Regular backups

## Future Enhancements

### Phase 1 (Web Beta) - Current
- ✅ Account creation
- ✅ KYC submission
- ✅ Pending transactions
- ✅ Admin approval workflow

### Phase 2 (App Launch)
- Instant transfers
- Virtual card generation
- Push notifications
- Biometric authentication

### Phase 3 (Advanced Features)
- Recurring payments
- Bill splitting
- Request money
- QR code payments
- Merchant integrations

## Testing Guidelines

### Unit Tests
- User authentication
- Transaction validation
- KYC status checks
- Balance calculations

### Integration Tests
- Sign up → KYC → Transfer flow
- Web → Mobile account sync
- Admin approval workflow
- Multi-currency transactions

### E2E Tests
- Complete user journey
- Cross-platform testing
- Transaction lifecycle
- Error handling

## Monitoring & Analytics

### Key Metrics
- User signups (by source)
- KYC approval rate
- Transaction volume
- Average transaction value
- Pending transaction backlog
- User retention rate

### Alerts
- Failed KYC attempts
- Large transactions
- Unusual activity patterns
- System errors
- API downtime

## Support & Documentation

### User Documentation
- How to create account
- How to complete KYC
- How to send/receive money
- Understanding Web Beta limits
- FAQ section

### Developer Documentation
- API reference
- Database schema
- Authentication flow
- Transaction workflow
- Error codes

## Deployment Notes

### Environment Variables
```bash
DATABASE_URL=          # PostgreSQL connection
JWT_SECRET=            # JWT signing key
BCRYPT_ROUNDS=12       # Password hashing rounds
MAX_BALANCE=250000     # Max wallet balance
ADMIN_EMAIL=           # Admin notification email
```

### Database Migrations
- Use migrations for schema changes
- Maintain backward compatibility
- Test on staging first
- Backup before production deploy

### Scaling Considerations
- Database read replicas
- Redis for session storage
- CDN for static assets
- Load balancer for API
- Message queue for async tasks

---

**Version**: 1.0.0  
**Last Updated**: December 17, 2024  
**Status**: Web Beta Active
