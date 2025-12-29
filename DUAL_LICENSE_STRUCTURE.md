# Dual License Structure

TEC Ecosystem uses a **dual-license** approach to balance open-source collaboration with proprietary business features.

---

## 📊 License Distribution

```
TEC Ecosystem
├── 🌐 Public (Open Source - MIT License)
│   ├── UI Components (Header, Footer, Layout)
│   ├── Landing Pages (/, /ecosystem, /[unit])
│   ├── Error Pages (403, 404)
│   └── Configuration (businessUnits.js metadata)
│
└── 🔒 Private (Proprietary License)
    ├── Authentication System (NextAuth + Pi Network)
    ├── Authorization System (RBAC, Middleware)
    ├── User Dashboard (Profile, Transactions)
    ├── Admin Panel (User/BU Management, Analytics)
    ├── Protected Pages (Calculators, Analytics, Tools)
    ├── API Layer (Business operations, Subscriptions)
    └── Database (Prisma schema, Models, Seeding)
```

---

## 🌐 Public Components (MIT License)

### What's Open Source?

**Components** (40% of codebase)
- ✅ `components/Header.js`
- ✅ `components/Footer.js`
- ✅ `components/BusinessUnitLayout.js`
- ✅ `components/ParticlesCanvas.js`

**Pages** (Public Access)
- ✅ `pages/index.js` - Landing page
- ✅ `pages/ecosystem.js` - Business units overview
- ✅ `pages/403.js` - Error page
- ✅ `pages/404.js` - Error page
- ✅ `pages/[unit]/index.js` - BU landing pages (21 units)

**Configuration**
- ✅ `lib/businessUnits.js` - Metadata only (names, icons, descriptions)

**Documentation**
- ✅ `README.md`
- ✅ `CONTRIBUTING.md`
- ✅ `CODE_OF_CONDUCT.md`

### Why Open Source?

1. **Community Contribution** - Allow developers to improve UI/UX
2. **Transparency** - Show how the ecosystem is structured
3. **Reusability** - Let others use the layout system
4. **Trust** - Open code builds confidence

### License

```
MIT License

Copyright (c) 2024-2025 TEC Ecosystem

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

See [LICENSE](./LICENSE) for full text.

---

## 🔒 Private Components (Proprietary License)

### What's Proprietary?

**Authentication & Authorization** (60% of codebase)
- 🔒 `pages/api/auth/[...nextauth].js`
- 🔒 `middleware.js`
- 🔒 `lib/roles.js`
- 🔒 `lib/withAuth.js`
- 🔒 `pages/auth/signin.js`
- 🔒 `pages/auth/error.js`

**User Features**
- 🔒 `pages/dashboard/` - All dashboard pages
- 🔒 `pages/upgrade.js` - Subscription system
- 🔒 `pages/[unit]/calculator.js` - Protected tools
- 🔒 `pages/[unit]/analytics.js` - Protected analytics
- 🔒 `pages/[unit]/[protected-pages]` - All protected pages

**Admin Panel**
- 🔒 `pages/admin/` - All admin pages
- 🔒 User management
- 🔒 Business units management
- 🔒 System analytics

**API Layer**
- 🔒 `pages/api/business-units/` - All BU APIs
- 🔒 `pages/api/users/` - User APIs
- 🔒 `pages/api/subscriptions/` - Subscription APIs

**Database**
- 🔒 `prisma/schema.prisma` - Complete schema
- 🔒 `prisma/seed.js` - Seeding script
- 🔒 All database models and migrations

**Documentation**
- 🔒 `docs/AUTHENTICATION.md`
- 🔒 `docs/SYSTEM_OVERVIEW.md`
- 🔒 `PRIVATE_COMPONENTS.md`

### Why Proprietary?

1. **Business Value** - Core features that provide competitive advantage
2. **Security** - Authentication and authorization logic
3. **Revenue Protection** - Subscription and payment systems
4. **Data Privacy** - User and business data handling
5. **Intellectual Property** - Unique business logic

### License

```
Proprietary License

Copyright (c) 2024-2025 TEC Ecosystem
All Rights Reserved

This software and associated documentation files are proprietary.
Unauthorized copying, modification, distribution, or use is strictly prohibited.
```

See [private/LICENSE_PROPRIETARY](./private/LICENSE_PROPRIETARY) for full text.

---

## 📂 File Organization

### Current Structure

```
tec-ecosystem/
├── components/           # 🌐 Public (MIT)
├── lib/
│   ├── businessUnits.js  # 🌐 Public (metadata only)
│   ├── roles.js          # 🔒 Private
│   └── withAuth.js       # 🔒 Private
├── pages/
│   ├── index.js          # 🌐 Public
│   ├── ecosystem.js      # 🌐 Public
│   ├── 403.js            # 🌐 Public
│   ├── 404.js            # 🌐 Public
│   ├── auth/             # 🔒 Private
│   ├── dashboard/        # 🔒 Private
│   ├── admin/            # 🔒 Private
│   ├── upgrade.js        # 🔒 Private
│   ├── api/              # 🔒 Private
│   └── [units]/
│       ├── index.js      # 🌐 Public (landing)
│       └── [tools].js    # 🔒 Private (protected)
├── middleware.js         # 🔒 Private
├── prisma/               # 🔒 Private
└── docs/                 # Mixed (some public, some private)
```

---

## 🤝 Contributing

### Public Components

We welcome contributions to public components!

1. Fork the repository
2. Create a feature branch
3. Make your changes (public components only)
4. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Private Components

Private components are **not open for external contributions**.

For feature requests or bug reports, please open an issue.

---

## ⚖️ Legal

### Dual License Compliance

- **Using Public Components**: Follow MIT License terms
- **Using Private Components**: Requires commercial license
- **Modifying Public Components**: Allowed under MIT
- **Modifying Private Components**: Not allowed without permission
- **Redistributing Public Components**: Allowed with attribution
- **Redistributing Private Components**: Not allowed

### Commercial Use

- **Public Components**: Free for commercial use (MIT)
- **Private Components**: Requires commercial license

Contact: licensing@tec-ecosystem.com (placeholder)

---

## 📞 Questions?

- **Public Components**: Open an issue or discussion
- **Private Components**: Contact licensing team
- **Commercial Licensing**: licensing@tec-ecosystem.com

---

## 📚 Related Documents

- [PUBLIC_COMPONENTS.md](./PUBLIC_COMPONENTS.md) - List of open-source components
- [PRIVATE_COMPONENTS.md](./PRIVATE_COMPONENTS.md) - List of proprietary components
- [LICENSE](./LICENSE) - MIT License (public)
- [private/LICENSE_PROPRIETARY](./private/LICENSE_PROPRIETARY) - Proprietary License

---

**Last Updated**: December 2024  
**Version**: 1.0.0
