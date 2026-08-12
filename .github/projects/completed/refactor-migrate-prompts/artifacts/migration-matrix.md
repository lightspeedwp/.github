---
file_type: documentation
title: "Prompt Migration Matrix (.github/prompts -> prompts/)"
description: "Final approved classification of prompt assets with explicit target paths and rename mapping"
version: "1.0.0"
last_updated: "2026-06-01"
status: completed
---

# Prompt Migration Matrix

## 3-Bullet Summary

- Value: Final, exhaustive decision matrix for all `71` prompts in `.github/prompts`.
- Risks: Legacy prompt invocation paths may break without deprecation shims.
- Next step: Execute child `01-2` using this matrix as the single migration source of truth.

## Decision Rules (Final)

1. `move`: portable, organisation-wide utility prompt; relocate to root `prompts/` and rename to kebab-case without `.md` suffix where needed.
2. `keep`: `.github` control-plane, GitHub workflow, or repo-governance specific; remains in `.github/prompts/`.
3. `merge/deprecate`: overlapping or legacy prompt; deprecate and route to a canonical successor in root `prompts/`.

## Final Matrix

| Source Prompt | Action | Target Path / Successor | Notes |
|---|---|---|---|
| `add-frontmatter.prompt.md` | move | `prompts/add-frontmatter.prompt` | Generic docs operation. |
| `agent-task-markdown-linting.prompt.md` | keep | `n/a` | `.github/workflows` coupling. |
| `agents.prompt.md` | merge/deprecate | `prompts/agent-setup.prompt` | Overlaps agent setup flows. |
| `architecture-blueprint-generator.prompt.md` | move | `prompts/architecture-blueprint.prompt` | Org-wide architecture analysis. |
| `breakdown-epic-arch.prompt.md` | move | `prompts/epic-breakdown-architecture.prompt` | Generic planning utility. |
| `breakdown-epic-pm.prompt.md` | move | `prompts/epic-breakdown-product.prompt` | Generic planning utility. |
| `breakdown-feature-implementation.prompt.md` | move | `prompts/feature-breakdown-implementation.prompt` | Reusable implementation planning. |
| `breakdown-feature-prd.prompt.md` | move | `prompts/feature-breakdown-prd.prompt` | Reusable product planning. |
| `breakdown-plan.prompt.md` | move | `prompts/plan-breakdown.prompt` | Generic decomposition prompt. |
| `breakdown-test.prompt.md` | move | `prompts/test-breakdown.prompt` | Generic QA planning. |
| `build-agent-and-tests.prompt.md` | merge/deprecate | `prompts/agent-setup.prompt` + `prompts/testing.prompt` | Split into canonical setup/testing prompts. |
| `changelog-lines.prompt.md` | keep | `n/a` | WP `readme.txt` release process specific. |
| `changelog.prompt.md` | keep | `n/a` | Repo release convention specific. |
| `code-review.prompt.md` | move | `prompts/code-review.prompt` | Already canonical class in root. |
| `conventional-commit.prompt.md` | move | `prompts/conventional-commit.prompt` | Universal workflow. |
| `create-agentsmd.prompt.md` | move | `prompts/create-agentsmd.prompt` | Reusable across repositories. |
| `create-architectural-decision-record.prompt.md` | move | `prompts/create-adr.prompt` | Rename for concision. |
| `create-github-action-workflow-specification.prompt.md` | keep | `n/a` | GitHub workflow governance specific. |
| `create-github-issue-feature-from-specification.prompt.md` | keep | `n/a` | Issue template/tool coupling. |
| `create-github-issues-feature-from-implementation-plan.prompt.md` | keep | `n/a` | Issue template/tool coupling. |
| `create-github-issues-for-unmet-specification-requirements.prompt.md` | keep | `n/a` | Issue template/tool coupling. |
| `create-github-pull-request-from-specification.prompt.md` | keep | `n/a` | PR template/tool coupling. |
| `create-implementation-plan.prompt.md` | move | `prompts/create-implementation-plan.prompt` | Org-wide planning utility. |
| `create-llms.prompt.md` | move | `prompts/create-llms.prompt` | Reusable `llms.txt` generator. |
| `create-readme.prompt.md` | move | `prompts/create-readme.prompt` | Generic documentation prompt. |
| `create-specification.prompt.md` | move | `prompts/create-specification.prompt` | Generic specification workflow. |
| `dependency-audit-agent.prompt.md` | keep | `n/a` | Agent/governance-specific to control-plane. |
| `docs-from-comments.prompt.md` | move | `prompts/docs-from-comments.prompt` | Reusable docs extraction. |
| `docs-writeup.prompt.md` | merge/deprecate | `prompts/documentation.prompt` | Redundant with canonical docs prompt. |
| `documentation-writer.prompt.md` | move | `prompts/documentation-writer.prompt` | Org-wide documentation support. |
| `editorconfig.prompt.md` | keep | `n/a` | Local standards/governance helper. |
| `finalize-agent-prompt.prompt.md` | merge/deprecate | `prompts/agent-setup.prompt` | Finalization should be in canonical setup flow. |
| `folder-structure-blueprint-generator.prompt.md` | move | `prompts/folder-structure-blueprint.prompt` | Generic architecture utility. |
| `generate-changelog.prompt.md` | keep | `n/a` | Parser/formatting tied to this repo flow. |
| `generate-custom-instructions-from-codebase.prompt.md` | move | `prompts/generate-custom-instructions-from-codebase.prompt` | Reusable migration/instruction tooling. |
| `generate-gh-workflow.prompt.md` | keep | `n/a` | GitHub Actions control-plane prompt. |
| `generate-pr-description.prompt.md` | keep | `n/a` | GitHub PR workflow specific. |
| `git-flow-branch-creator.prompt.md` | move | `prompts/git-branch-creator.prompt` | Reusable Git workflow helper. |
| `github-copilot-starter.prompt.md` | merge/deprecate | `prompts/prompt-builder.prompt` | Consolidate starter logic into builder. |
| `inline-documentation.prompt.md` | merge/deprecate | `prompts/documentation.prompt` | Fold inline docs guidance into canonical docs prompt. |
| `labeling.prompt.md` | keep | `n/a` | Coupled to `.github` canonical configs. |
| `model-recommendation.prompt.md` | move | `prompts/model-recommendation.prompt` | Org-wide model selection utility. |
| `multi-stage-dockerfile.prompt.md` | move | `prompts/dockerfile-multi-stage.prompt` | Portable engineering utility. |
| `my-issues.prompt.md` | keep | `n/a` | Repo/GitHub context utility. |
| `my-pull-requests.prompt.md` | keep | `n/a` | Repo/GitHub context utility. |
| `normalize-docs-labels.prompt.md` | keep | `n/a` | Explicit repo/branch coupling. |
| `pr-description.prompt.md` | merge/deprecate | `.github/prompts/generate-pr-description.prompt.md` | Keep one PR description prompt locally. |
| `pr-review.prompt.md` | keep | `n/a` | Control-plane PR process prompt. |
| `project-workflow-analysis-blueprint-generator.prompt.md` | move | `prompts/project-workflow-analysis-blueprint.prompt` | Reusable architecture utility. |
| `prompt-builder.prompt.md` | move | `prompts/prompt-builder.prompt` | Org-wide prompt engineering utility. |
| `python-mcp-server-generator.prompt.md` | move | `prompts/python-mcp-server-generator.prompt` | Portable generator utility. |
| `readme-blueprint-generator.prompt.md` | move | `prompts/readme-blueprint.prompt` | Reusable after parameterising local refs. |
| `release.prompt.md` | keep | `n/a` | Repo-specific release governance. |
| `remember-interactive-programming.prompt.md` | keep | `n/a` | Workflow micro-prompt, local usage. |
| `remember.prompt.md` | merge/deprecate | `prompts/agent-setup.prompt` | Absorb lightweight memory reminders into setup template. |
| `repo-story-time.prompt.md` | move | `prompts/repo-story-time.prompt` | Reusable repo synthesis utility. |
| `reporting.prompt.md` | move | `prompts/reporting.prompt` | Org-wide reporting pattern. |
| `review-and-refactor.prompt.md` | move | `prompts/review-and-refactor.prompt` | Generic quality improvement workflow. |
| `saved-replies.prompt.md` | keep | `n/a` | GitHub saved-reply governance flow. |
| `shuffle-json-data.prompt.md` | move | `prompts/shuffle-json-data.prompt` | Generic data utility prompt. |
| `spec-driven-workflow-start.prompt.md` | keep | `n/a` | Local spec-driven governance coupling. |
| `technology-stack-blueprint-generator.prompt.md` | move | `prompts/technology-stack-blueprint.prompt` | Reusable discovery utility. |
| `testing.prompt.md` | move | `prompts/testing.prompt` | Already canonical class in root. |
| `update-implementation-plan.prompt.md` | move | `prompts/update-implementation-plan.prompt` | Generic planning refinement. |
| `update-llms.prompt.md` | move | `prompts/update-llms.prompt` | Reusable `llms.txt` maintenance. |
| `update-markdown-file-index.prompt.md` | keep | `n/a` | Repo documentation maintenance automation. |
| `update-mermaid-diagrams.prompt.md` | keep | `n/a` | Repo documentation governance workflow. |
| `update-oo-component-documentation.prompt.md` | move | `prompts/update-oo-component-documentation.prompt` | Reusable OO documentation utility. |
| `update-readmes.prompt.md` | keep | `n/a` | Tied to local README policy workflow. |
| `update-specification.prompt.md` | move | `prompts/update-specification.prompt` | Generic specification maintenance. |
| `write-coding-standards-from-file.prompt.md` | move | `prompts/write-coding-standards-from-file.prompt` | Reusable governance authoring utility. |

## Action Counts (Final)

- `move`: 38
- `keep`: 25
- `merge/deprecate`: 8
- Total: 71

## Implementation Notes for Child 01-2

1. For each `move`, first refactor content to remove `.github`-local assumptions before creating target file in `prompts/`.
2. For each `merge/deprecate`, add a deprecation header in source file pointing to the successor target.
3. Keep path compatibility notes in `.github/prompts/README.md` until one full release cycle passes.
