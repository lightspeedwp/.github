---
title: Label Inventory — Complete Reference
description: Complete inventory of all 150+ canonical labels organized by semantic family, with color codes, descriptions, and usage guidance
file_type: documentation
version: v1.0.0
created_date: '2026-05-31'
last_updated: '2026-05-31'
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
stability: stable
---

# Label Inventory — Complete Reference

**Version**: v1.0.0  
**Created**: 2026-05-31  
**Last Updated**: 2026-05-31  
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
| `status:needs-planning` | ![BFD4F2](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Awaiting planning / scoping | Issue requires analysis/breakdown before work starts |
| `status:needs-triage` | ![BFD4F2](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Needs triage | Issue needs investigation/categorisation |
| `status:ready` | ![0E8A16](https://via.placeholder.com/20/0E8A16?text=+) 0E8A16 | Groomed and ready to start | Issue is scoped, detailed, ready for work |
| `status:in-progress` | ![1D76DB](https://via.placeholder.com/20/1D76DB?text=+) 1D76DB | Work in progress | Someone is actively working |
| `status:on-hold` | ![F9D0C4](https://via.placeholder.com/20/F9D0C4?text=+) F9D0C4 | Work on hold | Work paused; waiting for decision |
| `status:needs-design` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Awaiting design input | Needs design review before implementation |
| `status:needs-design-review` | ![D4C5F9](https://via.placeholder.com/20/D4C5F9?text=+) D4C5F9 | Awaiting design review | Design needs review before approval |
| `status:needs-figma-update` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Existing Figma design needs updating | Figma files need refresh |
| `status:needs-dev` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Awaiting engineering implementation | Ready for engineering to begin |
| `status:needs-review` | ![BFD4F2](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Awaiting code review | PR/code needs peer review |
| `status:needs-qa` | ![FBCA04](https://via.placeholder.com/20/FBCA04?text=+) FBCA04 | Quality assurance required | Needs QA/testing |
| `status:needs-testing` | ![FEF2C0](https://via.placeholder.com/20/FEF2C0?text=+) FEF2C0 | Testing needed (manual/automated) | Awaiting testing pass |
| `status:needs-audit` | ![FEF2C0](https://via.placeholder.com/20/FEF2C0?text=+) FEF2C0 | Needs audit or validation pass | Needs security/compliance audit |
| `status:needs-documentation` | ![BFD4F2](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Needs documentation update | Documentation/guides need updating |
| `status:in-discussion` | ![BFD4F2](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Needs alignment/decision | Awaiting discussion/decision |
| `status:needs-more-info` | ![BFD4F2](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Missing details to proceed | Awaiting more information from reporter |
| `status:blocked` | ![E99695](https://via.placeholder.com/20/E99695?text=+) E99695 | Blocked by dependency | Blocked by external factor/dependency |
| `status:duplicate` | ![E99695](https://via.placeholder.com/20/E99695?text=+) E99695 | Duplicate of another issue | Duplicate of existing issue |
| `status:wontfix` | ![E1E4E8](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | Not planned to address | Won't be fixed/addressed |
| `status:done` | ![0E8A16](https://via.placeholder.com/20/0E8A16?text=+) 0E8A16 | Completed | Work complete |

---

## Priority Labels (5)

Labels signalling urgency and business impact.

| Label | Color | Description | Use When |
| --- | --- | --- | --- |
| `priority:critical` | ![B60205](https://via.placeholder.com/20/B60205?text=+) B60205 | Production/launch-blocking | Breaking issue; production down; release blocker |
| `priority:important` | ![D93F0B](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | Must-do high priority | High-impact feature; significant bug |
| `priority:normal` | ![0052CC](https://via.placeholder.com/20/0052CC?text=+) 0052CC | Default priority | Standard/planned work (default if not specified) |
| `priority:minor` | ![C2E0C6](https://via.placeholder.com/20/C2E0C6?text=+) C2E0C6 | Low priority / nice to have | Backlog; can defer indefinitely |

---

## Type Labels (27)

Labels classifying the type of work. Assign exactly one per issue.

| Label | Color | Description | Project Field | Notes |
| --- | --- | --- | --- | --- |
| `type:task` | ![4393F8](https://via.placeholder.com/20/4393F8?text=+) 4393F8 | Task or to-do | Task | Default for untyped work |
| `type:bug` | ![9F3734](https://via.placeholder.com/20/9F3734?text=+) 9F3734 | Bug or defect | Bug | Broken/incorrect behaviour |
| `type:feature` | ![3FB950](https://via.placeholder.com/20/3FB950?text=+) 3FB950 | Feature or enhancement | Feature | New capability |
| `type:design` | ![AB7DF8](https://via.placeholder.com/20/AB7DF8?text=+) AB7DF8 | Design work | Design | Design artefacts/decisions |
| `type:epic` | ![AB7DF8](https://via.placeholder.com/20/AB7DF8?text=+) AB7DF8 | Large multi-scope initiative | Task | Parent issue for stories/tasks |
| `type:story` | ![4393F8](https://via.placeholder.com/20/4393F8?text=+) 4393F8 | User story | Task | User-centred vertical slice |
| `type:improve` | ![9198A1](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Improvement to existing behaviour/UX | Task | Enhance existing feature |
| `type:refactor` | ![9198A1](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Refactor or internal change | Task | Internal restructure; no UX change |
| `type:build` | ![4393F8](https://via.placeholder.com/20/4393F8?text=+) 4393F8 | Build & CI | Task | Build pipelines, tooling |
| `type:automation` | ![4393F8](https://via.placeholder.com/20/4393F8?text=+) 4393F8 | Automation | Automation | Bots, actions, scripts |
| `type:test` | ![D29922](https://via.placeholder.com/20/D29922?text=+) D29922 | Testing/coverage | Automation | Testing, test coverage |
| `type:performance` | ![D29922](https://via.placeholder.com/20/D29922?text=+) D29922 | Performance improvement | Task | Speed, efficiency optimisation |
| `type:a11y` | ![DB61A2](https://via.placeholder.com/20/DB61A2?text=+) DB61A2 | Accessibility | Design | Accessibility/WCAG work |
| `type:security` | ![9F3734](https://via.placeholder.com/20/9F3734?text=+) 9F3734 | Security issue | Bug | Security concern/hardening |
| `type:compatibility` | ![8D4821](https://via.placeholder.com/20/8D4821?text=+) 8D4821 | Compatibility | Task | Browser/device/plugin compatibility |
| `type:integration` | ![8D4821](https://via.placeholder.com/20/8D4821?text=+) 8D4821 | Integration | Task | External system integration |
| `type:release` | ![3FB950](https://via.placeholder.com/20/3FB950?text=+) 3FB950 | Release | Release | Release planning/management |
| `type:maintenance` | ![9198A1](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Maintenance | Task | Routine maintenance, updates |
| `type:documentation` | ![9198A1](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Documentation | Documentation | Docs, guides, specifications |
| `type:research` | ![9198A1](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Research / investigation | Task | Investigation, POC, spike |
| `type:chore` | ![9198A1](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Chore / small hygiene change | Task | Hygiene change, typos, config |
| `type:audit` | ![9198A1](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Audit | Task | Security/code/process audit |
| `type:qa` | ![D29922](https://via.placeholder.com/20/D29922?text=+) D29922 | Quality assurance | Automation | QA/testing work |
| `type:review` | ![4393F8](https://via.placeholder.com/20/4393F8?text=+) 4393F8 | Code or design review task | Task | Peer review, validation |
| `type:ai-ops` | ![4393F8](https://via.placeholder.com/20/4393F8?text=+) 4393F8 | AI Ops | Automation | AI, agents, datasets |
| `type:content-modelling` | ![AB7DF8](https://via.placeholder.com/20/AB7DF8?text=+) AB7DF8 | Content Modelling | Design | Content structure, CPTs, taxonomy |
| `type:question` | ![5319E7](https://via.placeholder.com/20/5319E7?text=+) 5319E7 | Question or request for clarification | Task | Clarification request |
| `type:support` | ![0E8A16](https://via.placeholder.com/20/0E8A16?text=+) 0E8A16 | Support request | Task | Support/troubleshooting |

---

## Meta/Housekeeping Labels (8)

Labels tracking automation markers, process state, and housekeeping.

| Label | Color | Description | Usage |
| --- | --- | --- | --- |
| `meta:needs-changelog` | ![E1E4E8](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | Requires a changelog entry before merge | Applied by workflow; indicates CHANGELOG.md needs update |
| `meta:no-changelog` | ![E1E4E8](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | No changelog needed | Applied when change doesn't warrant changelog entry |
| `meta:has-pr` | ![E1E4E8](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | Issue has an open linked PR | Applied automatically when PR created |
| `meta:no-issue-activity` | ![E1E4E8](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | No recent issue activity | Applied by automation for stale issues |
| `meta:no-pr-activity` | ![E1E4E8](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | No recent PR activity | Applied by automation for stale PRs |
| `meta:stale` | ![9198A1](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Marked as stale for review | Manual; indicates item needs fresh review |
| `meta:dependabot-security` | ![B60205](https://via.placeholder.com/20/B60205?text=+) B60205 | Dependabot update appears security-related and eligible for guarded automation | Applied by Dependabot for security updates |

---

## Release Scope Labels (4)

Labels categorising release impact.

| Label | Color | Description | Usage |
| --- | --- | --- | --- |
| `release:patch` | ![3FB950](https://via.placeholder.com/20/3FB950?text=+) 3FB950 | Patch release | Bug fixes, security patches |
| `release:minor` | ![58A6FF](https://via.placeholder.com/20/58A6FF?text=+) 58A6FF | Minor release | New features, backwards-compatible |
| `release:major` | ![F85149](https://via.placeholder.com/20/F85149?text=+) F85149 | Major release | Breaking changes |
| `release:hotfix` | ![D29922](https://via.placeholder.com/20/D29922?text=+) D29922 | Urgent hotfix outside normal cadence | Emergency/production fix |

---

## Area Labels (25)

Labels identifying component, module, or domain. Multiple allowed per issue.

| Label | Color | Description |
| --- | --- | --- |
| `area:core` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Core / shared infrastructure |
| `area:labels` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Label governance and routing |
| `area:block-editor` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block editor |
| `area:theme` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Theme & styles |
| `area:documentation` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Docs & guides |
| `area:tests` | ![D4C5F9](https://via.placeholder.com/20/D4C5F9?text=+) D4C5F9 | Test suites & harnesses |
| `area:testing` | ![D4C5F9](https://via.placeholder.com/20/D4C5F9?text=+) D4C5F9 | Testing and QA |
| `area:scripts` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Scripts & tooling |
| `area:assets` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Assets (images, fonts, static files) |
| `area:woocommerce` | ![D4C5F9](https://via.placeholder.com/20/D4C5F9?text=+) D4C5F9 | WooCommerce |
| `area:content` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Content and copy |
| `area:design-system` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Design system and tokens |
| `area:navigation` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Navigation & menus |
| `area:forms` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Forms and form flows |
| `area:plugins` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Plugin configuration / logic |
| `area:search` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Search and filtering |
| `area:seo` | ![C2E0C6](https://via.placeholder.com/20/C2E0C6?text=+) C2E0C6 | Technical SEO (meta, schema, sitemaps) |
| `area:ai` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | AI and automation systems |
| `area:analytics` | ![C2E0C6](https://via.placeholder.com/20/C2E0C6?text=+) C2E0C6 | Analytics & tracking |
| `area:infrastructure` | ![006B75](https://via.placeholder.com/20/006B75?text=+) 006B75 | Infrastructure / hosting / platform |
| `area:automation` | ![BFD4F2](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Automation workflows and agents |
| `area:performance` | ![D29922](https://via.placeholder.com/20/D29922?text=+) D29922 | Performance-focused work |
| `area:a11y` | ![DB61A2](https://via.placeholder.com/20/DB61A2?text=+) DB61A2 | Accessibility-focused work |
| `area:security` | ![9F3734](https://via.placeholder.com/20/9F3734?text=+) 9F3734 | Security-focused work |
| `area:compatibility` | ![8D4821](https://via.placeholder.com/20/8D4821?text=+) 8D4821 | Compatibility and cross-environment concerns |
| `area:release` | ![3FB950](https://via.placeholder.com/20/3FB950?text=+) 3FB950 | Release process and readiness |
| `area:maintenance` | ![9198A1](https://via.placeholder.com/20/9198A1?text=+) 9198A1 | Maintenance and routine upkeep |
| `area:i18n` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Internationalisation |
| `area:ci` | ![BFD4F2](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Build and CI pipelines |
| `area:deployment` | ![006B75](https://via.placeholder.com/20/006B75?text=+) 006B75 | Deploy/release operations |
| `area:dependencies` | ![F9D0C4](https://via.placeholder.com/20/F9D0C4?text=+) F9D0C4 | Composer/npm dependency work |
| `area:integration` | ![D93F0B](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | 3rd-party integrations / ecosystem |

---

## Component Labels (20)

Labels for component-specific work (Block Editor focus).

| Label | Color | Description |
| --- | --- | --- |
| `comp:block-editor` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block/site editor work |
| `comp:block-inserter` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Inserter UI/behaviour |
| `comp:block-variations` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block variations |
| `comp:block-supports` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block supports |
| `comp:block-locking` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block locking |
| `comp:block-bindings` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block bindings |
| `comp:block-templates` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block templates / template editor |
| `comp:block-patterns` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Patterns library/registration |
| `comp:template-parts` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Template parts (header/footer/loops) |
| `comp:block-json` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block metadata (block.json) |
| `comp:theme-json` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Tokens, presets, settings (theme.json) |
| `comp:wp-admin` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | WP Admin screens |
| `comp:settings` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Global/settings UX |
| `comp:post-settings` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Post editor settings panel |
| `comp:style-variations` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | JSON style variations |
| `comp:block-styles` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Block styles registered via JSON |
| `comp:color-palette` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Palette tokens and usage |
| `comp:typography` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Type scale and typography tokens |
| `comp:section-styles` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Section/background styles |
| `comp:spacing` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Spacing tokens and layout gaps |

---

## Language Labels (7)

Labels identifying primary programming language.

| Label | Color | Description |
| --- | --- | --- |
| `lang:php` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | PHP |
| `lang:js` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | JavaScript/TypeScript |
| `lang:css` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Stylesheets (CSS/Sass/etc.) |
| `lang:html` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Markup (HTML) |
| `lang:md` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | Markdown content/docs |
| `lang:json` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | JSON config/content |
| `lang:yaml` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | YAML config |

---

## Environment Labels (3)

Labels indicating deployment/work environment.

| Label | Color | Description |
| --- | --- | --- |
| `env:prototype` | ![E1E4E8](https://via.placeholder.com/20/E1E4E8?text=+) E1E4E8 | Prototype/sandbox |
| `env:staging` | ![BFD4F2](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Staging/UAT |
| `env:live` | ![0E8A16](https://via.placeholder.com/20/0E8A16?text=+) 0E8A16 | Live/production |

---

## Compatibility Labels (6)

Labels for cross-platform/version compatibility.

| Label | Color | Description |
| --- | --- | --- |
| `compat:wordpress` | ![D93F0B](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | WordPress core/Gutenberg compatibility |
| `compat:php` | ![D93F0B](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | PHP version compatibility |
| `compat:woocommerce` | ![D93F0B](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | WooCommerce versions |
| `compat:gutenberg` | ![D93F0B](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | Gutenberg package compatibility |
| `compat:rtl` | ![D93F0B](https://via.placeholder.com/20/D93F0B?text=+) D93F0B | RTL languages support |
| `compat:multisite` | ![F9D0C4](https://via.placeholder.com/20/F9D0C4?text=+) F9D0C4 | Multisite/network considerations |

---

## Content Type Labels (2)

Labels for WordPress post type specificity.

| Label | Color | Description |
| --- | --- | --- |
| `cpt:posts` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | WordPress Posts |
| `cpt:pages` | ![C5DEF5](https://via.placeholder.com/20/C5DEF5?text=+) C5DEF5 | WordPress Pages |

---

## AI Ops Labels (7)

Labels for AI operations and automation infrastructure.

| Label | Color | Description |
| --- | --- | --- |
| `ai-ops:instructions` | ![0052CC](https://via.placeholder.com/20/0052CC?text=+) 0052CC | AI instruction docs |
| `ai-ops:chat-modes` | ![0052CC](https://via.placeholder.com/20/0052CC?text=+) 0052CC | Prompt sets / chat modes |
| `ai-ops:agents` | ![0052CC](https://via.placeholder.com/20/0052CC?text=+) 0052CC | AI agent definitions |
| `ai-ops:prompts` | ![0052CC](https://via.placeholder.com/20/0052CC?text=+) 0052CC | Reusable prompts |
| `ai-ops:datasets` | ![BFD4F2](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Training/evaluation datasets |
| `ai-ops:evaluations` | ![BFD4F2](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Evaluation results |
| `ai-ops:tools` | ![BFD4F2](https://via.placeholder.com/20/BFD4F2?text=+) BFD4F2 | Tool/plugin manifests |

---

## Contributor Labels (3)

Labels for community and contributor guidance.

| Label | Color | Description |
| --- | --- | --- |
| `contrib:good-first-issue` | ![D4C5F9](https://via.placeholder.com/20/D4C5F9?text=+) D4C5F9 | Good for new contributors |
| `contrib:help-wanted` | ![C2E0C6](https://via.placeholder.com/20/C2E0C6?text=+) C2E0C6 | Help wanted |
| `contrib:discussion` | ![C2E0C6](https://via.placeholder.com/20/C2E0C6?text=+) C2E0C6 | Contributor/community discussion |

---

## Discussion Labels (7)

Labels for GitHub Discussions categorisation (not for issues/PRs).

| Label | Color | Description |
| --- | --- | --- |
| `discussion:announcement` | ![FBCA04](https://via.placeholder.com/20/FBCA04?text=+) FBCA04 | Official announcements |
| `discussion:showcase` | ![0E8A16](https://via.placeholder.com/20/0E8A16?text=+) 0E8A16 | Show & Tell |
| `discussion:community` | ![6f42c1](https://via.placeholder.com/20/6f42c1?text=+) 6f42c1 | Community/general |
| `discussion:feedback` | ![1d76db](https://via.placeholder.com/20/1d76db?text=+) 1d76db | Feedback/suggestions |
| `discussion:support` | ![d73a4a](https://via.placeholder.com/20/d73a4a?text=+) d73a4a | Support/troubleshooting |
| `discussion:sponsorship` | ![f9d0c4](https://via.placeholder.com/20/f9d0c4?text=+) f9d0c4 | Sponsorship/funding |
| `discussion:partnership` | ![bfd4f2](https://via.placeholder.com/20/bfd4f2?text=+) bfd4f2 | Partnership/collaboration |

---

## Summary Statistics

**Total Labels**: 150+

| Family | Count |
| --- | --- |
| Status | 20 |
| Priority | 5 |
| Type | 27 |
| Meta/Housekeeping | 8 |
| Release Scope | 4 |
| Area | 31 |
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
- [`.github/labels.yml`](./.github/labels.yml) — Canonical label definitions
