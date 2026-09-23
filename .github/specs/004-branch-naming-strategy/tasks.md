# Tasks: Branch Naming Strategy & Enforcement

**Input**: Design documents from `/specs/004-branch-naming-strategy/`

**Prerequisites**: plan.md (6-week timeline, tech stack), spec.md (5 user stories), research.md (research decisions), data-model.md (entities), contracts/branch-naming.contract.md (type mappings), quickstart.md (validation scenarios)

**Scope**: 51+ tasks across 6 phases (Research, Design, Core Validation, Routing, Integration, Rollout) supporting 38 authorized branch types

**Technology Stack**: Node.js, GitHub Actions, Husky, YAML configuration, npm scripts

**Organization**: Tasks grouped by phase and user story to enable parallel execution and independent testing

**Note**: Specification updated to align with Constitution Principle V (38 authorized types, not 24). All type mappings, regexes, and configurations must reflect complete 38-type set.

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Paths must match plan.md structure (`lib/`, `.github/workflows/`, `docs/`, etc.)

---

## Phase 0: Research & Decision-Making

**Purpose**: Resolve unknowns from technical context, establish architectural decisions

**Duration**: ~12 hours (Week 1)

**Gate**: All research questions answered before Phase 1 design work begins

### Research Tasks

- [x] T001 [P] Research Git hook distribution strategy (Husky vs. core.hooksPath vs. hybrid); document findings, trade-offs, and recommendation in research.md
- [x] T002 [P] Research compliance metrics storage approach (GitHub Actions artifacts vs. Sheets webhook vs. GraphQL); evaluate cost/latency/queryability; update research.md with decision
- [x] T003 [P] Research template routing conflict resolution; audit branch naming in 10+ sample repos; identify ambiguous type patterns; document resolution rules in research.md
- [x] T004 [P] Research backwards compatibility policy; scan 50+ repos for invalid existing branches; count violation types; propose grace period or enforcement-from-day-1; update research.md
- [x] T005 Research GitHub Actions workflow execution order; test `branch-name-validation` + `pr-template-routing` + existing label automation for conflicts; document execution diagram in research.md
- [x] T006 Validate validation library dependency strategy; confirm Node.js 18+ and npm 8+ available in 50+ repos; document findings in research.md

**Checkpoint**: research.md complete with all 6 research questions resolved

---

## Phase 1: Design & Contracts

**Purpose**: Finalize entity model, API contracts, and validation runbook

**Duration**: ~8 hours (Weeks 1-2, concurrent with Phase 0)

**Gate**: data-model.md, contracts/, quickstart.md ready for implementation

### Design Completion Tasks (Artifact Generation)

- [x] T007 Finalize BranchName entity definition; confirm 15 fields, validation rules, computed properties; review against data-model.md
- [x] T008 Finalize BranchType entity definition; ensure all 38 types mapped to PR templates and labels; confirm area detection keywords
- [x] T009 Finalize ComplianceMetrics entity definition; design aggregation strategy and trend analysis approach
- [x] T010 [P] Audit `.github/labels.yml` canonical set; verify all labels in data-model.md exist; document canonical prefix rules in contracts/branch-naming.contract.md
- [x] T011 [P] Audit `.github/PULL_REQUEST_TEMPLATE/` directory; confirm all 19 PR template files exist; verify routing mapping covers all 38 types; document in contracts/branch-naming.contract.md
- [x] T012 [P] Design area label detection algorithm; extract keywords for each area (api, docs, ui, ci, security, database, testing); update contracts/branch-naming.contract.md with keyword mappings
- [x] T013 Design error message system; create message templates for 6 error cases (invalid_type, forbidden_prefix, malformed_scope, malformed_title, empty_scope, empty_title) with examples; document in contracts/branch-naming.contract.md

### Validation Runbook Tasks

- [x] T014 [P] Create quickstart.md Section 1: Setup instructions for hook installation and verification
- [x] T015 [P] Create quickstart.md Section 2-9: Nine validation test scenarios (valid branches, invalid types, forbidden prefixes, malformed scope/title, full workflow, hook bypass, exit codes, JSON output)
- [x] T016 Create quickstart.md Section 10: PR template routing verification checklist
- [x] T017 [P] Create quickstart.md Section 11: Troubleshooting guide (5+ common issues with solutions)

**Checkpoint**: data-model.md, contracts/, quickstart.md validated and ready for implementation; all design decisions documented

---

## Phase 2: Core Validation & Enforcement

**Purpose**: Build validation library, Git hook, CLI, and remote enforcement; establish local-first feedback

**Duration**: ~20 hours (Weeks 2-3)

**Dependencies**: Phase 0 research complete, Phase 1 design complete

**Gate**: Validation library works end-to-end; <1s feedback on developer machine; remote enforcement on GitHub

### US1 Implementation: Developer Creates Feature Branch with Local Validation

**Goal**: Developers can create valid branches and receive <1s feedback locally; invalid branches blocked with clear suggestions

**Independent Test**: Local hook validates valid branch (pass), rejects invalid branch (fail with suggestion), handles all error cases

#### Validation Library Tasks (Core)

- [x] T018 [P] [US1] Create `lib/validate-branch-name.js` core library with:
  - Regex pattern validation against pattern defined in contracts (38 types, scope-title format)
  - Forbidden prefix detection (claude/, copilot/, openai/)
  - Return: `{valid: boolean, type?, scope?, title?, errors: [], suggested_name?}`
- [x] T019 [P] [US1] Implement type validation in `lib/validate-branch-name.js`; validate against list of 38 types from contracts/branch-naming.contract.md
- [x] T020 [P] [US1] Implement scope/title validation in `lib/validate-branch-name.js`; enforce lowercase, hyphens only, no consecutive hyphens, no underscores/spaces/special chars
- [x] T021 [US1] Implement error message generation in `lib/validate-branch-name.js`; create messages for all 6 error cases with suggestions using fuzzy matching

#### Unit Test Tasks (Validation Library)

- [x] T022 [P] [US1] Create `lib/__tests__/validate-branch-name.test.js` with tests for 38 valid types (all must pass); test 3 forbidden prefixes (all must fail); test malformed scope/title (all must fail)
- [x] T023 [P] [US1] Add unit tests for edge cases: empty scope/title, consecutive hyphens, uppercase letters, special characters, very long branch names
- [x] T024 [P] [US1] Add unit tests for error message suggestions; verify suggestions are actionable and correct

#### Git Hook Tasks

- [x] T025 [US1] Create `lib/hooks/pre-push` script; invoke validation library on branch name from `git rev-parse --abbrev-ref HEAD`; block push if invalid; output error with suggestion
- [x] T026 [US1] Add hook output formatting; use ✅ for valid, ❌ for invalid; include error reason and suggestion; make output user-friendly (not technical)
- [x] T027 [US1] Implement hook bypass detection; detect --force/--force-with-lease flags; skip validation for forced pushes; note that git push --no-verify bypasses hook entirely (handled by Git)

#### CLI Command Tasks

- [x] T028 [US1] Create `npm run validate:branch-name` CLI command; invoke validation library with branch name from argument (--branch flag)
- [x] T029 [US1] Add CLI options: `--json` for machine-readable output; `--current` to validate current branch; `--help` for usage
- [x] T030 [US1] Implement CLI exit codes: 0 for valid, 1 for invalid (for scripting/CI integration)

#### Hook Installation Tasks

- [x] T031 [US1] Create `lib/hooks/install.js` script to install `.git/hooks/pre-push` on `npm install` (via postinstall script)
- [x] T032 [US1] Add `npm run prepare` script and `postinstall` script to set up hook on clone/install
- [x] T033 [US1] Implement hook upgrade mechanism; check version in marker file and re-install if out of date

#### Integration Tests (Local Hook)

- [x] T034 [P] [US1] Create CLI validation tests; verify hook allows valid branches like `feat/test-validation`
- [x] T035 [P] [US1] Create CLI rejection tests; verify hook rejects invalid branches like `claude/test-feature`
- [x] T036 [P] [US1] Verify hook respects `--force` and `--force-with-lease` flags; document that `--no-verify` bypasses hook (Git feature)

**Checkpoint: US1 Complete** — Developers can create branches locally, receive instant <1s validation feedback, and see clear error messages with suggestions; invalid branches blocked at push time

---

### US2 Implementation: Organization Automates Branch Validation at Remote

**Goal**: GitHub Actions enforces validation on all pushes; compliance metrics collected; developers cannot bypass remote enforcement

**Independent Test**: Invalid branch pushed (with --no-verify) is caught by remote workflow; PR shows validation failure comment; merge is blocked if enforcement enabled

#### GitHub Actions Workflow: Branch Validation

- [x] T037 [US2] Create `.github/workflows/branch-name-validation.yml` workflow; trigger on `push` to any branch; validate branch name against pattern and forbidden prefixes
- [x] T038 [US2] Implement workflow validation step; parse branch name from `github.event.ref`; invoke validation logic (reuse validation library or inline regex); set job status to fail if invalid
- [x] T039 [US2] Add workflow output; if valid, set success status; if invalid, capture error type and suggested branch name in output
- [x] T040 [US2] Implement workflow comment on PR (if invalid); add comment to PR (if one exists) explaining the error and suggesting the correct branch name

#### Compliance Metrics Collection

- [x] T041 [US2] Create `.github/workflows/branch-name-validation.yml` metrics collection step; capture: branch name, validation result (valid/invalid), error type, timestamp; store as GitHub Actions artifact (JSON)
- [x] T042 [US2] Design metrics artifact structure; schema: date, repository, total_branches, valid_branches, invalid_branches, top_invalid_patterns, compliance_percentage
- [x] T043 [US2] Implement metrics aggregation logic (for future Phases); script to aggregate daily artifacts into monthly/org-wide compliance report

#### Enforcement & Merge Blocking

- [x] T044 [US2] Create `.github/workflows/branch-name-validation.yml` merge blocking rule (optional, configurable); set workflow status check to required for merge; prevents merging from invalid branches
- [x] T045 [US2] Document enforcement policy; explain that enforcement is opt-in per repo (pull-request-rule configuration); show how to enable/disable

#### Integration Tests (Remote Enforcement)

- [ ] T046 [P] [US2] Create integration test: Push valid branch to remote; verify GitHub Actions workflow passes
- [ ] T047 [P] [US2] Create integration test: Push invalid branch to remote (with --no-verify); verify GitHub Actions workflow fails; verify PR shows validation failure comment
- [ ] T048 [P] [US2] Create integration test: Verify merge is blocked if validation fails and merge blocking is enabled

**Checkpoint: US2 Complete** — Validation enforced at remote; developers cannot bypass; compliance metrics collected daily

---

## Phase 3: PR Template & Label Routing

**Purpose**: Automate template and label routing based on branch type; integrate with existing PR system

**Duration**: ~16 hours (Weeks 3-4)

**Dependencies**: Phase 2 (validation) complete

**Gate**: PR template routing works for all 38 types; labels applied from canonical set; 100% accuracy

### US3 Implementation: GitHub Actions Automate Template & Label Routing

**Goal**: PRs created from valid branches automatically receive correct template and labels; no manual routing needed

**Independent Test**: PR created from `feat/user-auth-improvements` receives feature template and correct labels; all 38 types route correctly

#### Configuration Tasks

- [x] T049 [P] Create `.github/branch-types.yml` configuration file; define mapping: 38 types → PR template files (e.g., `feat` → `pr_feature.md`)
- [x] T050 [P] Create `.github/branch-labels.yml` configuration file; define mapping: 38 types → default labels (e.g., `feat` → `["type:feature"]`); include area detection keywords
- [x] T051 [US3] Validate branch-types.yml against `.github/PULL_REQUEST_TEMPLATE/` directory; confirm all 38 type mappings are correct and all referenced templates exist

#### GitHub Actions Workflow: Template Routing

- [ ] T052 [US3] Create `.github/workflows/pr-template-routing.yml` workflow; trigger on `pull_request` events (opened, synchronize); extract branch type from head branch name
- [ ] T053 [US3] Implement template selection logic; parse branch type; look up template in branch-types.yml; load template from `.github/PULL_REQUEST_TEMPLATE/{template}.md`
- [ ] T054 [US3] Implement template application; set PR description to template content (overwrite or append based on config); use GitHub REST API to update PR
- [ ] T055 [US3] Add fallback for unmapped types; if type not in branch-types.yml, use generic `.github/pull_request_template.md` or existing template

#### GitHub Actions Workflow: Label Routing

- [ ] T056 [US3] Create label routing step in `.github/workflows/pr-template-routing.yml`; extract branch type; look up default_labels in branch-labels.yml
- [ ] T057 [US3] Implement label validation; for each label, verify it exists in `.github/labels.yml` canonical set (exact match with family prefix); reject non-canonical labels
- [ ] T058 [US3] Implement area label detection; parse scope from branch name; match against area_detection.keywords in branch-labels.yml; auto-apply area labels (e.g., scope `api-response` → `area:api`)
- [ ] T059 [US3] Implement label application; use GitHub REST API (actions/github-script) to add labels to PR; handle label already applied (no-op)

#### Testing & Validation

- [x] T060 [P] [US3] Create integration test: Create PR from `feat/user-auth-improvements`; verify template (`pr_feature.md`) applied; verify labels (`type:feature`) applied
- [x] T061 [P] [US3] Create integration test: Create PR from `security/sql-injection-fix`; verify template (`pr_security.md`) applied; verify labels (`type:security, priority:critical`) applied
- [x] T062 [P] [US3] Create integration test: Create PR from branch with area keywords (e.g., `feat/api-endpoint`); verify area label (`area:api`) auto-detected and applied
- [x] T063 [P] [US3] Test all 38 types; create 38 sample branches, create PRs from each, verify correct template + labels for every type

**Checkpoint: US3 Complete** — PR template routing works perfectly; all labels applied from canonical set; area detection works; 100% accuracy across 38 types

---

## Phase 4: Documentation & Developer Guide

**Purpose**: Create comprehensive developer guide; train team leads; establish compliance baseline

**Duration**: ~12 hours (Weeks 4-5)

**Dependencies**: Phases 2-3 complete

### US4 Implementation: Developers Reference Branching Strategy

**Goal**: Developers have clear, accessible guide for branch naming; understand 38 types; can choose correct type; adoption increases

**Independent Test**: Developer reads guide, understands pattern, creates valid branch correctly on first attempt; support tickets decrease

#### Documentation Tasks

- [x] T064 Create `docs/BRANCHING_STRATEGY.md` main guide; include 24 type definitions with purpose, example, and recommendation for each; organized for quick lookup
- [x] T065 [P] Add section to `docs/BRANCHING_STRATEGY.md`: Pattern explanation (`{type}/{scope}-{title}`), examples for each component, common mistakes
- [x] T066 [P] Add section to `docs/BRANCHING_STRATEGY.md`: Scope/title naming rules (lowercase, hyphens, no underscores, no special chars); provide do's and don'ts
- [x] T067 [P] Add section to `docs/BRANCHING_STRATEGY.md`: When to use each type; decision tree for choosing correct type (e.g., "Is it a new feature?" → feat, "Is it a bug fix?" → fix)
- [x] T068 Update `CLAUDE.md` with link to branching strategy guide; add quick reference table of 38 types; note forbidden prefixes
- [x] T069 Create branching strategy one-pager (PDF or Markdown); print-friendly version for team distribution

#### Training Materials

- [x] T070 [P] Create training slides (or doc) for team leads; explain branch naming rationale, benefits (template routing, label automation), enforcement mechanism
- [x] T071 [P] Create FAQ document addressing common questions: "What's the difference between task and feat?", "Can I use proto for any experimental work?", etc.
- [ ] T072 Create training video script (optional); 2-3 minute walkthrough of branch creation workflow with validation feedback

#### Communication & Rollout

- [ ] T073 [P] Draft announcement for team leads and developers; explain branch naming policy, enforcement timeline, support contact
- [ ] T074 Prepare Slack/chat bot integration (optional); bot responds to "How do I name branches?" with link to guide and quick examples
- [x] T075 Create support runbook for team leads; common issues, debugging steps, escalation path

**Checkpoint: US4 Complete** — Documentation comprehensive, developers empowered to choose correct type, adoption baseline established

---

### US5 Implementation: PR Template Assignment Works Correctly

**Purpose**: Existing PR template system works as designed; no manual reassignments; template routing becomes org-wide standard

**Independent Test**: 100% of PRs from valid branches receive correct template; zero manual template reassignments needed

#### Integration Testing (Template Routing)

- [ ] T076 [P] [US5] Integration test: Create feature PR; verify `.github/PULL_REQUEST_TEMPLATE/pr_feature.md` loaded in PR description; verify all template sections present
- [ ] T077 [P] [US5] Integration test: Create security PR; verify `pr_security.md` template loaded; verify security-specific sections (threat model, CVSS, remediation) present
- [ ] T078 [P] [US5] Integration test: Create release PR; verify `pr_release.md` template loaded; verify release-specific sections (changelog, version bump) present
- [ ] T079 [P] [US5] Test routing for all 19 distinct templates; verify 38 types map correctly to templates (multiple types may share a template) with no conflicts

#### Workflow Conflict Testing

- [ ] T080 [US5] Test GitHub Actions execution order; verify `branch-name-validation` completes before `pr-template-routing`; verify both run without conflicts
- [ ] T081 [US5] Test label routing doesn't conflict with existing label automation (if any); run workflow on 10+ test PRs; verify no duplicate labels, no missing labels
- [ ] T082 [US5] Test template override behavior; if developer already has custom description, verify template routing doesn't erase it (append or merge as configured)

#### Audit & Validation

- [ ] T083 Audit existing `.github/PULL_REQUEST_TEMPLATE/` files; verify all 19 templates are compatible with new routing (no hard-coded assumptions about branch name format)
- [ ] T084 [P] Create comprehensive test report: 38 types × 10 sample branches = 380 routing scenarios tested; document pass/fail rates, edge cases, recommendations

**Checkpoint: US5 Complete** — PR template routing perfect; 100% routing accuracy; zero manual intervention; existing template system works as designed

---

## Phase 5: Pilot Rollout (First Wave)

**Purpose**: Deploy to 10-20 pilot repos; monitor, iterate, collect feedback; establish operational process

**Duration**: ~8 hours (Week 5)

**Dependencies**: Phases 2-4 complete; all workflows and documentation ready

### Pilot Deployment Tasks

- [ ] T085 [P] Prepare validation library for distribution; package as npm module (if publishing) or provide installation instructions; test install on 5+ diverse repo types (JS, PHP, mixed)
- [ ] T086 [P] Create deployment playbook; step-by-step guide for adding workflows to each pilot repo; test on 3 repos; document time and issues encountered
- [ ] T087 [P] Prepare Slack/email notifications; set up alerts for validation workflow failures; configure metrics dashboard (prototype)
- [ ] T088 Identify 10-20 pilot repositories; select mix of sizes, teams, and ownership; confirm team leads' readiness

### Pilot Monitoring & Iteration

- [ ] T089 [P] Monitor pilot repos for 1 week; collect metrics: % branches using valid names, validation workflow success rate, PR template routing accuracy
- [ ] T090 [P] Gather pilot team feedback; interview 5+ developers; ask about hook experience, error message clarity, template routing correctness; document issues
- [ ] T091 Iterate on error messages based on pilot feedback; refine suggestions, improve clarity; update validation library and redeploy to pilot repos
- [ ] T092 [P] Test edge cases discovered in pilot; update quickstart.md and troubleshooting guide with new scenarios

### Pilot Completion & Sign-Off

- [ ] T093 Compile pilot metrics report; show 95%+ compliance rate, >95% template routing accuracy, <5 support tickets/day; present to leadership
- [ ] T094 Get pilot team leads sign-off; confirm rollout-ready; document any remaining risks or required training

**Checkpoint: Pilot Wave Complete** — 10-20 repos successfully using branch naming; metrics show success; ready for org-wide rollout

---

## Phase 6: Full Rollout & Operations

**Purpose**: Deploy to all 50+ repos; establish ongoing operations and support process

**Duration**: ~16 hours+ (Week 6+, ongoing)

**Dependencies**: Pilot rollout successful; no critical issues

### Full Org Deployment

- [ ] T095 [P] Deploy to remaining 30-40 repos (not in pilot); batch deployment using playbook from T086; verify each repo has workflows, documentation, support contact
- [ ] T096 [P] Set up centralized compliance metrics dashboard; aggregate daily artifacts from all 50+ repos; create visualization of compliance %, top invalid patterns, trend over time
- [ ] T097 [P] Configure automated compliance reports; weekly report to team leads; monthly report to leadership; highlight repos below 80% compliance
- [ ] T098 Create escalation process; if repo compliance drops below 80%, team lead notified and offered support; clear responsibility and ownership

### Operational Support

- [ ] T099 [P] Set up developer support channel (Slack, GitHub discussions, etc.); link from CLAUDE.md and branching strategy guide; monitor questions daily
- [ ] T100 Create SLA for support issues; critical issues (validation broken) response <2 hours; normal issues <1 day; feature requests quarterly review
- [ ] T101 [P] Build run book for common support issues; 10+ FAQs with solutions; accessible to all team leads and developers
- [ ] T102 [P] Set up automated alerts; if validation workflow fails on >5 repos, alert DevOps; if metrics drop >5% week-over-week, notify team leads

### Maintenance & Iteration

- [ ] T103 [P] Establish quarterly review cadence; audit compliance metrics, collect feedback, identify improvement areas
- [ ] T104 [P] Plan minor improvements; additional branch types (if needed), new area labels, better error messages (based on real data)
- [ ] T105 [P] Document change management process; how to modify branch types, PR templates, or labels; who has authority, approval process, rollout procedure

### Compliance Milestones

- [ ] T106 Track compliance over 12-week period; measure: Week 2 (50%), Week 4 (80%), Week 12 (95%); document actual vs. plan in reports
- [ ] T107 Calculate ROI; measure reduction in: PR template misrouting support tickets (target: 90% reduction), branch-name-related validation failures (target: 95% reduction), manual label application (target: 100% automation)
- [ ] T108 [P] Run final validation scenarios from quickstart.md on production environment; confirm all 9 scenarios still pass with real 50+ repo data

**Checkpoint: Full Rollout Complete** — 95%+ compliance across 50+ repos; operational support established; metrics show success; system is self-sustaining

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements, documentation finalization, long-term maintenance

**Duration**: Ongoing (parallel to rollout)

### Quality & Testing

- [ ] T109 [P] Run full test suite on final validation library; 100% test coverage for validation logic; test all 38 types + forbidden prefixes + edge cases
- [ ] T110 [P] Load testing (optional); simulate 10,000 concurrent validation requests; measure latency; confirm <1 second consistently
- [ ] T111 [P] Security audit; review validation library for injection vulnerabilities, malicious branch name handling, fork bombs (if regex complex)

### Documentation & Knowledge Transfer

- [ ] T112 [P] Create architecture documentation; draw diagram of 3-tier system (local hook + remote workflow + CLI); explain data flow and integration points
- [ ] T113 [P] Document design decisions; create decision log of: Husky vs. core.hooksPath, GitHub Actions workflow design, YAML config approach; explain rationale
- [ ] T114 [P] Record training video; 5-10 minute walkthrough of full workflow (branch creation, push, PR routing); share with all developers
- [ ] T115 Create handoff documentation; describe how to maintain system, respond to issues, evolve branch types; prepare for team lead or future maintainer

### Performance & Optimization

- [ ] T116 [P] Optimize validation library; profile performance; identify bottlenecks; optimize if needed (though regex should be fast enough)
- [ ] T117 [P] Optimize GitHub Actions workflows; measure end-to-end latency for validation + routing; target: <10 seconds total; optimize if needed
- [ ] T118 [P] Optimize metrics collection; ensure artifact uploads don't slow down workflows; consider sampling if scale becomes issue

### Metrics & Continuous Improvement

- [ ] T119 [P] Implement usage analytics; track: # branches created daily, % valid, most common invalid types, area distribution; use for insights
- [ ] T120 [P] Set up A/B testing capability (optional); test new error messages, new area labels, new suggestions; measure adoption/satisfaction
- [ ] T121 Publish quarterly business review; present compliance metrics, ROI, feature requests, roadmap to leadership

---

## Dependencies & Execution Strategy

### Critical Path (Must Complete)

```
Phase 0: Research (T001-T006) [GATE: research.md ready]
  ↓
Phase 1: Design (T007-T017) [GATE: design complete]
  ↓
Phase 2: Core Validation (T018-T048) [GATE: validation works end-to-end]
  ↓
Phase 3: Template Routing (T049-T063) [GATE: routing 100% accurate]
  ↓
Phase 4: Documentation (T064-T075) [GATE: docs complete]
  ↓
Phase 5: Pilot (T085-T094) [GATE: pilot successful]
  ↓
Phase 6: Full Rollout (T095-T108) [GATE: org-wide 95% compliance]
```

### Parallelization Opportunities

**Within Phase 0 (Research)**:

- T001-T005 all marked [P], can run in parallel
- T006 depends on results from others, run last

**Within Phase 1 (Design)**:

- T010-T012 marked [P], audit and design can run in parallel
- T014-T015 marked [P], runbook sections can be written in parallel

**Within Phase 2 (Core Validation)**:

- T018-T020 marked [P], validation library functions can be implemented in parallel
- T022-T024 marked [P], unit tests can be written in parallel
- T034-T036 marked [P], integration tests can run in parallel

**Within Phase 3 (Template Routing)**:

- T049-T050 marked [P], configuration files can be created in parallel
- T060-T062 marked [P], integration tests can run in parallel

**Within Phase 4 (Documentation)**:

- T065-T067 marked [P], documentation sections can be written in parallel
- T070-T072 marked [P], training materials can be created in parallel
- T073-T075 marked [P], communication can be prepared in parallel

**User Stories in Parallel**:

- Once Phase 2 (Core Validation) completes, US1 is done
- Once Phase 3 (Routing) completes, US3 is done
- US2 (Automation) completes during Phase 2
- US4 & US5 can be done in parallel during Phase 4

### MVP Strategy (Minimal Viable Product)

**Minimum for production deployment**:

1. Phase 0: Research (learn decisions)
2. Phase 1: Design (finalize model)
3. Phase 2: Core Validation (local + remote, no routing yet)
4. Phase 4: Documentation (minimal — how to create valid branches)
5. Phase 5: Pilot (test on 2-3 repos)

**Then add incrementally**:
6. Phase 3: Template Routing (automate PR template + labels)
7. Expand Phase 5: Pilot (roll out to 10-20 repos)
8. Phase 6: Full Rollout (org-wide deployment)

---

## Task Status Tracking

Use checkboxes to track progress:

- `- [ ]` = Not started
- `- [x]` = Complete (check when task is done and committed)

Mark all tasks as complete to finish implementation. Each task represents one commit or logical PR.

---

## Notes

- [P] tasks = different files, no blocking dependencies
- Each phase must complete before next phase begins (sequential gates)
- Tasks within a phase can run in parallel (if staffed)
- Each user story should be independently testable after completion
- Commit after each task or logical group (keep commits focused)
- Stop at any checkpoint to validate story independently
- Use research.md to record decisions as they're made
- Update compliance metrics weekly during rollout phases
- Engage team leads early for buy-in and support

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

---

## Phase 7: Convergence — Missing Integration Tests & Workflow Implementation

**Purpose**: Complete remaining integration tests, implement PR template routing workflow, update documentation, and prepare for production rollout

**Duration**: ~20 hours (Weeks 6-7)

**Dependencies**: Phases 2-4 complete; validation library, configuration files, and core documentation ready

**Gate**: All integration tests passing, template routing workflow operational, CLI documentation updated, team communication ready

### Integration Testing (Remote Enforcement)

- [ ] T122 [P] [US2] Create integration test: Push valid branch `feat/integration-test-valid` to remote; verify GitHub Actions `branch-name-validation` workflow passes; verify workflow status check shows success
- [ ] T123 [P] [US2] Create integration test: Push invalid branch to remote with `git push --no-verify` (bypassing local hook); verify GitHub Actions `branch-name-validation` workflow fails; verify PR creation is blocked or commented with validation error
- [ ] T124 [P] [US2] Create integration test: Verify merge blocking enabled in enforcement policy; attempt merge from invalid branch; verify merge blocked with `branch-name-validation` status required

### GitHub Actions Template & Label Routing Workflow Implementation

- [ ] T125 [US3] Create `.github/workflows/pr-template-routing.yml` workflow; trigger on `pull_request` events (opened, synchronize); extract branch type from `github.event.pull_request.head.ref` (head branch name)
- [ ] T126 [US3] Implement template selection logic in workflow; parse branch type using regex pattern; look up corresponding template in `.github/branch-types.yml`; load template from `.github/PULL_REQUEST_TEMPLATE/{template}.md`
- [ ] T127 [US3] Implement template application in workflow; use `github-script` action to update PR description via REST API; preserve existing description (append template or merge based on configuration)
- [ ] T128 [US3] Implement label routing step in workflow; extract branch type; look up `default_labels` from `.github/branch-labels.yml`; validate all labels exist in canonical `.github/labels.yml`
- [ ] T129 [US3] Implement area label detection; extract scope from branch name using regex `([a-z0-9]+(?:-[a-z0-9]+)*)-[a-z0-9]+(?:-[a-z0-9]+)*`; match scope keywords against `area_keywords` in branch-labels.yml; apply matching area labels
- [ ] T130 [US3] Implement label application in workflow; use `actions/github-script` with REST API to add labels to PR; skip labels already applied (no duplicates); preserve manually-applied labels (merge strategy)

### Integration Testing (Template & Label Routing)

- [ ] T131 [P] [US5] Integration test: Create PR from `feat/user-auth-improvements`; verify `pr_feature.md` template auto-loaded in PR description; verify all template sections present (checklist, acceptance criteria, testing notes)
- [ ] T132 [P] [US5] Integration test: Create PR from `security/sql-injection-fix`; verify `pr_security.md` template loaded; verify security-specific sections present (threat model, CVSS scoring, remediation)
- [ ] T133 [P] [US5] Integration test: Create PR from branch with area keywords (e.g., `feat/api-endpoint`); verify area label `area:api` auto-detected and applied; verify no duplicate labels
- [ ] T134 [P] [US5] Integration test: Test all 38 branch types; create sample PR for each type; verify correct template + labels applied for every type; document pass/fail in test report
- [ ] T135 [US5] Test GitHub Actions execution order; verify `branch-name-validation` workflow completes before `pr-template-routing`; verify both run without conflicts; test on 10+ sample PRs

### Documentation & CLI Help Update

- [x] T136 Update `scripts/validation/validate-branch-name.js` help text (line 57-60); correct the mislabelled "Allowed Types (24)" heading, whose list contained 25 types, to "Allowed Types (38)"; add the 13 genuinely missing types to help text: `doc, api, schema, telemetry, content, seo, config, migrate, qa, uat, aiops, automation, epic` (per Constitution Principle V)
- [ ] T137 [P] Create rollout announcement draft; document branch naming policy, enforcement timeline, support contact; intended for team leads and all developers; link from CLAUDE.md
- [ ] T138 [P] Prepare Slack/email bot integration (optional); set up bot responses to "How do I name branches?" with link to branching strategy guide and quick examples

### Compliance & Metrics Verification

- [ ] T139 Run all 9 quickstart validation scenarios on production-like environment (PR #3353 branch or staging); confirm all scenarios pass with current code; document results in convergence report
- [ ] T140 Verify branch-types.yml and branch-labels.yml map all 38 types to templates/labels with no gaps or missing entries; confirm canonical label validation succeeds for all default labels

**Checkpoint: Phase 7 Complete** — Integration tests verify remote enforcement works; template routing workflow operational; CLI documentation accurate; team communication ready for pilot rollout

---

*Generated by Convergence Analysis (2026-09-18) to complete specification alignment*
[GitHub PR #3353](https://github.com/lightspeedwp/.github/pull/3353)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
