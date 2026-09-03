---
file_type: project-tasks
title: "Template Enforcement Governance — Enhancement Tasks"
description: "Breakdown of optional enhancement work items for template enforcement governance"
created_date: "2026-09-02"
last_updated: "2026-09-02"
status: active
---

# Enhancement Tasks Backlog

All tasks are optional enhancements. Priority order:
1. **Template Testing Framework** (Medium priority, high value)
2. **Contributor Guide** (Medium priority, high risk mitigation)
3. **Version Control & Changelog** (Low priority, medium value)
4. **Template Usage Analytics** (Low priority, learning value)
5. **Template Portability** (Low priority, org-wide value)

---

## Task 1: Template Testing Framework

**Issue:** None yet (to be created)  
**Priority:** Medium  
**Effort:** 4-5 hours  
**Type:** Feature  
**Status:** Not started

### Description
Create automated tests for template correctness and validation.

### Scope

#### 1.1 Test Fixtures
- Create test fixtures in `scripts/validation/__fixtures__/` for all template types
- Fixture structure: valid templates + invalid templates with specific errors
- Cover: frontmatter validation, title patterns, label assignments, body content

#### 1.2 Validation Tests
- Test that `npm run validate:frontmatter` passes on all templates
- Test that validation fails correctly on broken templates
- Test schema enforcement for all required fields
- Test that frontmatter is properly parsed

#### 1.3 Label Tests
- Test that type-prefixed labels are correctly assigned
- Test that required labels are present
- Test that bare labels are rejected
- Test label combinations are valid

#### 1.4 Content Tests
- Test that template body sections are present and correctly structured
- Test that placeholder text is properly formatted
- Test that code examples are valid
- Test accessibility compliance in templates

### Acceptance Criteria
- [ ] Test fixtures cover all 34 templates (9 PR + 25 issue)
- [ ] Valid templates pass all tests
- [ ] Invalid templates fail with expected errors
- [ ] Tests can be run with `npm run test:templates`
- [ ] CI integration includes template tests
- [ ] Coverage reports show >80% template coverage

### Dependencies
- Knowledge of test framework used (likely Jest or Mocha)
- Access to template validation scripts
- Understanding of template structure

### Related Files
- `scripts/validation/validate-frontmatter.cjs`
- `.schemas/frontmatter.schema.json`
- `.github/PULL_REQUEST_TEMPLATE/pr_*.md`
- `.github/ISSUE_TEMPLATE/*.md`

---

## Task 2: Contributor Guide for Template Maintenance

**Issue:** None yet (to be created)  
**Priority:** Medium  
**Effort:** 3-4 hours  
**Type:** Documentation  
**Status:** Not started

### Description
Create comprehensive guide for contributors maintaining and updating templates.

### Scope

#### 2.1 Adding New Templates
- Document template creation process
- Provide blank template scaffold
- Explain frontmatter requirements
- List approval process
- Define naming conventions

#### 2.2 Updating Existing Templates
- Document process for template updates
- Explain when updates require PR review
- Define breaking vs non-breaking changes
- Provide changelog entry format

#### 2.3 Approval Process
- Define who can approve template changes
- Explain review checklist
- Document testing requirements
- Define merge authority

#### 2.4 Quality Standards
- Document template content standards
- Explain accessibility requirements (WCAG 2.2 AA)
- List security requirements
- Define performance expectations

### Acceptance Criteria
- [ ] Guide covers all aspects of template maintenance
- [ ] Clear examples provided for each process
- [ ] Approval checklists provided
- [ ] Testing requirements documented
- [ ] Guide is accessible and easy to follow
- [ ] Guide linked from CLAUDE.md and AGENTS.md

### Dependencies
- Understanding of current approval processes
- Knowledge of quality standards
- Access to existing templates for examples

### Related Files
- `CLAUDE.md` (branch naming, labeling requirements)
- `AGENTS.md` (AI agent instructions)
- `docs/BRANCHING_STRATEGY.md` (branch requirements)

### Important Notes
**CRITICAL:** This task exists to prevent a repeat of PR #2533 — an unreviewed merge that removed key frontmatter fields. The guide must establish clear approval requirements.

---

## Task 3: Template Version Control & Changelog

**Issue:** None yet (to be created)  
**Priority:** Low  
**Effort:** 2-3 hours  
**Type:** Enhancement  
**Status:** Not started

### Description
Add version tracking and changelog to template frontmatter.

### Scope

#### 3.1 Version Field
- Add `version` field to all template frontmatter
- Use semantic versioning (semver)
- Document version strategy
- Define breaking change rules

#### 3.2 Changelog
- Create TEMPLATE_CHANGELOG.md
- Document all template changes with versions
- Include breaking changes clearly marked
- Include migration guides for breaking changes

#### 3.3 Version History
- Document when each template was last updated
- Track major changes per template
- Maintain history of frontmatter schema versions

### Acceptance Criteria
- [ ] All templates have `version` field
- [ ] TEMPLATE_CHANGELOG.md created with complete history
- [ ] Versioning strategy documented
- [ ] Breaking changes clearly identified
- [ ] Migration guides provided for breaking changes
- [ ] Version field validated in frontmatter schema

### Dependencies
- Understanding of semantic versioning
- Template history data
- Changelog format standards

### Related Files
- `.schemas/frontmatter.schema.json` (add version requirement)
- All PR and issue templates
- `CHANGELOG.md` (for reference)

---

## Task 4: Template Usage Analytics

**Issue:** None yet (to be created)  
**Priority:** Low  
**Effort:** 3-4 hours  
**Type:** Analytics  
**Status:** Not started

### Description
Track and analyze template usage patterns.

### Scope

#### 4.1 Telemetry
- Add telemetry to track template selection
- Log which template is selected when creating PR/issue
- Track template usage frequency
- Capture user context (branch name, issue type)

#### 4.2 Analytics Report
- Create monthly usage report
- Document most/least used templates
- Identify unused templates
- Track usage trends

#### 4.3 Optimization Recommendations
- Identify candidates for consolidation
- Recommend archival for unused templates
- Suggest improvements based on usage patterns
- Document recommendations

### Acceptance Criteria
- [ ] Telemetry system implemented
- [ ] Data collection for 2+ weeks successful
- [ ] Usage analytics report generated
- [ ] Optimization recommendations documented
- [ ] Results shared with team

### Dependencies
- Analytics infrastructure access
- Understanding of telemetry systems
- Knowledge of template selection flow

### Related Files
- `.github/workflows/` (template-related workflows)
- GitHub Actions event logs
- PR/issue creation flow

---

## Task 5: Template Portability to Other LightSpeed Repos

**Issue:** None yet (to be created)  
**Priority:** Low  
**Effort:** 4-6 hours  
**Type:** Infrastructure  
**Status:** Not started

### Description
Make templates reusable and deployable to other LightSpeed organization repositories.

### Scope

#### 5.1 Template Extraction
- Move templates to portable location
- Create extraction script
- Define portable template structure
- Document deployment requirements

#### 5.2 Deployment Process
- Create installation script for other repos
- Document configuration options
- Define customization points
- Create rollback procedure

#### 5.3 Maintenance & Updates
- Define update notification process
- Create change propagation mechanism
- Document version compatibility
- Establish governance for template updates

#### 5.4 Documentation
- Create deployment guide
- Document customization options
- Provide troubleshooting guide
- Create FAQ

### Acceptance Criteria
- [ ] Templates extracted to portable location
- [ ] Installation script created and tested
- [ ] Documentation complete and tested
- [ ] Deployment successful in test repository
- [ ] Update mechanism verified
- [ ] Rollback procedure tested

### Dependencies
- Access to multiple LightSpeed repositories
- Understanding of template dependencies
- Knowledge of portability requirements
- Infrastructure access for testing

### Related Files
- `.github/PULL_REQUEST_TEMPLATE/`
- `.github/ISSUE_TEMPLATE/`
- `docs/TEMPLATE_DEPLOYMENT.md` (to be created)

---

## Task Dependencies

```
Immediate Blocker:
└── User Review of Template Changes (BLOCKER - must resolve first)

Short-term (can start after blocker cleared):
├── GitHub Issue Linking
├── OpenSpec Documentation
└── Validation Workflow Documentation

Medium-term (can proceed in parallel):
├── Task 1: Template Testing Framework
└── Task 2: Contributor Guide

Long-term (lower priority):
├── Task 3: Version Control & Changelog
├── Task 4: Template Usage Analytics
└── Task 5: Template Portability
```

---

## Effort Estimation Summary

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Template Testing Framework | Medium | 4-5h | Not started |
| Contributor Guide | Medium | 3-4h | Not started |
| Version Control & Changelog | Low | 2-3h | Not started |
| Template Usage Analytics | Low | 3-4h | Not started |
| Template Portability | Low | 4-6h | Not started |
| **Total Optional Work** | — | **17-22h** | — |

---

## Recommended Priority

**Recommended approach:**
1. **This week:** Resolve user review blocker + create GitHub issues
2. **Next week:** Template Testing Framework (prevents regressions)
3. **Following week:** Contributor Guide (prevents future unreviewed merges)
4. **Later:** Optional enhancements as capacity allows

---

**Last Updated:** 2026-09-02 by Claude Haiku 4.5  
**Status:** Active — Awaiting user direction on priority and capacity
