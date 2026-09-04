---
file_type: "prompt"
title: "Move Files From .github/ to Root Folders"
description: "Audit .github/ subfolders for misplaced files, categorize by portability, migrate to correct root locations, update all references, and generate migration audit report."
version: "1.0.0"
created: "2026-09-04"
status: "active"
tags: ["file-organisation", "migration", "refactoring", "cleanup"]
owners: ["ashley@lightspeedwp.agency"]
---

# Prompt: Move Files Incorrectly Filed Under .github/ or Subfolders

## PROMPT: Audit and migrate files from .github/ to correct root locations

This prompt systematically moves misplaced files from `.github/` to correct root folders, updates all references, and generates migration audit report.

### Context

Per CLAUDE.md repository boundaries:

| Asset Type | Correct Location |
|------------|------------------|
| GitHub-native governance | `.github/` (templates, labels, workflows) |
| Repo-local instructions | `.github/instructions/` or `.github/custom-instructions.md` |
| **Portable assets** | **Root folders** (agents/, instructions/, skills/, scripts/, workflows/) |
| Reports & audits | `.github/reports/{category}/` |
| Active project artefacts | `.github/projects/active/{slug}/` |

**Problem:** Agents, scripts, and portable instructions sometimes end up in `.github/` when they should be at root.

**Solution:** Audit, categorize, and migrate files to correct locations.

---

## STEP 1: Audit Current State

### 1a: List files in `.github/` subfolders

```bash
# Find all non-governance files in .github/
find .github -type f -name "*.md" -o -name "*.js" -o -name "*.json" | grep -v PULL_REQUEST | grep -v ISSUE | grep -v workflows | grep -v labels

# Example output:
# .github/scripts/cleanup-branches.js ← should be in scripts/
# .github/scripts/openspec.js ← should be in scripts/
# .github/instructions/coding-standards.md ← might stay, might move to instructions/
# .github/instructions/readme.instructions.md ← might stay, might move
# .github/instructions/.archive/old-instruction.md ← archive decision needed
```

### 1b: Create audit inventory

```markdown
## File Audit Inventory

### Phase 1: .github/scripts/ → scripts/

| File | Current | Target | Type | Portable? | Decision |
|------|---------|--------|------|-----------|----------|
| cleanup-branches.js | .github/scripts/ | scripts/ | script | YES | MOVE |
| openspec.js | .github/scripts/ | scripts/ | script | YES | MOVE |
| generate-changelog.js | .github/scripts/ | scripts/ | script | YES | MOVE |

**Status:** 3 files ready to move

### Phase 2: .github/instructions/ (Archive Review)

| File | Current | Type | Has .github assumptions? | Decision |
|------|---------|------|--------------------------|----------|
| coding-standards.instructions.md | .github/instructions/ | instruction | No (generic) | MOVE to root |
| file-organisation.instructions.md | .github/instructions/ | instruction | Yes (.github-specific) | STAY in .github/ |
| readme.instructions.md | .github/instructions/ | instruction | No (generic) | MOVE to root |
| mermaid.instructions.md | .github/instructions/ | instruction | No (generic) | MOVE to root |

**Status:** Review each for portability

### Phase 2b: .github/instructions/.archive/

| File | Type | Status | Decision |
|------|------|--------|----------|
| old-workflows.md | instruction | Archived (outdated) | RESTORE to instructions/ or DELETE |
| legacy-guides.md | instruction | Archived (outdated) | REVIEW for value, RESTORE or DELETE |

**Status:** Evaluate each archived file
```

---

## STEP 2: Categorize Files by Portability

For each misplaced file, classify:

```markdown
## File Categorization

### Category A: Portable (Move to Root)

Files with NO .github assumptions → Move to root equivalent folder

**Pattern:** Reusable tools, generic documentation, utility scripts

Examples:
- `.github/scripts/cleanup-branches.js` → `scripts/cleanup-branches.js`
- `.github/instructions/coding-standards.md` → `instructions/coding-standards.md`
- `.github/instructions/readme.instructions.md` → `instructions/readme.instructions.md`

### Category B: Repo-Governance (Keep in .github/)

Files with .github-specific assumptions → Stay in `.github/`

**Pattern:** Repository-specific configuration, governance, GitHub Actions

Examples:
- `.github/instructions/file-organisation.instructions.md` (references .github/)
- `.github/PULL_REQUEST_TEMPLATE/` (GitHub-native)
- `.github/workflows/` (GitHub Actions)
- `.github/labeler.yml` (GitHub labeler)

### Category C: Archived (Evaluate)

Files in `.github/instructions/.archive/` → Decide fate

**Pattern:** Legacy, outdated, or deprecated content

Examples:
- `.github/instructions/.archive/old-guide.md` (outdated)
- `.github/instructions/.archive/deprecated-workflow.md` (no longer used)

**Decision matrix:**
- Valuable but outdated? → RESTORE to instructions/, UPDATE content
- No longer needed? → DELETE (but preserve in git history)
- Specialised archive? → KEEP in archive
```

---

## STEP 3: Plan Migration Phases

Break migration into safe phases:

```markdown
## Migration Plan

### Phase 1: .github/scripts/ → scripts/ (LOW RISK)

**Files to move:**
- cleanup-branches.js
- openspec.js
- generate-changelog.js

**Effort:** 30 minutes
**Risk:** LOW (simple scripts, no cross-repo dependencies)

### Phase 2: Portable Instructions → instructions/ (MEDIUM RISK)

**Files to move:**
- coding-standards.instructions.md
- readme.instructions.md
- mermaid.instructions.md

**Files to stay in .github/:**
- file-organisation.instructions.md (references .github/)
- pr-template.md (GitHub-specific)

**Effort:** 1 hour (move + update references)
**Risk:** MEDIUM (update references in README, CLAUDE.md, etc.)

### Phase 2b: Archive Evaluation (LOW RISK)

**Files in .github/instructions/.archive/:**
- Review each file
- Decide: RESTORE, UPDATE & RESTORE, or DELETE

**Effort:** 1 hour
**Risk:** LOW (separate decision, doesn't affect current state)

### Phase 3: Create Root Folder READMEs (MEDIUM RISK)

After moving files:
- Create/update `scripts/README.md`
- Create/update `instructions/README.md`
- Update any affected root-level documentation

**Effort:** 1 hour
**Risk:** MEDIUM (documentation updates)
```

---

## STEP 4: Phase 1 — Move .github/scripts/ to scripts/

```bash
# Verify scripts/ folder exists
mkdir -p scripts

# Move files with git history preserved
git mv .github/scripts/cleanup-branches.js scripts/cleanup-branches.js
git mv .github/scripts/openspec.js scripts/openspec.js
git mv .github/scripts/generate-changelog.js scripts/generate-changelog.js

# Update references in package.json (if scripts are used there)
# Example: change
#   "clean": "node .github/scripts/cleanup.js"
# to:
#   "clean": "node scripts/cleanup.js"

git add package.json

# Update references in documentation
# Example: Update .github/projects/active/*/README.md
# Change: "See .github/scripts/..."
# To: "See scripts/..."

git add .github/projects/active/*/README.md

# Remove empty .github/scripts/ folder
rmdir .github/scripts

# Commit all changes
git commit -m "refactor: move utility scripts from .github/scripts/ to root scripts/

- cleanup-branches.js
- openspec.js  
- generate-changelog.js

Update all references in package.json and documentation.
Preserve git history using 'git mv'.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# Verify migration
ls -la scripts/
git log --oneline scripts/cleanup-branches.js  # Should show history
```

---

## STEP 5: Phase 2 — Move Portable Instructions to instructions/

```bash
# Verify instructions/ folder exists
mkdir -p instructions

# Identify portable instructions (no .github references)
grep -l "\.github" .github/instructions/*.md

# For each portable file (returns empty or few files):
# Move with git history
git mv .github/instructions/coding-standards.instructions.md instructions/coding-standards.md
git mv .github/instructions/readme.instructions.md instructions/readme.md
git mv .github/instructions/mermaid.instructions.md instructions/mermaid.md

# Update all references
# In CLAUDE.md:
#   change: "instructions/..." 
#   to stay as: "instructions/..."
# In .github/instructions/file-organisation.instructions.md:
#   change: if referencing moved files
# In other docs:
#   change: ".github/instructions/..." → "instructions/..."

# Example: Update CLAUDE.md
sed -i 's/\.github\/instructions\/coding-standards/instructions\/coding-standards/g' CLAUDE.md
sed -i 's/\.github\/instructions\/readme/instructions\/readme/g' CLAUDE.md

git add CLAUDE.md .github/instructions/file-organisation.instructions.md

# Commit changes
git commit -m "refactor: move portable instructions to root instructions/ folder

- coding-standards.instructions.md → instructions/coding-standards.md
- readme.instructions.md → instructions/readme.md
- mermaid.instructions.md → instructions/mermaid.md

Only moved instructions with no .github-specific assumptions.
Kept in .github/: file-organisation.instructions.md (references .github/)

Update all references in CLAUDE.md and other documentation.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# Verify migration
ls -la instructions/
```

---

## STEP 6: Phase 2b — Archive Evaluation

```bash
# List archived files
ls -la .github/instructions/.archive/

# For each file:

# Option A: File is obsolete → DELETE
git rm .github/instructions/.archive/old-guide.md

# Option B: File has value but is outdated → RESTORE & UPDATE
git mv .github/instructions/.archive/legacy-best-practices.md instructions/legacy-best-practices.md

# Edit file:
# 1. Add disclaimer: "⚠️ Legacy content — see current standards in coding-standards.md"
# 2. Update content if applicable
# 3. Keep for historical reference

git add instructions/legacy-best-practices.md

# Option C: File should stay archived → No action

# Commit decisions
git commit -m "refactor: evaluate archived instructions

- Delete: old-guide.md (no longer relevant)
- Restore: legacy-best-practices.md (historical reference)
- Keep archived: deprecated-workflows.md (may be revived)

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# Remove empty archive folder if empty
rmdir .github/instructions/.archive 2>/dev/null || true
```

---

## STEP 7: Update Root Folder READMEs

Create or update README files for root folders:

```bash
# Create scripts/README.md (if missing)
cat > scripts/README.md << 'EOF'
---
title: "Scripts — Utility Tools and Automation"
description: "Portable scripts for automation, build processes, and repository maintenance."
...
---

# Scripts

## Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| cleanup-branches.js | Clean up old/merged branches | node scripts/cleanup-branches.js |
| openspec.js | Generate OpenSpec documentation | node scripts/openspec.js |
| generate-changelog.js | Generate changelog from commits | node scripts/generate-changelog.js |

## Adding New Scripts

[Instructions for adding scripts]

EOF

git add scripts/README.md

# Create instructions/README.md (if missing)
cat > instructions/README.md << 'EOF'
---
title: "Instructions — Portable Documentation"
description: "Reusable instruction files for development, governance, and best practices."
...
---

# Instructions

## Portable Instructions

[List of instructions with descriptions]

EOF

git add instructions/README.md

# Commit
git commit -m "docs: Create README files for migrated root folders

- scripts/README.md (documents utility scripts)
- instructions/README.md (documents portable instructions)

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## STEP 8: Update Cross-References

Find and update all references to moved files:

```bash
# Search for references to .github/scripts/
grep -r "\.github/scripts" . --include="*.md" --include="*.json" --include="*.js"

# Update each reference:
# Old: .github/scripts/cleanup.js
# New: scripts/cleanup.js

# Common files to update:
# - CLAUDE.md
# - .github/projects/active/*/README.md
# - docs/*.md
# - .github/README.md
# - package.json (scripts section)

# Example using sed:
find . -type f -name "*.md" | xargs sed -i 's/\.github\/scripts\//scripts\//g'
find . -type f -name "*.md" | xargs sed -i 's/\.github\/instructions\//instructions\//g'

# Verify no broken links remain
grep -r "\.github/scripts" . --include="*.md" | grep -v ".git/" || echo "No references found ✓"

git add -A
git commit -m "refactor: update all cross-references to moved files

- .github/scripts/ → scripts/
- .github/instructions/ → instructions/ (portable only)

Verified no broken references remain.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## STEP 9: Generate Migration Audit Report

Create audit report documenting all changes:

```bash
cat > .github/reports/file-migration-{date}.md << 'EOF'
# File Migration Audit Report — {Date}

## Summary

Migrated portable files from `.github/` to correct root locations per CLAUDE.md repository boundaries.

| Phase | Files Moved | Status | Effort |
|-------|------------|--------|--------|
| Phase 1: .github/scripts/ → scripts/ | 3 | ✅ Complete | 30 min |
| Phase 2: Portable instructions → instructions/ | 3 | ✅ Complete | 1 hour |
| Phase 2b: Archive evaluation | 2 | ✅ Complete | 30 min |
| Phase 3: Create root READMEs | 2 | ✅ Complete | 1 hour |

**Total Effort:** 3 hours  
**Total Files Migrated:** 8  
**References Updated:** 12  

## Phase Details

### Phase 1: Scripts Migration

**Files Moved:**
- `.github/scripts/cleanup-branches.js` → `scripts/cleanup-branches.js`
- `.github/scripts/openspec.js` → `scripts/openspec.js`
- `.github/scripts/generate-changelog.js` → `scripts/generate-changelog.js`

**History Preserved:** Yes (using `git mv`)  
**References Updated:** package.json, project READMEs  

### Phase 2: Instructions Migration

**Files Moved (Portable):**
- `.github/instructions/coding-standards.instructions.md` → `instructions/coding-standards.md`
- `.github/instructions/readme.instructions.md` → `instructions/readme.md`
- `.github/instructions/mermaid.instructions.md` → `instructions/mermaid.md`

**Files Staying in .github/ (Not Portable):**
- `.github/instructions/file-organisation.instructions.md` (references .github/)
- `.github/instructions/pr-template-guide.md` (GitHub-specific)

**References Updated:** CLAUDE.md, documentation  

### Phase 2b: Archive Evaluation

**Files Deleted:** 1 (old-guide.md — no value)  
**Files Restored:** 1 (legacy-best-practices.md — historical reference)  
**Files Remaining Archived:** 1 (deprecated-workflows.md — may revive)  

### Phase 3: Root READMEs

**Created:**
- `scripts/README.md` (documents all scripts)
- `instructions/README.md` (documents all portable instructions)

**Files Updated:** CLAUDE.md, relative links  

## Validation Checklist

- [x] All portable files identified correctly
- [x] Git history preserved (used `git mv`)
- [x] All cross-references updated
- [x] No broken references remain
- [x] Root folder READMEs created
- [x] Markdown linting passed
- [x] Archive decisions documented
- [x] Migration report created

## Impact Assessment

| Item | Impact | Notes |
|------|--------|-------|
| Functionality | ✅ None (files relocated, not modified) | Scripts still referenced correctly |
| Documentation | ✅ Improved (clearer structure, root READMEs) | Users find resources more easily |
| Portability | ✅ Enhanced (instructions now reusable) | Can be copied to other repos |
| Governance | ✅ Enforced (follows CLAUDE.md boundaries) | Consistent with repository standards |

## References

- **Repository Boundaries:** CLAUDE.md
- **File Organisation:** `.github/instructions/file-organisation.instructions.md`
- **Migration Commits:** [List of commit hashes]

---
Created: {Date}
Executed by: {Your name}
EOF

git add .github/reports/file-migration-{date}.md
git commit -m "docs: add file migration audit report

Complete audit of all files migrated from .github/ to root folders.
Includes validation checklist and impact assessment.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## STEP 10: Final Verification

```bash
# Verify folder structure
tree -L 2 -d scripts/
tree -L 2 -d instructions/
ls -la .github/scripts/ 2>/dev/null || echo ".github/scripts/ successfully removed"

# Verify no broken references
grep -r "\.github/scripts\|\.github/instructions" . --include="*.md" | grep -v ".git/" || echo "✅ No broken references"

# Verify git history
git log --oneline scripts/ | head -5  # Should show file history
git log --oneline instructions/ | head -5

# Run linting
npm run lint:md -- scripts/ instructions/

# Verify all commits pushed
git log origin/develop..develop  # Check if commits are ahead
```

---

## Repeating This Process

To audit and migrate again (if new misplaced files appear):

```bash
# Use the same steps:
# 1. Audit: find all files in .github/
# 2. Categorize: portable vs. repo-governance
# 3. Plan: break into phases
# 4–6. Execute: move files with git history
# 7–8. Update: references and READMEs
# 9. Report: generate audit report
# 10. Verify: confirm all changes correct
```

---

## References

- **Repository Boundaries:** CLAUDE.md
- **File Organisation:** `.github/instructions/file-organisation.instructions.md`
- **Portable Assets:** agents/, instructions/, skills/, scripts/, workflows/
- **Reports Location:** `.github/reports/`

---

**Effort:** 2–4 hours (per migration audit)  
**Use When:** File organisation audit, migrating legacy structure to portable standards  
**Output:** Moved files with git history, updated references, migration audit report  
**Dependencies:** `git`, grep, sed, npm (for linting)
