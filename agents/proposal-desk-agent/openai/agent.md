# Proposal Desk Agent — OpenAI Implementation

## Overview

The OpenAI implementation of the Proposal Desk Agent leverages OpenAI's GPT models with function calling to provide proposal-generation, quoting, and scoping as API-based services. This implementation is ideal for automation, batch processing, and integration into backend systems.

OpenAI excels at:

- **Function calling** – Structured API requests and responses
- **Batch processing** – Handle bulk proposals or quotes via Batch API
- **Cost-effective** – Pay-per-request pricing scales with volume
- **Stateless operation** – No session management required; ideal for microservices
- **Webhook integration** – Trigger proposal generation from external systems

## Implementation Architecture

### Request Pattern

```
Client System → OpenAI API Request → Proposal Desk Agent (GPT) → Function Call → Results → Response
```

**Example Request:**

```json
{
  "model": "gpt-4-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Create a proposal for Acme Corp. Website redesign project. Budget: $30k. Timeline: 12 weeks."
    }
  ],
  "functions": [
    {
      "name": "proposal-create",
      "description": "Generate complete proposal",
      "parameters": {...}
    }
  ],
  "function_call": "auto"
}
```

### Response Pattern

```json
{
  "id": "chatcmpl-...",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": null,
        "function_call": {
          "name": "proposal-create",
          "arguments": "{\"clientName\": \"Acme Corp\", ...}"
        }
      }
    }
  ]
}
```

## Function Calling Integration

All proposal operations are exposed as OpenAI functions defined in [tools.json](./tools.json):

1. **proposal-create** – Generate complete proposal document
2. **proposal-template** – Load and customize template
3. **quote-generator** – Create itemized quotes
4. **scope-estimator** – Estimate effort and timeline
5. **timeline-planner** – Create project schedule
6. **invoice-generator** – Generate invoices
7. **proposal-tracker** – Track proposal status

## Python SDK Integration

```python
import openai
import json

# Load function definitions
with open('tools.json') as f:
    tools = json.load(f)['tools']

# Create API request
response = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=[
        {
            "role": "user",
            "content": "Create proposal: Acme Corp, website redesign, $30k, 12 weeks"
        }
    ],
    functions=[
        {
            "name": tool["name"],
            "description": tool["description"],
            "parameters": tool["inputSchema"]
        }
        for tool in tools
    ],
    function_call="auto",
    temperature=0.7
)

# Handle function call
if response.choices[0].message.get("function_call"):
    function_name = response.choices[0].message["function_call"]["name"]
    function_args = json.loads(response.choices[0].message["function_call"]["arguments"])
    
    # Execute function (implementation-dependent)
    result = execute_function(function_name, function_args)
    
    # Send result back to GPT for completion
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "user", "content": "..."},
            {"role": "assistant", "content": response.choices[0].message.content},
            {"role": "function", "name": function_name, "content": json.dumps(result)}
        ],
        functions=[...]
    )
```

## Batch Processing API

For high-volume proposal generation (10+ proposals), use OpenAI's Batch API for cost savings:

```python
import jsonl

# Create batch file (JSONL format)
batch_file = []
for client_data in clients:
    batch_file.append({
        "custom_id": client_data["id"],
        "method": "POST",
        "url": "/v1/chat/completions",
        "body": {
            "model": "gpt-4-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": f"Create proposal for {client_data['name']}..."
                }
            ],
            "functions": [...]
        }
    })

# Upload batch
batch = client.beta.batches.create(
    input_file=open("batch.jsonl", "rb"),
    endpoint="/v1/chat/completions"
)

# Poll for completion
while True:
    batch_status = client.beta.batches.retrieve(batch.id)
    if batch_status.status == "completed":
        break
    time.sleep(10)

# Retrieve results
results = client.beta.batches.results(batch.id)
```

## Webhook Integration

Trigger proposal generation from external systems (e.g., CRM, project management tools):

```python
@app.post("/webhook/proposal-request")
def handle_proposal_webhook(request_data):
    # Parse incoming request
    client_name = request_data["client_name"]
    requirements = request_data["scope"]
    
    # Call OpenAI API
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[
            {
                "role": "user",
                "content": f"Create proposal for {client_name}: {requirements}"
            }
        ],
        functions=[...]
    )
    
    # Process result and store/send
    proposal = process_response(response)
    save_to_db(proposal)
    send_to_client(proposal)
    
    return {"status": "success", "proposal_id": proposal.id}
```

## Error Handling

**Function Call Parsing Errors:**

- Validate JSON in function arguments before execution
- Return error to GPT for recovery
- GPT will retry with corrected parameters

**API Rate Limits:**

- Implement exponential backoff retry logic
- Use batch API for volume operations
- Monitor token usage per request

**Invalid Parameters:**

- Function schema validation catches most errors
- GPT typically corrects invalid parameters automatically
- Return detailed error messages for manual review

## Response Format

OpenAI returns structured responses:

```json
{
  "message": {
    "content": "I've created a comprehensive proposal for Acme Corp...",
    "function_call": {
      "name": "proposal-create",
      "arguments": {...}
    }
  },
  "completion_tokens": 1500,
  "prompt_tokens": 800,
  "total_tokens": 2300
}
```

## Monitoring & Cost Optimization

**Token Usage Tracking:**

```python
# Track token usage per operation
def track_tokens(response, operation_name):
    tokens = response.usage.total_tokens
    cost = (tokens / 1000) * COST_PER_1K_TOKENS
    log_metrics(operation_name, tokens, cost)
    return cost

# Calculate cost for bulk operations
def estimate_batch_cost(num_proposals, avg_tokens_per=2000):
    total_tokens = num_proposals * avg_tokens_per
    return (total_tokens / 1000) * COST_PER_1K_TOKENS
```

**Performance Optimization:**

- Use gpt-3.5-turbo for simple quote generation
- Use gpt-4-turbo for complex proposal analysis and negotiation
- Cache function definitions to reduce prompt tokens
- Consider streaming for large proposals to improve perceived latency

## Advanced Scenarios

**Proposal Comparison:**

```python
# Generate multiple proposal variations
variations = []
for pricing_strategy in ["competitive", "premium", "value-based"]:
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[{
            "role": "user",
            "content": f"Create proposal using {pricing_strategy} strategy for {client_name}"
        }],
        functions=[...]
    )
    variations.append(process_response(response))

# Return all variations for client review
return {"variations": variations}
```

**Client Feedback Integration:**

```python
# Refine proposal based on client feedback
def refine_proposal(original_proposal, client_feedback):
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[
            {
                "role": "user",
                "content": f"Original proposal: {original_proposal}"
            },
            {
                "role": "assistant",
                "content": "Proposal created successfully"
            },
            {
                "role": "user",
                "content": f"Client feedback: {client_feedback}. Please revise."
            }
        ],
        functions=[...]
    )
    return process_response(response)
```

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology (provider-agnostic)
- [tools.json](./tools.json) – Complete function definitions and schemas
- [AGENT.md](../AGENT.md) – Full agent specification

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
