---
name: finalize-branch-for-pr
description: >
  Automate the process of finalizing a development branch by scanning commits,
  updating the changelog with proper semantic categorization, and creating a pull
  request with comprehensive details. Use when development work is complete on a
  branch and you need to prepare it for merge via pull request.
license: MIT
compatibility: Requires Git repository with develop branch and semantic changelog format
metadata:
  version: "1.0.0"
  author: lightspeedwp
  tags: git, changelog, pull-request, workflow, automation
---

# Finalize Branch for Pull Request

## Purpose

Automate the final steps of branch development by analyzing commits, updating the changelog with semantic categorization, and creating a well-documented pull request ready for review.

## Core Capabilities

- Scan git branch for commits not in develop/main
- Analyze commit messages for semantic type (Fix, Feat, Chore, etc.)
- Update changelog with proper categorization (Added, Fixed, Changed, etc.)
- Read plugin/theme version from main file or package.json
- Generate comprehensive PR description with:
  - Summary of changes
  - Files modified
  - Testing checklist
  - Changelog reference
- Create pull request targeting develop/main branch

## Quick Start Workflow

1. **Scan Commits** - Get list of commits on current branch vs base branch
2. **Categorize Changes** - Analyze commit messages for semantic type
3. **Update Changelog** - Add entries under appropriate version and category
4. **Create Pull Request** - Generate PR with detailed description
5. **Confirm** - Provide PR URL and changelog confirmation

## Information Needed

Before running this skill:

### Repository Details
- Repository path (absolute path to plugin/theme)
- Base branch name (usually `develop` or `main`)
- Current branch name (will be detected automatically)
- Repository owner and name for GitHub API

### Changelog Details
- Changelog file location (e.g., `changelog.md`, `CHANGELOG.md`)
- Current version number (auto-detected from plugin/theme file)
- Changelog format (semantic sections: Added, Fixed, Changed, etc.)

### Pull Request Details
- PR title format preference (optional, defaults to semantic format)
- Draft PR or ready for review (optional, defaults to ready)

## Commit Message Analysis

The skill categorizes commits based on conventional commit prefixes:

### Fix Commits → "### Fixed"
- `Fix:` or `fix:`
- `Bugfix:` or `bugfix:`
- `Hotfix:` or `hotfix:`

### Feature Commits → "### Added"
- `Feat:` or `feat:`
- `Feature:` or `feature:`
- `Add:` or `add:`
- `New:` or `new:`

### Change Commits → "### Changed"
- `Change:` or `change:`
- `Update:` or `update:`
- `Refactor:` or `refactor:`

### Enhancement Commits → "### Enhancements"
- `Enhance:` or `enhance:`
- `Improve:` or `improve:`

### Other Types
- `Chore:` → "### Maintenance"
- `Docs:` → "### Documentation"
- `Style:` → "### Styling"
- `Test:` → "### Testing"

## Changelog Structure

The skill expects and maintains this structure:

```markdown
# Changelog

## [[VERSION]](repo-url/releases/tag/VERSION) - WIP

### Added
- New features and capabilities

### Fixed
- Bug fixes and corrections

### Changed
- Changes to existing functionality

### Enhancements
- Improvements and optimizations

### Maintenance
- Chores, dependencies, and internal changes
```

## Subsection Organization

Within each main section (Added, Fixed, etc.), entries should be organized by subsections:

### Common Subsections
- **Blocks** - Block editor components and variations
- **Editor & Navigation** - Editor UI and navigation features
- **Layout & Styling** - Visual presentation and CSS
- **Query Loops & Filtering** - Query blocks and data filtering
- **Frontend** - Public-facing features
- **Backend** - Admin and configuration features
- **Code Quality** - Refactoring and code improvements

## Pull Request Template

Generated PRs include:

### Header
```markdown
## Changes

Brief summary of what this branch accomplishes
```

### Main Sections
```markdown
### [Category]
- Change description with technical details
- Links to related issues/PRs when applicable

### Files Changed
- List of modified files with brief explanation

### Testing
- Testing steps and verification checklist
```

### Footer
```markdown
## Changelog Updated
Updated [changelog.md](changelog.md) with details under version X.X.X
```

## Validation & Safety

Before creating PR, the skill:

- ✅ Verifies changelog file exists
- ✅ Confirms version number is present
- ✅ Validates git branch has commits to merge
- ✅ Checks for uncommitted changes
- ✅ Ensures base branch (develop/main) exists
- ✅ Validates GitHub repository connection

## Example Usage

### Basic Usage
```
@finalize-branch-for-pr for the current repository
```

### With Specific Repo
```
@finalize-branch-for-pr for /path/to/plugin
```

### With Custom Base Branch
```
@finalize-branch-for-pr against main branch
```

## Integration with Existing Tools

### Works With
- **Git** - All git operations (log, diff, branch detection)
- **GitHub CLI** - Enhanced PR creation if available
- **Semantic Release** - Compatible with semantic versioning
- **Conventional Commits** - Follows commit message standards

### Compatible Workflows
- Gitflow workflow (develop → main)
- GitHub Flow (feature → main)
- Hotfix branches (hotfix → develop)

## Troubleshooting

### No Commits Found
**Problem**: "No commits found on branch"  
**Solution**: Verify you're on correct branch and have pushed commits

### Changelog Not Updated
**Problem**: Changelog file not modified  
**Solution**: Check file permissions and ensure proper version section exists

### PR Creation Failed
**Problem**: GitHub API error  
**Solution**: Verify GitHub authentication and repository access

### Wrong Category
**Problem**: Commit placed in wrong changelog section  
**Solution**: Use conventional commit prefix (Fix:, Feat:, etc.)

## Best Practices

### Commit Messages
- Use conventional commit format: `Type: Description`
- Keep messages clear and descriptive
- Reference issues when applicable: `Fix: resolve #123`

### Changelog Entries
- Be specific about what changed and why
- Include relevant issue/PR links
- Group related changes under appropriate subsections
- Use consistent formatting and punctuation

### Pull Requests
- Review generated PR description before submitting
- Add additional context or testing notes if needed
- Link to related issues or documentation
- Tag appropriate reviewers

## Output Format

After successful execution:

```
✅ Changelog updated with 1 fix entry
✅ Pull request created: #1132
   Title: Hotfix: Fix Wetu Map block variation
   URL: https://github.com/owner/repo/pull/1132
   Status: Open
   Target: develop ← hotfix-wetu-map
```

## Advanced Configuration

### Custom Changelog Location
By default searches for:
- `changelog.md`
- `CHANGELOG.md`
- `CHANGES.md`

Specify custom location in repository configuration.

### Custom Version Detection
Automatically detects version from:
- WordPress plugin header: `Version: X.X.X`
- WordPress theme header: `Version: X.X.X`
- `package.json`: `"version": "X.X.X"`
- `composer.json`: `"version": "X.X.X"`

### PR Template Override
Repository `.github/pull_request_template.md` takes precedence if present.

## Files Modified

This skill modifies:
- Repository changelog file (e.g., `changelog.md`)
- Creates GitHub pull request (via API)
- No other files are modified

## Security & Permissions

### Required Permissions
- Read access to repository
- Write access to changelog file
- GitHub API access for PR creation
- Push access to current branch (for changelog commit)

### Recommended Setup
- Configure GitHub personal access token
- Set up GPG signing for commits
- Enable branch protection on develop/main
- Require PR reviews before merge

## Related Skills

- **create-pull-request** - Lower-level PR creation
- **update-changelog** - Manual changelog updates
- **semantic-release** - Automated versioning and releases
- **commit-linting** - Validate commit message format

## Support & Maintenance

**Version**: 1.0.0  
**Last Updated**: 2026-05-12  
**Maintained By**: lightspeedwp  
**Issues**: Report via repository issues

## License

MIT License - Free to use and modify for any purpose
