# Access-level workflow

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

Use this reference when the user's Yoast task depends on what evidence or system access is available. The goal is to prevent the skill from recommending actions that cannot be safely confirmed or implemented with the current access level.

## Access levels

| Access level | What it proves | What it does not prove | Safe output |
|---|---|---|---|
| `no access` | Only the user's description | Current settings, rendered output, plugin versions or Google interpretation | Intake questions, assumptions, likely risks, evidence request list |
| `screenshots` | Visible UI state at screenshot time | Hidden settings, live output, code overrides, indexables state | Partial settings review with validation gaps |
| `settings export` | Exported or copied Yoast/admin values | Rendered page output, HTTP headers, robots response, sitemap availability, schema validity | Settings export review and live QA checklist |
| `wordpress admin` | Current visible settings and content structure | Theme/plugin filters, server headers, cache/CDN behaviour, Google interpretation | Admin change plan plus rendered-output QA requirement |
| `staging` | Testable implementation environment | Production crawl/indexing behaviour unless mirrored | Change plan, regression test plan, pre-launch QA |
| `codebase` | Theme/plugin/customisation logic | Runtime settings, production output or content completeness unless supplied | Developer handoff and code review checklist |
| `rendered source` | Actual HTML/JSON-LD/meta output for supplied URLs | Admin setting cause unless settings/code are supplied | Rendered-output QA and likely cause notes |
| `crawl export` | Crawled URL status and extracted elements | Exact Yoast configuration or server-side cause | Pattern review, triage, QA follow-up list |
| `Search Console` | Google-reported visibility/indexing signals for verified property | Full site configuration or immediate Google behaviour | Evidence-backed impact notes and verification plan |
| `live scan` | Current public output and HTTP responses | Hidden admin intent or code ownership | Current-output QA and implementation routing |

## Access-aware routing rules

- If the user wants implementation instructions but only provides a finding, produce a `templates/yoast-remediation-backlog.md` style output and mark owner/access requirements.
- If the user has WordPress admin access but not codebase access, use `templates/wordpress-admin-change-plan.md` and avoid code-level assumptions.
- If the user has codebase access but no rendered output, use `templates/developer-handoff.md` and require rendered-source QA after deployment.
- If the user provides only settings exports, use `references/settings-export-review-playbook.md` and explicitly state that exports do not prove live output.
- If evidence conflicts across access levels, use `references/conflict-resolution-playbook.md` and prefer rendered output/live scan over intended settings for current-state claims.

## Minimum evidence by task

| Task | Minimum evidence | Better evidence | Stop condition |
|---|---|---|---|
| Product capability recommendation | Current product pages or source register marked verified current | Product page + WordPress.org listing + changelog context | Product packaging is unverified and commercial decision depends on it |
| Settings audit | Settings export or admin screenshots | Admin access + rendered source sample | User asks for exact current output but no output is supplied |
| Rendered-output QA | Page source or crawl export | Live scan + settings/code context | User asks for cause/remediation but only supplies symptoms |
| WooCommerce schema review | Product page rendered JSON-LD | Product data + variation/product type data + settings | Product identifiers/variation data missing for ProductGroup/Offer conclusions |
| Developer customisation | Codebase snippet or desired output | Codebase + rendered output + official Yoast API source | Direct DB/indexables edit is requested without official support |
| Migration acceptance | Old/new URLs + settings/output samples | Redirect map + crawl + Search Console | No old/new URL evidence for redirect/canonical decisions |

## Output requirements

Always state:

1. Access level used.
2. What the evidence confirms.
3. What remains unverified.
4. Safest next action available with current access.
5. Whether implementation needs admin, developer, client or SEO lead approval.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
