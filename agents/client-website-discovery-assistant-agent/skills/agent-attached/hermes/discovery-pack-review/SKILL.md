---
name: discovery-pack-review
description: Review a website discovery pack, section draft, or client-ready summary for missing template sections, classification mistakes, internal-versus-client boundary issues, and unresolved template-field coverage before finalizing or sharing it.
---

# Discovery Pack Review

Use this skill when the user wants a quality review of a discovery pack, a partial discovery section, or a client-facing summary before it is reused, shared, or treated as final.

## When To Use

Use `$discovery-pack-review` when the request is about any of the following:

- checking whether a discovery pack is complete
- reviewing whether facts, assumptions, inferences, and open questions were labeled correctly
- confirming that internal-only LightSpeed notes were removed from a client-facing draft
- checking whether a draft covered the required mustache fields from the template system
- identifying review issues without rewriting the whole pack unless the user asks for fixes

Do not use this skill for first-pass pack creation from raw notes. Use it only after there is already a draft, section, or near-final output to inspect.

## Required Inputs

You need at least one of these:

- a full discovery document draft
- a partial discovery section that the user wants reviewed
- a client-facing summary draft
- a discovery output already structured against one of the template files

If the user does not provide the draft content directly, read the relevant attached files first when they are available.

## Review Sources

Use these grounded files as the review baseline when the draft appears to follow a standard discovery output:

- {{label:discovery-session-brief.md,id:6a021adb20388191873f15d02d127532,type:file}} for session-note and kickoff-summary structure
- {{label:internal-discovery-pack.md,id:6a021aea299081918d24cdd336b7c480,type:file}} for the main internal discovery-pack structure
- {{label:client-discovery-summary.md,id:6a021af67b988191b5888fb41f4fd196,type:file}} for client-facing structure and shareable tone
- {{label:discovery-followups.md,id:6a021b02314c8191b2c7c4240e3d9792,type:file}} for follow-up questions, ownership, and next-step tracking
- {{label:field-definitions.md,id:6a021b19fb748191b5d83a8a45b6dfb3,type:file}} for the approved field names and field meanings

Use the smallest relevant template as the standard. Do not force every draft to match every template.

## Review Workflow

1. Identify the review target.
   - Determine whether the draft is an internal pack, client-facing summary, session brief, follow-up document, or a partial section.
   - Determine whether the user wants review only, review plus fixes, or a readiness assessment.

2. Match the draft to the appropriate template baseline.
   - Choose the closest attached template.
   - If the draft is partial, review only the sections that should reasonably exist for that partial output.
   - If the draft clearly mixes templates, call that out instead of pretending the structure is coherent.

3. Run four review passes in this order.

### Pass 1: Missing Sections

Check whether the draft is missing required or clearly expected sections for its template type.

Flag:

- omitted core sections
- thin placeholder sections with no meaningful content
- sections that were implied elsewhere but never surfaced directly
- follow-up or ownership sections that should exist when open questions remain

Do not flag intentionally omitted sections when the user clearly requested a partial output.

### Pass 2: Classification Accuracy

Check each substantive claim for the correct label or treatment.

Use these rules strictly:

- confirmed facts must be directly supported by the user's notes or source material
- assumptions must remain explicitly uncertain
- inferred observations must read as reasoned conclusions, not direct evidence
- open questions must remain open rather than being silently answered by guesswork
- internal LightSpeed notes must stay separate from client-shareable content

Flag:

- assumptions presented as facts
- inferred conclusions presented as confirmed decisions
- unanswered questions hidden inside declarative statements
- blended bullets that mix multiple classification types together
- contradictory classifications across sections

### Pass 3: Client-Facing Boundary Check

When the draft is client-facing or could plausibly be shared externally, check for internal-only content leakage.

Flag:

- internal strategy commentary
- delivery-risk language that should stay internal unless intentionally rewritten for the client
- shorthand, blunt internal phrasing, or team-only notes
- references to internal concern, margin, scope anxiety, or internal process commentary that are not suitable for client sharing
- recommendations stated in an overly internal or presumptive tone

If the draft is explicitly internal, do not flag internal notes just for existing. Instead, flag only boundary confusion where the internal/client distinction is unclear.

### Pass 4: Template Field Coverage

Check whether the draft actually covers the template-ready fields that appear necessary for the selected output.

Use {{label:field-definitions.md,id:6a021b19fb748191b5d83a8a45b6dfb3,type:file}} to verify field intent.

Flag:

- important fields with no supported value in the draft
- values that appear invented just to fill a placeholder
- fields whose meaning was misunderstood or mapped to the wrong content
- unresolved fields that should be called out explicitly but were silently skipped
- duplicated content filling several different fields without justification

Do not require every field to be fully known. It is acceptable for a field to remain unresolved if the draft makes that gap explicit.

## Output Contract

Default to a concise review report with these sections in order:

### Review Status

- Give a one-line verdict such as `Ready`, `Needs minor fixes`, or `Needs substantial revision`.

### Key Issues

- List the highest-impact issues first.
- Group issues under these headings when relevant:
  - Missing sections
  - Classification mistakes
  - Client-facing boundary issues
  - Template field coverage gaps

### Recommended Fixes

- Give concrete corrections.
- Keep each fix tied to a specific issue.
- If the user asked for review only, describe the fix without rewriting the full document.
- If the user asked for fixes, apply the correction directly after the review summary or rewrite only the affected sections.

### Safe-to-Share Notes

- Include this only for client-facing drafts.
- State whether the draft is safe to share externally as-is, safe after minor fixes, or not safe to share yet.

## Review Style

- Be specific and evidence-based.
- Quote or point to the exact problematic section when possible.
- Prefer practical corrections over generic critique.
- Do not invent missing source facts during review.
- Do not rewrite the entire pack unless the user asked for a revised draft.
- When the draft is strong, say so plainly instead of manufacturing issues.

## Example Request Shapes

- `Review this internal discovery pack for missing sections and classification mistakes.`
- `Check whether this client-facing summary still leaks internal notes.`
- `Audit this draft against the discovery templates and tell me what fields are still missing or unresolved.`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
