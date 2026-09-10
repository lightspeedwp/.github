---
file_type: documentation
title: PRD Agent
description: Comprehensive product planning and PRD generation assistant
status: active
stability: stable
domain: product-management
last_updated: "2026-09-10"
---

# PRD Agent

Expert product planning assistant for creating comprehensive Product Requirement Documents, feature specifications, strategic roadmaps, and implementation timelines.

## Overview

The PRD Agent consolidates product planning expertise into one unified tool, combining:

- **PRD Creation** — Write structured, complete product requirement documents
- **Feature Planning** — Break down requirements into features, user stories, acceptance criteria
- **Timeline & Roadmap** — Create realistic release schedules and product roadmaps
- **Risk Assessment** — Identify blockers, dependencies, and mitigation strategies
- **Stakeholder Alignment** — Facilitate requirements gathering, approvals, and communication

## Quick Start

### For Claude Users

Copy `claude/agent.md` into your repository's `.claude/agents/` directory:

```bash
cp agents/prd-agent/claude/agent.md /path/to/your/repo/.claude/agents/prd-agent.md
```

Then start Claude Code and use the PRD Agent as a subagent.

### For GitHub Copilot Users

Copy `copilot/agent.md` into your repository's `.github/agents/` directory:

```bash
cp agents/prd-agent/copilot/agent.md /path/to/your/repo/.github/agents/prd-agent.md
```

Then use GitHub Copilot Chat to invoke the PRD Agent as a custom agent.

## Capabilities

### Core PRD & Documentation

- Executive summaries and vision statements
- Requirements documentation (functional and non-functional)
- Success metrics, KPIs, and acceptance criteria
- Constraints, assumptions, and dependencies
- Risk identification and mitigation strategies

### Feature Planning & Prioritization

- Feature breakdown and decomposition
- Impact/effort prioritization matrices
- User story generation with acceptance criteria
- Edge case and failure mode analysis
- Dependency mapping

### Timeline & Roadmap Planning

- Release planning and milestone definition
- Sprint planning and iteration coordination
- Realistic effort estimation with contingency
- Resource and capacity planning
- Critical path analysis
- Risk timeline projection

### Stakeholder Alignment

- Requirements gathering and validation
- Approval workflow management
- Change management documentation
- Communication templates and templates
- Feedback incorporation and iteration

## Skills (28 total)

The PRD Agent includes 28 specialized skills organized by capability:

### PRD & Document Generation
- **prd-writer** — Primary PRD creation and documentation
- **prd-task-reviewer** — Specification review and feedback
- **markdown-content-validator** — Document quality validation

### Planning & Strategy
- **implementation-plan-generator** — Detailed implementation roadmaps
- **delivery-planner** — Sprint and delivery scheduling
- **estimation-planner** — Effort and timeline estimation
- **acceptance-test-planner** — QA planning and test case generation

### Project Intake & Discovery
- **project-intake** — Initial project scoping and discovery
- **project-researcher** — Research and competitive analysis
- **lightspeed-intake-onboarding** — LightSpeed-specific onboarding flows
- **intake-routing** — Project intake routing and triage

### Requirements & Change Management
- **change-request-router** — Change request evaluation and routing
- **requirements-traceability-mapper** — Requirements traceability and mapping
- **validation-support** — Validation planning and execution

### Project Management
- **prd-agent-orchestrator** — Agent coordination and routing
- **project-status-reporter** — Status reporting and communication
- **project-memory-manager** — Project state and context management
- **memory-management** — General memory and knowledge management

### Quality & Release
- **qa-findings-router** — QA findings triage and routing
- **qa-planner** — QA planning and test strategy
- **release-handoff-generator** — Release documentation and handoff
- **approval-gate-manager** — Approval workflows and decision logging

### Integration & Output
- **github-issue-drafter** — GitHub issue creation and formatting
- **launch-task-router** — Launch planning and task routing
- **prd-task-pack-exporter** — Project export and packaging
- **figma-wordpress-technical-brief** — Design and technical specification
- **wordpress-plugin-packaging-review** — WordPress-specific delivery review

## Integration Points

The PRD Agent integrates with real, plugin-backed services:

- **Linear** — Issue and project creation, timeline synchronization
- **GitHub** — Repository and issue integration, PR workflows
- **Google Workspace** — Document collaboration and stakeholder review

## Provider Support

| Provider | Status | Configuration |
|----------|--------|---|
| Claude | ✅ Active | `claude/agent.md` |
| Copilot | ✅ Active | `copilot/agent.md` |
| OpenAI | ✅ Active | `openai/agent.md` |

## Structure

```
agents/prd-agent/
├── README.md              # This file
├── AGENT.md              # Agent metadata and capabilities
├── CHANGELOG.md          # Version history
├── claude/
│   └── agent.md          # Claude Code configuration
├── copilot/
│   └── agent.md          # GitHub Copilot configuration
├── openai/
│   └── agent.md          # OpenAI configuration
├── instructions/
│   └── AGENTS.md         # Skill routing and integration guide
└── skills/               # 28 specialized skills
    ├── prd-writer/
    ├── prd-task-reviewer/
    └── ... (28 total)
```

## Related Documentation

- **Full Agent Details:** See [AGENT.md](./AGENT.md) for capabilities, tags, and metadata
- **Skill Integration:** See [instructions/AGENTS.md](./instructions/AGENTS.md) for detailed skill routing
- **Version History:** See [CHANGELOG.md](./CHANGELOG.md) for updates and changes

## Support & Contributions

For issues, feature requests, or contributions, please refer to this repository's contribution guidelines.

---

*Product planning excellence, delivered with precision and care.*
