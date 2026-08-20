---
provider: 'openai'
agent_slug: 'website-scope-estimator'
agent_name: 'Website Scope Estimator (OpenAI)'
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
---

# Website Scope Estimator — OpenAI Implementation

## Overview

The OpenAI implementation of the Website Scope Estimator uses OpenAI's GPT models with function calling for project-scoping tasks.

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
import json

# Load function specifications
with open('tools.json') as f:
    tools = json.load(f)['tools']

# Create estimation request
response = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=[{
        "role": "user",
        "content": "Estimate scope and effort for website redesign project"
    }],
    functions=[{
        "name": tool["name"],
        "description": tool["description"],
        "parameters": tool["inputSchema"]
    } for tool in tools],
    function_call="auto",
    temperature=0.7
)

# Handle function call
if response.choices[0].message.get("function_call"):
    func_name = response.choices[0].message["function_call"]["name"]
    func_args = json.loads(response.choices[0].message["function_call"]["arguments"])
    
    # Execute estimation function
    result = execute_estimation_function(func_name, func_args)
    
    # Get final estimate
    final_response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "user", "content": "..."},
            {"role": "assistant", "content": response.choices[0].message.content},
            {"role": "function", "name": func_name, "content": json.dumps(result)}
        ]
    )
```

## Multi-Scenario Estimation

Compare multiple estimation scenarios:

```python
def estimate_scenarios(project_spec):
    scenarios = [
        {"name": "Conservative", "buffer": 0.40},
        {"name": "Realistic", "buffer": 0.25},
        {"name": "Optimistic", "buffer": 0.10}
    ]
    
    results = []
    for scenario in scenarios:
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[{
                "role": "user",
                "content": f"""
                Estimate {project_spec} with {scenario['buffer']*100}% contingency
                Scenario: {scenario['name']}
                """
            }],
            functions=[...]
        )
        results.append({
            "scenario": scenario['name'],
            "estimate": extract_estimate(response)
        })
    
    return results
```

## Batch Estimation for Multiple Projects

```python
import time

# Create batch file (JSONL format)
batch_requests = []
for project in projects:
    batch_requests.append({
        "custom_id": project['id'],
        "method": "POST",
        "url": "/v1/chat/completions",
        "body": {
            "model": "gpt-4-turbo",
            "messages": [{
                "role": "user",
                "content": f"Estimate project: {project['description']}"
            }],
            "functions": [...]
        }
    })

# Upload batch
with open("estimation_batch.jsonl", "w") as f:
    for req in batch_requests:
        f.write(json.dumps(req) + "\n")

batch = openai.beta.batches.create(
    input_file=open("estimation_batch.jsonl", "rb"),
    endpoint="/v1/chat/completions"
)

# Wait for completion
while True:
    batch_status = openai.beta.batches.retrieve(batch.id)
    if batch_status.status == "completed":
        break
    print(f"Batch status: {batch_status.status}")
    time.sleep(30)

# Process results
results = openai.beta.batches.results(batch.id)
for result in results:
    project_id = result.custom_id
    estimate = process_estimation_result(result)
```

## Iterative Refinement

For refining estimates with client feedback:

```python
# Initial estimation
messages = [{
    "role": "user",
    "content": "Estimate scope for e-commerce site"
}]

response = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=messages,
    functions=[...],
    function_call="auto"
)

# Add clarifications/feedback
messages.append({"role": "assistant", "content": response.choices[0].message.content})
messages.append({
    "role": "user",
    "content": "The team is junior, add 25% buffer. Timeline is 12 weeks max."
})

# Refined estimate
refined = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=messages,
    functions=[...]
)

# Generate final proposal
messages.append({"role": "assistant", "content": refined.choices[0].message.content})
messages.append({
    "role": "user",
    "content": "Generate final proposal document"
})

proposal = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=messages
)
```

## Response Format

OpenAI returns structured responses:

```json
{
  "id": "chatcmpl-...",
  "choices": [{
    "message": {
      "content": "Based on project requirements, here's my estimate...",
      "function_call": {
        "name": "effort-estimator",
        "arguments": "{\"features\": [...], \"methodology\": \"historical\"}"
      }
    }
  }],
  "usage": {
    "prompt_tokens": 1800,
    "completion_tokens": 900,
    "total_tokens": 2700
  }
}
```

## Cost Optimization

```python
def choose_model_for_estimation(complexity):
    """Select appropriate model based on complexity"""
    if complexity == "simple":
        return "gpt-3.5-turbo"  # Faster, cheaper
    elif complexity == "medium":
        return "gpt-4-turbo"    # Balanced
    else:
        return "gpt-4"           # Most capable for complex

def estimate_api_cost(num_projects, avg_tokens=3000):
    """Estimate API cost for estimation batch"""
    pricing = {
        "gpt-4-turbo": {"prompt": 0.01, "completion": 0.03},
        "gpt-3.5-turbo": {"prompt": 0.0005, "completion": 0.0015}
    }
    
    total_cost = (num_projects * avg_tokens / 1000) * pricing["gpt-4-turbo"]["prompt"]
    return total_cost
```

## Error Handling & Retries

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
def estimate_with_retry(project_description):
    try:
        return openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": project_description}],
            functions=[...],
            timeout=60
        )
    except openai.error.RateLimitError:
        print("Rate limited, retrying...")
        raise
    except openai.error.APIError as e:
        print(f"API error: {e}")
        raise
```

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [tools.json](./tools.json) – Function specifications
- [AGENT.md](../AGENT.md) – Agent specification
- [README.md](../README.md) – Quick reference

---

*Built by LightSpeedWP with open-source spirit!*
