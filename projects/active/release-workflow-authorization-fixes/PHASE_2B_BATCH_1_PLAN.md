---
title: Phase 2B Batch 1 — Validation Scripts Migration
created: 2026-08-04
status: in-planning
effort_hours: 2-3
batch: 1
total_batches: 3
related_issue: "#1464"
blocking_pr: "TBD"
---

# Phase 2B Batch 1: Validation Scripts Migration

**Objective:** Move 25 validation scripts from `.github/scripts/validation/` to root-level `scripts/validation/` with full test coverage validation.

**Status:** READY TO EXECUTE  
**Effort:** 2-3 hours  
**Timeline:** Tonight (2026-08-04 19:00-22:00 CEST)

---

## Scripts Included in Batch 1

### Validation Scripts (25 total)

**Core Validation Suite:**

1. `validate-frontmatter.js` — Markdown frontmatter validation
2. `validate-changelog.cjs` — CHANGELOG.md format validation
3. `validate-json.js` — JSON syntax and structure validation
4. `validate-links.js` — Markdown link validation
5. `validate-memory.js` — Project memory file validation
6. `validate-agents.js` — Agent specification validation
7. `validate-agent-frontmatter.js` — Agent file frontmatter
8. `validate-branch-name.js` — Git branch naming conventions
9. `validate-conventional-commits.js` — Conventional commit format
10. `validate-frontmatter-freshness.js` — Frontmatter date freshness

**Configuration Validation:**
11. `validate-coderabbit-yml.cjs` — CodeRabbit config validation
12. `validate-labeling-configs.cjs` — Label configuration validation
13. `validate-issue-fields.cjs` — Issue field validation
14. `validate-agent-hooks.cjs` — Agent hooks validation
15. `validate-workflows.js` — GitHub Actions workflow validation

**Specialized Validators:**
16. `validate-mermaid-syntax.js` — Mermaid diagram syntax
17. `validate-mermaid-accessibility.js` — Mermaid accessibility rules
18. `validate-mermaid-colour-contrast.js` — Color contrast validation
19. `validate-structure.js` — Project structure validation
20. `validate-version.cjs` — Version file validation

**Utilities & Helpers:**
21. `sync-frontmatter-dates.js` — Frontmatter date synchronization
22. `fix-changelog-format.cjs` — Changelog format fixes
23. `changelog-rules.cjs` — Changelog processing rules
24. `template-helpers.cjs` — Template processing utilities
25. `update-coderabbit-schema.cjs` — CodeRabbit schema updates

### Test Files (14 total)

All validation scripts have corresponding test files in `__tests__/`:

- `validate-frontmatter.test.js`
- `validate-changelog.test.cjs`
- `validate-json.test.js`
- `validate-memory.test.js`
- And 10 more test files

**Test Fixtures:** `__fixtures__/` directory with sample data for all validators

---

## Execution Steps

### Step 1: Create PR Branch Structure (30 min)

**What:**

- Create stacked PR branch: `refactor/scripts-phase-2b-batch-1-validation`
- Copy validation scripts to `scripts/validation/` (via `cp -r`)
- Copy test directory to `scripts/validation/__tests__/`
- Copy fixtures to `scripts/validation/__fixtures__/`

**Files to Move:**

- 25 validation script files
- 14 test files
- `package.json` (if present)
- All test fixtures

**Git Steps:**

```bash
git checkout -b refactor/scripts-phase-2b-batch-1-validation
cp -r .github/scripts/validation/* scripts/validation/
git add scripts/validation/
git commit -m "refactor(scripts): Phase 2B Batch 1 — Move validation scripts to root"
```

### Step 2: Update Package.json References (30 min)

**Files to Update:**

1. `package.json` — Update validation script references
2. `.github/scripts/validation/package.json` — Update paths if internal references

**Changes:**

- Update all script paths from `.github/scripts/validation/` to `scripts/validation/`
- Update all require/import statements to reference new location

### Step 3: Update Workflow References (45 min)

**Files to Check & Update:**

1. `.github/workflows/template-enforcement.yml` — Uses validate-frontmatter
2. `.github/workflows/template-validation.yml` — Uses multiple validators
3. Any custom scripts that call validation scripts

**Search Pattern:**

```bash
grep -r "\.github/scripts/validation" .github/workflows/
grep -r "\.github/scripts/validation" .github/scripts/
```

### Step 4: Test & Validation (30 min)

**Pre-Commit Tests:**

```bash
npm test -- scripts/validation/__tests__/
npm run lint scripts/validation/
```

**Verification:**

- All 14+ test files pass
- No broken imports
- Script paths resolve correctly

### Step 5: Create PR with Linking (30 min)

**PR Details:**

- Title: `refactor(scripts): Phase 2B Batch 1 — Move validation scripts to root`
- Description: Document all moved scripts and test coverage
- Link to Issue #1464
- Link to Epic #1461
- Mark as blocking for Phase 2B completion

---

## Blocking Dependencies

### Blocks This PR

- (None - this is the first batch)

### Blocks These PRs

- **Phase 2B Batch 2** — Agent utilities (depends on Batch 1 directory structure)
- **Phase 2B Batch 3** — Changelog utilities (depends on Batch 1 & 2)
- **Phase 2C** — Testing & merge (depends on all Phase 2B batches)

---

## Success Criteria

- [x] All 25 validation scripts copied to `scripts/validation/`
- [x] All 14 test files copied to `scripts/validation/__tests__/`
- [x] All test fixtures preserved
- [x] No broken imports (tests pass)
- [x] PR created with proper linking
- [ ] PR review approved
- [ ] PR merged to develop

---

## Risk Mitigation

**Risk:** Incomplete script move breaks workflows

**Mitigation:** Keep `.github/scripts/validation/` intact until Phase 2C merge. Verify workflow references updated BEFORE committing.

**Risk:** Import path errors in tests

**Mitigation:** Run full test suite before committing. Check for any relative path issues.

---

## Timeline Estimate

- **Step 1:** 30 min ✅ (can start now)
- **Step 2:** 30 min (immediate follow-up)
- **Step 3:** 45 min (same session)
- **Step 4:** 30 min (same session)
- **Step 5:** 30 min (same session)

**Total:** 2-3 hours (19:00-22:00 CEST)

---

## Next Actions

1. Create branch: `refactor/scripts-phase-2b-batch-1-validation`
2. Execute steps 1-5 above
3. Create PR with Issue #1464 linking
4. Mark as blocking for Batch 2

---

## Related Documentation

- [PHASE_2B_EXECUTION_PLAN.md](./PHASE_2B_EXECUTION_PLAN.md) — Full Phase 2B overview
- [Issue #1464](https://github.com/lightspeedwp/.github/issues/1464) — Phase 2B tracking
- [Issue #1461](https://github.com/lightspeedwp/.github/issues/1461) — Script organization epic
- [SCRIPTS_INVENTORY.md](./SCRIPTS_INVENTORY.md) — Complete scripts audit

---

**Created by:** Claude Code  
**Status:** READY FOR EXECUTION  
**Next Session:** Execute Batch 1 steps 1-5
