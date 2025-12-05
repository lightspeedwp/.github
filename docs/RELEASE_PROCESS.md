---
version: "v0.1.0"
last_updated: "2025-11-13"
owners: ["lightspeedwp"]
file_type: "process-guide"
category: "release-management"
description: "Authoritative release process flow from develop to main with branch and gating requirements"
---

# Release Process (develop → main)

1. Work on `develop`.
2. Run **Release Agent** (optionally with `--scope` for partial releases).
3. Open Release PR → **lint gate must pass** (`lint.yml` required check).
4. On green, merge to `main`. Tag is created/pushed by the agent.
5. Post-merge: confirm `VERSION` & docs have no drift (`--verify`).

*This document is authoritative for gates and branch flow.*

# Release Scope Parameter Guide

This guide explains how to use the `--scope` parameter with the LightSpeed release automation system to control semantic version bumping.

## Table of Contents

- [Overview](#overview)
- [Semantic Versioning Primer](#semantic-versioning-primer)
- [The --scope Parameter](#the---scope-parameter)
- [When to Use Each Scope](#when-to-use-each-scope)
- [Examples](#examples)
- [Release Label System](#release-label-system)
- [FAQ](#faq)

---

## Overview

The release agent supports a `--scope` parameter that determines how the version number is incremented during a release. This follows [Semantic Versioning (SemVer)](https://semver.org/) principles.

**Syntax:**

```bash
node .github/agents/release.agent.cjs --scope=<major|minor|patch>
```

---

## Semantic Versioning Primer

Semantic versioning uses a three-part version number: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes that are NOT backward-compatible
- **MINOR**: New features that ARE backward-compatible
- **PATCH**: Bug fixes and improvements that ARE backward-compatible

**Example progression:**

```
1.0.0  →  1.0.1  (patch: bug fix)
1.0.1  →  1.1.0  (minor: new feature)
1.1.0  →  2.0.0  (major: breaking change)
```

---

## The --scope Parameter

### Valid Values

| Scope   | Version Bump        | Use For                                          |
| ------- | ------------------- | ------------------------------------------------ |
| `patch` | `X.Y.Z → X.Y.(Z+1)` | Bug fixes, documentation, minor tweaks           |
| `minor` | `X.Y.Z → X.(Y+1).0` | New features, enhancements (backward-compatible) |
| `major` | `X.Y.Z → (X+1).0.0` | Breaking changes, incompatible API changes       |

### Default Behavior

If `--scope` is not specified, the release agent defaults to **`patch`**.

```bash
# These are equivalent:
node .github/agents/release.agent.cjs
node .github/agents/release.agent.cjs --scope=patch
```

---

## When to Use Each Scope

### Use `--scope=patch` when

✅ Fixing bugs  
✅ Updating documentation  
✅ Refactoring code without changing behaviour  
✅ Performance improvements (non-breaking)  
✅ Dependency updates (minor/patch)  
✅ Accessibility fixes  
✅ Security patches (non-breaking)

**Example changes:**

- "Fix typo in error message"
- "Update README installation instructions"
- "Improve performance of search algorithm"
- "Fix accessibility issue in navigation"

### Use `--scope=minor` when

✅ Adding new features  
✅ Adding new functions/methods (backward-compatible)  
✅ Deprecating functionality (but not removing)  
✅ Adding new configuration options  
✅ Extending existing APIs (non-breaking)  
✅ New WordPress block patterns  
✅ New theme customisation options

**Example changes:**

- "Add dark mode toggle to settings"
- "Add new pattern: Call-to-Action with image"
- "Add support for custom post types"
- "Add new REST API endpoint for search"

### Use `--scope=major` when

⚠️ Removing features or APIs  
⚠️ Changing function signatures  
⚠️ Changing data structures (incompatible)  
⚠️ Requiring PHP/Node version upgrade  
⚠️ Removing deprecated functionality  
⚠️ Changing configuration format  
⚠️ Renaming classes/functions/files

**Example changes:**

- "Remove deprecated `old_api()` function"
- "Change `getUserData()` to require authentication"
- "Upgrade minimum PHP version to 8.1"
- "Rename `config.json` to `app.config.json`"

---

## Examples

### Example 1: Bug Fix Release

**Current version:** `1.2.3`  
**Changes:** Fixed a bug in form validation  
**Command:**

```bash
node .github/agents/release.agent.cjs --scope=patch
```

**Result:** Version becomes `1.2.4`

---

### Example 2: New Feature Release

**Current version:** `1.2.4`  
**Changes:** Added user profile page and settings panel  
**Command:**

```bash
node .github/agents/release.agent.cjs --scope=minor
```

**Result:** Version becomes `1.3.0`

---

### Example 3: Breaking Change Release

**Current version:** `1.3.0`  
**Changes:** Removed old authentication system, requires new OAuth flow  
**Command:**

```bash
node .github/agents/release.agent.cjs --scope=major
```

**Result:** Version becomes `2.0.0`

---

### Example 4: Dry-Run Testing

Test what would happen without making changes:

```bash
# Test a major version bump
node .github/agents/release.agent.cjs --scope=major --dry-run

# Output shows what would happen:
# Version bump: 1.3.0 → 2.0.0
# [DRY-RUN] Would write "2.0.0" to VERSION
# [DRY-RUN] Would update CHANGELOG.md...
```

---

## Release Label System

The release automation system uses GitHub PR labels to determine version bumps automatically:

### Labels

| Label           | Scope | Description                        |
| --------------- | ----- | ---------------------------------- |
| `release:patch` | patch | Bug fixes and minor improvements   |
| `release:minor` | minor | New features (backward-compatible) |
| `release:major` | major | Breaking changes                   |

### How It Works

1. **Manual Workflow**: Use `--scope` parameter when running release agent manually
2. **Automated Workflow**: Release-prep workflow analyses merged PR labels to determine scope
3. **Label Enforcement**: PRs must have exactly one `release:*` label before merging

### Setting Labels

When creating a PR, apply the appropriate `release:*` label:

```bash
# Via gh CLI
gh pr create --label "release:minor" --title "Add user profiles"

# Via GitHub UI
# Add label in the right sidebar of your PR
```

**Important:** Only one `release:*` label should be applied per PR.

---

## FAQ

### Q: What if I'm not sure which scope to use?

**A:** Ask yourself these questions:

1. **Does it break existing code?** → `major`
2. **Does it add new functionality?** → `minor`
3. **Does it just fix or improve?** → `patch`

When in doubt, start with `patch` and consult with maintainers.

### Q: Can I skip version numbers?

**A:** Yes, SemVer allows gaps. For example:

- `1.0.0 → 2.0.0` (skip 1.x.x entirely)
- `1.5.3 → 1.10.0` (skip 1.6.0-1.9.x)

This is fine and sometimes necessary for alignment.

### Q: What about pre-release versions?

**A:** The current release agent doesn't support pre-release versions (alpha, beta, rc) yet. For now, use:

```bash
# Manual pre-release tagging
git tag v2.0.0-beta.1
git push --tags
```

### Q: What if the CHANGELOG doesn't match the scope?

**A:** The release agent will still bump the version as specified by `--scope`, but it's best practice to ensure your CHANGELOG accurately reflects the changes:

- **Major release** should document breaking changes clearly
- **Minor release** should list new features
- **Patch release** should list bug fixes

### Q: Can I revert a release?

**A:** Yes, but carefully:

1. Delete the tag: `git tag -d vX.Y.Z && git push origin :refs/tags/vX.Y.Z`
2. Delete the GitHub release (via UI or `gh release delete`)
3. Revert the VERSION file commit
4. Update CHANGELOG if needed

**Better approach:** Release a new version that reverts or fixes the issue.

### Q: How do I test a release before going live?

**A:** Use dry-run mode:

```bash
# Test locally
node .github/agents/release.agent.cjs --scope=minor --dry-run

# This will show exactly what would happen without making changes
```

### Q: What about multiple packages in a monorepo?

**A:** The current release agent doesn't support monorepo partial releases yet. This is planned for a future version. For now:

- Use `--scope` to release the entire monorepo
- Or manually tag individual packages

---

## Best Practices

1. **✅ Always validate before release**

   ```bash
   node scripts/validate-version.cjs
   node scripts/validate-changelog.cjs
   ```

2. **✅ Use dry-run for major releases**

   ```bash
   node .github/agents/release.agent.cjs --scope=major --dry-run
   ```

3. **✅ Document breaking changes clearly**
   - Add a "Breaking Changes" section to CHANGELOG
   - Include migration guide
   - Update documentation

4. **✅ Test the release branch**
   - Run all tests: `npm test`
   - Run linting: `npm run lint`
   - Check CI status before merging

5. **✅ Communicate major releases**
   - Announce in team chat
   - Update documentation
   - Notify users/clients

6. **❌ Don't skip versions arbitrarily**
   - Let SemVer increment naturally
   - Only skip if you have a good reason (e.g., alignment with dependencies)

7. **❌ Don't mix scopes**
   - One release should have one clear scope
   - If you have both breaking changes and features, use `major`

---

## Related Documentation

- [Release Process Guide](./RELEASE-PROCESS.md) - Overall release workflow
- [Release Agent Spec](./.github/agents/release.agent.md) - Technical specification
- [Semantic Versioning](https://semver.org/) - Official SemVer specification
- [Keep a Changelog](https://keepachangelog.com/) - Changelog format standard

---

## Support

If you have questions about version scoping:

1. Check this guide first
2. Review the [Release Process Guide](./RELEASE-PROCESS.md)
3. Ask in [GitHub Discussions](https://github.com/orgs/lightspeedwp/discussions)
4. Tag `@maintainers` in your PR for guidance

---

**Last updated:** 2025-11-17  
**Version:** v1.0  
**Maintained by:** LightSpeed Engineering

---

title: "Release Scope Parameter Guide"
version: "v1.0"
last_updated: "2025-11-17"
owners: ["lightspeedwp"]
file_type: "guide"
category: "release-management"
description: "Comprehensive guide for using the --scope parameter in release automation"
tags: ["release", "versioning", "semver", "automation"]

---

# Release Scope Parameter Guide

This guide explains how to use the `--scope` parameter with the LightSpeed release automation system to control semantic version bumping.

## Table of Contents

- [Overview](#overview)
- [Semantic Versioning Primer](#semantic-versioning-primer)
- [The --scope Parameter](#the---scope-parameter)
- [When to Use Each Scope](#when-to-use-each-scope)
- [Examples](#examples)
- [Release Label System](#release-label-system)
- [FAQ](#faq)

---

## Overview

The release agent supports a `--scope` parameter that determines how the version number is incremented during a release. This follows [Semantic Versioning (SemVer)](https://semver.org/) principles.

**Syntax:**

```bash
node .github/agents/release.agent.cjs --scope=<major|minor|patch>
```

---

## Semantic Versioning Primer

Semantic versioning uses a three-part version number: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes that are NOT backward-compatible
- **MINOR**: New features that ARE backward-compatible
- **PATCH**: Bug fixes and improvements that ARE backward-compatible

**Example progression:**

```
1.0.0  →  1.0.1  (patch: bug fix)
1.0.1  →  1.1.0  (minor: new feature)
1.1.0  →  2.0.0  (major: breaking change)
```

---

## The --scope Parameter

### Valid Values

| Scope   | Version Bump        | Use For                                          |
| ------- | ------------------- | ------------------------------------------------ |
| `patch` | `X.Y.Z → X.Y.(Z+1)` | Bug fixes, documentation, minor tweaks           |
| `minor` | `X.Y.Z → X.(Y+1).0` | New features, enhancements (backward-compatible) |
| `major` | `X.Y.Z → (X+1).0.0` | Breaking changes, incompatible API changes       |

### Default Behavior

If `--scope` is not specified, the release agent defaults to **`patch`**.

```bash
# These are equivalent:
node .github/agents/release.agent.cjs
node .github/agents/release.agent.cjs --scope=patch
```

---

## When to Use Each Scope

### Use `--scope=patch` when

✅ Fixing bugs  
✅ Updating documentation  
✅ Refactoring code without changing behaviour  
✅ Performance improvements (non-breaking)  
✅ Dependency updates (minor/patch)  
✅ Accessibility fixes  
✅ Security patches (non-breaking)

**Example changes:**

- "Fix typo in error message"
- "Update README installation instructions"
- "Improve performance of search algorithm"
- "Fix accessibility issue in navigation"

### Use `--scope=minor` when

✅ Adding new features  
✅ Adding new functions/methods (backward-compatible)  
✅ Deprecating functionality (but not removing)  
✅ Adding new configuration options  
✅ Extending existing APIs (non-breaking)  
✅ New WordPress block patterns  
✅ New theme customisation options

**Example changes:**

- "Add dark mode toggle to settings"
- "Add new pattern: Call-to-Action with image"
- "Add support for custom post types"
- "Add new REST API endpoint for search"

### Use `--scope=major` when

⚠️ Removing features or APIs  
⚠️ Changing function signatures  
⚠️ Changing data structures (incompatible)  
⚠️ Requiring PHP/Node version upgrade  
⚠️ Removing deprecated functionality  
⚠️ Changing configuration format  
⚠️ Renaming classes/functions/files

**Example changes:**

- "Remove deprecated `old_api()` function"
- "Change `getUserData()` to require authentication"
- "Upgrade minimum PHP version to 8.1"
- "Rename `config.json` to `app.config.json`"

---

## Examples

### Example 1: Bug Fix Release

**Current version:** `1.2.3`  
**Changes:** Fixed a bug in form validation  
**Command:**

```bash
node .github/agents/release.agent.cjs --scope=patch
```

**Result:** Version becomes `1.2.4`

---

### Example 2: New Feature Release

**Current version:** `1.2.4`  
**Changes:** Added user profile page and settings panel  
**Command:**

```bash
node .github/agents/release.agent.cjs --scope=minor
```

**Result:** Version becomes `1.3.0`

---

### Example 3: Breaking Change Release

**Current version:** `1.3.0`  
**Changes:** Removed old authentication system, requires new OAuth flow  
**Command:**

```bash
node .github/agents/release.agent.cjs --scope=major
```

**Result:** Version becomes `2.0.0`

---

### Example 4: Dry-Run Testing

Test what would happen without making changes:

```bash
# Test a major version bump
node .github/agents/release.agent.cjs --scope=major --dry-run

# Output shows what would happen:
# Version bump: 1.3.0 → 2.0.0
# [DRY-RUN] Would write "2.0.0" to VERSION
# [DRY-RUN] Would update CHANGELOG.md...
```

---

## Release Label System

The release automation system uses GitHub PR labels to determine version bumps automatically:

### Labels

| Label           | Scope | Description                        |
| --------------- | ----- | ---------------------------------- |
| `release:patch` | patch | Bug fixes and minor improvements   |
| `release:minor` | minor | New features (backward-compatible) |
| `release:major` | major | Breaking changes                   |

### How It Works

1. **Manual Workflow**: Use `--scope` parameter when running release agent manually
2. **Automated Workflow**: Release-prep workflow analyses merged PR labels to determine scope
3. **Label Enforcement**: PRs must have exactly one `release:*` label before merging

### Setting Labels

When creating a PR, apply the appropriate `release:*` label:

```bash
# Via gh CLI
gh pr create --label "release:minor" --title "Add user profiles"

# Via GitHub UI
# Add label in the right sidebar of your PR
```

**Important:** Only one `release:*` label should be applied per PR.

---

## FAQ

### Q: What if I'm not sure which scope to use?

**A:** Ask yourself these questions:

1. **Does it break existing code?** → `major`
2. **Does it add new functionality?** → `minor`
3. **Does it just fix or improve?** → `patch`

When in doubt, start with `patch` and consult with maintainers.

### Q: Can I skip version numbers?

**A:** Yes, SemVer allows gaps. For example:

- `1.0.0 → 2.0.0` (skip 1.x.x entirely)
- `1.5.3 → 1.10.0` (skip 1.6.0-1.9.x)

This is fine and sometimes necessary for alignment.

### Q: What about pre-release versions?

**A:** The current release agent doesn't support pre-release versions (alpha, beta, rc) yet. For now, use:

```bash
# Manual pre-release tagging
git tag v2.0.0-beta.1
git push --tags
```

### Q: What if the CHANGELOG doesn't match the scope?

**A:** The release agent will still bump the version as specified by `--scope`, but it's best practice to ensure your CHANGELOG accurately reflects the changes:

- **Major release** should document breaking changes clearly
- **Minor release** should list new features
- **Patch release** should list bug fixes

### Q: Can I revert a release?

**A:** Yes, but carefully:

1. Delete the tag: `git tag -d vX.Y.Z && git push origin :refs/tags/vX.Y.Z`
2. Delete the GitHub release (via UI or `gh release delete`)
3. Revert the VERSION file commit
4. Update CHANGELOG if needed

**Better approach:** Release a new version that reverts or fixes the issue.

### Q: How do I test a release before going live?

**A:** Use dry-run mode:

```bash
# Test locally
node .github/agents/release.agent.cjs --scope=minor --dry-run

# This will show exactly what would happen without making changes
```

### Q: What about multiple packages in a monorepo?

**A:** The current release agent doesn't support monorepo partial releases yet. This is planned for a future version. For now:

- Use `--scope` to release the entire monorepo
- Or manually tag individual packages

---

## Best Practices

1. **✅ Always validate before release**

   ```bash
   node scripts/validate-version.cjs
   node scripts/validate-changelog.cjs
   ```

2. **✅ Use dry-run for major releases**

   ```bash
   node .github/agents/release.agent.cjs --scope=major --dry-run
   ```

3. **✅ Document breaking changes clearly**
   - Add a "Breaking Changes" section to CHANGELOG
   - Include migration guide
   - Update documentation

4. **✅ Test the release branch**
   - Run all tests: `npm test`
   - Run linting: `npm run lint`
   - Check CI status before merging

5. **✅ Communicate major releases**
   - Announce in team chat
   - Update documentation
   - Notify users/clients

6. **❌ Don't skip versions arbitrarily**
   - Let SemVer increment naturally
   - Only skip if you have a good reason (e.g., alignment with dependencies)

7. **❌ Don't mix scopes**
   - One release should have one clear scope
   - If you have both breaking changes and features, use `major`

---

## Related Documentation

- [Release Process Guide](./RELEASE-PROCESS.md) - Overall release workflow
- [Release Agent Spec](./.github/agents/release.agent.md) - Technical specification
- [Semantic Versioning](https://semver.org/) - Official SemVer specification
- [Keep a Changelog](https://keepachangelog.com/) - Changelog format standard

---

## Support

If you have questions about version scoping:

1. Check this guide first
2. Review the [Release Process Guide](./RELEASE-PROCESS.md)
3. Ask in [GitHub Discussions](https://github.com/orgs/lightspeedwp/discussions)
4. Tag `@maintainers` in your PR for guidance

---

**Last updated:** 2025-11-17  
**Version:** v1.0  
**Maintained by:** LightSpeed Engineering
