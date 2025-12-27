#!/bin/bash

# TEC Ecosystem - Project Setup Script
# This script automates the initial setup of the TEC Ecosystem project

set -e  # Exit on error

echo "🚀 TEC Ecosystem Setup Script"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18 or higher is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) detected${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    
    if [ -f "env.local.example" ]; then
        echo "📄 Creating .env.local from env.local.example..."
        cp env.local.example .env.local
        echo -e "${GREEN}✅ .env.local created${NC}"
        echo -e "${YELLOW}⚠️  Please update .env.local with your actual values${NC}"
    else
        echo -e "${RED}❌ env.local.example not found${NC}"
        echo "Creating a basic .env.local file..."
        cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/tecdb"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Pi Network (Optional)
PI_API_KEY="your-pi-api-key"

# Rate Limiting
RATE_LIMIT_MAX=100
EOF
        echo -e "${GREEN}✅ Basic .env.local created${NC}"
        echo -e "${YELLOW}⚠️  Please update .env.local with your actual values${NC}"
    fi
else
    echo -e "${GREEN}✅ .env.local already exists${NC}"
fi
echo ""

# Setup Prisma
echo "🔧 Setting up Prisma..."
npx prisma generate
echo -e "${GREEN}✅ Prisma client generated${NC}"
echo ""

# Ask about database setup
echo "🗄️  Database Setup"
read -p "Do you want to push the schema to your database now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Pushing schema to database..."
    npx prisma db push
    echo -e "${GREEN}✅ Database schema pushed${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping database setup. Run 'npx prisma db push' manually when ready.${NC}"
fi
echo ""

# Create necessary directories if they don't exist
echo "📁 Creating directory structure..."
mkdir -p public/components public/pages public/hooks
mkdir -p private/strategies private/integrations private/ecommerce private/notifications private/legacy
mkdir -p tests/unit tests/integration tests/e2e
mkdir -p scripts
echo -e "${GREEN}✅ Directory structure created${NC}"
echo ""

# Run linting
echo "🔍 Running linter..."
npm run lint || echo -e "${YELLOW}⚠️  Linting completed with warnings${NC}"
echo ""

# Success message
echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "📝 Next Steps:"
echo "  1. Update .env.local with your actual configuration"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Visit http://localhost:3000 to see your application"
echo "  4. Read README.md for detailed documentation"
echo ""
echo "🔒 Security Reminders:"
echo "  - Never commit .env.local to git"
echo "  - Use strong secrets in production"
echo "  - Enable 2FA for all team members"
echo ""
echo "Happy coding! 🚀"
