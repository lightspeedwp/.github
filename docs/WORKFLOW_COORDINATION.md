---
title: "Workflow Coordination Patterns"
description: "Canonical reference for GitHub Actions workflow patterns: always-run vs. agent-triggered, coordination between agents and workflows, and orchestration strategies."
created_date: "2026-05-28"
last_updated: "2026-07-30"
version: "v1.1.6"
file_type: "documentation"
maintainer: "LightSpeed Team"
tags: ["workflows", "automation", "agents", "coordination", "ci-cd"]
---

# Workflow Coordination Patterns

This document defines the canonical patterns for coordinating GitHub Actions workflows with LightSpeed AI agents. It clarifies which workflows run automatically versus those that require agent invocation, and establishes clear contracts for orchestration.

---

## Overview

The LightSpeed automation system uses **two complementary workflow execution patterns**:

1. **Always-Run Workflows** — Trigger automatically on code events; require no agent coordination
2. **Agent-Triggered Workflows** — Require manual dispatch or agent invocation via `workflow_call`

Understanding these patterns ensures reliable automation, prevents redundant/conflicting executions, and enables agents to coordinate complex multi-step processes.

---

## Pattern 1: Always-Run Workflows (Automatic)

Always-run workflows trigger automatically on push/PR events without agent involvement. They enforce quality gates and are **never manually dispatched**.

### Characteristics

- **Trigger**: Push, pull_request, or issue/discussion events
- **Agent Involvement**: None (automatic)
- **Manual Dispatch**: ❌ Not available
- **Purpose**: Quality enforcement, validation, metadata enrichment
- **Blocking**: Typically blocks merge until passing

### Always-Run Workflow Registry

| Workflow | Trigger Event(s) | Purpose | Blocks Merge? |
| --- | --- | --- | --- |
| `checks.yml` | push/PR on develop | Unified linting + testing + validation | ✅ Yes |
| `changelog-validate.yml` | PR to develop | Validate CHANGELOG.md entries | ✅ Yes |
| `labeling.yml` | issue/PR/discussion events | Auto-apply canonical labels | ❌ No (metadata only) |
| `issues.yml` | issue opened/edited | Validate issue templates | ❌ No (validation only) |
| `meta.yml` | PR opened/issues | Apply frontmatter validation | ❌ No (metadata only) |
| `metadata-governance.yml` | issues / pull_request_target | Assign assignees, milestones, and relationship metadata | ❌ No (metadata only) |
| `project-meta-sync.yml` | issues / pull_request | Sync GitHub Project board fields | ❌ No (metadata only) |
| `readme-regen.yml` | push/PR on `.md` files | Validate/regenerate README indices | ❌ No (informational) |

**Note (Phase 4 - 2026-07-30):** All workflows listed above use safe shell patterns (helper scripts instead of multiline control-flow) as of Phase 4 refactoring. See [WORKFLOW-REFACTORING-GUIDE.md](./WORKFLOW-REFACTORING-GUIDE.md) for implementation details.

### When to Use

- Enforce consistency (linting, formatting)
- Validate code quality (tests, coverage)
- Enrich metadata (labels, frontmatter)
- Regenerate derived artifacts (README indices)

### When NOT to Use

- Complex orchestration requiring conditional steps
- Tasks that need human/agent approval
- Processes that should only run on demand
- Multi-repository coordination

---

## Pattern 2: Agent-Triggered Workflows (Manual/Dispatch)

Agent-triggered workflows are invoked **on demand** via `workflow_dispatch` or called by other workflows using `workflow_call`. They enable complex, conditional logic and agent orchestration.

### Characteristics

- **Trigger**: `workflow_dispatch` (manual button) or `workflow_call` (from other workflows)
- **Agent Involvement**: Agents invoke via dispatch or call
- **Manual Dispatch**: ✅ Available (for testing/override)
- **Purpose**: Complex tasks, releases, reports, reviews
- **Blocking**: Typically informational or optional

### Agent-Triggered Workflow Registry

| Workflow | Primary Trigger | Agent/Caller | Purpose |
| --- | --- | --- | --- |
| `release.yml` | workflow_dispatch + workflow_call | Release Agent | Orchestrate semantic versioning, tag, publish |
| `planner.yml` | workflow_dispatch | Planner Agent | Generate implementation plans |
| `reporting.yml` | workflow_dispatch | Reporting Agent | Generate audit/metric reports |
| `reviewer.yml` | workflow_dispatch (manual) | Reviewer Agent | Post PR review summaries |
| `metrics.yml` | workflow_dispatch ± scheduled | Metrics Agent | Collect repo health metrics |
| `readme-update.yml` | workflow_dispatch + workflow_call | Release Agent (post-release) | Apply README & Mermaid diagram fixes |
| `issue-create-from-template.yml` | workflow_dispatch | Issue Agent / LLM caller | Create issues from canonical numbered templates before the issue exists |
| `checklist-finalisation.yml` | issues.closed / pull_request_target.closed | Workflow backstop | Finalise checklists in closed issues and merged PRs |

### When to Use

- Complex orchestration (multiple conditional steps)
- Agent-coordinated processes
- On-demand reporting or analysis
- Multi-step releases or deployments
- Tasks requiring human approval

### When NOT to Use

- Simple quality checks (use always-run pattern)
- Time-critical validations (could have latency)
- Automatic enforcement (use always-run pattern)

---

## Pattern 3: Agent-Orchestrated Workflows (Coordinated Sequences)

The most sophisticated pattern uses **one agent as an orchestrator** that calls multiple workflows in sequence, validating outputs and deciding the next step.

### Example: Release Agent Orchestration

The **Release Agent** coordinates a sequence of workflows:

```
Release Agent (Orchestrator)
  ├─ Pre-Release Tasks
  │  ├─ Invoke: checks.yml (unified linting + testing quality gate)
  │  ├─ Invoke: validate.yml (schema + structure validation)
  │  └─ Validate: All checks pass
  ├─ Release Execution
  │  ├─ Invoke: release.yml (with workflow_call)
  │  │  └─ Creates tag, publishes release
  │  └─ Validate: Tag created, release published
  └─ Post-Release Tasks
     ├─ Invoke: readme-regen.yml (if version bumps README)
     ├─ Invoke: reporting.yml (generate release report)
     └─ Notify: Release complete
```

### Orchestrator Pattern Rules

1. **Call Sequence**: Orchestrator calls workflows in logical order
2. **Validation**: Check each workflow output before proceeding
3. **Fallback**: Define behavior if a workflow fails
4. **Idempotency**: Ensure repeated calls are safe
5. **Notifications**: Communicate status to users/channels

---

## Implemented Workflows (Wave 3C & Beyond)

Wave 3C (Workflow & Agent Coordination Setup) introduces new agent-triggered workflows for README management:

### `readme-update.yml`

**Trigger**: `workflow_dispatch` (manual) or `workflow_call` (from Release Agent)

**Purpose**: Apply automated fixes to README files and embedded Mermaid diagrams

**Capabilities**:

- Fix Mermaid diagram formatting and add accessibility attributes (`accTitle`, `accDescr`)
- Update stale frontmatter dates for files exceeding 6-month threshold
- Support selective scope: `all` (default), `mermaid` (diagrams only), or `staleness` (dates only)
- Dry-run mode for safe preview before applying changes
- Generate audit report with change summary

**Input Parameters**:

- `scope`: "all" | "mermaid" | "staleness" (default: "all")
- `dry_run`: "true" | "false" (default: "false" — applies changes)

**Output**:

- Updated README files (if not dry-run)
- Report: `.github/reports/mermaid-audit/update-report.md`
- Artifact: `readme-update-report` (always)

**Integration Points**:

- Called by Release Agent in post-release phase
- Can be manually triggered via GitHub UI for ad-hoc updates
- Non-blocking: failures do not prevent release completion

**Example Release Agent Invocation**:

```yaml
- name: Apply README updates
  uses: actions/workflow_dispatch@v4
  with:
    workflow: readme-update.yml
    ref: main
    inputs:
      scope: all
      dry_run: 'false'
```

---

## Workflow Execution Flow Diagram

```text
GitHub Event
    ↓
┌─────────────────────────────────────┐
│   Always-Run Workflows Trigger?     │
│   (push/PR/issue/discussion)        │
└────────────┬────────────────────────┘
             │
             ├─► YES: Execute linting, testing, validation workflows
             │         (auto-run, enforce quality gates)
             │
             └─► NO: Check for agent dispatch request
                    ↓
             ┌─────────────────────────────────────┐
             │   Agent-Triggered Workflow?         │
             │   (workflow_dispatch or workflow_call)
             └────────────┬────────────────────────┘
                          │
                          ├─► YES: Execute complex orchestration
                          │         (agent calls sequence of workflows)
                          │
                          └─► NO: No automation triggered
```

---

## Decision Tree: Which Pattern to Use?

```text
START: New automation task
  │
  ├─► Is it a quality check? (lint, test, validate)
  │   └─► Always-Run Pattern ✅
  │
  ├─► Does it need to run on every push/PR?
  │   └─► Always-Run Pattern ✅
  │
  ├─► Does it require complex conditional logic?
  │   └─► Agent-Triggered Pattern ✅
  │
  ├─► Should it only run on demand?
  │   └─► Agent-Triggered Pattern ✅
  │
  ├─► Does an agent need to coordinate multiple workflows?
  │   └─► Agent-Orchestrated Pattern ✅
  │
  └─► If none of the above:
      └─► Reconsider the requirement
```

---

## Key Principles

### 1. Avoid Duplicate Enforcement

**Rule**: Don't run the same check in both always-run and agent-triggered workflows.

**Example** ❌ BAD:

```yaml
# Always-run
checks.yml: runs on push (unified linting + testing + validation)

# Agent-triggered
review.yml: calls linting again before review
```

**Example** ✅ GOOD:

```yaml
# Always-run
checks.yml: runs on push (enforces quality)

# Agent-triggered
reviewer.yml: trusts that checks passed, focuses on code review
```

### 2. Always-Run Takes Priority

**Rule**: If a workflow can run automatically, configure it as always-run. Reserve agent-triggered for coordination.

**Why**: Reduces latency, provides immediate feedback, doesn't depend on agent availability.

### 3. Use `workflow_call` for Orchestration

**Rule**: When an agent needs to invoke a workflow, use `workflow_call` instead of embedding logic.

**Example** ✅ GOOD:

```yaml
# Release Agent (Copilot)
release_agent.py:
  → calls: release.yml via workflow_call
  → validates output
  → proceeds to post-release tasks

# release.yml
uses: ./.github/workflows/release.yml
with:
  version: "1.2.3"
  ...
```

### 4. Document Workflow Dependencies

**Rule**: Always document which workflows call which, and in what order.

**Output**: This document (workflow-coordination.md)

---

## Coordination Contracts

### Release Workflow Contract

**Invoker**: Release Agent

**Pre-conditions**:

- [ ] All tests passing
- [ ] All linting checks passing

- [ ] Changelog updated
- [ ] Version bump ready

**Workflow Steps**:

1. Create tag with version
2. Generate release notes

3. Publish GitHub Release
4. Notify stakeholders

**Post-conditions**:

- [ ] Tag exists in repo
- [ ] Release published on GitHub

- [ ] Release notes generated
- [ ] All stakeholders notified

**Failure Handling**:

- [ ] Rollback tag creation if release fails
- [ ] Notify Release Agent of failure

- [ ] Require manual intervention

### README Audit Workflow Contract

**Invoker**: README Review Agent (Wave 3)

**Pre-conditions**:

- [ ] All 44 README files identified
- [ ] Audit scope defined (syntax, accessibility, staleness)

**Workflow Steps**:

1. Scan all README files
2. Extract Mermaid diagrams

3. Validate syntax
4. Check WCAG compliance
5. Assess staleness
6. Generate audit report

**Post-conditions**:

- [ ] Audit report generated
- [ ] CSV inventory created

- [ ] Findings categorized by priority

**Failure Handling**:

- [ ] Log errors per file
- [ ] Continue scanning remaining files

- [ ] Report partial results

---

## Testing & Validation

### For Always-Run Workflows

1. **Test locally**: Verify linting/testing passes on feature branch
2. **Verify on PR**: Ensure workflow triggers and passes
3. **Verify blocking**: Confirm merge is blocked until passing
4. **Test failure**: Confirm failure blocks merge appropriately

### For Agent-Triggered Workflows

1. **Test dispatch**: Manually trigger workflow via GitHub UI
2. **Test agent call**: Verify agent can invoke via `workflow_call`
3. **Test orchestration**: Verify sequence and validation logic
4. **Test failure recovery**: Confirm rollback/fallback behavior

---

## Troubleshooting

### Workflow Won't Trigger

**Symptom**: Expected workflow didn't run on push

**Diagnosis**:

- Check trigger conditions in workflow file
- Verify file path matches trigger filter (e.g., `paths: ['src/**']`)

- Confirm branch matches (`on: { push: { branches: [develop] } }`)
- Check if another required status check is failing

**Fix**: Review workflow YAML syntax, enable workflow, verify permissions

### Duplicate Executions

**Symptom**: Same workflow running multiple times on one push

**Diagnosis**:

- Check for multiple trigger events (`on: [push, pull_request]`)
- Verify no overlapping agent dispatch + always-run triggers

- Check for circular workflow_call dependencies

**Fix**: Consolidate triggers, use conditional logic to prevent duplicates

### Agent Can't Invoke Workflow

**Symptom**: Agent dispatch call fails with "workflow not found"

**Diagnosis**:

- Verify workflow file exists and is enabled
- Check workflow has `workflow_dispatch` or `workflow_call` trigger

- Verify permissions (agent has repo access)
- Check branch/ref is correct

**Fix**: Enable workflow, add `workflow_dispatch`, verify permissions

---

## References

- [Next Issues Execution Plan](../.github/projects/active/next-issues-execution-plan.md) — Overall roadmap
- [Workflow Instructions](../instructions/workflows.instructions.md) — Workflow authoring standards
- [GitHub Actions Documentation](https://docs.github.com/en/actions) — Official reference
- [Release Agent Specification](../.github/agents/release.agent.md) — Release orchestration contract
- [Workflow Files](../workflows/) — Repository workflow implementations

---

## Version History

| Version | Date | Author | Changes |
| --- | --- | --- | --- |
| v1.0.0 | 2026-05-28 | Codex | Initial release: Always-run, agent-triggered, and orchestrated patterns |

---

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
