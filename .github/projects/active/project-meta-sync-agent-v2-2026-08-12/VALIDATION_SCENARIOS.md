---
file_type: test-plan
title: Project Meta Sync Agent v2 — Validation Scenarios & Test Cases
description: "Acceptance criteria and test cases for agent v2 validation"
version: 1.0.0
created_date: 2026-08-12
---

# Validation Scenarios & Acceptance Criteria

## Core Scenario 1: Label Inconsistency Audit

**User Ask:** "My issue labels are inconsistent. What should I do?"

### Execution Steps

1. Agent runs audit

   ```bash
   node scripts/automation/label-orchestrator.js audit --all
   ```

2. Agent interprets results
3. Agent presents options: auto, interactive, dry-run
4. User selects one
5. Agent executes and summarizes

### Acceptance Criteria

- [ ] Agent understands user's intent (label audit)
- [ ] Agent runs correct orchestrator command (audit --all)
- [ ] Agent explains findings clearly (X issues missing labels, Y coverage %)
- [ ] Agent presents exactly 3 options (auto, interactive, dry-run)
- [ ] Each option has clear description of trade-offs
- [ ] User can select option without confusion
- [ ] Selected command executes successfully
- [ ] Results are summarized clearly (issues fixed, coverage increase)
- [ ] Agent offers next steps ("Need more help?" / "Validate again?")

### Sample Output

```
You asked about inconsistent labels. Let me audit your repository...

Audit Complete! Here's what I found:

📊 Overall Coverage
- Total issues: 487
- Labeled: 412 (84%)
- Unlabeled: 75 (16%)

By Label Family:
- type:*      ✅ 100% (487/487)
- status:*    ⚠️  70% (340/487)
- area:*      ⚠️  61% (298/487)
- meta:*      ⚠️  30% (145/487)
- priority:*  ⚠️  45% (219/487)

Issues Needing Attention:
- 147 issues missing status:* label
- 189 issues missing area:* label
- 12 issues with meta:has-pr but no linked PR

What would you like to do?

Option A: Auto-fix (fastest)
→ Apply changes with confidence > 0.95
→ Takes ~30 seconds
→ Risk: Some issues might get wrong labels
→ Command: node scripts/automation/label-orchestrator.js apply --auto --confidence 0.95

Option B: Interactive (safest)
→ Review each change before applying
→ Takes ~10 minutes for your repo size
→ Risk: More time investment
→ Command: node scripts/automation/label-orchestrator.js --interactive

Option C: Dry-run (preview only)
→ See what would change without applying
→ Takes ~1 minute
→ Risk: No changes applied (preview only)
→ Command: node scripts/automation/label-orchestrator.js apply --dry-run

Which would you prefer? (A/B/C or describe a different approach)
```

---

## Core Scenario 2: Project Field Synchronization

**User Ask:** "How do I sync project fields?"

### Execution Steps

1. Agent explains what project fields are
2. Agent shows derive-project-fields command
3. Agent runs derivation
4. Agent validates results
5. Agent confirms sync complete

### Acceptance Criteria

- [ ] Agent explains project fields clearly (derived from labels)
- [ ] Agent identifies correct script to run (derive-project-fields.cjs)
- [ ] Agent shows the exact command user would run
- [ ] Agent executes derivation without errors
- [ ] Agent validates results (before/after comparison)
- [ ] Agent confirms number of fields updated
- [ ] Agent suggests next validation step (re-run audit)
- [ ] Response is clear enough user could reproduce without agent

### Sample Output

```
Project fields are custom columns in your GitHub Project board.
They're automatically derived from issue labels, milestones, and types.

Examples:
- "Type" field → derived from type:* labels
- "Area" field → derived from area:* labels
- "Priority" field → derived from priority:* labels
- "Version" field → derived from milestones

Let me regenerate your project fields to sync them with the latest labels...

Running: node scripts/agents/includes/derive-project-fields.cjs

✅ Project fields regenerated
- Updated 487 issues
- 3 custom fields synchronized
- 0 errors

Your project board should now reflect the current label state.
Want me to validate that everything matches?
```

---

## Core Scenario 3: Release Metadata Validation

**User Ask:** "Help me prepare metadata for a release"

### Execution Steps

1. Agent asks what release type (patch/minor/major)
2. Agent validates Tier 1 blockers
3. Agent validates Tier 2 warnings (if minor/major)
4. Agent summarizes result
5. Agent recommends next step

### Acceptance Criteria

- [ ] Agent asks release type if not specified
- [ ] Agent validates correct tier for release type
- [ ] Tier 1: All blockers identified (must pass)
- [ ] Tier 2: All warnings identified (should pass)
- [ ] Agent shows clear pass/fail for each check
- [ ] Agent explains what each failure means
- [ ] Agent provides specific fix for each failure
- [ ] Agent recommends action: proceed / fix first / user review
- [ ] Response includes confidence level
- [ ] Agent offers to help with fixes if needed

### Sample Output

```
What type of release are you planning? (patch/minor/major)
> minor

Validating metadata for a minor release...

Tier 1: Blockers (Must Pass ✅)
- [ ] All issues in milestone have type:* label ✅ PASS (487/487)
- [ ] No conflicting labels ✅ PASS (0 conflicts)
- [ ] All PRs have changelog status ✅ PASS (23/23)
- [ ] No issues in needs-triage ✅ PASS (0 issues)

Tier 2: Warnings (Should Pass 🟡)
- [ ] 95%+ of issues have priority:* ⚠️  WARN (98% = 477/487)
- [ ] All issues have area:* ✅ PASS (100% = 487/487)
- [ ] No stale meta:* labels ✅ PASS (0 stale)

Validation Result: ✅ READY TO RELEASE

Recommendation: PROCEED WITH REVIEW
- All blockers pass (100%)
- Minor warning: 10 issues missing priority:* (not critical)
- These can be addressed post-release or user can fix now

Next: Once metadata is approved, Release Agent will handle release orchestration.

Want me to help fix the priority issues before release?
```

---

## Advanced Scenario 4: Label Taxonomy Discovery

**User Ask:** "Explain the label taxonomy"

### Acceptance Criteria

- [ ] Agent teaches Tier 1 (essential) labels first
- [ ] Agent explains WHEN to use each essential label
- [ ] Agent offers to explain Tier 2 if user interested
- [ ] Agent shows how to find full taxonomy
- [ ] Agent links to docs/LABEL_STRATEGY.md
- [ ] User leaves understanding basic structure

### Sample Output

```
Our repository uses a **prefixed label taxonomy** to keep 300+ labels organized.

Essential Labels (Tier 1) — Use these for every issue:

1. **type:** — What kind of work is this?
   - type:bug — Reproducible defect
   - type:feature — New capability
   - type:task — Scoped work
   - type:documentation — Docs/content
   → Every issue needs exactly ONE type:* label

2. **status:** — Where is this in its lifecycle?
   - status:needs-triage — Waiting for review
   - status:in-progress — Being worked on
   - status:blocked — Waiting on something
   - status:done — Completed
   → Choose the current status

Common Labels (Tier 2) — Choose based on your issue:

3. **area:** — What part of the system?
   - area:ci — GitHub Actions, CI/CD
   - area:docs — Documentation
   - area:backend — Server-side code
   → Pick the most relevant area

4. **priority:** — How urgent?
   - priority:critical — Blocks release
   - priority:important — High priority
   - priority:normal — Normal work
   - priority:low — Nice to have

Advanced Labels (Tier 3) — For specific workflows:

5. **meta:** — Metadata for automation
   - meta:needs-changelog — Needs entry
   - meta:has-pr — Linked to PR
   - meta:stale — No recent activity

Full taxonomy reference:
📖 docs/LABEL_STRATEGY.md
🔍 .github/labels.yml (canonical source)
⚙️  node scripts/automation/label-orchestrator.js --list-taxonomy

Want me to explain a specific label family in more detail?
```

---

## Advanced Scenario 5: Handoff to Label Strategy Agent

**User Ask:** "I want to redesign our label taxonomy"

### Acceptance Criteria

- [ ] Agent recognizes request is out-of-scope
- [ ] Agent clearly explains why (not metadata sync, it's label strategy)
- [ ] Agent offers handoff to Label Strategy Agent
- [ ] Agent provides context for handoff (current state, goals)
- [ ] Handoff is smooth (user can continue in new conversation)

### Sample Output

```
That's a great question, but it's outside my specialty. I focus on
**syncing and auditing** existing labels. You're asking about **designing**
the label taxonomy, which is a different kind of work.

Let me connect you with the Label Strategy Agent, who specializes in:
- Analyzing current label usage
- Identifying redundant or conflicting labels
- Proposing new taxonomy structures
- Planning label migrations

I'll hand off with this context:
- Current taxonomy: 57 labels across 5 families (type, status, area, meta, priority)
- Pain point: Users confused by overlapping area:* labels
- Goal: Simplify while keeping current automation working

Ready to talk to the Label Strategy Agent? (Y/N)
```

---

## Error Scenario 1: GitHub API Rate Limit

**Scenario:** Agent hits API rate limit during operation

### Acceptance Criteria

- [ ] Error is detected and caught gracefully
- [ ] User is informed: "API rate limited, waiting..."
- [ ] Agent waits ~60 seconds and retries
- [ ] Retry succeeds or fails with clear message
- [ ] No user data is lost
- [ ] User can resume operation after recovery

### Sample Output

```
Running label sync...

⚠️  GitHub API rate limited (60 requests/hour exceeded)
Waiting for quota reset (next 58 seconds)...
⏳ 58s... 30s... 5s...

✅ Quota reset! Resuming operation...

Label sync complete.
- Synced 23 labels
- 0 errors
```

---

## Error Scenario 2: Missing Label

**Scenario:** User asks to apply a label that doesn't exist

### Acceptance Criteria

- [ ] Agent detects label not in `.github/labels.yml`
- [ ] Agent suggests similar labels
- [ ] Agent clarifies if label needs to be created first
- [ ] Operation stops; user is asked to clarify
- [ ] No partial/broken state

### Sample Output

```
I don't recognize the label "area:networking".

Did you mean one of these?
- area:backend (server-side code)
- area:frontend (client-side code)
- area:performance (speed/latency)

Or if "area:networking" is a new label you want to create,
let me know and I can guide you through the creation process.

Which would you prefer?
```

---

## Error Scenario 3: Ambiguous Input

**Scenario:** User asks "sync labels" without specifying which ones

### Acceptance Criteria

- [ ] Agent detects ambiguity
- [ ] Agent asks clarifying question
- [ ] Agent provides options
- [ ] User can select option clearly
- [ ] No assumption made

### Sample Output

```
I can help sync labels! Just need to know which ones.

Would you like to:

A) Sync a specific label
   → Example: meta:has-pr based on linked PRs
   → Just tell me which label

B) Sync an entire label family
   → Example: all type:* labels
   → I'll infer from issue titles and content

C) Run a full audit
   → I'll find ALL labels that need syncing
   → Most comprehensive but takes longer

D) Something else?
   → Describe what you need

Pick one: (A/B/C/D)
```

---

## Validation Execution Plan

### Pre-PR Testing Checklist

Before submitting the PR, test agent prompt with:

- [ ] Scenario 1 (audit) — Works end-to-end
- [ ] Scenario 2 (sync) — Works end-to-end
- [ ] Scenario 3 (release) — Works end-to-end
- [ ] Scenario 4 (discovery) — Works end-to-end
- [ ] Scenario 5 (handoff) — Works end-to-end
- [ ] Error 1 (API limit) — Handled gracefully
- [ ] Error 2 (missing label) — Handled gracefully
- [ ] Error 3 (ambiguous input) — Handled gracefully

### Testing Methodology

1. **Load agent prompt** into Copilot or test environment
2. **Run each scenario** — copy exact user ask from this document
3. **Evaluate against acceptance criteria** — does agent meet all criteria?
4. **Document results** — pass/fail for each scenario
5. **Fix issues** — update agent prompt if acceptance criteria unmet
6. **Re-test** — verify fixes work
7. **Sign off** — confirm all scenarios pass

### Sign-Off Template

```
## Validation Results

**Tester:** [name]
**Date:** 2026-08-XX
**Agent Prompt Version:** 1.0

### Core Scenarios
- [ ] Scenario 1 (audit) — PASS
- [ ] Scenario 2 (sync) — PASS
- [ ] Scenario 3 (release) — PASS
- [ ] Scenario 4 (discovery) — PASS
- [ ] Scenario 5 (handoff) — PASS

### Error Scenarios
- [ ] Error 1 (rate limit) — PASS
- [ ] Error 2 (missing label) — PASS
- [ ] Error 3 (ambiguous input) — PASS

### Issues Found & Fixed
[List any issues found during testing and how they were fixed]

### Final Recommendation
APPROVED / APPROVED WITH COMMENTS / NEEDS REWORK

Tester: [signature]
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
