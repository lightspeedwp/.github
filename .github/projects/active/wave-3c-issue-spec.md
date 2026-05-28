---
title: "Wave 3C Issue Specification"
description: "GitHub issue specification for Wave 3C: README Workflow & Agent Coordination Setup"
created_date: "2026-05-28"
last_updated: "2026-05-28"
file_type: "issue-spec"
version: "v1.0"
status: "ready-to-create"
---

# Wave 3C Issue Specification

## Issue Body (Ready for GitHub)

### Title

Wave 3C: README Workflow & Agent Coordination Setup

### Labels

- `type:chore`
- `area:automation`
- `priority:high`
- `status:needs-triage`
- `comp:workflows`
- `wave:3c`

### Milestone

None (linked to Wave 3 Epic)

### Assignees

@codex (Developer)

### Related Issues

- Depends on: #512 (Wave 3A: README Discovery), #3B (Wave 3B: README Repair)
- Related to: next-issues-execution-plan.md (Wave 3 Roadmap)

### Description

This wave establishes the automation infrastructure to support continuous README and Mermaid diagram auditing, establishes the integration between the Release Agent and README automation workflows, and documents the complete workflow coordination patterns.

#### Objectives

- Create `readme-update.yml` GitHub Actions workflow for automated README fixes
- Integrate readme-update workflow into Release Agent orchestration pattern
- Validate Release Agent can trigger readme-regen.yml on-demand during releases
- Document complete workflow coordination patterns and handoff contracts
- Establish Wave 4 (Continuous Monitoring) infrastructure and documentation

#### Deliverables

1. **readme-update.yml Workflow** (New GitHub Actions Workflow)
   - Trigger: workflow_dispatch (manual trigger) + agent invocation
   - Scope: Apply bulk fixes to README files (syntax, accessibility, staleness)
   - Steps:
     - Checkout code
     - Run Node.js audit script
     - Apply automated fixes (accTitle, accDescr, staleness updates)
     - Commit changes with audit trail
     - Create optional pull request
   - Outputs: `.github/reports/mermaid-audit/update-report.md`
   - Conditional: Integrates with Wave 3A/3B audit reports

2. **Release Agent Integration Updates**
   - Update Release Agent spec to reference readme-update.yml integration
   - Add conditional call to readme-update in post-release workflows
   - Document workflow communication protocol (exit codes, artifacts)
   - Test dry-run mode with readme-update workflow
   - Verify Release Agent can orchestrate 8+ workflows in sequence

3. **Workflow Coordination Documentation Updates**
   - Add readme-update.yml to "Proposed New Workflows" table
   - Document complete 7-step Release Agent orchestration flow
   - Add readme-update Workflow Contract section (pre-conditions, steps, post-conditions)
   - Create visual orchestration diagram (Mermaid flowchart)
   - Add troubleshooting guide for readme-update workflow

4. **Test Plan & Validation**
   - Create test cases for readme-update.yml workflow
   - Validate workflow passes with dry-run flag
   - Test Release Agent can dispatch readme-update.yml
   - Verify post-release README updates work correctly
   - Document test results in qa-sign-off.md

5. **Wave 4 Foundation (Continuous Monitoring)**
   - Create Wave 4 specification (`.github/projects/active/wave-4-continuous-monitoring.md`)
   - Define automated README audit schedule (weekly or on-demand)
   - Plan continuous Mermaid validation integration
   - Document integration with metrics/reporting workflows

### Acceptance Criteria

- [ ] readme-update.yml workflow created and tested
- [ ] workflow_dispatch trigger working correctly
- [ ] Workflow accepts scope parameter (all/mermaid/staleness)
- [ ] Automated fixes apply correctly (accTitle, accDescr, dates)
- [ ] Commit audit trail generated with change descriptions
- [ ] Release Agent spec updated with readme-update integration
- [ ] Release Agent can call readme-update in post-release phase
- [ ] workflow-coordination.md updated with new workflow documentation
- [ ] Release Agent orchestration diagram created (Mermaid)
- [ ] Test cases written and passing for readme-update.yml
- [ ] Dry-run mode verified working (--dry-run flag)
- [ ] Post-release README update tested end-to-end
- [ ] Wave 4 specification created and documented
- [ ] All documentation passing linting checks (0 errors)

### Definition of Done

1. readme-update.yml workflow created in `.github/workflows/`
2. Workflow passes validation (YAML lint, Spectral)
3. Manual dispatch trigger tested and working
4. Agent invocation method documented
5. Release Agent spec updated with new integration
6. workflow-coordination.md updated with readme-update documentation
7. Orchestration diagram created and rendered
8. Test plan created and executed
9. All acceptance criteria verified
10. Pull request opened with workflow setup documentation

### Success Metrics

- ✅ readme-update.yml workflow created, tested, and deployed
- ✅ Release Agent successfully orchestrates 8+ workflows (pre/during/post release)
- ✅ Post-release README updates trigger automatically
- ✅ Dry-run mode works correctly for preview before applying
- ✅ workflow-coordination.md documentation complete and accurate
- ✅ All documentation passes linting (0 errors)
- ✅ Test coverage >80% for workflow integration
- ✅ Wave 4 foundation established and documented

### Notes & Constraints

- **Depends on**: #512 (Wave 3A), #3B (Wave 3B) should be substantially complete
- **Node.js Workflow**: Uses Node.js 18+ for script execution
- **Dry-Run Support**: Must support --dry-run flag for safe preview
- **No Breaking Changes**: Integration must not affect existing Release Agent functionality
- **Backward Compatible**: Must work with older releases that don't have readme-update

### Owner & Effort

- **Owner**: Codex (Developer)
- **Effort Estimate**: 1-2 hours
- **Dependencies**: #512 (Wave 3A), #3B (Wave 3B - should be complete)
- **Related Epics**: next-issues-execution-plan.md#wave-3

### Deliverables Checklist

- [ ] `.github/workflows/readme-update.yml` created
- [ ] `agents/release.agent.md` updated with readme-update integration
- [ ] `.github/docs/workflow-coordination.md` updated with new workflow
- [ ] `.github/projects/active/wave-4-continuous-monitoring.md` created
- [ ] Test results documented in qa-sign-off.md
- [ ] Pull request opened with complete documentation

### Resources

- [Wave 3A: README & Mermaid Diagram Discovery & Audit](https://github.com/lightspeedwp/.github/issues/512)
- Wave 3B: README & Mermaid Diagram Repair & Update (Issue #3B - to be created after 3A)
- [next-issues-execution-plan.md](.github/projects/active/next-issues-execution-plan.md)
- [workflow-coordination.md](.github/docs/workflow-coordination.md)
- [Release Agent Spec](./agents/release.agent.md)
- [readme-audit.yml Workflow](./.github/workflows/readme-audit.yml)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
