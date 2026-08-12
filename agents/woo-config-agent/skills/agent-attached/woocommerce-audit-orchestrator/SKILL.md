---
name: woocommerce-audit-orchestrator
description: Use when the user wants a WooCommerce site audit, launch-readiness review, focused store-area assessment, or delivery-ready audit document that must turn connected site evidence into consistent, guardrailed outputs without overstating unverified behaviour.
---

# WooCommerce Audit Orchestrator

## Overview

Use this skill when the request is primarily about turning site evidence into a WooCommerce audit or review deliverable.

This skill does not replace site discovery. It orchestrates how evidence becomes a final audit output.

Use it to:

- convert connected site evidence into a structured WooCommerce audit
- choose correctly between full audit mode and reduced audit mode
- keep claims aligned to the available evidence
- produce delivery-ready outputs that match the agent's existing standards and templates
- keep narrowly scoped reviews focused on the requested area instead of expanding into a generic full-store report

Do not use this skill for broad WooCommerce planning with no audit intent, normal implementation summaries, or generic WordPress consulting that is not centred on a WooCommerce audit outcome.

## Trigger Conditions

Use this skill when the user asks for things like:

- audit this WooCommerce site
- review launch readiness for the store
- assess checkout, payments, shipping, tax, catalogue, trust, emails, SEO, or accessibility on the current store
- create a client-ready WooCommerce audit report from site findings
- turn current site evidence into a structured audit deliverable
- standardise or tighten the audit output for a WooCommerce review already in progress

## Inputs You Should Expect

Use the agent's grounded configured resources when available:

- {{label:KWV-Dev-Site,id:asdk_app_6a44c27141f08191b52eb3a81ab1c3f0,type:app}} for direct WordPress and WooCommerce inspection
- {{label:woocommerce-site-discovery,id:hsk_6a452969b7248191b6c38ef7ff3d3253,type:skill}} when site-state discovery or environment confirmation is still needed
- {{label:wordpress-accessibility-checker,id:6a438df2fd588191a22017ca4047e069,type:skill}} for accessibility-specific evidence or remediation framing
- {{label:wordpress-yoast-seo-auditor,id:6a43cc76e8408191ac88a70871c7a93d,type:skill}} for Yoast-specific SEO evidence or audit framing
- {{label:references/woocommerce-store-standard.md,id:6a43bf045878819189265bbfe9b9e2cb,type:file}} for target-state WooCommerce standards
- {{label:tests/master-qa-checklist.md,id:6a43bf0456208191a148cb1c19a722fc,type:file}} and {{label:tests/pre-launch-qa-checklist.md,id:6a43bf0458fc81918ccb998fa22d5560,type:file}} for QA and launch-readiness checks when relevant
- {{label:woocommerce-audit-report-template.md,id:6a43fb4e71d08191b96371c81ace5e69,type:file}} when a full audit report structure is needed
- {{label:references/audit-docs-validation-workflow.md,id:6a452d4632d88191b4fab874080b7bcd,type:file}} only when the user is auditing or maintaining this agent's own internal assets rather than a client/store site

If the request is about a real site audit and direct site access is available, start from connected site evidence before drafting substantive audit content.

## Workflow

1. Identify the audit shape.
2. Confirm the evidence source and whether connected site inspection exists already.
3. Confirm whether WooCommerce is present, active, and inspectable.
4. Choose the correct audit mode:
   - full audit mode when WooCommerce is confirmed and the evidence supports store-specific review
   - reduced audit mode when WooCommerce is missing, inactive, inaccessible, or otherwise not confirmed
5. Lock the scope:
   - full-store audit when the user asked for a broad audit or launch-readiness review
   - focused audit when the user asked about a specific area such as checkout, payments, shipping, tax, emails, SEO, accessibility, or catalogue quality
6. Build the findings from evidence only.
7. Separate confirmed findings from assumptions, likely risks, stored remnants, or unverified areas.
8. Use the output structure from the supporting reference for the selected mode.
9. Before finalising, run the guardrail check and remove claims that overstate what the evidence proves.

## Audit Mode Decision Rules

### Full audit mode

Use full audit mode only when all of the following are true:

- WooCommerce is confirmed present and active
- the current environment being reviewed is identifiable from the evidence
- the agent has enough evidence to make store-specific observations in the requested scope

In full audit mode:

- classify the store state before using launch language
- name evidence sources and material limitations
- focus findings on business impact and delivery priorities
- use softer wording whenever an area was only partially inspected

### Reduced audit mode

Use reduced audit mode when WooCommerce cannot be confirmed from current evidence, or when the available evidence is too incomplete to support a normal WooCommerce audit.

In reduced audit mode:

- use the title `Reduced Audit: WooCommerce Not Confirmed`
- keep the output restoration-first
- treat legacy configuration, stored records, or stale remnants as signals, not proof of current live store behaviour
- avoid normal full-audit sections, severity blocks, and broad launch verdicts

## Guardrail Check Before Final Output

Before you present the final audit:

- verify that every strong claim is directly supported by inspected evidence
- remove any implied end-to-end validation that did not actually happen
- change unsupported claims into limitation wording, stored-signal wording, or open questions
- confirm that checkout, payment, shipping, tax, email, SEO, accessibility, and mobile claims are only as strong as the evidence allows
- confirm that the audit stayed within the requested scope
- confirm that a reduced audit did not drift into a disguised full audit

If a claim cannot be defended from the current evidence, weaken it or remove it.

## Output Contract

Follow the exact structure guidance in [references/output-contract.md](references/output-contract.md).

At minimum, the final answer must:

- name the environment or review context when known
- state the evidence sources used
- state material limitations and unverified areas
- classify the store state when WooCommerce is confirmed
- separate confirmed findings from assumptions or likely risks
- prioritise next actions by impact
- stay concise, human-readable, and delivery-ready

## Supporting Files

- [references/output-contract.md](references/output-contract.md) — required reference for choosing the right section order, wording guardrails, and output shape for full vs reduced audit outputs.

## Realistic Request Shapes

### 1. Broad store audit

User request:

> Audit this WooCommerce site and give me a delivery-ready report.

Success criteria:

- confirms environment and evidence source
- chooses full or reduced mode correctly
- produces a client-ready report with clear limitations, findings, priorities, and next actions

### 2. Launch-readiness review

User request:

> Review whether this store is ready to launch and summarise blockers.

Success criteria:

- classifies the store state before using launch language
- avoids a hard launch verdict unless the evidence supports it
- identifies the biggest blockers and what still needs validation

### 3. Focused audit

User request:

> Review the checkout flow and trust signals on this WooCommerce site.

Success criteria:

- stays tightly focused on checkout and trust
- does not expand into a generic full-store audit
- distinguishes observed checkout evidence from unverified payment or transactional behaviour

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
