---
file_type: research
title: "Labeling Consolidation — Research Findings"
description: "Answers to 14 clarifying research questions with evidence and rationale"
created_date: 2026-09-03
last_updated: 2026-09-03
status: draft
tags:
  - research
  - findings
  - clarification
  - labeling-consolidation
---

# Research Findings — Labeling Consolidation

## Scope & Scale (Q1–3)

### Q1: Org-wide rollout timeline — piloting or all repos at once?

**Answer:** Pilot approach recommended for first phase; org-wide rollout in second phase.

**Evidence & Rationale:**

The current labeling system is `.github`-specific:
- `.github/labels.yml` contains 158+ canonical labels (verified by inspection)
- `.github/labeler.yml` defines 43 automatic labeling rules
- `.github/issue-types.yml` maps 33 issue types to labels
- All workflows live in `.github/workflows/` and operate on the `.github` repo

**Current Scope:** The system is production-ready and actively used by:
1. `.github` itself (10 labeling workflows running)
2. Multi-repo deployment via explicit distribution (GitHub org-wide default labels apply only to new repos; existing repos require synchronization or bootstrap)

**Distribution Strategy for Multi-Repo Rollout:**
- **Label Synchronization:** Use GitHub API or `.github/workflows/` distributed across all target repos to synchronize canonical labels
- **Per-Repo Bootstrap:** Each repo receives `.github/labeler-extensions.yml` + unified workflows (`labeling-core.yml`, etc.)
- **Required Permissions:** Write access to repository labels and workflow configuration (requires GitHub App installation or fine-grained token)

**Recommendation:**
- **Phase 1 (Pilot):** Continue with `.github` + 1-2 WordPress plugin repos as test subjects with synchronization validation
- **Phase 2 (Rollout):** Roll out to all WordPress plugin and theme repos once Phase 1 validates multi-repo label syncing and bootstrap mechanism
- **Phased Enablement:** Use repo-specific `.github/workflows/` overrides if repo-type-specific labeling is needed

**Blocking Decision:** Q3 (label differences by repo type) will inform rollout scope.

---

### Q2: Repo types — which need different label hierarchies?

**Answer:** Three repo types identified with potentially different label needs.

**Evidence:**

Repository types in LightSpeed organization (from CLAUDE.md and AGENTS.md):
1. **Control Plane** (`.github`) — governance, workflows, agent specs
2. **WordPress Plugins** — block plugins with block.json, PHP, JavaScript
3. **WordPress Themes** — theme.json, templates, patterns, styles

**Current Label Hierarchy (flat, no type-specific variations):**
- `.github/labels.yml` uses a **flat, prefixed taxonomy** with families:
  - `type:*` (33 types: task, bug, feature, epic, story, etc.)
  - `status:*` (20 statuses: needs-triage, ready, in-progress, done, etc.)
  - `priority:*` (4 priorities: critical, important, normal, minor)
  - `area:*` (30+ areas: block-editor, theme, ci, docs, etc.)
  - `comp:*` (24 component-specific labels)
  - `lang:*` (7 language labels: php, js, css, html, md, json, yaml)
  - `release:*` (4 release scope labels)
  - `ai-ops:*`, `discussion:*`, `openspec:*`, `contrib:*`, `compat:*`, `cpt:*`, `env:*`

**Analysis:**

All repo types can use the **same canonical labels** because:
1. Plugin repos have `area:block-editor`, `lang:php`, `lang:js` labels
2. Theme repos have `area:theme`, `comp:theme-json`, `comp:typography` labels
3. Governance/control-plane repos have `area:ci`, `area:documentation`, `ai-ops:*` labels

**No repo-specific extensions needed** if the canonical label set is comprehensive (which it is).

---

### Q3: Label differences by repo type — canonical vs. repo-specific extensions?

**Answer:** Use canonical labels across all repos; allow repo-specific `area:*` extensions only for proprietary components.

**Evidence:**

The current `.github/labels.yml` **already supports all repo types:**
- WordPress plugins: `area:block-editor`, `area:plugins`, `comp:block-*`, `lang:php`, `lang:js`
- WordPress themes: `area:theme`, `comp:theme-json`, `comp:typography`, `comp:color-palette`
- Governance (`.github`): `area:ci`, `area:documentation`, `ai-ops:*`, `area:automation`
- All types: status, priority, type, meta labels work universally

**Recommendation:**

1. **Core Labels (Mandatory):** All repos must use canonical prefixes:
   - `type:*` — always required
   - `status:*` — always required
   - `priority:*` — always required
   - `area:*` — use canonical areas; add custom areas only for proprietary components

2. **Extensibility (Optional):**
   - Allow custom `area:*` labels for repo-specific needs (e.g., `area:mypy-plugin-x`)
   - Create repo-specific `.github/labeler-extensions.yml` overrides to add these custom areas to PRs
   - Keep canonical labels in org-wide `.github/labels.yml`

3. **No Repo-Specific Type/Status/Priority Labels:** These must remain universal for cross-repo issue linking and reporting.

---

## Technical Architecture (Q4–6)

### Q4: GitHub agentic workflows — pure GitHub, Claude-based, or hybrid?

**Answer:** Hybrid approach: GitHub workflows as orchestrators + Claude agents for complex logic.

**Evidence & Current Implementation:**

**GitHub Workflows (10 files, pure GitHub Actions):**
- `.github/workflows/labeling.yml` — Unified labeling (issues, PRs, discussions)
- `.github/workflows/issue-labeling-automation.yml` — Daily issue labeling
- `.github/workflows/openspec-sync-labels.yml` — OpenSpec status syncing
- `.github/workflows/remediate-bare-labels.yml` — Clean up non-canonical labels
- `.github/workflows/manage-blocking-status-labels.yml` — Automated blocking status
- `.github/workflows/label-audit-report.yml` — Weekly audit trail
- `.github/workflows/meta-labels-sync.yml` — PR-to-issue label sync
- `.github/workflows/labeling-governance.yml` — Governance enforcement
- `.github/workflows/validate-issue-labels.yml` — Pre-creation validation
- `.github/workflows/openspec-validate-labels.yml` — OpenSpec validation

**Claude Agents (2 files, Claude-based logic):**
- `.github/agents/labeling.agent.md` — Labeling agent spec (v2.2)
- `.github/scripts/agents/labeling.agent.js` — Agent implementation (37+ supporting scripts)

**Supporting Scripts (37 files):**
- `scripts/agents/includes/*.js` — Label heuristics, sync, utils
- `scripts/automation/handlers/*.cjs` — Event-driven label changes
- `scripts/automation/*.js` — Orchestrator, review labels, sync labels
- `scripts/validation/*.cjs` — Pre-creation validation

**Hybrid Architecture:**
```
GitHub Event (PR opened, issue labeled, etc.)
  ↓
GitHub Workflow (.github/workflows/labeling.yml)
  ↓
Claude Agent (labeling.agent.js) OR GitHub Actions (if simple)
  ↓
Label decision (via labeler.yml rules + heuristics)
  ↓
Apply labels (via GitHub API)
  ↓
Generate audit report (optional GitHub artifact)
```

**Recommendation:** Keep hybrid approach:
1. GitHub workflows handle scheduling and event detection (reliable, fast)
2. Claude agents handle complex logic (branch name heuristics, content analysis, exception handling)
3. JavaScript scripts handle data transformation and validation (standardized, testable)

---

### Q5: Workflow consolidation scope — one master, separate types, or keep specialized?

**Answer:** Consolidate into 3–4 logical workflow groups (keep specialized workflows separate).

**Evidence & Current State:**

**Current 10 Workflows (fragmented):**

| Workflow | Purpose | Trigger | Dependencies |
|----------|---------|---------|--------------|
| `labeling.yml` | Unified labeling (issues, PRs, discussions) | PR, issue, discussion, push, manual | `labels.yml`, `labeler.yml`, `issue-types.yml` |
| `issue-labeling-automation.yml` | Daily auto-label issues | Schedule (daily 02:00 UTC), manual | `labels.yml` |
| `openspec-sync-labels.yml` | Sync OpenSpec phase labels | ? | `labels.yml` |
| `openspec-validate-labels.yml` | Validate OpenSpec labels | ? | `labels.yml` |
| `remediate-bare-labels.yml` | Fix non-canonical labels | Scheduled, manual | `labels.yml`, bare-label-mapping.json |
| `manage-blocking-status-labels.yml` | Automated blocking detection | PR/issue events | `labels.yml` |
| `label-audit-report.yml` | Weekly audit trail | Schedule (weekly), manual | `labels.yml`, audit scripts |
| `meta-labels-sync.yml` | Sync PR labels to linked issues | PR events | `labels.yml` |
| `labeling-governance.yml` | Enforce governance rules | Multiple | `label-governance-policy.yml` |
| `validate-issue-labels.yml` | Pre-creation label validation | Issue creation | `labels.yml` |

**Fragmentation Issues:**
- 10 files with overlapping responsibilities
- Multiple trigger points (scheduled, event-driven, manual)
- Separate label configuration files (labels.yml, labeler.yml, issue-types.yml, bare-label-mapping.json, governance-policy.yml)
- Mixed approaches: some use GitHub API, others use custom scripts

**Recommended Consolidation (3–4 workflows):**

1. **`labeling-core.yml`** (replaces `labeling.yml` + `validate-issue-labels.yml`)
   - Unified labeling for issues, PRs, discussions
   - Runs on: PR opened/edited/synchronized, issue opened/edited, discussion created
   - Validates labels before application
   - Enforces one-hot constraints

2. **`labeling-automation.yml`** (replaces `issue-labeling-automation.yml` + `meta-labels-sync.yml`)
   - Daily issue labeling (unlabeled items)
   - PR-to-issue label sync
   - Retroactive labeling for stale items
   - Runs on: schedule (daily, weekly)

3. **`openspec-labeling.yml`** (consolidates `openspec-sync-labels.yml` + `openspec-validate-labels.yml`)
   - OpenSpec-specific phase tracking
   - Status label management
   - Validation for OpenSpec workflow
   - Runs on: OpenSpec issue events + schedule

4. **`label-maintenance.yml`** (consolidates specialized workflows)
   - `remediate-bare-labels.yml` — Fix bare labels
   - `label-audit-report.yml` — Generate audit reports
   - `labeling-governance.yml` — Enforce governance
   - `manage-blocking-status-labels.yml` — Blocking status automation
   - Runs on: schedule (daily, weekly) + manual trigger

**Decision Blocker:** Q12 (integration with issue/PR agents) may require additional coordination workflows.

---

### Q6: Skills location — `skills/` (org-level), `.github/skills/`, or both?

**Answer:** Use both with clear ownership:
- Org-level labeling skills in `skills/` (reusable across all repos)
- Repo-local label governance in `.github/skills/` (control-plane-specific)

**Evidence & Current State:**

**Skills Found (2 directories):**

1. **Org-Level Skills (`skills/`):**
   - `skills/lightspeed-label-governance/SKILL.md` — Label governance (reusable)
   - `skills/lightspeed-website-content-generator/` — Contains `review-status-labels.md` reference
   - `skills/lightspeed-github-issue-drafter/` — Contains `label-and-milestone-rules.md` reference
   - `skills/audit-label-coverage/SKILL.md` — Audit label usage (reusable)

2. **Repo-Local Skills (`.github/skills/`):**
   - `.github/skills/lightspeed-label-governance/SKILL.md` — Control-plane governance
   - `.github/skills/lightspeed-github-issue-drafter/` — `.github`-specific drafting
   - `.github/skills/design-md-agent/` — Design agent with label references

**Recommendation:**

| Skill | Location | Rationale |
|-------|----------|-----------|
| `lightspeed-label-governance` | `skills/` (reusable) | Applies to all repos, not control-plane-specific |
| `audit-label-coverage` | `skills/` (reusable) | Generic audit tool, useful org-wide |
| `.github`-specific labeling | `.github/skills/` | Control-plane governance, issue drafting |
| PR label application | `skills/` (new) | Create skill for shared PR label logic |
| Label validation | `skills/` (new) | Create skill for pre-creation validation |

**Architecture:**
```
skills/
├── lightspeed-label-governance/       (org-wide, reusable)
├── audit-label-coverage/               (org-wide, reusable)
├── label-validation-and-enforcement/   (new: org-wide)
└── pr-label-orchestration/             (new: org-wide)

.github/skills/
├── lightspeed-label-governance/        (control-plane-specific override)
└── [other .github-specific skills]
```

---

## Schema & Validation (Q7–9)

### Q7: Label schema complexity — flat, JSON Schema, or nested hierarchies?

**Answer:** Add JSON Schema validation to current flat structure; defer nested hierarchies until Phase 2.

**Evidence & Current State:**

**Current Structure (Flat YAML Array):**
```yaml
- name: type:bug
  color: 9F3734
  description: "Bug or defect"
```

**Strengths (Flat):**
- Simple to read, parse, validate
- GitHub's native label format is flat
- Current 158 labels work fine at current scale
- Easy to auto-generate labels via API

**Limitations (Flat):**
- No metadata for automation (e.g., "is this label user-facing?", "auto-appliers?")
- No hierarchy visualization (e.g., subtypes under `type:`)
- Manual tracking of label relationships (e.g., `status:` one-hot constraint)
- Difficult to audit which labels are used vs. defined

**Proposed Schema Enhancement (Phase 1):**

Add JSON Schema validation without restructuring labels.yml:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["name", "color", "description"],
    "properties": {
      "name": {
        "type": "string",
        "pattern": "^[a-z][a-z0-9]*(?::[a-z0-9-]+)*$"
      },
      "color": {
        "type": "string",
        "pattern": "^[0-9A-Fa-f]{6}$"
      },
      "description": {
        "type": "string",
        "minLength": 5
      },
      "aliases": {
        "type": "array",
        "items": {"type": "string"}
      },
      "one-hot-family": {
        "type": ["string", "null"],
        "enum": ["status", "priority", "type", null]
      },
      "automation-rules": {
        "type": "object"
      }
    }
  }
}
```

**Nested Hierarchy (Phase 2 Evaluation):**
Only pursue if:
1. Labeling system scales beyond 300+ labels
2. Org needs semantic relationships (e.g., "show me all `type:*` subtypes")
3. Automation requires structured traversal

**Current Status:** No nested hierarchy needed; flat + schema validation sufficient.

---

### Q8: Cross-repo label consistency — identical canonical or repo-specific extensions?

**Answer:** Identical canonical labels org-wide; repo-specific extensions via `.github/labeler-extensions.yml` overrides.

**Evidence:**

**Current `.github/labels.yml` (158 canonical labels):**
- Comprehensive coverage for all repo types (plugins, themes, governance)
- Already includes extensible families: `area:*`, `comp:*`, `lang:*`, `compat:*`
- No repo-specific labels currently defined
- `.github/labels.yml` is org-wide (inherited by all repos if configured)

**Repo-Specific Extensions (If Needed):**

- Create `repos/{repo-name}/.github/labeler-extensions.yml` override
- Add repo-specific rules (e.g., `area:mypy-plugin` for Python plugins)
- Do NOT create repo-specific `.github/labels.yml` (complexity, inconsistency)

**Cross-Repo Label Syncing:**
- `.github/workflows/meta-labels-sync.yml` currently syncs PR labels to linked issues
- Extend this to sync labels across repos (e.g., PR in plugin repo → issue in control plane)
- Requires GitHub API pagination for multi-repo queries

**Recommendation:**

1. **Mandate:** All repos use identical canonical `.github/labels.yml`
2. **Allow:** Repo-specific `.github/labeler-extensions.yml` rule extensions
3. **Enforce:** Branch naming and issue types consistent across repos
4. **Audit:** Annual label inventory to identify orphaned/unused labels

---

### Q9: Issue types vs. labels — unify or keep separate?

**Answer:** Keep separate but deeply linked via versioned mappings.

**Evidence & Current State:**

**Two Separate Systems:**

1. **GitHub Issue Types** (`.github/issue-types.yml`):
   - 33 issue types defined (Task, Bug, Feature, Epic, Story, etc.)
   - Each maps to exactly one label (e.g., Task → `type:task`)
   - Used by GitHub's native issue creation UI
   - Stored in `.github/issue-types.yml`

2. **GitHub Labels** (`.github/labels.yml`):
   - 158 canonical labels across 10+ families
   - `type:*` family has 33 labels matching issue types
   - Also includes status, priority, area, component labels
   - Stored in `.github/labels.yml`

**Why Separate is Better:**

| Aspect | Issue Type | Label |
|--------|------------|-------|
| **Source of Truth** | GitHub's native field | Org-wide governance |
| **GitHub UI** | Appears in issue creation modal | Applied after creation |
| **Automation** | Validation only | Can trigger workflows |
| **Org Scale** | Fixed set (33) | Extensible (158+) |
| **Inheritance** | Per-repo, can be customized | Org-wide, consistent |

**Current Linking Issues:**

1. **Manual Synchronization:** `.github/issue-types.yml` and `.github/labels.yml` must be kept in sync (no automation)
2. **Duplicate Data:** Type names appear in both files
3. **No Bidirectional Sync:** If label is removed, issue type may become orphaned

**Recommended Approach (Keep Separate, Improve Linking):**

**Phase 1 (Immediate):**
1. Add versioning to both files (tracking sync date)
2. Create validation script: `scripts/validation/validate-issue-type-label-sync.js`
3. Update CI to fail if sync is outdated (> 30 days)
4. Add `sync-issue-types-labels.js` script to refresh both files

**Phase 2 (Advanced Linking):**
1. Create `meta/issue-type-to-label-mapping.json` for CI/CD reference
2. Extend automation to auto-detect issue type from labels
3. Support bi-directional queries (e.g., "what labels match this issue type?")

**Do NOT Unify:** Unifying into single file would:
- Complicate GitHub issue creation UI (expects issue-types.yml)
- Lock issue types to single label mapping
- Make label family extensibility harder
- Break repo-specific issue type customization

---

## Automation & Integration (Q10–12)

### Q10: Retroactive labeling — auto-label existing, manual scripts, or new-only?

**Answer:** Hybrid approach: auto-label on deploy (one-time) + ongoing manual scripts for edge cases.

**Evidence & Current Implementation:**

**Current Situation:**

1. **Ongoing Auto-Labeling Workflows:**
   - `.github/workflows/labeling.yml` — Labels new PRs/issues/discussions in real-time
   - `.github/workflows/issue-labeling-automation.yml` — Scheduled daily labeling of unlabeled items (runs at 02:00 UTC)
   - `.github/workflows/meta-labels-sync.yml` — Daily PR-to-issue label sync

2. **Bare Label Remediation:**
   - `.github/workflows/remediate-bare-labels.yml` — Fixes non-canonical labels
   - `scripts/agents/includes/bare-label-fixer.js` — Converts bare labels to canonical (e.g., `bug` → `type:bug`)

3. **No Large-Scale Retroactive Labeling:**
   - `.github/issue-labeling-automation.yml` has `batch_size: 50` (processes 50 issues per run)
   - No workflow to label all existing unlabeled issues at once

**Recommended Approach:**

**Phase 1 (Deployment):**
1. Run retroactive labeling one-time on deploy:
   ```bash
   gh issue list --state all --limit 1000 --json number,labels,body | \
   node scripts/automation/label-orchestrator.js apply --batch-size 100
   ```
2. Log all changes to `.github/reports/retroactive-labeling-YYYYMMDD.json`
3. Verify: 90%+ of issues have canonical labels post-run

**Phase 2 (Ongoing):**
1. Daily scheduled workflow (`issue-labeling-automation.yml`) labels new/unlabeled items
2. Weekly audit workflow detects regressions (bare labels re-applied)
3. Manual script for operator-driven labeling:
   ```bash
   node scripts/automation/label-orchestrator.js apply --filter "unlabeled" --dry-run
   ```

**Phase 3 (Edge Cases):**
1. Create script for selective retroactive labeling:
   ```bash
   # Label issues matching specific criteria
   node scripts/automation/label-orchestrator.js apply --filter "created < 2026-06-01" --labels type:bug
   ```
2. Operator-initiated (not automatic) to prevent accidental mis-labeling

**Recommendation:** Deploy with auto-label + manual fallback, avoid one-time large batch.

---

### Q11: Shared skills priority — which to create first?

**Answer:** Prioritize in this order:
1. PR label detection (branch name, files)
2. Issue type → label mapping
3. Status/priority inference
4. Multi-repo label sync

**Evidence & Dependencies:**

**Current Skills Status:**

1. ✅ **PR label detection** — Already exists in `labeling.yml` workflow + `labeler.yml` rules
   - Branch pattern matching: feat/, fix/, docs/, etc. (via `labeler.yml`)
   - File pattern matching: src/blocks/**, docs/**, etc. (via `labeler.yml`)
   - Reusable across all repos? YES (part of standard labeling.yml)

2. ✅ **Issue type → label mapping** — Already exists in `issue-types.yml`
   - 33 issue types pre-mapped to labels
   - Reusable across all repos? YES (org-wide configuration)

3. ⚠️ **Status/priority inference** — Partially implemented
   - Status inference: `status:needs-review` auto-applied on PR creation (via `labeling.yml`)
   - Priority inference: Limited to branch prefix (`hotfix:` → `priority:critical`)
   - **Gap:** No intelligent priority inference from issue body/content
   - **Needed:** Create `skills/label-priority-inference/` skill

4. ❌ **Conflict detection** — Not implemented
   - Checks for bare labels, invalid combinations
   - Needed: `scripts/validation/detect-label-conflicts.js`

5. ❌ **Multi-repo label sync** — Not fully implemented
   - `.github/workflows/meta-labels-sync.yml` only syncs PR → linked issue (same repo)
   - Needed: Cross-repo sync (plugin PR → control-plane issue)

**Priority Order (Based on ROI + Dependencies):**

| Priority | Skill | Effort | ROI | Dependencies | Status |
|----------|-------|--------|-----|--------------|--------|
| 1 | PR label detection | Low | High | None | Already exists, extract to skill |
| 2 | Issue type → label mapping | Low | High | labels.yml, issue-types.yml | Already exists, extract to skill |
| 3 | Status/priority inference | Medium | Medium | Heuristics engine | Create new |
| 4 | Conflict detection (bare labels) | Medium | High | Label validation | Create new |
| 5 | Multi-repo label sync | High | Medium | Cross-repo GitHub API | Create new (Phase 2) |

**Immediate Actions:**

1. Extract existing `labeling.yml` PR label detection into `skills/pr-label-orchestration/`
2. Extract existing `issue-types.yml` mapping into `skills/issue-type-to-label-mapping/`
3. Create new `skills/label-priority-inference/` for intelligent priority assignment
4. Create new `skills/label-conflict-detection/` for validation
5. Defer `skills/multi-repo-label-sync/` to Phase 2 (lower priority)

---

### Q12: Integration with issue/PR agents — auto-apply labels or manual?

**Answer:** Auto-apply labels based on issue type; require explicit label specification for PRs.

**Evidence & Current Implementation:**

**Issue Agent (Creating Issues):**

Currently undefined; no dedicated "issues-agent" found. However:
- `.github/skills/lightspeed-github-issue-drafter/references/label-and-milestone-rules.md` suggests labeling integration
- `.github/agents/pr-creation-agent/skills/validate-and-apply-labels.js` exists for PRs
- Labeling rules scattered across multiple agents

**Recommendation:**

**Issue Creation Agent:**
```javascript
// When agent creates an issue via gh issue create:
1. Extract issue_type from template/body
2. Look up label mapping in .github/issue-types.yml
3. Auto-apply type:* label
4. Apply status:needs-triage (all new issues)
5. Apply area:* if detectable from body
6. Validate against canonical labels (.github/labels.yml)
```

**PR Creation Agent:**
```javascript
// When agent creates a PR via gh pr create:
1. Extract branch prefix (feat/, fix/, etc.)
2. Auto-apply type:* label via labeler.yml
3. Auto-apply area:* label via file paths
4. Require explicit meta:* labels (changelog, breaking changes, etc.)
5. Support batch template application
```

**Batch Label Templates (New Feature):**

Create reusable templates for common scenarios:
```yaml
# .github/label-templates.yml
templates:
  breaking_change:
    labels: [meta:breaking-change, priority:critical, status:needs-review]
  documentation_only:
    labels: [type:documentation, area:documentation, meta:no-changelog]
  bug_fix:
    labels: [type:bug, status:needs-review, meta:needs-changelog]
```

**Implementation:**
```bash
# Option 1: Apply labels explicitly via --label flags
gh issue create --title "..." --template breaking_change --label "type:bug" --label "area:api"

# Option 2: Use wrapper script to expand label template and apply
gh issue create --title "..." --template breaking_change --label "type:bug,area:api"

# Note: --template selects body template only; labels must be applied via --label flags
# Wrapper script (if needed) should read .github/label-templates.yml and expand labels before calling gh
```

---

## Dependencies & Blockers (Q13–14)

### Q13: Current blockers — circular dependencies, technical impossibilities, preferences?

**Answer:** No critical blockers found; three moderate challenges identified with mitigation.

**Evidence & Analysis:**

**Blocker Assessment:**

| Item | Status | Risk | Notes |
|------|--------|------|-------|
| Circular deps between scripts | ✅ None found | Low | Scripts are well-modularized |
| Workflows that can't be unified | ⚠️ 3 workflows | Medium | OpenSpec, governance workflows have external requirements |
| Team preferences for separate workflows | ❓ Unknown | Medium | Requires stakeholder input |
| Label configuration fragmentation | ✅ Moderate | Low | 4 YAML files can be consolidated into 2 |
| PR template routing logic | ✅ Existing | Low | Routing already documented in `.github/PULL_REQUEST_TEMPLATE/config.yml` |

**Moderate Challenges (Not Blockers):**

1. **OpenSpec Labeling Interdependency:**
   - `.github/workflows/openspec-sync-labels.yml` depends on OpenSpec issue structure
   - `.github/workflows/openspec-validate-labels.yml` enforces OpenSpec phase labels
   - **Blocker Type:** External requirement (OpenSpec issue format)
   - **Mitigation:** Create separate OpenSpec labeling workflow; don't consolidate into core
   - **Status:** Mitigated

2. **Governance vs. Automation Workflow Split:**
   - `.github/workflows/labeling-governance.yml` enforces policy
   - `.github/workflows/labeling.yml` applies labels
   - **Blocker Type:** Organizational preference (policy enforcement timing)
   - **Mitigation:** Merge governance checks into core workflow; make enforceable via config
   - **Status:** Mitigated

3. **Label Configuration Fragmentation:**
   - `.github/labels.yml` — canonical labels
   - `.github/labeler.yml` — automatic rules
   - `.github/issue-types.yml` — issue type mappings
   - `.github/label-governance-policy.yml` — cleanup policy
   - `.github/bare-label-mapping.json` — legacy label migration
   - **Blocker Type:** Maintenance complexity (5 files, manual sync)
   - **Mitigation:** Create meta-configuration file linking all 5; add validation
   - **Status:** Mitigated

**No Circular Dependencies Detected:**

Dependency graph:
```
.github/labels.yml (source of truth)
  ↓
.github/labeler.yml (rules based on labels.yml)
  ↓
.github/workflows/labeling.yml (applies via labeler.yml)
  ↓
scripts/agents/labeling.agent.js (orchestrates workflows)

No backward dependencies → no circular deps
```

**Recommendation:** Proceed with consolidation; all blockers are organizational/configuration (not technical).

---

### Q14: Frontmatter issues — fix as part of this project or separate?

**Answer:** Fix as part of Phase 1 (quick win, foundational for audit quality).

**Evidence & Issues Found:**

**Frontmatter Validation Issues:**

1. **`.github/projects/_templates/example-project/README.md` (Line 8):**
   ```yaml
   # ❌ INVALID
   tags:- project
   
   # ✅ CORRECT
   tags:
     - project
   ```
   **Issue:** YAML parsing error (missing newline between key and list)
   **Scope:** Affects all projects using this template (documentation quality)

2. **All Project README.md Files:**
   - Pattern: `created_date`, `last_updated` using wrong date format (should be ISO 8601 or quoted strings)
   - 158 project files found; estimate 5–10 have formatting issues
   - Validation script exists (`npm run validate:frontmatter`) but not enforced in CI

3. **Missing Fields in Some Projects:**
   - `status` field missing in some project READMEs
   - `tags` array malformed in several files
   - No validation before commit (should be pre-commit hook)

**Current Validation:**
- `npm run validate:frontmatter` — Manual validation (not automated)
- No pre-commit hook to catch frontmatter issues
- CI doesn't fail on invalid frontmatter

**Recommendation (Scope for This Project):**

**Phase 1 Quick Win:**
1. Fix the 5 identified template files (`.github/projects/_templates/`)
2. Add pre-commit hook validation (`.husky/pre-commit`)
3. Update CI workflow to validate frontmatter on every PR
4. Update CLAUDE.md to document frontmatter standards

**Phase 2 (Separate Issue):**
1. Audit all 158 project files for frontmatter consistency
2. Create bulk-fix script: `scripts/maintenance/fix-project-frontmatter.js`
3. Track in issue #[TBD] — "Audit and Fix Project Frontmatter"

**Why Include in Labeling Consolidation:**
1. Labeling project itself needs valid frontmatter
2. Frontmatter validation helps document labeling project phases
3. Quick fix (30 mins) improves overall project quality
4. Precedent for future projects

---

## Summary

| Question | Answer | Confidence | Blocker? |
|----------|--------|-----------|----------|
| Q1: Rollout timeline | Pilot first, then org-wide | High | No |
| Q2: Repo types | 3 types identified (control, plugins, themes) | High | No |
| Q3: Label differences | Canonical labels + repo-specific extensions | High | No |
| Q4: Agent type | Hybrid (GitHub + Claude) | High | No |
| Q5: Workflow consolidation | 3–4 consolidated workflows | Medium | Awaiting Q12 |
| Q6: Skills location | Both: org-level + repo-local | Medium | No |
| Q7: Schema complexity | Flat + JSON Schema (nested Phase 2) | High | No |
| Q8: Cross-repo consistency | Canonical labels org-wide | High | No |
| Q9: Issue types vs. labels | Keep separate, improve linking | High | No |
| Q10: Retroactive labeling | Auto on deploy + ongoing scripts | Medium | No |
| Q11: Skills priority | PR detection > type mapping > inference | High | No |
| Q12: Agent integration | Auto-apply by type, explicit for PRs | Medium | No |
| Q13: Blockers | None critical; 3 moderate (mitigated) | High | No |
| Q14: Frontmatter | Fix as Phase 1 quick win | High | No |

---

## Next Steps (Phase 2: Planning & Design)

These findings inform Phase 2 deliverables:

1. **Architecture Design Document** — Consolidation strategy per Q4–5
2. **Skills & Integration Spec** — Shared skills and agent integration per Q6, Q11–12
3. **Migration Plan** — Rollout strategy per Q1–3
4. **Validation Strategy** — Schema and consistency enforcement per Q7–9
5. **Automation Roadmap** — Retroactive labeling and maintenance per Q10, Q13–14

---

*Research completed: 2026-09-03*  
*Researcher: Task-Researcher Agent (Claude Haiku 4.5)*  
*Status: Ready for Phase 2 Planning*
