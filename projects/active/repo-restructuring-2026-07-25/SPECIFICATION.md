# Restructuring Specification — Phase 0 Deliverable

**Status:** Draft (awaiting user feedback on 50-question decisions)  
**Date Created:** 2026-07-31  
**Owner:** Ash Shaw (review), Claude Code (implementation support)  
**Target Completion:** Phase 1 implementation begins 2026-08-02

---

## Executive Summary

This specification defines the folder reorganisation, file migrations, and reference updates required to implement the repository restructuring decisions from the 50-questions review.

**Core Changes:**

- Consolidate `.schemas/` and `schema/` → single visible `schemas/` folder at root
- Separate portable assets (agents, skills, hooks, etc.) from `.github`-specific tools
- Reorganise root folder to reduce clutter and improve cross-project discoverability
- Update all script references and documentation links

**Estimated Effort:** 2–3 days (implementation + validation + documentation)  
**Risk Level:** Medium (schema consolidation affects validation workflows; testing required)

---

## 1. Folder-by-Folder Mapping

### 1.1 Schema Consolidation

**Current State:**

```
.schemas/memory/                      (6 files, hidden)
  ├── memory-example-pack.schema.json
  ├── memory-profile.schema.json
  ├── memory-record.schema.json
  ├── memory-registry.schema.json
  └── memory-snapshot.schema.json

schema/                               (25+ files, visible root)
  ├── agent-*.json
  ├── frontmatter.schema.json
  ├── plugin-manifest.schema.json
  ├── memory/                         (duplicate of .schemas/memory/)
  └── ... (15+ other schemas)
```

**Target State:**

```
schemas/                              (visible root, single source of truth)
  ├── README.md
  ├── memory/
  │   ├── memory-example-pack.schema.json
  │   ├── memory-profile.schema.json
  │   ├── memory-record.schema.json
  │   ├── memory-registry.schema.json
  │   └── memory-snapshot.schema.json
  ├── frontmatter/                    (future: agent.schema.json, documentation.schema.json, etc.)
  ├── github/                         (future: issue.schema.json, pr.schema.json)
  ├── plugins/
  └── ... (all other schemas consolidated)
```

**Migration Steps:**

1. Create `schemas/` at root (if not already present)
2. Copy all files from `schema/` → `schemas/` (preserving subdirectory structure)
3. Move `memory/` from `.schemas/` → `schemas/memory/` (already exists in `schema/memory/`, deduplicate if needed)
4. Archive old locations: `.schemas/` → `.github/tmp/schema-archive/` (backup, don't delete yet)
5. Archive old location: `schema/` → `.github/tmp/schema-archive/` (backup, don't delete yet)
6. **Do NOT delete** until all references are updated and validation passes

---

### 1.2 Root Cleanup — Move to `.github/`

**Move these folders from root → `.github/`:**

| Current Location | New Location | Reason |
| --- | --- | --- |
| `scripts/` | `.github/scripts/` | `.github`-specific validation & automation |
| `website/` | `.github/website/` | `.github` documentation site (github.lightspeedwp.agency) |
| `config/` (GitHub-specific) | `.github/config/` | GitHub labels, workflows, issue types |
| `.github/config/` → consolidate | `.github/config/` | Already in right place; consolidate splits if any |

**Keep at root (portable):**

| Folder | Reason |
| --- | --- |
| `agents/` | Reusable agents for all projects |
| `skills/` | Portable skills for all projects |
| `hooks/` | Cross-project git hooks & guardrails |
| `instructions/` | Reusable instruction standards |
| `plugins/` | Plugin specs for all external tools |
| `prompts/` | Reusable prompt templates |
| `cookbook/` | Implementation recipes for all projects |
| `docs/` | Permanent documentation (org-wide + repo-specific) |
| `schemas/` | Consolidated JSON schemas (consolidated, visible) |

**Keep in `.github/` (repo-specific):**

| Folder | Reason |
| --- | --- |
| `.github/workflows/` | GitHub Actions (`.github`-only) |
| `.github/ISSUE_TEMPLATE/` | GitHub issue templates |
| `.github/PULL_REQUEST_TEMPLATE/` | GitHub PR templates |
| `.github/agents/` | `.github`-specific agents (repo structure linter, changelog recovery, etc.) |
| `.github/skills/` | `.github`-specific skills (changelog entry, PR review, release audit) |
| `.github/instructions/` | `.github`-specific instruction files |
| `.github/custom-instructions.md` | Copilot configuration for this repo |
| `.github/scripts/` | Validation scripts tightly coupled to repo structure (move from root) |
| `.github/config/` | GitHub labels, labeler rules, issue types |
| `.github/website/` | github.lightspeedwp.agency documentation site (move from root) |
| `.github/projects/` | Active/archived project documentation |
| `.github/reports/` | Reports and audit artefacts |
| `.github/tmp/` | Temporary scratch files (cleanup before PR) |

---

### 1.3 `config/` Folder Consolidation

**Current:** `config/` at root (mixed GitHub-native + portable)

**Action:** Split into two locations:

**Portable Config → Root `config/`:**

```
config/
  ├── eslintrc.json              (shared across projects)
  ├── prettier.json              (shared across projects)
  ├── tsconfig.json              (shared across projects)
  ├── phpcs.xml                  (shared across projects)
  ├── commitlint.config.js       (shared across projects)
```

**GitHub-Native Config → `.github/config/`:**

```
.github/config/
  ├── labels.yml                 (GitHub-native)
  ├── labeler.yml                (GitHub Actions labeler)
  ├── issue-types.yml            (GitHub issue types)
  ├── eslintrc-strict.json       (stricter for .github repo)
  ├── prettier-strict.json       (stricter for .github repo)
```

---

## 2. File References That Require Updates

### 2.1 Script Updates (in `.github/scripts/validation/`)

**Files to audit and update:**

1. **`validate-frontmatter.js`**
   - Current: `../../schema/frontmatter.schema.json`
   - New: `../../../schemas/frontmatter.schema.json` (move to `.github/scripts/validation/`)
   - Search & replace all schema path references

2. **`validate-agents.js`**
   - Current: references `schema` directory
   - New: references `schemas` directory
   - Update all glob patterns and requires

3. **`validate-skills.js`** (if exists)
   - Current: references `schema` directory
   - New: references `schemas` directory

4. **`validate-plugins.js`** (if exists)
   - Current: references `schema` directory
   - New: references `schemas` directory

5. **`validate-json.js`**
   - Current: likely references `schema/**/*.json`
   - New: references `schemas/**/*.json`

---

### 2.2 npm Scripts (in `package.json`)

**Audit and update glob patterns:**

```bash
# BEFORE:
npm run validate:json         # May use schema/**/*.json glob
npm run validate:agents       # May reference schema/ path

# AFTER:
npm run validate:json         # Uses schemas/**/*.json glob
npm run validate:agents       # References schemas/ path
```

**Action:** Search `package.json` for all `schema/` references; replace with `schemas/`

---

### 2.3 GitHub Workflows (in `.github/workflows/`)

**Files to audit:**

1. **`template-enforcement.yml`** (if references schemas)
   - Search for `schema/` paths → update to `schemas/`

2. **`frontmatter-validation.yml`** (if exists)
   - Update schema path references

3. **Any validation workflows**
   - Update glob patterns and path references

---

### 2.4 Documentation Links (in `docs/` and `README.md`)

**Search for:**

```
schema/
.schemas/
```

**Replace with:**

```
schemas/
```

**Files to check:**

- `docs/*.md` (all documentation files)
- `README.md` (root)
- `.github/README.md` (if exists)
- `agents/README.md`
- `skills/README.md`
- Any other `.md` files that reference schemas

---

### 2.5 Instruction Files (in `instructions/` and `.github/instructions/`)

**Search for schema references:**

```
schema/
.schemas/
```

**Examples likely to reference schemas:**

- `instructions/documentation-formats.instructions.md`
- `instructions/file-organisation.instructions.md`
- `.github/custom-instructions.md`
- `.github/instructions/agent-development.instructions.md` (if exists)

---

### 2.6 Agent & Skill Specs

**If any agent or skill specs reference schemas:**

- `agents/README.md` — update links to schema documentation
- `skills/README.md` — update links to schema documentation
- Individual agent/skill files — update any hardcoded schema path references

---

### 2.7 Configuration Files

**Update `.github/` relative paths:**

- `.eslintrc.json` (if references schema)
- Any config files that reference schema paths

---

## 3. Implementation Sequencing

### Phase 0 (Pre-work) — Before Any Code Changes

- [ ] User confirms all 50-question decisions (**BLOCKER**)
- [ ] Git status is clean; no uncommitted changes
- [ ] Create backup branch: `git checkout -b backup/pre-restructure-2026-07-31`
- [ ] Tag current state: `git tag backup/pre-restructure-2026-07-31`

### Phase 1: Folder Moves (Safe, Reversible)

1. **Create `schemas/` folder** (if not present)

   ```bash
   mkdir -p schemas
   ```

2. **Copy content from `schema/` → `schemas/`** (don't delete yet)

   ```bash
   cp -r schema/* schemas/
   ```

3. **Verify consolidation**

   ```bash
   ls -la schemas/ | head -20
   find schemas -type f | wc -l
   ```

4. **Create `.github/scripts/` folder** (if not present)

   ```bash
   mkdir -p .github/scripts
   ```

5. **Move scripts from `scripts/` → `.github/scripts/`** (don't delete yet)

   ```bash
   cp -r scripts/* .github/scripts/
   ```

6. **Move website** (if applicable)

   ```bash
   mkdir -p .github/website
   cp -r website/* .github/website/
   ```

### Phase 2: Reference Updates (Per File Type)

1. **Update npm scripts** (`package.json`)
   - Find & replace `schema/` → `schemas/`
   - Find & replace `.schemas/` → `schemas/`

2. **Update validation scripts** (`.github/scripts/validation/*.js`)
   - Update all relative paths
   - Test each script individually

3. **Update GitHub workflows** (`.github/workflows/*.yml`)
   - Test workflows in CI before merging

4. **Update documentation** (`docs/`, `README.md`, agent/skill files)
   - Bulk find & replace `schema/` → `schemas/`

5. **Update instruction files**
   - Bulk find & replace schema path references

### Phase 3: Validation & Testing

1. **Run all validation scripts**

   ```bash
   npm run validate:frontmatter
   npm run validate:agents
   npm run validate:plugins
   npm run validate:json
   ```

2. **Run full test suite**

   ```bash
   npm test
   ```

3. **Manual verification**
   - Verify `schemas/` contains all expected files
   - Verify `.github/scripts/` contains all scripts
   - Verify no broken imports in scripts
   - Verify documentation links work (grep for broken refs)

### Phase 4: Cleanup (After Validation Success)

1. **Archive old locations** (do NOT delete immediately)

   ```bash
   mkdir -p .github/tmp/schema-archive
   mv .schemas .github/tmp/schema-archive/dot-schemas-backup
   mv schema .github/tmp/schema-archive/schema-backup
   mkdir -p .github/tmp/scripts-archive
   mv scripts .github/tmp/scripts-archive/scripts-backup
   ```

2. **Commit cleanup**

   ```bash
   git add .github/tmp/schema-archive/ .github/tmp/scripts-archive/
   git commit -m "refactor: archive old schema and scripts locations"
   ```

3. **Final cleanup** (only after PR merges and no issues reported)
   - Remove `.github/tmp/schema-archive/` and `.github/tmp/scripts-archive/`
   - (Keep backups in Git history via tags)

### Phase 5: Documentation Updates

1. **Create migration guide** (`.github/docs/MIGRATION.md`)
   - Document schema consolidation
   - Document folder moves
   - Provide reference update checklist

2. **Update README files**
   - `schemas/README.md` — new file documenting schema organisation
   - `agents/README.md` — update links
   - `skills/README.md` — update links

3. **Update CLAUDE.md** (this file)
   - Update path reference section with migration details
   - Link to migration guide

---

## 4. Dependency Graph — What Must Happen First

```
┌─────────────────────────────────────────┐
│ 0. User confirms all 50-question        │
│    decisions (BLOCKER)                  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 1. Folder moves (create new locations)  │
│    - Create schemas/                    │
│    - Create .github/scripts/            │
│    - Create .github/website/            │
│    - Copy files (don't delete yet)      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 2. Reference updates (by type)          │
│    - Update npm scripts                 │
│    - Update validation scripts          │
│    - Update workflows                   │
│    - Update docs & instructions         │
│    - Test each script                   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 3. Validation & testing                 │
│    - Run validation scripts             │
│    - Run full test suite                │
│    - Manual verification                │
│    - Fix any issues                     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 4. Create PR & merge                    │
│    - Create branch: refactor/...        │
│    - All validation passes              │
│    - Merge to develop                   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 5. Final cleanup                        │
│    - Archive old locations              │
│    - Remove archives (after PR merges)  │
│    - Update documentation               │
└─────────────────────────────────────────┘
```

---

## 5. Success Criteria

### Phase 1 Success (Folder Moves)

- ✅ `schemas/` folder exists at root with all schema files
- ✅ `.github/scripts/` folder exists with all scripts
- ✅ No data loss (old folders still exist in `.github/tmp/`)
- ✅ Git status shows new files (not yet committed)

### Phase 2 Success (Reference Updates)

- ✅ All npm scripts reference `schemas/` (not `schema/` or `.schemas/`)
- ✅ All validation scripts use correct relative paths
- ✅ All GitHub workflows updated
- ✅ All documentation links point to `schemas/`
- ✅ Grep finds zero references to old paths

### Phase 3 Success (Validation)

- ✅ `npm run validate:frontmatter` passes
- ✅ `npm run validate:agents` passes
- ✅ `npm run validate:plugins` passes
- ✅ `npm run validate:json` passes
- ✅ `npm test` passes (all tests)
- ✅ No broken documentation links
- ✅ No import errors in scripts

### Phase 4 Success (PR Merge)

- ✅ PR created on branch `refactor/schema-consolidation-scripts-move`
- ✅ All CI checks pass
- ✅ PR reviewed and approved
- ✅ PR merged to `develop`
- ✅ Branch deleted

### Phase 5 Success (Documentation)

- ✅ Migration guide exists at `.github/docs/MIGRATION.md`
- ✅ README files updated (`schemas/README.md`, agents, skills)
- ✅ CLAUDE.md updated with migration reference
- ✅ Documentation reviewed by user

---

## 6. Risk Mitigation

| Risk | Mitigation |
| --- | --- |
| Broken script imports during consolidation | Test each script individually in Phase 2 before merging |
| Missing schema files during copy | Verify file counts before/after: `find schemas -type f \| wc -l` |
| Workflow failures due to path changes | Test workflows in CI; revert PR if tests fail |
| Documentation becomes outdated | Comprehensive migration guide in Phase 5 |
| Team members use old paths | Clear communication in PR description + migration guide |

---

## 7. Rollback Plan

**If validation fails at any point:**

1. **Do NOT proceed** to next phase
2. **Revert local changes** (don't commit)

   ```bash
   git reset --hard HEAD
   git clean -fd
   ```

3. **Or revert PR** (if already merged)

   ```bash
   git revert <merge-commit-hash>
   ```

4. **Return to backup branch**

   ```bash
   git checkout backup/pre-restructure-2026-07-31
   ```

---

## 8. Communication Plan

### Before Starting (Phase 0)

- Share this specification with team
- Wait for user approval on 50-question decisions

### During Implementation (Phases 1–4)

- Create PR on `refactor/schema-consolidation-scripts-move` branch
- Link to this specification in PR description
- Request review from team
- Run CI/CD checks

### After Merging (Phase 5)

- Share migration guide in team channel
- Update project documentation
- Document any learnings for next refactoring

---

## 9. Questions for User

Before proceeding to implementation, please confirm:

1. **Are all 50-question decisions finalized?** (BLOCKER)
   - If not, provide feedback on any questions that need clarification
2. **Should we keep the archived folders** (`.github/tmp/schema-archive/`) **in Git?**
   - Or delete them after PR merges (keep only in Git history)?
3. **Any other teams or projects** that reference these schema paths?
   - May need additional communication/updates in their repos
4. **Timeline preference** — start implementation today, or wait?

---

## Next Steps

1. User reviews this specification
2. User confirms or requests changes
3. Once approved: Proceed to task 0.4 (Pre-Flight Checklist)
4. Once checklist is ready: Begin Phase 0 implementation (0.1–0.2 completion + backup)
5. Phase 1 begins: Folder moves

---

**Created by:** Claude Code  
**Status:** Draft (awaiting user review)  
**Last Updated:** 2026-07-31
