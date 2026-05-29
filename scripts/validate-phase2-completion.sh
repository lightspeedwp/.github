#!/bin/bash

# Phase 2 WCEU 2026 Validation Script
# Verifies all Phase 2 deliverables are complete and ready for Phase 3

set -e

CHECKS_PASSED=0
CHECKS_FAILED=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Phase 2 WCEU 2026 Completion Validation"
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

info_check() {
  echo -e "${BLUE}ℹ${NC} $1"
}

# 1. NotebookLM Output Files
echo "=== NotebookLM Output Files ==="
[ -f wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md ] && pass_check "wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md exists" || fail_check "wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md missing"

if [ -f wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md ]; then
  # Check for all 4 prompt outputs
  PART1=$(grep -c "Part 1:" wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md 2>/dev/null || echo 0)
  PART2=$(grep -c "Part 2:" wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md 2>/dev/null || echo 0)
  PART3=$(grep -c "Part 3:" wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md 2>/dev/null || echo 0)
  PART4=$(grep -c "Part 4:" wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md 2>/dev/null || echo 0)

  [ $PART1 -gt 0 ] && pass_check "Part 1 (Speaker Notes) present" || warn_check "Part 1 (Speaker Notes) not found"
  [ $PART2 -gt 0 ] && pass_check "Part 2 (Visuals) present" || warn_check "Part 2 (Visuals) not found"
  [ $PART3 -gt 0 ] && pass_check "Part 3 (Metrics) present" || warn_check "Part 3 (Metrics) not found"
  [ $PART4 -gt 0 ] && pass_check "Part 4 (Narrative Flow) present" || warn_check "Part 4 (Narrative Flow) not found"

  # Check file size (should have substantial content)
  LINES=$(wc -l < wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md)
  [ $LINES -gt 100 ] && pass_check "wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md has content ($LINES lines)" || fail_check "wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md appears too short ($LINES lines)"
fi

echo ""
echo "=== Supporting Files ==="
[ -f wceu-2026/PHASE2_NOTEBOOKLM_PROMPTS.md ] && pass_check "wceu-2026/PHASE2_NOTEBOOKLM_PROMPTS.md exists" || fail_check "wceu-2026/PHASE2_NOTEBOOKLM_PROMPTS.md missing"
[ -f wceu-2026/PHASE2_EXECUTION_CHECKLIST.md ] && pass_check "wceu-2026/PHASE2_EXECUTION_CHECKLIST.md exists" || fail_check "wceu-2026/PHASE2_EXECUTION_CHECKLIST.md missing"
[ -f wceu-2026/notebooklm/sources-index.md ] && pass_check "wceu-2026/notebooklm/sources-index.md exists" || fail_check "wceu-2026/notebooklm/sources-index.md missing"

if [ -f wceu-2026/notebooklm/sources-index.md ]; then
  SOURCE_URLS=$(grep -c "^https://" wceu-2026/notebooklm/sources-index.md 2>/dev/null || echo 0)
  [ $SOURCE_URLS -ge 50 ] && pass_check "notebooklm/sources-index.md has $SOURCE_URLS URLs" || warn_check "notebooklm/sources-index.md has only $SOURCE_URLS URLs (expected ~60)"
fi

echo ""
echo "=== Foundation Slides (Google Slides) ==="
info_check "Google Slides verification requires manual check:"
info_check "  - Slide 1: Cover (title, subtitle, speaker name, dark design)"
info_check "  - Slide 2: Speaker intro (photo, bio, credentials, footer)"
info_check "  - Slide 23: Contact details (email, website, GitHub, LinkedIn, footer)"
info_check "  - Slide 24: Thank you (minimal, elegant)"
echo ""
echo -n "Are all 4 foundation slides created and accessible? (y/n): "
read -r SLIDES_COMPLETE
if [ "$SLIDES_COMPLETE" = "y" ]; then
  pass_check "Foundation slides created"
else
  warn_check "Foundation slides not yet complete"
fi

echo ""
echo -n "Google Slides URL (paste here, then press Enter): "
read -r SLIDES_URL
if [ -n "$SLIDES_URL" ]; then
  info_check "Google Slides URL saved: $SLIDES_URL"
  echo "$SLIDES_URL" > wceu-2026/.phase2-slides-url.txt
  pass_check "Google Slides URL recorded in .phase2-slides-url.txt"
else
  warn_check "No Google Slides URL provided"
fi

echo ""
echo "=== Design System (Optional) ==="
[ -f wceu-2026/DESIGN_SYSTEM.md ] && pass_check "wceu-2026/DESIGN_SYSTEM.md exists" || warn_check "wceu-2026/DESIGN_SYSTEM.md not yet created (optional)"

echo ""
echo "=== Content Quality Checks ==="

# Check frontmatter on NotebookLM output
if [ -f wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md ]; then
  if grep -q "^---" wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md && \
     grep -q "^title:" wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md && \
     grep -q "^description:" wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md; then
    pass_check "PHASE2_NOTEBOOKLM_OUTPUT.md has proper frontmatter"
  else
    warn_check "PHASE2_NOTEBOOKLM_OUTPUT.md frontmatter incomplete"
  fi
fi

# Check for key content sections
if [ -f wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md ]; then
  HAS_TIMING=$(grep -c "Timing:" wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md 2>/dev/null || echo 0)
  HAS_EXAMPLES=$(grep -c "Example\|example\|GitHub" wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md 2>/dev/null || echo 0)
  HAS_VISUALS=$(grep -c "diagram\|Diagram\|visual\|Visual\|flowchart" wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md 2>/dev/null || echo 0)

  [ $HAS_TIMING -gt 10 ] && pass_check "Content includes timing estimates ($HAS_TIMING instances)" || warn_check "Timing estimates may be sparse ($HAS_TIMING instances)"
  [ $HAS_EXAMPLES -gt 10 ] && pass_check "Content includes examples and links ($HAS_EXAMPLES instances)" || warn_check "Examples/links may be sparse ($HAS_EXAMPLES instances)"
  [ $HAS_VISUALS -gt 10 ] && pass_check "Content includes visual suggestions ($HAS_VISUALS instances)" || warn_check "Visual suggestions may be sparse ($HAS_VISUALS instances)"
fi

echo ""
echo "=== Markdown Validation ==="
if npm run lint:md -- wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md > /tmp/phase2-lint.log 2>&1; then
  pass_check "PHASE2_NOTEBOOKLM_OUTPUT.md markdown linting passed"
else
  fail_check "PHASE2_NOTEBOOKLM_OUTPUT.md has markdown linting issues (see /tmp/phase2-lint.log)"
fi

echo ""
echo "=== Frontmatter Validation ==="
if npm run validate:frontmatter > /tmp/phase2-frontmatter.log 2>&1; then
  pass_check "All frontmatter validation passed"
else
  # Check specifically for Phase 2 files
  if grep -q "PHASE2_NOTEBOOKLM_OUTPUT\|DESIGN_SYSTEM" /tmp/phase2-frontmatter.log 2>/dev/null; then
    fail_check "Phase 2 files have frontmatter issues (see /tmp/phase2-frontmatter.log)"
  else
    pass_check "Phase 2 files frontmatter OK (other files may have issues)"
  fi
fi

echo ""
echo "=== Phase 2 Readiness for Phase 3 ==="

# Summary
READY_FOR_PHASE3=true
if [ $CHECKS_FAILED -gt 0 ]; then
  warn_check "Some validation checks failed (review above)"
  READY_FOR_PHASE3=false
fi

if [ "$SLIDES_COMPLETE" != "y" ]; then
  warn_check "Foundation slides not complete"
  READY_FOR_PHASE3=false
fi

if [ -z "$SLIDES_URL" ]; then
  warn_check "Google Slides URL not provided"
  READY_FOR_PHASE3=false
fi

echo ""
echo "=========================================="
echo "Results: ${GREEN}$CHECKS_PASSED passed${NC}, ${RED}$CHECKS_FAILED failed${NC}"
echo "=========================================="
echo ""

if [ "$READY_FOR_PHASE3" = true ]; then
  echo -e "${GREEN}✓ Phase 2 Complete — Ready for Phase 3 (May 31)${NC}"
  echo ""
  echo "Next Steps:"
  echo "1. Review PHASE2_NOTEBOOKLM_OUTPUT.md for completeness"
  echo "2. Start Phase 3 on May 31 morning (6–8 hours)"
  echo "3. Transfer NotebookLM briefs to Google Slides"
  echo "4. Design all 24 slides with dark-mode template"
  echo "5. Final accessibility audit + speaker rehearsal"
  exit 0
else
  echo -e "${YELLOW}⚠ Phase 2 Incomplete — Address issues above before Phase 3${NC}"
  echo ""
  echo "Missing:"
  [ "$SLIDES_COMPLETE" != "y" ] && echo "  - Complete 4 foundation slides in Google Slides"
  [ -z "$SLIDES_URL" ] && echo "  - Provide Google Slides URL"
  [ ! -f wceu-2026/PHASE2_NOTEBOOKLM_OUTPUT.md ] && echo "  - Create PHASE2_NOTEBOOKLM_OUTPUT.md with NotebookLM content"
  exit 1
fi
