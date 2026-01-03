# Micro OS - Sovereignty Architecture

**نظام التشغيل الصغير - معمارية السيادة البرمجية**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

> A sovereign software architecture for building secure, auditable micro-applications with complete oversight and forensic tracking.

**Sovereign Contact:** yasserrr.fox17@gmail.com  
**Architecture:** Monorepo with Core Systems + Micro-Apps  
**Philosophy:** Every sovereign decision requires notification, approval, and archival

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Core Systems](#core-systems)
- [Estate Micro-App](#estate-micro-app)
- [Getting Started](#getting-started)
- [CLI Generator](#cli-generator)
- [Sovereignty Control](#sovereignty-control)
- [Integration Guide](#integration-guide)
- [Security](#security)

---

## 🎯 Overview

**Micro OS** is a sovereignty-first architecture that enables building secure, auditable micro-applications with complete oversight. Every critical operation requires sovereign approval and is tracked with immutable forensic logging.

### Key Features

- ✅ **Sovereign Identity Management** - Complete user identity tracking with forensic trails
- ✅ **Immutable Forensic Logging** - Cryptographic hash-chain based audit system
- ✅ **Manual Approval Workflows** - All critical decisions require sovereign authorization
- ✅ **Real-time Event Bus** - Publish/subscribe system for inter-app communication
- ✅ **Forensic Deeds** - Property ownership with complete audit trails
- ✅ **CLI Generator** - Generate new sovereign micro-apps automatically
- ✅ **Contact Integration** - All systems notify yasserrr.fox17@gmail.com for critical events

### Architecture Principles

1. **Sovereignty First** - Every critical decision flows through sovereign authority
2. **Forensic by Default** - All operations are logged with cryptographic integrity
3. **Notification Required** - Critical events trigger immediate notifications
4. **Approval Driven** - High-value operations require manual approval
5. **Audit Always** - Complete audit trail for every entity and operation

---

## 🏗️ Architecture

```
tec-ecosystem/
│
├── core/                          # Sovereign Core Systems
│   ├── identity/                  # Identity Management
│   │   └── IdentityManager.js    # User identity with forensic tracking
│   ├── forensics/                 # Forensic Logging
│   │   └── ForensicLogger.js     # Immutable audit trail system
│   ├── approvals/                 # Approval Center
│   │   └── ApprovalCenter.js     # Manual approval workflows
│   ├── events/                    # Event Bus
│   │   └── EventBus.js           # Real-time event streaming
│   └── index.js                   # Core orchestration
│
├── apps/                          # Micro-Applications
│   └── estate/                    # Real Estate Micro-App
│       ├── models/
│       │   └── ForensicDeed.js   # Property deeds with forensic trail
│       ├── services/
│       │   └── EstateService.js  # Estate business logic
│       └── index.js               # Estate app entry point
│
├── scripts/
│   └── generate-app.js            # CLI generator for new apps
│
└── MICRO_OS_README.md             # This file
```

### System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Micro OS Core                             │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Identity   │  │  Forensic    │  │  Approval    │      │
│  │   Manager    │  │  Logger      │  │  Center      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                 │               │
│         └──────────────────┴─────────────────┘              │
│                          │                                   │
│                   ┌──────────────┐                          │
│                   │  Event Bus   │                          │
│                   └──────────────┘                          │
└───────────────────────────┬─────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼──────┐       ┌───────▼──────┐
        │ Estate App   │       │ Future Apps  │
        │              │       │              │
        │ - Deeds      │       │ - Healthcare │
        │ - Transfers  │       │ - Finance    │
        │ - Registry   │       │ - Logistics  │
        └──────────────┘       └──────────────┘
```

---

## 🔐 Core Systems

### 1. Identity Manager (`core/identity/IdentityManager.js`)

Manages user identities with complete forensic tracking.

**Features:**
- Register sovereign identities
- Verify identity with sovereign validation
- Revoke identities (requires notification to yasserrr.fox17@gmail.com)
- Maintain forensic trail for each identity
- Automatic sovereign notifications for critical events

**Usage:**
```javascript
const { MicroOSCore } = require('./core');
const core = new MicroOSCore();

// Register identity
const identity = await core.identityManager.registerIdentity({
  name: 'John Doe',
  email: 'john@example.com',
  type: 'PROPERTY_OWNER'
});

// Verify identity
const verification = await core.identityManager.verifyIdentity(identity.id);
```

### 2. Forensic Logger (`core/forensics/ForensicLogger.js`)

Provides immutable audit logging with cryptographic hash chains.

**Features:**
- Log events with SHA-256 hash chains
- Verify integrity of entire log chain
- Get forensic trail for specific entities
- Export logs for archival
- Automatic notifications for critical events

**Usage:**
```javascript
// Log an event
const logEntry = core.forensicLogger.log({
  type: 'CRITICAL_OPERATION',
  data: { operation: 'Transfer', amount: 100000 },
  actor: 'USER_123',
  critical: true  // Triggers notification to yasserrr.fox17@gmail.com
});

// Verify integrity
const integrity = core.forensicLogger.verifyIntegrity();
console.log(integrity.valid); // true or false
```

### 3. Approval Center (`core/approvals/ApprovalCenter.js`)

Manages manual approval workflows for sovereign decisions.

**Features:**
- Request approvals with priority levels
- Process approval decisions
- Get pending approvals
- Send notifications to yasserrr.fox17@gmail.com
- Archive old records
- Complete audit trail

**Usage:**
```javascript
// Request approval
const approval = await core.approvalCenter.requestApproval({
  type: 'OWNERSHIP_TRANSFER',
  data: { propertyId: 'PROP-123', value: 500000 },
  requestedBy: 'USER_123',
  priority: 'HIGH'  // Sends immediate notification
});

// Process approval (by sovereign authority)
const result = await core.approvalCenter.processApproval(
  approval.id,
  true,  // approved
  'Transfer approved after verification'
);
```

### 4. Event Bus (`core/events/EventBus.js`)

Real-time event streaming for inter-app communication.

**Features:**
- Publish/subscribe pattern
- Event history with filtering
- Automatic forensic logging
- Critical event notifications
- Statistics and monitoring

**Usage:**
```javascript
// Subscribe to events
const subscriptionId = core.eventBus.subscribe('OWNERSHIP_TRANSFERRED', 
  async (event) => {
    console.log('Property transferred:', event.data);
  }
);

// Publish event
await core.eventBus.publish({
  type: 'OWNERSHIP_TRANSFERRED',
  source: 'ESTATE_APP',
  data: { propertyId: 'PROP-123', newOwner: 'USER_456' },
  critical: true  // Triggers notification
});
```

---

## 🏠 Estate Micro-App

The **Estate Micro-App** demonstrates a complete sovereign application for real estate management.

### Features

1. **Forensic Deeds** - Property ownership records with complete audit trails
2. **Ownership Transfers** - Transfer property with sovereign approval
3. **Property Registry** - Complete property information with history
4. **Manual Approval** - All transfers require approval from yasserrr.fox17@gmail.com
5. **Verification** - Verify deed authenticity at any time

### Usage Example

```javascript
const { MicroOSCore } = require('./core');
const EstateApp = require('./apps/estate');

// Initialize core
const core = new MicroOSCore();

// Initialize estate app
const estateApp = new EstateApp(core);
const estateService = estateApp.getService();

// Register a property
const registration = await estateService.registerProperty({
  propertyId: 'PROP-001',
  propertyType: 'RESIDENTIAL',
  location: 'Dubai Marina, UAE',
  size: 2500,
  value: 1500000
}, 'OWNER-123');

console.log(registration.approval.id); // Approval ID
console.log(registration.message); // Pending approval message

// Initiate transfer
const transfer = await estateService.initiateTransfer(
  registration.deed.id,
  'OWNER-123',
  'OWNER-456'
);

// Process approval (by sovereign authority)
const result = await estateService.processTransferApproval(
  registration.deed.id,
  transfer.approvalId,
  true,
  'Transfer approved after document verification'
);

// Get property details
const details = await estateService.getPropertyDetails(registration.deed.id);
console.log(details.deed);
console.log(details.forensicTrail);
console.log(details.systemLogs);
```

### Estate Service API

- `registerProperty(propertyData, ownerId)` - Register new property
- `initiateTransfer(deedId, currentOwnerId, newOwnerId)` - Start ownership transfer
- `processTransferApproval(deedId, approvalId, approved, comments)` - Process approval
- `getPropertyDetails(deedId)` - Get complete property information
- `getOwnerProperties(ownerId)` - Get all properties for an owner
- `getPendingApprovals()` - Get pending estate approvals
- `getStatistics()` - Get estate statistics

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Yasser1728/tec-ecosystem.git
cd tec-ecosystem
```

2. **Install dependencies:**

```bash
npm install
```

3. **Test the core systems:**

```javascript
// test-core.js
const { MicroOSCore } = require('./core');

async function testCore() {
  const core = new MicroOSCore();
  
  // Test identity
  const identity = await core.identityManager.registerIdentity({
    name: 'Test User',
    email: 'test@example.com'
  });
  
  console.log('Identity created:', identity.id);
  
  // Check health
  const health = core.getHealthStatus();
  console.log('System health:', health);
}

testCore();
```

4. **Test the Estate app:**

```javascript
// test-estate.js
const { MicroOSCore } = require('./core');
const EstateApp = require('./apps/estate');

async function testEstate() {
  const core = new MicroOSCore();
  const estateApp = new EstateApp(core);
  
  console.log('App info:', estateApp.getInfo());
  console.log('Health:', estateApp.healthCheck());
}

testEstate();
```

---

## 🛠️ CLI Generator

Generate new sovereign micro-apps with the CLI generator.

### Usage

```bash
# Interactive mode
node scripts/generate-app.js

# Follow the prompts:
# Enter app name: Healthcare
# Enter main model name: Patient
```

### Generated Structure

```
apps/healthcare/
├── models/
│   └── Patient.js          # Model with forensic tracking
├── services/
│   └── HealthcareService.js  # Business logic with core integration
└── index.js                # App entry point
```

### Generated Features

- ✅ Forensic logging for all operations
- ✅ Event bus integration
- ✅ Optional approval workflows
- ✅ Sovereign contact integration
- ✅ Statistics and monitoring
- ✅ Health checks

### Example Generated App

After generation, use your new app:

```javascript
const { MicroOSCore } = require('./core');
const HealthcareApp = require('./apps/healthcare');

const core = new MicroOSCore();
const healthcareApp = new HealthcareApp(core);
const service = healthcareApp.getService();

// Create patient with approval
const result = await service.createEntity({
  name: 'Patient Name',
  condition: 'Treatment Required',
  createdBy: 'DOCTOR_123'
}, true); // Requires approval

console.log(result.approval.id);
console.log(result.message); // Pending approval from yasserrr.fox17@gmail.com
```

---

## 👑 Sovereignty Control

### Sovereign Authority

**Contact:** yasserrr.fox17@gmail.com

All sovereign decisions, notifications, and archival communications are sent to this contact point.

### Notification Triggers

The system sends notifications for:

1. **Critical Events**
   - Identity revocations
   - High-value property transfers
   - Security incidents
   - System initialization/shutdown

2. **Approval Requests**
   - Property registrations
   - Ownership transfers
   - High-priority operations
   - Custom approval workflows

3. **Forensic Alerts**
   - Hash chain integrity issues
   - Suspicious activities
   - Critical system events

### Approval Workflow

```
User Action → Request Approval → Notify yasserrr.fox17@gmail.com
                ↓
         Pending Status
                ↓
    Sovereign Authority Reviews
                ↓
         Approve/Reject
                ↓
    Notify User + Execute/Cancel
```

### Forensic Integrity

All logs are:
- **Immutable** - Cannot be modified after creation
- **Chained** - Each log links to previous via hash
- **Verified** - Integrity can be verified at any time
- **Exportable** - Can be archived with yasserrr.fox17@gmail.com

---

## 🔗 Integration Guide

### Adding Core to Existing Apps

```javascript
// 1. Initialize core
const { MicroOSCore } = require('./core');
const core = new MicroOSCore();

// 2. Use in your existing code
async function myOperation(userId) {
  // Verify identity
  const verified = await core.identityManager.verifyIdentity(userId);
  
  if (!verified.verified) {
    throw new Error('Identity not verified');
  }
  
  // Log operation
  core.forensicLogger.log({
    type: 'OPERATION_EXECUTED',
    data: { userId },
    actor: userId,
    critical: false
  });
  
  // Your existing logic...
}
```

### Creating Custom Approvals

```javascript
// Request custom approval
const approval = await core.approvalCenter.requestApproval({
  type: 'CUSTOM_OPERATION',
  data: {
    operation: 'Special Transaction',
    amount: 100000,
    recipient: 'USER_456'
  },
  requestedBy: 'USER_123',
  priority: 'HIGH'  // Will notify yasserrr.fox17@gmail.com
});

// Check approval status
const status = core.approvalCenter.getApproval(approval.id);
console.log(status.status); // PENDING, APPROVED, or REJECTED
```

### Custom Event Handlers

```javascript
// Subscribe to custom events
core.eventBus.subscribe('MY_CUSTOM_EVENT', async (event) => {
  console.log('Custom event received:', event);
  
  // Your handling logic
  await handleCustomEvent(event.data);
});

// Publish custom events
await core.eventBus.publish({
  type: 'MY_CUSTOM_EVENT',
  source: 'MY_APP',
  data: { key: 'value' },
  critical: false
});
```

---

## 🔒 Security

### Built-in Security Features

1. **Cryptographic Logging** - SHA-256 hash chains prevent tampering
2. **Identity Verification** - All operations verify user identities
3. **Approval Workflows** - Critical operations require manual approval
4. **Forensic Trails** - Complete audit history for all entities
5. **Sovereign Oversight** - All critical events monitored by yasserrr.fox17@gmail.com

### Best Practices

- ✅ Always verify identities before critical operations
- ✅ Use `critical: true` for high-value events
- ✅ Set appropriate approval priorities (LOW, NORMAL, HIGH, CRITICAL)
- ✅ Regularly verify forensic log integrity
- ✅ Archive old records periodically
- ✅ Monitor pending approvals dashboard

### Security Contacts

- **Sovereign Authority:** yasserrr.fox17@gmail.com
- **Security Issues:** [Create GitHub Issue](https://github.com/Yasser1728/tec-ecosystem/issues)

---

## 📊 Monitoring & Analytics

### System Health Check

```javascript
const health = core.getHealthStatus();
console.log(health);
/*
{
  timestamp: '2024-01-01T00:00:00.000Z',
  sovereignContact: 'yasserrr.fox17@gmail.com',
  systems: {
    forensicLogger: {
      status: 'OPERATIONAL',
      totalLogs: 1523,
      integrity: { valid: true, message: 'All logs verified' }
    },
    identityManager: {
      status: 'OPERATIONAL',
      totalIdentities: 245
    },
    approvalCenter: {
      status: 'OPERATIONAL',
      pendingApprovals: 5,
      totalApprovals: 128
    },
    eventBus: {
      status: 'OPERATIONAL',
      statistics: { totalEvents: 3456, totalSubscribers: 12 }
    }
  }
}
*/
```

### App Statistics

```javascript
// Estate app statistics
const stats = estateApp.getService().getStatistics();
console.log(stats);
/*
{
  totalDeeds: 42,
  activeDeeds: 40,
  revokedDeeds: 2,
  pendingApprovals: 3,
  sovereignContact: 'yasserrr.fox17@gmail.com'
}
*/
```

---

## 📞 Support & Contact

- **Sovereign Authority:** yasserrr.fox17@gmail.com
- **Repository:** [github.com/Yasser1728/tec-ecosystem](https://github.com/Yasser1728/tec-ecosystem)
- **Issues:** [GitHub Issues](https://github.com/Yasser1728/tec-ecosystem/issues)
- **Documentation:** This file and inline code documentation

---

## 📝 License

This project is part of the TEC Ecosystem and uses a dual-license approach. See main repository LICENSE for details.

---

## 🌟 Acknowledgments

- Built with sovereignty and security as first principles
- Designed for complete auditability and oversight
- Integrated with yasserrr.fox17@gmail.com for all critical operations

---

**© 2024-2025 TEC Ecosystem - Micro OS Sovereignty Architecture**  
**Contact: yasserrr.fox17@gmail.com**
