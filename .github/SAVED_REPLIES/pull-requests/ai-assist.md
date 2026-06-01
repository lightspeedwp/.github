---
title: "AI-Assisted PR Saved Replies"
description: "Guidance on using Copilot, CodeRabbit, or other AI tools when drafting or reviewing PRs at LightSpeedWP."
category: "Pull Request"
labels:
  - status:needs-review
references:
  - "../../custom-instructions.md"
  - "../../PULL_REQUEST_TEMPLATE.md"
---

# AI-Assisted PR Saved Replies

## AI Assistance in PRs

**Use case**: PRs that mention use of Copilot/CodeRabbit or AI-generated changes/tests.

```markdown
Hi @username,

We noticed this PR was partially drafted or reviewed using AI tools (Copilot, CodeRabbit, etc.).

**Guidance:**

- Review all AI-generated code for accuracy, security, and alignment with [Coding Standards](../../instructions/coding-standards.instructions.md)
- Add/adjust tests for any generated logic
- Document any prompts or custom instructions in the PR body or comments as needed

AI can speed up work but always requires human review and accountability. Thanks for responsibly leveraging these tools!
```
