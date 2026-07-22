# Skills Routing Repair Prompt

## Purpose

Use this recurring prompt after a skills-routing audit to repair the skills-routing and skills-directory issues that the validation pass found.

## Prompt

Repair this agent's skills-routing and skills-directory issues using the findings from the latest skills-routing validation pass.

Primary goal:

- fix blocking mismatches between agent instructions, attached skills, starter prompts, validation-facing docs, and any skills-related structure notes
- make the skills-routing layer truthful, consistent, and grounded to the real current setup
- leave no blocking skills-routing or skills-directory issue unresolved

Scope priorities:

1. blocking instruction and route-language fixes
2. attached skill metadata or skills-related file fixes when grounded and necessary
3. starter prompt and validation-doc fixes that must change to match the repaired routing
4. only then README or prompt-library wording that would otherwise remain misleading

Required working rules:

- Start from the actual findings of the skills-routing validation pass.
- Treat the current agent configuration, attached skill list, and real file tree as source of truth.
- Prefer the smallest grounded repair that resolves the mismatch.
- Do not invent new skills, new skills directories, or new skills reference files unless the current request explicitly requires them.
- If the right repair is to remove or rewrite stale wording rather than create a new structure, do that.
- Preserve the existing Playwright Testing Agent role and the mandatory PRD-to-test-pack route.

During the pass:

- fix stale or conflicting skill names in instructions and docs
- strengthen mandatory skill-route wording where the current route must be explicit
- remove weak generic fallback wording that bypasses the intended skill workflow
- align starter prompts and validation-facing docs to the repaired skills-routing behaviour
- repair skills-directory wording so it matches the real current structure, including the case where no dedicated skills directory exists
- keep unrelated documentation cleanup out of scope unless it would leave the repaired skills-routing slice misleading

Repair rules:

- if a skill is attached and should be routed first, make that route explicit in the instructions
- if docs refer to a missing skill, folder, or skills directory, remove or replace that reference with grounded wording
- if a skill name changed, update the routing language everywhere it matters for correctness
- if starter prompts overpromise a skill-driven flow, rewrite them to match the current routing
- if validation docs need a skills-routing check, make that check concrete and aligned to the repaired route

Output requirements:

1. short repair summary
2. exact files or agent fields updated
3. any remaining non-blocking follow-up opportunities
4. explicit confirmation that no blocking skills-routing or skills-directory issue remains

Validation expectation:

- Run the documented validation entry point when validation-facing docs or file-quality assets change.
- Re-check the repaired skills-routing slice before finalising.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
