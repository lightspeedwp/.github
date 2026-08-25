# Testing Agent — OpenAI Provider Configuration

Configuration guide for deploying the Testing Agent with OpenAI as the LLM provider.
Covers API setup, model selection, rate limiting, batch processing, cost tracking,
and best practices for production environments.

## Overview

OpenAI is recommended for:

- **Cost-conscious deployments** — GPT-4o mini offers excellent price/performance
- **Server-side integration** — REST API works anywhere (no SDK dependency)
- **Batch processing** — Large-volume test generation at 50% discount
- **Function calling** — Structured outputs via OpenAI function schema format
- **Advanced reasoning** — o1 models for complex requirement analysis

Use OpenAI for CI/CD pipeline integration, bulk test migrations, and cost-optimized
production deployments.

## API Setup

### Prerequisites

- OpenAI API key (from <https://platform.openai.com/api-keys>)
- Billing account with sufficient credits or payment method on file
- Python 3.8+ OR Node.js 14+ (for SDK)

### Authentication

1. **Obtain API Key**
   - Visit <https://platform.openai.com/api-keys>
   - Create new secret key
   - Copy and store securely (never commit to version control)

2. **Environment Configuration**

   ```bash
   # .env.local (git-ignored)
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   OPENAI_ORG_ID=org-xxxxxxxxxxxxxxxxxxxxxxxx  # Optional; if using org accounts
   ```

3. **Verify Setup**

   ```bash
   # Quick test
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

### SDK Installation

**Python:**

```bash
pip install openai
```

**Node.js:**

```bash
npm install openai
```

**Go:**

```bash
go get github.com/sashabaranov/go-openai
```

## Model Selection

### Recommended Models for Testing

| Model | Latency | Input Cost | Output Cost | Best For |
|-------|---------|-----------|------------|----------|
| **gpt-4o** | ~2s | $5/1M | $15/1M | Complex analysis, edge cases |
| **gpt-4o-mini** | ~1s | $0.15/1M | $0.60/1M | Cost-optimized test packs |
| **o1** | ~30s | $15/1M | $60/1M | Multi-step reasoning, edge cases |
| **o1-mini** | ~10s | $3/1M | $12/1M | Faster reasoning than o1 |

### Selection Guidance

**Use gpt-4o-mini if:**

- Budget is primary concern (80% cheaper than gpt-4o)
- Test packs are simple or single-flow
- Volume is high (>500 test packs/month)
- Latency acceptable for batch jobs

**Use gpt-4o if:**

- Analyzing complex, multi-flow requirements
- Multiple concurrent sources (PRD + API + design specs)
- Latency critical (<3s required)
- Budget allows (~$0.01–0.03 per test pack)

**Use o1 / o1-mini if:**

- Identifying deep edge cases or security-sensitive scenarios
- Requirements are ambiguous or contradictory
- Need verification of complex test logic
- Willing to accept 10–30s latency for better results

**Avoid:**

- Older models (gpt-3.5-turbo, davinci, curie)—deprecating in Q1 2025
- Base models (gpt-4-base)—require manual fine-tuning

## Token Budget & Rate Limiting

### Per-Request Allocation

Test pack runs typically use:

- **Input**: 1–5K tokens
  - Prompt + configuration: 0.5–1K
  - Requirements sources: 0.5–2K
  - Design context: 0–1K
- **Output**: 0.3–1.5K tokens
  - Test cases and assertions: 0.2–1K
  - Traceability matrix: 0.1–0.5K

### Rate Limits

OpenAI enforces rate limits based on your plan:

| Plan | Requests/min | Tokens/min | Notes |
|------|-------------|-----------|-------|
| Free trial | 3 | 90K | Shared with all models |
| Pay-as-you-go | 200 | 90K | Per-model limits; increases at $100+ spend |
| Pro | 500 | 200K | $20/mo; increases at $100+ spend |
| Enterprise | Custom | Custom | Contact sales for custom limits |

### Handling Rate Limits

Implement exponential backoff:

**Python:**

```python
import time
import openai

def call_with_retry(messages, max_retries=5):
    for attempt in range(max_retries):
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=messages,
                timeout=30
            )
            return response
        except openai.error.RateLimitError as e:
            wait_time = (2 ** attempt) + random.random()
            print(f"Rate limited. Waiting {wait_time}s...")
            time.sleep(wait_time)
    raise Exception("Max retries exceeded")
```

**Node.js:**

```javascript
const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function callWithRetry(messages, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        timeout: 30000
      });
      return response;
    } catch (error) {
      if (error.status === 429) {
        const waitTime = (Math.pow(2, attempt) + Math.random()) * 1000;
        console.log(`Rate limited. Waiting ${waitTime}ms...`);
        await new Promise(r => setTimeout(r, waitTime));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries exceeded");
}
```

### Quota Monitoring

Monitor your usage to avoid surprise overage:

1. **OpenAI Dashboard**
   - <https://platform.openai.com/account/billing/overview>
   - Set spending limit: Settings → Billing → Usage limits

2. **Programmatic Monitoring**

   ```python
   # Check remaining quota
   response = openai.models.list()
   available_models = [m.id for m in response.data]
   print(available_models)
   ```

3. **Usage Alerts** (Optional)
   - Set soft limit at 80% of budget
   - Set hard limit at 100%
   - OpenAI will email when limits approached

## Batch Processing

### When to Use Batch API

Use batch API when:

- Generating >20 test packs in one go
- Latency is not critical (24–48 hour turnaround acceptable)
- **Cost savings are important** (50% discount)

Avoid batch API for:

- Interactive workflows (user waiting for response)
- Time-sensitive requirements

### Batch API Setup

1. **Prepare batch file** (JSONL format)

   ```json
   {"custom_id": "test-pack-001", "params": {"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "Generate test pack..."}]}}
   {"custom_id": "test-pack-002", "params": {"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "Generate test pack..."}]}}
   ```

2. **Submit batch**

   ```python
   with open("batch.jsonl") as f:
       batch = openai.Batch.create(
           input_file=f,
           endpoint="/v1/chat/completions"
       )
   print(batch.id)  # Use for tracking
   ```

3. **Monitor progress**

   ```python
   batch_status = openai.Batch.retrieve(batch.id)
   print(f"Status: {batch_status.status}")
   print(f"Succeeded: {batch_status.request_counts.succeeded}")
   ```

4. **Retrieve results**

   ```python
   # Results available in 24–48 hours
   output_file_id = batch_status.output_file_id
   content = openai.Files.content(output_file_id)
   results = [json.loads(line) for line in content.text.split("\n")]
   ```

### Cost Savings Example

**Standard API:**

- 100 test packs × 3K input + 1K output = 400K tokens
- Cost: (3M × $0.15 + 0.1M × $0.60) / 1M × 100 = $48

**Batch API (50% discount):**

- Same workload, 50% cheaper = $24

## Cost Tracking

### Monitoring Costs

1. **Per-Request Logging**

   ```python
   import json
   from datetime import datetime
   
   def log_request(model, input_tokens, output_tokens):
       # Pricing per 1M tokens
       pricing = {
           "gpt-4o": {"input": 5, "output": 15},
           "gpt-4o-mini": {"input": 0.15, "output": 0.60}
       }
       p = pricing[model]
       cost = ((input_tokens * p["input"] + output_tokens * p["output"]) / 1_000_000)
       
       log_entry = {
           "timestamp": datetime.now().isoformat(),
           "model": model,
           "input_tokens": input_tokens,
           "output_tokens": output_tokens,
           "cost_usd": round(cost, 4)
       }
       
       with open("api_costs.jsonl", "a") as f:
           f.write(json.dumps(log_entry) + "\n")
   ```

2. **Monthly Reporting**

   ```python
   # Aggregate monthly costs
   import pandas as pd
   
   df = pd.read_json("api_costs.jsonl", lines=True)
   df["date"] = pd.to_datetime(df["timestamp"]).dt.date
   monthly = df.groupby("date")["cost_usd"].sum()
   print(monthly)
   ```

### Budget Allocation

Recommend allocating per-environment:

| Environment | Monthly Budget | Model | Volume |
|-------------|---------------|-------|--------|
| Development | $50 | gpt-4o-mini | 500 packs/mo |
| Staging | $100 | gpt-4o-mini (+ gpt-4o for complex) | 2,000 packs/mo |
| Production | $500 | Optimized mix (80% mini, 20% 4o) | 10,000+ packs/mo |

## Integration Patterns

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Generate Test Packs
on:
  workflow_dispatch:
    inputs:
      requirement_file:
        description: "Path to requirement file"
        required: true

jobs:
  generate-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install openai
      
      - name: Generate test pack
        run: node scripts/generate-test-pack.js
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          REQUIREMENT_FILE: ${{ github.event.inputs.requirement_file }}
      
      - name: Upload test pack
        uses: actions/upload-artifact@v3
        with:
          name: test-packs
          path: .github/reports/test-packs/
```

### Direct API Call (No SDK)

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "system",
        "content": "You are a test automation expert..."
      },
      {
        "role": "user",
        "content": "Generate a test pack for..."
      }
    ],
    "temperature": 0.3,
    "max_tokens": 2000
  }'
```

### Structured Output (Function Calling)

Use OpenAI's function calling for deterministic test pack format:

```python
response = openai.ChatCompletion.create(
    model="gpt-4o-mini",
    messages=messages,
    tools=[{
        "type": "function",
        "function": {
            "name": "create_test_pack",
            "parameters": {
                "type": "object",
                "properties": {
                    "requirements": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string"},
                                "statement": {"type": "string"}
                            }
                        }
                    },
                    "test_cases": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string"},
                                "steps": {"type": "array", "items": {"type": "string"}}
                            }
                        }
                    }
                }
            }
        }
    }],
    tool_choice={"type": "function", "function": {"name": "create_test_pack"}}
)

# Extract structured output
result = json.loads(response.choices[0].message.tool_calls[0].function.arguments)
```

## Security & Best Practices

### Do

✅ Store API keys in environment variables or secrets manager  
✅ Rotate API keys periodically (monthly recommended)  
✅ Use org ID to separate billing/access per team  
✅ Log API usage for audit and cost tracking  
✅ Validate all responses before storing or using  
✅ Set `max_tokens` to prevent runaway costs  
✅ Use timeout on requests (30s recommended)  

### Don't

❌ Commit API keys to version control  
❌ Pass secrets in test packs or prompts  
❌ Make requests without authentication  
❌ Log full responses containing potentially sensitive data  
❌ Use API keys in client-side code (JavaScript in browser)  
❌ Set unreasonably high `max_tokens` without limits  
❌ Disable timeouts (risk of hanging requests)  

## Monitoring & Observability

### Key Metrics

- **Cost per test pack**: Target $0.01 with mini, <$0.05 with 4o
- **Success rate**: >98% (failures usually timeout or invalid request)
- **Avg latency**: <2s for mini, <3s for 4o
- **Error rate**: <2% (rate limits, auth errors, context exceeded)

### Logging Template

```json
{
  "timestamp": "2026-08-18T10:30:00Z",
  "request_id": "req-abc123",
  "model": "gpt-4o-mini",
  "input_tokens": 3200,
  "output_tokens": 850,
  "total_tokens": 4050,
  "cost_usd": 0.0063,
  "latency_ms": 1850,
  "status": "success",
  "error": null
}
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid API key | Verify `OPENAI_API_KEY` is correct; check for typos |
| 429 Rate Limited | Hit request/token limit | Implement exponential backoff; check quota |
| 400 Bad Request | Invalid model or parameters | Verify model name is current; check required fields |
| Timeout | API slow or request too large | Reduce `max_tokens`; split large requests; retry |
| Cost higher than expected | Sending large inputs | Log tokens per request; optimize prompts |
| Empty response | Context exhaustion | Reduce input size; check max_tokens setting |

## Migrating from Claude to OpenAI

If switching from Claude:

1. **Update prompts** — OpenAI expects different prompt structure
2. **Test function calls** — Verify structured output format
3. **Adjust temperature** — OpenAI may need different settings
4. **Monitor costs** — Compare gpt-4o-mini vs. claude-sonnet pricing
5. **Validate output** — Test packs may differ; review quality

Example cost comparison:

```
Claude Opus:  $15/1M input  → ~$0.10 per test pack
OpenAI 4o:   $5/1M input   → ~$0.03 per test pack  ← 70% cheaper
OpenAI mini: $0.15/1M input → ~$0.001 per test pack ← 99% cheaper
```

## Support & Limits

- **Support**: <https://help.openai.com> or <help@openai.com>
- **Status**: <https://status.openai.com>
- **Community**: OpenAI Forum (community.openai.com)
- **Billing support**: <https://platform.openai.com/account/billing/overview>

---

*Maintained by the 🤖 LightSpeedWP Automation Team* · [📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
