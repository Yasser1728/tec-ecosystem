# Scripts

This directory contains utility scripts for the TEC Ecosystem project.

## generate-domains.js

Safely generates domain folders for all 24 business units under the `apps/` directory.

### Features

- **Path Sanitization**: Uses `lib/safe-paths.js` to validate domain names
- **Path Traversal Protection**: Prevents directory traversal attacks
- **Error Handling**: Exits with code 1 if any validation fails

### Usage

```bash
node scripts/generate-domains.js
```

### Output

Creates the following structure:

```
apps/
├── fundx/
├── assets/
├── nbf/
├── insure/
├── vip/
├── life/
├── commerce/
├── ecommerce/
├── connection/
├── elite/
├── explorer/
├── brookfield/
├── zone/
├── dx/
├── nx/
├── system/
├── analytics/
├── alert/
├── titan/
├── epic/
├── legend/
├── nexus/
├── tec/
└── estate/
```

### Security

Domain names must:
- Be 1-63 characters long
- Contain only alphanumeric characters and hyphens
- Match the regex pattern: `/^[a-z0-9-]{1,63}$/i`

Any attempt to use path traversal patterns (e.g., `../`, `..\\`) will be blocked.
