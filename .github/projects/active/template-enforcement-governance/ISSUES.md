---
title: "Template Enforcement & Governance Project"
description: "Organization-wide issue and PR template enforcement, routing, and governance implementation"
file_type: "documentation"
version: "1.0.0"
last_updated: "2026-06-01"
created_date: "2026-06-01"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["templates", "governance", "automation", "enforcement"]
domain: "governance"
stability: "experimental"
---

# Template Enforcement & Governance — Issue Backlog

This project coordinates the implementation of organization-wide template enforcement, routing, and governance for issues and pull requests.

## Status: In Planning

**Total Issues:** 13  
**Priority:** High  
**Timeline:** 2-3 weeks

---

## Issues

### Phase 1: Foundation & Configuration

#### 1️⃣ [FOUNDATION] Add 2 missing issue types to GitHub organization settings

**Issue Type:** Task  
**Priority:** Critical  
**Depends on:** None  
**Effort:** 30min

**Summary:**  
Add "Help" and "User Experience Feedback" issue types to the organization's GitHub settings.

**Details:**

- Issue types already added to `.github/issue-types.yml`
- Need to manually add in organization settings: Settings → Issue types
- Help (type:help, color: 4393F8)
- User Experience Feedback (type:ux-feedback, color: DB61A2)

**Acceptance Criteria:**

- [ ] Both issue types appear in organization settings
- [ ] Issue creation form shows all 25 types
- [ ] Color assignments match issue-types.yml

**Links:**

- GitHub org settings: <https://github.com/organizations/lightspeedwp/settings/issues>

---

#### 2️⃣ [FOUNDATION] Create PULL_REQUEST_TEMPLATE/config.yml with routing rules

**Issue Type:** Task  
**Priority:** High  
**Depends on:** #1  
**Effort:** 1h

**Summary:**  
Create configuration file documenting PR template routing rules (which template to use for each branch type).

**Details:**

- GitHub doesn't support automatic PR template routing based on branch names
- Need explicit mapping: `feat/` → `pr_feature.md`, `fix/` → `pr_bug.md`, etc.
- This config serves as canonical reference for automation and docs
- Format: YAML with branch patterns mapped to template filenames

**Template Routes to Map:**

```
feat/ → pr_feature.md
fix/ → pr_bug.md
hotfix/ → pr_bug.md
refactor/ → pr_refactor.md
chore/ → pr_chore.md
docs/ → pr_docs.md
test/ → pr_test.md
perf/ → pr_perf.md
ci/ → pr_ci.md
build/ → pr_ci.md
deps/ → pr_deps.md (if exists) or pr_chore.md
security/ → pr_security.md (if exists) or pr_chore.md
design/ → pr_design.md (if exists) or pr_feature.md
a11y/ → pr_a11y.md (if exists) or pr_improve.md
release/ → pr_release.md
research/ → pr_research.md (if exists) or pr_feature.md
```

**Acceptance Criteria:**

- [ ] `PULL_REQUEST_TEMPLATE/config.yml` created with all branch prefixes mapped
- [ ] Mapping aligns with BRANCHING_STRATEGY.md
- [ ] All existing PR templates referenced
- [ ] File includes comment explaining routing strategy

---

#### 3️⃣ [FOUNDATION] Update ISSUE_TEMPLATE/config.yml with enhanced metadata

**Issue Type:** Task  
**Priority:** High  
**Depends on:** #1  
**Effort:** 30min

**Summary:**  
Enhance ISSUE_TEMPLATE/config.yml to include metadata about template routing and automation.

**Details:**

- Current config only has blank_issues_enabled and contact_links
- Add comments explaining the 25 issue templates and their purposes
- Add metadata linking templates to issue types
- Add automation notes for labeling agent

**Acceptance Criteria:**

- [ ] config.yml has clear comments explaining template structure
- [ ] Blank issues remain disabled (prevent non-template issues)
- [ ] Contact link is present
- [ ] File documents the 25:25 template-to-type alignment

---

### Phase 2: Documentation & Guidance

#### 4️⃣ [DOCS] Create PR template router at /pull_request_template.md

**Issue Type:** Task  
**Priority:** High  
**Depends on:** #2  
**Effort:** 1h

**Summary:**  
Replace generic `pull_request_template.md` with smart routing guide that directs users to correct template based on branch type.

**Details:**

- GitHub will always show root template first since it doesn't support auto-routing
- Make this a helpful guide, not a boilerplate
- Detect branch name from PR (user paste into form)
- Provide quick links to all 10 PR templates
- Explain why template selection matters for automation

**Content Sections:**

1. Header: "Which PR template should I use?"
2. Branch detection: "Your branch: `feat/my-feature` → use pr_feature.md"
3. Quick reference table (type/template pairs)
4. Links to all templates in PULL_REQUEST_TEMPLATE/
5. Explanation of automation (labeling, changelog, etc.)

**Acceptance Criteria:**

- [ ] File is clear and user-friendly
- [ ] All 10+ PR templates are linked
- [ ] Branch-to-template mapping is explicit
- [ ] File explains why correct template matters

---

#### 5️⃣ [DOCS] Create instructions/pr-templates.instructions.md

**Issue Type:** Task  
**Priority:** High  
**Depends on:** #2, #4  
**Effort:** 1.5h

**Summary:**  
Create portable, detailed instruction file for PR template usage across all repositories.

**Details:**

- Follow the pattern in `.github/instructions/instructions.instructions.md`
- Include frontmatter
- Sections: Overview, General Rules, Detailed Guidance, Examples, Validation, References
- No `.github` assumptions (reusable outside this repo)
- Explain each template type and when to use it
- Link to BRANCHING_STRATEGY.md for branch naming context

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
- [ ] Covers all 9+ PR template types
- [ ] Includes examples of correct and incorrect usage
- [ ] References BRANCHING_STRATEGY.md

---

#### 6️⃣ [DOCS] Create instructions/issue-templates.instructions.md

**Issue Type:** Task  
**Priority:** High  
**Depends on:** #1  
**Effort:** 1.5h

**Summary:**  
Create portable instruction file for issue template usage across all repositories.

**Details:**

- Follow instruction template pattern (no `.github` assumptions)
- Cover all 25 issue types and templates
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

- [ ] Covers all 25 issue types
- [ ] Includes Examples section with 3-5 sample issues
- [ ] Guidance on template selection
- [ ] Clear Definition of Ready for issue submission

---

#### 7️⃣ [DOCS] Update AGENT.md with canonical template rules

**Issue Type:** Task  
**Priority:** High  
**Depends on:** #2, #4, #5, #6  
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
**Depends on:** #7  
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
**Depends on:** #2, #4  
**Effort:** 2h

**Summary:**  
Create GitHub Actions workflow that validates PR template compliance.

**Details:**

- File: `.github/workflows/validate-pr-template.yml`
- Runs on: pull_request (opened, synchronize, edited)
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
**Depends on:** #9  
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
**Depends on:** #9  
**Effort:** 1h

**Summary:**  
Configure GitHub branch protection to require PR template validation status check.

**Details:**

- Status check: "validate-pr-template" (from workflow #9)
- Require this check to pass before merging to `main`, `develop`
- Make it required but not dismissible
- Document in BRANCHING_STRATEGY.md

**Acceptance Criteria:**

- [ ] Branch protection rule includes template validation check
- [ ] Applies to main and develop branches
- [ ] Status check is marked as required
- [ ] Documentation updated in BRANCHING_STRATEGY.md

---

#### 1️⃣2️⃣ [TESTING] Create test fixtures for PR template validation

**Issue Type:** Task  
**Priority:** Medium  
**Depends on:** #9, #10  
**Effort:** 1h

**Summary:**  
Create test fixtures and examples for PR template validation workflow and agent.

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

- [ ] Test fixtures cover all template types
- [ ] Both valid and invalid examples provided
- [ ] Workflow/agent can be tested against fixtures
- [ ] Documentation explains how to use fixtures

---

### Phase 4: Alignment & Documentation

#### 1️⃣3️⃣ [DOCS] Update BRANCHING_STRATEGY.md with template mappings

**Issue Type:** Task  
**Priority:** Medium  
**Depends on:** #2, #7  
**Effort:** 1h

**Summary:**  
Update BRANCHING_STRATEGY.md with PR template mapping table and governance notes.

**Details:**

- Add new section: "PR Template Selection"
- Table: Branch prefix → PR template → Template purpose
- Notes on when to use each template
- Link to full guidance in instructions/pr-templates.instructions.md
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
- [ ] Consistent with PULL_REQUEST_TEMPLATE/config.yml

---

## Summary

**Completion Criteria:**

- [ ] All 13 issues completed
- [ ] 25 issue types defined and working in GitHub
- [ ] PR template routing fully documented and enforced
- [ ] GitHub Actions workflow validates template compliance
- [ ] Agent provides intelligent enforcement
- [ ] AGENT.md and CLAUDE.md have clear guidance
- [ ] Portable instruction files created for reuse
- [ ] Branch protection enforces template validation

**Success Metrics:**

- 95%+ of new PRs use correct template
- 90%+ of new issues use correct type
- 0 unforced template violations merged
- <5min to select correct template (based on user feedback)

---

## Related Documents

- [AGENTS.md](../../../../AGENTS.md) — Canonical governance rules (once updated)
- [CLAUDE.md](../../../../CLAUDE.md) — Claude-specific guidance (once updated)
- [docs/BRANCHING_STRATEGY.md](../../../../docs/BRANCHING_STRATEGY.md) — Branch naming (once updated)
- [instructions/pr-templates.instructions.md](../../../../instructions/pr-templates.instructions.md) — Full PR template guide (once created)
- [instructions/issue-templates.instructions.md](../../../../instructions/issue-templates.instructions.md) — Full issue template guide (once created)
- [.github/issue-types.yml](../../../issue-types.yml) — Canonical issue type definitions
- [.github/PULL_REQUEST_TEMPLATE/config.yml](../../../PULL_REQUEST_TEMPLATE/config.yml) — PR template routing (once created)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
