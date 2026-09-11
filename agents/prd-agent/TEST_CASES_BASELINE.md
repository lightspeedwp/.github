# PRD Agent Test Cases & Baseline Metrics

**Phase**: 4 (Prompt Enhancement & Memory Registry)  
**Date**: 2026-09-11  
**Purpose**: Establish baseline metrics pre-enhancement for Phase 5 testing comparison  
**Target Improvement**: ≥15% per spec.md US4/AC1

## Test Case Suite

### Category 1: PRD Generation Quality (5 test cases)

**TC-101: Basic PRD Structure Compliance**
- **Input**: Feature requirement for "user authentication system"
- **Expected Output**: Complete PRD with sections: Overview, User Stories, Acceptance Criteria, Success Metrics, Release Notes
- **Success Metric**: All required sections present and properly formatted
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: 100% section compliance

**TC-102: Feature Requirements Extraction**
- **Input**: Vague business requirement: "Improve user login experience"
- **Expected Output**: Structured feature breakdown with user stories, acceptance criteria, technical requirements
- **Success Metric**: ≥5 distinct user stories, ≥15 acceptance criteria
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: 90%+ stories correctly identified

**TC-103: Schema & Format Compliance**
- **Input**: Random PRD structure from raw requirements
- **Expected Output**: PRD conforming to JSON schema (if applicable) and Markdown format standards
- **Success Metric**: Zero schema validation errors, passes `npm run validate:frontmatter`
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: 100% compliance

**TC-104: Cross-Skill Routing Clarity**
- **Input**: Complex feature requiring multiple skills (e.g., "Feature PRD → Review → Planning → Delivery")
- **Expected Output**: Explicit skill routing instructions, clear decision tree for next steps
- **Success Metric**: Agent correctly identifies ≥3 related skills and routing sequence
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: 95%+ routing accuracy

**TC-105: Memory Context Preservation**
- **Input**: Multi-turn conversation where PRD is created, then reviewed, then planned
- **Expected Output**: Consistent requirements across turns; decisions tracked in memory
- **Success Metric**: Zero context loss between turns; all decisions documented
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: 100% context preservation

### Category 2: Multi-Skill Orchestration (4 test cases)

**TC-201: Skill Sequence Accuracy**
- **Input**: "Plan a sprint for Q4 feature launch"
- **Expected Output**: Correct sequence: project-intake → delivery-planner → estimation-planner → github-issue-drafter
- **Success Metric**: Correct skill order, no duplicate invocations
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: 90%+ accuracy

**TC-202: Skill Handoff Quality**
- **Input**: PRD created by prd-writer, then passed to delivery-planner
- **Expected Output**: Smooth context passing; no re-explanation required; delivery plan builds on PRD
- **Success Metric**: Continuity score (0-100), target ≥85
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: ≥90 continuity score

**TC-203: Skill Integration Edge Cases**
- **Input**: Request at skill boundary (e.g., design vs. PRD, PRD vs. technical spec)
- **Expected Output**: Agent recognizes boundary, explains limitation or recommends appropriate skill
- **Success Metric**: Graceful handling, user satisfaction ≥4/5
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: 90%+ graceful handling

**TC-204: Cross-Skill Conflict Resolution**
- **Input**: Conflicting information from two different skill outputs (e.g., timeline from estimation vs. delivery plan)
- **Expected Output**: Agent identifies conflict, reconciles or flags for review
- **Success Metric**: Conflict identified and resolution documented
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: 95%+ detection rate

### Category 3: GitHub Integration (3 test cases)

**TC-301: GitHub Issue Creation from PRD**
- **Input**: PRD with requirements, user stories, acceptance criteria
- **Expected Output**: Well-formatted GitHub issues with labels, checklists, links
- **Success Metric**: ≥1 issue created, properly labeled, checklist matches acceptance criteria
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: 100% creation success

**TC-302: GitHub Milestone & Project Linking**
- **Input**: Feature PRD for release sprint
- **Expected Output**: GitHub issues linked to correct milestone and project
- **Success Metric**: Issues appear in project board with correct milestone
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: 100% linking success

**TC-303: PR Review & Approval Workflow**
- **Input**: PRD submitted for review via GitHub PR
- **Expected Output**: Structured review comments, approval gates managed
- **Success Metric**: Review captures ≥5 valid feedback items, approvals tracked
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: ≥90% feedback quality

### Category 4: Skill Inventory Accuracy (2 test cases)

**TC-401: Canonical Skill Name Resolution**
- **Input**: Agent asked to "create a PRD using the consolidated skill set"
- **Expected Output**: Explicit reference to 28 canonical skills, no deleted skill names
- **Success Metric**: Zero references to non-existent skills (prd-generator, prd-reviewer, etc.)
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: 100% canonical accuracy

**TC-402: Skill Capability Matrix Usage**
- **Input**: Complex workflow spanning multiple skill categories
- **Expected Output**: Agent correctly maps requirements to skill clusters (Drafting, Planning, Quality, etc.)
- **Success Metric**: Correct cluster assignment, proper skill ordering
- **Baseline**: PRE-enhancement test pending Phase 5
- **Post-Enhancement Target**: ≥95% mapping accuracy

## Baseline Methodology

### Pre-Enhancement Collection (Phase 5)

1. **Run test suite** against current agent prompt (before any Phase 4 enhancements are applied)
2. **Document baseline metrics** for each test case (success rate, quality score)
3. **Record baseline time** (sprint/date when baseline was collected)
4. **Capture sample outputs** for comparison

### Post-Enhancement Collection (Phase 5)

1. **Apply Phase 4 enhancements** to agent prompt
2. **Re-run identical test suite** with enhanced prompt
3. **Compare post-enhancement metrics** against baseline
4. **Calculate improvement percentage** per test case
5. **Aggregate overall improvement** (target ≥15%)

## Success Criteria for Phase 4 (FR-414)

- ✅ **Baseline metrics collected** for all 14 test cases
- ✅ **Post-enhancement metrics collected** for all 14 test cases
- ✅ **Improvement documented** per test case
- ✅ **Overall improvement ≥15%** (aggregate across all metrics)
- ✅ **Results documented** in CHANGELOG.md

## Test Execution Environment

- **Claude Model**: Sonnet (as per agent definition)
- **Copilot Model**: GPT-4 (as per GitHub Copilot default)
- **OpenAI Model**: GPT-4 (if Phase 5 extends to OpenAI)
- **Test Data**: Real PRD examples from LightSpeed projects
- **Measurement**: Automated + manual scoring

## Notes

- Test cases are designed to validate consolidation improvements (skill inventory accuracy, routing clarity, memory integration)
- Baseline collection deferred to Phase 5 (after Phase 4 enhancements)
- Results will inform Phase 5 testing and Phase 6 rollout readiness

---

**Next Step**: Phase 5 will execute full test suite with baseline + post-enhancement comparison
