---
provider: 'openai'
agent_slug: 'client-website-discovery-assistant'
agent_name: 'Client Website Discovery Assistant (OpenAI)'
status: 'production'
version: '1.0.0'
created_date: '2026-07-22'
last_updated: '2026-07-23'
model_compatibility:
  - gpt-4
  - gpt-4-turbo
  - gpt-3.5-turbo
api_version: 'v1'
temperature: 0.7
top_p: 0.9
---

# Client Website Discovery Assistant — OpenAI Implementation

## Overview

The OpenAI implementation of the Client Website Discovery Assistant leverages OpenAI's GPT models with function calling to provide discovery analysis as stateless API-based services. This implementation is ideal for backend automation, batch processing, and integration into third-party systems.

OpenAI excels at:
- **Function Calling** – Structured API requests and responses for programmatic integration
- **Batch Processing** – Handle bulk discovery analyses via Batch API for cost optimization
- **Rapid Deployment** – Stateless operation; no session management required
- **Cost-Effective** – Pay-per-request pricing scales with volume; Batch API for 50% savings
- **Webhook Integration** – Trigger discovery from external systems (CRM, project management, etc.)

## Implementation Architecture

### Request Pattern

```
Client System → OpenAI API Request → Discovery Agent (GPT) → Function Call → Results → Response
```

**Example Request:**
```json
{
  "model": "gpt-4-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Conduct discovery audit for acme-website.com. Competitors: competitor-a.com, competitor-b.com. Focus: UX, Performance, SEO."
    }
  ],
  "functions": [
    {
      "name": "website-analyzer",
      "description": "Comprehensive website audit",
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
        "content": "I'll conduct a comprehensive discovery audit...",
        "function_call": {
          "name": "website-analyzer",
          "arguments": "{\"websiteUrl\": \"acme-website.com\", ...}"
        }
      }
    }
  ]
}
```

## Function Calling Integration

All discovery operations are exposed as OpenAI functions defined in [tools.json](./tools.json):

1. **website-analyzer** – Comprehensive multi-dimensional website audit
2. **seo-auditor** – On-page, technical, and content strategy audit
3. **performance-tester** – Core Web Vitals and optimization analysis
4. **ux-assessor** – UX, usability, and accessibility evaluation
5. **competitor-analyzer** – Comparative analysis against competitors
6. **accessibility-auditor** – WCAG 2.2 AA compliance audit
7. **report-generator** – Professional report generation and export
8. **recommendation-engine** – Prioritize recommendations; create roadmap

## Python SDK Integration

```python
import openai
import json

# Load function definitions
with open('tools.json') as f:
    tools = json.load(f)['tools']

# Create API request with function calling
response = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=[
        {
            "role": "user",
            "content": "Conduct discovery audit: acme-website.com, competitors: competitor-a.com, competitor-b.com, focus: UX, Performance, SEO"
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
    result = execute_discovery_function(function_name, function_args)
    
    # Send result back to GPT for completion
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "user", "content": "Conduct discovery audit..."},
            {"role": "assistant", "content": response.choices[0].message.content, 
             "function_call": {"name": function_name, "arguments": json.dumps(function_args)}},
            {"role": "function", "name": function_name, "content": json.dumps(result)}
        ],
        functions=[...]
    )
    
    # Return final response
    return response.choices[0].message.content
```

## Batch Processing API

For high-volume discovery (10+ websites), use OpenAI's Batch API for 50% cost savings:

```python
import jsonl
import time

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
                    "content": f"Conduct discovery: {client_data['website']}, competitors: {', '.join(client_data['competitors'])}"
                }
            ],
            "functions": [...]
        }
    })

# Write batch file
with open("discovery_batch.jsonl", "w") as f:
    for item in batch_file:
        f.write(json.dumps(item) + "\n")

# Upload and submit batch
with open("discovery_batch.jsonl", "rb") as f:
    batch = client.beta.batches.create(
        input_file=f,
        endpoint="/v1/chat/completions"
    )

# Poll for completion (typically 1-24 hours)
while True:
    batch_status = client.beta.batches.retrieve(batch.id)
    print(f"Batch status: {batch_status.status}")
    
    if batch_status.status == "completed":
        break
    
    time.sleep(60)  # Check every minute

# Retrieve results
results = client.beta.batches.results(batch.id)
for result in results:
    client_id = result["custom_id"]
    response = result["response"]["body"]
    discovery_findings = process_discovery_response(response)
    save_discovery_report(client_id, discovery_findings)
```

## Webhook Integration

Trigger discovery from external systems (CRM, project management, automation platforms):

```python
from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

@app.route("/webhook/discovery-request", methods=["POST"])
def handle_discovery_webhook():
    """Handle discovery request from external system"""
    
    # Parse incoming request
    data = request.json
    website_url = data.get("website_url")
    competitors = data.get("competitors", [])
    focus_areas = data.get("focus_areas", ["ux", "performance", "seo"])
    business_context = data.get("business_context", "")
    callback_url = data.get("callback_url")  # Optional: webhook callback
    
    try:
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "user",
                    "content": f"""Conduct comprehensive discovery audit:
                    Website: {website_url}
                    Competitors: {', '.join(competitors)}
                    Focus Areas: {', '.join(focus_areas)}
                    Business Context: {business_context}
                    """
                }
            ],
            functions=[...]
        )
        
        # Process response
        discovery_report = process_discovery_response(response)
        
        # Store in database
        discovery_id = save_discovery_report(
            website_url=website_url,
            competitors=competitors,
            findings=discovery_report
        )
        
        # If callback URL provided, send result back
        if callback_url:
            notify_webhook(callback_url, {
                "discovery_id": discovery_id,
                "website_url": website_url,
                "status": "completed",
                "findings": discovery_report
            })
        
        return jsonify({
            "status": "success",
            "discovery_id": discovery_id,
            "message": "Discovery audit completed"
        })
    
    except Exception as e:
        # Handle errors
        error_message = str(e)
        
        if callback_url:
            notify_webhook(callback_url, {
                "website_url": website_url,
                "status": "error",
                "error": error_message
            })
        
        return jsonify({
            "status": "error",
            "error": error_message
        }), 400

@app.route("/discovery/<discovery_id>", methods=["GET"])
def get_discovery_report(discovery_id):
    """Retrieve discovery report by ID"""
    report = load_discovery_report(discovery_id)
    
    if not report:
        return jsonify({"error": "Discovery not found"}), 404
    
    # Support multiple output formats
    format = request.args.get("format", "json")  # json, pdf, html, markdown
    
    if format == "pdf":
        return generate_pdf_report(report)
    elif format == "html":
        return generate_html_report(report)
    elif format == "markdown":
        return generate_markdown_report(report)
    else:
        return jsonify(report)

def process_discovery_response(response):
    """Convert OpenAI response to structured discovery report"""
    # Implementation: parse function call results and format as discovery report
    pass

def save_discovery_report(website_url, competitors, findings):
    """Store discovery report in database"""
    # Implementation: save to database, return report ID
    pass

def notify_webhook(callback_url, payload):
    """Send webhook notification to external system"""
    import requests
    requests.post(callback_url, json=payload)

if __name__ == "__main__":
    app.run(port=5000)
```

## Error Handling

**Function Call Parsing Errors:**
- Validate JSON in function arguments before execution
- Return detailed error message to GPT for recovery
- GPT will retry with corrected parameters

**API Rate Limits:**
- Implement exponential backoff retry logic
- Use batch API for volume operations to avoid rate limits
- Monitor token usage and billing per request
- Implement request queuing for high-volume scenarios

**Invalid Parameters:**
- Function schema validation catches most errors before execution
- GPT typically self-corrects invalid parameters
- Return descriptive error messages for manual review

**Website Accessibility:**
- Handle timeouts gracefully (note in findings)
- Suggest alternative analysis approach
- Return partial results with caveats

**Missing or Incomplete Data:**
- Make reasonable assumptions
- Document assumptions in findings
- Flag for manual review if critical data missing

## Response Format

OpenAI returns structured responses:

```json
{
  "id": "chatcmpl-8Ov...",
  "object": "chat.completion",
  "created": 1699999999,
  "model": "gpt-4-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "I've completed a comprehensive discovery audit for acme-website.com...",
        "function_call": {
          "name": "website-analyzer",
          "arguments": "{\"websiteUrl\": \"acme-website.com\", ...}"
        }
      },
      "finish_reason": "function_call"
    }
  ],
  "usage": {
    "prompt_tokens": 850,
    "completion_tokens": 1200,
    "total_tokens": 2050
  }
}
```

## Deployment Considerations

- **Scalability** – Stateless design supports horizontal scaling
- **Cost Optimization** – Use Batch API for volume; streaming for real-time
- **Security** – Validate all inputs; don't expose API keys in client requests
- **Monitoring** – Track API usage, token counts, error rates, latency
- **Caching** – Cache discovery results for same websites to reduce API calls
- **Rate Limiting** – Implement backoff for API rate limits

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology (provider-agnostic)
- [tools.json](./tools.json) – Complete function definitions and schemas
- [AGENT.md](../AGENT.md) – Full agent specification
- [README.md](../README.md) – Quick reference guide

---

*Built by 🧱 LightSpeedWP and ☕ Claude Code.*
