# Changelog

All notable changes to this repository are documented in this file.

## [0.1.0] - 2026-04-08

### Added
- Initial skills toolkit under `.github/skills/` with shared usage guidance and docs.
- Spacing migration tooling and documentation:
  - `spacing-mapper.cjs`
  - `SPACING-MIGRATION.md`
  - `SPACING-MAPPER-USAGE.md`
- Inc folder formatter tooling and documentation:
  - `inc-formatter.cjs`
  - `INC-FORMATTER.md`
  - `INC-FORMATTER-BUGFIX-REPORT.md`
- WordPress Block Pattern Generator skill documentation and guide:
  - `wordpress-block-pattern-generator.md`
  - `wordpress-block-pattern-generator/SKILL.md`
- WordPress Block Pattern Validator skill, validator script, and docs:
  - `wordpress-block-pattern-validator/SKILL.md`
  - `wordpress-block-pattern-validator/README.md`
  - `wordpress-block-pattern-validator/validate-patterns.cjs`
- WordPress Theme JSON Mapper skill and reference docs:
  - `wordpress-theme-json-mapper/SKILL.md`
  - `wordpress-theme-json-mapper/README.md`
- New skill for modularising WordPress theme JSON into preset folders:
  - `theme-json-to-preset-folders/SKILL.md`
- Refactor report artifact:
  - `bin/footer-sections-refactor-report.md`

### Changed
- Updated `.github/skills/README.md` to include the new Theme JSON to Preset Folders skill.
- Enhanced WordPress Block Pattern Validator rules and documentation to cover:
  - font family validation behaviour
  - font size class validation
  - non-WordPress comment detection
  - navigation-related checks
  - background image attribute handling
  - button style class placement checks
