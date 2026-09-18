# Issue Fields

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

Issue fields are custom metadata (dates, text, numbers, single-select) defined at the organization level and set per-issue. They are separate from labels, milestones, and assignees. Common examples: Start Date, Target Date, Priority, Impact, Effort.

**Prefer issue fields over project fields.** When you need to set metadata like dates, priority, or status on an issue, use issue fields (which live on the issue itself) rather than project fields (which live on a project item). Issue fields travel with the issue across projects and views, while project fields are scoped to a single project. Only use project fields when issue fields are not available or when the field is project-specific (e.g., sprint iterations).

## REST API (recommended)

The REST API is the simplest way to discover fields and set values.

### Discovering available fields

```bash
gh api orgs/{org}/issue-fields --jq '.[] | {id, name, options: [.options[]? | {id, name}]}'
```

### Reading field values on an issue

```bash
gh api repos/{owner}/{repo}/issues/{number}/issue-field-values
```

### Setting field values

```bash
gh api repos/{owner}/{repo}/issues/{number}/issue-field-values \
  -X POST \
  --input - <<'EOF'
{"issue_field_values": [{"field_id": 1, "value": "P1"}]}
EOF
```

**Important:** The payload must be a JSON object with an `issue_field_values` array. Each entry has:

- `field_id` (integer): the field's numeric ID from the org fields list
- `value` (string): the **option name** for single-select fields (e.g., `"P1"`, `"High"`), or the literal value for text/number/date fields

Common mistakes to avoid:

- Passing the option ID instead of the option name as `value` (the API expects the display name)
- Sending `field_id` and `value` as top-level keys without wrapping in `issue_field_values` array
- Using `-f` flags instead of `--input` with JSON body

### Example: Set priority to P1

```bash
# 1. Find the Priority field ID and option names
gh api orgs/{org}/issue-fields --jq '.[] | select(.name == "Priority")'

# 2. Set it (use the option NAME, not ID)
gh api repos/{owner}/{repo}/issues/{number}/issue-field-values \
  -X POST \
  --input - <<'EOF'
{"issue_field_values": [{"field_id": 1, "value": "P1"}]}
EOF
```

### Example: Set multiple fields at once

```bash
gh api repos/{owner}/{repo}/issues/{number}/issue-field-values \
  -X POST \
  --input - <<'EOF'
{"issue_field_values": [
  {"field_id": 1, "value": "P1"},
  {"field_id": 5, "value": "2026-06-01"},
  {"field_id": 7, "value": "High"}
]}
EOF
```

### Workflow for setting fields (REST)

1. **Discover fields** - `gh api orgs/{org}/issue-fields` to get field IDs and option names
2. **Set values** - POST to `repos/{owner}/{repo}/issues/{number}/issue-field-values` with JSON body
3. **Batch when possible** - multiple fields can be set in a single request

## GraphQL API (alternative)

The GraphQL API requires the `GraphQL-Features: issue_fields` HTTP header. Without it, the fields are not visible in the schema.

### Discovering available fields (GraphQL)

```graphql
# Header: GraphQL-Features: issue_fields
{
  organization(login: "OWNER") {
    issueFields(first: 30) {
      nodes {
        __typename
        ... on IssueFieldDate { id name }
        ... on IssueFieldText { id name }
        ... on IssueFieldNumber { id name }
        ... on IssueFieldSingleSelect { id name options { id name color } }
      }
    }
  }
}
```

Field types: `IssueFieldDate`, `IssueFieldText`, `IssueFieldNumber`, `IssueFieldSingleSelect`.

### Reading field values (GraphQL)

```graphql
# Header: GraphQL-Features: issue_fields
{
  repository(owner: "OWNER", name: "REPO") {
    issue(number: 123) {
      issueFieldValues(first: 20) {
        nodes {
          __typename
          ... on IssueFieldDateValue {
            value
            field { ... on IssueFieldDate { id name } }
          }
          ... on IssueFieldTextValue {
            value
            field { ... on IssueFieldText { id name } }
          }
          ... on IssueFieldNumberValue {
            value
            field { ... on IssueFieldNumber { id name } }
          }
          ... on IssueFieldSingleSelectValue {
            name
            color
            field { ... on IssueFieldSingleSelect { id name } }
          }
        }
      }
    }
  }
}
```

### Setting field values (GraphQL)

Use `setIssueFieldValue` to set one or more fields at once. You need the issue's node ID and the field IDs from the discovery query above.

```graphql
# Header: GraphQL-Features: issue_fields
mutation {
  setIssueFieldValue(input: {
    issueId: "ISSUE_NODE_ID"
    issueFields: [
      { fieldId: "IFD_xxx", dateValue: "2026-04-15" }
      { fieldId: "IFT_xxx", textValue: "some text" }
      { fieldId: "IFN_xxx", numberValue: 3.0 }
      { fieldId: "IFSS_xxx", singleSelectOptionId: "OPTION_ID" }
    ]
  }) {
    issue { id title }
  }
}
```

Each entry in `issueFields` takes a `fieldId` plus exactly one value parameter:

| Field type | Value parameter | Format |
|-----------|----------------|--------|
| Date | `dateValue` | ISO 8601 date string, e.g. `"2026-04-15"` |
| Text | `textValue` | String |
| Number | `numberValue` | Float |
| Single select | `singleSelectOptionId` | Node ID from the field's `options` list |

To clear a field value, set `delete: true` instead of a value parameter.

## Searching by field values

### GraphQL bulk query (recommended)

The most reliable way to find issues by field value is to fetch issues via GraphQL and filter by `issueFieldValues`. The search qualifier syntax (`field.name:value`) is not yet reliable across all environments.

```bash
# Find all open P1 issues in a repo
gh api graphql -H "GraphQL-Features: issue_fields" -f query='
{
  repository(owner: "OWNER", name: "REPO") {
    issues(first: 100, states: OPEN) {
      nodes {
        number
        title
        updatedAt
        assignees(first: 3) { nodes { login } }
        issueFieldValues(first: 10) {
          nodes {
            __typename
            ... on IssueFieldSingleSelectValue {
              name
              field { ... on IssueFieldSingleSelect { name } }
            }
          }
        }
      }
    }
  }
}' --jq '
  [.data.repository.issues.nodes[] |
    select(.issueFieldValues.nodes[] |
      select(.field.name == "Priority" and .name == "P1")
    ) |
    {number, title, updatedAt, assignees: [.assignees.nodes[].login]}
  ]'
```

**Schema notes for `IssueFieldSingleSelectValue`:**

- The selected option's display text is in `.name` (not `.value`)
- Also available: `.color`, `.description`, `.id`
- The parent field reference is in `.field` (use inline fragment to get the field name)

### Search qualifier syntax (experimental)

Issue fields may also be searchable using dot notation in search queries. This requires `advanced_search=true` on REST or `ISSUE_ADVANCED` search type on GraphQL, but results are inconsistent and may return 0 results even when matching issues exist.

```
field.priority:P0                  # Single-select equals value
field.target-date:>=2026-04-01     # Date comparison
has:field.priority                 # Has any value set
no:field.priority                  # Has no value set
```

Field names use the **slug** (lowercase, hyphens for spaces). For example, "Target Date" becomes `target-date`.

```bash
# REST API (may not return results in all environments)
gh api "search/issues?q=repo:owner/repo+field.priority:P0+is:open&advanced_search=true" \
  --jq '.items[] | "#\(.number): \(.title)"'
```

> **Warning:** The colon notation (`field:Priority:P1`) is silently ignored. If using search qualifiers, always use dot notation (`field.priority:P1`). However, the GraphQL bulk query approach above is more reliable. See [search.md](search.md) for the full search guide.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
