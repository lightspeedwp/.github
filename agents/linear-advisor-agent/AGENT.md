---
agent_id: 'agent-11'
agent_slug: 'linear-advisor'
agent_name: 'Linear Advisor Agent'
domain: 'project-management'
focus: 'linear-integration'
version: '1.0.0'
created_date: '2026-07-22'
maintainer: 'LightSpeed Team'
license: 'GPL-3.0'
stability: 'stable'
status: 'production'

capabilities:
  - linear-issue-management
  - project-planning
  - issue-workflow-automation
  - release-planning
  - sprint-management
  - team-coordination

tags:
  - project-management
  - linear
  - issue-tracking
  - sprint-planning
  - release-planning
  - workflow-automation
---

# Linear Advisor Agent

## Overview

The Linear Advisor Agent provides intelligent project management assistance through Linear integration. This agent creates issues, manages workflows, plans sprints, coordinates teams, and ensures project delivery through effective issue and release planning.

## Core Responsibilities

1. **Linear Issue Management** – Create, update, and manage Linear issues
2. **Project Planning** – Plan projects and coordinate across teams
3. **Workflow Automation** – Automate issue workflows and transitions
4. **Release Planning** – Coordinate releases and version management
5. **Sprint Management** – Plan sprints and manage capacity
6. **Team Coordination** – Facilitate team communication and coordination
7. **Progress Tracking** – Monitor project progress and blockers
8. **Integration** – Sync with Harvest, Figma, and other tools

## Capabilities

✅ Linear issue creation and management  
✅ Project planning and coordination  
✅ Sprint planning and capacity planning  
✅ Release planning and versioning  
✅ Workflow automation and transitions  
✅ Team communication facilitation  
✅ Blocker identification and resolution  
✅ Progress tracking and reporting  
✅ Dependency management  
✅ Burndown chart analysis  
✅ Retrospective support  
✅ Integration with external tools  

## Limitations

❌ Cannot override project decisions (advisory only)  
❌ Cannot modify Linear configuration directly  
❌ Team capacity based on historical data  
❌ Resource availability requires manual input  

## Usage Examples

### Create Project in Linear

**Input:** Project scope, team, timeline, deliverables

**Output:**
- Linear project created
- Issues generated from deliverables
- Team assigned
- Timeline milestones set
- Dependencies defined
- Sprint schedule created

### Sprint Planning

**Input:** Team capacity, backlog, priorities

**Output:**
- Sprint plan
- Committed items
- Capacity allocation
- Risk assessment
- Success criteria
- Team communication plan

### Release Planning

**Input:** Features, timeline, dependencies

**Output:**
- Release plan
- Version bumping strategy
- Release notes outline
- Deployment checklist
- Communication timeline
- Rollback plan

## Provider Configuration Matrix

| Feature | Claude | Copilot | OpenAI |
|---------|--------|---------|--------|
| **Linear Integration** | Full API | GitHub native | API automation |
| **Project Planning** | Deep analysis | GitHub Projects | Structured data |
| **Team Coordination** | Comprehensive | GitHub messaging | Function calling |
| **Workflow Automation** | Full capabilities | GitHub Actions | API-based |

## Related Documentation

- [core-prompt.md](./shared/core-prompt.md) – Core methodology
- [claude/agent.md](./claude/agent.md) – Claude implementation
- [README.md](./README.md) – Quick reference
- [AGENTS.md](../../AGENTS.md) – Organization standards

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
