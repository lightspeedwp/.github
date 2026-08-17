---
provider: 'openai'
agent_slug: 'pagespeed'
agent_name: 'PageSpeed Agent (OpenAI)'
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

# PageSpeed Agent — OpenAI Implementation

## Overview

The OpenAI implementation of the PageSpeed Agent uses OpenAI's GPT models with function calling for performance-optimization tasks.

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

# Create performance analysis request
response = openai.ChatCompletion.create(
  model="gpt-4-turbo",
  messages=[{
    "role": "user",
    "content": "Analyze performance for example.com and provide optimization recommendations"
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
    
    # Execute the function (implementation-specific)
    result = execute_performance_function(func_name, func_args)
    
    # Get final recommendations
    final_response = openai.ChatCompletion.create(
      model="gpt-4-turbo",
      messages=[
        {"role": "user", "content": "..."},
        {"role": "assistant", "content": response.choices[0].message.content},
        {"role": "function", "name": func_name, "content": json.dumps(result)}
      ]
    )
```

## Batch Processing for Bulk Analysis

For analyzing multiple sites (10+), use OpenAI's Batch API for cost savings:

```python
import jsonl
import time

# Create batch file (JSONL format)
batch_requests = []
for site_url in site_urls:
    batch_requests.append({
        "custom_id": site_url.replace("https://", ""),
        "method": "POST",
        "url": "/v1/chat/completions",
        "body": {
            "model": "gpt-4-turbo",
            "messages": [{
                "role": "user",
                "content": f"Analyze {site_url} performance and provide optimization recommendations"
            }],
            "functions": [...]
        }
    })

# Upload batch
with open("batch_analysis.jsonl", "w") as f:
    for req in batch_requests:
        f.write(json.dumps(req) + "\n")

batch = openai.beta.batches.create(
    input_file=open("batch_analysis.jsonl", "rb"),
    endpoint="/v1/chat/completions"
)

# Poll for completion
while True:
    batch_status = openai.beta.batches.retrieve(batch.id)
    if batch_status.status == "completed":
        break
    print(f"Batch {batch.id} status: {batch_status.status}")
    time.sleep(30)

# Retrieve results
results = openai.beta.batches.results(batch.id)
for result in results:
    site_id = result.custom_id
    recommendations = process_batch_result(result)
```

## Response Format

OpenAI returns responses in the standard format:
```json
{
  "id": "chatcmpl-...",
  "choices": [{
    "message": {
      "content": "Based on the analysis of your website...",
      "function_call": {
        "name": "optimization-recommender",
        "arguments": "{...}"
      }
    }
  }],
  "usage": {
    "prompt_tokens": 1500,
    "completion_tokens": 800,
    "total_tokens": 2300
  }
}
```

## Streaming Performance Results

For real-time performance analysis feedback:

```python
# Stream performance analysis
with openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=[...],
    functions=[...],
    stream=True
) as response:
    for chunk in response:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)
```

## Error Handling & Retries

```python
import time
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def analyze_with_retry(url):
    try:
        return openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": f"Analyze {url}"}],
            functions=[...],
            timeout=30
        )
    except openai.error.RateLimitError:
        raise  # Let tenacity handle retry
    except openai.error.APIError as e:
        print(f"API error: {e}")
        raise
```

## Token Cost Optimization

```python
# Track token usage for cost analysis
def calculate_analysis_cost(usage, model="gpt-4-turbo"):
    # Pricing (as of 2024)
    pricing = {
        "gpt-4-turbo": {"prompt": 0.01, "completion": 0.03},
        "gpt-3.5-turbo": {"prompt": 0.0005, "completion": 0.0015}
    }
    
    cost = (usage["prompt_tokens"] * pricing[model]["prompt"] +
            usage["completion_tokens"] * pricing[model]["completion"]) / 1000
    
    return cost

# Use gpt-3.5-turbo for simple analysis, gpt-4 for complex
def choose_model(analysis_type):
    if analysis_type in ["quick-scan", "simple-metrics"]:
        return "gpt-3.5-turbo"
    return "gpt-4-turbo"
```

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [tools.json](./tools.json) – Function specifications
- [AGENT.md](../AGENT.md) – Agent specification
- [README.md](../README.md) – Quick reference

---

*Built by LightSpeedWP with open-source spirit!*
