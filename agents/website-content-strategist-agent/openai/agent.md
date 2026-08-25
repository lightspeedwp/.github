# Website Content Strategist — OpenAI Implementation

## Overview

The OpenAI implementation of the Website Content Strategist uses OpenAI's GPT models with function calling for content strategy tasks. This implementation is optimized for API integration, cost efficiency, and rapid iteration.

OpenAI excels at:

- **Function calling** – Structured API integration with typed schemas
- **Batch processing** – Handle large content audits and analyses
- **Cost-effective** – Pay per request with transparent pricing
- **Rapid iteration** – Deploy updates and changes quickly
- **Scalability** – Handle high-volume content analysis requests

## Available Functions

Functions follow OpenAI's function calling specification and are defined in [tools.json](./tools.json).

Available functions:

1. content-strategist
2. content-auditor
3. gap-analyzer
4. seo-optimizer
5. keyword-researcher
6. content-planner

## Python SDK Setup

```python
from openai import OpenAI
import json

# Initialize client
client = OpenAI(api_key="sk-...")

# Define functions (from tools.json)
functions = [
    {
        "name": "content-strategist",
        "description": "Develop comprehensive content strategies",
        "parameters": {
            "type": "object",
            "properties": {
                "business_goals": {"type": "string"},
                "target_audience": {"type": "string"},
                "content_types": {
                    "type": "array",
                    "items": {"type": "string"}
                }
            },
            "required": ["business_goals", "target_audience"]
        }
    }
]
```

## Function Calling Pattern

### Basic Function Call

```python
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {
            "role": "user",
            "content": "Develop a content strategy for our SaaS product..."
        }
    ],
    functions=functions,
    function_call="auto"
)

# Check if function was called
if response.choices[0].message.function_call:
    function_name = response.choices[0].message.function_call.name
    function_args = json.loads(
        response.choices[0].message.function_call.arguments
    )
    print(f"Called: {function_name}")
    print(f"Args: {function_args}")
```

### Handling Function Results

```python
def process_function_call(response, functions_config):
    """Process OpenAI function call response"""
    
    message = response.choices[0].message
    
    if not message.function_call:
        return message.content  # Regular response
    
    function_name = message.function_call.name
    function_args = json.loads(message.function_call.arguments)
    
    # Execute function (your implementation)
    function_result = execute_function(function_name, function_args)
    
    # Send result back for follow-up
    messages = [
        {"role": "user", "content": initial_prompt},
        {"role": "assistant", "content": message.content},
        {
            "role": "function",
            "name": function_name,
            "content": json.dumps(function_result)
        }
    ]
    
    # Get next response
    next_response = client.chat.completions.create(
        model="gpt-4",
        messages=messages,
        functions=functions,
        function_call="auto"
    )
    
    return next_response.choices[0].message.content
```

## Batch API Integration

### Creating Batch Requests

```python
def create_batch_request(content_items, batch_size=10):
    """Create batch file for multiple content analyses"""
    
    batch_requests = []
    
    for item in content_items:
        request = {
            "custom_id": f"content-audit-{item['id']}",
            "method": "POST",
            "url": "/v1/chat/completions",
            "body": {
                "model": "gpt-4",
                "messages": [
                    {
                        "role": "user",
                        "content": f"Audit this content: {item['url']}"
                    }
                ],
                "functions": functions,
                "function_call": "auto"
            }
        }
        batch_requests.append(request)
    
    return batch_requests
```

### Submitting Batch

```python
def submit_batch(batch_requests):
    """Submit batch for processing"""
    
    # Create batch file
    batch_file = client.files.create(
        file=json.dumps(batch_requests),
        purpose="batch"
    )
    
    # Submit batch job
    batch = client.batches.create(
        input_file_id=batch_file.id,
        endpoint="/v1/chat/completions",
        timeout_minutes=24
    )
    
    return batch.id
```

### Retrieving Batch Results

```python
def get_batch_results(batch_id):
    """Retrieve batch processing results"""
    
    batch = client.batches.retrieve(batch_id)
    
    if batch.status != "completed":
        print(f"Batch status: {batch.status}")
        return None
    
    # Retrieve results file
    results = client.files.content(batch.output_file_id).text
    
    return json.loads(results)
```

## Error Handling

### Rate Limiting

```python
import time
from openai import RateLimitError

def call_with_retry(prompt, max_retries=3):
    """Call OpenAI API with retry logic"""
    
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                functions=functions
            )
            return response
        except RateLimitError:
            wait_time = 2 ** attempt  # Exponential backoff
            print(f"Rate limited. Waiting {wait_time}s...")
            time.sleep(wait_time)
        except Exception as e:
            print(f"Error: {e}")
            raise
    
    raise Exception(f"Failed after {max_retries} retries")
```

### Token Management

```python
import tiktoken

def estimate_tokens(content, model="gpt-4"):
    """Estimate token count for content"""
    
    encoding = tiktoken.encoding_for_model(model)
    tokens = encoding.encode(content)
    
    return len(tokens)

def check_context_limits(messages, max_tokens=4000):
    """Check if content fits within context window"""
    
    encoding = tiktoken.encoding_for_model("gpt-4")
    
    total_tokens = 0
    for message in messages:
        tokens = len(encoding.encode(message["content"]))
        total_tokens += tokens
    
    if total_tokens > max_tokens:
        raise ValueError(
            f"Content exceeds limit: {total_tokens} > {max_tokens}"
        )
    
    return True
```

## Response Format

OpenAI returns responses in the standard OpenAI format:

```python
{
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": "...",
                "function_call": {
                    "name": "function-name",
                    "arguments": "..."
                }
            },
            "finish_reason": "function_call"
        }
    ],
    "usage": {
        "prompt_tokens": 100,
        "completion_tokens": 50,
        "total_tokens": 150
    }
}
```

## Cost Optimization

### Strategy Development Costs

- Input: ~500 tokens (strategy request)
- Output: ~1500 tokens (strategy response)
- Estimated cost: ~$0.05 per strategy (GPT-4)

### Content Audit Costs

- Input: ~1000 tokens (audit request + content)
- Output: ~1000 tokens (audit findings)
- Estimated cost: ~$0.06 per audit (GPT-4)

### Batch Processing Savings

- Batch API cost: 50% discount
- Can reduce cost to ~$0.03 per analysis
- Recommended for 100+ items

## Streaming Responses

```python
def stream_strategy_response(prompt):
    """Stream long strategy responses"""
    
    with client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        functions=functions,
        stream=True
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
```

## Webhooks and Async Processing

```python
def setup_webhook_listener():
    """Setup webhook for batch job completion"""
    
    # Configure webhook endpoint
    webhook_config = {
        "url": "https://your-domain.com/webhook/openai",
        "events": ["batch.completed"]
    }
    
    # When batch completes, webhook will POST to this URL
    # Process results asynchronously
```

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology and 6-phase process
- [tools.json](./tools.json) – Function specifications with full schemas
- [AGENT.md](../AGENT.md) – Agent specification and capabilities
- [README.md](../README.md) – Quick reference guide
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

## Best Practices

1. **Use streaming** for long content strategies
2. **Enable function calling** for structured outputs
3. **Implement retry logic** for API calls
4. **Use batch API** for bulk analysis (100+ items)
5. **Cache function schemas** to reduce token usage
6. **Monitor costs** with token counting

---

*Built by LightSpeedWP with open-source spirit!*

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
