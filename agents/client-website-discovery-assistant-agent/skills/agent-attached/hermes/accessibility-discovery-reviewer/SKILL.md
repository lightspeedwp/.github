---
name: accessibility-discovery-reviewer
description: Run website accessibility discovery assessments for LightSpeed website projects. Use when the user wants to assess accessibility findings, likely compliance or usability risks, evidence gaps, recurring accessibility problem patterns, or what should be validated before remediation planning.
---

# Accessibility Discovery Reviewer

## Overview

Use this skill when the task is to turn accessibility evidence into a structured assessment that is useful for internal triage, client discussion, or follow-up planning.

This is discovery-oriented accessibility review, not a legal certification or a claim of full compliance.

## Request Shapes

Use `$accessibility-discovery-reviewer` for requests like:

- "Assess this website's accessibility situation from our notes and findings."
- "Turn these accessibility observations into a structured internal assessment."
- "What accessibility risks and validation gaps should we highlight before remediation planning?"

## Workflow

1. Identify the available accessibility evidence such as audits, screenshots, notes, QA findings, page examples, stakeholder complaints, or tool outputs.
2. Establish the evidence boundary and distinguish:
   - observed accessibility issues
   - repeated patterns across pages or templates
   - likely but unverified concerns
   - missing validation coverage
3. Group findings into categories such as:
   - navigation and keyboard access
   - color contrast and visual legibility
   - form and input issues
   - semantics and structure
   - media and alternative text concerns
   - interactive component or state issues
   - content clarity or assistive-technology risks
4. Frame the output as an internal accessibility assessment unless the request clearly asks for a different mode.
5. Identify risk severity carefully, but avoid claiming full coverage when only partial evidence is available.
6. Produce an assessment that separates findings, assumptions, open questions, and required validation or remediation follow-up.

## Output Contract

The default output should include:

- current accessibility picture from the available evidence
- key issue groups and likely user impact
- confidence or coverage limitations
- open questions and missing validation areas
- practical next actions for internal follow-up or specialist review

## Quality Bar

- Do not present partial accessibility review as full compliance status.
- Do not overstate severity when the evidence is weak.
- Keep observed issues distinct from inferred pattern-based concerns.
- Make missing validation coverage visible.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
