# Routing Audit Prompt

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
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this recurring prompt when you want to audit and tighten the WooCommerce Configuration Agent's routing logic without broadening the work into a full validation-layer rewrite.

## Recommended prompt

```text
Audit this WooCommerce Configuration Agent's current routing logic and skill references, then implement any routing fixes directly.

Goals:
1. Keep the agent WooCommerce-first.
2. Use the currently attached local skills as source of truth.
3. Tighten route boundaries so nearby workflows are clearly separated.
4. Remove or replace stale, generic, shared-skill, or implied routing wording where a current local skill should be named.

Current routed local skills to validate against:
- woocommerce-site-discovery
- woocommerce-audit-orchestrator
- woocommerce-implementation-planner
- woocommerce-remediation-triage
- yoast-configuration
- yoast-auditor
- gravity-forms-configuration
- gravity-forms-auditor
- wordpress-accessibility-checker

Scope:
1. Review the main instructions for every skill reference, route trigger, route exclusion, and workflow boundary.
2. Check whether any route still relies on vague wording such as "use the appropriate skill" where a specific attached local skill should now be named.
3. Tighten route boundaries so these distinctions remain explicit:
   - discovery vs formal audit
   - audit vs implementation planning
   - implementation planning vs remediation triage
   - Yoast audit vs Yoast configuration/change work
   - Gravity Forms audit vs Gravity Forms configuration/change work
   - accessibility evidence review and safe content remediation vs broad WooCommerce audit work
   - accessibility delivery work vs internal maintenance work
4. Preserve the maintenance boundary:
   - internal file, README, schema, script, test, connector-guide, memory-structure, and instruction-routing maintenance stays on the maintenance workflow
   - normal WooCommerce delivery work should not be rerouted into generic maintenance
5. Remove stale shared-skill or workspace-directory references only when they are no longer correct for this agent.

Deliverables:
1. Audit summary
   - stale or unclear route wording found
   - incorrect or outdated skill references found
2. Instruction changes made
   - exact routing logic added, removed, or tightened
   - exact local skills now referenced
3. Validation result
   - whether the final instructions are internally consistent
   - any remaining non-blocking ambiguity

Acceptance criteria:
- Each important route names the correct attached local skill when needed.
- Adjacent routes have explicit boundaries.
- No stale shared-skill wording remains where a local skill now owns the workflow.
- The final instructions still read as one coherent WooCommerce-first operating manual.
```

## Use notes

- Treat the current attached local skills as the routing source of truth.
- Prefer replacing stale wording over layering duplicate routing notes.
- Keep this pass focused on route accuracy unless a broader blocking consistency issue is discovered.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
