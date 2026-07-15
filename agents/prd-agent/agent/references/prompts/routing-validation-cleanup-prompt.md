# Routing and validation cleanup prompt

Use this recurring prompt when the agent’s routing language, validation layer, or parity docs may have drifted and you want a focused cleanup pass without reopening already-settled product decisions.

## Prompt

Run a focused routing-and-validation cleanup pass over the current agent scaffold.

Goals:

- tighten any routing notes, validation notes, test sources, fixtures, README inventories, or reference docs that may have drifted from the current routing language
- preserve the accepted routing model unless you find a concrete inconsistency
- preserve the accepted validation model unless you find a concrete inconsistency
- make the scaffold easier to audit, rebuild, and hand off

Priority checks:

1. verify that routing docs still match the real attached-skill layer and current parity status
2. verify that validation-oriented docs still match the current templates, examples, fixtures, and memory-schema structure
3. verify that README inventories reflect current files in folders that own routing, validation, examples, fixtures, templates, or memory assets
4. verify that test fixtures still align with the intended strong, weak, conflicting, and validator-failure roles
5. verify that prompt-selection guidance, parity-audit guidance, and manual-resolution guidance still cross-link cleanly

Scope guidance:

- review routing language in references, docs, rollout files, and prompt-library files
- review validation language in references, docs, rollout files, fixtures, tests, and script descriptions
- tighten cross-links where parity, rollout, validation, and cleanup flows are hard to discover
- improve file-inventory accuracy where README drift is visible
- improve consistency between canonical templates, filled examples, fixtures, and validation notes

Constraints:

- do not invent replacement skills
- do not silently rename parity-tracked skills
- do not claim full parity where exact-name gaps still remain unresolved
- do not collapse the distinction between templates, examples, fixtures, memory defaults, and memory schemas
- do not widen scope into unrelated redesign work unless a concrete inconsistency requires it

Output standard:

- make only high-signal cleanup changes
- summarize exactly what was tightened and why
- keep the scaffold auditable, rebuild-friendly, and validation-friendly

## When to use it

- after routing or parity updates
- after adding new templates, examples, fixtures, or validation files
- before handoff
- before a validation-pack review
- whenever the routing and validation slice may have drifted from the current scaffold reality
