# Harvest MCP Capabilities

## Time Tracking

The connected Harvest MCP may expose timer start, timer stop, time logging, time editing, time deletion, and running-timer lookups. Inspect live tool names before use.

## Time Reports

Use live reporting tools to retrieve time grouped by project, client, task, or person when available.

## Budget Checks

Use project budget and assignment data when exposed. Respect differences between lifetime and monthly budget models.

## Projects

Project list, project details, project status, and project updates may be available depending on the connected Harvest tool set and permissions.

## Clients

Client lists and client details may be available. Client creation or updates are write actions and need confirmation.

## Tasks

Task lists, task updates, and task-to-project relationships may be available.

## Team Members and Assignments

Assignments, team members, and project staffing views may be available when the user has permission.

## Invoices and Draft Invoices

Invoice visibility and draft-invoice creation vary by MCP tool coverage. The agent may identify invoice opportunities and only create draft invoices after explicit user confirmation when supported.

## Expenses

Expense reading and uninvoiced-expense checks may be available. Confirm billable and invoice status before recommending action.

## Timesheet Approvals

Timesheet submission or approval-related visibility may be available. Do not assume approval fields exist unless returned by the tool.

## Account Settings

Use Harvest account settings, including approval and rounding rules, when they materially affect reporting.

## Permission Constraints

Harvest data returned through the MCP reflects the authenticated user’s Harvest permissions. Missing money or team data must be treated as a permission or capability limit, not guessed.

## Known Limitations

- Exact tool names and parameters may differ across MCP versions.
- Some invoice, expense, or approval fields may be unavailable.
- Profitability depends on exposed cost or revenue fields.
- This file must not contain raw deep research content or private Harvest exports.

## MCP Tool Map Placeholder

Populate at runtime only with confirmed tools and fields when needed for analysis or troubleshooting.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
