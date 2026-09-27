# Contract: Responsibility Matrix

**Feature**: [../spec.md](../spec.md) | Satisfies FR-010, US2

Each concern has exactly one owner. "Automatic" means it runs without a command. Anything not listed as automatic for Qodo PR-Agent must not run automatically.

## Review concerns

| Concern | Owner | Mode | Notes |
| --- | --- | --- | --- |
| Code review: correctness, security, standards, path guidance | CodeRabbit | automatic | Governed by `.coderabbit.yml`. Re-review with `@coderabbitai review`. |
| Review verdict (request changes or approve) | CodeRabbit + human reviewers | automatic | Qodo PR-Agent never posts an automatic verdict. |
| Diff-based PR summary and walkthrough | Qodo PR-Agent (`describe`) | automatic | Posted as a single persistent **comment**; the PR body is never changed. |
| Code-improvement suggestions | Qodo PR-Agent (`improve`) | automatic | Persistent comment. Triaged through `skills/gh-address-comments`. |
| Second-opinion review | Qodo PR-Agent (`review`) | on-demand | `/review`. Also consumed by `skills/pr-review` as an input. |
| Questions about the PR | Qodo PR-Agent (`ask`) | on-demand | `/ask <question>` |
| Changelog entry drafting | Qodo PR-Agent (`update_changelog`) | on-demand | Comment only. Validated by `agents/changelog-agent/` before adoption. |
| Changelog presence and quality gate | `changelog-unified.yml` | automatic | Unchanged. |
| Missing documentation suggestions | Qodo PR-Agent (`add_docs`) | on-demand | Reviewed by `agents/document-reviewer-agent/`. |
| Label application | `labeling-unified.yml`, `pr-template-routing.yml`, `agents/labeling-agent/` | automatic | Qodo PR-Agent applies **no** labels. |
| Label suggestions | Qodo PR-Agent (`generate_labels`) through `skills/qodo-pr-agent` | on-demand (skill only) | Filtered against `.github/labels.yml`, and never published by Qodo PR-Agent. |
| Branch-name validation | `branch-name-validation.yml` | automatic | Unchanged. |
| PR creation, template routing, PR body | Internal PR agent (`agents/pr-agent/`) | automatic | May use `describe` output as an input (spec 015 US2). |
| Duplicate-issue detection | `agents/issue-agent/` | — | The Qodo PR-Agent `similar_issue` tool is **deferred** ([research R8](../research.md#r8-similar-issues-integration-is-not-viable-in-the-pilot)). |

## Integration points (US3)

| Tool | Asset | Invocation | On output | Fallback | Status |
| --- | --- | --- | --- | --- | --- |
| review | `skills/pr-review` | skill | Merge the findings into the LightSpeed review, and apply org standards on top | Review proceeds without them and notes `Qodo PR-Agent input skipped: <reason>` | in-scope |
| review | `agents/reviewer-agent/` | skill | Include findings in the review summary | As above | in-scope |
| improve | `skills/gh-address-comments`, `agents/address-comments.agent.md` | pr-comment | Treat suggestions as comments to triage (address, or reply with a reason) | Nothing to triage | in-scope |
| describe | `agents/pr-agent/` (internal) | skill (diff mode) | Use the summary as a source for the diff-derived body section | Existing body generation | in-scope |
| review / improve | `agents/pr-agent/` self-review gate | gate-input | Count the findings as "AI-review findings" | Gate records "no Qodo PR-Agent input" | in-scope |
| generate_labels | `agents/labeling-agent/`, `skills/label-governance` | skill | Keep only names present in `.github/labels.yml`; log the dropped ones | Existing labelling | in-scope |
| update_changelog | `agents/changelog-agent/`, `skills/changelog-generator` | pr-comment or skill | Validate (≤250 chars, user-facing, linked); reject naming the failing rule | Existing changelog flow | in-scope |
| add_docs | `agents/document-reviewer-agent/`, `skills/documentation-writer` | pr-comment | Review the suggestions before any adoption | None needed | in-scope |
| ask | `skills/pr-review`, `agents/qa-subagent.agent.md` | skill | Answer targeted questions | Proceed without an answer | in-scope |
| similar_issue | `agents/issue-agent/`, `skills/ticket-triage` | — | — | — | **deferred** (R8) |
| all | AI feedback validation (`docs/AI_FEEDBACK_*.md`) | process | Qodo PR-Agent comments count as AI review feedback | — | in-scope |
