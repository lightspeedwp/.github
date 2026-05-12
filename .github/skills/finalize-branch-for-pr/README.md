# Finalize Branch for Pull Request

**Automate changelog updates and PR creation when branch development is complete.**

## Quick Start

When you've finished development on a branch and are ready to create a pull request:

```
@finalize-branch-for-pr for /path/to/repository
```

or simply:

```
Please scan this repo branch for the latest commits, then update the changelog, and create a pull request.
```

## What It Does

1. ✅ Scans your current branch for commits not in the base branch (develop/main)
2. ✅ Analyzes commit messages to categorize changes (Fix, Feature, Enhancement, etc.)
3. ✅ Updates the changelog with properly organized entries
4. ✅ Creates a comprehensive pull request with:
   - Detailed description of changes
   - List of modified files
   - Testing checklist
   - Link to updated changelog

## When to Use

- ✅ Feature branch ready for review
- ✅ Hotfix needs to be merged
- ✅ Enhancement complete and tested
- ✅ Any branch ready to create a PR

## Requirements

- Git repository with commits on current branch
- Changelog file (changelog.md or CHANGELOG.md)
- Access to GitHub for PR creation
- Base branch (develop or main) exists

## Commit Message Format

For best results, use conventional commit format:

```
fix: Description of bug fix
feat: Description of new feature
enhance: Description of improvement
chore: Description of maintenance task
```

The skill automatically categorizes commits into appropriate changelog sections.

## Output

After running:

```
✅ Changelog updated with entries
✅ Pull request created: #1132
   URL: https://github.com/owner/repo/pull/1132
   Status: Open
   Target: develop ← your-branch
```

## Examples

See [references/EXAMPLES.md](references/EXAMPLES.md) for detailed usage examples.

## Full Documentation

See [SKILL.md](SKILL.md) for complete documentation including:
- Detailed workflow
- Commit categorization rules
- Changelog structure
- PR template format
- Troubleshooting guide
- Advanced configuration

## Related Skills

- **create-pull-request** - Create PR without changelog update
- **update-changelog** - Update changelog manually
- **commit-linting** - Validate commit message format

---

**Version**: 1.0.0  
**Author**: lightspeedwp  
**License**: MIT
