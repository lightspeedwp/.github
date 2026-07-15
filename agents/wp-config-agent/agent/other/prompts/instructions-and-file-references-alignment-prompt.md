# Instructions and File References Alignment Prompt

Run a maintenance pass over this agent’s instruction-to-file reference layer so the current instructions and attached files stay aligned.

Scope and intent:

- This is an instruction/file-reference consistency task, not a broad rewrite of the agent.
- Treat the current system instructions and current attached file tree as the source of truth.
- Focus on stale file references, missing file references, incorrect file-role wording, and cross-reference drift between the instructions and the attached maintenance files.

Primary goal:

- Ensure the instruction system points to the right attached files and describes their role accurately.

Source of truth:

- current system instructions
- current attached file tree and current file contents
- root README and folder README files
- validation docs and reference guides where they are referenced from instructions

What to review:

1. file references inside the system instructions
2. root README and folder README files
3. key reference guides and templates named in the instructions
4. validation docs that describe file-reference expectations

What to check for:

- references to files that no longer exist
- stale or ambiguous file-role descriptions
- missing references to files that now materially support the workflow
- duplicated file references where one clearer reference path would do
- instructions that still imply outdated folder structure or missing files

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct references and file-role wording.
- Do not invent files that are not attached.
- Keep wording practical and maintenance-friendly.
- If a file or reference path is already aligned, leave it unchanged.

Output:

1. Files reviewed
2. Files updated
3. Any stale or missing instruction-to-file references fixed
4. Any remaining file-reference ambiguities found
5. Any validation checks recommended or added
6. A clear statement on whether the instruction and file-reference layer is now aligned with the current attached file set

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
