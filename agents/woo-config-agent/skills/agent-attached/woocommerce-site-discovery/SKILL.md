---
name: woocommerce-site-discovery
description: Use when the user asks to inspect a WordPress or WooCommerce site, understand current store state, gather environment signals before planning or auditing, verify whether WooCommerce is present and active, or produce a concise site-discovery summary grounded in {{label:KWV-Dev-Site,id:asdk_app_6a44c27141f08191b52eb3a81ab1c3f0,type:app}} and the agent's attached reference files.
---

# WooCommerce Site Discovery

## Purpose

Use this skill before giving substantial WooCommerce planning, audit, remediation, or launch-readiness advice for a real site.

Your job is to inspect the connected site first, confirm what can actually be evidenced, and produce a compact discovery summary that the main response can build on.

## When to Use

Use this skill when the request is about any of the following on a real site or environment:

- auditing the store
- reviewing readiness, setup quality, or configuration gaps
- checking WooCommerce status
- understanding catalogue, checkout, payment, shipping, tax, or email setup
- planning remediation or next steps based on current site state
- validating whether WooCommerce is installed, active, broken, partial, or absent

Do not use this skill for purely hypothetical advice, generic WooCommerce education, or tasks that do not depend on inspecting a real environment.

## Required Grounding

When available, start discovery with {{label:KWV-Dev-Site,id:asdk_app_6a44c27141f08191b52eb3a81ab1c3f0,type:app}}.

Prefer read-first inspection. Do not make changes while using this skill.

Before making store-specific claims, try to confirm:

1. the environment or site being inspected
2. whether WooCommerce is present
3. whether WooCommerce appears active and inspectable
4. whether store pages, products, orders, or settings are reachable through the connected tools
5. which signals come from live inspection versus stored remnants or reference material

If WooCommerce cannot be confirmed, say so clearly and keep the output in discovery mode rather than drifting into a full audit.

## Discovery Workflow

1. Identify the concrete question the user is trying to answer.
2. Inspect the connected site with {{label:KWV-Dev-Site,id:asdk_app_6a44c27141f08191b52eb3a81ab1c3f0,type:app}} before producing substantive WooCommerce guidance.
3. Gather the smallest set of evidence needed to establish current store state. Prefer broad environment checks before deep per-area checks.
4. Confirm whether WooCommerce is:
   - confirmed active and inspectable
   - present but degraded or partial
   - not confirmed from current evidence
5. Check for high-value site signals that materially affect later advice, such as:
   - active theme and relevant plugin state
   - existence of core store pages
   - evidence of products, orders, customers, shipping, payment, or tax configuration
   - obvious legacy remnants, broken setup, or migration artefacts
6. Separate confirmed live signals from unverified assumptions.
7. Summarise only what the evidence supports.
8. End with the next best route: advisory planning, reduced audit, full audit, or targeted follow-up inspection.

## Evidence Priorities

Prefer evidence in this order:

1. direct connected-site inspection from {{label:KWV-Dev-Site,id:asdk_app_6a44c27141f08191b52eb3a81ab1c3f0,type:app}}
2. attached reference files that define the expected WooCommerce standard:
   - {{label:woocommerce-store-standard.md,id:6a43bf045878819189265bbfe9b9e2cb,type:file}}
   - {{label:master-qa-checklist.md,id:6a43bf0456208191a148cb1c19a722fc,type:file}}
   - {{label:pre-launch-qa-checklist.md,id:6a43bf0458fc81918ccb998fa22d5560,type:file}}
3. remembered project defaults or user-provided preferences

Reference files define target-state expectations. They are not proof of the current site's live state.

## Output Contract

Return a concise discovery summary with these sections, in this order:

### Environment Reviewed

State the site or environment inspected and whether discovery used {{label:KWV-Dev-Site,id:asdk_app_6a44c27141f08191b52eb3a81ab1c3f0,type:app}}.

### WooCommerce Verification

State one of:

- WooCommerce confirmed active
- WooCommerce present but degraded or partial
- WooCommerce not confirmed from current evidence

Add one short sentence explaining why.

### Current Site Signals

List the strongest confirmed signals only. Keep this tight and practical.

Good signal types include:

- plugin or theme state
- core store pages present or missing
- products or product structures visible
- payment, shipping, or tax setup signals
- customer/account or checkout-related signals
- obvious broken or legacy state

### Material Limitations

State what could not be verified directly.

### Recommended Next Step

Choose exactly one:

- continue into advisory planning
- run a full WooCommerce audit
- stay in reduced audit mode
- inspect a specific area next

## Style Rules

- Use UK English.
- Keep the summary evidence-first and delivery-ready.
- Do not open with a generic audit framework or best-practice lecture.
- Do not overstate payment, shipping, tax, email, SEO, accessibility, or checkout behaviour unless directly evidenced.
- Use phrases like `could not be confirmed from current evidence` when certainty is missing.
- If the environment appears broken, dormant, migrated, or partially removed, say so carefully and tie it to observed signals.

## Example Trigger Prompts

- Inspect this WooCommerce site first and tell me what state the store is in.
- Before auditing, discover what is actually configured on the connected store.
- Check whether WooCommerce is active here and summarise the current site signals.

## Example Output

### Environment Reviewed

Connected development site reviewed via the WordPress site connection.

### WooCommerce Verification

WooCommerce confirmed active. Core WooCommerce data and store-related signals were directly inspectable.

### Current Site Signals

- WooCommerce appears active and reachable through connected store actions.
- Store-related pages are present, suggesting the site is configured beyond a basic WordPress install.
- Product and store data are inspectable, so a fuller WooCommerce audit can proceed from live evidence.

### Material Limitations

- End-to-end checkout, payment, shipping, and transactional email behaviour were not directly validated in this discovery pass.

### Recommended Next Step

Run a full WooCommerce audit.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
