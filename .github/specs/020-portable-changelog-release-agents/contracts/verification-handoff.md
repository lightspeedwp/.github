# Contract: Release to Changelog Verification Handoff

**Requester**: release agent | **Responder**: changelog agent | **Transport**: structured document, no new labels or event services (FR-015)

## Request

| Field | Description |
|-------|-------------|
| `contractVersion` | Version of this contract. |
| `repoRoot` | Explicit root the changelog agent must use. |
| `targetVersion` | Version the release is being prepared for. |
| `readiness` | Summary of the readiness report at request time, including its `status`. |
| `changelogPath` | Repository-relative path. |

The changelog agent refuses a request whose `readiness.status` is not `ready` for the pre-changelog checks, or whose fields are missing, and replies `failed` with a reason.

## Response

| Field | Description |
|-------|-------------|
| `result` | `verified` or `failed`. |
| `evidence` | Required when `verified`: validation outcome, categories found, Unreleased entry count, and the validation engine identity and version used. |
| `reason` | Required when `failed`. |

## Release-agent handling

| Situation | Outcome |
|-----------|---------|
| `verified` with evidence | Readiness may be reported complete. |
| `failed` | `not-ready`, `changelog-unverified`, reason surfaced. |
| No response, malformed response, or changelog agent unavailable | `not-ready`, `changelog-unverified`. Never a silent fallback or skipped gate. |

Verification is read-only. Applying changelog edits is a separate operation requiring its own approval.
