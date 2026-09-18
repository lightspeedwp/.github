---
name: case-investigation
description: Investigate a single support issue end to end by building an evidence-backed case file across ticket history, runtime signals, implementation clues, known-issue coverage, and account context. Use when the user needs deeper diagnosis than triage, wants proof of what happened, or needs a root-cause or lookup answer that can survive handoff.
---

# Case Investigation

> If placeholders such as `[[example_placeholder]]` are still unresolved, use
> the shared agent file `CONNECTORS.md` to map them to the connected tools for
> this agent.

Use this skill to turn one customer issue into a grounded investigation.

## What This Skill Does

- investigates one support issue or reported failure at a time
- distinguishes `RCA`, `Proof`, and `Lookup` goals before reasoning
- builds an explicit evidence ledger instead of jumping straight to a theory
- uses connector placeholders rather than assuming one internal support stack
- separates confirmed facts, open branches, and assumptions cleanly
- leaves behind a resumable case note when the investigation is likely to continue across turns
- ends with one clear disposition and the most useful next action
- defaults to the shared investigation template when presenting the final investigation

## Default Frame

- Optimize for support diagnosis, not broad customer health synthesis.
- Focus on the single active issue unless the user explicitly asks for pattern analysis across many cases.
- Prefer the fastest falsification step over broad exploration.
- If the user asks for proof or lookup, do not force a root-cause story.

## When To Use This Skill

Use this skill when:

- triage is not enough and the case needs deeper diagnosis
- the user wants to prove or disprove a specific claim
- the issue depends on `[[logs]]`, {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}}, {{label:GitHub,id:connector_76869538009648d5b282a4bb21c3d157,type:app}}, config, or account state
- support needs a durable investigation checkpoint before replying or escalating

Do not use this skill for:

- first-pass severity and routing only
- broad recent-customer context across many tickets
- immediate customer reply drafting without deeper diagnosis

## Investigation Goals

Choose exactly one primary goal before concluding:

- `RCA`
  - explain why the behavior happened
- `Proof`
  - prove or disprove a specific claim
- `Lookup`
  - find a specific fact, timeline, owner, status, or identifier

If the goal changes mid-investigation, say so explicitly and adjust the output.

## Workflow

1. Normalize the case.
   - Capture the issue, expected versus actual behavior, identifiers, current status, and any relevant time window.
   - If a critical identifier is missing, ask for the minimum blocking detail.
2. Choose the investigation goal.
   - Classify the task as `RCA`, `Proof`, or `Lookup`.
   - State the chosen goal in the working notes.
3. Build the branch ledger before broad searching.
   - List the major explanations or decision points that could change the answer.
   - Map each branch to the best source category.
4. Gather evidence in order of authority.
   - {{label:Zendesk MCP Server,id:asdk_app_69f8a7e1dbb881919b56c4b21f3a3fa1,type:app}} or case record first when available
   - then `[[logs]]` or {{label:GitHub,id:connector_76869538009648d5b282a4bb21c3d157,type:app}} if behavior must be proven
   - then supporting context such as {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}}, {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}}, {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}}, `[[crm]]`, {{label:Asana,id:asdk_app_69616780bd208191b4fb44ba44f72b61,type:app}}, or {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}}
5. Resolve or narrow each critical branch.
   - Mark branches as verified, disproven, unknown, or blocked.
   - Record why a branch remains open.
6. Re-check for known issue or reusable pattern coverage.
   - Look for prior incidents, KB articles, troubleshooting notes, or existing cases that materially change the answer.
7. Form the disposition.
   - Return one best-supported conclusion.
   - If evidence is incomplete, say `Inconclusive` or `Assumption` rather than overstating certainty.
8. Hand off cleanly.
   - Recommend the next skill or action that follows naturally from the result.

## Core Inputs

Try to confirm these before deep investigation:

- issue summary
- expected versus actual behavior
- at least one stable identifier
  - ticket ID, case ID, user ID, org/workspace/account ID, email, request ID
- channel or surface
  - product UI, API, billing flow, email thread, import/export, SSO, and so on
- time window when event-time evidence matters

If the time window is missing, do not block immediately. Only block when the investigation clearly depends on incident-time evidence.

## Branch Ledger (Required)

Create a compact branch ledger before concluding.

Use a structure like:

| branch | question | source category | status | evidence |
| --- | --- | --- | --- | --- |
| auth check | did access fail because of permissions? | {{label:Zendesk MCP Server,id:asdk_app_69f8a7e1dbb881919b56c4b21f3a3fa1,type:app}} / `[[crm]]` | verified | ticket notes + account state |
| runtime behavior | did the request actually fail at that time? | `[[logs]]` | blocked | no request ID yet |
| known issue | is this already a documented issue? | {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} / {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} / {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} | disproven | no matching issue found |

Rules:

- Every critical branch must end as `verified`, `disproven`, or `blocked`.
- Do not skip the ledger just because the issue feels obvious.
- If a branch is blocked, record what evidence would unblock it.

## Source Categories and What They Are Good For

Use the smallest authoritative source that can answer the branch.

- {{label:Zendesk MCP Server,id:asdk_app_69f8a7e1dbb881919b56c4b21f3a3fa1,type:app}}
  - case timeline, owner changes, attachments, prior support promises
- `[[logs]]`
  - runtime evidence, status codes, request traces, error signatures, timing
- {{label:GitHub,id:connector_76869538009648d5b282a4bb21c3d157,type:app}}
  - codebase, technical docs, config definitions, feature logic
- {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} / {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}}
  - known issues, troubleshooting steps, policy, existing guidance
- {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} / {{label:Asana,id:asdk_app_69616780bd208191b4fb44ba44f72b61,type:app}}
  - recent internal discussion, ownership context, linked incidents, active work
- `[[crm]]`
  - contacts, account state, business context, known customer constraints
- {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} / exports / pasted artifacts
  - fallback evidence when connectors are unavailable

## Source Precedence

When sources disagree:

1. confirm they refer to the same customer, issue, and time window
2. prefer the most authoritative source for that branch
3. prefer the freshest source when the branch is time-sensitive
4. call out the contradiction directly instead of smoothing it over

Examples:

- A ticket comment can outrank {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} speculation about what was promised.
- Runtime logs can outrank a human summary of whether a request failed.
- A current account setting can be authoritative for present state, while a historical export may be better for an incident-time question.

## Event-Time Versus Current-State

Make this distinction explicitly.

- `Current-state`
  - best for current configuration, ownership, open-ticket status, and present account settings
- `Event-time`
  - best for proving what happened at a specific time, whether a request failed, whether a workflow regressed, or whether the state was different during an incident

If the case depends on event-time truth and you do not have a reliable time window, stop and ask for it.

## Known-Issue and Pattern Check

Before finalizing, check whether the issue is already explained somewhere.

Look across:

- {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} or troubleshooting {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}}
- prior similar tickets
- {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} threads or {{label:Asana,id:asdk_app_69616780bd208191b4fb44ba44f72b61,type:app}} issues
- existing workaround notes

This check matters because it can change the answer from:

- `new unexplained bug`
to
- `known issue with existing workaround`

## Resumable Investigation Notes

If the case is likely to continue, maintain a local investigation note.

- Prefer a user-specified path when one exists.
- Otherwise use a local folder such as:
  - `./case-investigations/<date>_<case-slug>/investigation.md`
- Treat that note as append-only working state.
- Use `references/investigation-template.md` when you want a lightweight structure instead of improvising one.
- Record:
  - case identifiers
  - goal
  - branch ledger
  - sources checked
  - exact searches or queries when useful
  - strongest evidence
  - blockers
  - current disposition

If local file output is not appropriate for the environment, keep the same structure in the response itself.

## Conclusion Rules

For `RCA`:

- do not name a root cause unless at least one high-signal source supports it
- pair behavior evidence with implementation, config, or known-issue context
- if the behavior is only partially proven, downgrade to `Likely cause` or `Inconclusive`

For `Proof`:

- answer `Proven`, `Disproven`, or `Inconclusive`
- include the strongest supporting evidence and the main remaining gap

For `Lookup`:

- answer the requested fact directly
- include source and time reference when relevant
- avoid causal commentary unless the user asked for it

## Escalate Versus Answer

Use this quick check before deciding the next move:

- favor `draft-response` when the case is sufficiently explained and the main need is customer communication
- favor `customer-escalation` when the investigation points to active product, engineering, security, or leadership follow-through
- favor `create-knowledge` when the issue is now understood well enough to document a stable workaround or repeatable support motion
- stay in investigation mode only when a critical branch is still unresolved

## Default Output Template

Use {{label:investigation-template.md,id:69f939cdce34819187d2bd05bff323ee,type:file}} as the default final structure unless the user explicitly asks for a different format.

When the task calls for a normal investigation deliverable:

- preserve the template's headings when they fit the case
- keep confirmed facts separate from assumptions and unresolved questions
- omit empty sections instead of leaving placeholders
- include the customer reply section only when a reply draft would materially help the next step
- end with sources checked that identify the strongest evidence behind the conclusion

## Non-Guessing Rules

- Do not invent request IDs, account impact, or root cause.
- Do not confuse absence of evidence with evidence of absence.
- Do not force a product bug explanation when the case is really a policy or usage issue.
- Do not turn chat speculation into a conclusion without stronger support.
- If the evidence is mixed, say what is known, what is not known, and what would most change the answer.

## Output Contract

Use {{label:investigation-template.md,id:69f939cdce34819187d2bd05bff323ee,type:file}} by default.

Make sure the final investigation clearly covers:

- the active issue and investigation goal
- the best-supported conclusion or current disposition
- confirmed facts and strongest evidence
- what remains unclear, blocked, or inconclusive
- the recommended next action or handoff
- the sources checked
- when a reply or escalation is also needed, keep the investigation as its own deliverable and use the matching template for each additional deliverable

## Examples

For short worked examples, see `references/example-investigations.md`.

## Suggested Next Steps

When the investigation is done, suggest the next step only if it naturally
follows:

- `draft-response`
  - when the diagnosis is complete enough to write a customer-facing update
- `customer-escalation`
  - when the result points to engineering, product, security, or leadership follow-up
- `create-knowledge`
  - when the investigation produces a stable workaround, repeated pattern, or reusable troubleshooting path
- `customer-research`
  - when the case would benefit from broader customer or account context before the next reply
- targeted follow-up investigation
  - when one blocked branch needs a narrower second pass rather than a full restart

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
