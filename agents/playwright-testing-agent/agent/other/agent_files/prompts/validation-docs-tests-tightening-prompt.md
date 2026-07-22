# Validation Docs And Tests Tightening Prompt

## Purpose

Use this recurring prompt to tighten validation checklists, test guidance, pass criteria, and validation-focused markdown without rewriting the validator scripts themselves.

## Prompt

Audit and tighten the validation docs and tests layer so the documented validation coverage, pass criteria, and maintainer guidance match the real current validation setup.

Primary goal:

- make validation-facing markdown in `tests/` and related docs accurate, specific, and mutually consistent
- tighten outdated, vague, or overstated validation expectations
- leave the validation docs/tests layer usable for maintainers without broad cross-pack rewrite work

Scope priorities:

1. `tests/` validation checklists and coverage docs
2. validation-focused markdown that describes current checks or pass criteria
3. only then nearby supporting notes that materially affect validation guidance accuracy

Required working rules:

- Treat the real file tree and current validator behaviour as source of truth.
- Prefer actionable checklist wording and exact current coverage over aspirational wording.
- Keep file paths, folder names, and validation terms exact.
- Do not invent validator behaviour, folders, or required files that are not grounded.
- Keep this pass on docs and tests, not script implementation.

During the pass:

- compare validation checklists and pass criteria against the current structure and validator entry points
- tighten stale references, stale coverage claims, and outdated required-versus-optional wording
- improve consistency around skip behaviour, blocker language, and maintainer run guidance
- keep edits focused on validation docs and tests instead of broader README cleanup

Output requirements:

1. short validation docs/tests audit summary
2. exact files updated
3. any remaining non-blocking docs/tests follow-up opportunities
4. explicit confirmation of whether the validation docs/tests layer still has blockers

Validation expectation:

- Run the documented validation entry point when validation-sensitive docs change and the validator files are available.
- If blockers remain, describe them as docs/tests mismatches rather than widening into unrelated cleanup.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
