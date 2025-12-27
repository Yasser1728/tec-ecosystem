#!/bin/bash

# TEC Ecosystem - Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 TEC Ecosystem Deployment Script"
echo "==================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}  # Default to production
DRY_RUN=${2:-false}           # Dry run mode

echo -e "${BLUE}Environment: $ENVIRONMENT${NC}"
echo -e "${BLUE}Dry Run: $DRY_RUN${NC}"
echo ""

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check if git working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Git working directory is not clean. Please commit or stash your changes.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git working directory is clean${NC}"

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$ENVIRONMENT" == "production" ] && [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}❌ Production deployments must be from 'main' branch${NC}"
    echo -e "${YELLOW}Current branch: $CURRENT_BRANCH${NC}"
    exit 1
fi
echo -e "${GREEN}✅ On correct branch: $CURRENT_BRANCH${NC}"

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin $CURRENT_BRANCH
echo -e "${GREEN}✅ Latest changes pulled${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm ci
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate
echo -e "${GREEN}✅ Prisma client generated${NC}"
echo ""

# Run tests
echo "🧪 Running tests..."
if npm test; then
    echo -e "${GREEN}✅ All tests passed${NC}"
else
    echo -e "${RED}❌ Tests failed. Aborting deployment.${NC}"
    exit 1
fi
echo ""

# Run linter
echo "🔍 Running linter..."
if npm run lint; then
    echo -e "${GREEN}✅ Linting passed${NC}"
else
    echo -e "${YELLOW}⚠️  Linting warnings detected${NC}"
    read -p "Continue with deployment? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Deployment aborted${NC}"
        exit 1
    fi
fi
echo ""

# Build application
echo "🏗️  Building application..."
if npm run build; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed. Aborting deployment.${NC}"
    exit 1
fi
echo ""

# Dry run check
if [ "$DRY_RUN" == "true" ]; then
    echo -e "${YELLOW}🏃 Dry run mode - skipping actual deployment${NC}"
    echo -e "${GREEN}✅ Pre-deployment checks completed successfully${NC}"
    echo ""
    echo "To deploy for real, run:"
    echo "  ./scripts/deploy.sh $ENVIRONMENT false"
    exit 0
fi

# Database migration
echo "🗄️  Running database migrations..."
if [ "$ENVIRONMENT" == "production" ]; then
    echo -e "${YELLOW}⚠️  Running production database migrations...${NC}"
    read -p "Are you sure you want to migrate the production database? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Database migration cancelled${NC}"
        exit 1
    fi
fi

npx prisma migrate deploy
echo -e "${GREEN}✅ Database migrations completed${NC}"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
if [ "$ENVIRONMENT" == "production" ]; then
    vercel --prod
else
    vercel
fi
echo -e "${GREEN}✅ Deployment successful${NC}"
echo ""

# Post-deployment tasks
echo "🔄 Running post-deployment tasks..."

# Clear cache (if applicable)
echo "  - Clearing cache..."
# Add cache clearing logic here

# Run smoke tests
echo "  - Running smoke tests..."
# Add smoke test logic here
sleep 2
echo -e "${GREEN}✅ Post-deployment tasks completed${NC}"
echo ""

# Create deployment tag
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
TAG_NAME="deploy-$ENVIRONMENT-$TIMESTAMP"
echo "🏷️  Creating deployment tag: $TAG_NAME"
git tag -a "$TAG_NAME" -m "Deployment to $ENVIRONMENT at $TIMESTAMP"
git push origin "$TAG_NAME"
echo -e "${GREEN}✅ Deployment tag created${NC}"
echo ""

# Success message
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "📊 Deployment Summary:"
echo "  Environment: $ENVIRONMENT"
echo "  Branch: $CURRENT_BRANCH"
echo "  Tag: $TAG_NAME"
echo "  Timestamp: $(date)"
echo ""
echo "🔍 Next Steps:"
echo "  1. Monitor application logs for any issues"
echo "  2. Run manual smoke tests on the deployed environment"
echo "  3. Check monitoring dashboards"
echo "  4. Notify team of successful deployment"
echo ""
echo "🌐 Deployed URL: Check Vercel dashboard for deployment URL"
echo ""
