# LightSpeed – Global AI Rules (AGENTS.md)

- Use UK English; optimise for clarity, scalability, maintainability and profitable outcomes.
- Prefer minimal, modular solutions; justify heavier tools with return on investment and maintenance cost.
- Follow WordPress Coding Standards (CSS, HTML, JavaScript, PHP) and inline‑documentation standards at all times.
- All code changes must include lint fixes, relevant tests and a short rationale summarising the change.
- Never output secrets. Treat production and customer data as sensitive. Follow the OWASP top 10 for web security.
- Accessibility and performance are non‑negotiable; highlight potential issues during reviews.
- Prefer `theme.json` and block components over bespoke code when feasible to avoid vendor lock‑in.
- When unsure, propose safe defaults and ask **one** focused question to clarify requirements.

> See [`.github/.github/custom-instructions.md`](.github/.github/custom-instructions.md) for the central index of all Copilot and agent instructions, prompts, and standards.
> Also cross-reference [`agents/agent.md`](.github/.github/agents/agent.md), [`chatmodes/chatmodes.md`](.github/.github/chatmodes/chatmodes.md), and [`prompts/prompts.md`](.github/.github/prompts/prompts.md) for discoverability and workflow guidance.
