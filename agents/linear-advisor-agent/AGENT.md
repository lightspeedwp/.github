---
file_type: documentation
name: Linear Advisor Agent
description: Project management integration tool for Linear issue management, sprint planning, and team coordination
agent_id: agent-11
agent_slug: linear-advisor
agent_name: Linear Advisor Agent
domain: project-management
focus: linear-integration
version: 1.0.1
created_date: '2026-07-22'
maintainer: LightSpeed Team
license: GPL-3.0
stability: stable
status: active
providers:
  - claude
  - copilot
  - openai
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

## Key Workflows

### Project Setup Workflow

1. Gather project requirements, scope, and team information
2. Create Linear project with appropriate settings
3. Define issue templates and workflow states
4. Set up team members and permissions
5. Create initial issue structure from requirements
6. Configure automation rules and triggers
7. Initialize sprint schedule and milestones

### Issue Management Workflow

1. Receive issue creation requests with full context
2. Validate requirements and scope
3. Create Linear issues with proper relationships
4. Link related issues and dependencies
5. Assign to appropriate team members
6. Set priorities and due dates
7. Configure workflow automation

### Sprint Execution Workflow

1. Analyze backlog and team capacity
2. Select issues for sprint commitment
3. Create sprint in Linear with dates
4. Distribute work across team members
5. Set up daily standup structure
6. Monitor progress and blockers
7. Support mid-sprint adjustments

### Release Coordination Workflow

1. Plan release scope and timeline
2. Define version and naming strategy
3. Create milestone in Linear
4. Group related issues by component
5. Generate release notes structure
6. Coordinate with stakeholders
7. Plan deployment schedule

## Integration Patterns

### Linear API Integration

- Query issues and projects
- Create and update issues
- Manage workflows and states
- Handle attachments and comments
- Sync team and user data

### GitHub Actions Integration

- Trigger workflows from Linear events
- Sync Linear issues to GitHub Projects
- Auto-create GitHub releases from Linear milestones
- Update PR status in Linear
- Generate reports from Linear data

### Workflow Automation

- Auto-transition issues based on conditions
- Auto-assign issues based on skills
- Auto-label issues by category
- Trigger notifications for blockers
- Archive completed sprints automatically

## Advanced Features

### Capacity Planning

- Historical velocity tracking
- Team capacity calculation
- Resource allocation optimization
- Bottleneck identification
- Burndown forecasting

### Dependency Management

- Issue blocking relationships
- Component dependency mapping
- Cross-team coordination
- Risk identification
- Critical path analysis

### Reporting & Analytics

- Sprint metrics and burndown
- Velocity trends
- Release readiness assessment
- Team productivity metrics
- Issue cycle time analysis

## Provider Configuration Matrix

| Feature | Claude | Copilot | OpenAI |
|---------|--------|---------|--------|
| **Linear Integration** | Full API | GitHub native | API automation |
| **Project Planning** | Deep analysis | GitHub Projects | Structured data |
| **Team Coordination** | Comprehensive | GitHub messaging | Function calling |
| **Workflow Automation** | Full capabilities | GitHub Actions | API-based |
| **Data Aggregation** | Multi-source | GitHub-first | External APIs |
| **Analytics** | Comprehensive | Limited | Dashboard-ready |

## Best Practices

### Project Structure

- Use consistent naming conventions for projects
- Group related issues with components
- Define clear workflow states
- Establish standard lifecycle definitions

### Team Coordination

- Clear RACI matrix definition
- Regular sync meetings scheduled
- Async communication channels established
- Decision-making process documented

### Issue Management

- Detailed acceptance criteria
- Clear scope and out-of-scope items
- Proper estimation techniques
- Regular backlog grooming

### Release Management

- Version numbering strategy
- Feature freeze processes
- Deployment verification plans
- Rollback procedures

## Related Documentation

- [core-prompt.md](./shared/core-prompt.md) – Core methodology
- [claude/agent.md](./claude/agent.md) – Claude implementation
- [README.md](./README.md) – Quick reference
- [AGENTS.md](../../AGENTS.md) – Organization standards

---

*Built by LightSpeedWP with open-source spirit!*

---

## Branch Naming

This agent does not create or validate branches. All branches must follow the patterns documented in [instructions/branch-naming.instructions.md](../../../instructions/branch-naming.instructions.md) and [BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md).

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
