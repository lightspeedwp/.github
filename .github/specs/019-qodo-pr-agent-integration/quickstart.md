# Quickstart & Validation: Qodo PR-Agent Pilot

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This guide proves the feature works end to end on `lightspeedwp/.github`. The expected values come from the [contracts](./contracts/); they are not repeated here.

## Prerequisites

| # | Item | Who |
| --- | --- | --- |
| P-1 | A dedicated Anthropic API key with a monthly spend limit of US$20 set in the Anthropic console (spec SC-008). Set on the key in the console by a maintainer and confirmed on 2026-10-02; the repository cannot verify or read it back, and it must be re-confirmed on any key rotation | @ashley |
| P-2 | Environment secret `ANTHROPIC_API_KEY_QODO_PR_AGENT` on the `qodo-pr-agent` Environment, whose deployment branch policy admits the single bare pattern `develop`, with no required reviewers. **Corrected 2026-10-02**: this also listed `refs/heads/develop`, which the Environment does not have; read-only on 2026-10-01 the policy is one rule, name `develop`, type `branch`. A repository or organisation secret does not work. A repository that opts in later creates its own Environment. See `docs/QODO_PR_AGENT.md` → Credential and spend. The spend limit in P-1 is set on whichever key is in use. | @ashley |
| P-3 | Actions variable `QODO_PR_AGENT_ENABLED` is set to `true`, only after P-1's spend limit is confirmed. Unset or any other value keeps the pilot off. | Maintainer |
| P-4 | The implementation PR is merged to `develop`, because upstream reads `.pr_agent.toml` from the default branch | Maintainer |

## Local checks (before merge)

```bash
npm ci
npx jest tests/js/qodo-pr-agent-config.test.js tests/js/qodo-pr-agent-workflow.test.js tests/js/qodo-pr-agent-integrations.test.js
npm run validate:workflows && npm run lint:workflows
npm run validate:skills && npm run lint:md
npx actionlint .github/workflows/qodo-pr-agent*.yml   # or rely on the workflow-lint job
```

Expected: every command exits 0.

Skill smoke test (needs Docker or Python ≥ 3.12, plus a key):

```bash
git diff origin/develop...HEAD > /tmp/pr.diff
skills/qodo-pr-agent/scripts/run-qodo-pr-agent.sh review --diff-file /tmp/pr.diff
```

Expected: JSON with `"status": "ok"` and non-empty `markdown`. Nothing is posted to GitHub.

Run it again with the key unset. Expected: `"status": "skipped"`, `"reason": "no-credential"` and exit code 0.

## Pilot scenarios (after merge)

Use a throw-away branch such as `test/qodo-pr-agent-smoke`, with a small real change.

| ID | Action | Expected outcome | Covers |
| --- | --- | --- | --- |
| Q-01 | Open a **non-draft** PR | Within 10 min, one persistent description **comment** and one improvement-suggestions comment appear. The PR body and title are unchanged. There is no Qodo review verdict and no new labels. | US1 AS1, FR-010, FR-012, FR-008, SC-001 |
| Q-02 | Comment `/ask What does this change affect?` as a member | A reply is posted on the PR | US1 AS2 |
| Q-03 | Comment `/review` as a member | An on-demand review is posted with no effort or security labels | Matrix, FR-008 |
| Q-04 | Comment `/generate_labels`, then `/similar_issue` | Preflight skips with `command-not-allowed`, and nothing is posted by Qodo PR-Agent | Matrix, R5, R8 |
| Q-05 | Open a **draft** PR, then mark it ready | Nothing while it's a draft. It runs once on ready-for-review. | US1 AS3 |
| Q-06 | (a) Temporarily set the environment secret to an invalid value and open a PR. (b) Open a PR from a fork. | (a) The receiver runs, the Qodo PR-Agent step fails with a notice in the run summary, the outcome is recorded as `failure`, and the PR isn't blocked. (b) The trigger skips with `fork` and publishes no request, so the receiver runs no tool and posts nothing; the PR isn't blocked. | US1 AS4/AS5, FR-006, SC-003 |
| Q-07 | Inspect a Qodo PR-Agent comment body | Record the exact header or marker text in `docs/QODO_PR_AGENT.md`, under "Recognising Qodo PR-Agent feedback" | FR-016, R10 |
| Q-08 | Comment `/update_changelog` | A proposal appears as a **comment**, with no commit. Run it through the changelog agent's validation: pass, or reject naming the rule. | US3 AS4, FR-009 |
| Q-09 | Check the run log for the loaded config | The log shows `extra_config_url` loaded from `raw.githubusercontent.com/lightspeedwp/.github/<ref>/.pr_agent.toml` | R3 (verify in pilot) |
| Q-10 | Set `QODO_PR_AGENT_ENABLED=false` (or delete it), then open a PR | The receiver's preflight skips with `kill-switch`, so no credential-bearing `run` job and no Qodo PR-Agent container starts. Afterwards, set it back to `true`. | US5 AS2, SC-007 |
| Q-11 | A comment command from a non-member account (or check via a test) | Skipped with `author-not-allowed` | Spec assumption, R5 |
| Q-12 | Open a PR whose diff exceeds the token budget set by `max_model_tokens` in `.pr_agent.toml` (currently 64,000 tokens, so on the order of hundreds of files or several thousand lines — **not** a 25-file or 800-line PR) | The output carries the `...(truncated)` marker, and the run doesn't fail | Edge case |
| Q-14 | Comment `/review --config.model=anthropic/claude-haiku-4-5-20251001` as a member | Preflight skips with `arguments-not-allowed`, and nothing is posted by Qodo PR-Agent | FR-007, FR-011, locked keys |
| Q-13 | Removed 2026-10-01 with the keyless route (T038/T039). There is no federation check to run, because no job requests an OIDC token. | Not applicable. | Removed with T038 |

## Integration checks (US3)

For each in-scope row of the [responsibility matrix](./contracts/responsibility-matrix.md#integration-points-us3):

1. Run the named agent or skill against the Q-01 PR with the key set. Its output must reflect the Qodo PR-Agent input.
2. Run it again with the key unset. It must complete and state `Qodo PR-Agent input skipped: no-credential`.

Record the results in the pilot report (SC-005).

## Opt-in guide walkthrough (SC-006)

A second maintainer reads `docs/QODO_PR_AGENT.md` → "Enable in another repository", and checks each step against a non-`.github` repository **without enabling it**. They should find that every prerequisite, file, secret scope and override rule is stated. Any gap is fixed before the feature closes.

## Pilot report (after 14 days)

```bash
# PILOT_START is the date Q-01 first passed (recorded in pilot-validation.md),
# so the report covers the whole pilot window rather than a fixed date.
PILOT_START=YYYY-MM-DD
node scripts/metrics/qodo-pr-agent-report.cjs --since "$PILOT_START" --out .github/reports/metrics/qodo-pr-agent/
```

Expected: `pilot-report-YYYY-MM-DD.md`, with runs per tool, failures, skipped reasons, estimated spend (cross-checked against the Anthropic console) and the usefulness survey result (SC-004, SC-008).

**Corrected 2026-10-02.** Q-12 previously used a 25-file, 800-line fixture. `large_patch_policy = "clip"` clips the diff against `max_model_tokens` (64,000 here), so that fixture is roughly an order of magnitude under the threshold and the run clips nothing — the check could only ever have passed vacuously. The fixture now states the budget it must exceed, and a test asserts it still matches `.pr_agent.toml`.
