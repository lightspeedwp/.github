---
file_type: design-questions
title: Project Meta Sync Agent v2 — Key Design Questions & Best Practices
description: "Critical design decisions, integration patterns, and validation strategies for agent v2 modernization"
version: 1.0.0
created_date: 2026-08-12
---

# Key Design Questions & Best Practices

## Q1: Agent Scope — What Should the Agent Do vs. Delegate?

### The Question

The agent could operate at multiple levels:

**Option A: Thin orchestrator** (recommended)

- Agent explains workflows, scripts, and when to use each
- Agent can invoke workflows via CLI commands
- Agent delegates CLI operations to label-orchestrator.js
- Agent provides guidance, not execution

**Option B: Active executor**

- Agent directly calls GitHub API to update labels, types, milestones
- Agent makes decisions about which labels to apply
- Agent bypasses label-orchestrator.js, operates directly on GitHub

**Option C: Hybrid**

- Agent uses label-orchestrator.js for complex operations (audit, sync with --dry-run)
- Agent provides direct API calls for simple operations
- Agent handles human approval loops for risky changes

### Best Practice Answer

**Choose Option A (Thin orchestrator) for these reasons:**

1. **Reuse existing infrastructure** — label-orchestrator.js already does heavy lifting
2. **Safety** — All changes preview-able via --dry-run before applying
3. **Auditability** — Commands logged in workflow history, not hidden in agent reasoning
4. **Delegation clarity** — Users understand what agent is guiding vs. executing
5. **Phase 5A readiness** — Release Agent can call Metadata Agent, which calls orchestrator

**Implementation:**

```javascript
// Agent prompt should teach users to run:
node scripts/automation/label-orchestrator.js audit --all
node scripts/automation/label-orchestrator.js sync meta:has-pr --dry-run
node scripts/automation/label-orchestrator.js --interactive

// Not:
// [Agent directly modifying GitHub via API]
```

**Delegation Flow:**

```
User → Metadata Agent → label-orchestrator.js → GitHub API
                    ↓
              (Agent explains results)
```

---

## Q2: Label Taxonomy — How to Present 50+ Labels to Users?

### The Question

The organization has 50+ canonical labels across 5 families:

- `type:*` (12 labels: bug, feature, task, design, etc.)
- `status:*` (8 labels: needs-review, in-progress, done, etc.)
- `area:*` (12 labels: ci, docs, security, backend, frontend, etc.)
- `meta:*` (5 labels: needs-changelog, has-pr, stale, dependabot-security, etc.)
- `priority:*` (4 labels: critical, important, normal, low)

**Problem:** Users get overwhelmed by 50+ labels. How should agent present them?

**Option A: Full taxonomy reference**

- Agent prompt includes all 50+ labels with descriptions
- Comprehensive but verbose (200+ lines for taxonomy alone)
- Useful for advanced users, overwhelming for newcomers

**Option B: Contextual presentation**

- Agent learns user's context (issue type, area, etc.)
- Recommends 5-7 relevant labels, not all 50+
- Requires heuristics, may miss relevant labels

**Option C: Tiered approach**

- **Tier 1 (Essential):** 3-5 most common labels (type:, status:)
- **Tier 2 (Common):** area:, priority: based on context
- **Tier 3 (Advanced):** meta: labels for specific workflows
- Agent explains each tier as conversation progresses

**Option D: Delegated reference**

- Agent prompt includes `docs/LABEL_STRATEGY.md` reference
- Agent explains how to **find** relevant labels, not memorizes them
- User runs `grep` or agent queries `.github/labels.yml`

### Best Practice Answer

**Use Option C (Tiered) + Option D (Delegated reference) for these reasons:**

1. **Progressive disclosure** — New users learn Tier 1, advanced users discover Tier 2/3
2. **Scalability** — Taxonomy can grow without making agent prompt unwieldy
3. **Maintainability** — Canonical reference lives in `.github/labels.yml`, agent points to it
4. **User empowerment** — Users learn to navigate the taxonomy themselves
5. **Integration** — Phase 4 delivered label search + audit tools; agent teaches their use

**Implementation:**

```markdown
# Agent Prompt: Label Taxonomy

## Essential Labels (Tier 1)
Use these to classify every issue:

- `type:bug` — Reproducible defect
- `type:feature` — New capability
- `type:task` — Scoped work
- `status:needs-triage` — Waiting for review
- `status:done` — Completed

## Context-Aware Labels (Tier 2)
Choose based on your issue:

**If your issue relates to CI/testing:**
- `area:ci` — GitHub Actions, workflows, CI/CD
- `area:testing` — Unit tests, integration tests

**If your issue relates to infrastructure:**
- `area:build` — Build system, dependencies
- `area:performance` — Speed, resource usage

[Full taxonomy: see docs/LABEL_STRATEGY.md or run:]
node scripts/automation/label-orchestrator.js --list-taxonomy
```

---

## Q3: Workflow Integration — Which Workflows Should Agent Invoke?

### The Question

Three workflows exist for metadata:

1. **metadata-governance.yml** — Triggered on issue/PR events
   - Automatically syncs labels, types, milestones
   - User can trigger manually via GitHub Actions UI

2. **meta-labels-sync.yml** — Runs daily on schedule
   - Audits label coverage, applies stale labels
   - User can trigger manually via GitHub Actions UI

3. **label-audit-report.yml** — Runs monthly on schedule
   - Generates comprehensive audit report
   - User can trigger manually via GitHub Actions UI

**Question:** Should agent:

- **Option A:** Only explain what workflows do, not trigger them
- **Option B:** Trigger workflows via GitHub API (requires permissions)
- **Option C:** Guide users to trigger workflows manually via UI
- **Option D:** Prefer label-orchestrator.js for all user-facing operations

### Best Practice Answer

**Use Option D (prefer label-orchestrator.js) with Option A (explain workflows) for these reasons:**

1. **Consistency** — Single entry point (orchestrator) for all CLI operations
2. **Transparency** — Users see what commands are run, no hidden API calls
3. **Testability** — Orchestrator has unit tests, agent doesn't need to
4. **Maintainability** — Changes to orchestrator flow don't require agent prompt changes
5. **Safety** — All orchestrator commands support --dry-run before applying

**Implementation:**

```markdown
# Agent Prompt: When to Use Each Workflow

## For User-Facing Operations (Most Common)
Use label-orchestrator.js:
```bash
# Audit label coverage
node scripts/automation/label-orchestrator.js audit --all

# Sync PR labels (with preview)
node scripts/automation/label-orchestrator.js sync meta:has-pr --dry-run

# Interactive mode (review each change)
node scripts/automation/label-orchestrator.js --interactive
```

## For Scheduled Automation (No User Action Needed)

These workflows run automatically:

- **metadata-governance.yml** — Triggers on issue/PR events
  - Syncs labels, types, milestones automatically
  - No user action needed

- **meta-labels-sync.yml** — Runs daily
  - Audits coverage, applies stale labels
  - Results posted as GitHub Actions summary

- **label-audit-report.yml** — Runs monthly
  - Comprehensive audit report
  - Posted to Issues & PRs project board

## For Manual Workflow Triggering

If you want to run a workflow immediately (not waiting for schedule):

1. Go to GitHub Actions → [Workflow Name]
2. Click "Run workflow"
3. Choose branch (develop) and submit

**Agent note:** Prefer orchestrator (above) for most operations.

```

---

## Q4: Error Handling — How to Handle API Limits, Missing Data?

### The Question

Real-world scenarios where agent needs to handle errors gracefully:

1. **GitHub API rate limits** — Quota exceeded after 60 API calls
2. **Missing labels** — Label listed in OPENSPEC but not in `.github/labels.yml`
3. **Missing project fields** — Expected field doesn't exist in GitHub Project
4. **Ambiguous input** — User asks "sync labels" without specifying which ones
5. **Conflict resolution** — Agent recommends label; user has different opinion

### Best Practice Answer

**Error handling strategy:**

| Error | Detection | Recovery | Agent Guidance |
|-------|-----------|----------|---|
| **API rate limit** | GitHub error 403 | Wait 60 sec, retry | "GitHub API rate-limited. Waiting… Ready to retry." |
| **Missing label** | Label not in `.github/labels.yml` | Check canonical source | "Label not in canonical labels.yml. Did you mean `area:ci`?" |
| **Missing field** | GraphQL mutation fails | Run `derive-project-fields.cjs` | "Project field missing. Regenerating… Try again." |
| **Ambiguous input** | User says "sync" without target | Ask clarifying question | "Sync which labels? e.g., `meta:has-pr`, `type:*`, or all?" |
| **Conflict with user** | User rejects recommendation | Accept and pivot | "Understood. What would you prefer instead?" |

**Implementation in agent prompt:**

```markdown
# Error Handling

## If GitHub API Is Rate-Limited
"Your quota is exhausted. GitHub API limits to 60 requests/hour.
Wait ~60 seconds and I'll retry automatically."

## If a Label Isn't Found
"I don't recognize that label. Let me check the canonical list...
Did you mean one of these?"
[Show similar labels from .github/labels.yml]

## If a Project Field Is Missing
"The expected project field doesn't exist. Let me regenerate it..."
[Run: node scripts/agents/includes/derive-project-fields.cjs]
"Done! Try again."

## If Your Request Is Ambiguous
"I need clarification. Do you want to:
a) Sync a specific label (e.g., meta:has-pr)?
b) Sync all labels in a family (e.g., type:*)?
c) Run a full audit?"

## If I Recommend Something You Disagree With
"No problem. What would you prefer? I can:
a) Try a different approach
b) Show you the trade-offs
c) Defer to your judgment and apply your choice"
```

---

## Q5: Phase 5A Readiness — What Metadata Validation Does Release Agent Need?

### The Question

Phase 5A (Release Agentic Workflows) will call Metadata Agent as a pre-check before orchestrating releases. Release Agent needs to know:

- Is metadata clean enough to proceed with release?
- Which metadata issues would block a release?
- What's the recommended remediation?

**Decisions:**

1. **Validation gates** — What metadata must be valid before release?
2. **Severity levels** — What's a blocker vs. warning vs. info?
3. **Handoff contract** — What does Release Agent expect from Metadata Agent?
4. **Remediation flow** — If validation fails, who fixes it (Release Agent or user)?

### Best Practice Answer

**Release metadata validation framework:**

**Tier 1 (Must Pass — Blockers)**

```
- All PRs have meta:needs-changelog or meta:skip-changelog
- No issues with status:needs-triage (triage must be complete)
- No conflicting type:* labels (each issue has exactly one)
```

**Tier 2 (Should Pass — Warnings)**

```
- 95%+ of issues have priority:* label
- All issues in milestone have area:* label
- No issues with both type:bug AND type:feature
```

**Tier 3 (Nice to Have — Info)**

```
- No stale meta:* labels (e.g., meta:stale on closed issues)
- All deprecated labels removed
- Project fields in sync with labels
```

**Implementation (agent prompt handoff section):**

```markdown
# Handoff to Release Agent (Phase 5A)

When Release Agent asks to validate metadata for a release:

## 1. Check Tier 1 Blockers
Run: node scripts/automation/label-orchestrator.js validate --strict

If any fail:
- BLOCK the release
- Tell user which issues to fix
- Show remediation steps

## 2. Check Tier 2 Warnings
Run: node scripts/automation/label-orchestrator.js validate --warnings

If any fail:
- WARN the release maintainer
- Offer to auto-fix or proceed with warnings

## 3. Return Validation Result to Release Agent
{
  "status": "pass" | "fail" | "warn",
  "blockers": [ { issue: 123, reason: "...", fix: "..." } ],
  "warnings": [ { issue: 456, reason: "...", fix: "..." } ],
  "info": [ ... ],
  "recommendation": "proceed" | "fix_first" | "user_review"
}
```

**Metadata requirements for each release type:**

| Release Type | Metadata Requirements | Validation Strictness |
|---|---|---|
| **Patch** | Tier 1 only | --strict (auto-approve if pass) |
| **Minor** | Tier 1 + Tier 2 | --warnings (human review required) |
| **Major** | Tier 1 + Tier 2 + audit | --full (2+ maintainers review) |

---

## Q6: Documentation & Discovery — How Will Users Find the Agent?

### The Question

Once the agent is live, how will users know it exists and what it can do?

**Options:**

A. **Self-discovery** — Agent is available in Copilot; users find it organically
B. **Guided discovery** — Link from README, CONTRIBUTING.md, docs
C. **Active promotion** — Announce in team channels, documentation
D. **Integration discovery** — Users encounter agent when using related tools

### Best Practice Answer

**Use all four for maximum discoverability:**

1. **Self-discovery** — Agent available in Copilot (built-in)
2. **Guided discovery** in key docs:
   - `CONTRIBUTING.md` — "Use Metadata Agent to keep labels in sync"
   - `docs/ISSUE_MAINTENANCE_SCRIPTS.md` — Link to agent
   - `docs/LABEL_MANAGEMENT_CLI.md` — "Learn more from Metadata Agent"
3. **Integration discovery** — When user runs orchestrator, show hint:

   ```bash
   # At end of label-orchestrator output:
   Need guidance? Ask the Metadata Agent: @lightspeed-metadata-agent
   ```

4. **Documentation** — Create `.github/agents/project-meta-sync-README.md`:

   ```markdown
   # Project Meta Sync Agent
   
   Ask me about:
   - "My labels are inconsistent"
   - "How do I sync project fields?"
   - "Prepare for release"
   - "Show me the label taxonomy"
   ```

---

## Q7: Testing & Validation — How to Know the Agent Works?

### The Question

Success for agent v2 requires validation with real scenarios. What should we test?

### Best Practice Answer

**Validation scenarios (3 core + 3 advanced):**

**Core Scenarios (Must Work):**

1. **"My issue labels are inconsistent. What should I do?"**
   - Agent runs audit
   - Shows 3-5 misapplied labels
   - Presents options: auto-fix, review, dry-run
   - User chooses option
   - Agent executes and reports changes

2. **"How do I sync project fields?"**
   - Agent explains what project fields are
   - Shows derive-project-fields.cjs command
   - Runs derivation
   - Validates results
   - Confirms sync complete

3. **"Help me prepare metadata for a release"**
   - Agent runs Tier 1 + Tier 2 validation
   - Shows any blockers or warnings
   - Recommends fixes
   - Offers to apply fixes or guide user

**Advanced Scenarios (Should Work):**

1. "Explain the label taxonomy"
   - Agent teaches Tier 1 labels
   - Explains when to use Tier 2
   - Points to full reference

2. "I want to redesign our label strategy"
   - Agent recognizes out-of-scope request
   - Hands off to Label Strategy Agent
   - Provides context for handoff

3. "Apply `area:ci` to all CI-related issues"
   - Agent runs heuristic-based audit
   - Shows which issues would get label
   - Asks for confirmation
   - Applies via orchestrator

**Test acceptance criteria:**

- [ ] Agent understands user intent
- [ ] Agent provides 2-3 options (not just one)
- [ ] Agent explains risks/trade-offs
- [ ] User can understand and approve each step
- [ ] Results match expected outcome
- [ ] Handoff to other agents works smoothly

---

## Summary: Best Practices Checklist

- [ ] **Q1: Scope** — Agent is thin orchestrator, not direct executor
- [ ] **Q2: Labels** — Use tiered approach + delegate to `.github/labels.yml`
- [ ] **Q3: Workflows** — Prefer label-orchestrator.js, explain scheduled workflows
- [ ] **Q4: Errors** — All errors have graceful recovery + user guidance
- [ ] **Q5: Phase 5A** — Agent returns validation result for Release Agent to consume
- [ ] **Q6: Discovery** — Users can find agent through multiple channels
- [ ] **Q7: Validation** — All core scenarios tested before PR merge

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
