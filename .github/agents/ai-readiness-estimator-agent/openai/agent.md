# AI Readiness Estimator — OpenAI Implementation

## Overview

OpenAI API implementation for the AI Readiness Estimator using function calling and structured outputs.

## Function Calling

This agent exposes 8 functions for OpenAI API integration.

## API Integration

### Request Format

```json
{
  "model": "gpt-4o",
  "messages": [{
    "role": "user",
    "content": "Your request here"
  }],
  "tools": [{
    "type": "function",
    "function": {
      "name": "function_name"
    }
  }]
}
```

## Response Format

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "model": "gpt-4o",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Response text"
    }
  }]
}
```

---

For detailed function definitions, see `tools.json`.
