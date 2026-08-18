# 🎉 NEW FEATURE: Automatic Milestone Allocation Now Live!

**Announcement Date:** 2026-08-24  
**Related Issue:** [#1765](https://github.com/lightspeedwp/.github/issues/1765)  
**Feature Status:** ✅ PRODUCTION READY

---

## What's New?

We've deployed **automatic allocation of merged PRs and closed issues** to project milestones in the `.github` repository.

### What It Does

✅ **Automatically allocates merged PRs** to the "current" active milestone  
✅ **Automatically allocates closed issues** to the same milestone  
✅ **Detects linked issues** (Closes #123, Resolves #456) and allocates them too  
✅ **Runs on every PR merge and issue close** — no action needed from you!

### How It Works

1. A PR is merged → Workflow triggers automatically
2. Script finds the "current" active milestone (earliest due date)
3. PR + any linked issues get allocated to that milestone
4. Confirmation comment posted on the PR/issue
5. Done! No more manual milestone management

### Example

You merge a PR with this in the description:
```
This PR fixes the critical auth bug.

Closes #1885
Resolves #1886
```

**Result:**
- PR automatically allocated to v1.5.0 milestone
- Issue #1885 automatically allocated to v1.5.0 milestone
- Issue #1886 automatically allocated to v1.5.0 milestone
- Confirmation comments appear on all 3 items

---

## 📚 Documentation

We've created comprehensive documentation to help you:

### [RUNBOOK.md](../../.github/projects/active/pr-issue-milestone-allocation-2026-08-11/RUNBOOK.md)
**Step-by-step operations guide** — How to use the script manually

- Quick Start (automatic operation explained)
- Manual Operations (dry-run, live, custom options)
- Milestone Selection Algorithm (with examples)
- Linked Issue Allocation (pattern detection)
- 7 Troubleshooting Scenarios
- Monitoring & Health Checks
- Best Practices

### [FAQ.md](../../.github/projects/active/pr-issue-milestone-allocation-2026-08-11/FAQ.md)
**52 Q&A pairs covering everything**

- General Questions (11)
- Milestone Selection (6)
- Linked Issues (7)
- Dry-Run & Testing (3)
- Troubleshooting (10)
- Workflow & Automation (3)
- Performance & Rate Limits (4)
- Best Practices (2)
- Integration & APIs (2)

### [QUICK-REFERENCE.md](../../.github/projects/active/pr-issue-milestone-allocation-2026-08-11/QUICK-REFERENCE.md)
**Quick command reference** — One-page cheat sheet

---

## ⚡ Key Features

| Feature | Details |
|---------|---------|
| **Automatic** | Runs on every PR merge and issue close |
| **Transparent** | No config needed, works out of the box |
| **Reliable** | 30-second timeout, exponential backoff retries |
| **Smart** | Detects linked issues automatically |
| **Safe** | Dry-run mode for testing without changes |
| **Fast** | Typical run time: 5-10 seconds |
| **Robust** | Rate limit protection, error handling |

---

## 🔧 Advanced Options

For power users, the script supports:

```bash
# Dry-run (preview without changes)
node allocate-to-milestone.js --dry-run --verbose

# Look back 30 days instead of 7
node allocate-to-milestone.js --days 30

# Force allocation to specific milestone
node allocate-to-milestone.js --milestone 42
```

See [RUNBOOK.md](../../.github/projects/active/pr-issue-milestone-allocation-2026-08-11/RUNBOOK.md) for complete usage guide.

---

## ❓ Questions?

1. **Quick question?** → Check [FAQ.md](../../.github/projects/active/pr-issue-milestone-allocation-2026-08-11/FAQ.md) (52 Q&A pairs!)
2. **How do I use it?** → See [RUNBOOK.md](../../.github/projects/active/pr-issue-milestone-allocation-2026-08-11/RUNBOOK.md)
3. **Command reference?** → [QUICK-REFERENCE.md](../../.github/projects/active/pr-issue-milestone-allocation-2026-08-11/QUICK-REFERENCE.md)
4. **Still stuck?** → Open an issue in [#1765](https://github.com/lightspeedwp/.github/issues/1765)

---

## 🎯 What You Need to Know

### For Most Users: Nothing!

✅ **The feature works automatically** — no setup needed  
✅ **No action required** — just merge PRs normally  
✅ **No disruption** — it just allocates milestones in the background  
✅ **Manual override always works** — if wrong, just change it manually  

### For Release Managers

- Ensure milestone due dates are current
- Check that "current" milestone is selected correctly
- Monitor GitHub Actions for any errors (see below)

### For DevOps / Maintainers

- Monitor: [GitHub Actions → Allocate PR/Issue to Current Milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
- Target: ≥95% allocation success rate
- First 48 hours: Watch closely for errors
- Phase 4 (Aug 26+): Ongoing monitoring & maintenance

---

## 🚀 Getting Started

**Nothing to do!** The feature is live and working.

Next time you:
1. **Merge a PR** → Workflow runs automatically, milestone allocated
2. **Close an issue** → Workflow runs automatically, milestone allocated
3. **Link issues** in PR description (Closes #123) → All items allocated together

That's it. You're done.

---

## 📊 Expected Behavior

### Automatic Workflow Run
```
Your PR merged
    ↓
Workflow triggered (within 1-2 minutes)
    ↓
Script finds "current" milestone
    ↓
PR + linked issues allocated
    ↓
Confirmation comment posted
    ↓
✅ Done! No action needed
```

### Example Comment
```
✅ Allocated to milestone #42 "v1.5.0"

This PR and 2 linked issue(s) have been allocated:
- #1950 (PR) → v1.5.0
- #1885 (Issue) → v1.5.0
- #1886 (Issue) → v1.5.0

Learn more: https://github.com/lightspeedwp/.github/issues/1765
```

---

## 🔍 Monitoring

### Where to Check

**GitHub Actions:**
1. Go to [Actions](https://github.com/lightspeedwp/.github/actions)
2. Find "Allocate PR/Issue to Current Milestone"
3. Watch for recent runs
4. Check logs if any failures occur

**PR/Issue Comments:**
1. Merge a PR
2. Look for confirmation comment (usually within 2 minutes)
3. Verify milestone assigned correctly

### Success Metrics (First 48 Hours)

- ✅ ≥95% allocation success rate
- ✅ <5% error rate
- ✅ All confirmation comments appear
- ✅ Typical run time: 5-10 seconds
- ✅ No critical errors in workflow logs

---

## 📞 Support & Feedback

**Have feedback?** Please comment on [#1765](https://github.com/lightspeedwp/.github/issues/1765)

We're tracking:
- What's working well
- Edge cases you encounter
- Suggestions for improvements
- Any issues or errors

Your feedback helps us improve Phase 4 (Monitoring & Maintenance).

---

## 🎓 Optional: 30-Minute Training Session

**Want to learn more?** (Optional)

We're offering a 30-minute training session covering:
- How the feature works under the hood
- Dry-run mode and testing
- Troubleshooting common issues
- Advanced options and customization
- Q&A

DM me if interested!

---

## 📅 Timeline

- **2026-08-11 to 2026-08-13** — Phase 1: Specification
- **2026-08-14 to 2026-08-20** — Phase 2: Implementation (PR #1905) ✅
- **2026-08-21 to 2026-08-25** — Phase 3: Refinement & Rollout (TODAY!) ✅
- **2026-08-26 onwards** — Phase 4: Monitoring & Maintenance ⏳

---

## 🎉 Thank You!

This feature is the result of weeks of planning, implementation, testing, and documentation.

**Special thanks to:**
- DevOps team for feedback and testing
- QA team for comprehensive test coverage
- Release managers for feature requirements
- Everyone who will use and provide feedback!

---

**Let's make milestone management easier. Enjoy!** 🚀

---

**Questions?** Check [FAQ.md](../../.github/projects/active/pr-issue-milestone-allocation-2026-08-11/FAQ.md) or ask in [#1765](https://github.com/lightspeedwp/.github/issues/1765)

**Learn more:** [Project Documentation](../../.github/projects/active/pr-issue-milestone-allocation-2026-08-11/)
