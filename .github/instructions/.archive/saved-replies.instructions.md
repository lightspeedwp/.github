---
file_type: "instructions"
title: "Saved Replies Usage Instructions"
description: "How to use, maintain, and extend GitHub Saved Replies for issues and pull requests in LightSpeedWP projects."
version: "1.0"
last_updated: "2025-10-23"
owners:
  - "lightspeedwp/maintainers"
tags: ["saved replies", "instructions", "automation", "github"]
file_type: "instructions"
---

# Saved Replies Usage Instructions

Saved replies are reusable, pre-written responses for common GitHub interactions.  
LightSpeedWP maintains a comprehensive library of saved replies for issues, pull requests, triage, and review, kept in the `.github/SAVED_REPLIES/` directory.

---

## 1. Where to Find Saved Replies

- All saved replies live in `.github/SAVED_REPLIES/`.
- Pull request replies: `.github/SAVED_REPLIES/pull-requests/`
- Issue replies: `.github/SAVED_REPLIES/issues/`
- Additional folders can be added for other categories (e.g., discussions).

---

## 2. How to Use Saved Replies

### A. In the GitHub Web UI

1. Go to any issue or pull request comment box.
2. Click the **speech bubble icon** ("Insert a saved reply") at the bottom right.
3. Select the appropriate reply from the dropdown.
4. Edit to personalize if needed, then submit.

### B. Copy-Paste from Repo

- Navigate to the relevant file in `.github/SAVED_REPLIES/`.
- Copy the markdown snippet and paste into your comment.

### C. Automation / Bots

- Workflows and bots can reference saved replies for standardized feedback on CI, labeling, or PR events.

---

## 3. How to Add or Update Saved Replies

1. Add or edit `.md` files in the appropriate folder, following the frontmatter conventions (`title`, `description`, `category`, etc.).
2. Use meaningful filenames (e.g., `needs-qa.md`, `changelog-required.md`).
3. PR your changes and reference them in the PR description.
4. Keep replies concise, actionable, and up-to-date with org standards.

---

## 4. Best Practices

- **Always personalize** with the username, PR/issue context, and any specifics before posting.
- **Do not overuse**—combine with human feedback as needed.
- **Update** saved replies if process or policy changes.
- **Reference** org docs (e.g., CONTRIBUTING.md, coding standards) in replies where relevant.

---

## 5. Discovering Saved Replies

- Browse `.github/SAVED_REPLIES/` or use the web UI dropdown.
- See the [Saved Replies Index](../SAVED_REPLIES.md) for a searchable list.

---

## 6. Example

```markdown
Hi @username,

This PR is missing one or more required labels for automation and release.  
See our [PR Label Reference](../../PR_LABELS.md) for label meanings.
```

---

**For more, see:**

- [Saved Replies Index](../SAVED_REPLIES.md)
- [Contribution Guidelines](../CONTRIBUTING.md)
- [Custom Instructions](../custom-instructions.md)

---
