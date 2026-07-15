# Handoff templates

Use these templates only when the default `SKILL.md` output needs a more specific shape for the target audience, channel, or sensitivity level.

Do not fill unknown facts with guesses. Use `unknown`, `not confirmed`, or `not provided` when evidence is missing.

## Selection rules

- Use the default `SKILL.md` structure for ordinary internal handoffs.
- Use the specialist support template when another support teammate must continue the case.
- Use the engineering template when technical review, logs, reproduction, data state, deployment behaviour, or integration behaviour needs review.
- Use the product template when the case needs product judgement about expected behaviour, limitation, UX friction, repeated pain, or feature fit.
- Use the operations template when the case needs billing, admin, access, account, hosting, domain, fulfilment, workflow, or process ownership.
- Use the security template when access, privacy, exposed data, credentials, suspicious activity, malware, or account takeover risk is present.
- Use the Slack template when the user explicitly asks for a short internal message.
- Use the Zendesk private note template when the handoff should be pasted back into the case.
- Use the insufficient-evidence template when a useful handoff cannot be made safely yet.

## Universal field rules

Every handoff should include:

- the customer-facing problem;
- confirmed impact or a clear note that impact is unknown;
- target owner or target team;
- exact ask;
- urgency or risk level with a reason;
- confirmed evidence;
- attempted steps;
- blockers or missing evidence;
- assumptions clearly separated from confirmed facts.

Do not include:

- credentials, tokens, secrets, or unnecessary personal data;
- raw logs where a short excerpt or location is enough;
- unsupported root cause claims;
- broad FYI language with no action requested;
- Linear, GitHub, Asana, or BugHerd framing unless explicitly requested.

## Specialist support handoff

```markdown
## Specialist support handoff

- Current customer ask: [latest customer request or issue]
- Ticket state: [status, priority, assignee/group if known]
- Impact: [confirmed customer impact, SLA risk, or unknown]
- Target owner: [specific teammate/team or senior support]
- Exact ask: [what the next support owner should do]
- Urgency/risk: [low | medium | high | urgent | unknown] - [reason]

## Confirmed evidence

- [ticket/customer/support fact]
- [ticket/customer/support fact]

## Already tried / do not repeat

- [step already taken]
- [question already asked or ruled-out path]

## Missing or blocked

- [missing response, access, screenshot, logs, decision, or owner]

## Suggested next customer-safe step

[Short note on the next safe reply or action, without inventing commitments.]
```

## Engineering review handoff

```markdown
## Engineering review handoff

- Observed behaviour: [what happened]
- Expected behaviour: [what should happen, if confirmed]
- Affected area: [site/account/environment/product area/plugin/integration]
- Reproduction status: [confirmed | attempted but not reproduced | not attempted | unknown]
- Impact: [who/what is affected and severity]
- Exact engineering ask: [investigate, confirm, review logs, validate defect, advise workaround, etc.]
- Urgency/risk: [low | medium | high | urgent | unknown] - [reason]

## Evidence for review

- [ticket ID, timestamp, error, screenshot, URL, account/site ID, related ticket, or support note]
- [evidence item]

## Support actions already taken

- [checked/tested/asked/replied/rule-out]

## Blockers / missing technical evidence

- [logs, timestamps, reproduction steps, account access, environment details, sample data]

## Handoff summary

[Concise engineering-ready summary. Keep confirmed facts separate from suspected causes.]
```

## Product judgement handoff

```markdown
## Product judgement handoff

- Customer problem: [plain-language user problem]
- Current behaviour: [confirmed behaviour]
- Expected or desired behaviour: [confirmed customer expectation or support interpretation]
- Workaround: [available | unavailable | unknown] - [details]
- Frequency: [single case | repeated cases | unknown]
- Exact product ask: [confirm expected behaviour, approve workaround language, decide limitation, advise documentation/product gap]
- Urgency/risk: [low | medium | high | urgent | unknown] - [reason]

## Evidence

- [customer wording, ticket evidence, related cases, docs gap, support observation]

## Support context

- [what support has already said/tried]
- [risk of current workaround or limitation]

## Product decision needed

[One concrete decision or answer needed from product.]
```

## Operations or admin handoff

```markdown
## Operations/admin handoff

- Operational issue: [billing, access, account, fulfilment, hosting, domain, workflow, or process issue]
- Customer/account affected: [customer/account/site if confirmed]
- Current state: [what is currently true]
- Blocker: [what prevents support from resolving]
- Exact operations ask: [specific action, access change, account check, approval, process decision]
- Urgency/risk: [low | medium | high | urgent | unknown] - [reason]

## Evidence

- [ticket/customer/admin/process evidence]

## Attempts so far

- [support/customer/internal action already taken]

## Timing or promise risk

- [SLA, deadline, customer commitment, business risk, or unknown]
```

## Security-sensitive handoff

```markdown
## Security-sensitive handoff

- Security concern: [confirmed concern only]
- Affected customer/account/system: [confirmed scope or unknown]
- Immediate risk: [access, data exposure, privacy, suspicious activity, malware, credential risk, or unknown]
- Exact security ask: [review, advise containment, confirm exposure, validate access controls, etc.]
- Urgency/risk: [low | medium | high | urgent | unknown] - [reason]

## Confirmed security-relevant evidence

- [minimal evidence needed for review]

## Sensitive details handling

- Sensitive details omitted: [yes | no]
- Share with: [approved internal audience]
- Do not share with: [audience/channel if relevant]
- Raw secrets or credentials included: no

## Blockers / missing evidence

- [logs, timestamps, account IDs, customer confirmation, security review, access audit]

## Handoff summary

[Concise internal-only summary. Do not include unnecessary personal data, credentials, tokens, or full raw logs.]
```

## Slack-ready short handoff

```markdown
[Target team/person] - need your help with a Zendesk support case.

Problem: [one-sentence problem]
Impact/risk: [confirmed impact and urgency]
Evidence: [2-3 strongest facts or links]
Already tried: [brief support actions]
Exact ask: [specific action or decision needed]
Blocker: [what is preventing support from resolving]
```

## Zendesk private note handoff

```markdown
Internal handoff for [target team/person]:

Problem: [concise support-first problem]
Impact: [confirmed impact/risk or unknown]
Exact ask: [specific action or decision]
Evidence: [key confirmed facts]
Attempted steps: [what support/customer tried]
Blockers: [missing evidence/access/decision]
Assumptions: [assumptions, or 'none']

Suggested next step: [what the next owner should do next]
```

## Insufficient-evidence handoff

Use this when preparing a full handoff would force speculation.

```markdown
## Handoff not ready

- Intended target: [support | engineering | product | operations | security | unknown]
- Reason not ready: [specific missing evidence]
- Smallest next evidence needed: [one to three concrete items]
- Safe interim action: [customer-safe reply, internal check, or ticket update]
- Risk if handed off now: [why the receiving team would be blocked or misled]

## Evidence already available

- [confirmed evidence]

## Do not assume yet

- [root cause, impact, owner, workaround, or other unconfirmed fact]
```
