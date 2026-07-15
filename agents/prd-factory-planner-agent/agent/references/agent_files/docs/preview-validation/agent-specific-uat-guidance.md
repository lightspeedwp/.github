# Agent-Specific UAT Guidance

Use this guide when running user acceptance testing for the **PRD Factory & Planner** agent.

## Purpose

This agent is intended to turn LightSpeed project inputs into structured planning artefacts such as intake summaries, PRDs, technical briefs, task plans, review outputs, and handoff packs.

UAT should confirm that the agent:

- chooses the right planning artefact for the request
- separates confirmed facts from assumptions
- identifies risks, blockers, approvals, and open questions clearly
- stays grounded in the best available evidence
- produces practical, review-ready outputs in UK English

## Recommended UAT Inputs

Use a mix of:

- reusable preview-validation example contexts
- real LightSpeed project notes or briefs
- Figma, GitHub, Drive, and website references where relevant
- incomplete or mixed-quality inputs to test intake behaviour

## Core UAT Scenarios

### 1. Intake Summary

Validate that the agent can turn rough project inputs into a clean intake summary.

Check that it:

- classifies the project correctly
- identifies strong versus weak sources
- separates facts from assumptions
- highlights missing information without overblocking
- recommends the best next artefact

### 2. PRD Routing

Validate that the agent chooses a PRD when the request is requirements-focused.

Check that it:

- identifies goals and non-goals
- structures requirements clearly
- keeps evidence and assumptions separate
- flags approval-sensitive areas

### 3. Technical Brief Routing

Validate that the agent chooses a technical brief when implementation planning is the main need.

Check that it:

- maps design/system context to WordPress delivery needs
- identifies implementation dependencies
- avoids inventing technical detail
- calls out evidence gaps clearly

### 4. Task Planning

Validate that the agent can break approved planning into practical implementation tasks.

Check that it:

- creates logical task groupings
- identifies dependencies and sequencing
- avoids premature certainty where scope is unclear
- keeps tasks grounded in approved planning

### 5. Review and QA Output

Validate that the agent can review an existing artefact and improve it.

Check that it:

- identifies unsupported claims
- spots missing acceptance criteria or gaps
- improves structure and clarity
- gives actionable recommendations

### 6. Evidence-Limited Input Handling

Validate that the agent behaves well when the inputs are incomplete, stale, or contradictory.

Check that it:

- does useful work anyway
- labels uncertainty clearly
- avoids hallucinating missing facts
- asks only for information that materially affects the next planning step

## Acceptance Criteria

A UAT run should usually pass when the agent:

- stays within the LightSpeed planning role
- selects a sensible output for the task
- produces structured, readable output
- uses UK English consistently
- distinguishes facts, assumptions, risks, blockers, and open questions clearly
- avoids unsupported claims and invented detail
- recommends a sensible next step

## Failure Indicators

Treat the run as needing revision if the agent:

- picks the wrong artefact for the user’s need
- mixes assumptions into confirmed facts
- invents scope, approvals, technical implementation, or outcomes
- overstates confidence despite thin evidence
- ignores major source gaps
- produces output that is vague, messy, or not review-ready
- asks too many unnecessary follow-up questions before doing useful work

## Suggested UAT Flow

1. Choose a test input or indexed example context.
2. Run the agent with one clear planning request.
3. Review the result against `master-qa-checklist.md`.
4. Assess whether the selected artefact matched the request.
5. Record failures, ambiguities, and improvement opportunities.
6. Repeat with at least one evidence-limited scenario.

## UAT Notes Template

For each test, capture:

- Test name:
- Input used:
- Expected artefact:
- Actual artefact selected:
- What passed:
- What failed:
- Evidence or grounding issues:
- Recommended improvement:
- Pass / Needs Revision:

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
