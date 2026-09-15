# PRD Agent — OpenAI Configuration

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
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

## Overview

This is the OpenAI-specific configuration for the PRD Agent. Use this when running the agent via OpenAI API for automated planning workflows.

## System Prompt

You are the **PRD Agent** deployed on OpenAI infrastructure. You provide product planning capabilities via RESTful API for integration into automated workflows, CI/CD pipelines, and third-party tools.

### Deployment Context

- **Interface:** OpenAI Chat Completions API
- **Function Calling:** Native OpenAI function definitions
- **Async Support:** Full async/await for workflow integration
- **Structured Output:** JSON responses for programmatic consumption

### Core Functions

1. `create_prd` — Generate complete PRD documents
2. `generate_feature_spec` — Create feature specifications
3. `prioritize_features` — Rank features by impact/effort
4. `estimate_timeline` — Calculate realistic timelines
5. `assess_risks` — Identify and rank risks
6. `plan_sprints` — Generate sprint plans

## API Endpoints

All endpoints follow OpenAI's Chat Completions API specification.

### PRD Creation

```
POST /v1/chat/completions
{
  "model": "gpt-4",
  "functions": [{"name": "create_prd", ...}],
  "messages": [...]
}
```

### Feature Planning

```
POST /v1/chat/completions
{
  "model": "gpt-4",
  "functions": [{"name": "prioritize_features", ...}],
  "messages": [...]
}
```

## Integration Patterns

### CI/CD Integration

- Trigger PRD generation on feature request
- Validate PRDs automatically
- Gate code changes on PRD approval
- Auto-generate issue templates from PRDs

### Workflow Automation

- Webhook triggers for planning updates
- Scheduled roadmap reviews
- Automated risk assessments
- Sprint planning automation

### Third-Party Integration

- Slack notifications for PRD reviews
- Jira integration for issue sync
- Linear integration for project tracking
- Webhook delivery for custom tools

## Authentication

- OpenAI API key required
- Per-request organization and project IDs
- Rate limiting applied per endpoint
- Usage tracking via API

## Request/Response Format

### PRD Creation Request

```json
{
  "product_name": "Feature X",
  "vision_statement": "...",
  "user_personas": [...],
  "key_requirements": [...],
  "success_metrics": [...]
}
```

### PRD Creation Response

```json
{
  "status": "success",
  "prd_document": "...",
  "version": "1.0.0",
  "created_at": "2026-07-22T...",
  "validations": {
    "completeness": 95,
    "clarity": 92
  }
}
```

## Error Handling

- `400` — Invalid request parameters
- `401` — Authentication failure
- `429` — Rate limit exceeded
- `500` — Internal server error

All errors include detailed `error_code` and `message` fields for debugging.

## Performance Considerations

- Typical PRD creation: 2-5 seconds
- Feature planning: 1-3 seconds
- Timeline estimation: 1-2 seconds
- Batch operations supported for multiple items

## Webhooks

Subscribe to planning events:

```json
{
  "event": "prd.created",
  "prd_id": "prd-123",
  "timestamp": "2026-07-22T...",
  "data": {...}
}
```

Available events:

- `prd.created`
- `prd.validated`
- `features.prioritized`
- `timeline.estimated`
- `risk.assessed`
- `sprint.planned`

---

Use OpenAI when you need API-driven planning automation or integration with external systems.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
