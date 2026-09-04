---
file_type: pr-template
name: "Audit"
about: "Conduct review, assessment, or compliance audit"
title: "audit: {scope}"
labels: ["type:audit", "status:needs-review", "priority:normal", "area:release", "meta:needs-changelog"]
recommended_issue_type: "type:audit"
---

# Audit Pull Request

> This repository enforces changelog, release, and label automation for all PRs and issues.  
> See the organisation-wide [Automation Governance & Release Strategy](https://github.com/lightspeedwp/.github/blob/HEAD/docs/AUTOMATION_GOVERNANCE.md) for contributor rules.

## Linked issues

Link this PR to the audit or compliance issue(s) it addresses:

- `Closes #123` — use for issues this PR resolves (auto-closes on merge)
- `Relates to #123` — for related but not directly resolved issues
- `Part of #456` — for PRs that are part of a larger audit initiative

Closes #

## Scope of Audit

What is being audited? (e.g., security, accessibility, performance, code quality)

## Findings Summary

High-level overview of audit results. Include:

- Key findings
- Severity assessment
- Recommended actions

## Detailed Findings

Comprehensive audit results with evidence, affected files/areas, and impact analysis.

## Changelog

<!--
Required for release automation.
Format: Keep a Changelog.
Categories: Added, Changed, Fixed, Removed.
User-facing notes only. Internal-only PRs may use the skip-changelog label.
-->

### Changed

- Audit completed: {description}

## Test plan

How was this audit verified?

- [ ] Audit criteria documented
- [ ] Findings validated
- [ ] Recommendations provided
- [ ] No changes needed (audit-only)

## Checklist

- [ ] Audit scope clearly defined
- [ ] All findings documented with evidence
- [ ] Recommendations are actionable
- [ ] No sensitive data exposed in findings
- [ ] Related issues linked above
- [ ] Changelog entry added (if changes made)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
