---
title: "Agent Prompt Instructions Index"
description: "Canonical index for all LightSpeedWP agent specifications and agent-driven automation standards."
version: "1.2"
apply_to: "all repositories"
last_updated: "2025-10-22"
owners: ["LightSpeedWP Automation Team"]
references:
  - "./workflows.instructions.md"
  - "./automation-testing.instructions.md"
  - "./coding-standards.instructions.md"
  - "./tests.instructions.md"
  - "./naming-conventions.instructions.md"
  - "https://docs.github.com/en/copilot/customizing-copilot/adding-organization-custom-instructions-for-github-copilot"
---

# Mission

Provide guidance on designing, implementing and testing AI agents and their workflows within the LightSpeed ecosystem.

# Design Principles

- **Define clear capabilities**: list the tasks the agent can perform and the tools it can call.
- **Register tools**: expose only the necessary APIs and commands. Avoid granting unnecessary permissions.
- **Set guardrails**: enforce constraints on data access, execution scope and external calls.

# Testing & Evaluation

- Write **unit tests** for each tool invocation, mocking responses where possible.
- Develop **scenario tests** that simulate real workflows, including error conditions and timeouts.
- Use golden files or snapshot testing to compare expected outputs.
- Capture and review trace logs to understand the agent’s decision‑making.

# Workflows Integration

- Integrate agents into GitHub Actions by triggering them in appropriate jobs (e.g. code review agents on pull requests).
- Ensure agents run in isolated environments and respect runtime limits.

# References

- <https://devblogs.microsoft.com/foundry/introducing-microsoft-agent-framework-the-open-source-engine-for-agentic-ai-apps/>
- <https://devblogs.microsoft.com/dotnet/introducing-microsoft-agent-framework-preview/>
- <https://github.com/luisquintanilla/hello-world-agents>
- <https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent>
- <https://docs.github.com/en/copilot/concepts/extensions/agents>
- <https://docs.github.com/en/copilot/concepts/agents/coding-agent>
- <https://docs.github.com/en/copilot/concepts/agents/code-review>
- <https://docs.github.com/en/copilot/concepts/agents>
- <https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent>
- <https://github.blog/ai-and-ml/github-copilot/how-to-build-reliable-ai-workflows-with-agentic-primitives-and-context-engineering/>

# Prompt Instructions Index

This is the canonical index for all LightSpeedWP agent specifications and related automation governance.

Each agent is:

- Canonically documented in an `.github/agents/*.prompt.md` file in this folder.
- Aligned with one or more GitHub workflows, and mapped to a clear automation purpose.
- Versioned, auditable, and discoverable via this dynamic index.

> All files matching `.github/agents/*.prompt.md` in this folder are dynamically indexed here and are considered canonical for LightSpeedWP automation.

---

## Prompt Instructions

- [release.prompt.md](./agents/release.prompt.md)
  *Release Agent Prompt: Drives release automation, changelog, versioning, and publishing.*

- [planner.prompt.md](./agents/planner.prompt.md)
  *Planner Agent Prompt: Manages PR checklists, merge readiness, and process analytics.*

- [reviewer.prompt.md](./agents/reviewer.prompt.md)
  *Reviewer Agent Prompt: Summarizes PR/CI status, review requirements, and reviewer guidance.*

- [labeling.prompt.md](./agents/labeling.prompt.md)
  *Labels/Issues/PRs Agent Prompt: Automates labeling, status, and changelog management for issues and PRs.*

- [project-meta-sync.prompt.md](./agents/project-meta-sync.prompt.md)
  *Project Meta Sync Agent Prompt: Syncs GitHub Project board fields with issue/PR metadata and labels.*

<!-- Add new agent instruction files here as they are created. -->

---

## Testing & Includes

- **All automation agent and utility tests are located in `.github/agents/__tests__/` and follow the naming convention `{module}.test.js`.**
- See [automation-testing.instructions.md](./automation-testing.instructions.md) and [tests.instructions.md](./tests.instructions.md) for org-wide test strategy, structure, and naming conventions.
- All shared JS modules/utilities for agents are stored in `.github/agents/includes/`.

---

## Coding Standards & Naming

- All agent and utility code must follow [coding-standards.instructions.md](./coding-standards.instructions.md).
- See [naming-conventions.instructions.md](./naming-conventions.instructions.md) for org-wide rules governing file, folder, function, class, and configuration naming patterns.

---

## Contribution & Reciprocation

- Whenever adding or updating an agent, always create or update its corresponding `*.instructions.md` file and related tests.
- Every agent referenced in a workflow must have a reciprocal agent specification file.
- Review [coding-standards.instructions.md](./coding-standards.instructions.md) and [tests.instructions.md](./tests.instructions.md) before submitting PRs.

# File Management Guidelines for Copilot Agents

## Purpose

This document provides clear guidelines for where and how to organize temporary processing files, permanent reports, and documentation artifacts generated by Copilot agents during repository operations.

---

## Quick Reference: Folder Purposes

| Folder         | Purpose                                        | Lifetime                | Examples                                                               |
| -------------- | ---------------------------------------------- | ----------------------- | ---------------------------------------------------------------------- |
| **`reports/`** | Permanent documentation & analysis results     | Long-term (permanent)   | Completion summaries, analysis reports, baselines, impact matrices     |
| **`tmp/`**     | Temporary processing files & working documents | Short-term (hours-days) | Intermediate outputs, processing logs, draft reports, working analysis |
| **Root**       | Special files for workflow tracking            | Session-based           | `Copilot-Processing.md`, critical status files                         |

---

## Folder Usage Guidelines

### 📊 `reports/` Folder - Permanent Documentation

**Location**: `/Users/ash/Studio/.github/reports/`

**Purpose**: Store finalized, permanent documentation that should be version-controlled and referenced long-term.

**When to Use**:

- Final reports and analysis summaries
- Completion status documents
- Baseline data and benchmarks
- Decision records and architectural documentation
- Planning documents that serve as references
- Impact analysis and metrics reports

**Naming Convention**:

```
reports/
├── completion-summary.md              # Project/phase completion
├── wave-{n}-plan.md                  # Planning documents
├── eslint-baseline.json              # Baseline data
├── eslint-impact-matrix.json         # Impact analysis
├── {topic}-analysis-{date}.json      # Time-stamped analyses
└── README.md                         # Folder index (optional)
```

**Lifecycle**:

1. Create in `tmp/` during processing
2. Finalize and move/copy to `reports/`
3. Commit to version control
4. Archive or maintain based on retention policy

**Examples in Repo**:

- ✅ `eslint-baseline-post-wave-1.json` - Wave 1 baseline results
- ✅ `eslint-impact-matrix.json` - ESLint impact analysis
- ✅ `wave-1-plan.md` - Planning documentation
- ✅ `eslint-taxonomy.json` - Categorization/taxonomy reference

---

### 📝 `tmp/` Folder - Temporary Processing Files

**Location**: `/Users/ash/Studio/.github/tmp/`

**Purpose**: Store intermediate, working documents generated during Copilot operations that are typically temporary.

**When to Use**:

- Intermediate analysis outputs during processing
- Working documents while developing solutions
- Draft versions before finalization
- Processing logs and intermediate calculations
- Scratch work and temporary experiments
- Multi-step workflow artifacts (between steps)

**Naming Convention**:

```
tmp/
├── processing-{phase}-{timestamp}.json      # Phase-based processing
├── draft-{document-name}-{date}.md          # Draft documents
├── analysis-working-{topic}.json            # Working analysis
├── {workflow-id}-step-{n}.json              # Multi-step workflow
└── temp-{short-description}.txt             # Quick temporary files
```

**Lifecycle**:

1. Created during Copilot processing
2. Used for intermediate calculations/analysis
3. **Either**:
   - Moved/promoted to `reports/` if result should be permanent
   - Deleted after workflow completion if truly temporary
4. Never committed to version control (typically in `.gitignore`)

**Cleanup Policy**:

- **After Workflow**: Delete temporary working files
- **After Analysis**: Move valuable results to `reports/`
- **Weekly Maintenance**: Clean up abandoned/stale files
- **Size Management**: Delete large intermediate files after extraction of results

**Example Usage Patterns**:

```
# During multi-step analysis:
tmp/analysis-step-1-raw-data.json
tmp/analysis-step-2-processed.json
tmp/analysis-step-3-aggregated.json
↓ (final results moved to reports/)
reports/analysis-final-summary.json

# During troubleshooting:
tmp/debug-test-run-2025-01-22.log
tmp/debug-hypothesis-v1.md
↓ (if solution found, document moved to reports/)
↓ (if not useful, deleted)

# Drafts before finalization:
tmp/draft-feature-spec-v1.md
tmp/draft-feature-spec-v2.md
↓ (final version moved to permanent location)
reports/feature-spec-final.md
```

---

## Root-Level Special Files

**Location**: `/Users/ash/Studio/` (repository root)

**Files**:

- `Copilot-Processing.md` - Tracks active Copilot workflow and task status

**Purpose**: Session-level workflow tracking for the current operation

**Lifecycle**:

1. Created at start of major Copilot operation
2. Updated throughout operation with status/progress
3. Finalized with completion summary
4. Often moved to `reports/` for archival after completion

**Content**:

- User request details
- Action plan and task list
- Phase completion tracking
- Final summary and outcomes

---

## File Organization Decision Tree

Use this flowchart to determine where to place a file:

```
START: New file generated
   ↓
   Is this a FINAL, permanent result?
   ├─ YES → reports/ folder
   │        (completed analysis, final docs, baselines)
   │
   └─ NO → Is this a working/intermediate file?
           ├─ YES → tmp/ folder
           │        (drafts, processing steps, working docs)
           │
           └─ MAYBE → Will I need this later?
                      ├─ YES → reports/ folder (move when finalized)
                      └─ NO → tmp/ folder (delete after workflow)
```

---

## Workflow Examples

### Example 1: Complete Analysis → Report

```
Task: Perform comprehensive code analysis

Step 1: Create in tmp/ while working
  tmp/analysis-raw-eslint-output.json
  tmp/analysis-categorized.json
  tmp/analysis-working-notes.md

Step 2: Finalize results
  tmp/analysis-complete-draft.md

Step 3: Move to reports/
  reports/analysis-final-2025-01-22.json
  reports/analysis-complete.md

Step 4: Clean up tmp/
  Delete intermediate files
```

### Example 2: Troubleshooting Session

```
Task: Debug failing tests

Step 1: Create debugging files in tmp/
  tmp/test-failure-logs-run-1.txt
  tmp/debug-hypothesis-v1.md
  tmp/debug-test-output-v2.txt

Step 2: Found solution
  Create permanent fix in reports/
  reports/test-failure-analysis.md

Step 3: Clean up tmp/
  Delete all debug files (no longer needed)
```

### Example 3: Multi-Phase Project

```
Task: Execute 3-phase system improvement

Phase 1 Output:
  reports/phase-1-completion-summary.md
  reports/phase-1-baseline.json

Phase 2 Working Files:
  tmp/phase-2-processing-step-1.json
  tmp/phase-2-processing-step-2.json
  tmp/phase-2-analysis-draft.md

Phase 2 Final Output:
  reports/phase-2-completion-summary.md
  reports/phase-2-impact-analysis.json

Phase 3 (in progress):
  tmp/phase-3-working.md
  (...)

Cleanup:
  Delete all files in tmp/ after project completion
```

---

## Naming Conventions

### For `reports/` Permanent Files

**Format**: `{topic}-{type}-{date/version}.{ext}`

**Examples**:

- `completion-summary.md` - Simple completion summaries
- `eslint-analysis-wave-1.json` - Wave-based deliverables
- `test-failure-analysis-2025-01-22.md` - Timestamped analysis
- `architecture-baseline.json` - Baseline references
- `phase-1-plan.md` - Phase documentation

### For `tmp/` Temporary Files

**Format**: `{workflow}-{step}-{date}-{description}.{ext}`

**Examples**:

- `processing-step-1-2025-01-22.json` - Step-based processing
- `draft-feature-spec-v2.md` - Draft versions
- `analysis-working-eslint.json` - Working analysis
- `debug-test-output.log` - Debug/diagnostic
- `temp-calculation.json` - Quick temporary

---

## Cleanup and Maintenance

### Automatic Cleanup Schedule

**Daily**:

- Monitor `tmp/` folder size
- Delete obviously stale files (> 7 days old)

**Weekly**:

- Archive completed workflow artifacts to `reports/`
- Clean up all temporary files from completed tasks
- Review `tmp/` for any accidentally committed files

**Monthly**:

- Archive `reports/` older files if retention policy exceeded
- Review folder structure for organization
- Update this documentation if patterns change

### Manual Cleanup Commands

```bash
# View tmp folder contents and sizes
ls -lh .github/tmp/

# Delete specific temporary files
rm .github/tmp/draft-*.md
rm .github/tmp/temp-*.json

# Archive old files
mv .github/tmp/analysis-*.json .github/reports/archived/

# Clear all tmp (use with caution!)
rm -rf .github/tmp/*
mkdir -p .github/tmp
touch .github/tmp/.gitkeep
```

---

## Git Configuration

### .gitignore Setup

Ensure `tmp/` folder is ignored in version control:

```bash
# In .gitignore:
.github/tmp/
.github/tmp/*
!.github/tmp/.gitkeep
```

### For Important Temporary Files

If a temporary file needs version control:

1. Move it to `reports/` with a clear naming convention
2. Update `.gitignore` to allow it
3. Document why it needs version control

---

## Best Practices

✅ **DO**:

- Move finalized results from `tmp/` to `reports/`
- Use consistent naming conventions
- Document what each file contains
- Delete `tmp/` files after workflow completion
- Keep `reports/` organized with clear folder structure
- Use timestamps for time-sensitive documents

❌ **DON'T**:

- Leave temporary files in `tmp/` indefinitely
- Commit large intermediate files to version control
- Mix permanent and temporary files without clear separation
- Use vague names like `temp.json` or `data.txt`
- Store sensitive data in temporary files
- Forget to clean up after completing workflows

---

## References

- [Copilot Processing Workflow](../../Copilot-Processing.md)
- [Repository Organization Guide](.././ORGANIZATION.md)
- [File Naming Conventions](../naming-conventions.instructions.md)
- [Workspace Architecture](../README.md)

---

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
