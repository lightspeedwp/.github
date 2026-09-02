---
file_type: documentation
title: Agent Naming Conventions
description: Standards for naming agent folders, spec files, and related assets
created_date: "2026-08-29"
last_updated: "2026-08-29"
status: "active"
domain: "governance"
stability: "stable"
tags: ["agents", "naming-conventions", "standards", "reference"]
owners: ["lightspeedwp/maintainers"]
---

# Agent Naming Conventions

## Overview

This document establishes naming conventions for agents to ensure consistency and discoverability across the `.github/agents/` directory.

## Spec File Naming

### Rule: `{name}.agent.md`

**Format:** Lowercase, hyphens for multi-word names, `.agent.md` extension

**Examples:**

- `adr.agent.md` ✓
- `linting.agent.md` ✓
- `task-planner.agent.md` ✓
- `client-website-discovery.agent.md` ✓
- `prompt-engineer.agent.md` ✓

### Naming Pattern Discovery

**From implementation folder name:**

1. Remove `-agent` or `-agent-` suffix
2. Remove any duplicate words
3. Convert to lowercase
4. Use hyphens for word separation
5. Add `.agent.md` extension

**Examples:**

| Folder Name | Pattern | Spec File |
|---|---|---|
| `adr-generator` | Remove nothing (no -agent) | `adr-generator.agent.md` or `adr.agent.md` |
| `linting-agent` | Remove `-agent` | `linting.agent.md` ✓ |
| `task-planner-agent` | Remove `-agent` | `task-planner.agent.md` ✓ |
| `chat-closure-agent` | Remove `-agent` | `chat-closure.agent.md` ✓ |
| `client-website-discovery-assistant-agent` | Remove `-agent` | `client-website-discovery-assistant.agent.md` ✓ |
| `prd-factory-planner-agent` | Remove `-agent` | `prd-factory-planner.agent.md` ✓ |

### Special Cases

**Mode Specs:**

```
mode-thinking.agent.md
mode-prd.agent.md
mode-demonstrate-understanding.agent.md
mode-document-reviewer.agent.md
```

These are operating modes, not standalone agents. Consider placing in `modes/` subdirectory.

## Implementation Folder Naming

### Rule: `{name}-agent` or `{name}`

Most agents follow the pattern `{name}-agent/`, with some exceptions:

**Consistent pattern (with `-agent` suffix):**

- `adr-generator` ⚠️ Exception (missing `-agent` suffix)
- `linting-agent` ✓
- `meta-agent` ✓
- `task-planner-agent` ✓
- `task-researcher-agent` ✓
- `testing-agent` ✓

**Exceptions (no suffix):**

- `adr-generator` — Generator suffix instead
- `prompt-engineer` — No agent suffix
- `release` — Short name
- `wordpress` — No agent suffix
- `changelog` — No agent suffix

### Recommendation

**Standardize to:** `{name}-agent` format for all new agents

**Rationale:**

- Clear that it's an agent implementation
- Distinguishes from configuration files or utilities
- Consistent across most existing agents

**Current exceptions (20 agents, 72% missing specs):**

| Exception Type | Count | Examples |
|---|---|---|
| `-agent` suffix ✓ | 17 | `linting-agent`, `task-planner-agent` |
| No suffix | 11 | `adr-generator`, `wordpress`, `release`, etc. |

## File Organization Within Agent Folders

### Standard Structure

```
agents/{name}-agent/
├── AGENT.md                    # Agent definition (entry point)
├── README.md                   # Overview and quick start
├── config/                     # Configuration files
│   ├── schema.json             # JSON schema for validation
│   └── defaults.json           # Default values
├── examples/                   # Example configurations
│   ├── example-1.json
│   └── example-2.json
├── skills/                     # Reusable skills/modules
│   ├── skill-1.js
│   ├── skill-1.md              # Skill documentation
│   └── skill-2.js
├── templates/                  # Templates (for content-generating agents)
│   ├── standard.md
│   └── advanced.md
├── tests/                      # Test files
│   ├── config.test.js
│   └── templates.test.js
├── providers/                  # Provider-specific implementations
│   ├── claude/
│   ├── copilot/
│   └── openai/
└── docs/                       # Extended documentation
    ├── INSTALLATION.md
    ├── CONFIGURATION.md
    └── ARCHITECTURE.md
```

### Naming Rules for Agent Content

| File/Folder | Naming Rule | Examples |
|---|---|---|
| Agent definition | `AGENT.md` or `SKILL.md` | AGENT.md ✓ |
| Overview | `README.md` | README.md ✓ |
| Configuration schema | `{name}-config.schema.json` | `adr-config.schema.json` ✓ |
| Configuration defaults | `defaults.json` | defaults.json ✓ |
| Configuration documentation | `{name}-config.definitions.md` | `adr-config.definitions.md` ✓ |
| Skill files | `{skill-name}.js` + `{skill-name}.md` | `adr-discovery.js` + `adr-discovery.md` ✓ |
| Template files | `{template-type}.md` | `standard.md`, `security.md` ✓ |
| Test files | `{component}.test.js` | `config-loader.test.js` ✓ |
| Provider files | Provider name in path | `providers/claude/`, `providers/openai/` ✓ |

## Frontmatter Conventions

### Agent Spec Frontmatter

```yaml
---
file_type: agent
name: "Display Name"
description: "One-line description"
category: "category"
tags: ["tag1", "tag2"]
status: "active"
implementation: "agents/{folder-name}/"
implementation_entry: "AGENT.md"  # or SKILL.md
version: "v1.0"
author: "LightSpeed"
maintainer: "Your Name"
owners: ["lightspeedwp/maintainers"]
---
```

### Agent Implementation Frontmatter

```yaml
---
file_type: agent
name: agent-name
title: Display Name
description: One-line description
version: 1.0.0
status: active
category: category
maintainer: Name
owners:
  - lightspeedwp/maintainers
tags:
  - tag1
  - tag2
capabilities:
  - capability1
  - capability2
permissions:
  - read
  - write
---
```

## Consistency Checklist

When creating or updating agents, verify:

### Spec File Checklist

- [ ] Filename: `{name}.agent.md` (lowercase, hyphens)
- [ ] Frontmatter: `file_type: agent`
- [ ] Name field matches implementation folder name
- [ ] Implementation field points to correct folder
- [ ] Implementation_entry field specifies AGENT.md or SKILL.md
- [ ] Cross-reference link to implementation folder works

### Implementation Folder Checklist

- [ ] Folder name: `{name}-agent/` (use suffix for consistency)
- [ ] Contains AGENT.md or SKILL.md as entry point
- [ ] Frontmatter in AGENT.md/SKILL.md is complete
- [ ] README.md exists
- [ ] README.md references the spec file
- [ ] Expected subdirectories exist (config, examples, etc.)

### Test Verification

```bash
# Run validation
npm run validate:agents

# Check specific agent
ls -la agents/{name}-agent/
cat agents/{name}.agent.md | grep implementation
```

## Migration Path for Existing Agents

### For Agents Without `-agent` Suffix

**Option 1: Rename folder** (if not breaking)

```bash
mv agents/adr-generator agents/adr-generator-agent
```

**Option 2: Update naming convention** (accept exceptions)

```
Keep: adr-generator, wordpress, release
Note: These are exceptions to the rule
```

**Recommendation:** Accept current naming diversity. Focus on spec coverage instead.

## Summary Table

### Correct Naming Patterns

| Asset | Pattern | Example | Status |
|---|---|---|---|
| Spec file | `{name}.agent.md` | `adr.agent.md` | ✓ Correct |
| Folder | `{name}-agent/` | `adr-generator/` | ⚠️ Mostly correct |
| Agent definition | `AGENT.md` or `SKILL.md` | `SKILL.md` | ✓ Correct |
| Config schema | `{name}-config.schema.json` | `adr-config.schema.json` | ✓ Correct |
| Tests | `{component}.test.js` | `discovery.test.js` | ✓ Correct |

### Exceptions to Accept

```
Folder names without -agent suffix:
- adr-generator (has -generator instead)
- prompt-engineer (no suffix)
- release (short name)
- wordpress (no suffix)
- changelog (no suffix)

Action: Document as acceptable exceptions.
```

---

## References

- CLAUDE.md: Agent organization guidelines
- task-planner.agent.md: Reference spec file
- agents/adr-generator/: Reference implementation
- Contributing Guidelines: Add agent creation instructions

---

**Document Status:** Reference Guide
**Last Updated:** 2026-08-29
