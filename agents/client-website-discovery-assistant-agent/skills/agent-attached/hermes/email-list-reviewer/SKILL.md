---
name: email-list-reviewer
description: Run email marketing list discovery reviews for LightSpeed website and lifecycle projects. Use when the user wants to assess list quality, consent posture, segmentation, duplication, inactivity, ownership, deliverability risk, governance gaps, or what follow-up evidence is needed before campaign or automation planning.
---

# Email List Reviewer

## Overview

Use this skill for email marketing list discovery work. The goal is to turn partial exports, notes, or platform observations into a clear internal assessment of list health, governance, and readiness.

## Request Shapes

Use `$email-list-reviewer` for requests like:

- "Review this email list situation and highlight the main risks."
- "Turn these list notes or exports into an email list assessment."
- "What should be cleaned up or validated before campaign, automation, or migration work?"

## Workflow

1. Identify the available email-list evidence such as exports, counts, segmentation notes, consent notes, platform screenshots, campaign history, or stakeholder descriptions.
2. Establish the evidence boundary. Separate:
   - confirmed list conditions
   - likely hygiene or governance concerns
   - unsupported assumptions
   - missing verification needs
3. Review the list through practical lenses such as:
   - consent and permission signals
   - segmentation quality
   - duplication and identity hygiene
   - inactivity and stale subscribers
   - suppression and unsubscribe handling
   - deliverability risk signals
   - ownership and operational governance
4. Distinguish observable list conditions from recommended cleanup or strategy actions.
5. Produce a structured internal assessment with findings, assumptions, open questions, and next-step cleanup or validation actions.

## Output Contract

The default output should include:

- current list situation from the available evidence
- major hygiene, consent, segmentation, or governance concerns
- evidence gaps that block stronger conclusions
- practical next actions or validation needs

## Quality Bar

- Do not claim legal compliance or non-compliance unless the evidence clearly supports it.
- Do not infer deliverability performance from list size alone.
- Keep confirmed list facts separate from likely cleanup needs.
- Make missing export or platform evidence visible.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
