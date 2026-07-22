---
provider: 'claude'
agent_slug: 'pagespeed'
agent_name: 'PageSpeed Agent (Claude)'
status: 'production'
version: '1.0.0'
created_date: '2026-07-22'
last_updated: '2026-07-22'
model_compatibility:
  - claude-opus-4
  - claude-sonnet-4
  - claude-haiku-4
context_window: '200000'
token_limit: '200000'
temperature: 0.7
top_p: 0.9
---

# PageSpeed Agent — Claude Implementation

## Overview

The Claude implementation of the PageSpeed Agent leverages Claude's deep reasoning capabilities and extensive domain knowledge to provide expert assistance with performance testing and related workflows.

Claude excels at:

- **Comprehensive analysis** – Detailed examination of complex scenarios
- **Strategic thinking** – High-level planning and optimization
- **Documentation** – Creating clear, structured documentation
- **Communication** – Professional and empathetic responses
- **Problem-solving** – Identifying and resolving complex issues

## Available Tools

Claude has access to 8 specialized tools:

1. **pagespeed-analyzer** – Specialized tool for pagespeed workflows
2. **performance-tester** – Specialized tool for pagespeed workflows
3. **bottleneck-detector** – Specialized tool for pagespeed workflows
4. **optimization-recommender** – Specialized tool for pagespeed workflows
5. **caching-strategist** – Specialized tool for pagespeed workflows
6. **cdn-optimizer** – Specialized tool for pagespeed workflows
7. **image-optimizer** – Specialized tool for pagespeed workflows
8. **bundle-analyzer** – Specialized tool for pagespeed workflows

## Integration Patterns

All tools follow consistent request/response patterns with structured JSON payloads.

## Response Format

Claude structures responses with clear sections:

```markdown
# [Task Type] Result

## Summary
[Brief overview of results]

## Details
[Comprehensive analysis and findings]

## Recommendations
[Actionable next steps]

## Integration Notes
[How to use these results with other systems]
```

## Error Handling

- Validate all input parameters before processing
- Provide clear error messages with remediation steps
- Suggest fallback approaches when primary methods fail
- Log all operations for debugging and audit trails

## Best Practices

1. Always validate inputs before processing
2. Provide detailed explanations with results
3. Consider integration with other agents
4. Document assumptions and limitations
5. Include actionable recommendations

---

## Provider-Specific Notes

This agent uses Claude's capabilities for technical analysis and related expertise.
