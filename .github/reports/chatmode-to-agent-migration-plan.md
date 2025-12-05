---
file_type: "documentation"
title: "Chatmode to Agent Migration Plan"
description: "Comprehensive plan to migrate .chatmode.md files to .agent.md format following VS Code's official terminology change"
version: "v1.0"
created_date: "2025-12-01"
last_updated: "2025-12-04"
author: "LightSpeedWP Team"
maintainer: "LightSpeedWP Team"
domain: "governance"
stability: "stable"
tags: ["migration", "chatmodes", "agents", "vs-code", "copilot"]
references:
  - path: ".github/agents/agent.md"
    description: "Main agent index"
  - path: ".github/chatmodes/chatmodes.md"
    description: "Current chatmodes index (to be deprecated)"
  - path: "schemas/frontmatter.schema.json"
    description: "Frontmatter schema definition"
---

# Chatmode to Agent Migration Plan

## Executive Summary

VS Code v1.106+ has officially renamed "custom chat modes" to "custom agents". This migration plan outlines the process to align LightSpeedWP's repository with this new standard while maintaining backward compatibility during transition.

**Key Changes:**

- File extension: `.chatmode.md` → `.agent.md`
- Location: `.github/chatmodes/` → `.github/agents/`
- Frontmatter: `file_type: chatmode` → `file_type: agent`

---

## Migration Scope

### Files to Migrate

#### Root Chatmodes (31 files)

| Current File | Target File | Status |
|--------------|-------------|--------|
| `a11y-assistant.chatmode.md` | `a11y-assistant.agent.md` | Pending |
| `a11y.chatmode.md` | `a11y.agent.md` | Pending |
| `accessibility-expert.chatmode.md` | `accessibility-expert.agent.md` | Pending |
| `block-plugin-developer.chatmode.md` | `block-plugin-developer.agent.md` | Pending |
| `block-plugin-development.chatmodes.md` | `block-plugin-development.agent.md` | Pending |
| `block-theme-developer.chatmode.md` | `block-theme-developer.agent.md` | Pending |
| `block-theme-development.chatmodes.md` | `block-theme-development.agent.md` | Pending |
| `code-quality-guru.chatmode.md` | `code-quality-guru.agent.md` | Pending |
| `devops-helper.chatmode.md` | `devops-helper.agent.md` | Pending |
| `docs.chatmode.md` | `docs.agent.md` | Pending |
| `fix-ci.chatmode.md` | `fix-ci.agent.md` | Pending |
| `lock-expert.chatmode.md` | `lock-expert.agent.md` | Pending |
| `pattern-studio.chatmode.md` | `pattern-studio.agent.md` | Pending |
| `pattern-wizard.chatmode.md` | `pattern-wizard.agent.md` | Pending |
| `planner.chatmode.md` | `planner.agent.md` | Pending (check conflict) |
| `pr-copilot.chatmode.md` | `pr-copilot.agent.md` | Pending |
| `refactor.chatmode.md` | `refactor.agent.md` | Pending |
| `release-copilot.chatmode.md` | `release-copilot.agent.md` | Pending |
| `reporting.chatmode.md` | `reporting.agent.md` | Pending (check conflict) |
| `review.chatmode.md` | `review.agent.md` | Pending |
| `reviewer.chatmode.md` | `reviewer.agent.md` | Pending (check conflict) |
| `scaffold.chatmode.md` | `scaffold.agent.md` | Pending |
| `support.chatmode.md` | `support.agent.md` | Pending |
| `teacher.chatmode.md` | `teacher.agent.md` | Pending |
| `test-coach.chatmode.md` | `test-coach.agent.md` | Pending |
| `testing.chatmode.md` | `testing.agent.md` | Pending |
| `woo.chatmode.md` | `woo.agent.md` | Pending |
| `chatmodes.md` | (deprecate/redirect) | Pending |
| `README.md` | (update references) | Pending |

#### Awesome-Copilot Chatmodes (51 files)

| Current File | Target File | Status |
|--------------|-------------|--------|
| `4.1-Beast.chatmode.md` | `4.1-beast.agent.md` | Pending |
| `Thinking-Beast-Mode.chatmode.md` | `thinking-beast-mode.agent.md` | Pending |
| `Ultimate-Transparent-Thinking-Beast-Mode.chatmode.md` | `ultimate-transparent-thinking-beast-mode.agent.md` | Pending |
| `accesibility.chatmode.md` | `accessibility.agent.md` | Pending (fix typo) |
| `address-comments.chatmode.md` | `address-comments.agent.md` | Pending |
| `api-architect.chatmode.md` | `api-architect.agent.md` | Pending |
| `bicep-implement.chatmode.md` | `bicep-implement.agent.md` | Pending |
| `bicep-plan.chatmode.md` | `bicep-plan.agent.md` | Pending |
| `blueprint-mode-codex.chatmode.md` | `blueprint-mode-codex.agent.md` | Pending |
| `blueprint-mode.chatmode.md` | `blueprint-mode.agent.md` | Pending |
| `code-tour.chatmode.md` | `code-tour.agent.md` | Pending |
| `critical-thinking.chatmode.md` | `critical-thinking.agent.md` | Pending |
| `debug.chatmode.md` | `debug.agent.md` | Pending |
| `declarative-agents-architect.chatmode.md` | `declarative-agents-architect.agent.md` | Pending |
| `demonstrate-understanding.chatmode.md` | `demonstrate-understanding.agent.md` | Pending |
| `electron-angular-native.chatmode.md` | `electron-angular-native.agent.md` | Pending |
| `expert-cpp-software-engineer.chatmode.md` | `expert-cpp-software-engineer.agent.md` | Pending |
| `expert-react-frontend-engineer.chatmode.md` | `expert-react-frontend-engineer.agent.md` | Pending |
| `gpt-5-beast-mode.chatmode.md` | `gpt-5-beast-mode.agent.md` | Pending |
| `implementation-plan.chatmode.md` | `implementation-plan.agent.md` | Pending |
| `index.chatmode.md` | (deprecate/redirect) | Pending |
| `janitor.chatmode.md` | `janitor.agent.md` | Pending |
| `mentor.chatmode.md` | `mentor.agent.md` | Pending |
| `meta-agentic-project-scaffold.chatmode.md` | `meta-agentic-project-scaffold.agent.md` | Pending |
| `php-mcp-expert.chatmode.md` | `php-mcp-expert.agent.md` | Pending |
| `plan.chatmode.md` | `plan.agent.md` | Pending |
| `planner.chatmode.md` | `planner.agent.md` | Pending |
| `playwright-tester.chatmode.md` | `playwright-tester.agent.md` | Pending |
| `prd.chatmode.md` | `prd.agent.md` | Pending |
| `principal-software-engineer.chatmode.md` | `principal-software-engineer.agent.md` | Pending |
| `prompt-builder.chatmode.md` | `prompt-builder.agent.md` | Pending |
| `prompt-engineer.chatmode.md` | `prompt-engineer.agent.md` | Pending |
| `python-mcp-expert.chatmode.md` | `python-mcp-expert.agent.md` | Pending |
| `refine-issue.chatmode.md` | `refine-issue.agent.md` | Pending |
| `research-technical-spike.chatmode.md` | `research-technical-spike.agent.md` | Pending |
| `software-engineer-agent-v1.chatmode.md` | `software-engineer-agent-v1.agent.md` | Pending |
| `specification.chatmode.md` | `specification.agent.md` | Pending |
| `task-planner.chatmode.md` | `task-planner.agent.md` | Pending |
| `task-researcher.chatmode.md` | `task-researcher.agent.md` | Pending |
| `tdd-green.chatmode.md` | `tdd-green.agent.md` | Pending |
| `tdd-red.chatmode.md` | `tdd-red.agent.md` | Pending |
| `tdd-refactor.chatmode.md` | `tdd-refactor.agent.md` | Pending |
| `tech-debt-remediation-plan.chatmode.md` | `tech-debt-remediation-plan.agent.md` | Pending |
| `template.accessibility.chatmode.md` | `template-accessibility.agent.md` | Pending |
| `template.address-comments.chatmode.md` | `template-address-comments.agent.md` | Pending |
| `template.api-architect.chatmode.md` | `template-api-architect.agent.md` | Pending |
| `template.figmatowp.chatmode.md` | `template-figmatowp.agent.md` | Pending |
| `template.pattern-development.chatmode.md` | `template-pattern-development.agent.md` | Pending |
| `template.pattern.chatmode.md` | `template-pattern.agent.md` | Pending |
| `template.review.chatmode.md` | `template-review.agent.md` | Pending |
| `typescript-mcp-expert.chatmode.md` | `typescript-mcp-expert.agent.md` | Pending |
| `voidbeast-gpt41enhanced.chatmode.md` | `voidbeast-gpt41enhanced.agent.md` | Pending |

#### Empty Subdirectories (to be removed)

- `.github/chatmodes/block-plugin/` (empty)
- `.github/chatmodes/block-theme/` (empty)

---

## Potential Conflicts

The following chatmodes may conflict with existing agent files:

| Chatmode File | Existing Agent File | Resolution |
|---------------|---------------------|------------|
| `planner.chatmode.md` | `planner.agent.md` ✅ exists | Merge content or rename |
| `reviewer.chatmode.md` | `reviewer.agent.md` ✅ exists | Merge content or rename |
| `reporting.chatmode.md` | `reporting.agent.md` ✅ exists | Merge content or rename |

**Resolution Strategy**: Compare content of both files. If they serve the same purpose, merge into the agent file. If different purposes, rename the chatmode version (e.g., `review-mode.agent.md`).

---

## Frontmatter Schema Changes

### Old Chatmode Format (Deprecated)

```yaml
---
file_type: "chatmode"
id: ls-code-quality-guru
title: Code Quality Guru
description: "A pragmatic reviewer focused on maintainability."
tags:
  - global
  - review
mode: conversation
---
```

### New Agent Format (Current)

```yaml
---
description: "A pragmatic reviewer focused on maintainability."
name: "Code Quality Guru"
tools: ["codebase", "search", "usages"]
model: "claude-sonnet-4"  # Optional
---
```

### Transitional Format (LightSpeed Extended)

For LightSpeed governance, we support an extended format that includes additional metadata:

```yaml
---
# VS Code Required Fields
description: "A pragmatic reviewer focused on maintainability."
name: "Code Quality Guru"
tools: ["codebase", "search", "usages"]

# VS Code Optional Fields
model: "claude-sonnet-4"
handoffs:
  - label: "Handoff to Reviewer"
    agent: "reviewer"
    prompt: "Review the changes for quality."

# LightSpeed Governance Fields (optional but recommended)
file_type: "agent"  # For schema validation
version: "v1.0"
last_updated: "2025-12-04"
author: "LightSpeedWP Team"
maintainer: "LightSpeedWP Team"
owners: ["lightspeedwp/maintainers"]
tags: ["review", "quality", "code-style"]
category: "code-quality"
status: "active"
domain: "generic"
stability: "stable"
references:
  - path: ".github/instructions/coding-standards.instructions.md"
    description: "Coding standards"
---
```

---

## Migration Phases

### Phase 1: Schema Update ✅

- Update `schemas/frontmatter.schema.json` to support both formats
- Add `name` and `tools` fields to agent schema
- Mark chatmode-specific fields as deprecated but still valid

### Phase 2: Migration Script

- Create `scripts/migrate-chatmodes.mjs` to automate the migration
- Features:
  - Rename files from `.chatmode.md` to `.agent.md`
  - Move files from `chatmodes/` to `agents/`
  - Transform frontmatter to new format
  - Handle conflicts with existing agent files
  - Generate migration report

### Phase 3: Execute Migration

- Run migration script in dry-run mode first
- Review proposed changes
- Execute actual migration
- Commit changes with detailed message

### Phase 4: Update References

- Update `agent.md` index with new files
- Update `custom-instructions.md` references
- Update `README.md` and other documentation
- Update any workflow files referencing chatmodes

### Phase 5: Cleanup

- Mark `chatmodes.md` as deprecated with redirect
- Remove empty `chatmodes/` subdirectories
- After verification, remove `chatmodes/` folder
- Update schema to remove deprecated chatmode type

---

## Rollback Plan

If issues are discovered after migration:

1. **Git Revert**: All changes are in a single commit, easy to revert
2. **VS Code Compatibility**: VS Code still recognizes `.chatmode.md` files
3. **Schema Backward Compatibility**: Schema supports both formats

---

## Success Criteria

- [ ] All `.chatmode.md` files converted to `.agent.md`
- [ ] All files moved from `chatmodes/` to `agents/`
- [ ] No duplicate or conflicting agent names
- [ ] All frontmatter validates against updated schema
- [ ] Agent index (`agent.md`) updated with new files
- [ ] No broken references in documentation
- [ ] `chatmodes/` folder removed
- [ ] Migration documented in CHANGELOG.md

---

## Timeline

| Phase | Task | Duration | Status |
|-------|------|----------|--------|
| 1 | Schema Update | 15 min | ✅ Done |
| 2 | Migration Script | 30 min | In Progress |
| 3 | Execute Migration | 15 min | Pending |
| 4 | Update References | 20 min | Pending |
| 5 | Cleanup | 10 min | Pending |
| - | **Total** | **~90 min** | - |

---

## References

- [VS Code Custom Agents Documentation](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [awesome-copilot Repository](https://github.com/github/awesome-copilot)
- [LightSpeed Frontmatter Schema](../../schemas/frontmatter.schema.json)
- [Agent Development Guidelines](../instructions/agents.instructions.md)
