# Skills boundary and overlap audit prompt

Use this recurring prompt when the agent has many attached skills and you want to verify that their documented roles are still distinct, discoverable, and not fighting each other.

## Prompt

Run a focused audit over the current skill boundaries and overlap risk in this agent.

Goals:
- verify that attached skills still have clear, non-conflicting responsibility boundaries
- identify where two or more skills appear to own the same work in a way that could confuse routing, audits, promotion, or future maintenance
- verify that the instructions, inventories, prompts, and references describe each skill at the right level of specificity
- preserve the accepted skill set unless a concrete overlap or gap requires a recommendation

Priority checks:
1. verify that each attached skill has a clearly differentiated primary job
2. verify that routing language distinguishes lifecycle routing, intake, research, drafting, review, estimation, delivery planning, QA planning, QA triage, release handoff, export, and memory work cleanly
3. verify that generic support skills are not described as if they replace more specific lifecycle skills
4. verify that specialist skills are not documented so broadly that they shadow neighbouring skills
5. verify that examples, fixtures, and references reinforce the intended boundaries instead of blurring them

Scope guidance:
- review the current instructions, skill inventory files, routing references, prompts, rollout notes, examples, and fixtures
- review the actual attached-skill descriptions alongside the documented routing model
- identify overlap, gap, ambiguity, or misleading ownership language

Constraints:
- do not invent replacement skills
- do not silently rename attached skills
- do not rewrite the routing model during this pass
- do not repair anything yet; identify and explain the boundary issues clearly for a later repair pass

Output standard:
- group findings into blocking, important, and cleanup-only
- for each finding, include the competing or unclear skill boundaries, why the overlap matters, and the smallest safe repair
- keep the result auditable and handoff-friendly

## When to use it
- after attaching multiple new skills
- before promotion or parity review
- whenever routing starts to feel too broad or skills feel duplicated
