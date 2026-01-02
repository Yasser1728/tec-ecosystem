# Generator Scripts Usage Guide

## Overview
This guide explains how to use the secure generator scripts for creating domains and application components.

## Prerequisites
- Node.js 18+ installed
- Repository cloned and dependencies installed (`npm install`)
- Write access to the project directory

## Scripts

### 1. Generate Domains Script

#### Location
`scripts/generate-domains.js`

#### Purpose
Securely generates domain configuration files and React component templates for new business units.

#### Usage

##### Basic Usage
```bash
node scripts/generate-domains.js <domain-name>
```

##### With Options
```bash
node scripts/generate-domains.js <domain-name> --domain=<domain.pi> --category=<category> --priority=<tier> --status=<status> --description="<description>"
```

#### Examples

**Example 1: Basic Domain Generation**
```bash
node scripts/generate-domains.js fundx
```
This creates:
- `domains/fundx/` directory
- `domains/fundx/config.json` with domain configuration
- `domains/fundx/index.js` with React component template

**Example 2: Domain with Full Configuration**
```bash
node scripts/generate-domains.js fundx \
  --domain=fundx.pi \
  --category=Financial \
  --priority="Tier 1" \
  --status=active \
  --description="Investment and financial services platform"
```

**Example 3: Creating Multiple Domains**
```bash
# Financial domain
node scripts/generate-domains.js fundx --domain=fundx.pi --category=Financial

# Technology domain
node scripts/generate-domains.js explorer --domain=explorer.pi --category=Technology

# Commerce domain
node scripts/generate-domains.js commerce --domain=commerce.pi --category=Commerce
```

#### Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `name` | Yes | - | Domain name (alphanumeric, hyphens, underscores only) |
| `--domain` | No | `<name>.pi` | Full domain name |
| `--category` | No | `General` | Business category |
| `--priority` | No | `Tier 3` | Priority tier (Tier 1, 2, or 3) |
| `--status` | No | `active` | Domain status |
| `--description` | No | Auto-generated | Domain description |

#### Output Structure
```
domains/<name>/
├── config.json      # Domain configuration
└── index.js         # React component template
```

#### Security Features
- ✅ Validates domain names (no special characters or path traversal)
- ✅ Prevents directory traversal attacks
- ✅ Sanitizes all user inputs
- ✅ Validates all paths before file operations
- ✅ Proper error handling with descriptive messages

#### Validation Rules
- Name must contain only: letters, numbers, hyphens, underscores
- Name cannot contain: dots, slashes, special characters
- Name length: 1-50 characters
- Name cannot be: `..`, `.`, or any path traversal pattern

### 2. Generate App Script

#### Location
`scripts/generate-app.js`

#### Purpose
Securely generates application component files with styles and documentation.

#### Usage

##### Basic Usage
```bash
node scripts/generate-app.js <app-name>
```

##### With Options
```bash
node scripts/generate-app.js <app-name> --type=<component-type> --description="<description>"
```

#### Examples

**Example 1: Basic Component**
```bash
node scripts/generate-app.js my-component
```
This creates:
- `components/my-component/` directory
- `components/my-component/index.js` with React component
- `components/my-component/styles.module.css` with base styles
- `components/my-component/README.md` with documentation

**Example 2: Component with Full Configuration**
```bash
node scripts/generate-app.js payment-form \
  --type=functional \
  --description="Secure payment form component for Pi Network transactions"
```

**Example 3: Creating Multiple Components**
```bash
# Dashboard widget
node scripts/generate-app.js dashboard-widget --type=functional

# User profile card
node scripts/generate-app.js user-profile --type=functional

# Transaction history
node scripts/generate-app.js transaction-list --type=functional
```

#### Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `name` | Yes | - | Component name (alphanumeric, hyphens, underscores only) |
| `--type` | No | `functional` | Component type |
| `--description` | No | Auto-generated | Component description |

#### Output Structure
```
components/<name>/
├── index.js           # React component
├── styles.module.css  # Component styles
└── README.md          # Component documentation
```

#### Security Features
- ✅ Validates component names (no special characters or path traversal)
- ✅ Prevents directory traversal attacks
- ✅ Sanitizes all user inputs
- ✅ Validates all paths before file operations
- ✅ Proper error handling with descriptive messages

#### Validation Rules
- Same validation rules as generate-domains script
- Name must be valid JavaScript identifier-friendly
- No file extensions in name

## Error Handling

### Common Errors

#### Invalid Name Error
```
❌ Error generating domain: Invalid name: "../etc/passwd"
Only alphanumeric characters, hyphens, and underscores are allowed.
```

**Solution:** Use only valid characters in the name.

#### Path Traversal Error
```
❌ Error generating domain: Path traversal detected
```

**Solution:** Remove any `..`, `/`, or `\` from the name.

#### Permission Error
```
❌ Failed to create directory: permission denied
```

**Solution:** Ensure you have write permissions in the project directory.

#### Directory Exists
The scripts handle existing directories gracefully and will not overwrite existing files.

## Best Practices

### 1. Naming Conventions
- Use lowercase for consistency
- Use hyphens for multi-word names: `user-profile`, `payment-form`
- Keep names descriptive but concise
- Avoid abbreviations that aren't clear

### 2. Domain Organization
- Group related domains by category
- Use consistent priority tiers
- Document domain purposes in descriptions

### 3. Component Organization
- Create focused, single-purpose components
- Include comprehensive README for each component
- Follow project style guidelines

### 4. Security
- Never use user input directly in paths
- Always use the generator scripts for file creation
- Review generated files before committing
- Test components in isolation

## Integration with Project

### After Generation

#### For Domains
1. Review generated files
2. Add routing configuration
3. Update domain mapping in `lib/domainMapping.js`
4. Add to business units configuration
5. Test the domain route

#### For Components
1. Review generated component
2. Customize styles as needed
3. Add to storybook (if applicable)
4. Write tests for the component
5. Import and use in pages

## Security Testing

### Testing Generated Code
```bash
# Run security tests
npm test -- tests/unit/path-security.test.js

# Run domain generator tests
npm test -- tests/unit/generate-domains.test.js

# Run CodeQL security scanner
npm run security:check
```

### Manual Security Review
1. Verify no path traversal in generated paths
2. Check file permissions are correct
3. Ensure no sensitive data in generated files
4. Validate generated code follows security guidelines

## Troubleshooting

### Script Not Executable
```bash
chmod +x scripts/generate-domains.js
chmod +x scripts/generate-app.js
```

### Module Not Found
```bash
npm install
```

### Path Issues
- Ensure you're running from the project root
- Check that base directories exist
- Verify file system permissions

## Advanced Usage

### Custom Templates
To customize templates, edit the template generation functions in the scripts:
- `generateIndexTemplate()` in `generate-domains.js`
- `generateComponentTemplate()` in `generate-app.js`

### Programmatic Usage
```javascript
const { generateDomain } = require('./scripts/generate-domains');

const config = {
  name: 'my-domain',
  domain: 'my-domain.pi',
  category: 'Technology',
  priority: 'Tier 2',
  status: 'active'
};

generateDomain(config);
```

## Support

For issues or questions:
1. Check this guide
2. Review test files for examples
3. Check security summary: `SECURITY_SUMMARY.md`
4. Open an issue on GitHub

## Related Documentation

- [Security Summary](./SECURITY_SUMMARY.md)
- [Path Security API](./lib/utils/path-security.js)
- [Test Examples](./tests/unit/)
- [Project README](./README.md)

---

**Last Updated:** January 2, 2024  
**Version:** 1.0
