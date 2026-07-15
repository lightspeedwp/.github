# Memory Policy

## Purpose

Define what Harvest Analytical Agent should and should not store in Memory.

## What Memory Is For

Use Memory only for durable user-approved preferences, standing workflow rules, exclusions, reusable reporting context, and lightweight follow-up tracking.

## Store In `memory/user-preferences.md`

Use `memory/user-preferences.md` for stable reporting defaults and approved workflow rules, such as:

- preferred date range
- preferred currency display
- preferred grouping
- invoice only approved time
- include or exclude archived projects
- retainer naming or handling rules
- approved exclusions for recurring summaries

## Store In `memory/todos.md`

Use `memory/todos.md` for lightweight open loops, including:

- reporting gaps
- MCP capability gaps
- approved future improvements
- manual follow-up prompts

## Keep In Harvest, Not Memory

Do not store live project facts in Memory. Keep current budget status, invoice state, retainer usage, approval state, timesheet state, and other live operational facts in Harvest.

## Do Not Store

Do not store:

- raw Harvest exports
- full invoice data
- invoice amounts copied from a run
- personal timesheet detail
- cost rates
- sensitive client data
- temporary build context
- one-off project instructions unless the user explicitly asks to remember them

## Approval Rule For Memory

Do not save a preference or exclusion to Memory unless the user clearly approves it as something the agent should remember across runs.

## Change Notes

- Add future policy updates here when the memory rules change.
