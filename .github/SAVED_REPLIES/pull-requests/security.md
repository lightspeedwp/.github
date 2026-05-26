---
title: "Security Concerns Saved Replies"
description: "Security-related feedback and vulnerability remediation guidance."
category: "Pull Request"
---

# Security Concerns Saved Replies

## Security Review Required

**Use case**: When a PR introduces security-sensitive changes.

```markdown
Hi @username,

Thank you for your contribution! Since this PR touches security-sensitive areas (input validation, auth, secrets, etc.), we'll need to do a security review before merging.

**Checklist:**

- [ ] Validate and sanitise all untrusted input
- [ ] Escape output for the correct rendering context
- [ ] Enforce nonce and capability checks for privileged actions
- [ ] Avoid exposing secrets or sensitive data
- [ ] Add or update security tests if appropriate

**Resources:**

- [PR Security Baseline](../../instructions/pull-requests.instructions.md#6-pr-review--lifecycle)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

If you have questions about security best practices, please ask!
```

## Security Vulnerability Identified

**Use case**: When a vulnerability is discovered in the PR.

```markdown
Hi @username,

Thank you for your PR. We've identified a potential security vulnerability in the proposed changes.

**What to Address:**

- Ensure no secrets or credentials are exposed
- Validate and sanitise untrusted input
- Escape output for the correct rendering context
- Add nonce/capability checks where privileged actions are involved
- Avoid command injection, directory traversal, or similar risks

Once these concerns are addressed, let us know so we can proceed with merging.
```
