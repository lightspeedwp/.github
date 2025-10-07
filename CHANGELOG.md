# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

### Security
- Implemented proper input sanitization and output escaping in examples
- Added security guidelines in coding standards
- Established secure development practices in instruction files
