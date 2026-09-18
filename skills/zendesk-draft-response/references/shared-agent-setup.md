# Shared Agent Setup

This skill is designed for a shared LightSpeed workspace agent. It must behave consistently no matter which team member is logged in.

## Portability Rules

- Do not rely on personal ChatGPT Memory for connector names, customer facts, ticket history, tone preferences, or templates.
- Do not rely on hard-coded connector IDs, file IDs, or user-specific installed app references.
- Treat Zendesk as the support source of truth when the shared agent has Zendesk access.
- Use Gmail only when the support conversation is email-based or the user explicitly provides an email thread.
- Use Slack only for internal support context when the user provides it or the shared agent has an approved connector for it.
- Use pasted context when connectors are unavailable, but clearly mark evidence limits in `Notes`.

## Recommended Shared Agent Files

If the shared agent supports shared files or instructions, keep these outside individual user Memory:

- `CONNECTORS.md`: names the available shared connectors and what each is allowed to be used for.
- `SUPPORT-TONE.md`: team-level support tone defaults, escalation language, and customer-facing wording preferences.
- `SUPPORT-BOUNDARIES.md`: commitments, refund language, security handling, billing risk, and escalation rules.

Use `templates/CONNECTORS.example.md` as the starting point for `CONNECTORS.md`. Use `references/shared-agent-installation-checklist.md` before rollout or when auditing whether a shared agent is ready for team use.

The skill must still work without those files by using the defaults in `SKILL.md`, bundled templates, bundled examples, and bundled references.

## Missing Connector Behaviour

When a connector is unavailable:

1. Continue from the supplied context when safe.
2. State the limitation in the support-facing `Notes` section.
3. Avoid claiming that Zendesk, Gmail, Slack, or customer history was checked.
4. Route to `zendesk-evidence-collector` or `zendesk-case-readiness-check` when the missing source materially affects reply safety.

## Memory Guidance

Use Memory only for stable, workspace-safe preferences if the shared agent supports it. Do not store ticket-specific facts, customer-specific facts, private credentials, connector IDs, or source-specific evidence in Memory.

## Regression Testing

After configuring this skill in a shared agent, use `references/shared-agent-regression-tests.md` and `tests/shared-agent-smoke-prompts.md` to test the main support paths with synthetic data. Run `scripts/run_skill_checks.py` from the skill root before packaging or after edits to catch missing files, non-portable references, invalid schema JSON, and unsafe bundled expected replies.

## Reusable Context Redaction

Before adding support context to shared instructions, examples, smoke tests, QA fixtures, or documentation, read `references/data-redaction-rules.md` and use `templates/redacted-support-context-template.md` when structure is needed. Run `scripts/redact_context.py` for a deterministic first pass, then manually review the result.

Do not store real customer evidence, private URLs, ticket IDs, screenshots, credentials, payment details, security findings, or personal contact details in the skill package or shared Memory. Use synthetic examples when redaction would make the case unclear or when the source includes sensitive security, payment, or identity data.
