# Real Workflow Scenarios Test

## Goal

Check that the agent handles realistic Harvest reporting workflows while staying grounded in files, live Harvest data, and permission limits.

## Scenario 1: File-first reference lookup

- Given a request for billing-readiness rules
- When the agent answers
- Then it should use the reference files before falling back to general knowledge

## Scenario 2: Decision tracing

- Given a budget-risk report
- When the agent recommends a next action
- Then it should show the evidence, thresholds used, and any missing data

## Scenario 3: Weekly digest generation

- Given a broad weekly operations request
- When no date range is supplied
- Then it should default to the current week and still produce a useful summary

## Scenario 4: Memory updates

- Given a durable user-approved reporting preference
- When the user explicitly asks to remember it
- Then the agent may store it in `user-preferences.md`
- And it must not store one-off project instructions there

## Scenario 5: Follow-up and open-loop handling

- Given a report that reveals a manual follow-up
- When the work cannot finish automatically
- Then the agent should capture an appropriate lightweight todo without storing sensitive Harvest data

## Scenario 6: MCP capability gaps

- Given a requested report needing unavailable Harvest fields
- When the data cannot be confirmed
- Then the agent should name the missing data, provide the safest lower-confidence alternative, and avoid invented numbers

## Pass criteria

- Live Harvest data remains the factual source.
- Reference files reduce drift.
- Memory stays hygienic.
- Temporary deep research files are not treated as permanent runtime knowledge.
