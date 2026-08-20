---
file_type: documentation
title: "Linear Advisor Agent — Quick Reference"
description: "README for agents/linear-advisor-agent/README.md."
status: active
stability: stable
domain: governance
last_updated: "2026-08-19"
---

# Linear Advisor Agent — Quick Reference

**Version:** 1.0.0 | **Status:** Production | **Created:** 2026-07-22

## Overview

The Linear Advisor Agent is an intelligent project manager that specializes in coordinating work through Linear issue tracking. It helps teams plan projects, organize sprints, coordinate releases, and optimize workflows.

## Quick Start

### 1. Project Setup

```
Input: Project scope, team, timeline
Process: Create Linear project, set up workflows, initialize sprints
Output: Configured Linear project, team assignments, sprint schedule
```

### 2. Issue Management

```
Input: Requirements, deliverables, constraints
Process: Create issues, organize relationships, assign work
Output: Structured issues, clear scope, team assignments
```

### 3. Sprint Planning

```
Input: Backlog, team capacity, priorities
Process: Plan sprint, commit issues, allocate resources
Process: Track progress, manage blockers
Output: Sprint plan, burndown chart, risk assessment
```

### 4. Release Coordination

```
Input: Features, timeline, deployment requirements
Process: Plan release, version management, coordinate deployment
Output: Release plan, release notes, deployment checklist
```

## Core Capabilities

- Project planning and scope definition
- Linear issue creation and management
- Sprint planning and capacity optimization
- Release planning and coordination
- Workflow automation configuration
- Team coordination facilitation
- Metrics and reporting
- Risk identification and mitigation

## Provider Support

| Provider           | Status     | Integration      | Tools       |
| ------------------ | ---------- | ---------------- | ----------- |
| **Claude**         | Production | Full API         | 6 tools     |
| **GitHub Copilot** | Production | GitHub native    | 6 skills    |
| **OpenAI**         | Production | Function calling | 6 functions |

## Key Files

- **AGENT.md** – Complete agent specification
- **claude/agent.md** – Claude implementation details
- **claude/tools.json** – Tool definitions
- **copilot/agent.md** – GitHub Copilot skills
- **openai/agent.md** – OpenAI functions
- **shared/core-prompt.md** – 6-phase methodology

## Core Methodology

### Phase 1: Requirements Intake

Understand project scope, team, timeline, and success criteria

### Phase 2: Issue Structure

Design issue hierarchy, templates, and workflow states

### Phase 3: Workflow Automation

Set up automation rules, assignments, and notifications

### Phase 4: Sprint Planning

Plan sprints based on team capacity and priorities

### Phase 5: Release Planning

Coordinate releases and manage versions

### Phase 6: Execution & Tracking

Monitor progress, optimize performance, manage risks

## Configuration

### Linear API

- Requires Linear workspace and API key
- Supports GraphQL queries for flexibility
- Handles rate limiting intelligently

### Team Setup

- Define team members and roles
- Configure permissions and access
- Set up notification preferences

### Workflow States

- Backlog, Ready, In Progress, Review, Done
- Custom states can be added
- Automated transitions supported

### Automation Rules

- Auto-assign based on criteria
- State transitions on events
- Notification triggers
- Report generation

## Example Workflows

### Creating a Project

1. Define project scope and goals
2. Set up Linear project
3. Create issue templates
4. Assign team members
5. Initialize sprint schedule
6. Configure automation rules

### Planning a Sprint

1. Assess team velocity
2. Calculate capacity
3. Select prioritized issues
4. Commit to sprint
5. Distribute work
6. Set success criteria

### Releasing a Version

1. Define scope and features
2. Create version milestone
3. Group related issues
4. Generate release notes
5. Plan deployment
6. Create verification checklist

## Best Practices

- **Clear Communication** – Document all decisions and assumptions
- **Data-Driven** – Base recommendations on historical metrics
- **Risk-Aware** – Identify blockers and risks early
- **Iterative** – Support feedback and refinement cycles
- **Automated** – Minimize manual work through smart automation

## Success Metrics

- Sprint velocity consistency
- Issue resolution rate
- Cycle time reduction
- Team satisfaction
- Release on-time delivery
- Risk mitigation success

## Related Documentation

- **AGENT.md** – Full specification and capabilities
- **shared/core-prompt.md** – Detailed 6-phase methodology
- **claude/agent.md** – Claude-specific implementation
- **AGENTS.md** – Organization standards

## Troubleshooting

### Common Issues

**Issue:** Linear API rate limit exceeded

- Solution: Implement exponential backoff retry
- Check: API quota in Linear settings
- Prevention: Batch operations efficiently

**Issue:** Sprint over-committed

- Solution: Use capacity calculation tool
- Review: Historical velocity data
- Action: Re-prioritize backlog items

**Issue:** Workflow automation not triggering

- Solution: Verify automation rules in Linear
- Check: Issue state transitions
- Test: Manual trigger first

**Issue:** Team assignment conflicts

- Solution: Review assignment matrix
- Check: Team member permissions
- Action: Clear conflicts in Linear UI

## Advanced Configuration

### Custom Workflow States

Define workflow states specific to your process:

- Backlog, Ready, In Progress, Review, Testing, Done
- Or use custom states: Blocked, On Hold, Awaiting Approval

### Team Capacity Calculation

- Historical velocity: Average points/sprint
- Team size: Number of team members
- Sprint duration: Weeks per sprint
- Overhead: Buffer for unknowns (10-15%)

### Metric Dashboards

Track over time:

- Velocity trends
- Cycle time
- Issue resolution rate
- Team productivity
- Release on-time percentage

## Support

For issues or questions:

1. Review the AGENT.md specification
2. Check the relevant provider implementation
3. Consult the core methodology in shared/core-prompt.md
4. Review troubleshooting section above

---

*Built by LightSpeedWP with open-source spirit!*

## Repository Flow

```mermaid
graph LR
  accTitle: graph diagram
  accDescr: graph flowchart
    A["Scope"] --> B["Inputs"]
    B --> C["Process"]
    C --> D["Validation"]
    D --> E["Outputs"]

    style A fill:#4a148c,color:#fff
    style B fill:#1b5e20,color:#fff
    style C fill:#bf360c,color:#fff
    style D fill:#f57f17,color:#fff
    style E fill:#00695c,color:#fff
```
