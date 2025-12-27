# TEC Ecosystem File Structure

## Overview

The TEC Ecosystem project is organized to clearly separate **open-source** (public) components from **proprietary** (private) components. This structure facilitates:

- Clear licensing boundaries (MIT vs Proprietary)
- Easy identification of what can be shared publicly
- Better organization of business logic and UI components
- Simplified contribution guidelines

---

## Directory Structure

```
tec-ecosystem/
│
├── public/                          # ✅ Open Source (MIT License)
│   ├── components/                  # Reusable UI components
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── HomeHeader.js
│   │   │   └── HomeFooter.js
│   │   ├── ui/                      # UI components
│   │   │   ├── ServiceCard.js
│   │   │   ├── ParticlesCanvas.js
│   │   │   └── LanguageToggle.js
│   │   └── domain/                  # Domain-specific components
│   │       ├── DomainCard.js
│   │       ├── DomainHeader.js
│   │       └── DomainList.js
│   │
│   ├── pages/                       # Page implementations (reference copies)
│   │   ├── tec/, zone/, vip/, nbf/, titan/, nx/
│   │   ├── analytics/, assets/, commerce/, connection/
│   │   ├── dx/, elite/, epic/, estate/, explorer/
│   │   ├── fundx/, insure/, legend/, life/, nexus/
│   │   └── sab/, system/, alert/, app/
│   │
│   ├── styles/                      # Global styles
│   │   └── globals.css
│   │
│   ├── hooks/                       # Custom React hooks (to be added)
│   └── utils/                       # Utility functions (to be added)
│
├── private/                         # 🔒 Proprietary (Closed Source)
│   ├── api/
│   │   └── payments/                # Payment API endpoints
│   │       ├── create-payment.js
│   │       ├── approve.js
│   │       └── complete.js
│   │
│   ├── strategies/                  # Business strategies
│   │   └── strategy.js
│   │
│   ├── integrations/                # Platform integrations
│   │   └── integration.js
│   │
│   ├── ecommerce/                   # E-commerce platform
│   │   └── index.js
│   │
│   ├── notifications/               # Alert system
│   │   └── index.js
│   │
│   ├── legacy/                      # Legacy systems
│   │   └── legacy.js
│   │
│   ├── PRIVATE.md                   # Private files documentation
│   └── LICENSE_PROPRIETARY          # Proprietary license
│
├── pages/                           # Next.js routing (required by framework)
│   ├── index.js                     # Main entry point
│   ├── document.js                  # Custom document
│   ├── api/                         # API routes
│   │   ├── health.js                # Health check endpoint (public)
│   │   └── auth/                    # Authentication endpoints
│   └── [all domain pages]/          # Import from public/components
│
├── components/                      # Re-exports for backward compatibility
│   ├── Header.js                    # → public/components/layout/Header.js
│   ├── Footer.js                    # → public/components/layout/Footer.js
│   ├── ServiceCard.js               # → public/components/ui/ServiceCard.js
│   ├── ParticlesCanvas.js           # → public/components/ui/ParticlesCanvas.js
│   └── [other components]           # All re-export from public/
│
├── styles/                          # Original styles directory
│   └── globals.css                  # Kept for backward compatibility
│
├── lib/                             # Core business logic
├── middleware/                      # Express/Next.js middleware
├── prisma/                          # Database schema
├── tests/                           # Test files
├── docs/                            # Documentation
├── scripts/                         # Build and automation scripts
│
├── README.md                        # Main documentation (open source)
├── README_AR.md                     # Arabic documentation
├── LICENSE                          # MIT License (for public files)
├── CODE_OF_CONDUCT.md               # Community guidelines
├── CONTRIBUTING.md                  # Contribution guidelines
├── package.json                     # Project dependencies
├── next.config.js                   # Next.js configuration (with aliases)
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
└── .gitignore                       # Git ignore rules
```

---

## Import Paths

### Using Webpack Aliases (Recommended)

The `next.config.js` file defines the following aliases:

```javascript
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import ServiceCard from '@components/ui/ServiceCard';
import globals from '@styles/globals.css';
```

### Using Relative Paths

```javascript
// From pages/
import Header from '../public/components/layout/Header';
import Footer from '../public/components/layout/Footer';

// From nested pages/
import Header from '../../public/components/layout/Header';
import Footer from '../../public/components/layout/Footer';
```

### Using Re-exports (Backward Compatibility)

```javascript
// Still works for existing code
import Header from '../components/Header';
import Footer from '../components/Footer';
```

---

## License Information

### Open Source Files (MIT License)

All files in the `public/` directory are licensed under the MIT License:

- `public/components/` - All UI components
- `public/pages/` - Page implementations
- `public/styles/` - Styling files
- `public/hooks/` - React hooks
- `public/utils/` - Utility functions

### Proprietary Files

All files in the `private/` directory are proprietary:

- Business logic and algorithms
- Payment processing
- Strategic guidance systems
- E-commerce platform features
- Integration APIs
- Legacy system code

See `private/PRIVATE.md` for access requirements and usage restrictions.

---

## Contributing

### For Open Source Contributors

1. Focus on files in `public/` directory
2. Follow the component structure
3. Add tests for new components
4. Update documentation

### For Internal Developers

1. Keep proprietary logic in `private/` directory
2. Ensure proper authentication for private features
3. Follow security best practices
4. Never expose private APIs publicly

---

## Migration Guide

### For Existing Code

All existing imports will continue to work due to re-exports in the `components/` directory:

```javascript
// Old import (still works)
import Header from '../components/Header';

// New import (recommended)
import Header from '../public/components/layout/Header';

// Or using alias
import Header from '@components/layout/Header';
```

### For New Code

Use the new structure:

1. Place UI components in `public/components/`
2. Place business logic in `lib/` or `private/`
3. Use webpack aliases for cleaner imports
4. Follow the established directory structure

---

## Best Practices

1. **Separation of Concerns**: Keep UI components separate from business logic
2. **Licensing**: Respect the boundaries between public/ and private/
3. **Documentation**: Document all public APIs and components
4. **Testing**: Write tests for all public components
5. **Security**: Never expose private keys or business logic in public files

---

## Questions?

- **Technical Support**: support@tec-ecosystem.com
- **Security Issues**: security@tec-ecosystem.com
- **Contributions**: See CONTRIBUTING.md

---

**Last Updated**: 2024-12-27
**Maintained By**: TEC Development Team
