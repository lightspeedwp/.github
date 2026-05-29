#!/bin/bash

# WCEU 2026 Readiness Verification Script
# Validates all Phase 1 completion requirements

CHECKS_PASSED=0
CHECKS_FAILED=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "WCEU 2026 Phase 1 Readiness Check"
echo "=========================================="
echo ""

# Helper functions
pass_check() {
  echo -e "${GREEN}✓${NC} $1"
  ((CHECKS_PASSED++))
}

fail_check() {
  echo -e "${RED}✗${NC} $1"
  ((CHECKS_FAILED++))
}

warn_check() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Schema Migration Checks
echo "=== Schema Migration ==="
[ ! -d .schemas ] && pass_check ".schemas/ directory deleted" || fail_check ".schemas/ directory still exists"
[ -f schema/frontmatter.schema.json ] && pass_check "schema/frontmatter.schema.json exists" || fail_check "schema/frontmatter.schema.json missing"
[ -f schema/plugin-manifest.schema.json ] && pass_check "schema/plugin-manifest.schema.json exists" || fail_check "schema/plugin-manifest.schema.json missing"
[ -d schema/memory ] && pass_check "schema/memory/ subdirectory exists" || fail_check "schema/memory/ subdirectory missing"
[ $(ls schema/memory/*.json 2>/dev/null | wc -l) -eq 5 ] && pass_check "schema/memory/ has 5 memory schemas" || fail_check "schema/memory/ missing schemas"
[ -f schema/schema-registry.json ] && pass_check "schema/schema-registry.json exists" || fail_check "schema/schema-registry.json missing"

# Check for remaining .schemas references (excluding archived/settings)
SCHEMAS_REFS=$(grep -r "\.schemas" . --include="*.js" --include="*.json" --include="*.yml" --include="*.md" 2>/dev/null | grep -v node_modules | grep -v "archived" | grep -v "metrics.config.json" | grep -v "\"yaml.schemas\"" | grep -v "\.claude/settings" | wc -l)
[ $SCHEMAS_REFS -eq 0 ] && pass_check "No orphaned .schemas/ references" || fail_check "Found $SCHEMAS_REFS .schemas/ references"

echo ""
echo "=== Agent Slides Reorganization ==="
[ ! -d agent-slide-decks ] && pass_check "agent-slide-decks/ directory deleted" || fail_check "agent-slide-decks/ directory still exists"
[ $(ls wceu-2026/agent-slides/*.md 2>/dev/null | wc -l) -eq 27 ] && pass_check "wceu-2026/agent-slides/ has 27 files (26 slides + README)" || fail_check "wceu-2026/agent-slides/ file count incorrect"
[ -f wceu-2026/agent-slides/INDEX.md ] && pass_check "wceu-2026/agent-slides/INDEX.md exists" || fail_check "wceu-2026/agent-slides/INDEX.md missing"

echo ""
echo "=== Content Files ==="
[ -f wceu-2026/talk-outline-25min.md ] && pass_check "wceu-2026/talk-outline-25min.md exists" || fail_check "wceu-2026/talk-outline-25min.md missing"
OUTLINE_LINES=$(grep -c "^" wceu-2026/talk-outline-25min.md)
[ $OUTLINE_LINES -gt 50 ] && pass_check "wceu-2026/talk-outline-25min.md has content ($OUTLINE_LINES lines)" || fail_check "wceu-2026/talk-outline-25min.md is stub ($OUTLINE_LINES lines)"

[ -f wceu-2026/README.md ] && [ $(wc -l < wceu-2026/README.md) -gt 10 ] && pass_check "wceu-2026/README.md exists with content" || warn_check "wceu-2026/README.md missing or incomplete"

SLIDES_COUNT=$(ls wceu-2026/slides/slide-*.md 2>/dev/null | wc -l)
[ $SLIDES_COUNT -eq 20 ] && pass_check "wceu-2026/slides/ has 20 slide files" || fail_check "wceu-2026/slides/ has $SLIDES_COUNT files (expected 20)"

echo ""
echo "=== Frontmatter Validation ==="
if npm run validate:frontmatter > /tmp/frontmatter-check.log 2>&1; then
  pass_check "npm run validate:frontmatter passed"
else
  fail_check "npm run validate:frontmatter failed (see /tmp/frontmatter-check.log)"
fi

echo ""
echo "=== Markdown Linting ==="
if npm run lint:md -- wceu-2026/ > /tmp/markdown-lint.log 2>&1; then
  pass_check "npm run lint:md wceu-2026/ passed"
else
  fail_check "npm run lint:md wceu-2026/ failed (see /tmp/markdown-lint.log)"
fi

echo ""
echo "=== File References ==="
# Check that CHANGELOG mentions wceu-2026/agent-slides
if grep -q "wceu-2026/agent-slides" CHANGELOG.md; then
  pass_check "CHANGELOG.md references wceu-2026/agent-slides"
else
  fail_check "CHANGELOG.md does not reference wceu-2026/agent-slides"
fi

# Check that scripts reference wceu-2026/agent-slides
if grep -q "wceu-2026/agent-slides" scripts/audit-branding-patterns.js; then
  pass_check "scripts/audit-branding-patterns.js references wceu-2026/agent-slides"
else
  fail_check "scripts/audit-branding-patterns.js does not reference wceu-2026/agent-slides"
fi

echo ""
echo "=========================================="
echo "Results: ${GREEN}$CHECKS_PASSED passed${NC}, ${RED}$CHECKS_FAILED failed${NC}"
echo "=========================================="

exit $CHECKS_FAILED
