---
title: Label Inventory — Complete Reference
description: Complete inventory of all 150+ canonical labels organized by semantic family, with color codes, descriptions, and usage guidance
file_type: documentation
version: v1.1.0
created_date: '2026-05-31'
last_updated: '2026-06-01'
authors:
  - Claude Code
  - LightSpeed Team
maintainer: LightSpeed Team
owners:
  - lightspeedwp/maintainers
license: GPL-3.0
tags:
  - labels
  - label-inventory
  - reference
  - canonical-config
domain: governance
status: active
stability: stable
---

# Label Inventory — Complete Reference

**Version**: v1.1.0
**Created**: 2026-05-31
**Last Updated**: 2026-06-01
**Total Labels**: 150+

This document provides a complete inventory of all canonical labels organized by semantic family. Use this as a reference when:

- Labeling issues or PRs
- Extending the label taxonomy
- Understanding label relationships
- Retiring or consolidating labels

---

## Status Labels (20)

Labels tracking the workflow state and lifecycle of work items.

| Label | Color | Description | Use When |
| --- | --- | --- | --- |
| `status:needs-planning` | ![Light blue label](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Awaiting planning / scoping | Issue requires analysis/breakdown before work starts |
| `status:needs-triage` | ![Light blue label](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Needs triage | Issue needs investigation/categorisation |
| `status:ready` | ![Green label](https://via.placeholder.com/20/0E8A16?text=+) 0E8A16 | Groomed and ready to start | Issue is scoped, detailed, ready for work |
| `status:in-progress` | ![Bright blue label](https://via.placeholder.com/20/1D76DB?text=+) 1D76DB | Work in progress | Someone is actively working |
| `status:on-hold` | ![Light peach label](https://via.placeholder.com/20/F9D0C4?text=+) F9D0C4 | Work on hold | Work paused; waiting for decision |
| `status:needs-design` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Awaiting design input | Needs design review before implementation |
| `status:needs-design-review` | ![Light purple label](https://via.placeholder.com/20/D4C5F9?text=+) D4C5F9 | Awaiting design review | Design needs review before approval |
| `status:needs-figma-update` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Existing Figma design needs updating | Figma files need refresh |
| `status:needs-dev` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Awaiting engineering implementation | Ready for engineering to begin |
| `status:needs-review` | ![Light blue label](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Awaiting code review | PR/code needs peer review |
| `status:needs-qa` | ![Yellow label](https://via.placeholder.com/20/FBCA04?text=+) FBCA04 | Quality assurance required | Needs QA/testing |
| `status:needs-testing` | ![Light yellow label](https://via.placeholder.com/20/FEF2C0?text=+) FEF2C0 | Testing needed (manual/automated) | Awaiting testing pass |
| `status:needs-audit` | ![Light yellow label](https://via.placeholder.com/20/FEF2C0?text=+) FEF2C0 | Needs audit or validation pass | Needs security/compliance audit |
| `status:needs-documentation` | ![Light blue label](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Needs documentation update | Documentation/guides need updating |
| `status:in-discussion` | ![Light blue label](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Needs alignment/decision | Awaiting discussion/decision |
| `status:needs-more-info` | ![Light blue label](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Missing details to proceed | Awaiting more information from reporter |
| `status:blocked` | ![Light red label](https://via.placeholder.com/20/E99695?text=+) E99695 | Blocked by dependency | Blocked by external factor/dependency |
| `status:duplicate` | ![Light red label](https://via.placeholder.com/20/E99695?text=+) E99695 | Duplicate of another issue | Duplicate of existing issue |
| `status:wontfix` | ![Light grey label](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | Not planned to address | Won't be fixed/addressed |
| `status:done` | ![Green label](https://via.placeholder.com/20/0E8A16?text=+) 0E8A16 | Completed | Work complete |

---

## Priority Labels (4)

Labels signalling urgency and business impact.

| Label | Color | Description | Use When |
| --- | --- | --- | --- |
| `priority:critical` | ![Dark red label](https://via.placeholder.com/20/B60205?text=+) B60205 | Production/launch-blocking | Breaking issue; production down; release blocker |
| `priority:important` | ![Orange-red label](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | Must-do high priority | High-impact feature; significant bug |
| `priority:normal` | ![Dark blue label](https://via.placeholder.com/20/0052CC?text=+) 0052CC | Default priority | Standard/planned work (default if not specified) |
| `priority:minor` | ![Mint label](https://via.placeholder.com/20/C2E0C6?text=+) C2E0C6 | Low priority / nice to have | Backlog; can defer indefinitely |

---

## Type Labels (32)

Labels classifying the type of work. Assign exactly one per issue.

| Label | Color | Description | Project Field | Notes |
| --- | --- | --- | --- | --- |
| `type:task` | ![Blue label](https://via.placeholder.com/20/4393F8?text=+) 4393F8 | Task or to-do | Task | Default for untyped work |
| `type:bug` | ![Red label](https://via.placeholder.com/20/9F3734?text=+) 9F3734 | Bug or defect | Bug | Broken/incorrect behaviour |
| `type:feature` | ![Medium green label](https://via.placeholder.com/20/3FB950?text=+) 3FB950 | Feature or enhancement | Feature | New capability |
| `type:enhancement` | ![Medium green label](https://via.placeholder.com/20/3FB950?text=+) 3FB950 | Enhancement/alias for improve | Feature | Alias for improve; enhancement to existing feature |
| `type:design` | ![Lavender label](https://via.placeholder.com/20/AB7DF8?text=+) AB7DF8 | Design work | Design | Design artefacts/decisions |
| `type:ui` | ![Lavender label](https://via.placeholder.com/20/AB7DF8?text=+) AB7DF8 | UI implementation | Design | UI consistency, implementation |
| `type:epic` | ![Lavender label](https://via.placeholder.com/20/AB7DF8?text=+) AB7DF8 | Large multi-scope initiative | Task | Parent issue for stories/tasks |
| `type:story` | ![Blue label](https://via.placeholder.com/20/4393F8?text=+) 4393F8 | User story | Task | User-centred vertical slice |
| `type:improve` | ![Grey label](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Improvement to existing behaviour/UX | Feature | Enhance existing feature |
| `type:refactor` | ![Grey label](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Refactor or internal change | Chore | Internal restructure; no UX change |
| `type:build` | ![Blue label](https://via.placeholder.com/20/4393F8?text=+) 4393F8 | Build & CI | Task | Build pipelines, tooling |
| `type:ci` | ![Blue label](https://via.placeholder.com/20/4393F8?text=+) 4393F8 | CI/CD pipelines | Automation | CI/CD infrastructure |
| `type:automation` | ![Blue label](https://via.placeholder.com/20/4393F8?text=+) 4393F8 | Automation | Automation | Bots, actions, scripts |
| `type:test` | ![Orange label](https://via.placeholder.com/20/D29922?text=+) D29922 | Testing/coverage | Automation | Testing and QA work; branch mapping rule: head-branch ["^test/.*", "^qa/.*"] |
| `type:performance` | ![Orange label](https://via.placeholder.com/20/D29922?text=+) D29922 | Performance improvement | Task | Speed, efficiency optimisation |
| `type:a11y` | ![Pink label](https://via.placeholder.com/20/DB61A2?text=+) DB61A2 | Accessibility | Design | Accessibility/WCAG work |
| `type:security` | ![Red label](https://via.placeholder.com/20/9F3734?text=+) 9F3734 | Security issue | Bug | Security concern/hardening |
| `type:compatibility` | ![Brown label](https://via.placeholder.com/20/8D4821?text=+) 8D4821 | Compatibility | Task | Browser/device/plugin compatibility |
| `type:integration` | ![Brown label](https://via.placeholder.com/20/8D4821?text=+) 8D4821 | Integration | Task | External system integration |
| `type:dependency` | ![Brown label](https://via.placeholder.com/20/8D4821?text=+) 8D4821 | Dependency update | Integration | Dependency updates, version management |
| `type:release` | ![Medium green label](https://via.placeholder.com/20/3FB950?text=+) 3FB950 | Release | Release | Release planning/management |
| `type:maintenance` | ![Grey label](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Maintenance | Task | Routine maintenance, updates |
| `type:documentation` | ![Grey label](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Documentation | Documentation | Docs, guides, specifications |
| `type:research` | ![Grey label](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Research / investigation | Task | Investigation, POC, spike |
| `type:investigation` | ![Grey label](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Investigation | Research | Issue diagnosis, root cause analysis |
| `type:chore` | ![Grey label](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Chore / small hygiene change | Task | Hygiene change, typos, config |
| `type:audit` | ![Grey label](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Audit | Task | Security/code/process audit |
| `type:review` | ![Blue label](https://via.placeholder.com/20/4393F8?text=+) 4393F8 | Code or design review task | Task | Peer review, validation |
| `type:ai-ops` | ![Blue label](https://via.placeholder.com/20/4393F8?text=+) 4393F8 | AI Ops | Automation | AI, agents, datasets |
| `type:content-modelling` | ![Lavender label](https://via.placeholder.com/20/AB7DF8?text=+) AB7DF8 | Content Modelling | Design | Content structure, CPTs, taxonomy |
| `type:question` | ![Purple label](https://via.placeholder.com/20/5319E7?text=+) 5319E7 | Question or request for clarification | Task | Clarification request |
| `type:support` | ![Green label](https://via.placeholder.com/20/0E8A16?text=+) 0E8A16 | Support request | Task | Support/troubleshooting |

---

## Meta/Housekeeping Labels (8)

Labels tracking automation markers, process state, and housekeeping.

| Label | Color | Description | Usage |
| --- | --- | --- | --- |
| `meta:needs-changelog` | ![Light grey label](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | Requires a changelog entry before merge | Applied by workflow; indicates CHANGELOG.md needs update |
| `meta:no-changelog` | ![Light grey label](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | No changelog needed | Applied when change doesn't warrant changelog entry |
| `meta:has-pr` | ![Light grey label](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | Issue has an open linked PR | Applied automatically when PR created |
| `meta:no-issue-activity` | ![Light grey label](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | No recent issue activity | Applied by automation for stale issues |
| `meta:no-pr-activity` | ![Light grey label](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | No recent PR activity | Applied by automation for stale PRs |
| `meta:stale` | ![Grey label](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Marked as stale for review | Manual; indicates item needs fresh review |
| `meta:dependabot-security` | ![Dark red label](https://via.placeholder.com/20/B60205?text=+) B60205 | Dependabot update appears security-related and eligible for guarded automation | Applied by Dependabot for security updates |

---

## Release Scope Labels (4)

Labels categorising release impact.

| Label | Color | Description | Usage |
| --- | --- | --- | --- |
| `release:patch` | ![Medium green label](https://via.placeholder.com/20/3FB950?text=+) 3FB950 | Patch release | Bug fixes, security patches |
| `release:minor` | ![Sky blue label](https://via.placeholder.com/20/58A6FF?text=+) 58A6FF | Minor release | New features, backwards-compatible |
| `release:major` | ![Bright red label](https://via.placeholder.com/20/F85149?text=+) F85149 | Major release | Breaking changes |
| `release:hotfix` | ![Orange label](https://via.placeholder.com/20/D29922?text=+) D29922 | Urgent hotfix outside normal cadence | Emergency/production fix |

---

## Area Labels (33)

Labels identifying component, module, or domain. Multiple allowed per issue.

| Label | Color | Description |
| --- | --- | --- |
| `area:core` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Core / shared infrastructure |
| `area:labels` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Label governance and routing |
| `area:block-editor` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block editor |
| `area:theme` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Theme & styles |
| `area:documentation` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Docs & guides |
| `area:tests` | ![Light purple label](https://via.placeholder.com/20/D4C5F9?text=+) D4C5F9 | Test suites & harnesses |
| `area:testing` | ![Light purple label](https://via.placeholder.com/20/D4C5F9?text=+) D4C5F9 | Testing and QA |
| `area:quality` | ![Light purple label](https://via.placeholder.com/20/D4C5F9?text=+) D4C5F9 | Quality validation and QA controls |
| `area:scripts` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Scripts & tooling |
| `area:assets` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Assets (images, fonts, static files) |
| `area:woocommerce` | ![Light purple label](https://via.placeholder.com/20/D4C5F9?text=+) D4C5F9 | WooCommerce |
| `area:content` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Content and copy |
| `area:design-system` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Design system and tokens |
| `area:navigation` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Navigation & menus |
| `area:forms` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Forms and form flows |
| `area:plugins` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Plugin configuration / logic |
| `area:search` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Search and filtering |
| `area:seo` | ![Mint label](https://via.placeholder.com/20/C2E0C6?text=+) C2E0C6 | Technical SEO (meta, schema, sitemaps) |
| `area:ai` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | AI and automation systems |
| `area:analytics` | ![Mint label](https://via.placeholder.com/20/C2E0C6?text=+) C2E0C6 | Analytics & tracking |
| `area:infrastructure` | ![Teal label](https://via.placeholder.com/20/006B75?text=+) 006B75 | Infrastructure / hosting / platform |
| `area:automation` | ![Light blue label](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Automation workflows and agents |
| `area:performance` | ![Orange label](https://via.placeholder.com/20/D29922?text=+) D29922 | Performance-focused work |
| `area:a11y` | ![Pink label](https://via.placeholder.com/20/DB61A2?text=+) DB61A2 | Accessibility-focused work |
| `area:security` | ![Red label](https://via.placeholder.com/20/9F3734?text=+) 9F3734 | Security-focused work |
| `area:compatibility` | ![Brown label](https://via.placeholder.com/20/8D4821?text=+) 8D4821 | Compatibility and cross-environment concerns |
| `area:release` | ![Medium green label](https://via.placeholder.com/20/3FB950?text=+) 3FB950 | Release process and readiness |
| `area:maintenance` | ![Grey label](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Maintenance and routine upkeep |
| `area:i18n` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Internationalisation |
| `area:ci` | ![Light blue label](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Build and CI pipelines |
| `area:deployment` | ![Teal label](https://via.placeholder.com/20/006B75?text=+) 006B75 | Deploy/release operations |
| `area:dependencies` | ![Light peach label](https://via.placeholder.com/20/F9D0C4?text=+) F9D0C4 | Composer/npm dependency work |
| `area:integration` | ![Orange-red label](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | 3rd-party integrations / ecosystem |

---

## Component Labels (20)

Labels for component-specific work (Block Editor focus).

| Label | Color | Description |
| --- | --- | --- |
| `comp:block-editor` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block/site editor work |
| `comp:block-inserter` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Inserter UI/behaviour |
| `comp:block-variations` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block variations |
| `comp:block-supports` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block supports |
| `comp:block-locking` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block locking |
| `comp:block-bindings` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block bindings |
| `comp:block-templates` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block templates / template editor |
| `comp:block-patterns` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Patterns library/registration |
| `comp:template-parts` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Template parts (header/footer/loops) |
| `comp:block-json` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block metadata (block.json) |
| `comp:theme-json` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Tokens, presets, settings (theme.json) |
| `comp:wp-admin` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | WP Admin screens |
| `comp:settings` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Global/settings UX |
| `comp:post-settings` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Post editor settings panel |
| `comp:style-variations` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | JSON style variations |
| `comp:block-styles` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block styles registered via JSON |
| `comp:color-palette` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Palette tokens and usage |
| `comp:typography` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Type scale and typography tokens |
| `comp:section-styles` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Section/background styles |
| `comp:spacing` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Spacing tokens and layout gaps |

---

## Language Labels (7)

Labels identifying primary programming language.

| Label | Color | Description |
| --- | --- | --- |
| `lang:php` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | PHP |
| `lang:js` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | JavaScript/TypeScript |
| `lang:css` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Stylesheets (CSS/Sass/etc.) |
| `lang:html` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Markup (HTML) |
| `lang:md` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Markdown content/docs |
| `lang:json` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | JSON config/content |
| `lang:yaml` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | YAML config |

---

## Environment Labels (3)

Labels indicating deployment/work environment.

| Label | Color | Description |
| --- | --- | --- |
| `env:prototype` | ![Light grey label](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | Prototype/sandbox |
| `env:staging` | ![Light blue label](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Staging/UAT |
| `env:live` | ![Green label](https://via.placeholder.com/20/0E8A16?text=+) 0E8A16 | Live/production |

---

## Compatibility Labels (6)

Labels for cross-platform/version compatibility.

| Label | Color | Description |
| --- | --- | --- |
| `compat:wordpress` | ![Orange-red label](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | WordPress core/Gutenberg compatibility |
| `compat:php` | ![Orange-red label](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | PHP version compatibility |
| `compat:woocommerce` | ![Orange-red label](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | WooCommerce versions |
| `compat:gutenberg` | ![Orange-red label](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | Gutenberg package compatibility |
| `compat:rtl` | ![Orange-red label](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | RTL languages support |
| `compat:multisite` | ![Light peach label](https://via.placeholder.com/20/F9D0C4?text=+) F9D0C4 | Multisite/network considerations |

---

## Content Type Labels (2)

Labels for WordPress post type specificity.

| Label | Color | Description |
| --- | --- | --- |
| `cpt:posts` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | WordPress Posts |
| `cpt:pages` | ![Pale blue label](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | WordPress Pages |

---

## AI Ops Labels (7)

Labels for AI operations and automation infrastructure.

| Label | Color | Description |
| --- | --- | --- |
| `ai-ops:instructions` | ![Dark blue label](https://via.placeholder.com/20/0052CC?text=+) 0052CC | AI instruction docs |
| `ai-ops:chat-modes` | ![Dark blue label](https://via.placeholder.com/20/0052CC?text=+) 0052CC | Prompt sets / chat modes |
| `ai-ops:agents` | ![Dark blue label](https://via.placeholder.com/20/0052CC?text=+) 0052CC | AI agent definitions |
| `ai-ops:prompts` | ![Dark blue label](https://via.placeholder.com/20/0052CC?text=+) 0052CC | Reusable prompts |
| `ai-ops:datasets` | ![Light blue label](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Training/evaluation datasets |
| `ai-ops:evaluations` | ![Light blue label](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Evaluation results |
| `ai-ops:tools` | ![Light blue label](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Tool/plugin manifests |

---

## Contributor Labels (3)

Labels for community and contributor guidance.

| Label | Color | Description |
| --- | --- | --- |
| `contrib:good-first-issue` | ![Light purple label](https://via.placeholder.com/20/D4C5F9?text=+) D4C5F9 | Good for new contributors |
| `contrib:help-wanted` | ![Mint label](https://via.placeholder.com/20/C2E0C6?text=+) C2E0C6 | Help wanted |
| `contrib:discussion` | ![Mint label](https://via.placeholder.com/20/C2E0C6?text=+) C2E0C6 | Contributor/community discussion |

---

## Discussion Labels (7)

Labels for GitHub Discussions categorisation (not for issues/PRs).

| Label | Color | Description |
| --- | --- | --- |
| `discussion:announcement` | ![Yellow label](https://via.placeholder.com/20/FBCA04?text=+) FBCA04 | Official announcements |
| `discussion:showcase` | ![Green label](https://via.placeholder.com/20/0E8A16?text=+) 0E8A16 | Show & Tell |
| `discussion:community` | ![Purple label](https://via.placeholder.com/20/6f42c1?text=+) 6f42c1 | Community/general |
| `discussion:feedback` | ![Bright blue label](https://via.placeholder.com/20/1d76db?text=+) 1d76db | Feedback/suggestions |
| `discussion:support` | ![Red label](https://via.placeholder.com/20/d73a4a?text=+) d73a4a | Support/troubleshooting |
| `discussion:sponsorship` | ![Light peach label](https://via.placeholder.com/20/f9d0c4?text=+) f9d0c4 | Sponsorship/funding |
| `discussion:partnership` | ![Light blue label](https://via.placeholder.com/20/bfd4f2?text=+) bfd4f2 | Partnership/collaboration |

---

## Summary Statistics

**Total Labels**: 150+

| Family | Count |
| --- | --- |
| Status | 20 |
| Priority | 4 |
| Type | 32 |
| Meta/Housekeeping | 8 |
| Release Scope | 4 |
| Area | 33 |
| Component | 20 |
| Language | 7 |
| Environment | 3 |
| Compatibility | 6 |
| Content Type | 2 |
| AI Ops | 7 |
| Contributor | 3 |
| Discussion | 7 |
| **TOTAL** | **~150** |

---

## Label Assignment Guide

### Quick Decision Tree

**Starting an issue?**

1. Choose ONE **Type** label (required)
2. Choose ONE **Status** label (optional; defaults to `status:needs-triage`)
3. Add **Priority** if not normal (optional; defaults to `priority:normal`)
4. Add **Area** labels if domain-specific (optional)
5. Add **Language** labels if code-specific (optional)

**Creating a PR?**

1. Choose ONE **Type** label based on branch (automated by labeler)
2. Add **Area** labels if domain-specific (optional)
3. Add **Language** labels if code-specific (optional)

**Retirement Candidates**

Labels with minimal usage should be periodically reviewed for retirement:

- Last used >6 months ago
- No active issues with label
- Can be consolidated into broader category

---

## Related Documentation

- [`docs/LABEL_STRATEGY.md`](./LABEL_STRATEGY.md) — High-level strategy and governance
- [`docs/LABEL_COLOR_STRATEGY.md`](./LABEL_COLOR_STRATEGY.md) — Detailed colour specifications
- [`docs/ISSUE_TYPES.md`](./ISSUE_TYPES.md) — Type definitions and decision tree
- [`docs/ISSUE_FIELDS.md`](./ISSUE_FIELDS.md) — Project field mappings
- [`.github/labels.yml`](../.github/labels.yml) — Canonical label definitions
