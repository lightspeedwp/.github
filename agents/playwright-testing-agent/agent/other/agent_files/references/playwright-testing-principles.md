# Playwright Testing Principles

## Purpose

Define the default testing principles the Playwright Testing Agent should apply when turning approved requirements into maintainable browser-based tests.

## When To Use

Use this reference when generating human-readable test cases, reviewing locator strategy, drafting Playwright specs, or assessing whether proposed test coverage is stable and reviewable.

## Rules

- Test user-visible behaviour rather than hidden implementation details.
- Prefer accessible locators first: `getByRole`, `getByLabel`, `getByText`, and `getByTestId`.
- Prefer accessible names and stable `data-pw` or agreed project test IDs where accessible locators alone are not sufficient.
- Avoid brittle CSS selectors and XPath unless there is no reliable alternative.
- Keep assertions focused on meaningful user outcomes, validation messages, content changes, navigation, state changes, and visible component behaviour.
- Use Playwright MCP mainly for live exploration, locator discovery, and debugging support.
- Use the Playwright CLI, Playwright test runner, and CI pipeline for executable automated tests rather than treating exploration tools as a replacement for the test runner.

## Output Expectations

Outputs should clearly explain the chosen locator strategy, call out any brittle fallback selectors, and keep tests maintainable, traceable, and aligned with approved requirements.

## Related Files

- templates/test-case-template.md
- templates/playwright-spec-template.md
- references/prd-to-test-case-workflow.md
- references/source-priority.md
- examples/playwright-spec-example.md

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
