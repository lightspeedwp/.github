# Contract: Reusable Workflow `qodo-pr-agent-reusable.yml`

**Feature**: [../spec.md](../spec.md) | Satisfies FR-001, FR-003–FR-006, FR-010, FR-018, FR-020, FR-021

## Location and consumption

- **Definition**: `.github/workflows/qodo-pr-agent-reusable.yml`, using `on: workflow_call`.
- **Pilot caller**: `.github/workflows/qodo-pr-agent.yml` calls `uses: ./.github/workflows/qodo-pr-agent-reusable.yml`.
- **Future consumers** call it like this:

```yaml
# .github/workflows/qodo-pr-agent.yml in a consuming repository
on:
  pull_request:
    types: [opened, reopened, ready_for_review]
  issue_comment:
    types: [created]
permissions:
  contents: read
jobs:
  qodo:
    uses: lightspeedwp/.github/.github/workflows/qodo-pr-agent-reusable.yml@<ref>
    permissions:
      contents: read
      pull-requests: write
      issues: write
    secrets:
      model_credential: ${{ secrets.ANTHROPIC_API_KEY_QODO_PR_AGENT }}
```

## Inputs

| Input | Type | Default | Meaning |
| --- | --- | --- | --- |
| `config_ref` | string | `main` | The git ref of `lightspeedwp/.github` whose `.pr_agent.toml` is loaded as `CONFIG.EXTRA_CONFIG_URL` |
| `auto_describe` | boolean | `true` | Maps to `github_action_config.auto_describe` |
| `auto_improve` | boolean | `true` | Maps to `github_action_config.auto_improve` |
| `excluded_authors` | string (JSON array) | `["dependabot[bot]","lightspeed-docs-bot[bot]"]` | PR authors that never trigger automatic runs |

There is deliberately **no** `auto_review` input. It is hard-coded to `"false"`, because FR-010 makes the automatic review verdict CodeRabbit's.

## Secrets

| Secret | Required | Behaviour when absent |
| --- | --- | --- |
| `model_credential` | no | Preflight emits `::notice::Qodo PR-Agent skipped: no model credential (fork PR or secret not configured)`, and the run concludes **success** (FR-006, FR-004) |

## Required job structure

1. **`preflight`** (runs-on `ubuntu-latest`, `timeout-minutes: 2`, `permissions: {}`). It produces `enabled` (`true`/`false`) and `reason`. It sets `enabled=false` when any of these holds:
   - `vars.QODO_PR_AGENT_ENABLED == 'false'` (kill-switch, FR-020)
   - the credential is empty
   - `pull_request`: the PR is a draft, the sender type is `Bot`, or the author is in `excluded_authors`
   - `issue_comment`: the comment is not on a PR, `author_association` is not in {`OWNER`, `MEMBER`, `COLLABORATOR`}, or the first token of the body is not in the command allow-list
2. **`run`** (`needs: preflight`, `if: needs.preflight.outputs.enabled == 'true'`, `timeout-minutes: 15`). Its steps:
   - Qodo PR-Agent: `uses: docker://pragent/pr-agent@sha256:<digest> # <version>-github_action`. **No `actions/checkout` step anywhere** in the workflow.
3. **`record`** (`needs: [preflight, run]`, `if: always()` unless the preflight reason is `not-a-command`, `bot-sender` or `not-a-pr`, `permissions: {}`). It writes the run record ([data model](../data-model.md#run-record)), with outcome `success`, `failure` or `skipped:<reason>`, to `$GITHUB_STEP_SUMMARY`, and uploads it as artefact `qodo-pr-agent-run-${{ github.run_id }}` (retention 30 days). It then calls `./.github/actions/collect-metrics` (non-blocking, and only in `lightspeedwp/.github`).
4. **Permissions**: the top level is `contents: read`. The `run` job adds `pull-requests: write` and `issues: write`, and nothing else. It does **not** get `contents: write`, because nothing is ever pushed.
5. **Concurrency**: `group: qodo-pr-agent-${{ github.event.pull_request.number || github.event.issue.number }}`, with `cancel-in-progress: false`, so a command is never cancelled by an unrelated one.

## Environment passed to the Qodo PR-Agent step

| Env var | Value |
| --- | --- |
| `GITHUB_TOKEN` | `${{ secrets.GITHUB_TOKEN }}` |
| `ANTHROPIC.KEY` | `${{ secrets.model_credential }}` |
| `CONFIG.EXTRA_CONFIG_URL` | `https://raw.githubusercontent.com/lightspeedwp/.github/${{ inputs.config_ref }}/.pr_agent.toml` |
| `github_action_config.auto_review` | `"false"` |
| `github_action_config.auto_describe` | from the input |
| `github_action_config.auto_improve` | from the input |
| `github_action_config.pr_actions` | `'["opened","reopened","ready_for_review"]'` |

Untrusted event values, such as the comment body and branch names, are passed to scripts **only** through `env:` and never interpolated into `run:`. This follows existing repository practice.

## Command allow-list

Only these commands are accepted: `/describe`, `/improve`, `/review`, `/ask`, `/update_changelog`, `/add_docs`, `/help`.

These are rejected in preflight, with `reason=command-not-allowed`: `/generate_labels`, `/similar_issue`, `/config`, `/settings` and anything else.

## Acceptance checks

These are enforced by `tests/js/qodo-pr-agent-workflow.test.js`:

- The image is referenced by `@sha256:` digest.
- No step uses `actions/checkout`.
- Explicit permissions blocks exist and match the lists above.
- The trigger types include no `synchronize` and no `pull_request_target`.
- The allow-list and author-association guard are present.
- The kill-switch variable is checked.
- `github_action_config.auto_review` is `"false"`.
- The preflight never uses `exit 1` on missing credentials.
