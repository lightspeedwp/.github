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

### 0. Pre-flight and environment contract

Before building the pack:

- **Integration pre-flight** — state which capabilities are available (Playwright
  MCP, Chrome DevTools MCP, Figma, BugHerd, GitHub) and the degraded path for any
  that are not, so a missing integration is not discovered at write time. Only
  list capabilities actually wired into the session.
- **Environment & Test-Data Contract** — capture the reusable environment block
  (base URL, sandbox/payment mode, test card(s), test customer, seeded
  product(s), known coupon(s), shipping/tax/discount rule source, Subscriptions
  test data, accessibility baseline, console-error baseline). Fill each field from
  evidence or mark it as a gap and request it — never fabricate a value.
  Order-placing cases stay blocked until sandbox mode and a test card are
  supplied. The two baseline fields are captured from an audit run, never guessed;
  without them, an a11y or console gate is proposed rather than asserted.

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
- classify it as one of the following: functional flow, content rule, visual rule, accessibility rule, performance rule, analytics or conversion rule, integration rule, or error or empty state
- cite the source evidence that supports it

Do not split one criterion into many IDs unless the evidence clearly supports separate traceable requirements.

**Performance rules are extracted, then routed.** A speed, Core Web Vitals,
page-weight, or Lighthouse-score requirement gets an ID and evidence like any
other, but produces no test case here: record its planned output as
`deferred → pagespeed-agent` and name that agent as owner in Assumptions and Gaps.
Do not convert it into a wall-clock timing assertion, do not invent a threshold the
source did not state, and do not present lab metrics from a slow staging
environment as a production baseline.

### 3. Separate non-requirements

Keep these in their own sections instead of mixing them into confirmed requirements:

- assumptions
- open questions
- gaps in source material
- suggested extra coverage
- execution risks or environment dependencies
- **change-control items** — work an organisational standard would call for but the
  project's scope excludes

Never label these as confirmed requirements.

**Scope exclusions are evidence, not gaps.** If the source says a category of work
is out of scope, record it as an out-of-scope note and generate no coverage for it.
House standards (an org accessibility baseline, coding standards, a security
policy) govern how in-scope work is built; they never create new deliverables. Do
not promote one into a Confirmed Requirement for excluded work, and do not write
the cases and seek approval afterwards — raise it as a change-control item naming
the standard, the exclusion it collides with, and the coverage that would be
needed. "It is good practice" is not authorisation.

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
- accessibility or visual checks when applicable, citing the WCAG 2.2 AA success
  criterion rather than a generic "accessibility check"
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

A requirement routed to another agent records that disposition in the planned-output
column (for example `deferred → pagespeed-agent`) instead of a test case ID. Every
requirement is accounted for; none is left unmapped.

### 6. Persist the pack

Write the completed pack to a conventional path. Prefer a project-configured location if one is set;
otherwise use `.github/reports/test-packs/<flow>-<YYYY-MM-DD>.md` when the repo has a `.github/` control plane,
or `test-packs/<flow>-<YYYY-MM-DD>.md` when it does not (this agent is portable and must not assume a `.github/` layout).
Return the written path so the reviewer knows where the artefact lives. On a later failure-triage run,
update the same file in place rather than starting a new one. If writing is not possible, say so and fall back to inline output — do not silently skip this step.

### 7. Enforce review-before-code

Unless the user already authorised code generation in the current request:

- stop after the review-ready pack
- ask for review or approval before generating Playwright tests
- clearly state that the next step is code generation only after approval

Skip this gate only when the user explicitly asks for direct code generation or says review is already complete.

### 8. Generate Playwright code only when authorised

If the user has authorised continuing:

- convert approved test cases into maintainable Playwright specs
- preserve requirement IDs and test case IDs in comments or traceability notes
- keep the code aligned with the approved pack instead of expanding scope silently
- emit a minimal fixtures/env starter kit alongside the specs: a
  `playwright.config` sketch (baseURL from env, target browsers/viewports,
  failure traces), a `.env.example` with the keys the specs read (placeholders
  only, never real secrets), and a cart/checkout fixture with a `@stateful` guard
  for order-placing cases. Derive it from the Environment & Test-Data Contract;
  do not invent credentials or product data.
- where accessibility, SEO, or console requirements are in the pack, emit them as
  gated specs: `@axe-core/playwright` scoped per page/widget and tagged `@a11y`,
  metadata assertions over a site-derived URL set, and a per-page console-error
  check. Assert **no new** violations/errors against the recorded baselines rather
  than zero outright; where a baseline is still a gap, emit the spec as proposed
  and say so.

If the approved pack still has open questions, carry them forward as blockers or TODO review notes rather than guessing.

## Default Output Structure

When creating a **full** test pack, use this section order unless the user asks for a different format:

1. Scope Summary
2. Sources Used
3. Environment & Test-Data Contract
4. Confirmed Requirements
5. Assumptions and Gaps
6. Human-Readable Test Cases
7. Traceability Matrix
8. Review Gate / Next Step

Right-size to scope by requirement count (the primary driver): when the confirmed-requirement count is ≤ 4, default to a **condensed** pack — Scope Summary, Environment & Test-Data Contract, a merged Requirements + Test Cases table, Traceability, and the Review Gate — keeping requirement IDs and evidence links. Use the full form when there are > 4 confirmed requirements, a whole PRD, or a stateful/multi-gateway flow; a single named flow that still yields > 4 requirements (e.g. checkout) takes the full form — being "single" does not by itself force condensed. State which form you used.

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

### Environment & Test-Data Contract

| Field | Value or gap |
|---|---|
| Base URL / environment | ... |
| Payment / sandbox mode | ... |
| Test card(s) | ... |
| Test customer | ... |
| Seeded product(s) | ... |
| Known coupon(s) | ... |
| Shipping / tax / discount rule source | ... |
| Subscriptions test data | ... if in scope |
| Accessibility baseline | ... recorded axe violations, or gap |
| Console-error baseline | ... known console errors, or gap |

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
| RQ-002 | ... | — | deferred → pagespeed-agent |

### Review Gate / Next Step

- Pack written to: `<path>` (state the persisted location).
- If code is not yet authorised: ask for review approval before Playwright generation.
- If code is authorised: state that the approved pack will now be converted into Playwright specs plus a fixtures/env starter kit.

## Decision Rules

- Right-size by scope automatically: if the confirmed-requirement count is ≤ 4 or the user names a single flow, default to the condensed pack without waiting for a "quick prototype" request; state which form you used.
- If the user asks for a quick prototype, reduce ceremony but still keep requirement IDs and a minimal traceability section.
- If there is only partial evidence, produce the strongest draft pack possible and clearly mark uncertainty.
- If the request is only for requirement extraction, stop after requirements plus gaps.
- If the request is only for human-readable cases, still include requirement IDs and evidence references.
- If the request includes repo context, use it to shape implementation notes and planned Playwright coverage, not to invent product requirements.
- If the request includes Figma context, use it as design evidence, not as the sole source of functional truth.
- If the request asks for performance testing, page speed, or Core Web Vitals, say that this agent does not measure performance, name **pagespeed-agent** as the owner, and still extract the performance rules so nothing is lost.
- If an accessibility or console gate is requested but its baseline is unrecorded, emit the gate as proposed and list the baseline capture as the blocking prerequisite — do not assert zero violations against unmeasured debt.
- If the source excludes a category of work (accessibility, SEO, performance, security) but an organisational standard would call for it, raise a change-control item and generate no cases. Do not build the coverage and defer the scope question to the review gate.

## Quality Bar

Before finishing, check that:

- every confirmed requirement has evidence
- every test case maps to at least one requirement
- every requirement has a disposition — a test case, or an explicit route to
  another agent; none is silently dropped
- performance rules, where present, are classified and routed rather than turned
  into timing assertions
- no Confirmed Requirement rests on a house standard for work the project's scope
  excludes; such items are change-control entries, not requirements, and carry no
  test cases
- assumptions are not mixed into confirmed requirements
- review-before-code is enforced unless explicitly waived
- the Environment & Test-Data Contract is present, with every unknown field marked as a gap rather than fabricated
- the pack is persisted to a stated path (or the inability to persist is stated explicitly)
- the pack form (full vs condensed) matches the scope
- the output is easy for a human reviewer to approve
- Playwright generation, when included, stays within the approved pack and emits the fixtures/env starter kit

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
