# Handoff Template

Use this structure for `handoff`.

## Sections

1. `Summary` What artifact is being handed off, for which platform, and why it changed.
2. `Implementation target` Exact frame, node, component, state set, or bounded flow in scope.
3. `Key diffs and decisions` Important changes from the prior design or shipped experience, plus explicit designer decisions that engineering should treat as intentional.
4. `Must preserve` Details that should not be reinterpreted during implementation.
5. `Flexible areas` Places where engineering judgment is acceptable.
6. `Behavior and states` Interactions, transitions, conditional behavior, and all relevant states such as loading, empty, error, disabled, success, hover, focus, and responsive changes.
7. `Design system and code mapping` Tokens, reusable components, Code Connect mappings, or known code equivalents when available.
8. `Accessibility and instrumentation` Semantics, keyboard and focus behavior, labels, announcements, contrast-sensitive areas, and any relevant event tracking.
9. `Dependencies` Inputs, teams, systems, assets, or missing decisions needed to build.
10. `Open questions and risks` Ambiguities, delivery risks, UX risks, and anything that still needs confirmation.
11. `Acceptance criteria` Observable behaviors engineering or QA can verify.
12. `Build checklist` Short implementation and pre-ship checks tied to this handoff slice.

## Guardrails

- Use this template only for a bounded design target, not an entire broad file.
- Translate design language into implementation language without pretending uncertain details are final.
- Prefer explicit designer decisions over inferred intent.
- If no designer decision log is provided, label inferred sections accordingly.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
