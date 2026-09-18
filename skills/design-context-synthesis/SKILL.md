---
name: design-context-synthesis
description: Use when the request depends on reconciling scattered or conflicting design context across briefs, emails, project tasks, reference docs, repository files, WordPress block-theme constraints, or Figma goals before producing a brief, layout direction, page concept, or Figma-ready handoff.
---

# Design Context Synthesis

Use this skill when the user has not given one clean brief and you need to convert messy project context into a reliable design starting point.

This skill is especially useful when:

- the request references several sources at once
- stakeholder intent is buried in email or task history
- content, implementation, and design constraints are split across docs and repositories
- WordPress block-theme or `theme.json` realities must shape the design direction
- source materials conflict and you need a conservative, source-backed recommendation

## Request Shapes

Use `$design-context-synthesis` for requests like:

- "Pull together the brief from the email thread, Drive docs, and the Asana task, then propose the landing page layout."
- "Review the repo and theme settings, then turn this rough homepage idea into a WordPress-friendly design direction."
- "I have notes in Gmail, screenshots in Drive, and requirements in Asana. Create a Figma-ready handoff without inventing missing details."

Success means you produce a cleaner downstream artifact than the raw inputs: a clarified brief, a layout direction, a page concept, or a Figma-ready handoff that clearly separates confirmed facts from assumptions.

## Workflow

1. Identify the target deliverable before gathering more context.
   - Classify the user’s real need as one of: clarified brief, layout direction, page design direction, or Figma-ready handoff.
   - Do not gather extra context without a purpose.

2. Gather only the minimum source material needed.
   - Use {{label:Gmail,id:connector_2128aebfecb84f64a069897515042a44,type:app}} for stakeholder requests, approvals, and clarification history.
   - Use {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} for docs, decks, spreadsheets, references, and content inputs.
   - Use {{label:Asana,id:asdk_app_69616780bd208191b4fb44ba44f72b61,type:app}} for task scope, project requirements, and implementation constraints.
   - Use {{label:GitHub,id:connector_76869538009648d5b282a4bb21c3d157,type:app}} when the request depends on block-theme structure, templates, patterns, components, or `theme.json` reality.
   - Use {{label:Figma,id:connector_68df038e0ba48191908c8434991bbac2,type:app}} only when the request needs design-context inspection tied to a Figma outcome.
   - Do not browse broadly. Pull the smallest set of sources that can resolve the current design decision.

3. Build a source-backed context map.
   - Extract only the details that affect the design outcome.
   - Sort findings into four buckets:
     - confirmed requirements
     - implementation constraints
     - likely assumptions
     - unresolved questions
   - Prefer exact constraints over inferred preferences.

4. Resolve conflicts conservatively.
   - When sources disagree, prefer the most recent explicit requirement unless a stronger implementation constraint prevents it.
   - If design intent conflicts with repository or WordPress reality, keep the recommendation implementation-aware rather than idealized.
   - If a conflict materially changes the deliverable, call it out plainly instead of silently choosing one side.

5. Convert the context map into the final artifact.
   - For a brief, write a compact brief with objective, audience, asset/page type, key message, required sections, dependencies, constraints, and output expectation.
   - For a layout direction, translate the context into section flow, hierarchy, CTA strategy, and responsive behavior.
   - For a page design direction, include block-theme feasibility and where decisions likely belong across templates, patterns, template parts, or global styles.
   - For a Figma-ready handoff, include structure, components, content placeholders, style direction, responsive notes, and WordPress implementation notes.

6. Ask only when a missing detail is truly blocking.
   - If the current source set is good enough to produce a useful first pass, proceed.
   - If a blocker remains, ask one sharp question that unlocks the artifact instead of requesting a general discovery session.

## Output Contract

Unless the user asked for a different format, structure the response in this order:

### 1. Context Summary

- **Deliverable**
- **Primary goal**
- **Sources used**

### 2. Grounded Findings

- **Confirmed requirements**
- **Implementation constraints**
- **Assumptions**
- **Open questions** (omit when none remain)

### 3. Recommended Artifact

Provide the actual brief, layout direction, page concept, or Figma-ready handoff.

### 4. Risk Notes

- include only if source conflicts, missing inputs, or implementation tradeoffs materially affect confidence

## Quality Bar

- Do not turn source collection into a research dump.
- Do not present assumptions as confirmed requirements.
- Do not ignore WordPress block-theme or `theme.json` constraints when they are relevant.
- Do not claim Figma work was completed unless it actually was.
- Favor a practical, buildable recommendation over a visually ambitious but implementation-blind one.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
