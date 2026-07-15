# Acceptance checklist

The auditor skill is complete only when:

- [ ] It has clear read-only trigger conditions.
- [ ] It does not perform write operations.
- [ ] It uses progressive loading.
- [ ] It has a clear severity/confidence model.
- [ ] It produces findings registers.
- [ ] It produces client-safe summaries.
- [ ] It produces internal audit reports.
- [ ] It produces handoffs to `gravity-forms-configuration`.
- [ ] It handles WordPress, WooCommerce, and Tour Operator contexts.
- [ ] It treats accessibility, spam, security, privacy, notifications, feeds, payments, and user registration as first-class audit areas.
- [ ] It degrades gracefully when MCP evidence is incomplete.
- [ ] It refuses configuration changes and routes them to the configuration skill.
- [ ] It includes test prompts and expected behaviours.
- [ ] It validates and packages as `skill.zip`.

## Manual QA prompts

Run representative prompts from `tests/test-prompts.md` and check that the model never performs configuration, never invents evidence, and always produces a handoff for changes.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
