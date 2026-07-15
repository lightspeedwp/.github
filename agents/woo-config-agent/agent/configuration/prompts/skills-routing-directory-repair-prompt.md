# Skills Routing and Skills Directory Repair Prompt

Use this recurring prompt after running `prompts/skills-routing-directory-validation-prompt.md` when you want to repair the issues found in the agent's skill-routing layer and skills-directory guidance.

## Recommended prompt

```text
Use the output from the skills-routing and skills-directory validation pass as the implementation plan, then repair the issues directly.

This is an implementation task, not just a review.

Primary goal:
Bring this WooCommerce Configuration Agent's main instructions, skills-routing logic, maintenance docs, validation docs, README guidance, and prompt library into alignment with the currently attached local skill set.

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

Input assumption:
- A prior validation pass has already identified the files and issues.
- Use that validation output as the repair scope.
- If the validation output conflicts with the current attached local skills, trust the current attached local skills.

Repair scope:
1. Main instructions
- Repair any stale, generic, shared-skill, workspace-directory, or missing-skill references.
- Ensure `wordpress-accessibility-checker` is referenced as the current local attached accessibility skill when accessibility-specific work is routed.
- Tighten route boundaries where needed.
- Do not leave important routes implied when a local skill should be named.

2. Skills-directory and skill-inventory guidance
- Update any file that lists the current routed local skills so the list matches the attached local skills exactly.
- Repair any saved prompt, maintenance file, validation note, or README that still omits `wordpress-accessibility-checker` or other attached local skills.
- Remove references to shared or workspace-directory skills only when they are truly stale, superseded, or incorrect for this agent.

3. Validation-supporting files and prompt library
- Repair validation-source files, prompt files, maintenance docs, or README files that encode outdated skill-routing assumptions.
- Distinguish clearly between:
  - routing logic issues
  - stale skill-directory inventory issues
  - maintenance-boundary wording issues

4. Boundary protection
- Preserve the maintenance boundary:
  - internal file, README, schema, script, test, connector-guide, prompt-library, memory-structure, and instruction-routing maintenance stays on the maintenance workflow
  - delivery work should not be rewritten as generic documentation maintenance
- Preserve the agent's WooCommerce-first role.
- Do not broaden the agent into a generic WordPress router.

5. Required boundary checks after repair
- site discovery vs formal WooCommerce audit
- formal audit vs implementation planning
- implementation planning vs remediation triage
- Yoast audit/review vs Yoast configuration/setup planning
- Gravity Forms audit vs Gravity Forms configuration/change work
- accessibility-specific work vs broad WooCommerce audit work
- maintenance workflow vs delivery-skill routing

Constraints:
- Use the current attached local skills as source of truth.
- Be conservative and precise.
- Prefer replacing stale wording over layering duplicate text.
- Do not invent missing skills.
- Do not leave vague `use the appropriate skill` wording where a specific local skill should now be named.
- Do not rewrite unrelated output standards unless needed for routing or skills-directory consistency.

Deliverable format:
1. Repair summary
- what was corrected
- which stale or incorrect skill references were removed or replaced
- which files were updated

2. Routing and directory changes made
- exact routing logic fixed or tightened
- exact skill-directory or skill-list wording fixed
- exact local skills now referenced across the repaired files

3. Validation result
- whether the repaired files are now internally consistent
- whether the repaired files now match the attached local skill set
- any remaining non-blocking follow-up items
```

## Use notes

- Run the validation prompt first when possible.
- Treat the current attached local skills as canonical even if older validation notes disagree.
- Prefer exact, file-specific repairs over broad rewrites.
- Keep the repair pass scoped to routing and skills-directory alignment unless a new blocking consistency issue is discovered.
