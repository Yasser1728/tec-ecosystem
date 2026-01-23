#!/bin/bash

# Script to check for merge conflicts between a branch and main
# Usage: ./scripts/check-merge-conflicts.sh [branch-name]
#
# أداة للتحقق من وجود تعارضات دمج بين فرع وال main
# الاستخدام: ./scripts/check-merge-conflicts.sh [اسم-الفرع]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Get branch name from argument or use current branch
BRANCH_NAME=${1:-$(git branch --show-current)}

print_color "$BLUE" "=================================================="
print_color "$BLUE" "TEC Ecosystem - Merge Conflict Checker"
print_color "$BLUE" "أداة فحص تعارضات الدمج - TEC"
print_color "$BLUE" "=================================================="
echo ""

print_color "$YELLOW" "Checking branch: $BRANCH_NAME"
print_color "$YELLOW" "فحص الفرع: $BRANCH_NAME"
echo ""

# Fetch latest main
print_color "$YELLOW" "Fetching latest main branch..."
print_color "$YELLOW" "جلب آخر تحديثات main..."
git fetch origin main --quiet

# Check if branch exists
if ! git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    # Try to fetch it
    if git fetch origin "$BRANCH_NAME" --quiet 2>/dev/null; then
        git checkout "$BRANCH_NAME" --quiet
    else
        print_color "$RED" "❌ Branch '$BRANCH_NAME' not found!"
        print_color "$RED" "❌ الفرع '$BRANCH_NAME' غير موجود!"
        exit 1
    fi
fi

# Switch to the branch
git checkout "$BRANCH_NAME" --quiet 2>/dev/null || true

echo ""
print_color "$BLUE" "Branch Information / معلومات الفرع:"
print_color "$BLUE" "----------------------------------------"

# Get commit info
CURRENT_COMMIT=$(git rev-parse HEAD | cut -c1-7)
MAIN_COMMIT=$(git rev-parse origin/main | cut -c1-7)
MERGE_BASE=$(git merge-base HEAD origin/main | cut -c1-7)

echo "Current branch commit / آخر commit: $CURRENT_COMMIT"
echo "Main branch commit / آخر commit في main: $MAIN_COMMIT"
echo "Common ancestor / السلف المشترك: $MERGE_BASE"
echo ""

# Count commits ahead/behind
COMMITS_AHEAD=$(git rev-list --count origin/main..HEAD)
COMMITS_BEHIND=$(git rev-list --count HEAD..origin/main)

echo "Commits ahead of main / commits متقدمة عن main: $COMMITS_AHEAD"
echo "Commits behind main / commits متأخرة عن main: $COMMITS_BEHIND"
echo ""

# Try a test merge
print_color "$BLUE" "Attempting test merge / محاولة دمج تجريبي..."
echo ""

# Create a temporary branch for testing
TEST_BRANCH="temp-merge-test-$$"
git checkout -b "$TEST_BRANCH" --quiet

# Try to merge
if git merge origin/main --no-commit --no-ff > /dev/null 2>&1; then
    print_color "$GREEN" "✅ No merge conflicts detected!"
    print_color "$GREEN" "✅ لا توجد تعارضات دمج!"
    echo ""
    print_color "$GREEN" "This branch can be merged cleanly with main."
    print_color "$GREEN" "هذا الفرع يمكن دمجه بسلاسة مع main."
    
    # Abort the test merge
    git merge --abort 2>/dev/null || true
    
    # Return to original branch
    git checkout "$BRANCH_NAME" --quiet
    git branch -D "$TEST_BRANCH" --quiet
    
    exit 0
else
    print_color "$RED" "❌ Merge conflicts detected!"
    print_color "$RED" "❌ تم اكتشاف تعارضات دمج!"
    echo ""
    
    # List conflicted files
    print_color "$YELLOW" "Conflicted files / الملفات المتعارضة:"
    print_color "$YELLOW" "----------------------------------------"
    
    CONFLICTED_FILES=$(git diff --name-only --diff-filter=U)
    
    if [ -z "$CONFLICTED_FILES" ]; then
        print_color "$YELLOW" "Unable to determine conflicted files."
        print_color "$YELLOW" "غير قادر على تحديد الملفات المتعارضة."
    else
        echo "$CONFLICTED_FILES" | while read -r file; do
            print_color "$RED" "  ⚠️  $file"
        done
    fi
    
    echo ""
    print_color "$YELLOW" "File types with conflicts / أنواع الملفات المتعارضة:"
    print_color "$YELLOW" "----------------------------------------"
    
    echo "$CONFLICTED_FILES" | while read -r file; do
        case "$file" in
            package.json|package-lock.json)
                print_color "$YELLOW" "  📦 Package file: $file"
                print_color "$YELLOW" "     Recommendation: Merge dependencies and run 'npm install'"
                print_color "$YELLOW" "     توصية: دمج ال dependencies وتشغيل 'npm install'"
                ;;
            *.json)
                print_color "$YELLOW" "  📄 JSON file: $file"
                print_color "$YELLOW" "     Recommendation: Manually merge configurations"
                print_color "$YELLOW" "     توصية: دمج الإعدادات يدوياً"
                ;;
            *.js|*.jsx|*.ts|*.tsx)
                print_color "$YELLOW" "  📜 Code file: $file"
                print_color "$YELLOW" "     Recommendation: Review both versions carefully"
                print_color "$YELLOW" "     توصية: راجع النسختين بعناية"
                ;;
            *.md)
                print_color "$YELLOW" "  📝 Documentation: $file"
                print_color "$YELLOW" "     Recommendation: Usually safe to merge both"
                print_color "$YELLOW" "     توصية: عادةً آمن دمج الاثنين"
                ;;
            .github/workflows/*)
                print_color "$RED" "  ⚙️  Workflow file: $file"
                print_color "$RED" "     WARNING: Review carefully!"
                print_color "$RED" "     تحذير: راجع بعناية!"
                ;;
            *)
                print_color "$YELLOW" "  📁 Other: $file"
                ;;
        esac
    done
    
    echo ""
    print_color "$BLUE" "Next Steps / الخطوات التالية:"
    print_color "$BLUE" "----------------------------------------"
    echo "1. Read the merge conflict guide:"
    echo "   اقرأ دليل حل التعارضات:"
    echo "   MERGE_CONFLICT_RESOLUTION_GUIDE.md"
    echo ""
    echo "2. Follow the resolution steps in the guide"
    echo "   اتبع خطوات الحل في الدليل"
    echo ""
    echo "3. Test your changes after resolving"
    echo "   اختبر تغييراتك بعد الحل"
    echo ""
    
    # Abort the test merge
    git merge --abort 2>/dev/null || true
    
    # Return to original branch
    git checkout "$BRANCH_NAME" --quiet
    git branch -D "$TEST_BRANCH" --quiet
    
    exit 1
fi
