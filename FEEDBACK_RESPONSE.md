---
file_type: feedback-response
title: AI Feedback Response — #3500
description: Tracks CodeRabbit and Qodo review feedback for the 014/016/017 specification pull request
created_date: '2026-09-26'
status: active
tags:
  - ai-feedback
  - documentation
  - specs
---

# AI Feedback Response

Pull request: #3500 — adds specs 016 and 017, updates spec 014, and extends the specification catalogue.

All feedback items addressed in this pull request are listed below. Feedback that is not fixed
here is either deferred to a tracked follow-up issue or explicitly rejected with evidence;
nothing is silently dropped.

## Linked issues

Closes #3465

- Relates to #3464, #3434 (epic and originating refactor, not completed by this pull request)
- Deferred follow-ups: #3519, #3522

## Feedback

| Feedback | Status | Response | Reference |
| --- | --- | --- | --- |
| One error-object contract across the specifications: `ErrorObject` was mixed with `ValidationError`, and `error_code`/`error_type`/`type` and `expected_format`/`actual_value`/`current_value` diverged between files | ✅ Addressed | One name (`ErrorObject`) and one field set (`error_code`, `message`, `entry_id`, `line_number`, `field`, `expected_format`, `actual_value`, `suggestion`, `severity`) across `data-model.md`, `spec.md`, `research.md` and the REST contract. `spec.md` and FR-005 were the missed spots and now name the canonical fields | `23cf74620c`, `4c11647bff` |
| Merged-state validation applied to issue references as well as pull requests; issues have no merged state | ✅ Addressed | `data-model.md` requires a linked pull request to exist and be merged, and requires an issue only to exist, stating that an issue has no merged state. The business rule is scoped to pull-request references | `23cf74620c` |
| Branch-type bypass for `chore/` and `deps/` prefixes, which the shipped gate does not implement | ✅ Addressed | `changelog-unified.yml` skips Dependabot and docs-bot authors, docs-only diffs, and the `meta:no-changelog` label. FR-009, Q1, `research.md` and the decision table now match it and state that branch prefix is not a bypass | `4af8501b79` |
| Specification required changelog labels that do not exist: `meta:has-changelog`, `meta:needs-changelog-fix`, `meta:changelog-exempt` | ✅ Addressed | The canonical set has only `meta:needs-changelog` and `meta:no-changelog`. Because `.github/labels.yml` is locked, the specification was corrected rather than the labels: passing validation clears `meta:needs-changelog`, failing keeps it | `4af8501b79` |
| `pr_issues` accepted `PR-456`, but the engine matches only `/#(\d+)/` so such an entry is reported missing | ✅ Addressed | `data-model.md` records `#123` as the only machine-validated form, keeps `PR-456` as a human-readable convention, and states that a full markdown URL is what makes it checkable. The acceptance scenario no longer promises a format the tool rejects | `07cf08f282` |
| Specification 017 quickstart ran `node .github/validation/changelog/validator.js`, which does not exist | ✅ Addressed | Corrected to `node .github/validation/changelog/bin/validate.js --changelog-path CHANGELOG.md --output text`; the command was executed and runs | `07cf08f282` |
| Specification 017 quickstart ran `npm run validate:mermaid` and `npm run validate:agent-spec`, neither of which exists in `package.json` | ✅ Addressed | Both are marked as not yet defined, and the summary block separates the defined scripts from the missing ones | `b27885990b` |
| Specification 017 comment template shipped a previous pull request's measurements (48/54 entries, 88.9%, "within 48 hours", Q4 2026) as reusable facts | ✅ Addressed | All 15 figures are now `{{placeholders}}` under a warning that every number must be recomputed, because a stale count presented as a measurement is worse than no comment | `b27885990b` |
| Specification 017 comment template still hardcoded audit conclusions after the figures were placeholdered: "implementation is clean", confidence HIGH, "ready for merge", a fixed six-category count, and PR #3367-specific instructions | ✅ Addressed | The conclusions are placeholders too, so the body asserts nothing: 25 `{{placeholders}}` now cover counts, verdicts, confidence, merge readiness and the approval section. The warning was widened to state that verdicts must be derived from evidence, not carried over. Only the historical "Usage Context" line still names PR #3367 | this commit |
| Specification 014 registry schema accepted invalid skill metadata: no object schema set `additionalProperties: false`, so misspelled fields such as `complianceViolations` and `agentskills_compliant_typo` validated cleanly | ✅ Addressed | `additionalProperties: false` added to all eight object schemas. Reproduced five invalid documents passing before the change; confirmed afterwards that three well-formed registry shapes still validate and the misspelled cases are rejected | `b27885990b` |
| Specification 017 quickstart invokes a missing root script: `npm run validate:changelog` reportedly undefined, so the documented command fails before validation runs | ❌ Rejected | Not reproducible. `validate:changelog` is defined in the root `package.json` (line 103) as `node scripts/validation/validate-changelog-safety.js`, and running it from the root exits 0 with real output (7 versions, 624 entries). 77 scripts are defined in total. Separately worth noting: the root alias targets the safety audit, while the engine spec 016 builds on is `.github/validation/changelog/bin/validate.js`; which one the alias should invoke is a spec 016 design question, not a broken quickstart | — |
| Further prose-level design findings in specifications 016 and 017 raised on repeat review rounds | 📋 Deferred | Three full review rounds produced a new variant of the same prose findings each time on a documentation-only pull request, so no further changes were made. Tracked for a dedicated documentation pass | #3519 |
| The stricter 014 registry schema is not enforced at runtime, because the validator does not read the loaded schema | 📋 Deferred | The schema contract is now correct, but making the validator consume it is a code change outside this documentation-only pull request | #3522 |

## CodeRabbit CLI review

Ran the prompt the review comments suggest, following the documented agent
workflow in `https://docs.coderabbit.ai/cli/overview`:

- `coderabbit review --agent --base develop` (pass 1) — 19 files reviewed, 10
  findings (9 major, 1 minor). All 10 addressed.
- `coderabbit review --agent --base develop` (pass 2) — 10 further findings.

Per that guidance, "Only run the loop twice", no further review loop runs here.
The pass-2 findings were then routed to their existing trackers rather than
re-fixed in this pull request:

- Five were the same defects already listed in #3519, re-raised against the
  corrected prose: inconclusive classifications, category verdicts in the comment
  template, the wrong comparison branch, losing the file type when linting, and
  posting the comment without re-verification.
- The `CHANGELOG.md` docs-only bypass, limiting automatic labelling to
  non-exemption labels, running one validator on both branches, and testing the
  shipped workflow rather than a local simulation were appended to #3519 as new
  checklist items.
- The generated performance fixture is covered by #3498 and PR #3499, which stops
  tests writing into the repository.

The reason the tail does not converge is that specifications 016 and 017 describe
a system that has not been built: there is no implementation to check a claim
against, so each pass raises further questions about hypothetical behaviour.
#3519 and #3470 are the right home for those decisions, which is where they now
sit.

Two pass-2 findings are worth acting on independently of the loop:

- `FR-009` retains a docs-only bypass that exempts a pull request changing only
  `CHANGELOG.md`, because the shipped gate accepts any file ending in `.md`. The
  specification now states the precedence and names the gap; closing it is a
  change to `changelog-unified.yml`, not to this documentation.
- `scripts/automation/__tests__/performance/results-phase-2b.json` is a generated
  test artefact whose timestamps CodeRabbit read as inconsistent with its results.
  It is regenerated by the suite and is not edited here.

## Completeness

- All feedback items addressed in this pull request are recorded above with the commit that fixed them.
- Remaining feedback is tracked in #3519 and #3522, both open.
- All feedback is addressed or explicitly deferred; nothing was silently dropped.

## Verification

- Full Jest suite: 285 suites, 5651 passed, 14 todo, 0 failed.
- `additionalProperties: false` change verified by validating documents against the schema before and after.
- `node .github/validation/changelog/bin/validate.js` executed to confirm the corrected quickstart command runs.
- Every changelog label named in the specifications exists in `.github/labels.yml`.
