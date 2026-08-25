---
title: Bug Report Saved Replies
description: Standard responses for bug report processing, triage, and resolution. Follows LightSpeedWP issue templates, triage, and automation standards.
category: Issue Management
labels:
  - status:needs-triage
---

# Bug Report Saved Replies

## Need More Information

**Use case**: When a bug report lacks sufficient detail for reproduction or analysis.

```markdown
Hi @username,

Thank you for reporting this issue! To help us investigate and resolve the problem efficiently, please provide the following:

**Environment:**

- Operating system and version
- Shell version (`bash --version`)
- Script/app version or commit hash
- Any custom configuration (redact sensitive data)

**Reproduction steps:**

- The exact command or workflow you ran
- Arguments, options, and environment variables used
- Expected vs actual behavior
- Full error output/logs

**Context:**

- Does this always happen, or only in some cases?
- Any recent changes to your environment or setup?
- Have you found any workarounds?

Once we have this information, we can proceed with triage and resolution.

**References:**

- [Issue Templates & Triage Guide](../../ISSUE_LABELS.md)
- [Contribution Guidelines](../../CONTRIBUTING.md)
```

## Confirmed Bug – Investigation Started

**Use case**: Acknowledging a valid bug report and confirming investigation has begun.

```markdown
Hi @username,

Thank you for the detailed bug report! We've reproduced the issue and have started investigating.

**Status:**

- ✅ Confirmed in our test environment
- 🔍 Root cause analysis underway
- 🗂️ Added to our priority board ([how we triage](../../ISSUE_LABELS.md))

We'll update this issue as we progress. If you have more context or edge cases, please share them here.

Thank you for helping us improve our codebase!
```

## Request for Testing

**Use case**: Asking the reporter to test a proposed fix.

```markdown
Hi @username,

We've prepared a fix for this issue and would appreciate your help testing it.

**To test:**

1. [Instructions to pull/checkout the fix branch or build]
2. Run your original scenario and any edge cases
3. Report:
   - ✅/❌ Whether the fix resolves your issue
   - Any side effects or regressions
   - Your OS/environment details

**Related branch/version:**

- Branch: `fix/issue-{issue-number}`
- Commit: `{commit-hash}`

Thank you for validating before we merge!
```

## Bug Fixed – Resolution

**Use case**: Confirming a bug has been fixed.

```markdown
Hi @username,

Great news! This issue has been resolved and the fix is now available.

**Details:**

- **Root cause:** [brief explanation]
- **Fix:** [summary]
- **Testing:** Verified with your and additional scenarios

**Availability:**

- ✅ Merged to `main`
- 🏷️ Will be included in next release (`vX.Y.Z`)

You can confirm the fix by updating to the latest version. Thanks for reporting and helping us improve!

This issue will be closed as resolved. Please reopen or comment if the problem persists.
```

## Cannot Reproduce

**Use case**: When the team cannot reproduce the reported issue.

```markdown
Hi @username,

Thanks for your report. We could not reproduce the issue using your steps.

**Our environment:**

- OS: [details]
- Version: [details]
- Config: [details]

**What we tried:**

- [Steps and variations]

**Next steps:**

- Please confirm if the issue persists with the latest code
- Provide any additional reproduction steps, logs, or screenshots

If we can't reproduce with more details, we may close this issue. We're here to help you troubleshoot!
```

## Duplicate Issue

**Use case**: When a reported issue is a duplicate of another.

```markdown
Hi @username,

Thank you for reporting this. This appears to be a duplicate of #{existing-issue-number} ([see here](link-to-issue)).

**Why we consolidate:**

- Avoids splitting discussion and fixes
- Keeps all context and updates in one place

Please follow the linked issue for updates. If your scenario adds new context, comment there so it’s considered!

Closing this as a duplicate. Your report is still valuable and helps confirm this is a priority.
```

## Wontfix / By Design

**Use case**: When a reported "bug" is by design or will not be changed.

```markdown
Hi @username,

Thanks for your suggestion. After review, this behavior is by design and aligns with our standards or product goals.

**Reasoning:**

- [Security, compatibility, performance, architecture, etc.]

**Alternatives:**

- [List workarounds, config options, or documentation]

**References:**

- [Design/Architecture Docs](link)
- [Documentation](link)

We appreciate your feedback and will consider it for future planning. If you believe this should be reconsidered, open a new feature request with details and use cases.
```

## Security Vulnerability Report

**Use case**: When a bug report describes a security vulnerability.

```markdown
Hi @username,

Thank you for your responsible disclosure of a potential security issue.

**Important:**

- Do NOT discuss security details in public issues
- Please report details privately to [security@lightspeedwp.com](mailto:security@lightspeedwp.com)

Our security team will triage and follow up quickly. Public updates will be made once a fix is ready.

Thank you for helping keep our project secure.
```

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
