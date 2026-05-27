---
name: "⚙️ Build & CI"
about: "Propose changes, fixes, or improvements to build tools, CI/CD pipelines, or automation."
title: "[Build/CI] Re-enable actions/labeler with canonical schema-compatible config"
labels: [status:needs-triage, area:ci, area:labels, type:build]
---

## Build/CI Summary

PR #418 temporarily disabled `actions/labeler@v5` because `.github/labeler.yml` is not compatible with the action schema.  
This follow-up restores deterministic branch/file auto-labelling while keeping canonical label governance in `.github/labels.yml` and issue types in `.github/issue-types.yml`.

## Steps / Checklist

- [ ] Decide target architecture:
  - Option A: keep `actions/labeler` and make `.github/labeler.yml` fully schema-compatible.
  - Option B: retire `actions/labeler` and rely only on `scripts/agents/labeling.agent.js`.
- [ ] If Option A is chosen, split agent-only rules from action-compatible rules.
- [ ] Add validation for `labeler.yml` shape in CI (fail fast before workflow runtime).
- [ ] Update workflow comments and docs to reflect final source of truth and execution path.
- [ ] Verify branch-based and file-based labels on a test PR.
- [ ] Ensure no duplicate/conflicting label application between action and agent.

## Acceptance Criteria

- [ ] `Unified Labeling, Status, and Type Assignment` passes on test PRs without manual intervention.
- [ ] No workflow step fails due to `actions/labeler` schema errors.
- [ ] Canonical labels remain sourced from `.github/labels.yml` only.
- [ ] Issue types remain sourced from `.github/issue-types.yml` only.
- [ ] Label assignment is deterministic for:
  - [ ] branch prefix (`feat/`, `fix/`, `docs/`, `ci/`, etc.)
  - [ ] changed paths (`.github/workflows/**`, docs, scripts, etc.)
- [ ] Documentation updated:
  - [ ] `/Users/ash/Studio/LightSpeedWP.Agency/.github/docs/ISSUE_LABELS.md`
  - [ ] `/Users/ash/Studio/LightSpeedWP.Agency/.github/docs/ISSUE_TYPES.md`
  - [ ] `/Users/ash/Studio/LightSpeedWP.Agency/.github/docs/MIGRATION.md` (if mappings/process changed)

## Additional Context

- Temporary mitigation was merged under PR #418 to unblock CI.
- This issue is the hardening follow-up and should be completed before future label-system expansion.

## References

- PR #418: CI fixes and temporary `actions/labeler` disablement
- `/Users/ash/Studio/LightSpeedWP.Agency/.github/.github/workflows/labeling.yml`
- `/Users/ash/Studio/LightSpeedWP.Agency/.github/.github/labeler.yml`
- `/Users/ash/Studio/LightSpeedWP.Agency/.github/scripts/agents/labeling.agent.js`
