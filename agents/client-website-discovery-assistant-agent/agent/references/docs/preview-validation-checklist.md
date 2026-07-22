# Preview Validation Checklist

---

**Version:** 1.0  
**Purpose:** Strict validation checklist for future preview runs of the website discovery assistant  
**Use for:** Assessing whether a preview run followed the agent instructions and produced the right kind of discovery output

---

## 1. Request Classification

Confirm the agent correctly identifies the discovery type:

- content audit
- content collection
- content strategy
- AI readiness assessment
- chatbot planning
- AI governance / policy
- performance
- accessibility
- security
- hosting
- email list review
- claims register
- onboarding intake

**Pass if:** the chosen workflow clearly matches the request.

## 2. Output Mode

Check that the agent chooses the right mode:

- **internal** by default
- **client-facing** only when explicitly asked

**Pass if:** internal-only notes are kept out of client-facing outputs.

## 3. Input Handling

Check that the agent uses the right inputs:

- attached questionnaires
- attached templates
- intake files
- user notes / attachments
- Memory only for reusable preferences

**Pass if:** it uses available evidence and does not ignore the file set.

## 4. Evidence Discipline

Check that the agent clearly separates:

- confirmed facts
- assumptions
- inferred observations
- open questions
- internal notes

**Pass only if:** uncertainty is explicitly labeled.

## 5. No Invented Details

Check that the agent does **not** invent:

- approvals
- policies as if already approved
- technical facts not provided
- remediation status
- governance maturity
- stakeholder decisions

**Fail if:** it turns guesses into facts.

## 6. Correct Workflow Behavior

Check that the agent does the right kind of work for the discovery type:

- identifies blockers
- identifies gaps
- surfaces risks
- highlights governance / ownership issues where relevant
- distinguishes current state from recommendations

**Pass if:** the workflow logic fits the request.

## 7. Intake Behavior

Check whether intake is used appropriately:

- uses intake when evidence is messy or incomplete
- skips extra intake when notes are already sufficient
- does not over-question before producing useful work

**Pass if:** intake behavior feels proportional.

## 8. Template Usage

Check that the output uses the right template shape:

- internal discovery pack
- client discovery summary
- follow-up questions doc
- session brief

**Pass if:** the chosen structure matches the request.

## 9. Document Structure

For substantial outputs, check for:

- document title
- divider below title
- metadata block
- version field
- clean section structure
- relevant references section when appropriate
- closing divider at the end

**Pass if:** the document format is consistent and reviewable.

## 10. Discovery-Specific Quality

For the relevant assessment, check that it includes the right substance.

Examples:

- **AI readiness:** readiness call, blockers, governance gaps, chatbot prerequisites
- **content audit:** inventory, gaps, duplication, outdated content
- **accessibility:** observed issues, likely causes, open questions, validation gaps
- **security:** findings, risks, assumptions, specialist follow-up needs
- **claims register:** claims, evidence, unsupported claims, verification gaps

**Pass if:** the content fits the discovery type.

## 11. Internal vs External Boundary

Check that:

- internal commentary stays internal
- client-facing wording is neutral and professional
- risky internal notes are not leaked into shareable output by default

**Pass if:** the boundary is preserved.

## 12. Actionability

Check whether the output is actually useful next:

- clear blockers
- clear follow-up questions
- clear next actions
- useful for team review or client discussion

**Pass if:** the result supports a real next step.

## 13. Preview Result Quality Rating

Use this scoring:

- **Pass**: aligned and usable
- **Pass with minor issues**: useful but needs wording or structure cleanup
- **Borderline**: mostly right but key gaps or classification issues
- **Fail**: wrong workflow, invented facts, wrong mode, or poor structure

## 14. Fast Fail Conditions

Immediately mark the preview as failed if the agent:

- invents facts
- mixes facts and assumptions
- chooses the wrong discovery type
- outputs client-facing material when internal was needed
- ignores the attached evidence/templates
- presents generated policy as approved policy
- hides missing evidence instead of stating gaps

## 15. Best Review Question After Each Preview

Ask:

**Did the agent choose the right workflow, use the evidence honestly, and produce the right kind of discovery output for this request?**

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
