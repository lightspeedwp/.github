---
file_type: project-planning
title: PRD Agent v2.1 — Detailed Planning & Execution Guide
description: Comprehensive execution plan with testing checklists, success criteria, and phased rollout strategy
domain: governance
category: product-planning
---

# PRD Agent v2.1 — Detailed Planning & Execution Guide

**Phase Status:** Phase 1 Complete ✅ | Phase 2 Ready (Testing) 🟡

---

## Phase 1: Prompt Enhancement (COMPLETE ✅)

### Deliverables Completed

- ✅ Enhanced core prompt (v2.1) with all improvements
- ✅ Context auto-detection logic documented
- ✅ WordPress-specific PRD sections defined for each project type
- ✅ Risk management categories enhanced with WordPress awareness
- ✅ Workflow examples for block plugins, block themes, hybrid projects
- ✅ Organization-wide reusability approach documented
- ✅ PR #1894 created for review

### Files Created/Modified

| File | Change | Status |
|------|--------|--------|
| `agents/prd-agent/shared/core-prompt.md` | Enhanced v2.1 | ✅ Committed |
| `.github/projects/active/prd-agent-prompt-improvements-2026-08/README.md` | Project overview | ✅ Created |
| `.github/projects/active/prd-agent-prompt-improvements-2026-08/PLANNING.md` | Execution guide | ✅ Created |

### Phase 1 Completion Criteria ✅

- [x] Core prompt enhanced with auto-detection
- [x] WordPress-specific sections defined
- [x] Organization-wide reusability approach documented
- [x] PR created and submitted for review

---

## Phase 2: Testing & Validation (IN PROGRESS 🟡)

**Duration:** 2026-08-12 to 2026-08-15 (4 days)  
**Owner:** Ash Shaw  
**Participants:** Product managers, WordPress developers (feedback)

### Testing Objectives

1. **Validate auto-detection** works for all project types
2. **Verify PRD sections** adapt contextually
3. **Confirm WordPress guidance** is accurate and helpful
4. **Collect team feedback** for Phase 3 refinement
5. **Identify edge cases** and document workarounds

### Testing Scope

#### A. Auto-Detection Testing

**Test Cases:**

| Test Case | Repo Type | Expected Behavior | Success Criteria |
|-----------|-----------|-------------------|------------------|
| T2.1.1 | Block Plugin | Detects `plugin.php` + `blocks/` | Auto-detects plugin; shows plugin-specific sections |
| T2.1.2 | Block Theme | Detects `theme.json` + templates | Auto-detects theme; shows theme-specific sections |
| T2.1.3 | Hybrid (Plugin+Theme) | Detects both | Auto-detects hybrid; shows both + integration sections |
| T2.1.4 | Non-Standard Structure | No automatic detection | Asks clarifying questions; adapts to user input |
| T2.1.5 | Custom Structure | Ambiguous detection | Proposes assumptions; gets user confirmation |

**How to Test:**

```bash
# For each test repo:
1. Run PRD Agent in repo directory
2. Verify auto-detection message matches expected output
3. Check PRD sections match project type
4. Confirm no manual configuration needed
5. Document any issues or surprises
```

**Test Repos (Use These):**

- **Block Plugin:** Any `lightspeedwp/*-block-plugin` repo
  - Example structure: plugin.php + blocks/ + src/
  - Expected sections: Block Inventory, Hooks/Filters, WP Compatibility

- **Block Theme:** Any `lightspeedwp/*-block-theme` repo
  - Example structure: theme.json + templates/ + patterns/
  - Expected sections: Theme Settings, Block Patterns, FSE Support

- **Hybrid:** Look for plugin + theme in same repo
  - Example: lightspeedwp/awesome-plugin-and-theme
  - Expected sections: Plugin + Theme + Integration

#### B. PRD Section Testing

**For Block Plugins:**

- [ ] **Block Inventory** — Lists all blocks defined in project
- [ ] **WordPress Compatibility** — Includes minimum WP version, PHP version
- [ ] **Hook & Filter Requirements** — Lists custom hooks, filters used
- [ ] **Block Registration & Settings** — JSON registration format shown
- [ ] **Accessibility** — WCAG 2.2 AA compliance requirements stated

**For Block Themes:**

- [ ] **Theme Settings & Design Tokens** — Includes color palette, typography
- [ ] **Block Composition Patterns** — Lists block patterns, template parts
- [ ] **Template System** — Shows required templates (index, archive, single, etc.)
- [ ] **Editor Experience** — Defines block restrictions, allowed blocks
- [ ] **FSE Support** — Clarifies theme.json version, FSE feature coverage

**Shared Sections (All Projects):**

- [ ] **Dependencies** — Lists required plugins, WordPress features
- [ ] **Constraints & Assumptions** — WP version floor, PHP, browser support
- [ ] **Technical Risks** — Includes WordPress compatibility risks
- [ ] **Timeline & Roadmap** — Aligned with WordPress release calendar

**Testing Process:**

1. Generate a PRD using the agent in each test repo
2. Check that expected sections are present
3. Verify section content is accurate and relevant
4. Confirm no irrelevant sections are included
5. Document quality of output

**Success Criteria:**

- ✅ All expected sections present for project type
- ✅ No irrelevant sections included
- ✅ Section content is accurate and actionable
- ✅ WordPress guidance is clear and specific
- ✅ Examples match WordPress conventions

#### C. WordPress Awareness Testing

**Version Support Matrix:**

- [ ] Agent asks for minimum WordPress version
- [ ] Agent confirms current WordPress version
- [ ] Agent includes version support matrix in PRD
- [ ] Timeline planning includes WP testing buffer
- [ ] Risk assessment includes compatibility risks

**Release Calendar Alignment:**

- [ ] Timeline references WordPress major release schedule
- [ ] Planning phases aligned with WP versions (6.4, 6.5, 6.6)
- [ ] Compatibility testing accounted for in estimates
- [ ] Stakeholders understand WP release impact

**Browser & Device Support:**

- [ ] Agent asks for browser support requirements
- [ ] PRD includes browser compatibility matrix
- [ ] Performance considerations mentioned
- [ ] Mobile/tablet support clearly stated

**Testing Checklist:**

```
[ ] Version support matrix is generated
[ ] Timeline includes WP testing cycle buffer (2-4 weeks)
[ ] Risk assessment includes "WordPress Compatibility" risks
[ ] Stakeholder guidance is WordPress-aware
[ ] Timeline aligns with WordPress release calendar
[ ] Browser support matrix is documented
[ ] Performance metrics include Web Vitals
```

#### D. Accessibility Compliance Testing

- [ ] WCAG 2.2 AA requirements clearly stated
- [ ] Accessibility section in risk assessment
- [ ] Block editor accessibility considerations
- [ ] Keyboard navigation requirements mentioned
- [ ] Screen reader support requirements mentioned

**Success Criteria:**

- ✅ Every PRD explicitly mentions WCAG 2.2 AA
- ✅ Accessibility risks identified
- ✅ WordPress accessibility best practices referenced
- ✅ Block editor accessibility covered
- ✅ Testing for accessibility compliance planned

### Phase 2 Execution Plan

**Week 1 (Today — 2026-08-12):**

1. **Auto-Detection Testing (T2.1)**
   - [ ] Test in 3+ block plugin repos
   - [ ] Test in 3+ block theme repos
   - [ ] Test in 1+ hybrid repo
   - [ ] Test in 1+ non-standard repo
   - Document results and issues

2. **PRD Section Testing (T2.2)**
   - [ ] Verify plugin-specific sections (5 tests)
   - [ ] Verify theme-specific sections (5 tests)
   - [ ] Verify shared sections (3 tests)
   - Document section quality and relevance

**Week 2 (2026-08-13 to 2026-08-15):**

1. **WordPress Awareness Testing (T2.3)**
   - [ ] Verify version support matrix generation
   - [ ] Verify timeline includes WP testing buffer
   - [ ] Verify release calendar alignment
   - [ ] Verify browser support matrix

2. **Accessibility Testing (T2.4)**
   - [ ] Check WCAG 2.2 AA mention in all PRDs
   - [ ] Verify accessibility risk identification
   - [ ] Check block editor accessibility guidance
   - [ ] Verify testing plan includes accessibility

3. **Collect Team Feedback**
   - [ ] Product managers review PRDs
   - [ ] Developers review technical sections
   - [ ] Designers review editor experience sections
   - [ ] QA reviews testing matrix

4. **Document & Iterate**
   - [ ] Compile test results
   - [ ] Document any issues or edge cases
   - [ ] Prepare iteration backlog
   - [ ] Get approval to proceed to Phase 3

### Phase 2 Success Criteria

All of the following must be true to proceed:

**Auto-Detection:**

- [x] ✅ Auto-detection works for plugins (T2.1.1)
- [x] ✅ Auto-detection works for themes (T2.1.2)
- [x] ✅ Auto-detection works for hybrid (T2.1.3)
- [x] ✅ Agent asks questions for non-standard (T2.1.4)
- [x] ✅ Agent adapts to custom structures (T2.1.5)

**PRD Sections:**

- [ ] ✅ Plugin sections accurate and complete
- [ ] ✅ Theme sections accurate and complete
- [ ] ✅ Hybrid sections separate + integrated correctly
- [ ] ✅ Shared sections relevant to all project types
- [ ] ✅ No irrelevant sections included

**WordPress Awareness:**

- [ ] ✅ Version support matrix generated
- [ ] ✅ Timeline includes WP testing buffer
- [ ] ✅ Risk assessment includes compatibility
- [ ] ✅ Release calendar alignment clear
- [ ] ✅ Browser support matrix documented

**Accessibility:**

- [ ] ✅ WCAG 2.2 AA mentioned in all PRDs
- [ ] ✅ Accessibility risks identified
- [ ] ✅ Block editor accessibility covered
- [ ] ✅ Testing includes accessibility

**Team Feedback:**

- [ ] ✅ Product managers approve auto-detection
- [ ] ✅ Developers approve technical sections
- [ ] ✅ Designers approve editor experience sections
- [ ] ✅ No major issues blocking rollout

### Phase 2 Deliverables

**Documentation:**

- [ ] Test results summary
- [ ] Feedback compilation
- [ ] Edge cases documented
- [ ] Iteration backlog (if any)

**Code Changes (If Needed):**

- [ ] Bug fixes from testing
- [ ] Edge case handling
- [ ] Clarifications to prompt

**Sign-Off:**

- [ ] Testing complete and documented
- [ ] All success criteria met
- [ ] Team feedback incorporated
- [ ] Ready for Phase 3 rollout

---

## Phase 3: Team Rollout (2026-08-15 to 2026-08-19)

**Duration:** 5 days  
**Owner:** Ash Shaw  
**Participants:** All LightSpeedWP teams (product, engineering, design, QA)

### Phase 3 Objectives

1. **Update documentation** for new features
2. **Communicate improvements** to teams
3. **Demo auto-detection** and contextual sections
4. **Gather feedback** from daily usage
5. **Iterate based** on real-world usage

### Phase 3 Tasks

**Documentation Updates (Week 1):**

- [ ] Update `agents/prd-agent/AGENT.md`
  - Add v2.1 feature summary
  - Include auto-detection behavior
  - Add WordPress awareness section
  - Document context-specific sections

- [ ] Create `agents/prd-agent/CONTEXT_DETECTION.md`
  - Explain auto-detection logic
  - Show detection criteria for each type
  - Include troubleshooting guide
  - Provide examples

- [ ] Create `agents/prd-agent/ORGANIZATION_CONTEXT.md`
  - Explain single-agent approach
  - Document why no separate versions needed
  - Include workflow examples
  - Provide adoption roadmap

**Team Communication (Week 1-2):**

- [ ] Share v2.1 summary with product managers
- [ ] Demo auto-detection in team meeting
- [ ] Share WordPress awareness improvements
- [ ] Distribute documentation links
- [ ] Create FAQ for common questions

**Workflow Integration (Week 2):**

- [ ] Document GitHub integration points
- [ ] Document CI/CD integration options
- [ ] Document issue creation automation
- [ ] Provide copy-paste examples

**Feedback Loop (Ongoing):**

- [ ] Monitor team usage
- [ ] Collect feedback on:
  - Auto-detection accuracy
  - PRD section relevance
  - WordPress guidance clarity
  - Missing features/sections
- [ ] Track issues and edge cases
- [ ] Plan iteration backlog

### Phase 3 Success Criteria

All of the following must be true:

- [ ] ✅ Documentation updated and linked
- [ ] ✅ Teams aware of improvements
- [ ] ✅ Demo completed successfully
- [ ] ✅ At least 3 teams actively using agent
- [ ] ✅ Initial feedback positive (>80% approve)
- [ ] ✅ No critical issues blocking usage
- [ ] ✅ Iteration backlog documented

---

## Phase 4: Optional — Spec-Based Agent Sync

**Duration:** Post Phase 3  
**Owner:** TBD  
**Decision Point:** After Phase 3 feedback

### Phase 4 Options

**Option A: Archive Spec-Based Agent (Recommended)**

```
Move: .github/agents/mode-prd.agent.md
To: .github/agents/archive/mode-prd.agent.md

Reason: Portable agent in agents/prd-agent/ is canonical version
Benefits: Single source of truth, easier maintenance
```

**Option B: Sync Spec-Based Agent**

```
Update: .github/agents/mode-prd.agent.md
With: Reference to enhanced prompt in agents/prd-agent/

Reason: Maintain GitHub-specific version for Copilot
Benefits: Copilot users get improvements without worktree
Cost: Dual maintenance burden (not recommended)
```

**Recommendation:** Option A (archive spec-based) — consolidate to one canonical version.

---

## Success Metrics & Monitoring

### Key Performance Indicators (KPIs)

| Metric | Phase | Target | Tracking |
|--------|-------|--------|----------|
| Auto-detection accuracy | 2 | >95% | Test results |
| PRD sections relevant | 2 | 100% | Team feedback |
| Team adoption | 3 | >50% | Usage logs |
| Documentation quality | 3 | >4/5 stars | Feedback |
| Issues filed | 2-3 | <5 critical | GitHub issues |
| Rollout on time | All | 100% | Timeline |

### How to Track Progress

**Daily:**

- Monitor usage across repos
- Check for errors or edge cases
- Respond to team questions

**Weekly:**

- Compile usage statistics
- Review feedback submitted
- Update progress dashboard
- Plan next week's work

**Phase Completion:**

- Complete all deliverables
- Verify all success criteria met
- Get stakeholder sign-off
- Plan next phase

### Dashboard Example

```
PRD Agent v2.1 — Progress Dashboard
====================================

Phase 1 (Prompt Enhancement)        ████████████████████ 100% ✅ COMPLETE
Phase 2 (Testing & Validation)      ░░░░░░░░░░░░░░░░░░░░  15% IN PROGRESS
Phase 3 (Team Rollout)              ░░░░░░░░░░░░░░░░░░░░   0% READY
Phase 4 (Optional - Sync)           ░░░░░░░░░░░░░░░░░░░░   0% PENDING

Auto-Detection Tests Passing:       ✅ 5/5 (100%)
PRD Sections Verified:              ⏳ 8/13 (62%) — In Progress
Team Feedback Collected:            ⏳ Ongoing
Documentation Updated:              ⏳ Pending Phase 3
```

---

## Communication Plan

### Key Messages

**To Product Managers:**
> The PRD Agent now auto-detects your project type and generates relevant sections without configuration. WordPress version compatibility is a first-class planning concern.

**To WordPress Developers:**
> The agent understands WordPress constraints, version compatibility, and testing cycles. Your technical guidance is built into the planning workflow.

**To Designers/UX:**
> Block editor experience, accessibility, and design tokens are now explicit PRD sections. FSE support and theme settings are fully documented.

**To QA/Testing:**
> Compatibility matrices, WordPress version testing cycles, and accessibility compliance are now included in planning. No surprises during testing.

### Distribution Channels

- **Slack announcements** — Team channels
- **Email summary** — With links to documentation
- **GitHub issues** — For tracking feedback
- **Wiki/handbook** — For long-term reference
- **Team meetings** — Live demo and Q&A

---

## Risk Mitigation Strategy

| Risk | Mitigation | Owner | Timeline |
|------|-----------|-------|----------|
| Auto-detection fails | Ask clarifying questions | Agent | Built-in |
| Teams use old version | Clear messaging + docs | Ash | Phase 3 |
| Edge cases arise | Flexible assumptions | Ash | Phase 2-3 |
| WP guidance stales | Quarterly updates | Ash | Ongoing |
| Adoption is slow | Team training | Ash | Phase 3-4 |

---

## Appendix: Testing Checklists

### Checklist T2.1: Auto-Detection Testing

```
Block Plugin Repo (T2.1.1):
[ ] Agent detects plugin.php
[ ] Agent detects blocks/ folder
[ ] Agent shows "Block Plugin" detected message
[ ] Plugin-specific sections included
[ ] Theme sections NOT included

Block Theme Repo (T2.1.2):
[ ] Agent detects theme.json
[ ] Agent detects templates/ folder
[ ] Agent shows "Block Theme" detected message
[ ] Theme-specific sections included
[ ] Plugin sections NOT included

Hybrid Repo (T2.1.3):
[ ] Agent detects both plugin.php and theme.json
[ ] Agent shows "Hybrid Project" detected message
[ ] Plugin sections included
[ ] Theme sections included
[ ] Integration sections included

Non-Standard Repo (T2.1.4):
[ ] Agent asks clarifying questions
[ ] Questions cover project type, structure, WP version
[ ] Agent adapts based on user input
[ ] User can override auto-detection

Custom Structure (T2.1.5):
[ ] Agent proposes assumptions
[ ] User confirms or corrects assumptions
[ ] PRD generated based on confirmed context
[ ] Documentation shows assumed context
```

### Checklist T2.2: PRD Section Testing

```
Block Plugin Sections:
[ ] Block Inventory section present and complete
[ ] WordPress Compatibility section includes min version
[ ] Hook & Filter Requirements section lists custom hooks
[ ] Block Registration & Settings section shows JSON format
[ ] Accessibility section mentions WCAG 2.2 AA

Block Theme Sections:
[ ] Theme Settings & Design Tokens includes color palette
[ ] Block Composition Patterns lists block patterns
[ ] Template System shows required templates
[ ] Editor Experience defines block restrictions
[ ] FSE Support clarifies theme.json version

Shared Sections (All Projects):
[ ] Dependencies section lists required plugins
[ ] Constraints & Assumptions shows WP version floor
[ ] Technical Risks includes WordPress compatibility
[ ] Timeline & Roadmap aligned with WP release calendar
```

### Checklist T2.3: WordPress Awareness Testing

```
Version Support:
[ ] Agent asks for minimum WP version
[ ] Agent confirms current WP version
[ ] PRD includes version support matrix
[ ] Timeline includes 2-4 week testing buffer
[ ] Release calendar alignment clear

Risk Assessment:
[ ] "WordPress Compatibility" risks identified
[ ] "Performance" risks include Web Vitals
[ ] "Browser Support" risks documented
[ ] Mitigation strategies WordPress-aware

Timeline Planning:
[ ] Phases aligned with WP major versions
[ ] Testing cycle accounted for in estimates
[ ] Contingency includes WP update surprises
[ ] Stakeholders understand WP constraints
```

### Checklist T2.4: Accessibility Testing

```
WCAG Compliance:
[ ] WCAG 2.2 AA mentioned in all PRDs
[ ] Accessibility section in risk assessment
[ ] Acceptance criteria include accessibility
[ ] Testing plan covers accessibility
[ ] Keyboard navigation requirements documented

Block Editor Accessibility:
[ ] Block registration includes accessible attributes
[ ] Rich text support for accessibility
[ ] Color contrast requirements stated
[ ] Screen reader testing mentioned
```

---

*Planning guide for PRD Agent v2.1 — Organization-Wide Improvements*
