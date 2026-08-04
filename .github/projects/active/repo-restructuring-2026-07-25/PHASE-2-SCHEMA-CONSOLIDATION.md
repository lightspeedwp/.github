# Phase 2: Schema Consolidation & Validation

## Repository Restructuring — Schema Audit & Script Updates

**Duration:** 2–3 days  
**Owner:** Claude Code Agent (automated schema audit & script updates)  
**Status:** Ready to Execute  
**Prerequisites:** Phase 1.C complete, documentation finalized

---

## Copy This Prompt for Claude

```
PHASE 2: Complete schema consolidation and update validation scripts.

STATUS: Phase 1.C complete. Schemas have been consolidated into schemas/ folder.

TASK: Audit schemas, update validation scripts, and create migration guide.

=====================================
PHASE 2.A: AUDIT CONSOLIDATED SCHEMAS
=====================================

Verify the schema consolidation from Phase 1.A is complete and correct.

Run these commands:

# List all schema files
find schemas -type f -name "*.schema.json" | sort

# Count total schema files
find schemas -type f | wc -l

# Check for subdirectories
ls -la schemas/

# Verify no duplicates
find schemas -type f -exec basename {} \; | sort | uniq -c | grep -v "^ *1 "

EXPECTED OUTPUT:
- 20+ schema files found
- schemas/memory/ subdirectory present with multiple files
- Count shows total number of files (e.g., 25 files)
- No duplicate filenames

Create file: .github/projects/active/repo-restructuring-2026-07-25/SCHEMA-AUDIT.md

Document findings:
- Total schema files: [count]
- Subdirectories: [list]
- File types: [list unique extensions]
- Consolidation status: ✅ COMPLETE or ❌ ISSUES FOUND
- Ready to proceed: ✅ YES or ❌ NO

=====================================
PHASE 2.B: UPDATE VALIDATION SCRIPTS
=====================================

Update all validation scripts to reference schemas/ instead of .schemas/ or schema/

For each JavaScript file in .github/scripts/validation/:

1. Find schema path references:
   grep -r "\.schemas/" .github/scripts/
   grep -r "schema/" .github/scripts/ | grep -v "schemas/"

2. For each reference, update the path:
   
   OLD PATTERN 1: path.join(__dirname, '../../.schemas/')
   NEW PATTERN 1: path.join(__dirname, '../../../schemas/')
   
   OLD PATTERN 2: path.join(__dirname, '../../schema/')
   NEW PATTERN 2: path.join(__dirname, '../../../schemas/')
   
   OLD PATTERN 3: require('../../.schemas/...')
   NEW PATTERN 3: require('../../../schemas/...')

3. For each file with updates:
   - Use Edit tool to replace old path with new path
   - Verify syntax is valid after edit
   - Test the script individually

4. Test EACH validation script:
   npm run validate:frontmatter    # ✅ PASS
   npm run validate:agents         # ✅ PASS
   npm run validate:memory         # ✅ PASS
   npm run validate:plugins        # ✅ PASS

5. Document:
   - Number of scripts updated
   - Number of path references changed
   - All scripts pass validation ✅

=====================================
PHASE 2.C: UPDATE DOCUMENTATION
=====================================

Update all documentation references to schemas/

For each markdown file in docs/:
- Find references to old paths: .schemas/, schema/
- Replace with new path: schemas/

Example updates:
OLD: See [schemas](.../.schemas/...)
NEW: See [schemas](..../schemas/...)

OLD: The schema/ folder contains...
NEW: The schemas/ folder contains...

OLD: Reference .schemas/ for...
NEW: Reference schemas/ for...

Create file: docs/MIGRATION.md

Content should document:

---
# Repository Restructuring Migration Guide (2026-07-25)

## What Changed

### Folder Moves
- scripts/ → .github/scripts/
- reports/ → .github/reports/
- projects/ → .github/projects/
- tmp/ → .github/tmp/
- memory/ → .github/memory/
- website/ → .github/website/

### Schema Consolidation
- .schemas/ (hidden folder) → schemas/ (visible root)
- schema/ (legacy) → schemas/ (consolidated)

## Updated Path References

### For Script References

If you have scripts that reference these old paths, update them:

OLD: node scripts/validation/validate-frontmatter.js
NEW: node .github/scripts/validation/validate-frontmatter.js

OLD: path.join(__dirname, '../../.schemas/')
NEW: path.join(__dirname, '../../../schemas/')

### For Import Statements

OLD: require('../../.schemas/memory.schema.json')
NEW: require('../../../schemas/memory.schema.json')

OLD: import schema from '../../schema/frontmatter.schema.json'
NEW: import schema from '../../../schemas/frontmatter.schema.json'

## Grace Period

These old paths will work with warnings until [END_DATE].
After that, they will fail and builds will not complete.

Start using new paths immediately to avoid future issues.

## Questions?

See:
- docs/REPOSITORY_STRUCTURE.md — Overview of new structure
- schemas/README.md — Schema organization details
- CLAUDE.md — Repository boundaries and organization

---

Document all changes made in Phase 2.

=====================================
PHASE 2.D: CREATE SUMMARY & NEXT STEPS
=====================================

Create file: .github/projects/active/repo-restructuring-2026-07-25/PHASE-2-SUMMARY.md

Content documents Phase 2 completion:

---
# Phase 2: Schema Consolidation Summary

## Completion Date
[YYYY-MM-DD]

## Tasks Completed

### Schema Audit (2.A)
- ✅ Consolidated schemas/ folder verified
- [X] schema files found
- Subdirectories: [list]
- Status: READY FOR VALIDATION

### Validation Script Updates (2.B)
- ✅ Updated [X] JavaScript files
- ✅ Updated [X] path references
- Scripts tested and passing:
  - npm run validate:frontmatter ✅
  - npm run validate:agents ✅
  - npm run validate:memory ✅
  - npm run validate:plugins ✅

### Documentation Updates (2.C)
- ✅ Updated [X] markdown files
- ✅ Created MIGRATION.md
- ✅ Created SCHEMA-AUDIT.md
- ✅ Updated CLAUDE.md reference section

## Outcomes

- All validation scripts reference schemas/ correctly
- No remaining references to .schemas/ or old schema/
- npm run validate:* ALL PASSING
- npm test ALL PASSING
- Migration guide available for team

## Next Steps

Phase 3: VSCode Workspace Setup & Documentation

---

=====================================
PHASE 2.E: FINAL COMMIT
=====================================

After all Phase 2 tasks complete and validation passes:

git add -A

git commit -m "refactor: Consolidate schemas and update validation scripts

Schema consolidation:
- Verified .schemas/ → schemas/ move complete
- Confirmed [X] schema files in new location
- No duplicates found

Validation script updates:
- Updated [X] JavaScript files
- Updated [X] path references (.schemas/ → schemas/)
- All relative paths adjusted for new folder depth

Documentation updates:
- Created docs/MIGRATION.md with path update guide
- Created SCHEMA-AUDIT.md with consolidation details
- Updated all markdown files referencing old paths
- Updated CLAUDE.md with new folder reference

Validation Results:
- npm run validate:* ✅ ALL PASSING
- npm test ✅ ALL PASSING

Phase 3 (VSCode workspace setup) ready to proceed.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

git log --oneline -3
```

---

## What to Expect

**Duration:** 2–3 days  
**Scope:** Audit schemas, update 5–10 validation scripts, update 10+ documentation files, create migration guide

**Outcomes:**

- ✅ All validation scripts pass
- ✅ All tests pass
- ✅ Migration guide available
- ✅ No references to old schema paths remain

---

**Document Version:** 1.0  
**Status:** Ready to Execute  
**Created:** 2026-07-26
