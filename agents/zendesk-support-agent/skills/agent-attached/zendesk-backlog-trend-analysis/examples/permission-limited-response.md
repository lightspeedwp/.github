# Permission-limited response

I cannot produce an evidence-backed backlog report from Zendesk in this environment because the active agent access does not expose ticket counts or searchable ticket metadata for the requested scope.

## What I can confirm

- The requested report requires Zendesk ticket counts and ticket metadata at minimum.
- SLA, ageing, ownership, and repeated-theme claims would be unsafe without that evidence.

## Recommended support actions

1. Request Zendesk read access for ticket counts and ticket metadata in the relevant queue.
2. Confirm whether SLA fields are visible. If not, use ageing and priority as fallback risk signals after metadata access is available.
3. Re-run the same report scope once the shared agent has the required Zendesk read access.

## Evidence basis and gaps

- Scope requested: backlog health report.
- Zendesk ticket counts visible: no.
- Zendesk ticket metadata visible: no.
- SLA data visible: unavailable because the minimum Zendesk read access was not available.
- Missing evidence: ticket counts, status mix, ageing, ownership, SLA visibility, and repeated-theme metadata.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
