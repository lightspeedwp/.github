# CI/CD Optimization - Implementation Guide

## Quick Reference: Files to Modify

### 1. `.markdownlint-cli2.config.cjs` — Add Exclusion Patterns

**Location:** `/Users/ash/Studio/LightSpeedWP.Agency/.github/.markdownlint-cli2.config.cjs`

**Current ignores array (lines 104-119):**

```javascript
ignores: [
  "node_modules/**",
  "coverage/**",
  "dist/**",
  "build/**",
  ".git/**",
  "**/CHANGELOG.md",
  "**/ALL-CONTRIBUTORS.md",
  "docs/api/**/*.md",
  "docs/MIGRATION.md",
  "*.draft.md",
  "README.template.md",
  "AWESOME_GITHUB_MAPPING_STRATEGY.md",
  "wceu-2026/**/*.md",
  ".github/projects/**/*.md",
],
```

**Proposed change:** Add after `.github/projects/**/*.md` (before closing bracket):

```javascript
ignores: [
  // ... existing patterns ...
  ".github/projects/**/*.md",
  
  // NEW: Vendored/platform-managed content (PRIORITY 1)
  "*/plugin-provided/**",
  "*/platform-managed/**", 
  "*/directory-installed/**",
  "*/tests/markdown-issues.md",
  "*/agentskills-main/**",
  
  // NEW: Generated/audit outputs (PRIORITY 2)
  ".github/reports/**",
  ".github/audits/**",
  ".github/metrics/**",
],
```

**Expected line count change:** 15 → 22 lines (7 new patterns)

**Verification:**

```bash
cd /Users/ash/Studio/LightSpeedWP.Agency/.github
npx markdownlint-cli2 '**/*.md'
# Should show ~5,600 files processed (down from ~9,000)
```

---

### 2. `.github/workflows/testing.yml` — Update Script Exclusions

**Location:** `.github/workflows/testing.yml` (lines 6-9)

**Current config:**

```yaml
on:
  workflow_dispatch:
  push:
    branches: [develop]
    paths-ignore:
      - ".github/reports/**"
      - "reports/**"
      - ".github/projects/**"
```

**Note:** The `paths-ignore` already excludes reports, but the `npm run lint:md` command should use the updated `.markdownlint-cli2.config.cjs` which now has explicit patterns.

**No change needed to testing.yml** if npm script uses the config file. Verify:

```bash
npm run lint:md  # Should use .markdownlint-cli2.config.cjs automatically
```

---

### 3. `.markdownlintignore` — Create Canonical Reference (Optional)

**Location:** `/Users/ash/Studio/LightSpeedWP.Agency/.github/.markdownlintignore` (currently minimal)

**Current content:**

```
# Large comprehensive documents with formatting that can be cleaned up later
AWESOME_GITHUB_MAPPING_STRATEGY.md
docs/MIGRATION.md
```

**Optional enhancement** (if you want centralized ignore list):

```
# Node.js and generated artifacts
node_modules/**
coverage/**
dist/**
build/**
.git/**

# Release files (auto-generated)
**/CHANGELOG.md
**/ALL-CONTRIBUTORS.md

# Special documents (formatting deferred)
AWESOME_GITHUB_MAPPING_STRATEGY.md
docs/MIGRATION.md
docs/api/**/*.md
*.draft.md
README.template.md
wceu-2026/**/*.md

# Vendored and platform-managed content
*/plugin-provided/**
*/platform-managed/**
*/directory-installed/**
*/tests/markdown-issues.md
*/agentskills-main/**

# Generated outputs (not source documentation)
.github/reports/**
.github/audits/**
.github/metrics/**

# Project-scoped documentation
.github/projects/**
```

---

### 4. `.github/workflows/meta.yml` — Verify Consistency

**Location:** `.github/workflows/meta.yml` (lines 92-102)

**Current exclusions (in sed commands):**

```bash
FILES=$(git diff --name-only "$BASE_SHA" "$HEAD_SHA" -- '*.md' '*.mdx' | \
        sed '/^AWESOME_GITHUB_MAPPING_STRATEGY\.md$/d' | \
        sed '/^docs\/MIGRATION\.md$/d' | \
        sed '/^\.github\/reports\//d' | \
        sed '/\/plugin-provided\//d' | \
        sed '/\/platform-managed\//d' | \
        sed '/\/directory-installed\//d' | \
        sed '/\/tests\/markdown-issues\.md$/d' | \
        sed '/\/agentskills-main\//d')
```

**Status:** ✅ meta.yml patterns are already comprehensive. Verify alignment with `.markdownlint-cli2.config.cjs` patterns.

**No changes needed** — meta.yml is using correct patterns.

---

## Testing & Validation

### Step 1: Verify Config Syntax

```bash
cd /Users/ash/Studio/LightSpeedWP.Agency/.github
node -e "const cfg = require('./.markdownlint-cli2.config.cjs'); console.log('✓ Config valid'); console.log(`ignores: ${cfg.ignores.length} patterns`);"
```

**Expected output:**

```
✓ Config valid
ignores: 22 patterns
```

### Step 2: Run Linting with New Config

```bash
npx markdownlint-cli2 '**/*.md' --config .markdownlint-cli2.config.cjs 2>&1 | head -20
```

**Expected:**

- File count reduced to ~5,600 files
- No errors (same strictness as before)
- Output lists only repo-authored files

### Step 3: Measure Performance

```bash
# Before (current)
time npm run lint:md

# After (with new config)
time npm run lint:md
```

**Expected improvement:** 35-45% faster

### Step 4: Run Full Test Suite

```bash
npm run lint:js
npm run lint:yaml
npm run lint:md
npm run test
```

**Expected:** All tests pass, no functionality changes

---

## Rollback Plan

If issues arise:

1. Revert `.markdownlint-cli2.config.cjs` to previous version:

   ```bash
   git checkout HEAD -- .markdownlint-cli2.config.cjs
   ```

2. Verify tests pass:

   ```bash
   npm run lint:md
   npm test
   ```

3. Files are additive only (patterns only add to ignores), so no data loss

---

## Success Indicators

- ✅ `npm run lint:md` completes 35-45% faster
- ✅ File count in linting output reduced to ~5,600 (from ~9,000)
- ✅ All tests continue to pass
- ✅ No new linting errors introduced
- ✅ CI pipeline duration reduced (measure in Actions dashboard)

---

## Monitoring & Measurement

### Baseline (Before)

```
Total files linted: 9,023
Execution time: [RUN FIRST]
Files excluded: 1 (docs/MIGRATION.md)
```

### Target (After)

```
Total files linted: ~5,600
Execution time: 35-45% improvement
Files excluded: ~3,400 (vendored + reports + projects)
```

### Track in GitHub

Add metrics to `.github/metrics/markdown-audit.json`:

```json
{
  "audit_date": "2026-07-24",
  "files_linted_before": 9023,
  "files_linted_after": 5600,
  "estimated_time_savings_pct": 38,
  "patterns_added": 7,
  "implementation_status": "complete"
}
```

---

## Troubleshooting

### Issue: Still linting vendored files

**Symptom:** File count doesn't decrease

**Solution:**

1. Verify pattern syntax in `.markdownlint-cli2.config.cjs`
2. Test patterns individually:

   ```bash
   npx markdownlint-cli2 'agents/*/skills/plugin-provided/**/*.md'
   # Should list files, confirming pattern matches
   ```

3. Check if files exist:

   ```bash
   find agents -type d -name "plugin-provided" | head -5
   ```

### Issue: Legitimate files excluded

**Symptom:** Report files or project docs missing from linting

**Solution:**

1. Verify pattern is too broad
2. Adjust pattern to be more specific
3. Test specific file:

   ```bash
   npx markdownlint-cli2 '.github/reports/analysis/test-coverage-expansion-plan.md' --config .markdownlint-cli2.config.cjs
   ```

---

## Implementation Checklist

- [ ] Review `.markdownlint-cli2.config.cjs` changes
- [ ] Update ignores array with 7 new patterns
- [ ] Run syntax validation
- [ ] Measure file count before/after
- [ ] Run full test suite
- [ ] Measure CI time improvement
- [ ] Document metrics in `.github/metrics/`
- [ ] Create PR with changes
- [ ] Get code review
- [ ] Merge to develop
- [ ] Monitor CI dashboard for sustained improvements

---

## References

- [Markdownlint Configuration](https://github.com/DavidAnson/markdownlint-cli2#configuration)
- [Glob Pattern Syntax](https://github.com/mrmlnc/fast-glob#pattern-syntax)
- [LightSpeedWP CI Workflows](.github/workflows/)

---

**Implementation Target:** Week 1-2  
**Estimated Effort:** 2-4 hours  
**Risk Level:** Low (adds patterns, no deletions)
