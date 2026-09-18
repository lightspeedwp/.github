---
title: OpenAI Setup Guide
description: Configure the PRD agent for use with OpenAI Codex
created: 2026-09-17
---

# OpenAI Setup Guide

This guide walks you through configuring the consolidated PRD agent for use with OpenAI's Codex API.

## Overview

If your organisation uses OpenAI's API directly (for Codex, GPT-4, or other models), you can integrate the PRD agent into your custom tools and workflows.

**Recommended for:**

- Teams with OpenAI API licenses
- Custom build environments using OpenAI models
- Integration with existing OpenAI-based tooling
- Advanced automation and scripting

## Prerequisites

- OpenAI API key ([get one here](https://platform.openai.com/account/api-keys))
- Access to the LightSpeed .github repository
- Familiarity with OpenAI API integration (this guide assumes basic API knowledge)
- A custom tool or wrapper for invoking the agent

## Installation Steps

### Step 1: Locate the Agent File

The PRD agent is stored in the LightSpeed .github repository:

```
agents/prd-agent/openai/
```

**Repository**: <https://github.com/lightspeedwp/.github>  
**Branch**: `develop` (or latest)

### Step 2: Extract Agent Configuration

The agent configuration includes:

- **System prompt**: The core instructions that guide PRD generation
- **Supported tools/functions**: What the agent can do
- **Model configuration**: Recommended model and parameters

Download or copy the agent specification:

```bash
# Download the agent files from GitHub
# Option 1: Clone the entire repository
git clone https://github.com/lightspeedwp/.github.git
cd .github/agents/prd-agent/openai/

# Option 2: Download individual files using curl
curl -o agent.md https://raw.githubusercontent.com/lightspeedwp/.github/develop/agents/prd-agent/openai/agent.md
curl -o tools.json https://raw.githubusercontent.com/lightspeedwp/.github/develop/agents/prd-agent/openai/tools.json

# Or manually navigate to:
# https://github.com/lightspeedwp/.github/tree/develop/agents/prd-agent/openai/
```

### Step 3: Integrate with Your Tool

How you integrate depends on your setup:

#### Option A: OpenAI Function Calling (Recommended)

If you're using OpenAI's [function calling](https://platform.openai.com/docs/guides/function-calling) feature:

1. **Extract the agent's system prompt** from the configuration
2. **Define function schemas** for any external tools the agent needs (e.g., saving PRDs to a database)
3. **Create an API call** with the system prompt and functions:

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def call_prd_agent(user_request):
    response = client.chat.completions.create(
        model="gpt-4",  # or gpt-3.5-turbo
        messages=[
            {
                "role": "system",
                "content": "You are the PRD Agent..."  # Use the full system prompt
            },
            {
                "role": "user",
                "content": user_request
            }
        ],
        tools=[
            # Define any external tools here
            # Example:
            # {
            #     "type": "function",
            #     "function": {
            #         "name": "save_prd",
            #         "description": "Save the PRD to your database",
            #         "parameters": {...}
            #     }
            # }
        ],
        temperature=0.7
    )
    return response.choices[0].message.content

# Usage
prd = call_prd_agent("Write a PRD for a new user authentication system")
print(prd)
```

#### Option B: Direct API Call

For a simpler approach, send the agent's prompt as context:

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {
            "role": "system",
            "content": """You are the PRD Agent. Your role is to help create structured, 
            actionable Product Requirements Documents (PRDs)..."""  # Paste the system prompt
        },
        {
            "role": "user",
            "content": "Write a PRD for [feature description]"
        }
    ]
)

print(response.choices[0].message.content)
```

#### Option C: Custom Tool Wrapper

Create a wrapper function that encapsulates the agent:

```python
import os
from openai import OpenAI

class PRDAgent:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.system_prompt = """You are the PRD Agent..."""  # Load from file or config
    
    def generate(self, request):
        """Generate a PRD from a user request."""
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": request}
            ],
            temperature=0.7
        )
        return response.choices[0].message.content

# Usage
agent = PRDAgent()
prd = agent.generate("Write a PRD for a new payment system")
```

### Step 4: Test the Integration

1. **Send a simple test request**:

   ```
   Write a brief PRD for a user login feature
   ```

2. **Verify the output** follows the standard PRD structure (see [best practices](./best-practices.md))

3. **Check for errors** or unexpected formatting

4. **Adjust parameters** if needed (temperature, model, prompt wording)

## Configuration & Best Practices

### Recommended Model & Parameters

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-4",              # Use gpt-4 for best quality; gpt-3.5-turbo for cost
    messages=[...],             # Your messages list
    temperature=0.7,            # Balanced creativity and consistency
    max_tokens=2000,            # PRDs are typically 500-1500 tokens
    top_p=0.95                  # Nucleus sampling for diversity
)
```

### System Prompt

The system prompt is critical. Load it from the agent configuration:

```
You are the PRD Agent, a specialized assistant for creating structured Product 
Requirements Documents (PRDs).

Your role is to:
1. Ask clarifying questions about features, user needs, and constraints
2. Guide the user through PRD creation
3. Produce a structured, actionable PRD following [standard structure]
...
```

See the full prompt in `agents/prd-agent/openai/` in the .github repository.

### Cost Optimization

- **Use gpt-3.5-turbo** for simple PRDs (cheaper, slightly lower quality)
- **Use gpt-4** for complex features or critical requirements (higher cost, better quality)
- **Cache system prompts** if making many calls to reduce API costs
- **Batch similar requests** to reduce function calling overhead

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid API key` | Wrong or expired API key | Check your API key in [OpenAI settings](https://platform.openai.com/account/api-keys) |
| `Rate limit exceeded` | Too many requests | Implement backoff/retry logic; upgrade your plan |
| `Model not available` | Using a model you don't have access to | Verify your model name; fall back to gpt-3.5-turbo |
| `Malformed system prompt` | Syntax error in the system prompt | Copy the prompt directly from the agent configuration; avoid edits |

### Retry Logic

```python
import time
from openai import RateLimitError

def call_with_retry(request, max_retries=3):
    for attempt in range(max_retries):
        try:
            return call_prd_agent(request)
        except RateLimitError:
            wait_time = 2 ** attempt  # Exponential backoff
            print(f"Rate limited. Waiting {wait_time}s before retry...")
            time.sleep(wait_time)
    raise Exception("Max retries exceeded")
```

## Advanced: Custom Functions

You can extend the agent with custom tools. For example, to save PRDs directly:

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def save_prd_function(prd_content, title):
    """Save PRD to your database."""
    # Your implementation: save to Linear, Notion, database, etc.
    return {"status": "saved", "id": f"prd-{title}"}

tools = [
    {
        "type": "function",
        "function": {
            "name": "save_prd",
            "description": "Save the generated PRD to your database",
            "parameters": {
                "type": "object",
                "properties": {
                    "prd_content": {"type": "string", "description": "The full PRD"},
                    "title": {"type": "string", "description": "PRD title"}
                },
                "required": ["prd_content", "title"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="gpt-4",
    messages=[...],
    tools=tools
)

# Handle tool calls...
```

## Security

- **Protect your API key**: Never commit it to Git; use environment variables

  ```bash
  export OPENAI_API_KEY="sk-..."
  ```

- **Data privacy**: OpenAI retains API data per their [usage policy](https://openai.com/policies/api-data-usage-policies)
- **Sensitive information**: Don't include credentials or private data in PRD requests
- See [LightSpeed security policy](https://github.com/lightspeedwp/.github/blob/develop/SECURITY.md)

## Troubleshooting

### Output quality is poor

**Solutions**:

1. Review [best practices](./best-practices.md) for input quality guidelines
2. Give the agent more context (user personas, constraints, example outputs)
3. Try gpt-4 instead of gpt-3.5-turbo for better quality
4. Adjust temperature (lower = more consistent, higher = more creative)

### Integration with my tool doesn't work

**Solutions**:

1. Verify your API key is valid and has access to the model you're using
2. Check that your system prompt is correctly copied from the agent configuration
3. Add logging/debugging to see what the API is returning
4. Test with a simple curl command first to isolate the issue:

   ```bash
   curl https://api.openai.com/v1/chat/completions \
     -H "Authorization: Bearer $OPENAI_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"gpt-4","messages":[...]}'
   ```

## Next Steps

- **Integrate with your tool**: See [Integration Guide](./integration-guide.md)
- **Create your first PRD**: See [Workflow](./workflow.md)
- **Learn best practices**: See [Best Practices](./best-practices.md)
- **Questions?** See [FAQ](./faq.md)

---

**Last Updated**: 2026-09-17  
**API Versions**: OpenAI Chat Completions API (gpt-3.5-turbo, gpt-4)  
**Agent Version**: v2.1  
**Questions?** Open an issue: [lightspeedwp/.github](https://github.com/lightspeedwp/.github/issues)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
