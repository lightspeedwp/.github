# Skill Scope Impact Remediation Plan

Use this plan to reduce the impact of WooCommerce- and tour-operator-specific scope inside the attached `gravity-forms-*` and `yoast-*` skills when the current agent is intended to stay a **WordPress-focused configuration agent**.

## Purpose

This is a prioritized remediation plan based on the current impact audit.

It is designed to help you:

- reduce the highest domain-drift risk first
- decide which skills need cleanup immediately versus later
- align the attached skill packages with the current agent scope without broad unnecessary rewrites

## Current conclusion

The agent’s top-level routing is mostly sound, but the attached skill packages still contain mixed-domain content.

The main risk is not that the agent always picks the wrong skill.
The main risk is that the **right skill may still carry the wrong business-domain assumptions once it activates**.

## Impact priority

### Priority 1 — Gravity Forms skills

These present the highest near-term risk because they still explicitly include:

- WooCommerce enquiry flows
- tour operator enquiry flows
- travel / itinerary / booking-style examples
- WooCommerce / tour-operator routing references
- related profiles, references, tests, and templates

#### 1A. `gravity-forms-configuration`

**Impact:** Medium to High

**Why it is highest priority:**

- It is used for planning, implementation, troubleshooting, and validation.
- It can easily bias form recommendations toward WooCommerce or travel-style flows.
- It is most likely to affect live planning outputs, field design, routing, and handoff notes.

**Immediate remediation goal:**

- keep the WordPress/Gravity Forms core
- remove or isolate WooCommerce and tour-operator assumptions
- keep generic enquiry, quote, onboarding, newsletter, lead-capture, and validation flows

**Recommended action:**

- full package audit and cleanup first
- split or remove WooCommerce-specific and tour-operator-specific profiles/references/templates/tests

#### 1B. `gravity-forms-auditor`

**Impact:** Medium to High

**Why it is also urgent:**

- It explicitly supports WooCommerce enquiry audits and tour-operator enquiry audits.
- Audit language can easily shape findings, scorecards, and handoff wording even when the site is not in those domains.

**Immediate remediation goal:**

- keep Gravity Forms health-check and read-only audit capability
- remove or isolate WooCommerce-specific and tour-operator-specific audit paths unless intentionally retained in a separate skill

**Recommended action:**

- audit examples, profiles, references, schemas, and tests
- narrow audit scope to WordPress-focused Gravity Forms work for this agent

---

### Priority 2 — Yoast skills

These are lower risk than Gravity Forms for normal WordPress use, but they still contain enough WooCommerce scope to distort outputs in some cases.

#### 2A. `yoast-configuration`

**Impact:** Medium

**Why it matters:**

- It is structurally built as a WordPress + WooCommerce skill.
- It contains WooCommerce references throughout routing, references, fixtures, schemas, tests, and templates.
- It can over-assume ecommerce relevance in planning and remediation outputs.

**Immediate remediation goal:**

- rewrite the skill identity and routing to WordPress-only
- split or remove WooCommerce-only assets
- preserve Yoast planning, metadata, schema, archive, multilingual, migration, and launch-readiness work that fits WordPress broadly

**Recommended action:**

- use the existing Yoast audit pack first:
  - `prompts/yoast-configuration-audit/yoast-configuration-wordpress-keep-rewrite-split-manifest.md`
  - `prompts/yoast-configuration-audit/yoast-configuration-wordpress-cleanup-checklist.md`
  - `prompts/yoast-configuration-audit/yoast-configuration-wordpress-concrete-edit-plan.md`

#### 2B. `yoast-auditor`

**Impact:** Low to Medium

**Why it is still a concern:**

- It appears to behave reasonably for general Yoast audits.
- But it still contains WooCommerce-oriented audit scope and can bias the audit language when ecommerce-like patterns appear.

**Immediate remediation goal:**

- preserve Yoast audit quality for normal WordPress audits
- remove or isolate WooCommerce-specific audit expectations unless intentionally retained elsewhere

**Recommended action:**

- audit the package after `yoast-configuration`
- prioritise SKILL identity, routing notes, examples, references, and tests

---

## Recommended remediation order

Follow this order for the best impact reduction:

1. **`gravity-forms-configuration`**
2. **`gravity-forms-auditor`**
3. **`yoast-configuration`**
4. **`yoast-auditor`**

## Why this order is best

- Gravity Forms currently carries both WooCommerce and tour-operator drift, and it can affect planning, implementation, and audit work.
- Yoast drift is more concentrated around WooCommerce, and normal WordPress Yoast reviews are less likely to be badly distorted.
- Cleaning Gravity Forms first reduces the most immediate risk to day-to-day agent outputs.

---

## Remediation approach by skill

For each skill, apply this sequence:

### Step 1 — Reframe the skill identity

- rewrite the skill description and top-level routing language
- remove unsupported business-domain assumptions from the skill’s stated role

### Step 2 — Identify domain-specific assets

- examples
- profiles
- references
- intake files
- templates
- fixtures
- schemas
- tests
- scripts with domain-specific validation expectations

### Step 3 — Decide per asset

- **Keep** if it is WordPress-relevant and broadly reusable
- **Rewrite** if it is useful but carries domain-specific assumptions
- **Split** if it is structurally WooCommerce- or tour-operator-specific and worth preserving for a future companion skill
- **Remove** if it is narrowly domain-specific and not worth keeping

### Step 4 — Update validation and maintenance docs

- make sure the skill package’s own docs, scripts, tests, and references no longer assume the removed scope
- make sure the agent-level maintenance docs still describe the attached skills accurately

---

## Immediate first pass recommendation

If you want the fastest risk reduction without deciding every package boundary up front:

### First pass

1. Narrow the `SKILL.md` identity and routing language in all four skills.
2. Remove the most explicit WooCommerce/tour-operator examples and profiles from the Gravity Forms skills first.
3. Use the existing Yoast cleanup pack to narrow `yoast-configuration`.
4. Re-test preview behavior for:
   - a generic Gravity Forms contact/enquiry plan
   - a generic Gravity Forms audit
   - a standard Yoast audit
   - a standard Yoast configuration request

### Second pass

- split any domain-specific assets you want to preserve into future companion skills
- rewrite mixed-scope schemas, fixtures, and tests

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
