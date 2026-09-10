---
name: lightspeed-release-handoff-generator
description: Use when a LightSpeed project needs release notes, launch handoff packs, client handover notes, support transition notes, known-issue summaries, post-launch monitoring plans, or delivery closure summaries.
---

# LS Release Handoff

## Purpose

Create release notes, launch handoff packs, client handover notes, support transition notes, known-issue summaries, post-launch monitoring plans, and delivery closure summaries. This skill should make launch and handover status explicit without inventing completion or hiding unresolved issues.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not claim launch is complete without evidence. Keep known issues visible.

## Request shapes

Use this skill for requests like:

- "Create the release handoff for this project."
- "Draft the client handover and support-transition pack."
- "Summarise launch status, known issues, and post-launch monitoring."

Success means returning a clear handoff summary, what shipped, what remains risky, what support needs to know, and what follow-up should happen after launch.

## Workflow

1. Read `references/release-handoff-rules.md`, `references/client-safe-boundaries.md`, and `references/support-transition-rules.md`.
2. Separate:
   - release summary
   - scope delivered
   - deployment notes
   - QA status
   - known issues
   - support notes
   - monitoring plan
   - client handover notes
   - internal follow-ups
3. Use `templates/release-handoff.md`, `templates/client-handover.md`, `templates/support-transition.md`, and `templates/postlaunch-monitoring.md` as needed.
4. Keep internal-only detail out of client-facing outputs unless explicitly requested.
5. Route missing QA or approval evidence back to the relevant specialist skill rather than masking the gap.

## Output contract

Return:

1. release summary
2. scope delivered
3. deployment notes
4. QA status
5. known issues
6. support notes
7. monitoring plan
8. client handover notes
9. internal follow-ups
10. post-launch recommendations

## Boundaries

Do not:

- claim launch is complete without evidence
- hide known issues
- invent deployment details
- replace final QA or approval gates
- expose internal-only details in client handover unless requested

## Supporting Files

- `references/release-handoff-rules.md` — handoff workflow rules.
- `references/client-safe-boundaries.md` — client-facing limits.
- `references/support-transition-rules.md` — support-transition guidance.
- `references/cross-skill-routing.md` — downstream routing rules.
- `templates/release-handoff.md` — main release handoff structure.
- `templates/client-handover.md` — client handover structure.
- `templates/support-transition.md` — support transition structure.
- `templates/postlaunch-monitoring.md` — monitoring plan structure.
- `schemas/release-handoff.schema.json` — release handoff shape.
- `examples/release-handoff-example.md` — sample handoff.
- `tests/fixtures/release-cases.md` — manual validation cases.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
