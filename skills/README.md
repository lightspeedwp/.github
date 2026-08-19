---
authors:
- LightSpeed Team
description: Ownership index for self-contained LightSpeed AI skills with SKILL.md entrypoints and cross-platform support.
domain: governance
file_type: documentation
last_updated: "2026-08-19"
license: GPL-3.0
maintainer: LightSpeed Team
stability: stable
tags:
- skills
- ai-ops
- automation
- cross-platform
title: Portable AI Skills
version: v0.3.2
---

# Portable AI Skills

This folder contains reusable, self-contained skills that extend Claude Code, GitHub Actions, and other automation platforms. Each skill is bundled with comprehensive documentation via its `SKILL.md` entrypoint.

## Overview

Portable skills are focused, single-purpose tools that:

- **Solve specific problems** – One clear task per skill
- **Work across platforms** – Deploy to Claude Code, GitHub, Slack, etc.
- **Include documentation** – Every skill has a `SKILL.md` guide
- **Are testable** – Each skill includes validation logic
- **Follow standards** – Comply with LightSpeed coding standards

## Available Skills

| Skill | Status | Purpose |
|-------|--------|---------|
| [lightspeed-frontmatter-audit](./lightspeed-frontmatter-audit/SKILL.md) | stable | Audit and validate YAML frontmatter in documentation |
| [lightspeed-label-governance](./lightspeed-label-governance/SKILL.md) | stable | Manage and enforce label governance rules |
| [lightspeed-pr-review](./lightspeed-pr-review/SKILL.md) | stable | Automated PR review and feedback |

## Skill Structure

Every skill follows this directory structure:

```
skill-name/
├── SKILL.md                    # Main documentation & entrypoint
├── README.md                   # Overview and quick start
├── index.js (or main file)     # Skill implementation
├── spec.json                   # Metadata and configuration
└── tests/                      # Test suite
    ├── basic.test.js
    └── integration.test.js
```

## Using Skills

### In Claude Code

Enable skills in your Claude Code settings or via CLI:

```bash
# Load a skill at runtime
claude code --skill lightspeed-pr-review

# Use skill-specific command
/lightspeed-pr-review --check-all
```

### In GitHub Actions

Reference skills in workflows:

```yaml
- name: Run skill
  uses: lightspeedwp/.github/skills/lightspeed-label-governance@main
  with:
    repository: my-org/my-repo
    enforce: true
```

### In Project Configuration

Enable skills in `.claude/settings.json`:

```json
{
  "skills": {
    "enabled": true,
    "active": [
      "lightspeed-pr-review",
      "lightspeed-frontmatter-audit"
    ]
  }
}
```

## Skill Metadata

See [SKILL_REGISTRY.json](./SKILL_REGISTRY.json) for canonical metadata on all skills, including:

- Version history
- Platform compatibility
- Dependencies
- Performance metrics

## Creating New Skills

To create a new skill:

1. Create a new directory with a descriptive name
2. Add a comprehensive `SKILL.md` documentation file
3. Implement the skill in your language of choice
4. Include a `spec.json` with metadata
5. Write tests for your skill
6. Register in `SKILL_REGISTRY.json`
7. Submit a PR for review

### SKILL.md Template

Every skill's `SKILL.md` should include:

- **Overview** – What the skill does in one sentence
- **When to Use** – Scenarios and triggers
- **Getting Started** – Quick start guide
- **Usage Examples** – Real-world examples
- **Options & Configuration** – Customisation points
- **Error Handling** – What happens when things fail
- **Limitations** – What the skill cannot do
- **Testing** – How to validate the skill works

See [design-md-generator](./design-md-generator/SKILL.md) for a complete example.

## Skill Registry Format

The `SKILL_REGISTRY.json` maintains metadata for all skills:

```json
{
  "skills": [
    {
      "id": "skill-id",
      "name": "Display Name",
      "version": "v1.0.0",
      "status": "stable",
      "path": "skill-id/SKILL.md",
      "platforms": ["claude-code", "github", "slack"],
      "dependencies": []
    }
  ]
}
```

## Cross-Platform Support

Skills can declare support for multiple platforms in their `spec.json`:

```json
{
  "platforms": [
    "claude-code",
    "github-actions",
    "slack",
    "manual"
  ]
}
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for full contribution guidelines. Key points:

- Follow [Coding Standards](../instructions/coding-standards.instructions.md)
- Include comprehensive tests
- Document thoroughly in `SKILL.md`
- Get peer review before merging
- Update `SKILL_REGISTRY.json`

## Related Documentation

- [Cross-Platform Skill YAML Spec](../docs/CROSS_PLATFORM_SKILL_YAML_SPEC.md) – Technical specification for skill YAML
- [AI Operations Standards](../instructions/ai-operations-unified.instructions.md) – AI automation and operations standards
- [AGENTS.md](../AGENTS.md) – Global AI rules

---

---

*🎼 Orchestrated automation — where intelligence meets operations*
