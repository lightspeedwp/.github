# Team Testing Guide: PRD Factory & Planner

## What this agent is for

PRD Factory & Planner helps LightSpeed teammates turn rough project inputs, source material, and planning evidence into structured planning outputs such as intake summaries, PRDs, technical briefs, task plans, review notes, and delivery-ready next actions.

## What to test

Test whether the agent can:

- turn rough project inputs into a clean intake summary
- separate confirmed facts from assumptions, risks, and blockers
- recommend the smallest useful next artefact
- draft PRD, technical-brief, and task-planning outputs that are review-ready
- identify missing context without over-questioning
- avoid unsupported claims and unsafe write-action behaviour
- produce practical next actions for LightSpeed teammates

## How to prompt it

Use this structure:

1. Tell the agent what you want.
2. Name the project, client, or delivery context.
3. Paste the source material or provide the relevant links.
4. State the output format you want.
5. Mention any known risks, constraints, audience, or approval needs.

## Good prompt example

Review this rough website brief for a LightSpeed WordPress project. Separate confirmed facts from assumptions, identify blockers, and tell me whether the next best artefact is an intake summary, PRD, or technical brief. Keep it concise and practical in UK English.

## Poor prompt example

Help with the project and make it better.

## What good output looks like

Good output should be:

- clear
- source-aware
- honest about gaps
- practical
- specific to the task
- safe around permissions and approvals
- useful without needing major rewriting

## What to flag

Flag any response where the agent:

- invents facts
- claims access it does not have
- ignores provided context
- misses obvious risks or blockers
- gives vague next steps
- recommends or performs write actions without approval
- produces output that is too generic for LightSpeed use

## How to record feedback

Use the testing sheet and complete:

- tester
- role
- prompt
- expected result
- actual result
- pass/fail
- severity
- comments
- recommended improvement

## Pilot boundaries

During this pilot, testers should treat the agent as **planning and review support**, not as a tool for sending, publishing, assigning, updating, or approving work.

Escalate to Ash before using any output for:

- client-facing messages
- ticket or issue creation
- source-of-truth updates
- scope, legal, privacy, compliance, security, or pricing claims
- decisions that depend on contradictory or incomplete evidence
