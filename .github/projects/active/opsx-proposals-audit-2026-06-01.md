---
title: "OPSX Proposals Audit"
description: "Audit and proposal map for active project files, issue linkage, and safe execution sequencing"
created_date: "2026-06-01"
last_updated: "2026-06-01"
file_type: "documentation"
version: "v1.0.0"
status: active
---

# OPSX Proposals Audit (2026-06-01)

## 1) Hierarchy Repair (Completed First)

Completed: explicit titled child issues now linked as true GitHub sub-issues.

- [#654](https://github.com/lightspeedwp/.github/issues/654) [#655](https://github.com/lightspeedwp/.github/issues/655) [#656](https://github.com/lightspeedwp/.github/issues/656) [#657](https://github.com/lightspeedwp/.github/issues/657) -> [#649](https://github.com/lightspeedwp/.github/issues/649)
- [#660](https://github.com/lightspeedwp/.github/issues/660) [#661](https://github.com/lightspeedwp/.github/issues/661) -> [#650](https://github.com/lightspeedwp/.github/issues/650)
- [#664](https://github.com/lightspeedwp/.github/issues/664) [#665](https://github.com/lightspeedwp/.github/issues/665) -> [#651](https://github.com/lightspeedwp/.github/issues/651)
- [#671](https://github.com/lightspeedwp/.github/issues/671) [#672](https://github.com/lightspeedwp/.github/issues/672) [#673](https://github.com/lightspeedwp/.github/issues/673) -> [#653](https://github.com/lightspeedwp/.github/issues/653)

## 2) Per-File/Folder Audit and OPSX Direction

### `next-issues-execution-plan.md`

- Status: active, but had stale states.
- OPSX action: keep as canonical control file; include this audit and only reference verified issue states.

### `test-coverage-implementation.md`

- Status: active, large body.
- OPSX action: moved to `test-coverage-implementation/README.md` with parent/child spec skeletons.
- Live issue anchors: [#602](https://github.com/lightspeedwp/.github/issues/602) (open), plus [#599](https://github.com/lightspeedwp/.github/issues/599)/[#600](https://github.com/lightspeedwp/.github/issues/600)/[#601](https://github.com/lightspeedwp/.github/issues/601) (open).

### `wave-3c-issue-spec.md`

- Status: should be completed.
- Verified issue: [#514](https://github.com/lightspeedwp/.github/issues/514) closed.
- OPSX action: mark completed and archive next cleanup wave.

### `plugin-pack-{second,third,next}-wave-task-list-2026-05-28.md`

- Status: frontmatter-only stubs.
- Issue state: no matching open issues found by title/topic.
- OPSX action: create parent + children before any execution claims.

### `launch-agents-checklist.md`

- Status: active and substantial.
- OPSX action: create parent issue + children for test infra, release gate validation, and rollback readiness.
- Current linked blocker issues: [#642](https://github.com/lightspeedwp/.github/issues/642) [#643](https://github.com/lightspeedwp/.github/issues/643) [#644](https://github.com/lightspeedwp/.github/issues/644) [#706](https://github.com/lightspeedwp/.github/issues/706).

### `issue-670-readme-refresh-tasks.md`

- Status: moved to `issue-670-readme-refresh/README.md`.
- Verified issue: [#670](https://github.com/lightspeedwp/.github/issues/670) closed.
- OPSX action: keep only drift-check follow-up under active docs waves.

### `ISSUE_35_INSTRUCTION_AUDIT_SUMMARY.md`

- Status: moved to `issue-35-instruction-audit/README.md`.
- Verified issue: [#35](https://github.com/lightspeedwp/.github/issues/35) closed.
- OPSX action: reopen only if new drift found.

### `context-reduction-tasks.md` (Dangerous)

- Risk: includes destructive deletions (`CLAUDE.md`, instruction/config artifacts) that can break governance and agent routing.
- Safe OPSX action:
  1. Freeze deletes.
  2. Create evidence inventory: reference count + dependency graph.
  3. Reclassify each candidate as keep/merge/archive.
  4. Require passing `npm run validate:agents` and frontmatter checks before any deletion PR.
  5. Delete only files with zero hard references and approved replacement.

### `DOCUMENTATION_AUDIT_PROMPT_COMPREHENSIVE.md`

- Status: active and broadly aligned to wave-5 issue set.
- OPSX action: trim stale “open” references for already closed parents ([#649](https://github.com/lightspeedwp/.github/issues/649)/[#650](https://github.com/lightspeedwp/.github/issues/650)/[#652](https://github.com/lightspeedwp/.github/issues/652)).

### `AUDIT_PROMPT_README.md`

- Status: useful as quick entrypoint if comprehensive prompt retained.
- OPSX action: keep, but add pointer to canonical wave-5 index and closure notes.

### `2025-12-11-wordpress-standards-compliance-comprehensive-review.md`

- Status: stale assumptions.
- External verification:
  - WordPress 7.0 released May 20, 2026.
  - Coding standards canonical source remains Developer Handbook.
  - WordPress/agent-skills exists and supports Codex/Copilot/Claude skillpack installation.
- OPSX action: split into modernized spec focused on WP 7.0+ compatibility and agent-skills integration path.

### `wceu-2026/`

- Status: parent issue doc shows active language, but corresponding main issue [#564](https://github.com/lightspeedwp/.github/issues/564) is closed.
- OPSX action: archive stale planning docs or rewrite as retrospective/output index.

### `wave-5-documentation-audit/`

- Status: mixed; index still says parent issues open.
- OPSX action: update parent-state truth table (closed: [#649](https://github.com/lightspeedwp/.github/issues/649) [#650](https://github.com/lightspeedwp/.github/issues/650) [#652](https://github.com/lightspeedwp/.github/issues/652), open: [#651](https://github.com/lightspeedwp/.github/issues/651) [#653](https://github.com/lightspeedwp/.github/issues/653)), keep execution files for open work.

### `template-enforcement-governance/`

- Status: active and relevant; maps to newly opened [#709](https://github.com/lightspeedwp/.github/issues/709)-[#721](https://github.com/lightspeedwp/.github/issues/721) chain.
- OPSX action: continue as current implementation queue; explicitly track [#709](https://github.com/lightspeedwp/.github/issues/709) manual org-setting dependency.

## 3) Execution Sequence (Recommended)

1. Keep hierarchy fixed (done).
2. Update stale status language in wave-5 and wceu folders.
3. Create plugin-pack parent/child issue tree + specs from stubs.
4. Run safe context-reduction evidence phase (no deletions).
5. Modernize WordPress standards review into WP 7.0+ spec.

## 4) New Launch-Agent Issue Set Created

- Parent: [#728](https://github.com/lightspeedwp/.github/issues/728)
- Children: [#729](https://github.com/lightspeedwp/.github/issues/729), [#730](https://github.com/lightspeedwp/.github/issues/730), [#731](https://github.com/lightspeedwp/.github/issues/731)
- All three children linked as true sub-issues under [#728](https://github.com/lightspeedwp/.github/issues/728).

## 5) Plugin-Pack Wave Issue Set Created

- Parent: [#732](https://github.com/lightspeedwp/.github/issues/732)
- Children: [#733](https://github.com/lightspeedwp/.github/issues/733), [#734](https://github.com/lightspeedwp/.github/issues/734), [#735](https://github.com/lightspeedwp/.github/issues/735)
- Sub-issue links: all children linked to [#732](https://github.com/lightspeedwp/.github/issues/732).
- OPSX specs created at `active/plugin-pack-waves/`.
