---
title: 'Frontmatter Schema Migration Plan'
description: 'Step-by-step plan for moving frontmatter.schema.json to its own subfolder with validation'
version: 'v1.0'
last_updated: '2025-11-12'
file_type: 'documentation'
tags: ['migration', 'schema', 'refactoring']
references:
  - path: './README.md'
    description: 'Frontmatter schema documentation'
  - path: '../../docs/DOCUMENTATION_AUDIT.md'
    description: 'Documentation audit that recommended this change'
---

# Frontmatter Schema Migration Plan

This document outlines the complete migration plan for moving `schemas/frontmatter.schema.json` to `schemas/frontmatter/frontmatter.schema.json`.

## Overview

**Old Location**: `/schemas/frontmatter.schema.json`
**New Location**: `/schemas/frontmatter/frontmatter.schema.json`

**Why?**
- Better organization for related files (docs, examples, tests)
- More scalable structure for future schema versions
- Dedicated space for validation tools and utilities
- Aligns with best practices for schema management

## Impact Analysis

### Files Affected: 45+

#### Critical (Code Files) - Must Update First
- `metrics/frontmatter-metrics.js` (line 63)
- `scripts/validation/validate-frontmatter.js` (line 24)
- `scripts/validation/__tests__/validate-frontmatter.test.js` (lines 311, 358)

#### High Priority ($schema References in Frontmatter)
- `.github/agents/wp-security-review.agent.md`
- `.github/agents/wp-performance-audit.agent.md`
- `.github/agents/wp-accessibility-review.agent.md`
- `schemas/frontmatter/frontmatter.schema.json` (self-references)

#### Medium Priority (Documentation Links)
- All test README files (5 files)
- `schemas/README.md`
- `scripts/README.md` and `scripts/validation/README.md`
- Instruction files in `.github/instructions/` (7 files)
- Chatmode files (2 files)
- Documentation files in `docs/` (multiple)

#### Broken Links to Fix
- `.github/instructions/issue-creation.instructions.md`
- `.github/instructions/issues.instructions.md`
- `.github/instructions/pr-creation.instructions.md`
- `docs/README_DOCS_ARCHITECTURE.md`

These use incorrect path `schema/` instead of `schemas/` - must be fixed!

## Migration Steps

### Phase 1: Preparation ✅ COMPLETE

- [x] Audit all references to frontmatter.schema.json
- [x] Create new folder structure
- [x] Create validation script
- [x] Create tests
- [x] Create documentation
- [x] Create examples
- [x] Create GitHub Actions workflow

### Phase 2: Schema Setup (Current)

1. **Move the schema file**
   ```bash
   # Create backup
   cp schemas/frontmatter.schema.json schemas/frontmatter.schema.json.backup

   # Move to new location
   mv schemas/frontmatter.schema.json schemas/frontmatter/frontmatter.schema.json
   ```

2. **Install validation dependencies**
   ```bash
   cd schemas/frontmatter
   npm install
   ```

3. **Test the validation**
   ```bash
   # Validate schema itself
   npm run validate:schema

   # Run tests
   npm test
   ```

### Phase 3: Update Code Files (Critical)

**These MUST be updated before deployment to avoid runtime errors.**

1. **Update `metrics/frontmatter-metrics.js`**
   ```diff
   - const schemaPath = path.join(process.cwd(), "schemas/frontmatter.schema.json");
   + const schemaPath = path.join(process.cwd(), "schemas/frontmatter/frontmatter.schema.json");
   ```

2. **Update `scripts/validation/validate-frontmatter.js`**
   ```diff
   - schemaPath: path.join(__dirname, '../../schemas/frontmatter.schema.json')
   + schemaPath: path.join(__dirname, '../../schemas/frontmatter/frontmatter.schema.json')
   ```

3. **Update `scripts/validation/__tests__/validate-frontmatter.test.js`**
   ```diff
   - const schemaPath = path.resolve(__dirname, '../../../schemas/frontmatter.schema.json');
   + const schemaPath = path.resolve(__dirname, '../../../schemas/frontmatter/frontmatter.schema.json');
   ```

### Phase 4: Update Frontmatter $schema References

Update all files that reference the schema in their frontmatter:

**Pattern to find:**
```bash
grep -r '$schema.*frontmatter.schema.json' .github/
```

**Agent files:**
```diff
- $schema: "../frontmatter.schema.json"
+ $schema: "../schemas/frontmatter/frontmatter.schema.json"
```

**Schema self-references:**
```diff
- "path": "schemas/frontmatter.schema.json"
+ "path": "schemas/frontmatter/frontmatter.schema.json"
```

### Phase 5: Update Documentation Links

Update all markdown links:

**Pattern to find:**
```bash
grep -r 'frontmatter\.schema\.json' --include="*.md"
```

**Replace pattern:**
```diff
- [schema](../../schemas/frontmatter.schema.json)
+ [schema](../../schemas/frontmatter/frontmatter.schema.json)
```

**Files to update:**
- `schemas/README.md`
- `scripts/README.md`
- `scripts/validation/README.md`
- All test README files
- `docs/CHATMODE-FRONTMATTER.md`
- `.github/instructions/*.instructions.md`

### Phase 6: Fix Broken Links

These files incorrectly use `schema/` instead of `schemas/`:

1. `.github/instructions/issue-creation.instructions.md`
2. `.github/instructions/issues.instructions.md`
3. `.github/instructions/pr-creation.instructions.md`
4. `docs/README_DOCS_ARCHITECTURE.md`

**Fix:**
```diff
- [frontmatter schema](../../schema/frontmatter.schema.json)
+ [frontmatter schema](../../schemas/frontmatter/frontmatter.schema.json)
```

### Phase 7: Update Workflow Files

Update `.github/workflows/frontmatter-metrics.yml` and any other workflows that reference the schema:

```diff
- schemas/frontmatter.schema.json
+ schemas/frontmatter/frontmatter.schema.json
```

### Phase 8: Testing & Validation

1. **Run validation script**
   ```bash
   cd schemas/frontmatter
   npm run validate
   ```

2. **Check for broken references**
   ```bash
   # Search for old references
   grep -r "schemas/frontmatter\.schema\.json" . --exclude-dir=node_modules

   # Should only find in this migration doc and backup file
   ```

3. **Test code functionality**
   ```bash
   # Run any dependent scripts
   node scripts/validation/validate-frontmatter.js
   node metrics/frontmatter-metrics.js
   ```

4. **Test GitHub Actions**
   - Create a test PR with a markdown file
   - Verify the frontmatter-validation workflow runs
   - Ensure it uses the new path

### Phase 9: Cleanup & Documentation

1. **Remove backup**
   ```bash
   rm schemas/frontmatter.schema.json.backup
   ```

2. **Update VSCode settings**

   In `.vscode/settings.json`:
   ```diff
   {
     "yaml.schemas": {
   -    "./schemas/frontmatter.schema.json": [
   +    "./schemas/frontmatter/frontmatter.schema.json": [
         ".github/agents/*.md",
         ".github/instructions/*.md",
         ".github/prompts/*.md",
         ".github/chatmodes/*.md",
         "docs/*.md"
       ]
     }
   }
   ```

3. **Update CHANGELOG**
   ```markdown
   ## [Unreleased]

   ### Changed
   - Moved frontmatter schema to dedicated subfolder for better organization
   - Schema now at `schemas/frontmatter/frontmatter.schema.json`
   - Added validation tools, tests, and examples in schema folder

   ### Added
   - Frontmatter validation script with CLI tool
   - Automated schema validation via GitHub Actions
   - Example frontmatter files for each file type
   - Comprehensive schema documentation
   ```

4. **Announce the change**
   - Update relevant documentation index files
   - Post in GitHub Discussions if necessary
   - Note in next team meeting

## Automated Migration Script

For bulk updates, you can use this script:

```bash
#!/bin/bash
# migrate-schema-references.sh

OLD_PATH="schemas/frontmatter.schema.json"
NEW_PATH="schemas/frontmatter/frontmatter.schema.json"

# Update code files (JavaScript)
find . -name "*.js" -type f -not -path "*/node_modules/*" -exec sed -i "s|$OLD_PATH|$NEW_PATH|g" {} +

# Update markdown files
find . -name "*.md" -type f -not -path "*/node_modules/*" -exec sed -i "s|$OLD_PATH|$NEW_PATH|g" {} +

# Update YAML files
find . -name "*.yml" -type f -not -path "*/node_modules/*" -exec sed -i "s|$OLD_PATH|$NEW_PATH|g" {} +
find . -name "*.yaml" -type f -not -path "*/node_modules/*" -exec sed -i "s|$OLD_PATH|$NEW_PATH|g" {} +

# Fix broken links (schema/ -> schemas/frontmatter/)
find . -name "*.md" -type f -not -path "*/node_modules/*" -exec sed -i "s|schema/frontmatter\.schema\.json|schemas/frontmatter/frontmatter.schema.json|g" {} +

echo "Migration complete! Review changes with: git diff"
```

**Usage:**
```bash
chmod +x migrate-schema-references.sh
./migrate-schema-references.sh
git diff  # Review changes
```

## Rollback Plan

If issues arise:

1. **Quick rollback**
   ```bash
   # Restore from backup
   cp schemas/frontmatter.schema.json.backup schemas/frontmatter.schema.json

   # Revert git changes
   git checkout HEAD -- .
   ```

2. **Partial rollback**
   - Keep the new structure
   - Create symlink for backward compatibility:
   ```bash
   ln -s frontmatter/frontmatter.schema.json schemas/frontmatter.schema.json
   ```

## Verification Checklist

After migration, verify:

- [ ] Schema file exists at new location
- [ ] Old location removed (or symlinked)
- [ ] All code files updated and working
- [ ] All frontmatter $schema references updated
- [ ] All documentation links updated
- [ ] Broken links fixed
- [ ] VSCode settings updated
- [ ] GitHub Actions workflow passing
- [ ] Validation script works: `npm run validate`
- [ ] Tests pass: `npm test`
- [ ] No grep results for old path (except backups/docs)
- [ ] CHANGELOG updated
- [ ] No broken references in production

## Success Criteria

Migration is considered successful when:

1. ✅ All frontmatter validates without errors
2. ✅ CI/CD pipeline passes
3. ✅ No broken links in documentation
4. ✅ All code files use new path
5. ✅ VSCode intellisense works with new path
6. ✅ Examples and tests run successfully
7. ✅ No complaints from team members about broken tools

## Timeline

**Estimated Duration**: 2-3 hours

- Phase 1 (Preparation): ✅ Complete
- Phase 2 (Setup): 15 minutes
- Phase 3 (Code): 15 minutes
- Phase 4 (Frontmatter): 30 minutes
- Phase 5 (Documentation): 45 minutes
- Phase 6 (Broken Links): 15 minutes
- Phase 7 (Workflows): 10 minutes
- Phase 8 (Testing): 30 minutes
- Phase 9 (Cleanup): 15 minutes

## Support

Questions or issues?

1. Check [README.md](./README.md) for schema documentation
2. Review [validation examples](./examples/)
3. Test with `npm run validate`
4. Open an issue in GitHub

---

**Status**: Ready for execution
**Approved by**: Pending
**Executed by**: Pending
**Completion date**: Pending
