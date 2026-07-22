---
name: design-qa-readiness
description: Use the Design QA Readiness skill to assess and validate design documents before they are handed off for development. This skill is ideal for ensuring that briefs, layout directions, page concepts, and Figma handoffs are clear, complete, and feasible, helping you identify gaps and risks to prevent misunderstandings in the design process.
---

# Design QA Readiness

Use this skill to pressure-test design work before the agent treats it as ready.

Apply it to any of these request shapes:

- "Review this brief before I send it to design."
- "Check whether this layout direction is actually buildable."
- "QA this page concept for gaps, risks, and missing decisions."
- "Tell me if this is ready for Figma or WordPress handoff."

Do not use this skill for net-new concept generation unless the user is specifically asking for a review pass.

## What to Review

Review the artifact against the smallest useful readiness bar for the current stage:

1. **Goal clarity** — Is the objective clear enough to judge success?
2. **Audience and message clarity** — Is the target audience and primary message specific enough?
3. **Information completeness** — Are key inputs, required sections, dependencies, and constraints present?
4. **Design logic** — Does the structure, hierarchy, and section flow make sense?
5. **Implementation feasibility** — Is the direction realistic for responsive design, Figma execution, and WordPress block-theme implementation?
6. **Handoff readiness** — Is there enough specificity for the next person or system to act without guessing?

## Review Workflow

1. Identify the artifact type:
   - brief
   - layout direction
   - page concept
   - Figma-ready handoff
2. Separate **confirmed requirements** from **assumptions**.
3. Check for missing information that would materially weaken the next step.
4. Flag weak or contradictory decisions, especially around hierarchy, CTA strategy, content dependencies, responsiveness, and implementation.
5. Judge the artifact against the appropriate readiness checklist below.
6. Return a concise verdict plus the minimum edits needed to move it forward.

## Stage-Specific Readiness Checks

### 1) Brief readiness

A brief is ready when it clearly defines:

- objective
- audience
- page or asset type
- key message
- required sections or components
- visual direction or reference intent
- content inputs or dependencies
- WordPress or implementation constraints when relevant
- expected output

Flag the brief as **not ready** if the agent would need to invent major scope, messaging, or structure decisions.

### 2) Layout direction readiness

A layout direction is ready when it clearly explains:

- section order and purpose
- hierarchy and focal points
- CTA placement and intent
- content density and flow
- responsive behavior
- reusable component or block logic
- implementation constraints that affect the layout

Flag it if it looks visually plausible but does not explain structure well enough to build.

### 3) Page concept readiness

A page concept is ready when it aligns:

- business goal
- user journey
- content strategy
- visual hierarchy
- responsive behavior
- implementation feasibility

Flag it if the concept depends on vague content, hidden assumptions, or interactions that are awkward in a normal block-theme workflow.

### 4) Figma-ready handoff readiness

A Figma-ready handoff is ready when it includes:

- frame or page purpose
- section structure and order
- component list
- content placeholders or content status
- style direction
- responsive notes
- implementation notes where WordPress matters

Flag it if a designer would still need to guess layout logic, states, component intent, or content ownership.

## WordPress Block-Theme Review Rules

When WordPress is relevant, explicitly check:

- whether sections map cleanly to templates, patterns, template parts, or reusable blocks
- whether spacing, typography, color, and layout decisions can be supported through `theme.json` or normal block controls
- whether the concept relies on one-off custom behavior that should be called out as an exception
- whether reusable patterns are being treated as one-off page design when they should be systemized

If the design is approved and the next step is implementation handoff, recommend using {{label:wordpress-block-theme-handoff,id:hsk_6a032c7ba3b081919bdd5827c5452001,type:skill}} rather than improvising the implementation plan.

## Output Format

Use this exact section order:

### Verdict

State one of:

- **Ready**
- **Ready with minor fixes**
- **Not ready**

### What holds up

List the strongest parts that are already clear and usable.

### Gaps and risks

List only the issues that materially affect the next step. Group them under short labels such as **Missing input**, **Weak decision**, **Implementation risk**, or **Handoff ambiguity**.

### Minimum fixes

Give the smallest set of edits needed to make the artifact usable.

### Next step

Say the most appropriate next move:

- refine the brief
- revise the layout direction
- tighten the handoff
- proceed to Figma
- proceed to WordPress implementation handoff

## Review Style Rules

- Be decisive and practical.
- Do not praise weak work vaguely.
- Do not rewrite the entire artifact unless the user asks.
- Prefer the minimum viable correction path over broad redesign advice.
- Call out assumptions explicitly instead of treating them as confirmed.
- If the artifact is usable but rough, say so clearly instead of failing it for minor polish issues.

## Example

**Input:** "QA this homepage layout direction before I hand it to a designer."

**Good response shape:**

### Verdict

**Ready with minor fixes**

### What holds up

- Hero goal and CTA are clear.
- Section order supports the user journey.
- The structure is compatible with a block-based homepage build.

### Gaps and risks

- **Missing input:** Social proof content is referenced but not defined.
- **Weak decision:** The comparison section does not identify the primary decision criteria.
- **Implementation risk:** Two custom interactive states are implied but not described well enough to estimate build effort.

### Minimum fixes

- Define the testimonial source and fallback content plan.
- Clarify the comparison criteria used in the pricing or feature section.
- Note whether the interactive states should be standard block behavior or custom code.

### Next step

Refine the layout direction, then proceed to Figma.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
