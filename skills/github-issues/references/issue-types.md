# Issue Types (Advanced GraphQL)

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Issue types (Bug, Feature, Task, Epic, etc.) are defined at the **organization** level and inherited by repositories. They categorize issues beyond labels.

For basic usage, the MCP tools handle issue types natively. Call `mcp__github__list_issue_types` to discover types, and pass `type: "Bug"` to `mcp__github__create_issue` or `mcp__github__update_issue`. This reference covers advanced GraphQL operations.

## GraphQL Feature Header

All GraphQL issue type operations require the `GraphQL-Features: issue_types` HTTP header.

## List types (org or repo level)

```graphql
# Header: GraphQL-Features: issue_types
{
  organization(login: "OWNER") {
    issueTypes(first: 20) {
      nodes { id name color description isEnabled }
    }
  }
}
```

Types can also be listed per-repo via `repository.issueTypes` or looked up by name via `repository.issueType(name: "Bug")`.

## Read an issue's type

```graphql
# Header: GraphQL-Features: issue_types
{
  repository(owner: "OWNER", name: "REPO") {
    issue(number: 123) {
      issueType { id name color }
    }
  }
}
```

## Set type on an existing issue

```graphql
# Header: GraphQL-Features: issue_types
mutation {
  updateIssueIssueType(input: {
    issueId: "ISSUE_NODE_ID"
    issueTypeId: "IT_xxx"
  }) {
    issue { id issueType { name } }
  }
}
```

## Create issue with type

```graphql
# Header: GraphQL-Features: issue_types
mutation {
  createIssue(input: {
    repositoryId: "REPO_NODE_ID"
    title: "Fix login bug"
    issueTypeId: "IT_xxx"
  }) {
    issue { id number issueType { name } }
  }
}
```

To clear the type, set `issueTypeId` to `null`.

## Available colors

`GRAY`, `BLUE`, `GREEN`, `YELLOW`, `ORANGE`, `RED`, `PINK`, `PURPLE`

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
