# File-Specific README Cleanup Report

**Date:** 27 November 2025
**Issue:** Unwanted file-specific README files (README.*.md pattern)
**Total Files Found:** 356 (excluding node_modules)

## Analysis

The repository contains 356 file-specific README files that follow the pattern `README.{filename}.md`. These were auto-generated for individual files and are not needed.

### Distribution by Directory

| Directory | Count | Examples |
|-----------|-------|----------|
| `.github/agents/` | ~80 | README.branding.agent.js.md, README.template.agent.md.md |
| `.github/prompts/` | ~80 | README.accessibility-review.prompt.md.md, README.block-scaffold.prompt.md.md |
| `.github/workflows/` | ~40 | README.lint.yml.md, README.ci.yml.md |
| `.github/instructions/` | ~30 | README.coding-standards.instructions.md.md |
| `.github/chatmodes/` | ~25 | README.a11y.chatmode.md.md, README.pattern-wizard.chatmode.md.md |
| `docs/` | ~50 | README.LINTING.md.md, README.ARCHITECTURE.md.md |
| `schemas/` | ~15 | README.frontmatter.schema.json.md |
| `scripts/` | ~10 | README.validate-agents.js.md |
| `tests/` | ~7 | README.test-helpers.js.md |
| `.github/` (root) | ~10 | README.custom-instructions.md.md |

## Policy

**Rule:** Only ONE README.md per folder is needed. File-specific READMEs should NOT be created unless expressly requested.

**Exceptions:**

- `README.md` (standard folder-level documentation)
- Special cases where a specific file needs detailed documentation (rare, must be requested)

## Files to Remove

All 356 file-specific README files matching the pattern `README.*.md` (excluding node_modules).

### Categories

1. **Agent spec documentation** (README.{name}.agent.md.md)
2. **Agent implementation documentation** (README.{name}.agent.js.md)
3. **Prompt documentation** (README.{name}.prompt.md.md)
4. **Workflow documentation** (README.{name}.yml.md)
5. **Instruction documentation** (README.{name}.instructions.md.md)
6. **Chatmode documentation** (README.{name}.chatmode.md.md)
7. **Schema documentation** (README.{name}.schema.json.md)
8. **Config file documentation** (README.{name}.yml.md, README.config.yml.md)
9. **General docs** (README.{NAME}.md.md)

## Backup Files Found

Also found numerous `.bak.*` backup files:

```bash
find . -name "*.md.bak.*" | wc -l
# Result: Multiple backup files from previous operations
```

## Recommended Action

### Step 1: Create Backup (Optional)

```bash
# Create timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup all file-specific READMEs to archive
mkdir -p tmp/removed-readmes-$TIMESTAMP
find . -type f -name "README.*.md" -not -path "./node_modules/*" \
  -exec cp --parents {} tmp/removed-readmes-$TIMESTAMP/ \;
```

### Step 2: Remove File-Specific READMEs

```bash
# Remove all file-specific README files
find . -type f -name "README.*.md" -not -path "./node_modules/*" -delete

# Verify removal
find . -type f -name "README.*.md" -not -path "./node_modules/*" | wc -l
# Expected: 0
```

### Step 3: Remove Backup Files

```bash
# Remove all backup files
find . -name "*.md.bak.*" -delete
```

### Step 4: Update Documentation Standards

Add to relevant instructions/guidelines:

- Document the "one README.md per folder" rule
- Update folder-and-file-readmes.sh script to NOT create file-specific READMEs
- Add pre-commit hook to prevent creation of README.*.md files

## Prevention

### Update .github/instructions/readme.instructions.md

Add clear rule:

```markdown
## README File Naming Convention

**Rule:** Each folder should have ONE README.md file only.

**Prohibited:** 
- README.{filename}.md (file-specific documentation)
- README.{NAME}.md.md (documentation about other documentation)

**Allowed:**
- README.md (folder-level documentation)
- Expressly requested file-specific documentation (rare exceptions)

**Rationale:** 
- File-specific READMEs create clutter
- Folder-level README should index/describe all files
- Individual files should have inline documentation
- Special documentation needs should go in docs/ folder
```

### Git Hook (Optional)

Add to `.husky/pre-commit`:

```bash
# Prevent file-specific README commits
FILE_SPECIFIC_READMES=$(git diff --cached --name-only | grep -E "README\.[^/]+\.md$" || true)
if [ -n "$FILE_SPECIFIC_READMES" ]; then
  echo "Error: File-specific READMEs are not allowed"
  echo "Please use folder-level README.md instead"
  echo "Files:"
  echo "$FILE_SPECIFIC_READMES"
  exit 1
fi
```

## Impact Assessment

**Low Risk:** These are auto-generated documentation stubs that duplicate information already available in:

- The actual files themselves (via inline comments)
- Folder-level README.md files
- Main documentation in docs/

**Benefits of Removal:**

- Cleaner repository structure
- Reduced maintenance burden
- Clearer documentation hierarchy
- Faster searches and navigation
- Smaller git history

## Execution Plan

1. ✅ Generate this report
2. ⏳ Review and approve removal
3. ⏳ Optional: Create backup archive
4. ⏳ Execute removal commands
5. ⏳ Verify removal
6. ⏳ Update documentation standards
7. ⏳ Add prevention mechanisms
8. ⏳ Commit changes

---

**Ready to execute:** Awaiting approval to proceed with cleanup.
