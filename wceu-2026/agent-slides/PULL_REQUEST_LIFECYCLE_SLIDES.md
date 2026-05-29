---
title: "Pull Request Lifecycle Slide Deck Prompt"
description: "NotebookLM and design prompt for PR workflow from creation to merge"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Pull Request Lifecycle Slide Deck Prompt

## System Overview

The **Pull Request Lifecycle** orchestrates code changes from creation through merge, coordinating automated validation, review, labeling, and release preparation. This system ensures quality gates pass, governance rules are enforced, and all stakeholders have visibility before merge.

**Operational scope**: PR event handling, automated validation, review coordination, label enforcement, merge readiness.

**Owned by**: LightSpeed ops & engineering teams

## Key Stages

1. **PR Creation** - Labeling agent applies contextual labels (type, priority, area)
2. **Validation Phase** - Linting, testing, changelog validation run in parallel
3. **Review Phase** - Reviewer agent performs code quality and security analysis
4. **Refinement Cycle** - Developer fixes issues, workflows re-trigger automatically
5. **Approval & Merge** - Required checks pass, code reviewed, ready to merge
6. **Post-Merge** - Release workflow triggered on merge if applicable

## Integration Points

- **Workflows → Labeling**: PR events trigger automatic labeling
- **Workflows → Reviewer**: PR changes analyzed for quality/security
- **Workflows → Linting**: Code style validation runs on every commit
- **Workflows → Testing**: Test suite executes on PR changes
- **Workflows → Changelog**: CHANGELOG.md completeness validated
- **Status Checks → Merge Gate**: All required checks must pass

## Use Cases & Examples

### Use Case 1: Feature PR Flow

Developer submits feature PR; multiple agents coordinate validation.

**PR lifecycle:**

1. Developer opens PR with feature branch
2. Pull_request event triggers 5 workflows simultaneously
3. Labeling agent applies: type:feature, priority:medium, area:core
4. Linting workflow validates markdown, JavaScript, YAML syntax
5. Testing workflow runs Jest test suite
6. Reviewer agent analyzes code changes for patterns
7. All checks pass (✅); reviewer assigns themselves
8. Developer addresses review feedback; new commit pushed
9. Workflows re-trigger; developer re-requests review
10. Approval given; merge enabled

### Use Case 2: Hotfix PR Flow

Critical bug discovered; expedited merge process.

**PR lifecycle:**

1. Developer creates PR with hotfix branch
2. Labels applied: type:bug, priority:urgent, area:critical
3. Workflows run same validation suite
4. Reviewer performs expedited review (faster turnaround)
5. If critical issues found → escalate before merge
6. Once approved → can merge immediately
7. Release workflow triggered on merge tag

### Use Case 3: Documentation PR Flow

Documentation-only change; reduced validation burden.

**PR lifecycle:**

1. Developer updates .md files in docs/ folder
2. Labeling agent applies: type:docs, area:documentation
3. Workflows skip code linting (no code changes)
4. Reviewer performs light documentation review
5. Link validation runs (validate documentation references)
6. Once approved → merge directly to main/develop

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Manual PR review inconsistent; quality gates unclear; merge timing uncertain
- Stakes: Regressions ship, quality degradation, reviewer bottleneck, unclear responsibilities

**Slide 02** - PR Lifecycle Overview

- 6 distinct stages from creation to merge
- Automated validation, review coordination, approval gating
- Parallel execution reduces time-to-merge
- Clear feedback loop: developer fixes, workflows re-trigger

**Slide 03** - Stage 1: PR Creation

- Developer opens PR from feature branch
- Pull_request event (opened, synchronize, reopened) triggers workflows
- Labeling agent immediately applies contextual labels
- Labels include: type (bug/feature/chore), priority, area, status
- Initial status check from linting agent

**Slide 04** - Stage 2: Automated Validation (Parallel)

- 5 workflows run in parallel on PR creation:
  1. **Linting**: Markdown, YAML, JSON, code syntax validation
  2. **Testing**: Jest test suite runs; coverage reported
  3. **Changelog**: CHANGELOG.md completeness check
  4. **Linking**: Internal reference validation
  5. **Security**: Static analysis, dependency scanning
- Results displayed as status checks on PR
- Each check pass/fail visible in PR UI

**Slide 05** - Stage 3: Reviewer Analysis

- Reviewer workflow invokes reviewer.agent.js
- Analyzes code quality, performance, security patterns
- Provides automated suggestions:
  - Complexity warnings
  - Performance insights
  - Security concerns
  - Documentation gaps
- Results posted as review comments

**Slide 06** - Stage 4: Developer Refinement Cycle

- Developer reads feedback (from bot + human review)
- Makes code changes to address issues
- Commits and pushes new changes
- Workflows automatically re-trigger (linting, testing, reviewer)
- Results update in PR
- Cycle repeats until checks pass

**Slide 07** - Stage 5: Approval & Gating

- All required checks must pass (status check + approval)
- Required checks: linting ✅, testing ✅, reviewer ✅
- Optional checks: changelog, link validation (informational)
- Human reviewer approves changes
- Merge button enabled when all requirements met

**Slide 08** - Stage 6: Merge & Release

- Developer clicks "Merge" or merge happens automatically
- Merge strategy: squash, rebase, or merge commit (configurable)
- Branch protection rules enforced:
  - All checks must pass
  - At least 1 approval required
  - Up-to-date with base branch
- On merge: release workflow may trigger

**Slide 09** - Label System & Automation

- **Type labels**: bug, feature, chore, docs, refactor
- **Priority labels**: urgent, high, medium, low
- **Area labels**: core, ci, docs, scripts, plugins
- **Status labels**: needs-review, blocked, in-progress
- Labeling agent applies automatically based on PR metadata
- Developers can override/adjust labels as needed

**Slide 10** - Status Checks & Gating

- Required checks (block merge if failing):
  - Linting must pass
  - Tests must pass
  - Reviewer approval required
- Optional checks (informational only):
  - Changelog validation
  - Link validation
  - Security scanning (warnings)
- Branch protection: ensure all required checks pass before merge

**Slide 11** - Special PR Types & Workflows

- **Dependabot PRs**: Auto-generated, expedited review, auto-merge for patches
- **Release PRs**: Version bump, changelog update, release notes
- **Documentation PRs**: Reduced validation, lighter review
- **Security PRs**: Expedited review, confidential until disclosure

**Slide 12** - Time to Merge Optimization

- Parallel workflows reduce wait time
- Status checks provide fast feedback (< 5 min for most)
- Reviewer bot provides instant suggestions
- Developer can see issues before human review
- Typical PR cycle: creation → 15 min validation → human review

**Slide 13** - Troubleshooting & Common Issues

- **Failing linting**: Run `npm run lint -- --fix` locally
- **Test failures**: Review test output, fix logic, push new commit
- **Merge conflicts**: Rebase on latest develop, resolve conflicts, push
- **Stale checks**: Closing/reopening PR re-triggers workflows
- **Approval issues**: Assign reviewer, request review via GitHub UI

**Slide 14** - Best Practices

- Keep PRs focused: one feature/fix per PR
- Keep PR size reasonable: < 400 lines where possible
- Update CHANGELOG.md with your changes
- Run `npm run lint` locally before pushing
- Respond to reviewer feedback promptly
- Test locally before pushing to avoid repeated CI cycles

**Slide 15** - Close & Next Actions

- PR lifecycle is automated, transparent, gated by quality
- Contribute: Submit PRs following guidelines
- Questions & feedback

## Evidence Anchors

- `.github/.github/workflows/linting.yml` - Linting workflow
- `.github/.github/workflows/reviewer.yml` - Reviewer workflow
- `.github/.github/workflows/labeling.yml` - Labeling workflow
- `.github/.github/workflows/testing.yml` - Testing workflow
- `.github/.github/workflows/changelog-validate.yml` - Changelog validation
- `.github/scripts/agents/reviewer.agent.js` - Reviewer agent logic
- `.github/scripts/agents/labeling.agent.js` - Labeling agent logic
- `.github/.github/branch-protection.json` - Branch protection rules (if exists)

## Design Notes

- **Visual theme**: Flow and progression (stages flowing left-to-right, parallel checks, gating)
- **Color palette**: Use workflow colors (blues for stages, greens for passes, reds for failures)
- **Key visuals**: PR lifecycle diagram, parallel workflow execution, status check progression, merge gate visualization
- **Accessibility**: Clear stage labels; color + icons for pass/fail; high contrast for timeline
- **Animations**: Consider workflow execution animation, status check progression, approval flow

## Quality Bar

- Show realistic PR flow with actual timing
- Include examples of label application and status checks
- Show what happens when checks fail and how developer fixes
- Validate against actual workflow definitions
- Ensure all evidence references point to current develop branch
