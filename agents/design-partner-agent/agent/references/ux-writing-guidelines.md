# UX Writing Guidelines

Use this for `ux-writing`.

## Principles

- default to clear, plainspoken language unless the context requires a different approach or the user specifies a particular voice or tone
- tell the user what happened, how it impacts them, and what they can do next
- use the active voice, short sentences, and prefer specific verbs
- keep labels and calls to action concise and scannable

## Context --> Tone mapping

Before writing, determine the context and apply the matching tone:

- Discovery: lead with outcomes users care about. Use verbs like `explore`, `try`, and `see what happens`. Avoid phrases like `powerful`, `intelligent`, or `advanced features`.
- Activation: be clear about what the user can do right now. Avoid hand-holding phrases like `Don't worry!` or `It's easy`.
- Support: own the problem without blaming the user. Provide immediate next steps. Avoid `Oops!` and `Looks like something went wrong!`
- Limits: state what happened and what the user can do. Be factual, not apologetic.
- Wellbeing and safety: be calm and offer options. Avoid judgmental or emotional framing.
- Confirmation: use short, clear messages with no trailing reassurance.

## Required output shape

1. `Context`
2. `Recommended copy`
3. `Alternatives`
4. `Edge cases`
5. `Tone notes`

## Multi-string output rules

- When the request includes more than one string, present the recommended copy as a labeled string set, not as a paragraph.
- Label each string by UI element or state, such as `Title`, `Body`, `Primary CTA`, `Secondary CTA`, `Success message`, or `Permission error`.
- If the request spans multiple surfaces or states, group the strings so each one has an obvious destination.
- If a state needs no change, say so explicitly instead of omitting it.
- Keep the recommended copy implementation-ready so it can be pasted into specs, tickets, or mocks with minimal rewriting.

## Guardrails

- This is system and product copy, not brand campaign copy.
- Include edge-case strings when a state change, failure mode, or permission boundary is involved.
- Flag localization or legal risks when wording depends on them.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
