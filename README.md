# TEC Ecosystem - Professional Repository Structure

[![CI Pipeline](https://github.com/Yasser1728/tec-ecosystem/actions/workflows/ci.yml/badge.svg)](https://github.com/Yasser1728/tec-ecosystem/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Yasser1728/tec-ecosystem/branch/main/graph/badge.svg)](https://codecov.io/gh/Yasser1728/tec-ecosystem)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-latest-blue)](https://reactjs.org/)

**TEC (The Elite Consortium)** is the parent authority managing 24 independent luxury business domains. This repository contains a professionally structured codebase with clear separation between open-source (public) and closed-source (private) components.

## 🌐 Dual Language Support

This project provides full documentation in both **English** and **Arabic**. See [README_AR.md](./README_AR.md) for Arabic documentation.

---

## 📁 Repository Structure

The repository is professionally organized into distinct sections:

```
tec-ecosystem/
├── public/                    # Open Source Files (MIT License)
│   ├── components/            # Shared UI components
│   ├── pages/                 # Public pages (tec, system, epic, nbf, assets)
│   └── hooks/                 # Shared React hooks
│
├── private/                   # Closed Source Files (Proprietary)
│   ├── strategies/            # Strategic guidance pages
│   ├── integrations/          # Platform integration features
│   ├── ecommerce/             # E-commerce platform
│   ├── notifications/         # Alert and notification system
│   └── legacy/                # Legacy project management
│
├── tests/                     # Comprehensive Test Suite
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── e2e/                   # End-to-end tests
│
├── docs/                      # Professional Documentation
│   ├── API.md                 # API documentation
│   ├── ARCHITECTURE.md        # Project architecture
│   ├── CONTRIBUTING.md        # Contribution guidelines
│   └── SECURITY.md            # Security policies
│
└── scripts/                   # Automation Scripts
    ├── setup.sh               # Project setup script
    └── deploy.sh              # Deployment script
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
- **[Contributing Guidelines](./CONTRIBUTING.md)**: How to contribute
- **[Security Policy](./docs/SECURITY.md)**: Security guidelines and reporting
- **[Changelog](./docs/CHANGELOG.md)**: Version history

---

## 🏗️ Architecture

### Public Components
- Shared UI components (Header, Footer)
- Public landing pages for main domains
- Open-source utilities and hooks

### Private Components
- Strategic guidance system
- Platform integration features
- E-commerce marketplace
- Notification system
- Legacy project management

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

- ✅ **24 Business Domains**: Comprehensive luxury business ecosystem
- ✅ **Dual Language**: Full English and Arabic support
- ✅ **Security First**: Role-based access control and authentication
- ✅ **Professional Structure**: Clear separation of concerns
- ✅ **Comprehensive Testing**: Unit, integration, and e2e tests
- ✅ **Modern Stack**: Next.js 15, React, Tailwind CSS
- ✅ **Type-Safe**: ESLint configuration for code quality

---

## 📞 Support & Contact

- **Maintainer**: [Yasser1728](https://github.com/Yasser1728)
- **Issues**: [GitHub Issues](https://github.com/Yasser1728/tec-ecosystem/issues)
- **Security**: See [SECURITY.md](./docs/SECURITY.md) for reporting vulnerabilities

---

## 📈 Project Status

🚧 **Active Development** - This project is under active development with regular updates.

See [CHANGELOG.md](./docs/CHANGELOG.md) for recent changes and upcoming features.

---

© 2024-2025 TEC Ecosystem - All Rights Reserved
