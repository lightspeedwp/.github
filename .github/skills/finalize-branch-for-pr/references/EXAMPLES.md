# Example Usage

This document provides real-world examples of using the `finalize-branch-for-pr` skill.

## Example 1: Hotfix Branch

### Context
- **Repository**: tour-operator plugin
- **Branch**: `hotfix-wetu-map`
- **Base Branch**: `develop`
- **Commits**: 1 fix commit

### Command
```
Please scan this repo branch for the latest commits, then update the changelog, 
and create a pull request.
```

### Result

#### Changelog Entry Added
```markdown
#### Blocks

- **Wetu Map block variation** - Removed className from Wetu Map block variation 
  to prevent style conflicts and reverted build version in index.asset.php for 
  consistency
```

#### Pull Request Created
- **Number**: #1132
- **Title**: Hotfix: Fix Wetu Map block variation className and version
- **URL**: https://github.com/lightspeedwp/tour-operator/pull/1132
- **Status**: Open
- **Target**: develop ← hotfix-wetu-map

#### PR Description
```markdown
## Changes

This hotfix addresses issues with the Wetu Map block variation:

### Fixed
- Removed `className` from Wetu Map block variation to prevent style conflicts
- Reverted version in `index.asset.php` for consistency

### Files Changed
- `src/blocks/wetu-map/index.js` - Removed className property
- `build/blocks/wetu-map/index.asset.php` - Reverted version
- `build/blocks/wetu-map/index.js` - Updated build output

### Testing
- Verify Wetu Map block variation displays correctly without style conflicts
- Check that block functionality remains intact

## Changelog Updated
Updated [changelog.md](changelog.md) with fix details under version 2.1.2
```

---

## Example 2: Feature Branch (Multiple Commits)

### Context
- **Repository**: lsx-blocks plugin
- **Branch**: `feature/accessibility-improvements`
- **Base Branch**: `develop`
- **Commits**: 5 commits (3 features, 2 fixes)

### Expected Behavior

The skill would:
1. Identify 5 commits with different types
2. Categorize into "Added" and "Fixed" sections
3. Group related changes under subsections
4. Create comprehensive PR with all changes listed

### Example Commits
```
feat: Add ARIA labels to navigation blocks
feat: Implement keyboard navigation for sliders
feat: Add skip-to-content link component
fix: Correct heading hierarchy in card blocks
fix: Fix color contrast in button variants
```

### Expected Changelog Updates

```markdown
### Added

#### Accessibility
- **ARIA labels** - Added proper ARIA labels to navigation blocks for screen reader support
- **Keyboard navigation** - Implemented full keyboard navigation for slider components
- **Skip-to-content link** - Added accessible skip-to-content link component

### Fixed

#### Accessibility
- **Heading hierarchy** - Corrected heading hierarchy in card blocks to ensure proper document outline
- **Button contrast** - Fixed color contrast ratios in button variants to meet WCAG 2.1 AA standards
```

---

## Example 3: Multiple Subsections

### Context
- **Repository**: tour-operator plugin
- **Branch**: `feature/query-improvements`
- **Commits**: Mix of query, editor, and styling fixes

### Example Commits
```
fix: Query block class detection in innerHTML
feat: Add custom order checkbox to Query settings
fix: Breadcrumb hierarchy for destinations
enhance: Improve card spacing consistency
```

### Expected Changelog Organization

```markdown
### Added

#### Query Loops & Filtering
- **Custom order checkbox** - Added checkbox control to Query block settings panel

### Fixed

#### Query Loops & Filtering
- **Query block class detection** - Improved reliability by checking innerHTML

#### Editor & Navigation
- **Breadcrumb hierarchy** - Fixed hierarchical breadcrumb paths for destinations

### Enhancements

#### Layout & Styling
- **Card spacing** - Improved spacing consistency across card components
```

---

## Tips for Best Results

### Write Clear Commit Messages
Use conventional commit format:
```
fix: Description of what was fixed
feat: Description of new feature
enhance: Description of improvement
```

### One Change Per Commit
Keep commits focused on a single change for easier categorization:
```
✅ Good: "fix: Correct button alignment in card footer"
❌ Bad: "fix: Multiple button and card issues"
```

### Reference Issues
Link to GitHub issues in commit messages:
```
fix: Resolve map marker clustering issue (#892)
feat: Add distance filter to search (#901)
```

### Use Descriptive Details
Provide context in commit message body:
```
fix: Prevent duplicate entries in query loops

When custom order was enabled, some queries would return
duplicate posts if they appeared in multiple taxonomies.
Now properly filters unique post IDs.
```

---

## Integration with Workflows

### Gitflow Workflow
```
develop (base) ← feature/new-capability (current)
develop (base) ← hotfix/urgent-fix (current)
main (base) ← release/2.1.2 (current)
```

### GitHub Flow
```
main (base) ← feature/new-capability (current)
```

### After PR Creation

1. Review generated PR on GitHub
2. Request reviews from team members
3. Run CI/CD checks
4. Address review comments
5. Merge when approved

---

## Customization Examples

### Custom Subsection
If your change doesn't fit existing subsections:

```markdown
#### REST API
- **Custom endpoints** - Added REST API endpoints for meta field updates
```

### Multiple Related Changes
Group related changes together:

```markdown
#### Breadcrumbs
- **Hierarchical structure** - Comprehensive breadcrumb improvements:
  - Increased filter priority to ensure precedence
  - Enhanced destination breadcrumbs for proper hierarchy
  - Added post type archive breadcrumbs
  - Expanded taxonomy support
```

### External Dependencies
Note dependency changes:

```markdown
#### Dependencies
- **Updated React** - Upgraded React to v18.2 for performance improvements
- **Added @wordpress/icons** - New dependency for standardized icon usage
```

---

## Workflow Integration

This skill works seamlessly with:

- **Pre-commit hooks** - Validate commit message format
- **CI/CD pipelines** - Automated testing before PR creation
- **Code review tools** - PR templates pre-filled with testing steps
- **Release automation** - Changelog entries feed into release notes

---

## Common Patterns

### Bug Fix Branch
```bash
git checkout -b hotfix/fix-map-display develop
# Make fixes
git commit -m "fix: Correct map marker positioning"
# Use skill to finalize
```

### Feature Branch
```bash
git checkout -b feature/add-gallery-block develop
# Develop feature
git commit -m "feat: Add responsive gallery block"
# Use skill to finalize
```

### Enhancement Branch
```bash
git checkout -b enhance/improve-performance develop
# Make improvements
git commit -m "enhance: Optimize query loop performance"
# Use skill to finalize
```
