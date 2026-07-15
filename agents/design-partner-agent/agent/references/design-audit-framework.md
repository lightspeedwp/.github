# Design Audit Framework

Use this structure for `audit`.

Use `audit` for systematic assessment across a broader experience, not for feedback on a single artifact.

## Audit modes

- `UX audit`
- `Accessibility audit`
- `Combined audit`

## UX audit lenses

- task entry and discoverability
- information architecture
- interaction flow and friction
- hierarchy and clarity
- trust and reassurance
- default states and empty states
- copy and calls to action
- consistency across the experience

## Accessibility audit lenses

- perceivable content and contrast risks
- semantic structure and reading order
- keyboard access and focus behavior
- target size and interaction affordances
- labels, instructions, and error recovery
- motion, timing, and state change communication
- responsive reflow and zoom resilience
- assistive-technology clarity and robustness

## UX audit output structure

1. `Audit scope`
2. `User goal`
3. `Strengths`
4. `Notable risks`
5. `Opportunity areas`
6. `Optional comparison context`
7. `Recommendations`

## Accessibility audit output structure

1. `Audit scope`
2. `Accessibility target`
3. `Confirmed strengths`
4. `Likely issues`
5. `WCAG-relevant considerations`
6. `Evidence limits and verification gaps`
7. `Recommendations`

## Combined audit output structure

1. `Audit scope`
2. `User goal and accessibility target`
3. `Strengths`
4. `UX risks`
5. `Accessibility risks`
6. `Opportunity areas`
7. `Evidence limits and verification gaps`
8. `Recommendations`

## Guardrails

- Focus on experience patterns, not business strategy.
- Keep comparator products optional; use them only when they sharpen the audit.
- Separate structural issues from polish issues.
- Tie recommendations back to the user goal, workflow, or accessibility outcome.
- Do not imply full WCAG compliance unless the user has provided the implementation details needed to support that claim.
- If the request is about a single screen, component, modal, or bounded interaction, route to `critique` instead.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
