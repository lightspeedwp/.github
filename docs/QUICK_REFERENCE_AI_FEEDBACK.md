# AI Feedback Response — Quick Reference

**TL;DR:** Link your PR to issues, document feedback responses, assign status (✅/📋/❌), and merge!

---

## The 4 Steps

### 1️⃣ Link to Issues

In your PR description:

```markdown
Resolves #456
```

**Keywords:** `Resolves`, `Closes`, `Fixes`, `Relates to`

---

### 2️⃣ Copy Template

```bash
cp .github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md ./FEEDBACK_RESPONSE.md
```

---

### 3️⃣ Document Feedback

Add each feedback item to the table:

| Feedback | Category | Status | Commit | Notes |
|---|---|---|---|---|
| Extract constant | code-quality | ✅ Addressed | abc123 | CONFIG_TIMEOUT |

**Status Values:**

- ✅ `Addressed` — Fixed in this PR (include commit)
- 📋 `Deferred` — Valid but out of scope (include issue #)
- ❌ `Rejected` — Not applicable (include rationale)

---

### 4️⃣ Commit & Push

```bash
git add FEEDBACK_RESPONSE.md
git commit -m "docs: document AI feedback responses"
git push
```

**Workflow runs automatically** ✅

---

## Status Meanings

### ✅ Addressed

```markdown
| Extract magic number | code-quality | ✅ Addressed | abc123d | Now defined as TIMEOUT_MS |
```

**What you did:**

- Implemented the feedback
- Committed the change
- Referenced the commit hash

---

### 📋 Deferred

```markdown
| Add caching layer | performance | 📋 Deferred | #567 | Requires infrastructure setup |
```

**What you did:**

- Created a GitHub issue (#567)
- Added to `FEEDBACK_RESPONSE.md`
- Explained why deferred

---

### ❌ Rejected

```markdown
| Use TypeScript | tooling | ❌ Rejected | — | Project not yet using TypeScript |
```

**What you did:**

- Added to `FEEDBACK_RESPONSE.md`
- Explained why it doesn't apply

---

## Common Scenarios

### Scenario 1: All Feedback Addressed

```markdown
## Summary
All AI feedback has been reviewed and addressed.

| Extract constant | code-quality | ✅ Addressed | abc123d | Now TIMEOUT_MS |
| Add tests | testing | ✅ Addressed | def456e | 5 new unit tests |
```

✅ **Workflow:** PASSES

---

### Scenario 2: Some Deferred

```markdown
## Summary
2 addressed, 1 deferred to performance initiative.

| Refactor function | code-quality | ✅ Addressed | abc123d | Split into two functions |
| Optimize algorithm | performance | 📋 Deferred | #567 | Tracked in performance initiative |
```

✅ **Workflow:** PASSES (if #567 exists)

---

### Scenario 3: None Addressed (All Rejected)

```markdown
## Summary
Feedback reviewed; determined not applicable in this context.

| Use memoization | performance | ❌ Rejected | — | Called once per request; no benefit |
```

✅ **Workflow:** PASSES

---

## Common Issues

### ❌ "No issue link found"

**Fix:** Add to PR description:

```markdown
Resolves #456
```

---

### ❌ "Invalid status marker"

**Fix:** Use only: `✅ Addressed`, `📋 Deferred`, `❌ Rejected`

**Don't use:** ✔️ Fixed, ⏸️ Pending, ⚠️ Review

---

### ⚠️ "Deferred feedback missing issue"

**Fix:** Create issue #567, then update table:

```markdown
| Add caching | performance | 📋 Deferred | #567 | Infrastructure setup |
```

---

### ❌ "FEEDBACK_RESPONSE.md format invalid"

**Fix:** Use the template from `.github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md`

---

## Validation Checklist

Before pushing, verify:

- [ ] PR description has issue link: `Resolves #123`
- [ ] FEEDBACK_RESPONSE.md exists (copy from template)
- [ ] All feedback items in the table
- [ ] Each item has status: ✅, 📋, or ❌
- [ ] ✅ items reference a commit (short hash or full)
- [ ] 📋 items reference an issue (#567)
- [ ] ❌ items include rationale (short explanation)

---

## Commit Message Example

```bash
git commit -m "refactor: extract magic numbers per AI feedback

- Define TIMEOUT_MS constant
- Addresses code quality feedback
- Related to #456"
```

---

## Need Help?

📚 **Full Guide:** `docs/ai-feedback-response-tracking.md`

📋 **Examples:**

- Simple: `.github/examples/FEEDBACK_RESPONSE_example-simple.md`
- Complex: `.github/examples/FEEDBACK_RESPONSE_example-complex.md`

🔧 **Workflow Details:** `.github/WORKFLOW_AI_FEEDBACK_VALIDATION.md`

---

## Workflow Status Icons

| Icon | Meaning | Action |
|---|---|---|
| ✅ | All checks passed | Ready to merge |
| ❌ | Validation failed | Fix and re-push |
| ⏳ | Running | Wait for completion |
| ⚠️ | Warning only | Review but doesn't block |

---

## Key Files

```
.github/
├── workflows/
│   └── ai-feedback-validation.yml          ← Main workflow
├── PULL_REQUEST_TEMPLATE/
│   └── FEEDBACK_RESPONSE.md                ← Template to copy
├── examples/
│   ├── FEEDBACK_RESPONSE_example-simple.md
│   └── FEEDBACK_RESPONSE_example-complex.md
├── WORKFLOW_AI_FEEDBACK_VALIDATION.md      ← Workflow documentation
└── QUICK_REFERENCE_AI_FEEDBACK.md          ← This file

docs/
└── ai-feedback-response-tracking.md        ← Full guide

scripts/validation/
└── ai-feedback-helpers.cjs                 ← Validation logic
```

---

**Ready to submit? Follow the 4 steps above! 🚀**
