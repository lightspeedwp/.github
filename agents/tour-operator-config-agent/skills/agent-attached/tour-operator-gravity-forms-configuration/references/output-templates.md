# Output templates and evidence posture

## Evidence posture

Every substantial output must separate confirmed facts, assumptions, missing inputs, recommended defaults, risks, required approvals, and next actions. Do not mix internal handoff notes with customer-facing wording unless requested.

## Select the output

- Use `templates/preflight-report.md` for read-only audits, launch checks, readiness checks, and connector capability reviews.
- Use `templates/configuration-plan.md` for new forms, proposed edits, feed changes, conditional logic, notifications, confirmations, and implementation plans.
- Use `templates/change-summary.md` after approved changes have been applied.
- Use `templates/test-report.md` after QA or test submissions.
- Use `templates/handoff-note.md` when handing work to another agent, developer, support teammate, client manager, or future maintainer.

## Minimum sections for any output

1. Goal and context.
2. Confirmed facts.
3. Assumptions or missing inputs.
4. Recommended configuration or finding.
5. Risk and approval notes.
6. Validation or testing notes.
7. Next action.

## Tone and length

Keep outputs concise and operational. Use tables only when they improve scanability. Prefer practical checklists over long explanations. Label anything that depends on unverified connector access as unconfirmed.

## Customer-facing wording

Only draft customer-facing wording when explicitly requested. Keep customer-facing copy separate from internal notes, and avoid unsupported commitments about delivery time, privacy, compliance, payments, availability, or integration behaviour.
