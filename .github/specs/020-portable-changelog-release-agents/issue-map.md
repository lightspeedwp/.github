# Issue Map: Spec 020 Existing Work

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Delivery plan**: [delivery-plan.md](./delivery-plan.md)

**Read on**: 2026-10-09 from GitHub (`lightspeedwp/.github`) and Linear. Records were read by this session and by a read-only research agent. Nothing in this file has been applied: no GitHub or Linear record, title, body, label, native issue type, parent or assignee was changed. Every proposal needs the separate approval described in [Approval preview](#approval-preview).

Linear is the planning system of record. Where GitHub and Linear disagree, both are shown and the disagreement is listed in [Gaps and mismatches](#gaps-and-mismatches).

**Conventions**: GitHub issue links are full URLs. Native GitHub issue types (the issue Type field) are separate from `type:*` labels and are shown separately. Linear classifications are not copied onto GitHub. Task IDs are pending `/speckit-tasks`, so the mapping column uses user stories (US1 to US5), functional requirements (FR) and target paths instead.

## Parent and programme

| Record | Current state | Proposed role | Preserve | Proposed change |
|--------|---------------|---------------|----------|-----------------|
| [GitHub #1546](https://github.com/lightspeedwp/.github/issues/1546) / [GIT-1293](https://linear.app/lightspeedwp/issue/GIT-1293/epic-portable-agents-deliver-the-essential-first-wave) | GitHub open, native type Task, labels `type:task`, `area:agents`, `area:release`, `priority:critical`, `status:needs-triage`; milestone v1.1; 16 sub-issues, 3 complete. Linear: Tracking, Ash Shaw, 18 children, 3 Done. | First-wave programme: release (priority 1), changelog (priority 2), deferred rollout. | Current manual edits; its own note that earlier phase status and "no blockers" claims are historical. | Reconcile body so it carries no stale completion or deadline claims. Do not auto-close. No umbrella implementation PR. |

## Spec 020 primary issues

| GitHub | Linear | Native type | Current labels (prefixed) | State | Proposed bounded role | Proposed delta | Delivery slice | Story / FR / path |
|--------|--------|-------------|---------------------------|-------|-----------------------|----------------|----------------|-------------------|
| [#1555](https://github.com/lightspeedwp/.github/issues/1555) | [GIT-1302](https://linear.app/lightspeedwp/issue/GIT-1302/aiops-release-agent-specify-portable-multi-repo-support) In Progress, Ash Shaw, parent GIT-1293 | AI Ops | `type:aiops`, `area:release`, `priority:normal`, `status:needs-triage` | Open (reopened 2026-09-23 as planned, not started) | Primary spec 020 tracker | Title: `docs: release-agents - Specify portable changelog and release agents`. Native type to Documentation and `type:docs` only after independent checks. | S | All stories; `.github/specs/020-portable-changelog-release-agents/` |
| [#1553](https://github.com/lightspeedwp/.github/issues/1553) | [GIT-1300](https://linear.app/lightspeedwp/issue/GIT-1300/docs-release-process-generate-requirements-from-github-spec-kit) Backlog, Ash Shaw, parent GIT-1293 | Task | `type:task`, `area:release`, `priority:normal`, `status:needs-planning` | Open | Requirements and traceability contribution | Keep accepted requirements; drop unverified fixed requirement counts. Reference-only to S. | S | FR-001 to FR-027; `spec.md`, `checklists/requirements.md` |
| [#1554](https://github.com/lightspeedwp/.github/issues/1554) | [GIT-1301](https://linear.app/lightspeedwp/issue/GIT-1301/design-release-process-create-architecture-diagrams-and-workflow-yaml) Todo, Ash Shaw, parent GIT-1293 | Task | same as #1553 | Open | Architecture and interfaces | Scope to diagrams and design contracts, not active executable workflow YAML. | S | `contracts/`, `data-model.md` |
| [#1556](https://github.com/lightspeedwp/.github/issues/1556) | [GIT-1303](https://linear.app/lightspeedwp/issue/GIT-1303/aiops-changelog-agent-define-the-changelog-agent-specification) Backlog, Ash Shaw, parent GIT-1293 | Bug | `type:bug`, `area:release`, `priority:normal`, `status:needs-planning` | Open (reopened) | Changelog specification contribution | Re-read current state; keep Reference-only until accepted criteria are covered. Native type and `type:bug` do not match the title; correction proposed, not assumed. | S | US2, FR-009 to FR-013 |
| [#1557](https://github.com/lightspeedwp/.github/issues/1557) | [GIT-1304](https://linear.app/lightspeedwp/issue/GIT-1304/design-wordpress-versioning-specify-plugin-and-theme-support) Todo, Ash Shaw, parent GIT-1293 | Task | `type:task`, `area:release`, `priority:normal`, `status:needs-planning` | Open | WordPress plugin and theme version-field design | Optional `VERSION`; authoritative headers, readme, `style.css`, configuration. | S | US1, FR-003, FR-004 |

## Implementation slices

| GitHub | Linear | Native type | Current labels (prefixed) | State | Proposed bounded role | Proposed delta | Delivery slice | Story / FR / path |
|--------|--------|-------------|---------------------------|-------|-----------------------|----------------|----------------|-------------------|
| [#1563](https://github.com/lightspeedwp/.github/issues/1563) | [GIT-1310](https://linear.app/lightspeedwp/issue/GIT-1310/aiops-release-agent-build-portable-agent) "Build portable agent", In Progress, Ash Shaw, no parent | Documentation | `area:automation`, `area:release`, `priority:normal`, `status:ready`, `status:needs-triage`; no `type:` label | Open (reopened 2026-09-23); no GitHub parent | Release preparation MVP, priority 1 | Title: `aiops: release-agent - Deliver portable preparation MVP`; correct obsolete `agents/release/` to `agents/release-agent/` in the preview; add `type:aiops`; native type to AI Ops. | R1 | US1, US3, US4, FR-001 to FR-008, FR-014 to FR-022; `agents/release-agent/` |
| [#2653](https://github.com/lightspeedwp/.github/issues/2653) | [GIT-1744](https://linear.app/lightspeedwp/issue/GIT-1744/aiops-changelog-automation-create-portable-shared-skill) "Create portable shared skill", Todo, Chris, no parent | Task | `type:aiops`, `area:automation`, `priority:high`, `status:needs-triage` | Open; GitHub assignees eleshar and ashleyshaw | Standalone changelog MVP, priority 2 | Title: `aiops: changelog-agent - Deliver portable changelog MVP`; preserve the five-operation shared-skill obligations (FR-013). | C2 | US2, US3, FR-009 to FR-015; `agents/changelog-agent/` |
| [#1565](https://github.com/lightspeedwp/.github/issues/1565) | [GIT-1312](https://linear.app/lightspeedwp/issue/GIT-1312/automation-wordpress-plugins-add-version-handling) Todo, Ash Shaw, parent GIT-1293 | Documentation | `type:automation`, `area:release`, `status:ready` | Open | Plugin version adapter acceptance, traced to R1 | Trace to reused utilities, not a second implementation. Optional separate slice only if independently reviewable. | R1 (optional adapter slice) | US1, US4, FR-004, FR-016 |
| [#1566](https://github.com/lightspeedwp/.github/issues/1566) | [GIT-1313](https://linear.app/lightspeedwp/issue/GIT-1313/automation-wordpress-themes-add-version-handling) Todo, Ash Shaw, parent GIT-1293 | Documentation | `type:automation`, `area:release`, `status:ready` | Open | Theme version adapter acceptance, traced to R1 | As #1565, with theme fixtures. | R1 (optional adapter slice) | US1, US4, FR-004, FR-016 |
| [#3880](https://github.com/lightspeedwp/.github/issues/3880) | [GIT-2623](https://linear.app/lightspeedwp/issue/GIT-2623/aiops-release-agents-consolidate-release-and-changelog-agent-guidance) In Review, Zared, no parent | not set | `type:dependency`, `area:instructions`, `priority:normal`, `status:needs-triage` | Open; assignee ZaredRogers | Canonical source migration verification | Reuse the existing work and PR 3881; do not duplicate the migration. | F (existing) | FR-017, FR-018; prerequisite for R1 and C2 |

## Decisions, documentation and later slices

| GitHub | Linear | Native type | State | Proposed role | Proposed delta | Delivery slice |
|--------|--------|-------------|-------|---------------|----------------|----------------|
| [#3470](https://github.com/lightspeedwp/.github/issues/3470) | [GIT-2624](https://linear.app/lightspeedwp/issue/GIT-2624/docs-changelog-agent-document-specification-decisions) Todo, Ash Shaw, parent GIT-1293 | not set; GitHub parent is #3464 | Open, unassigned on GitHub | Spec 016 owner decisions | Title `docs: changelog-agent - Document specification decisions`; no runtime remediation approval inferred. Linear and GitHub titles and parents differ. | DEC |
| [#1558](https://github.com/lightspeedwp/.github/issues/1558) | [GIT-1305](https://linear.app/lightspeedwp/issue/GIT-1305/docs-release-process-plan-documentation-reorganisation) Todo | Task | Open | One later documentation restructure and missing-doc inventory | Title `docs: portable-agents - Restructure and complete guidance`; widen planning-only scope only by approved preview. | DOC |
| [#1568](https://github.com/lightspeedwp/.github/issues/1568), [#1569](https://github.com/lightspeedwp/.github/issues/1569), [#1570](https://github.com/lightspeedwp/.github/issues/1570) | [GIT-1315](https://linear.app/lightspeedwp/issue/GIT-1315/docs-branching-strategy-align-documentation), [GIT-1316](https://linear.app/lightspeedwp/issue/GIT-1316/docs-changelog-automation-update-documentation), [GIT-1317](https://linear.app/lightspeedwp/issue/GIT-1317/docs-wordpress-release-create-release-guide) Todo | Documentation | Open | Branching, changelog and WordPress guide obligations | Reconcile into DOC; existing docs are not greenfield; no competing docs PRs. | DOC |
| [#3873](https://github.com/lightspeedwp/.github/issues/3873) | [GIT-2617](https://linear.app/lightspeedwp/issue/GIT-2617/aiops-developer-onboarding-define-agent-configuration) Todo, Warwick, parent GIT-2614 | not set | Open; assignee krugazul; GitHub parent is a cross-repository issue | Local, global and project discovery and scaffold configuration contract | Preserve the manually expanded scope and its current parent; dependency only, no automatic reparent. | SETUP |
| [#3468](https://github.com/lightspeedwp/.github/issues/3468) | [GIT-2306](https://linear.app/lightspeedwp/issue/GIT-2306) Backlog, unassigned, parent GIT-2302; Linear LS-4233 (Todo, Ash Shaw, no parent) | AI Ops | Open, no milestone | Marketplace and install distribution | Use the existing delivery record. LS-4233 overlaps GIT-2306 and needs an explicit disposition; whether it is linked to #3468 is unconfirmed. | DIST (later) |
| [#1560](https://github.com/lightspeedwp/.github/issues/1560) | [GIT-1307](https://linear.app/lightspeedwp/issue/GIT-1307/automation-release-workflow-update-workflow-configuration) Todo | Security | Open | Portable release workflow validation (deferred) | Review the archived workflow and its tests first; automation classification to be confirmed. | WFLOW (later) |
| [#1562](https://github.com/lightspeedwp/.github/issues/1562) | [GIT-1309](https://linear.app/lightspeedwp/issue/GIT-1309/automation-release-workflow-create-rollback-automation) Todo | Security | Open | Rollback automation (deferred) | Bounded rollback outcome after the workflow contract. | ROLLBACK (later) |

**Historical, no reopening by default**: [#1559](https://github.com/lightspeedwp/.github/issues/1559) (closed completed, PR 1637), [#1561](https://github.com/lightspeedwp/.github/issues/1561) (closed completed, PR 1658), [#1567](https://github.com/lightspeedwp/.github/issues/1567) (closed completed, PR 2272). [#1564](https://github.com/lightspeedwp/.github/issues/1564) is closed `not_planned` and superseded; it is not active changelog delivery.

**Existing PRs**: PR [#3881](https://github.com/lightspeedwp/.github/pull/3881) is open, not a draft, mergeable state `blocked`, head `7e0bcaab55703f0866d1c063c0b6e7530b97b747`, base `develop`, 27 files (+111, -406), body `Closes #3880`. Merged PR [#3820](https://github.com/lightspeedwp/.github/pull/3820) delivered the changelog spec, skill and index alignment and is reused. PR [#2655](https://github.com/lightspeedwp/.github/pull/2655) is closed unmerged and is not delivery proof. The spec PR for this work is [#3883](https://github.com/lightspeedwp/.github/pull/3883).

## Roadmap-only first-wave records

These are links, not spec 020 tasks, and are not reparented. Linear children of GIT-1293 outside spec 020: [GIT-701](https://linear.app/lightspeedwp/issue/GIT-701/aiops-pr-agent-complete-portable-consolidation) (pr-agent, Todo, Brandon) and [GIT-106](https://linear.app/lightspeedwp/issue/GIT-106/refactor-issue-agent-verify-portable-source-migration) (issue-agent, Todo). The GitHub issue number for GIT-701 and the Linear and GitHub identities for the PRD, linting, reviewer, testing, PageSpeed, design-partner and reporting agents were not read in this session and remain **UNREAD**. Confirm real issues exist before any closure keyword is used.

## Owner and decision gaps

| Gap | Detail |
|-----|--------|
| Parenting | GIT-1310, GIT-1744 and GIT-2623 have no parent in Linear (GIT-2617 sits under GIT-2614). #1563, #2653 and #3880 also have no GitHub parent. Whether they belong under GIT-1293 is the owner's call. |
| Ownership | GIT-1744 is assigned to Chris and GIT-2623 to Zared; GitHub #2653 lists eleshar and ashleyshaw. Ownership is preserved and not reassigned. |
| Why PR 3881 is blocked | Not shown by the API; reviews were not read (**UNREAD**). |
| Identity of eleshar and Chris | Not established here; do not infer. |

## Gaps and mismatches

1. **#3470 / GIT-2624**: titles differ (`task: resolve spec 016 changelog-agent design findings` versus `docs: changelog-agent - Document specification decisions`), labels differ (`type:task` versus `type:docs`), and parents differ (#3464 versus GIT-1293).
2. **#3468 / LS-4233 / GIT-2306**: two Linear issues for one GitHub topic; titles differ (`aiops:` versus `task:`).
3. **#1555 / GIT-1302**: Linear says In Progress; GitHub comments say the planned work had not started.
4. **Native issue types**: several do not match their titles (#1560 to #1562 Security for automation; #1563 to #1566 Documentation for aiops and automation; #1556 Bug for a specification). #1563 and #1564 have no `type:` label.
5. **Legacy labels**: Linear GIT-1303 and others carry `migrate:` labels; GitHub issues carry bare-label warnings from automation. None of these is used to infer scope.
6. **Epic wording**: the epic is now titled `epic: portable-agents`, while several children still describe "Release Process Redesign".

## Approval preview

**Nothing below is applied.** Approval for the spec PR does not imply approval for any of these. Each line is an exact, independently approvable change; approving one does not approve the others. Native issue type, `type:*` label, parent and assignee are listed separately because they are separate fields.

| ID | Target | Field | Current | Proposed |
|----|--------|-------|---------|----------|
| A1 | GitHub #1555 | Title | `aiops: release-agent - Specify portable multi-repo support` | `docs: release-agents - Specify portable changelog and release agents` |
| A2 | GitHub #1555 | Native type, label | AI Ops, `type:aiops` | Documentation, `type:docs` (only after independent checks) |
| A3 | GitHub #1563 | Title | `aiops: release-agent - Build portable agent` | `aiops: release-agent - Deliver portable preparation MVP` |
| A4 | GitHub #1563 | Native type, label | Documentation, no `type:` label | AI Ops, `type:aiops` |
| A5 | GitHub #2653 | Title | `aiops: changelog-automation - Create portable shared skill` | `aiops: changelog-agent - Deliver portable changelog MVP` |
| A6 | GitHub #3470 | Title | `task: resolve spec 016 changelog-agent design findings` | `docs: changelog-agent - Document specification decisions` |
| A7 | GitHub #1558 | Title | `docs: release-process - Plan documentation reorganisation` | `docs: portable-agents - Restructure and complete guidance` |
| A8 | GitHub #1546 | Body | Current epic body | Remove stale completion or deadline claims; keep Linear link |
| A9 | Linear GIT-1310, GIT-1744, GIT-2623 | Parent | none | Decision needed: GIT-1293 or leave as is |
| A10 | Linear GIT-1302, GIT-1310, GIT-1744 | Title | Linear titles as above | Match the GitHub titles after A1, A3 and A5 |
| A11 | Linear LS-4233 versus GIT-2306 | Disposition | Two records for #3468 | Decision needed: merge, link or keep both |

No issue is closed, reopened, reparented or reassigned by this map. Replacement issues are not proposed because existing records fit every role.
