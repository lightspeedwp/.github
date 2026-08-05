---
provider: 'openai'
agent_slug: 'ai-readiness-estimator'
agent_name: 'AI Readiness Estimator (OpenAI)'
status: 'production'
version: '1.0.1'
created_date: '2026-07-22'
last_updated: '2026-08-05'
model_compatibility:
  - gpt-4
  - gpt-4-turbo
  - gpt-3.5-turbo
api_version: 'v1'
temperature: 0.7
top_p: 0.9
max_tokens: '4096'
---

# AI Readiness Estimator — OpenAI Implementation

## Overview

The OpenAI implementation of the AI Readiness Estimator uses OpenAI's GPT models with function calling for structured AI readiness evaluation. This implementation is optimized for robust API integration, batch processing, and cost-effective scaled assessment.

OpenAI excels at:

- **Function calling** – Structured API integration with proper typing
- **Batch processing** – Handle large-scale organizational assessments
- **Cost-effective** – Pay per request with efficient token usage
- **Rapid deployment** – Quick updates and version management
- **Robust integration** – Enterprise-ready API reliability

## Available Functions

Functions are defined in [tools.json](./tools.json) and follow OpenAI's function calling specification with proper JSON schema validation.

## Function Calling Pattern

```json
{
  "type": "function",
  "function": {
    "name": "assess-capability",
    "description": "Assess AI capability opportunities",
    "parameters": {
      "type": "object",
      "properties": {
        "organization_type": {
          "type": "string",
          "description": "Type of organization"
        },
        "business_challenges": {
          "type": "array",
          "items": {"type": "string"},
          "description": "List of key challenges"
        }
      },
      "required": ["organization_type", "business_challenges"]
    }
  }
}
```

## API Integration

### Basic Integration Pattern

```python
import openai
import json

client = openai.OpenAI(api_key="your-api-key")

# Load function definitions
with open('tools.json', 'r') as f:
    tools_schema = json.load(f)

# Define functions for tool use
functions = tools_schema['tools']

# Make API call with function calling
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {
            "role": "user",
            "content": "Assess our AI readiness. We are a financial services company..."
        }
    ],
    tools=[{"type": "function", "function": f} for f in functions],
    tool_choice="auto"
)

# Handle function calls
while response.choices[0].finish_reason == "tool_calls":
    tool_call = response.choices[0].message.tool_calls[0]
    function_name = tool_call.function.name
    function_args = json.loads(tool_call.function.arguments)
    
    # Execute function based on name
    if function_name == "assess-capability":
        result = assess_capability(**function_args)
    
    # Continue conversation with results
    messages.append({"role": "assistant", "content": response.choices[0].message.content})
    messages.append({
        "role": "user",
        "content": json.dumps({"tool_call_id": tool_call.id, "result": result})
    })
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages,
        tools=[{"type": "function", "function": f} for f in functions],
        tool_choice="auto"
    )
```

### Batch Processing Pattern

For large-scale organizational assessments:

```python
import openai
import json
from typing import List

def create_batch_assessment_requests(
    organizations: List[dict]
) -> List[dict]:
    """Create batch API requests for multiple organizations"""
    
    requests = []
    for i, org in enumerate(organizations):
        request = {
            "custom_id": f"org-{org['id']}",
            "method": "POST",
            "url": "/v1/chat/completions",
            "body": {
                "model": "gpt-4",
                "messages": [
                    {
                        "role": "user",
                        "content": f"""
                        Perform AI readiness assessment for {org['name']}.
                        Organization Type: {org['type']}
                        Challenges: {', '.join(org['challenges'])}
                        """
                    }
                ],
                "tools": [{"type": "function", "function": f} 
                         for f in tools_schema['tools']],
                "tool_choice": "auto"
            }
        }
        requests.append(request)
    
    return requests

def submit_batch_assessment(requests: List[dict]) -> str:
    """Submit batch assessment job"""
    
    client = openai.OpenAI()
    
    # Write requests to file
    with open("assessment_batch.jsonl", "w") as f:
        for request in requests:
            f.write(json.dumps(request) + "\n")
    
    # Submit batch
    with open("assessment_batch.jsonl", "rb") as f:
        batch = client.beta.batches.create(
            input_file=f,
            endpoint="/v1/chat/completions"
        )
    
    return batch.id

def retrieve_batch_results(batch_id: str) -> dict:
    """Retrieve batch assessment results"""
    
    client = openai.OpenAI()
    
    batch = client.beta.batches.retrieve(batch_id)
    
    if batch.status == "completed":
        # Process results
        results = {}
        with open(f"assessment_results_{batch_id}.jsonl", "r") as f:
            for line in f:
                result = json.loads(line)
                org_id = result['custom_id']
                results[org_id] = result['response']['body']['choices'][0]
        
        return results
    else:
        return {"status": batch.status}
```

## Response Format

OpenAI returns responses in the standard OpenAI format:

### Message Response Structure

```python
{
    "id": "chatcmpl-...",
    "object": "chat.completion",
    "created": 1234567890,
    "model": "gpt-4",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "Analysis and findings...",
                "tool_calls": [
                    {
                        "id": "call_...",
                        "type": "function",
                        "function": {
                            "name": "assess-capability",
                            "arguments": "{\"organization_type\": \"...\", ...}"
                        }
                    }
                ]
            },
            "finish_reason": "tool_calls"
        }
    ],
    "usage": {
        "prompt_tokens": 150,
        "completion_tokens": 500,
        "total_tokens": 650
    }
}
```

### Processing Tool Responses

```python
def process_assessment_response(response: dict) -> dict:
    """Process OpenAI assessment response"""
    
    result = {
        "analysis": response.choices[0].message.content,
        "function_calls": [],
        "usage": {
            "prompt_tokens": response.usage.prompt_tokens,
            "completion_tokens": response.usage.completion_tokens,
            "total_tokens": response.usage.total_tokens
        }
    }
    
    # Extract function calls
    for tool_call in response.choices[0].message.tool_calls:
        if tool_call.type == "function":
            result["function_calls"].append({
                "name": tool_call.function.name,
                "arguments": json.loads(tool_call.function.arguments)
            })
    
    return result
```

## Python Integration Examples

### Quick Assessment

```python
def quick_ai_readiness_assessment(org_profile: dict) -> dict:
    """Quick AI readiness assessment"""
    
    client = openai.OpenAI()
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{
            "role": "user",
            "content": f"""
            Assess AI readiness for:
            - Organization: {org_profile['name']}
            - Industry: {org_profile['industry']}
            - Size: {org_profile['size']}
            - Challenges: {', '.join(org_profile['challenges'])}
            """
        }],
        tools=[{"type": "function", "function": f} 
               for f in tools_schema['tools']],
        tool_choice="auto"
    )
    
    return process_assessment_response(response)
```

### Comprehensive Assessment

```python
def comprehensive_assessment(org_profile: dict) -> dict:
    """Comprehensive AI readiness assessment"""
    
    client = openai.OpenAI()
    
    # Phase 1: Capability Assessment
    capability_response = client.chat.completions.create(
        model="gpt-4",
        messages=[{
            "role": "user",
            "content": f"Identify AI capabilities for {org_profile['name']}"
        }],
        tools=[{
            "type": "function",
            "function": next(f for f in tools_schema['tools'] 
                           if f['name'] == 'assess-capability')
        }],
        tool_choice="auto"
    )
    
    # Phase 2: Data Assessment
    data_response = client.chat.completions.create(
        model="gpt-4",
        messages=[{
            "role": "user",
            "content": f"Assess data readiness for {org_profile['name']}"
        }],
        tools=[{
            "type": "function",
            "function": next(f for f in tools_schema['tools'] 
                           if f['name'] == 'assess-data-quality')
        }],
        tool_choice="auto"
    )
    
    # Phase 3: Infrastructure Assessment
    infra_response = client.chat.completions.create(
        model="gpt-4",
        messages=[{
            "role": "user",
            "content": f"Assess infrastructure for {org_profile['name']}"
        }],
        tools=[{
            "type": "function",
            "function": next(f for f in tools_schema['tools'] 
                           if f['name'] == 'assess-infrastructure')
        }],
        tool_choice="auto"
    )
    
    return {
        "capability": process_assessment_response(capability_response),
        "data": process_assessment_response(data_response),
        "infrastructure": process_assessment_response(infra_response)
    }
```

## Cost Optimization

### Token Efficiency Tips

1. **Use specific prompts** – Reduce ambiguity to minimize tokens
2. **Reuse function results** – Cache results where possible
3. **Batch similar requests** – Use batch API for 50% cost reduction
4. **Choose appropriate model** – Use gpt-3.5-turbo for simple tasks
5. **Structured outputs** – Encourage concise, structured responses

### Pricing Considerations

- **gpt-4**: Higher accuracy, higher cost (~$0.03/1K input tokens)
- **gpt-4-turbo**: Balanced cost/performance (~$0.01/1K input tokens)
- **gpt-3.5-turbo**: Cost-effective (~$0.0005/1K input tokens)
- **Batch API**: 50% discount for non-urgent assessments

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [tools.json](./tools.json) – Function specifications and schemas
- [AGENT.md](../AGENT.md) – Agent specification
- [README.md](../README.md) – Quick reference guide

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
