# 🔧 W3SA Remediation Plan - خطة الإصلاح التفصيلية
## TEC Ecosystem Security Remediation Roadmap

**تاريخ الإنشاء:** 2026-01-21  
**المسؤول:** Security Team + Development Team  
**الحالة:** 🔴 ACTIVE - CRITICAL REMEDIATION IN PROGRESS

---

## 🚨 PHASE 0: EMERGENCY RESPONSE (0-24 hours)

### W3SA-SECRET-001: Git History Cleanup

**Priority:** 🔴 **P0 - CRITICAL**  
**Assignee:** @security-lead + @devops-lead  
**Deadline:** 2026-01-22 12:00 UTC

#### Step 1: Repository Backup (1 hour)
```bash
# Create full backup before any operation
git clone --mirror https://github.com/tec-ecosystem/tec-ecosystem.git backup-2026-01-21
cd backup-2026-01-21
tar -czf ../tec-ecosystem-backup-2026-01-21.tar.gz .
```

**Verification:**
```bash
# Verify backup integrity
sha256sum tec-ecosystem-backup-2026-01-21.tar.gz > backup-checksum.txt
```

#### Step 2: Remove .env from Git History (2 hours)

**Option A: BFG Repo-Cleaner (Recommended)**
```bash
# Install BFG
brew install bfg  # macOS
# or
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Clone mirror
git clone --mirror https://github.com/tec-ecosystem/tec-ecosystem.git tec-clean

# Remove .env file
java -jar bfg-1.14.0.jar --delete-files .env tec-clean

# Clean up
cd tec-clean
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Verify .env is gone
git log --all --full-history --oneline -- .env
# Output should be empty

# Push changes (requires force)
git push --force
```

**Option B: git-filter-repo (Alternative)**
```bash
# Install git-filter-repo
pip3 install git-filter-repo

# Clone repository
git clone https://github.com/tec-ecosystem/tec-ecosystem.git tec-clean
cd tec-clean

# Remove .env from all commits
git filter-repo --path .env --invert-paths --force

# Verify
git log --all --oneline -- .env
# Output should be empty

# Push
git remote add origin https://github.com/tec-ecosystem/tec-ecosystem.git
git push origin --force --all
git push origin --force --tags
```

**Verification Checklist:**
- [ ] `.env` not found in `git log --all -- .env`
- [ ] `.env` not found in `git ls-files`
- [ ] All branches cleaned
- [ ] All tags cleaned
- [ ] Backup verified and stored securely

#### Step 3: Secret Rotation (3 hours)

**3.1 Database Credentials**
```bash
# 1. Create new database password
NEW_DB_PASSWORD=$(openssl rand -base64 32)

# 2. Update PostgreSQL user password
psql -U postgres -c "ALTER USER tec_user WITH PASSWORD '$NEW_DB_PASSWORD';"

# 3. Update DATABASE_URL in GitHub Secrets
gh secret set DATABASE_URL -b "postgresql://tec_user:$NEW_DB_PASSWORD@host:5432/tec_db"

# 4. Update Vercel environment variable
vercel env rm DATABASE_URL production
vercel env add DATABASE_URL production
# Paste new DATABASE_URL when prompted

# 5. Verify connection
psql "$NEW_DATABASE_URL" -c "SELECT 1;"
```

**3.2 OPENROUTER_API_KEY**
```bash
# 1. Login to OpenRouter dashboard
# 2. Revoke old key
# 3. Generate new key
# 4. Update GitHub Secret
gh secret set OPENROUTER_API_KEY -b "sk-or-v1-xxxxx"

# 5. Update Vercel
vercel env rm OPENROUTER_API_KEY production
vercel env add OPENROUTER_API_KEY production

# 6. Test new key
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $NEW_OPENROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"openai/gpt-3.5-turbo","messages":[{"role":"user","content":"test"}]}'
```

**3.3 PI_API_KEY**
```bash
# 1. Login to Pi Developer Portal: https://developers.minepi.com
# 2. Navigate to: Dashboard > API Keys
# 3. Revoke old key
# 4. Generate new key
# 5. Update GitHub Secret
gh secret set PI_API_KEY -b "new-pi-api-key-xxxxx"

# 6. Update Vercel
vercel env rm PI_API_KEY production
vercel env add PI_API_KEY production

# 7. Test new key
curl -X GET https://api.minepi.com/v2/me \
  -H "Authorization: Key $NEW_PI_API_KEY"
```

**3.4 NEXTAUTH_SECRET**
```bash
# 1. Generate new secret
NEW_NEXTAUTH_SECRET=$(openssl rand -base64 32)

# 2. Update GitHub Secret
gh secret set NEXTAUTH_SECRET -b "$NEW_NEXTAUTH_SECRET"

# 3. Update Vercel
vercel env rm NEXTAUTH_SECRET production
vercel env add NEXTAUTH_SECRET production

# 4. Note: This will invalidate all existing sessions
# Users will need to log in again
```

**Secret Rotation Verification:**
```bash
# Verify all secrets are updated
gh secret list

# Expected output:
# DATABASE_URL          Updated 2026-01-21
# OPENROUTER_API_KEY    Updated 2026-01-21
# PI_API_KEY            Updated 2026-01-21
# NEXTAUTH_SECRET       Updated 2026-01-21
```

#### Step 4: Git Configuration Hardening (30 minutes)

**4.1 Update .gitignore**
```bash
# Append to .gitignore
cat >> .gitignore << 'EOF'

# ============================================
# Security: NEVER COMMIT SECRETS
# ============================================
# Environment files
.env*
!.env.example

# Backup files
*.backup
*.bak

# Keys and certificates
*.key
*.pem
*.p12
*.pfx

# Database dumps
*.sql
*.dump

# Credentials
credentials.json
secrets.yaml
EOF

git add .gitignore
git commit -m "security: enforce strict .gitignore rules"
git push
```

**4.2 Install git-secrets**
```bash
# Install git-secrets
brew install git-secrets  # macOS
# or
apt-get install git-secrets  # Linux

# Setup for repository
cd /path/to/tec-ecosystem
git secrets --install
git secrets --register-aws

# Add custom patterns
git secrets --add 'OPENROUTER_API_KEY'
git secrets --add 'PI_API_KEY'
git secrets --add 'DATABASE_URL.*postgres'
git secrets --add 'NEXTAUTH_SECRET'
git secrets --add --allowed 'env.example'

# Test
echo "OPENROUTER_API_KEY=sk-test" > test.txt
git add test.txt
# Should fail with: "test.txt:1:OPENROUTER_API_KEY"
rm test.txt
```

**4.3 Setup Pre-commit Hook**
```bash
# Create .husky/pre-commit
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run git-secrets
git secrets --pre_commit_hook -- "$@"

# Run secret scanner
echo "🔍 Scanning for secrets..."
if grep -r "sk-or-v1" --include="*.js" --include="*.ts" .; then
  echo "❌ Found potential API key!"
  exit 1
fi

echo "✅ No secrets detected"
EOF

chmod +x .husky/pre-commit
```

#### Step 5: Access Log Review (2 hours)

**5.1 GitHub Access Audit**
```bash
# Get repository access log (requires org admin)
gh api repos/tec-ecosystem/tec-ecosystem/traffic/clones
gh api repos/tec-ecosystem/tec-ecosystem/traffic/views

# Check for suspicious activity
gh api repos/tec-ecosystem/tec-ecosystem/events | jq '.[] | select(.type == "PushEvent")'
```

**5.2 Database Access Audit**
```sql
-- Check for suspicious connections
SELECT 
  datname,
  usename,
  application_name,
  client_addr,
  backend_start,
  state
FROM pg_stat_activity
WHERE datname = 'tec_db'
ORDER BY backend_start DESC
LIMIT 50;

-- Check for data exports
SELECT 
  query,
  calls,
  total_exec_time,
  rows
FROM pg_stat_statements
WHERE query LIKE '%COPY%' OR query LIKE '%pg_dump%'
ORDER BY total_exec_time DESC;
```

**5.3 API Usage Audit**
```bash
# OpenRouter usage
curl https://openrouter.ai/api/v1/usage \
  -H "Authorization: Bearer $OLD_OPENROUTER_KEY"

# Pi Network transactions
curl https://api.minepi.com/v2/payments \
  -H "Authorization: Key $OLD_PI_API_KEY"
```

#### Step 6: Team Notification (30 minutes)

**Email Template:**
```
Subject: 🚨 URGENT: Security Incident Response - Action Required

Team,

We have identified a critical security issue (W3SA-SECRET-001) where 
environment variables were exposed in our Git repository.

ACTIONS TAKEN:
✅ Repository history cleaned
✅ All API keys rotated
✅ Database credentials updated
✅ Git security hardening implemented

ACTIONS REQUIRED FROM YOU:
1. Pull latest changes immediately
2. Update your local .env file (DO NOT COMMIT)
3. Contact DevOps for new credentials
4. Review the security policy: SECURITY.md

WHAT CHANGED:
- All users will need to log in again (sessions invalidated)
- API integrations may need credential updates
- Database connections will reconnect automatically

If you have any questions, contact @security-team immediately.

Thank you,
Security Team
```

---

## 🟠 PHASE 1: HIGH PRIORITY FIXES (Days 2-7)

### W3SA-CORS-001: Fix CORS Configuration

**Priority:** 🟠 **P1 - HIGH**  
**Assignee:** @backend-team  
**Deadline:** 2026-01-28

#### Implementation:

**File: `middleware/cors.js`**
```javascript
// Create centralized CORS middleware

const ALLOWED_ORIGINS = [
  'https://tec.piblockchain.com',
  'https://commerce.piblockchain.com',
  'https://finance.piblockchain.com',
  'https://wallet.piblockchain.com',
  // Add all 24 domains
];

// Allow localhost only in development
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000');
  ALLOWED_ORIGINS.push('http://localhost:3001');
}

export function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  // Check if origin is allowed
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  } else {
    // Log unauthorized origin attempts
    console.warn('[CORS] Blocked origin:', origin);
    return res.status(403).json({ 
      error: 'Origin not allowed',
      message: 'Your domain is not authorized to access this API'
    });
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
}
```

**Apply to all payment APIs:**
```javascript
// pages/api/payments/approve.js
import { corsMiddleware } from '../../../middleware/cors';

export default async function handler(req, res) {
  // Apply CORS first
  await new Promise((resolve) => corsMiddleware(req, res, resolve));
  
  // Rest of handler...
}
```

**Testing:**
```javascript
// tests/security/cors.test.js
describe('CORS Security', () => {
  test('should allow requests from whitelisted origins', async () => {
    const response = await fetch('/api/payments/approve', {
      method: 'POST',
      headers: {
        'Origin': 'https://tec.piblockchain.com',
        'Content-Type': 'application/json'
      }
    });
    
    expect(response.headers.get('Access-Control-Allow-Origin'))
      .toBe('https://tec.piblockchain.com');
  });
  
  test('should block requests from unknown origins', async () => {
    const response = await fetch('/api/payments/approve', {
      method: 'POST',
      headers: {
        'Origin': 'https://evil.com',
        'Content-Type': 'application/json'
      }
    });
    
    expect(response.status).toBe(403);
  });
});
```

---

### W3SA-INPUT-001: Input Validation Implementation

**Priority:** 🟠 **P1 - HIGH**  
**Assignee:** @backend-team  
**Deadline:** 2026-01-28

#### Step 1: Install Validation Library
```bash
npm install zod
```

#### Step 2: Create Validation Schemas

**File: `lib/validations/payment.js`**
```javascript
import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  amount: z.number()
    .positive('Amount must be positive')
    .max(1000000, 'Amount exceeds maximum limit')
    .finite('Amount must be a finite number'),
  
  memo: z.string()
    .max(500, 'Memo exceeds 500 characters')
    .optional(),
  
  domain: z.string()
    .regex(/^[a-z]+$/, 'Domain must contain only lowercase letters')
    .min(2, 'Domain too short')
    .max(20, 'Domain too long'),
  
  userId: z.string()
    .cuid('Invalid user ID format'),
  
  category: z.enum([
    'general',
    'domain',
    'nft',
    'subscription',
    'ecommerce'
  ]),
  
  metadata: z.record(z.any())
    .optional()
});

export const ApprovePaymentSchema = z.object({
  paymentId: z.string()
    .min(1, 'Payment ID required'),
  
  internalId: z.string()
    .cuid('Invalid internal ID format')
    .optional(),
  
  amount: z.number()
    .positive()
    .optional(),
  
  domain: z.string()
    .regex(/^[a-z]+$/)
    .optional()
});
```

**File: `lib/validations/nft.js`**
```javascript
import { z } from 'zod';

export const MintNFTSchema = z.object({
  domainName: z.string()
    .regex(/^[a-z0-9-]+$/, 'Invalid domain name format')
    .min(2)
    .max(50),
  
  certificateType: z.enum(['ownership', 'access', 'premium']),
  
  userId: z.string().cuid(),
  
  metadata: z.object({
    tier: z.enum(['STANDARD', 'PREMIUM', 'VIP']).optional(),
    expiresAt: z.date().optional()
  }).optional()
});
```

#### Step 3: Apply Validation to APIs

**File: `pages/api/payments/create-payment.js`**
```javascript
import { CreatePaymentSchema } from '../../../lib/validations/payment';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ✅ Validate input
    const validated = CreatePaymentSchema.parse(req.body);
    
    // Now use validated data (guaranteed to be correct)
    const { amount, memo, domain, userId, category, metadata } = validated;
    
    // Rest of implementation...
    
  } catch (error) {
    // Zod validation error
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    
    // Other errors
    console.error('Payment creation error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}
```

#### Step 4: Create Validation Middleware

**File: `middleware/validation.js`**
```javascript
import { z } from 'zod';

export function validateBody(schema) {
  return async (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors
        });
      }
      next(error);
    }
  };
}

export function validateQuery(schema) {
  return async (req, res, next) => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: error.errors
        });
      }
      next(error);
    }
  };
}
```

#### Step 5: Testing

**File: `tests/unit/validation.test.js`**
```javascript
describe('Input Validation', () => {
  describe('CreatePaymentSchema', () => {
    test('should accept valid payment data', () => {
      const valid = {
        amount: 100,
        memo: 'Test payment',
        domain: 'commerce',
        userId: 'clxxx123456789',
        category: 'general'
      };
      
      expect(() => CreatePaymentSchema.parse(valid)).not.toThrow();
    });
    
    test('should reject negative amount', () => {
      const invalid = {
        amount: -100,
        domain: 'commerce',
        userId: 'clxxx123456789',
        category: 'general'
      };
      
      expect(() => CreatePaymentSchema.parse(invalid)).toThrow('Amount must be positive');
    });
    
    test('should reject invalid domain', () => {
      const invalid = {
        amount: 100,
        domain: 'Commerce123',  // uppercase and numbers
        userId: 'clxxx123456789',
        category: 'general'
      };
      
      expect(() => CreatePaymentSchema.parse(invalid)).toThrow('Domain must contain only lowercase');
    });
  });
});
```

---

### W3SA-ACCESS-001: RBAC Enhancement

**Priority:** 🟠 **P1 - HIGH**  
**Assignee:** @security-team  
**Deadline:** 2026-01-28

#### Step 1: Define Roles

**File: `lib/roles/definitions.js`**
```javascript
export const ROLES = {
  ADMIN: 'admin',
  SECURITY_OFFICER: 'security_officer',
  FINANCIAL_MANAGER: 'financial_manager',
  USER: 'user',
  GUEST: 'guest'
};

export const PERMISSIONS = {
  // System Control
  CIRCUIT_BREAKER_TOGGLE: 'circuit_breaker:toggle',
  SYSTEM_INTEGRITY_VIEW: 'system_integrity:view',
  SYSTEM_INTEGRITY_MODIFY: 'system_integrity:modify',
  
  // Audit Logs
  AUDIT_LOGS_VIEW: 'audit_logs:view',
  AUDIT_LOGS_EXPORT: 'audit_logs:export',
  
  // Payments
  PAYMENT_CREATE: 'payment:create',
  PAYMENT_APPROVE: 'payment:approve',
  PAYMENT_REFUND: 'payment:refund',
  
  // Users
  USER_VIEW: 'user:view',
  USER_MODIFY: 'user:modify',
  USER_DELETE: 'user:delete'
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    ...Object.values(PERMISSIONS)  // All permissions
  ],
  
  [ROLES.SECURITY_OFFICER]: [
    PERMISSIONS.CIRCUIT_BREAKER_TOGGLE,
    PERMISSIONS.SYSTEM_INTEGRITY_VIEW,
    PERMISSIONS.SYSTEM_INTEGRITY_MODIFY,
    PERMISSIONS.AUDIT_LOGS_VIEW,
    PERMISSIONS.AUDIT_LOGS_EXPORT,
    PERMISSIONS.USER_VIEW
  ],
  
  [ROLES.FINANCIAL_MANAGER]: [
    PERMISSIONS.PAYMENT_APPROVE,
    PERMISSIONS.PAYMENT_REFUND,
    PERMISSIONS.AUDIT_LOGS_VIEW,
    PERMISSIONS.USER_VIEW
  ],
  
  [ROLES.USER]: [
    PERMISSIONS.PAYMENT_CREATE,
    PERMISSIONS.USER_VIEW  // Own profile only
  ],
  
  [ROLES.GUEST]: []
};
```

#### Step 2: Permission Checking Middleware

**File: `lib/auth/permissions.js`**
```javascript
import { ROLE_PERMISSIONS } from '../roles/definitions';

export function hasPermission(userRole, requiredPermission) {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(requiredPermission);
}

export function requirePermission(permission) {
  return async (req, res, next) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
    
    const userRole = session.user.role || 'user';
    
    if (!hasPermission(userRole, permission)) {
      // Log permission denial
      await createAuditEntry({
        user: session.user,
        operationType: 'permission_denied',
        operationData: {
          requiredPermission: permission,
          userRole,
          endpoint: req.url
        },
        request: {
          ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          userAgent: req.headers['user-agent']
        }
      });
      
      return res.status(403).json({
        error: 'Forbidden',
        message: `You don't have permission: ${permission}`
      });
    }
    
    req.user = session.user;
    next();
  };
}
```

#### Step 3: Apply to Protected Endpoints

**File: `pages/api/system-control/circuit-breaker.js`**
```javascript
import { requirePermission } from '../../../lib/auth/permissions';
import { PERMISSIONS } from '../../../lib/roles/definitions';

async function handler(req, res) {
  // Handler logic...
}

export default requirePermission(PERMISSIONS.CIRCUIT_BREAKER_TOGGLE)(handler);
```

---

## 🟡 PHASE 2: MEDIUM PRIORITY (Days 8-14)

### W3SA-ERROR-001 & W3SA-RATELIMIT-001

(Detailed plans available in full audit report)

---

## ⚪ PHASE 3: LOW PRIORITY (Days 15-30)

### W3SA-LOG-001 & W3SA-DOC-001

(Detailed plans available in full audit report)

---

## 📊 Progress Tracking

### Daily Standup Format:
```
✅ Completed:
- [List completed items]

🚧 In Progress:
- [List items being worked on]

🔴 Blocked:
- [List blockers]

📅 Next 24h:
- [List planned work]
```

### Weekly Security Report:
```
Week [X] - Security Remediation Progress

Critical: [X/1] ✅
High:     [X/3] 🟡
Medium:   [X/2] ⚪
Low:      [X/4] ⚪

Key Achievements:
- ...

Challenges:
- ...

Next Week Plan:
- ...
```

---

## ✅ Completion Criteria

### Phase 0 (Emergency):
- [ ] .env removed from Git history
- [ ] All secrets rotated
- [ ] git-secrets installed
- [ ] Access logs reviewed
- [ ] Team notified

### Phase 1 (High Priority):
- [ ] CORS fixed with whitelist
- [ ] Input validation on all 22 APIs
- [ ] RBAC implemented on admin endpoints
- [ ] Security tests passing

### Phase 2 (Medium Priority):
- [ ] Error handling sanitized
- [ ] Rate limiting hardened
- [ ] Additional audit logging

### Phase 3 (Low Priority):
- [ ] Documentation complete
- [ ] All recommendations implemented

---

## 🎯 Success Metrics

| Metric | Before | Target | Current |
|--------|--------|--------|---------|
| Security Score | 68/100 | 95/100 | TBD |
| Critical Issues | 1 | 0 | TBD |
| High Issues | 3 | 0 | TBD |
| Test Coverage | 85% | 95% | TBD |
| OWASP Compliance | 80% | 95% | TBD |

---

**Document Owner:** Security Team  
**Last Updated:** 2026-01-21  
**Next Review:** 2026-01-28

---

# 🔐 END OF REMEDIATION PLAN
