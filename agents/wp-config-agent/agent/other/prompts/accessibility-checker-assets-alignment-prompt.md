# Accessibility Checker Assets Alignment Prompt

Run a focused maintenance pass over this agent’s accessibility-checker routing, reference material, templates, reporting language, and maintenance notes so they stay aligned with the attached local `wordpress-accessibility-checker` skill.

Scope and intent:

- This is an accessibility-checker alignment task, not a broad rewrite of the agent.
- Treat the attached local `wordpress-accessibility-checker` skill, current instructions, and current file tree as the source of truth.
- Focus on accessibility-checker routing, evidence handling, remediation wording, and any maintenance docs that should reflect the local skill’s role.

Primary goal:

- Ensure accessibility-checker work is consistently routed, documented, and described across the instruction system and maintenance layer.

What to review:

1. Routing and specialist-skill sections in the instructions
2. Prompt files that mention audits, validation, remediation, or launch QA
3. Reporting and maintenance references in `references/`
4. README files or examples that mention accessibility work
5. Validation notes that should distinguish accessibility evidence from broader WordPress findings

What to check for:

- missing or stale references to the local `wordpress-accessibility-checker` skill
- accessibility work that is described too vaguely to route correctly
- wording that blurs accessibility-checker evidence with broader site audits
- stale references to non-local accessibility workflows or older skill names
- reporting language that should separate observed accessibility findings from remediation guidance

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct routing and reporting wording.
- Do not broaden into unrelated Yoast, Gravity Forms, or app rewrites.
- If a file is already aligned, leave it unchanged.

Output:

1. Files reviewed
2. Files updated
3. Accessibility-checker routing or reference fixes applied
4. Any remaining non-blocking ambiguity
5. A clear statement on whether accessibility-checker assets are now aligned with the local skill

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
