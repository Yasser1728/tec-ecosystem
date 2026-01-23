#!/bin/bash

# =============================================================================
# Vercel Configuration Checker
# يختبر جميع ملفات Vercel ويتأكد من صحتها
# =============================================================================

echo "🔍 بدء فحص تكوينات Vercel..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0
SUCCESS=0

# =============================================================================
# 0. فحص المتطلبات (jq)
# =============================================================================

if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠${NC} jq غير مثبت - سيتم تخطي فحوصات JSON"
    echo "  لتثبيت jq: sudo apt-get install jq أو brew install jq"
    ((WARNINGS++))
    SKIP_JSON_CHECKS=true
else
    SKIP_JSON_CHECKS=false
fi

echo ""

# =============================================================================
# 1. فحص وجود الملفات الأساسية
# =============================================================================

echo "📁 1. فحص وجود الملفات الأساسية..."

FILES=(
  "vercel.json"
  ".vercelignore"
  "vercel-ignore.sh"
  "next.config.js"
  "package.json"
  ".env.example"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "  ${GREEN}✓${NC} $file موجود"
    ((SUCCESS++))
  else
    echo -e "  ${RED}✗${NC} $file مفقود"
    ((ERRORS++))
  fi
done

echo ""

# =============================================================================
# 2. فحص أذونات vercel-ignore.sh
# =============================================================================

echo "🔐 2. فحص أذونات vercel-ignore.sh..."

if [ -f "vercel-ignore.sh" ]; then
  if [ -x "vercel-ignore.sh" ]; then
    echo -e "  ${GREEN}✓${NC} vercel-ignore.sh قابل للتنفيذ"
    ((SUCCESS++))
  else
    echo -e "  ${RED}✗${NC} vercel-ignore.sh غير قابل للتنفيذ"
    echo "     تشغيل: chmod +x vercel-ignore.sh"
    ((ERRORS++))
  fi
else
  echo -e "  ${RED}✗${NC} vercel-ignore.sh غير موجود"
  ((ERRORS++))
fi

echo ""

# =============================================================================
# 3. اختبار vercel-ignore.sh
# =============================================================================

echo "🧪 3. اختبار vercel-ignore.sh..."

if [ -f "vercel-ignore.sh" ] && [ -x "vercel-ignore.sh" ]; then
  # ملاحظة: vercel-ignore.sh يستخدم exit codes بشكل معكوس عمداً:
  # exit 1 = المتابعة في البناء (proceed)
  # exit 0 = تخطي البناء (skip)
  # هذا يتبع توثيق Vercel للـ Ignored Build Step
  
  # Test main branch
  VERCEL_GIT_COMMIT_REF=main bash vercel-ignore.sh > /dev/null 2>&1
  if [ $? -eq 1 ]; then
    echo -e "  ${GREEN}✓${NC} main branch: سيتم البناء"
    ((SUCCESS++))
  else
    echo -e "  ${RED}✗${NC} main branch: لن يتم البناء (خطأ)"
    ((ERRORS++))
  fi
  
  # Test staging branch
  VERCEL_GIT_COMMIT_REF=staging bash vercel-ignore.sh > /dev/null 2>&1
  if [ $? -eq 1 ]; then
    echo -e "  ${GREEN}✓${NC} staging branch: سيتم البناء"
    ((SUCCESS++))
  else
    echo -e "  ${RED}✗${NC} staging branch: لن يتم البناء (خطأ)"
    ((ERRORS++))
  fi
  
  # Test feature branch
  VERCEL_GIT_COMMIT_REF=feature/test bash vercel-ignore.sh > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} feature branch: لن يتم البناء (صحيح)"
    ((SUCCESS++))
  else
    echo -e "  ${RED}✗${NC} feature branch: سيتم البناء (خطأ)"
    ((ERRORS++))
  fi
else
  echo -e "  ${YELLOW}⚠${NC} لا يمكن اختبار vercel-ignore.sh"
  ((WARNINGS++))
fi

echo ""

# =============================================================================
# 4. فحص vercel.json
# =============================================================================

echo "📝 4. فحص vercel.json..."

if [ -f "vercel.json" ]; then
  if [ "$SKIP_JSON_CHECKS" = true ]; then
    echo -e "  ${YELLOW}⚠${NC} تخطي فحص JSON (jq غير متوفر)"
    ((WARNINGS++))
  else
    # Check if valid JSON
    if jq empty vercel.json > /dev/null 2>&1; then
      echo -e "  ${GREEN}✓${NC} vercel.json: JSON صالح"
      ((SUCCESS++))
      
      # Check for required fields
      if jq -e '.buildCommand' vercel.json > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} buildCommand موجود"
        ((SUCCESS++))
      else
        echo -e "  ${YELLOW}⚠${NC} buildCommand مفقود"
        ((WARNINGS++))
      fi
      
      if jq -e '.framework' vercel.json > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} framework موجود"
        ((SUCCESS++))
      else
        echo -e "  ${YELLOW}⚠${NC} framework مفقود"
        ((WARNINGS++))
      fi
      
      if jq -e '.ignoreCommand' vercel.json > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} ignoreCommand موجود"
        ((SUCCESS++))
      else
        echo -e "  ${YELLOW}⚠${NC} ignoreCommand مفقود"
        ((WARNINGS++))
      fi
      
    else
      echo -e "  ${RED}✗${NC} vercel.json: JSON غير صالح"
      ((ERRORS++))
    fi
  fi
else
  echo -e "  ${RED}✗${NC} vercel.json غير موجود"
  ((ERRORS++))
fi

echo ""

# =============================================================================
# 5. فحص package.json scripts
# =============================================================================

echo "📦 5. فحص package.json scripts..."

if [ -f "package.json" ]; then
  if [ "$SKIP_JSON_CHECKS" = true ]; then
    echo -e "  ${YELLOW}⚠${NC} تخطي فحص package.json (jq غير متوفر)"
    ((WARNINGS++))
  else
    # Check for build script
    if jq -e '.scripts.build' package.json > /dev/null 2>&1; then
      BUILD_CMD=$(jq -r '.scripts.build' package.json)
      echo -e "  ${GREEN}✓${NC} build script: $BUILD_CMD"
      ((SUCCESS++))
    else
      echo -e "  ${RED}✗${NC} build script مفقود"
      ((ERRORS++))
    fi
    
    # Check for dev script
    if jq -e '.scripts.dev' package.json > /dev/null 2>&1; then
      DEV_CMD=$(jq -r '.scripts.dev' package.json)
      echo -e "  ${GREEN}✓${NC} dev script: $DEV_CMD"
      ((SUCCESS++))
    else
      echo -e "  ${YELLOW}⚠${NC} dev script مفقود"
      ((WARNINGS++))
    fi
    
    # Check for start script
    if jq -e '.scripts.start' package.json > /dev/null 2>&1; then
      START_CMD=$(jq -r '.scripts.start' package.json)
      echo -e "  ${GREEN}✓${NC} start script: $START_CMD"
      ((SUCCESS++))
    else
      echo -e "  ${YELLOW}⚠${NC} start script مفقود"
      ((WARNINGS++))
    fi
    
    # Check for postinstall script
    if jq -e '.scripts.postinstall' package.json > /dev/null 2>&1; then
      POSTINSTALL_CMD=$(jq -r '.scripts.postinstall' package.json)
      echo -e "  ${GREEN}✓${NC} postinstall script: $POSTINSTALL_CMD"
      ((SUCCESS++))
    else
      echo -e "  ${YELLOW}⚠${NC} postinstall script مفقود (قد يحتاج Prisma)"
      ((WARNINGS++))
    fi
  fi
else
  echo -e "  ${RED}✗${NC} package.json غير موجود"
  ((ERRORS++))
fi

echo ""

# =============================================================================
# 6. فحص next.config.js
# =============================================================================

echo "⚙️  6. فحص next.config.js..."

if [ -f "next.config.js" ]; then
  echo -e "  ${GREEN}✓${NC} next.config.js موجود"
  ((SUCCESS++))
  
  # Check for common configurations
  if grep -q "reactStrictMode" next.config.js; then
    echo -e "  ${GREEN}✓${NC} reactStrictMode موجود"
    ((SUCCESS++))
  fi
  
  if grep -q "headers()" next.config.js; then
    echo -e "  ${GREEN}✓${NC} headers() موجود (security headers)"
    ((SUCCESS++))
  fi
  
  if grep -q "rewrites()" next.config.js; then
    echo -e "  ${GREEN}✓${NC} rewrites() موجود"
    ((SUCCESS++))
  fi
else
  echo -e "  ${RED}✗${NC} next.config.js غير موجود"
  ((ERRORS++))
fi

echo ""

# =============================================================================
# 7. فحص .env.example
# =============================================================================

echo "🔑 7. فحص .env.example..."

if [ -f ".env.example" ]; then
  echo -e "  ${GREEN}✓${NC} .env.example موجود"
  ((SUCCESS++))
  
  # Check for critical environment variables
  CRITICAL_VARS=(
    "DATABASE_URL"
    "NEXTAUTH_URL"
    "NEXTAUTH_SECRET"
    "NEXT_PUBLIC_PI_APP_ID"
  )
  
  for var in "${CRITICAL_VARS[@]}"; do
    if grep -q "^$var=" .env.example || grep -q "^# $var=" .env.example; then
      echo -e "  ${GREEN}✓${NC} $var موجود"
      ((SUCCESS++))
    else
      echo -e "  ${YELLOW}⚠${NC} $var مفقود"
      ((WARNINGS++))
    fi
  done
else
  echo -e "  ${RED}✗${NC} .env.example غير موجود"
  ((ERRORS++))
fi

echo ""

# =============================================================================
# 8. فحص GitHub Actions workflows
# =============================================================================

echo "🔄 8. فحص GitHub Actions workflows..."

if [ -d ".github/workflows" ]; then
  echo -e "  ${GREEN}✓${NC} .github/workflows موجود"
  ((SUCCESS++))
  
  # Check for main workflow
  if [ -f ".github/workflows/main.yml" ]; then
    echo -e "  ${GREEN}✓${NC} main.yml workflow موجود"
    ((SUCCESS++))
  else
    echo -e "  ${YELLOW}⚠${NC} main.yml workflow مفقود"
    ((WARNINGS++))
  fi
  
  # Count workflows
  WORKFLOW_COUNT=$(ls -1 .github/workflows/*.yml 2>/dev/null | wc -l)
  echo -e "  ${GREEN}ℹ${NC} عدد workflows: $WORKFLOW_COUNT"
else
  echo -e "  ${YELLOW}⚠${NC} .github/workflows غير موجود"
  ((WARNINGS++))
fi

echo ""

# =============================================================================
# النتيجة النهائية
# =============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 النتائج:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ نجح:${NC} $SUCCESS"
echo -e "${YELLOW}⚠ تحذيرات:${NC} $WARNINGS"
echo -e "${RED}✗ أخطاء:${NC} $ERRORS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
  if [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 جميع فحوصات Vercel نجحت!${NC}"
    echo "✅ المشروع جاهز للنشر على Vercel"
    exit 0
  else
    echo -e "${YELLOW}⚠️  بعض التحذيرات موجودة لكن يمكن النشر${NC}"
    echo "💡 راجع التحذيرات أعلاه وقم بإصلاحها إذا لزم الأمر"
    exit 0
  fi
else
  echo -e "${RED}❌ يوجد أخطاء يجب إصلاحها قبل النشر${NC}"
  echo "🔧 راجع الأخطاء أعلاه وقم بإصلاحها"
  exit 1
fi
