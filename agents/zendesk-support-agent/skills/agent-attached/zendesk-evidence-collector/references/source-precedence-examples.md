# Source precedence examples

Use these examples when sources disagree, when evidence comes from mixed systems, or when a case depends on event-time truth.

These examples are synthetic. Do not treat any names, ticket numbers, domains, timestamps, symptoms, or outcomes as real support evidence.

## Contents

- General rule
- Example 1: customer promise conflict
- Example 2: current settings versus incident-time behaviour
- Example 3: runtime logs versus human summary
- Example 4: Help Centre article versus ticket-specific exception
- Example 5: pasted thread versus Zendesk ticket history
- Example 6: prior similar ticket versus exact duplicate
- Example 7: stale documentation versus fresh ticket evidence
- Example 8: missing evidence is not negative proof
- Safe conclusion patterns

## General rule

Before deciding which source wins, confirm that the sources refer to the same customer, issue, environment, and time window.

If they do not refer to the same thing, do not rank them against each other. Treat them as separate evidence items and explain the mismatch.

## Example 1: customer promise conflict

**Situation:**

- Zendesk public reply says: "We will check this and come back with next steps."
- Slack thread says: "I think support promised a fix by Friday."

**Preferred handling:**

- Treat the Zendesk public reply as the authoritative record of the customer-facing commitment.
- Treat the Slack comment as internal speculation unless it links to a ticket comment or direct customer message.
- Do not tell the customer there was a Friday commitment unless the ticket history confirms it.

**Output wording:**

> Confirmed: the ticket shows a commitment to provide next steps, but not a confirmed fix date. Slack mentions Friday, but I could not verify that as a customer-facing commitment from Zendesk.

## Example 2: current settings versus incident-time behaviour

**Situation:**

- Current account settings show a feature is enabled today.
- Customer reported failure two weeks ago.
- No event-time settings export or logs are available.

**Preferred handling:**

- Use current settings only for current-state truth.
- Do not infer that the feature was enabled at the time of the reported failure.
- Mark the branch blocked if the root cause depends on historical settings.

**Output wording:**

> Current state: the feature is enabled now. Event-time state remains unknown, so I cannot confirm whether this setting caused or prevented the issue at the time reported.

## Example 3: runtime logs versus human summary

**Situation:**

- Agent note says: "The request probably timed out."
- Runtime logs show a successful response for the same request ID.

**Preferred handling:**

- Prefer runtime logs for request outcome, if the request ID and timestamp match.
- Retain the agent note as context, not proof.
- Explain that the timeout theory was not supported by the checked logs.

**Output wording:**

> The timeout branch is disproven for the checked request ID: runtime logs show a successful response at the matching timestamp. The earlier agent note appears to have been a working hypothesis, not confirmed evidence.

## Example 4: Help Centre article versus ticket-specific exception

**Situation:**

- Help Centre article says a workflow is not supported.
- Zendesk internal note records an approved exception for this customer.

**Preferred handling:**

- Use the Help Centre article for general policy.
- Use the Zendesk note for this specific customer only if it clearly identifies the approving owner and scope.
- Avoid turning a one-customer exception into a general rule.

**Output wording:**

> General policy says this workflow is not supported. This ticket appears to contain a customer-specific exception, but the scope should be confirmed before replying or documenting it.

## Example 5: pasted thread versus Zendesk ticket history

**Situation:**

- User pastes a partial customer thread showing only the latest complaint.
- Zendesk ticket history includes prior troubleshooting, customer confirmations, and status changes.

**Preferred handling:**

- Use the pasted thread as supplemental evidence.
- Use Zendesk as the primary chronology and case state.
- Quote or paraphrase the pasted content only if it adds detail not visible in Zendesk.

**Output wording:**

> The pasted thread confirms the latest customer frustration, but Zendesk provides the fuller chronology and current status. I am using Zendesk as the case record and the pasted thread as supplemental context.

## Example 6: prior similar ticket versus exact duplicate

**Situation:**

- Prior ticket has a similar symptom.
- Current ticket involves a different product version, account configuration, or time window.

**Preferred handling:**

- Do not label it as a duplicate solely because the symptom sounds similar.
- Classify as related or possible repeated pain unless the cause, affected surface, and resolution path match.
- Route duplicate uncertainty to duplicate/pattern review if it blocks next action.

**Output wording:**

> This is related to a prior support pattern but not proven to be a duplicate. The symptom overlaps, while the environment and time window differ.

## Example 7: stale documentation versus fresh ticket evidence

**Situation:**

- Internal doc last updated months ago says a workaround is recommended.
- Recent Zendesk tickets show agents stopped recommending it after failures.

**Preferred handling:**

- Treat the doc as possibly stale.
- Prefer the recent ticket evidence for current support practice, but mark the official guidance gap.
- Recommend knowledge-candidate review or documentation update if the pattern is repeated.

**Output wording:**

> The internal doc may be stale. Recent tickets suggest agents no longer rely on this workaround, but I do not see an updated official article. This is a knowledge gap rather than a settled support answer.

## Example 8: missing evidence is not negative proof

**Situation:**

- No ticket note mentions a customer approval.
- No approval system or email thread has been checked.

**Preferred handling:**

- Say the approval is not found in checked Zendesk evidence.
- Do not say the approval never happened.
- Name the smallest source needed to prove or disprove it.

**Output wording:**

> I did not find approval in the Zendesk evidence checked. That does not prove approval never happened; the next check should be the approval email/thread or the relevant internal approval record.

## Safe conclusion patterns

Use these patterns when evidence is partial:

- "Confirmed from Zendesk: ..."
- "Supported by checked logs: ..."
- "Current-state only: ..."
- "Event-time evidence missing: ..."
- "Inferred, not confirmed: ..."
- "Disproven for the checked identifier: ..."
- "Blocked until `<specific source>` is checked: ..."

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
