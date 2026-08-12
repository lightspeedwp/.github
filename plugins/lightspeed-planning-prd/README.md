# LightSpeed Planning PRD Plugin

Comprehensive product planning plugin combining PRD creation, feature planning, and roadmap generation into a unified multi-provider agent.

**Version:** 2.0.0  
**Status:** Active  
**Created:** 2026-07-22  
**Providers:** Claude, GitHub Copilot, OpenAI

## Overview

The **lightspeed-planning-prd** plugin provides everything you need for end-to-end product planning:

- 🎯 **PRD Creation** — Expert product requirement documents
- 🎪 **Feature Planning** — Prioritization and user story generation
- 📅 **Timeline Planning** — Realistic schedules with contingency
- 🗺️ **Roadmap Generation** — Strategic product roadmaps
- ⚠️ **Risk Assessment** — Identify and mitigate blockers
- 👥 **Stakeholder Alignment** — Requirements gathering and approval

## Contents

### Agents

- `agents/prd/` — Complete PRD agent with multi-provider support

### Provider Configurations

- `.claude-plugin/` — Claude integration (deepest reasoning)
- `.codex-plugin/` — GitHub Copilot integration (GitHub-native)
- `.gemini-plugin/` — Google Gemini integration

### Documentation

- `INSTALL.md` — Installation and setup
- `copilot-plugin.json` — Plugin manifest for all providers

## Quick Start

### 1. Install the Plugin

**Claude (Claude.ai or Claude Code):**

```
/plugins install lightspeed-planning-prd
```

**GitHub Copilot:**
Add to your Copilot configuration:

```json
{
  "plugins": [
    {
      "id": "lightspeed-planning-prd",
      "version": "2.0.0",
      "enabled": true
    }
  ]
}
```

**OpenAI (API):**

```bash
curl -X POST https://api.openai.com/v1/assistants \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "name": "PRD Agent",
    "instructions": "[See claude/agent.md]",
    "tools": [{"type": "function", "function": {...}}]
  }'
```

### 2. Create Your First PRD

**In Claude:**

```
I need to create a PRD for [product]. Here's the vision:
[vision statement]

Our target users are:
[user descriptions]

Key requirements:
[requirements list]
```

**In Copilot:**

```
/prd create
```

**Via OpenAI API:**

```bash
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Create a PRD for..."}],
    "functions": [...]
  }'
```

## Capabilities

### PRD Creation

- Complete document generation with all required sections
- Executive summaries for stakeholder communication
- Requirements documentation (functional & non-functional)
- Success metrics and KPI definition

### Feature Planning

- Impact/effort prioritization matrices
- User story generation with acceptance criteria
- Feature breakdown and decomposition
- Risk and dependency identification

### Timeline & Roadmap

- Release planning with realistic estimates
- Sprint-by-sprint breakdown
- Milestone definition and tracking
- Critical path analysis

### Stakeholder Management

- Requirements gathering templates
- Approval workflow coordination
- Change management communication
- Feedback incorporation

## Provider Comparison

| Feature | Claude | Copilot | OpenAI |
|---------|--------|---------|--------|
| PRD Creation | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| Feature Planning | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Timeline Estimation | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| GitHub Integration | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| API Automation | ⭐⭐ | ⭐ | ⭐⭐⭐ |
| Complex Reasoning | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |

**Legend:** ⭐⭐⭐ = Best fit, ⭐⭐ = Good, ⭐ = Basic support

## Use Cases

### 1. Complete Product Planning

Create comprehensive PRDs, plan features, and generate roadmaps in one workflow.

### 2. Feature Factory

Rapidly generate features, user stories, and timelines for large initiatives.

### 3. GitHub-Native Planning

Create PRDs directly in GitHub, sync to Projects, auto-generate issues.

### 4. Automated Roadmap Generation

Use OpenAI API to generate roadmaps as part of automated workflows.

### 5. Risk Assessment

Identify and plan mitigation for technical, resource, and market risks.

## Configuration

### Claude

Edit `claude/agent.md` to customize instructions and tools.

### Copilot

Edit `copilot/skills.yaml` to add GitHub-specific integrations.

### OpenAI

Update `openai/tools.json` to adjust function definitions.

## Troubleshooting

**Q: PRD is too long/short**  
A: Adjust detail level in your request:

- "Brief executive summary PRD" for short version
- "Comprehensive detailed PRD" for full version

**Q: Timeline estimates seem unrealistic**  
A: Include team capacity and constraints:

- "We have 2 engineers for 8 weeks"
- "This is a 3-person team"

**Q: GitHub integration not working**  
A: Ensure Copilot has permission to access your repository and GitHub credentials are configured.

**Q: API rate limit exceeded**  
A: OpenAI has rate limits per API key. Contact OpenAI support for higher limits.

## Support & Documentation

- **Installation:** See `INSTALL.md`
- **Agent Details:** See `.github/agents/prd-agent/AGENT.md`
- **Cookbook:** See `cookbook/project-planning-and-prd-playbook.md`
- **Issues:** File issues at <https://github.com/lightspeedwp/.github>

## Merged Agents

This plugin combines two specialized agents:

1. **prd-agent** — PRD creation and documentation expertise
2. **prd-factory-planner-agent** — Feature planning and roadmap execution

See `.github/agents/prd-agent/README.md` for migration notes.

## Version History

### v2.0.0 (2026-07-22)

- Merged prd-agent + prd-factory-planner-agent
- Multi-provider support (Claude, Copilot, OpenAI)
- Enhanced timeline and risk assessment
- GitHub Projects integration

### v1.x (Archived)

- Single-agent versions now deprecated

---

**Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!**
