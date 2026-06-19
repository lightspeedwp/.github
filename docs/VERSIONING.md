# Versioning Guidelines

<!-- BADGES-START -->

[![changelog](https://github.com/lightspeedwp/.github/actions/workflows/changelog.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)

<!-- BADGES-END -->

LightSpeedWP projects follow [Semantic Versioning](https://semver.org/) (SemVer) principles.

---

## Canonical Version Source

- The **root-level `VERSION` file** is the single source of truth for the current project version.
- The `VERSION` file must contain only the version string in `X.Y.Z` or [semver.org](https://semver.org/) compatible format (e.g., `1.2.3`, `2.0.0-beta.1`).

---

## Version Field in Frontmatter

- All files that include a `version` field in their YAML frontmatter **must set it to exactly match** the contents of the root `VERSION` file.
- This applies to agent specs, prompt files, instructions, documentation, and any config files using the `version` field.
- When the project version changes (the `VERSION` file is updated), update all relevant `version` fields in tracked files to match.

**Example:**

```yaml
---
version: "1.2.3" # Must match contents of root VERSION file
---
```

**Validation:**
Use scripts or CI to ensure all frontmatter `version` fields remain synchronized with the root `VERSION` file.

---

## Version Format

Version numbers follow the format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Incremented for incompatible API changes
- **MINOR**: Incremented for backwards-compatible functionality additions
- **PATCH**: Incremented for backwards-compatible bug fixes

**Pre-release Versions:**
May include identifiers:

- `1.0.0-alpha.1`
- `1.0.0-beta.1`
- `1.0.0-rc.1`

---

## WordPress Compatibility

- Plugins/themes should also specify minimum supported WordPress and PHP versions, and note browser compatibility as needed.

---

## Version Control Practices

### Git Tags

- Create annotated tags for releases: `git tag -a v1.0.0 -m "Release version 1.0.0"`
- Use the `v` prefix for all version tags
- Push tags to remote: `git push origin --tags`

### Branch Strategy

- `main/master`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature development branches
- `hotfix/*`: Emergency fixes for production
- `release/*`: Preparation for new releases

---

## Release Process

1. **Feature Development**: Work in `feature/*` branches
2. **Integration**: Merge features into `develop`
3. **Release Preparation**: Create `release/*` branch from `develop`
4. **Testing**: Test the release branch
5. **Release**: Merge to `main` and tag the version
6. **Hotfixes**: Apply fixes via `hotfix/*` branches

---

## Changelog Management

- Maintain a `CHANGELOG.md` using [Keep a Changelog](https://keepachangelog.com/) format.
- Update changelog for each release, including sections for Added, Changed, Deprecated, Removed, Fixed, Security.

---

## WordPress Plugin/Theme Headers

Update version numbers in:

- Plugin header comment (`Version:`)
- Theme `style.css` header (`Version:`)
- `readme.txt` (`Stable tag:`)
- `package.json` (`version`)
- `composer.json` (`version`)

---

## Automation

Consider tools for version management:

- **npm version**: For Node.js projects
- **Composer**: For PHP projects
- **GitHub Actions**: For automated releases and version checks
- **WP-CLI**: For WordPress-specific versioning

---

## Example: Root VERSION File

```
1.2.3
```

## Example: Plugin Version Bump

```bash
# Update version in files
npm version patch  # Updates package.json
# Update plugin header, readme.txt, and frontmatter versions manually

# Commit and tag
git add .
git commit -m "Bump version to 1.2.3"
git tag -a v1.2.3 -m "Release version 1.2.3"
git push origin main --tags
```

---

## Best Practices

1. **Always test** before releasing
2. **Document breaking changes** clearly
3. **Maintain backwards compatibility** where possible
4. **Use pre-release versions** for testing
5. **Follow WordPress and SemVer guidelines**
6. **Automate version updates and verification** whenever possible
7. **Communicate changes** to users via changelog and release notes

---

## Alternative: Per-File Versioning Strategy (Experimental)

> **Note**: This is an alternative versioning approach for documentation and configuration files. The unified versioning strategy above remains the recommended default.

### Overview

For documentation-heavy repositories (like `.github`), individual files may evolve independently. This strategy allows per-file semantic versioning whilst maintaining coordination with the repository version.

### Rules

- **Repository version** (`/VERSION`): Uses `X.Y.0` format for coordinated releases
- **File version** (`version:` in frontmatter): Independent `X.Y.Z` versioning per file
- **Guardrail**: A file's minor version (`X.Y`) **must not exceed** the repository's minor version

### Version Bump Types

#### Patch Bump (`X.Y.Z` → `X.Y.Z+1`)

- Content edits, typo fixes, clarifications
- No schema or structural changes
- Safe for all consumers

#### Minor Bump (`X.Y.Z` → `X.Y+1.0`)

- Schema-related key changes in that file
- New required fields or breaking changes for agents
- Must not exceed repository minor version

### Examples

**Scenario 1: Edit instruction prose**

- Current: `version: 0.1.3`
- Action: Fix typos, clarify instructions
- Result: `version: 0.1.4` (patch bump)

**Scenario 2: Add required frontmatter field**

- Current: `version: 0.2.5`, Repo: `0.2.0`
- Action: Add new required `applyTo` field
- Result: Cannot bump to `0.3.0` (would exceed repo `0.2.0`)
- Must wait for repo bump to `0.3.0` first

**Scenario 3: Coordinated release**

- Repo bumps: `0.2.0` → `0.3.0`
- Files with breaking changes: bump to `0.3.0`
- Files with only content edits: remain at `0.2.x` or bump patch

### Guardrails

A file **must not** have a minor version exceeding the repository minor version:

- ✓ File `0.2.8` with Repo `0.2.0` (valid)
- ✓ File `0.2.0` with Repo `0.3.0` (valid)
- ✗ File `0.3.0` with Repo `0.2.0` (invalid - exceeds repo minor)

### Automation

Use `scripts/versioning/bump-file-version.js` for single or bulk version bumps:

```bash
# Bump patch version of a single file
node scripts/versioning/bump-file-version.js ../instructions/coding-standards.instructions.md patch

# Bump minor version (with guardrail check)
node scripts/versioning/bump-file-version.js .github/prompts/review.prompt.md minor

# Bulk bump patch versions
node scripts/versioning/bump-file-version.js --bulk ".github/instructions/**/*.md" patch
```

The script will:

- Automatically update the `version` field
- Update `last_updated` to current date
- Enforce the guardrail (file minor ≤ repo minor)
- Exit with error if guardrail would be violated

### CI Validation

Add a CI check to ensure file versions don't exceed repository version:

```yaml
- name: Validate file versions
  run: |
    REPO_VERSION=$(cat VERSION)
    node scripts/versioning/validate-versions.js --repo-version $REPO_VERSION
```

### When to Use

**Use per-file versioning when:**

- Documentation/instructions evolve independently
- Fine-grained change tracking is valuable
- Multiple maintainers update different files

**Use unified versioning when:**

- Coordinated releases are preferred
- Simplicity is more important than granularity
- All files change together

---

## Automation Scripts

### Available Scripts

#### `scripts/versioning/bump-file-version.cjs`

Bump individual or bulk file versions with guardrails:

```bash
# Single file
node scripts/versioning/bump-file-version.cjs <file> [patch|minor]

# Bulk update
node scripts/versioning/bump-file-version.cjs --bulk "<pattern>" [patch|minor]

# Help
node scripts/versioning/bump-file-version.cjs --help
```

#### `scripts/maintenance/fix-references.cjs`

Validate and fix broken reference links in frontmatter:

```bash
# Scan and fix all references
node scripts/maintenance/fix-references.cjs

# Show current fix map
node scripts/maintenance/fix-references.cjs --fix-map

# Help
node scripts/maintenance/fix-references.cjs --help
```

### Integration with CI/CD

Consider adding these scripts to GitHub Actions workflows for:

- Pre-commit hooks (validate versions before commit)
- Pull request checks (ensure references are valid)
- Release automation (bulk bump versions on release)

---

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
