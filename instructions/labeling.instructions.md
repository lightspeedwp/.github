---
applyTo: "**"
description: "Canonical instructions for the unified labeling automation system. Describes mission, strategy, configuration, and best practices for label management across issues, PRs, and discussions."
---

# Unified Labeling Agent Instructions

You are a unified labelling automation assistant. Follow our config-driven labelling framework to apply and enforce canonical labels across issues, PRs, and discussions. Avoid hardcoded label logic, non-canonical names, or bypassing one-hot constraints unless explicitly justified.

## Overview

Applies to labelling automation across issues, PRs, and discussions. Covers mission, strategy, execution flow, config files, and best practices. Excludes manual triage policies outside the documented label families.

## General Rules

- Use the canonical YAML configs (`labels.yml`, `labeler.yml`, `issue-types.yml`) as the single source of truth.
- Enforce one-hot constraints for `status:*`, `priority:*`, and `type:*`.
- Standardise labels to canonical names; avoid hardcoded logic.
- Generate audit reports as part of automation.

## Detailed Guidance

- Follow the Mission, Strategy, Process, and Configuration sections below.
- Use the execution flow to structure automation and reporting.

## Examples

- **Good:** Apply `type:feature`, `status:needs-review`, `priority:normal` via branch + file rules; migrate `enhancement` to `type:feature` using aliases.
- **Avoid:** Adding labels not defined in `labels.yml` or leaving multiple `status:*` labels on an item.

## Validation

- Validate YAML configs against schemas where provided.
- Run labeling workflow dry-runs when adding new rules.
- Check audit reports for one-hot enforcement and alias migrations.

## Mission

Automate the application, enforcement, and standardization of labels across issues, pull requests, and discussions. The unified labeling system uses a config-driven architecture where three canonical YAML files define all labeling logic, eliminating hardcoded rules and ensuring consistency across the organization.

## Strategy

The labeling system operates on two complementary principles:

1. **Config-Driven Architecture**: All labeling rules, definitions, and type mappings are stored in three canonical YAML files (not in code):
   - `.github/labels.yml` — Canonical label definitions (names, colors, descriptions, aliases)
   - `.github/labeler.yml` — Pattern-to-label rules (branch prefixes, file paths)
   - `.github/issue-types.yml` — Issue template type-to-label mappings

2. **Agent-Driven Automation**: A unified agent (`labeling.agent.md`, `labeling.agent.js`) orchestrates all labeling tasks:
   - Fetches rules from canonical configuration files
   - Applies labels based on file changes, branch patterns, and content heuristics
   - Enforces one-hot constraints (exactly one `status:*`, `priority:*`, and `type:*` per issue/PR)
   - Standardizes non-canonical labels to match the canonical set
   - Generates audit reports and optional GitHub artifacts

## Process

The labeling system follows this 7-step execution flow:

1. **Triggered**: GitHub Actions workflow (`labeling.yml`) detects issue, PR, or discussion event
2. **Fetch Config**: Agent fetches canonical rules from three YAML files
3. **Analyze**: Determine which labels should apply based on:
   - File changes (via `labeler.yml` patterns)
   - Branch names (via `labeler.yml` branch patterns)
   - Issue type or template (via `issue-types.yml`)
   - Content heuristics (commit messages, issue body, PR description)
4. **Apply**: Add labels that match canonical set in `labels.yml`
5. **Enforce**: Remove conflicting labels (e.g., ensure only one `status:*`)
6. **Standardize**: Migrate non-canonical labels to canonical equivalents (using aliases if defined)
7. **Report**: Generate audit summary and optionally commit to repository

## Configuration Files (Single Source of Truth)

### `.github/labels.yml`

**Location**: `.github/labels.yml` (formerly stored in the retired automation folder)

**Purpose**: Master registry of all labels used in the organisation.

**Structure**:

- Each label is defined with `name`, `color`, and `description`
- Labels are organised by category (status, priority, type, area, meta, release, etc.)
- Optional `aliases` field maps legacy label names to canonical versions for migration
- No label is created or used outside this file

**Key Categories**:

- **Status** (`status:*`) — Workflow progression (needs-triage, in-progress, done, blocked)
- **Priority** (`priority:*`) — Urgency scale (critical, important, normal, minor)
- **Type** (`type:*`) — Work classification (bug, feature, documentation, test, refactor, etc.)
- **Area** (`area:*`) — Codebase surfaces (block-editor, theme, ci, documentation, etc.)
- **Component** (`comp:*`) — Specific subsystems (block-inserter, pattern-library, etc.)
- **Meta** (`meta:*`) — Housekeeping signals (needs-changelog, stale, has-pr, etc.)
- **Release** (`release:*`) — Semantic versioning scope (patch, minor, major, hotfix)
- **Language** (`lang:*`) — Code language tags (php, js, css, etc.)
- **Discussion** (`discussion:*`) — Community categories (announcement, showcase, support, etc.)
- **AI Ops** (`ai-ops:*`) — Automation tracking (agents, instructions, prompts, tools)
- **Contributor** (`contrib:*`) — Contributor workflow (good-first-issue, help-wanted)
- **Compatibility** (`compat:*`) — Version/platform compatibility (wordpress, woocommerce, php, etc.)

**Example Label Definition**:

```yaml
- name: status:needs-review
  color: BFD4F2
  description: "Awaiting code review"
```

**Example with Alias** (for migration):

```yaml
- name: type:feature
  color: 3FB950
  description: "Feature or enhancement"
  aliases: ["enhancement", "feature-request"] # Legacy names automatically migrated
```

### `.github/labeler.yml`

**Location**: `.github/labeler.yml` (formerly stored in the retired automation folder)

**Purpose**: Rules engine mapping file patterns and branch names to labels.

**Structure**:

- Each label can have `head-branch` patterns (branch name regex matching)
- Each label can have `changed-files` patterns (file path glob matching)
- Patterns are tested against each PR or push event
- Supports both `any-glob-to-any-file` (OR logic) and `all-globs-to-all-files` (AND logic)

**Common Patterns**:

- **Branch Prefixes**: `feat/*, fix/*, docs/*, chore/*, refactor/*, test/*, perf/*`
  - Maps to corresponding type labels (e.g., `feat/*` → `type:feature`)
  - Status labels (e.g., `feat/*` or `fix/*` → `status:needs-review`)
- **File Paths**: `src/blocks/**, **/theme.json, .github/workflows/**, docs/**`
  - Maps to area labels (e.g., `src/blocks/**` → `area:block-editor`)
  - Maps to language labels (e.g., `**/*.php` → `lang:php`)
- **Language Detection**: `**/*.{js,ts}`, `**/*.{css,scss}`, `**/*.php`
  - Automatically applied based on changed file extensions

**Example Rule**:

```yaml
"type:feature":
  head-branch: ["^feat/.*"]

"area:block-editor":
  changed-files:
    any-glob-to-any-file:
      - "src/blocks/**"
      - "**/block.json"
```

### `.github/issue-types.yml`

**Location**: `.github/issue-types.yml` (formerly stored in the retired automation folder)

**Purpose**: Maps issue template types to canonical label definitions.

**Structure**:

- Lists all supported issue types used in templates
- Each type has a `name`, `color`, and corresponding `label` field
- Used by issue creation workflow to pre-assign labels
- Provides consistent color/label mapping across templates

**Example Type Definition**:

```yaml
- name: Bug
  color: 9F3734
  label: type:bug
```

## Execution Flow Diagram

```
GitHub Event (issue/PR/discussion)
    ↓
labeling.yml Workflow Triggered
    ↓
Fetch Canonical Rules
├── labels.yml (definitions & aliases)
├── labeler.yml (branch & file patterns)
└── issue-types.yml (template mappings)
    ↓
Analyze Item
├── Check changed files (PRs)
├── Check branch name (PRs)
├── Check issue template type
└── Apply content heuristics
    ↓
Apply Matching Labels
├── Add canonical labels found
└── Respect existing labels
    ↓
Enforce Constraints
├── One-hot: Ensure exactly one status:*
├── One-hot: Ensure exactly one priority:*
└── One-hot: Ensure exactly one type:*
    ↓
Standardize Non-Canonical
├── Find aliases in labels.yml
└── Migrate legacy → canonical
    ↓
Generate Report
├── Audit log (what was applied/removed)
└── Optional: Commit to .github/reports/
    ↓
Complete
```

## Best Practices

**DO:**

- Always reference `.github/labels.yml` as the source of truth for label definitions
- Keep labeler rules in `.github/labeler.yml` simple and maintainable
- Use branch prefixes (`feat/`, `fix/`, `docs/`) consistently across the org
- Test new labeler rules in dry-run mode before committing
- Document complex labeling logic as comments in `labeler.yml`
- Log all labeling actions for audit trails
- Use aliases in `labels.yml` for graceful migration of legacy label names

**DON'T:**

- Don't create labels outside of `.github/labels.yml`
- Don't hardcode label lists in workflows or scripts
- Don't apply multiple `status:*` or `priority:*` labels (one-hot enforcement will correct)
- Don't create labels on-the-fly in GitHub UI (they won't be tracked in config)
- Don't apply non-canonical labels when canonical equivalents exist

## Guardrails

1. **Canonical Label Enforcement**: Only labels defined in `.github/labels.yml` are considered valid. Any non-canonical labels are logged as warnings.

2. **One-Hot Enforcement**: The agent ensures:
   - Exactly one `status:*` label per issue/PR (removes conflicts, applies default if missing)
   - Exactly one `priority:*` label per issue/PR (removes conflicts, applies default if missing)
   - Exactly one `type:*` label per issue/PR (removes conflicts)

3. **Dry-Run Mode**: Set `DRY_RUN=true` in workflow inputs to preview label changes without applying them

4. **User Override Respect**: If a user manually adds labels, the agent respects them unless they conflict with one-hot constraints

5. **Audit Trail**: All label changes are logged with reasons (file-based, branch-based, type-based, heuristic-based, or manual)

6. **Configuration Validation**: On every run, the agent validates that all rules in `labeler.yml` reference labels that exist in `labels.yml`

## Outputs

The labeling system produces:

1. **Updated Labels on Issue/PR**: Labels are applied based on rules and constraints
2. **Workflow Summary**: Logged to workflow run output showing which labels were applied/removed and why
3. **Optional Artifact**: If `report_commit=true`, an audit report is generated and committed to `.github/reports/labeling/`
4. **Audit Log**: Available in workflow logs for debugging and compliance

## Integration Points

| Component      | File                                                                 | Purpose                                |
| -------------- | -------------------------------------------------------------------- | -------------------------------------- |
| Agent Spec     | [../agents/labeling.agent.md](../agents/labeling.agent.md)      | Master specification and configuration |
| Workflow       | [.github/workflows/labeling.yml](../.github/workflows/labeling.yml)          | GitHub Actions automation trigger      |
| Labels         | [.github/labels.yml](../.github/labels.yml)                                  | Canonical label definitions            |
| Rules          | [.github/labeler.yml](../.github/labeler.yml)                                | Pattern-to-label mapping engine        |
| Types          | [.github/issue-types.yml](../.github/issue-types.yml)                        | Issue type to label mappings           |
| Implementation | `scripts/agents/labeling.agent.js`                                   | Main orchestration logic               |
| Tests          | `__tests__/labeling.agent.*.test.js`                                 | Unit and integration tests             |
| Strategy       | [docs/LABEL_STRATEGY.md](../docs/LABEL_STRATEGY.md)               | Label philosophy and strategy          |
| Governance     | [docs/AUTOMATION_GOVERNANCE.md](../docs/AUTOMATION_GOVERNANCE.md) | Organization automation policies       |

## Troubleshooting

**Q: Labels aren't being applied to my PR**

A: Check the following in order:

1. Verify the label is defined in `.github/labels.yml` (if not, add it)
2. Check `.github/labeler.yml` for matching rules (branch name or file path patterns)
3. If branch name pattern, verify your branch follows the expected convention (e.g., `feat/`, `fix/`)
4. Review workflow logs in GitHub Actions for the exact reason labels weren't applied
5. Test rule in dry-run mode to preview without applying

**Q: I see duplicate or conflicting labels**

A: This shouldn't happen with one-hot enforcement, but if it does:

1. Check if manually-applied label conflicts with rule-based labels
2. Run labeling workflow again (it will enforce constraints)
3. Review workflow logs to identify the conflict reason
4. If issue persists, check `.github/labeler.yml` for conflicting patterns

**Q: A label I added isn't in the canonical set**

A: All labels must be defined in `.github/labels.yml` first. To add a new label:

1. Add the label definition to `.github/labels.yml` with name, color, and description
2. Create labeler rules in `.github/labeler.yml` if the label should be auto-applied
3. Commit changes to repository
4. The agent will automatically use the new label in future runs

**Q: Why did my old label get replaced?**

A: The agent performs alias-based migration for legacy label names. If you see a label migration:

1. Check `.github/labels.yml` for `aliases` field in the new label definition
2. Your old label name is listed as an alias and was automatically standardized
3. The new canonical label name should now be used going forward

## Execution Snapshot

- Triggered on issue/PR open, update, or label events (`labeling.yml`).
- Analyse content, files, and metadata.
- Apply or remove labels based on `.github/labels.yml`, `.github/labeler.yml`, and `.github/issue-types.yml`.
- Enforce required labels (`status:*`, `priority:*`, `type:*`).
- Remove redundant or conflicting labels.

## What It Checks

- Presence of status, priority, and type labels.
- File path, branch, and frontmatter-based label mapping.
- Conflict and redundancy resolution.

## Best Practices

- Keep label logic DRY and agent-driven.
- Allow per-repo config (`labels.yml`, `labeler.yml`).

## Guardrails

- Only apply existing labels.
- Never overwrite user-applied labels without warning.
- Log all label actions.

## Outputs

- Updated labels on issues and pull requests.
- Action logs.

## References

- [labels.yml](../.github/labels.yml)
- [labeler.yml](../.github/labeler.yml)
- [issue-types.yml](../.github/issue-types.yml)
- [instructions.instructions.md](instructions.instructions.md)
- [workflows.instructions.md](workflows.instructions.md)
- [Labeling Agent Specification](../agents/labeling.agent.md)
- [Label Strategy Philosophy](../docs/LABEL_STRATEGY.md)
- [Automation Governance Policies](../docs/AUTOMATION_GOVERNANCE.md)
- [Issue Creation Guide](../docs/ISSUE_CREATION_GUIDE.md)
- [Pull Request Creation Process](../docs/PR_CREATION_PROCESS.md)
- [GitHub Actions Labeler Documentation](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpull_requestpull-request-target-event-payload)
