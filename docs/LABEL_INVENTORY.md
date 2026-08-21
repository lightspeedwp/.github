---
title: Label Inventory — Complete Reference
description: Complete inventory of all 158 canonical labels organized by semantic family, with color codes, descriptions, and usage guidance
file_type: documentation
version: v1.1.3
created_date: '2026-05-31'
last_updated: '2026-08-21'
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

**Version**: v1.1.2
**Created**: 2026-05-31
**Last Updated**: 2026-06-18
**Total Labels**: 158

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
| `status:needs-planning` | 0F448A | Awaiting planning / scoping | Issue requires analysis/breakdown before work starts |
| `status:needs-triage` | 0F448A | Needs triage | Issue needs investigation/categorisation |
| `status:ready` | 1D7232 | Groomed and ready to start | Issue is scoped, detailed, ready for work |
| `status:in-progress` | 0F448A | Work in progress | Someone is actively working |
| `status:on-hold` | 883D07 | Work on hold | Work paused; waiting for decision |
| `status:needs-design` | 0F448A | Awaiting design input | Needs design review before implementation |
| `status:needs-design-review` | 4D1A93 | Awaiting design review | Design needs review before approval |
| `status:needs-figma-update` | 0F448A | Existing Figma design needs updating | Figma files need refresh |
| `status:needs-dev` | 0F448A | Awaiting engineering implementation | Ready for engineering to begin |
| `status:needs-review` | 0F448A | Awaiting code review | PR/code needs peer review |
| `status:needs-qa` | 7E6007 | Quality assurance required | Needs QA/testing |
| `status:needs-testing` | 7E6007 | Testing needed (manual/automated) | Awaiting testing pass |
| `status:needs-audit` | 7E6007 | Needs audit or validation pass | Needs security/compliance audit |
| `status:needs-documentation` | 0F448A | Needs documentation update | Documentation/guides need updating |
| `status:in-discussion` | 0F448A | Needs alignment/decision | Awaiting discussion/decision |
| `status:needs-more-info` | 0F448A | Missing details to proceed | Awaiting more information from reporter |
| `status:blocked` | 810E18 | Blocked by dependency | Blocked by external factor/dependency |
| `status:duplicate` | 810E18 | Duplicate of another issue | Duplicate of existing issue |
| `status:wontfix` | 4E575F | Not planned to address | Won't be fixed/addressed |
| `status:done` | 1D7232 | Completed | Work complete |

---

## Priority Labels (4)

Labels signalling urgency and business impact.

| Label | Color | Description | Use When |
| --- | --- | --- | --- |
| `priority:critical` | 810E18 | Production/launch-blocking | Breaking issue; production down; release blocker |
| `priority:important` | 883D07 | Must-do high priority | High-impact feature; significant bug |
| `priority:normal` | 0F448A | Default priority | Standard/planned work (default if not specified) |
| `priority:minor` | 1D7232 | Low priority / nice to have | Backlog; can defer indefinitely |

---

## Type Labels (32)

Labels classifying the type of work. Assign exactly one per issue.

| Label | Color | Description | Project Field | Notes |
| --- | --- | --- | --- | --- |
| `type:task` | 0F448A | Task or to-do | Task | Default for untyped work |
| `type:bug` | 810E18 | Bug or defect | Bug | Broken/incorrect behaviour |
| `type:feature` | 1D7232 | Feature or enhancement | Feature | New capability |
| `type:enhancement` | 1D7232 | Enhancement/alias for improve | Feature | Alias for improve; enhancement to existing feature |
| `type:design` | 4D1A93 | Design work | Design | Design artefacts/decisions |
| `type:ui` | 4D1A93 | UI implementation | Design | UI consistency, implementation |
| `type:epic` | 4D1A93 | Large multi-scope initiative | Task | Parent issue for stories/tasks |
| `type:story` | 0F448A | User story | Task | User-centred vertical slice |
| `type:improve` | 4E575F | Improvement to existing behaviour/UX | Feature | Enhance existing feature |
| `type:refactor` | 4E575F | Refactor or internal change | Chore | Internal restructure; no UX change |
| `type:build` | 0F448A | Build & CI | Task | Build pipelines, tooling |
| `type:ci` | 0F448A | CI/CD pipelines | Automation | CI/CD infrastructure |
| `type:automation` | 0F448A | Automation | Automation | Bots, actions, scripts |
| `type:test` | 7E6007 | Testing/coverage | Automation | Testing and QA work; branch mapping rule: head-branch ["^test/.*", "^qa/.*"] |
| `type:performance` | 7E6007 | Performance improvement | Task | Speed, efficiency optimisation |
| `type:a11y` | 4D1A93 | Accessibility | Design | Accessibility/WCAG work |
| `type:security` | 810E18 | Security issue | Bug | Security concern/hardening |
| `type:compatibility` | 883D07 | Compatibility | Task | Browser/device/plugin compatibility |
| `type:integration` | 883D07 | Integration | Task | External system integration |
| `type:dependency` | 883D07 | Dependency update | Integration | Dependency updates, version management |
| `type:release` | 1D7232 | Release | Release | Release planning/management |
| `type:maintenance` | 4E575F | Maintenance | Task | Routine maintenance, updates |
| `type:documentation` | 4E575F | Documentation | Documentation | Docs, guides, specifications |
| `type:research` | 4E575F | Research / investigation | Task | Investigation, POC, spike |
| `type:investigation` | 4E575F | Investigation | Research | Issue diagnosis, root cause analysis |
| `type:chore` | 4E575F | Chore / small hygiene change | Task | Hygiene change, typos, config |
| `type:audit` | 4E575F | Audit | Task | Security/code/process audit |
| `type:review` | 0F448A | Code or design review task | Task | Peer review, validation |
| `type:ai-ops` | 0F448A | AI Ops | Automation | AI, agents, datasets |
| `type:content-modelling` | 4D1A93 | Content Modelling | Design | Content structure, CPTs, taxonomy |
| `type:question` | 4D1A93 | Question or request for clarification | Task | Clarification request |
| `type:support` | 1D7232 | Support request | Task | Support/troubleshooting |

---

## Meta/Housekeeping Labels (8)

Labels tracking automation markers, process state, and housekeeping.

| Label | Color | Description | Usage |
| --- | --- | --- | --- |
| `meta:needs-changelog` | 4E575F | Requires a changelog entry before merge | Applied by workflow; indicates CHANGELOG.md needs update |
| `meta:no-changelog` | 4E575F | No changelog needed | Applied when change doesn't warrant changelog entry |
| `meta:has-pr` | 4E575F | Issue has an open linked PR | Applied automatically when PR created |
| `meta:no-issue-activity` | 4E575F | No recent issue activity | Applied by automation for stale issues |
| `meta:no-pr-activity` | 4E575F | No recent PR activity | Applied by automation for stale PRs |
| `meta:stale` | 4E575F | Marked as stale for review | Manual; indicates item needs fresh review |
| `meta:dependabot-security` | 810E18 | Dependabot update appears security-related and eligible for guarded automation | Applied by Dependabot for security updates |

---

## Release Scope Labels (4)

Labels categorising release impact.

| Label | Color | Description | Usage |
| --- | --- | --- | --- |
| `release:patch` | 1D7232 | Patch release | Bug fixes, security patches |
| `release:minor` | 0F448A | Minor release | New features, backwards-compatible |
| `release:major` | 810E18 | Major release | Breaking changes |
| `release:hotfix` | 7E6007 | Urgent hotfix outside normal cadence | Emergency/production fix |

---

## Area Labels (33)

Labels identifying component, module, or domain. Multiple allowed per issue.

| Label | Color | Description |
| --- | --- | --- |
| `area:core` | 0F448A | Core / shared infrastructure |
| `area:labels` | 0F448A | Label governance and routing |
| `area:block-editor` | 0F448A | Block editor |
| `area:theme` | 0F448A | Theme & styles |
| `area:documentation` | 0F448A | Docs & guides |
| `area:tests` | 4D1A93 | Test suites & harnesses |
| `area:testing` | 4D1A93 | Testing and QA |
| `area:quality` | 4D1A93 | Quality validation and QA controls |
| `area:scripts` | 0F448A | Scripts & tooling |
| `area:assets` | 0F448A | Assets (images, fonts, static files) |
| `area:woocommerce` | 4D1A93 | WooCommerce |
| `area:content` | 0F448A | Content and copy |
| `area:design-system` | 0F448A | Design system and tokens |
| `area:navigation` | 0F448A | Navigation & menus |
| `area:forms` | 0F448A | Forms and form flows |
| `area:plugins` | 0F448A | Plugin configuration / logic |
| `area:search` | 0F448A | Search and filtering |
| `area:seo` | 1D7232 | Technical SEO (meta, schema, sitemaps) |
| `area:ai` | 0F448A | AI and automation systems |
| `area:analytics` | 1D7232 | Analytics & tracking |
| `area:infrastructure` | 147169 | Infrastructure / hosting / platform |
| `area:automation` | 0F448A | Automation workflows and agents |
| `area:performance` | 7E6007 | Performance-focused work |
| `area:a11y` | 4D1A93 | Accessibility-focused work |
| `area:security` | 810E18 | Security-focused work |
| `area:compatibility` | 883D07 | Compatibility and cross-environment concerns |
| `area:release` | 1D7232 | Release process and readiness |
| `area:maintenance` | 4E575F | Maintenance and routine upkeep |
| `area:i18n` | 0F448A | Internationalisation |
| `area:ci` | 0F448A | Build and CI pipelines |
| `area:deployment` | 147169 | Deploy/release operations |
| `area:dependencies` | 883D07 | Composer/npm dependency work |
| `area:integration` | 883D07 | 3rd-party integrations / ecosystem |

---

## Component Labels (20)

Labels for component-specific work (Block Editor focus).

| Label | Color | Description |
| --- | --- | --- |
| `comp:block-editor` | 0F448A | Block/site editor work |
| `comp:block-inserter` | 0F448A | Inserter UI/behaviour |
| `comp:block-variations` | 0F448A | Block variations |
| `comp:block-supports` | 0F448A | Block supports |
| `comp:block-locking` | 0F448A | Block locking |
| `comp:block-bindings` | 0F448A | Block bindings |
| `comp:block-templates` | 0F448A | Block templates / template editor |
| `comp:block-patterns` | 0F448A | Patterns library/registration |
| `comp:template-parts` | 0F448A | Template parts (header/footer/loops) |
| `comp:block-json` | 0F448A | Block metadata (block.json) |
| `comp:theme-json` | 0F448A | Tokens, presets, settings (theme.json) |
| `comp:wp-admin` | 0F448A | WP Admin screens |
| `comp:settings` | 0F448A | Global/settings UX |
| `comp:post-settings` | 0F448A | Post editor settings panel |
| `comp:style-variations` | 0F448A | JSON style variations |
| `comp:block-styles` | 0F448A | Block styles registered via JSON |
| `comp:color-palette` | 0F448A | Palette tokens and usage |
| `comp:typography` | 0F448A | Type scale and typography tokens |
| `comp:section-styles` | 0F448A | Section/background styles |
| `comp:spacing` | 0F448A | Spacing tokens and layout gaps |

---

## Language Labels (7)

Labels identifying primary programming language.

| Label | Color | Description |
| --- | --- | --- |
| `lang:php` | 0F448A | PHP |
| `lang:js` | 0F448A | JavaScript/TypeScript |
| `lang:css` | 0F448A | Stylesheets (CSS/Sass/etc.) |
| `lang:html` | 0F448A | Markup (HTML) |
| `lang:md` | 0F448A | Markdown content/docs |
| `lang:json` | 0F448A | JSON config/content |
| `lang:yaml` | 0F448A | YAML config |

---

## Environment Labels (3)

Labels indicating deployment/work environment.

| Label | Color | Description |
| --- | --- | --- |
| `env:prototype` | 4E575F | Prototype/sandbox |
| `env:staging` | 0F448A | Staging/UAT |
| `env:live` | 1D7232 | Live/production |

---

## Compatibility Labels (6)

Labels for cross-platform/version compatibility.

| Label | Color | Description |
| --- | --- | --- |
| `compat:wordpress` | 883D07 | WordPress core/Gutenberg compatibility |
| `compat:php` | 883D07 | PHP version compatibility |
| `compat:woocommerce` | 883D07 | WooCommerce versions |
| `compat:gutenberg` | 883D07 | Gutenberg package compatibility |
| `compat:rtl` | 883D07 | RTL languages support |
| `compat:multisite` | 883D07 | Multisite/network considerations |

---

## Content Type Labels (2)

Labels for WordPress post type specificity.

| Label | Color | Description |
| --- | --- | --- |
| `cpt:posts` | 0F448A | WordPress Posts |
| `cpt:pages` | 0F448A | WordPress Pages |

---

## AI Ops Labels (7)

Labels for AI operations and automation infrastructure.

| Label | Color | Description |
| --- | --- | --- |
| `ai-ops:instructions` | 0F448A | AI instruction docs |
| `ai-ops:chat-modes` | 0F448A | Prompt sets / chat modes |
| `ai-ops:agents` | 0F448A | AI agent definitions |
| `ai-ops:prompts` | 0F448A | Reusable prompts |
| `ai-ops:datasets` | 0F448A | Training/evaluation datasets |
| `ai-ops:evaluations` | 0F448A | Evaluation results |
| `ai-ops:tools` | 0F448A | Tool/plugin manifests |

---

## Contributor Labels (3)

Labels for community and contributor guidance.

| Label | Color | Description |
| --- | --- | --- |
| `contrib:good-first-issue` | 4D1A93 | Good for new contributors |
| `contrib:help-wanted` | 1D7232 | Help wanted |
| `contrib:discussion` | 1D7232 | Contributor/community discussion |

---

## Discussion Labels (7)

Labels for GitHub Discussions categorisation (not for issues/PRs).

| Label | Color | Description |
| --- | --- | --- |
| `discussion:announcement` | 7E6007 | Official announcements |
| `discussion:showcase` | 1D7232 | Show & Tell |
| `discussion:community` | 4D1A93 | Community/general |
| `discussion:feedback` | 0F448A | Feedback/suggestions |
| `discussion:support` | 810E18 | Support/troubleshooting |
| `discussion:sponsorship` | 883D07 | Sponsorship/funding |
| `discussion:partnership` | 0F448A | Partnership/collaboration |

---

## Summary Statistics

**Total Labels**: 158

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
| **TOTAL** | **158** |

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

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
