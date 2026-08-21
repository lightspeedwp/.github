---
name: agency-scope-change-control
description: 'Hold the line on scope in a fixed-bid agency build. Use at the start of and throughout any client project delivered against an approved estimate/SOW: treat the estimate as a ceiling, resolve conflicting sources by a defined precedence order, and route anything not covered (extra templates, components, interactions, animations, bespoke mobile/tablet layouts, business rules, integrations) to a Change-Control Register for separate estimation instead of building it. Not WordPress-specific.'
compatibility: Process skill — no runtime dependency. Applies to any fixed-bid / fixed-scope client delivery (web, app, or otherwise). Assumes an approved estimate or SOW exists as the commercial source of truth.
---

# Agency Scope & Change Control

## Overview

On a fixed-bid build, the single biggest risk is **scope drift** — the slow accumulation of "nice", "almost free", "the design implies it" work that was never estimated. The approved estimate is a **ceiling, not a starting point.** This skill is the discipline that keeps a project inside its commercial envelope: build only what's covered, resolve conflicting instructions by a defined precedence, and divert everything else to a Change-Control Register so it can be estimated and approved separately.

It's deliberately not tech-specific — it applies to any project delivered against an estimate/SOW.

## When to use

- **At project start** — internalise the scope ceiling and the source-of-truth precedence before building anything.
- **Continuously while building** — every time you notice something that looks required but you can't tie it to the estimate.
- **When sources disagree** — the design shows one thing, the brief says another, a meeting decided a third.
- **When the client (or your own judgement) asks for "just one more thing."**

## Inputs required

- The **approved estimate / SOW** and its disclaimers — the commercial source of truth.
- The **requirements doc** (PRD/spec) that elaborates the estimate.
- Any **design files, meeting notes, email approvals** — and their dates.
- A place to keep the **Change-Control Register** (a doc, a Linear/Jira project, a section in the PRD).

## Procedure

1. **Establish the ceiling.** Read the estimate and its line items. That set — no more — is what "in scope" means. Write down anything ambiguous for clarification rather than assuming it's included.
2. **Resolve conflicts by precedence, not by recency or by whoever asked last.** Define the order explicitly for the project and apply it every time sources disagree. A typical order (adapt per project):
   1. The approved estimate and its disclaimers
   2. The email/contract chain confirming approval
   3. Latest documented meeting decisions
   4. Client-submitted designs (e.g. Figma)
   5. Working design-system / internal copies
   6. Older spec material
   7. Clearly-labelled assumptions
3. **Apply the scope test to every candidate piece of work.** Is it a line item in the estimate, or a direct elaboration of one? If **yes** → build it. If **no** or **unsure** → it's a change (step 4). "It would be nice", "it's almost free", "the design implies it", and "we already did the similar one" are **not** authorisation. Approval in one area does not extend to the next.
4. **Route out-of-scope work to the Change-Control Register** (see `references/change-control-register.md`): record it, don't build it, and flag it to the user/PM for separate estimation and approval.
5. **When genuinely in doubt, stop and ask** rather than building. An unbuilt in-scope item is a quick follow-up; an unbilled out-of-scope build is unpaid work and a precedent.

## Verification

- Every deliverable traces to an estimate line item or an **approved** change-control entry — nothing else shipped.
- Every out-of-scope discovery is **in the register**, not silently in the build and not silently dropped.
- Conflicting-source decisions cite **which precedence level won**, so they're auditable.

## Failure modes

- **Silent scope creep** — building the "obvious" extra without logging or billing it; sets a precedent the client will expect to repeat for free.
- **Recency bias** — treating the newest Figma frame or the last email as authoritative over the approved estimate.
- **Approval bleed** — assuming sign-off on one page/section authorises the analogous work elsewhere.
- **Bespoke responsive drift** — treating mobile/tablet as new designs to invent rather than **responsive adaptations of the supplied designs**. Novel breakpoint layouts are a change, not an adaptation.
- **Register as graveyard** — logging changes but never surfacing them to the PM/client, so they're neither built nor decided.

## Escalation

- Flag every register entry to the user/PM promptly — the register only works if entries become decisions (approve + estimate, or decline).
- If a client insists an item is "obviously included" and you read it as out of scope, escalate to the PM with the precedence reasoning rather than absorbing the work or arguing it yourself.

## Related

- `references/change-control-register.md` — the register's fields and workflow.
- `wp-agency-project-bootstrap` — wiring this discipline into a new project's docs from day one.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
