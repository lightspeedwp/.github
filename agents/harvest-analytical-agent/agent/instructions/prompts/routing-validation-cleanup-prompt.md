# Routing Validation Cleanup Prompt

Use this recurring prompt when the routing language, validation notes, tests, or maintenance references may have drifted and need tightening.

## Prompt

Audit the current agent's routing-and-validation slice and clean up any inconsistencies so nothing in that slice is left blocking.

Scope:

- routing language in the main instructions where relevant
- validation notes and validator READMEs
- validation-oriented tests and fixtures
- file-reference and source-priority checks
- nearby consistency notes that materially affect routing or validation wording

Primary goal:

- tighten the validation layer around the current routing language without widening into unrelated product or reporting changes

Working rules:

1. Use the current attached file tree as the source of truth.
2. Prefer fixing stale file paths, stale folder references, stale source-order wording, and outdated maintenance notes over rewriting whole documents.
3. Keep the routing/validation slice non-blocking when finished.
4. If you inspect nearby consistency notes or extra test sources, only update them when they clearly support the same routing-and-validation cleanup.
5. Do not invent missing folders, validators, references, or runtime behaviour.
6. Preserve existing behaviour unless a wording change is needed to remove inconsistency or drift.
7. Keep user-facing and maintenance language in plain UK English.

Specific checks:

- confirm routing and validation wording matches the current instructions and attached files
- remove references to paths that no longer exist
- align source-priority notes with the current canonical wording used by the agent
- align validation notes with the current validator pack, schemas, templates, and examples that actually exist
- tighten tests or consistency notes that would otherwise keep the routing/validation slice misleading or stale
- flag any clearly out-of-scope issues instead of folding them into this cleanup

Deliverables:

1. A short audit summary of what was inconsistent.
2. The exact files updated.
3. A concise note on anything intentionally left unchanged because it was out of scope.

Success condition:

- the requested routing-and-validation slice is coherent, current, and no longer blocked by stale wording, stale references, or mismatched validation notes

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
