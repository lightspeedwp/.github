# Versioning Guidelines

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
version: "1.2.3"  # Must match contents of root VERSION file
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
