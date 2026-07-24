---
title: "Template Enforcement & Governance Project"
description: "Organization-wide issue and PR template enforcement, routing, and governance implementation"
file_type: "documentation"
version: "1.1.0"
last_updated: "2026-06-08"
created_date: "2026-06-01"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["templates", "governance", "automation", "enforcement"]
domain: "governance"
stability: "experimental"
---

# Template Enforcement & Governance — Issue Backlog

This project coordinates the implementation of organisation-wide template enforcement, routing, and governance for issues and pull requests.

## Status: Implemented locally; remote/admin follow-up open

**Total Issues:** 13
**Priority:** High
**Timeline:** 2-3 weeks
**Current Inventory:** 26 issue templates, 9 PR templates, 35 issue types
**Notes:** Several governance artefacts already exist in the repo; the remaining work is alignment, routing parity, and enforcement consistency.

## Closeout Summary

The repository-side implementation has been completed and the remaining work is now isolated in [REMOTE_ADMIN_CHECKS.md](./REMOTE_ADMIN_CHECKS.md).

- Implemented locally: PR routing config, root router, portable instruction files, validation workflow, fixtures, and governance guidance updates.
- Follow-up only: GitHub organisation issue-type verification and branch protection status-check verification.

---

## Issues

### Phase 1: Foundation & Configuration

#### 1️⃣ [FOUNDATION] Add 2 missing issue types to GitHub organisation settings

**Issue Type:** Task
**Priority:** Critical
**Depends on:** None
**Effort:** 30min

**Summary:**
The issue type registry already includes "Help" and "User Experience Feedback"; the remaining work is to confirm GitHub organisation settings mirror the registry.

**Details:**

- Issue types are already defined in `.github/issue-types.yml`
- Need to manually add in organisation settings: Settings → Issue types
- Help (type:help, color: 4393F8)
- User Experience Feedback (type:ux-feedback, color: DB61A2)

**Acceptance Criteria:**

- [ ] Both issue types appear in organisation settings
- [ ] Issue creation form shows all 35 type entries
- [ ] Color assignments match issue-types.yml and the live registry

**Links:**

- GitHub org settings page for issue types (manual admin-only step)

---

#### 2️⃣ [FOUNDATION] Align PULL_REQUEST_TEMPLATE/config.yml with routing rules

**Issue Type:** Task
**Priority:** High
**Depends on:** [#1](https://github.com/lightspeedwp/.github/issues/1)
**Effort:** 1h

**Summary:**
Keep the canonical PR template routing map in sync with the branch strategy and active template inventory.

**Details:**

- GitHub doesn't support automatic PR template routing based on branch names
- The canonical route map already lives in `.github/PULL_REQUEST_TEMPLATE/config.yml`
- Extend the map so every supported branch prefix resolves to a documented template
- Keep the config aligned with `docs/BRANCHING_STRATEGY.md` and `docs/PR_CREATION_PROCESS.md`
- Format: YAML with branch patterns mapped to template filenames

**Template Routes to Map:**

```
feat/ → pr_feature.md
fix/ → pr_bug.md
hotfix/ → pr_hotfix.md
refactor/ → pr_refactor.md
chore/ → pr_chore.md
docs/ → pr_docs.md
test/ → pr_chore.md
perf/ → pr_feature.md
ci/ → pr_ci.md
build/ → pr_ci.md
deps/ → pr_dep_update.md
security/ → pr_bug.md
design/ → pr_feature.md
a11y/ → pr_feature.md
ux/ → pr_feature.md
release/ → pr_release.md
research/ → pr_feature.md
revert/ → pr_chore.md
i18n/ → pr_feature.md
ops/ → pr_chore.md
proto/ → pr_feature.md
ds/ → pr_feature.md
api/ → pr_feature.md
.schemas/ → pr_feature.md
telemetry/ → pr_feature.md
content/ → pr_docs.md
seo/ → pr_docs.md
config/ → pr_chore.md
migrate/ → pr_chore.md
qa/ → pr_chore.md
uat/ → pr_chore.md
```

**Acceptance Criteria:**

- [ ] `PULL_REQUEST_TEMPLATE/config.yml` documents the full routing strategy
- [ ] Mapping aligns with `BRANCHING_STRATEGY.md`
- [ ] All active PR templates are referenced
- [ ] File includes comment explaining the fallback strategy for shared templates

---

#### 3️⃣ [FOUNDATION] Update ISSUE_TEMPLATE/config.yml with enhanced metadata

**Issue Type:** Task
**Priority:** High
**Depends on:** [#1](https://github.com/lightspeedwp/.github/issues/1)
**Effort:** 30min

**Summary:**
Enhance the existing `ISSUE_TEMPLATE/config.yml` metadata so it documents the current template inventory and automation notes.

**Details:**

- Current config already disables blank issues and defines contact links
- Add comments explaining the 26 issue templates and their purposes
- Add metadata linking templates to issue types
- Add automation notes for the labelling agent and issue-type registry

**Acceptance Criteria:**

- [ ] config.yml has clear comments explaining template structure
- [ ] Blank issues remain disabled (prevent non-template issues)
- [ ] Contact link is present
- [ ] File documents the live template-to-type alignment

---

### Phase 2: Documentation & Guidance

#### 4️⃣ [DOCS] Refresh PR template router at /pull_request_template.md

**Issue Type:** Task
**Priority:** High
**Depends on:** [#2](https://github.com/lightspeedwp/.github/issues/2)
**Effort:** 1h

**Summary:**
Keep the root `pull_request_template.md` as a smart routing guide that directs users to the correct template based on branch type.

**Details:**

- GitHub will always show root template first since it doesn't support auto-routing
- Keep this file as a helpful guide, not a boilerplate
- Detect branch name from PR (user paste into form)
- Provide quick links to all active PR templates
- Explain why template selection matters for automation

**Content Sections:**

1. Header: "Which PR template should I use?"
2. Branch detection: "Your branch: `feat/my-feature` → use pr_feature.md"
3. Quick reference table (type/template pairs)
4. Links to all templates in PULL_REQUEST_TEMPLATE/
5. Explanation of automation (labeling, changelog, etc.)

**Acceptance Criteria:**

- [ ] File is clear and user-friendly
- [ ] All active PR templates are linked
- [ ] Branch-to-template mapping is explicit
- [ ] File explains why correct template matters

---

#### 5️⃣ [DOCS] Refresh instructions/pr-templates.instructions.md

**Issue Type:** Task
**Priority:** High
**Depends on:** [#2](https://github.com/lightspeedwp/.github/issues/2), [#4](https://github.com/lightspeedwp/.github/issues/4)
**Effort:** 1.5h

**Summary:**
Keep the portable PR template instruction file aligned with the current routing map and template inventory.

**Details:**

- Follow the pattern in `.github/instructions/instructions.instructions.md`
- Include frontmatter
- Sections: Overview, General Rules, Detailed Guidance, Examples, Validation, References
- No `.github` assumptions (reusable outside this repo)
- Explain each active template type and when to use it
- Link to `BRANCHING_STRATEGY.md` for branch naming and routing context

**Template Coverage:**

- pr_bug.md: When to use, what's required, what's optional
- pr_feature.md: Feature-specific sections, acceptance criteria
- pr_chore.md: Maintenance and housekeeping work
- pr_ci.md: CI/CD and workflow changes
- pr_docs.md: Documentation-only changes
- pr_hotfix.md: Critical production fixes
- pr_refactor.md: Code restructuring
- pr_release.md: Release preparation
- pr_deps.md: Dependency updates

**Acceptance Criteria:**

- [ ] File follows instruction template pattern (frontmatter, role, overview, rules, guidance, examples, validation, refs)
- [ ] Covers all active PR template types
- [ ] Includes examples of correct and incorrect usage
- [ ] References `BRANCHING_STRATEGY.md`

---

#### 6️⃣ [DOCS] Refresh instructions/issue-templates.instructions.md

**Issue Type:** Task
**Priority:** High
**Depends on:** [#1](https://github.com/lightspeedwp/.github/issues/1)
**Effort:** 1.5h

**Summary:**
Keep the portable issue template instruction file aligned with the current issue template inventory and live issue-type registry.

**Details:**

- Follow instruction template pattern (no `.github` assumptions)
- Cover all 26 issue templates and the current issue type registry
- Explain when to create each issue type
- Link DoR/DoD checklists to issue type
- Examples of well-formed issues for each type

**Issue Type Coverage:**

- When to use Task vs. Story vs. Epic
- Bug: Reproduction steps, error messages, environment info
- Feature: Problem statement, acceptance criteria, designs
- Design: Design specs, references, dependencies
- Automation: Expected behavior, deployment strategy
- Security: Vulnerability details, impact assessment
- A11y: WCAG criteria, assistive technology tested
- Help: Asking for guidance (when to use vs. support contact)
- (20 more types...)

**Acceptance Criteria:**

- [ ] Covers all 26 issue templates
- [ ] Includes Examples section with 3-5 sample issues
- [ ] Guidance on template selection
- [ ] Clear Definition of Ready for issue submission

---

#### 7️⃣ [DOCS] Update AGENT.md with canonical template rules

**Issue Type:** Task
**Priority:** High
**Depends on:** [#2](https://github.com/lightspeedwp/.github/issues/2), [#4](https://github.com/lightspeedwp/.github/issues/4), [#5](https://github.com/lightspeedwp/.github/issues/5), [#6](https://github.com/lightspeedwp/.github/issues/6)
**Effort:** 2h

**Summary:**
Add comprehensive "Template & Issue Type Governance" section to AGENT.md as single source of truth.

**Details:**

- Add new section after "Git & Branching Strategy"
- Define PR template selection rules (branch name → template mapping)
- Define issue template selection rules (problem type → template mapping)
- Explain enforcement mechanisms (workflow, agent, CI)
- Link to portable instruction files
- Make clear this is canonical for all AI models

**Content:**

1. Overview: Why templates matter for automation
2. PR Template Rules: Table mapping branch prefixes to templates
3. Issue Template Rules: Table mapping issue characteristics to templates
4. Template Anatomy: Common sections, required fields, optional fields
5. Enforcement: How violations are detected and corrected
6. References: Links to instructions, templates, CI workflow

**Acceptance Criteria:**

- [ ] AGENT.md section is comprehensive and authoritative
- [ ] All branch types covered
- [ ] All issue types covered
- [ ] Enforcement approach is clear
- [ ] References point to real files

---

#### 8️⃣ [DOCS] Update CLAUDE.md with template routing guide

**Issue Type:** Task
**Priority:** High
**Depends on:** [#7](https://github.com/lightspeedwp/.github/issues/7)
**Effort:** 1h

**Summary:**
Add "PR & Issue Template Selection" section to CLAUDE.md with quick reference for Claude agents.

**Details:**

- Add after "Git & Branching Strategy" section
- Quick reference: branch name → template
- Quick reference: issue characteristics → template type
- Link to detailed guidance in instruction files
- Keep it concise but complete

**Content:**

1. Quick PR Template Selector (table: branch prefix → template)
2. Quick Issue Template Selector (table: type → template)
3. Before Opening a PR: Template selection checklist
4. Before Creating an Issue: Template selection checklist
5. Links to full guidance in AGENT.md and instructions/

**Acceptance Criteria:**

- [ ] CLAUDE.md has clear template selection guidance
- [ ] Both PR and issue template selection covered
- [ ] Quick reference tables are accurate
- [ ] Links point to authoritative guidance (AGENT.md)

---

### Phase 3: Automation & Enforcement

#### 9️⃣ [WORKFLOW] Create PR template validation workflow

**Issue Type:** Task
**Priority:** High
**Depends on:** [#2](https://github.com/lightspeedwp/.github/issues/2), [#4](https://github.com/lightspeedwp/.github/issues/4)
**Effort:** 2h

**Summary:**
Create or split out a GitHub Actions workflow that validates PR template compliance.

**Details:**

- File: `.github/workflows/validate-pr-template.yml`
- Runs on: pull_request_target (opened, synchronize, edited, reopened, ready_for_review)
- Detects branch prefix (feat/, fix/, chore/, etc.)
- Checks if PR body contains required template sections
- Fails if wrong template detected
- Auto-comments with helpful correction link

**Validation Logic:**

1. Extract branch name from PR
2. Look up expected template from PULL_REQUEST_TEMPLATE/config.yml
3. Check PR body for required sections (changelog, risk assessment, test steps, etc.)
4. If missing sections: post comment with template link
5. If very wrong template: add "needs-template-fix" label
6. Block merge if template missing (status check)

**Required Sections by Type:**

- All PRs: Linked issues, Changelog
- feat/: Changelog (Added), Test steps, Accessibility checklist
- fix/: Root cause, Verification, Risk assessment
- chore/: Changelog (if user-facing), Test steps
- docs/: Changelog (optional), no code changes

**Acceptance Criteria:**

- [ ] Workflow created and tested
- [ ] Validates template sections correctly
- [ ] Auto-comments on template violations
- [ ] Blocks merge if critical sections missing
- [ ] Works with all branch types

---

#### 🔟 [AGENT] Create PR template enforcement agent

**Issue Type:** Task
**Priority:** Medium
**Depends on:** [#9](https://github.com/lightspeedwp/.github/issues/9)
**Effort:** 2h

**Summary:**
Create `.github/agents/pr-template-enforcement.md` agent specification for intelligent template validation.

**Details:**

- File: `.github/agents/pr-template-enforcement.md`
- More intelligent than workflow regex validation
- Can understand semantic completeness (not just section presence)
- Can auto-fix simple template issues (reorder sections, etc.)
- Provides helpful guidance for complex fixes
- Coordinated with validation workflow

**Agent Capabilities:**

1. **Detect template type** from branch name and PR body
2. **Validate structure** against template specification
3. **Check completeness** of required fields (not just presence)
4. **Auto-fix** simple issues:
   - Missing changelog section → add with placeholder
   - Misaligned sections → reorder
   - Missing checklist → add standard checklist
5. **Smart guidance** for complex issues:
   - If risk assessment incomplete → suggest what to include
   - If test steps vague → provide examples
6. **Escalate** issues that require human judgment

**Agent Rules:**

- Don't be overly strict (allow reasonable variations)
- Prioritize user experience (helpful comments, not blockers)
- Respect branch type (fix/ PRs need different validation than docs/)
- Work with workflow, not against it

**Acceptance Criteria:**

- [ ] Agent spec document created
- [ ] Behaviors clearly defined
- [ ] Integration with workflow is clear
- [ ] Examples of agent output provided

---

#### 1️⃣1️⃣ [INTEGRATION] Integrate template validation into GitHub branch protection

**Issue Type:** Task
**Priority:** Medium
**Depends on:** [#9](https://github.com/lightspeedwp/.github/issues/9)
**Effort:** 1h

**Summary:**
Configure GitHub branch protection to require PR template validation status check.

**Details:**

- Status check: "validate-pr-template" (from workflow [#9](https://github.com/lightspeedwp/.github/issues/9))
- Require this check to pass before merging to `main`, `develop`
- Make it required but not dismissible
- Confirm the status name matches the dedicated workflow file
- Document in BRANCHING_STRATEGY.md

**Acceptance Criteria:**

- [ ] Branch protection rule includes template validation check
- [ ] Applies to main and develop branches
- [ ] Status check is marked as required
- [ ] Branch protection confirms the dedicated workflow name
- [ ] Documentation updated in BRANCHING_STRATEGY.md

---

#### 1️⃣2️⃣ [TESTING] Create test fixtures for PR template validation

**Issue Type:** Task
**Priority:** Medium
**Depends on:** [#9](https://github.com/lightspeedwp/.github/issues/9), [#10](https://github.com/lightspeedwp/.github/issues/10)
**Effort:** 1h

**Summary:**
Keep the PR template fixture pack in sync with the workflow and agent validation paths.

**Details:**

- File: `.github/tests/fixtures/pr-templates/`
- Sample PR bodies for each template type (valid and invalid)
- Test cases for workflow validation
- Examples of agent output and corrections

**Test Coverage:**

- Valid PR for each of 9+ template types
- Invalid PRs (missing sections, wrong template, incomplete)
- Edge cases (empty sections, minimal content, etc.)
- Agent auto-fix scenarios

**Acceptance Criteria:**

- [ ] Test fixtures cover all active template types
- [ ] Both valid and invalid examples provided
- [ ] Workflow/agent can be tested against fixtures
- [ ] Documentation explains how to use fixtures

---

### Phase 4: Alignment & Documentation

#### 1️⃣3️⃣ [DOCS] Update BRANCHING_STRATEGY.md with template mappings

**Issue Type:** Task
**Priority:** Medium
**Depends on:** [#2](https://github.com/lightspeedwp/.github/issues/2), [#7](https://github.com/lightspeedwp/.github/issues/7)
**Effort:** 1h

**Summary:**
Keep `BRANCHING_STRATEGY.md` in sync with the canonical PR template routing table and governance notes.

**Details:**

- Add new section: "PR Template Selection"
- Table: Branch prefix → PR template → Template purpose
- Notes on when to use each template
- Link to full guidance in `instructions/pr-templates.instructions.md`
- Explain enforcement workflow

**Content:**

```
| Branch Type | PR Template | Purpose |
| --- | --- | --- |
| feat/ | pr_feature.md | New features and enhancements |
| fix/ | pr_bug.md | Bug fixes |
| ...
```

**Acceptance Criteria:**

- [ ] Table covers all branch types and templates
- [ ] Links to relevant documents
- [ ] Explanation of enforcement
- [ ] Consistent with `PULL_REQUEST_TEMPLATE/config.yml`

---

## Summary

**Main Workstream Result:**

- [x] Repository-side implementation complete
- [x] Routing, validation, fixtures, and guidance aligned
- [x] Closeout docs updated to reflect the implemented scope
- [ ] Remote/admin verification complete

**Follow-Up Success Criteria:**

- [ ] GitHub organisation settings show the expected issue types
- [ ] Branch protection uses the expected template-validation check
- [ ] Follow-up task can be archived after admin verification

---

## Related Documents

- [AGENTS.md](../../../../AGENTS.md) — Canonical governance rules and template governance guidance
- [CLAUDE.md](../../../../CLAUDE.md) — Claude-specific guidance and PR template routing quick reference
- [docs/BRANCHING_STRATEGY.md](../../../../docs/BRANCHING_STRATEGY.md) — Branch naming, project type mapping, and PR template routing
- [instructions/pr-templates.instructions.md](../../../../instructions/pr-templates.instructions.md) — Full PR template guide
- [instructions/issue-templates.instructions.md](../../../../instructions/issue-templates.instructions.md) — Full issue template guide
- [.github/issue-types.yml](../../../issue-types.yml) — Canonical issue type definitions
- [.github/PULL_REQUEST_TEMPLATE/config.yml](../../../PULL_REQUEST_TEMPLATE/config.yml) — PR template routing map
- [REMOTE_ADMIN_CHECKS.md](./REMOTE_ADMIN_CHECKS.md) — Smaller follow-up task for admin-only verification

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
