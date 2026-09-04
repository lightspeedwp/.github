---
file_type: project-documentation
title: "Template Enforcement Governance — Outstanding Gaps & Enhancements"
description: "Documented gaps, outstanding work, and optional enhancements for template enforcement governance"
created_date: "2026-09-02"
last_updated: "2026-09-02"
status: active
---

# Template Enforcement Governance — Outstanding Gaps & Enhancements

## Work Completed (as of 2026-09-02)

### Phase 1: Foundation ✅
- Frontmatter schema standardization across all 34 PR and issue templates
- Schema validation enforcing consistent field sets
- Type-prefixed label assignment
- All templates passing local validation
- PR #2625 merged to develop (commit eb89dc1ae)

### Phase 2: Project Documentation ✅
- Updated template-enforcement-governance project files
- RUN_LOG.md updated with PR #2625 completion
- ACTIONS.md updated with frontmatter standardization completion
- README.md updated with current status

---

## Outstanding Gaps

### Gap 1: Template Content Review & Refinement
**Priority:** High  
**Scope:** Review actual template content (beyond frontmatter) for consistency  
**Details:**
- Need to verify all template body content is consistent with governance rules
- Check that title patterns are correctly formatted
- Validate description fields are clear and actionable
- Ensure name fields use appropriate human-readable labels
- Verify labels assignment follows type-prefix governance

**Acceptance Criteria:**
- [ ] All 34 templates reviewed for content consistency
- [ ] Template bodies match governance standards
- [ ] No unintended changes to template content from PR #2625

**Estimated Effort:** 4-6 hours  
**Owner:** TBD  
**Status:** Awaiting review

### Gap 2: GitHub Issue Linking & Cross-Reference
**Priority:** High  
**Scope:** Link GitHub issues to project documentation and vice versa  
**Details:**
- Create GitHub issue to track template enforcement completion
- Link issue to active project files in develop branch
- Update existing related issues with completion status
- Establish cross-references between project docs and issues

**Related Issues:**
- #1012: "Standardise front matter field usage across templates"
- #1230: "Phase 2 — Frontmatter Standardization for Portable Assets"
- #1592: "Label Prefix Governance Enforcement — Audit Results"

**Acceptance Criteria:**
- [ ] New GitHub issue created for template standardization completion
- [ ] All related issues linked and updated
- [ ] Cross-references established between docs and issues
- [ ] Issue descriptions link to develop branch project files

**Estimated Effort:** 2-3 hours  
**Owner:** TBD  
**Status:** Awaiting implementation

### Gap 3: OpenSpec Documentation Generation
**Priority:** Medium  
**Scope:** Generate complete OpenSpec documentation for template enforcement governance  
**Details:**
- OPENSPEC.md currently contains only a placeholder
- Need to generate/write full technical specification
- Document template routing rules
- Document label assignment logic
- Document frontmatter schema and validation rules

**Acceptance Criteria:**
- [ ] Complete OpenSpec specification written
- [ ] All routing rules documented
- [ ] Label assignment logic documented
- [ ] Frontmatter schema fully specified
- [ ] Validation rules documented

**Estimated Effort:** 3-4 hours  
**Owner:** TBD  
**Status:** Awaiting implementation

### Gap 4: Validation Workflow Documentation
**Priority:** Medium  
**Scope:** Document the template validation workflow and CI integration  
**Details:**
- Document how `.github/workflows/template-enforcement.yml` works
- Explain validation schema usage
- Document how PR template routing works
- Explain how issue template validation occurs
- Document error messages and how to fix them

**Acceptance Criteria:**
- [ ] Workflow documentation written
- [ ] Validation process documented
- [ ] Error resolution guide created
- [ ] CI integration explained

**Estimated Effort:** 2-3 hours  
**Owner:** TBD  
**Status:** Awaiting implementation

---

## Optional Enhancements

### Enhancement 1: Template Version Control & Changelog
**Priority:** Low  
**Scope:** Add version tracking and changelog to template frontmatter  
**Details:**
- Add `version` field to all templates
- Create CHANGELOG.md for template updates
- Document version history and breaking changes
- Define versioning strategy (semver, etc.)

**Rationale:** Helps track template evolution and communicate changes to users

**Estimated Effort:** 2-3 hours  
**Owner:** TBD  
**Status:** Not started

### Enhancement 2: Template Testing Framework
**Priority:** Medium  
**Scope:** Create automated tests for template correctness  
**Details:**
- Create test fixtures for all template types
- Test that templates produce valid frontmatter
- Test that validation rules work as expected
- Test error scenarios and edge cases

**Rationale:** Prevents regression in template governance

**Estimated Effort:** 4-5 hours  
**Owner:** TBD  
**Status:** Not started

### Enhancement 3: Template Usage Analytics
**Priority:** Low  
**Scope:** Track which templates are most frequently used  
**Details:**
- Add telemetry to track template selection
- Document usage patterns
- Identify unused or rarely-used templates
- Recommend consolidation or archival

**Rationale:** Helps optimize template portfolio

**Estimated Effort:** 3-4 hours  
**Owner:** TBD  
**Status:** Not started

### Enhancement 4: Contributor Guide for Template Maintenance
**Priority:** Medium  
**Scope:** Create documentation for contributors maintaining templates  
**Details:**
- Document how to add new templates
- Document how to update existing templates
- Define approval process for template changes
- Document testing requirements before merge

**Rationale:** Prevents future unreviewed template changes

**Estimated Effort:** 3-4 hours  
**Owner:** TBD  
**Status:** Not started

### Enhancement 5: Template Portability to Other Repos
**Priority:** Low  
**Scope:** Make templates reusable across LightSpeed organization repos  
**Details:**
- Extract templates to portable location
- Document deployment process
- Create installation guide
- Define customization rules

**Rationale:** Standardizes templates org-wide

**Estimated Effort:** 4-6 hours  
**Owner:** TBD  
**Status:** Not started

---

## Risk & Blockers

### Blocker 1: User Dissatisfaction with Template Changes
**Status:** ⚠️ Active  
**Details:** User reported dissatisfaction with frontmatter standardization implementation in PR #2625. Requested detailed review before further work proceeds.

**Resolution:**
- [ ] Complete detailed review of all template frontmatter
- [ ] Identify specific issues with current implementation
- [ ] Create revised implementation with explicit approval checkpoints
- [ ] Implement approved changes
- [ ] Re-merge with proper review trail

**Timeline:** 2-3 days  
**Owner:** Requires explicit user approval

### Risk 1: Breaking Changes to Template Users
**Impact:** High  
**Probability:** Medium  
**Mitigation:**
- [ ] Document all breaking changes clearly
- [ ] Provide migration guide for existing users
- [ ] Create deprecation period if needed
- [ ] Communicate changes to all stakeholders

### Risk 2: PR Template Routing Failures
**Impact:** High  
**Probability:** Low  
**Mitigation:**
- [ ] Validate PR template routing on each PR
- [ ] Monitor GitHub Actions for routing failures
- [ ] Create troubleshooting guide

---

## Timeline & Dependencies

### Immediate (This Week)
- [ ] Address Blocker 1: User review of template changes
- [ ] Resolve outstanding template content issues
- [ ] Create GitHub issue for template standardization completion

### Short-term (2-3 Weeks)
- [ ] Complete Gap 2: GitHub issue linking
- [ ] Complete Gap 3: OpenSpec documentation
- [ ] Complete Gap 4: Validation workflow documentation

### Medium-term (1-2 Months)
- [ ] Implement Enhancement 2: Template testing framework
- [ ] Implement Enhancement 4: Contributor guide

### Long-term (Ongoing)
- [ ] Enhancement 1: Version control & changelog
- [ ] Enhancement 3: Usage analytics
- [ ] Enhancement 5: Portability to other repos

---

## Related Issues & PRs

### Completed
- PR #2625: Standardize PR and issue template frontmatter schema and structure
- Commit eb89dc1ae: Template standardization merged to develop
- Commit 7c7a77cee: Project documentation updates

### Related (Not Yet Linked)
- #1012: Standardise front matter field usage across templates, prompts, and validation
- #1230: feat(markdown-audit): Phase 2 — Frontmatter Standardization for Portable Assets
- #1592: Label Prefix Governance Enforcement — Audit Results & Remediation Plan

### Created (2026-09-02)
- [#2693](https://github.com/lightspeedwp/.github/issues/2693) — Template Content Review & Refinement (**BLOCKER**)
- [#2694](https://github.com/lightspeedwp/.github/issues/2694) — Template Testing Framework
- [#2695](https://github.com/lightspeedwp/.github/issues/2695) — Contributor Guide for Template Maintenance

---

## Success Criteria (Project Completion)

- [ ] All outstanding gaps resolved
- [ ] Template content verified and approved
- [ ] GitHub issues created and cross-linked
- [ ] OpenSpec documentation generated
- [ ] Validation workflow documented
- [ ] User approval obtained for template changes
- [ ] All enhancements prioritized and scheduled
- [ ] Team trained on template governance rules
- [ ] CI passing all template validation checks
- [ ] Project marked as "complete" with clear handoff

---

## Next Steps

1. **Immediate:** Address user concerns with template changes (blocker priority)
2. **Next:** Complete detailed review of all 34 templates
3. **Then:** Create GitHub issues for outstanding gaps
4. **Finally:** Schedule enhancements based on priority and capacity

---

**Last Updated:** 2026-09-02 by Claude Haiku 4.5  
**Status:** Active — Awaiting user review and direction on template changes
