---
file_type: feedback-response
title: AI Feedback Response — #3604
description: Tracks CodeRabbit review feedback for the merged advisory and spec 018 correction pull request
created_date: '2026-09-27'
status: active
tags:
  - ai-feedback
  - documentation
  - specs
---

# AI Feedback Response

Pull request: #3604 — corrects defects in the content merged by #3387 (plugin advisories) and #3525
(spec 018), and folds in the renumber residue and the malformed advisories table header.

Everything CodeRabbit and Qodo raised is listed below with a status. Nothing is silently
dropped: each item is either addressed in this pull request or explicitly deferred with the
place where the outstanding decision is recorded.

## Linked issues

Refs #1396

- Relates to #1396, #3524, #3525 — this pull request closes none of them.
- #3525 is merged. #3524 is still open and has not been merged; its develop merge has landed (it is level with `develop`), so the merge was not the only thing outstanding.

## Feedback

| #   | Feedback                                                                                                                                                | Status       | Response                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | FR-020 gated auto-deletion on the age of the branch's tip commit, so a branch created moments ago could be deleted inside a day                         | ✅ Addressed | **Specification text only.** FR-020 now requires a branch-age signal rather than the tip commit's age. The shipped audit is unchanged and still derives age from `lastCommitDate` at `scripts/cleanup-branches.js:317`; automatic deletion is deferred, so that code path is not reached. See item 13                                                                                                                    |
| 2   | Auto-delete used a bare `git push origin --delete` after re-checking, with a time-of-check to time-of-use window                                        | ✅ Addressed | **Specification text only.** The contract now requires the delete to be leased against the checked tip OID. The shipped delete at `scripts/cleanup-branches.js:342` is unchanged, and the `git push` behaviour itself was verified against a real bare remote: a correct lease deletes and a stale lease is rejected with the branch intact                                                                              |
| 3   | Newsletter rate limit used a `get_transient`/`set_transient` read-modify-write, so concurrent submissions lost increments and bypassed the limit        | ✅ Addressed | Counting happens in one atomic statement and the compared value is carried out of it                                                                                                                                                                                                                                                                                                                                     |
| 4   | The failure branch replaced the form while telling the visitor to try again later, so retry was impossible                                              | ✅ Addressed | Form is replaced only on success; failure reports in place and keeps the input                                                                                                                                                                                                                                                                                                                                           |
| 5   | `>= $max` blocked the third request when the limit was three                                                                                            | ✅ Addressed | Strictly greater than, so a limit of three permits three                                                                                                                                                                                                                                                                                                                                                                 |
| 6   | A failed counter read returned "not rate limited", failing open with an unlimited budget                                                                | ✅ Addressed | Refuses instead, and the docblock states it                                                                                                                                                                                                                                                                                                                                                                              |
| 7   | `fetch()` rejections were not caught and threw past the alert region                                                                                    | ✅ Addressed | Caught and reported in the same region                                                                                                                                                                                                                                                                                                                                                                                   |
| 8   | The error slot was written but never unhidden, so the message was invisible                                                                             | ✅ Addressed | `hidden` is cleared before the text is set                                                                                                                                                                                                                                                                                                                                                                               |
| 9   | `research.md` and `data-model.md` still carried the tip-commit basis after the correction                                                               | ✅ Addressed | R6 record, the data model's cleanup rule and lifecycle edge, the contract's Condition and Configuration rows, both acceptance scenarios and the 009-exception clarification all aligned                                                                                                                                                                                                                                  |
| 10  | The FR-020 test asserted the old wording, so correcting the spec broke the guard rather than the guard catching the change                              | ✅ Addressed | Updated to the corrected phrasing, plus two new assertions pinning the branch-age rule                                                                                                                                                                                                                                                                                                                                   |
| 11  | A 429 rate-limited response was reported with the address-validation message, inviting a retry that would be refused again                              | ✅ Addressed | Rate limit, rejected address and provider failure now give distinct advice                                                                                                                                                                                                                                                                                                                                               |
| 12  | Scenario 5 required "more than 24 hours" where FR-020 says "at least"                                                                                   | ✅ Addressed | Scenario matches FR-020                                                                                                                                                                                                                                                                                                                                                                                                  |
| 13  | FR-020 required a branch-age signal that no component provides, leaving the gate unsatisfiable                                                          | ✅ Addressed | **Specification text only.** Auto-approved deletion is explicitly deferred in FR-020, the contract, the data model, `research.md` and the acceptance scenario, so the spec no longer claims a gate nothing implements. No implementation work is included here: the shipped categoriser still uses `lastCommitDate` and does not establish branch-observation age, and the underlying storage decision is deferred below |
| 14  | The lifecycle diagram in `data-model.md` still asserted "tip ≥24 h old"                                                                                 | ✅ Addressed | Diagram now states the branch-age basis and the deferral, without naming a storage mechanism                                                                                                                                                                                                                                                                                                                             |
| 15  | The corrected lifecycle edge still gated entry to spec 009 categorisation on 24 hours of observation, which the deferral removes                        | ✅ Addressed | The 24-hour threshold now sits only on the deferred auto-approval rule; every empty branch reaches 009 categorisation                                                                                                                                                                                                                                                                                                    |
| 16  | The rate-limit table grew by a row per distinct address forever: the purge was missing, so the per-IP limit slowed growth without bounding it (CWE-400) | ✅ Addressed | Expired rows are deleted before each insert, the in-place reset branch is gone, and the table carries an index on `window_started` so the purge is indexed                                                                                                                                                                                                                                                               |

## Deferred

📋 Deferred: the branch-age decision itself — whether to build a first-observed-timestamp store and
amend spec 009's `age_days` contract, to find a narrower mitigation, or to leave the deferral in
place. The options are laid out on #3358, which is the spec 009 delivery vehicle. No dedicated
tracking issue exists yet because opening one needs the maintainer's approval; this entry will
link it as soon as one is created.

This deferral is what makes #13 and #1 safe to land now. Under spec 009's tip-commit basis a
branch created moments ago can be deleted within a day of being created, so shipping automatic
deletion on that basis is worse than not shipping it at all. No `claude/*` branch qualifies while
the deferral holds.

## Summary

All sixteen feedback items are addressed. One follow-up decision is deferred, and it is not one of the
sixteen: the branch-age decision, whose options are recorded on #3358 and which needs a dedicated
tracking issue the maintainer has been asked to approve. Nothing was rejected.

## Tooling notes

- Qodo could not review this pull request: the organisation is out of Qodo credits
  (`AGENT-QUOTA-EXCEEDED`). Proceeding without it rather than blocking, as agreed.
- This file is a single shared path at the repository root, so a second pull request needing a
  response overwrites the first. This one replaces the record from #3500, which merged on
  2026-09-26. A per-pull-request path would avoid the collision.
