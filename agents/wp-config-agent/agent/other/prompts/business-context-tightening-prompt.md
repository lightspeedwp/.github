# Business Context Tightening Prompt

Run a maintenance pass over this agent’s business-context layer so `business-context.md`, the current instructions, and nearby maintenance docs stay aligned with the current WordPress scope and current operating assumptions.

Scope and intent:

- This is a business-context tightening task, not a broad rewrite of the agent’s role.
- Treat `business-context.md`, the current instructions, and the current attached file tree as the source of truth.
- Focus on placeholders, stale assumptions, missing scope notes, and wording drift that affects maintenance quality or validation reliability.

Primary goal:

- Keep the business-context layer practical, current, and aligned with the actual role of the agent.

Source of truth:

- `business-context.md`
- current system instructions
- current attached file tree and maintenance docs
- current attached apps and specialist-skill scope only where business context depends on them directly

What to review:

1. `business-context.md`
2. root README and maintenance references that describe the agent’s scope
3. validation docs or prompts that refer to business-context completeness

What to check for:

- placeholder wording that should be tightened or intentionally preserved
- stale business-domain assumptions not supported by the current agent scope
- missing or vague statements about primary outcomes, standards, or operating boundaries
- wording that drifts from the current WordPress, Gravity Forms, Yoast SEO, launch-QA, and maintenance remit
- business-context language that no longer matches the current instructions

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct scope, standards, and outcomes.
- Do not invent client-specific commercial details or business-domain assumptions.
- Keep wording practical and maintenance-friendly.
- If a file is already aligned, leave it unchanged.

Output:

1. Files reviewed
2. Files updated
3. Any stale or vague business-context wording removed
4. Any remaining intentional placeholders or open context gaps
5. Any validation checks recommended or added
6. A clear statement on whether the business-context layer is now aligned with the current agent scope

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
