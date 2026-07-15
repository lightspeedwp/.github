# BugHerd Failure Logging

## Purpose
Define when and how Playwright failures should be packaged for BugHerd.

## When To Use
Use this reference when the user wants a failure summary, a BugHerd-ready task, or approval-gated write-back for actionable frontend QA findings.

## Rules
- Only create BugHerd tasks when authorised.
- Include URL, viewport, browser, role, test ID, requirement ID, branch, commit SHA if known, screenshot, trace or video paths where available, and concise reproduction steps.
- Label tasks consistently.
- Do not expose secrets or private test account credentials.
- Use BugHerd for actionable frontend QA findings, not general notes.

## Output Expectations
Outputs should separate confirmed evidence from assumptions, package failures into concise reproducible QA findings, and note whether the result is ready for manual review or approved task creation.

## Related Files
- templates/bugherd-failure-template.md
- examples/bugherd-failure-example.md
- schemas/bugherd-failure.schema.json
- references/mcp-tooling-notes.md
