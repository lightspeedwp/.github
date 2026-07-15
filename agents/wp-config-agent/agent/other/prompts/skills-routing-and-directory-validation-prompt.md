# Skills Routing and Directory Validation Prompt

Run a comprehensive validation pass over this agent’s skill-routing logic and skill-inventory references so the current attached skills, routing rules, and maintenance documentation stay aligned.

Scope and intent:

- This is a validation and consistency task, not a broad rewrite of the agent.
- Treat the current system instructions, current attached skills, current attached file tree, and current maintenance documentation as the source of truth.
- Focus on routing correctness, specialist-skill separation, attached-skill references, and any maintenance docs that act like a skill directory or skill inventory.
- Do not reopen settled routing decisions unless a real inconsistency, stale reference, or ambiguity is found.

Primary goal:

- Ensure the agent’s skill-routing model, attached-skill inventory, and surrounding documentation all agree on which attached skills exist, what each one is for, and how requests should route between them.

Source of truth:

- Current system instructions
- Current attached local skills, especially:
  - `wordpress-site-onboarding`
  - `wordpress-audit-reporting`
  - `wordpress-remediation-planner`
  - `wordpress-inspection-preflight`
  - `wordpress-request-router`
  - `yoast-configuration`
  - `yoast-auditor`
  - `gravity-forms-configuration`
  - `gravity-forms-auditor`
  - `wordpress-accessibility-checker`
- Current attached file tree and current file contents
- Current attached apps and reporting rules where routing language depends on them
- Current prompt library and validation docs where they mention skills, routing, or maintenance checks

What to review:

1. System-instruction sections that route requests or describe specialist skills
2. Any prompt files in `prompts/` that refer to routing, specialist skills, maintenance cleanup, or validation-pack work
3. Root and folder README files that mention skills, routing, or maintenance responsibilities
4. Reference guides in `references/` that mention skill usage, routing, reporting, or validation scope
5. Validation scripts and validation workflow docs where skill-routing assumptions appear
6. Any file that functions as a skill inventory, skill directory, or attached-skill reference layer for maintainers

What to validate:

- every mentioned skill is actually attached in the current agent state
- no stale references remain to shared skills, workspace skills, directory skills, or superseded skill names where attached local skills are the source of truth
- request-routing wording is explicit enough to choose the right attached skill without overlap
- configuration/change work is kept separate from read-only audit/review work
- reporting paths align with the current router and the correct specialist auditor skills
- maintenance docs do not imply a skill directory or inventory that conflicts with the current attached skills
- prompts and validation docs do not preserve outdated attached-skill assumptions

Required routing model to preserve:

- Yoast setup, planning, reusable guidance, remediation planning, and configuration work route to `yoast-configuration`
- Yoast audits, evidence review, validation, launch QA, report-led review, and structured review work route to `yoast-auditor`
- Gravity Forms setup, implementation, troubleshooting, validation, change work, and handoff work route to `gravity-forms-configuration`
- Gravity Forms read-only audits, findings registers, evidence-led review, scorecards, and audit summaries route to `gravity-forms-auditor`
- routing classification and dev-versus-live clarification before site-specific inspection remain owned by `wordpress-request-router`

Skill-directory validation rules:

- Treat the current attached skills as the only valid skill inventory.
- If a maintenance document lists skills, that list must match the current attached skills it claims to cover.
- If a file implies a broader skill directory than the current attached state supports, tighten it or remove the conflicting claim.
- Do not invent a separate skill directory folder unless the current attached file tree actually contains one.
- If a file uses “skill directory” loosely, rewrite it so it clearly means attached skills, specialist-skill inventory, or maintenance reference layer.

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct routing, reporting, and maintenance wording.
- Remove conflicting references instead of leaving soft contradictions behind.
- Do not broaden scope into unrelated app, Memory, business-domain, or workflow rewrites.
- If a file is already aligned, leave it unchanged.

Validation focus:

- Ensure system instructions, prompt files, README files, reference guides, and validation docs all agree on the current attached skill set.
- Check whether validation docs should explicitly catch:
  - stale skill-inventory references
  - outdated skill names
  - overlap between configuration and audit specialist paths
  - stale mentions of shared/workspace/directory skills
  - routing wording that is too vague to enforce the intended split
- If new validation is warranted, prefer lightweight deterministic checks over broad speculative additions.

Output:

1. Files reviewed
2. Files updated
3. Any stale skill or routing references removed
4. Any skill-inventory or skill-directory ambiguities found
5. Any new validation checks recommended or added
6. A clear statement on whether the agent’s skill routing and skill-inventory layer are now aligned with the current attached skills

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
