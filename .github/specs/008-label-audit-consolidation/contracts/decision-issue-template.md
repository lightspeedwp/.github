# Decision Issue Template Contract

Defines the content of `.github/ISSUE_TEMPLATE/06-decision.md`, which replaces `06-question.md` when the Decision issue type takes the Question slot (spec FR-014, constitution v1.3.1). The template file itself is created only after the `[TEMPLATE-UPDATE-REQUEST]` and `[ISSUE-TYPE-UPDATE-REQUEST]` are approved.

## Frontmatter

Follows the frontmatter keys used by the existing templates in `.github/ISSUE_TEMPLATE/`.

| Key | Value | Notes |
| --- | --- | --- |
| `name` | `"🧭 Decision"` | Shown in the issue template chooser |
| `about` | `"Record a decision: context, options considered, outcome and consequences"` | |
| `title` | `"type:decision: {scope} - {short description}"` | Same pattern as the other templates |
| `labels` | `["type:decision", "status:needs-triage", "priority:normal"]` | Exactly one `type:*` label; no default `area:*` (the author picks the area) |
| `recommended_branch` | `"docs/"` | A decision that changes files uses a `docs/` branch, which routes to `pr_docs.md` |
| `file_type` | `issue-template` | |

## Body sections

Each section has an HTML comment prompt, as in the existing templates. Section headings are level 2 so that downstream template validation (`scripts/agents/includes/check-template-labels.js` and related checks) can find them.

| Section | Purpose | Prompt (HTML comment) |
| --- | --- | --- |
| `## Summary` | One-paragraph statement of the decision needed | What needs deciding, and by when? |
| `## Context` | Background, constraints and forces | What is the current situation? Which constraints, standards or deadlines apply? Link evidence. |
| `## Options Considered` | Each option with pros, cons and cost | List at least two options, including "do nothing" where relevant. |
| `## Decision` | The chosen option and who decided | State the decision, the decider (for governance decisions, @ashley) and the date. Leave blank until decided. |
| `## Consequences` | What changes as a result, positive and negative | What becomes easier or harder? What follow-up work, migrations or documentation are needed? |
| `## Linked Work` | Related issues, PRs, specs and records | Link implementation issues, the `docs/` PR, any decision-record file, and superseded decisions. |

## Definition of Ready (DoR)

- [ ] Decision needed is clearly stated
- [ ] Context and constraints described, with evidence linked
- [ ] At least two options listed
- [ ] Decider identified

## Definition of Done (DoD)

- [ ] Decision recorded with decider and date
- [ ] Consequences and follow-up work captured as linked issues
- [ ] Documentation updated through a `docs/` PR where files change
- [ ] Linked issue(s) updated with latest status and closed after merge
- [ ] The related epic is not closed; it is updated with a comment reflecting the closed issue

## Replacement rules

- `06-question.md` stays in place until the three change requests merge, and must not be used for new issues (constitution v1.3.1).
- The same PR that adds `06-decision.md` removes `06-question.md`, updates `.github/issue-types.yml` (Question → Decision), `.github/issue-fields.yml` (`type:question` → `type:decision`), and removes `type:question` from `label-governance-policy.yml`'s never-delete list.
- Question-style requests go to GitHub Discussions (`discussion:support`). The issue template chooser (`.github/ISSUE_TEMPLATE/config.yml`) should link to Discussions for questions.

## Validation

- The template file passes the repository's frontmatter validation (`npm run validate:frontmatter`).
- `labels` contains exactly one `type:*` label, and every label exists in `labels.yml`.
- The chooser shows 25 issue templates, one per issue type.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
