---
file_type: instructions
title: File Organisation
description: File placement rules and directory structure conventions for organizing code, documentation, tests, and automation across LightSpeedWP repositories.
scope: organization-wide
applyTo: '**'
version: v1.1
last_updated: '2026-05-29'
owners:
- LightSpeedWP Team
tags:
- file-organisation
- repository-structure
- governance
status: active
---

# LightSpeedWP File Organisation Standards

You are a LightSpeedWP repository architect. Follow our file organisation conventions to maintain consistent, navigable, and maintainable repository structure across all projects. Avoid placing files in ad-hoc locations or creating new directory hierarchies without approval.

## Overview

Defines consistent directory structure and file placement conventions for all LightSpeedWP repositories. Ensures developers and automation tools can reliably locate files, understand boundaries, and discover related resources. Applies to all code, documentation, tests, configuration, and automation artefacts.

**What this covers:**

- Standard directory structure for all repository types
- File placement rules for code, docs, tests, automation
- Naming conventions for directories and files
- Special directories (tmp, build, dist, etc.)
- Boundary markers (`.github/`, top-level source folders)

**What this does not cover:**

- Language-specific code organisation (class hierarchies, module structure)
- Project-specific subdirectories (those belong in project README)

## General Rules

- **Predictable placement:** Every file type has a standard home; developers should be able to locate or place files without guessing
- **Shallow hierarchies:** Avoid deeply nested directories; prefer 2-3 levels maximum for source code
- **Clear boundaries:** Use `.github/` for repo metadata and workflows; use project-specific folders (agents/, cookbook/, plugins/, etc.) for portable assets
- **Consistent naming:** Use lowercase, hyphens for multi-word names (never spaces or underscores in directory names)
- **No ad-hoc directories:** Do not create new root-level directories without documenting in CLAUDE.md or README

## Detailed Guidance

### Standard Repository Structure

```
project-root/
├── .github/                          # GitHub-native files (workflows, templates, actions)
│   ├── workflows/                    # CI/CD and automation workflows
│   ├── agents/                       # Spec-based agents (GitHub-native only)
│   ├── instructions/                 # Repo-local Copilot instructions (control-plane-specific)
│   ├── custom-instructions.md        # Copilot instructions for this repo
│   ├── CONTRIBUTING.md               # Contribution guidelines
│   ├── CODE_OF_CONDUCT.md           # Community standards
│   ├── SECURITY.md                   # Security policy
│   └── [other community health files]
│
├── .schemas/                         # JSON schemas (hidden folder, validation definitions)
├── agents/                           # Portable agent specifications (multi-file implementations)
├── cookbook/                         # Recipes, playbooks, implementation guides
├── hooks/                           # Portable hooks and guardrails
├── instructions/                    # Portable instruction files (no .github assumptions)
├── plugins/                         # Installable plugin bundles
├── skills/                          # Self-contained skills with SKILL.md entrypoints
├── workflows/                       # Portable agentic workflows
│
├── docs/                            # Human-facing documentation (e.g., MIGRATION.md)
├── src/                             # Source code (language-specific structure)
├── tests/                           # Test files (mirror src/ structure)
├── scripts/                         # Utility and automation scripts
│
├── .gitignore
├── CLAUDE.md                        # Project instructions and context
├── AGENTS.md                        # AI agent guidelines (org-wide or project-local)
├── README.md                        # Project overview
├── CHANGELOG.md                     # Release history
└── package.json / composer.json     # Project metadata
```

### File Placement Rules

| Content Type | Location | Convention |
|---|---|---|
| CI/CD workflows | `.github/workflows/` | `{purpose}.yml` |
| GitHub templates | `.github/{issue,pull_request,discussion}_template/` | Standard GitHub structure |
| Spec-based agents | `.github/agents/` | `{name}.agent.md` (GitHub-native only) |
| Portable multi-file agents | `agents/` | `{name}-agent/` folder with AGENT.md |
| Repo-local instructions | `.github/instructions/` | `{topic}.instructions.md` (control-plane-specific) |
| Portable instructions | `instructions/` | `{topic}.instructions.md` |
| JSON schemas (validation) | `.schemas/` | `{type}.schema.json` (hidden folder) |
| Portable workflows | `workflows/` | `{name}.md` |
| Recipes/playbooks | `cookbook/` | `{topic}.md` |
| Plugins | `plugins/` | One folder per plugin |
| Skills | `skills/{skill-name}/` | `SKILL.md` at root + implementation |
| Source code | `src/` (or language-specific like `lib/`, `app/`) | Follow language conventions |
| Tests | `tests/` | Mirror `src/` structure |
| Documentation | `docs/` | Hierarchical by topic (e.g., /docs/MIGRATION.md for migration maps) |
| Automation scripts | `scripts/` | Group by purpose (`/maintenance`, `/validation`, etc.) |

### Naming Conventions

- **Directories:** Lowercase, hyphens for separation (`my-feature`, not `MyFeature` or `my_feature`)
- **Markdown files:** Lowercase with hyphens (`coding-standards.md`, not `CodingStandards.md`), except for documentation and governance files in the `docs/` directory, which must use UPPERCASE naming with underscores (e.g., `MIGRATION.md`, `GOVERNANCE_REVISION_LOG.md`)
- **Scripts:** Lowercase with hyphens, explicit extensions (`validate-config.sh`, `build-artifacts.js`)
- **No spaces:** Never use spaces in filenames or directory names

### Special Directories

- **`.github/tmp/`** – Temporary files created during CI/CD; clean up before committing
- **`build/`, `dist/`, `out/`** – Generated artefacts; add to `.gitignore`
- **`node_modules/`, `vendor/`, `.venv/`** – Dependencies; add to `.gitignore`
- **`.github/projects/`** – Active and archived project artefacts; documented in project README

## Examples

**Good:** A new agent placed in `agents/my-agent.agent.md` with clear naming, stored in the portable location, and referenced in project documentation.

**Avoid:** Creating a new root-level folder like `ai-stuff/` or `tmp-work/` without documenting it; placing code in random subdirectories; using CamelCase or underscores in filenames.

## Validation

- ✅ All files are in their standard locations (can be found by pattern and convention)
- ✅ Directory names are lowercase with hyphens
- ✅ No ad-hoc root-level directories without documentation
- ✅ No spaces or special characters in filenames
- ✅ Temporary files are cleaned up before commit

## References

- [CLAUDE.md](../CLAUDE.md) — Project-specific instructions and file boundaries
- [Coding Standards](./coding-standards.instructions.md)
- [Documentation Formats](./documentation-formats.instructions.md)

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
