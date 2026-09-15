# Local Skill Adaptation Repair Prompt

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this recurring prompt after running `prompts/local-skill-adaptation-audit-prompt.md` when you want to implement the changes needed to adapt a specified attached local skill to this WooCommerce Configuration Agent and remove stale Tour Operator Configuration Agent references.

## Recommended prompt

```text
Use the output from the local-skill-adaptation audit as the implementation plan, then repair the specified attached local skill directly.

This is an implementation task, not just a review.

Primary goal:
Bring the specified local skill into alignment with this WooCommerce Configuration Agent's current role, terminology, references, workflow boundaries, and grounded configuration.

Mandatory cleanup goal:
Remove or replace all stale references to the Tour Operator Configuration Agent.

Input assumption:
- A prior audit pass has already identified the specific drift, stale wording, and adaptation work needed.
- Use that audit output as the repair scope.
- If the audit output conflicts with the current grounded agent configuration, trust the current grounded WooCommerce Configuration Agent setup.

Repair scope:
1. Skill identity and framing
- Repair stale agent-name, role, or domain wording.
- Replace wording that still frames the skill for the Tour Operator Configuration Agent or tour-operator workflows.
- Make the skill read as part of this WooCommerce Configuration Agent's current workflow set.

2. Skill instructions and workflow logic
- Repair stale references to older workflows, unsupported routes, outdated deliverables, or mismatched domain assumptions.
- Align terminology, evidence expectations, and deliverable wording with this agent's WooCommerce-first role.
- Keep the skill's purpose narrow where that purpose is still correct.
- Do not over-broaden the skill into generic WordPress consulting.

3. References, metadata, and prompt wording
- Update stale metadata, default prompt language, internal references, and related wording that no longer fits this agent.
- Repair references to connected apps, attached files, maintenance boundaries, or output assumptions only where the current grounded configuration justifies the change.
- Remove stale Tour Operator Configuration Agent references completely when found.

4. Boundary protection
- Preserve the agent's WooCommerce-first role.
- Preserve the skill's valid narrow purpose instead of repurposing it broadly.
- Do not invent unsupported apps, folders, files, references, routes, schemas, or workflows.
- Do not rewrite unrelated parts of the skill unless needed for adaptation consistency.

5. Post-repair checks
- Confirm the repaired skill no longer contains Tour Operator Configuration Agent references.
- Confirm the repaired wording fits this WooCommerce Configuration Agent's grounded role and attached workflow set.
- Confirm the repaired skill still has a coherent, scoped purpose.

Constraints:
- Use the current grounded WooCommerce Configuration Agent setup as source of truth.
- Be conservative and precise.
- Prefer replacing stale wording over layering duplicate guidance.
- Remove drift fully when confirmed.
- Do not invent new capabilities just to make the wording feel more complete.
- Do not silently keep cross-domain wording that no longer fits this agent.

Deliverable format:
1. Repair summary
- what was corrected
- which stale Tour Operator Configuration Agent references were removed or replaced
- which skill areas were updated

2. Exact changes made
- identity, metadata, instruction, workflow, or reference wording changed
- WooCommerce-specific alignment changes made
- any boundaries preserved intentionally

3. Validation result
- whether the repaired skill is now internally consistent
- whether it now fits this WooCommerce Configuration Agent cleanly
- any remaining non-blocking follow-up items
```

## Use notes

- Run the audit prompt first when possible.
- Name the exact local skill being repaired when you run the prompt.
- Treat the current grounded agent configuration as canonical when older skill wording disagrees.
- Keep the repair pass focused on adaptation and drift removal rather than broad repurposing.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
