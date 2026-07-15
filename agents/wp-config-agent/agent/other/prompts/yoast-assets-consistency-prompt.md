# Yoast Assets Consistency Prompt

Run a recurring maintenance pass over this agent’s Yoast SEO assets so the current routing split, setup guidance, audit guidance, launch-QA references, prompts, and maintenance docs stay aligned.

Scope and intent:

- This is a Yoast maintenance and consistency task, not a broad rewrite of the agent.
- Treat the current instructions, attached Yoast skills, and attached Yoast-related files as the source of truth.
- Focus on the separation between setup/configuration/planning work and audit/review/validation work.

Primary goal:

- Keep the Yoast maintenance layer consistent across instructions, prompts, references, checklists, examples, and validation notes.

Source of truth:

- Current system instructions
- Current attached local Yoast skills
- Current attached file tree and current file contents
- Current Yoast-related references, checklists, prompts, and maintenance docs

What to review:

1. Yoast routing and workflow sections in the instructions
2. Yoast-related checklists and references
3. Launch-readiness docs where Yoast SEO is part of the review path
4. Prompt files and README files that mention Yoast SEO work
5. Validation docs and validator comments where Yoast assumptions appear

What to validate:

- setup, planning, reusable guidance, remediation planning, and configuration work still route to the correct local Yoast configuration skill
- audits, evidence review, validation, launch QA, and report-led review still route to the correct local Yoast auditor skill
- checklists, references, and prompts do not blur planning/configuration work with audit outputs
- no stale shared/workspace/directory/superseded Yoast skill references remain
- maintenance docs accurately describe the current Yoast-related assets and their roles

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct Yoast workflow guidance.
- Remove conflicting references instead of leaving soft contradictions behind.
- If a file is already aligned, leave it unchanged.

Output:

1. Files reviewed
2. Files updated
3. Any stale Yoast references removed
4. Any configuration-vs-audit ambiguity found
5. Any checklist/reference/prompt mismatches found
6. A clear statement on whether the Yoast asset set is now aligned

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
