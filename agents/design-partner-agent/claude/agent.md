---
title: "Agent"
description: "Agent"
provider: claude
agent_slug: design-partner
agent_name: Design Partner Agent (Claude)
status: active
version: 1.0.2
created_date: '2026-07-22'
last_updated: '2026-08-21'
model_compatibility:
  - claude-opus-4
  - claude-sonnet-4
  - claude-haiku-4
context_window: '200000'
token_limit: '200000'
temperature: 0.7
top_p: 0.9
---

# Design Partner Agent — Claude Implementation

## Overview

The Claude implementation of the Design Partner Agent leverages Claude's deep reasoning capabilities, extensive design knowledge, and support for large context windows to provide expert design consultation, comprehensive accessibility audits, and detailed design documentation.

Claude excels at:

- **In-depth analysis** – Examining complex design systems and providing detailed recommendations
- **Documentation generation** – Creating comprehensive, well-structured design documentation
- **Design token management** – Extracting, validating, and organizing design tokens
- **Accessibility expertise** – Deep knowledge of WCAG 2.2 standards and best practices
- **Figma integration** – Seamless API integration for design file inspection and analysis

## Available Tools

Claude has access to 8 specialized tools for design work:

1. **figma-inspector** – Inspect and analyze Figma design files
2. **accessibility-auditor** – WCAG 2.2 AA compliance assessment
3. **token-extractor** – Extract and validate design tokens
4. **component-analyzer** – Analyze component structure and variants
5. **design-documentation-generator** – Generate component specs and guidelines
6. **contrast-checker** – Verify color contrast ratios
7. **responsive-validator** – Test responsive design across breakpoints
8. **code-connect-mapper** – Create Code Connect maps for design-to-code

## Integration Patterns

### Figma API Integration

```javascript
// Claude calls figma-inspector tool
{
  "tool": "figma-inspector",
  "params": {
    "figma_url": "https://figma.com/file/abc123/design-system",
    "analysis_type": "component-inventory|token-extraction|accessibility-audit",
    "include_metadata": true
  }
}

// Claude receives design metadata
{
  "file_id": "abc123",
  "components": [
    {
      "name": "Button",
      "variants": ["primary", "secondary", "danger"],
      "states": ["default", "hover", "active", "disabled"],
      "props": ["size", "variant", "disabled"]
    }
  ],
  "tokens": {
    "colors": {...},
    "typography": {...},
    "spacing": {...}
  }
}
```

### Accessibility Audit Integration

```javascript
// Claude initiates accessibility audit
{
  "tool": "accessibility-auditor",
  "params": {
    "design_file_id": "abc123",
    "wcag_level": "AA",
    "check_types": [
      "color-contrast",
      "semantic-structure",
      "interactive-states",
      "keyboard-navigation",
      "focus-management"
    ]
  }
}

// Claude receives audit results
{
  "compliance_level": "WCAG 2.2 AA",
  "issues": [
    {
      "type": "color-contrast",
      "severity": "critical",
      "element": "Button.primary",
      "message": "Text contrast ratio 3.2:1, needs 4.5:1 for AA compliance"
    }
  ],
  "summary": {
    "passed": 45,
    "failed": 3,
    "passed_percentage": 93.75
  }
}
```

### Documentation Generation

```javascript
// Claude generates documentation
{
  "tool": "design-documentation-generator",
  "params": {
    "component_id": "button",
    "documentation_type": "specification|usage-guide|code-examples",
    "include_sections": [
      "component-overview",
      "variants-and-states",
      "props-and-api",
      "usage-guidelines",
      "accessibility-notes",
      "code-examples"
    ]
  }
}

// Claude generates structured documentation
Output format: Comprehensive Markdown with tables, code blocks, and examples
```

## Response Format

Claude structures responses with the following format:

```markdown
# [Analysis Type] Report

## Executive Summary
[2-3 paragraph overview of findings]

## Key Findings
- **Finding 1** – [description with impact]
- **Finding 2** – [description with impact]
- **Finding 3** – [description with impact]

## Detailed Analysis

### Section 1: [Topic]
[Detailed analysis with specific examples]

### Section 2: [Topic]
[Detailed analysis with specific examples]

## Recommendations

### Priority 1 (Critical)
- [Action item with rationale]

### Priority 2 (High)
- [Action item with rationale]

### Priority 3 (Medium)
- [Action item with rationale]

## Appendices

### A: Design Token Inventory
[Table or JSON export]

### B: Component Checklist
[Structured checklist]

### C: Reference Links
[Links to standards, documentation]
```

## Usage Patterns

### Pattern 1: Design System Audit

```
User: Audit our design system in Figma. Check component
      consistency, verify accessibility, and document all
      design tokens. File: [figma_url]

Claude Process:
1. Call figma-inspector to fetch design system structure
2. Extract component inventory and variants
3. Call token-extractor to document design tokens
4. Call accessibility-auditor for WCAG compliance
5. Generate comprehensive audit report
6. Provide recommendations for improvements

Output: Design System Audit Report with token documentation
```

### Pattern 2: Component Specification

```
User: Generate specification for our Button component
      family including all variants, states, and usage
      guidelines.

Claude Process:
1. Call component-analyzer to inspect Button variants
2. Document all states (default, hover, active, disabled)
3. Extract props and API information
4. Call design-documentation-generator for specs
5. Include accessibility notes
6. Add code examples and usage patterns

Output: Comprehensive component specification
```

### Pattern 3: Accessibility Assessment

```
User: Review this design for WCAG 2.2 AA compliance.
      Focus on color contrast, semantic structure, and
      interactive elements.

Claude Process:
1. Call accessibility-auditor with WCAG AA profile
2. Run color contrast checks
3. Verify semantic structure
4. Check interactive element states
5. Assess keyboard navigation
6. Generate compliance report with remediation plan

Output: WCAG 2.2 AA compliance assessment with recommendations
```

## Error Handling

Claude handles errors gracefully:

- **Figma API errors** – Reports connection issues and suggests troubleshooting steps
- **Invalid design tokens** – Identifies malformed tokens and provides naming recommendations
- **Accessibility violations** – Prioritizes by severity and suggests fixes
- **Missing information** – Requests clarification or provides best-practice recommendations

## Claude Code IDE Integration

In Claude Code IDE, the Design Partner Agent integrates with:

- **File operations** – Read/write design documentation in projects
- **Markdown generation** – Generate design specs in project docs
- **Figma workspace** – Direct access to Figma files via API
- **Version control** – Track design changes via git history
- **Project context** – Access project structure for design-to-code mapping

## Example Commands

```bash
# Start design system audit
claude chat --agent design-partner --context figma_file.json

# Generate component documentation
claude agent run design-partner --task "document Button component"

# Accessibility audit
claude agent run design-partner --task "audit accessibility"

# Design token extraction
claude agent run design-partner --task "extract and validate tokens"
```

## Performance Characteristics

| Metric | Performance |
|--------|-------------|
| **Tool execution time** | 2-5 seconds per call |
| **Analysis depth** | Deep (200K token context) |
| **Documentation quality** | Production-grade |
| **Accessibility accuracy** | WCAG 2.2 expert-level |
| **Figma sync speed** | Real-time (API-based) |

## Configuration

```json
{
  "agents": {
    "design-partner": {
      "provider": "claude",
      "model": "claude-opus-4",
      "context_window": 200000,
      "temperature": 0.7,
      "top_p": 0.9,
      "integrations": {
        "figma": {
          "api_key": "${FIGMA_API_KEY}",
          "rate_limit": 120
        },
        "design-system": {
          "validator": "design-system-validator-v2"
        }
      },
      "tools": {
        "enabled": [
          "figma-inspector",
          "accessibility-auditor",
          "token-extractor",
          "component-analyzer",
          "design-documentation-generator",
          "contrast-checker",
          "responsive-validator",
          "code-connect-mapper"
        ]
      }
    }
  }
}
```

## Best Practices

1. **Provide Figma URLs** – Always include direct Figma file links for file-specific analysis
2. **Specify WCAG Level** – Clarify whether you need AA or AAA compliance assessment
3. **Include context** – Provide information about design system maturity, team size, constraints
4. **Request format** – Specify desired output format (Markdown, JSON, CSV for tokens)
5. **Iterate and refine** – Use Claude's streaming capability to refine recommendations in real-time

## Related Documentation

- [AGENT.md](../AGENT.md) – Complete agent specification
- [tools.json](./tools.json) – Claude tool schemas
- [../copilot/agent.md](../copilot/agent.md) – Copilot implementation
- [../openai/agent.md](../openai/agent.md) – OpenAI implementation
- [../shared/core-prompt.md](../shared/core-prompt.md) – Core methodology

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
