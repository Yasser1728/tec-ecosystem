# TEC Ecosystem - Professional Repository Structure

[![CI Pipeline](https://github.com/Yasser1728/tec-ecosystem/actions/workflows/ci.yml/badge.svg)](https://github.com/Yasser1728/tec-ecosystem/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Yasser1728/tec-ecosystem/branch/main/graph/badge.svg)](https://codecov.io/gh/Yasser1728/tec-ecosystem)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-latest-blue)](https://reactjs.org/)

**TEC (Titan Elite Commerce)** is the parent authority managing 24 independent business units (domains/kingdoms) powered by Pi Network. Each business unit operates as a standalone application within the ecosystem, accessible via dedicated routes (e.g., `fundx.pi`, `explorer.pi`, `commerce.pi`). This repository contains a professionally structured codebase with unified templates and shared components.

## 🌐 Dual Language Support

This project provides full documentation in both **English** and **Arabic**. See [README_AR.md](./README_AR.md) for Arabic documentation.

---

## 🎯 Vision & Philosophy

### The Vision

TEC Ecosystem represents a revolutionary approach to building interconnected business applications on Pi Network. Rather than creating monolithic applications, we architect 24 independent yet harmoniously integrated domains (kingdoms), each serving a specific business vertical while sharing common infrastructure and user experiences.

**Core Principles:**

1. **Domain Sovereignty** - Each of the 24 domains operates independently with its own business logic, data models, and services
2. **Seamless Integration** - Domains communicate through standardized APIs and event-driven architecture
3. **User-Centric Design** - Single sign-on and unified experience across all domains
4. **Pi-Native Economy** - All transactions powered by Pi cryptocurrency
5. **Professional Architecture** - Enterprise-grade code structure and documentation

### Operating Philosophy

**Microservices at Scale:** Each domain is a microservice that can be:

- Developed independently by specialized teams
- Scaled independently based on demand
- Deployed independently with zero downtime
- Monetized independently or as bundles

**Data Sovereignty:** Each domain owns its data while sharing necessary information through:

- RESTful APIs for synchronous operations
- Event bus for asynchronous updates
- Read-only database views for analytics
- GraphQL gateway for unified queries

**Progressive Enhancement:**

- Start with core domains (Assets, FundX, Explorer, Commerce)
- Gradually activate remaining domains
- Each domain adds value independently
- Integration creates multiplicative value

---

## 👥 User Journey

### The TEC Ecosystem Experience

**Entry Point:** Users discover TEC through any of the 24 domain-specific landing pages or the central ecosystem hub at `tec.pi`

**Journey Flow:**

```
1. Discovery Phase
   └─→ User lands on domain page (e.g., fundx.pi)
   └─→ Explores features and value proposition
   └─→ Views public content and demos

2. Authentication Phase
   └─→ Pi Network single sign-on (SSO)
   └─→ Profile creation and tier selection
   └─→ KYC verification (for premium features)

3. Domain Exploration Phase
   └─→ Access domain-specific features
   └─→ Discover cross-domain opportunities
   └─→ Navigate seamlessly between domains

4. Transaction Phase
   └─→ Execute transactions in Pi cryptocurrency
   └─→ Track activity across domains
   └─→ Earn rewards and build reputation

5. Growth Phase
   └─→ Upgrade tiers for premium features
   └─→ Unlock additional domains
   └─→ Participate in ecosystem governance
```

**Example User Stories:**

**Story 1: Investment Professional**

- Starts at `fundx.pi` to explore investment strategies
- Discovers `assets.pi` for portfolio management
- Uses `analytics.pi` for data insights
- Connects with `elite.pi` for consulting services
- All unified under single Pi Network identity

**Story 2: Real Estate Investor**

- Begins at `estate.pi` browsing properties
- Discovers `brookfield.pi` for investment funds
- Uses `nbf.pi` for financing solutions
- Gets insurance from `insure.pi`
- Seamless experience across 4 domains

**Story 3: Entrepreneur**

- Starts business on `commerce.pi`
- Builds presence on `ecommerce.pi`
- Gets financing from `fundx.pi`
- Accesses analytics from `analytics.pi`
- Networks through `connection.pi`

---

## 📅 Project Roadmap & Timeline

### The TEC Ecosystem Journey

**Phase 1: Foundation (Q1 2026) - CURRENT**

**Goals**: Establish core infrastructure and reference implementations

- ✅ **Repository Structure**: Professional modular architecture
- ✅ **Domain Documentation**: 24 domain folders with comprehensive READMEs
- ✅ **Reference Implementation**: Assets domain as complete example
- ✅ **Core Infrastructure**: Authentication, API gateway, database schema
- ⏳ **Initial Domains**: Complete 4 core domains (Assets, FundX, Commerce, Explorer)
- ⏳ **Pi Network Integration**: Full SDK integration and payment flows
- ⏳ **Testing Infrastructure**: Unit, integration, and E2E test suites

**Deliverables:**

- Complete domain documentation for all 24 domains
- Working implementation of 4 core domains
- Unified authentication and authorization system
- Developer documentation and API specifications

---

**Phase 2: Domain Expansion (Q2 2026)**

**Goals**: Expand to 12 operational domains with full integration

- 📋 **Financial Services Block** (NBF, Insure, Assets, FundX)
  - Complete banking and insurance features
  - Portfolio management and tracking
  - Investment strategies and analytics
- 📋 **Commerce Block** (Commerce, Ecommerce, Estate)
  - B2B and B2C marketplaces
  - Real estate transactions
  - Shopping cart and checkout flows
- 📋 **Technology Block** (System, DX, Analytics, Alert)
  - System monitoring and management
  - Digital transformation tools
  - Analytics platform
  - Notification system

**Deliverables:**

- 12 fully operational domains
- Cross-domain integration patterns established
- Event bus for domain communication
- Comprehensive user dashboard

---

**Phase 3: Premium Services (Q3 2026)**

**Goals**: Launch premium and specialized domains

- 📋 **Premium Services Block** (VIP, Elite, Titan, Epic, Legend)
  - Exclusive membership tiers
  - Premium consulting services
  - Enterprise solutions
  - Legacy and heritage services
- 📋 **Innovation Block** (NX, Explorer, Nexus)
  - Next-generation technologies
  - Discovery and exploration platform
  - API integration hub
- 📋 **Lifestyle Block** (Life, Connection, Zone)
  - Lifestyle and wellness services
  - Networking and relationships
  - Geographic-based services

**Deliverables:**

- 20+ operational domains
- Premium tier features and access controls
- Advanced analytics and insights
- Mobile application beta

---

**Phase 4: Ecosystem Maturity (Q4 2026)**

**Goals**: Complete all 24 domains with AI and advanced features

- 📋 **Complete Domain Coverage**: All 24 domains operational
- 📋 **AI Integration**: Machine learning for personalization
- 📋 **Advanced Features**:
  - Smart recommendations across domains
  - Predictive analytics
  - Automated workflows
  - Cross-domain optimization
- 📋 **Enterprise Ready**:
  - Multi-tenant support
  - White-label capabilities
  - Advanced security features
  - Compliance certifications

**Deliverables:**

- 24 fully operational domains
- AI-powered features across ecosystem
- Mobile apps (iOS/Android)
- Enterprise-grade infrastructure

---

**Phase 5: Global Scale (2027)**

**Goals**: International expansion and ecosystem growth

- 📋 **Geographic Expansion**:
  - Multi-language support (10+ languages)
  - Regional marketplaces
  - Local payment methods
  - Compliance with regional regulations
- 📋 **Ecosystem Growth**:
  - Third-party developer platform
  - Plugin marketplace
  - API monetization
  - Partner network expansion
- 📋 **Advanced Capabilities**:
  - Blockchain integration beyond Pi
  - DeFi features
  - NFT marketplace integration
  - Metaverse presence

**Deliverables:**

- Global presence in 50+ countries
- Developer ecosystem with 1000+ third-party apps
- 1M+ active users
- Industry leadership position

---

### Development Principles for Each Phase

**Quality Over Speed:**

- Each domain must meet quality standards before moving forward
- Comprehensive testing at every phase
- Security audits before major releases
- User feedback integration in iterative cycles

**Iterative Enhancement:**

- Start with MVP features for each domain
- Add advanced features based on user needs
- Continuous improvement based on analytics
- Regular performance optimization

**Collaborative Development:**

- Clear documentation at every step
- Open communication channels
- Code reviews and pair programming
- Knowledge sharing sessions

**Sustainable Growth:**

- Scalable architecture from day one
- Performance monitoring and optimization
- Technical debt management
- Regular refactoring and modernization

---

## 🏗️ Proposed Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TEC Ecosystem Gateway                     │
│              (API Gateway + Load Balancer)                   │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐
│   Frontend   │    │  Auth/IAM   │    │   Event     │
│   Next.js    │    │   Service   │    │     Bus     │
└──────────────┘    └─────────────┘    └─────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐
│    Domain    │    │   Domain    │    │   Domain    │
│   Services   │    │   Services  │    │   Services  │
│   (24 Total) │    │   (Assets,  │    │  (Explorer, │
│              │    │   FundX)    │    │  Commerce)  │
└──────┬───────┘    └─────┬───────┘    └─────┬───────┘
       │                  │                   │
       └──────────────────┼───────────────────┘
                          │
                  ┌───────▼────────┐
                  │   Data Layer   │
                  │   PostgreSQL   │
                  │   + Prisma ORM │
                  └────────────────┘
```

### Domain Structure

Each of the 24 domains follows this structure:

```
/domains/[domain-name]/
├── README.md                 # Domain documentation
├── data-model/              # Database schemas
│   ├── schema.prisma        # Prisma models
│   ├── erd.md              # Entity diagrams
│   └── migrations/         # DB migrations
├── services/               # Business logic
│   ├── [domain]Service.js  # Core service
│   ├── integration.js      # Cross-domain integration
│   └── validators.js       # Data validation
└── api/                    # API documentation
    ├── endpoints.md        # API specs
    └── examples.md         # Usage examples
```

### Integration Patterns

**Pattern 1: Synchronous API Calls**

```javascript
// Commerce domain calling Assets domain
const userPortfolio = await assetsService.getPortfolio(userId);
```

**Pattern 2: Event-Driven Communication**

```javascript
// FundX publishes investment event
eventBus.publish("investment.created", { userId, amount, strategy });
// Assets listens and updates portfolio
```

**Pattern 3: Shared Data Views**

```sql
-- Read-only view for cross-domain queries
CREATE VIEW user_financial_summary AS
  SELECT u.id, a.portfolio_value, f.investment_count
  FROM users u
  JOIN assets a ON a.user_id = u.id
  JOIN fundx f ON f.user_id = u.id;
```

---

## 🛠️ Engineering Recommendations

### Development Standards

**1. Code Organization**

- Follow domain-driven design (DDD) principles
- Keep domains loosely coupled
- Use dependency injection for testability
- Implement repository pattern for data access

**2. API Design**

- Use RESTful conventions for CRUD operations
- Implement GraphQL for complex queries
- Version all APIs (v1, v2, etc.)
- Document with OpenAPI/Swagger

**3. Data Management**

- Each domain has its own database schema
- Use Prisma ORM for type-safe database access
- Implement soft deletes for audit trails
- Maintain referential integrity across domains

**4. Security**

- Implement JWT-based authentication
- Use RBAC (Role-Based Access Control) for authorization
- Encrypt sensitive data at rest and in transit
- Conduct regular security audits

**5. Testing Strategy**

```javascript
// Unit tests for business logic
describe("AssetService", () => {
  test("calculatePortfolioValue", () => {
    // Test implementation
  });
});

// Integration tests for APIs
describe("Assets API", () => {
  test("GET /api/assets/portfolio", async () => {
    // Test API endpoint
  });
});

// E2E tests for user journeys
describe("Investment Journey", () => {
  test("User can create and track investment", async () => {
    // Test full workflow
  });
});
```

**6. Performance Optimization**

- Implement caching at multiple layers (Redis)
- Use CDN for static assets
- Optimize database queries with indexes
- Implement pagination for large datasets
- Use lazy loading for domain modules

**7. Monitoring & Observability**

- Log all significant events
- Track metrics (response time, error rates)
- Implement distributed tracing
- Set up alerts for anomalies
- Use APM tools (Application Performance Monitoring)

**8. Deployment Strategy**

- Use containerization (Docker)
- Implement CI/CD pipelines
- Blue-green deployments for zero downtime
- Automated rollback on failures
- Feature flags for gradual rollouts

**9. Documentation Standards**

- Maintain up-to-date README for each domain
- Document all public APIs
- Include code examples
- Create architecture diagrams
- Write deployment guides

**10. Code Quality**

- Use ESLint and Prettier for code formatting
- Enforce code reviews before merging
- Maintain test coverage above 80%
- Use TypeScript or JSDoc for type safety
- Follow semantic versioning

### Technology Stack

**Frontend:**

- Next.js 15 (React Framework)
- Tailwind CSS (Styling)
- React Query (State Management)
- React Hook Form (Forms)

**Backend:**

- Node.js (Runtime)
- Next.js API Routes (API Layer)
- Prisma (ORM)
- NextAuth.js (Authentication)

**Database:**

- PostgreSQL (Primary Database)
- Redis (Caching)

**Infrastructure:**

- Vercel (Hosting)
- GitHub Actions (CI/CD)
- Cloudflare (CDN)

**Monitoring:**

- Sentry (Error Tracking)
- Vercel Analytics (Performance)
- Custom Logging Service

---

## 📁 Repository Structure

The repository is professionally organized with modular business units:

```
tec-ecosystem/
├── domains/                   # 📚 Domain Documentation (NEW)
│   ├── README.md              # Domains overview
│   ├── assets/                # Assets domain specs
│   ├── fundx/                 # FundX domain specs
│   ├── explorer/              # Explorer domain specs
│   ├── commerce/              # Commerce domain specs
│   └── [20 more domains]/     # All 24 domains documented
│
├── pages/                     # Business Units & Pages
│   ├── fundx/                 # FundX.pi - Investment Strategies
│   ├── explorer/              # Explorer.pi - Discovery Platform
│   ├── commerce/              # Commerce.pi - Marketplace
│   ├── assets/                # Assets.pi - Portfolio Management
│   ├── nbf/                   # NBF.pi - Sovereign Banking
│   ├── insure/                # Insure.pi - Insurance
│   ├── vip/                   # VIP.pi - Exclusive Services
│   ├── elite/                 # Elite.pi - Premium Consulting
│   ├── [16 more units]/       # Additional business units
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
│   ├── services/              # Shared services
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

> **Note:** The `/domains` directory contains comprehensive documentation for all 24 business domains including data models, API specifications, and integration patterns. See [domains/README.md](./domains/README.md) for details.

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

### Forensic Audit System

All financial and sensitive operations are protected by a centralized forensic audit system:

- **Central Audit Server** (`/api/approval`): Validates all financial transactions
- **Immutable Logging**: Cryptographic hash-based audit trail
- **Suspicious Activity Detection**: Real-time threat detection
- **User Identity Verification**: Multi-factor validation

See [FORENSIC_AUDIT.md](./docs/FORENSIC_AUDIT.md) for the complete forensic audit documentation.

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

| Unit               | Route                 | Access Level     | Description                              |
| ------------------ | --------------------- | ---------------- | ---------------------------------------- |
| FundX              | `/fundx`              | Public (landing) | Investment strategies and ROI calculator |
| FundX Calculator   | `/fundx/calculator`   | STANDARD+        | ROI calculation tool                     |
| FundX Strategies   | `/fundx/strategies`   | STANDARD+        | Investment strategies                    |
| Explorer           | `/explorer`           | Public (landing) | Discovery platform with analytics        |
| Explorer Analytics | `/explorer/analytics` | STANDARD+        | Advanced analytics                       |
| Explorer Portfolio | `/explorer/portfolio` | STANDARD+        | Portfolio tracking                       |
| Commerce           | `/commerce`           | Public (landing) | Marketplace with payment solutions       |
| Commerce Sellers   | `/commerce/sellers`   | STANDARD+        | Seller management hub                    |
| Commerce Payments  | `/commerce/payments`  | STANDARD+        | Payment processing                       |
| ...                | ...                   | ...              | 18 more business units                   |

Visit `/ecosystem` to explore all units interactively.

### User Pages

| Page         | Route                     | Access Level | Description                 |
| ------------ | ------------------------- | ------------ | --------------------------- |
| Sign In      | `/auth/signin`            | Public       | Pi Network authentication   |
| Dashboard    | `/dashboard`              | STANDARD+    | User account dashboard      |
| Profile      | `/dashboard/profile`      | STANDARD+    | Profile management          |
| Transactions | `/dashboard/transactions` | STANDARD+    | Payment history             |
| Upgrade      | `/upgrade`                | Public       | Tier comparison and upgrade |

### Admin Pages

| Page            | Route                   | Access Level | Description           |
| --------------- | ----------------------- | ------------ | --------------------- |
| Admin Dashboard | `/admin`                | ADMIN        | System overview       |
| User Management | `/admin/users`          | ADMIN        | Manage all users      |
| Business Units  | `/admin/business-units` | ADMIN        | Manage business units |
| Analytics       | `/admin/analytics`      | ADMIN        | System analytics      |

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

### Known CI/CD Issues

⚠️ **GitHub Copilot Autovalidate**: The repository has identified bugs in GitHub's Copilot Pull Request Reviewer autovalidate tool that may cause CI failures. These are **GitHub infrastructure issues**, not problems with the repository code.

**If your PR fails with autovalidate errors**:
- ✅ Repository code is correct (verified)
- ✅ All other checks pass (ESLint, CodeQL, builds)
- 🔧 Apply workarounds from documentation

**Documentation**:
- 📋 [Complete Summary](./AUTOVALIDATE_ISSUES_COMPLETE_SUMMARY.md) - Overview of all issues
- 🔍 [Path Error Fix (English)](./AUTOVALIDATE_PATH_ERROR_FIX.md) - Current issue (#313+)
- 🔍 [Path Error Fix (Arabic)](./AUTOVALIDATE_PATH_ERROR_FIX_AR.md) - نفس الوثيقة بالعربية
- 🔧 [Workaround Guide](./.github/COPILOT_AUTOVALIDATE_WORKAROUND.md) - Practical solutions
- 🐛 [Previous Issue](./AUTOVALIDATE_ISSUE_RESOLUTION.md) - Slice bounds panic (#310)

**Quick Workarounds**:
1. **Retry** the workflow (may succeed on retry)
2. **Wait** 24-48 hours for GitHub state to clear
3. **Manual review** and merge with admin override (if urgent)
4. See [Workaround Guide](./.github/COPILOT_AUTOVALIDATE_WORKAROUND.md) for details

---

## 📜 Licensing

This project uses a **dual-license** approach:

### 🌐 Public Components (MIT License)

- UI Components (Header, Footer, Layout)
- Landing Pages (/, /ecosystem, /[unit])
- Error Pages (403, 404)
- Configuration metadata

**License**: [MIT License](./LICENSE)  
**Usage**: Free for commercial and personal use

### 🔒 Private Components (Proprietary License)

- Authentication System (NextAuth + Pi Network)
- Authorization System (RBAC, Middleware)
- User Dashboard & Admin Panel
- Protected Pages & Tools
- API Layer & Database

**License**: [Proprietary License](./private/LICENSE_PROPRIETARY)  
**Usage**: Requires commercial license

### 📚 Documentation

- [DUAL_LICENSE_STRUCTURE.md](./DUAL_LICENSE_STRUCTURE.md) - Complete licensing guide
- [PUBLIC_COMPONENTS.md](./PUBLIC_COMPONENTS.md) - Open-source components list
- [PRIVATE_COMPONENTS.md](./PRIVATE_COMPONENTS.md) - Proprietary components list

See individual LICENSE files for full legal details.

---

## 🌟 Key Features

- ✅ **24 Business Units**: Independent applications within unified ecosystem
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
