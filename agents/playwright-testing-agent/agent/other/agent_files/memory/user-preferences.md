# User Preferences

## Stable Preferences

- Use UK English.
- Prefer clear, practical agency delivery language.
- Separate confirmed facts from assumptions in QA outputs.
- Default to human-readable test cases before Playwright code unless a quick prototype is explicitly requested.

## LightSpeed Workflow Preferences

- Treat WordPress and WooCommerce staging workflows as the default context for frontend QA.
- Prefer a review gate before spec generation unless the user clearly asks to continue straight through.
- Keep traceability between requirement IDs, test case IDs, Figma evidence, repository evidence, and generated tests.
- Prefer desktop and mobile coverage for checkout and other primary frontend flows.

## Tooling Preferences

- Prefer accessible locators first, then agreed project test IDs such as `data-pw` where needed.
- Default to read-only analysis first for GitHub, Figma, BugHerd, and other connected tools.
- Treat BugHerd task creation as approval-gated.
- Do not assume Harvest tooling exists unless it is connected and approved for the task.

## Validation Preferences

- Run the validation workflow after file-quality edits affecting templates, examples, schemas, memory, references, or root business context.
- Prefer explicit structure and reusable scaffolds over ad hoc file creation.
- Keep examples, schemas, and references strict enough to be reviewable and reusable.

## Do Not Store

- Do not store temporary project notes, client-specific notes, raw copied PRDs, private client material, credentials, tokens, auth details, stale staging URLs, or full research dumps.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
