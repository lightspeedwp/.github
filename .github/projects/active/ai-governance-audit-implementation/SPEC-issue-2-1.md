---
openspec_version: "1.0"
type: "issue"
issue_type: "task"
title: "build/ci: Create PR template resolver GitHub Action"
labels: ["type:build", "area:ci", "priority:high"]
milestone: "v1.1"
assignee: null
linked_issue: null
---

# Create PR Template Resolver GitHub Action

## Problem

PR template assignment in `.github/PULL_REQUEST_TEMPLATE/config.yml` is **branch-prefix-only**. When a PR is created from a `claude/*` or `copilot/*` branch (which happens despite governance rules), the template routing fails silently and defaults to `pr_feature.md`.

**Audit Finding:** PR template routing map doesn't include `claude/` or `copilot/` routes, and there's no fallback mechanism to resolve template via linked issue type.

**Impact:** Wrong PR template assigned. User must manually reassign. This breaks validation workflows and creates manual work.

## Solution

Create GitHub Action `.github/workflows/pr-template-resolver.yml` that:

1. **Triggers on:** `pull_request` events (opened, synchronize)
2. **Detects problematic branches:** If branch is `claude/*` or `copilot/*`, proceed
3. **Queries linked issue:** Via GitHub API, get linked issue ID
4. **Extracts type information:**
   - Check issue's `type` field (custom field if available)
   - Check issue's `type:*` labels
   - Fallback to PR's `type:*` labels
   - Fallback to PR description (scan for type indicators)
5. **Determines correct template:** Map type to correct template from config.yml (bug→pr_bug.md, etc.)
6. **Comments on PR:**
   ```markdown
   ⚠️ **Branch Naming Issue**
   
   This PR's branch name `claude/x` doesn't follow the standard pattern.
   Standard pattern: `{type}/{scope}-{title}` (e.g., `feat/something`, `fix/bug-name`)
   
   Based on linked issue type, the correct template should be: **{template_name}**
   
   No action required — this is informational. Future PRs should use the correct branch name.
   
   See [Branching Strategy](../docs/BRANCHING_STRATEGY.md) for more info.
   ```
7. **(Optional) Auto-assign template:** If GitHub supports template reassignment via API, attempt it

## Implementation Notes

- Use `github.event.pull_request.head.ref` to get branch name
- Use `github.event.pull_request.linked_issues` or query GitHub API for linked issue
- Query issue's type field and labels via GitHub API GraphQL
- Map issue type → correct template using config.yml mapping
- Handle edge cases: no linked issue, no type info available
- Comment should be non-blocking (warning only, PR can still merge)

## Definition of Done

- [ ] Workflow file `.github/workflows/pr-template-resolver.yml` created
- [ ] Triggers on PR opened/synchronize
- [ ] Detects `claude/*` and `copilot/*` branches
- [ ] Queries linked issue via GitHub API
- [ ] Extracts type information (field, label, PR label fallback)
- [ ] Maps type to correct template
- [ ] Comments on PR with recommendation
- [ ] Handles missing linked issue gracefully
- [ ] Tested with real PR from `claude/*` branch
- [ ] No errors in workflow logs
- [ ] PR merged

## Test Scenarios

1. **Test with `claude/feature-x` branch, linked issue has `type:bug`**
   - Expected: Comment recommends `pr_bug.md`

2. **Test with `copilot/feature-x` branch, linked issue has `type:feature` label**
   - Expected: Comment recommends `pr_feature.md`

3. **Test with `claude/feature-x` branch, NO linked issue**
   - Expected: Comment notes missing link, recommends default template

4. **Test with correct `feat/feature-x` branch**
   - Expected: No comment (workflow skips)

## Related Issues

- Issue 1.4 — Update PR template config (dependency: config must be ready)
- Issue 2.2 — Title normalization script (independent; similar concept)
- Issue 3.1 — PR-issue linking enforcement (dependency: linking must exist)

## Related Documentation

- `.github/PULL_REQUEST_TEMPLATE/config.yml` — Template routing map
- `.github/PULL_REQUEST_TEMPLATE/` — Available templates
- `.github/instructions/branch-naming.instructions.md` — Why branch naming matters

## Audit References

**Source:** Phase 1-2 Governance Audit Report, section 3  
**Finding:** No fallback template routing for `claude/*` or `copilot/*` branches  
**Impact:** Wrong template silently assigned; no warning to user
