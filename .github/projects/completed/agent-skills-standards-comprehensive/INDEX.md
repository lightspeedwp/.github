---
file_type: documentation
name: Agent & Skills Standards Comprehensive Documentation
description: Unified documentation standards for agents, skills, instructions, workflows, cookbooks, plugins, hooks, and prompts
status: active
created: 2026-07-24
last_updated: '2026-07-24'
---

# Agent & Skills Standards Comprehensive Documentation Initiative

## Overview

This project establishes comprehensive, cohesive documentation standards for creating agents, skills, instructions, workflows, cookbooks, plugins, hooks, and prompts in the LightSpeed `.github` repository.

**Status:** Planning → Implementation → PR Review → Merge

**Branch:** `docs/agent-skills-standards-comprehensive`  
**Target:** `develop`

## Deliverables

9 new documentation standards files in `docs/`:

1. **AGENT_STANDARDS.md** — Single-file & folder-based agent design
2. **SKILLS_STANDARDS.md** — Shared skills creation and reusability
3. **INSTRUCTIONS_STANDARDS.md** — Instruction file creation standards
4. **WORKFLOWS_STANDARDS.md** — Agentic workflows best practices
5. **COOKBOOKS_STANDARDS.md** — Implementation guides and recipes
6. **PROMPTS_STANDARDS.md** — Prompt engineering standards
7. **PLUGINS_STANDARDS.md** — Plugin architecture and structure
8. **HOOKS_STANDARDS.md** — Event-driven hooks patterns
9. **AI_REFERENCES_STANDARDS.md** — AI model and runner references

## Key Resources

- **[PLAN.md](./PLAN.md)** — Comprehensive plan with all requirements and reference links

## Reference Links

### External Standards & Inspiration

- <https://github.com/github/awesome-copilot> (benchmark)
- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://agentskills.io/> (skill standards)

### Platform Documentation

- <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview>
- <https://code.claude.com/docs/en/plugins>
- <https://geminicli.com/docs/extensions/writing-extensions/>

### Internal References

- [AGENT_CREATION.md](../../docs/AGENT_CREATION.md) — Current agent spec (to extend)
- [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md) — Branch naming and workflow
- [AGENTS.md](../../AGENTS.md) — Global AI rules

## Timeline

| Phase | Dates | Status |
|-------|-------|--------|
| Planning | 2026-07-24 | ✅ Complete |
| Issue Creation | 2026-07-24 | ⏳ In Progress |
| Branch & Initial Docs | 2026-07-24 | ⏳ Upcoming |
| Research & Batch Commits | 2026-07-24+ | ⏳ Upcoming |
| PR Review & Merge | TBD | ⏳ Upcoming |

## Related Issues

- **Epic:** #TBD — Agent & Skills Standards Comprehensive Documentation
- **Child Issues:** #TBD–#TBD (one per doc)

## Notes

- Avoid duplicating existing docs (BRANCHING_STRATEGY.md, PR_CREATION_PROCESS.md)
- Use Mermaid diagrams liberally for visual explanations
- All external links must be retained and validated
- UK English throughout
- Cross-reference all 9 docs for consistency
