---
mode: "agent"
description: "Repo-local Copilot and agent instructions for maintaining the LightSpeed .github control-plane repository."
---

# LightSpeed .github Custom Instructions

## Issue Creation Protocol (AI Agents)

Use this protocol whenever you create a GitHub issue in this repository.

### 1. Classify intent first

Map the request to a canonical issue type before selecting a template.

- If the request is a defect, use Bug intent.
- If it is net-new capability, use Feature intent.
- If it is bounded execution work, use Task intent.
- If it is UX or design direction, use Design or User Experience Feedback intent.
- If none fit exactly, choose the closest available numbered template and state the intended canonical type in the issue body.

### 2. Select the correct numbered template

Pick from `.github/ISSUE_TEMPLATE/01-*.md` to `.github/ISSUE_TEMPLATE/26-*.md`.

Current parity note:

- Canonical issue types = 29 (from `.github/issue-types.yml`).
- Numbered templates = 26.
- Types currently without dedicated templates: `type:chore`, `type:question`, `type:support`.

For these three missing-template types, use the nearest template and explicitly state the target type in the opening section.

### 3. Fill structured sections completely

Always complete:

- summary/context
- acceptance criteria
- definition of ready/done checklists
- dependencies/blockers
- links to related issues/PRs

Do not submit partially completed issue templates unless the issue is explicitly marked as a draft planning item.

### 4. Set labels and metadata explicitly

Issue template files currently do not pre-populate labels. Add labels manually on creation/edit:

- exactly one `type:*`
- exactly one `status:*`
- exactly one `priority:*`
- at least one `area:*` where confidently known

Use canonical values from:

- `.github/labels.yml`
- `.github/issue-types.yml`

### 5. Understand automation trigger behaviour

Automation path for issues:

1. issue is created/edited
2. `.github/workflows/labeling.yml` runs on `issues` events
3. `scripts/agents/labeling.agent.js` applies rules/defaults and content heuristics

Important:

- `.github/labeler.yml` is PR-signal heavy (branch/files) and less deterministic for issues.
- Issue outcomes rely more on content and canonical enforcement logic today.

### 6. Validate before submit

Before submitting an issue, confirm:

- template matches intent
- required sections are complete
- labels are canonical and one-hot families are respected
- links/references are valid

## Issue Body Examples

### Bug

- Intent: reproducible defect
- Template: `02-bug.md`
- Type label: `type:bug`
- Include: repro steps, expected vs actual, environment, logs/screenshots

### Feature

- Intent: new capability
- Template: `03-feature.md`
- Type label: `type:feature`
- Include: user value, scope, acceptance criteria, out-of-scope

### Task

- Intent: bounded implementation work
- Template: `01-task.md`
- Type label: `type:task`
- Include: checklist, dependencies, completion criteria

## Troubleshooting

### Labels look wrong after creation

- Verify canonical labels exist in `.github/labels.yml`.
- Ensure only one `type:*`, one `status:*`, and one `priority:*` are present.
- Re-open/edit issue to re-trigger labeling workflow if needed.

### Expected automation did not apply

- Confirm event type is covered in `.github/workflows/labeling.yml` `issues` triggers.
- Check if requested outcome depends on PR-only signals (branch/files) from `.github/labeler.yml`.
- Add explicit labels manually and document intent in issue body.

### Ambiguous template choice

- Prefer the closest numbered template.
- Add a one-line declaration at the top of the issue body: `Intended canonical type: type:<value>`.
