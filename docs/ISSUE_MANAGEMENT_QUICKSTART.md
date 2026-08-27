---
document_type: "Guide"
title: "Issue Management Quick-Start Guide"
description: "5-minute guide to get started with the Issue Management Orchestration system — creating issues, understanding labels, tracking progress, and common tasks."
version: "1.0"
created_date: "2026-08-27"
last_updated: "2026-08-27"
authors:
  - Claude Code
  - LightSpeed Team
openspec_status: "production"
openspec_labels:
  - "openspec:status/production"
  - "openspec:domain/automation"
  - "openspec:priority/high"
---

# Issue Management Quick-Start Guide

**Get up and running with the Issue Management system in 5 minutes.**

---

## What Is This System?

The **Issue Management Orchestration** system automatically analyzes, labels, and enriches GitHub issues to ensure consistency and clarity. When you create an issue, the system:

1. **Detects the issue type** (bug, feature, documentation, etc.)
2. **Applies consistent labels** (type, status, priority, area)
3. **Adds structured sections** (acceptance criteria, testing notes)
4. **Validates quality** (7 automated checks)
5. **Posts a summary comment** with metrics

**Key benefit:** Your issues are automatically organized and ready for team work without manual setup.

---

## Creating Issues (30 seconds)

### Step 1: Go to Issues Tab
Navigate to the repository's **Issues** tab and click **New Issue**.

### Step 2: Write a Clear Title
```
✅ Good: "Login button broken on iOS Safari"
❌ Vague: "Something is wrong with login"
```

### Step 3: Write a Detailed Description
Include **what**, **why**, and **how to reproduce**:

```markdown
## What's happening?
Can't log in on iOS Safari browser. Error appears: "invalid token"

## Steps to reproduce
1. Open Safari on iOS
2. Navigate to login page
3. Enter credentials
4. Click login

## Expected behavior
User is logged in and redirected to dashboard

## Actual behavior
Error message: "invalid token" appears
Page does not redirect
```

### Step 4: Submit
Click **Submit new issue**. The system will:
- Automatically detect: **bug** (high confidence)
- Apply labels: `type:bug`, `status:needs-triage`, `priority:high`
- Add enrichment sections (reproduction template, testing notes)
- Post a workflow summary comment

**Result:** Your issue is now labeled, structured, and ready for triage. ✅

---

## Understanding Labels (2 minutes)

Labels organize your work automatically. Here's what each type means:

### Type Labels (`type:*`)
| Label | Meaning | When to Use |
|-------|---------|------------|
| `type:bug` | Reproducible defect | Something broken |
| `type:feature` | New capability | New functionality |
| `type:documentation` | Docs update | Docs, README, guides |
| `type:task` | Scoped work | Small defined items |
| `type:security` | Security issue | Vulnerabilities |

### Status Labels (`status:*`)
| Label | Meaning | What It Means |
|-------|---------|---------------|
| `status:needs-triage` | Waiting for review | New issues start here |
| `status:ready` | Ready to start | Scoped and detailed |
| `status:in-progress` | Someone working | Actively being done |
| `status:blocked` | Waiting on something | Can't proceed yet |
| `status:closed` | Work complete | Issue resolved |

### Priority Labels (`priority:*`)
| Label | Meaning | Response Time |
|-------|---------|---------------|
| `priority:critical` | Blocks all work | Fix immediately |
| `priority:high` | Important | Fix within 1-2 days |
| `priority:medium` | Important but not urgent | Fix within 1 week |
| `priority:low` | Nice to have | Fix when possible |

### Other Labels
- **`openspec:*`** — Governance and compliance labels
- **`area:*`** — Product area (frontend, backend, docs, etc.)
- **`platform:*`** — Affected platforms (iOS, web, desktop, etc.)
- **`needs-clarification`** — Issue is too vague; needs more details

---

## Common Tasks (1-2 minutes each)

### Task: Find issues by type

**Find all bugs:**
```
is:issue type:bug is:open
```

**Find all features in triage:**
```
is:issue type:feature status:needs-triage
```

**Find high-priority items:**
```
is:issue priority:critical,high is:open
```

Use these filters in GitHub's **Issues** tab search.

---

### Task: Track issue progress

**Check an issue's status:**
1. Open the issue
2. Look at the labels section (right side panel)
3. Find the `status:*` label — it tells you where it is

**Status flow:**
```
needs-triage → ready → in-progress → closed
```

---

### Task: Move an issue forward

**When you start work:**
1. Click **Add a label** (right panel)
2. Change `status:needs-triage` → `status:in-progress`
3. Assign the issue to yourself

**When work is done:**
1. Remove `status:in-progress` label
2. Add a `status:closed` label (or click **Close issue**)
3. Add a comment explaining what was done

---

### Task: View metrics and reports

The Issue Management system generates:

- **Per-issue reports** — Posted as comments on the issue
- **Daily summaries** — Generated at 08:00 UTC
- **Reports folder** — `.github/reports/issue-management/`

**To view an issue report:**
1. Open the issue
2. Scroll to workflow comments (usually at the top)
3. Look for "Issue Management Workflow Summary" comment
4. See metrics: labels applied, sections added, validation status

---

## Troubleshooting FAQ

### Q: Why wasn't my issue labeled?

**A:** The system needs a clear title and body to detect the type confidently.

**Solution:** Provide:
- ✅ Clear, specific title (at least 5 words)
- ✅ Detailed body (at least 20 characters)
- ✅ Context about what and why

If confidence is low, you'll see a `needs-clarification` label. Edit the issue to add more detail.

---

### Q: How do I change a label that was applied?

**A:** You can override any label manually.

**Steps:**
1. Open the issue
2. Click the labels section (right panel)
3. Remove the label you don't want (click the X)
4. Add the correct label

**Note:** If the workflow detects a conflict (e.g., both `type:bug` and `type:feature`), it will log the conflict and keep the original label. Manual overrides are allowed and respected.

---

### Q: Where are the workflow logs?

**A:** In GitHub Actions:

1. Go to **Actions** tab
2. Find **"Issue Management Orchestration"** workflow
3. Click the most recent run
4. Click **issue-management-...** job to see logs

---

### Q: Can I run the workflow manually?

**A:** Yes! Use GitHub CLI or the UI:

**Via UI:**
1. Go to **Actions** tab
2. Click **"Issue Management Orchestration"**
3. Click **"Run workflow"** button
4. Optional: Specify issue number or action

**Via CLI:**
```bash
# Run on all issues
gh workflow run issue-management-orchestration.yml

# Run on specific issue
gh workflow run issue-management-orchestration.yml -f issue_number=123

# Run only validation
gh workflow run issue-management-orchestration.yml -f action=validate
```

---

### Q: What if enrichment sections aren't added?

**A:** The system only adds enrichment if it's confident about the issue type (confidence ≥ 80%).

**Solutions:**
- **For low-confidence issues:** Clarify the title and body with more details
- **Check the confidence score:** Look for `needs-clarification` label
- **Manual workaround:** Add the sections yourself (copy from the templates in `.github/ISSUE_TEMPLATE/`)

---

## Links to Detailed Documentation

**New to this system?**
- [Architecture Overview](./ARCHITECTURE.md) — How the system works (technical details)
- [Issue Triage Guide](./ISSUE_TRIAGE.md) — Manual issue template application
- [Label Inventory](./LABEL_INVENTORY.md) — Complete list of all 158 labels

**Setting up or administering?**
- [Script Registry](../scripts/SCRIPT-REGISTRY.md) — Available automation scripts
- [Label Governance Policy](./LABEL_GOVERNANCE_POLICY.md) — Label rules and conventions
- [Workflow Documentation](../.github/workflows/issue-management-orchestration.yml) — Workflow YAML details

**Working with agents?**
- [Issues Agent Guide](./.github/agents/issues.agent.md) — Agent behavior and decision-making
- [Agent Architecture](./docs/agents/AGENT_ARCHITECTURE.md) — How agents work together

---

## Key Takeaways

✅ **Create clear issues** with good titles and detailed descriptions  
✅ **Trust the labels** the system applies (usually accurate)  
✅ **Update status labels** as work progresses  
✅ **Use filters** to find issues (type:bug, status:ready, priority:high)  
✅ **Check workflow comments** for metrics and status  

---

## Get Help

- **Issue labels not applied?** → Edit the issue to add more detail
- **Workflow not running?** → Check GitHub Actions tab for errors
- **Want to understand the system?** → Read the [Architecture Overview](./ARCHITECTURE.md)
- **Need advanced info?** → Check [ISSUE_TRIAGE.md](./ISSUE_TRIAGE.md) and [LABEL_INVENTORY.md](./LABEL_INVENTORY.md)

---

**Version:** 1.0  
**Last Updated:** 2026-08-27  
**Status:** Production Ready  
**Related:** [Architecture Overview](./ARCHITECTURE.md) | [Label Inventory](./LABEL_INVENTORY.md) | [Issue Triage](./ISSUE_TRIAGE.md)
