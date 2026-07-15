# Instructions Snapshot

This file is the validation snapshot target for instruction-reference, app-usage, and skill-routing validators.

## Current instruction-system expectations

- Zendesk remains the primary system of record and default workflow anchor.
- The core workflow must decide whether Zendesk alone is enough before any secondary app is used.
- Secondary apps stay optional and must not override the core support workflow unless the user explicitly asks for downstream context or a downstream artifact.
- Prompt 2 or phase 2 requests from `references/audit-docs-validation-workflow.md` must stay limited to the skill directory, skill usage rules, routing logic, skill boundaries, output rules, template-linked consistency, and quality or evidence standards unless a minimal alignment fix is required.
- Prompt 3 or phase 3 requests may be handled in smaller batches when needed for reliability.
- Phase 3 batch 1 should stay focused on memory usage guidance, approved memory files, save-versus-do-not-save rules, and schema alignment.
- Each repeated deliverable should map to one primary skill by default, with at most one supporting skill when a clear evidence, readiness, grounding, or QA gap exists.
- Non-default skill chains must stay explicit across the main instructions, `references/skill-collision-inventory.md`, and `references/output-standards.md`.
- Memory rules must stay aligned across the main instructions, `references/agent-memory-policy.md`, the memory schemas, and `tests/memory-validation-tests.md`.

## Referenced files that must stay aligned

- `references/default-operating-mode.md`
- `references/app-usage-matrix.md`
- `references/CONNECTORS.md`
- `references/audit-docs-validation-workflow.md`
- `references/output-standards.md`
- `references/qa-standards.md`
- `references/skill-collision-inventory.md`
- `references/agent-memory-policy.md`
- `references/validation-guide.md`
- `references/instructions.snapshot.md`
- `profiles/default-support-profile.yaml`

## Validation expectation

Update this snapshot whenever the main instructions are materially rewritten so validators can check the current file references, skill inventory, attached-app coverage, and audit-workflow references against a stable markdown copy.
