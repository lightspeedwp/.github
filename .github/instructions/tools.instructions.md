---
file_type: "instructions"
title: "Tools and Configuration Instructions"
description: "Standard format for documenting tool configurations, dependencies, and integration patterns"
scope: "repo-local"
version: "v1.0"
last_updated: "2026-05-29"
owners: ["LightSpeed Team"]
tags: ["tools", "configuration", "documentation", "setup", "automation"]
applyTo: ["docs/config/**/*.md", "docs/tools/**/*.md"]
status: "active"
---

# Tool Configuration and Documentation Instructions

Document tools, configurations, and integrations for maintainability and onboarding. Each tool should have clear setup instructions and configuration options.

## Tool Documentation Structure

### Frontmatter

- `title` — Tool name and purpose
- `description` — One-sentence summary
- `version` — Latest version or version range
- `scope` — Where tool is used

### Content Sections

1. **Overview** — What the tool does and why it's used
2. **Installation** — How to install or enable
3. **Configuration** — Config files and key options
4. **Usage** — Common commands or workflows
5. **Troubleshooting** — Common issues and solutions
6. **Related Tools** — Other tools that integrate or complement

## Configuration File Documentation

For tools with config files (`.eslintrc.json`, `prettier.config.js`, etc.):

1. **Config Location** — Where file lives in repo
2. **Current Values** — Documented purpose of each setting
3. **Defaults vs. Custom** — What we override and why
4. **Updates** — How to safely modify configuration
5. **Validation** — How to test configuration changes

## Best Practices

- Keep documentation current with actual tool versions
- Include links to official documentation
- Provide examples of common configurations
- Document environment variables and secrets (without exposing values)
- Include troubleshooting section
- Link to related tools and workflows

## Configuration Standards

- One tool = one documentation file
- Name file after tool or config (e.g., `eslint.md`, `prettier.md`)
- Use code blocks for configuration examples
- Keep security-sensitive values out of documentation

---

## Related Files

- [automation.instructions.md](./automation.instructions.md) — Tool automation and workflow integration
- [coding-standards.instructions.md](./coding-standards.instructions.md) — Standards that tools enforce

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
