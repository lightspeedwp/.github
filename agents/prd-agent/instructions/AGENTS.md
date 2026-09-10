# PRD Agent — Skill Routing & Integration Guide

This document explains how to invoke and route to specific skills within the PRD Agent ecosystem.

## Skill Inventory

The PRD Agent consists of 28 specialized skills. Route to each skill based on your specific need:

### PRD & Document Generation

| Skill | Purpose | Invocation |
|-------|---------|-----------|
| **prd-writer** | Primary PRD creation, documentation, and specification writing | Use when creating complete PRDs or product specifications |
| **prd-task-reviewer** | PRD review, feedback collection, and specification refinement | Use for review cycles and PRD validation |
| **markdown-content-validator** | Document quality validation and frontmatter checks | Use to validate completed documentation |

### Planning & Strategy

| Skill | Purpose | Invocation |
|-------|---------|-----------|
| **implementation-plan-generator** | Create detailed implementation roadmaps and execution plans | Use when planning technical implementation |
| **delivery-planner** | Schedule sprints, milestones, and delivery timelines | Use for release planning and scheduling |
| **estimation-planner** | Estimate effort, resources, and timelines | Use for capacity planning and realistic scheduling |
| **acceptance-test-planner** | Plan QA strategies and test case generation | Use for test planning and acceptance criteria |

### Project Intake & Discovery

| Skill | Purpose | Invocation |
|-------|---------|-----------|
| **project-intake** | Initial project scoping, discovery, and intake workflow | Use at project start for requirements gathering |
| **project-researcher** | Competitive analysis, market research, and discovery | Use when research is needed for product decisions |
| **lightspeed-intake-onboarding** | LightSpeed-specific project intake and onboarding | Use for projects following LightSpeed process |
| **intake-routing** | Route projects to appropriate handlers and teams | Use for project triage and assignment |

### Requirements & Change Management

| Skill | Purpose | Invocation |
|-------|---------|-----------|
| **change-request-router** | Evaluate, route, and manage change requests | Use when processing feature/requirement changes |
| **requirements-traceability-mapper** | Map requirements to features, tests, and deliverables | Use for traceability and impact analysis |
| **validation-support** | Support validation planning and test execution | Use for validation and QA planning |

### Project Management

| Skill | Purpose | Invocation |
|-------|---------|-----------|
| **prd-agent-orchestrator** | Coordinate routing between other PRD Agent skills | Meta-skill for multi-step PRD workflows |
| **project-status-reporter** | Generate status reports and stakeholder updates | Use for reporting and communication |
| **project-memory-manager** | Maintain project state, context, and memory | Use to track project assumptions and decisions |
| **memory-management** | General knowledge and context management | Use for broader memory and context needs |

### Quality & Release

| Skill | Purpose | Invocation |
|-------|---------|-----------|
| **qa-findings-router** | Triage QA findings and route to appropriate handlers | Use when processing QA issues |
| **qa-planner** | Plan QA strategy, test scope, and acceptance criteria | Use for QA planning |
| **release-handoff-generator** | Create release documentation and handoff materials | Use when preparing for release |
| **approval-gate-manager** | Manage approval workflows and decision logging | Use for approval processes |

### Integration & Output

| Skill | Purpose | Invocation |
|-------|---------|-----------|
| **github-issue-drafter** | Create and format GitHub issues from specifications | Use when converting specs to GitHub issues |
| **launch-task-router** | Route launch tasks and coordinate launch planning | Use for launch planning and execution |
| **prd-task-pack-exporter** | Export and package project deliverables | Use when creating project export packages |
| **figma-wordpress-technical-brief** | Create design and technical specifications | Use for design-heavy or WordPress projects |
| **wordpress-plugin-packaging-review** | Review and prepare WordPress plugin deliverables | Use for WordPress plugin projects |

## Routing Patterns

### Complete PRD Creation Workflow

1. **project-intake** — Initial project scoping and discovery
2. **project-researcher** — Competitive and market analysis
3. **prd-writer** — Create comprehensive PRD
4. **prd-task-reviewer** — Review and refine PRD
5. **implementation-plan-generator** — Create implementation roadmap
6. **github-issue-drafter** — Convert specs to GitHub issues

### Feature Planning Workflow

1. **requirements-traceability-mapper** — Map requirements to features
2. **acceptance-test-planner** — Plan tests and acceptance criteria
3. **estimation-planner** — Estimate effort and timeline
4. **delivery-planner** — Schedule releases and sprints
5. **change-request-router** — Handle change requests

### Release Preparation Workflow

1. **qa-planner** — Plan QA strategy
2. **qa-findings-router** — Triage QA findings
3. **release-handoff-generator** — Create handoff documentation
4. **approval-gate-manager** — Manage approvals
5. **project-status-reporter** — Report release status

## Integration with External Services

### GitHub Integration

Use **github-issue-drafter** to automatically create GitHub issues from specifications. Issues are created with:
- Proper title formatting
- Issue descriptions from requirements
- Labels based on issue type
- Linked PRs and milestones

### Linear Integration

Use **change-request-router** and **project-status-reporter** to:
- Create Linear issues from change requests
- Sync timelines with Linear projects
- Generate status reports linked to Linear issues

### Google Workspace Integration

Use **project-memory-manager** to:
- Collaborate on shared documents
- Collect stakeholder feedback
- Share project context with team

## Best Practices

### Skill Invocation

- **Be explicit** — Name the skill by its exact name in your request
- **Provide context** — Include relevant project details, requirements, and constraints
- **Specify output** — Request specific output format (Markdown, JSON, etc.)
- **Confirm routing** — If unsure which skill to use, start with the orchestrator

### Multi-Skill Workflows

- Use **prd-agent-orchestrator** to coordinate complex workflows
- Let each skill complete its specialized work before moving to the next
- Pass outputs from one skill as inputs to the next
- Validate outputs at key checkpoints (review, approval, etc.)

### Error Handling

- If a skill seems stuck, try restating your requirements more clearly
- If outputs don't match expected format, specify the format explicitly
- If routing is unclear, describe your end goal and let the orchestrator route

## Related Documentation

- [../AGENT.md](../AGENT.md) — Full agent capabilities and metadata
- [../README.md](../README.md) — Overview and quick start
- [../CHANGELOG.md](../CHANGELOG.md) — Version history and updates

---

*Expertly routed product planning, every time.*
