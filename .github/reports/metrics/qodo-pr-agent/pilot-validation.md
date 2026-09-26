# Qodo PR-Agent pilot validation

Evidence for spec 017's live and walkthrough tasks. The scenarios are defined in
[quickstart.md](../../../specs/017-qodo-pr-agent-integration/quickstart.md).

- **Pilot start date (`PILOT_START`)**: not started. Set this to the date Q-01 first passes. The
  pilot report uses it as `--since "$PILOT_START"`.
- **Credential**: the repository secret `ANTHROPIC_API_KEY_QODO_PR_AGENT` was provisioned on
  2026-09-24 ([lightspeedwp/.github#3535](https://github.com/lightspeedwp/.github/issues/3535)).
  Keyless federation isn't configured.

## Prerequisites

| # | Item | Status |
| --- | --- | --- |
| P-1 | Dedicated key with a monthly spend limit | Key created; spend limit not yet confirmed |
| P-2 | Secret `ANTHROPIC_API_KEY_QODO_PR_AGENT` | Done (repository secret) |
| P-3 | `QODO_PR_AGENT_ENABLED` unset or not `false` | Not checked |
| P-4 | Implementation merged to `develop` | Waiting on lightspeedwp/.github#3532 |
| T001 | Image provenance (`gh attestation verify`) | Not run |

## US1 live scenarios (T009)

Run on a throw-away branch such as `test/qodo-pr-agent-smoke` after P-4.

| ID | Result | Evidence |
| --- | --- | --- |
| Q-01 | Not run | |
| Q-02 | Not run | |
| Q-03 | Not run | |
| Q-04 | Not run | |
| Q-05 | Not run | |
| Q-06 | Not run | |
| Q-08 | Not run | |
| Q-09 | Not run | |
| Q-10 | Not run | |
| Q-11 | Not run | |
| Q-12 | Not run | |
| Q-13 | Not applicable (federation not configured) | |

Q-03, Q-04, Q-08 and Q-12 aren't assigned to T009 yet (`/speckit-analyze` finding G1), but they're
listed here so they get run in the same pass.

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

**Live checks (key set and unset):** not run. They need the pilot live, or a maintainer running the
skill locally with the key.

## US4 opt-in walkthrough (T027)

Needs a second maintainer.
