# Implementation Plan: Branch Naming Strategy & Enforcement

**Branch**: `feat/branch-naming-strategy-phase-3` | **Date**: 2026-09-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from [spec.md](./spec.md) - 5 user stories, 10 functional requirements, 10 success criteria (38 authorized branch types)

**Timeline**: 6 weeks (48-62 hours) across 6 phases; deployed to 50+ LightSpeed repositories with 200+ developers

## Summary

Deploy a distributed branch naming validation system that enforces the pattern `{type}/{scope}-{title}` across LightSpeed organization. The system validates branches locally (pre-push hook <1s feedback), enforces remotely (GitHub Actions), and automates PR template routing and label application based on branch type. Supports 38 authorized types, blocks 3 forbidden prefixes (claude/, copilot/, openai/), and scales to 50+ repositories without per-repo configuration.

**Technical Approach**: Three-tier validation (local hook + remote workflow + CLI) with GitHub Actions automation for template/label routing. Node.js validation library with Husky hook integration. Single-source-of-truth configuration in YAML (`.github/branch-types.yml`, `.github/branch-labels.yml`). No modifications to existing locked files (`.github/labels.yml`, `.github/PULL_REQUEST_TEMPLATE/*.md`). Full backwards compatibility for existing repos and branches.

## Technical Context

**Language/Version**: JavaScript (Node.js 18+); npm 8+ for hook installation and scripts

**Primary Dependencies**:

- Husky (Git hooks manager) — optional, for easier distribution; fallback to core.hooksPath
- GitHub Actions native (no external packages)
- github-script action (Label routing via REST API)

**Storage**: GitHub (branch metadata from API, metrics as JSON artifacts); optional Google Sheets integration for dashboards

**Testing**: Jest (unit tests for validation library); GitHub Actions workflow testing; integration tests across 10+ sample branches

**Target Platform**:

- Developer machines: macOS, Linux (any OS with Git 2.9+ and Node 18+)
- GitHub: GitHub Actions runners (Ubuntu standard)
- Repository: Any GitHub-hosted Git repository using GitHub Actions

**Project Type**: Distributed validation system (library + CLI + Git hooks + GitHub Actions workflows)

**Performance Goals**:

- Local hook validation: <1 second latency (sub-second feedback on developer machine)
- GitHub Actions workflow: <10 seconds total (validation + label routing)
- CLI command: <1 second per branch name validation
- Compliance metrics: Queryable within 5 minutes of push

**Constraints**:

- Cannot modify locked files (`.github/labels.yml`, `.github/PULL_REQUEST_TEMPLATE/*.md`, `.github/ISSUE_TEMPLATE/*.md`)
- Must not break existing PR template routing or label automation
- Must support gradual rollout (not all 50+ repos at once)
- Must handle backwards-compatibility for existing invalid branches (grace period or enforcement from Day 1 — TBD in research)

**Scale/Scope**:

- 50+ repositories in LightSpeed organization
- 200+ active developers
- ~10,000-15,000 new branches per month (estimated)
- 19 existing PR templates to integrate with (mapped to 38 branch types)
- 158 canonical labels in `.github/labels.yml` (read-only, not modified)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Governance Alignment** (LightSpeed CLAUDE.md):

- Branch naming follows authorized pattern: `feat/branch-naming-strategy-phase-3`
- Uses UK English throughout (organisation, optimise, behaviour)
- Respects locked files (`.github/labels.yml`, `.github/PULL_REQUEST_TEMPLATE/*.md`) — implementation reads but never writes
- Portable components (validation lib, hooks, workflows) placed in top-level reusable folders, not locked `.github/`
- No secrets, credentials, or internal hostnames in specs or configurations
- Follows coding standards: JavaScript (ESLint + Prettier), Markdown (lint-md), YAML (standard format)

**Potential Violations & Resolutions**:

- ⚠️ **Issue**: Modification of `.github/labels.yml` or PR templates breaks governance
  - **Resolution**: Implementation reads these files, applies labels from canonical set, routes to existing templates. Zero write operations to locked files.
  - **Verification**: All tasks reviewed to confirm no write access to locked paths

- ⚠️ **Issue**: New GitHub Actions workflows might conflict with existing automation
  - **Resolution**: New workflows use unique names (`branch-name-validation.yml`, `pr-template-routing.yml`), run on different events, tested for execution order
  - **Verification**: Workflow testing includes conflict detection and de-duplication tests

✅ **Re-check After Phase 1**: Design will include test matrix for workflow conflicts and locked file verification

## Project Structure

### Documentation (this feature)

```text
specs/004-branch-naming-strategy/
├── spec.md                          # Feature specification (5 stories, 10 requirements)
├── plan.md                          # This file (architecture, timeline, phases)
├── research.md                      # Phase 0 research (git hooks, metrics, backwards compat)
├── data-model.md                    # Phase 1 entity definitions (BranchName, BranchType, Metrics)
├── quickstart.md                    # Phase 1 validation guide & runbook
├── contracts/
│   └── branch-naming.contract.md   # Type mappings, validation rules, error messages
├── tasks.md                         # Phase 2-6 task breakdown (51 tasks, dependencies)
└── checklists/
    └── requirements.md              # Spec quality validation (all items pass)
```

### Source Code (repository root)

```text
lib/
├── validate-branch-name.js          # Core validation library
├── hooks/
│   └── pre-push                     # Git pre-push hook script
└── __tests__/
    ├── validate-branch-name.test.js # Unit tests for validation
    └── hooks.test.js                # Hook integration tests

.github/
├── workflows/
│   ├── branch-name-validation.yml   # Phase 2: Remote enforcement on every push
│   └── pr-template-routing.yml      # Phase 3: Auto-route templates and labels on PR creation
├── branch-types.yml                 # Phase 3: Type → PR template mapping (24 types)
├── branch-labels.yml                # Phase 3: Type → default labels mapping
├── PULL_REQUEST_TEMPLATE/           # Existing (NOT modified)
│   ├── pr_feature.md
│   ├── pr_bugfix.md
│   ├── pr_security.md
│   └── ... (19 templates total)
└── labels.yml                       # Existing canonical labels (NOT modified)

docs/
└── BRANCHING_STRATEGY.md            # Phase 4: Developer guide for 24 types and pattern

package.json                         # Scripts: validate:branch-name, prepare (hook setup)
.gitignore                           # Patterns for /lib, tests
.npmrc / npm-publish-config.json     # If publishing as npm package
```

**Structure Decision**: Single Node.js library with Git hooks (Option 1 selected)

- No monorepo complexity (feature is self-contained)
- Validation library is portable (can be installed as npm package in any repo)
- GitHub Actions workflows are repo-level (one copy per repository, deployed during rollout)
- Scalable: same library + hooks + workflows replicated to 50+ repos with minimal per-repo config

## Implementation Phases

### Phase 0: Research & Decision-Making (Week 1 — 12 hours)

**Key Decisions to Research**:

1. Git hook distribution: Husky vs. core.hooksPath vs. hybrid?
2. Compliance metrics storage: GitHub Actions artifacts vs. Sheets webhook vs. GraphQL API?
3. Template routing conflicts: How to resolve ambiguous branch types?
4. Backwards compatibility: Grace period for existing invalid branches, or enforce from Day 1?
5. Workflow execution order: Validate conflicts with existing label automation

**Research Output**: `research.md` documenting decisions and rationale

### Phase 1: Design & Contracts (Week 1-2 — 8 hours, concurrent with Phase 0)

**Deliverables**:

- `data-model.md` — BranchName, BranchType, ComplianceMetrics entities (38 types)
- `contracts/branch-naming.contract.md` — Type definitions (38 types), routing rules, validation rules
- `quickstart.md` — Validation guide and runnable tests

### Phase 2: Core Validation & Enforcement (Weeks 2-3 — 20 hours)

**Deliverables**:

- Validation library: `lib/validate-branch-name.js`
- Git hook: `lib/hooks/pre-push`
- CLI command: `npm run validate:branch-name`
- GitHub Actions workflow: `.github/workflows/branch-name-validation.yml`
- Unit tests: `lib/__tests__/validate-branch-name.test.js`
- Initial testing on 2-3 pilot repos

**Success Criteria**: 100% validation accuracy, <1s latency, clear error messages

### Phase 3: Template & Label Routing (Weeks 3-4 — 16 hours)

**Deliverables**:

- Configuration: `.github/branch-types.yml` (38 types → PR templates)
- Configuration: `.github/branch-labels.yml` (38 types → default labels)
- GitHub Actions workflow: `.github/workflows/pr-template-routing.yml`
- Integration with 19 existing PR templates (audit + testing)
- Label routing testing on 50+ sample PRs

**Success Criteria**: 100% template routing accuracy, 100% correct label application

### Phase 4: Integration & Documentation (Weeks 4-5 — 12 hours)

**Deliverables**:

- Developer guide: `docs/BRANCHING_STRATEGY.md`
- Updated CLAUDE.md with branch naming rules (already started)
- PR template routing runbook
- Compliance metrics dashboard (prototype)
- Training materials for team leads

**Success Criteria**: All documentation complete, team leads trained and confident

### Phase 5: Pilot Rollout — First Wave (Week 5 — 8 hours)

**Target**: 10-20 pilot repos (mix of sizes and team types)

**Deliverables**:

- Publish validation library to npm (or internal registry)
- Deploy workflows to pilot repos
- Monitor, iterate on error messages
- Collect feedback and adjust

**Success Criteria**: 95% pilot developers using valid branches, <5 support tickets/day

### Phase 6: Full Rollout & Operations (Week 6+ — 16 hours, ongoing)

**Target**: All 50+ LightSpeed repos

**Deliverables**:

- Deploy to remaining repos
- Automated compliance metrics pipeline
- Establish handling process for grandfathered branches
- Ongoing monitoring and support

**Success Criteria**: 95% compliance across all repos within 3 months, 90% reduction in template misrouting tickets

---

## Complexity Tracking

No Constitution violations requiring justification. Implementation respects all governance rules and existing system constraints.

**Key Design Decisions** (justified in architecture):

| Decision | Why | Alternative Considered |
|----------|-----|------------------------|
| Node.js validation library | Aligned with repo's existing npm tooling; portable across repos | Python (would require per-repo setup), Go (adds complexity) |
| Husky for hook distribution | Industry standard, easy install via `npm install`; strong community support | core.hooksPath (lighter but fragile); manual setup (error-prone) |
| GitHub Actions workflows | Native GitHub integration, no external services; triggers on push/PR events | Custom CI server (adds complexity), webhook handler (external failure point) |
| YAML config (branch-types.yml) | Single source of truth, easy to audit and maintain; versionable in Git | Database (adds infrastructure), code config (less auditable) |
| Gradual rollout (pilot first) | Reduces risk, allows feedback iteration before org-wide deployment | Big bang deployment (high risk of coordination issues across 50+ repos) |
| Read-only access to labels.yml | Respects governance constraints, prevents accidental conflicts | Modifying labels.yml (breaks governance, risks automation breakage) |

---

## Next Steps

**Phase 0**: Run `/speckit-tasks` to generate the 51-task breakdown with dependencies, parallelization markers [P], and time estimates.

**Then Phases 1-6**: Run `/speckit-implement` to execute tasks and build the validation system end-to-end, with progress tracking and validation gates at each phase completion.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
