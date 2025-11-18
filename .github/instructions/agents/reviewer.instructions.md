---
title: "Reviewer Agent Instructions"
description: "Instructions for Reviewer Agent: Automated PR review summaries, CI status, and guidance."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["lightspeedwp/maintainers"]
tags: ["agents", "reviewer", "instructions", "pr", "automation"]
file_type: "instructions"
---

# Reviewer Agent Instructions

## Mission

Automate Pull Request (PR) review summaries to standardize feedback, reduce reviewer workload, and ensure key checks (CI, changelog) are visible and actionable.

## Process

- Triggered by PR open, update, or CI completion ([reviewer.yml](../../workflows/reviewer.yml)).
- Analyze PR metadata, CI status, and file changes.
- Post/update a summary comment with:
  - CI status (success/warning/failure)
  - Required files present (e.g., changelog)
  - Recommendations/blockers for next steps
- Only one summary comment per PR (update, don’t duplicate).

## What It Checks

- CI status on latest commit.
- Presence of changelog for code changes.
- Key files touched (src/, docs/, config).
- Human-actionable blockers (missing changelog, failing CI).

## Best Practices

- Keep feedback concise/actionable.
- Do not block merges unless configured.
- Always log and update, never duplicate, reviewer comments.
- Support dry-run/testing for local dev.

## Guardrails

- Never output sensitive information.
- Never spam PRs with duplicate comments.
- Must be configurable per repo/project.

## Outputs

- PR review summary comment (markdown).
- Actionable recommendations for contributors/reviewers.
- Logs for audit and debugging.

## References

- [Reviewer Agent Spec](../../agents/reviewer.agent.md)
- [Workflows Instructions](../workflows.instructions.md)
- [Automation Governance](../../AUTOMATION_GOVERNANCE.md)

---