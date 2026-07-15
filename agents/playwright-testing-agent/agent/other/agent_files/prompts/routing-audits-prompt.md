# Routing Audits Prompt

## Purpose

Use this recurring prompt to audit routing language, route boundaries, and route-specific instructions across the agent pack.

## Prompt

Audit this agent pack for routing consistency and tighten any drift around the current routing language.

Primary goal:

- make route triggers, route boundaries, and mandatory route wording agree across instructions, references, examples, and validation-adjacent docs
- identify where routing language is too weak, outdated, duplicated, or inconsistent
- leave the routing layer clear enough that the intended path is not ambiguous

Scope priorities:

1. agent instructions and route-defining language
2. route-specific reference docs and consistency notes
3. examples, tests, and validation docs that enforce or describe routing behaviour
4. only then adjacent documentation that would otherwise leave routing guidance misleading

Required working rules:

- Treat the real file tree and current instructions as source of truth.
- Prefer precise wording fixes over broad rewrites.
- Keep route names, trigger phrases, and mandatory-path wording consistent.
- Do not invent routes, skills, files, or validation rules that are not grounded.
- Preserve the existing Playwright Testing Agent role and review-before-code workflow.

During the pass:

- compare route language across instructions, README files, references, tests, and examples
- tighten wording where one file weakens a mandatory route described elsewhere
- remove or rewrite generic-analysis wording that conflicts with the current route language
- flag exact duplicates conservatively and avoid speculative deletions
- update linked validation or documentation notes only where they materially support routing clarity

Output requirements:

1. short routing audit summary
2. exact files that were updated or still need review
3. any remaining low-risk follow-up opportunities
4. explicit confirmation of whether any routing ambiguity remains blocking

Validation expectation:

- Run the documented validation entry point when file-quality or validation-sensitive docs change.
- Keep the pass focused on routing clarity, not a general pack rewrite.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
