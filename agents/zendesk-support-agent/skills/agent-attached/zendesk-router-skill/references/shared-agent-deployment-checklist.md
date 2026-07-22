# Shared Agent Deployment Checklist

Use this checklist before adding or updating this skill in a shared workspace agent.

## Required Setup

- Confirm the shared agent has access to this skill package through the shared skill directory or workspace agent configuration.
- Confirm whether the shared agent has Zendesk connector access. The router can work without Zendesk access, but evidence-backed downstream workflows may need it.
- Confirm the related `zendesk-` workflow skills are installed in the same shared agent or available in the workspace skill directory. Use `references/companion-skill-manifest.json` as the machine-readable companion-skill source of truth.
- Confirm no personal account, private mailbox, private Slack channel, private Zendesk view, or individual memory is required for the router to function.

## Recommended Companion Skills

Install these with the router when the shared agent is expected to handle support operations end to end. Keep this list aligned with `references/companion-skill-manifest.json`:

- `zendesk-triage-router`
- `zendesk-evidence-collector`
- `zendesk-case-readiness-check`
- `zendesk-draft-response`
- `zendesk-customer-escalation`
- `zendesk-handoff-prep`
- `zendesk-knowledge-candidate-review`
- `zendesk-create-knowledge`
- `zendesk-duplicate-pattern-review`
- `zendesk-backlog-trend-analysis`
- `zendesk-customer-research`
- `zendesk-evidence-quality-review`

## Permission-Safe Router Behaviour Tests

Run these when intentionally invoking `zendesk-router-skill`:

1. "Route this Zendesk ticket, but the shared agent cannot access Zendesk."
   - Expected: request the smallest useful pasted ticket/thread extract unless the user's intended deliverable is already clear.
2. "Package this for engineering."
   - Expected: route to `zendesk-customer-escalation`; add `zendesk-evidence-collector` if evidence has not been assembled.
3. "Review this draft before I send it."
   - Expected: route to `zendesk-evidence-quality-review`.

## Parent-Agent Skill-Selection Tests

Run these in the shared support desk agent, not as forced router-only tests:

1. "Draft a reply to this customer thread."
   - Expected: invoke `zendesk-draft-response` directly when the user is already asking for the downstream deliverable; use `zendesk-case-readiness-check` only when the evidence appears thin or unresolved.
2. "Summarise queue health this week."
   - Expected: invoke `zendesk-backlog-trend-analysis` directly when the user is clearly asking for a report.
3. "Should this workaround become a help article?"
   - Expected: invoke `zendesk-knowledge-candidate-review` directly when the documentation-worthiness question is clear.

## Companion Interoperability Check

- Use `references/companion-interoperability-audit.md` before maintaining or reinstalling the Zendesk skill family.
- Confirm companion skills use canonical `zendesk-` prefixed names in route-away sections, examples, and smoke tests.
- Treat `zendesk-router-skill` as the ambiguity gateway, not as a mandatory wrapper around clear downstream deliverables.

## Do Not Configure

- Do not add personal user names or personal account assumptions to the skill instructions.
- Do not make the router depend on a private Zendesk view, label, queue, macro, brand mapping, or mailbox.
- Do not add real customer tickets or account data to examples, fixtures, or validation files.
- Do not require Linear, GitHub, Asana, Slack, Gmail, or roadmap access for routing Zendesk-first support requests.
- Do not install this router as if every downstream workflow has live Zendesk access; check the companion-skill manifest for connector assumptions and fallback behaviour.

## Maintenance Check

Run this from the skill root before sharing an updated package:

```bash
python3 scripts/validate_router_pack.py
```

The validation should pass before the skill is packaged or uploaded to the shared skill directory.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
