# Labels API Reference

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Reference for GitHub Labels REST API endpoints used in the label migration flow.

## List Labels in a Repository

```
GET /repos/{owner}/{repo}/labels
```

Returns all labels defined on a repository. Paginated (max 100 per page).

**CLI shortcut:**

```bash
gh label list -R {owner}/{repo} --limit 1000 --json name,color,description
```

**Response fields:** `id`, `node_id`, `url`, `name`, `description`, `color`, `default`.

## List Issues by Label

```
GET /repos/{owner}/{repo}/issues?labels={label_name}&state=all&per_page=100
```

Returns issues (and pull requests) matching the label. Filter out PRs by checking `pull_request` field is absent.

**CLI shortcut:**

```bash
gh issue list -R {owner}/{repo} --label "{label_name}" --state all \
  --json number,title,labels --limit 1000
```

The `gh issue list` command automatically excludes PRs.

**Pagination:** use `--limit` in CLI or `page` query param in REST. For repos with >1000 matching issues, use cursor-based pagination via Link headers.

## Remove a Label from an Issue

```
DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{label_name}
```

Removes a single label from an issue. Returns `200 OK` with the remaining labels on the issue.

**Important:** URL-encode label names with spaces or special characters:

- `good first issue` → `good%20first%20issue`
- `bug/critical` → `bug%2Fcritical`

**CLI shortcut:**

```bash
gh api /repos/{owner}/{repo}/issues/{number}/labels/{label_name} -X DELETE
```

## Add a Label to an Issue

```
POST /repos/{owner}/{repo}/issues/{issue_number}/labels
```

Body: `{"labels": ["label1", "label2"]}`

Not typically needed for migration, but useful for rollback scenarios.

## Notes

- Labels are repo-scoped. The same label name can exist independently in different repos.
- There is no MCP tool for listing repo labels. Use `gh label list` or the REST API.
- The MCP tool `mcp__github__list_issues` supports a `labels` filter for fetching issues by label.
- Label names are case-insensitive for matching purposes, but the API preserves the original casing.
- Maximum labels per issue: no hard limit, but practically dozens.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
