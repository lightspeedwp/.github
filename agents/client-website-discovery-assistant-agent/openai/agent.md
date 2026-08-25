---
title: "Agent"
description: "Agent"
provider: openai
agent_slug: client-website-discovery-assistant
agent_name: Client Website Discovery Assistant (OpenAI)
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

# Client Website Discovery Assistant — OpenAI Implementation

## Overview

The OpenAI implementation of the Client Website Discovery Assistant uses OpenAI's GPT models with function calling for website-assessment tasks.

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

# Load function definitions
with open('tools.json') as f:
    tools = json.load(f)['tools']

# Create discovery request
response = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=[{
        "role": "user",
        "content": "Analyze example.com and generate a discovery report"
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
    
    # Execute the analysis function
    result = execute_discovery_function(func_name, func_args)
    
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

## Batch Processing for Multi-Site Analysis

For analyzing multiple websites (5+ sites), use OpenAI's Batch API:

```python
import jsonl
import time

# Create batch file (JSONL format)
batch_requests = []
for site in client_sites:
    batch_requests.append({
        "custom_id": site["id"],
        "method": "POST",
        "url": "/v1/chat/completions",
        "body": {
            "model": "gpt-4-turbo",
            "messages": [{
                "role": "user",
                "content": f"Generate discovery report for {site['url']}"
            }],
            "functions": [...]
        }
    })

# Upload batch
with open("discovery_batch.jsonl", "w") as f:
    for req in batch_requests:
        f.write(json.dumps(req) + "\n")

batch = openai.beta.batches.create(
    input_file=open("discovery_batch.jsonl", "rb"),
    endpoint="/v1/chat/completions"
)

# Poll for completion
while True:
    batch_status = openai.beta.batches.retrieve(batch.id)
    if batch_status.status == "completed":
        break
    print(f"Batch {batch.id} status: {batch_status.status}")
    time.sleep(30)

# Process results
results = openai.beta.batches.results(batch.id)
for result in results:
    site_id = result.custom_id
    report = process_discovery_result(result)
```

## Multi-Turn Discovery Conversation

For iterative discovery with client feedback:

```python
# Initial discovery request
messages = [{
    "role": "user",
    "content": "Analyze acme.com for their B2B service website"
}]

response = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=messages,
    functions=[...],
    function_call="auto"
)

# Process initial discovery
messages.append({"role": "assistant", "content": response.choices[0].message.content})

# Client feedback/refinement
messages.append({
    "role": "user",
    "content": "Focus more on the checkout flow and add competitor analysis"
})

# Continue discovery with refined scope
response = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=messages,
    functions=[...],
    function_call="auto"
)

# Generate final report
messages.append({"role": "assistant", "content": response.choices[0].message.content})
messages.append({
    "role": "user",
    "content": "Generate a comprehensive report with prioritized recommendations"
})

final_report = openai.ChatCompletion.create(
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
      "content": "Based on my analysis of acme.com...",
      "function_call": {
        "name": "competitor-analyzer",
        "arguments": "{\"targetUrl\": \"...\", ...}"
      }
    }
  }],
  "usage": {
    "prompt_tokens": 2500,
    "completion_tokens": 1200,
    "total_tokens": 3700
  }
}
```

## Discovery Report Generation

```python
def generate_discovery_report(site_url, competitors=[]):
    # Run comprehensive analysis
    analysis_response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[{
            "role": "user",
            "content": f"Generate comprehensive discovery report for {site_url}"
        }],
        functions=[...],
        function_call="auto"
    )
    
    # Process findings
    findings = extract_findings(analysis_response)
    
    # Generate formatted report
    report_prompt = f"""
    Based on these findings:
    {json.dumps(findings, indent=2)}
    
    Generate a professional discovery report with:
    - Executive summary
    - Detailed findings by dimension
    - Competitive analysis
    - Gap analysis
    - Prioritized recommendations
    - Implementation roadmap
    """
    
    report = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[{"role": "user", "content": report_prompt}]
    )
    
    return report.choices[0].message.content
```

## Error Handling & Retries

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
def analyze_with_retry(url):
    try:
        return openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": f"Analyze {url}"}],
            functions=[...],
            timeout=60
        )
    except openai.error.RateLimitError:
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

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
