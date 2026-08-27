# Phase 1.B: Path Reference Updates (Claude Automation Prompt)

## Repository Restructuring — Script & Configuration Updates

**Duration:** 2–3 days  
**Owner:** Claude Code Agent (automated script execution)  
**Status:** Ready to Execute  
**Prerequisites:** Phase 1.A complete, all folder moves committed to git

---

## Overview

Phase 1.B updates ALL references to the folders moved in Phase 1.A. This ensures scripts, workflows, documentation, and configuration files reference the new paths.

**Updated paths:**

- `scripts/` → `.github/scripts/`
- `reports/` → `.github/reports/`
- `projects/` → `.github/projects/`
- `tmp/` → `.github/tmp/`
- `memory/` → `.github/memory/`
- `website/` → `.github/website/`
- `.schemas/` → `schemas/`
- `schema/` → `schemas/` (consolidated)

---

## Copy This Prompt for Claude

```
PHASE 1.B: Update all path references for restructured folders.

STATUS: Phase 1.A complete. Folders have been moved:
- scripts/ → .github/scripts/
- reports/ → .github/reports/
- projects/ → .github/projects/
- tmp/ → .github/tmp/
- memory/ → .github/memory/
- website/ → .github/website/
- .schemas/ → schemas/ (visible root)
- schema/ → schemas/ (consolidation)

TASK: Update ALL references to old paths in the repository.

=====================================
STEP 1: AUDIT ALL PATH REFERENCES
=====================================

Find all files that reference old paths. Run these commands and document findings:

grep -r "\"scripts/" . --include="*.js" --include="*.json" --include="*.yml" \
  --include="*.yaml" --include="*.md" --exclude-dir=.git --exclude-dir=node_modules \
  --exclude-dir=.github | grep -v ".github/scripts"

grep -r "\"reports/" . --include="*.js" --include="*.json" --include="*.yml" \
  --include="*.yaml" --include="*.md" --exclude-dir=.git \
  | grep -v ".github/reports"

grep -r "\"projects/" . --include="*.js" --include="*.json" --include="*.yml" \
  --include="*.yaml" --include="*.md" --exclude-dir=.git \
  | grep -v ".github/projects"

grep -r "\"memory/" . --include="*.js" --include="*.json" --include="*.yml" \
  --include="*.yaml" --include="*.md" --exclude-dir=.git \
  | grep -v ".github/memory"

grep -r "\"tmp/" . --include="*.js" --include="*.json" --include="*.yml" \
  --include="*.yaml" --include="*.md" --exclude-dir=.git \
  | grep -v ".github/tmp"

grep -r "\"website/" . --include="*.js" --include="*.json" --include="*.yml" \
  --include="*.yaml" --include="*.md" --exclude-dir=.git \
  | grep -v ".github/website"

grep -r "\.schemas" . --include="*.js" --include="*.json" --include="*.yml" \
  --include="*.yaml" --include="*.md" --exclude-dir=.git

grep -r "schema/" . --include="*.js" --include="*.json" --include="*.yml" \
  --include="*.yaml" --include="*.md" --exclude-dir=.git \
  | grep -v "schemas/"

EXPECTED OUTPUT: A list of files that need updating, grouped by type.

Create a summary showing:
- Number of files found per path category
- Grouped by file type (package.json, workflows, docs, scripts, etc.)

Example summary format:
```

scripts/ references found: 12 files

- package.json: 8 scripts
- .github/workflows/: 2 workflow files
- docs/: 2 documentation files

reports/ references found: 5 files

- docs/: 3 files
- .github/: 2 files

... [continue for each path] ...

```

=====================================
STEP 2: UPDATE package.json SCRIPTS
=====================================

For each script in package.json that references old paths, update it:

OLD PATTERN:
  "validate:frontmatter": "node scripts/validation/validate-frontmatter.js"

NEW PATTERN:
  "validate:frontmatter": "node .github/scripts/validation/validate-frontmatter.js"

Rules:
1. Find all script entries that contain: scripts/, reports/, projects/, tmp/, memory/, website/
2. Replace the path prefix:
   - scripts/ → .github/scripts/
   - reports/ → .github/reports/
   - projects/ → .github/projects/
   - tmp/ → .github/tmp/
   - memory/ → .github/memory/
   - website/ → .github/website/
3. Update in package.json using Edit tool
4. Verify syntax is valid JSON after edit

Expected updated scripts:
- validate:frontmatter
- validate:agents
- validate:*
- Any other scripts referencing old paths

VERIFICATION: Run 'npm run' and verify all scripts listed are valid

=====================================
STEP 3: UPDATE .github/workflows/*.yml
=====================================

For EACH workflow file in .github/workflows/:

Find lines with:
- run: node scripts/...
- run: npx ... schema/...
- uses: actions that reference old paths
- env vars that reference old paths

Replace:
- "node scripts/" → "node .github/scripts/"
- "node .github/scripts/" (already correct, skip)
- ".schemas" → "schemas"
- "schema/" → "schemas/" (but be careful of "node_modules/.../schema/")

For EACH workflow file found:
1. Read the file
2. Find all old path references
3. Replace with new paths
4. Verify YAML syntax is valid
5. Document changes

Example changes:
OLD: - run: node scripts/validation/validate-frontmatter.js
NEW: - run: node .github/scripts/validation/validate-frontmatter.js

OLD: path: 'schema/**'
NEW: path: 'schemas/**'

=====================================
STEP 4: UPDATE docs/**/*.md
=====================================

For EACH markdown file in docs/ (and README.md at root):

Find and replace patterns:
1. Link syntax: [text](../scripts/...) → [text](../.github/scripts/...)
2. Inline paths: ../scripts/ → ../.github/scripts/
3. Backtick code: `scripts/` → `.github/scripts/`
4. Path tables/lists: update old paths to new paths

Rules:
- For files in docs/, adjust relative paths:
  OLD: ../scripts/validation/...
  NEW: ../.github/scripts/validation/...
  
  OLD: ../../scripts/validation/...
  NEW: ../../.github/scripts/validation/...

- For README.md at root, use:
  OLD: [Link](.github/scripts/...)
  NEW: [Link](.github/scripts/...) [NO CHANGE - already correct]

Search patterns to update:
- [See scripts/...](../scripts/...)
- [See reports/...](../reports/...)
- Code examples showing old paths
- Path documentation tables

Document EACH file updated with line numbers.

=====================================
STEP 5: UPDATE .github/scripts/**/*.js RELATIVE PATHS
=====================================

For EACH JavaScript file in .github/scripts/:

Find relative path calculations like:
OLD: path.join(__dirname, '../../schema/')
NEW: path.join(__dirname, '../../../schemas/')

Reasoning:
- Previously: scripts/ was at root, relative path was ../../
- Now: .github/scripts/ is deeper, relative path is ../../../

For EACH file with path calculations:
1. Identify the pattern used to reference schemas or other paths
2. Adjust upward by one level (add one ../)
3. Update path references:
   - schema/ → schemas/
   - .schemas/ → schemas/

Example updates:
OLD: const schemaPath = path.join(__dirname, '../../schema/memory.schema.json')
NEW: const schemaPath = path.join(__dirname, '../../../schemas/memory.schema.json')

OLD: require('../../.schemas/frontmatter.schema.json')
NEW: require('../../../schemas/frontmatter.schema.json')

Document EACH file updated with specific changes.

=====================================
STEP 6: UPDATE agents/**/*.md AND skills/**/*.md
=====================================

For EACH agent and skill markdown file that references old paths:

Find and replace:
- [scripts/...] → [.github/scripts/...]
- [reports/...] → [.github/reports/...]
- Inline path references
- Examples or code blocks showing old paths

Update relative paths if needed (similar to docs/).

=====================================
STEP 7: VALIDATE ALL CHANGES
=====================================

Run validation to ensure all updates are correct:

npm run validate:frontmatter
npm run validate:agents
npm run validate:branch-name
npm run validate:plugins
npm test

EXPECTED: All commands pass with no errors.

If ANY fails:
1. Investigate the error
2. Find the root cause (syntax error, bad path, etc.)
3. Fix the issue
4. Re-run validation
5. Document the issue and fix in commit message

Provide summary showing:
- Validation script: STATUS (PASS/FAIL)
- Test suite: [X passed, Y failed]

=====================================
STEP 8: CREATE COMPREHENSIVE COMMIT
=====================================

After ALL updates verified and tests passing, create ONE commit:

git add -A

git commit -m "refactor: Update all path references for restructured folders

Updated references in these file types:
- package.json: Updated [X] script paths
- .github/workflows/*.yml: Updated [X] workflow files
- docs/**/*.md: Updated [X] documentation files
- .github/scripts/**/*.js: Updated [X] relative paths
- agents/**/*.md: Updated [X] agent references
- skills/**/*.md: Updated [X] skill references
- Root configuration files: Updated [X] files

Specific path updates:
- scripts/ → .github/scripts/ (updated in X files)
- reports/ → .github/reports/ (updated in X files)
- projects/ → .github/projects/ (updated in X files)
- tmp/ → .github/tmp/ (updated in X files)
- memory/ → .github/memory/ (updated in X files)
- website/ → .github/website/ (updated in X files)
- .schemas/ → schemas/ (updated in X files)
- schema/ → schemas/ (updated in X files)

Validation Results:
- npm run validate:frontmatter ✅
- npm run validate:agents ✅
- npm test ✅

All path references now point to new folder locations.
Phase 1.C (folder finalization) can proceed.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

git log --oneline -3
```

EXPECTED FINAL OUTPUT:

- Commit created with detailed message
- All validation scripts passing
- No broken paths remaining
- Ready for Phase 1.C

COMPLETION CRITERIA:
✅ All old path references updated
✅ npm run validate:* passes
✅ npm test passes
✅ Commit created with clear message

```

---

## What to Expect

**Duration:** 2–3 days (comprehensive, methodical)

**Scope:**
- ~50+ files updated across repository
- Scripts, workflows, documentation, configuration
- Relative path calculations in validation scripts

**Outcomes:**
- ✅ All path references consistent with new folder structure
- ✅ All validation scripts pass
- ✅ All tests pass
- ✅ Clear commit history showing what changed

---

## After Phase 1.B

Once Phase 1.B is complete and this commit is verified:
- All path references are updated
- Repository builds cleanly
- Tests pass
- Ready to proceed to Phase 1.C (folder finalization)

---

## Troubleshooting

**Issue: Validation script fails after updates**
- Root cause: Relative path incorrect or file reference missing
- Solution: Review error message, identify which file/path is broken, fix and re-validate

**Issue: Tests fail after updates**
- Root cause: Configuration path wrong, or import statement broken
- Solution: Check test error output, identify broken paths, fix references

**Issue: Too many files found in audit**
- Root cause: Overly broad grep pattern matching
- Solution: Review grep output, identify false positives, refine replacements

---

**Document Version:** 1.0  
**Status:** Ready to Execute  
**Created:** 2026-07-26
