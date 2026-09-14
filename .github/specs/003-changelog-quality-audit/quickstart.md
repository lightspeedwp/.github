# Quickstart: Changelog Validation Workflow

**Phase**: Phase 1 (Design & Contracts)  
**Created**: 2026-09-12  
**Audience**: Developers; maintainers; QA engineers

---

## Overview

This guide demonstrates the changelog validation workflow end-to-end, from entry submission through CI validation to compliance reporting.

---

## Scenario 1: Developer Submits Compliant Changelog Entry

### Prerequisites
- Git repository cloned locally
- `develop` branch checked out
- Feature branch created following naming convention: `feat/your-feature-name`

### Workflow

**Step 1: Create changelog entry**

Edit `CHANGELOG.md` under `[Unreleased]` section:

```markdown
## [Unreleased]

### Added
- Added dark mode toggle in user settings (#2904)

### Fixed
- Fixed authentication timeout on mobile browsers (#2905)

### Improved
- Dashboard now loads 40% faster (#2903)
```

**Entry Validation Checklist**:
- ✅ Under `[Unreleased]` section
- ✅ Grouped by category (Added/Fixed/Improved/Removed/Security/Deprecated)
- ✅ User-focused language ("Added dark mode" not "Refactored authentication component")
- ✅ Starts with action verb (Added, Fixed, Improved, Removed)
- ✅ References PR or issue (#NNNN)
- ✅ Length: ≤250 characters per entry
- ✅ No implementation jargon (database, API, middleware, etc.)
- ✅ Punctuated consistently

**Character Count**:
- "Added dark mode toggle in user settings (#2904)" = 52 chars ✅ (well under 250)
- "Fixed authentication timeout on mobile browsers (#2905)" = 57 chars ✅
- "Dashboard now loads 40% faster (#2903)" = 39 chars ✅

**Step 2: Commit with meaningful message**

```bash
git add CHANGELOG.md
git commit -m "docs: add changelog entry for dark mode feature

Added entry describing dark mode toggle feature release.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

**Step 3: Push and create PR**

```bash
git push origin feat/dark-mode-toggle
gh pr create --title "feat: dark mode support" \
  --body "Added dark mode toggle in user settings. See CHANGELOG.md for details."
```

**Step 4: CI validation runs automatically**

GitHub Actions workflow `changelog-validate.yml` executes:

1. ✅ **CHK_MAX_LENGTH**: "Added dark mode..." = 52 chars < 250 ✅
2. ✅ **CHK_NO_IMPL_DETAILS**: No banned keywords found ✅
3. ✅ **CHK_HAS_PR_LINK**: References PR #2904 ✅
4. ✅ **CHK_FORMAT_MARKDOWN**: Valid markdown syntax ✅
5. ✅ **CHK_LINK_VALIDITY**: Link to #2904 resolves (GitHub API check) ✅

**Expected CI Result**:

```
✅ changelog-validate (3s)
   All 8 validation rules passed
   Compliance: 100% (3 entries, all compliant)
   
   Entry validation summary:
   ├─ Added dark mode toggle... (#2904) — PASS
   ├─ Fixed authentication timeout... (#2905) — PASS
   └─ Dashboard now loads 40%... (#2903) — PASS
   
   ✅ CI check passed; PR is ready to merge
```

**Step 5: Merge PR**

```bash
gh pr merge feat/dark-mode-toggle --squash
```

Changelog entry is now part of the next release.

---

## Scenario 2: Developer Submits Non-Compliant Entry (Too Long)

### Workflow

**Step 1: Submit oversized entry**

```markdown
## [Unreleased]

### Added
- Implemented comprehensive dark mode functionality including support for OLED displays, automatic scheduling based on system preferences, and real-time theme switching across all UI components with persistent storage in browser local cache to ensure consistent appearance across page refreshes and device restarts (#2904)
```

**Character Count**: 285 characters → exceeds 250-character limit

**Step 2: CI validation fails**

GitHub Actions workflow `changelog-validate.yml` detects violation:

```
❌ changelog-validate (3s)
   Validation FAILED — Fix issues and push again
   
   Entry: "Implemented comprehensive dark mode..."
   ├─ FAIL: CHK_MAX_LENGTH
   │  Expected: ≤250 characters
   │  Actual: 285 characters
   │  Suggestion: Remove implementation details; focus on user-facing change
   │
   │  ✏️ Example of compliant entry:
   │  "Added dark mode toggle in user settings (#2904)"
   │
   └─ Resources:
      • Documentation: docs/CHANGELOG_STANDARDS.md
      • Guidelines: https://keepachangelog.com/
      • Examples: .github/examples/changelog-entries.md
```

**Step 3: Maintainer or developer receives automated PR comment**

```
🚨 Changelog Validation Failed

1 entry requires revision:

**Entry**: "Implemented comprehensive dark mode..."
**Violation**: Exceeds 250 character limit (285 chars)
**Fix**: Keep summaries brief and user-focused

Suggested revision:
✏️ "Added dark mode toggle in user settings (#2904)"

👉 **Next Steps**: 
1. Edit CHANGELOG.md with corrected entry
2. Push to the same branch
3. Validation will re-run automatically

Questions? See [Changelog Standards](docs/CHANGELOG_STANDARDS.md)
```

**Step 4: Developer fixes entry**

```bash
# Edit CHANGELOG.md
nano CHANGELOG.md
```

```markdown
## [Unreleased]

### Added
- Added dark mode toggle in user settings (#2904)
```

**Step 5: Commit and push**

```bash
git add CHANGELOG.md
git commit --amend --no-edit
git push origin feat/dark-mode-toggle --force-with-lease
```

**Step 6: CI re-runs and passes**

```
✅ changelog-validate (3s)
   All 8 validation rules passed
   Entry now compliant: "Added dark mode toggle..." (52 chars)
   ✅ PR ready to merge
```

---

## Scenario 3: Entry with Implementation Details

### Workflow

**Step 1: Submit entry with banned keywords**

```markdown
## [Unreleased]

### Added
- Refactored authentication middleware to support OAuth2 providers with API key rate limiting (#2904)
```

**Analysis**:
- Character count: 95 chars ✅ (under 250)
- But contains: "Refactored", "middleware", "OAuth2 providers", "API" → implementation jargon

**Step 2: CI detects implementation details**

```
⚠️ changelog-validate (3s)
   Validation FAILED — 1 entry requires review
   
   Entry: "Refactored authentication middleware..."
   ├─ FAIL: CHK_NO_IMPL_DETAILS
   │  Found keywords: refactored, middleware, API
   │  Issue: Entry focuses on implementation, not user value
   │
   │  ✏️ User-focused alternatives:
   │  "Improved login experience with multi-factor authentication support (#2904)"
   │  "Users can now use their company login on third-party platforms (#2904)"
   │
   └─ Guidelines: Implementation details belong in PR description, not changelog
```

**Step 3: Developer rewrites entry**

```markdown
## [Unreleased]

### Improved
- Users can now log in using their company account on multiple platforms (#2904)
```

**Validation**:
- User-focused: ✅ Describes benefit to user
- No implementation keywords: ✅ No "refactored", "middleware", "API"
- Has PR link: ✅ References #2904
- Character count: 82 chars ✅

**Step 4: CI passes**

```
✅ changelog-validate
   All validation rules passed
   ✅ Ready to merge
```

---

## Scenario 4: Missing PR Link

### Workflow

**Step 1: Submit entry without PR reference**

```markdown
## [Unreleased]

### Fixed
- Fixed authentication timeout on mobile browsers
```

**Issue**: No PR/issue reference

**Step 2: CI fails**

```
❌ changelog-validate
   Entry: "Fixed authentication timeout..."
   ├─ FAIL: CHK_HAS_PR_LINK
   │  No PR or issue reference found
   │  Suggestion: Add '#1234' to link to the GitHub PR
   │
   │  ✏️ Example:
   │  "Fixed authentication timeout on mobile browsers (#2905)"
```

**Step 3: Developer adds PR reference**

```bash
# Edit CHANGELOG.md to add (#2905)
# Commit and push
git add CHANGELOG.md && git commit --amend --no-edit && git push -u origin
```

**Step 4: CI passes**

```
✅ changelog-validate
   Entry now has PR link (#2905) ✅
   All validation rules passed
```

---

## Scenario 5: Reviewing Compliance Dashboard

### Workflow

**Prerequisites**: Phase 5 has been implemented; metrics dashboard is live at `https://repo.github.io/changelog-metrics/`

**Step 1: Access dashboard**

Open: `.github/reports/changelog-metrics/dashboard.html` (or hosted URL)

**Dashboard Display**:

```
┌─────────────────────────────────────────────────────────────┐
│ CHANGELOG COMPLIANCE DASHBOARD                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Current Compliance:  95.1%  ████████████████░  (95% goal)  │
│  Last Updated:        2026-09-12 00:00:00 UTC              │
│  Entries (Total):     185                                   │
│  Entries (Compliant): 176                                   │
│  Entries (Non-compliant): 6                                │
│  Entries (Review):    3                                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ 30-DAY TREND                                                │
│                                                             │
│   % │                                         ╱─ 95.1%     │
│100% │                                       ╱              │
│  80%│────────────────────────────────────────────           │
│  60%├────────────────────────────────────────────           │
│  40%│                                                       │
│  20%│                                                       │
│   0%└────────────────────────────────────────────           │
│      Aug 13          Aug 26          Sep 12                 │
│                      (81.2%) → 95.1% (improving)            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ VIOLATIONS BREAKDOWN (this week)                            │
│                                                             │
│  CHK_MAX_LENGTH:         1  (12.5%)  ░░░░░░░░░░           │
│  CHK_NO_IMPL_DETAILS:    6  (75.0%)  ░░░░░░░░░░░░░░░░     │
│  CHK_HAS_PR_LINK:        2  (25.0%)  ░░░░░░░░░░           │
│  CHK_FORMAT_MARKDOWN:    0  ( 0.0%)                         │
│  CHK_LINK_VALIDITY:      0  ( 0.0%)                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ ENTRY LENGTH DISTRIBUTION                                   │
│                                                             │
│  0–100 chars:      12  (6.5%)   ░░░                        │
│  100–250 chars:   164 (88.6%)   ░░░░░░░░░░░░░░░░░░░░     │
│  250–500 chars:     8  (4.3%)   ░░                          │
│  500+ chars:        1  (0.5%)   ░                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Interpretation**:
- ✅ 95.1% compliance achieved (goal is 95%)
- ✅ Trend shows improvement over 30 days (81.2% → 95.1%)
- ⚠️ CHK_NO_IMPL_DETAILS remains top violation (6 occurrences)
- ✅ Most entries (88.6%) are in ideal 100–250 char range

**Step 2: Drill down into violations**

Click on "CHK_NO_IMPL_DETAILS" to see affected entries:

```
TOP VIOLATIONS: Implementation Details

Entry 1: "Refactored validation middleware to improve error handling (#2901)"
  Issue: Keywords "Refactored", "middleware", "error handling" (implementation focus)
  Fix: "Improved form validation error messages (#2901)"
  
Entry 2: "Deployed new caching layer using Redis (#2902)"
  Issue: Keywords "Deployed", "caching layer", "Redis" (internal details)
  Fix: "Dashboard now loads 40% faster (#2902)"
  
Entry 3: "Updated database migration system to support rollback (#2903)"
  Issue: Keywords "Updated", "database", "migration" (internal systems)
  Fix: "Releases now support zero-downtime deployments (#2903)"

[6 total violations shown]
```

**Step 3: Maintainer action**

Maintainer can:
1. Edit entries to make them compliant
2. Create follow-up issues for team discussion
3. Export report for leadership review
4. Track compliance trend over time

---

## Contract Validation Checklist

Use this checklist before submitting a changelog entry:

### Entry Quality
- [ ] Starts with action verb (Added, Fixed, Improved, Removed, Changed, Deprecated, Secured)
- [ ] Describes user-facing benefit, not implementation
- [ ] ≤250 characters (counting punctuation and spaces)
- [ ] References PR or issue (#NNNN format)
- [ ] No banned implementation keywords (see data-model.md)
- [ ] Valid markdown syntax (no raw HTML)
- [ ] Consistent punctuation (period at end or consistent without)

### Validation
- [ ] CI check `changelog-validate` passes (all 8 rules)
- [ ] No automated PR comments with validation failures
- [ ] Maintainer approval (if review_required status)

### Pre-Submission Test
```bash
# Run local validation before pushing (requires Phase 5 implementation)
npm run validate:changelog -- CHANGELOG.md

# Expected output:
# ✅ All entries compliant (3/3)
# Compliance: 100%
# Ready to submit
```

---

## Troubleshooting

### Problem: "Entry exceeds 250 characters"

**Solution**: Remove implementation details; focus on user benefit.

| ❌ Too long | ✅ Fixed |
|----------|---------|
| "Refactored authentication middleware to support OAuth2 providers with API key rate limiting and multi-factor authentication options" (156 chars) | "Added multi-factor authentication support (#2904)" (52 chars) |
| "Implemented new caching layer using Redis to improve dashboard performance and reduce database load" (102 chars) | "Dashboard now loads 40% faster (#2903)" (39 chars) |

### Problem: "Entry contains implementation details"

**Solution**: Rewrite from user perspective, not developer perspective.

| ❌ Implementation | ✅ User-Focused |
|-----------|-----------|
| "Refactored form validation logic" | "Form validation now gives clearer error messages" |
| "Updated database schema" | "Improved data consistency" |
| "Optimised API query performance" | "API calls are now 50% faster" |

### Problem: "No PR link found"

**Solution**: Add PR reference in format `#1234`.

```markdown
❌ "Fixed authentication bug"
✅ "Fixed authentication bug (#2905)"
```

### Problem: "Link does not resolve"

**Solution**: Verify PR/issue number is correct.

```bash
# Check if PR exists
gh pr view 2904  # If this fails, number is wrong

# Correct the CHANGELOG.md entry with valid PR number
```

---

## Phase 1 Complete

Quickstart validation workflow guide defined. Covers:
- Compliant entry submission (happy path)
- Common validation failures (too long, impl. details, missing links)
- Dashboard usage and trend interpretation
- Troubleshooting guide

**Next**: Run `/speckit-tasks` to generate implementation task breakdown

---

## Quick Reference

### Banned Implementation Keywords
`refactored`, `optimised`, `optimized`, `fixed`, `updated`, `patched`, `implemented`, `deployed`, `migrated`, `restructured`, `logic`, `algorithm`, `framework`, `component`, `middleware`, `REST API`, `GraphQL`, `database`, `query`, `cache`

### PR Link Format
```markdown
(#1234)                    # Simple PR reference
- Feature description (#1234)   # Within entry
- Feature description (fixes #1234)  # With issue link
- Feature description (#1234, #1235) # Multiple PRs
```

### Compliant Entry Examples
```markdown
- Added dark mode toggle in user settings (#2904)
- Fixed authentication timeout on mobile browsers (#2905)
- Dashboard now loads 40% faster (#2903)
- Improved form validation error messages (#2906)
- Users can now export reports as PDF (#2907)
```

### Non-Compliant Entry Examples (and why)
```markdown
❌ "Refactored authentication component to use OAuth2 middleware" 
   → Too long (79 chars) + impl. details ("OAuth2", "middleware")

❌ "Updated database migration system"
   → No PR link + impl. details ("database")

❌ "Implemented new caching layer with Redis integration for improved performance"
   → Too long (83 chars) + impl. details ("Redis", "caching")
```
