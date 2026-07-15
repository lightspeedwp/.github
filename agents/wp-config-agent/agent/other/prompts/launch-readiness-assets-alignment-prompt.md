# Launch Readiness Assets Alignment Prompt

Run a recurring maintenance pass over this agent’s launch-readiness assets so the instructions, templates, examples, references, prompts, and validation notes stay aligned around launch QA and launch reporting.

Scope and intent:

- This is a maintenance and consistency task, not a rewrite of the launch workflow.
- Treat the current instructions, attached file tree, and current launch-related files as the source of truth.
- Focus on launch-readiness wording, reporting structure, checklist coverage, and asset alignment.

Primary goal:

- Keep all launch-readiness assets consistent so maintainers can trust the current launch QA workflow, launch summary structure, and supporting references.

Source of truth:

- Current system instructions
- Current attached file tree and current file contents
- Launch-related templates, examples, checklists, references, prompts, and validation docs

What to review:

1. Launch-related instruction sections and reporting rules
2. `templates/pre-launch-summary-template.md`
3. `examples/example-pre-launch-summary.md`
4. launch-related checklists and reference files
5. Root and folder README files where they mention launch readiness
6. Prompt files that refer to launch summaries, QA, or reporting consistency
7. Validation docs that mention launch-report structure or checklist alignment

What to validate:

- launch-readiness terminology is consistent
- the launch summary template and worked example still align
- referenced launch checklists still match the current workflow
- reporting guidance does not conflict with the current router-owned audit/reporting paths
- folder docs and prompts do not preserve stale launch-report assumptions

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct launch QA wording and reporting structure.
- Do not broaden into unrelated routing, app, Memory, or business-domain rewrites.
- If a file is already aligned, leave it unchanged.

Output:

1. Files reviewed
2. Files updated
3. Any launch-readiness asset drift found
4. Any checklist/template/example mismatches found
5. Any lightweight validation follow-ups recommended
6. A clear statement on whether the launch-readiness asset set is now aligned

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
