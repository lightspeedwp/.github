---
file_type: integration-guide
title: "Project Meta Sync Agent v2 — Integration Guide"
description: ""How the modernized agent integrates with Phase 3-4 (Issue Maintenance Scripts) and Phase 5A (Release Agentic Workflows)""
created_date: 2026-08-12
last_updated: "2026-08-25"
status: active
---

# Integration Guide: Phase 3-4 & Phase 5A

## Part 1: Phase 3-4 Integration (Issue Maintenance Scripts)

### What Agent Should Know About Phase 3-4

Phase 3-4 of the Issue Maintenance Scripts initiative delivered:

- ✅ `label-orchestrator.js` — Unified CLI for all label operations
- ✅ Helper scripts — 5+ scripts for specific label tasks
- ✅ Documentation — `ISSUE_MAINTENANCE_SCRIPTS.md`, `LABEL_MANAGEMENT_CLI.md`
- ✅ Workflows — `meta-labels-sync.yml`, `label-audit-report.yml`

### Agent's Role: Teach Users to Use the Orchestrator

The agent should teach users to prefer `label-orchestrator.js` over individual scripts:

```bash
# Best: Use unified orchestrator
node scripts/automation/label-orchestrator.js audit --all
node scripts/automation/label-orchestrator.js sync meta:has-pr --dry-run
node scripts/automation/label-orchestrator.js --interactive

# Good: Direct script if specialized need
node scripts/automation/review-meta-labels.js --audit
node scripts/automation/sync-pr-labels.js --dry-run

# Workflows: Automatic (no user action needed)
# Scheduled daily: meta-labels-sync.yml
# Scheduled monthly: label-audit-report.yml
```

### Operational Pattern: Audit → Diagnose → Options → Execute

When a user asks for help with labels, the agent should follow this pattern:

**Step 1: Audit** — Run orchestrator audit to understand current state

```bash
node scripts/automation/label-orchestrator.js audit --all
```

Output:

```json
{
  "total_issues": 487,
  "labeled": 412,
  "unlabeled": 75,
  "by_family": {
    "type": { "covered": 487, "coverage": "100%" },
    "status": { "covered": 340, "coverage": "70%" },
    "area": { "covered": 298, "coverage": "61%" },
    "meta": { "covered": 145, "coverage": "30%" }
  },
  "recommendations": [
    "75 issues missing type:* label",
    "147 issues missing status:* label",
    "meta:has-pr mismatch on 12 issues"
  ]
}
```

**Step 2: Diagnose** — Show user what's missing and why it matters

Agent explains:

- "You have 75 unlabeled issues (15%)"
- "147 issues missing status labels (30%)"
- "12 issues have meta:has-pr but no linked PR"

**Step 3: Options** — Present 2-3 ways to fix

```
Option A: Auto-fix (fastest)
- Applies changes with confidence > 0.95
- Command: node scripts/automation/label-orchestrator.js apply --auto --confidence 0.95
- Risk: Some issues might get wrong labels

Option B: Interactive (safest)
- Review each change before applying
- Command: node scripts/automation/label-orchestrator.js --interactive
- Risk: Takes longer (5-10 min per 100 issues)

Option C: Dry-run (preview)
- See what would change without applying
- Command: node scripts/automation/label-orchestrator.js apply --dry-run
- Risk: No changes applied (preview only)
```

**Step 4: Execute** — Run user's choice

Agent runs selected command and captures output.

**Step 5: Summarize** — Show what changed and why

```
✅ Applied 142 label changes
- Added 75 type:* labels
- Added 65 status:* labels
- Removed 2 incorrect labels

Issues updated: 142
Issues unchanged: 345
Errors: 0

Next: Run audit again to verify, or ask if you need more help
```

### Phase 3-4 Documentation Integration

Agent should link to existing Phase 3-4 documentation:

- **User wants overview:** Point to `docs/ISSUE_MAINTENANCE_SCRIPTS.md`
- **User wants CLI reference:** Point to `docs/LABEL_MANAGEMENT_CLI.md`
- **User wants label strategy:** Point to `docs/LABEL_STRATEGY.md`
- **User wants advanced help:** Point to specific script README in `scripts/automation/`

Example agent response:

```markdown
For a complete guide on label maintenance, see:
📖 docs/ISSUE_MAINTENANCE_SCRIPTS.md

For CLI command reference:
📖 docs/LABEL_MANAGEMENT_CLI.md

For label taxonomy and strategy:
📖 docs/LABEL_STRATEGY.md
```

---

## Part 2: Phase 5A Integration (Release Agentic Workflows)

### What Release Agent Needs From Metadata Agent

Phase 5A (Release Agentic Workflows) will call Metadata Agent as a pre-check before orchestrating releases. Release Agent needs:

1. **Validation Result** — Is metadata clean?
2. **Blocking Issues** — What must be fixed before release?
3. **Warnings** — What should the maintainer review?
4. **Recommendation** — Proceed, fix first, or user review?

### Agent's Metadata Validation Tiers

The agent should implement validation in 3 tiers:

#### Tier 1: Blockers (Release Fails if Any Fail)

- ✅ All issues in milestone have a `type:*` label
- ✅ No issues with conflicting labels (e.g., both `type:bug` AND `type:feature`)
- ✅ All PRs have either `meta:needs-changelog` OR `meta:skip-changelog`
- ✅ No issues with `status:needs-triage` (triage must be complete)

**Command:** `node scripts/automation/label-orchestrator.js validate --strict`

**Validation Result:**

```json
{
  "tier": "blockers",
  "status": "fail",
  "failures": [
    {
      "issue": 1234,
      "reason": "Missing type:* label",
      "fix": "Add one of: type:bug, type:feature, type:task, type:design"
    }
  ],
  "recommendation": "fix_first"
}
```

#### Tier 2: Warnings (Release Can Proceed With Warning)

- 🟡 95%+ of issues have `priority:*` label
- 🟡 All issues in milestone have `area:*` label
- 🟡 No issues with `meta:stale` label (should be removed)

**Command:** `node scripts/automation/label-orchestrator.js validate --warnings`

**Validation Result:**

```json
{
  "tier": "warnings",
  "status": "warn",
  "warnings": [
    {
      "issue": 5678,
      "reason": "Missing priority:* label",
      "fix": "Add one of: priority:critical, priority:important, priority:normal, priority:low"
    }
  ],
  "recommendation": "can_proceed_with_review"
}
```

#### Tier 3: Info (For Reference)

- ℹ️ Stale labels present
- ℹ️ Deprecated labels to remove
- ℹ️ Project fields out of sync

**Command:** `node scripts/automation/label-orchestrator.js validate --full`

### Validation Contract: What Release Agent Expects

When Release Agent asks Metadata Agent to validate, it expects this response:

```json
{
  "timestamp": "2026-08-12T12:00:00Z",
  "release_type": "minor",
  "validation": {
    "tier_1_blockers": {
      "status": "pass" | "fail",
      "failures": [
        { "issue": 123, "reason": "...", "fix": "..." }
      ]
    },
    "tier_2_warnings": {
      "status": "pass" | "warn",
      "warnings": [...]
    },
    "tier_3_info": {
      "info": [...]
    }
  },
  "recommendation": "proceed" | "fix_first" | "user_review",
  "summary": "Clear, actionable summary for Release Agent"
}
```

### Release Type Requirements

Different release types have different metadata requirements:

| Release Type | Tier 1 Blockers | Tier 2 Warnings | Tier 3 Info |
|---|---|---|---|
| **Patch** | Must pass | Ignored | Ignored |
| **Minor** | Must pass | Should pass (warning OK) | Reported |
| **Major** | Must pass | Must pass | Full audit |

### Agent Response to Release Agent

When Release Agent calls Metadata Agent:

```
Release Agent: "Validate metadata for a minor release of v1.2.0"

Metadata Agent:
1. Check Tier 1 blockers
   ✅ All type:* labels present
   ✅ No conflicting labels
   ✅ All PRs have changelog status
   ✅ No issues in needs-triage

2. Check Tier 2 warnings
   🟡 12 issues missing priority:* (2.5%)
   ✅ All issues in milestone have area:* (100%)
   ✅ No stale labels found

3. Recommendation
   ✅ PROCEED WITH REVIEW
   Summary: Metadata is mostly clean. Review 12 priority warnings before release.

Returning result to Release Agent…
```

---

## Part 3: User Scenarios & Walkthroughs

### Scenario 1: "My Issue Labels Are Inconsistent"

**User Question:** "I have 300 open issues and I'm not sure if labels are applied correctly. Can you help clean them up?"

**Agent Response:**

1. **Audit:** Run full audit to understand coverage

   ```bash
   node scripts/automation/label-orchestrator.js audit --all
   ```

2. **Diagnose:** "You have 75% label coverage. Missing labels: 25 issues without status:*, 12 without type:*"

3. **Options:**
   - Auto-fix low-risk issues (confidence > 0.9)
   - Review each issue interactively
   - Dry-run to preview changes first

4. **Execute:** User chooses option; agent runs it

5. **Summarize:** "Fixed 37 labels. 263 issues now fully labeled."

**Escalation:** If user wants to redesign labels, handoff to Label Strategy Agent.

### Scenario 2: "How Do I Sync Project Fields?"

**User Question:** "I updated labels on several issues, but the GitHub Project board isn't showing the right values. How do I sync?"

**Agent Response:**

1. **Explain:** Project fields are derived from labels via `derive-project-fields.cjs`

2. **Regenerate:**

   ```bash
   node scripts/agents/includes/derive-project-fields.cjs
   ```

3. **Validate:** Verify fields are now correct

   ```bash
   node scripts/automation/label-orchestrator.js audit --project-fields
   ```

4. **Confirm:** "Project fields synced. 487 issues updated."

**Escalation:** If fields are still wrong, suggest checking `.github/workflows/metadata-governance.yml` is running.

### Scenario 3: "Help Me Prepare Metadata for a Release"

**User Question:** "We're about to release v2.0 (minor release). Is metadata ready?"

**Agent Response:**

1. **Validate Tier 1:**

   ```bash
   node scripts/automation/label-orchestrator.js validate --strict
   ```

2. **Check Blockers:**
   - All issues in v2.0 milestone have `type:*` labels? ✅
   - All PRs have changelog status? ✅
   - No issues in needs-triage? ✅

3. **Validate Tier 2:**

   ```bash
   node scripts/automation/label-orchestrator.js validate --warnings
   ```

4. **Check Warnings:**
   - 98% of issues have `priority:*` (good!)
   - All issues have `area:*` (good!)
   - One issue has `meta:stale` (should remove)

5. **Recommendation:** "✅ READY TO RELEASE. One minor thing: remove `meta:stale` from issue #5678."

6. **Handoff:** Once metadata is clean, Release Agent takes over orchestration.

**Escalation:** If Tier 1 blockers fail, suggest fixes and hold release until resolved.

### Scenario 4: "I Want to Redesign Our Label Taxonomy"

**User Question:** "Our labels are getting unwieldy. Can you help redesign them?"

**Agent Response:** "That's a Label Strategy question, which is outside my scope. I specialize in syncing and auditing labels. Let me call the Label Strategy Agent, who can help you design the optimal taxonomy."

**Handoff:** Transfer to Label Strategy Agent with context.

---

## Key Reference Points

### Phase 3-4 Files to Know

- `scripts/automation/label-orchestrator.js` — Main orchestrator entry point
- `scripts/automation/review-meta-labels.js` — Audit specific meta: labels
- `scripts/automation/sync-pr-labels.js` — Sync PR-related labels
- `scripts/automation/manage-stale-issues.js` — Handle stale marking
- `scripts/agents/includes/label-sync.js` — Core label sync logic
- `scripts/agents/includes/derive-project-fields.cjs` — Project field derivation
- `.github/workflows/meta-labels-sync.yml` — Daily sync workflow
- `.github/workflows/label-audit-report.yml` — Monthly audit workflow

### Phase 5A Integration Points

- Release Agent calls: `Metadata Agent.validate(release_type)`
- Expected response: Validation result with tiers, blockers, warnings
- Metadata Agent's job: Validate and recommend, not execute release

### Documentation Links

- Phase 3-4 guide: `docs/ISSUE_MAINTENANCE_SCRIPTS.md`
- CLI reference: `docs/LABEL_MANAGEMENT_CLI.md`
- Label strategy: `docs/LABEL_STRATEGY.md`
- Label taxonomy: `.github/labels.yml`

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
