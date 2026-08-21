---
title: AI Feedback Response Tracking Guide
description: How to review, document, and respond to AI feedback in pull requests
category: workflow
last_updated: '2026-08-21'
---

# AI Feedback Response Tracking Guide

This guide explains how to ensure AI feedback is properly reviewed, considered, and tracked in your pull requests.

## Quick Start

### 1. Link Your PR to Issues

In your PR description, include issue references:

```markdown
## Related Issues

Resolves #456  
Relates to #789
```

**Valid keywords:**

- `Resolves` or `Closes` — issue will auto-close when PR merges
- `Fixes` or `Refs` — creates a link
- `Relates to` — adds context without closing

### 2. Create FEEDBACK_RESPONSE.md

Copy the template to your PR:

```bash
cp .github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md ./FEEDBACK_RESPONSE.md
```

### 3. Document All Feedback

For each piece of AI feedback, add a row to the feedback table:

| Feedback Item | Category | Status | Related Commit(s) | Notes |
|---|---|---|---|---|
| Extract magic number constant | code-quality | ✅ Addressed | abc123 | Constants defined at top of file |
| Add error handling | robustness | 📋 Deferred | — | See #890 for implementation |

### 4. Commit Your Changes

When committing changes that address feedback, reference it in the commit message:

```bash
git commit -m "refactor: extract magic numbers per AI feedback

- Define TIMEOUT_MS constant
- Improves code maintainability
- Addresses feedback on code-quality"
```

## Feedback Status Guide

### ✅ Addressed

Feedback that has been implemented in this PR.

**Requirements:**

- Include the feedback in `FEEDBACK_RESPONSE.md`
- Reference the commit(s) that implemented the change
- Explain what changed and why
- Link to the commit hash

**Example:**

```markdown
| Extract magic number to constant | code-quality | ✅ Addressed | abc123d | Now defined as CONFIG_TIMEOUT |
```

### 📋 Deferred

Feedback that's valid but outside the scope of this PR.

**Requirements:**

- Create a separate GitHub issue to track the work
- Link to that issue in `FEEDBACK_RESPONSE.md`
- Explain why it was deferred (timeline, scope, dependencies, etc.)
- Do NOT leave deferred items without a tracking issue

**Example:**

```markdown
| Add comprehensive error handling | robustness | 📋 Deferred | #890 | Requires refactoring error-handling layer (tracked in #890) |
```

### ❌ Rejected

Feedback that was reviewed and determined not to apply.

**Requirements:**

- Include in `FEEDBACK_RESPONSE.md` with clear rationale
- Explain why feedback was rejected
- Reference any constraints or design decisions

**Example:**

```markdown
| Use memoization for performance | performance | ❌ Rejected | — | Function called once per request; memoization overhead exceeds benefit |
```

## Workflow

### Step 1: Open PR with Issue Links

```markdown
## Related Issues
Resolves #456

## AI Feedback Review
- [ ] Feedback items documented in FEEDBACK_RESPONSE.md
- [ ] All feedback has been reviewed
- [ ] All feedback statuses assigned (✅, 📋, or ❌)
```

### Step 2: Review AI Feedback

When the workflow runs, it will check:

- ✅ PR links to at least one issue
- ✅ FEEDBACK_RESPONSE.md exists
- ✅ All feedback items have valid status
- ✅ Deferred items reference issues

### Step 3: Address Feedback

For each feedback item:

1. **Decide:** Will you address it, defer it, or reject it?
2. **Document:** Update `FEEDBACK_RESPONSE.md`
3. **Commit:** Make the change and reference the feedback
4. **Update:** Update the FEEDBACK_RESPONSE.md with commit reference

### Step 4: Review & Merge

Before merging:

- [ ] All feedback items have a status
- [ ] All `✅ Addressed` items reference commits
- [ ] All `📋 Deferred` items reference issues
- [ ] All `❌ Rejected` items have clear rationale
- [ ] FEEDBACK_RESPONSE.md is complete

---

## Examples

### Example 1: Addressing Code Quality Feedback

**Feedback received:**
> Consider refactoring the `processData()` function — it's doing too much.

**Process:**

1. Add to FEEDBACK_RESPONSE.md:

```markdown
| Refactor processData function | code-quality | ✅ Addressed | — | TBD |
```

1. Make the change:

```javascript
// Before
function processData(data) {
  // 50 lines of mixed logic
}

// After
function validateData(data) { /* ... */ }
function transformData(data) { /* ... */ }
function processData(data) {
  validateData(data);
  return transformData(data);
}
```

1. Commit:

```bash
git commit -m "refactor: split processData into focused functions

- Extract validation into validateData()
- Extract transformation into transformData()
- Improves readability and testability
- Addresses AI feedback on function responsibility"
```

1. Update FEEDBACK_RESPONSE.md:

```markdown
| Refactor processData function | code-quality | ✅ Addressed | abc123 | Split into validateData() and transformData() for clarity |
```

### Example 2: Deferring Performance Work

**Feedback received:**
> This algorithm is O(n²). Consider optimization for large datasets.

**Process:**

1. Create a GitHub issue: "Performance: Optimize data processing algorithm"
2. Add to FEEDBACK_RESPONSE.md:

```markdown
| Optimize O(n²) algorithm | performance | 📋 Deferred | #890 | Large optimization; requires benchmark setup (tracked in #890) |
```

1. No commit needed for deferred items.

### Example 3: Rejecting Inapplicable Feedback

**Feedback received:**
> Add logging on every function call for debugging.

**Process:**

1. Add to FEEDBACK_RESPONSE.md:

```markdown
| Add comprehensive logging | observability | ❌ Rejected | — | Function called 1000s times per second; logging overhead too high |
```

1. No code change needed.

---

## Validation Workflow

The **AI Feedback Validation** workflow automatically checks:

### ✅ Passes If

- PR links to at least one issue using `Resolves #123` or `Closes #123`
- All feedback items in FEEDBACK_RESPONSE.md have valid status markers (✅, 📋, ❌)
- Each `✅ Addressed` item references a commit
- Each `📋 Deferred` item references an issue
- FEEDBACK_RESPONSE.md includes feedback summary and resolution table

### ⚠️ Warns If

- FEEDBACK_RESPONSE.md is missing (recommended but not required for simple PRs)
- Deferred items exist but lack tracking issues (strongly discouraged)

### ❌ Fails If

- No issue links in PR description
- FEEDBACK_RESPONSE.md has structural problems
- Invalid status markers found
- Deferred feedback lacks issue reference

---

## Commit Message Best Practices

When committing changes that address AI feedback, follow this pattern:

```
{type}: {brief description} per feedback

- Specific change made
- Impact or benefit
- Related issue/feedback category

Addresses AI feedback on {category}
Related to #{ISSUE}
```

### Examples

```bash
# Simple fix
git commit -m "fix: handle null pointer exception

Addresses AI feedback on error-handling"
```

```bash
# Feature with multiple feedback items
git commit -m "feat: add request validation layer

- Validates input parameters
- Returns clear error messages
- Prevents invalid data downstream

Addresses AI feedback on robustness and documentation
Related to #456"
```

```bash
# Refactor with performance rationale
git commit -m "refactor: optimize query with indexed lookup

- Changed from O(n) linear search to O(1) hash lookup
- ~50ms improvement per request
- Addresses scalability concern

Addresses AI feedback on performance
Related to #789"
```

---

## FAQ

### Q: Do I need to address all AI feedback?

**A:** No. You can:

- ✅ **Address** it (implement the suggestion)
- 📋 **Defer** it (create an issue for future work)
- ❌ **Reject** it (explain why it doesn't apply)

All three are valid decisions. The key is documenting your decision.

### Q: What if I only have 1-2 feedback items?

**A:** Still use `FEEDBACK_RESPONSE.md`. It documents your decision-making, even for small PRs.

### Q: Can I defer multiple items to the same issue?

**A:** Yes. If several feedback items are related, they can all reference the same tracking issue:

```markdown
| Optimize algorithm | performance | 📋 Deferred | #890 | Tracked in performance initiative |
| Add caching layer | performance | 📋 Deferred | #890 | Tracked in performance initiative |
```

### Q: What if the PR only has feedback I'm rejecting?

**A:** Still document it:

```markdown
| Use TypeScript for type safety | tooling | ❌ Rejected | — | Project not using TypeScript yet |
```

### Q: Do I need to respond to every comment in the PR?

**A:** No — `FEEDBACK_RESPONSE.md` tracks AI feedback specifically. Respond to code review comments normally in PR threads.

### Q: What happens if I merge with incomplete feedback tracking?

**A:** The workflow will fail the check and prevent merge. You'll need to complete `FEEDBACK_RESPONSE.md` before merging.

---

## Related Resources

- [GitHub Actions Workflow: ai-feedback-validation.yml](./.github/workflows/ai-feedback-validation.yml)
- [Feedback Response Template](./.github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md)
- [PR Best Practices](./pull-requests.instructions.md)
- [Issue Linking Guide](./issues.instructions.md)

---

## Questions?

If you have questions about AI feedback response tracking:

1. Check the **Validation Workflow** output — it provides specific error messages
2. Review the **Examples** section above
3. Use the **Feedback Response Template** as a guide
4. See **FAQ** for common scenarios

For workflow bugs or feature requests, open an issue with the `workflow` label.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
