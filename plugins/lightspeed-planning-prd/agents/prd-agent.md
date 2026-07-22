---
file_type: agent
name: prd
title: PRD Agent (Product Requirements)
location: "../../agents/prd-agent/"
version: 2.0.0
status: active
category: planning
---

# PRD Agent (Product Requirements)

This is the plugin export entry for the PRD Agent. The actual agent code and configurations are located in `.github/agents/prd-agent/`.

## Plugin Details

- **Plugin:** lightspeed-planning-prd
- **Agent ID:** prd
- **Version:** 2.0.0
- **Status:** Active
- **Created:** 2026-07-22
- **Maintainer:** Ash Shaw

## Capabilities

- ✅ PRD creation and documentation
- ✅ Feature planning and prioritization
- ✅ User story generation
- ✅ Timeline and roadmap planning
- ✅ Risk assessment and mitigation
- ✅ Sprint coordination
- ✅ Stakeholder alignment

## Providers

- ✅ Claude (claude/agent.md + claude/tools.json)
- ✅ GitHub Copilot (copilot/agent.md + copilot/skills.yaml)
- ✅ OpenAI (openai/agent.md + openai/tools.json)

## Provider Support Matrix

| Capability | Claude | Copilot | OpenAI |
|-----------|--------|---------|--------|
| PRD Creation | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| Feature Planning | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Timeline Estimation | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| GitHub Integration | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| API Automation | ⭐⭐ | ⭐ | ⭐⭐⭐ |

## Merged Agents

This agent represents the consolidation of two specialized agents:

1. **prd-agent** — PRD creation and documentation expertise
2. **prd-factory-planner-agent** — Feature planning and roadmap execution

## Documentation

- **Full Agent Details:** `../../agents/prd-agent/AGENT.md`
- **Installation:** `../INSTALL.md`
- **Plugin Documentation:** `../README.md`
- **Claude Config:** `../../agents/prd-agent/claude/agent.md`
- **Copilot Config:** `../../agents/prd-agent/copilot/agent.md`
- **OpenAI Config:** `../../agents/prd-agent/openai/agent.md`
- **Shared Prompt:** `../../agents/prd-agent/shared/core-prompt.md`

---

For the actual agent implementation and tools, see `.github/agents/prd-agent/`
