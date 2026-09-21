# WooCommerce Audit Output Contract

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use this reference to shape the final audit output after evidence has already been gathered.

## 1. Choose the output mode

Pick one mode only:

- **Full audit mode** when WooCommerce is confirmed and the requested scope can be reviewed from current evidence.
- **Reduced audit mode** when WooCommerce is not confirmed or the evidence does not support a normal WooCommerce audit.

Do not blend the two modes.

## 2. Full audit mode structure

Use this order unless the user explicitly asks for a different delivery format:

1. **Environment reviewed**
2. **Evidence sources used**
3. **Material limitations and unverified areas**
4. **Store-state classification**
5. **Confirmed findings**
6. **Likely risks or open questions**
7. **Priority-ranked next actions**

### Full audit section notes

#### Environment reviewed

- Name the environment, store, or review target when known.
- If the environment is not explicit in the evidence, say that plainly.

#### Evidence sources used

- State whether direct site inspection was used.
- Name any supporting skills or attached references used to interpret the findings.

#### Material limitations and unverified areas

- List the important areas that were not directly verified.
- Keep this section factual and concise.

#### Store-state classification

- Use the strongest supported label only:
  - launch candidate
  - partially configured store
  - dormant, broken, or migrated store
- Do not use `WooCommerce not confirmed` here in full audit mode.

#### Confirmed findings

For each important finding, prefer this pattern:

- **Finding**
- **Evidence**
- **Impact**
- **Confidence** when the distinction helps

Do not turn every minor observation into a separate finding. Group low-level evidence under the larger operational issue.

#### Likely risks or open questions

- Use this for concerns that matter but are not fully proven.
- Prefer wording like `could not be confirmed`, `needs validation`, or `current evidence suggests`.

#### Priority-ranked next actions

- Order by business impact, launch impact, or customer-risk impact.
- Keep actions implementation-ready.

## 3. Reduced audit mode structure

Use this order exactly:

1. **Environment reviewed**
2. **WooCommerce verification result**
3. **Evidence sources used**
4. **Directly observed consequences**
5. **Stored remnants or legacy signals**
6. **Unverified areas**
7. **Recovery steps required before a full WooCommerce audit**

### Reduced audit section notes

#### WooCommerce verification result

Keep together:

- whether WooCommerce could be confirmed
- the formal classification: **WooCommerce not confirmed**
- a `Verdict limitation:` line explaining that launch readiness could not be confirmed from current evidence

#### Directly observed consequences

- Include only consequences that are directly observable from current evidence.
- Do not infer normal store operation from stored settings or legacy data.

#### Stored remnants or legacy signals

- Use this for stale settings, orphaned records, legacy products, disabled flows, or partial configuration signals.
- Make clear that these are remnants or signals, not proof of live behaviour.

#### Unverified areas

- List the important store areas that cannot be assessed yet.
- Keep them focused on the requested scope where possible.

#### Recovery steps required before a full WooCommerce audit

- Keep the sequence restoration-first.
- End by saying that a full WooCommerce audit should happen after restoration and renewed inspection.

## 4. Wording guardrails

Prefer wording such as:

- `could not be confirmed from current evidence`
- `could not be confirmed in the active runtime`
- `stored settings suggest`
- `stored records indicate`
- `live behaviour was not directly verified`
- `launch readiness could not be confirmed from current evidence`

Avoid wording such as:

- `launch-ready` unless the evidence clearly supports it
- `not launch-ready` unless the evidence clearly supports it
- `blocker` when the issue is actually an unverified area rather than a confirmed failure
- strong behavioural claims about checkout, payments, shipping, tax, emails, SEO, accessibility, or mobile UX without direct evidence

## 5. Scope discipline

For focused audits:

- keep the findings, limitations, risks, and next actions centred on the requested area
- mention other areas only when they materially affect the requested area
- do not inflate a focused review into a generic full-store report

## 6. Delivery standard

The final output should read like an internal LightSpeed delivery document:

- concise
- evidence-led
- practical
- honest about uncertainty
- structured for handoff or next-step action

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
