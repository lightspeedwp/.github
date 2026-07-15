# Repeatable Preview Test Prompts

Use these prompts with the example contexts in `example-contexts-index.md` for consistent preview testing.

## How to Use

1. Pick one example context from the index.
2. Attach or reference that context in the preview run.
3. Use one of the prompts below with only light project-specific adjustment when needed.
4. Compare the output against `master-qa-checklist.md`.

## Prompt 1: Context Summary

Use the selected indexed example context and produce a clean project summary.

Include:

- project type
- confirmed reference sources
- likely implementation context
- key assumptions
- key risks or missing information
- the best next planning artefact

## Prompt 2: Source Inventory Review

Using only the selected indexed example context, create a structured source inventory.

Group the sources into:

- live or production references
- demo, prototype, or design references
- development references
- repositories
- documentation sources

Then explain what each source is most useful for in future planning or QA work.

## Prompt 3: Planning Kickoff

Using the selected indexed example context, create the smallest useful planning kickoff output.

The output should:

- identify the likely project shape
- separate confirmed facts from assumptions
- list blockers or unanswered questions
- recommend the best immediate next artefact

## Prompt 4: Technical Brief Readiness Check

Review the selected indexed example context and assess whether it is strong enough to start a technical brief.

Return:

- what is already sufficient
- what is missing
- what should be verified first
- whether to proceed with a technical brief now or start with intake/research instead

## Prompt 5: QA-Oriented Context Review

Using the selected indexed example context, prepare a QA-oriented review summary.

Focus on:

- what can be validated from the available sources
- what cannot be validated yet
- which references are best for design parity checks
- which references are best for implementation checks
- what evidence gaps should be resolved before a serious QA pass

## Prompt 6: Cross-Source Consistency Check

Using the selected indexed example context, compare the available references and identify likely consistency risks.

Look for possible mismatches across:

- live site versus demo/prototype
- design references versus implementation references
- repository references versus public-facing references
- documentation versus visible product signals

Flag anything that should be reviewed before planning or QA continues.

## Prompt 7: Stakeholder-Friendly Summary

Using the selected indexed example context, write a short stakeholder-friendly summary of the project setup.

Keep it concise and cover:

- what the project appears to be
- what source references are available
- what the current evidence supports
- what should happen next

## Prompt 8: Project-Specific Prompt Seed

Using the selected indexed example context, create a stronger follow-up prompt that would be suitable for the next preview run.

The follow-up prompt should:

- stay grounded in the selected context only
- define one clear planning or QA objective
- avoid requiring invented details
- be reusable with minimal edits later

## Suggested Validation Flow

For a repeatable test cycle:

1. Run **Context Summary**
2. Run **Source Inventory Review**
3. Run **Planning Kickoff** or **Technical Brief Readiness Check**
4. Run **QA-Oriented Context Review**
5. Validate results with `master-qa-checklist.md`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
