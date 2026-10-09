# Qodo PR-Agent pilot validation

Evidence for spec 019's live and walkthrough tasks. The scenarios are defined in
[quickstart.md](../../../specs/019-qodo-pr-agent-integration/quickstart.md).

- **Pilot start date (`PILOT_START`)**: not started. Set this to the date Q-01 first passes. The
  pilot report uses it as `--since "$PILOT_START"`.
- **Credential**: the key tracked in
  [lightspeedwp/.github#3535](https://github.com/lightspeedwp/.github/issues/3535) is stored as
  an **environment** secret `ANTHROPIC_API_KEY_QODO_PR_AGENT` on the `qodo-pr-agent`
  Environment, never as a repository or organisation secret. The Environment exists, and a
  read-only check on 2026-10-02 found the repository holds no Qodo credential (T002, T042). The
  pilot stays off until `QODO_PR_AGENT_ENABLED` is set (P-3). Keyless federation was removed on
  2026-10-01 and is deliberately not configured; no job requests an OIDC token.

## Prerequisites

| #    | Item                                                                                         | Status                                                                                                                                                                                                                                                                                                                                  |
| ---- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P-1  | Dedicated key with a monthly spend limit                                                     | Key created as environment secret `ANTHROPIC_API_KEY_QODO_PR_AGENT`; US$20 monthly spend limit set on the key in the Anthropic console, confirmed by the maintainer on 2026-10-02. The repository can neither read that back nor verify it, so it must be re-confirmed on any key rotation                                              |
| P-2  | Environment secret `ANTHROPIC_API_KEY_QODO_PR_AGENT` on `qodo-pr-agent`, default branch only | Created. The Environment carries one deployment branch policy (name `develop`, type `branch`), verified read-only on 2026-10-01 and 2026-10-02. Still open under T042: a scratch pull request proving a non-`develop` ref is refused, and a `develop` run proving the key is released. Re-confirm the policy after any Environment edit |
| P-3  | Actions variable `QODO_PR_AGENT_ENABLED` is exactly `true`                                   | Not set (pilot disabled)                                                                                                                                                                                                                                                                                                                |
| P-4  | Implementation merged to `develop`                                                           | Waiting on lightspeedwp/.github#3532                                                                                                                                                                                                                                                                                                    |
| T001 | Image provenance (`gh attestation verify`)                                                   | Completed 2026-10-01. Digest `sha256:65e5b196e38cecd7df8a71fe29942052e081a0c6645132c2ac874df60b1760c7` (`0.46.0-github_action`) verified against `The-PR-Agent/pr-agent`, workflow `publish.yml@refs/tags/v0.46.0`, run 6627664820. Repeat on any digest bump                                                                           |

## US1 live scenarios (T009)

Run on a throw-away branch such as `test/qodo-pr-agent-smoke` after P-4.

| ID   | Result                                                      | Evidence |
| ---- | ----------------------------------------------------------- | -------- |
| Q-01 | Not run                                                     |          |
| Q-02 | Not run                                                     |          |
| Q-03 | Not run                                                     |          |
| Q-04 | Not run                                                     |          |
| Q-05 | Not run                                                     |          |
| Q-06 | Not run                                                     |          |
| Q-07 | Not run. Executed under T010, which records the marker text |          |
| Q-08 | Not run                                                     |          |
| Q-09 | Not run                                                     |          |
| Q-10 | Not run                                                     |          |
| Q-11 | Not run                                                     |          |
| Q-12 | Not run                                                     |          |
| Q-13 | Removed with the keyless route (no federation to check)     |          |
| Q-14 | Not run                                                     |          |

The rows match the quickstart scenarios: T009 covers Q-01 to Q-06 and Q-08 to Q-12 and Q-14, and
Q-07 belongs to T010. Q-13 was removed with the keyless route.

## Comment markers (T010)

To be copied from the Q-01 PR.

## US2 duplication review (T013)

To be filled in after five pilot PRs.

## US3 integration checks (T025)

**Local checks, 2026-09-24 (commit 97d457b7):**

- `npx jest tests/js/qodo-pr-agent-integrations.test.js`: 18 of 18 pass.
- `npm run validate:agents` fails only on `agents/mode-thinking.agent.md`, which this feature doesn't
  touch.
- `npm run validate:frontmatter` reports invalid frontmatter in `agents/labeling-agent/AGENT.md`,
  `agents/reviewer-agent/AGENT.md` and others. These errors are already on `develop`, and this
  feature's edits start below each file's frontmatter.
- `markdownlint` on every Markdown file changed by the feature: 0 issues.

**Local checks re-run, 2026-10-01 (commit dd90f420):**

- `npx jest tests/js/qodo-pr-agent-integrations.test.js`: 19 of 19 pass. All six Qodo PR-Agent
  suites: 213 of 213.
- `npm run validate:agents` still fails only on `agents/mode-thinking.agent.md`, which this feature
  doesn't touch.
- `npm run validate:frontmatter`: three of the files this feature changes are reported
  (`FEEDBACK_RESPONSE.md`, `agents/pr-agent/AGENT.md`, `docs/AI_FEEDBACK_SYSTEM_SUMMARY.md`). Each
  error is in a frontmatter field this feature doesn't change, so it is already on `develop`.
- `markdownlint` on every linted Markdown file changed by the feature: 0 issues in 21 files.

**Local checks re-run, 2026-10-09 (head 5667be58, Node 22 with the engine check relaxed):**

- `npx jest -c .jest.config.cjs tests/js/qodo-pr-agent`: all seven Qodo PR-Agent suites pass,
  413 of 413 tests. This replaces the six-suite, 213-test figure above, which predates the
  adapter and report-CLI suites.
- `npm run validate:skills` and `npm run validate:workflows` pass, and branch-name validation
  passes for `aiops/qodo-pr-agent-integration`.

**Key unset, 2026-10-01:** the shared skill was run with no credential in the environment:

| Command                                                                  | Result                              |
| ------------------------------------------------------------------------ | ----------------------------------- |
| `run-qodo-pr-agent.sh review --diff-file <diff>`                         | `skipped` / `no-credential`, exit 0 |
| `run-qodo-pr-agent.sh ask --diff-file <diff> --question "What changed?"` | `skipped` / `no-credential`, exit 0 |
| `run-qodo-pr-agent.sh review --pr-url <#3532>`                           | `skipped` / `no-credential`, exit 0 |

So callers get the normalised skipped result they fall back on, not an error.

**Key set:** not run. It needs the pilot live, or a maintainer running the skill locally with the
key. T025 stays open until this is recorded.

## US4 opt-in walkthrough (T027)

Needs a second maintainer.
