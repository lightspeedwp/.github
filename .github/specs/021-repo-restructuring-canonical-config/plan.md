# Implementation Plan: Repository Restructuring & Canonical Governance Config

**Branch**: `docs/spec-021-repository-restructuring` | **Date**: 2026-10-18 | **Spec**: `.github/specs/021-repo-restructuring-canonical-config/spec.md`

**Input**: Feature specification from `/specs/021-repo-restructuring-canonical-config/spec.md`

**Clarifications Resolved**: Q1: B (custom workflows), Q2: A (canonical templates via routing), Q3: B (keep some local governance)

## Summary

Consolidate duplicate governance configuration from lightspeedwp/ThisOneTimeOnAcidCom into lightspeedwp/.github as the single source of truth, while preserving repo-specific workflows and identifying repo-specific governance items that should remain local. Implementation follows hybrid model: canonical governance (labels, templates) + customizable workflows + light local governance audit.

## Technical Context

**Architecture**: Configuration consolidation and validation automation (not code project)

**Primary Dependencies**: 
- GitHub API (template routing, issue type resolution)
- GitHub Actions (drift detection, validation workflows)
- Git (file auditing, deletion validation)

**Storage**: YAML configuration files (labels.yml, issue-types.yml, branch-labels.yml), Markdown templates (ISSUE_TEMPLATE/*.md, PULL_REQUEST_TEMPLATE/*.md)

**Testing**: 
- Manual validation: PR creation, issue creation, template inspection
- Automation testing: GitHub Actions validation workflow execution
- Drift detection testing: PR rules enforcement

**Target Platform**: GitHub.com (both repositories)

**Project Type**: Configuration management + governance automation

**Scale/Scope**: 
- 2 repositories: lightspeedwp/.github (source of truth) + lightspeedwp/ThisOneTimeOnAcidCom (consumer)
- Governance files: 158 labels, 24 issue types, 26 issue templates, 19 PR templates, custom workflows
- Configuration drift detection across both repos

**Constraints**: 
- No breaking changes to existing workflows
- All deletions must be validated before execution
- PR template routing must work immediately post-consolidation
- Drift prevention must allow custom workflows (not block them)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I (Organisation-Wide Governance Authority)** ✅ PASS  
Consolidating governance to central `.github` repo strengthens single source of truth. ThisOneTimeOnAcidCom references canonical files; no local overrides allowed for governance items. Compliant with "all repositories consuming central configuration MUST comply with decisions made in this repository."

**Principle II (Curated Assets with Locked Governance)** ✅ PASS  
This plan respects LOCKED files (labels.yml, issue-types.yml, templates). Changes to locked governance only through documented amendment process. ThisOneTimeOnAcidCom references, never modifies, canonical files.

**Principle III (Clear Asset Boundaries — No Duplication)** ✅ PASS  
Enforces boundary: governance in `.github/`, custom workflows in ThisOneTimeOnAcidCom/.github/workflows/. Audit component identifies repo-specific items (Exception: may retain some ThisOneTimeOnAcidCom-local governance if repo-specific need is validated). Portable reusable assets remain in top-level folders (agents/, skills/, workflows/, etc.).

**Principle VIII (Branch Strategy Compliance & Automated Enforcement)** ✅ PASS  
Spec already validates branch naming compliance (feat/, fix/, etc.). Plan implements validation workflow enforcing branch prefix → PR template routing. FORBIDDEN prefixes (claude/, copilot/, openai/) remain blocked.

**Principle V (Branch Naming Strategy Non-Negotiable)** ✅ PASS  
Plan validates PR template routing by branch prefix. All consolidated workflows will use canonical branch types.

**Result**: NO VIOLATIONS | All gates pass. Constitutional compliance verified.

---

## Project Structure

### Documentation (this feature)

```text
specs/021-repo-restructuring-canonical-config/
├── spec.md              # Feature specification (clarified, ready for planning)
├── checklists/
│   └── requirements.md  # Quality validation checklist
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (research tasks resolution)
├── data-model.md        # Phase 1 output (governance config entities)
├── quickstart.md        # Phase 1 output (validation scenarios)
├── contracts/           # Phase 1 output (GitHub Actions contract defs)
│   ├── drift-detection.contract.md
│   ├── template-routing.contract.md
│   └── workflow-reference.contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Governance Repositories (in scope)

**Source of Truth**: `lightspeedwp/.github/`
```text
.github/
├── labels.yml                          # 158 canonical labels (LOCKED)
├── issue-types.yml                     # 24 issue types (LOCKED)
├── branch-labels.yml                   # Branch prefix → label mapping (LOCKED)
├── ISSUE_TEMPLATE/                     # 26 canonical issue templates (LOCKED)
│   ├── 01-task.md, 02-bug.md, ...
│   └── [26 total]
├── PULL_REQUEST_TEMPLATE/              # 19 canonical PR templates (LOCKED)
│   ├── pr_feature.md, pr_bug.md, pr_release.md, ...
│   └── [19 total]
├── workflows/
│   ├── pr-template-routing.yml         # Routes by branch prefix
│   ├── drift-detection.yml             # Validates no duplicate governance files
│   ├── issue-routing.yml               # Routes by issue type
│   └── [shared workflows]
└── specs/
    ├── 021-repo-restructuring-canonical-config/
    └── [other specs]
```

**Consumer**: `lightspeedwp/ThisOneTimeOnAcidCom/`
```text
ThisOneTimeOnAcidCom/
├── .github/
│   ├── workflows/                      # CUSTOM WORKFLOWS (maintained locally)
│   │   ├── wordpress-ci.yml            # Repo-specific WordPress CI
│   │   ├── build-assets.yml            # Repo-specific build process
│   │   └── [custom workflows]
│   └── [NO labels.yml, NO issue-types.yml, NO templates here]
│       # ^ All governance items from .github only
└── [WordPress plugin/theme code]
```

**Structure Decision**: Two-repository hybrid model:
- **lightspeedwp/.github** = canonical source of truth (governance files, shared workflows, reusable assets)
- **lightspeedwp/ThisOneTimeOnAcidCom** = consumer repo (references canonical governance, maintains custom workflows, optionally retains repo-specific governance items after audit)

This enforces Principle III asset boundaries while enabling Principle I org-wide governance authority.

---

## Complexity Tracking

No Constitution Check violations found. All principles validated. No complexity trade-offs required.

---

## Phase 0 Research (Complete)

Research artifacts generated: `research.md`

**Key Findings**:
- GitHub template routing requires custom GitHub Actions workflow (native routing exists only for issues)
- Drift detection can be automated via `on: pull_request: paths` workflow trigger
- Custom workflows coexist safely with governance if they reference canonical labels via API (not duplication)
- Repo-specific governance items identified via audit process
- YAML configuration standard for all config files

**All NEEDS CLARIFICATION markers resolved.** Ready for Phase 1 Design.

---

## Phase 1 Design (Complete)

Design artifacts generated:

1. **data-model.md** — Governance entities (Labels, Issue Types, PR Templates, Issue Templates, Branch Types, Custom Workflows) with fields, validation rules, relationships

2. **contracts/** — GitHub Actions workflow contracts:
   - `drift-detection.contract.md` — Blocks duplicate governance files; allows custom workflows
   - `template-routing.contract.md` — Routes PRs to canonical templates by branch type
   - `workflow-reference.contract.md` — Standards for custom workflows (API references, no duplication)

3. **quickstart.md** — 5 validation scenarios proving end-to-end consolidation works:
   - Scenario 1: Single source of truth verified
   - Scenario 2: PR template routing by branch type
   - Scenario 3: Drift detection blocks duplicates, allows custom workflows
   - Scenario 4: Issue template routing
   - Scenario 5: Custom workflows use canonical labels via API

**Constitution Check Re-validation (Post-Design)**: ✅ PASS  
All principles remain satisfied. No violations introduced.

---

## Next Phase: Phase 2 (Task Decomposition)

`/speckit-tasks` will decompose implementation into actionable tasks:
1. Audit existing ThisOneTimeOnAcidCom governance files
2. Identify repo-specific vs. duplicative items
3. Remove duplicate governance files
4. Implement GitHub Actions drift detection workflow
5. Implement GitHub Actions PR template routing workflow
6. Update documentation (hybrid model explanation)
7. Run validation scenarios (Quickstart)
8. Verify CI/CD passes across both repos

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
