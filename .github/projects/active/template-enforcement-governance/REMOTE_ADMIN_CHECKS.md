---
title: "Template Enforcement Governance Remote/Admin Follow-Up"
description: "Small follow-up task for org-settings and branch-protection checks that require GitHub admin access."
file_type: "documentation"
version: "1.0.1"
last_updated: "2026-06-08"
created_date: "2026-06-08"
authors: ["github-copilot"]
maintainer: "LightSpeed Team"
status: active
---

# Remote/Admin Follow-Up

## Objective

Complete the two repository checks that cannot be verified from the local
workspace.

## Scope

- Verify the two missing issue types are enabled in GitHub organisation settings.
- Verify branch protection uses the expected template-validation status check.

## Out of Scope

- Any further template file edits.
- Any workflow redesign beyond status-check name verification.
- Any new issue-template or PR-template routing changes.

## Acceptance Criteria

- [ ] Organisation settings show the full issue-type set, including Help and User Experience Feedback.
- [ ] Branch protection references the expected validation check for template enforcement.
- [ ] Closeout docs can be updated to reflect admin verification.

## Dependencies

- GitHub organisation admin access.
- Repository settings access for branch protection.

## Next Step

Run the admin verification once access is available, then move this follow-up into the completed archive.
