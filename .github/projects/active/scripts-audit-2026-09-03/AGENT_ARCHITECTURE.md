---
title: "Agent Architecture & Design"
description: "Complete reference for 40+ project management agents, taxonomy, and invocation patterns"
file_type: "architecture"
created_date: "2026-09-03"
last_updated: "2026-09-03"
---

# Agent Architecture & Design

**Overview**: Technical reference for all project management agents, organization patterns, and usage.

---

## Quick Reference

| Category | Count | Purpose | Location |
|----------|-------|---------|----------|
| **Planning Agents** | 8 | Project planning, roadmaps, scheduling | `agents/planning-*.agent.md` |
| **Task Agents** | 12 | Task creation, assignment, tracking | `agents/task-*.agent.md` |
| **Review Agents** | 6 | Code review, quality gates | `agents/review-*.agent.md` |
| **Integration Agents** | 5 | GitHub, Jira, Linear integrations | `agents/integration-*.agent.md` |
| **Report Agents** | 5 | Metrics, dashboards, analytics | `agents/report-*.agent.md` |
| **Automation Agents** | 4 | Workflow orchestration, CI/CD | `agents/automation-*.agent.md` |

**Total**: 40+ agents consolidated into single `agents/` location (canonical).

---

## Agent Taxonomy

### Planning Agents

#### 1. Task-Planner.agent.md
**Purpose**: Generate detailed implementation plans for features/epics  
**Input**: Feature description, constraints, timeline  
**Output**: Phase-by-phase plan with milestones  
**Mode**: Regular (interactive planning)  
**Use When**: Starting new feature work

```yaml
# Example Invocation
agent: task-planner
input:
  feature: "User authentication system"
  constraints: "GDPR compliant, 2FA required"
  timeline: "8 weeks"
output:
  phases: 4
  total_hours: 160
  deliverables: [...]
```

#### 2. Architecture-Advisor.agent.md
**Purpose**: Review and suggest system architecture improvements  
**Input**: Current architecture, constraints, scale requirements  
**Output**: Architecture recommendation with trade-offs  
**Mode**: Regular (consulting mode)

#### 3. Risk-Assessor.agent.md
**Purpose**: Identify technical risks in plans  
**Input**: Implementation plan, tech stack  
**Output**: Risk matrix, mitigation strategies  
**Mode**: Regular (risk analysis)

#### 4. Resource-Estimator.agent.md
**Purpose**: Estimate effort and resource requirements  
**Input**: Task/feature scope, team skills  
**Output**: Hour estimates, resource allocation  
**Mode**: Regular

#### 5-8. Domain-Specific Planners
- **Labeling-Planner**: Plans label consolidation work
- **Workflow-Planner**: Plans CI/CD workflow changes
- **Agent-Planner**: Plans agent consolidation
- **Migration-Planner**: Plans data/schema migrations

### Task Agents

#### 1. Issue-Creator.agent.md
**Purpose**: Generate GitHub issues from feature requests  
**Input**: Feature description, acceptance criteria  
**Output**: GitHub issue JSON (ready to POST)  
**Mode**: Regular (issue generation)

#### 2. Task-Decomposer.agent.md
**Purpose**: Break down features into granular tasks  
**Input**: Epic/feature, complexity estimate  
**Output**: Subtask list with dependencies  
**Mode**: Regular

#### 3. Test-Generator.agent.md
**Purpose**: Generate test cases and test code  
**Input**: Feature description, happy/sad paths  
**Output**: Test file template, test cases  
**Mode**: Regular (test generation)

#### 4. Documentation-Generator.agent.md
**Purpose**: Generate technical documentation  
**Input**: Code context, API description  
**Output**: Markdown docs with examples  
**Mode**: Regular

#### 5. Validation-Checker.agent.md
**Purpose**: Validate deliverables against criteria  
**Input**: Deliverable, acceptance criteria  
**Output**: Pass/fail + improvement suggestions  
**Mode**: Regular (validation)

#### 6-12. Specialized Task Agents
- **Labeling-Task-Creator**: Creates labeling tasks
- **Workflow-Task-Creator**: Creates workflow tasks
- **Script-Task-Creator**: Creates scripting tasks
- **Agent-Task-Creator**: Creates agent definition tasks
- **Testing-Task-Creator**: Creates testing tasks
- **Documentation-Task-Creator**: Creates doc tasks
- **Onboarding-Task-Creator**: Creates onboarding tasks

### Review Agents

#### 1. Code-Reviewer.agent.md
**Purpose**: Review code changes, suggest improvements  
**Input**: Code diff, context  
**Output**: Review comments with rationale  
**Mode**: Regular (code review)

#### 2. Security-Reviewer.agent.md
**Purpose**: Security-focused code review  
**Input**: Code diff, security context  
**Output**: Security findings, recommendations  
**Mode**: Regular (security audit)

#### 3. Performance-Reviewer.agent.md
**Purpose**: Performance-focused review  
**Input**: Code diff, performance context  
**Output**: Performance concerns, optimizations  
**Mode**: Regular (perf analysis)

#### 4. Architecture-Reviewer.agent.md
**Purpose**: Review architectural changes  
**Input**: Architecture diff, design doc  
**Output**: Architecture feedback, risks  
**Mode**: Regular

#### 5. Documentation-Reviewer.agent.md
**Purpose**: Review documentation completeness  
**Input**: Docs, feature code  
**Output**: Documentation gaps, suggestions  
**Mode**: Regular

#### 6. Quality-Assurer.agent.md
**Purpose**: End-to-end quality verification  
**Input**: Deliverable, acceptance criteria  
**Output**: QA report, sign-off/rejection  
**Mode**: Regular

### Integration Agents

#### 1. GitHub-Sync.agent.md
**Purpose**: Sync project data to GitHub (issues, PRs, project boards)  
**Input**: Project metadata, status updates  
**Output**: GitHub API calls, sync report  
**Mode**: Mode (automated sync)

#### 2. Jira-Sync.agent.md
**Purpose**: Two-way sync with Jira  
**Input**: GitHub issues, Jira epics  
**Output**: Synced metadata, conflict resolution  
**Mode**: Mode (automated sync)

#### 3. Linear-Integration.agent.md
**Purpose**: Integrate with Linear for task tracking  
**Input**: GitHub issues, Linear cycles  
**Output**: Linked issues, cycle assignments  
**Mode**: Mode (automated integration)

#### 4. Slack-Reporter.agent.md
**Purpose**: Send project updates to Slack  
**Input**: Project status, metrics  
**Output**: Slack messages, alerts  
**Mode**: Mode (automated reporting)

#### 5. Webhook-Processor.agent.md
**Purpose**: Handle incoming webhooks from external services  
**Input**: Webhook payload (GitHub, Jira, etc.)  
**Output**: Action taken, event logged  
**Mode**: Mode (event-driven)

### Report Agents

#### 1. Metrics-Dashboard.agent.md
**Purpose**: Generate project metrics dashboard  
**Input**: Project data, date range  
**Output**: HTML/JSON metrics report  
**Mode**: Mode (automated metrics)

#### 2. Progress-Reporter.agent.md
**Purpose**: Generate progress reports  
**Input**: Project history, milestones  
**Output**: Progress report (% complete, ETA)  
**Mode**: Regular (reporting)

#### 3. Burndown-Generator.agent.md
**Purpose**: Generate sprint burndown charts  
**Input**: Sprint tasks, time logs  
**Output**: Burndown chart SVG/JSON  
**Mode**: Mode (automated generation)

#### 4. Forecast-Agent.agent.md
**Purpose**: Forecast project completion  
**Input**: Historical velocity, remaining work  
**Output**: Completion forecast, confidence  
**Mode**: Regular (forecasting)

#### 5. Health-Monitor.agent.md
**Purpose**: Monitor project health metrics  
**Input**: Project data, health criteria  
**Output**: Health status (red/yellow/green)  
**Mode**: Mode (continuous monitoring)

### Automation Agents

#### 1. Workflow-Orchestrator.agent.md
**Purpose**: Coordinate complex multi-step workflows  
**Input**: Workflow definition, event trigger  
**Output**: Workflow execution log, result  
**Mode**: Mode (workflow execution)

#### 2. Event-Router.agent.md
**Purpose**: Route GitHub events to appropriate handlers  
**Input**: GitHub webhook payload  
**Output**: Routed to specific agents/handlers  
**Mode**: Mode (event routing)

#### 3. Phase-Progression.agent.md
**Purpose**: Manage project phase transitions  
**Input**: Current phase, trigger event  
**Output**: Phase updated, labels synced  
**Mode**: Mode (state machine)

#### 4. Alert-Manager.agent.md
**Purpose**: Generate and manage alerts  
**Input**: Alert criteria, thresholds  
**Output**: Alert notification, escalation  
**Mode**: Mode (continuous monitoring)

---

## Agent Location & Consolidation

### Before Phase 1 (Duplicate)
```
.github/agents/
  ├── task-planner.agent.md        ← DEPRECATED (duplicate)
  ├── code-reviewer.agent.md        ← DEPRECATED (duplicate)
  └── [17+ more duplicates]

agents/
  ├── task-planner.agent.md        ← CANONICAL
  ├── code-reviewer.agent.md        ← CANONICAL
  └── [canonical versions]
```

### After Phase 1 (Consolidated)
```
agents/
  ├── planning/
  │   ├── task-planner.agent.md
  │   ├── architecture-advisor.agent.md
  │   ├── risk-assessor.agent.md
  │   └── resource-estimator.agent.md
  ├── tasks/
  │   ├── issue-creator.agent.md
  │   ├── task-decomposer.agent.md
  │   ├── test-generator.agent.md
  │   └── [more task agents]
  ├── review/
  │   ├── code-reviewer.agent.md
  │   ├── security-reviewer.agent.md
  │   └── [more review agents]
  ├── integration/
  │   ├── github-sync.agent.md
  │   ├── jira-sync.agent.md
  │   └── [more integration agents]
  ├── reporting/
  │   ├── metrics-dashboard.agent.md
  │   └── [more report agents]
  └── automation/
      ├── workflow-orchestrator.agent.md
      └── [more automation agents]
```

**Status**: ✅ Phase 1 Complete — Single `agents/` location is canonical

---

## Agent Invocation Patterns

### Pattern 1: Direct Agent Specification (Mode Agents)

Used for automated, background execution (Slack commands, webhooks, scheduled tasks).

```yaml
# Example: GitHub event triggers
event: issue.opened
→ Invoke: issue-labeler (mode agent)
  - Runs automatically
  - No human interaction needed
  - Completes silently or posts result

event: pr.labeled
→ Invoke: phase-progression (mode agent)
  - Updates phase based on label
  - Syncs dependent workflows
  - Logs changes to audit trail
```

**When to Use**: Background automation, high-frequency tasks, event-driven workflows

### Pattern 2: Regular Agent with User Direction

Used for interactive, exploratory work (chatbots, CLI, manual invocation).

```yaml
# Example: Planning session
user: "I need to plan a migration"
→ Invoke: migration-planner (regular agent)
  - Asks clarifying questions
  - Refines plan iteratively
  - User approves before executing

user: "Review my code for security"
→ Invoke: security-reviewer (regular agent)
  - Analyzes code in detail
  - Suggests specific improvements
  - User decides which to implement
```

**When to Use**: Planning, learning, exploration, quality gates

### Pattern 3: Orchestrated Agent Chains

Multiple agents working in sequence or parallel.

```yaml
# Example: Feature implementation workflow
1. task-planner (regular)
   ↓ (user approval)
2. issue-creator (regular)
   ↓ (creates GitHub issues)
3. implementation (human or AI)
   ↓ (code written)
4. code-reviewer (regular)
   ↓ (user reviews feedback)
5. test-generator (regular)
   ↓ (creates test file)
6. validation-checker (regular)
   ↓ (validates completeness)
7. documentation-generator (regular)
   ↓ (creates docs)
8. github-sync (mode)
   ↓ (syncs to GitHub)
```

**When to Use**: Complex multi-step processes, feature development, release workflows

### Pattern 4: Conditional Agent Selection

Route to different agents based on context.

```yaml
# Example: Issue received
if issue.type == "bug":
  → Invoke: bug-analyzer
elif issue.type == "feature":
  → Invoke: feature-planner
elif issue.type == "documentation":
  → Invoke: documentation-generator
else:
  → Invoke: issue-triage
```

**When to Use**: Event routers, multi-purpose handlers

---

## Agent Dependencies & Data Flow

### Dependency Graph

```
task-planner
  ├→ risk-assessor
  ├→ resource-estimator
  └→ issue-creator
      └→ task-decomposer
          └→ [individual task agents]
              ├→ test-generator
              ├→ documentation-generator
              └→ [domain-specific generators]
                  └→ validation-checker
                      ├→ code-reviewer
                      ├→ security-reviewer
                      └→ performance-reviewer
                          └→ github-sync (mode)
                              └→ jira-sync (mode)

event-router (mode)
  ├→ phase-progression (mode)
  ├→ issue-creator
  ├→ label-applier
  └→ alert-manager (mode)

metrics-dashboard (mode)
  ├→ progress-reporter
  ├→ burndown-generator
  └→ health-monitor (mode)
```

### Data Flow Example: Feature Implementation

```
User Request
  ↓
task-planner (interactive)
  ├ Output: Implementation plan
  ├ Questions: constraints, timeline, resources
  ↓ (User approves)
  
issue-creator (interactive)
  ├ Output: GitHub issues JSON
  ↓ (User creates issues in GitHub)
  
GitHub Issues Created
  ↓
event-router (mode, triggered on issue creation)
  ├ Routes to: label-applier
  ├ Routes to: task-decomposer
  ↓
  
phase-progression (mode, triggered on label change)
  ├ Updates phase label
  ├ Notifies: workflow-orchestrator
  ↓
  
workflow-orchestrator (mode)
  ├ Executes phase-specific workflows
  ├ Triggers: testing workflows
  ├ Notifies: review agents
  ↓
  
code-reviewer (interactive or mode)
  ├ Reviews implementation
  ↓ (Feedback posted to PR)
  
validation-checker (interactive)
  ├ Validates against criteria
  ↓ (Report posted)
  
github-sync (mode)
  ├ Updates issue metadata
  ├ Updates GitHub project board
  ├ Updates metrics
  ↓
  
metrics-dashboard (mode, scheduled)
  ├ Generates progress report
  ├ Updates Slack
  ├ Updates dashboard HTML
```

---

## Configuration & Customization

### Agent Configuration File: `agents/.config.yml`

```yaml
agents:
  task-planner:
    mode: regular
    category: planning
    description: "Generate implementation plans"
    required_context: [project_scope, timeline]
    optional_context: [constraints, budget]
    output_format: markdown
    
  github-sync:
    mode: mode
    category: integration
    description: "Sync to GitHub issues/PRs"
    trigger: on_schedule, on_event
    schedule: "every 30 minutes"
    events: [issue.opened, pr.opened, issue.labeled]
    
  code-reviewer:
    mode: regular
    category: review
    description: "Code review with feedback"
    required_context: [code_diff, feature_description]
    output_format: markdown
    escalation_path: [security_reviewer, architecture_reviewer]

  phase-progression:
    mode: mode
    category: automation
    description: "Update project phase"
    trigger: on_label_change, on_pr_event
    state_machine:
      states: [specification, implementation, testing, deployment, completed]
      transitions:
        specification: [implementation]
        implementation: [testing, deployment]
        testing: [deployment]
        deployment: [completed]
        completed: [archived]
```

---

## Agent Development Guide

### Creating a New Agent

1. **Define Purpose**: What problem does it solve?
2. **Choose Mode**: Regular (interactive) or Mode (automated)?
3. **Document Interface**: Input, output, examples
4. **Create File**: `agents/{category}/{name}.agent.md`
5. **Register**: Add to `.config.yml`
6. **Test**: Verify with sample inputs
7. **Document**: Add to this architecture file

### Agent Frontmatter Template

```yaml
---
name: "Agent Name"
description: "What this agent does"
version: "1.0.0"
category: "planning|task|review|integration|reporting|automation"
mode: "regular|mode"  # interactive vs. automated
trigger: "manual|on_schedule|on_event"  # for mode agents
events: ["issue.opened", "pr.labeled"]  # for event-driven
schedule: "0 */4 * * *"  # for scheduled mode agents
input_schema:
  - name: "parameter_name"
    type: "string|object|array"
    required: true
    description: "What this parameter does"
output_schema:
  - name: "output_name"
    type: "string|object"
    description: "What this outputs"
dependencies:
  - other-agent-name  # agents this depends on
related_issues: ["#1234", "#5678"]
last_updated: "2026-09-03"
owner: "Team Name"
---
```

---

## Best Practices

### For Agent Users

1. **Select Correct Mode**
   - Regular agents for decisions, feedback, planning
   - Mode agents for background automation
   
2. **Provide Complete Context**
   - More context = better output
   - Include constraints, examples, style guides
   
3. **Iterate & Refine**
   - First output is rarely perfect
   - Ask clarifying questions, refine output
   
4. **Validate Results**
   - Always review agent output before applying
   - Trust but verify

### For Agent Developers

1. **Keep Single Responsibility**
   - One agent per clear purpose
   - Use orchestration for complex workflows

2. **Document Well**
   - Include examples in agent file
   - Document assumptions and constraints

3. **Test Thoroughly**
   - Test with edge cases
   - Validate outputs

4. **Version & Maintain**
   - Update `last_updated` field
   - Track breaking changes in README

---

## Common Patterns & Anti-Patterns

### ✅ Good: Task-Specific Agents
```yaml
# Good: Focused responsibility
agents:
  - security-reviewer (focused on security)
  - performance-reviewer (focused on perf)
  - documentation-reviewer (focused on docs)
```

### ❌ Bad: Do-Everything Agents
```yaml
# Bad: Too many responsibilities
agents:
  - super-reviewer (tries to review code, security, perf, docs, architecture)
```

### ✅ Good: Clear Mode Selection
```yaml
# Good: Correct mode for use case
issue.opened → phase-progression (mode agent, automatic)
user: "help me plan" → task-planner (regular, interactive)
```

### ❌ Bad: Wrong Mode
```yaml
# Bad: Regular agent for automation would require human approval
automated workflow → code-reviewer (regular) # blocks workflow
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Agent doesn't exist | Referenced wrong location | Check `agents/` canonical location |
| Mode agent not running | Wrong event trigger | Verify event name in `.config.yml` |
| Agent output is generic | Insufficient context | Provide more details, examples |
| Agents conflicting | Multiple agents doing same thing | Check for duplicates, consolidate |
| Agent chain breaks | Dependency missing | Verify all upstream agents exist |

---

**Last Updated**: 2026-09-03  
**Total Agents**: 40+ (consolidated)  
**Canonical Location**: `agents/`  
**Related**: [SCRIPT_ARCHITECTURE.md](./SCRIPT_ARCHITECTURE.md), [WORKFLOW_ARCHITECTURE.md](./WORKFLOW_ARCHITECTURE.md)
