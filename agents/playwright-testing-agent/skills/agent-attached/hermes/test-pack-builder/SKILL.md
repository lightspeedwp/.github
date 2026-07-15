---
name: test-pack-builder
description: Use when the user wants to turn PRDs, acceptance criteria, design evidence, repository context, or QA inputs into a structured test pack with requirement extraction, traceability, human-readable cases, review-before-code gating, and optional Playwright generation.
---

# Test Pack Builder

## Purpose

Use this skill to produce a review-ready test pack before code generation. The skill is for workflows where the agent must extract grounded requirements, preserve evidence links, generate human-readable test cases, and only move to Playwright code after review is complete or explicitly waived.

Do not use this skill for generic repo analysis, ad hoc bug triage, or one-off code generation with no traceability requirement.

## Use This Skill For Requests Like

- "Turn this PRD into a test pack before you write Playwright specs."
- "Extract the requirements, make the cases traceable, and ask me to review before code."
- "Use the PRD, Figma, repo context, and QA notes to prepare a structured Playwright test pack."
- "Convert these acceptance criteria into human-readable cases with requirement IDs and evidence references."

## Core Rules

1. Ground every requirement in the current request or supplied evidence.
2. Keep confirmed requirements separate from assumptions, inferred risks, and suggested extra coverage.
3. Prefer human-readable test cases before code unless the user explicitly asks to skip that gate.
4. Preserve traceability from source evidence to requirement IDs, test cases, and planned Playwright outputs.
5. If sources conflict, stop and ask for a decision before finalising the pack or generating code.
6. If evidence is incomplete, produce a draft pack with a gap list instead of pretending the input is complete.

## Input Types

The skill can work from any combination of:

- PRDs or acceptance criteria
- Figma notes or design evidence
- repository structure or existing test patterns
- QA notes, bug tickets, or failure reports
- user-supplied instructions about scope, devices, flows, or output format

When multiple inputs are present, treat user instructions as highest priority, then approved product and design evidence, then repository and QA context.

## Workflow

### 1. Build the evidence set

List the sources that are actually present and usable for this request.

For each source, note:

- what it covers
- whether it is authoritative or only supporting context
- any obvious gaps or contradictions

If a source is mentioned but not actually provided, do not act as though it was reviewed.

### 2. Extract requirements

Extract only requirements that are explicit or clearly evidenced.

For each requirement:

- assign a requirement ID
- write one short requirement statement
- classify it as one of: functional flow, content rule, visual rule, accessibility rule, analytics/conversion rule, integration rule, or error/empty state
- cite the source evidence that supports it

Do not split one criterion into many IDs unless the evidence clearly supports separate traceable requirements.

### 3. Separate non-requirements

Keep these in their own sections instead of mixing them into confirmed requirements:

- assumptions
- open questions
- gaps in source material
- suggested extra coverage
- execution risks or environment dependencies

Never label these as confirmed requirements.

### 4. Generate the human-readable test pack

Create test cases before code unless the user explicitly asks to skip that step.

Each test case should include:

- test case ID
- source requirement ID or IDs
- requirement type
- page or flow
- actor
- preconditions
- viewport or device scope when relevant
- numbered steps
- expected result
- core assertions
- accessibility or visual checks when applicable
- state-change note when applicable
- evidence references
- implementation notes or open questions when useful

When repeated context is unchanged across many cases, keep the structure but avoid unnecessary duplication.

### 5. Add a traceability matrix

Map:

- requirement ID -> source evidence
- requirement ID -> test case ID
- test case ID -> planned Playwright spec or coverage area

If code has not been authorised yet, mark the planned Playwright output as proposed rather than complete.

### 6. Enforce review-before-code

Unless the user already authorised code generation in the current request:

- stop after the review-ready pack
- ask for review or approval before generating Playwright tests
- clearly state that the next step is code generation only after approval

Skip this gate only when the user explicitly asks for direct code generation or says review is already complete.

### 7. Generate Playwright code only when authorised

If the user has authorised continuing:

- convert approved test cases into maintainable Playwright specs
- preserve requirement IDs and test case IDs in comments or traceability notes
- keep the code aligned with the approved pack instead of expanding scope silently

If the approved pack still has open questions, carry them forward as blockers or TODO review notes rather than guessing.

## Default Output Structure

When creating a test pack, use this section order unless the user asks for a different format:

1. Scope Summary
2. Sources Used
3. Confirmed Requirements
4. Assumptions and Gaps
5. Human-Readable Test Cases
6. Traceability Matrix
7. Review Gate / Next Step

## Output Template

Use this compact template shape:

### Scope Summary

- objective
- in-scope flows
- out-of-scope items when needed

### Sources Used

- source name
- status: reviewed / mentioned but unavailable
- notes

### Confirmed Requirements

- RQ-001: `<requirement statement>`
  - type: `<classification>`
  - evidence: `<source references>`

### Assumptions and Gaps

- assumptions
- open questions
- missing evidence
- suggested extra coverage

### Human-Readable Test Cases

- TC-001: `<test case title>`
  - requirement IDs: `<IDs>`
  - page/flow: `<value>`
  - actor: `<value>`
  - preconditions: `<value>`
  - viewport/device: `<value if needed>`
  - steps:
    1. ...
    2. ...
  - expected result: ...
  - core assertions: ...
  - evidence: ...
  - notes: ...

### Traceability Matrix

| Requirement ID | Evidence | Test Case IDs | Planned Playwright Coverage |
|---|---|---|---|
| RQ-001 | ... | TC-001 | proposed spec/module |

### Review Gate / Next Step

- If code is not yet authorised: ask for review approval before Playwright generation.
- If code is authorised: state that the approved pack will now be converted into Playwright specs.

## Decision Rules

- If the user asks for a quick prototype, reduce ceremony but still keep requirement IDs and a minimal traceability section.
- If there is only partial evidence, produce the strongest draft pack possible and clearly mark uncertainty.
- If the request is only for requirement extraction, stop after requirements plus gaps.
- If the request is only for human-readable cases, still include requirement IDs and evidence references.
- If the request includes repo context, use it to shape implementation notes and planned Playwright coverage, not to invent product requirements.
- If the request includes Figma context, use it as design evidence, not as the sole source of functional truth.

## Quality Bar

Before finishing, check that:

- every confirmed requirement has evidence
- every test case maps to at least one requirement
- assumptions are not mixed into confirmed requirements
- review-before-code is enforced unless explicitly waived
- the output is easy for a human reviewer to approve
- Playwright generation, when included, stays within the approved pack

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
