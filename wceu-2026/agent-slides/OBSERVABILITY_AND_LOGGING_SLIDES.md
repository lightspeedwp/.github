---
title: "Observability & Logging Slide Deck Prompt"
description: "NotebookLM and design prompt for system observability and audit trails"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Observability & Logging Slide Deck Prompt

## System Overview

The **Observability & Logging System** provides complete visibility into all automation operations. It tracks agent execution, captures tool usage, records all decisions, and maintains audit trails for compliance and debugging.

**Operational scope**: Activity logging, audit trails, debugging support, compliance tracking, system health observability.

**Owned by**: LightSpeed ops & engineering teams

## Key Logging Types

1. **Agent Execution Logs** - All agent operations recorded
2. **Tool Usage Logs** - Every tool invocation tracked
3. **Decision Logs** - Agent decisions and reasoning
4. **Error Logs** - Failures, exceptions, recovery
5. **Performance Logs** - Execution times, resource usage
6. **Audit Logs** - Compliance-relevant operations

## Integration Points

- **Session Logger Hook** - Intercepts all operations
- **Metrics System** - Aggregates logged metrics
- **Debugging Tools** - Developers access logs for troubleshooting
- **Compliance** - Logs available for audits

## Key Capabilities

1. **Complete Audit Trail** - All operations recorded with timestamps
2. **Structured Logging** - JSON format for machine parsing
3. **Log Aggregation** - Centralized log storage and retrieval
4. **Search & Filter** - Find operations by agent, time, result
5. **Performance Insights** - Identify slow operations
6. **Error Analysis** - Debug failures with full context

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Agent operations opaque; failures hard to debug; compliance trail missing
- Stakes: Can't fix regressions, can't trace decisions, audit failures

**Slide 02** - Observability System Overview

- Session-logger hook captures all operations
- Structured JSON logging (machine-readable)
- Centralized storage and querying
- Performance metrics included
- Compliance audit trail maintained

**Slide 03** - Agent Execution Logging

- Agent name, start time, end time
- Input parameters, output results
- Success/failure status
- Execution context (PR, issue, repo)
- Nested logs for sub-operations

**Slide 04** - Tool Usage & Access Logs

- Tool name (GitHub API, file system, etc.)
- Operation type (read, write, execute)
- Input and output (sanitized)
- Timestamp and duration
- User/agent performing operation

**Slide 05** - Decision Logs

- Agent decision points
- Reasoning (why decision made)
- Alternative options considered
- Confidence levels
- Labels applied, assignments made

**Slide 06** - Error & Exception Logging

- Error type and message
- Stack trace (for code errors)
- Context at time of error
- Recovery actions attempted
- Human intervention if needed

**Slide 07** - Performance Monitoring

- Execution time per agent (ms)
- Resource usage (memory, CPU)
- API call counts
- File I/O operations
- Bottleneck identification

**Slide 08** - Querying & Search

- Filter by agent, time range, result
- Search by error message, PR number
- Export logs for analysis
- Real-time log streaming
- Historical log retention (90 days)

**Slide 09** - Debugging with Logs

- Find specific PR workflow execution
- Trace agent decision flow
- Identify why label applied
- Review error context
- Reproduce issues locally

**Slide 10** - Compliance & Audit

- All operations recorded
- Immutable audit trail
- Timestamps for timing verification
- User/agent attribution
- Data retention policies

**Slide 11** - Log Aggregation & Storage

- Session-logger writes logs
- Logs stored in `.github/logs/` directory
- Format: JSON for easy parsing
- Retention: 90 days in directory, archive older
- Backup: logs backed up separately

**Slide 12** - Performance Insights from Logs

- Which agents are slowest?
- Which operations take time?
- Where are bottlenecks?
- Are performance regressions happening?
- Resource utilization trends

**Slide 13** - Access Control & Privacy

- Logs contain potentially sensitive info (PRs, issues)
- Restrict access to logs appropriately
- Sanitize sensitive data before sharing
- GDPR/privacy compliance for logs
- Secure storage and transmission

**Slide 14** - Troubleshooting with Logs

- PR not getting labeled: check labeling.agent.js logs
- Review not triggering: check reviewer.agent.js logs
- Release failing: check release.agent.js logs
- API errors: check GitHub API logs

**Slide 15** - Close & Next Actions

- Logging provides complete observability
- Contribute: Review logs when debugging
- Questions & feedback

## Evidence Anchors

- `.github/hooks/session-logger/` - Session logging hook
- `.github/logs/` - Log directory and retention
- `.github/scripts/agents/` - Agent logging calls
- Session logs in PR comments (visible feedback)

## Design Notes

- **Visual theme**: Observability and transparency (dashboards, logs, traces)
- **Color palette**: Use monitoring colors (blues, greens)
- **Key visuals**: Log flow diagram, audit trail timeline, performance charts
- **Accessibility**: High contrast for log levels (error, warning, info)

## Quality Bar

- Show real log examples from repository
- Include actual performance numbers
- Validate against session-logger implementation
- Show debugging workflow examples
