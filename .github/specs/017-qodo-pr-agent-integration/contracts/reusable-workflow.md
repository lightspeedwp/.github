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
      id-token: write # keyless Workload Identity Federation
    with: # keyless; omit to use the key secret only
      federation_rule_id: ${{ vars.QODO_PR_AGENT_FEDERATION_RULE_ID }}
      organization_id: ${{ vars.ANTHROPIC_ORGANIZATION_ID }}
      service_account_id: ${{ vars.QODO_PR_AGENT_SERVICE_ACCOUNT_ID }}
      workspace_id: ${{ vars.QODO_PR_AGENT_WORKSPACE_ID }}
    secrets:
      model_credential: ${{ secrets.ANTHROPIC_API_KEY_QODO_PR_AGENT }}
```

The calling job must grant `id-token: write`, because the `run` job requests it. A caller that doesn't grant it fails to start.

## Inputs

| Input | Type | Default | Meaning |
| --- | --- | --- | --- |
| `config_ref` | string | `main` | The git ref of `lightspeedwp/.github` whose `.pr_agent.toml` is loaded as `CONFIG.EXTRA_CONFIG_URL` |
| `auto_describe` | boolean | `true` | Maps to `github_action_config.auto_describe` |
| `auto_improve` | boolean | `true` | Maps to `github_action_config.auto_improve` |
| `excluded_authors` | string (JSON array) | `["dependabot[bot]","lightspeed-docs-bot[bot]"]` | PR authors that never trigger automatic runs |
| `federation_rule_id` | string | `''` | Anthropic federation rule (`fdrl_...`) for keyless authentication |
| `organization_id` | string | `''` | Anthropic organisation ID that owns the rule |
| `service_account_id` | string | `''` | Service account (`svac_...`) the rule targets |
| `workspace_id` | string | `''` | Workspace (`wrkspc_...`); needed only when the rule covers several workspaces |

The four federation inputs are identifiers, not secrets, so callers pass them from Actions variables. Federation is configured when the first three are all set.

There is deliberately **no** `auto_review` input. It is hard-coded to `"false"`, because FR-010 makes the automatic review verdict CodeRabbit's.

## Secrets

| Secret | Required | Behaviour when absent |
| --- | --- | --- |
| `model_credential` | no | If federation isn't configured either, preflight emits `::notice::Qodo PR-Agent skipped: no-credential`, and the run concludes **success** (FR-006, FR-004) |

## Credential resolution

1. **Stored key**: when `model_credential` is set, it is used, even if federation is also configured. This matches the Anthropic SDKs, where an API key outranks federation.
2. **Workload Identity Federation**: otherwise, when the federation inputs are set, the `token` step requests the job's GitHub OIDC token with audience `https://api.anthropic.com` and exchanges it at `POST https://api.anthropic.com/v1/oauth/token` (`grant_type` `urn:ietf:params:oauth:grant-type:jwt-bearer`). The returned access token is masked with `core.setSecret` and passed to Qodo PR-Agent as `ANTHROPIC.KEY`. It expires within about 10 minutes (the lesser of the rule's lifetime and twice the OIDC token's remaining life), which covers one run.
3. **Neither**: preflight skips with `no-credential`.

A failed exchange (denied rule, incomplete configuration, endpoint unreachable) uses `continue-on-error: true`. Qodo PR-Agent does not start, the run is recorded as `failure`, a notice is emitted, and the PR is not blocked. The deny reason is on the authentication history page under **Settings → Workload identity** in the Claude Console.

## Required job structure

1. **`preflight`** (runs-on `ubuntu-latest`, `timeout-minutes: 2`, `permissions: {}`). It produces `enabled` (`true`/`false`) and `reason`. It sets `enabled=false` when any of these holds:
   - `vars.QODO_PR_AGENT_ENABLED == 'false'` (kill-switch, FR-020)
   - there is no credential: no `model_credential` and no complete federation configuration
   - `pull_request`: the PR is a draft, the sender type is `Bot`, the author is in `excluded_authors`, or the head repository is a fork (`reason=fork`; forks get neither secrets nor an OIDC token)
   - `issue_comment`: the comment is not on a PR, `author_association` is not in {`OWNER`, `MEMBER`, `COLLABORATOR`}, or the first token of the body is not in the command allow-list
2. **`run`** (`needs: preflight`, `if: needs.preflight.outputs.enabled == 'true'`, `timeout-minutes: 15`). Its steps:
   - Token exchange (`id: token`, only when `inputs.federation_rule_id` is set): see [Credential resolution](#credential-resolution).
   - Qodo PR-Agent: `uses: docker://pragent/pr-agent@sha256:<digest> # <version>-github_action`. **No `actions/checkout` step anywhere** in the workflow. The step uses `continue-on-error: true`, so an invalid key, rate limit or upstream outage records `failure` and emits a notice without failing the PR (FR-006, SC-003).
3. **`record`** (`needs: [preflight, run]`, `if: always()` unless the preflight reason is `not-a-command`, `bot-sender` or `not-a-pr`, `permissions: {}`). It writes the run record ([data model](../data-model.md#run-record)), with outcome `success`, `failure` or `skipped:<reason>`, to `$GITHUB_STEP_SUMMARY`, and uploads it as artefact `qodo-pr-agent-run-${{ github.run_id }}` (retention 30 days). It then calls `lightspeedwp/.github/.github/actions/collect-metrics@<sha>` (non-blocking). It is referenced by path and SHA so it needs no checkout, and works in consuming repositories too.
4. **Permissions**: the top level is `contents: read`. The `run` job adds `pull-requests: write`, `issues: write` and `id-token: write` (used only by the token exchange), and nothing else. It does **not** get `contents: write`, because nothing is ever pushed.
5. **Concurrency**: `group: qodo-pr-agent-${{ github.event.pull_request.number || github.event.issue.number }}`, with `cancel-in-progress: false`, so a command is never cancelled by an unrelated one.

## Environment passed to the Qodo PR-Agent step

| Env var | Value |
| --- | --- |
| `GITHUB_TOKEN` | `${{ secrets.GITHUB_TOKEN }}` |
| `ANTHROPIC.KEY` | `${{ steps.token.outputs.credential \|\| secrets.model_credential }}` |
| `CONFIG.EXTRA_CONFIG_URL` | `https://raw.githubusercontent.com/lightspeedwp/.github/${{ inputs.config_ref }}/.pr_agent.toml` |
| `github_action_config.auto_review` | `"false"` |
| `github_action_config.auto_describe` | from the input |
| `github_action_config.auto_improve` | from the input |
| `github_action_config.pr_actions` | `'["opened","reopened","ready_for_review"]'` |
| every **locked** key from [pr-agent-config.md](./pr-agent-config.md) (e.g. `pr_description.publish_description_as_comment: 'true'`) | the locked value; env beats a consumer's `.pr_agent.toml` |

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
