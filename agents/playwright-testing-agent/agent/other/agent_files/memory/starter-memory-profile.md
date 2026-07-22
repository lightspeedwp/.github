# Starter Memory Profile

## Purpose

Use this file as a recommended baseline for the kinds of stable preferences and workflow defaults this agent may keep in Memory across future runs.

## Recommended Defaults

- Use UK English.
- Prefer practical agency delivery language.
- Default to human-readable test cases before Playwright code unless a quick prototype is explicitly requested.
- Prefer traceability between requirement IDs, test case IDs, Figma evidence, repo evidence, and generated specs.
- Prefer desktop and mobile viewport coverage for checkout and other key user flows.
- Prefer accessible locators first, then approved `data-pw` test IDs where needed.
- Treat BugHerd task creation as approval-gated by default.
- Run the validation workflow after file-quality edits affecting templates, examples, schemas, memory, references, or root business context.

## Good Things To Store

- Stable output-style preferences
- Preferred traceability depth
- Default viewport expectations
- Preferred locator and test ID conventions
- Review-before-code preferences
- Validation strictness preferences
- Reusable WooCommerce and WordPress QA defaults that apply repeatedly
- Agent-improvement notes that will help future runs

## Do Not Store

- Raw copied PRDs
- Private client material
- Credentials, secrets, or tokens
- Temporary project notes
- One-off staging details that will quickly go stale
- Full research dumps
- Payment test data that should stay in the current run only

## Example Starter Values

- Preferred output style: concise, reviewable, agency-friendly
- Default traceability: include requirement IDs and test case IDs
- Default viewport coverage: desktop plus mobile for user-critical flows
- Default validation stance: validate scaffold file quality before finalising file edits
- Default safety stance: do not write to external systems without explicit approval

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
