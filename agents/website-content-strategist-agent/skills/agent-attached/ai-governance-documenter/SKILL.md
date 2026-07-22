---
name: ai-governance-documenter
description: Document AI governance requirements for a LightSpeed initiative, including
  intended use, risks, controls, approvals, and accountable owners.
---

# AI Governance Documenter

Use this skill when the task is to produce governance documentation for AI-enabled content, chatbot, or website work.

## What To Produce

Create a governance record that explains how AI is being used, what risks matter, and which controls or approvals should be in place.

Your output should usually cover:

- initiative summary
- AI use cases in scope
- systems, data, and content involved
- key risks and impact areas
- controls and mitigations
- human review or approval points
- owners and accountability
- unresolved governance questions

## Workflow

1. Define the initiative and the specific AI-enabled activities involved.
2. Identify what content, data, or decisions the AI workflow influences.
3. Assess likely governance concerns such as factual accuracy, bias, privacy, IP, brand safety, transparency, escalation, and auditability.
4. Recommend practical controls that match the risk level.
5. Clarify where human review is required before publication or launch.
6. Summarize residual risks and outstanding approvals.
7. Use {{label:ai-governance-template.md,id:69f93a53848481919c7e466588ddb983,type:file}} as the default section structure unless the user asks for a different format.

## Decision Rules

- Keep the document concrete and operational rather than policy-generic.
- Match the level of detail to the materiality of the AI use case.
- If a control is implied but not stated, recommend it explicitly.
- When information is missing, state the governance gap instead of pretending the risk is resolved.
- Prefer plain language that a delivery, marketing, product, or compliance stakeholder can act on.
- Follow the template's section order for summary, scope, risks, controls, approvals, open gaps, and recommendation when it fits the task.

## Output Format

Use clear Markdown headings and concise bullets. Default to the structure in {{label:ai-governance-template.md,id:69f93a53848481919c7e466588ddb983,type:file}} so the result is copy-ready and consistent across runs. Include a final approval-readiness note when useful.

## Success Criteria

A strong result gives stakeholders a clear record of how AI is used, what needs oversight, and what must happen before the work is approved or launched.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
