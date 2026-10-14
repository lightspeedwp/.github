# Approval Digest Contract

**Feature**: [spec.md](./../spec.md) | Related: FR-029, SC-011, T018, T024, T029, T036

## Purpose

An approval digest binds the maintainer's approval to one exact proposed edit. The agent writes only when the digest it recomputes immediately before writing matches the digest the maintainer supplied. Command names, flag names and exit codes are decided in the implementation tasks (T023, T036); this contract fixes only the algorithm and behaviour.

## Digest algorithm

- **Hash function**: SHA-256.
- **Input**: canonical JSON (sorted keys, no extra whitespace) of the files to change, with the action, key, old value and new value for each.
- **Encoding**: 64 lowercase hexadecimal characters.
- **Scope by agent** (FR-009):
  - Release agent: allowlisted version-field files only (plugin header, readme stable tag, theme stylesheet, `package.json`, `VERSION`). It never edits `CHANGELOG.md`.
  - Changelog agent: `CHANGELOG.md` only. It never edits version fields.

### Worked example (release agent)

Canonical input:

```text
{"files":{"package.json":{"action":"update","key":"version","newValue":"1.2.0","oldValue":"1.1.0"},"readme.txt":{"action":"update","key":"Stable tag","newValue":"1.2.0","oldValue":"1.1.0"}}}
```

SHA-256 of that exact string:

```text
885ad763e69ae46f458a8df321a5fdf0510a7c50766ef42c3089c43d2f126fca
```

## Behaviour

1. **Display**: the agent shows the exact proposed edit and its digest. It writes nothing.
2. **Supply**: the maintainer returns the digest through the agent's approval input.
3. **Recheck**: immediately before writing, the agent recomputes the digest from the current repository state.
4. **Match**: write only the approved edit and record the digest in the result.
5. **Mismatch, missing or malformed digest**: write nothing and report which condition occurred, with both digests on a mismatch.

A hand edit between display and approval changes the recomputed digest, so the approval cannot be reused for a different change.

## Failure results

| Condition | Result | Writes |
|-----------|--------|--------|
| Supplied digest differs from the recomputed digest | `approval-digest-mismatch`, both digests shown | None |
| No digest supplied where one is required | `approval-required`, digest to approve shown | None |
| Supplied value is not 64 lowercase hex characters | `approval-digest-invalid` | None |

## Test scenarios

| Scenario | Setup | Expected |
|----------|-------|----------|
| Digest match | Display digest D1, maintainer supplies D1 | Edit written; digest recorded |
| Digest mismatch | Display D1, file edited by hand, recomputed D2 | Zero files written |
| Missing digest | No approval supplied | Edit refused; digest shown |
| Invalid digest | Malformed value | Rejected |
| Repeat after a successful apply | Run again with the same digest | Recomputed digest differs or the change is already applied; nothing is written twice |

## Traceability

- **FR-029**: the maintainer supplies the digest of the exact proposed edit; the agent rechecks before writing.
- **SC-011**: in every fixture where the supplied digest does not match, zero files are written.
- **T018 / T024**: release-agent tests and the approved preparation operation.
- **T029 / T036**: changelog-agent tests and the approved apply operation.
