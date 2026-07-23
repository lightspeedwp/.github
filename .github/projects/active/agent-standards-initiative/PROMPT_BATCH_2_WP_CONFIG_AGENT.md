# PHASE 2 BATCH PROMPT: WordPress Configuration Agent

> **Self-contained brief for a fresh Claude Code chat.** Everything needed to
> take this agent from its current state to a merged PR is here or in the two
> referenced documents. Read the playbook first.

| | |
| --- | --- |
| **Agent** | WordPress Config Agent |
| **Slug** | `wp-config` (folder `agents/wp-config-agent/`) |
| **Branch** | `feat/agent-standards-wp-config` |
| **PR** | [#1142](https://github.com/lightspeedwp/.github/pull/1142) |
| **Related issue** | [#1102](https://github.com/lightspeedwp/.github/issues/1102) — *feat(agents): rewrite WordPress Config Agent for multi-provider support* |
| **Base** | `develop` |
| **Domain / Focus** | wordpress / configuration |

## Required reading (in order)

1. **`PHASE_2_EXECUTION_PLAYBOOK.md`** — real-content rules, the six pre-existing
   `develop` CI blockers + fixes, commit/push mechanics, PR-body template, merge
   protocol, definition of done. **Do not skip.**
2. `agents/woo-config-agent/` — the Phase 2 **reference implementation**. Copy
   its shape and depth.
3. `PROMPT_2_GENERIC_AGENT_REWRITE.md` — detailed per-phase templates.

## Current state (as of hand-off)

- Branch exists and is pushed; PR #1142 is open against `develop`.
- ⚠️ **The agent files are stubs** (`AGENT.md` ~60 lines; provider files 3–13
  lines) — reported complete in a prior run but never actually written. Replace
  them with real content per the playbook's §0 line floors.
- The PR body still needs the three required sections (playbook §4/§2.6).
- All six pre-existing `develop` CI blockers (playbook §2) apply and must be
  fixed on this branch. `docs/ISSUE_FIELDS.md`, `CHANGELOG.md`, and
  `package-lock.json` fixes made on the woo-config branch are **not** on this
  branch yet — redo them here (or cherry-pick).

## Parameter map

| Parameter | Value |
| --- | --- |
| `{AGENT_NAME}` | WordPress Config Agent |
| `{agent-slug}` | wp-config |
| `{DOMAIN}` | wordpress |
| `{FOCUS}` | configuration |
| `{Agent Purpose}` | Configure and manage WordPress sites: site analysis, setup recommendations, performance, security hardening, plugin/theme management, backup and maintenance planning |
| `{Plugin}` | `lightspeed-configuration-wordpress` |

## AGENT.md frontmatter (starting point — expand the body to the §0 floor)

```yaml
name: wp-config
title: WordPress Config Agent
description: >-
  Configure and manage WordPress sites — analysis, setup recommendations,
  performance optimisation, security hardening, plugin and theme management,
  backup strategy, and maintenance planning.
version: '2.0.0'
category: wordpress
providers: [claude, copilot, openai]
capabilities:
  - site-analysis
  - setup-recommendations
  - performance-optimization
  - security-hardening
  - plugin-management
  - theme-configuration
  - backup-strategy
  - maintenance-planning
security:
  rules:
    - No credentials in output or config; env vars only
    - No core file modifications (use filters/actions/WP-CLI)
    - Backup before changes; validate after; audit log
```

## Real-content file manifest (verify on disk — see playbook §0)

- `AGENT.md` (120+) — overview, responsibilities, capabilities/limitations, 2–3
  usage examples, provider matrix, security guardrails.
- `shared/core-prompt.md` (180+) — methodology across **site analysis → setup
  recommendations → performance → security hardening → plugin/theme management →
  backup & maintenance**, with constraints and inputs/outputs.
- `claude/agent.md` (70+) + `claude/tools.json` (150+) — 8 tools with full input
  schemas: `site_analyzer`, `setup_recommender`, `performance_optimizer`,
  `security_hardener`, `plugin_manager`, `theme_configurator`, `backup_planner`,
  `maintenance_planner`.
- `copilot/agent.md` (60+) + `copilot/skills.yaml` (120+) — matching skills with
  GitHub Issues/Projects/Actions integration.
- `openai/agent.md` (60+) + `openai/tools.json` (150+) — matching functions.
- `README.md` (60+) — overview + provider matrix.
- `plugins/lightspeed-configuration-wordpress/` — `README.md`, `INSTALL.md`,
  `copilot-plugin.json`, and provider manifests.

## Domain notes

WordPress specifics to reflect: core settings (general/reading/discussion/media,
permalinks); security hardening (SSL, security headers, file-edit lockdown,
login hardening/2FA, least-privilege roles); performance (object + page cache,
lazy loading, asset optimisation, CDN); plugin management (audit, updates,
conflict detection, removal of abandoned plugins); theme configuration (block
theme, `theme.json`, child-theme practice); backup strategy (scope, cadence,
off-site, tested restore); maintenance schedule (updates, health checks,
uptime); compliance (WCAG 2.2 AA, GDPR). Prefer native/WP-CLI over custom code.

## Success criteria (verified, not claimed)

- [ ] Nine files meet the playbook §0 line floors; verification output pasted in
      the PR.
- [ ] `claude/tools.json` + `openai/tools.json` parse; `skills.yaml` parses.
- [ ] `npm run validate:agents` / `validate:json:all` / `validate:frontmatter` pass.
- [ ] All six playbook §2 CI blockers resolved on this branch; `npm ci --dry-run` clean.
- [ ] Plugin package directory (`plugins/lightspeed-configuration-wordpress/`)
      exists with README.md (60+ lines), INSTALL.md (80+ lines), manifests; all JSON/YAML parses cleanly.
- [ ] `CHANGELOG.md` has an `### Added` entry referencing PR #1142 / issue #1102.
- [ ] PR body has the three required sections; `validate-pr-template` green.
- [ ] CI green (or only the acknowledged footers item, handled per playbook §2.5).
- [ ] Squash-merged to `develop`, branch deleted, issue #1102 closed.

**Begin:** read the playbook, read `agents/woo-config-agent/`, then write real
content and verify it on disk before committing.
