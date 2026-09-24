# Data Model: Qodo PR-Agent Installation & Agent/Skill Integration

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-09-24

This feature adds no database. Its "data" is configuration, workflow interfaces and run records. Each entity below lists where it lives, its fields, and the validation rules that come from the spec.

---

## Qodo PR-Agent tool

One upstream command. There is a fixed set of nine.

| Field | Type | Rules |
| --- | --- | --- |
| `id` | enum | `describe`, `review`, `improve`, `ask`, `add_docs`, `generate_labels`, `similar_issue`, `update_changelog`, `help` |
| `trigger_mode` | enum | `automatic`, `on-demand`, or `disabled` |
| `owning_concern` | string | Must match exactly one row of the [Responsibility matrix](./contracts/responsibility-matrix.md) |
| `consumers` | list of paths | The existing agents and skills that consume the output (Integration points) |
| `publishes_to_pr` | bool | Must be `false` for `generate_labels` and `similar_issue` (FR-008) |

**Pilot values** (the source of truth is the responsibility matrix):

| Tool | Trigger mode |
| --- | --- |
| describe | automatic, posted as a comment |
| improve | automatic |
| review | on-demand |
| ask | on-demand |
| update_changelog | on-demand, comment only |
| add_docs | on-demand |
| help | on-demand |
| generate_labels | disabled on PRs; skill-only, with publishing off |
| similar_issue | disabled (deferred, see [research R8](./research.md#r8-similar-issues-integration-is-not-viable-in-the-pilot)) |

## Responsibility matrix

This maps each **review concern** to exactly one owner. It lives in [`contracts/responsibility-matrix.md`](./contracts/responsibility-matrix.md) and is published for contributors in `docs/QODO_PR_AGENT.md`.

| Field | Type | Rules |
| --- | --- | --- |
| `concern` | string | Unique |
| `owner` | enum | `CodeRabbit`, `Qodo PR-Agent`, or `<internal agent path>` |
| `mode` | enum | `automatic` or `on-demand` |
| `notes` | string | Optional |

**Invariants**:

- Every automatic Qodo PR-Agent output maps to one row (US2, AS1).
- No concern has two owners.

## Central configuration

The organisation-standard Qodo PR-Agent settings. This is the root file `.pr_agent.toml` in `lightspeedwp/.github`. Its required keys and values are in [`contracts/pr-agent-config.md`](./contracts/pr-agent-config.md).

| Field | Rules |
| --- | --- |
| `version` | Recorded as a comment header plus the git ref that consumers pin through `config_ref` |
| governed keys | Must equal the values in the config contract; this is enforced by a contract test |
| `extra_instructions` | Technology-agnostic and UK English (Principle IV, FR-011) |

**Lifecycle**: a change to `.pr_agent.toml` in a PR → review → merge to `develop` → consumers that pin `main` pick it up after the next `develop` → `main` release, and consumers that pin a tag pick it up on their next bump. Changes are never live from a PR branch, because upstream reads config from the default branch.

## Repository override

A consuming repository's deviation from the central configuration.

| Field | Rules |
| --- | --- |
| location | That repository's root `.pr_agent.toml` |
| `justification` | Required: a TOML comment immediately above each overridden key, starting `# override:` (FR-019) |
| scope | May not override the governed keys marked **locked** in the config contract (language, label publishing, changelog push, description-as-comment) |

**Discoverability**: the opt-in guide requires each override to be listed in that repository's README or `AGENTS.md`, under "Qodo PR-Agent overrides".

## Integration point

One pairing of a Qodo PR-Agent tool with an existing LightSpeed agent or skill.

| Field | Type | Rules |
| --- | --- | --- |
| `tool` | Qodo PR-Agent tool id | — |
| `asset` | path | An existing `AGENT.md` or `SKILL.md` |
| `invocation` | enum | `skill` (through `skills/qodo-pr-agent`), `pr-comment` (reads a posted comment), or `gate-input` |
| `on_output` | string | What the asset does with the result |
| `fallback` | string | Required. Behaviour when the result has `status: skipped` or `error` (FR-014) |
| `status` | enum | `in-scope` or `deferred` (with a reason) |

**Documentation rule**: every in-scope integration point adds a section headed `## Qodo PR-Agent integration` to its asset's entrypoint, covering `invocation`, `on_output` and `fallback` (FR-013). This is enforced by a contract test.

## Skill result

The normalised output of `skills/qodo-pr-agent`. See [`contracts/skill-interface.md`](./contracts/skill-interface.md).

| Field | Type | Rules |
| --- | --- | --- |
| `status` | enum | `ok`, `skipped`, or `error` |
| `reason` | string | Required when `status != ok`, e.g. `no-credential`, `rate-limited`, `tool-disabled`, `upstream-error` |
| `tool` | Qodo PR-Agent tool id | — |
| `markdown` | string | Present when `status == ok` |
| `data` | object or null | Parsed JSON output when the tool provides it |
| `truncated` | bool | `true` when upstream clipped the patch (large-PR edge case) |

## Run record

One Qodo PR-Agent execution in CI.

| Field | Type | Rules |
| --- | --- | --- |
| `repository` | string | `owner/repo` |
| `pr` | int | — |
| `tool` | Qodo PR-Agent tool id or `auto` | `auto` means one automatic run covering describe and improve |
| `trigger` | enum | `pull_request` or `issue_comment` |
| `outcome` | enum | `success`, `skipped:<reason>`, or `failure` |
| `duration_seconds` | int | From the job timestamps |
| `model` | string | From the config |
| `started_at` | ISO-8601 | — |
| `event_at` | ISO-8601 | When the triggering comment was posted, or the PR's `updated_at` for PR events. Used for the SC-001 "within 10 minutes" measure. |

**Storage**: the job summary, plus artefact `qodo-pr-agent-run-<run_id>` (30-day retention), plus `collect-metrics` output. Records are aggregated into `.github/reports/metrics/qodo-pr-agent/pilot-report-YYYY-MM-DD.md` (FR-021).
