# Projects V2 API Reference (for Migration)

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

This reference covers the subset of the Projects V2 API needed for field migration: discovering project fields and reading item values.

## List Project Fields

### Via MCP Tool

```
mcp__github__projects_list(
  owner: "{org}",
  project_number: {n},
  method: "list_project_fields"
)
```

### Via GraphQL

```bash
gh api graphql -f query='
  query {
    organization(login: "ORG") {
      projectV2(number: N) {
        fields(first: 30) {
          pageInfo { hasNextPage endCursor }
          nodes {
            ... on ProjectV2Field {
              id
              name
              dataType
            }
            ... on ProjectV2SingleSelectField {
              id
              name
              dataType
              options { id name }
            }
            ... on ProjectV2IterationField {
              id
              name
              dataType
            }
          }
        }
      }
    }
  }'
```

### Field Data Types

| dataType | Description | Migrates to |
|----------|-------------|-------------|
| TEXT | Free-form text | `text` issue field |
| SINGLE_SELECT | Dropdown with options | `single_select` issue field |
| NUMBER | Numeric value | `number` issue field |
| DATE | Date value | `date` issue field |
| ITERATION | Sprint/iteration cycles | No equivalent (skip) |

## List Project Items (with field values)

### Via MCP Tool

```
mcp__github__projects_list(
  owner: "{org}",
  project_number: {n},
  method: "list_project_items"
)
```

Returns paginated results. Each item includes:

- Item type (ISSUE, DRAFT_ISSUE, PULL_REQUEST)
- Content reference (repo owner, repo name, issue number)
- Field values for all project fields

### Via GraphQL

```bash
gh api graphql -f query='
  query($cursor: String) {
    organization(login: "ORG") {
      projectV2(number: N) {
        items(first: 100, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          nodes {
            type
            content {
              ... on Issue {
                number
                repository { nameWithOwner }
              }
            }
            fieldValues(first: 20) {
              pageInfo { hasNextPage endCursor }
              nodes {
                ... on ProjectV2ItemFieldTextValue { text field { ... on ProjectV2Field { name } } }
                ... on ProjectV2ItemFieldSingleSelectValue { name field { ... on ProjectV2SingleSelectField { name } } }
                ... on ProjectV2ItemFieldNumberValue { number field { ... on ProjectV2Field { name } } }
                ... on ProjectV2ItemFieldDateValue { date field { ... on ProjectV2Field { name } } }
              }
            }
          }
        }
      }
    }
  }' -f cursor="$CURSOR"
```

### Important Notes for Migration

- **Pagination**: projects can have up to 10,000 items. Always paginate using `pageInfo.hasNextPage` and `pageInfo.endCursor`.
- **Draft items**: items with `type: DRAFT_ISSUE` have no real issue attached. Skip these during migration.
- **Pull requests**: items with `type: PULL_REQUEST` are PRs, not issues. Issue fields apply to issues only. Skip these.
- **Cross-repo**: a single project can contain issues from many repositories. Group items by repo to batch repo ID lookups.
- **Field value access**: each field value node type is different (`ProjectV2ItemFieldTextValue`, `ProjectV2ItemFieldSingleSelectValue`, etc.). Handle each type.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
