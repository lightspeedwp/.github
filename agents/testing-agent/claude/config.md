---
file_type: configuration
title: Testing Agent — Claude Provider Configuration
description: 'Claude provider configuration for the Testing Agent: model selection, token limits, temperature settings, caching strategy, cost optimization, and best practices for Playwright test generation and validation.'
last_updated: '2026-08-21'
domain: testing
tags:
  - claude
  - configuration
  - testing-agent
  - multi-provider
---

# Testing Agent — Claude Provider Configuration

Configuration guide for deploying the Testing Agent with Claude as the LLM provider.
Covers model selection, token budgets, caching, costs, and best practices for
production use.

## Overview

Claude is recommended for the Testing Agent due to:

- Strong multi-modal understanding (Figma design context, code screenshots)
- Extended thinking capability for complex requirement analysis
- Structured output support (test packs, requirement matrices)
- Superior reasoning for edge-case identification and traceability

## Model Selection

### Recommended Models

| Model | Use Case | Max Input | Max Output | Latency | Cost (1M input) |
|-------|----------|-----------|------------|---------|-----------------|
| **claude-opus-5** (latest) | Default; best for complex analysis | 200K | 4K | ~3s | $15 |
| claude-sonnet-5 | Balanced; faster for simple packs | 200K | 4K | ~1s | $3 |
| claude-opus-4-8 | Fallback; still recommended | 200K | 2K | ~2s | $15 |

### Selection Guidance

**Use Opus 5 if:**

- Analyzing multi-page design specs or large requirements documents
- Performing extended-thinking requirement extraction (complex multi-step logic)
- Working with multiple concurrent sources (PRD + Figma + API docs)
- Budget allows (~$0.01–0.03 per test pack run)

**Use Sonnet 5 if:**

- Running simple, single-flow test packs
- Speed is critical (sub-2s latency required)
- Volume is high (>50 packs/day) and budget is constrained
- Cost per run is primary concern

**Never use:**

- Older Claude 3 models (claude-3-opus, -sonnet, -haiku)—discontinuing in Q2 2025
- Claude Instant—does not support structured output or extended thinking

## Token Budget & Limits

### Per-Request Allocation

Test pack runs typically use:

- **Input**: 2–8K tokens
  - Prompt + core configuration: 1–2K
  - Requirements sources (PRD, wireframes, API docs): 1–4K
  - Figma metadata (if included): 0–2K
- **Output**: 0.5–2K tokens
  - Human-readable test pack: 0.2–1K
  - Traceability matrix: 0.3–1K

**Recommended limits:**

- Per request: 200K input, 4K output (Opus) / 3K output (Sonnet)
- Per day (high volume): 50–100M input tokens (monitor costs)

### Cache Configuration

Use Claude's prompt caching to reduce costs on repeated runs (save ~90% on cache
hits after first request). Cache the static portions:

```
Input Cache Layer 1 (Core Prompt):
  - agents/testing-agent/shared/core-prompt.md (~1.2K tokens)
  - Shared validators and rules (~0.5K tokens)
  - Replay overhead reduction: 30–40%

Input Cache Layer 2 (Framework Config):
  - Provider-specific guardrails, response formats (~0.3K tokens)
  - Replay overhead reduction: 10–15%
```

**Cache hit probability:**

- Same framework, similar scope: >85% (typical)
- Same test type, similar context: ~70%
- Across different projects: ~30%

**Cache cost per run (with caching enabled):**

- Cache write (first run): ~$0.003 per 1K input
- Cache read (subsequent runs): ~$0.0003 per 1K input
- Break-even: ~10 identical requests

Enable caching via API:

```python
# Claude API
client.messages.create(
  model="claude-opus-5",
  system=[
    {"type": "text", "text": core_prompt},
    {"type": "text", "text": provider_config, "cache_control": {"type": "ephemeral"}}
  ],
  messages=[{"role": "user", "content": request}]
)
```

## Temperature & Sampling

### Settings

| Config | Setting | Reasoning |
|--------|---------|-----------|
| **Test pack generation** | temperature: 0.3 | Consistent, reproducible test cases; minimize hallucination |
| **Requirement extraction** | temperature: 0.5 | Balance creativity (catch implicit requirements) vs. consistency |
| **Edge-case brainstorm** | temperature: 0.7 | Higher creativity; let Claude suggest novel test scenarios |
| **Failure triage** | temperature: 0.2 | Deterministic analysis of actual error messages |

### Top-K & Top-P

- **top_p**: 0.9 (default; good for focused reasoning)
- **top_k**: Not typically set for Claude (uses default nucleus sampling)

## Cost Optimization

### Strategies

1. **Batch API (when available)**
   - Cost reduction: 50% off standard pricing
   - Latency: Asynchronous, 24–48 hour turnaround
   - Use case: Off-hours test pack generation, bulk migrations
   - Example: 100 test packs at 5K input each = $0.375 instead of $0.75

2. **Request Consolidation**
   - Combine related extractions into a single request
   - Reduce context-switching overhead
   - Example: Requirement extraction + Figma context in one call

3. **Smart Caching** (see above)
   - Cache framework configs, shared rules
   - 70–90% cost reduction on repeat scenarios

4. **Model Downgrade Routing**
   - Run Sonnet 5 for simple, single-flow packs
   - Fall back to Opus 5 only for complex multi-source analysis
   - Example: 60% Sonnet, 40% Opus = ~40% cost savings

### Monthly Cost Estimate (Production)

Assumptions: 50 test packs/day, 60% Sonnet + 40% Opus, caching enabled

```
Sonnet baseline: 5K input × 0.5K output × $3/$12 per 1M = $0.025/run × 30 × 40 = $30
Opus baseline: 8K input × 1K output × $15/$60 per 1M = $0.18/run × 30 × 20 = $108
Caching reduction (70% hit rate): $138 × 0.3 = $41.40

Estimated monthly: $41.40 (optimized) — $138 (baseline)
```

## Extended Thinking

### When to Enable

Extended thinking is recommended for:

- **Requirement extraction from ambiguous sources** — conflicting specs, contradictory
  requirements
- **Edge-case identification** — brainstorming negative paths, boundary conditions
- **Traceability matrix validation** — checking for uncovered gaps across sources
- **Failure root-cause analysis** — diagnosing flaky tests or environment-specific issues

Cost: ~3× the input tokens (cache does apply to thinking overhead). Latency: +1–2s.

### Usage Example

```python
client.messages.create(
  model="claude-opus-5",
  max_tokens=16000,
  thinking={
    "type": "enabled",
    "budget_tokens": 10000  # Reserve 10K for thinking, leave 6K for output
  },
  messages=[
    {"role": "user", "content": requirement_conflicts}
  ]
)
```

When extended thinking is used, only the **visible output** (after the `</thinking>`
tag) is part of the final response—never expose the thinking block to end users.

## Integration Patterns

### Claude API (Server-Side)

```python
from anthropic import Anthropic

client = Anthropic()

# Persistent conversation with multi-turn test pack refinement
conversation = []

def generate_test_pack(requirement_sources):
    conversation.append({
        "role": "user",
        "content": f"Generate a test pack for: {requirement_sources}"
    })
    
    response = client.messages.create(
        model="claude-opus-5",
        max_tokens=4000,
        system=SYSTEM_PROMPT,
        messages=conversation
    )
    
    assistant_message = response.content[0].text
    conversation.append({"role": "assistant", "content": assistant_message})
    
    return assistant_message
```

### Claude Code (Interactive)

Use Claude Code desktop/web app:

1. Paste requirements and design context
2. Claude generates test pack interactively
3. Refine via conversation ("Add edge case for X", "Clarify this requirement")
4. Copy final pack to `.github/reports/test-packs/`

### GitHub Actions Integration

```yaml
test-generation:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: node scripts/generate-test-pack.js
      env:
        ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Guardrails & Safety

### Do

✅ Use environment variables for all secrets, base URLs  
✅ Validate Figma contexts; disallow `file_key` in prompts  
✅ Sanitize requirement text to remove PII  
✅ Log all requests (without input/output) for audit  
✅ Set `max_tokens` and `timeout` on all requests  

### Don't

❌ Pass OAuth tokens or API keys in prompts  
❌ Include hardcoded URLs with credentials  
❌ Log full request/response to unencrypted systems  
❌ Run unbounded requests (always set max_tokens)  
❌ Assume consistent output—validate and retry on edge cases  

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Context length exceeded" | Input too large | Split across multiple requests; use batch API |
| Inconsistent test cases | Temperature too high | Lower temperature to 0.2–0.3 |
| Missing edge cases | Prompt too vague | Add explicit edge-case checklist to requirements |
| Slow responses | Opus + extended thinking | Switch to Sonnet for simple packs; reduce thinking budget |
| High cost | Frequent new calls, no caching | Enable prompt caching; consolidate requests |
| Hallucinated test steps | Model confusion | Provide clearer requirement statement; cite sources |

## Monitoring & Observability

### Key Metrics

- **Cost per test pack**: Target <$0.10 with Sonnet, <$0.20 with Opus
- **Cache hit rate**: Target >60% on production workloads
- **Response time**: Sonnet <2s, Opus <4s (includes API latency)
- **Success rate**: >95% (failures are primarily timeout or context-exceeded)

### Logging Template

```json
{
  "timestamp": "2026-08-18T10:30:00Z",
  "request_id": "req-abc123",
  "model": "claude-opus-5",
  "input_tokens": 5200,
  "output_tokens": 1150,
  "cache_creation_input_tokens": 0,
  "cache_read_input_tokens": 1200,
  "cost_usd": 0.089,
  "duration_ms": 2840,
  "status": "success"
}
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
