# Database Sovereignty Architecture

## Overview

The TEC Ecosystem implements complete database sovereignty for all 24 domains, ensuring each domain has:
- ✅ Independent Prisma schema
- ✅ Isolated database client
- ✅ Separate database URL (optional)
- ✅ Full data ownership
- ✅ Independent deployment capability
- ✅ Complete transferability

## Architecture Principles

### 1. **Complete Data Ownership**
Each domain owns 100% of its data models and database structures. Domain-specific data cannot be accessed by other domains without explicit API integration.

### 2. **Independent Deployment**
Domains can be deployed, migrated, and scaled independently. Each domain's database can be hosted on separate servers, regions, or cloud providers.

### 3. **Transferability**
Domains can be sold, transferred, or spun off as independent businesses with their complete database intact.

### 4. **No Cross-Domain Dependencies**
Domain A cannot directly access Domain B's database tables. All inter-domain communication must go through APIs.

### 5. **Shared Infrastructure**
Core shared tables (User, Payment, NFT) remain in the central database for consistency across the ecosystem.

---

## Domain Databases

| Domain | Database Name | Schema Location | Client Location |
|--------|---------------|-----------------|-----------------|
| Life | life_db | apps/life/prisma/schema.prisma | apps/life/db/client.js |
| Assets | assets_db | apps/assets/prisma/schema.prisma | apps/assets/db/client.js |
| FundX | fundx_db | apps/fundx/prisma/schema.prisma | apps/fundx/db/client.js |
| NBF | nbf_db | apps/nbf/prisma/schema.prisma | apps/nbf/db/client.js |
| Insure | insure_db | apps/insure/prisma/schema.prisma | apps/insure/db/client.js |
| Commerce | commerce_db | apps/commerce/prisma/schema.prisma | apps/commerce/db/client.js |
| Ecommerce | ecommerce_db | apps/ecommerce/prisma/schema.prisma | apps/ecommerce/db/client.js |
| DX | dx_db | apps/dx/prisma/schema.prisma | apps/dx/db/client.js |
| Analytics | analytics_db | apps/analytics/prisma/schema.prisma | apps/analytics/db/client.js |
| System | system_db | apps/system/prisma/schema.prisma | apps/system/db/client.js |
| Alert | alert_db | apps/alert/prisma/schema.prisma | apps/alert/db/client.js |
| NX | nx_db | apps/nx/prisma/schema.prisma | apps/nx/db/client.js |
| Nexus | nexus_db | apps/nexus/prisma/schema.prisma | apps/nexus/db/client.js |
| Epic | epic_db | apps/epic/prisma/schema.prisma | apps/epic/db/client.js |
| Legend | legend_db | apps/legend/prisma/schema.prisma | apps/legend/db/client.js |
| VIP | vip_db | apps/vip/prisma/schema.prisma | apps/vip/db/client.js |
| Estate | estate_db | apps/estate/prisma/schema.prisma | apps/estate/db/client.js |
| Brookfield | brookfield_db | apps/brookfield/prisma/schema.prisma | apps/brookfield/db/client.js |
| Connection | connection_db | apps/connection/prisma/schema.prisma | apps/connection/db/client.js |
| Elite | elite_db | apps/elite/prisma/schema.prisma | apps/elite/db/client.js |
| Explorer | explorer_db | apps/explorer/prisma/schema.prisma | apps/explorer/db/client.js |
| Titan | titan_db | apps/titan/prisma/schema.prisma | apps/titan/db/client.js |
| Zone | zone_db | apps/zone/prisma/schema.prisma | apps/zone/db/client.js |
| TEC | tec_db | apps/tec/prisma/schema.prisma | apps/tec/db/client.js |

---

## Database Structure

### Shared Tables (prisma/schema.prisma)

**Core Identity & Authentication:**
- `User` - User accounts shared across all domains
- `Payment` - Payment transactions (PROTECTED)
- `NFT` - NFT ownership certificates

**Shared E-Commerce:**
- `Product` - Product catalog
- `Cart` / `CartItem` - Shopping cart
- `Order` / `OrderItem` - Order management

**Business Unit Management:**
- `BusinessUnit` - Domain configuration
- `BusinessUnitPage` - Domain pages
- `BusinessUnitFeature` - Domain features

**Activity & Subscriptions:**
- `UserActivity` - User activity tracking
- `Subscription` - Subscription management

**Security & Audit:**
- `AuditLog` - Forensic audit logs
- `SystemControl` - System-wide controls
- `Transfer` - Inter-domain transfers

### Domain-Specific Tables (apps/{domain}/prisma/schema.prisma)

Each domain has its own models specific to its business logic:

**Financial Domains** (life, assets, fundx, nbf):
- Portfolio
- Investment
- Transaction
- Account
- Statement

**Insurance Domain** (insure):
- Policy
- Claim
- Coverage
- Premium
- Beneficiary

**Commerce Domains** (commerce, ecommerce):
- Product (domain-specific)
- Order (domain-specific)
- Inventory
- Supplier
- Shipment

**Technology Domains** (dx, analytics, system, alert, nx, nexus):
- Service
- Metric
- Log
- Configuration
- Integration

**Premium Domains** (epic, legend, vip):
- Membership
- Benefit
- Tier
- Privilege
- Access

**Real Estate Domains** (estate, brookfield):
- Property
- Listing
- Valuation
- Offer
- Contract

**Networking Domains** (connection, elite):
- Network
- Contact
- Relationship
- Event
- Opportunity

**Travel Domain** (explorer):
- Destination
- Booking
- Itinerary
- Experience
- Travel

**Enterprise Domains** (titan, zone):
- Enterprise
- Solution
- Deployment
- Region
- License

**TEC Hub** (tec):
- Domain
- Integration
- Dashboard
- Report
- Analytics

---

## Usage Examples

### Using a Domain's Database Client

```javascript
// Import domain-specific client
import lifeDB from './apps/life/db/client.js';

// Query domain data
const portfolios = await lifeDB.portfolio.findMany({
  where: { userId: user.id },
  include: { investments: true }
});

// Create domain data
const newPortfolio = await lifeDB.portfolio.create({
  data: {
    userId: user.id,
    name: "Retirement Fund",
    type: "RETIREMENT"
  }
});
```

### Accessing Shared Tables

```javascript
// Import shared Prisma client
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Access shared User table
const user = await prisma.user.findUnique({
  where: { piId: 'user123' }
});

// Access shared Payment table
const payments = await prisma.payment.findMany({
  where: { 
    userId: user.id,
    domain: 'life'
  }
});
```

### Cross-Domain Data Access (via API)

```javascript
// ❌ WRONG: Direct database access across domains
import assetsDB from './apps/assets/db/client.js';
import lifeDB from './apps/life/db/client.js';
const data = await assetsDB.portfolio.findMany(); // Access assets domain
const moreData = await lifeDB.portfolio.findMany(); // Access life domain

// ✅ CORRECT: Use APIs for cross-domain access
const assetsData = await fetch('/api/assets/portfolios');
const lifeData = await fetch('/api/life/portfolios');
```

---

## Database Configuration

### Environment Variables

Each domain can have its own database URL:

```env
# Shared database (required)
DATABASE_URL="postgresql://user:password@localhost:5432/tec_ecosystem"

# Domain-specific databases (optional)
LIFE_DATABASE_URL="postgresql://user:password@localhost:5432/tec_life"
ASSETS_DATABASE_URL="postgresql://user:password@localhost:5432/tec_assets"
FUNDX_DATABASE_URL="postgresql://user:password@localhost:5432/tec_fundx"
# ... (all 24 domains)
```

If a domain-specific URL is not provided, the domain will use the shared `DATABASE_URL`.

### Database Client Configuration

Each domain's client is configured with:
- **Environment-based URL**: Uses domain-specific URL or falls back to shared URL
- **Singleton pattern**: Single client instance per domain
- **Logging**: Query logging in development, error logging in production
- **Connection pooling**: Managed by Prisma

---

## Migration Management

### Migrate All Domains

```bash
npm run migrate:all
```

This runs migrations for all 24 domains sequentially.

### Migrate Specific Domain

```bash
# Using npm script
DOMAIN=life npm run migrate:domain

# Using Prisma directly
npx prisma migrate dev --schema=apps/life/prisma/schema.prisma
```

### Generate All Prisma Clients

```bash
npm run generate:all
```

### Generate Specific Domain Client

```bash
npx prisma generate --schema=apps/life/prisma/schema.prisma
```

---

## Deployment Strategies

### Strategy 1: Shared Database (Default)
- All domains use single PostgreSQL database
- Schema-based isolation within database
- Simplest to manage
- Cost-effective for small scale

### Strategy 2: Separate Databases
- Each domain has its own PostgreSQL database
- Complete isolation and independence
- Better for large scale and domain sales
- Requires more infrastructure

### Strategy 3: Hybrid Approach
- Critical domains (finance, insurance) have separate databases
- Other domains share a database
- Balanced approach between isolation and cost

---

## Security & Compliance

### Data Isolation
- Domains cannot access each other's database tables
- All cross-domain access must go through authenticated APIs
- Forensic audit logs track all data access

### Independent Backups
- Each domain's database can be backed up independently
- Domain-specific backup schedules and retention policies
- Isolated disaster recovery procedures

### Compliance
- Domain-specific compliance requirements (GDPR, HIPAA, etc.)
- Independent data retention policies
- Isolated data encryption keys

---

## Domain Transfer Process

To transfer a domain to another owner:

1. **Export Domain Database**
```bash
pg_dump -t 'life_*' tec_ecosystem > life_domain_export.sql
```

2. **Copy Domain Code**
```bash
cp -r apps/life /path/to/new/owner/
```

3. **Import to New Database**
```bash
psql new_database < life_domain_export.sql
```

4. **Update Configuration**
```env
LIFE_DATABASE_URL="postgresql://newowner:password@newhost/new_database"
```

5. **Generate Client**
```bash
cd /path/to/new/owner/life
npx prisma generate --schema=prisma/schema.prisma
```

---

## Benefits

### For TEC Ecosystem
✅ Clean separation of concerns  
✅ Easier to maintain and scale  
✅ Better security isolation  
✅ Clearer domain boundaries  

### For Domain Operators
✅ Complete data ownership  
✅ Independent scaling  
✅ Flexible deployment options  
✅ Easy to transfer or sell  

### For Users
✅ Better data privacy  
✅ Clear data ownership  
✅ Domain-specific SLAs  
✅ Transparent data usage  

---

## Future Enhancements

### Phase 2: Multi-Region Support
- Deploy domains in different geographical regions
- Region-specific data residency
- Global load balancing

### Phase 3: Domain Marketplace
- Buy and sell domains with their databases
- Automated transfer process
- Domain valuation based on data

### Phase 4: Federated Queries
- Cross-domain analytics without data copying
- Privacy-preserving data sharing
- Distributed query engine

---

## Support

For questions or issues related to database sovereignty:
- Technical Documentation: `/docs`
- Issue Tracker: GitHub Issues
- Email: support@tec-ecosystem.com

---

**Last Updated:** February 11, 2026  
**Version:** 1.0.0
