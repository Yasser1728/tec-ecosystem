# Authentication System Documentation

## Overview

TEC Ecosystem uses NextAuth.js with Pi Network integration for authentication and a role-based access control (RBAC) system for authorization.

---

## Architecture

### Components

1. **NextAuth.js** - Authentication provider
2. **Pi Network SDK** - Pi Network integration
3. **Middleware** - Route protection
4. **withAuth HOC** - Component-level protection
5. **Roles System** - Permission management

---

## User Tiers

### Available Tiers

| Tier       | Level | Description                           |
| ---------- | ----- | ------------------------------------- |
| GUEST      | 0     | Unauthenticated users                 |
| STANDARD   | 1     | Free registered users                 |
| PREMIUM    | 2     | Paid subscription (100 Pi/month)      |
| ENTERPRISE | 3     | Business subscription (1000 Pi/month) |
| ADMIN      | 4     | System administrators                 |

### Tier Permissions

#### GUEST

- ✅ View public pages
- ✅ View business unit landing pages
- ❌ Access calculators
- ❌ Access analytics
- ❌ Make purchases

#### STANDARD

- ✅ All GUEST permissions
- ✅ Access calculators (10/day limit)
- ✅ Access basic analytics (5 reports/month)
- ✅ Make purchases (20/month limit)
- ❌ Create listings
- ❌ Access premium content

#### PREMIUM

- ✅ All STANDARD permissions
- ✅ Unlimited calculators
- ✅ Unlimited analytics
- ✅ Create listings (50 active)
- ✅ Access premium content
- ✅ Priority support
- ✅ Custom branding

#### ENTERPRISE

- ✅ All PREMIUM permissions
- ✅ API access
- ✅ White-label solutions
- ✅ Unlimited listings
- ✅ Team management (50 members)
- ✅ Dedicated account manager

#### ADMIN

- ✅ Full system access
- ✅ User management
- ✅ Business unit management
- ✅ System configuration

---

## Implementation

### 1. NextAuth Configuration

File: `pages/api/auth/[...nextauth].js`

```javascript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "pi-network",
      name: "Pi Network",
      // ... configuration
    }),
  ],
  // ... callbacks and options
};
```

### 2. Middleware Protection

File: `middleware.js`

Automatically protects routes based on configuration:

```javascript
const routeConfig = {
  public: ['/', '/ecosystem', ...],
  protected: ['/dashboard', ...],
  premium: ['/fundx/advanced', ...],
  admin: ['/admin', ...],
};
```

### 3. Component Protection

#### Using withAuth HOC

```javascript
import { withAuth } from "../lib/withAuth";
import { USER_TIERS } from "../lib/roles";

function MyProtectedPage({ session }) {
  return <div>Protected Content</div>;
}

export default withAuth(MyProtectedPage, {
  requiredTier: USER_TIERS.PREMIUM,
});
```

#### Using useAuth Hook

```javascript
import { useAuth } from "../lib/withAuth";

function MyComponent() {
  const { user, isAuthenticated, hasRequiredTier } = useAuth({
    requiredTier: USER_TIERS.PREMIUM,
  });

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return <div>Hello {user.username}</div>;
}
```

#### Using AuthGuard Component

```javascript
import { AuthGuard } from "../lib/withAuth";
import { USER_TIERS } from "../lib/roles";

function MyComponent() {
  return (
    <AuthGuard
      requiredTier={USER_TIERS.PREMIUM}
      fallback={<div>Premium access required</div>}
    >
      <div>Premium Content</div>
    </AuthGuard>
  );
}
```

---

## Sign In Flow

### 1. User clicks "Sign In"

→ Redirected to `/auth/signin`

### 2. User authenticates with Pi Network

```javascript
const authResult = await window.Pi.authenticate(
  ["username", "payments"],
  onIncompletePaymentFound,
);
```

### 3. NextAuth creates session

```javascript
await signIn("pi-network", {
  piId: authResult.user.uid,
  username: authResult.user.username,
  accessToken: authResult.accessToken,
});
```

### 4. User redirected to dashboard

→ `/dashboard` or original callback URL

---

## Route Protection

### Public Routes

No authentication required:

- `/` - Home page
- `/ecosystem` - Business units overview
- `/fundx` - Business unit landing pages
- `/auth/*` - Authentication pages

### Protected Routes

Require STANDARD tier:

- `/dashboard` - User dashboard
- `/fundx/calculator` - Calculators
- `/explorer/analytics` - Analytics

### Premium Routes

Require PREMIUM tier:

- `/fundx/advanced` - Advanced features
- `/elite/consulting` - Premium consulting
- `/vip/events` - VIP events

### Admin Routes

Require ADMIN tier:

- `/admin/*` - Admin panel

---

## Permission Checking

### In Code

```javascript
import { hasPermission, hasTierLevel } from "../lib/roles";

// Check specific permission
if (hasPermission(user.tier, "accessCalculators")) {
  // Allow access
}

// Check tier level
if (hasTierLevel(user.tier, USER_TIERS.PREMIUM)) {
  // User is at least PREMIUM
}

// Check business unit page access
if (canAccessBusinessUnitPage(user.tier, "fundx", "calculator")) {
  // Allow access
}
```

---

## Database Schema

### User Model

```prisma
model User {
  id            String    @id @default(cuid())
  piId          String    @unique
  username      String
  email         String?   @unique
  tier          String    @default("STANDARD")
  status        String    @default("ACTIVE")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

---

## Environment Variables

Required variables in `.env.local`:

```bash
# NextAuth - Local Development
NEXTAUTH_URL=http://localhost:3000
# NextAuth - Production/Testnet
# NEXTAUTH_URL=https://tec-ecosystem.vercel.app
NEXTAUTH_SECRET=your-secret-key

# Pi Network
NEXT_PUBLIC_PI_APP_ID=your-pi-app-id
PI_API_KEY=your-pi-api-key

# Database
DATABASE_URL=postgresql://...
```

---

## Testing

### Demo Users

Run `npm run db:seed` to create demo users:

| Username     | Pi ID              | Tier     | Password      |
| ------------ | ------------------ | -------- | ------------- |
| admin        | admin-demo-pi-id   | ADMIN    | N/A (Pi Auth) |
| demo_user    | user-demo-pi-id    | STANDARD | N/A (Pi Auth) |
| premium_user | premium-demo-pi-id | PREMIUM  | N/A (Pi Auth) |

---

## Security Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Keep NEXTAUTH_SECRET secure
3. ✅ Validate user tier on server-side
4. ✅ Use middleware for route protection
5. ✅ Check permissions in API routes
6. ✅ Sanitize user inputs
7. ✅ Rate limit authentication attempts

---

## Troubleshooting

### "Pi SDK not loaded"

- Ensure app is opened in Pi Browser
- Check Pi SDK script is loaded in `_app.js`

### "Access Denied"

- Check user tier matches required tier
- Verify user status is ACTIVE
- Check middleware configuration

### "Session not found"

- Clear browser cookies
- Check NEXTAUTH_SECRET is set
- Verify database connection

---

## API Endpoints

### Authentication

- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session

### Business Units

- `GET /api/business-units` - List all units
- `GET /api/business-units/[key]` - Get unit details
- `POST /api/business-units/[key]/track` - Track activity

---

## Next Steps

1. Implement tier upgrade flow
2. Add payment processing for subscriptions
3. Create admin panel for user management
4. Add email notifications
5. Implement 2FA for admin accounts

---

For more information, see:

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Pi Network SDK Documentation](https://developers.minepi.com/)
