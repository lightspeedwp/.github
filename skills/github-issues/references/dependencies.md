# Issue Dependencies (Blocked By / Blocking)

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs%20Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling%20Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main%20Branch%20Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata%20Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template%20Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate%20PR%20Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges:%20Documentation%20Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges:%20Health%20Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges:%20README%20Status%20Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges:%20Workflow%20Inventory%20Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Dependencies let you mark that an issue is blocked by another issue. This creates a formal dependency relationship visible in the UI and trackable via API. No MCP tools exist for dependencies; use REST or GraphQL directly.

## Using REST API

**List issues blocking this issue:**

```
GET /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by
```

**Add a blocking dependency:**

```
POST /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by
Body: { "issue_id": 12345 }
```

The `issue_id` is the numeric issue **ID** (not the issue number).

**Remove a blocking dependency:**

```
DELETE /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by/{issue_id}
```

## Using GraphQL

**Read dependencies:**

```graphql
{
  repository(owner: "OWNER", name: "REPO") {
    issue(number: 123) {
      blockedBy(first: 10) { nodes { number title state } }
      blocking(first: 10) { nodes { number title state } }
      issueDependenciesSummary { blockedBy blocking totalBlockedBy totalBlocking }
    }
  }
}
```

**Add a dependency:**

```graphql
mutation {
  addBlockedBy(input: {
    issueId: "BLOCKED_ISSUE_NODE_ID"
    blockingIssueId: "BLOCKING_ISSUE_NODE_ID"
  }) {
    blockingIssue { number title }
  }
}
```

**Remove a dependency:**

```graphql
mutation {
  removeBlockedBy(input: {
    issueId: "BLOCKED_ISSUE_NODE_ID"
    blockingIssueId: "BLOCKING_ISSUE_NODE_ID"
  }) {
    blockingIssue { number title }
  }
}
```

## Tracked issues (read-only)

Task-list tracking relationships are available via GraphQL as read-only fields:

- `trackedIssues(first: N)` - issues tracked in this issue's task list
- `trackedInIssues(first: N)` - issues whose task lists reference this issue

These are set automatically when issues are referenced in task lists (`- [ ] #123`). There are no mutations to manage them.
