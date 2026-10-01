# Contract: Reusable Workflow `qodo-pr-agent-reusable.yml`

**Feature**: [../spec.md](../spec.md) | Satisfies FR-001, FR-003–FR-006, FR-010, FR-018, FR-020, FR-021

## Location and consumption

- **Definition**: `.github/workflows/qodo-pr-agent-reusable.yml`, using `on: workflow_call`.
- **Pilot receiver**: `.github/workflows/qodo-pr-agent.yml` (`Qodo PR-Agent • Pilot`) is the privileged half. It triggers on `workflow_run` and `workflow_dispatch`, and inlines the privileged run rather than calling the reusable workflow, so the pilot has no `./` reference that a pull request could repoint.
- **Pilot trigger**: `.github/workflows/qodo-pr-agent-trigger.yml` (`Qodo PR-Agent • Trigger`) is the unprivileged half. It triggers on `pull_request` and `issue_comment`, holds no secret and grants no write scope, and publishes a request hint as artefact `qodo-pr-agent-signal`.
- **Future consumers** copy both files and call the reusable workflow from their privileged receiver.

## Security contract a caller must satisfy

A caller breaks the CWE-200 boundary, and is rejected at review, if it does all of the following:

1. **Its privileged half is reached by a trigger GitHub evaluates on the default branch.** `workflow_run` reads the definition from the default branch, so a pull request author cannot change the privileged file. `workflow_dispatch` runs the definition from the **selected** ref, so it is safe only in combination with point 3: the environment's deployment branch policy gates the run job, and a dispatch from a ref the policy does not admit cannot start that job. `pull_request`, `pull_request_review` and `pull_request_review_comment` must never trigger the privileged half, because GitHub reads the definition from the pull request. Verified on a scratch pull request: a `pull_request` run reported `workflow_ref` of `refs/pull/<n>/merge` and had a repository secret present in its secret context.
2. **The credential is an `environment` secret, and the `run` job references that environment.** A repository secret is reachable from a same-repository `pull_request` run, because GitHub passes repository secrets to those runs. Only an environment secret can be withheld.
3. **The environment's deployment branch policy admits the default branch only**, and must not admit `refs/pull/*/merge`. The rule is matched against the run's `GITHUB_REF`; for a `pull_request` run that is `refs/pull/<n>/merge`, so the policy fails closed and the job never starts.
4. **No job holds `id-token` set to `write`**, so the third-party container has no OIDC capability.

The pilot satisfies all four. Two of them are repository settings rather than files, and are listed in [the pilot's trust-boundary documentation](../../../docs/QODO_PR_AGENT.md#what-limits-who-can-run-the-pilot): the environment's deployment branch policy, and the fact that the boundary is exactly the authority to merge to `develop`.

## Why not `pull_request_target`

`pull_request_target` would also give a default-branch definition. It is not used, for two reasons that are independent of the unsafe-checkout pattern:

- **The event is being withdrawn for public repositories.** GitHub adds a default Actions event policy that blocks `pull_request_target` in public repositories, in evaluate mode now and enforced from 2026-11-02. This repository is public, and the documented exception set is private/internal repositories and a pre-existing applicable policy, with no fork-versus-same-repository carve-out. Adopting it would buy a boundary with a five-week shelf life, and the opt-out is itself a settings change that would need revisiting.
- **The unsafe-checkout objection does not apply here, and never did.** Neither the pilot nor the proposed design uses `actions/checkout`, and `actions/checkout` v7 refuses fork pull request code under `pull_request_target` and `workflow_run` unless `allow-unsafe-pr-checkout` is set, while stating that same-repository pull requests are unaffected. The original R6 reasoning cited the upstream warning against checking out code under `pull_request_target`; that warning is about the checkout, and the pilot checks out nothing, so the live reason for the exclusion was always the event's withdrawal. That remains correct, so the exclusion STANDS, and `workflow_run` is the design that meets the same goal within it.

`workflow_run` carries one obligation the pilot already meets: artefacts uploaded by the triggering workflow are untrusted data. The trigger uploads a hint; the receiver re-derives every eligibility fact from the API and never executes the hint.

## Inputs

| Input | Type | Default | Meaning |
| --- | --- | --- | --- |
| `pr_number` | string | (required) | The pull request the caller analysed. Re-read from the API before any tool runs. |
| `command` | string | `''` | An allow-listed command, or empty for the automatic summary and suggestions path. |
| `decision_reason` | string | `ok` | The caller's own decision, recorded verbatim. Anything other than `ok` is a skip. |
| `excluded_authors` | string (JSON array) | `["dependabot[bot]","lightspeed-docs-bot[bot]"]` | PR authors that never trigger automatic runs. The API-confirming step parses the array and adds the valid entries to the default list; a non-array value or a parse failure falls back to the defaults. |
| `auto_describe` | boolean | `true` | Maps to `github_action_config.auto_describe` |
| `auto_improve` | boolean | `true` | Maps to `github_action_config.auto_improve` |
| `environment_name` | string | `qodo-pr-agent` | The Environment whose deployment branch policy gates the key. Named so consuming repositories can use their own. |

There is deliberately **no** federation input, and there is deliberately **no** `config_ref` input. The `config_ref` input was removed on 2026-10-01: it made the ref that supplies `.pr_agent.toml` a caller-supplied value, and PR-Agent's own `--config-branch` indirection means a value derived from an event would let a pull request author supply their own configuration. The ref is now the constant `develop`, and PR-Agent independently reads `.pr_agent.toml` from the repository's default branch by default.

There is deliberately **no** `auto_review` input. It is hard-coded to `"false"`, because FR-010 makes the automatic review verdict CodeRabbit's.

## Secrets

| Secret | Required | Behaviour when absent |
| --- | --- | --- |
| `model_credential` | no | The `run` job is environment-gated, so an absent key means the Environment did not release it. Its fail-closed step emits `::error::` and exits 1. This is deliberately **not** a skip: a key that went missing is an operator problem to see, and a silent skip would hide a broken credential behind a green run. The former skip-on-absent-key behaviour is withdrawn. |

`model_credential` must be an **environment** secret on the Environment named by `environment_name`, never a repository secret. The `verify` step runs in a job with no `environment` and refuses with `credential-not-environment-scoped` if it can see a value, which is the CWE-200 regression guard: a value visible in a job with no environment can only have come from repository scope.

## Credential resolution

`model_credential` is the only credential. When the Environment releases it, it is passed to Qodo PR-Agent as `ANTHROPIC.KEY`; when it is not released, the `run` job fails closed. There is no keyless path, so no OIDC token is ever requested. The Environment's deployment branch policy is load-bearing and is a repository setting, not a file: default branch only, no `refs/pull/*/merge`, and no required reviewers, because a reviewer on every automatic run would break SC-001.

## Required job structure

1. **`preflight`** (runs-on `ubuntu-latest`, `timeout-minutes: 3`, `permissions: {}`, **no `environment`**). Two steps, in order, and the second is authoritative.
   - **`verify`** (env-driven, no API calls). Sets `enabled=false` when any of these holds: `vars.QODO_PR_AGENT_ENABLED` is not `true` — unset, `false` or any other value (`kill-switch`, FR-020), because the pilot is opt-in and must not spend before the key's limit is confirmed; `decision_reason` is not `ok`; `pr_number` is not a positive integer; a repository-scoped secret is visible in this environment-less job (`credential-not-environment-scoped`, the CWE-200 guard); the sender type is `Bot`; the PR is a draft; a head repository is present and differs from the base (`fork`); a named command is not in the allow-list (`command-not-allowed`); a named command carries an `author_association` that is not in {`OWNER`, `MEMBER`, `COLLABORATOR`} (`author-not-allowed`); or a named command is on a closed or merged pull request (`pr-closed`). It sanitises its own `tool` output to an allow-listed command id or `none`, so a forged sentinel cannot enter the run record.
   - **`confirm`** (calls the API, runs only when `verify` enabled it). Re-reads the pull request with `pulls.get` and re-checks: the PR is open, not a draft, the author is not in `excluded_authors`, and — authoritatively, from the API rather than the payload — `head.repo.full_name === base.repo.full_name`. For a command it re-validates against the allow-list, re-reads the comments, matches the most recent comment whose first token is the command, re-checks that comment's `author_association`, and refuses any `--section.key=value` token after it. It sets the job outputs, which read `steps.confirm.outputs.X || steps.verify.outputs.X`, so a skip is always attributed to a real reason.

   `tool` names the command the run was requested for, so a refused request still records what was asked for. Because the comment body is untrusted, it is an allow-listed command id or `none`, never raw comment text, and `auto` is written only by `confirm` after it has re-derived eligibility from the API. The `not-a-pr`, `not-a-command` and `unsupported-event` reasons now live in the trigger workflow, because the receiver only ever sees a published request.
2. **`run`** (`needs: preflight`, `if: needs.preflight.outputs.enabled == 'true'`, `timeout-minutes: 15`, **`environment: ${{ inputs.environment_name || 'qodo-pr-agent' }}`**). Its steps:
   - **Fail closed when the Environment did not release the key**: exits 1 with `::error::` if `model_credential` is empty, naming the ref so the operator can see which `GITHUB_REF` failed the deployment branch policy.
   - Qodo PR-Agent: `uses: docker://pragent/pr-agent@sha256:<digest> # <version>-github_action`. **No `actions/checkout` step anywhere** in the workflow. The step uses `continue-on-error: true`, so an invalid key, rate limit or upstream outage records `failure` and emits a notice without failing the PR (FR-006, SC-003). The Environment is declared on this job and on no other, so it is the only job that can read the key.
3. **`record`** (`needs: [preflight, run]`, `if: always()` unless the preflight reason is `not-a-command`, `bot-sender` or `not-a-pr`, `permissions: {}`). It writes the run record ([data model](../data-model.md#run-record)), with outcome `success`, `failure` or `skipped:<reason>`, to `$GITHUB_STEP_SUMMARY`, and uploads it as artefact `qodo-pr-agent-run-${{ github.run_id }}` (retention 30 days). It then calls `lightspeedwp/.github/.github/actions/collect-metrics@<sha>` (non-blocking). It is referenced by path and SHA so it needs no checkout, and works in consuming repositories too. An empty `reason` means the `preflight` job itself failed and produced no outputs; that is recorded as `skipped:preflight-error`, so no outcome can fall outside the declared `skipped:<reason>` enum.
4. **Permissions**: the top level is `contents: read`. The `run` job adds `pull-requests: write` and `issues: write`, and nothing else — in particular not `contents: write`, which upstream's own recommended workflow grants and which turns a configuration-injection defect into a supply-chain incident. It does **not** get `contents: write`, because nothing is ever pushed, and it does **not** get `id-token` set to `write`: no job in this workflow requests an OIDC token, so the third-party container never holds that capability. `preflight` and `record` have `permissions: {}`.
5. **Concurrency** (on the `run` job, so only runs preflight enabled enter the group and an ordinary comment cannot cancel a queued command): `group: qodo-pr-agent-${{ inputs.pr_number }}`, with `cancel-in-progress: false`, so a command is never cancelled by an unrelated one. The pull request number comes from the input rather than from the event, because in the pilot the privileged run is a `workflow_run` whose own payload is the triggering run, not the pull request.

## Environment passed to the Qodo PR-Agent step

| Env var | Value |
| --- | --- |
| `GITHUB_TOKEN` | `${{ secrets.GITHUB_TOKEN }}` |
| `GITHUB.USER_TOKEN` | `${{ secrets.GITHUB_TOKEN }}`. `pr_agent.cli` reads its token from `github.user_token` and has no fallback to `GITHUB_TOKEN`, so without it every tool run fails before posting. |
| `ANTHROPIC.KEY` | `${{ secrets.model_credential }}` |
| `PR_AGENT_EXTRA_CONFIG_URL` | the constant `https://raw.githubusercontent.com/lightspeedwp/.github/develop/.pr_agent.toml` — a literal, never derived from an event, a head ref or a caller input. The CLI reads its extra configuration from this variable. |
| `QODO_PR`, `QODO_TOOL` | the pull request number from the input, and the tool preflight selected. The run step refuses a `QODO_PR` that is not a plain number. |
| `QODO_AUTO_DESCRIBE`, `QODO_AUTO_IMPROVE` | `'true'` or `'false'`, from the inputs, for the automatic path |
| every **locked** key from [pr-agent-config.md](./pr-agent-config.md) (e.g. `pr_description.publish_description_as_comment: 'true'`) | the locked value; env beats a consumer's `.pr_agent.toml` |

Untrusted event values, such as the comment body and branch names, are passed to scripts **only** through `env:` and never interpolated into `run:`. This follows existing repository practice.

## Command allow-list

Only these commands are accepted: `/describe`, `/improve`, `/review`, `/ask`, `/update_changelog`, `/add_docs`, `/help`.

These are rejected in preflight, with `reason=command-not-allowed`: `/generate_labels`, `/similar_issue`, `/config`, `/settings` and anything else.

An allowed command that carries a `--section.key=value` token anywhere after it, `/ask` included, is rejected with `reason=arguments-not-allowed`. PR-Agent would otherwise apply that token as a setting after the environment, overriding the locked keys.

## Acceptance checks

These are enforced by `tests/js/qodo-pr-agent-workflow.test.js`:

- The image is referenced by `@sha256:` digest.
- No step uses `actions/checkout`.
- Explicit permissions blocks exist and match the lists above.
- The privileged workflow's triggers include no `pull_request`, no `issue_comment` and no `pull_request_target`; they are `workflow_run` and `workflow_dispatch`.
- The unprivileged trigger workflow contains no `secrets` reference and grants no write scope.
- Only the environment-gated `run` job reads `secrets.model_credential`; every other reference is a `!= ''` presence probe.
- `CONFIG.EXTRA_CONFIG_URL` is the constant `develop` URL and contains no expression.
- No workflow in the pilot sets `id-token` to `write`.
- The receiver re-derives eligibility from the API rather than trusting the trigger's artefact.
- The allow-list and author-association guard are present.
- The kill-switch variable is checked.
- `github_action_config.auto_review` is `"false"`.
- The run job's fail-closed step exits 1 when the Environment released no key, and exits 0 when it did.
- The `verify` step refuses `credential-not-environment-scoped` when a repository-scoped secret is visible in a job with no environment.
