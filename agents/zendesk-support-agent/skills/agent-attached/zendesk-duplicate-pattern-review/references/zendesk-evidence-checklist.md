# Zendesk Evidence Checklist

Use this checklist to make duplicate, related-case, repeated-pain, incident-pattern, or inconclusive calls more consistent. It is a support evidence checklist, not a requirement to collect every possible detail before giving a useful answer.

## Minimum comparison evidence

Before recommending merge, escalation, incident handling, or reporting, try to identify:

- Ticket IDs, ticket URLs, or a clearly described manual comparison set.
- Requester, organisation, affected account, site, workspace, user, or customer segment.
- Product area, feature, workflow, integration, form, queue, group, or component.
- Customer-reported symptom in each ticket.
- Timing: first report, recurrence, cluster window, last update, and whether the issue is ongoing.
- Impact: blocked work, degraded workflow, confusion, financial risk, SLA risk, relationship risk, or no confirmed impact.
- Current ticket state: status, priority, assignee, group, SLA state, linked tickets, problem/incident links, and known-issue indicators.
- Resolution path or attempted handling: workaround, macro, prior reply, internal note, escalation, investigation, or no handling yet.

## Evidence that supports likely duplicate

Look for:

- Same or materially equivalent symptom.
- Same affected workflow or product area.
- Same customer/account/context, or different tickets that clearly belong to one shared support case.
- Same likely cause and same resolution path.
- No meaningful customer-specific detail that would be lost by merge/link handling.

## Evidence that supports related but distinct

Look for:

- Similar symptom but different account, setup, expectation, workflow condition, or impact.
- Same product area but different likely causes.
- One customer reporting multiple issues that should not be collapsed.
- Different resolution paths or different next evidence needed.

## Evidence that supports repeated pain pattern

Look for:

- Recurring friction, confusion, onboarding gap, documentation gap, unclear UX, policy confusion, or repeated expectation mismatch.
- Similar support burden without proof of one shared root defect.
- Tickets spread over time rather than clustered into one operational event.
- Cases that should stay separate but can inform reporting, documentation, or workflow improvement.

## Evidence that supports broader incident pattern

Look for:

- Similar reports clustered in the same time window.
- Multiple customers, accounts, sites, integrations, payments, emails, deployments, or infrastructure-dependent workflows affected.
- Evidence of shared degradation or failure rather than repeated confusion.
- Operational urgency, SLA risk, or communication need that exceeds ordinary duplicate handling.

## Evidence gaps that should lower confidence

Lower confidence when missing:

- Timing or cluster window.
- Affected workflow or product area.
- Customer/account context.
- Internal notes, prior resolution, or attempted handling.
- Known-issue, linked problem ticket, or incident status.
- Proof that similar wording means the same cause.
- Permission to view the full Zendesk thread in a shared-agent context.

## Safe handling when evidence is incomplete

When evidence is incomplete:

- Do not recommend merge as final handling.
- Prefer "link or tag as possibly related" over "merge".
- Name the smallest missing Zendesk detail needed for confidence.
- Route to evidence collection or case investigation when cause, timing, or scope determines the decision.
- Keep customer-specific tickets separate until the support team can preserve impact, commitments, and communication context.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
