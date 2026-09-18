---
name: lightspeed-linear-label-governance
description: enforce LightSpeed's canonical family-prefixed label policy when reviewing, drafting, triaging, routing, or updating Linear issues and linked GitHub pull requests. use for label recommendations, label audits, taxonomy validation, legacy-label detection, or pre-write checks; do not use for broad project status work or taxonomy cleanup that the user has not requested.
---

# LightSpeed Linear Label Governance

## Purpose

Apply the LightSpeed organization-wide label policy consistently to Linear issues and linked GitHub pull requests. Require exact `family:value` names from the canonical `.github/labels.yml`, detect incomplete or conflicting label sets, and surface taxonomy-sync gaps without inventing labels or silently cleaning records.

## Decision Flow

1. Confirm the target is a Linear issue, a linked GitHub PR, or a label-policy audit.
2. Read `references/governance-rules.md` for the source order and required combinations.
3. Inspect the minimum relevant evidence: current labels on the target, live Linear label availability, and the current canonical label file when exact names matter.
4. Classify the request as review-only, recommendation, or explicit write.
5. Validate syntax, canonical membership, family cardinality, and entity-specific requirements.
6. Return the smallest useful result using `references/output-templates.md`.
7. Before any write, state the affected records, proposed label changes, and reason. Continue only when the user's request authorizes that write.

## Workflow

### Inspect

- Treat every label as invalid for this policy unless its displayed name is an exact lower-case `family:value` label in the current canonical set.
- Do not treat a Linear label group or parent as a substitute for the prefix. For example, `Bug` under a `Development` group does not satisfy `type:bug`.
- Fetch live Linear labels to verify availability when tools permit. A canonical label missing from Linear is a taxonomy-sync gap, not permission to use a legacy substitute.
- Fetch the current `develop` version of `.github/labels.yml` when the decision depends on exact membership. Use attached or bundled mirrors only when live access is unavailable, and disclose that limitation.

### Validate

- Reject bare labels (`bug`), bracketed labels (`[Type] Bug`), slash-form labels (`type/bug`), padded forms (`type: bug`), mixed-case forms (`Type:Bug`), and unapproved aliases.
- Require exactly one `type:*`, one `status:*`, and one `priority:*`.
- Require at least one `area:*` or `comp:*`.
- Permit additional canonical context, meta, contributor, environment, compatibility, release, language, content-type, AI Ops, and discussion families as relevant.
- For PRs, require exactly one of `meta:needs-changelog` or `meta:no-changelog`.
- For user-facing or shipping PRs, require exactly one canonical `release:*` label.
- Treat duplicates within the same one-hot family as conflicts, even if every label is canonical.
- Run `scripts/validate_labels.py` when a deterministic check will improve confidence.

### Recommend

- Recommend only exact labels found in the current canonical set and available in live Linear.
- If the best canonical label is not available in Linear, report the missing label and recommend taxonomy synchronization. Do not fall back to an unprefixed or approximate label.
- If no canonical label expresses the needed meaning, recommend a governance request to add it to `.github/labels.yml`; do not invent the label in Linear.
- Separate observed labels, validation findings, and proposed changes.
- Prefer one concise recommended label set over a menu of speculative options.

### Write Guardrail

- Default to read-only analysis and recommendations.
- Never delete, merge, bulk-edit, rename, or reorganize labels merely because a mismatch is visible.
- Before an authorized write, summarize the exact additions and removals, affected Linear records, and rationale.
- Stop and ask for direction when a proposed change would alter the canonical taxonomy, affect many records, or conflict with live workflow rules.

## Source Guidance

Use this order for labeling decisions:

1. The user's current explicit instruction for scope and exceptions.
2. The current `.github/labels.yml` on `develop` for canonical label names.
3. Live Linear for label availability and currently applied labels.
4. The supporting governance documents for interpretation and examples.
5. Durable workspace memory and attached mirrors as fallback context.

If sources conflict, preserve the canonical rule and report the operational mismatch. See `references/governance-rules.md` for source URLs and conflict handling.

## Output Requirements

Return a compact label-governance result containing:

- target and mode;
- observed labels;
- compliance status;
- violations or taxonomy-sync gaps;
- one recommended canonical label set;
- proposed additions/removals when requested;
- a write-guardrail note only when a write is in scope.

Do not claim an issue or PR is compliant unless the exact labels and required combinations were validated.

## Validation

Before finishing:

- Confirm every proposed label includes a family prefix.
- Confirm every proposed label exists in the current canonical file.
- Confirm live Linear availability, or explicitly report that it was not verified.
- Confirm one-hot families and `area:*`/`comp:*` coverage.
- Confirm PR changelog and release requirements when applicable.
- Confirm no automatic cleanup or write exceeded the user's authorization.
- Use `references/qa-rubric.md` for forward tests and grading.

## References

- Read `references/governance-rules.md` for authoritative rules, source URLs, and conflict handling.
- Read `references/output-templates.md` before producing an audit, recommendation, or pre-write summary.
- Read `references/qa-rubric.md` when testing or revising this skill.
- Run `scripts/validate_labels.py --help` for deterministic label-set validation.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
