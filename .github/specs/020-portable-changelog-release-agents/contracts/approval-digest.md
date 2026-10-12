# Approval Digest Contract

## Purpose

An approval digest is a cryptographic proof that the maintainer explicitly approved a specific set of changes before the agent applies them to the repository. Digests prevent silent file changes and ensure maintainers retain control over all edits.

## Digest Algorithm

- **Hash function**: SHA-256
- **Input**: Canonical JSON representation of files to be changed and their new values
- **Encoding**: Hexadecimal (lowercase, 64 characters)
- **Scope**: Version-field files only (plugin header, readme, theme stylesheet, package.json, VERSION file) for the release agent; version fields or CHANGELOG.md for the changelog agent

### Example Input (JSON canonical form for release agent)

```json
{
  "files": {
    "package.json": {
      "action": "update",
      "key": "version",
      "oldValue": "1.1.0",
      "newValue": "1.2.0"
    },
    "readme.txt": {
      "action": "update",
      "key": "Stable tag",
      "oldValue": "1.1.0",
      "newValue": "1.2.0"
    }
  }
}
```

### Digest Computation Example

Canonical JSON (sorted keys, no extra whitespace) is hashed:

```
Input: {"files":{"package.json":{"action":"update","key":"version","newValue":"1.2.0","oldValue":"1.1.0"},"readme.txt":{"action":"update","key":"Stable tag","newValue":"1.2.0","oldValue":"1.1.0"}}}

Digest: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f
```

## Workflow

### Step 1: Agent Displays Proposed Changes

When the agent has computed the changes it would apply, it displays them to the maintainer with the digest:

```
Release Agent Ready for Approval

Target: /path/to/plugin
Component: plugin
Version: 1.1.0 → 1.2.0

Changes:
  - package.json: version → 1.2.0
  - readme.txt: Stable tag → 1.2.0

Digest (to approve):
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f

---
Copy the digest exactly and supply it to approve:
npx release.agent.cjs --repoRoot /path/to/plugin \
  --approve-digest a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f
```

### Step 2: Maintainer Supplies Digest for Approval

The maintainer copies the digest exactly and passes it as a flag:

```bash
npx release.agent.cjs --repoRoot /path/to/plugin \
  --approve-digest a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f
```

Or for the changelog agent:

```bash
npx changelog.agent.cjs apply /path/to/changelog.md \
  --approve-digest a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f
```

### Step 3: Agent Rechecks Before Writing

Immediately before writing files:

1. Agent recalculates the digest from the current repository state
2. Compares: `calculatedDigest` vs `suppliedDigest`
3. **If match**: Write files, record digest in result
4. **If mismatch**: Write nothing, return error with both digests

## Error Handling

### Digest Mismatch

Files have changed since the digest was displayed (e.g., maintainer hand-edited, or concurrent change):

```
Error: approval-digest-mismatch
Message: Approval digest does not match the current state

Displayed digest:   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f
Calculated digest:  x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v

Reason: Files changed between display and approval
  - package.json: modified by hand-edit
  - Possible concurrent edit from another process

Action: Run the readiness/draft operation again to get an updated digest.
```

### Missing Approval Digest

Maintainer runs the agent without the `--approve-digest` flag when one is required:

```
Error: approval-required-not-supplied
Message: Edits require explicit approval

Changes would affect:
  - package.json: version → 1.2.0
  - readme.txt: Stable tag → 1.2.0

Digest: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f

Action: Supply the digest with --approve-digest flag to approve these changes.
```

### Malformed Digest

Digest is not 64 hexadecimal characters:

```
Error: approval-digest-invalid
Message: Supplied digest is not valid

Supplied: "not-a-valid-digest"
Expected: 64 lowercase hexadecimal characters (SHA-256)

Action: Copy the digest exactly from the agent's display.
```

## Design Rationale

**Why require explicit digest approval?**

1. **Prevents silent changes**: Maintainers see exactly what will change before it happens
2. **Detects concurrent edits**: If the digest changes between display and apply, an edit occurred—catch it
3. **No ambiguity**: Digest proves the maintainer approved THIS specific change, not a similar one
4. **Fail-closed**: Any doubt → no write. Better to require re-approval than to silently proceed

**Why SHA-256?**

- Standard cryptographic hash
- Collision-resistant
- Already available in Node.js built-ins
- Easy to verify: any tool can recompute and check

**Why hex encoding?**

- Human-readable and copyable (no special characters)
- Unambiguous (no 0/O or 1/l confusion)

## Implementation References

- **FR-029**: Maintainer supplies digest of exact proposed edit; agent rechecks before writing
- **SC-011**: In every fixture where supplied digest does not match, zero files are written
- **Task T018**: Jest tests for release edits (digest match → write, mismatch → no write)
- **Task T024**: Implement approved preparation operation (capture digest, recompute, compare)
- **Task T029**: Jest tests for changelog edits (same digest logic)
- **Task T036**: Implement changelog apply operation (digest-gated write)

## Testing Scenarios

| Scenario | Setup | Expected |
|----------|-------|----------|
| **Digest match** | Display digest D1, maintainer supplies D1 | Files written; digest recorded in result |
| **Digest mismatch** | Display digest D1, file edited, calculated digest D2 | Zero files written; error returned |
| **Missing digest** | No `--approve-digest` flag | Edits refused; error shows digest to approve |
| **Invalid digest** | Malformed hex string | Rejected with format error |
| **Repeated run with no changes** | Run twice with same digest | Second run unchanged (idempotent) |
| **Hand-edit between display and apply** | Display digest, user edits file, supply original digest | Mismatch detected; no write |

---

**Version**: 1.0.0 | **Date**: 2026-10-12 | **Related**: FR-029, SC-011, T018, T024, T029, T036
