# CMS Platform Workflows

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
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

This reference keeps the high-level platform map close to the skill so the agent can choose the right seam quickly.

## Platform Map

| Platform | Primary extension surfaces | Media and asset convention | Notes |
| --- | --- | --- | --- |
| WordPress | Themes, plugins, template parts, hooks | Theme assets inside the active theme; authored media under uploads-style paths | Good fit for template hierarchy, taxonomy, custom fields, and local/static export workflows |
| WooCommerce | WordPress themes and plugins plus product/catalog extensions | Same base conventions as WordPress, with product imagery as authored media | Treat it as WordPress first, then apply commerce-specific content and admin rules |
| Shopify | Themes, Liquid sections, blocks, apps, metafields | Theme assets and hosted store media are distinct concerns | Prefer app or metafield seams over theme-only hacks when data must survive redesigns |
| Wix | Site builder surfaces, apps, content collections, custom elements | Hosted media library plus editor-managed assets | Favor editor-safe changes and avoid assuming file-system level access |
| Squarespace | Templates, code injection, content collections, commerce settings | Hosted asset library managed through the platform | Expect narrower extension points and stronger hosted constraints |
| Drupal | Themes, modules, content types, views, taxonomy | Managed files and theme assets are separate | Strong fit for structured content, enterprise workflows, and migration-heavy changes |
| Joomla | Templates, modules, components, plugins | Managed media plus template-owned assets | Similar split between templates and extensions; watch routing and content component boundaries |
| HubSpot CMS Hub | Themes, modules, templates, serverless functions, CRM-linked content | Hosted file manager plus theme assets | Content, marketing, and CRM concerns are tightly coupled |
| Webflow | Designer, CMS collections, components, embeds, limited code export | Hosted assets and CMS collection media | Export constraints matter; distinguish what survives export from what depends on hosted CMS features |
| Adobe Experience Manager | Components, templates, content fragments, experience fragments, workflows | DAM-managed assets plus component resources | Enterprise governance, authoring workflows, and content fragment models drive most changes |

## Media Rule of Thumb

- Theme-owned images belong with the theme or template package.
- User-authored images belong in the platform's upload or media-library flow.
- If a project supports both, keep them distinct in config and in code paths.

## Generic CMS Responsibility Map

Most CMS codebases group behavior into the same handful of responsibilities. Use this as a checklist when locating the owning seam in any project:

- Runtime assembly and request routing
- Theme or template system and shared template helpers
- Admin and editor controllers with their view templates
- Content, taxonomy, and settings persistence (repositories, models, schema/migrations)
- Content transformation utilities (markdown, shortcodes, block renderers)
- Static export, deploy, or render pipeline entry points

Map the project to these responsibilities first, then make the smallest change that preserves the platform's structure.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
