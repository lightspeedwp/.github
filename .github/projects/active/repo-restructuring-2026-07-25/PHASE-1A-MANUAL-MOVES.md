# Phase 1.A: Manual Folder Moves

## Repository Restructuring — Finder-Based Operations

**Duration:** 1–2 hours  
**Owner:** Ash Shaw (manual operations in macOS Finder)  
**Status:** Ready to Execute  
**Prerequisites:** Phase 0 complete, pre-flight checklist passed

---

## Overview

Phase 1.A moves 6 operational folders from repository root to `.github/` subdirectories and consolidates schema definitions. All moves are performed manually via macOS Finder to ensure clear visibility and prevent file overwrites.

**Folders being moved:**

1. `scripts/` → `.github/scripts/`
2. `reports/` → `.github/reports/`
3. `projects/` → `.github/projects/`
4. `tmp/` → `.github/tmp/`
5. `memory/` → `.github/memory/`
6. `website/` → `.github/website/`

**Schemas being consolidated:**

- `.schemas/` (hidden folder) → `schemas/` (visible root folder)
- Legacy `schema/` → merged into `schemas/`

---

## Step 1.A.1: Backup Current State

Open Terminal and verify the current state before making any changes:

```bash
cd /Users/ash/Studio/LightSpeedWP.Agency/.github

# Verify working tree is clean
git status

# View recent commits
git log --oneline -5

# Create backup tag with timestamp
git tag "backup/pre-restructure-$(date +%Y-%m-%d_%H-%M-%S)" \
  -m "Backup before folder restructuring"

# Verify backup created
git tag -l | grep backup
```

**Expected Output:**

```
On branch refactor/repo-restructuring-2026-07-25
Your branch is up to date with 'origin/refactor/repo-restructuring-2026-07-25'.

nothing to commit, working tree clean
backup/pre-restructure-2026-07-26_14-30-45 ✅
```

**✅ Success:** Working tree is clean and backup tag exists.

---

## Step 1.A.2: Create `.github/` Subdirectories

These directories will receive the moved folders. Create them in Terminal:

```bash
cd /Users/ash/Studio/LightSpeedWP.Agency/.github

# Create all required subdirectories
mkdir -p .github/scripts
mkdir -p .github/tmp
mkdir -p .github/memory
mkdir -p .github/reports
mkdir -p .github/projects
mkdir -p .github/website
mkdir -p .github/config/plugins

# Verify all directories exist
ls -la .github/ | grep "^d"
```

**Expected Output:**

```
drwxr-xr-x  scripts
drwxr-xr-x  tmp
drwxr-xr-x  memory
drwxr-xr-x  reports
drwxr-xr-x  projects
drwxr-xr-x  website
drwxr-xr-x  config
```

**✅ Success:** All subdirectories created in `.github/`.

---

## Step 1.A.3: Move Folders Using macOS Finder

**⚠️ IMPORTANT:** Use Finder drag-and-drop to visually confirm each move. This prevents accidental overwrites.

### In Finder

1. **Open Finder**
   - Click Finder icon in Dock or press `Cmd+Space`, type "Finder", press Enter

2. **Navigate to Repository Root**
   - Press `Cmd+Shift+G` (Go to Folder)
   - Paste: `/Users/ash/Studio/LightSpeedWP.Agency/.github/`
   - Press Enter

3. **You should see these folders in the root:**

   ```
   📁 .github/          (subdirectories inside)
   📁 agents/
   📁 docs/
   📁 scripts/          ← MOVE THIS
   📁 reports/          ← MOVE THIS
   📁 projects/         ← MOVE THIS
   📁 tmp/              ← MOVE THIS
   📁 memory/           ← MOVE THIS
   📁 website/          ← MOVE THIS
   📁 hooks/
   📁 skills/
   ... (other folders)
   ```

4. **For each folder to move:**

   **Move `scripts/`:**
   - Drag `scripts/` folder
   - Drop it into `.github/` folder
   - Confirm it now appears in `.github/scripts/`
   - ✅ Verify it's gone from root

   **Move `reports/`:**
   - Drag `reports/` folder
   - Drop it into `.github/` folder
   - ✅ Verify it now appears in `.github/reports/`

   **Move `projects/`:**
   - Drag `projects/` folder
   - Drop it into `.github/` folder
   - ✅ Verify it now appears in `.github/projects/`

   **Move `tmp/`:**
   - Drag `tmp/` folder
   - Drop it into `.github/` folder
   - ✅ Verify it now appears in `.github/tmp/`

   **Move `memory/`:**
   - Drag `memory/` folder
   - Drop it into `.github/` folder
   - ✅ Verify it now appears in `.github/memory/`

   **Move `website/`:**
   - Drag `website/` folder
   - Drop it into `.github/` folder
   - ✅ Verify it now appears in `.github/website/`

5. **Verify all moves completed:**
   - Root should NO LONGER show: `scripts/`, `reports/`, `projects/`, `tmp/`, `memory/`, `website/`
   - `.github/` should now contain: `scripts/`, `reports/`, `projects/`, `tmp/`, `memory/`, `website/`

---

## Step 1.A.4: Move `.schemas/` to Visible `schemas/`

This move consolidates hidden and visible schema definitions. Execute in Terminal:

```bash
cd /Users/ash/Studio/LightSpeedWP.Agency/.github

# Move .schemas/ to schemas/ (visible root folder)
mv .schemas/ schemas/

# Verify the move succeeded
ls -d schemas/
echo "✅ Schema consolidation: .schemas/ → schemas/"

# Check schema files are present
find schemas -type f -name "*.schema.json" | head -3
```

**Expected Output:**

```
schemas/
✅ Schema consolidation: .schemas/ → schemas/
schemas/memory/memory-example.schema.json
schemas/memory/memory-profile.schema.json
...
```

**✅ Success:** `.schemas/` is now `schemas/` (visible root folder).

---

## Step 1.A.5: Verify All Moves in Terminal

Comprehensive verification of all folder movements:

```bash
cd /Users/ash/Studio/LightSpeedWP.Agency/.github

echo "=== Checking root (moved folders should NOT exist) ==="
for dir in scripts reports projects tmp memory website; do
  if [ -d "$dir" ]; then
    echo "❌ FAIL: $dir still exists in root"
  else
    echo "✅ PASS: $dir removed from root"
  fi
done

echo ""
echo "=== Checking .github/ (moved folders SHOULD exist) ==="
for dir in .github/scripts .github/reports .github/projects .github/tmp .github/memory .github/website; do
  if [ -d "$dir" ]; then
    echo "✅ PASS: $dir exists in .github/"
  else
    echo "❌ FAIL: $dir missing from .github/"
  fi
done

echo ""
echo "=== Checking schemas/ consolidation ==="
if [ -d "schemas/" ]; then
  schema_count=$(find schemas -type f | wc -l)
  echo "✅ PASS: schemas/ exists with $schema_count files"
else
  echo "❌ FAIL: schemas/ not found"
fi

if [ -d ".schemas/" ]; then
  echo "❌ FAIL: .schemas/ still exists (should be removed)"
else
  echo "✅ PASS: .schemas/ successfully removed"
fi
```

**Expected Output:**

```
=== Checking root (moved folders should NOT exist) ===
✅ PASS: scripts removed from root
✅ PASS: reports removed from root
✅ PASS: projects removed from root
✅ PASS: tmp removed from root
✅ PASS: memory removed from root
✅ PASS: website removed from root

=== Checking .github/ (moved folders SHOULD exist) ===
✅ PASS: .github/scripts exists in .github/
✅ PASS: .github/reports exists in .github/
✅ PASS: .github/projects exists in .github/
✅ PASS: .github/tmp exists in .github/
✅ PASS: .github/memory exists in .github/
✅ PASS: .github/website exists in .github/

=== Checking schemas/ consolidation ===
✅ PASS: schemas/ exists with 25 files
✅ PASS: .schemas/ successfully removed
```

**✅ All Moves Verified:** Every folder is in the correct location.

---

## Step 1.A.6: Stage All Changes in Git

Git will track folder moves as "renames". Stage everything:

```bash
cd /Users/ash/Studio/LightSpeedWP.Agency/.github

# Check git status (should show all moves)
git status

# Stage all changes
git add -A

# Verify staging (should show "renamed" entries)
git diff --cached --name-status | sort
```

**Expected Output:**

```
R  .github/memory/ (renamed from memory/)
R  .github/projects/ (renamed from projects/)
R  .github/reports/ (renamed from reports/)
R  .github/scripts/ (renamed from scripts/)
R  .github/tmp/ (renamed from tmp/)
R  .github/website/ (renamed from website/)
R  schemas/ (renamed from .schemas/)
```

**✅ Success:** All moves staged as "renamed" in git.

---

## Step 1.A.7: Create Commit

Commit all folder moves as a single atomic change:

```bash
cd /Users/ash/Studio/LightSpeedWP.Agency/.github

git commit -m "refactor: Move operational folders to .github/ and consolidate schemas

Folder moves:
- Move scripts/ → .github/scripts/
- Move reports/ → .github/reports/
- Move projects/ → .github/projects/
- Move tmp/ → .github/tmp/
- Move memory/ → .github/memory/
- Move website/ → .github/website/
- Move .schemas/ → schemas/ (now visible root folder)

All path references will be updated in Phase 1.B (claude automation).
This commit contains structural moves only; business logic unchanged.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# Verify commit created
git log --oneline -3
```

**Expected Output:**

```
xxxxxxx refactor: Move operational folders to .github/ and consolidate schemas
xxxxxxx [previous commit]
xxxxxxx [previous commit]
```

**✅ Phase 1.A Complete:** All folders moved, changes committed, ready for Phase 1.B (path updates).

---

## Troubleshooting

### Issue: Finder shows "Item Already Exists" when dragging

**Solution:**

1. Check if folder already exists in destination: `ls -la .github/scripts/` (for example)
2. If it exists and is empty, delete it first: `rm -rf .github/scripts/`
3. Retry the drag-and-drop operation

### Issue: Git shows too many changes

**Solution:**

1. Verify all moves completed: Run verification step 1.A.5
2. If some folders weren't moved, complete them manually in Finder
3. Re-run `git add -A` and check status again

### Issue: Terminal commands fail with "No such file or directory"

**Solution:**

1. Verify current directory: `pwd` (should show `.github/` repo path)
2. Navigate there: `cd /Users/ash/Studio/LightSpeedWP.Agency/.github`
3. Retry the command

---

## Next Steps

Phase 1.A is complete when:

- ✅ All 6 folders moved to `.github/`
- ✅ `.schemas/` consolidated to visible `schemas/`
- ✅ Git commit created
- ✅ Verification passed

**Next phase:** Phase 1.B — Path Reference Updates (Claude automation)

---

**Document Version:** 1.0  
**Status:** Ready for Execution  
**Created:** 2026-07-26
