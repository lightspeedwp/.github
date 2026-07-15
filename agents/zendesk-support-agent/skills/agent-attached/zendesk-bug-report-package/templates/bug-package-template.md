# Template: Zendesk bug report package

Use this template for paste-ready internal bug handoffs. Keep sections concise. Use `unknown` rather than inventing missing detail.

```markdown
# Bug package: [short issue title]

## Readiness
[ready for engineering/product | partially ready | not ready]

Reason: [one sentence explaining evidence confidence and biggest gap]

## Problem statement
[one or two sentences. describe the problem without asserting unproven cause.]

## Affected context
- Ticket/source: [zendesk ticket id/url or supplied source]
- Requester/account: [known, redacted, or unknown]
- Product/surface: [known or unknown]
- Environment: [production/staging/local, site/app/version, region, browser/device, role/permissions]
- Frequency/scope: [single user/account, multiple users, recurring, unknown]

## Expected behaviour
- [expected outcome]
- Source/confidence: [documented | support assumption | user expectation | unknown]

## Actual behaviour
- Confirmed: [observed or evidenced behaviour]
- Support-observed: [support reproduction or troubleshooting observation]
- User-reported: [claims not independently confirmed]
- Inferred: [reasonable but unverified interpretation]

## Reproduction clues or steps
1. [step or clue]
2. [step or clue]
3. [step or clue]

Missing reproduction detail: [exact missing fields/questions]

## Troubleshooting already attempted
- [action tried] -> [outcome]
- [action tried] -> [outcome]

## Impact and severity signals
- Affected users/accounts: [known or unknown]
- Business/customer impact: [confirmed vs reported]
- Workaround: [available/unavailable/unknown]
- Timeline/recurrence: [first reported, last observed, repeated, release/change correlation]
- Escalation cues: [sla, relationship risk, security/compliance, urgent blocker, none known]

## Evidence register
### Confirmed / support-observed
- [evidence item + source]

### User-reported but unconfirmed
- [claim + who reported it]

### Inference / assumptions
- [inference + why it is plausible + what would verify it]

### Missing evidence / gaps
- [gap + why it matters]

## Recommended next action
[action: hand off to engineering/product | request more reproduction detail | do more zendesk/customer research | escalate | draft separate customer reply]

Recommended destination/skill: [`zendesk-bug-report-package` output to engineering/product | `zendesk-triage-router` | `zendesk-evidence-collector` | `zendesk-customer-research` | `zendesk-customer-escalation` | `zendesk-draft-response` | `zendesk-evidence-quality-review` | other]

Exact ask for recipient:
[one specific ask or decision needed]

## Caution notes
- Do not claim root cause yet: [unsupported cause claims]
- Do not claim scope yet: [unsupported scope claims]
- Sensitive evidence omitted or linked in Zendesk: [yes/no/unknown]
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
