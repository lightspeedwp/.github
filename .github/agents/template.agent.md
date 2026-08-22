---
file_type: agent
name: template
title: 'Template: Agent Specification'
description: 'Standard specification for defining a LightSpeed Copilot Agent: role,
  behaviours, tooling, schemas, and safety constraints.'
version: 'v1.3'
last_updated: '2026-06-01'
status: draft
tags:
- agent
- spec
- template
- copilot
owners:
- LightSpeedWP Engineering
---

## Branch Naming

This agent does not create or validate branches. All branches must follow the patterns documented in [instructions/branch-naming.instructions.md](../../instructions/branch-naming.instructions.md) and [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md).


# Agent Specification Template

This document provides the canonical template for defining LightSpeed Copilot agents. Use this specification to document agent role, responsibilities, capabilities, tooling, and safety constraints.

## Usage

Copy this template when creating a new agent specification. Replace placeholder sections with concrete details specific to your agent.

## Structure

```markdown
---
file_type: agent
name: [unique agent identifier]
title: [human-readable agent name]
description: [one-sentence purpose]
version: v1.0
last_updated: 'YYYY-MM-DD'
status: [draft|active|deprecated]
tags:
- [category tags]
owners:
- [team or person]
apply_to:
- [applicable domains/tools]
tools:
- [required tools/permissions]
examples:
- [usage scenarios]

---

## Branch Naming (Required Section)

**Copy one of the following sections based on your agent's capabilities:**

### Option A: Agent Creates Branches

```markdown
## Branch Naming

This agent **creates branches** for [purpose].

**Branch Pattern**: `{type}/{scope}-{short-title}`

- **Format**: [specific pattern, e.g., `release/vX-Y-Z`]
- **Restrictions**: Cannot use `claude/`, `copilot/`, or `openai/` prefixes — these are forbidden
- **Examples**:
  - ✅ [example-1]
  - ✅ [example-2]
  - ❌ [invalid-example]

**Validation**: All branch names validated by `.github/scripts/validation/validate-branch-name.cjs` before creation.

**See Also**: [instructions/branch-naming.instructions.md](../../instructions/branch-naming.instructions.md) for complete branch naming standards.
```

### Option B: Agent Validates Branches

```markdown
## Branch Naming

This agent **validates branches** against the pattern: `{type}/{scope}-{short-title}`

- **Allowed Types**: feat, fix, hotfix, release, refactor, chore, docs, test, perf, ci, build, deps, security, revert, research, design, a11y, ux, i18n, ops, proto, ds, api, schema, telemetry, content, seo, config, migrate, qa, uat, audit, codex
- **Forbidden Prefixes**: `claude/`, `copilot/`, `openai/` (cannot be used under any circumstance)
- **Validation**: Uses `.github/scripts/validation/validate-branch-name.cjs`

**See Also**: [instructions/branch-naming.instructions.md](../../instructions/branch-naming.instructions.md) for complete standards and examples.
```

### Option C: Agent Does Not Create/Validate Branches

```markdown
## Branch Naming

This agent does not create or validate branches. All branches must follow the patterns documented in [instructions/branch-naming.instructions.md](../../instructions/branch-naming.instructions.md) and [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md).
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
