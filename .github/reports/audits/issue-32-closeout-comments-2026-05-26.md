# Issue #32 Audit Closeout Comments (Prepared)

Date: 2026-05-26
Branch: `codex/issue-32-audit-closeout`
Scope: P0/P1 fixes for labeling automation audit and governance docs alignment.

## #32 — [AI Ops] Finalise the automated labeling infrastructure

Proposed comment:

Completed a focused P0/P1 closeout pass for this epic on branch `codex/issue-32-audit-closeout`.

What was fixed:

- Hardened labeling workflow to fail fast on dependency setup and guardrail checks.
- Removed soft-fail behaviour that previously masked unknown-label drift.
- Reconciled canonical labels for active templates/flows so template/type validation now passes.
- Fixed stale docs references and broken links tied to labeling config paths.

Evidence:

- Workflow hardening: `.github/workflows/labeling.yml` (install step + guardrail strictness).
- Canonical labels expanded: `.github/labels.yml`.
- Doc fixes: `.github/README.md`, `docs/PR_LABELS.md`.
- Validation: `node scripts/agents/includes/check-template-labels.js` now returns `All template and type labels are valid.`

Recommended next action:

- Close this epic after child issue status updates below are applied.

---

## #38 — [AI Ops] Audit and Debug Labeling Agent (labeling.agent.js)

Proposed comment:

Audit closeout update complete for this scope.

What is now covered:

- Agent guardrail path is now enforceable in workflow (no soft-fail).
- Canonical label drift that affected agent/template alignment has been resolved.
- Labeling-related tests remain passing in this pass (`101/101` in targeted suites).

Evidence:

- `.github/workflows/labeling.yml`
- `.github/labels.yml`
- `node scripts/agents/includes/check-template-labels.js` passes

Recommended status:

- Close as complete.

---

## #39 — [AI Ops] Audit and Patch labels.yml for Unified Labeling Agent & Workflows

Proposed comment:

Completed in this closeout pass.

What changed:

- Added missing canonical labels referenced by active templates/rules:
  - `status:needs-audit`
  - `area:automation`, `area:testing`, `area:performance`, `area:a11y`, `area:security`, `area:compatibility`, `area:release`, `area:maintenance`, `area:ai`
  - `question`, `support`

Evidence:

- `.github/labels.yml`
- `node scripts/agents/includes/check-template-labels.js` passes

Recommended status:

- Close as complete.

---

## #40 — [AI Ops] Audit and Patch labeler.yml mapping rules for Unified Agent

Proposed comment:

Closeout update: rules are now validated against canonical labels through a strict guardrail path.

What is complete:

- Workflow now fails on unknown labels instead of continuing.
- Canonical label set updated to match current template/routing usage, preventing silent rule drift.

Evidence:

- `.github/workflows/labeling.yml`
- `.github/labels.yml`
- `node scripts/agents/includes/check-template-labels.js` passes

Recommended status:

- Close as complete.

---

## #41 — [AI Ops] Audit and Patch issue-types.yml for Unified Labeling Agent Compliance

Proposed comment:

Closeout check complete for issue-type compliance in this pass.

What was verified:

- Issue-type/template label integrity now passes strict validation.
- No unknown labels reported by template/type guardrail after canonical label reconciliation.

Evidence:

- `node scripts/agents/includes/check-template-labels.js` passes
- `.github/issue-types.yml` remains valid in current canonical model

Recommended status:

- Close as complete.

---

## #42 — [AI Ops] Audit and Debug labeling.agent.js for Unified Labeling Agent

Proposed comment:

This issue overlaps substantially with #38 and has now been covered by the same closeout changes.

What is covered:

- Guardrail enforcement strengthened in workflow.
- Canonical drift resolved so agent execution path has cleaner input consistency.

Evidence:

- `.github/workflows/labeling.yml`
- `.github/labels.yml`
- passing template/type guardrail

Recommended status:

- Close as duplicate/superseded by #38 (or close as complete with cross-reference to #38).

---

## #43 — [AI Ops] Audit and Patch labeling.yml Workflow for Unified Labeling Agent

Proposed comment:

Completed P0 workflow hardening in this closeout.

What changed:

- Dependency install now fails fast (`npm ci` without `|| true`).
- Removed unnecessary per-step package installs.
- Guardrail check no longer soft-fails (`continue-on-error: false`).

Evidence:

- `.github/workflows/labeling.yml`

Recommended status:

- Close as complete.

---

## #44 — [AI Ops] Patch markdown.instructions.md to Meet Canonical Standards

Proposed comment:

Closeout note: issue scope appears stale against current repo structure.

Current state:

- `markdown.instructions.md` exists under archive path (`.github/instructions/.archive/markdown.instructions.md`), while active standards have consolidated docs elsewhere.
- In this P1 pass, labeling/governance doc defects were fixed where active drift existed.

Recommended action:

- Either close as superseded by consolidated instructions model, or retarget this issue to the active markdown standards file(s) explicitly.

---
