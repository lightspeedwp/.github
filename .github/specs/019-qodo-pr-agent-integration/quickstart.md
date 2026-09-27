# Quickstart & Validation: Qodo PR-Agent Pilot

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This guide proves the feature works end to end on `lightspeedwp/.github`. The expected values come from the [contracts](./contracts/); they are not repeated here.

## Prerequisites

| # | Item | Who |
| --- | --- | --- |
| P-1 | A dedicated Anthropic API key with a monthly spend limit set in the Anthropic console | @ashley |
| P-2 | Organisation secret `ANTHROPIC_API_KEY_QODO_PR_AGENT`, repository access **selected → `lightspeedwp/.github`**. **Or, keyless:** a Workload Identity Federation issuer, service account and rule in the Claude Console, with the Actions variables `QODO_PR_AGENT_FEDERATION_RULE_ID`, `ANTHROPIC_ORGANIZATION_ID` and `QODO_PR_AGENT_SERVICE_ACCOUNT_ID` (see `docs/QODO_PR_AGENT.md` → Credential and spend). In that case the spend limit in P-1 is set on the service account's workspace. | @ashley |
| P-3 | Actions variable `QODO_PR_AGENT_ENABLED` is unset, or anything other than `false` | Maintainer |
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
| Q-06 | Temporarily set the secret to an invalid value (or test on a fork PR) | The check is green, with a notice in the run summary. The PR isn't blocked. | US1 AS4/AS5, FR-006, SC-003 |
| Q-07 | Inspect a Qodo PR-Agent comment body | Record the exact header or marker text in `docs/QODO_PR_AGENT.md`, under "Recognising Qodo PR-Agent feedback" | FR-016, R10 |
| Q-08 | Comment `/update_changelog` | A proposal appears as a **comment**, with no commit. Run it through the changelog agent's validation: pass, or reject naming the rule. | US3 AS4, FR-009 |
| Q-09 | Check the run log for the loaded config | The log shows `extra_config_url` loaded from `raw.githubusercontent.com/lightspeedwp/.github/<ref>/.pr_agent.toml` | R3 (verify in pilot) |
| Q-10 | Set `QODO_PR_AGENT_ENABLED=false`, then open a PR | Preflight skips with `kill-switch`, and no runs start. Afterwards, unset the variable. | US5 AS2, SC-007 |
| Q-11 | A comment command from a non-member account (or check via a test) | Skipped with `author-not-allowed` | Spec assumption, R5 |
| Q-12 | Open a PR over 25 files or 800 lines | The output notes clipped content, and the run doesn't fail | Edge case |
| Q-13 | Keyless only: with the key secret unset and the federation variables set, open a PR | The token step succeeds and Q-01's comments appear. This proves Qodo PR-Agent accepts the exchanged `sk-ant-oat01-` token as its key. If the token step passes but the Qodo step fails with an authentication error, the token is not accepted in the `x-api-key` header: fall back to the key secret and record the finding. | FR-002, R4 |

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
