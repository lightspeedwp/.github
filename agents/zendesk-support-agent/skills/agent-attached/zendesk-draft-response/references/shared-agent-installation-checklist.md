# Shared Agent Installation Checklist

Use this checklist when adding this skill to a shared workspace agent or moving it between shared agents.

## Required before team use

- Add the full skill package to the shared skill directory, not a user-specific local skill folder.
- Confirm the shared agent can load `SKILL.md`, bundled templates, bundled schemas, bundled examples, and bundled references.
- Confirm the shared agent does not rely on one team member's personal Memory for connector names, customer facts, or support tone rules.
- Confirm Zendesk access is configured for the shared agent if the team expects ticket lookup.
- Confirm Gmail access is configured only if the team expects email-thread support replies.
- Confirm Slack access is configured only if internal support context is needed.
- Add or adapt `templates/CONNECTORS.example.md` into the shared agent's own `CONNECTORS.md` if the platform supports shared agent files or persistent instructions.

## Recommended shared-agent instructions

Add a short note to the shared agent instructions:

```md
When drafting support replies, use the `zendesk-draft-response` skill. Treat Zendesk as the source of truth for support tickets when available. If a connector is unavailable, continue from pasted context only when safe and state the evidence limitation in internal notes. Do not rely on personal Memory, private file IDs, or hard-coded connector IDs.
```

## Connector acceptance checks

Before treating the shared agent as ready, test these cases:

1. Zendesk ticket input
   - Input: a ticket ID or ticket URL.
   - Expected behaviour: use Zendesk as source of truth, draft a grounded reply, and avoid unsupported promises.
2. Pasted support thread
   - Input: pasted customer thread with no connector access.
   - Expected behaviour: draft only from pasted facts and include source limitation in `Notes`.
3. Email-based support thread
   - Input: Gmail or pasted email thread.
   - Expected behaviour: preserve email continuity and avoid claiming Zendesk was checked unless it was.
4. Internal context supplied from Slack
   - Input: customer thread plus pasted internal Slack summary.
   - Expected behaviour: use Slack context as internal context only, not as customer-facing proof.
5. Missing or insufficient evidence
   - Input: vague request such as "reply to this customer about the bug" with no detail.
   - Expected behaviour: route to evidence collection/readiness checking or draft a minimal clarification request.

## Ongoing maintenance

- Keep examples synthetic and anonymised.
- Keep connector names logical, not ID-based.
- Review risky wording in `scripts/lint_reply.py` after real support QA observations.
- Update templates only when the team has agreed the support output shape should change.
- Do not add live customer data, credentials, private ticket exports, or user-specific connector IDs to the skill package.

## Redaction Readiness

- [ ] Team members know not to add real customer context to bundled examples, smoke tests, shared setup notes, or Memory.
- [ ] `references/data-redaction-rules.md` is available for reusable support-context handling.
- [ ] `templates/redacted-support-context-template.md` is available for approved redacted fixtures.
- [ ] `scripts/redact_context.py` has been tested on one synthetic sample with an email, URL, ticket ID, and custom customer/account mapping.
- [ ] The team understands that sensitive security, payment, credential, or personal-data cases should usually be rewritten synthetically rather than stored as redacted examples.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
