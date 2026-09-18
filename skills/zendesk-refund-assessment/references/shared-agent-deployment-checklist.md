# Shared-Agent Deployment Checklist

Use this checklist before adding or updating `zendesk-refund-assessment` in a shared support desk agent.

## Required setup

- Confirm the skill package is available through the shared skill directory or workspace agent configuration.
- Confirm the shared agent has this skill installed, not only a personal ChatGPT environment.
- Confirm whether the shared agent has Zendesk connector access. This skill can work from pasted evidence, but live ticket verification requires connector access.
- Confirm whether policy/help-center, billing/commerce, CRM/account, and internal discussion sources are available to the shared agent or must be supplied manually.
- Confirm no personal account, private mailbox, private Zendesk view, private Slack channel, individual memory, or teammate-specific permission is required.

## Recommended companion skills

Install or make available where support operations need end-to-end handling:

- `zendesk-router-skill`
- `zendesk-triage-router`
- `zendesk-evidence-collector`
- `zendesk-case-readiness-check`
- `zendesk-draft-response`
- `zendesk-help-center-grounding`
- `zendesk-customer-escalation`
- `zendesk-customer-research`
- `zendesk-evidence-quality-review`

## Shared-agent acceptance tests

Run these in the shared support desk agent:

1. `Assess this refund request, but the shared agent cannot access Zendesk.`
   - Expected: uses pasted context or requests the smallest useful ticket/thread extract; does not imply Zendesk was inspected.
2. `Customer wants a credit because service was unreliable, but we only have complaints and no SLA or billing evidence.`
   - Expected: classifies credit/compensation, lists evidence gaps, avoids promising credit, recommends evidence collection or approval.
3. `Ticket says another agent said we should be able to refund it, but policy window passed.`
   - Expected: flags expectation risk, treats prior wording as not approval, recommends approval/escalation before outcome language.
4. `Find the refund policy article and summarise it.`
   - Expected: routes to `zendesk-help-center-grounding`, not a full refund assessment.
5. `Triage this ticket: customer asks where to download invoices.`
   - Expected: routes to `zendesk-triage-router` or `zendesk-draft-response`; does not force refund assessment.

## Do not configure

- Do not add real ticket IDs, customer names, email addresses, invoice IDs, transaction IDs, queue IDs, view IDs, or account IDs to examples or tests.
- Do not hardcode personal names, personal connector IDs, private labels, or workspace-only shortcuts into the skill package.
- Do not require Slack, Gmail, Drive, Linear, GitHub, Asana, or roadmap tools for refund assessment unless the current shared agent explicitly supplies them and the evidence is relevant.
- Do not install the skill as though every downstream workflow has live Zendesk, policy, billing, and CRM access; preserve pasted-context fallbacks.

## Maintenance check

Run this from the skill root before sharing an updated package:

```bash
python3 scripts/validate_refund_assessment_pack.py
```

The validation should pass before the skill is packaged or uploaded to the shared skill directory.
