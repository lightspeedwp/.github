# Changelog

All notable changes to the {agent-name} agent will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New feature description

### Changed

- Behaviour change description

### Deprecated

- Deprecated feature description

### Removed

- Removed feature description

### Fixed

- Bug fix description

### Security

- Security fix description

## [1.0.0] - {date}

### Added

- Initial release of {agent-name} agent
- Core functionality for [main capability 1]
- Core functionality for [main capability 2]
- Comprehensive test suite with 80%+ coverage
- Documentation and examples

### Dependencies

- Skill: {skill-id}
- Dependency: {other-dependency}

---

## Version History Format

Each release should include:

- **Version Number**: Following semantic versioning (MAJOR.MINOR.PATCH)
- **Release Date**: YYYY-MM-DD format
- **Changes**: Categorized as Added, Changed, Deprecated, Removed, Fixed, Security
- **Dependencies**: List new or updated dependencies
- **Breaking Changes**: Clearly marked and documented

## Deprecation Policy

When a feature is deprecated:

1. Mark as deprecated in CHANGELOG.md with version introduced
2. Update AGENT.md to note deprecation
3. Provide migration path in documentation
4. Support deprecated feature for minimum 2 versions
5. Remove in next major version bump

## Release Process

1. Update CHANGELOG.md with all changes
2. Update version in package.json and AGENT.md
3. Tag release in git: `git tag -a v{version}`
4. Create release PR
5. Merge to develop and tag main

---

**Maintained By**: @{maintainer}
