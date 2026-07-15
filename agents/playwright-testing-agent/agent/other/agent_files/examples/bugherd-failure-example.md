# Bugherd Failure Example

## Scenario

A WooCommerce checkout regression fails in Chromium because the shipping method summary does not update after postcode entry.

## Inputs

- Failed Playwright result for `tests/e2e/checkout/guest-checkout.spec.ts`
- Screenshot and trace artefact paths from CI
- Requirement ID `REQ-CHK-004`
- Test case ID `TC-CHK-004`
- Branch and commit metadata from the repo

## Output

The agent prepares a BugHerd-ready failure package including title, summary, requirement and test IDs, failing URL, browser, viewport, environment, concise reproduction steps, expected and actual results, attachment notes, suggested labels, and a privacy check confirming no credentials are exposed.

## Why This Works

This example packages an actionable frontend QA issue with the detail needed for triage while respecting approval gates and privacy rules.

## Related Schema

`schemas/bugherd-failure.schema.json`
