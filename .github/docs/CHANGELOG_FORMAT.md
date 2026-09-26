# CHANGELOG.md Format Requirements

**Standard**: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)

**Applies to**: `{agent}/CHANGELOG.md` in all agents

---

## Format Specification

### File Structure

```markdown
# Changelog

All notable changes to this project are documented in this file.

## [1.1.0] - 2026-09-20

### Added
- Feature description (#PR-number)
- Another feature

### Changed
- Behavior change description

### Fixed
- Bug fix description

### Removed
- Deprecated feature

### Security
- Security fix description

---

## [1.0.0] - 2026-09-18

### Added
- Initial release
```

### Version Format

- **Versions**: Use [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH)
  - MAJOR: Breaking changes
  - MINOR: New features (backward compatible)
  - PATCH: Bug fixes (backward compatible)
- **Example**: `1.2.3` or `0.1.0`

### Date Format

- **ISO 8601**: `YYYY-MM-DD`
- **Example**: `2026-09-18`

### Section Order

Each version MUST include relevant sections in this order:

1. **Added** - New features
2. **Changed** - Changes in existing functionality
3. **Fixed** - Bug fixes
4. **Removed** - Removed features/deprecated items
5. **Security** - Security fixes and updates

Omit empty sections.

### Entry Format

Each entry should be concise and reference associated PR/issue:

```markdown
- Description of change (#1234)
- Another change
- Breaking: Detail the breaking change and migration path
```

**Examples:**

```markdown
### Added
- Support for async handlers (#567)
- New `verbose` configuration option (#568)

### Changed
- Improved error messages for clarity (#569)

### Fixed
- Memory leak in skill processing (#570)

### Removed
- Deprecated `oldMethod()` — use `newMethod()` instead (#571)

### Security
- Patched XSS vulnerability in template rendering (#572)
```

---

## Validation Rules

**CI validates**:

1. ✅ Valid Markdown syntax
2. ✅ Versions in descending order
3. ✅ Versions match semver pattern
4. ✅ Dates in ISO 8601 format
5. ✅ Each version has at least one entry
6. ✅ No draft sections (`[UNRELEASED]` only at top if present)
7. ✅ PR/Issue references are formatted correctly

---

## Best Practices

### ✅ DO

- **Describe changes clearly**: "Fixed memory leak in agent startup" (not "Fixed bug")
- **Include PR/issue numbers**: For traceability
- **Group related changes**: Similar fixes together
- **Update before release**: Include all changes since last version
- **Be specific**: "Added timeout configuration" (not "Added stuff")

### ❌ DON'T

- **Use first person**: "We fixed" → "Fixed"
- **Reference commits**: Use PR/issue numbers instead
- **Break semver**: Only bump MAJOR for breaking changes
- **Change past entries**: Append new entries at top
- **Skip versions**: No version jumps without justification

---

## Example: Complete CHANGELOG.md

```markdown
# Changelog

All notable changes to this agent are documented here.

## [2.0.0] - 2026-10-15

### Added
- Support for parallel skill execution (#1089)
- New `concurrency` option for performance tuning (#1089)

### Changed
- Refactored agent initialization for better error handling (#1090)
- Improved logging output format (#1091)

### Fixed
- Memory leak when processing large inputs (#1092)
- Timeout not being respected in nested calls (#1093)

### Removed
- Deprecated `sync` mode — use async mode only (#1088)
- Old configuration format `agent.old.json` — migrate to `default.json` (#1087)

### Security
- Patched injection vulnerability in skill parameter handling (#1094)

---

## [1.1.0] - 2026-09-28

### Added
- Configuration file support (#1000)
- Error recovery for transient failures (#1001)

### Fixed
- Missing type exports (#1002)

---

## [1.0.0] - 2026-09-18

### Added
- Initial agent release
- Core skill execution engine
- Support for async/await workflows
```

---

## Related

- [Agent Folder Structure](AGENT_FOLDER_STRUCTURE.md)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
