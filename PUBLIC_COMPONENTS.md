# Public Components (Open Source)

This document lists all open-source components available under MIT License.

## 📂 Public Components Structure

```
public-src/
├── components/
│   ├── Header.js                 # Global header
│   ├── Footer.js                 # Global footer
│   ├── BusinessUnitLayout.js     # Unified BU layout
│   └── ParticlesCanvas.js        # Background effects
│
├── lib/
│   ├── businessUnits.js          # BU configuration (public data)
│   └── utils.js                  # Utility functions
│
└── pages/
    ├── index.js                  # Landing page
    ├── ecosystem.js              # BU overview
    ├── 403.js                    # Error page
    ├── 404.js                    # Error page
    └── [business-units]/
        └── index.js              # BU landing pages (public)
```

## ✅ Open Source Components

### Components

- **Header.js** - Global navigation header
- **Footer.js** - Global footer with links
- **BusinessUnitLayout.js** - Reusable layout for business units
- **ParticlesCanvas.js** - Animated background

### Libraries

- **businessUnits.js** - Configuration for all 21 business units (metadata only)
- **utils.js** - Helper functions

### Pages (Public Access)

- **/** - Home/Landing page
- **/ecosystem** - Business units overview
- **/403** - Forbidden error page
- **/404** - Not found error page
- **/[unit]** - Business unit landing pages (e.g., /fundx, /explorer)

## 📜 License

All public components are licensed under **MIT License**.

See [LICENSE](../LICENSE) for full details.

## 🔒 Private Components

For proprietary features, see [PRIVATE_COMPONENTS.md](./PRIVATE_COMPONENTS.md)

---

**Note**: This is a dual-license project. Public components are open-source (MIT), while private components are proprietary.
