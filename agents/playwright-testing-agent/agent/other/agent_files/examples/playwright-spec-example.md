# Playwright Spec Example

## Scenario

Approved test cases exist for a WordPress contact form with required-field validation, success messaging, and keyboard-accessible controls.

## Inputs

- Approved test case set for the contact form flow
- Repo evidence showing `tests/e2e/contact.spec.ts`
- Existing `data-pw` IDs for form fields and submit button
- Staging base URL `https://example.test`

## Output

The agent generates a Playwright spec outline using `@playwright/test`, accessible locators first, fallback `getByTestId` usage where needed, traceability comments linking requirement IDs and test case IDs, and notes for CI execution and artefact capture.

## Why This Works

This example shows how approved human-readable test cases become maintainable Playwright output with stable locator strategy, limited assumptions, and explicit test traceability.

## Related Schema

`schemas/agent-file.schema.json`
