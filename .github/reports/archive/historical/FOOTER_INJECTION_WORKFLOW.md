---
title: "Footer Injection Workflow"
description: "Step-by-step guide for safely injecting category-specific footers"
type: "procedure"
category: "governance"
---

# Footer Injection Workflow

**Status**: Ready for execution  
**Created**: 2026-08-04  
**Last Updated**: 2026-08-04

## Overview

This document describes the **safe, tested workflow** for injecting category-specific footers from `config/quirky-footers.yaml` into markdown files that are missing them.

The system uses three complementary scripts:

1. **inject-footers.js** — Performs the injection with backups
2. **validate-footer-injection.js** — Validates schema and integrity
3. **test-footer-injection-safety.js** — Runs comprehensive safety tests

---

## Prerequisites

Before running this workflow, ensure:

✅ All three scripts are in `scripts/` directory:

- `scripts/inject-footers.js`
- `scripts/validate-footer-injection.js`
- `scripts/test-footer-injection-safety.js`

✅ Configuration files exist and are valid:

- `config/footers.config.yaml` — Standard footer library
- `config/quirky-footers.yaml` — Category-specific quirky footers
- `.schemas/quirky-footers.schema.json` — Configuration schema

✅ Working directory is clean:

```bash
git status  # Should show no uncommitted changes
```

---

## Workflow Steps

### Phase 1: Preview Changes (Dry Run)

**Purpose**: See what would be injected WITHOUT modifying any files

```bash
node scripts/inject-footers.js --dry-run
```

**Output**:

- Preview of files that would be modified
- Category assignments for each file
- Footer IDs that would be injected
- Summary statistics

**Action**: Review the preview and confirm it looks correct

**Exit if**:

- Categories are wrong (files in wrong category)
- Footer IDs don't match expectations
- File count seems incorrect

---

### Phase 2: Apply Injections

**Purpose**: Actually inject footers into files with backups

```bash
node scripts/inject-footers.js
```

**What happens**:

1. Creates `.github/tmp/footer-backups/` directory
2. Backs up EVERY modified file with `.backup` extension
3. Injects category-appropriate footer from `quirky-footers.yaml`
4. Generates report: `.github/reports/footer-injection-YYYY-MM-DD.json`

**Output**:

```
✅ path/to/file.md [category] <- footer-id
```

**Keep watching for**:

- ❌ Error messages (file not readable, category unknown, etc.)
- ⚠️ Files with unexpected categories
- Summary showing number of files injected

---

### Phase 3: Validate Schema and Integrity

**Purpose**: Verify that injection was successful and schema-compliant

```bash
node scripts/validate-footer-injection.js
```

**Checks**:

1. ✅ Footer configuration schema is valid
2. ✅ Every modified file has a footer
3. ✅ Footer is properly placed (at end of file)
4. ✅ Backup files exist and are readable

**Exit codes**:

- `0` = All validations passed ✅
- `1` = Validation failures detected ❌

**Exit if**:

- Schema validation fails
- Validation report shows failures
- Backup integrity issues found

---

### Phase 4: Run Safety Tests

**Purpose**: Comprehensive verification that NO content was lost and footers match config

```bash
node scripts/test-footer-injection-safety.js
```

**Test suites**:

**Suite 1: Content Integrity**

- Compares current file (minus footer) with backup
- Detects if content was accidentally removed
- Allows only whitespace normalization

**Suite 2: Backup Restorability**

- Verifies every backup file exists
- Checks backup has valid markdown structure
- Confirms backup is restorable

**Suite 3: Footer Format**

- Checks footer starts with `---` separator
- Validates footer has content (not empty)
- Detects suspiciously short content

**Suite 4: Footer Config Matching**

- Loads `quirky-footers.yaml`
- Verifies footer matches expected template
- Confirms footer ID is from config

**Suite 5: Duplication Detection**

- Searches for duplicate footer patterns
- Ensures only ONE footer per file
- Flags multiple instances of footer text

**Exit codes**:

- `0` = All tests passed ✅ Safe to commit
- `1` = Tests failed ❌ DO NOT commit

**Exit if**:

- Any test suite fails
- Content integrity check fails
- Duplication detected

---

### Phase 5: Review Changes

**Purpose**: Human review before committing

```bash
# See what changed
git status

# Review specific files
git diff path/to/file.md

# View the injection report
cat .github/reports/footer-injection-2026-08-04.json
```

**Review checklist**:

- [ ] All injected files have the correct category
- [ ] Footers are appropriate for the file type
- [ ] No accidental content removal
- [ ] Backups are in place
- [ ] File count matches expectations

---

### Phase 6: Commit Changes

**Purpose**: Save the injected files to git

```bash
# Stage all injected files
git add -A

# Commit with proper message
git commit -m "feat: inject category-specific footers using quirky-footers schema

Injected $(ls .github/tmp/footer-backups | wc -l) files with category-appropriate footers:
- Category inference from frontmatter + path
- Footers from config/quirky-footers.yaml
- Backups in .github/tmp/footer-backups/
- All safety tests passed

See .github/reports/footer-injection-*.json for detailed report"
```

**After commit**:

```bash
# Clean up backups (ONLY after confirming commit succeeded)
find .github/tmp/footer-backups -name "*.backup" -delete
git add -A
git commit -m "chore: remove footer injection backup files"
```

---

## Recovery Procedures

### If content was accidentally removed

**Do NOT commit**. Instead:

```bash
# Restore from backups
for backup in .github/tmp/footer-backups/*.backup; do
  original="${backup%.backup}"
  cp "$backup" "$original"
done

# Verify restoration
git diff  # Should show files restored to original state

# Check what went wrong
cat .github/reports/footer-injection-*.json | jq '.errors'
```

### If a specific file has wrong footer

**Do NOT commit**. Instead:

```bash
# Restore single file
cp .github/tmp/footer-backups/filename.md.backup path/to/filename.md

# Re-inject with correct category
# (requires editing the file's frontmatter with correct category first)
```

---

## Dry-Run Verification Checklist

Before running Phase 2 (Apply Injections), verify the dry-run output:

```bash
node scripts/inject-footers.js --dry-run
```

**Review**:

- [ ] Total files match expectations (~620 files need footers)
- [ ] Files MISSING footers shown (should NOT include files already with footers)
- [ ] Categories look correct for shown files
- [ ] No unexpected files in the list
- [ ] Footer IDs correspond to categories (e.g., agents → agents-orchestrated)

**Example checks**:

- docs/ files should get `docs-compass` footer ✓
- agents/ files should get `agents-orchestrated` footer ✓
- instructions/ files should get `instructions-blueprint` footer ✓
- ai-ops files should get `aiops-orchestrated` footer ✓

---

## Troubleshooting

### Script exits with "Unknown category"

**Cause**: File's category couldn't be inferred from path or frontmatter

**Solution**:

```bash
# Edit the file and add category to frontmatter:
---
title: "Your Title"
category: "docs"  # Add this line
---
```

Then re-run the injection script.

### Backup files not created

**Cause**: `.github/tmp/footer-backups/` doesn't exist or isn't writable

**Solution**:

```bash
mkdir -p .github/tmp/footer-backups
chmod 755 .github/tmp/footer-backups
```

Then re-run Phase 2.

### Validation fails: "Footer separator not found"

**Cause**: Footer wasn't injected (check Phase 2 output for errors)

**Solution**:

```bash
# Check for files that failed during injection
cat .github/reports/footer-injection-*.json | jq '.errors'

# Re-run Phase 2 to retry failed files
```

### Safety test fails: "Content shortened"

**Cause**: File content was removed during injection (BUG!)

**Solution**:

```bash
# DO NOT COMMIT - Restore from backups
for backup in .github/tmp/footer-backups/*.backup; do
  original="${backup%.backup}"
  cp "$backup" "$original"
done

git checkout  # Reset any staged changes

# Report the bug and files involved
```

---

## Expected Results

### After successful injection

- ✅ ~620 files have footers injected
- ✅ All files backup successfully
- ✅ Categories correctly inferred from paths
- ✅ Footers match `quirky-footers.yaml` templates
- ✅ All tests pass (exit code 0)
- ✅ Zero content loss
- ✅ Backups are restorable

### File structure after

```
.github/tmp/footer-backups/
├── file1.md.backup
├── file2.md.backup
└── ... (one backup per modified file)

.github/reports/
├── footer-injection-2026-08-04.json  (detailed report)
└── ... (other reports)
```

---

## Related Documentation

- **Footer Remediation Guide**: `docs/FOOTER_REMEDIATION_GUIDE.md`
- **Footer Validation Audit**: `docs/FOOTER_VALIDATION_AUDIT.md`
- **Quirky Footers Guide**: `docs/QUIRKY_FOOTERS_GUIDE.md`
- **Footer Config**: `config/footers.config.yaml`
- **Quirky Footers Config**: `config/quirky-footers.yaml`
- **Validation Script**: `.github/scripts/validate-footers.js`

---

## Timeline

**Phase 1 (Dry Run)**: 2-5 minutes  
**Phase 2 (Apply)**: 5-10 minutes  
**Phase 3 (Validate)**: 2-3 minutes  
**Phase 4 (Test)**: 3-5 minutes  
**Phase 5 (Review)**: 10-15 minutes  
**Phase 6 (Commit)**: 2-3 minutes  

**Total**: ~30-45 minutes for complete workflow

---

**Next Steps**:

1. Ensure prerequisites are met
2. Run Phase 1: `node scripts/inject-footers.js --dry-run`
3. Review output and confirm categories
4. Run Phase 2: `node scripts/inject-footers.js`
5. Proceed through remaining phases

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
