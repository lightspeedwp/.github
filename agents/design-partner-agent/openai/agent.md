---
provider: openai
agent_slug: design-partner
agent_name: Design Partner Agent (OpenAI)
status: production
version: 1.0.2
model_compatibility:
  - gpt-4-turbo
  - gpt-4
  - gpt-4o
max_tokens: 128000
temperature: 0.7
top_p: 0.9
---

# Design Partner Agent — OpenAI Implementation

## Overview

The OpenAI implementation provides design partnership capabilities through the OpenAI API using function calling and the Assistants API, enabling integration with third-party applications and automation platforms.

## API Integration

### Assistants API

```javascript
const assistant = await openai.beta.assistants.create({
  name: "Design Partner Agent",
  description: "AI design consultant for Figma and design systems",
  model: "gpt-4-turbo",
  instructions: "You are an expert design consultant...",
  tools: designPartnerTools,
  metadata: {
    agent_slug: "design-partner",
    domain: "design",
    focus: "partner-collaboration"
  }
});
```

### Function Calling

Design Partner Agent uses OpenAI's function calling to interact with design tools:

```javascript
{
  "type": "function",
  "function": {
    "name": "figma_inspector",
    "description": "Inspect and analyze Figma design files",
    "parameters": {
      "type": "object",
      "properties": {
        "figma_url": {
          "type": "string",
          "description": "URL to Figma file"
        },
        "analysis_type": {
          "type": "string",
          "enum": ["component-inventory", "token-extraction", "accessibility-audit"]
        }
      },
      "required": ["figma_url", "analysis_type"]
    }
  }
}
```

## Function Definitions

The agent has access to 8 primary functions:

### 1. figma_inspector Function

```javascript
{
  "name": "figma_inspector",
  "description": "Inspect and analyze Figma design files",
  "parameters": {
    "type": "object",
    "properties": {
      "figma_url": {
        "type": "string",
        "description": "Direct URL to Figma file"
      },
      "analysis_type": {
        "type": "string",
        "enum": [
          "component-inventory",
          "token-extraction",
          "accessibility-audit",
          "responsive-check",
          "full-analysis"
        ]
      },
      "export_format": {
        "type": "string",
        "enum": ["json", "markdown", "yaml"],
        "default": "json"
      }
    },
    "required": ["figma_url", "analysis_type"]
  }
}
```

### 2. accessibility_auditor Function

```javascript
{
  "name": "accessibility_auditor",
  "description": "Perform WCAG 2.2 accessibility audit",
  "parameters": {
    "type": "object",
    "properties": {
      "design_file_id": {
        "type": "string"
      },
      "wcag_level": {
        "type": "string",
        "enum": ["A", "AA", "AAA"],
        "default": "AA"
      },
      "check_types": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    },
    "required": ["design_file_id"]
  }
}
```

### 3. token_extractor Function

```javascript
{
  "name": "token_extractor",
  "description": "Extract design tokens from Figma",
  "parameters": {
    "type": "object",
    "properties": {
      "figma_file_id": {
        "type": "string"
      },
      "token_categories": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["colors", "typography", "spacing", "shadows", "borders", "effects"]
        },
        "default": ["colors", "typography", "spacing"]
      },
      "export_formats": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["json", "css", "scss", "javascript", "tailwind"]
        },
        "default": ["json"]
      }
    },
    "required": ["figma_file_id"]
  }
}
```

### 4. component_analyzer Function

```javascript
{
  "name": "component_analyzer",
  "description": "Analyze component structure and variants",
  "parameters": {
    "type": "object",
    "properties": {
      "figma_file_id": {
        "type": "string"
      },
      "component_filter": {
        "type": "string",
        "description": "Filter to specific components (wildcards supported)"
      },
      "analysis_depth": {
        "type": "string",
        "enum": ["shallow", "standard", "deep"],
        "default": "standard"
      },
      "include_usage": {
        "type": "boolean",
        "default": true
      }
    },
    "required": ["figma_file_id"]
  }
}
```

### 5. design_documentation_generator Function

```javascript
{
  "name": "design_documentation_generator",
  "description": "Generate design component documentation",
  "parameters": {
    "type": "object",
    "properties": {
      "component_id": {
        "type": "string"
      },
      "documentation_type": {
        "type": "string",
        "enum": ["specification", "usage-guide", "code-examples", "decision-record", "complete"],
        "default": "complete"
      },
      "include_sections": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "output_format": {
        "type": "string",
        "enum": ["markdown", "html", "json"],
        "default": "markdown"
      }
    },
    "required": ["component_id"]
  }
}
```

### 6. contrast_checker Function

```javascript
{
  "name": "contrast_checker",
  "description": "Verify color contrast ratios against WCAG standards",
  "parameters": {
    "type": "object",
    "properties": {
      "foreground_color": {
        "type": "string",
        "description": "Hex color code"
      },
      "background_color": {
        "type": "string",
        "description": "Hex color code"
      },
      "element_type": {
        "type": "string",
        "enum": ["text", "icon", "interactive"],
        "default": "text"
      },
      "wcag_level": {
        "type": "string",
        "enum": ["A", "AA", "AAA"],
        "default": "AA"
      }
    },
    "required": ["foreground_color", "background_color"]
  }
}
```

### 7. responsive_validator Function

```javascript
{
  "name": "responsive_validator",
  "description": "Test responsive design across breakpoints",
  "parameters": {
    "type": "object",
    "properties": {
      "figma_file_id": {
        "type": "string"
      },
      "breakpoints": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "default": ["320", "768", "1024", "1440"]
      },
      "device_types": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["mobile", "tablet", "desktop"]
        },
        "default": ["mobile", "tablet", "desktop"]
      },
      "check_types": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "default": ["layout", "typography", "spacing"]
      }
    },
    "required": ["figma_file_id"]
  }
}
```

### 8. code_connect_mapper Function

```javascript
{
  "name": "code_connect_mapper",
  "description": "Create Code Connect maps for design-to-code workflows",
  "parameters": {
    "type": "object",
    "properties": {
      "figma_component_id": {
        "type": "string"
      },
      "code_component_path": {
        "type": "string"
      },
      "framework": {
        "type": "string",
        "enum": ["react", "vue", "angular", "web-components", "figma-plugin"],
        "default": "react"
      },
      "mapping_type": {
        "type": "string",
        "enum": ["one-to-one", "one-to-many", "auto-detect"],
        "default": "auto-detect"
      },
      "include_props_mapping": {
        "type": "boolean",
        "default": true
      }
    },
    "required": ["figma_component_id", "code_component_path"]
  }
}
```

## API Usage Examples

### Design System Audit via API

```bash
curl -X POST https://api.openai.com/v1/threads/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "assistant_id": "asst_design_partner",
    "messages": [{
      "role": "user",
      "content": "Audit our design system in https://figma.com/file/abc123. Check component consistency and accessibility."
    }]
  }'
```

### Function Call Response Format

```javascript
{
  "id": "run_xyz",
  "object": "thread.run",
  "status": "requires_action",
  "required_action": {
    "type": "submit_tool_outputs",
    "submit_tool_outputs": {
      "tool_calls": [{
        "id": "call_123",
        "type": "function",
        "function": {
          "name": "figma_inspector",
          "arguments": "{\"figma_url\":\"https://figma.com/file/abc123\",\"analysis_type\":\"full-analysis\"}"
        }
      }]
    }
  }
}
```

### Submitting Tool Results

```bash
curl -X POST https://api.openai.com/v1/threads/runs/run_xyz/submit_tool_outputs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tool_outputs": [{
      "tool_call_id": "call_123",
      "output": "{\"components\": [...], \"tokens\": {...}}"
    }]
  }'
```

## Response Format

OpenAI API responses follow this format:

```javascript
{
  "id": "msg_xyz",
  "object": "thread.message",
  "created_at": 1234567890,
  "thread_id": "thread_123",
  "role": "assistant",
  "content": [{
    "type": "text",
    "text": "# Design System Audit Report\n\n## Findings\n..."
  }],
  "assistant_id": "asst_design_partner",
  "run_id": "run_xyz",
  "file_ids": []
}
```

## Configuration

```json
{
  "agent_config": {
    "provider": "openai",
    "model": "gpt-4-turbo",
    "api_version": "2024-01-01",
    "assistant_id": "asst_design_partner",
    "max_tokens": 128000,
    "temperature": 0.7,
    "top_p": 0.9,
    "functions": [
      "figma_inspector",
      "accessibility_auditor",
      "token_extractor",
      "component_analyzer",
      "design_documentation_generator",
      "contrast_checker",
      "responsive_validator",
      "code_connect_mapper"
    ],
    "integrations": {
      "figma": {
        "api_key": "${FIGMA_API_KEY}",
        "rate_limit": 120
      },
      "github": {
        "api_key": "${GITHUB_API_KEY}",
        "repository": "lightspeedwp/.github"
      }
    },
    "metadata": {
      "agent_slug": "design-partner",
      "domain": "design",
      "version": "1.0.0"
    }
  }
}
```

## Batch Processing

For large-scale design audits, use the Batch API:

```javascript
const batch = {
  requests: [
    {
      custom_id: "request-1",
      method: "POST",
      url: "/v1/threads/runs",
      body: {
        assistant_id: "asst_design_partner",
        messages: [{
          role: "user",
          content: "Audit design system file 1"
        }]
      }
    },
    {
      custom_id: "request-2",
      method: "POST",
      url: "/v1/threads/runs",
      body: {
        assistant_id: "asst_design_partner",
        messages: [{
          role: "user",
          content: "Audit design system file 2"
        }]
      }
    }
  ]
};
```

## Error Handling

```javascript
try {
  const run = await openai.beta.threads.runs.create(
    thread_id,
    {
      assistant_id: "asst_design_partner",
      messages: [...]
    }
  );
} catch (error) {
  if (error.code === 'rate_limit_exceeded') {
    // Handle rate limiting with exponential backoff
  } else if (error.code === 'invalid_request') {
    // Handle invalid request parameters
  } else {
    // Handle other errors
  }
}
```

## Best Practices

1. **Stream responses** – Use streaming for large responses to improve user experience
2. **Implement timeout logic** – Set appropriate timeouts for API calls
3. **Handle tool errors gracefully** – Implement retry logic with exponential backoff
4. **Validate Figma URLs** – Ensure URLs are properly formatted before passing to functions
5. **Cache results** – Cache design analysis results to reduce API calls
6. **Monitor usage** – Track token usage and API costs
7. **Batch operations** – Use batch API for large-scale operations

## Related Documentation

- [AGENT.md](../AGENT.md) – Complete agent specification
- [tools.json](./tools.json) – Function schemas
- [../claude/agent.md](../claude/agent.md) – Claude implementation
- [../copilot/agent.md](../copilot/agent.md) – Copilot implementation
- [../shared/core-prompt.md](../shared/core-prompt.md) – Core methodology

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
