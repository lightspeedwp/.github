# Skills routing and directory validation prompt

Use this prompt when you want a comprehensive audit of how this agent routes through attached skills and whether the skills directory, inventory, and related documentation still match the real configured skill layer.

## Prompt

Run a comprehensive validation pass over this agent’s skills-routing and skills-directory layer.

Goals:

- verify that the real attached-skill layer matches the routing language in the agent instructions, prompts, references, rollout notes, inventories, and related validation docs
- verify that the agent’s skills directory and skill-inventory materials still match the actual attached skills, intended routing model, and current parity state
- identify drift, stale names, missing cross-links, broken handoff assumptions, duplicate routing guidance, and inventory mismatches
- produce a precise issue list that can be repaired without reopening already-settled product decisions unless a concrete inconsistency requires it

Priority checks:

1. verify that the current attached skills exactly match the skill names, roles, and routing expectations referenced in the agent instructions
2. verify that the skills directory or inventory layer reflects the real attached skills, including exact names, purpose boundaries, and any known parity gaps
3. verify that routing references across prompts, references, rollout notes, templates, examples, fixtures, and validation docs use the current skill names and current routing model
4. verify that no stale or superseded skill names remain where they would mislead routing, audit, rebuild, handoff, or promotion work
5. verify that prompt-library guidance cleanly distinguishes between validation, cleanup, parity review, manual resolution, and repair flows
6. verify that any file inventories or README-style summaries that mention skills are accurate and discoverable
7. verify that the intended boundaries between lifecycle routing, intake, research, PRD writing, validation, memory, launch handoff, issue drafting, and supporting specialist skills are still clear and non-overlapping enough to be auditable
8. verify that attached-skill references in the instructions do not force every request through every skill and do not omit a skill that the routing layer clearly depends on

Scope guidance:

- review the agent instructions for skill-routing language, routing order, exclusions, and attached-skill references
- review skills-related prompt files in `prompts/`
- review skills-related references, inventories, rollout docs, and parity docs
- review examples, fixtures, and validation notes for stale skill naming or stale routing assumptions
- review whether the skills directory or inventory layer is complete enough for rebuild, promotion, and handoff work
- review cross-links where discoverability between routing docs, inventory docs, parity docs, cleanup prompts, and repair prompts is weak
- review whether the documented skill boundaries still match the actual specialist roles now attached to the agent

Constraints:

- do not invent replacement skills
- do not silently rename parity-tracked or already-attached skills
- do not claim full parity if exact-name or exact-role gaps still remain unresolved
- do not collapse the distinction between attached skills, local drafts, prompt-library guidance, validation docs, rollout docs, templates, examples, fixtures, memory defaults, and memory schemas
- do not widen scope into unrelated workflow redesign unless a concrete inconsistency requires it
- do not repair issues during this pass; identify and explain them cleanly for a follow-up repair pass

Output standard:

- report only high-signal routing and directory findings
- group findings by severity: blocking, important, cleanup-only
- for each finding, include:
  - where the issue appears
  - what the mismatch is
  - why it matters
  - the smallest safe repair
- summarize exactly which files, routing paths, or inventory layers appear trustworthy versus drifted
- keep the result auditable, rebuild-friendly, and repair-friendly

## When to use it

- after attaching or detaching skills
- after promoting local skills into attached skills
- after rewriting routing instructions
- before a parity review, cleanup pass, handoff, or promotion decision
- whenever the attached-skill layer and the documented skills directory may have drifted apart
