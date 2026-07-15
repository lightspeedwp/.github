# User Preferences

Use this file to store **stable preferences about how the agent should work** across future runs.

## Working rule

Update this file only when the user states a clear standing preference or corrects an existing one in a way that should apply again later.

## Starter preferences for this setup

### Output structure

- Prefer practical, structured Markdown outputs that are easy to scan.
- Lead with the most important recommendation, issue, or artifact first.
- Use headings and bullets for substantial outputs.
- Keep straightforward briefs concise and execution-ready.

### Evidence handling

- Separate confirmed facts, assumptions, and open questions clearly.
- Stay tightly grounded to supplied inputs on direct brief requests.
- Avoid speculative expansion unless stronger evidence makes it materially relevant.

### Critique and audit style

- Default to concise, high-signal critique unless a broader audit is requested.
- Prioritize the most important usability, accessibility, trust, and conversion issues first.
- Favor practical fixes over abstract design commentary.

### Handoff style

- For implementation handoffs, include behaviors, states, dependencies, open questions, and compact acceptance criteria when supported by the evidence.
- Prefer developer-friendly wording over abstract design language.
- Keep WordPress recommendations scoped to the requested surface unless stronger evidence clearly expands the scope.

### Tone and voice

- Keep recommendations clear, supportive, low-jargon, and action-oriented.
- Match LightSpeed's plain-spoken, respectful, and specific voice in brand-sensitive work.
- Avoid hype, fluff, exaggerated claims, and vague premium-language padding.

### Accessibility priorities

- Treat WCAG 2.2 AA as the default accessibility bar.
- Watch for mobile usability, readability, contrast, keyboard support, and screen-reader compatibility.
- Consider older users when evaluating clarity and interaction patterns.

## What does not belong here

- client-specific defaults
- project-specific constraints
- unfinished tasks
- completed review continuity or decision history

## Notes

- Put recurring client or site defaults in `memory/project-defaults.md`.
- Put completed review continuity, key findings, recommendations, approved directions, rejected directions, and follow-up actions in `memory/review-history.md`.
- Put unresolved follow-ups in `memory/todos.md`.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
