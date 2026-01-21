# TEC Assistant (tec.pi) - Domain Documentation

## 📋 Overview

**TEC Assistant** is the first domain of the TEC Ecosystem - an AI-ready assistant with Daily Signal, Gamification, and Pi Network integration. Built with Clean Architecture principles and enterprise-grade code quality.

## 🏗️ Architecture

This domain follows **Clean Architecture (Domain-Driven Design)** with clear separation of concerns:

```
src/
├── domain/              # Business Logic (Pure - No Dependencies)
│   ├── entities/       # User, Signal, CheckIn, Transaction, Unlock
│   ├── use-cases/      # Auth, Signals, Check-ins, Unlocks, Gamification
│   └── interfaces/     # Repository & Service contracts
│
├── infrastructure/      # External Services & DB
│   ├── database/       # Prisma repositories
│   ├── pi-network/     # Pi Network service
│   └── ai/             # AI service (placeholder)
│
├── presentation/        # API Layer
│   └── api/           # Next.js API routes
│
└── shared/             # Shared Utilities
    ├── config/        # Features config
    ├── types/         # API types
    ├── utils/         # Date utilities
    └── errors/        # Custom errors
```

## 🎯 Features Implemented

### 1. Pi Network Authentication ✅

- JWT token verification
- User creation/update on auth
- Pi SDK integration

### 2. Daily Signal System ✅

- Deterministic signal generation: `hash(date) % 3`
- Signal types: POSITIVE, NEUTRAL, CAUTION
- AI-ready placeholder for future personalization
- Signal caching (one per day)

### 3. Check-in & Gamification ✅

- Daily check-in confirmation
- Streak tracking (current + longest)
- XP calculation: Base 10 XP + (streak \* 2) bonus
- Level progression: `level = floor(sqrt(totalXP / 100))`

### 4. Unlock System ✅

- Feature unlock with Pi payment
- Transaction tracking
- Unlock status verification

## 📊 Database Schema

The TEC Assistant uses the following Prisma models:

- **TecUser** - User profiles with gamification stats
- **TecSignal** - Daily signals
- **TecCheckIn** - Daily check-in records
- **TecTransaction** - Pi Network payment transactions
- **TecUnlock** - Feature unlock records
- **TecInvite** - Invite tracking (for future viral loop)

## 🔌 API Endpoints

| Method | Endpoint                              | Description                  | Status |
| ------ | ------------------------------------- | ---------------------------- | ------ |
| POST   | `/api/v1/tec-assistant/auth`          | Authenticate with Pi Network | ✅     |
| GET    | `/api/v1/tec-assistant/signals/today` | Get today's signal           | ✅     |
| POST   | `/api/v1/tec-assistant/check-ins`     | Confirm daily check-in       | ✅     |

### Example: Get Today's Signal

```bash
GET /api/v1/tec-assistant/signals/today
```

**Response:**

```json
{
  "success": true,
  "data": {
    "signal": {
      "id": "clx...",
      "date": "2026-01-19T00:00:00.000Z",
      "type": "POSITIVE",
      "color": "green",
      "emoji": "🟢",
      "message": "Great day ahead! Opportunities are favorable.",
      "generatedAt": "2026-01-19T06:30:00.000Z"
    }
  }
}
```

### Example: Authenticate

```bash
POST /api/v1/tec-assistant/auth
Content-Type: application/json

{
  "accessToken": "pi_access_token_here"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx...",
      "piUsername": "john_doe",
      "currentStreak": 5,
      "totalXp": 150,
      "level": 2,
      "role": "USER"
    },
    "isNewUser": false
  }
}
```

### Example: Check In

```bash
POST /api/v1/tec-assistant/check-ins
Content-Type: application/json

{
  "userId": "clx..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "checkIn": {
      "id": "clx...",
      "date": "2026-01-19T00:00:00.000Z",
      "signal": "POSITIVE",
      "xpEarned": 20,
      "streakDay": 6
    },
    "xpEarned": 20,
    "newStreak": 6,
    "leveledUp": false
  }
}
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Pi Network App credentials

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/tec_ecosystem"

# Pi Network
NEXT_PUBLIC_PI_NETWORK=testnet
NEXT_PUBLIC_PI_APP_ID=your-pi-app-id
NEXT_PUBLIC_PI_SANDBOX=true
PI_API_KEY=your_pi_api_key_here

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
```

### 3. Run Database Migration

```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/assistant` to see the TEC Assistant landing page.

## 🧪 Testing

### Run Linting

```bash
npm run lint
```

### Build Project

```bash
npm run build
```

## 📈 Gamification System

### XP Calculation

- **Base XP**: 10 XP per check-in
- **Streak Bonus**: streak_day × 2 XP
- **Premium Bonus**: 1.5× multiplier for premium users

### Level Progression

```
Level = floor(sqrt(totalXP / 100))
```

Examples:

- 100 XP = Level 1
- 400 XP = Level 2
- 900 XP = Level 3
- 2,500 XP = Level 5

### Streak System

- Check in daily to maintain your streak
- Miss a day? Streak resets to 0
- Longest streak is always tracked

## 🎨 UI Components

### Landing Page ✅

- Hero section with branding
- Today's signal display
- Feature highlights
- Pi Network login CTA

### Planned Pages

- Dashboard (user stats, quick actions)
- Daily Signal Page (detailed signal view, history)
- Unlock Page (feature marketplace, payment flow)

## 🔐 Security

- Input validation on all API endpoints
- Proper error handling with custom error classes
- Pi Network authentication verification
- TypeScript strict mode for type safety

## 📚 Technology Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Pi Network SDK
- **Architecture**: Clean Architecture (DDD)
- **Type Safety**: TypeScript with strict mode

## 🌟 Key Design Patterns

1. **Repository Pattern** - Data access abstraction
2. **Dependency Injection** - Use case initialization
3. **Entity Pattern** - Rich domain models
4. **Use Case Pattern** - Single responsibility business logic
5. **Factory Pattern** - Object creation (planned)

## 🔄 Future Enhancements

- [ ] AI-powered personalized signals (OpenAI/Anthropic integration)
- [ ] Advanced analytics dashboard
- [ ] Social features (invite system, leaderboard)
- [ ] Premium subscription tiers
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Webhook integrations

## 📝 Code Quality Standards

- ✅ TypeScript strict mode enabled
- ✅ ESLint configuration (zero warnings/errors)
- ✅ Clean Architecture principles
- ✅ SOLID principles
- ✅ Proper error handling
- ✅ Type-safe API contracts
- ✅ Comprehensive JSDoc comments

## 🤝 Contributing

This domain serves as a template for other domains in the TEC Ecosystem. When implementing new domains, follow this architecture pattern:

1. Start with domain entities (pure business logic)
2. Define use cases and interfaces
3. Implement infrastructure (repositories, services)
4. Create API routes
5. Build UI components

## 📄 License

Part of the TEC Ecosystem - Copyright © 2026

---

**Status**: ✅ Phase 1 Complete - Ready for Testing & Enhancement
