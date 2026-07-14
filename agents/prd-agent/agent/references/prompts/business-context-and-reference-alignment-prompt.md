# Business context and reference alignment prompt

Use this recurring prompt when the agent’s business context, reference files, and durable guidance may have drifted from the current instructions, routing model, or attached skill suite.

## Prompt

Run a focused alignment pass over the business-context and reference layer of this agent.

Goals:
- verify that business-context files and core reference docs still support the current routing and output model
- identify stale assumptions, outdated role language, duplicated guidance, weak cross-links, or reference ownership drift
- verify that fixed reference material still lives in the right files instead of leaking into the wrong layers
- preserve the accepted business context unless a concrete inconsistency requires a correction

Priority checks:
1. verify that business-context.md still matches the current domain, scope, and operating assumptions
2. verify that key reference docs still align with the current instructions and attached skills
3. verify that references do not contain stale names, stale routing paths, or outdated workflow assumptions
4. verify that ownership between instructions, references, templates, examples, and memory guidance is still clear
5. verify that the cross-links between references and prompts are strong enough for rebuild and handoff work

Scope guidance:
- review business-context.md and the main reference files
- review where long-lived rules, source maps, inventories, and workflow specs currently live
- identify drift, duplication, or missing reference ownership

Constraints:
- do not invent new business scope
- do not move fixed references into memory-oriented layers
- do not collapse the distinction between instructions, references, templates, examples, and memory defaults
- do not repair anything yet unless explicitly asked in follow-up

Output standard:
- report high-signal reference and business-context issues only
- explain what is trustworthy, what has drifted, and what should be repaired first
- keep the result rebuild-friendly and easy to audit

## When to use it
- after multiple instruction rewrites
- after expanding the skill suite
- before promotion, handoff, or parity review
- whenever business context or references may no longer match the live scaffold
