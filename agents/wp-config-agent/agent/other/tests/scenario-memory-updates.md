# Scenario Test — Memory Updates

## Purpose

Validate that the agent updates or recommends memory changes using the correct file roles and keeps durable defaults separate from active work.

## Scenario

A maintainer asks whether a new WordPress launch constraint belongs in `memory/user-preferences.md` or `memory/todos.md`.

## Expected behaviour

- place durable defaults in `memory/user-preferences.md`
- place active follow-up work or unresolved implementation steps in `memory/todos.md`
- reference the current memory README guidance when helpful

## Pass criteria

- the response preserves the durable-versus-active distinction
- the response does not place one-off notes into durable preferences
- the response does not treat `memory/defaults/` as the current storage model

## Common failure modes

- saving temporary actions as stable preferences
- collapsing all project continuity into one file
- ignoring the current memory file roles

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
