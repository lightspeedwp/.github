# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with development tooling configurations
- EditorConfig for consistent code formatting
- Git configuration files (.gitignore, .gitattributes)
- NPM configuration (.npmrc)
- JavaScript/TypeScript linting (ESLint) with WordPress standards
- CSS/SCSS linting (Stylelint) with WordPress standards  
- PHP linting (PHPCS) with WordPress Coding Standards and PHPCompatibilityWP
- Markdown linting configuration
- API linting with Spectral
- Shell script linting with ShellCheck
- Composer configuration with development dependencies
- Versioning and changelog documentation
- GitHub saved replies template
- CI workflow for automated linting

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release of LightSpeedWP defaults repository
- Complete development tooling setup
- Template directories for different project types

---

## Release Template

Use this template when adding new releases:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features or capabilities

### Changed
- Changes in existing functionality

### Deprecated
- Features that will be removed in upcoming releases

### Removed
- Features removed in this release

### Fixed
- Bug fixes

### Security
- Security improvements or vulnerability fixes
```

## Guidelines

- Keep an "Unreleased" section at the top
- List releases in reverse chronological order (newest first)
- Include dates in ISO 8601 format (YYYY-MM-DD)
- Group changes by type: Added, Changed, Deprecated, Removed, Fixed, Security
- Write for humans, not machines
- Don't duplicate commit messages - summarize the impact
- Link to issues and pull requests when relevant