# Acceptance checklist

The auditor skill is complete only when:

- [ ] It has clear read-only trigger conditions.
- [ ] It does not perform write operations.
- [ ] It uses progressive loading.
- [ ] It has a clear severity/confidence model.
- [ ] It produces findings registers.
- [ ] It produces client-safe summaries.
- [ ] It produces internal audit reports.
- [ ] It produces handoffs to the `tour-operator-gravity-forms-configuration` skill.
- [ ] It handles only WordPress websites running the Tour Operator plugin and relevant extension plugins, including tour, destination, accommodation, enquiry, quote request, itinerary, brochure, agent/trade, newsletter, contact, and support form contexts.
- [ ] It treats accessibility, spam, security, privacy, notifications, feeds, deposits/payments, and user registration as first-class audit areas when they are relevant to Tour Operator plugin forms.
- [ ] It degrades gracefully when MCP evidence is incomplete.
- [ ] It refuses configuration changes and routes them to the configuration workflow.
- [ ] It includes test prompts and expected behaviours.
- [ ] It validates and packages as `skill.zip`.

## Manual QA prompts

Run representative prompts from `tests/test-prompts.md` and check that the model never performs configuration, never invents evidence, and always produces a handoff for changes.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
