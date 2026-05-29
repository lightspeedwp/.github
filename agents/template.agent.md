---
file_type: agent
name: template
title: 'Template: Agent Specification'
description: 'Standard specification for defining a LightSpeed Copilot Agent: role,
  behaviours, tooling, schemas, and safety constraints.'
version: v1.2
last_updated: '2026-05-29'
status: active
tags:
- agent
- spec
- template
- copilot
owners:
- LightSpeedWP Engineering
---

# Agent Specification Template

This document provides the canonical template for defining LightSpeed Copilot agents. Use this specification to document agent role, responsibilities, capabilities, tooling, and safety constraints.

## Usage

Copy this template when creating a new agent specification. Replace placeholder sections with concrete details specific to your agent.

## Structure

```markdown
---
file_type: agent
name: [unique agent identifier]
title: [human-readable agent name]
description: [one-sentence purpose]
version: v1.0
last_updated: 'YYYY-MM-DD'
status: [draft|active|deprecated]
tags:
- [category tags]
authors:
- [team or person]
---

# [Agent Name]

## Role & Responsibilities

Brief summary of what this agent does and when it should be invoked.

## Capabilities

- **Primary:** List primary capabilities
- **Secondary:** List secondary capabilities

## Required Inputs

- Input format and constraints

## Expected Outputs

- Output format and examples

## Tools & Permissions

- Required GitHub tools
- File system access
- External API integrations

## Safety Constraints

- Guardrails and limits
- What the agent must NOT do
- Error handling approach

## Configuration

- Required environment variables
- Optional settings with defaults
- Performance tuning parameters

## Examples

### Example 1: [Scenario]

Input → Agent Action → Output

## Related Agents

- Links to related agent specifications
- Handoff patterns if applicable
```

## Key Sections Explained

### Role & Responsibilities

Clearly state what this agent is responsible for. Include the primary use cases and scenarios where the agent should be invoked.

### Capabilities

List both primary and secondary capabilities. Be specific about what the agent can and cannot do.

### Tools & Permissions

Document all tools the agent needs access to. Include GitHub tools, file system permissions, and any external APIs.

### Safety Constraints

Define guardrails and constraints that protect against misuse. Include specific prohibitions and error handling behaviour.

## Best Practices

1. **Be Specific:** Avoid vague descriptions; include concrete examples
2. **Document Constraints:** Explicitly state what the agent will NOT do
3. **Define Inputs/Outputs:** Be precise about expected formats and constraints
4. **Include Examples:** Show realistic usage scenarios
5. **Keep Updated:** Review and update specs as agent capabilities evolve
6. **Link Related:** Cross-reference related agents and workflows

## See Also

- [Agents Directory](./README.md) – Directory of all agent specifications
- [Agent Creation Guide](../docs/AGENT_CREATION.md) – Building and testing new agents
- [AGENTS.md](../AGENTS.md) – Organization-wide agent guidelines
