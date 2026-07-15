# Local Skills Inventory Refresh Prompt

Run a recurring maintenance pass over this agent’s attached local skill inventory so the current instructions, prompt library, validation docs, and maintenance references all reflect the actual attached skills.

Scope and intent:

- This is a maintenance and consistency task, not a broad rewrite of the agent.
- Treat the current attached skills as the source of truth for the skill inventory.
- Focus on places where the agent documents, lists, or depends on attached local skills.
- Remove stale references to missing, superseded, shared, workspace, or directory skills where attached local skills are the intended source of truth.
- Use this prompt for documented skill-inventory coverage, not for the full route-splitting and specialist-path validation handled by the dedicated skills-routing prompt.

Primary goal:

- Keep the documented local skill inventory accurate, explicit, and aligned across instructions, prompts, validation docs, and maintenance references.

Source of truth:

- Current attached local skills
- Current system instructions
- Current attached file tree and current file contents
- Current prompt library and validation workflow docs

What to review:

1. System-instruction sections that list or route specialist skills
2. Prompt files in `prompts/` that name or depend on attached skills
3. Root and folder README files that mention attached skills or maintenance scope
4. Reference guides and validation workflow docs that mention attached skills
5. Validation scripts or validators that assume specific skill-related prompt files or maintenance paths

What to validate:

- every named skill is actually attached
- every attached local skill that should be documented is documented consistently
- no stale shared/workspace/directory/superseded skill references remain where local attached skills are the intended source of truth
- specialist-skill names are consistent across all maintenance references
- maintenance docs do not imply a broader or different skill inventory than the current attached state supports

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct wording and routing behaviour.
- Remove conflicts instead of leaving soft contradictions behind.
- Do not broaden scope into unrelated app, Memory, or business-domain rewrites.
- If a file is already aligned, leave it unchanged.

Output:

1. Files reviewed
2. Files updated
3. Stale skill references removed
4. Any local skill inventory ambiguities found
5. Any additional lightweight validation checks recommended
6. A clear statement on whether the local skill inventory is now aligned across the agent’s maintenance layer

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
