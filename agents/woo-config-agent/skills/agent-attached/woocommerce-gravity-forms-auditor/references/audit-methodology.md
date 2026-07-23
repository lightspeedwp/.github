# Audit methodology

## Evidence-first review

Start with source and site evidence, then findings. Keep a clear split between confirmed facts, partial evidence, assumptions, missing evidence, and recommendations.

## Read-only MCP operation

Use the MCP connector only for reading. Discover capabilities first. Avoid write-capable actions. If a tool name implies a write, update, delete, send, submit, enable, disable, create, duplicate, publish, or reprocess operation, do not call it in this skill.

## Confidence levels

- High: directly verified by MCP/read-only export/official source/page evidence.
- Medium: supported by partial but incomplete evidence.
- Low: not directly verified, inferred, or based on a LightSpeed recommendation.

## Severity model

- Blocker: form cannot be trusted for production, submission, payment, user creation, privacy, accessibility, or business-critical lead capture.
- High: likely lost leads, inaccessible journey, privacy/security exposure, broken payment/user-registration/feed risk, or broken routing.
- Medium: important quality, reliability, maintainability, or UX issue that should be fixed soon.
- Low: minor improvement, tidy-up, or future optimisation.
- Info: observation, context, limitation, or optional recommendation.

## Priority model

Prioritise by severity, confidence, affected journey, likelihood, business impact, user impact, fix effort, reversibility, and dependencies. Separate blockers, high-priority fixes, quick wins, medium-term fixes, deferred recommendations, and not assessed items.

## Client-safe versus internal notes

Internal reports may name connector capabilities, internal owners, exact logs, and remediation dependencies. Client-safe summaries must remove secrets, licence details, raw logs, private entries, and internal tool/action names.

## Retest methodology

Retest only with approved safe evidence. In auditor mode, review post-change evidence, screenshots, settings exports, logs, metadata, and page behaviour. Do not submit entries unless the environment and user explicitly define safe test submission.

## Handoff methodology

For every actionable finding, create a handoff item that names the finding, target object, evidence, recommended fix, risk level, required capability, approval needed, validation checklist, rollback note, and suggested `woocommerce-gravity-forms-configuration` prompt.
