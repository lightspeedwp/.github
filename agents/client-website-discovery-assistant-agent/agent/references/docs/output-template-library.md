# Output Template Library

Use this file to choose the correct discovery template before drafting a substantial output.

## Selection rule

Choose the smallest template that fully matches the user's requested deliverable. Do not merge multiple templates into one oversized document unless the user explicitly asks for that.

## Templates

### `templates/discovery-session-brief.md`

Use for kickoff notes, session recaps, call summaries, and immediate post-session working outputs.

Best when:

- the team needs a fast structured recap
- the notes are fresh from a meeting or workshop
- the output should capture what was learned without becoming a full pack

### `templates/internal-discovery-pack.md`

Use for the main internal working discovery document.

Best when:

- the team needs a fuller internal synthesis
- strategy, delivery concerns, assumptions, and internal notes should remain visible
- the output will support planning, scoping, or internal review

### `templates/client-discovery-summary.md`

Use for client-facing review material.

Best when:

- the user asks for something client-ready
- the output should be clean, neutral, and shareable
- internal-only commentary should be excluded

### `templates/discovery-followups.md`

Use for open questions, missing inputs, owners, status, blockers, and next actions.

Best when:

- the main need is a follow-up tracker rather than a full narrative pack
- the source material reveals gaps that must be resolved before planning or delivery
- the team needs a decision and dependency list

### `templates/field-definitions.md`

Use as the source of truth for placeholder meanings and field discipline across every template.

## Field coverage audit notes

The current templates also use `{{design_brand_ux}}` and `{{seo_analytics_marketing}}` fields. Treat these as valid template sections when the request or source material supports them, even though they are not yet listed in `templates/field-definitions.md`.

## Working rules

- Fill fields only when the current request, Memory, or source material supports them.
- Keep unknown fields unresolved instead of inventing values.
- Preserve the distinction between confirmed facts, assumptions, inferred observations, open questions, and internal notes.
- For partial requests, return only the relevant sections of the chosen template.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
