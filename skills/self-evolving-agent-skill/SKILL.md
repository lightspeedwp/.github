---
name: self-evolving-agent
description: safely evolve, audit, update, benchmark, and maintain chatgpt skills, agents, prompts, workflow instructions, and reusable skill packages through evidence-backed mutation proposals, quick improvement audits, regression checks, changelogs, and human-approved application. use when a user asks to improve a skill, review skill quality, compare variants, create or update an evolution archive, package approved skill changes, or turn self-improvement patterns into governed workflows. do not use for autonomous self-modifying code execution.
---

# Self-Evolving Agent

## Purpose

Use this skill to run a governed improvement loop for ChatGPT skills, agents, prompts, and workflow instructions. Treat “self-evolving” as a human-approved process: collect evidence, propose focused mutations, evaluate them, preserve an archive, and only apply changes when the user explicitly asks.

This skill adapts the archive → sampler → mutator → evaluator → validator loop from self-improving agent research into a safe operational workflow for skill maintenance.

## Operating rules

- Never autonomously rewrite, install, publish, or execute self-modifying code.
- Prefer one small mutation at a time unless the user asks for a full rewrite or has already approved a bounded update set.
- Preserve the current version before proposing or applying changes.
- Separate confirmed evidence, inference, and recommendation.
- Use explicit gates: propose → evaluate → ask/receive approval → apply/package.
- Treat approval to draft, package locally, edit a connected source, publish, and change tool access as separate approval levels.
- For code, scripts, connector actions, or tool permissions, require sandboxed testing or a stated reason testing was not possible.
- Do not invent performance metrics, benchmark results, source claims, approval status, or connector permissions.

## Workflow decision tree

1. Classify the request.
   - Quick improvement ideas, audit, or “what would you change?” → follow “Quick improvement audit”.
   - New evolving skill or agent system → follow “Create an evolution system”.
   - Improve an existing skill, prompt, or agent → follow “Run an evolution cycle”.
   - Review proposed changes → follow “Evaluate a mutation”.
   - Apply approved changes → follow “Apply and archive”.
   - User asks for autonomous self-modification → redirect to human-approved proposals and safety gates.
2. Identify the artefact under evolution: `SKILL.md`, system prompt, agent spec, workflow, script, template, routing rules, memory, or evaluation pack.
3. Choose the smallest useful output: quick audit, evolution brief, mutation proposal, review verdict, changelog entry, or full updated skill package.

## Trigger and routing examples

Use this skill for requests like:

- “What improvements can you make to this skill?”
- “Evolve this prompt based on the last few failures.”
- “Compare these two agent variants and recommend one.”
- “Create a changelog and rollback note for this approved skill update.”
- “Turn this self-improvement research pattern into a governed workflow.”

Route away instead of absorbing adjacent work:

- New skill packaging or upload validation → use `skill-creator` as the primary skill.
- Domain deliverables such as support replies, PRDs, Figma work, WordPress assets, or audits → use the relevant specialist skill, then archive reusable lessons here only if requested.
- Autonomous runtime self-modification, unreviewed tool access expansion, or self-publishing changes → refuse the autonomous part and offer a human-approved evolution loop.

## Quick improvement audit

Use this lightweight path when the user asks for improvement ideas but has not asked for files to be edited.

1. Summarise the current baseline in 3-7 bullets.
2. Identify 3-7 improvement opportunities.
3. Classify each opportunity by mutation type, target file, expected value, risk, and evidence quality.
4. Recommend the safest next mutation or tightly related mutation set.
5. Do not apply changes until the user explicitly asks to proceed.

When the user says to proceed with a previously recommended update set, treat the approval as permission to create or update a local package only. Do not edit connected repositories, external documents, project-management records, published skills, connector permissions, or durable memory unless the user explicitly asks for that action too.

## Minimum intake

Collect or infer these fields before making substantive changes:

- Target artefact and current version.
- Intended behaviour or business goal.
- Trigger examples: when the skill/agent should activate.
- Expected inputs and outputs.
- Evaluation criteria: examples, tests, review checklist, quality bar, or acceptance criteria.
- Safety boundaries: disallowed tools, data access, external actions, irreversible changes.
- Archive location: current conversation, attached files, repo path, Drive doc, Linear issue, or other user-approved location.

If information is missing and the task can still proceed, use safe defaults and mark assumptions clearly. Ask only for a blocking missing item.

## Run an evolution cycle

1. **Archive the baseline**
   - Summarise the current artefact in 3-7 bullets.
   - Note version, source, owner, date if available.
   - Record known failures, gaps, feedback, or evaluation results.

2. **Select improvement pressure**
   - Choose one primary pressure: reliability, trigger accuracy, output quality, safety, routing, context efficiency, tool usage, packaging, or maintainability.
   - Avoid broad “make it better” rewrites unless the artefact is clearly unusable.

3. **Generate candidate mutations**
   - Draft 1-3 small changes by default.
   - Bundle more than 3 changes only when they are already approved, low-risk, and part of the same coherent update.
   - For each, state expected benefit, risk, evidence, affected files, and rollback path.
   - Keep speculative research or inspiration out of operational instructions unless it improves execution.

4. **Evaluate candidates**
   - Test against the provided examples or create a small evaluation checklist.
   - Include regression checks for previous known-good behaviour.
   - For scripts, run representative commands and report pass/fail.
   - For connector workflows, verify permissions and avoid assuming unavailable tools.

5. **Gate the decision**
   - Recommend one verdict per candidate: accept, revise, hold, or reject.
   - Require explicit user approval before making irreversible or external changes.
   - If the user already asked for an updated deliverable, apply the safest accepted changes and state what was assumed.

6. **Apply and archive**
   - Update the artefact or produce a patch/package.
   - Add a changelog entry with evidence, decision, owner, and rollback note.
   - Preserve rejected ideas in the archive only if they prevent repeat work.

## Create an evolution system

When creating a new self-evolving skill or agent, build these parts:

- Core instructions: concise trigger description, workflow, safety gates, output formats.
- Evaluation pack: examples, acceptance checks, regression checklist, and failure taxonomy.
- Archive schema: version, parent, mutation type, evidence, score/verdict, decision, rollback.
- Memory policy: what may be remembered, what must stay local, and what must not be stored.
- Tool policy: allowed tools, approval gates, sandbox rules, connector boundaries.

Move detailed evaluation rubrics, schemas, and examples into reference files rather than overloading `SKILL.md`.

## Mutation taxonomy

Use these labels in proposals and changelogs:

- `trigger`: improves when the skill/agent is selected.
- `workflow`: changes sequencing or decision logic.
- `output`: changes templates, tone, or structure.
- `routing`: changes awareness of related skills or handoff paths.
- `safety`: adds constraints, approvals, or redaction rules.
- `memory`: changes what is archived, remembered, or ignored.
- `tooling`: changes scripts, connectors, or execution policy.
- `reference`: adds or refines supporting documentation.
- `cleanup`: removes stale, duplicate, or low-value content.

## Cross-skill awareness

When the task overlaps another specialist skill, do not absorb that skill’s domain. Instead, route cleanly:

- Use `skill-creator` for packaging, validating, or creating ChatGPT skill bundles.
- Use domain-specific skills for specialist deliverables, then archive the lessons learned here.
- Recommend one primary downstream skill and at most one supporting skill.
- Keep self-evolution focused on feedback loops, versioning, evaluation, and safe change control.

## Output formats

For detailed templates, read `references/output-templates.md`.

Default response order:

1. Value, risks, next step in 3 bullets.
2. Evidence-backed analysis.
3. Candidate mutation table or checklist.
4. Recommended decision.
5. Changelog/archive entry if changes are accepted or applied.

For lightweight improvement requests, use the quick skill improvement audit template from `references/output-templates.md` and stop before implementation unless the user approves changes.

## Optional helper script

Use `scripts/evolution_log.py` when the user provides raw feedback notes and wants a normalised JSONL observation log before reviewing mutations.

Example:

```bash
python scripts/evolution_log.py --skill self-evolving-agent --source feedback.txt --output evolution-observations.jsonl
```

## References

- `references/evolution-protocol.md`: detailed evolution loop and candidate scoring.
- `references/safety-and-governance.md`: approval gates, sandbox rules, and memory boundaries.
- `references/output-templates.md`: reusable templates for briefs, mutation proposals, and changelog entries.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
