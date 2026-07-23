# The Change-Control Register

A lightweight, always-current list of work discovered to be **outside the approved estimate**. Its job is to make sure such work is neither silently built (unpaid, precedent-setting) nor silently lost (client expected it). Every entry is a decision waiting to happen: **estimate + approve**, or **decline**.

## Where it lives

Anywhere durable and visible to the PM/client: a section in the PRD, a dedicated doc, or a labelled Linear/Jira project. One register per project. It must be somewhere the PM actually looks — a register nobody reads is a graveyard.

## Fields per entry

| Field | Purpose |
|---|---|
| **ID / date** | Stable reference; when it was raised |
| **Item** | What the work is, concretely |
| **Where it surfaced** | Design frame, client message, meeting, or your own observation |
| **Why it's out of scope** | Which estimate line it is *not*, or that no line covers it |
| **Rough size** | T-shirt / hours estimate, if known — helps triage |
| **Status** | `logged` → `raised with PM` → `estimated` → `approved` / `declined` / `deferred` |
| **Resolution** | The decision and any linked change order / new estimate |

## Workflow

1. **Log** the moment you spot it — before you're tempted to "just do it."
2. **Do not build it.** (If it's a one-line CSS tweak you already made reflexively, still log it — the point is the precedent and the billing, not the effort.)
3. **Raise it with the PM/client** in the next update, not at project end.
4. **On approval**, it becomes scope: estimate it, get written sign-off, then build.
5. **On decline/defer**, mark it so — so nobody rebuilds the debate later.

## What belongs here

Anything not traceable to an estimate line item: extra templates or pages, extra components, additional interactions or animations, **bespoke** mobile/tablet layouts (as opposed to responsive adaptations of supplied designs), new business rules, and new third-party integrations.

## What does not

Work that is a **direct elaboration** of an estimated line item (the estimate says "product page"; building its add-to-cart states is elaboration, not a change). When the boundary is unclear, log it and ask — the register is also a good place to resolve genuine ambiguity.
