# Legacy aliases and archive notes

Use this reference only when a request, old prompt, archived package, or parent-agent instruction mentions deprecated `ticket-triage` or ambiguous `triage-router` wording.

## Deprecated router names

- `ticket-triage` is deprecated and must not be emitted as an active route target.
- `triage-router` is ambiguous and should be interpreted as `zendesk-triage-router` only when the context is Zendesk-first support work.
- First-pass support classification, severity, priority, owner/team, queue/status, and duplicate-risk assessment are now embedded in `zendesk-triage-router`.

## Replacement wording

Replace legacy parent-agent starter wording like this:

```md
Old: Use ticket-triage to classify support tickets.
New: Use zendesk-triage-router for Zendesk-first support routing and embedded first-pass ticket triage; do not route to a separate ticket-triage workflow.
```

```md
Old: Route support bugs to Linear triage by default.
New: Keep Zendesk-first support handling as the default. Use downstream Linear, GitHub, Asana, or product workflows only when the user explicitly asks for that artefact or after a support handoff confirms it is needed.
```

## Archive rule

If the old `ticket-triage` package remains in a skill directory during migration, treat it as deprecated archive material or a thin redirect-only alias. It must not appear in route recommendations, own routing decisions, or duplicate the canonical `zendesk-triage-router` decision rules.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
