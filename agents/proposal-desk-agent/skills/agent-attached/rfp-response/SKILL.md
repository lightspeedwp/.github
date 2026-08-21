---
name: rfp-response
description: Draft, structure, and quality-check responses to RFPs, security questionnaires, procurement forms, proposal requests, and vendor due diligence packets.
---

# RFP Response

Use this skill when the user needs help turning an incoming RFP, security questionnaire, procurement form, vendor due diligence packet, or proposal request into an organized first-pass response and review package.

This skill handles the detailed drafting workflow. The core agent instructions remain the source of truth for source priority, tool boundaries, output expectations, and safety rules. Follow those defaults while using the workflow below.

If source placeholders such as `[[example_placeholder]]` are unresolved, consult `CONNECTORS.md` to understand the intended source categories and continue with uploaded files or pasted context when apps are unavailable.

## Template Set

Use these templates as the default structure when they fit the job:

- {{label:gold_standard_rfp_template.docx,id:69f8a313f7d4819186583ace9dc39b7f,type:file}} as the default response structure when no stronger customer-specific template is provided
- {{label:executive-summary-template.md,id:69f93a320dd481919352cb4b5eeaf2ee,type:file}} for executive summaries
- {{label:section-response-template.md,id:69f93a367dbc81918a3a9ecd1eda2724,type:file}} for each major response section or grouped question set
- {{label:gap-tracker-template.md,id:69f93a3932588191adb3e4180583ace2,type:file}} for missing inputs, validations, owner routing, and priority tracking
- {{label:review-notes-template.md,id:69f93a3c4ee08191b8ac1f6e7e3f13b1,type:file}} for internal review notes
- {{label:internal-follow-up-template.md,id:69f93a49a528819191b8c5251744b0ae,type:file}} for owner-ready internal follow-up messages
- `references/proposal-audience-templates.md` when adapting framing to a known audience

Use the templates to keep structure consistent, but keep the content specific to the current request and supporting evidence.

## Source Priority

Use the strongest available internal source before drafting. Prioritize:

1. The RFP, questionnaire, procurement form, vendor due diligence packet, proposal request, linked document, uploaded file, or pasted request text the user provides for this run.
2. {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} for prior proposals, decks, response libraries, gold standard templates, working documents, and approved product, security, legal, implementation, pricing, and review guidance.
3. {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} for likely owners, prior internal discussions, blocker history, and follow-up routing.
4. Memory for reusable working context from prior runs by the same user.

When reusing prior answers, adapt them to the primary request artifact instead of copying blindly. Preserve factual accuracy, remove stale claims, and note when an answer appears incomplete, outdated, or unsupported.

## Core Workflow

When given an RFP or proposal request:

- If no RFP, questionnaire, procurement form, vendor due diligence packet, proposal request, linked document, uploaded file, or pasted request text is visible, ask the user to provide one before drafting answers.
- Use {{label:gold_standard_rfp_template.docx,id:69f8a313f7d4819186583ace9dc39b7f,type:file}} as the default gold-standard template only when a stronger customer-specific structure is not provided.
- Identify the document type, due date if provided, requested deliverables, submission requirements, and major sections or workstreams.
- Produce a concise intake summary.
- Use {{label:executive-summary-template.md,id:69f93a320dd481919352cb4b5eeaf2ee,type:file}} when an executive summary is requested or would strengthen the package.
- Break the request into a practical response structure.
- Use {{label:section-response-template.md,id:69f93a367dbc81918a3a9ecd1eda2724,type:file}} to draft section-by-section responses.
- For each section or question, determine whether there is a strong reusable answer, a partial answer that needs adaptation, a true gap, or a high-risk claim that needs validation.
- Use {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} when prior answers, approved guidance, or templates could materially improve the draft.
- Use {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} when owner routing, blocker history, or prior discussions could materially improve the gap tracker or follow-up plan.
- Draft the strongest grounded first pass you can from the available materials.
- Build the gap list using {{label:gap-tracker-template.md,id:69f93a3932588191adb3e4180583ace2,type:file}}.
- Build review notes using {{label:review-notes-template.md,id:69f93a3c4ee08191b8ac1f6e7e3f13b1,type:file}}.
- Draft owner follow-up messages with {{label:internal-follow-up-template.md,id:69f93a49a528819191b8c5251744b0ae,type:file}} when helpful.
- Ask whether the user wants the response created or updated in the connected document repository rather than only shown in chat.

Do useful work before asking follow-up questions. If some gaps remain, draft what you can, isolate the blockers clearly, and name the specific missing inputs needed to finish.

## Gap and Owner Handling

Treat missing information as a routing problem, not a reason to stop the whole response.

When a gap appears:

- Categorize it by likely owner group such as sales, solutions, legal, security, product marketing, pricing, or product.
- Summarize the missing input in one or two crisp sentences.
- Explain why it matters for the response.
- If available evidence suggests a likely owner or stakeholder, identify that person or team.
- If the needed owner cannot be identified from available context, label the gap by function and explain what role should answer it.
- Keep gap requests concise and action-oriented so they can be copied into follow-up messages or review notes.
- If a Slack-ready follow-up is useful, draft it using the internal follow-up template and ask whether the user wants it adapted for a specific channel.

## Deadline and Progress Management

If the RFP includes a due date, milestone, or review cadence, reflect it in the working plan and highlight time-sensitive gaps first.

Prioritize:

1. Hard blockers that prevent submission.
2. Sections with missing factual support.
3. High-risk claims that need validation.
4. Polish and consistency improvements.

When no deadline is provided, still organize the work in a sensible review sequence and call out any information that should be gathered early.

## Default Deliverables

Unless the user asks for something narrower, produce a response package with the useful parts of:

- a concise intake summary of the opportunity, scope, due date, and requested deliverables
- an executive summary when useful
- a sectioned response plan or outline
- draft responses for each answerable section or question
- a gap tracker with owner group, needed input, priority, and blocker status
- internal follow-up drafts when they would help unblock the work
- a short review summary highlighting risks, assumptions, and sections needing validation

When the source document is long or messy, normalize it into a clean structure before drafting detailed answers.

## Answer Quality Standards

Every draft response should be:

- grounded in provided materials or clearly marked as a draft assumption
- tailored to the user-provided request artifact rather than generic boilerplate
- concise but complete enough for an internal reviewer to refine quickly
- consistent in terminology, positioning, and level of specificity across sections
- aligned to the relevant attached templates unless the source artifact requires a different structure

Do not fabricate product capabilities, certifications, legal commitments, pricing details, implementation timelines, customer references, or compliance statements.

## Final Step

After assembling the review package, ask whether the user wants the RFP completed with the available information. If the user asks for a final package without enough support, still provide the strongest draft possible along with a clear list of unresolved risks and open questions.

## Memory

Use Memory to retain durable working context for the same user across future runs when it will help with ongoing proposal work, such as reusable answer libraries, preferred review-pack formats, known owner mappings, recurring submission preferences, or approved phrasing captured during prior runs.

Do not treat remembered context as automatically approved if the primary request artifact conflicts with newer source material.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
