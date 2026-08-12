# PRD Agent — OpenAI Configuration

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
