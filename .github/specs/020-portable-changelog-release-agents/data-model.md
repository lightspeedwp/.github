# Data Model: Portable Changelog and WordPress Release Preparation Agents

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

Entities are conceptual. They describe what each agent must know and the states it moves through, not storage schemas.

## Target repository

| Field | Meaning |
|-------|---------|
| `repoRoot` | Explicit absolute path supplied by the caller. Never defaulted from the process working directory. |
| `componentType` | `plugin`, `theme`, `enhancement` or `unknown`. `unknown` is a stop, not a guess. An enhancement is recognised only when the target's own instructions declare it and name its version fields. |
| `instructionsFound` | Whether the target's own instructions name authoritative version fields. |

**Rules**: an ordinary repository that merely contains `.github/`, `package.json` and `VERSION` is not a governance repository (FR-003). Detection must never require `VERSION`.

## Version source

| Field | Meaning |
|-------|---------|
| `kind` | plugin header, readme stable tag, theme stylesheet, package, `VERSION`. |
| `path` | Repository-relative path, validated to stay inside `repoRoot`. |
| `value` | Detected version string. |
| `authoritative` | True only when the target's instructions designate it. |

**Rules**: if no source is designated, every detected value is reported and the result is `ambiguous` (FR-004). Differing values across sources are `drift`.

## Readiness report

See [contracts/readiness-report.md](./contracts/readiness-report.md). States:

```text
not-run -> ready | not-ready
```

`ready` requires: component detected, no drift, no ambiguity, clean tree, safe paths, no conflicting tag evidence, no `missing-check` blocker, and (when the handoff is in play) recorded changelog verification success.

## Preparation edit

| Field | Meaning |
|-------|---------|
| `path` | Allowlisted version-field file. |
| `from`, `to` | Current and target version. |
| `approval` | Digest of the exact proposed edit, supplied by the maintainer (FR-029). Absent or non-matching means the edit must not run. |
| `backup` | Recovery point captured before the edit. |

States: `proposed -> approved -> applied | failed-recovered`. A `failed` edit that cannot be recovered is never reported as ready.

## Changelog entry

| Field | Meaning |
|-------|---------|
| `category` | One of Added, Changed, Deprecated, Removed, Fixed, Security. |
| `text` | Entry text, subject to the repository's length and link rules. |
| `link` | Pull request or issue reference where required. |
| `section` | `Unreleased` or a version heading. |

**Rules**: historic sections and links are preserved byte-for-byte; Unreleased handling is idempotent.

## Verification handoff

See [contracts/verification-handoff.md](./contracts/verification-handoff.md). States:

```text
requested -> verified | failed | missing

`missing` means no response was returned within the same invocation; no timer applies (FR-014).
```

Only `verified` with evidence allows the release agent to report ready. `failed`, `missing` and no response all yield not-ready.

## Delivery slice

| Field | Meaning |
|-------|---------|
| `id` | Profile code from the delivery plan (S, F, R1, C2, DEC, DOC, SETUP, DIST, WFLOW, ROLLBACK). |
| `issues` | Full GitHub issue URLs, and the Linear identifier once confirmed. |
| `branch`, `base`, `template` | As recorded in `delivery-plan.md` once written. |
| `closure` | Which issues the slice may close; partial work uses reference-only wording. |

## Agent Invocation Modes

### Release Agent

**Readiness mode (default / explicit)**:

Readiness mode is the default and requires no approval. The agent outputs a readiness report and makes zero file or git-state changes.

```bash
# Default - no approval supplied → readiness check only
npx release.agent.cjs --repoRoot /path/to/target

# Or explicit flag (same effect, for clarity)
npx release.agent.cjs --repoRoot /path/to/target --dry-run
```

**Output**: Readiness report with component type, version evidence, blockers, and zero writes.

**Preparation mode (approval required)**:

Preparation mode requires an approval digest (see [contracts/approval-digest.md](./contracts/approval-digest.md)). The agent applies allowlisted version-field edits only if the supplied digest matches the computed digest of those changes.

```bash
npx release.agent.cjs --repoRoot /path/to/target \
  --approve-digest a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f
```

**Output**: Readiness report with applied edits (if digest matches) or error (if mismatch or digest invalid).

### Changelog Agent

**Inspect mode (read-only)**:

Inspects the changelog and reports its structure without changing any file.

```bash
npx changelog.agent.cjs inspect /path/to/changelog.md
```

**Output**: Analysis report of current entries, categories, Unreleased count, and validation results.

**Draft mode (read-only)**:

Proposes release entries based on Unreleased section without changing any file.

```bash
npx changelog.agent.cjs draft /path/to/changelog.md
```

**Output**: Proposed release entries, digest for approval, and zero writes.

**Apply mode (approval required)**:

Applies bounded changelog edits (moves Unreleased entries into a versioned section) only when the supplied digest matches.

```bash
npx changelog.agent.cjs apply /path/to/changelog.md \
  --approve-digest a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f
```

**Output**: Applied edits (if digest matches) or error (if mismatch).

**Verify mode (read-only)**:

Validates the changelog against the shipped validation engine and returns verification evidence (for the release agent's handoff).

```bash
npx changelog.agent.cjs verify /path/to/changelog.md
```

**Output**: Validation result, categories found, Unreleased count, engine version, and zero writes.

### Environment Variable Alternative (Optional)

For shell scripts that prefer environment variables:

```bash
export RELEASE_DRY_RUN=true  # Readiness only (default)
export RELEASE_DRY_RUN=false # Preparation (requires --approve-digest flag)

npx release.agent.cjs --repoRoot /path/to/target --approve-digest $DIGEST
```

**Note**: CLI flags take precedence over environment variables. Explicit flags are the primary interface; environment variables are optional for convenience.

### Exit Codes

- `0`: Success (readiness complete, edits applied, validation passed)
- `1`: Error (blockers, digest mismatch, validation failed, invalid input)
- `2`: Partial success or warning (e.g., recovery from edit failure succeeded, but repo state may not be fully ready)
