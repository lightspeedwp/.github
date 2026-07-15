# Memory Usage Guide

Use Memory to preserve stable, reusable context that helps this design agent stay consistent across future runs.

## Purpose of each Memory file

### `memory/user-preferences.md`

Use this file to store how the user wants work delivered.

Save things like:

- preferred critique depth
- preferred output format
- preferred tone
- handoff detail preferences
- accessibility emphasis
- whether to lead with bullets, findings, or recommendations

Do not save:

- one-off preferences for a single task
- temporary formatting requests that are unlikely to matter again

### `memory/project-defaults.md`

Use this file to store stable LightSpeed, client, and recurring project context.

Save things like:

- client or website type
- source hierarchy
- accessibility defaults
- brand and voice defaults
- recurring design constraints
- preferred deliverable patterns
- standing assumptions that should apply across multiple runs

Do not save:

- temporary project notes
- speculative assumptions
- context that has not been confirmed

### `memory/todos.md`

Use this file to track unfinished work that should be resumed later.

Save things like:

- pages still to review
- copy still to refine
- unresolved UX questions
- follow-up audits
- next actions that clearly remain open

Do not save:

- completed work
- general notes without an action
- ideas that have not been committed to

### `memory/review-history.md`

Use this file to keep concise summaries of prior critiques, audits, briefs, and handoffs.

Save things like:

- what was reviewed
- main issues found
- recommendations made
- recurring patterns
- design decisions worth carrying forward

Do not save:

- raw research dumps
- long scratch notes
- detailed transcripts when a short summary is enough

## High-value workflows

- Reuse the same critique style without asking the user to restate it
- Build on previous audits instead of starting from zero
- Keep LightSpeed and client assumptions consistent across briefs, critique, UX writing, and handoffs
- Remember recurring issues on similar websites
- Track unresolved tasks between runs

## What is good to save

- stable preferences
- recurring constraints
- repeated findings
- source-of-truth rules
- future follow-ups
- concise summaries of completed review work

## What not to save

- scratch notes
- temporary ideas
- raw research dumps
- one-off brainstorming
- unconfirmed assumptions

## Decision rules for saving to Memory

Before saving something, ask:

1. Will this matter again?
2. Is it stable enough to reuse?
3. Would saving it reduce repeated explanation later?

If the answer is yes, save it in the most appropriate Memory file.

## File-specific update rules

- Update `memory/user-preferences.md` when the user states a lasting preference or repeats a correction that should apply in future work.
- Update `memory/project-defaults.md` when stable LightSpeed, client, or project context becomes clearer.
- Update `memory/todos.md` when work is unfinished or should be resumed later.
- Update `memory/review-history.md` after meaningful critique, audit, brief, or handoff work is completed and the result includes reusable findings.

## Practical model

- `user-preferences.md` = how the user likes the agent to work
- `project-defaults.md` = what the agent should assume by default
- `todos.md` = what still needs doing
- `review-history.md` = what the agent has already learned

## Working principle

Prefer short, reusable summaries over clutter. Save durable context, not noise.
