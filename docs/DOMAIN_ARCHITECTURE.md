# Domain Architecture - TEC Ecosystem

## 🏛️ Sovereignty Concept

The TEC Ecosystem is built on a **sovereign domain architecture** where each of the 24 business units operates as an independent entity with its own:

- **Dedicated .pi domain** - Exclusive Pi Network presence
- **Independent value** - Autonomous business operations
- **Own analytics** - Separate tracking and monetization
- **Unique identity** - Distinct branding and positioning
- **Full autonomy** - Self-governing business decisions

This architecture ensures that each domain maintains its intrinsic value and can operate independently, while still being part of the larger TEC ecosystem.

## 💎 Value Preservation

### Why Sovereignty Matters

1. **Independent Valuation**: Each domain can be valued separately as a standalone business
2. **Scalability**: Domains can scale independently based on their specific needs
3. **Future-Proofing**: Domains can be spun off or separately deployed if needed
4. **Brand Identity**: Each domain maintains its unique market position
5. **Resource Allocation**: Independent analytics allow for targeted optimization

### Technical Benefits

- **Isolated Performance**: Issues in one domain don't affect others
- **Flexible Deployment**: Can deploy domains separately in the future
- **Targeted Optimization**: Each domain can be optimized for its specific use case
- **Independent Monetization**: Each domain can implement its own revenue model

## 🔧 Technical Implementation

### 1. Next.js Configuration (`next.config.js`)

The configuration includes:
- **Security headers** for all routes (X-Frame-Options, X-Content-Type-Options, X-DNS-Prefetch-Control)
- **Rewrites** for .pi domain routing (handled via middleware)

### 2. Middleware Intelligence Layer (`middleware.js`)

The middleware provides:
- **Domain detection** - Identifies .pi domains and extracts configuration
- **Custom headers** - Injects domain metadata into request headers:
  - `X-Domain-Name` - Domain name (English)
  - `X-Domain-Name-Ar` - Domain name (Arabic)
  - `X-Domain-Tier` - Business tier classification
  - `X-Domain-Theme` - Visual theme identifier
  - `X-Domain-Analytics` - Analytics tracking ID
  - `X-Domain-Independent` - Independence status
  - `X-Domain-Value` - Value proposition
- **Authentication routing** - Redirects to login for protected domains
- **Domain-specific logic** - Can implement per-domain business rules

### 3. Domain Registry (`lib/config/domain-registry.js`)

Centralized configuration containing:
- Complete metadata for all 24 sovereign domains
- Helper functions for domain lookup and filtering
- Tier classifications and theme mappings
- Authentication requirements
- Launch dates and status

### 4. Domain Info API (`pages/api/domain/info.js`)

REST endpoint that:
- Reads domain headers from middleware
- Returns domain metadata as JSON
- Provides fallback for non-.pi domains
- Enables frontend domain awareness

## 🌐 Domain Mapping

### Finance & Investment Tier (6 domains)
- **fundx.pi** - High-yield investment strategies
- **assets.pi** - Asset management and diversification
- **nbf.pi** - Next-generation banking and finance
- **insure.pi** - Comprehensive insurance solutions
- **vip.pi** - Exclusive VIP services *(requires auth)*
- **life.pi** - Life insurance and wealth protection

### Commerce & Trade Tier (4 domains)
- **commerce.pi** - B2B commerce and trade platform
- **ecommerce.pi** - Online marketplace and retail
- **connection.pi** - Business networking and partnerships
- **elite.pi** - Elite merchant services *(requires auth)*

### Real Estate Tier (4 domains)
- **estate.pi** - Real estate investment and management
- **brookfield.pi** - Premium real estate development
- **explorer.pi** - Property discovery and exploration
- **zone.pi** - Regional real estate zones

### Technology Tier (5 domains)
- **dx.pi** - Digital transformation services
- **nx.pi** - Next-generation technology solutions
- **system.pi** - Enterprise system integration
- **analytics.pi** - Business intelligence and analytics
- **alert.pi** - Real-time monitoring and alerts

### Authority & Legacy Tier (4 domains)
- **titan.pi** - Enterprise-level strategic services *(requires auth)*
- **nexus.pi** - Central connection hub
- **epic.pi** - Large-scale project management *(requires auth)*
- **legend.pi** - Legacy business solutions *(requires auth)*

### Hub (1 domain)
- **tec.pi** - Total Ecosystem Connection - Central Hub

**Total**: 24 sovereign domains

## 🔐 Authentication Flow

### Premium Domains Requiring Authentication

The following domains require Pi Network authentication:
- vip.pi
- elite.pi
- titan.pi
- epic.pi
- legend.pi

### Authentication Process

1. User accesses protected domain (e.g., vip.pi)
2. Middleware detects authentication requirement
3. User redirected to `/auth/signin` with:
   - `callbackUrl` parameter - original destination
   - `domain` parameter - requesting domain
4. After successful authentication, user returned to original destination
5. Domain headers include user context

### Implementation

```javascript
// In middleware.js
if (domainConfig.requiresAuth) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  if (!token) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    signInUrl.searchParams.set("domain", domainConfig.domain);
    return NextResponse.redirect(signInUrl);
  }
}
```

## 🚀 Future Scaling

### Path to Separate Deployments

The architecture is designed to support future scaling:

1. **Current State**: All domains in single Next.js deployment
   - Shared infrastructure
   - Unified deployment
   - Cost-effective for current scale

2. **Future State**: Independent deployments per domain
   - Each domain can have its own Vercel project
   - Independent scaling based on traffic
   - Domain-specific optimization
   - Isolated failure domains

3. **Migration Path**:
   ```
   Step 1: Extract domain to separate repo
   Step 2: Configure domain-specific deployment
   Step 3: Update DNS to point to new deployment
   Step 4: Maintain shared components via npm packages
   ```

### Infrastructure Considerations

- **CDN**: Each domain can have its own CDN configuration
- **Database**: Can migrate to domain-specific databases
- **API**: Can implement domain-specific API gateways
- **Analytics**: Already independent per domain
- **Monitoring**: Can implement per-domain monitoring

## 📊 Usage Examples

### Frontend: Fetching Domain Info

```javascript
import { useEffect, useState } from 'react';

export default function MyPage() {
  const [domainInfo, setDomainInfo] = useState(null);

  useEffect(() => {
    fetch('/api/domain/info')
      .then(res => res.json())
      .then(data => setDomainInfo(data));
  }, []);

  return (
    <div>
      {domainInfo && (
        <h1>{domainInfo.name} - {domainInfo.nameAr}</h1>
      )}
    </div>
  );
}
```

### Backend: Using Domain Registry

```javascript
import { getDomainConfig, getDomainsByTier } from './lib/config/domain-registry';

// Get specific domain
const fundxConfig = getDomainConfig('fundx.pi');

// Get all finance domains
const financeDomains = getDomainsByTier('Finance & Investment');

// Get all independent domains
const independentDomains = getIndependentDomains();
```

### API: Reading Domain Headers

```javascript
export default function handler(req, res) {
  const domainName = req.headers['x-domain-name'];
  const isIndependent = req.headers['x-domain-independent'] === 'true';
  
  // Implement domain-specific logic
  if (isIndependent) {
    // Handle sovereign domain
  }
}
```

## 🎨 Theme System

Each domain has a theme identifier that can be used for styling:

- `tec-gradient` - Finance domains (green-blue gradient)
- `premium-gold` - Premium/VIP domains (gold accents)
- `commerce-blue` - Commerce domains (blue theme)
- `estate-green` - Real estate domains (green theme)
- `tech-purple` - Technology domains (purple theme)
- `nexus-dark` - Authority domains (dark theme)
- `tec-primary` - Hub domain (primary TEC colors)

## 🔍 Monitoring & Analytics

Each domain has its own analytics identifier:
- Enables independent tracking
- Supports domain-specific KPIs
- Allows for monetization analysis
- Facilitates A/B testing per domain

## 📝 Best Practices

1. **Always check domain headers** when implementing domain-specific features
2. **Use domain registry** as single source of truth
3. **Respect authentication requirements** for premium domains
4. **Maintain independence** - avoid tight coupling between domains
5. **Document domain-specific logic** for future maintainability

## 🛠️ Development Guidelines

- Test with different .pi domains during development
- Verify authentication flows for premium domains
- Ensure domain headers are properly set
- Validate theme application per domain
- Test domain info API responses

## 📚 Additional Resources

- [Next.js Middleware Documentation](https://nextjs.org/docs/advanced-features/middleware)
- [Next.js Rewrites](https://nextjs.org/docs/api-reference/next.config.js/rewrites)
- [Pi Network Domain Setup](https://developers.minepi.com)

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Maintained By**: TEC Ecosystem Team
