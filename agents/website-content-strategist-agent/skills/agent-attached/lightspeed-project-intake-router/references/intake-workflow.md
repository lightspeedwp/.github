# Intake Workflow

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

Use this workflow to turn messy project context into an actionable LightSpeed kickoff route.

## 1. Capture project identity

Record:

- client or project name;
- primary business goal;
- target users or audience;
- current site URL;
- dev or staging URL;
- Figma design system, prototype, Make prototype or frame URL;
- repository, issue or pull request links;
- project stage;
- desired output;
- deadline or launch milestone;
- known approval owner.

## 2. Classify project and risk

Classify by:

- platform: WordPress, WooCommerce, plugin, design system, AI-readiness, chatbot or mixed;
- build type: block theme, block theme plus plugin, hybrid conversion, content migration, ecommerce, publishing or internal product;
- evidence maturity: confirmed, draft, unreviewed, missing or blocker;
- delivery stage: intake, discovery, PRD, technical brief, task planning, implementation, QA, launch or post-launch;
- specialist risk: content, redirects, claims, governance, measurement, performance, accessibility, design parity, data migration or custom functionality.

## 3. Inventory sources

Separate sources into:

- client brief and commercial context;
- design evidence;
- code evidence;
- website evidence;
- content and IA evidence;
- analytics, SEO and performance evidence;
- accessibility, governance and policy evidence;
- AI, chatbot and source-of-truth evidence;
- launch, QA and approval evidence.

Use the source inventory table when there is more than one source or when source status affects routing.

## 4. Identify missing inputs

Group missing inputs by severity:

- **Blocker:** required before the next route can proceed safely.
- **Important gap:** should be resolved before PRD, technical brief, task planning or estimate confidence.
- **Later-stage gap:** can be tracked but does not block the next route.

## 5. Choose route

Choose one primary route:

- evidence route when sources are incomplete or unreviewed;
- PRD route when scope, goals and outcomes are the immediate need;
- technical route when Figma/WordPress architecture is the immediate need;
- task route when PRD and technical brief are approved;
- QA/launch route when implementation exists and needs validation;
- governance/content/AI route when source-of-truth, claims, policies or chatbot behaviour are the main risk.

Then add secondary routes only for clear dependencies or later-stage handoffs.

## 6. Produce the kickoff pack

Include:

- three-line value, risk and next step;
- snapshot of known context;
- evidence maturity table;
- missing inputs;
- assumptions and risks;
- recommended primary route;
- secondary and later-stage routes;
- approval gates;
- prompt starters for the next skill.

## 7. Stop point

Stop after the intake pack unless the user explicitly asks to continue into a downstream skill. The router may recommend the next route and provide prompts, but it should not quietly write the PRD, technical brief, task plan, GitHub issues or launch QA pack.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
