---
title: Secret scanning with gitleaks
description: How the organisation-wide gitleaks workflow is pinned, verified, consumed and recovered
file_type: documentation
owners:
  - LightSpeed Team
tags:
  - security
  - ci
status: active
stability: stable
domain: security
language: en
---

# Secret scanning with gitleaks

## What runs

`.github/workflows/gitleaks-reusable.yml` is the single implementation. It is called by
`gitleaks.yml` in this repository and by caller workflows in participating repositories.

The open-source gitleaks CLI (MIT) is downloaded and executed directly. The `gitleaks-action`
wrapper is deliberately not used: it requires a paid licence for organisation-owned repositories.

## Integrity controls

| Control | Where |
|---|---|
| Exact pinned version, never `latest` | `GITLEAKS_VERSION` in the reusable workflow |
| Official SHA-256 of the `linux_x64` archive | `GITLEAKS_SHA256`, checked with `sha256sum --check` before extraction |
| Immutable action pin | `actions/checkout` by commit SHA, version in a same-line comment |
| No credential persistence | `persist-credentials: false` |
| Least privilege | `permissions: contents: read` at workflow and job level |
| Bounded run | `timeout-minutes: 15` |
| Fail-fast shell | `set -euo pipefail` in every run block |
| Redacted output | `--redact`, so a finding never prints the secret |
| Cleanup | temporary directory removed under `if: always()` |

A download whose checksum does not match aborts before extraction, so a substituted binary is never
executed.

## Consuming it from another repository

`lightspeedwp/.github` is public, so private repositories in the organisation can call the reusable
workflow with no extra access configuration:

```yaml
jobs:
  gitleaks:
    uses: lightspeedwp/.github/.github/workflows/gitleaks-reusable.yml@develop
    permissions:
      contents: read
```

A calling repository may add its own `.gitleaks.toml`. If it has none, the scan still runs with
gitleaks' default rules.

## Keeping the pin current

`gitleaks-update.yml` runs weekly. It resolves the latest release that is neither a draft nor a
prerelease, retrieves the official `checksums.txt`, updates the version and checksum together,
re-downloads and verifies the new archive, runs it against this repository, and opens a pull
request. It never merges.

## Recovery

| Situation | Action |
|---|---|
| A scan fails on a real secret | Rotate the credential first. Removing the commit does not un-leak it. |
| A scan fails on a false positive | Add a narrow entry to `.gitleaks.toml` under `[allowlist]`, scoped by path or regex. Never disable the workflow. |
| The pinned release is withdrawn upstream | Set `GITLEAKS_VERSION` and `GITLEAKS_SHA256` back to the previous known-good pair; both live on adjacent lines in the reusable workflow. |
| The updater opens a bad pull request | Close it. The pinned values on `develop` are unchanged until that PR merges. |
| A checksum mismatch appears with no version change | Treat as a supply-chain signal, not a flake. Do not bypass. Verify the published checksum manually against the release page before changing anything. |

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
