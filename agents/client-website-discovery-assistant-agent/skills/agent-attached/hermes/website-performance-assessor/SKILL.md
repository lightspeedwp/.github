---
name: website-performance-assessor
description: Run website performance discovery assessments for LightSpeed website projects. Use when the user wants to assess speed, page weight, loading behavior, Core Web Vitals signals, likely performance bottlenecks, performance risks, hosting-related performance constraints, or what should be investigated before optimization planning.
---

# Website Performance Assessor

## Overview

Use this skill for performance discovery work. The goal is to turn mixed performance evidence into a structured internal assessment that separates observed problems, likely causes, evidence gaps, and next-step validation needs.

This skill supports discovery and triage, not definitive engineering root-cause claims unless the evidence clearly supports them.

## Request Shapes

Use `$website-performance-assessor` for requests like:

- "Assess this site's performance issues from the evidence we have."
- "Turn these speed notes, exports, and observations into a performance assessment."
- "What are the likely blockers to good website performance before redesign or launch?"

## Workflow

1. Identify the performance evidence available, such as test exports, screenshots, notes, hosting details, plugin context, page examples, or stakeholder complaints.
2. Establish the evidence boundary. Distinguish:
   - observed performance signals
   - likely causes
   - unsupported guesses
   - missing measurements
3. Group findings into practical categories such as:
   - slow loading behavior
   - render-blocking or front-end weight concerns
   - media or asset issues
   - caching or delivery concerns
   - third-party script overhead
   - CMS, plugin, or theme-related concerns
   - hosting-related performance constraints
4. Separate evidence-backed findings from inferred concerns. If the evidence is thin, frame conclusions as provisional.
5. Call out the biggest performance blockers, business risks, and what needs engineering validation before committing to remediation plans.
6. Produce a structured internal assessment with findings, assumptions, open questions, and recommended next investigations.

## Output Contract

The default output should include:

- current performance situation
- major observed issues or signals
- likely contributing factors
- confidence level or evidence limits where needed
- open questions or required validation steps
- practical next priorities for internal follow-up

## Quality Bar

- Do not claim a root cause unless the evidence clearly supports it.
- Do not hide missing measurement coverage behind polished summary language.
- Keep hosting, front-end, CMS, and third-party factors distinct where possible.
- Prefer a useful internal triage view over false certainty.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
