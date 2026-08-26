---
file_type: documentation
title: ""Phase 1 Schemas Audit 2026 07 22""
description: ""Project documentation""
created_date: 2026-07-22
last_updated: "2026-08-25"
status: active
---

# Schemas Folder Audit & Proposed New Schemas — Phase 1

**Objective:** Review existing schemas and define new ones for multi-provider agent standardisation.

**Audit Date:** 2026-07-22  
**Auditor:** Claude Code  
**Target:** feat/agent-standards-playwright-testing (Issue #1079)

---

## Current Schemas

**Registry:** `.github/.schemas/schema-registry.json`

### Registered Schemas

| ID | File | Status | Purpose |
|---|---|---|---|
| frontmatter | frontmatter.schema.json | active | YAML frontmatter validation |
| changelog | changelog.schema.json | active | Changelog format validation |
| project-fields | project-fields.schema.json | active | GitHub Project field mapping |
| version | version.schema.json | active | Semantic versioning |
| skill-metadata | skill-metadata.schema.json | active | Skill metadata structure |
| skill-agent-config | skill-agent-config.schema.json | active | Skill-based agent config |
| plugin-manifest | plugin-manifest.schema.json | active | Plugin manifest format |

### Additional Schemas (Not in registry)

| File | Purpose |
|---|---|
| agent-config.schema.json | Agent configuration structure |
| branding-schema.json | Branding and style configuration |
| footer-config.schema.json | Footer template configuration |
| coderabbit-overrides.v2.json | CodeRabbit override rules |

---

## Coverage Analysis

### Current Coverage

✅ **Covered:**

- General frontmatter (YAML metadata)
- Skill metadata and agent skill configs
- Plugin manifests
- Changelog format
- Version format
- Branding configuration

❌ **Not Covered:**

- Multi-provider agent specifications
- Provider-specific configurations
- Agent-plugin bindings
- Capability manifests
- Provider compatibility matrices

---

## Proposed New Schemas

### Schema 1: **multi-provider-agent.schema.json**

**Purpose:** Validates agent structure across Claude, Copilot, and OpenAI

**Use Cases:**

- Validating `agents/*/AGENT.md` frontmatter
- Ensuring consistent multi-provider agent structure
- CI/CD validation of agent specs

**Example Valid JSON:**

```json
{
  "name": "playwright-testing",
  "title": "Playwright Testing Agent",
  "description": "Cross-browser automation and end-to-end testing",
  "version": "2.0.0",
  "status": "active",
  "providers": ["claude", "copilot", "openai"],
  "capabilities": [
    "browser-automation",
    "visual-regression-detection",
    "performance-metrics",
    "accessibility-testing"
  ],
  "tools": {
    "claude": ["playwright_launch", "playwright_navigate", "playwright_screenshot"],
    "copilot": ["playwright-selectors", "browser-automation"],
    "openai": ["run_playwright_test", "generate_test_report"]
  },
  "requirements": ["Playwright library", "Node.js 18+"],
  "constraints": ["No production databases", "Max timeout: 5 minutes"],
  "provider_overrides": {
    "claude": {
      "response_format": "json"
    },
    "copilot": {
      "response_format": "markdown"
    },
    "openai": {
      "response_format": "function_call"
    }
  },
  "security": {
    "rules": [
      "No credentials in test files",
      "Sandboxed environment only"
    ],
    "hooks": ["secrets-scanner", "agent-spec-validator"]
  }
}
```

**Schema Definition:**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Multi-Provider Agent Schema",
  "description": "Validates agent structure across Claude, Copilot, and OpenAI",
  "type": "object",
  "required": ["name", "title", "providers", "capabilities"],
  "properties": {
    "name": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$",
      "description": "Unique agent identifier (lowercase, kebab-case)"
    },
    "title": {
      "type": "string",
      "description": "Human-readable agent title"
    },
    "description": {
      "type": "string",
      "description": "Detailed agent description"
    },
    "version": {
      "type": "string",
      "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$",
      "description": "Semantic version (X.Y.Z)"
    },
    "status": {
      "type": "string",
      "enum": ["active", "inactive", "deprecated", "experimental"]
    },
    "providers": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["claude", "copilot", "openai", "gemini"]
      },
      "minItems": 1,
      "description": "Supported providers"
    },
    "capabilities": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "description": "List of capabilities this agent provides"
    },
    "tools": {
      "type": "object",
      "description": "Tools available per provider"
    },
    "requirements": {
      "type": "array",
      "items": { "type": "string" },
      "description": "System/library requirements"
    },
    "constraints": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Operational constraints and limitations"
    },
    "provider_overrides": {
      "type": "object",
      "properties": {
        "claude": { "type": "object" },
        "copilot": { "type": "object" },
        "openai": { "type": "object" },
        "gemini": { "type": "object" }
      },
      "description": "Provider-specific overrides"
    },
    "security": {
      "type": "object",
      "properties": {
        "rules": {
          "type": "array",
          "items": { "type": "string" }
        },
        "hooks": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    }
  }
}
```

**Validation Rules:**

- `name` must match regex: `^[a-z0-9-]+$`
- `version` must follow semantic versioning: `X.Y.Z`
- `providers` must contain at least 1 valid provider
- `capabilities` must have at least 1 capability
- `status` must be one of the enum values
- If `tools` object exists, each key must be a valid provider

---

### Schema 2: **agent-plugin-binding.schema.json**

**Purpose:** Validates agent-plugin relationships and wiring

**Use Cases:**

- Validating that agents within plugins are correctly registered
- Ensuring all agent dependencies are satisfied
- Checking skill and hook wiring

**Example Valid JSON:**

```json
{
  "plugin_id": "lightspeed-playwright-testing",
  "agents": [
    {
      "agent_id": "playwright-testing",
      "path": "agents/playwright-testing/",
      "required_skills": ["playwright-selectors", "browser-automation", "test-reporting"],
      "required_hooks": ["agent-spec-validator", "multi-provider-consistency-checker"],
      "provider_support": {
        "claude": true,
        "copilot": true,
        "openai": true
      }
    }
  ],
  "skills": [
    {
      "id": "playwright-selectors",
      "path": "skills/playwright-selectors.md",
      "providers": ["claude", "copilot", "openai"]
    }
  ],
  "hooks": [
    {
      "id": "agent-spec-validator",
      "path": ".github/hooks/agent-spec-validator/",
      "triggers": ["pre-commit", "pre-push"]
    }
  ]
}
```

**Schema Definition:**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Agent-Plugin Binding Schema",
  "description": "Validates agent-plugin relationships and wiring",
  "type": "object",
  "required": ["plugin_id"],
  "properties": {
    "plugin_id": {
      "type": "string",
      "pattern": "^lightspeed-[a-z0-9-]+$",
      "description": "Unique plugin identifier"
    },
    "agents": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["agent_id", "path"],
        "properties": {
          "agent_id": { "type": "string" },
          "path": { "type": "string" },
          "required_skills": {
            "type": "array",
            "items": { "type": "string" }
          },
          "required_hooks": {
            "type": "array",
            "items": { "type": "string" }
          },
          "provider_support": {
            "type": "object",
            "properties": {
              "claude": { "type": "boolean" },
              "copilot": { "type": "boolean" },
              "openai": { "type": "boolean" }
            }
          }
        }
      },
      "description": "Agents included in this plugin"
    },
    "skills": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "path": { "type": "string" },
          "providers": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      },
      "description": "Skills used by agents in this plugin"
    },
    "hooks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "path": { "type": "string" },
          "triggers": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      },
      "description": "Hooks used by agents in this plugin"
    }
  }
}
```

**Validation Rules:**

- `plugin_id` must match pattern: `^lightspeed-[a-z0-9-]+$`
- All `agent_id` values referenced must exist
- All `skill` IDs must have corresponding skill files
- All `hook` IDs must be registered hooks
- `provider_support` values must be boolean

---

### Schema 3: **provider-config.schema.json**

**Purpose:** Validates per-provider agent configuration

**Use Cases:**

- Validating `agents/*/claude/agent.md` structure
- Validating `agents/*/copilot/agent.md` structure
- Validating `agents/*/openai/agent.md` structure

**Example Valid JSON:**

```json
{
  "provider": "claude",
  "instructions": "claude/agent.md",
  "tools": [
    {
      "name": "playwright_launch",
      "description": "Launch browser instance",
      "type": "browser_automation"
    },
    {
      "name": "playwright_navigate",
      "description": "Navigate to URL",
      "type": "browser_automation"
    }
  ],
  "memory_config": {
    "enabled": true,
    "scope": "session",
    "retention_days": 30
  },
  "security_rules": [
    "No production databases",
    "Sandboxed environment",
    "Read-only access to code"
  ],
  "response_format": "json",
  "capabilities": [
    "browser-automation",
    "screenshot-capture",
    "performance-analysis"
  ]
}
```

**Schema Definition:**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Provider-Specific Configuration Schema",
  "description": "Validates per-provider agent configuration",
  "type": "object",
  "required": ["provider"],
  "properties": {
    "provider": {
      "type": "string",
      "enum": ["claude", "copilot", "openai", "gemini"],
      "description": "Target provider"
    },
    "instructions": {
      "type": "string",
      "description": "Path to provider-specific instructions file"
    },
    "tools": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" },
          "type": { "type": "string" }
        }
      },
      "description": "Tools/functions available in this provider"
    },
    "memory_config": {
      "type": "object",
      "properties": {
        "enabled": { "type": "boolean" },
        "scope": {
          "type": "string",
          "enum": ["session", "persistent", "none"]
        },
        "retention_days": { "type": "integer" }
      },
      "description": "Memory configuration for this provider"
    },
    "security_rules": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Provider-specific security constraints"
    },
    "response_format": {
      "type": "string",
      "enum": ["json", "markdown", "function_call", "text"],
      "description": "Expected response format for this provider"
    },
    "capabilities": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Capabilities enabled in this provider"
    }
  }
}
```

**Validation Rules:**

- `provider` must be one of enum values
- If `memory_config` exists, `scope` must be one of the allowed values
- If `response_format` specified, must be one of allowed formats
- `capabilities` must align with parent agent's capabilities

---

### Schema 4: **agent-capability-manifest.schema.json**

**Purpose:** Validates agent capabilities and prerequisites

**Use Cases:**

- Defining and validating agent capabilities
- Checking capability requirements before execution
- Performance and constraint documentation

**Example Valid JSON:**

```json
{
  "capabilities": [
    {
      "name": "browser-automation",
      "description": "Automated browser control and navigation",
      "category": "core",
      "requires": {
        "libraries": ["playwright"],
        "nodejs_version": ">=18.0.0",
        "memory_mb": 512
      },
      "performance_targets": {
        "max_latency_ms": 5000,
        "throughput_tests_per_minute": 12
      }
    },
    {
      "name": "visual-regression-detection",
      "description": "Compare visual outputs across browsers",
      "category": "analysis",
      "requires": {
        "dependencies": ["pixelmatch", "sharp"],
        "storage_mb": 100
      }
    }
  ],
  "constraints": [
    {
      "type": "data_access",
      "rule": "No production database access",
      "scope": "strict"
    },
    {
      "type": "timeout",
      "rule": "Max 5 minutes per test",
      "value": 300000
    },
    {
      "type": "network",
      "rule": "Sandboxed network only",
      "scope": "restricted"
    }
  ],
  "security_rules": [
    "No hardcoded credentials",
    "No plaintext secrets in logs",
    "Require encryption for sensitive data"
  ],
  "performance_targets": {
    "agent_initialization_ms": 2000,
    "test_execution_overhead_ms": 500,
    "memory_usage_mb": 512
  }
}
```

**Schema Definition:**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Agent Capability Manifest Schema",
  "description": "Validates agent capabilities and prerequisites",
  "type": "object",
  "required": ["capabilities"],
  "properties": {
    "capabilities": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name"],
        "properties": {
          "name": {
            "type": "string",
            "description": "Capability identifier"
          },
          "description": {
            "type": "string",
            "description": "Human-readable description"
          },
          "category": {
            "type": "string",
            "enum": ["core", "optional", "analysis", "reporting"],
            "description": "Capability category"
          },
          "requires": {
            "type": "object",
            "properties": {
              "libraries": {
                "type": "array",
                "items": { "type": "string" }
              },
              "nodejs_version": { "type": "string" },
              "memory_mb": { "type": "integer" },
              "dependencies": {
                "type": "array",
                "items": { "type": "string" }
              },
              "storage_mb": { "type": "integer" }
            },
            "description": "Prerequisites for this capability"
          },
          "performance_targets": {
            "type": "object",
            "properties": {
              "max_latency_ms": { "type": "integer" },
              "throughput_tests_per_minute": { "type": "integer" }
            },
            "description": "Performance SLOs for this capability"
          }
        }
      },
      "minItems": 1,
      "description": "List of capabilities"
    },
    "constraints": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["data_access", "timeout", "network", "resource", "security"]
          },
          "rule": { "type": "string" },
          "scope": {
            "type": "string",
            "enum": ["strict", "moderate", "permissive", "restricted"]
          },
          "value": {}
        }
      },
      "description": "Operational constraints"
    },
    "security_rules": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Security rules and guardrails"
    },
    "performance_targets": {
      "type": "object",
      "properties": {
        "agent_initialization_ms": { "type": "integer" },
        "test_execution_overhead_ms": { "type": "integer" },
        "memory_usage_mb": { "type": "integer" }
      },
      "description": "Overall performance targets"
    }
  }
}
```

**Validation Rules:**

- `capabilities` array must have at least 1 item
- Each capability `name` must be unique
- If `performance_targets` specified, values must be positive integers
- `constraint.type` must be one of allowed values
- `constraint.scope` must be one of allowed values

---

## Schema Registry Update

Update `.github/.schemas/schema-registry.json`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LightSpeed Portable Schema Registry",
  "version": "v0.2.0",
  "entries": [
    {
      "id": "frontmatter",
      "path": ".schemas/frontmatter.schema.json",
      "status": "active"
    },
    {
      "id": "changelog",
      "path": ".schemas/changelog.schema.json",
      "status": "active"
    },
    {
      "id": "project-fields",
      "path": ".schemas/project-fields.schema.json",
      "status": "active"
    },
    {
      "id": "version",
      "path": ".schemas/version.schema.json",
      "status": "active"
    },
    {
      "id": "skill-metadata",
      "path": ".schemas/skill-metadata.schema.json",
      "status": "active"
    },
    {
      "id": "skill-agent-config",
      "path": ".schemas/skill-agent-config.schema.json",
      "status": "active"
    },
    {
      "id": "plugin-manifest",
      "path": ".schemas/plugin-manifest.schema.json",
      "status": "active"
    },
    {
      "id": "multi-provider-agent",
      "path": ".schemas/multi-provider-agent.schema.json",
      "status": "active",
      "category": "agent-validation"
    },
    {
      "id": "agent-plugin-binding",
      "path": ".schemas/agent-plugin-binding.schema.json",
      "status": "active",
      "category": "agent-validation"
    },
    {
      "id": "provider-config",
      "path": ".schemas/provider-config.schema.json",
      "status": "active",
      "category": "agent-validation"
    },
    {
      "id": "agent-capability-manifest",
      "path": ".schemas/agent-capability-manifest.schema.json",
      "status": "active",
      "category": "agent-validation"
    }
  ]
}
```

---

## Implementation Checklist

### Schema Files to Create

- [ ] `.github/.schemas/multi-provider-agent.schema.json`
- [ ] `.github/.schemas/agent-plugin-binding.schema.json`
- [ ] `.github/.schemas/provider-config.schema.json`
- [ ] `.github/.schemas/agent-capability-manifest.schema.json`

### Example Files to Create (for documentation)

- [ ] `.github/.schemas/multi-provider-agent.example.json`
- [ ] `.github/.schemas/agent-plugin-binding.example.json`
- [ ] `.github/.schemas/provider-config.example.json`
- [ ] `.github/.schemas/agent-capability-manifest.example.json`

### Registry Update

- [ ] Update `.github/.schemas/schema-registry.json` with 4 new entries

### Documentation

- [ ] Update `.github/.schemas/README.md` with new schemas
- [ ] Add schema usage examples

---

## Success Criteria — Task 3

✅ Existing schemas reviewed (7 active + 4 additional)  
✅ Coverage gaps identified  
✅ 4 new schemas defined with:

- Purpose and use cases
- Example valid JSON
- Complete JSON Schema definition
- Validation rules documented
✅ Registry update prepared  
✅ Implementation checklist created  

---

## Next Steps (Task 4)

Proceed to **AI Config Folder Audit** to review AI configurations and propose updates for multi-provider support.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
