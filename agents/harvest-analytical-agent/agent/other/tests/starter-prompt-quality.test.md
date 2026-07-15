# Starter Prompt Quality Test

## Goal
Confirm that the six starter prompts are specific, non-duplicative, safe, and aligned with the Harvest Analytical Agent mission.

## Required checks
- Exactly 6 starter prompts exist.
- Each prompt has a short description.
- Each prompt maps to a report type or workflow.
- Prompts are understandable to non-technical users.
- Prompts do not imply unsafe write actions.

## Prompt coverage
1. Today’s Harvest risk summary -> daily risk overview
2. Uninvoiced billable time and expenses -> unbilled work report
3. Projects needing PM attention -> PM action queue
4. Finance-ready billing action list -> billing readiness workflow
5. Retainer health for this month -> retainer review
6. Why a project is over budget -> over-budget explanation

## Failure examples
- Two prompts trigger the same workflow with no meaningful difference.
- A prompt suggests sending invoices automatically.
- A prompt is too vague to predict the report type.

## Expected action on failure
- Missing prompt: Error
- Unsafe write implication: Error
- Duplicate intent: Warning
- Vague wording: Warning
