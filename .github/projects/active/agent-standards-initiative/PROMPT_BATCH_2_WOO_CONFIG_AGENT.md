# PHASE 2 BATCH PROMPT: WooCommerce Configuration Agent

> **Self-contained brief for a fresh Claude Code chat.** This agent is the Phase
> 2 **reference implementation** — most of the work is already done. Read the
> playbook, then finish and merge.

| | |
| --- | --- |
| **Agent** | WooCommerce Config Agent |
| **Slug** | `woo-config` (folder `agents/woo-config-agent/`) |
| **Branch** | `feat/agent-standards-woo-config` |
| **PR** | [#1141](https://github.com/lightspeedwp/.github/pull/1141) |
| **Related issue** | [#1101](https://github.com/lightspeedwp/.github/issues/1101) — *feat(agents): rewrite WooCommerce Config Agent for multi-provider support* |
| **Base** | `develop` |
| **Domain / Focus** | ecommerce / woocommerce |

## Required reading (in order)

1. **`PHASE_2_EXECUTION_PLAYBOOK.md`** — real-content rules, the six pre-existing
   `develop` CI blockers + fixes, commit/push mechanics, PR-body template, merge
   protocol, definition of done.
2. `PROMPT_2_GENERIC_AGENT_REWRITE.md` — detailed per-phase templates.

## Current state (as of hand-off) — MOST ADVANCED OF THE FOUR

This agent already has **real content** (~1,046 lines across the nine files) and
is the reference other Phase 2 agents copy. Already done on the branch:

- ✅ Real `AGENT.md`, `shared/core-prompt.md` (7-phase methodology), `claude/`
  (8 tools with input schemas), `copilot/` (7 skills), `openai/` (8 functions),
  `README.md`.
- ✅ `package-lock.json` synced (playbook §2.1).
- ✅ `docs/ISSUE_FIELDS.md` "50" anchor + freshness/version bump (§2.2–2.3).
- ✅ `CHANGELOG.md` `### Added` entry for PR #1141 (§2.4).
- ✅ PR body has the three required sections; `validate-pr-template` green (§2.6).
- ✅ **16 of 20 checks passing.**

**Remaining before merge:**

- ⏳ `validate:footers` — the pre-existing repo-wide 315-violation blocker
  (playbook §2.5). Handle carefully (no blind `--fix`; diff every touched file).
- ⏳ Final CI green → squash-merge → delete branch → close issue #1101.

If you extend the content further, keep it above the playbook §0 floors and
re-run the verification.

## Parameter map

| Parameter | Value |
| --- | --- |
| `{AGENT_NAME}` | WooCommerce Config Agent |
| `{agent-slug}` | woo-config |
| `{DOMAIN}` | ecommerce |
| `{FOCUS}` | woocommerce |
| `{Agent Purpose}` | Configure and optimise WooCommerce stores: store analysis, setup, product/catalogue, payments, performance, inventory, customers, analytics |
| `{Plugin}` | `lightspeed-configuration-woocommerce` |

## Capabilities (implemented)

`store-analysis`, `setup-optimization`, `product-configuration`,
`payment-integration`, `performance-optimization`, `inventory-management`,
`customer-management`, `analytics-setup`.

Tools/skills/functions (8/7/8): `store_analyzer`, `setup_optimizer`,
`product_configurator`, `payment_integrator`, `performance_optimizer`,
`inventory_manager`, `customer_manager`, `analytics_setup`.

## Domain notes

Store setup (currency, price/tax display, pages, block vs shortcode checkout);
payment gateways with **tokenisation only** (no card data in the DB) and
**PCI DSS scope assessment** (requires evaluation of payment-page origin, integration, data flows, and applicable SAQ criteria with the gateway/provider and a qualified assessor; SAQ scope varies by architecture and integration method); shipping zones/methods/classes; tax rules;
product types (simple/variable/grouped/subscription) and global attributes;
performance (object cache, page cache with cart/checkout exclusions, cart
fragments, images); inventory policy; GDPR customer data (export/erase);
WooCommerce Analytics + KPIs (conversion, AOV, cart abandonment, LTV).

## Success criteria (verified, not claimed)

- [ ] Nine files meet the playbook §0 line floors (already true; re-verify if edited).
- [ ] `claude/tools.json` + `openai/tools.json` parse; `skills.yaml` parses.
- [ ] `npm run validate:agents` / `validate:json:all` / `validate:frontmatter` pass.
- [ ] `npm ci --dry-run` clean; §2 blockers resolved.
- [ ] `validate:footers` handled per playbook §2.5 (verify no file bodies lost).
- [ ] PR body has the three required sections; `validate-pr-template` green.
- [ ] CI green; squash-merged to `develop`; branch deleted; issue #1101 closed.

**Begin:** read the playbook §2.5, resolve footers safely, confirm CI, and merge.
