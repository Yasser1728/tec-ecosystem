# TEC Ecosystem - Professional Repository Structure

[![CI Pipeline](https://github.com/Yasser1728/tec-ecosystem/actions/workflows/ci.yml/badge.svg)](https://github.com/Yasser1728/tec-ecosystem/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Yasser1728/tec-ecosystem/branch/main/graph/badge.svg)](https://codecov.io/gh/Yasser1728/tec-ecosystem)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-latest-blue)](https://reactjs.org/)

**TEC (Titan Elite Commerce)** is the parent authority managing 21 independent business units powered by Pi Network. Each business unit operates as a standalone application within the ecosystem, accessible via dedicated routes (e.g., `fundx.pi`, `explorer.pi`, `commerce.pi`). This repository contains a professionally structured codebase with unified templates and shared components.

## 🌐 Dual Language Support

This project provides full documentation in both **English** and **Arabic**. See [README_AR.md](./README_AR.md) for Arabic documentation.

---

## 📁 Repository Structure

The repository is professionally organized with modular business units:

```
tec-ecosystem/
├── pages/                     # Business Units & Pages
│   ├── fundx/                 # FundX.pi - Investment Strategies
│   ├── explorer/              # Explorer.pi - Discovery Platform
│   ├── commerce/              # Commerce.pi - Marketplace
│   ├── assets/                # Assets.pi - Portfolio Management
│   ├── nbf/                   # NBF.pi - Sovereign Banking
│   ├── insure/                # Insure.pi - Insurance
│   ├── vip/                   # VIP.pi - Exclusive Services
│   ├── elite/                 # Elite.pi - Premium Consulting
│   ├── [17 more units]/       # Additional business units
│   ├── ecosystem.js           # Main ecosystem dashboard
│   └── index.js               # Landing page
│
├── components/                # Shared Components
│   ├── BusinessUnitLayout.js  # Unified layout template
│   ├── Header.js              # Global header
│   ├── Footer.js              # Global footer
│   └── [other components]/    # Reusable UI components
│
├── lib/                       # Shared Libraries
│   ├── businessUnits.js       # Business units configuration
│   └── [utilities]/           # Helper functions
│
├── prisma/                    # Database Schema
│   └── schema.prisma          # Prisma schema
│
├── public/                    # Static Assets
│   └── images/                # Images and media
│
└── docs/                      # Documentation
    ├── API.md                 # API documentation
    └── ARCHITECTURE.md        # Architecture guide
```

---

## 🔐 Security & Access Control

### Public vs Private Separation

- **Public Files** (`/public/`): Open-source components available under MIT License
- **Private Files** (`/private/`): Proprietary features requiring authentication

### Authentication

Private routes are protected using:
- **Authentication Middleware**: Role-based access control (RBAC)
- **withAuth HOC**: Page-level protection
- **Session Validation**: Secure session management

See [SECURITY.md](./docs/SECURITY.md) for detailed security policies.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (for Prisma)
- Pi Browser (for Pi Network features)
- Environment variables configured

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Yasser1728/tec-ecosystem.git
   cd tec-ecosystem
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp env.local.example .env.local
   # Edit .env.local with your configuration
   ```

   Required environment variables:
   ```bash
   NEXT_PUBLIC_PI_APP_ID=tec-titan-elite-commerce-04d84accdca2487c
   NEXT_PUBLIC_PI_SANDBOX=true
   PI_API_KEY=your_pi_api_key
   DATABASE_URL=postgresql://user:password@localhost:5432/tec_ecosystem
   NEXTAUTH_SECRET=your_secret
   ```

4. **Setup database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**:
   ```bash
   npm run dev
   ```

6. **Open browser**: Navigate to [http://localhost:3000](http://localhost:3000)

### Exploring the Ecosystem

- **Main Dashboard**: Visit `/ecosystem` to see all 21 business units
- **Individual Units**: Access any unit directly (e.g., `/fundx`, `/explorer`, `/commerce`)
- **Unit Pages**: Each unit has multiple pages (e.g., `/fundx/strategies`, `/explorer/analytics`)

### Available Business Units

| Unit | Route | Access Level | Description |
|------|-------|--------------|-------------|
| FundX | `/fundx` | Public (landing) | Investment strategies and ROI calculator |
| FundX Calculator | `/fundx/calculator` | STANDARD+ | ROI calculation tool |
| FundX Strategies | `/fundx/strategies` | STANDARD+ | Investment strategies |
| Explorer | `/explorer` | Public (landing) | Discovery platform with analytics |
| Explorer Analytics | `/explorer/analytics` | STANDARD+ | Advanced analytics |
| Explorer Portfolio | `/explorer/portfolio` | STANDARD+ | Portfolio tracking |
| Commerce | `/commerce` | Public (landing) | Marketplace with payment solutions |
| Commerce Sellers | `/commerce/sellers` | STANDARD+ | Seller management hub |
| Commerce Payments | `/commerce/payments` | STANDARD+ | Payment processing |
| ... | ... | ... | 18 more business units |

Visit `/ecosystem` to explore all units interactively.

### User Pages

| Page | Route | Access Level | Description |
|------|-------|--------------|-------------|
| Sign In | `/auth/signin` | Public | Pi Network authentication |
| Dashboard | `/dashboard` | STANDARD+ | User account dashboard |
| Profile | `/dashboard/profile` | STANDARD+ | Profile management |
| Transactions | `/dashboard/transactions` | STANDARD+ | Payment history |
| Upgrade | `/upgrade` | Public | Tier comparison and upgrade |

### Admin Pages

| Page | Route | Access Level | Description |
|------|-------|--------------|-------------|
| Admin Dashboard | `/admin` | ADMIN | System overview |
| User Management | `/admin/users` | ADMIN | Manage all users |
| Business Units | `/admin/business-units` | ADMIN | Manage business units |
| Analytics | `/admin/analytics` | ADMIN | System analytics |

### Pi Network Integration

**App ID**: `tec-titan-elite-commerce-04d84accdca2487c`  
**Sandbox URL**: [https://sandbox.minepi.com/app/tec-titan-elite-commerce-04d84accdca2487c](https://sandbox.minepi.com/app/tec-titan-elite-commerce-04d84accdca2487c)

For detailed Pi Network integration guide, see [PI_NETWORK_SETUP.md](./PI_NETWORK_SETUP.md) or visit [/pi-setup](https://tec-ecosystem.vercel.app/pi-setup)

---

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

---

## 📚 Documentation

- **[API Documentation](./docs/API.md)**: Complete API reference
- **[Architecture Guide](./docs/ARCHITECTURE.md)**: Technical architecture overview
- **[Pi Integration Guide](./docs/PI_INTEGRATION.md)**: Pi Network SDK integration
- **[Compliance Documentation](./private/COMPLIANCE.md)**: GDPR and Pi compliance
- **[Contributing Guidelines](./CONTRIBUTING.md)**: How to contribute
- **[Security Policy](./docs/SECURITY.md)**: Security guidelines and reporting
- **[Changelog](./docs/CHANGELOG.md)**: Version history

---

## 🏗️ Architecture

### Business Units System

Each of the 21 business units operates as an independent application with:
- **Dedicated Routes**: `/fundx`, `/explorer`, `/commerce`, etc.
- **Unified Layout**: All units use `BusinessUnitLayout` component
- **Shared Configuration**: Centralized in `lib/businessUnits.js`
- **Consistent Design**: Gradient themes and responsive layouts

### Ecosystem Dashboard

The `/ecosystem` page provides:
- **Visual Grid**: All 21 business units in interactive cards
- **Quick Navigation**: Direct links to each business unit
- **Unit Information**: Icons, taglines, descriptions, and features
- **Responsive Design**: Optimized for all screen sizes

### Key Business Units

1. **FundX.pi** - Investment strategies and ROI calculator
2. **Explorer.pi** - Discovery platform with analytics
3. **Commerce.pi** - Marketplace with seller hub
4. **Assets.pi** - Portfolio management
5. **NBF.pi** - Sovereign banking
6. **[16 more units]** - Insurance, VIP, Elite, and more

For detailed architecture, see [ARCHITECTURE.md](./docs/ARCHITECTURE.md).

---

## 🤝 Contributing

We welcome contributions to the **public** components! Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting pull requests.

**Note**: Private components are proprietary and not open for external contributions.

---

## 📜 Licensing

This project uses a dual-license approach:

- **Public components** (`/public/`): [MIT License](./LICENSE)
- **Private components** (`/private/`): [Proprietary License](./private/LICENSE_PROPRIETARY)

See individual LICENSE files for details.

---

## 🌟 Key Features

- ✅ **21 Business Units**: Independent applications within unified ecosystem
- ✅ **4-Tier Authentication System**: GUEST, STANDARD, PREMIUM, ADMIN with full RBAC
- ✅ **Protected Routes**: Middleware + HOC protection for secure access control
- ✅ **User Dashboard**: Profile management, transactions, and account settings
- ✅ **Admin Panel**: Complete system management and analytics
- ✅ **Unified Layout System**: `BusinessUnitLayout` component for consistency
- ✅ **Ecosystem Dashboard**: `/ecosystem` page showcasing all business units
- ✅ **Pi Network Integration**: Full SDK v2.0 integration with payments and NFTs
- ✅ **Subscription System**: Tier-based pricing with Pi cryptocurrency
- ✅ **API Layer**: RESTful APIs for all business operations
- ✅ **Error Pages**: Custom 403, 404 pages with helpful navigation
- ✅ **Session Management**: NextAuth.js with secure JWT tokens
- ✅ **Database Models**: Complete Prisma schema with seeding
- ✅ **Professional Structure**: Clear separation of concerns
- ✅ **Modern Stack**: Next.js 15, React, Tailwind CSS, Prisma, NextAuth

---

## 📞 Support & Contact

- **Maintainer**: [Yasser1728](https://github.com/Yasser1728)
- **Issues**: [GitHub Issues](https://github.com/Yasser1728/tec-ecosystem/issues)
- **Security**: See [SECURITY.md](./docs/SECURITY.md) for reporting vulnerabilities

---

## 🏢 Complete Business Units List

The TEC Ecosystem consists of 21 independent business units:

### Financial Services
- **FundX.pi** - Investment strategies and portfolio optimization
- **Assets.pi** - Asset management and valuation
- **NBF.pi** - Next-generation banking solutions
- **Insure.pi** - Insurance and risk management

### Premium Services
- **VIP.pi** - Exclusive opportunities and memberships
- **Elite.pi** - Premium consulting and networking
- **Titan.pi** - Enterprise-level authority
- **Epic.pi** - Premium experiences
- **Legend.pi** - Legacy and heritage services

### Commerce & Marketplace
- **Commerce.pi** - General marketplace
- **Ecommerce.pi** - Online retail platform

### Technology & Innovation
- **Explorer.pi** - Discovery and analytics platform
- **DX.pi** - Digital transformation solutions
- **NX.pi** - Next-generation technologies
- **System.pi** - Infrastructure and systems
- **Analytics.pi** - Data analytics platform
- **Alert.pi** - Notification and monitoring system

### Specialized Services
- **Life.pi** - Lifestyle and wellness
- **Connection.pi** - Networking and relationships
- **Brookfield.pi** - Real estate and property
- **Zone.pi** - Geographic zones and locations

Each unit is accessible via its dedicated route and features a consistent, professional interface.

---

## 📈 Project Status

🚧 **Active Development** - This project is under active development with regular updates.

See [CHANGELOG.md](./docs/CHANGELOG.md) for recent changes and upcoming features.

---

© 2024-2025 TEC Ecosystem - All Rights Reserved
