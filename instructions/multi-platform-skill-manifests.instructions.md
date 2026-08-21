---
file_type: instructions
title: Multi-Platform Skill Manifests
description: Rules for authoring and maintaining per-skill platform metadata and agent YAML manifests for cross-platform reusability.
scope: organization-wide
applyTo: skills/**
version: v1.0
last_updated: '2026-08-21'
owners:
  - LightSpeedWP Team
tags:
  - skills
  - manifest
  - multi-platform
  - governance
status: active
---

# Multi-Platform Skill Manifests

You are a LightSpeedWP skill architect. Follow our manifest standards to ensure skills are discoverable, portable, and compatible across multiple platforms (Claude Code, web, IDE extensions). Avoid platform-specific logic in shared skill files unless explicitly required.

## Overview

Defines metadata and manifest specifications for portable skills that work across multiple platforms and environments. Ensures skills include clear platform compatibility info, agent specifications, and resource declarations. Applies to all skills in the `skills/` directory.

**What this covers:**

- SKILL.md entrypoint and structure
- Agent specification formats (YAML frontmatter)
- Platform compatibility matrices
- Agent configuration schemas
- Resource declarations and dependencies

**What this does not cover:**

- Implementation details for language-specific skill code
- Platform-specific configuration (stored in platform extension folders)

## General Rules

- **Single source of truth:** Core skill documentation lives in SKILL.md at the skill root
- **Platform detection:** Agent manifests declare supported platforms (Claude Code CLI, web, VS Code, JetBrains, etc.)
- **Portable code:** Avoid platform-specific conditionals in shared skill files; keep those in platform branches
- **Manifest validity:** All YAML frontmatter must validate against agent configuration schema
- **Version tracking:** Skills must declare version and last_updated fields; increment on meaningful changes

## Detailed Guidance

### Skill Directory Structure

```
skills/my-skill/
├── SKILL.md                          # Skill overview and entrypoint
├── agent.yaml                        # Agent configuration (platform-agnostic)
├── implementations/
│   ├── claude-code-cli/              # CLI-specific implementation
│   ├── claude-code-web/              # Web-specific implementation
│   └── vs-code/                      # IDE extension-specific implementation
├── docs/
│   ├── getting-started.md            # User guide
│   ├── api-reference.md              # API or tool documentation
│   └── examples.md                   # Concrete examples
└── tests/                            # Test cases (language-specific)
```

### SKILL.md Entrypoint

Every skill must have a `SKILL.md` file at its root with:

1. **Title and description** – What does this skill do?
2. **Platform compatibility** – Which platforms are supported?
3. **Installation** – How to install on each platform
4. **Quick start** – Minimal working example
5. **API/usage** – What functions, commands, or tools does it expose?
6. **Configuration** – Required and optional settings
7. **Troubleshooting** – Common issues and solutions
8. **References** – Links to agent specs, docs, examples

### Agent Manifest (agent.yaml)

```yaml
name: my-skill-name
version: v1.0
description: What this skill does
platforms:
  - claude-code-cli          # Claude Code CLI tool
  - claude-code-web          # Claude Code web app
  - vs-code                  # VS Code extension
  - jetbrains                # JetBrains IDEs
author: LightSpeedWP Team
license: GPL-3.0 or commercial
tags:
  - category
  - domain
config:
  required:
    - setting1
    - setting2
  optional:
    - setting3: "default value"
dependencies:
  - nodejs: "18+"
  - python: "3.9+"
endpoints:
  - name: getData
    description: Fetch data from the skill
    inputs: [param1, param2]
    output: structured data
```

### Platform Compatibility Declaration

Every manifest must declare which platforms are supported:

| Platform | Notation | Notes |
|---|---|---|
| Claude Code CLI | `claude-code-cli` | Works with `claude code` command |
| Claude Code Web | `claude-code-web` | Works in web.claude.ai |
| VS Code | `vs-code` | Via VS Code extension |
| JetBrains | `jetbrains` | PyCharm, IntelliJ, WebStorm, etc. |
| GitHub Copilot | `github-copilot` | Via GitHub's extension |

## Examples

**Good:** A skill with SKILL.md at root, agent.yaml declaring platform support, and platform-specific implementations in separate branches.

**Avoid:** Platform-specific code mixed in shared implementation; missing SKILL.md or agent manifest; undeclared platform dependencies.

## Validation

- ✅ Every skill has SKILL.md at root with all required sections
- ✅ agent.yaml exists and validates against schema
- ✅ Platform compatibility is declared and accurate
- ✅ All referenced dependencies are documented
- ✅ Installation instructions work for each declared platform

## References

- [File Organisation](./file-organisation.instructions.md)
- [Coding Standards](./coding-standards.instructions.md)
- [Agent Specification](./agent-spec.instructions.md)

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
