# Client-safe language guide

Use this file when turning internal Tour Operator audit findings, implementation notes, repository reviews or QA notes into client-facing copy.

## Purpose

Keep client reports clear, useful and commercially safe. Do not expose internal speculation, raw tool output, uncertain implementation details, private data, or unsupported SEO/schema promises.

## Replace internal wording

| Internal wording | Client-safe wording |
|---|---|
| This is probably broken | This needs verification before we can rely on it. |
| The plugin seems to do X | The current evidence indicates X, subject to final verification. |
| We do not know | This is not confirmed from the available evidence. |
| The form may be losing leads | The enquiry flow should be tested to confirm submissions, routing and notifications. |
| Yoast/schema is wrong | The structured data output needs review to avoid duplicate or unsupported markup. |
| The client has bad content | The content needs more complete source information before publication. |
| This is a risky implementation | This change needs a staged rollout, verification plan and rollback option. |

## Do not promise

Avoid claims such as:

- guaranteed rich results;
- guaranteed rankings or traffic gains;
- confirmed bookings or conversion uplift without analytics evidence;
- complete Wetu sync safety without import logs and rollback evidence;
- price, rating, review or availability accuracy without source evidence;
- legal, privacy, accessibility or consumer-protection compliance sign-off.

## Prefer this structure

1. What we checked.
2. What is working.
3. What needs attention.
4. Why it matters.
5. Recommended next steps.
6. Decisions or access needed.

## Confidence wording

- Confirmed: use when backed by live-site, repository, uploaded source or approved documentation evidence.
- Likely: use only in internal notes, not final client assertions, unless the limitation is clear.
- Unknown: say what evidence is needed to confirm it.
- Assumption: avoid in client-facing reports unless clearly framed as a planning assumption.

## Example client-safe note

The Tour Operator content model is in place for tours, destinations and accommodation. The next step is to verify how enquiry forms capture the selected tour or destination, then test notification routing so leads reach the right team reliably.
