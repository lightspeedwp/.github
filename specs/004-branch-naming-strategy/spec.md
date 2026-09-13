# Specification: Branch Naming & PR Strategy Formalization

**Feature Name:** GitHub Branch Naming & PR Strategy System  
**Short ID:** 004-branch-naming-strategy  
**Status:** Specification  
**Created:** 2026-09-12  
**Version:** 1.0  

---

## Overview

**What:** Formalize and automate GitHub branch naming conventions with 24 authorized types, implement automated PR template routing, establish labeling integration, and provide developer tooling and training.

**Why:** Current branch naming lacks formal specification and enforcement. This causes: PR templates misrouted, naming violations accumulate, new developers unsure of rules, and CI/CD workflows can't rely on branch structure for decision-making.

**Who:** Developers (all levels), team leads, GitHub admins, CI/CD engineers.

**Outcome:** Developers follow standardized naming pattern `{type}/{scope}-{title}`, PR templates route automatically, invalid branches are rejected pre-merge, and team compliance reaches 95%+.

---

## User Scenarios & Acceptance

### Scenario 1: New Developer Creates Feature Branch
**Actor:** Junior developer  
**Goal:** Create a branch that follows team conventions without manual research  
**Flow:**
1. Developer needs to start work on user authentication
2. Developer checks quick-reference guide (1 page)
3. Developer finds "feat" type is appropriate
4. Developer creates: `git checkout -b feat/user-auth-redesign`
5. Developer pushes; PR template auto-applies (correct template for `feat` type)
6. Developer submits PR; branch name validation passes

**Acceptance:** Developer completes branch creation in <2 minutes without asking for help; PR template is correct.

### Scenario 2: Developer Creates Invalid Branch
**Actor:** Developer  
**Goal:** Discover naming error quickly before investing in work  
**Flow:**
1. Developer accidentally creates: `git checkout -b claude/my-feature`
2. Developer pushes to remote
3. Validation script runs (pre-push hook or CI)
4. Script rejects: "Branch name 'claude/my-feature' violates naming rules. Forbidden prefix: 'claude/'. Try: 'feat/my-feature'"
5. Developer renames branch using: `git branch -m feat/my-feature`
6. Developer re-pushes; validation passes

**Acceptance:** Developer gets clear, actionable error message; fix takes <1 minute.

### Scenario 3: PR Opens Automatically Routes Template
**Actor:** Any developer  
**Goal:** PR is automatically assigned the correct template based on branch type  
**Flow:**
1. Developer pushes branch: `feat/payment-processing-timeout-fix`
2. Developer creates PR on GitHub
3. PR template routing workflow runs
4. Workflow identifies branch type: `feat` → selects `pr_feature.md` template
5. Template automatically applies to PR description field
6. Developer fills in template sections (guided by auto-applied template)

**Acceptance:** Template automatically applies without manual intervention; template matches branch type 100% of the time.

### Scenario 4: Auto-Labeling Based on Branch Type
**Actor:** Automation  
**Goal:** PR is automatically labeled based on branch naming convention  
**Flow:**
1. PR created from branch: `fix/pr-template-routing-bug`
2. Auto-labeling workflow runs
3. Workflow detects branch type: `fix` → applies labels: `type:bug`, `area:automation`
4. PR now shows correct labels without manual assignment
5. Metrics dashboard picks up labeled PR for tracking

**Acceptance:** Labels auto-applied within 10 seconds of PR creation; zero manual label assignment needed.

### Scenario 5: Leadership Reviews Compliance Metrics
**Actor:** Team lead  
**Goal:** Understand branch naming compliance across team  
**Flow:**
1. Lead opens compliance dashboard
2. Dashboard shows: current compliance %, trend over past 6 weeks, violations by team member
3. Lead can drill down: see specific invalid branches, see who needs coaching
4. Lead can identify patterns: certain team members consistently use wrong types

**Acceptance:** Dashboard updates daily; data accurate within 1% of manual audit; loads in <2 seconds.

---

## Functional Requirements

### FR-1: Branch Naming Pattern & Validation
- **Pattern:** `{type}/{scope}-{title}` where:
  - `type` is one of 24 authorized values (lowercase)
  - `scope` is kebab-case, specific to the change
  - `title` is brief, action-oriented description
- **Validation rules:**
  - Type must be from authorized list (e.g., `feat`, `fix`, `docs`, `refactor`)
  - No forbidden prefixes: `claude/`, `copilot/`, `openai/`
  - Scope must be kebab-case (lowercase, hyphens only, no underscores/spaces)
  - Title must be present and ≥3 characters
  - No uppercase letters or special characters
- **Testable:** Validator accepts `feat/user-auth-login-redesign`; rejects `claude/my-feature`, `Feature/my_work`, `feat/x`

### FR-2: 24 Authorized Branch Types
- **Types defined:** feat, fix, hotfix, release, refactor, chore, task, docs, test, perf, ci, build, deps, security, design, a11y, ux, i18n, ops, proto, audit, codex, research, revert
- **Each type includes:**
  - Clear purpose and use case
  - Example branches
  - Associated PR template
  - Auto-applied labels
- **Testable:** Each of 24 types can be used to create a branch; routing works correctly for each

### FR-3: PR Template Routing
- **Requirement:** When a PR is created from a typed branch, the correct PR template automatically applies
- **Mapping:** Each of 24 types maps to one of 19 PR templates (some types share templates)
- **Routing logic:**
  - Extract branch type from branch name
  - Lookup template for that type
  - Apply template to PR description field
  - No manual intervention needed
- **Fallback:** If branch name doesn't match pattern, apply default template
- **Testable:** PR from `feat/xxx` gets `pr_feature.md`; PR from `fix/xxx` gets `pr_bugfix.md`

### FR-4: Auto-Labeling Workflow
- **Requirement:** PRs are automatically labeled based on branch type
- **Labels applied:** Each type has associated labels (e.g., `type:feat`, `status:needs-review`)
- **Label source:** Must use canonical labels from `.github/labels.yml` (158 prefixed labels)
- **Workflow behavior:**
  - Triggers when PR is opened
  - Extracts branch type
  - Applies corresponding labels
  - Does not override user-applied labels
- **Testable:** PR from `security/xss-fix` auto-receives `type:security`, `priority:critical` labels

### FR-5: Validation Enforcement
- **Requirement:** Invalid branches are rejected before PR can be merged
- **Enforcement point:** Pre-merge validation gate in CI/CD pipeline
- **Validation behavior:**
  - Checks branch name against pattern and rules
  - If invalid: blocks merge with specific error message
  - If valid: allows merge to proceed
  - Error messages must include: what rule was violated, how to fix it, example of correct format
- **Testable:** PR from invalid branch type is blocked; error message is clear and actionable

### FR-6: Developer Tooling
- **Requirement:** Developers have local validation script to check branch names before pushing
- **Tooling includes:**
  - Pre-push git hook (optional, can be installed locally)
  - CLI validation command: `npm run validate:branch-name -- --branch <name>`
  - Visual quick-reference guide (1 page)
  - Type picker table (type → use case)
  - Common mistakes and fixes
- **Testable:** Local validation script rejects invalid names with clear feedback

### FR-7: Documentation & Training
- **Requirement:** Team has clear documentation and training on branch naming rules
- **Deliverables:**
  - BRANCH_AND_PR_STRATEGY.md: Complete specification (10+ sections)
  - QUICK_REFERENCE.md: Developer quick lookup (1-2 pages, type picker, examples)
  - Troubleshooting guide with decision trees
  - Live training session with recorded fallback
- **Training scope:** All 24 types, pattern rules, common mistakes, troubleshooting, PR template routing
- **Testable:** 90%+ team attendance; 85%+ post-training assessment pass rate

---

## Success Criteria

1. **Compliance:** 95%+ of branches follow naming pattern after Phase 2 enforcement deployment
2. **No Violations:** Zero branches with forbidden prefixes (`claude/`, `copilot/`, `openai/`)
3. **Template Routing:** 100% of PRs receive correct template based on branch type; 0% false positives
4. **Auto-Labeling:** 100% of PRs auto-labeled correctly; labels match canonical label set 100%
5. **Validation Accuracy:** Validation script accepts 100% of compliant names; rejects 100% of invalid names
6. **Developer Experience:** Local validation tool provides clear feedback; fixes take <2 minutes
7. **Team Adoption:** 90%+ team attendance in training; 85%+ post-assessment pass rate
8. **Documentation:** All 6 documentation deliverables complete and reviewed; developer can find answer in <2 min
9. **Enforcement:** CI validation gate active and non-blocking for 100% of PRs; <0.1% false rejection rate

---

## Key Entities

### Branch Type
- **Definition:** One of 24 authorized branch type identifiers
- **Properties:** 
  - Type ID (e.g., `feat`, `fix`)
  - Purpose/use case
  - Example branches
  - Associated PR template
  - Auto-applied labels
  - Special rules (if any)

### Branch Name
- **Definition:** Git branch identifier following pattern `{type}/{scope}-{title}`
- **Properties:**
  - Type (validated against authorized list)
  - Scope (kebab-case)
  - Title (action-oriented)
  - Validation status (valid/invalid)
  - Associated PR template
  - Associated labels

### Validation Rule
- **Definition:** A single pattern or naming criterion enforced by validation
- **Examples:**
  - "Type must be from authorized list"
  - "No underscores in scope"
  - "Forbidden prefix detection"
- **Properties:** Rule ID, description, severity, validator script location

### Compliance Report
- **Definition:** Audit of team branch naming compliance over time
- **Properties:** 
  - Date
  - Total branches checked
  - Compliant count
  - Violations list
  - Compliance %
  - Trends (improving/declining)

---

## Assumptions

1. **Git workflow:** Team uses feature branch workflow (branch per feature/fix); all work goes through PR
2. **GitHub Actions:** GitHub Actions is available and can run validation on every PR
3. **Label governance:** Canonical label set (.github/labels.yml) exists and is authoritative
4. **Team size:** Team is <50 people; compliance can be tracked manually if needed
5. **No legacy constraints:** Old branches can coexist with new naming; no need to migrate existing branches
6. **PR template system:** GitHub PR templates can be auto-applied via workflow or API
7. **Backward compatibility:** Validation can be deployed as advisory (warnings only) before enforcement

---

## Constraints & Risks

### Constraint: Forbidden Prefixes
- `claude/`, `copilot/`, `openai/` are permanently reserved and cannot be used
- Rationale: These prefixes are used for internal tooling and break PR template routing

### Constraint: No Type Invention
- Developers cannot create custom types; only 24 authorized types allowed
- Rationale: Prevents type proliferation and ensures consistent routing/labeling

### Risk: Developer Resistance to New Rules
- Mitigation: Provide clear rationale in documentation and training
- Fallback: Make validation advisory (warnings) for first 2 weeks; switch to enforcement after training

### Risk: PR Template Routing Conflicts
- Mitigation: Establish clear type-to-template mapping; test mapping with integration tests
- Fallback: Manual template selection for edge cases

---

## Non-Functional Requirements

### Performance
- Validation checks must complete in <500ms per branch
- Auto-labeling workflow must complete in <30 seconds
- Compliance dashboard must load in <2 seconds

### Reliability
- Validation must have <1% false negative rate (missed violations)
- Validation must have 0% false positive rate (incorrect rejections)
- Auto-labeling must work for 99.9% of PRs

### Usability
- Quick-reference guide must fit on 1 page
- Error messages must be actionable and mention correct format
- Local validation script must run without installation friction

### Maintainability
- Type definitions stored in single configuration file (not scattered)
- New types can be added by updating configuration only (no code changes)
- Template routing rules in single mapping table

---

## Related Projects & Dependencies

**Related:** Label Governance Audit (2026-08-05) — uses canonical label set  
**Related:** Changelog Quality Audit (Phase 5) — branch strategy required for changelog PR linking  
**Depends on:** Existing PR template infrastructure (.github/PULL_REQUEST_TEMPLATE/)  
**Epic:** #1271 — Changelog Automation Hardening

---

## Out of Scope

- Custom branch per-organization type rules (single org-wide standard only)
- Automated branch deletion or archival (lifecycle management separate initiative)
- Integration with external branch naming tools (3rd-party systems)
- Renaming/migrating existing branches (backwards compatibility maintained)
- Private/org-specific branch prefixes (all types public and documented)

