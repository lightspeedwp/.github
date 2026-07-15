# Skills Routing and Skills Directory Validation Prompt

Use this recurring prompt when you want to validate this WooCommerce Configuration Agent's skill-routing layer and any skill-directory or skill-reference guidance against the agent's currently attached local skill set.

## Recommended prompt

```text
Validate this WooCommerce Configuration Agent's skills routing and skills-directory guidance against the currently attached local skills, then report all issues clearly.

This is a validation task first. Do not silently repair issues unless I explicitly ask for the repair pass afterwards.

Primary goal:
Make sure the agent's instructions, routing logic, maintenance docs, validation notes, README guidance, and saved prompt library all align with the currently attached local skills and do not drift into stale shared-skill, workspace-directory, or missing-skill assumptions.

Current attached local skills to treat as source of truth:
- woocommerce-site-discovery
- woocommerce-audit-orchestrator
- woocommerce-implementation-planner
- woocommerce-remediation-triage
- yoast-configuration
- yoast-auditor
- gravity-forms-configuration
- gravity-forms-auditor
- wordpress-accessibility-checker

Validation scope:
1. Main instructions
- Find every explicit or implied skill route.
- Verify that each important route names the correct local attached skill when needed.
- Verify that nearby skill boundaries are explicit and non-conflicting.
- Confirm that `wordpress-accessibility-checker` is referenced as the attached local skill where accessibility-specific work belongs.

2. Skills-directory and skills-reference guidance
- Review any instruction text, maintenance files, README files, validation docs, and saved prompts that describe the local skill set, routed skill set, or skills directory.
- Check for stale lists of current skills.
- Check for missing local skills in current-skill inventories.
- Check for references to shared skills, workspace-directory skills, or retired skill assumptions that should no longer be active.
- Check for generic wording like `use the appropriate skill` where a specific local skill should now be named.

3. Validation-supporting files and prompt library
- Review attached maintenance and validation files that may encode the current skill map, especially in:
  - `prompts/`
  - `tests/`
  - `references/`
  - `schemas/`
  - folder `README.md` files when they mention skill ownership or routing expectations
- Focus especially on any files that describe:
  - routed local skills
  - maintenance boundaries
  - instruction routing checks
  - validation coverage for skill references
  - workflow ownership by skill

4. Boundary checks
- Validate these boundaries explicitly:
  - site discovery vs formal WooCommerce audit
  - formal audit vs implementation planning
  - implementation planning vs remediation triage
  - Yoast audit/review vs Yoast setup/configuration planning
  - Gravity Forms audit vs Gravity Forms configuration/change work
  - accessibility-specific review/remediation vs broad WooCommerce audit work
  - maintenance workflow vs delivery-skill routing

5. Skills-directory drift checks
- Check whether any saved prompt, validation source file, or maintenance doc still lists the old routed local skills without `wordpress-accessibility-checker`.
- Check whether any file assumes a shared skill directory or workspace skill source when the agent should rely on attached local skills.
- Check whether any file still frames the skill inventory as incomplete or implied when the local attached set is already known.

Constraints:
- Use the current attached local skills as source of truth.
- Be conservative and precise.
- Do not invent missing skills.
- Do not repurpose the agent into a generic WordPress router.
- Do not treat general files, scripts, or references as skill definitions unless they are actually being used as skill-directory guidance.
- Validation should identify issues clearly, but should not repair them yet unless explicitly asked.

Deliverable format:
1. Validation summary
- whether the main instructions correctly route to the attached local skills
- whether `wordpress-accessibility-checker` is correctly referenced as a local attached skill
- whether the skills-directory guidance is accurate or drifting

2. Issues found
For each issue, include:
- file
- issue type
- what is wrong
- why it is wrong
- exact local skill or routing boundary affected
- severity: blocking / important / minor

3. Recommended repair plan
- exact files that should be updated
- what each file should be corrected to say
- which issues are purely directory/list drift vs actual routing logic problems

4. Final validation verdict
- pass / pass with follow-up / fail
- whether the current agent is blocked by any skills-routing or skills-directory problem
```

## Use notes

- Treat the currently attached local skills as canonical.
- Prefer identifying exact drift over giving broad generic advice.
- Distinguish between true routing errors and simple stale skill-inventory wording.
- Distinguish between main-instruction problems and prompt-library or validation-doc drift.
