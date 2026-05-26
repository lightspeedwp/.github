---
description: "Complete the portable AI plugin restructure parent and child GitHub issues in dependency order."
mode: "agent"
tools: ["codebase", "editFiles", "runCommands", "githubRepo"]
model: "GPT-5"
---

# Complete portable AI plugin restructure

## Mission

Complete the full portable AI plugin restructure programme for
`lightspeedwp/.github` by working through the posted parent and child GitHub
issues in a logical, dependency-aware order.

Treat this prompt as the project orchestration guide. Do not attempt a single
large rewrite. Work in reviewable slices, preserve existing behaviour, and keep
the `.github` boundary explicit throughout the migration.

## Scope and source of truth

Use these project files as the local source of truth:

- `.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md`
- `.github/projects/active/portable-ai-plugin-restructure/issues/README.md`
- `.github/projects/active/portable-ai-plugin-restructure/issues/parents/`
- `.github/projects/active/portable-ai-plugin-restructure/issues/children/`
- `.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-migration-map-2026-05-15.csv`
- `.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-baseline-report-2026-05-15.md`

GitHub issue loading was verified on 2026-05-19:

- Parent issues: #282, #283, #284, #285.
- Child issues: #286 through #321.
- Local draft count: 4 parent issues and 36 child issues.
- All 40 local drafts include live `github_issue` URLs.
- GitHub returned all 40 issue records as open at verification time.

Before starting new work, re-check the live GitHub issue state because issue
status can change after this prompt was written.

Latest local re-check: see `portable-ai-plugin-restructure-live-issue-status-2026-05-26.md`
for the 2026-05-26 snapshot (37 open, 3 closed).

## Guardrails

- Use UK English.
- Follow `AGENTS.md` and `.github/instructions/`.
- Never output secrets or customer data.
- Keep code and documentation changes minimal, modular, and easy to review.
- Do not move production assets unless the current issue explicitly requires it.
- Do not mix dependency remediation, broad refactors, and content migration in
  the same slice unless a blocking issue requires it.
- Keep validation commands read-only unless the command name clearly advertises
  fixing or formatting behaviour.
- Preserve existing user or agent changes in the working tree.
- Run relevant linting, tests, and `git diff --check` before claiming an issue
  is complete.
- Update local project reports and migration-map rows when work changes the
  migration state.

## Completion workflow for each child issue

1. Read the local child issue draft and its parent epic.
2. Check the live GitHub issue for updated comments, labels, state, and linked
   work.
3. Confirm dependencies are complete or document why this issue can safely move
   ahead.
4. Implement only the acceptance criteria for that issue.
5. Add or update focused tests, validation commands, reports, or docs as the
   issue requires.
6. Run the smallest meaningful verification set, plus `git diff --check`.
7. Record the outcome in the relevant active project report or README.
8. Commit or prepare a PR-sized slice when requested by the operator.
9. Update the GitHub issue with evidence and close it only when all acceptance
   criteria are genuinely met.

## Logical execution order

### 1. Confirm planning control and skeleton foundation

Complete or verify the #282 foundation issues first:

| Order | Issue | Purpose |
| --- | --- | --- |
| 1 | #286 | Inventory AI assets and create the migration decision map. |
| 2 | #287 | Capture baseline validation, test, and dependency state. |
| 3 | #288 | Create milestone, label, and parent-child issue linking plan. |
| 4 | #289 | Create target top-level folder skeleton. |
| 5 | #290 | Add ownership indexes for new top-level folders. |
| 6 | #291 | Update file organisation rules for GitHub-native vs portable assets. |
| 7 | #292 | Scope `.github` Copilot instructions to this repo only. |

Close parent #282 only after batches 00 and 01 are complete, verified, and
documented.

### 2. Protect the `.github` boundary before broad migration

Complete the classification and cleanup issues before moving portable assets:

| Order | Issue | Purpose |
| --- | --- | --- |
| 8 | #293 | Classify GitHub-native files that must remain in `.github`. |
| 9 | #294 | Clean stale path references before migration. |
| 10 | #311 | Fix invalid JSON schema syntax before validator reset. |
| 11 | #312 | Split validation commands from mutating format and fix commands. |
| 12 | #313 | Add read-only `validate:structure`. |

These issues reduce ambiguity and make later moves safer. If #311 through #313
need to be completed under parent #285 first, cross-link that rationale in the
GitHub issue comments.

### 3. Migrate low-risk portable source assets

Move text-first portable assets after the boundary and validation basics exist:

| Order | Issue | Purpose |
| --- | --- | --- |
| 13 | #295 | Migrate reusable instructions to `/instructions`. |
| 14 | #296 | Migrate reusable agent specs to `/agents`. |
| 15 | #297 | Move active portable schemas to `/.schemas`. |
| 16 | #298 | Define `/workflows` as portable agentic workflow source. |

Keep GitHub-native assets under `.github`. Update links, indexes, migration-map
rows, and validation coverage as each asset moves.

### 4. Build the skills and cookbook layer

Convert durable prompts and repeatable procedures only after source migration is
stable enough to avoid rework:

| Order | Issue | Purpose |
| --- | --- | --- |
| 17 | #299 | Classify legacy prompts as skill, cookbook, archive, or delete. |
| 18 | #300 | Create the portable `/skills` library index. |
| 19 | #301 | Create `lightspeed-frontmatter-audit` skill. |
| 20 | #302 | Create `lightspeed-pr-review` skill. |
| 21 | #303 | Create `lightspeed-label-governance` skill. |
| 22 | #304 | Create cookbook and favourite skills backlog. |

Close parent #283 only after batches 02 and 03 are complete, verified, and
documented.

### 5. Create the pilot plugin package

Build the pilot plugin after the first portable assets and skills are ready to
package:

| Order | Issue | Purpose |
| --- | --- | --- |
| 23 | #305 | Create `plugins/lightspeed-github-ops` pilot plugin skeleton. |
| 24 | #306 | Add VS Code and GitHub Copilot plugin manifest metadata. |
| 25 | #307 | Add Codex/OpenAI plugin manifest for the pilot package. |
| 26 | #308 | Add Claude Code plugin manifest for the pilot package. |
| 27 | #309 | Package selected agent and pilot skills into `lightspeed-github-ops`. |
| 28 | #310 | Write pilot plugin installation and update guide. |

Close parent #284 only after the pilot package has manifests, packaged content,
installation documentation, and local validation evidence.

### 6. Finish validation reset and test hygiene

Complete the remaining validation issues once plugin shape and source folders
are concrete:

| Order | Issue | Purpose |
| --- | --- | --- |
| 29 | #314 | Add read-only plugin and skill validators. |
| 30 | #315 | Add read-only frontmatter and local link validators. |
| 31 | #316 | Fix misleading coverage reporting and noisy import side effects. |

Run the full relevant validation suite after these land. Confirm validators do
not mutate files unless explicitly named as fixers.

### 7. Pilot, document findings, and prepare release

Finish rollout only after the package and validators are credible:

| Order | Issue | Purpose |
| --- | --- | --- |
| 32 | #317 | Run local tool smoke tests for the pilot plugin. |
| 33 | #318 | Pilot `lightspeed-github-ops` in one LightSpeed repository. |
| 34 | #319 | Document pilot findings and follow-up decisions. |
| 35 | #320 | Create future plugin pack backlogs. |
| 36 | #321 | Prepare pilot plugin restructure release readiness checklist. |

Close parent #285 only after validation, pilot evidence, future-pack decisions,
and release-readiness documentation are complete.

## Required final state

The programme is complete when:

- All child issues #286 through #321 are closed with evidence.
- All parent epics #282 through #285 are closed after their child batches are
  complete.
- `.github` contains only GitHub-native repo governance, templates, workflows,
  repo-specific Copilot configuration, and active project records.
- Portable assets live in the root source folders defined by the PRD.
- The pilot plugin can be installed or smoke-tested locally.
- Validation commands are read-only by default and documented.
- The migration map, architecture docs, install docs, and release checklist are
  current.

## Quality assurance

For each slice, choose the smallest meaningful verification commands from the
available scripts. Prefer:

- Markdown linting for documentation-only changes.
- Targeted validation commands for agents, instructions, schemas, plugins,
  skills, links, and workflows.
- Focused tests for script or validator changes.
- `npm test` when shared JavaScript behaviour changes.
- `git diff --check` before finalising the slice.

If a baseline command is known to fail, do not hide the failure. Record the
actual output, link it to the relevant issue, and keep the fix scoped to the
assigned issue.

## Output expectations

When using this prompt, report progress in this format:

- Current issue and parent epic.
- Files changed.
- Acceptance criteria completed.
- Verification commands and results.
- Follow-up issues or blockers.
- Whether the GitHub issue is ready to close.
