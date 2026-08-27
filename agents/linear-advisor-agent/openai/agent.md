---
file_type: documentation
provider: openai
agent_slug: linear-advisor
agent_name: Linear Advisor Agent (OpenAI)
status: active
version: 1.0.2
created_date: '2026-07-22'
last_updated: '2026-08-21'
model_compatibility:
  - gpt-4
  - gpt-4-turbo
  - gpt-3.5-turbo
api_version: v1
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

OpenAI function definitions follow this pattern:

```json
{
  "type": "function",
  "function": {
    "name": "function-name",
    "description": "Function description",
    "parameters": {
      "type": "object",
      "properties": {
        "param1": {"type": "string"},
        "param2": {"type": "integer"}
      },
      "required": ["param1"]
    }
  }
}
```

## API Integration

### Basic Function Calling

```python
import openai

client = openai.OpenAI(api_key="your-api-key")

functions = [
  {
    "name": "create_linear_issue",
    "description": "Create a new Linear issue",
    "parameters": {
      "type": "object",
      "properties": {
        "title": {"type": "string"},
        "description": {"type": "string"},
        "projectId": {"type": "string"}
      },
      "required": ["title", "projectId"]
    }
  }
]

response = client.chat.completions.create(
  model="gpt-4",
  messages=[
    {"role": "user", "content": "Create a bug fix issue for login"}
  ],
  functions=functions,
  function_call="auto"
)
```

### Handling Function Calls

```python
def handle_function_call(function_name, arguments):
    if function_name == "create_linear_issue":
        return create_linear_issue(**arguments)
    elif function_name == "plan_sprint":
        return plan_sprint(**arguments)
    # ... handle other functions

# Process response
if response.message.function_call:
    function_name = response.message.function_call.name
    arguments = json.loads(response.message.function_call.arguments)
    result = handle_function_call(function_name, arguments)
```

### Multi-Turn Conversation

```python
messages = [
  {"role": "user", "content": "Plan our next sprint"}
]

while True:
    response = client.chat.completions.create(
      model="gpt-4",
      messages=messages,
      functions=functions
    )
    
    if response.message.function_call:
        # Process function call
        result = handle_function_call(...)
        messages.append({"role": "assistant", "content": response.message})
        messages.append({
          "role": "function",
          "name": function_name,
          "content": json.dumps(result)
        })
    else:
        # Final response
        print(response.message.content)
        break
```

## Response Format

OpenAI returns responses in standard format:

### Function Call Response

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": null,
        "function_call": {
          "name": "create_linear_issue",
          "arguments": "{\"title\": \"Fix login bug\", \"projectId\": \"proj-123\"}"
        }
      }
    }
  ]
}
```

### Text Response

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "I've created the issue. Here's the summary..."
      }
    }
  ]
}
```

## Error Handling

### Common Errors

```python
try:
    response = client.chat.completions.create(...)
except openai.RateLimitError:
    # Handle rate limiting
    time.sleep(60)
    retry_request()
except openai.APIError as e:
    # Log error and provide fallback
    logger.error(f"API Error: {e}")
    return fallback_response()
```

### Validation

```python
def validate_function_arguments(function_name, arguments):
    """Validate function arguments before execution"""
    if function_name == "create_linear_issue":
        required = ["title", "projectId"]
        for field in required:
            if field not in arguments:
                raise ValueError(f"Missing required field: {field}")
```

## Integration Examples

### Create Issue Example

```python
def create_issue_from_conversation(user_input):
    response = client.chat.completions.create(
      model="gpt-4",
      messages=[{"role": "user", "content": user_input}],
      functions=[create_issue_function]
    )
    
    if response.message.function_call:
        args = json.loads(response.message.function_call.arguments)
        return linear_api.create_issue(**args)
```

### Sprint Planning Example

```python
def plan_sprint_from_input(team_size, backlog, timeline):
    messages = [
        {"role": "user", "content": f"Plan sprint for {team_size} person team"}
    ]
    
    response = client.chat.completions.create(
      model="gpt-4",
      messages=messages,
      functions=[plan_sprint_function, analyze_capacity_function]
    )
    
    # Process function calls in sequence
    while response.message.function_call:
        # Handle each function call
        pass
```

## Configuration

### Model Selection

- **gpt-4** – Advanced reasoning, complex workflows (recommended)
- **gpt-4-turbo** – Faster processing, cost-effective
- **gpt-3.5-turbo** – Budget-friendly option

### Temperature Settings

- `temperature: 0.7` – Balanced responses (default)
- `temperature: 0.5` – More structured outputs (planning)
- `temperature: 1.0` – Creative planning (brainstorming)

### System Prompt Template

```
You are the Linear Advisor Agent, an expert project manager specializing in:
- Linear issue tracking and management
- Sprint planning and execution
- Release coordination
- Workflow automation
- Team coordination

Always provide:
1. Clear analysis of requirements
2. Structured recommendations
3. Implementation steps
4. Success criteria
5. Risk assessments
```

## Best Practices for OpenAI Integration

### Batch Processing

Use function calling for batch operations:

- Create multiple issues at once
- Update sprint with bulk assignments
- Sync team capacity in batch

### Streaming Responses

For long-running operations:

- Stream status updates
- Progressive result delivery
- Real-time feedback

### Error Recovery

- Validate function parameters
- Handle API errors gracefully
- Retry with backoff strategy
- Log all operations for audit

### Cost Optimization

- Use gpt-3.5-turbo for simple queries
- Batch similar requests together
- Cache system prompt in longer sessions
- Use temperature 0.5 for cost savings

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [tools.json](./tools.json) – Function specifications
- [AGENT.md](../AGENT.md) – Agent specification

---

*Built by LightSpeedWP with open-source spirit!*

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
