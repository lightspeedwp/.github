# CONNECTORS

This file is the concise attached-app map for the Zendesk Support Agent. Use it together with `references/app-usage-matrix.md` when deciding which app to use, whether a secondary app is justified, and whether a read or write action is appropriate.

## Default rule
- Zendesk is the primary system of record.
- Start in Zendesk for support-operational work.
- Stay Zendesk-first unless the user explicitly asks for secondary-app context or a downstream artifact that clearly requires it.
- Do not let a secondary app redefine the core job away from support work unless the user explicitly asks for that next step.

## Attached apps

### LightSpeed Zendesk
- Role: primary support system of record.
- Use for: ticket history, conversation context, forms, fields, tags, brands, Help Center grounding, investigation evidence, backlog health, repeated-theme review, and support reporting.
- Default behavior: first source checked for support work, investigations, triage, replies, handoffs, escalations, knowledge-candidate review, and backlog analysis.
- Allowed when: the request is support-operational or needs grounded Zendesk evidence.
- Read boundary: read freely when the task is support-operational and grounded in Zendesk.
- Write boundary: do not assume a write; only write when the user clearly asks for a Zendesk write and the requested action is supported.

### Google Drive
- Role: optional document context and file destination.
- Use for: reading supporting docs, templates, profiles, reports, exported deliverables, or saving a deliverable when the user explicitly wants Drive involved.
- Allowed when: the user asks to read stored documents, use a stored reference, retrieve file-based context, or save/export a deliverable there.
- Read boundary: secondary, not a default source.
- Write boundary: create, update, share, or upload only when the user clearly wants that Drive action.

### Linear
- Role: optional downstream product and engineering context.
- Use for: project context, issue review, product or engineering follow-through, and requested downstream artifacts after the Zendesk support task is already clear.
- Allowed when: the user explicitly wants product or engineering context, issue review, or a Linear-based downstream artifact.
- Read boundary: secondary and only after the Zendesk support task is grounded.
- Write boundary: do not create or update issues, docs, or projects unless the user clearly asks for that downstream action.

### GitHub
- Role: optional implementation and repository context.
- Use for: repository, issue, pull request, workflow, and implementation context that materially improves a Zendesk support deliverable or a requested engineering handoff.
- Allowed when: the user explicitly wants repository or implementation context, or when engineering context materially improves the requested support deliverable.
- Read boundary: secondary and bounded to the requested context.
- Write boundary: do not create or update GitHub artifacts unless the user clearly asks for that engineering write action.

### HarvestApp
- Role: optional delivery, resourcing, and time-tracking context.
- Use for: project, task, budget, resourcing, time-tracking, and delivery-planning context related to support follow-through.
- Allowed when: the user explicitly wants delivery-planning, project, task, budget, resourcing, or time-tracking context connected to support follow-through.
- Read boundary: secondary and only when the task calls for that operational context.
- Write boundary: do not create or update time, task, client, or project records unless the user clearly asks for that action.

## Selection rules
- Prefer Zendesk alone when it is sufficient.
- Decide whether Zendesk alone is enough before bringing in any secondary app.
- Add at most the smallest secondary-app set needed to complete the requested deliverable well.
- Prefer one supporting secondary app when several could help.
- Prefer a ready-to-apply draft over a consequential write when the user did not clearly ask for the write.
- Keep customer-facing outputs grounded in confirmed Zendesk evidence even when a secondary app adds internal context.
- Keep audit, validation, and file-system reviews Zendesk-first unless a secondary app is itself part of the contract being reviewed.

## Read and write posture
- Read actions may be used to gather grounded evidence within the app-role boundaries above.
- Write actions require a clear user request, a grounded target, and evidence that supports the change.
- If a write is requested but the current setup cannot safely perform it, produce the smallest ready-to-apply draft or handoff instead of pretending the write happened.

## Alignment expectations
- The main instructions must align with this file and `references/app-usage-matrix.md`.
- `references/default-operating-mode.md` should explain when this file is consulted during the default workflow.
- If attached apps or app-role boundaries change, update this file, the app-usage matrix, and the instruction snapshot together.
- Zendesk should remain the primary operating focus across instructions, references, templates, tests, and validators unless the user explicitly repurposes the agent.
