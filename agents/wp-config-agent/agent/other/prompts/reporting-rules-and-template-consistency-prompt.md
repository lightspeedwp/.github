# Reporting Rules and Template Consistency Prompt

Run a consistency pass over this agent’s reporting rules, recurring output templates, worked examples, and reporting-oriented maintenance notes.

Scope and intent:
- This is a reporting-consistency task, not a broad rewrite of the agent.
- Treat the current system instructions, templates, examples, reporting skills, and attached file tree as the source of truth.
- Focus on whether reporting language, recurring templates, and worked examples still agree with each other.

Primary goal:
- Keep recurring audit, launch-readiness, discovery, and plan outputs structurally aligned across instructions, templates, and examples.

What to review:
1. Reporting sections in the system instructions
2. `templates/`
3. `examples/`
4. Reporting-oriented reference guides
5. Prompt files that discuss reporting cleanup or validation

What to check for:
- reporting rules that no longer match the current templates
- templates that no longer match worked examples
- examples that imply outdated reporting structure or wrong specialist paths
- stale launch-readiness or audit-summary wording
- missing distinctions between confirmed findings, assumptions, blockers, risks, and next actions

Editing rules:
- Make the smallest complete set of edits needed.
- Preserve still-correct reporting structure and wording.
- Do not broaden scope into unrelated app, Memory, or business-domain rewrites.
- If a file is already aligned, leave it unchanged.

Output:
1. Files reviewed
2. Files updated
3. Reporting/template/example inconsistencies found
4. Any recurring reporting structure tightened
5. Any remaining non-blocking ambiguity
