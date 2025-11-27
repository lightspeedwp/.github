# WordPress Instructions Reorganisation Task List

## User Request Summary

Audit all instruction files in `.github/instructions/wordpress/` and reorganise them into:

- `.github/instructions/block-plugin/` - Block plugin development instructions
- `.github/instructions/block-theme/` - Block theme development instructions

**Objectives:**

1. Merge duplicate files (e.g., `block-json.instructions.md` and `block-json-alt.instructions.md`)
2. Split content appropriately between block-theme and block-plugin folders
3. Ensure index files are clear: `block-plugin-development.instructions.md` and `block-theme-development.instructions.md`
4. Add clear scope messaging: instructions apply to WordPress org repositories only, NOT the `.github` community health repository

---

## Audit Findings

### Current Files in `.github/instructions/wordpress/`

| File | Status | Duplicate? | Action Needed |
|------|--------|------------|---------------|
| `a11y.instructions.md` | Exists | ⚠️ Duplicate with `accessibility.instructions.md` | Merge content, keep one |
| `accessibility.instructions.md` | Exists | ⚠️ Duplicate with `a11y.instructions.md` | Merge content, delete duplicate |
| `block-json.instructions.md` | Exists | ⚠️ Duplicate with `block-json-alt.instructions.md` | Merge, move to `block-plugin/` |
| `block-json-alt.instructions.md` | Exists | ⚠️ Identical to `block-json.instructions.md` | Delete (exact duplicate) |
| `blocks.instructions.md` | Exists | ⚠️ Minimal content (1 line) | Expand and move to `block-plugin/` |
| `patterns.instructions.md` | Exists | ⚠️ Duplicate with `patterns-alt.instructions.md` | Merge, move to `block-theme/` |
| `patterns-alt.instructions.md` | Exists | ⚠️ Identical to `patterns.instructions.md` | Delete (exact duplicate) |
| `theme-json.instructions.md` | Exists | ⚠️ Better version exists in `block-theme/` | Keep in `block-theme/`, delete from wordpress/ |
| Other files | To audit | Unknown | Need review |

### Current Files in `.github/instructions/block-theme/`

| File | Status | Notes |
|------|--------|-------|
| `block-theme.instructions.md` | ✅ Good | Keep |
| `html-template.instructions.md` | ✅ Good | Keep |
| `json.instructions.md` | ⚠️ Review | May overlap with theme-json |
| `pattern-development.instructions.md` | ✅ Good | Keep |
| `patterns.instructions.md` | ⚠️ Review | May overlap with wordpress/ |
| `php-block.instructions.md` | ✅ Good | Keep |
| `theme-json-validation.instructions.md` | ✅ Good | Keep |
| `theme-json.instructions.md` | ⚠️ Minimal | Needs content from wordpress/ version |

### Current Files in `.github/instructions/block-plugin/`

| File | Status | Notes |
|------|--------|-------|
| `block-json.instructions.md` | ⚠️ Minimal | Same content as wordpress/ versions |
| `blocks.instructions.md` | ⚠️ Minimal | Same as wordpress/ version (1 line) |
| `playwright.instructions.md` | ✅ Good | Keep |

### Files in `.github/instructions/wpcs/` (Shared Standards)

| File | Status | Notes |
|------|--------|-------|
| `wpcs-accessibility.instructions.md` | ✅ Shared | Used by both theme and plugin |
| `wpcs-css.instructions.md` | ✅ Shared | Used by both theme and plugin |
| `wpcs-html.instructions.md` | ✅ Shared | Used by both theme and plugin |
| `wpcs-javascript.instructions.md` | ✅ Shared | Used by both theme and plugin |
| `wpcs-js-docs.instructions.md` | ✅ Shared | Used by both theme and plugin |
| `wpcs-php-docs.instructions.md` | ✅ Shared | Used by both theme and plugin |
| `wpcs-php.instructions.md` | ✅ Shared | Used by both theme and plugin |

---

## Task List

### Phase 1: Audit & Analysis ✅ COMPLETE

- [x] List all files in `.github/instructions/wordpress/`
- [x] List all files in `.github/instructions/block-theme/`
- [x] List all files in `.github/instructions/block-plugin/`
- [x] Identify exact duplicates
- [x] Identify content overlaps
- [x] Document findings

### Phase 2: Merge Exact Duplicates ✅ COMPLETE

- [x] **Task 2.1**: Delete `wordpress/block-json-alt.instructions.md` (identical to `block-json.instructions.md`)
- [x] **Task 2.2**: Delete `wordpress/patterns-alt.instructions.md` (identical to `patterns.instructions.md`)
- [x] **Task 2.3**: Merge `wordpress/a11y.instructions.md` with `wordpress/accessibility.instructions.md`
  - Kept the more comprehensive `a11y.instructions.md`
  - Deleted the shorter `accessibility.instructions.md`

### Phase 3: Content Consolidation

- [ ] **Task 3.1**: Create comprehensive `block-plugin/block-json.instructions.md`
  - Merge content from `wordpress/block-json.instructions.md`
  - Add proper frontmatter with scope notice
  - Expand minimal content
- [ ] **Task 3.2**: Create comprehensive `block-plugin/blocks.instructions.md`
  - Expand the 1-line content
  - Add proper frontmatter with scope notice
- [ ] **Task 3.3**: Update `block-theme/theme-json.instructions.md`
  - Incorporate content from `wordpress/theme-json.instructions.md` (more comprehensive)
  - Add proper frontmatter with scope notice
- [ ] **Task 3.4**: Consolidate pattern instructions into `block-theme/patterns.instructions.md`
  - Merge `wordpress/patterns.instructions.md`
  - Ensure `pattern-development.instructions.md` is referenced

### Phase 4: Block Theme Specific Files

Create/update block-theme specific versions:

- [ ] **Task 4.1**: Create `block-theme/accessibility.instructions.md`
  - Focus on theme-specific accessibility (patterns, templates, template parts)
  - Reference shared `wpcs/wpcs-accessibility.instructions.md`
- [ ] **Task 4.2**: Verify all block-theme files have proper scope notice

### Phase 5: Block Plugin Specific Files

Create/update block-plugin specific versions:

- [ ] **Task 5.1**: Create `block-plugin/accessibility.instructions.md`
  - Focus on block-specific accessibility (block controls, editor UX)
  - Reference shared `wpcs/wpcs-accessibility.instructions.md`
- [ ] **Task 5.2**: Verify all block-plugin files have proper scope notice

### Phase 6: Update Index Files

- [ ] **Task 6.1**: Update `block-theme-development.instructions.md`
  - Ensure comprehensive index of all block-theme instructions
  - Add clear scope notice for WordPress repositories only
  - Update file references table
- [ ] **Task 6.2**: Update `block-plugin-development.instructions.md`
  - Ensure comprehensive index of all block-plugin instructions
  - Add clear scope notice for WordPress repositories only
  - Update file references table

### Phase 7: Cleanup

- [ ] **Task 7.1**: Remove files from `wordpress/` that have been migrated
  - `block-json.instructions.md` → moved to `block-plugin/`
  - `block-json-alt.instructions.md` → deleted
  - `patterns.instructions.md` → moved to `block-theme/`
  - `patterns-alt.instructions.md` → deleted
  - `blocks.instructions.md` → moved to `block-plugin/`
  - `theme-json.instructions.md` → content merged into `block-theme/`
  - `a11y.instructions.md` → merged with accessibility, then split
  - `accessibility.instructions.md` → split into theme/plugin specific
- [ ] **Task 7.2**: Update any cross-references in other instruction files
- [ ] **Task 7.3**: Update `wpcs.instructions.md` if needed

### Phase 8: Validation

- [ ] **Task 8.1**: Verify all files have valid frontmatter
- [ ] **Task 8.2**: Verify all internal links work
- [ ] **Task 8.3**: Verify scope notices are present and clear
- [ ] **Task 8.4**: Run linting on updated markdown files

---

## File Movement Summary

### Files to DELETE (exact duplicates)

```
.github/instructions/wordpress/block-json-alt.instructions.md
.github/instructions/wordpress/patterns-alt.instructions.md
```

### Files to MERGE

```
wordpress/a11y.instructions.md + wordpress/accessibility.instructions.md → split to theme/plugin
wordpress/theme-json.instructions.md → merge content into block-theme/theme-json.instructions.md
```

### Files to MOVE/REPLACE

```
wordpress/block-json.instructions.md → block-plugin/block-json.instructions.md (expand)
wordpress/blocks.instructions.md → block-plugin/blocks.instructions.md (expand)
wordpress/patterns.instructions.md → block-theme/patterns.instructions.md (merge)
```

---

## Scope Notice Template

All WordPress instruction files should include this frontmatter notice:

```markdown
> ⚠️ **Scope Notice**: These instructions are intended for **WordPress [theme/plugin]
> repositories** within the `lightspeedwp` GitHub organisation. They should **not**
> be applied to the `lightspeedwp/.github` community health repository, as that
> repository does not contain WordPress code.
```

---

## Current Phase: Ready to Execute

Awaiting approval to proceed with Phase 2 (Merge Exact Duplicates).
