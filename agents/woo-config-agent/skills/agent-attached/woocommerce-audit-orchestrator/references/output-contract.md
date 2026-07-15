# WooCommerce Audit Output Contract

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

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
