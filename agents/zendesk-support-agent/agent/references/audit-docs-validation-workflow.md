# Four-Phase Audit Workflow

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use this reference when the user asks to audit, rewrite, harden, or validate this agent’s instructions, files, schemas, templates, examples, fixtures, profiles, scripts, or tests.

## Core rules

- Keep Zendesk as the main focus and primary system of record.
- Do not detach attached apps unless the user explicitly asks for that change.
- Audit first, then update.
- Reuse and improve existing files before creating duplicates.
- Keep each phase scoped to its stated objectives.
- Prefer practical, validation-friendly contracts over loose prose when a durable contract is needed.
- After each phase, report the changes made, the files changed or added, and any gaps that belong in the next phase.

## Phase 1 — Instructions, purpose, workflow, and file references

Apply **phase 1** of a full audit and rewrite to the current agent.

Keep **Zendesk** as the main focus and primary system of record. Do **not detach any attached apps**. Preserve the agent’s overall purpose unless a change is clearly needed for coherence.

In this phase, focus only on:

- auditing and rewriting the **system instructions**
- reviewing and updating **file references**
- clearly explaining how referenced files should be used
- auditing the **default operating mode**
- defining the **core purpose**, **core workflow**, and **default operating model**
- making the Zendesk-first workflow explicit, including when secondary apps should and should not be used

Also add a new file:

- `references/CONNECTORS.md`

That file should:

- map all attached apps
- explain each app’s role
- define Zendesk as the default source and primary workflow
- define when Google Drive, Linear, GitHub, and HarvestApp are allowed
- define boundaries around read vs write behavior
- align with the system instructions

Execution rules:

- audit first, then update
- reuse and improve existing files where possible
- avoid duplicating guidance across multiple files unless necessary
- keep this phase limited to instructions, file references, operating model, and app usage mapping

What I want back:

- a summary of instruction changes
- the file-reference changes
- what was added to `references/CONNECTORS.md`
- any gaps that should be handled in phase 2

---

## Phase 2 — Skill directory, routing, output rules, and standards

Apply **phase 2** of the audit and rewrite to the current agent.

Keep **Zendesk** as the main focus and do **not detach any attached apps**.

In this phase, focus only on:

- the **skill directory**
- **skill usage rules**
- **routing logic**
- **skill boundaries**
- alignment between skills, instructions, and references
- **output rules**
- template-linked output consistency
- clear **boundaries**, **quality standards**, and **evidence standards**

Tasks:

1. Audit the current skill directory and make it clearly defined.
2. Refine skill routing so it is obvious:
   - which skill is primary for each request type
   - when a supporting skill may be used
   - which skills should not be chained together by default
3. Update or add any routing reference material needed to support this.
4. Define clear output rules for repeated deliverables.
5. Reference templates where appropriate so outputs are consistent and reusable.
6. Tighten operational boundaries and guard rails so standards are explicit and enforceable.

Execution rules:

- improve existing routing and standards files before creating duplicates
- keep Zendesk-first behavior central
- ensure secondary apps do not override the support workflow
- make the output contract practical, structured, and validation-friendly

What I want back:

- a summary of skill-routing changes
- output-rule changes
- standards and boundary updates
- any files added or changed
- any gaps that should be handled in phase 3

---

## Phase 3 — Memory, schemas, fixtures, profiles, templates, and examples

Apply **phase 3** of the audit and rewrite to the current agent.

Keep **Zendesk** as the main focus and do **not detach any attached apps**.

In this phase, focus only on:

- **memory usage guidance**
- memory schemas and validation
- **templates**
- **examples**
- **fixtures**
- **profiles**
- related reference files that define these contracts

Tasks:

1. Expand memory usage guidance so it is explicit, robust, and aligned with the agent’s purpose.
2. Define clearly:
   - what may be saved in memory
   - what must not be saved
   - how memory should be structured
   - how memory supports future runs
3. Add or improve schemas that validate memory files.
4. Add or improve templates, examples, fixtures, and profiles where relevant.
5. Ensure all of these stay aligned with the instructions and reference files.
6. Prefer validator-friendly structured contracts over loose prose where appropriate.

Review and improve files in areas like:

- `memory/`
- `examples/`
- `examples/memory/`
- `templates/`
- `fixtures/`
- `profiles/`
- `schemas/`
- `references/`

Execution rules:

- reuse and improve existing artifacts where possible
- avoid duplicate contracts
- keep templates and examples paired and consistent
- keep memory practical, durable, and schema-valid

What I want back:

- a summary of memory changes
- schemas added or improved
- templates/examples/fixtures/profiles added or improved
- any alignment fixes made across files
- any gaps that should be handled in phase 4

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
