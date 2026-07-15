# Gravity Forms Assets Consistency Prompt

Run a recurring maintenance pass over this agent’s Gravity Forms assets so the current routing split, configuration guidance, audit guidance, templates, references, prompts, and maintenance docs stay aligned.

Scope and intent:

- This is a Gravity Forms maintenance and consistency task, not a broad rewrite of the agent.
- Treat the current instructions, attached Gravity Forms skills, and attached Gravity Forms files as the source of truth.
- Focus on the separation between configuration/change work and read-only audit/review work.

Primary goal:

- Keep the Gravity Forms maintenance layer consistent across instructions, prompts, references, templates, schemas, examples, and validation notes.

Source of truth:

- Current system instructions
- Current attached local Gravity Forms skills
- Current attached file tree and current file contents
- Current Gravity Forms templates, schemas, references, examples, prompts, and validation docs

What to review:

1. Gravity Forms routing and workflow sections in the instructions
2. Gravity Forms templates and schemas
3. `references/gravity-forms-standard.md`
4. Gravity Forms prompts, examples, and README references
5. Validation docs and validator comments where Gravity Forms assumptions appear

What to validate:

- configuration/change work still routes to the correct local Gravity Forms configuration skill
- read-only audit/review work still routes to the correct local Gravity Forms auditor skill
- templates, schemas, and references do not blur implementation work with audit outputs
- no stale shared/workspace/directory/superseded Gravity Forms skill references remain
- maintenance docs accurately describe current Gravity Forms assets and their roles

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct Gravity Forms workflow guidance.
- Remove conflicting references instead of leaving soft contradictions behind.
- If a file is already aligned, leave it unchanged.

Output:

1. Files reviewed
2. Files updated
3. Any stale Gravity Forms references removed
4. Any configuration-vs-audit ambiguity found
5. Any schema/template/reference mismatches found
6. A clear statement on whether the Gravity Forms asset set is now aligned

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
