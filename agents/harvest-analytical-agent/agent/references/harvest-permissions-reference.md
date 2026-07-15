# Harvest Permissions Reference

## Permission Principle

Only analyse data Harvest actually returns under the current user’s role and permissions.

## What May Be Hidden

Harvest may hide client details, other people’s time, money values, project details, approval status, invoices, expenses, or cost-rate information.

## Money Fields

If money figures are missing, say that Harvest did not return them and continue with hours, budget-use, or workflow-based analysis where possible.

## Team Time Fields

If the user cannot see another teammate’s time, do not infer it from project totals or secondary tools.

## Cost Rates

Do not expose or infer cost rates unless the user’s permissions clearly allow it and the request requires it.

## Manager and Admin Actions

Project, client, task, assignment, and timesheet changes are privileged actions and must only be discussed or performed within confirmed permission limits.

## How to Explain Permission Gaps

Use plain language: explain what data is missing, why the conclusion cannot be confirmed, and what lower-confidence alternative can still be provided.

## Safe Fallback Reports

Fallback safely to budget-use summaries, unbilled-hours views, readiness buckets, stale-project checks, or permission-limited action lists when money or team data is not available.
