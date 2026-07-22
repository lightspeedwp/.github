---
provider: 'openai'
agent_slug: 'linear-advisor'
agent_name: 'Linear Advisor Agent (OpenAI)'
status: 'production'
version: '1.0.0'
created_date: '2026-07-22'
last_updated: '2026-07-22'
model_compatibility:
  - gpt-4
  - gpt-4-turbo
  - gpt-3.5-turbo
api_version: 'v1'
temperature: 0.7
top_p: 0.9
---

# Linear Advisor Agent — OpenAI Implementation

## Overview

The OpenAI implementation of the Linear Advisor Agent uses OpenAI's GPT models with function calling for linear-integration tasks.

OpenAI excels at:
- **Function calling** – Structured API integration
- **Batch processing** – Handle large data sets
- **Cost-effective** – Pay per request with standard pricing
- **Rapid iteration** – Deploy updates quickly

## Available Functions

Functions are defined in [tools.json](./tools.json) and follow OpenAI's function calling specification.

## Function Calling Pattern

```json
{
  "type": "function",
  "function": {
    "name": "function-name",
    "description": "Function description",
    "parameters": {
      "type": "object",
      "properties": {
        "param1": {"type": "string"}
      },
      "required": ["param1"]
    }
  }
}
```

## API Integration

```python
import openai

response = openai.ChatCompletion.create(
  model="gpt-4",
  messages=[{"role": "user", "content": "..."}],
  functions=[...],
  function_call="auto"
)
```

## Response Format

OpenAI returns responses in the standard OpenAI format:
- Message content for explanation
- Function call with parameters
- Function results for integration

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [tools.json](./tools.json) – Function specifications
- [AGENT.md](../AGENT.md) – Agent specification

---

*Built by LightSpeedWP with open-source spirit!*
