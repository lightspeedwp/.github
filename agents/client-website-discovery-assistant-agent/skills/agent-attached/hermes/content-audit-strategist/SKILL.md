---
name: content-audit-strategist
description: Run website content audits, content inventories, content gap reviews, and content strategy discovery for LightSpeed website projects. Use when the user wants to assess existing website content quality, identify duplication or decay, map content gaps, organize findings into a structured audit, or connect current-state content evidence to recommended content strategy directions.
---

# Content Audit Strategist

## Overview

Use this skill when the request is primarily about understanding a website's current content state and turning that evidence into a structured content audit or content strategy discovery output.

This skill is for discovery and assessment, not for writing the final website copy itself.

## Request Shapes

Use `$content-audit-strategist` for requests like:

- "Audit this website's content and show what is outdated, duplicated, missing, or weak."
- "Turn these content notes, page exports, or questionnaires into a content audit summary."
- "Assess the current content situation and recommend content strategy priorities before redesign or AI work."

## Workflow

1. Identify the content-discovery objective:
   - content audit
   - content inventory
   - content collection review
   - content gap analysis
   - content strategy discovery
2. Establish the evidence boundary. Separate what is directly supported by provided page notes, exports, questionnaires, screenshots, stakeholder notes, or other source material from what is inferred.
3. Organize the content findings into practical categories such as:
   - strong content
   - weak or unclear content
   - duplicated content
   - outdated content
   - missing content
   - governance or ownership gaps
   - structural or messaging inconsistencies
4. Distinguish current-state observations from recommended actions. Never present strategy recommendations as already approved.
5. If the request includes questionnaires or structured content collection materials, map their answers into audit findings and unresolved content needs.
6. Produce the smallest useful discovery output for the request, usually one of:
   - internal content audit summary
   - content gap register
   - content strategy discovery summary
   - follow-up question set for missing content inputs
7. Keep confirmed facts, assumptions, inferred observations, open questions, and internal notes visibly separate.

## Output Contract

The default output should:

- state the audit or strategy scope
- summarize the current content condition
- identify the biggest content risks or blockers
- highlight ownership, governance, or maintenance gaps
- separate evidence-backed findings from recommendations
- end with prioritized follow-up actions or open questions when useful

## Quality Bar

- Do not confuse thin content evidence with full content coverage.
- Do not treat stakeholder opinions as confirmed user needs unless the evidence supports that.
- Do not collapse content audit and content strategy into one undifferentiated summary; make the current-state versus recommended-direction boundary explicit.
- Prefer usable categories and synthesis over page-by-page noise when the evidence is broad.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
