---
file_type: project
title: PRD Agent v2.1 — Organization-Wide Improvements
description: Enhanced PRD Agent with context auto-detection and organization-wide reusability for WordPress projects
domain: governance
category: product-planning
status: in-progress
---

# PRD Agent v2.1 — Organization-Wide Improvements

**Project Status:** In Progress (Phase 1 Complete — Prompt Enhancement)  
**Started:** 2026-08-12  
**Target Completion:** 2026-08-23  
**Maintainer:** Ash Shaw

---

## Executive Summary

Enhance the PRD Agent (merged prd-agent + prd-factory-planner-agent) to be fully portable and reusable across the LightSpeedWP organization without requiring separate versions for different project types. The agent auto-detects WordPress project type (block plugin, block theme, or hybrid) and adapts PRD sections contextually.

**Key Outcome:** One portable agent serves all WordPress projects across the organization.

---

## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| TBD | epic | Master initiative epic | 🟡 Pending |
| TBD | task | Phase 2: Implementation testing | 🟡 Ready |
| TBD | task | Phase 3: Team rollout | 🟡 Ready |
| TBD | task | Phase 4: Documentation updates | 🟡 Ready |

---

## Project Scope

### What's Included ✅

- **Enhanced core prompt** (v2.1) with WordPress-aware planning
- **Context auto-detection** for plugin, theme, and hybrid projects
- **Organization-wide reusability** without separate versions
- **Improved risk management** including WordPress-specific risks
- **Timeline planning** aligned with WordPress release calendar
- **Stakeholder engagement** templates for WordPress context
- **Accessibility-first** WCAG 2.2 AA compliance emphasis

### What's Excluded 🚫

- Implementation of block plugins/themes (engineering task)
- Design of specific PRDs (product team task)
- Marketing materials or go-to-market strategy
- WordPress core development or modification
- Test automation beyond agent behavior testing

### Assumptions & Constraints

- **Repository access:** All LightSpeedWP repos available for testing
- **Team availability:** Product managers for validation, developers for feedback
- **Timeline:** 2 weeks from start to team rollout
- **Scope:** Single portable agent, no separate versions
- **WordPress versions:** Guidance for WP 6.2 through 6.6 (compatible with current + 2 prior major versions)

---

## Deliverables

### Phase 1: Prompt Enhancement (In Progress)

**Status:** ✅ Complete — PR #1894 open for review

**Deliverables:**

- ✅ Enhanced core prompt (v2.1) with all improvements documented
- ✅ Context auto-detection logic and detection criteria
- ✅ WordPress-specific PRD sections for plugins, themes, hybrid
- ✅ Risk management categories (WordPress-aware)
- ✅ Workflow examples for each project type
- ✅ Organization-wide reusability documentation

**Files:**

- `agents/prd-agent/shared/core-prompt.md` — Enhanced prompt (v2.1)
- Supporting documentation in project folder

**PR:** [#1894](https://github.com/lightspeedwp/.github/pull/1894)

---

### Phase 2: Testing & Validation (2026-08-12 to 2026-08-15)

**Testing Types:**

1. **Auto-Detection Testing**
   - [ ] Block plugin repo — detects `plugin.php` + `blocks/`
   - [ ] Block theme repo — detects `theme.json` + templates
   - [ ] Hybrid repo — detects both plugin + theme components
   - [ ] Non-standard structure — asks clarifying questions

2. **PRD Section Testing**
   - [ ] Block plugin → includes Block Inventory, Hooks/Filters, WP Compatibility
   - [ ] Block theme → includes Theme Settings, Block Patterns, FSE Support
   - [ ] Hybrid → separates plugin vs. theme requirements
   - [ ] All → includes shared sections (Dependencies, Risks, Timeline)

3. **WordPress Awareness Testing**
   - [ ] Version support matrix generation
   - [ ] Compatibility risk identification
   - [ ] Timeline planning with WP release calendar
   - [ ] Stakeholder type-specific guidance

4. **Accessibility Compliance Testing**
   - [ ] WCAG 2.2 AA requirements clearly stated
   - [ ] Accessibility considerations in risk assessment
   - [ ] Browser support matrix generation

**Testing Plan:**

- Use real LightSpeedWP repos (block plugin, block theme, hybrid projects)
- Generate PRDs and compare against expected sections
- Gather feedback from product managers and developers
- Validate auto-detection accuracy across project types

**Success Criteria:**

- ✅ Auto-detection works for all project types
- ✅ PRD sections adapt contextually (no manual configuration)
- ✅ WordPress version guidance is accurate
- ✅ Stakeholder communication templates are helpful
- ✅ Accessibility guidance is comprehensive

---

### Phase 3: Team Rollout (2026-08-15 to 2026-08-19)

**Rollout Strategy:**

1. **Documentation Updates**
   - [ ] Update `agents/prd-agent/AGENT.md` with v2.1 features
   - [ ] Update `agents/prd-agent/README.md` with examples
   - [ ] Create `agents/prd-agent/ORGANIZATION_CONTEXT.md` (reusability guide)
   - [ ] Create `agents/prd-agent/CONTEXT_DETECTION.md` (auto-detection guide)

2. **Team Communication**
   - [ ] Share improvements with product managers
   - [ ] Share improvements with WordPress developers
   - [ ] Demo auto-detection and contextual sections
   - [ ] Gather initial feedback and iterate

3. **Integration with Existing Workflows**
   - [ ] Document how to use in CI/CD
   - [ ] Document GitHub integration points
   - [ ] Document issue creation automation
   - [ ] Document roadmap generation

**Teams to Engage:**

- **Product Managers** — PRD creation, planning
- **WordPress Developers** — Technical requirements, WordPress-aware sections
- **Designers/UX** — Editor experience, accessibility
- **QA/Testing** — Testing matrix, compatibility coverage

---

### Phase 4: Optional - Spec-Based Agent Sync (After 2026-08-19)

**If maintaining `.github/agents/mode-prd.agent.md`:**

- [ ] Update spec-based agent to reference enhanced v2.1 prompt
- [ ] Or: Archive spec-based agent in favor of portable version

**Recommendation:** Use portable `agents/prd-agent/` as canonical version; spec-based agent becomes optional for GitHub-specific workflows only.

---

## Technical Approach

### Architecture

**Single Portable Agent Pattern:**

```
agents/prd-agent/
├── shared/core-prompt.md (v2.1 — auto-detects project type)
├── claude/agent.md (all project types)
├── copilot/agent.md (all project types)
├── openai/agent.md (all project types)
└── ORGANIZATION_CONTEXT.md (reusability guide)
```

**Auto-Detection Logic:**

```
if (plugin.php exists AND blocks/ folder exists)
  → BLOCK PLUGIN detected
  → Load plugin-specific sections

if (theme.json exists AND templates/ exist)
  → BLOCK THEME detected
  → Load theme-specific sections

if (both detected)
  → HYBRID PROJECT detected
  → Load both + integration sections

if (ambiguous)
  → Ask clarifying questions
  → Adapt based on user input
```

### Key Implementation Details

1. **Context Detection:**
   - Automatic file/folder detection
   - Repository metadata collection (user confirms assumptions)
   - Clear documentation of detected context

2. **PRD Sections:**
   - Dynamic section loading based on project type
   - Shared sections (all projects)
   - Plugin-specific sections
   - Theme-specific sections
   - Integration sections (hybrid only)

3. **WordPress Awareness:**
   - Version requirement collection
   - Testing cycle buffer in timelines
   - Compatibility risk categories
   - Browser/device support matrix
   - FSE (Full Site Editing) support guidance

4. **Organization-Wide Reusability:**
   - No repo-specific versions or branches
   - Portable across all LightSpeedWP WordPress projects
   - Flexible assumptions with validation
   - Consistent output structure

---

## Success Metrics

### Phase Completion

| Phase | Metric | Target | Status |
|-------|--------|--------|--------|
| Phase 1 | Prompt enhancement complete | v2.1 delivered | ✅ Complete |
| Phase 1 | PR review & merge | Merged to develop | 🟡 In Progress |
| Phase 2 | Testing coverage | 4/4 test types complete | 🟡 Ready |
| Phase 3 | Team feedback | Positive feedback from PMs + devs | 🟡 Ready |
| Phase 4 | Org adoption | Teams using across org | 🟡 Ready |

### Feature Adoption

- **By Week 2:** Product managers testing auto-detection
- **By Week 3:** WordPress developers using version-aware planning
- **By Week 4:** First PRDs generated with new sections

### Quality Metrics

- ✅ PRDs include WordPress version requirements
- ✅ PRDs include compatibility testing plans
- ✅ Auto-detection accuracy > 95%
- ✅ Stakeholder guidance clearly WordPress-aware
- ✅ Zero repo-specific versions needed

---

## Timeline

```
2026-08-12  Phase 1 Complete — Prompt enhanced & PR created
2026-08-12  Phase 2 Begins — Testing & validation
2026-08-15  Phase 2 Complete — All tests pass
2026-08-15  Phase 3 Begins — Team rollout & documentation
2026-08-19  Phase 3 Complete — Org adoption initiated
2026-08-23  Phase 4 Complete — Full team adoption (optional)
```

**Critical Path:**

- Phase 1 (prompt enhancement) → unblocks everything
- Phase 2 (testing) → validates auto-detection works
- Phase 3 (rollout) → drives organization adoption

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Auto-detection fails for non-standard repos | Medium | Medium | Ask clarifying questions; document assumptions |
| Teams continue using old agent versions | Medium | High | Clear communication; update docs; provide migration guide |
| WordPress version guidance becomes stale | Low | Medium | Version-lock guidance to WP 6.2-6.6; plan quarterly updates |
| Accessibility guidance misses WCAG requirements | Low | High | Audit against WCAG 2.2 AA before rollout |
| Testing cycle burden surprises teams | Medium | Medium | Plan testing buffer in timelines; educate on realities |

**Mitigation Strategies:**

1. **Clear documentation** — Guide teams through auto-detection
2. **Flexible assumptions** — Allow overrides for edge cases
3. **Team feedback loops** — Iterate based on real-world usage
4. **Quarterly updates** — Keep WordPress guidance current

---

## Dependencies & Blockers

### External Dependencies

- **WordPress Release Calendar** — Planning depends on WP version schedule
- **LightSpeedWP Project Access** — Testing requires access to real repos
- **Team Availability** — Feedback depends on PM/developer schedules

### Internal Blockers

None identified. Phase 1 (prompt enhancement) is independent of other work.

---

## Next Steps

### Immediate (This Week)

1. ✅ **Complete Phase 1** — Prompt enhancement (DONE)
2. 🟡 **PR Review** — Get feedback on v2.1 improvements
3. 🟡 **Begin Phase 2** — Set up testing in 3+ repo types

### Short Term (Next 1-2 Weeks)

1. Complete Phase 2 testing
2. Gather product manager feedback
3. Iterate on PRD sections based on feedback
4. Begin Phase 3 documentation updates

### Medium Term (Weeks 3-4)

1. Complete team rollout
2. Monitor adoption across organization
3. Iterate based on real-world usage

---

## References

### Project Documentation

- **Improved Prompt:** `agents/prd-agent/shared/core-prompt.md` (v2.1)
- **Supporting Guide:** `ORG_WIDE_REUSABILITY_GUIDE.md` (in project folder)
- **This Plan:** `.github/projects/active/prd-agent-prompt-improvements-2026-08/README.md`

### Related Resources

- **Agent Definition:** `agents/prd-agent/AGENT.md`
- **Canonical Version:** `agents/prd-agent/` (portable, all projects)
- **Legacy Version:** `.github/agents/mode-prd.agent.md` (GitHub-specific, optional)

### External References

- [WordPress Release Calendar](https://wordpress.org/about/release-schedule/)
- [WCAG 2.2 AA Standards](https://www.w3.org/WAI/WCAG22/quickref/)
- [LightSpeedWP Repository Structure](../../CLAUDE.md)

---

*Built by 🧱 LightSpeedWP with organization-wide WordPress product planning in mind*
