## [Unreleased]

### Added

- **Agent standardization**: Completed multi-provider configuration for prd-factory-planner-agent
  - AGENT.md metadata file with complete frontmatter
  - Provider-specific configs: claude/, copilot/, openai/, shared/
  - Provider-agnostic core-prompt.md with behavioral guidelines
  - Skills audit report documenting findings for all 16 agents
  - Comprehensive 8-phase refactoring plan (GitHub issue #1197)

### Changed

- Updated checksums.sha256 for all three configuration agents (prd-factory-planner, tour-operator-config, woo-config)
- Aligned agent/provider metadata across all 16 agents for multi-provider support

### Fixed

- Improved consistency in AGENT.md metadata across incomplete agents
- Documented path discrepancies in skills manifests for future remediation
