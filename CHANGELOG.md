# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 25-11-2025

### Added

- Comprehensive branding agent (`branding.agent.js`) for unified header, footer, and badge automation
- Unified labeling agent (`labeling.agent.js`) replacing split status/type/standardization agents
- Extended README management with support for dynamic header/footer insertion and frontmatter validation
- Footer schema configuration (`footer.schema.json`) and header schema for consistent branding
- Enhanced frontmatter validation across all `.md` files in repository
- Support for multiple footer variants with deterministic selection via seeding
- Emoji support in README headings for improved visual hierarchy
- Mermaid diagram preservation in all README updates
- Batch processing capabilities for efficient multi-file updates

### Changed

- Updated all README files with emoji-enhanced headings for better visual hierarchy
- Migrated frontmatter across core documentation to unified `frontmatter.schema.json` standard
- Reorganized `.github/agents/` structure with shared utilities in `includes/` subdirectory
- Consolidated badge management under branding agent (deprecated `badges.agent.js`)
- Unified header/footer handling under branding agent (deprecated `header-footer.agent.js`)
- Standardized YAML frontmatter metadata across all documentation files
- Enhanced README file templates with proper frontmatter structure
- Updated version numbers for all core README files to reflect latest changes

### Deprecated

- `badges.agent.js` - Use `branding.agent.js` instead for unified badge/header/footer management
- `header-footer.agent.js` - Use `branding.agent.js` instead for unified automation

### Documentation

- Added comprehensive branding agent specification in `.github/agents/branding.agent.md`
- Updated unified labeling agent documentation with latest configuration options
- Created detailed README templates for nested project directories
- Enhanced footer-content.json with multiple funky footer variants
- Documented footer schema validation and implementation
- Added examples for frontmatter validation across file types
- Created inline documentation for all agent helper functions

### Fixed

- Corrected frontmatter schema validation errors in documentation files
- Fixed missing `created_date` fields in core README files
- Resolved inconsistent emoji usage across headings
- Fixed footer text alignment and markdown formatting
- Corrected references paths in frontmatter to use relative paths consistently
- Fixed mermaid diagram formatting in README files

### Performance

- Optimized README file updates with batch multi-replace operations
- Improved footer selection performance with deterministic seeding
- Enhanced memory efficiency in branding agent for large file batches

## [0.1.0] - 2025-09-25

### Added

- Initial release of LightSpeed WordPress organization community health files
- GitHub Copilot custom instructions and organization-wide guidelines
- Comprehensive instruction files for WordPress development:
  - `coding-standards.instructions.md` - WordPress coding standards for PHP, JS, CSS
  - `html-template.instructions.md` - Block template and template part guidelines
  - `pattern-development.instructions.md` - Block pattern creation and advanced usage
  - `php-block.instructions.md` - PHP block development and theme setup
  - `playwright-tests.instructions.md` - Browser automation and accessibility testing
  - `theme-json.instructions.md` - Theme.json configuration and design tokens
- AI prompt templates for:
  - `accessibility-review.prompt.md` - Accessibility compliance review
  - `dev-code-review.prompt.md` - Code review and standards verification
  - `pattern-generation.prompt.md` - Block pattern generation assistance
  - `refactor-theme-types.prompt.md` - WordPress theme refactoring guidance
- Issue templates for comprehensive project management:
  - Bug reports, feature requests, documentation requests
  - Performance issues, UX feedback, integration issues
  - Code refactoring, task management, custom instructions proposals
- Pull request templates with WordPress-specific checklists
- VS Code configuration optimized for WordPress development:
  - MCP (Model Context Protocol) auto-start configuration
  - WordPress-specific extensions and settings
  - GitHub Copilot integration with custom instructions
  - Proper file associations for instruction and prompt files
- Example WordPress block structure following best practices
- Comprehensive documentation and README files
- GitHub Actions workflows for issue metrics and labeling
- Saved replies for common support scenarios
- Organization profile README showcasing LightSpeed projects

### Deprecated

- [placeholder]

### Fixed

- Standardized YAML frontmatter across all instruction files
- Corrected indentation and formatting inconsistencies
- Aligned VS Code settings with repository structure
- Removed non-standard configuration keys for better compatibility

### Changed

- Updated author attribution to "LightSpeedWP Team" for consistency
- Standardized related_links format as simple URL lists
- Enhanced MCP configuration for WordPress development context
- Improved file associations and discovery paths for AI tools

### Documentation

- Added comprehensive README files for instructions and prompts
- Created implementation guide for WordPress block development
- Established clear contribution guidelines and coding standards
- Documented VS Code configuration and MCP setup procedures

### Performance

- [placeholder]

### Removed

- [placeholder]

### Security

- Implemented proper input sanitization and output escaping in examples
- Added security guidelines in coding standards
- Established secure development practices in instruction files

## Reference

- [Branching Strategy](.github/BRANCHING_STRATEGY.md): Org-wide branch naming, merge discipline, and automation mapping.
- [CHANGELOG.md](./CHANGELOG.md): Changelog format, release notes, and versioning.
- [CONTRIBUTING.md](./CONTRIBUTING.md): Contribution guidelines, templates, coding standards.
- [AUTOMATION_GOVERNANCE.md](.github/AUTOMATION_GOVERNANCE.md): Org-wide automation, branching, labeling, and release strategy.
- [Org-wide Issue Labels](.github/ISSUE_LABELS.md): Default labels and usage guidance.
- [Pull Request Labels](.github/PR_LABELS.md): PR classification and automation standards.
- [Issue Types Guide](.github/ISSUE_TYPES.md): Classification and usage of issue types.
