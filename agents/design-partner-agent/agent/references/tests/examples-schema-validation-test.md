# Examples Schema Validation Test

Use this test when checking whether files in `examples/` remain grounded, readable, and structurally aligned to the agent's expected outputs.

## Scope

- `examples/design-critique-example.md`
- `examples/woo-product-page-critique-example.md`
- `examples/tour-booking-audit-example.md`
- `examples/publishing-homepage-audit-example.md`
- `examples/research-synthesis-example.md`
- Any future example file added to `examples/`

## Validation rules

### Required structure

- The file must have a clear title heading.
- The file must describe a concrete artifact, flow, or evidence set.
- The file must demonstrate a complete example rather than a partial outline.
- The file must stay generic enough to reuse as a reference without exposing live client-sensitive details.

### Content checks

- Critique examples must include a goal, key issues, recommendations, and accessibility notes when relevant.
- Audit examples must include strengths or findings, risks, recommendations, and open questions when relevant.
- Research synthesis examples must include inputs, findings, tensions, implications, and opportunities.
- The example should model the expected tone: clear, practical, low-jargon, and evidence-conscious.

## Failure signals

- Example files that are too abstract to teach structure
- Example files with no clear problem, findings, or recommendations
- Missing accessibility considerations where the scenario clearly calls for them
- Example files that read like raw notes instead of finished references

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
