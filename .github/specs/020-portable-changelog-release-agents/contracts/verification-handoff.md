# Contract: Release to Changelog Verification Handoff

**Requester**: release agent | **Responder**: changelog agent | **Transport**: structured document, no new labels or event services (FR-015) | **Contract version**: `changelog-verification/v1`

**Provenance**: the notation below is copied from the [recorded Release handoff](https://linear.app/lightspeedwp/issue/GIT-1310/aiops-release-agent-deliver-portable-preparation#comment-be60c834) (GIT-1310, 2026-10-11) and adopted here on the maintainer's instruction of 2026-10-12. It is design notation, not a TypeScript migration, and this contract adds no separate schema file. Do not introduce competing definitions.

## Supporting types

```ts
type Status = "passed"|"failed"|"missing"|"skipped"|"not-applicable";
type Hash = string; // lowercase 64-hex SHA-256
type RelPath = string; // confined repository-relative path

type Source = {
  path: RelPath; sha256: Hash;
  startLine: number; endLine: number; quote: string;
};
type FileHash = { path: RelPath; sha256: Hash };
type Snapshot = {
  repository: string; root: string; branch: string|null; commit: string;
  files: FileHash[]; digest: Hash;
};
type Finding = {
  code: string; severity: "blocker"|"note";
  message: string; paths: RelPath[]; nextAction: string;
};
type CheckEvidence = {
  id: string; source: Source; snapshotDigest: Hash;
  producer: string; producerPin: string;
  status: Status; artefacts: FileHash[];
};
```

## Request

```ts
type Request = {
  contractVersion: "changelog-verification/v1";
  requestId: Hash;
  target: Snapshot;
  targetVersion: string;
  releaseDate: string;
  changelog: FileHash;
  precheckStatus: "passed";
};
```

`precheckStatus: "passed"` means the release agent's pre-changelog checks passed. It is not final readiness: final readiness requires the handback, so a responder never needs `ready` to accept a request.

## Handback

```ts
type Handback = {
  contractVersion: "changelog-verification/v1";
  requestId: Hash;
  target: Snapshot;
  targetVersion: string;
  releaseDate: string;
  changelog: FileHash;
  result: "verified" | "failed";
  engine: {
    identity: string;
    version: string;
    sourceCommit: string;
    bundleDigest: Hash;
    rulesDigest: Hash;
  };
  checks: CheckEvidence[];
  entryCount: number;
  categories: string[];
  historicalEntriesPreserved: boolean;
  sourceLinksPreserved: boolean;
  findings: Finding[];
};
```

## Validation of both documents

- Every field is required. Reject unknown fields, duplicate paths or check IDs, and malformed values.
- Hash exact file bytes. Compute snapshot digests as SHA-256 of canonical JSON with lexically sorted keys and path-sorted file records.
- Versions use strict SemVer 2.0 (no `v`, whitespace or numeric leading zeros). Dates are valid `YYYY-MM-DD` and are never inferred from the clock.

## Readiness rules

Passed prechecks, entry validity and whole-document validity are distinct from final readiness.

A successful handback (`verified`) must:

- Match the request ID, target repository and root, branch and commit, snapshot, changelog, intended version and release date.
- Identify the expected engine, bundle and rules provenance.
- Provide independently verified evidence for every required check.
- Report a positive entry count, only the six permitted categories, preserved history and source links, and no blocker findings.

Matching hashes bind content but do not prove authentic execution. Final `ready` requires independently trusted execution evidence and a final unchanged-snapshot check. Supplied success that cannot be verified stays blocking.

## Release-agent handling

| Situation | Outcome |
|-----------|---------|
| `verified` meeting every rule above | Readiness may be reported complete. |
| `failed`, or `verified` that breaks any rule above | `not-ready`, `changelog-unverified`, findings surfaced. |
| No response (none returned within the same invocation; no timer), malformed response, or changelog agent unavailable | `not-ready`, `changelog-unverified`. Never a silent fallback or skipped gate. |

Verification is read-only. Applying changelog edits is a separate operation requiring its own approval, and a verification response never authorises an edit.

## Required failure examples

Fixtures cover: missing handback; wrong target, version or date; stale snapshot; unexpected engine, bundle or rules provenance; missing, failed or skipped check; forged success; warnings concealing blockers; zero entries; unsupported category; preservation failure; malformed input; concurrent change.

Every failure keeps `not-ready` and leaves target bytes, index, refs and input objects unchanged, with:

```json
{"proposedEdits":[],"writeSet":[],"writes":0}
```
