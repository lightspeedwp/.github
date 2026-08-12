# PR Creation Agent — Deployment Plan & Rollout Strategy

**Phase:** 2 (Specification)  
**Document Type:** Deployment & Installation  
**Timeline:** Phase 4 (2026-09-02 → 2026-09-09)

---

## 1. DEPLOYMENT OVERVIEW

**Agent Location:** `agents/pr-creation-agent/` (portable, root-level)

**Deployment Model:** Single agent codebase + per-repo configuration

**Target Rollout:** 12 repositories (1 control plane + 4 plugins + 4 themes + 3 internal)

**Success Criteria:**

- ✅ All 12 repos have working agent installation
- ✅ All 3 config profiles functional and tested
- ✅ Zero breaking changes to existing PR workflows
- ✅ All E2E tests passing on real repos
- ✅ Documentation complete and validated

---

## 2. PRE-DEPLOYMENT CHECKLIST

### 2.1 Phase 3 Implementation Completion

**Before deployment, verify Phase 3 is complete:**

- [ ] Agent core (`pr-orchestrator.js`, `config-loader.js`, `state-machine.js`) implemented
- [ ] All 6 skills implemented and unit tested (100+ tests per skill)
- [ ] Integration tests passing with mock GitHub API
- [ ] GitHub API client wrapper complete with error handling
- [ ] Configuration schema finalized and validated
- [ ] Custom hooks architecture implemented
- [ ] WordPress-specific features implemented (if enabled)
- [ ] All Phase 3 tests passing (CI/CD green)

**Verification Command:**

```bash
npm test -- --coverage --collectCoverageFrom='agents/pr-creation-agent/**/*.js'
# Expected: >95% coverage, all tests green
```

---

### 2.2 Configuration Templates Ready

- [ ] `config.templates/pr-agent-config-standard.yml` (control plane)
- [ ] `config.templates/pr-agent-config-wordpress.plugin.yml` (plugin)
- [ ] `config.templates/pr-agent-config-wordpress.theme.yml` (theme)
- [ ] `config.templates/pr-agent-wordpress-hooks.js` (optional)
- [ ] Config schema (`schemas/pr-agent-config.schema.json`) final

**Verification:**

```bash
npm run validate:schema -- schemas/pr-agent-config.schema.json
# All templates must validate
```

---

### 2.3 Documentation Complete

- [ ] [ARCHITECTURE.md](./ARCHITECTURE.md) complete with diagrams
- [ ] [WORDPRESS_COMPATIBILITY.md](./WORDPRESS_COMPATIBILITY.md) complete
- [ ] [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md) final (this document)
- [ ] [DOCUMENTATION_PLAN.md](./DOCUMENTATION_PLAN.md) prepared
- [ ] API reference prepared for Phase 4
- [ ] Installation guide prepared for Phase 4

---

## 3. DEPLOYMENT STAGES

### 3.1 Stage 1: Agent Installation (Days 1–2)

**Timeline:** 2026-09-02 → 2026-09-03

**Scope:** Install agent core to `.claude/agents/` in all 12 repos

**Process:**

```bash
# For each repo:
cd /path/to/repo

# 1. Ensure .claude directory exists
mkdir -p .claude/agents

# 2. Copy agent from root location
cp -r ../../agents/pr-creation-agent .claude/agents/

# 3. Verify installation
test -f .claude/agents/pr-creation-agent/pr-orchestrator.js && echo "✓ Installed"

# 4. Verify configuration schema available
test -f schemas/pr-agent-config.schema.json && echo "✓ Schema available"
```

**Repos to Install (Stage 1):**

1. `lightspeedwp/.github` (control plane)
2. `lightspeedwp/internal-tools-repo` (control plane)
3. `lightspeedwp/documentation-site` (control plane)

**Verification:** All 3 repos have agent installed, schema available.

---

### 3.2 Stage 2: Configuration Setup (Days 3–4)

**Timeline:** 2026-09-03 → 2026-09-04

**Scope:** Deploy per-repo configuration files

**Process:**

```bash
# For each repo:

# 1. Copy appropriate config template
cp config.templates/pr-agent-config-{PROFILE}.yml \
   .claude/pr-agent.config.yml

# 2. Customize repo-specific settings (if needed)
# - Label paths
# - Template paths
# - Branch naming rules
# - Custom hooks references

# 3. Validate configuration
npm run validate:config -- .claude/pr-agent.config.yml

# 4. Test configuration loading
node scripts/test-config-load.js .claude/pr-agent.config.yml
```

**Configuration Assignments:**

| Repo | Profile | Config File |
|---|---|---|
| `.github` | `standard` | `pr-agent-config-standard.yml` |
| `internal-tools-repo` | `standard` | `pr-agent-config-standard.yml` |
| `documentation-site` | `standard` | `pr-agent-config-standard.yml` |
| `wordpress-plugin-a` | `wordpress.plugin` | `pr-agent-config-wordpress.plugin.yml` |
| `wordpress-plugin-b` | `wordpress.plugin` | `pr-agent-config-wordpress.plugin.yml` |
| `wordpress-plugin-c` | `wordpress.plugin` | `pr-agent-config-wordpress.plugin.yml` |
| `wordpress-plugin-d` | `wordpress.plugin` | `pr-agent-config-wordpress.plugin.yml` |
| `wordpress-theme-a` | `wordpress.theme` | `pr-agent-config-wordpress.theme.yml` |
| `wordpress-theme-b` | `wordpress.theme` | `pr-agent-config-wordpress.theme.yml` |
| `wordpress-theme-c` | `wordpress.theme` | `pr-agent-config-wordpress.theme.yml` |

**Verification:** All configs validate, no errors on load.

---

### 3.3 Stage 3: WordPress Hooks Setup (Days 5–6, WordPress Repos Only)

**Timeline:** 2026-09-04 → 2026-09-05

**Scope:** Install optional WordPress-specific hooks (plugin & theme repos)

**Process:**

```bash
# For WordPress repos only:

# 1. Copy hooks template (optional)
cp config.templates/pr-agent-wordpress-hooks.js \
   .claude/pr-agent-wordpress-hooks.js

# 2. Customize WordPress-specific functions
# - inferWordPressLabels() for repo's file structure
# - detectWordPressRequirements() for version detection

# 3. Test hooks loading
node scripts/test-hooks-load.js .claude/pr-agent-wordpress-hooks.js

# 4. Update config reference
# In .claude/pr-agent.config.yml:
# custom_hooks: .claude/pr-agent-wordpress-hooks.js
```

**WordPress Repos (Hooks Required):**

- `wordpress-plugin-a`, `wordpress-plugin-b`, `wordpress-plugin-c`, `wordpress-plugin-d`
- `wordpress-theme-a`, `wordpress-theme-b`, `wordpress-theme-c`

**Verification:** Hooks load without errors, custom labels inferred correctly.

---

### 3.4 Stage 4: Integration Testing (Days 7–8)

**Timeline:** 2026-09-05 → 2026-09-06

**Scope:** Run E2E tests against real repos to verify agent functionality

**Test Plan:**

```bash
# For each repo type, run E2E tests:

# Control Plane Repos (1 test)
npm run test:e2e -- --repo lightspeedwp/.github \
  --scenario "feat/test-pr-creation" \
  --validate-mergify

# Plugin Repos (1 test per 2 repos)
npm run test:e2e -- --repo lightspeedwp/wordpress-plugin-a \
  --scenario "feat/test-plugin-feature" \
  --validate-labels

# Theme Repos (1 test per 2 repos)
npm run test:e2e -- --repo lightspeedwp/wordpress-theme-a \
  --scenario "feat/test-theme-feature" \
  --validate-wordpress-labels
```

**E2E Test Scenarios:**

1. **Control Plane (`lightspeedwp/.github`)**
   - Create branch: `feat/test-agent-deployment`
   - Trigger PR creation with all governance checks
   - Verify: Mergify queue integration, labels applied, feedback tracking enabled

2. **Plugin (`lightspeedwp/wordpress-plugin-a`)**
   - Create branch: `feat/test-agent-deployment`
   - Trigger PR creation without Mergify
   - Verify: WordPress labels inferred, changelog referenced

3. **Theme (`lightspeedwp/wordpress-theme-a`)**
   - Create branch: `feat/test-agent-deployment`
   - Trigger PR creation with design context
   - Verify: WordPress labels inferred, design notes included

**Verification Commands:**

```bash
# Verify all E2E tests pass
npm run test:e2e -- --all
# Expected: 5+ E2E tests passing (1 control plane + 2 plugin + 2 theme)
```

**Cleanup After Testing:**

```bash
# Close/delete all test PRs created during E2E testing
gh pr list --label "test:agent-deployment" --json number --jq '.[].number' | \
  xargs -I {} gh pr close {} --delete-branch
```

---

### 3.5 Stage 5: Documentation & Validation (Days 9–10)

**Timeline:** 2026-09-06 → 2026-09-07

**Scope:** Final documentation review, validation, and publication

**Tasks:**

- [ ] Review all installation logs and verify no errors
- [ ] Update CHANGELOG.md with Phase 4 deployment
- [ ] Create installation guide for future repos (`docs/INSTALL_PR_AGENT.md`)
- [ ] Create troubleshooting guide (`docs/TROUBLESHOOT_PR_AGENT.md`)
- [ ] Publish Phase 4 documentation PR
- [ ] Create rollout announcement for team

**Documentation Checklist:**

- [ ] API Reference: All skill interfaces documented
- [ ] Configuration Reference: All config options explained
- [ ] Installation Guide: Step-by-step for new repos
- [ ] Troubleshooting: Common issues and fixes
- [ ] Examples: Sample configs per repo type

---

## 4. ROLLOUT SEQUENCE (PHASED)

### 4.1 Wave 1: Control Plane (Days 1–3)

**Risk Level:** Low (internal infrastructure, full testing capability)

**Repos:**

1. `lightspeedwp/.github` (primary)
2. `lightspeedwp/internal-tools-repo` (secondary)

**Activities:**

- [ ] Install agent + config
- [ ] Run integration tests (mock GitHub API)
- [ ] Run 2 E2E tests against real repos
- [ ] Verify Mergify integration working
- [ ] Fix any issues found

**Success Criteria:**

- ✅ Both repos have working agent
- ✅ E2E tests green
- ✅ Mergify queue processing correctly
- ✅ No errors in logs

---

### 4.2 Wave 2: Additional Control Plane (Days 4–5)

**Risk Level:** Low (still internal)

**Repos:**
3. `lightspeedwp/documentation-site`

**Activities:**

- [ ] Install agent + config
- [ ] Run E2E test
- [ ] Verify docs-focused configuration working
- [ ] Monitor for 24 hours

**Success Criteria:**

- ✅ Repo has working agent
- ✅ E2E test green
- ✅ No governance breaks

---

### 4.3 Wave 3: WordPress Plugins (Days 6–7)

**Risk Level:** Medium (external repos, simpler governance)

**Repos:**

- `lightspeedwp/wordpress-plugin-a`
- `lightspeedwp/wordpress-plugin-b`

**Activities:**

- [ ] Install agent + config + hooks
- [ ] Validate WordPress-specific features
- [ ] Run E2E tests (2 repos)
- [ ] Monitor for 48 hours
- [ ] Collect feedback

**Success Criteria:**

- ✅ Both repos have working agent
- ✅ E2E tests green
- ✅ WordPress labels inferring correctly
- ✅ No issues reported

---

### 4.4 Wave 4: More Plugins (Days 8–9)

**Risk Level:** Medium (learnings from Wave 3)

**Repos:**

- `lightspeedwp/wordpress-plugin-c`
- `lightspeedwp/wordpress-plugin-d`

**Activities:**

- [ ] Install agent + config + hooks
- [ ] Run E2E tests (2 repos)
- [ ] Verify learnings from Wave 3 applied
- [ ] Monitor for 48 hours

**Success Criteria:**

- ✅ Both repos have working agent
- ✅ E2E tests green
- ✅ Consistent with Wave 3

---

### 4.5 Wave 5: WordPress Themes (Days 10–11)

**Risk Level:** Medium (new repo type)

**Repos:**

- `lightspeedwp/wordpress-theme-a`
- `lightspeedwp/wordpress-theme-b`

**Activities:**

- [ ] Install agent + config + hooks
- [ ] Validate theme-specific features (design context, block patterns)
- [ ] Run E2E tests (2 repos)
- [ ] Monitor for 48 hours

**Success Criteria:**

- ✅ Both repos have working agent
- ✅ E2E tests green
- ✅ Theme-specific labels working
- ✅ Design context included in PRs

---

### 4.6 Wave 6: Final Theme (Days 12–13)

**Risk Level:** Low (final repo, pattern established)

**Repos:**

- `lightspeedwp/wordpress-theme-c`

**Activities:**

- [ ] Install agent + config + hooks
- [ ] Run E2E test
- [ ] Final monitoring period

**Success Criteria:**

- ✅ Repo has working agent
- ✅ E2E test green
- ✅ All 12 repos now live

---

## 5. DEPLOYMENT CHECKLIST BY REPO

### 5.1 Template: Per-Repo Deployment Checklist

**Repository:** `___________________`  
**Profile:** `___________________` (standard / wordpress.plugin / wordpress.theme)  
**Wave:** `_____`  
**Rollout Date:** `_____`

**Pre-Deployment (Day -1)**

- [ ] Phase 3 implementation complete and tested
- [ ] Configuration file prepared and validated
- [ ] Windows for E2E testing booked
- [ ] Team notified of deployment window

**Installation (Day 1)**

- [ ] Agent copied to `.claude/agents/pr-creation-agent/`
- [ ] Schema available at `schemas/pr-agent-config.schema.json`
- [ ] Config file placed at `.claude/pr-agent.config.yml`
- [ ] WordPress hooks (if needed) placed at `.claude/pr-agent-wordpress-hooks.js`
- [ ] All files committed and pushed

**Validation (Day 2)**

- [ ] Config loads without errors: `node scripts/test-config-load.js`
- [ ] Hooks load without errors (WordPress repos): `node scripts/test-hooks-load.js`
- [ ] Schema validation passes: `npm run validate:config`
- [ ] No merge conflicts from installation

**E2E Testing (Day 3)**

- [ ] Test branch created: `feat/test-agent-deployment`
- [ ] E2E test triggered: `npm run test:e2e -- --repo ...`
- [ ] Test scenario completed successfully
- [ ] PR created by agent verified correct
- [ ] Test PR closed and test branch deleted

**Post-Deployment (Day 4+)**

- [ ] Monitor agent logs for errors (24+ hours)
- [ ] Collect team feedback
- [ ] Document any issues or learnings
- [ ] Update CHANGELOG.md
- [ ] Approve for next wave

---

## 6. ROLLOUT TIMING

```
┌─────────────────────────────────────────────────────────────────┐
│ PR Creation Agent — Phase 4 Deployment Timeline                 │
├─────────────────────────────────────────────────────────────────┤
│ 2026-09-02 (Day 1)   │ Wave 1: Repo Installation (Control Plane 1)│
│ 2026-09-03 (Day 2)   │ Wave 1: Config & E2E Testing               │
│ 2026-09-04 (Day 3)   │ Wave 2: Control Plane 2                     │
│ 2026-09-05 (Day 4)   │ Wave 3: WordPress Plugins (A, B)           │
│ 2026-09-06 (Day 5)   │ Wave 4: WordPress Plugins (C, D)           │
│ 2026-09-07 (Day 6)   │ Wave 5: WordPress Themes (A, B)            │
│ 2026-09-08 (Day 7)   │ Wave 6: WordPress Theme C                  │
│ 2026-09-09 (Day 8)   │ Final Validation & Documentation           │
└─────────────────────────────────────────────────────────────────┘
```

**Total Duration:** 8 days (2026-09-02 → 2026-09-09)

---

## 7. ROLLBACK PLAN

**If deployment fails at any stage:**

### 7.1 Immediate Rollback (Same Day)

```bash
# For affected repo:
cd /path/to/repo

# 1. Remove agent installation
rm -rf .claude/agents/pr-creation-agent

# 2. Remove configuration
rm -f .claude/pr-agent.config.yml
rm -f .claude/pr-agent-wordpress-hooks.js

# 3. Revert any commits
git reset --hard HEAD~1

# 4. Notify team
echo "Rollback complete for <repo>. Reason: <issue>"
```

### 7.2 Investigation & Fix

- [ ] Identify root cause of failure
- [ ] Fix in agent code or configuration
- [ ] Create issue in `.github` repo
- [ ] Re-test in controlled environment
- [ ] Plan re-deployment

### 7.3 Partial Rollback (If One Wave Fails)

- [ ] Rollback failed wave repos only
- [ ] Continue with next wave if unrelated
- [ ] Reschedule failed wave after fix

---

## 8. MONITORING & METRICS

### 8.1 Deployment Metrics

**Success Metrics:**

- ✅ 12/12 repos deployed successfully (100%)
- ✅ 12/12 agents operational (100% uptime)
- ✅ 12/12 configs validated (100%)
- ✅ 5+ E2E tests passing (100%)
- ✅ 0 critical issues found
- ✅ <1 day average rollout per repo

**Operational Metrics:**

- PR creation latency < 5 seconds
- Config load time < 100ms
- Skill execution < 2 seconds per skill
- GitHub API calls < 10 per PR

### 8.2 Monitoring Setup

```bash
# Log all agent activity
tail -f .claude/logs/pr-agent.log

# Monitor E2E test results
npm run test:e2e -- --watch

# Check agent health
node scripts/health-check.js
```

---

## 9. COMMUNICATION PLAN

### 9.1 Pre-Deployment Announcement

**When:** 3 days before Wave 1  
**Channel:** Slack #engineering + GitHub Discussions  
**Message:** "PR Creation Agent deployment starting Sept 2 — 8 day rollout across 12 repos. See [DEPLOYMENT_PLAN.md](...) for details."

### 9.2 Wave Kickoff Notifications

**When:** Day before each wave  
**Channel:** Slack #engineering (tags for affected teams)  
**Message:** "Wave X deployment starting tomorrow: [repos]. No impact expected on existing workflows."

### 9.3 Completion Announcement

**When:** Day after all 12 repos deployed  
**Channel:** Slack #engineering + GitHub Discussions  
**Message:** "✅ PR Creation Agent now live across 12 repos! [DOCUMENTATION_PLAN.md](...) for usage guide."

---

## 10. SUCCESS CRITERIA (PHASE 4 COMPLETE)

**Deployment is successful when:**

- ✅ All 12 repositories have agent installed
- ✅ All configurations validated and operational
- ✅ 5+ E2E tests passing on real repositories
- ✅ Zero critical issues in post-deployment monitoring
- ✅ All documentation published and reviewed
- ✅ Team trained on agent usage
- ✅ Rollout completed within 8 days
- ✅ Phase 4 PR merged to `develop` and tagged for release

---

**Deployment Plan Complete. Ready for Phase 4 Rollout.**
