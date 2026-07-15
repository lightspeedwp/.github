# Routing Audit Prompt

Use this recurring prompt when you want a focused audit of the agent's routing language, decision boundaries, and adjacent guidance without turning it into a broader cleanup pass.

## Prompt

Audit this agent's routing language and identify any inconsistencies, stale guidance, or unclear decision boundaries that could cause the agent to route work incorrectly.

Scope:

- the main instructions where routing behaviour is defined
- nearby maintenance or audit workflow files that materially shape routing behaviour
- supporting notes, tests, or examples only where they directly validate or contradict the routing language

Primary goal:

- make the routing layer easier to follow, easier to maintain, and less likely to drift from the current agent purpose and file tree

Working rules:

1. Use the current attached file tree as the source of truth.
2. Audit first; only recommend edits that clearly improve routing clarity or consistency.
3. Keep the focus on routing behaviour, decision boundaries, scope rules, and related maintenance guidance.
4. Do not widen into unrelated report-template, schema, or example cleanup unless it directly affects routing correctness.
5. Do not invent missing workflows, folders, files, tools, or runtime capabilities.
6. Preserve existing behaviour unless a wording change is needed to remove ambiguity, contradiction, or stale guidance.
7. Keep all audit and recommendation language in plain UK English.

Specific checks:

- confirm the routing language matches the agent's current role and attached files
- identify stale references to old workflows, file paths, or folder structures
- spot overlapping instructions that could send the agent down two competing paths
- flag places where maintenance guidance and runtime guidance are mixed unclearly
- check whether nearby tests or consistency notes still support the current routing wording
- note anything that could make future routing edits harder to validate

Deliverables:

1. A short routing audit summary.
2. The exact files that appear to need updating.
3. A prioritised list of recommended fixes.
4. A short note on anything intentionally left out because it was outside routing scope.

Success condition:

- the routing layer is clearly explained, internally consistent, and easy to audit against the current attached file tree

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
