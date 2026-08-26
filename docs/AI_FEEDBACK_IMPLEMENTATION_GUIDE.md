---
file_type: documentation
title: AI Feedback PR Review Implementation Guide
description: Team guide for implementing AI feedback review and validation system
version: 1.0.1
created_date: 2026-08-04T00:00:00.000Z
audience: LightSpeedWP Engineering Team
---

# AI Feedback PR Review Implementation Guide

This guide helps your team implement and use the AI feedback review validation system for consistent, transparent feedback tracking across all pull requests.

## What Is AI Feedback Review?

When AI tools (Claude, automated code analysis, etc.) provide feedback on your PR:

- **Feedback**: "Extract magic number to constant", "Add error handling", "Optimize this query"
- **Your Decision**: Address it, defer it, or reject it
- **Documentation**: Record your decision and rationale in the PR
- **Validation**: Automated workflow ensures all feedback is tracked

## When to Use This System

Use AI feedback validation for **all PRs** that:

- Contain changes reviewed by AI tools
- Are reviewed by Claude Code or other AI systems
- Receive automated code analysis feedback

**Exception:** Skip for automated dependency updates (Dependabot, Imgbot) — the system automatically excludes bot authors.

## 4-Step Implementation

### Step 1: Open PR with Issue Link

```markdown
## Related Issues

Resolves #456
```

**Why:** Ties your feedback responses to specific issues. Use `Resolves`, `Closes`, or `Relates to`.

---

### Step 2: Copy FEEDBACK_RESPONSE.md Template

```bash
# From your PR branch
cp .github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md ./FEEDBACK_RESPONSE.md

# Or manually create it
touch FEEDBACK_RESPONSE.md
```

Fill in:

- PR number
- Related issue(s)
- Summary of feedback received

---

### Step 3: Document Feedback Responses

For each piece of AI feedback, add a row to the table:

```markdown
| Feedback Item | Category | Status | Related Commit(s) | Notes |
|---|---|---|---|---|
| Extract magic number | code-quality | ✅ Addressed | abc123d | CONFIG_TIMEOUT constant |
| Add error handling | robustness | 📋 Deferred | #890 | Tracked in performance initiative |
```

**Status Meanings:**

| Status | Meaning | When to Use | Action |
|--------|---------|------------|--------|
| ✅ **Addressed** | Fixed in this PR | Feedback implemented | Include commit hash |
| 📋 **Deferred** | Valid, out of scope | For future work | Create issue, include issue # |
| ❌ **Rejected** | Doesn't apply | Not applicable to PR | Explain why briefly |

---

### Step 4: Commit & Push

```bash
git add FEEDBACK_RESPONSE.md
git commit -m "docs: document AI feedback responses for PR #456

- Addressed 3 feedback items
- Deferred 1 item to #890"

git push
```

**Workflow runs automatically** ✅

## Common Scenarios

### Scenario 1: All Feedback Addressed

```markdown
## Summary
All AI feedback reviewed and implemented.

| Fix null pointer | robustness | ✅ Addressed | abc123d | Guard clause |
| Add JSDoc | docs | ✅ Addressed | def456e | Function documentation |
| Optimize loop | performance | ✅ Addressed | ghi789f | Cache intermediate result |
```

**Workflow Result:** ✅ PASSES

---

### Scenario 2: Some Deferred

```markdown
## Summary
3 items addressed, 1 deferred to performance initiative.

| Refactor function | code-quality | ✅ Addressed | abc123d | Split into 2 focused functions |
| Add caching | performance | 📋 Deferred | #567 | Requires infrastructure |
```

**Workflow Result:** ✅ PASSES (if #567 exists)

---

### Scenario 3: Rejecting Feedback

```markdown
## Summary
Feedback reviewed; not applicable to this PR scope.

| Migrate to TypeScript | tooling | ❌ Rejected | — | Project not using TypeScript yet |
| Add logging everywhere | observability | ❌ Rejected | — | Function called 1000s times; overhead too high |
```

**Workflow Result:** ✅ PASSES

---

## Team Workflow Integration

### Before Opening PR

```
1. Develop feature branch
2. Get AI feedback (via Claude Code, tools, etc.)
3. Decide: address, defer, or reject each item
```

### Opening PR

```
1. Include issue link: "Resolves #123"
2. Copy FEEDBACK_RESPONSE.md template
3. Document all feedback decisions
4. Commit FEEDBACK_RESPONSE.md
```

### Workflow Validation

```
Workflow runs automatically on:
- PR opened
- PR edited
- Commits pushed

Shows as check on PR status:
✅ PASSED — Ready to merge
❌ FAILED — Fix and re-push
```

### Code Review

```
Reviewer checks:
- All feedback items have status
- Decisions are well-reasoned
- Commits implement what's described
- Approved ✅
```

### Merge

```
Once approved and all checks pass:
git merge (squash merge recommended)
→ PR closes
→ Branch auto-deleted
```

---

## Decision-Making Framework

### When to Address Feedback

**Address if:**

- Feedback improves code quality/safety
- Implementation is straightforward
- Fits within PR scope
- No major dependencies
- Team agrees it's good

**Example:**
> "Extract magic number to constant" — Low effort, clear value → Address ✅

---

### When to Defer Feedback

**Defer if:**

- Feedback is valid but large scope
- Requires infrastructure changes
- Depends on other work
- Performance optimization (not critical path)
- Separate initiative already tracked

**How:**

1. Create tracking issue (#890)
2. Document in FEEDBACK_RESPONSE.md
3. Reference issue in deferred row

**Example:**
> "Optimize algorithm from O(n²) to O(n log n)" — Large, strategic change → Defer to #890 📋

---

### When to Reject Feedback

**Reject if:**

- Doesn't apply to project
- Architectural decision differs
- Tool/library not adopted
- Risk outweighs benefit
- Already considered and decided

**How:**

1. Document in FEEDBACK_RESPONSE.md
2. Explain why clearly
3. Reference any related decisions

**Example:**
> "Use TypeScript for type safety" — Project not using TypeScript → Reject ❌

---

## Validation Workflow Checks

### ✅ What Passes

- PR links to issue(s): `Resolves #123`
- FEEDBACK_RESPONSE.md exists (recommended)
- All feedback items have status marker
- Addressed items reference commits
- Deferred items reference issues
- Rejected items explain why

### ⚠️ Warnings (Don't Block)

- FEEDBACK_RESPONSE.md missing
- Deferred items without issue reference

### ❌ What Fails

- No issue link in PR
- Invalid/malformed FEEDBACK_RESPONSE.md
- Invalid status markers
- Incomplete feedback tracking

**If workflow fails:**

1. Read the validation comment on PR
2. Fix the issue described
3. Commit and push again
4. Workflow re-runs automatically

---

## Team Best Practices

### 1. Make Decisions Early

Review feedback before committing FEEDBACK_RESPONSE.md.

```
Good: Decide → Document → Commit
Bad:  Commit → Decide → Update → Recommit
```

---

### 2. Explain Your Reasoning

Don't just mark status — explain why.

```markdown
# Good ✅
| Add caching | performance | 📋 Deferred | #567 | 
Caching requires database layer setup; tracked in performance initiative

# Not great
| Add caching | performance | 📋 Deferred | #567 | Later
```

---

### 3. Link Related Issues

For deferred items, always create or reference an issue.

```markdown
# Good ✅
| Optimize queries | performance | 📋 Deferred | #567 | Tracked in: #567 (Performance initiative)

# Missing
| Optimize queries | performance | 📋 Deferred | — | Will do later
```

---

### 4. Use Clear Feedback Descriptions

When documenting feedback, be specific.

```markdown
# Good ✅
| Split processData() into validateData() and transformData() | code-quality | ✅ Addressed | abc123d |

# Vague
| Refactor | code-quality | ✅ Addressed | abc123d |
```

---

### 5. Commit Referenced Changes

If feedback references a commit, ensure it's actually in the PR.

```bash
# Good: Commit exists and addresses feedback
git log --oneline | grep "abc123d"

# Not good: Referencing non-existent commit
```

---

## Troubleshooting

### Workflow Not Running?

**Check:**

1. Is the file `FEEDBACK_RESPONSE.md` committed?
2. Does PR description have issue link?
3. Is branch protected from running workflows?

**Fix:**

- Commit FEEDBACK_RESPONSE.md if missing
- Add `Resolves #123` to PR description
- Push changes to trigger workflow

---

### Validation Fails With "Invalid Status"?

**Issue:** Status marker not recognized

**Fix:** Use exactly:

- `✅ Addressed`
- `📋 Deferred`
- `❌ Rejected`

**Wrong:** ✔️ Fixed, ⏸️ Pending, ⚠️ Review

---

### "Deferred Item Missing Issue"?

**Issue:** Deferred feedback doesn't reference an issue

**Fix:**

1. Create GitHub issue for the work
2. Update FEEDBACK_RESPONSE.md with issue #
3. Commit and push

---

### Can't Copy Template?

**If command fails:**

```bash
# Try manual approach
touch FEEDBACK_RESPONSE.md

# Copy content from:
# .github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md
```

Or use GitHub's "Use this template" workflow.

---

## Examples

### Simple PR (3 feedback items)

See: [examples/FEEDBACK_RESPONSE_example-simple.md](../examples/FEEDBACK_RESPONSE_example-simple.md)

- Extract constant
- Add error handling
- Improve variable naming

All addressed ✅

---

### Complex PR (7 feedback items)

See: [examples/FEEDBACK_RESPONSE_example-complex.md](../examples/FEEDBACK_RESPONSE_example-complex.md)

- 4 items addressed
- 2 items deferred
- 1 item rejected

Mixed statuses with clear rationale.

---

## Resources

**Quick Start:**

- [Quick Reference](./QUICK_REFERENCE_AI_FEEDBACK.md) — 4 steps, TL;DR

**Comprehensive:**

- [AI Feedback Response Tracking Guide](./ai-feedback-response-tracking.md) — Full guide with examples and FAQ

**Technical:**

- [Workflow Details](./WORKFLOW_AI_FEEDBACK_VALIDATION.md) — Configuration and technical reference

**Implementation:**

- [Template](../PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md) — Copy into your PR
- [Examples](../examples/) — See what good looks like

---

## Team Training Checklist

- [ ] Read [Quick Reference](./QUICK_REFERENCE_AI_FEEDBACK.md) (5 min)
- [ ] Review simple example (5 min)
- [ ] Try creating FEEDBACK_RESPONSE.md in test PR (10 min)
- [ ] Review complex example (5 min)
- [ ] Ask questions about edge cases (10 min)
- [ ] First real PR using system (20 min)

**Total:** ~55 minutes to full adoption

---

## Support

**Questions?**

1. Check [Quick Reference](./QUICK_REFERENCE_AI_FEEDBACK.md)
2. Review examples in `examples/` folder
3. Read [Full Guide](./ai-feedback-response-tracking.md) FAQ
4. Open issue with `workflow` label

---

*Built for the LightSpeedWP .github control plane — 2026-08-04*

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
