# Versioning Guidelines

LightSpeedWP projects follow [Semantic Versioning](https://semver.org/) (SemVer) principles.

## Version Format

Version numbers follow the format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Incremented for incompatible API changes
- **MINOR**: Incremented for backwards-compatible functionality additions
- **PATCH**: Incremented for backwards-compatible bug fixes

## Pre-release Versions

Pre-release versions may include additional identifiers:

- `1.0.0-alpha.1`: Alpha release
- `1.0.0-beta.1`: Beta release  
- `1.0.0-rc.1`: Release candidate

## WordPress Compatibility

For WordPress plugins and themes, version numbers should also consider:

- **WordPress Core Version**: Minimum supported WordPress version
- **PHP Version**: Minimum supported PHP version
- **Browser Support**: Target browser compatibility

## Version Control

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

## Release Process

1. **Feature Development**: Work in `feature/*` branches
2. **Integration**: Merge features into `develop` branch
3. **Release Preparation**: Create `release/*` branch from `develop`
4. **Testing**: Thorough testing of the release branch
5. **Release**: Merge to `main` and tag the version
6. **Hotfixes**: Apply critical fixes via `hotfix/*` branches

## Changelog Management

- Maintain a `CHANGELOG.md` file following [Keep a Changelog](https://keepachangelog.com/) format
- Update changelog for each release
- Include sections for Added, Changed, Deprecated, Removed, Fixed, and Security

## WordPress Plugin/Theme Headers

Update version numbers in these files:

- Plugin header comment (`Version:`)
- Theme `style.css` header (`Version:`)
- `readme.txt` (`Stable tag:`)
- `package.json` (`version`)
- `composer.json` (`version`)

## Automation

Consider using tools for version management:

- **npm version**: For Node.js projects
- **Composer**: For PHP projects
- **GitHub Actions**: For automated releases
- **WP-CLI**: For WordPress-specific versioning

## Examples

### Plugin Version Bump

```bash
# Update version in files
npm version patch  # Updates package.json
# Update plugin header, readme.txt manually

# Commit and tag
git add .
git commit -m "Bump version to 1.2.3"
git tag -a v1.2.3 -m "Release version 1.2.3"
git push origin main --tags
```

### Theme Version Bump

```bash
# Update style.css, package.json, functions.php
# Update readme.txt if applicable

git add .
git commit -m "Release version 2.1.0"
git tag -a v2.1.0 -m "Release version 2.1.0"
git push origin main --tags
```

## Best Practices

1. **Always test** before releasing
2. **Document breaking changes** clearly
3. **Maintain backwards compatibility** when possible
4. **Use pre-release versions** for testing
5. **Follow WordPress guidelines** for plugin/theme versioning
6. **Automate version updates** where possible
7. **Communicate changes** to users via changelog and release notes