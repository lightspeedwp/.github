---
file_type: pr-template
name: "Security"
about: "Address security vulnerability or implement security hardening"
title: "security: {scope}"
labels: ["type:security", "status:needs-review", "priority:critical"]
---

# Security Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/HEAD/docs/AUTOMATION_GOVERNANCE.md) for contributor rules.

## Security Advisory

**⚠️ SECURITY ISSUE:** Briefly describe the vulnerability or security concern addressed.

## Vulnerability Details

- **Type:** (e.g., XSS, SQL Injection, CSRF, Authentication bypass, etc.)
- **Severity:** (Critical / High / Medium / Low)
- **Affected Versions:**
- **CVE/Reference:** (if applicable)

## Root Cause Analysis

Explanation of how the vulnerability exists and why it's a security risk.

## Solution

Describe the security fix or hardening measure implemented. Include:

- What was changed and why
- How the fix mitigates the vulnerability
- Any security best practices applied

## Testing

How was this security fix validated?

- [ ] Security fix verified on all affected components
- [ ] Automated security tests added/updated
- [ ] Manual security testing completed
- [ ] No regression in existing security controls

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs may use the skip-changelog label.
-->

### Fixed

- Security: {description}

## Linked Issues

Link to related security issues:

Closes #

## Checklist

- [ ] Security fix is complete and tested
- [ ] No sensitive data exposed in PR
- [ ] No hardcoded secrets or credentials
- [ ] OWASP Top 10 vulnerabilities addressed
- [ ] Security testing completed
- [ ] Related issues linked above
- [ ] Changelog entry added

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
