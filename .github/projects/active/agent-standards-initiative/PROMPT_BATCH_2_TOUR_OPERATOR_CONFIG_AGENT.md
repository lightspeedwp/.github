# PHASE 2 BATCH PROMPT: Tour Operator Configuration Agent

> **Self-contained brief for a fresh Claude Code chat.** Everything needed to
> take this agent from its current state to a merged PR is here or in the two
> referenced documents. Read the playbook first.

| | |
| --- | --- |
| **Agent** | Tour Operator Config Agent |
| **Slug** | `tour-operator-config` (folder `agents/tour-operator-config-agent/`) |
| **Branch** | `feat/agent-standards-tour-operator-config` |
| **PR** | [#1140](https://github.com/lightspeedwp/.github/pull/1140) |
| **Related issue** | [#1098](https://github.com/lightspeedwp/.github/issues/1098) — *feat(agents): rewrite Tour Operator Config Agent for multi-provider support* |
| **Base** | `develop` |
| **Domain / Focus** | configuration / tour-operator |

## Required reading (in order)

1. **`PHASE_2_EXECUTION_PLAYBOOK.md`** — real-content rules, the six pre-existing
   `develop` CI blockers + fixes, commit/push mechanics, PR-body template, merge
   protocol, and definition of done. **Do not skip.**
2. `agents/woo-config-agent/` — the Phase 2 **reference implementation**. Copy
   its shape and depth.
3. `PROMPT_2_GENERIC_AGENT_REWRITE.md` — detailed per-phase templates.

## Current state (as of hand-off)

- Branch exists and is pushed; PR #1140 is open against `develop`.
- The PR body has already been updated to satisfy `validate-pr-template`, and
  the branch was updated against `develop` server-side.
- ⚠️ **The agent files are stubs** (5–20 lines each) — they were reported as
  complete in a prior run but were never actually written. Your job is to
  replace them with real content per the playbook's §0 line floors.
- The pre-existing `develop` CI blockers (playbook §2) still apply and must be
  fixed on this branch.

## Parameter map

| Parameter | Value |
| --- | --- |
| `{AGENT_NAME}` | Tour Operator Config Agent |
| `{agent-slug}` | tour-operator-config |
| `{DOMAIN}` | configuration |
| `{FOCUS}` | tour-operator |
| `{Agent Purpose}` | Configure and manage tour-operator WordPress/WooCommerce sites: bookings & availability, tour products, payments, notifications, SEO/performance, and deployment |
| `{Plugin}` | `lightspeed-configuration-tour-operator` |

## AGENT.md frontmatter (starting point — expand the body to the §0 floor)

```yaml
name: tour-operator-config
title: Tour Operator Config Agent
description: >-
  Configure and manage tour-operator WordPress and WooCommerce sites —
  bookings and availability, tour products, payment and notification
  integrations, SEO/performance, and deployment configuration.
version: '2.0.0'
category: configuration
providers: [claude, copilot, openai]
capabilities:
  - site-analysis
  - architecture-recommendations
  - setup-validation
  - optimization-planning
  - booking-system-configuration
security:
  rules:
    - No credentials in configuration files or output
    - Config backup required before changes; staging-first
    - Config changes logged for audit
```

## Real-content file manifest (verify on disk — see playbook §0)

Write genuine tour-operator domain content, not padding:

- `AGENT.md` (120+) — overview, responsibilities, capabilities/limitations, 2–3
  usage examples, provider matrix, security guardrails.
- `shared/core-prompt.md` (180+) — methodology across **site analysis →
  architecture recommendation → setup validation → optimisation → booking-system
  configuration**, with constraints and inputs/outputs.
- `claude/agent.md` (70+) + `claude/tools.json` (150+) — 5 tools with full input
  schemas: `site_analyzer`, `architecture_recommender`, `setup_validator`,
  `optimization_planner`, `booking_system_configurator`.
- `copilot/agent.md` (60+) + `copilot/skills.yaml` (120+) — matching skills with
  GitHub Issues/Projects/Actions integration.
- `openai/agent.md` (60+) + `openai/tools.json` (150+) — matching functions.
- `README.md` (60+) — overview + provider matrix.
- `plugins/lightspeed-configuration-tour-operator/` — `README.md`, `INSTALL.md`,
  `copilot-plugin.json`, and provider manifests.

## Domain notes

Tour-operator specifics to reflect in the content: multi-location tour
management; availability/booking configuration and booking-system integration;
guide assignment and scheduling; tour products (variable/bookable) in
WooCommerce; deposit/balance and cancellation policies; customer communication
templates; seasonal pricing and discounts; SEO for tour/destination pages.

## Success criteria (verified, not claimed)

- [ ] Nine files meet the playbook §0 line floors; verification output pasted in
      the PR.
- [ ] `claude/tools.json` + `openai/tools.json` parse; `skills.yaml` parses.
- [ ] `npm run validate:agents` / `validate:json:all` / `validate:frontmatter`
      pass locally.
- [ ] All six playbook §2 CI blockers resolved; `npm ci --dry-run` clean.
- [ ] Plugin package directory (`plugins/lightspeed-configuration-tour-operator/`)
      exists with README.md (60+ lines), INSTALL.md (80+ lines), manifests; all JSON/YAML parses cleanly.
- [ ] `CHANGELOG.md` has an `### Added` entry referencing PR #1140 / issue #1098.
- [ ] PR body has the three required sections; `validate-pr-template` green.
- [ ] CI green (or only the acknowledged footers item, handled per playbook §2.5).
- [ ] Squash-merged to `develop`, branch deleted, issue #1098 closed.

**Begin:** read the playbook, read `agents/woo-config-agent/`, then write real
content and verify it on disk before committing.
