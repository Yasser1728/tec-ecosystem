# Private Components (Proprietary)

This document lists all proprietary components under Proprietary License.

## 🔒 Private Components Structure

```
private-src/
├── auth/
│   ├── NextAuth configuration
│   ├── Pi Network integration
│   └── Session management
│
├── middleware/
│   └── Route protection logic
│
├── lib/
│   ├── roles.js                  # RBAC system
│   ├── withAuth.js               # Auth HOC
│   └── permissions.js            # Permission checks
│
├── pages/
│   ├── auth/
│   │   ├── signin.js             # Sign in page
│   │   └── error.js              # Auth errors
│   │
│   ├── dashboard/
│   │   ├── index.js              # User dashboard
│   │   ├── profile.js            # Profile management
│   │   └── transactions.js       # Transaction history
│   │
│   ├── admin/
│   │   ├── index.js              # Admin dashboard
│   │   ├── users.js              # User management
│   │   ├── business-units.js     # BU management
│   │   └── analytics.js          # System analytics
│   │
│   ├── upgrade.js                # Tier upgrade system
│   │
│   └── [business-units]/
│       ├── calculator.js         # Protected tools
│       ├── analytics.js          # Protected analytics
│       └── [other protected pages]
│
├── api/
│   ├── auth/
│   │   └── [...nextauth].js      # Auth API
│   │
│   ├── business-units/
│   │   ├── index.js              # CRUD operations
│   │   ├── [key].js              # Single unit ops
│   │   └── [key]/
│   │       ├── track.js          # Activity tracking
│   │       └── analytics.js      # Analytics
│   │
│   ├── users/
│   │   └── profile.js            # Profile API
│   │
│   └── subscriptions/
│       └── create.js             # Subscription API
│
└── database/
    ├── prisma/schema.prisma      # Database schema
    └── prisma/seed.js            # Seeding script
```

## 🔐 Proprietary Features

### Authentication & Authorization
- **NextAuth.js Integration** - Complete auth system with Pi Network
- **4-Tier Role System** - GUEST, STANDARD, PREMIUM, ADMIN
- **Middleware Protection** - Automatic route protection
- **withAuth HOC** - Component-level protection
- **useAuth Hook** - Flexible authentication checks
- **Session Management** - Secure JWT tokens

### User Management
- **User Dashboard** - Complete account management
- **Profile Management** - Edit user information
- **Transaction History** - View all Pi payments
- **Tier Upgrade System** - Subscription management

### Admin Panel
- **Admin Dashboard** - System overview
- **User Management** - Manage all users
- **Business Units Management** - Configure units
- **System Analytics** - Detailed reports

### Business Unit Features
- **Protected Pages** - Calculator, analytics, seller hub, etc.
- **Activity Tracking** - User behavior analytics
- **Subscription System** - Tier-based access control

### API Layer
- **Business Units API** - CRUD operations
- **User API** - Profile management
- **Subscriptions API** - Payment processing
- **Analytics API** - Data tracking

### Database
- **Prisma ORM** - Complete schema
- **8+ Models** - Users, BusinessUnits, Subscriptions, etc.
- **Seeding Script** - Demo data

## 📜 License

All private components are licensed under **Proprietary License**.

See [private/LICENSE_PROPRIETARY](./private/LICENSE_PROPRIETARY) for full details.

## ⚠️ Restrictions

- ❌ **No redistribution** without permission
- ❌ **No modification** without permission
- ❌ **No commercial use** without license
- ✅ **Internal use only** for authorized users

## 🔓 Public Components

For open-source components, see [PUBLIC_COMPONENTS.md](./PUBLIC_COMPONENTS.md)

---

**Note**: This is a dual-license project. Private components are proprietary, while public components are open-source (MIT).

## 📞 Contact

For licensing inquiries:
- Email: licensing@tec-ecosystem.com (placeholder)
- GitHub: [Issues](https://github.com/Yasser1728/tec-ecosystem/issues)
