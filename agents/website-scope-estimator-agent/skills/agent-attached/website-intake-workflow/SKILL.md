---
name: website-intake-workflow
description: Use when the current phase is project-specific intake and the agent still needs the missing facts that materially affect package routing, pricing, thresholds, approvals, or estimate confidence. This skill reviews supplied materials, captures confirmed intake inputs, asks only the smallest blocking questions, and hands off cleanly into routing.
---

# Website Intake Workflow

## When to use this skill

Use this skill only when the current phase is **intake** and the agent still needs project-specific facts that materially affect package routing, pricing, thresholds, approvals, or estimate confidence.

Use it when the user has provided some mix of links, notes, Figma files, docs, or partial answers and the next correct step is to identify or collect the missing project inputs.

Do not use this skill for:

- first-pass evidence gathering or audit output
- package routing
- estimate drafting
- estimate revision
- proposal writing
- reusable user onboarding
- unrelated design critique or generic WordPress help

## Memory state

Use {{label:Memory,id:file_persistence,type:file_persistence}} only to keep a lightweight active project brief so follow-up intake and routing work do not require restating the same project facts.

Maintain only the project-specific file that materially helps the current project:

- `active-project-brief.md` for confirmed project facts, open questions, integration notes, migration notes, and current blockers

Do not update `estimator-user-defaults.yaml` from this skill. Reusable cross-project preferences belong to onboarding, not intake.

Do not treat Memory as a transcript. Save only durable project facts and unresolved blockers that matter for future work on the same project.

## Workflow

1. Confirm that the current job is project-specific intake, not audit, routing, drafting, or onboarding.
2. Review the provided materials before asking questions. Use available Figma, Drive, and other supplied context first.
3. Pull out any intake answers that are already supported by the current materials.
4. Build or update a concise intake brief with only the facts that materially affect routing or estimate confidence, such as:
   - site goal and business outcome
   - rebuild scope and site type
   - likely page and template complexity
   - content migration expectations
   - technical needs such as ecommerce, booking, multilingual support, membership, portals, forms, search, integrations, analytics, SEO, redirects, or hosting constraints
   - important stakeholders, blockers, or launch constraints when they materially affect routing or confidence
5. Ask only the smallest set of missing questions needed to continue. Prefer one concise question at a time unless a short grouped question is clearly more efficient.
6. End with a handoff that matches the intake phase just completed.
7. Update the active project brief in Memory whenever the user confirms new durable project facts.

## Source review during intake

When Figma files or source documents are available:

- review them only to extract project-specific intake answers already visible in the materials
- identify likely templates, shared components, navigation patterns, interactive elements, integrations, and content-heavy sections when those details materially affect routing
- flag anything that suggests custom functionality beyond a standard package
- note uncertainty when the materials are incomplete, outdated, or inconsistent

Do not turn this skill into a full evidence-pass audit. Use it to harvest intake answers from available materials, not to produce a broader audit deliverable.

## Intake question order

When questions are needed, prioritize them in this order:

1. site goal and primary success outcome
2. rebuild scope and site type
3. page or template count and complexity
4. required functionality and integrations
5. content and migration readiness
6. launch constraints or implementation baseline, when they materially affect routing or fixed-fee confidence

Avoid long questionnaires. Skip questions already answered by the user or their materials.

## Output contract

When using this skill, produce one compact intake response with this exact section order:

1. **Confirmed Intake Inputs**
2. **Missing Material Inputs**
3. **Questions To Ask Now**
4. **Next Handoff**

### Section rules

#### Confirmed Intake Inputs

List only the project-specific intake facts already supported by the user's materials or prior confirmed context.

#### Missing Material Inputs

List only the unresolved project-specific values that still materially affect routing, pricing, thresholds, approvals, or estimate confidence.

#### Questions To Ask Now

List only the smallest set of questions needed next. If no further questions are needed, say `None right now.`

#### Next Handoff

State the next step that logically follows the intake work just completed:

- continue intake if blocking inputs are still missing
- move to routing when the intake is sufficient

Do not send the workflow backward to audit unless new evidence actually requires it.

## Operating Rules

- Keep intake project-specific.
- Do not perform full package routing inside this skill.
- Do not draft an estimate, proposal, or revision inside this skill.
- Do not ask broad discovery questions that do not materially change routing or estimate confidence.
- Do not duplicate the same item across `Missing Material Inputs` and `Questions To Ask Now` unless phrasing the actual user question truly requires it.
- Prefer a short, decision-ready intake summary over a long questionnaire.
- Keep internal reasoning internal; present only the confirmed inputs, remaining gaps, the smallest needed questions, and the next handoff.

## Supporting Files

- `references/intake-spec.yaml` defines the standard intake fields, estimate sections, and default assumptions to use when the user has only partial information.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
