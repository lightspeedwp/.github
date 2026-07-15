# Starter Prompts Alignment Prompt

Run a maintenance pass over this agent’s starter prompts so they stay aligned with the current instructions, current skill-routing model, and current app-backed capabilities.

Scope and intent:

- This is a starter-prompt alignment task, not a broad rewrite of the agent.
- Treat the current starter prompts, current instructions, current attached skills, and current attached apps as the source of truth.
- Focus on prompt quality, coverage, routing alignment, duplication, and stale promises.

Primary goal:

- Ensure the starter prompts still represent useful first-run paths that the current agent can actually support.

Source of truth:

- current starter prompts
- current system instructions
- current attached skills and attached apps
- current reporting and maintenance guidance where starter-prompt behavior depends on them

What to review:

1. all current starter prompts
2. system-instruction routes and workflow areas
3. any validation docs or scripts that refer to starter-prompt quality

What to check for:

- duplicated starter intent
- vague prompts that do not lead to a distinct workflow
- prompts that promise capabilities not grounded in the current setup
- prompts that no longer match the current routing split
- missing high-value starter paths that would better showcase the current agent role

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-useful starter paths.
- Keep starter prompts short, distinct, and grounded in the current setup.
- Do not invent unsupported app or skill behavior.
- If the starter prompts are already aligned, leave them unchanged.

Output:

1. Starter prompts reviewed
2. Starter prompts updated
3. Any duplicated or stale starter paths removed
4. Any missing high-value starter paths recommended
5. Any validation checks recommended or added
6. A clear statement on whether the starter prompts are now aligned with the current instructions and routing model

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
