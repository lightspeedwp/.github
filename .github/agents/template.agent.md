---
file_type: "agent"
name: "template"
description: "Generic agent template for creating new automation agents following LightSpeed standards."
version: "v1.0"
last_updated: "2025-11-25"
author: "LightSpeed"
maintainer: "Ash Shaw"
owners: ["lightspeedwp/maintainers"]
tags: ["template", "scaffold", "agent-development"]
category: "development"
status: "active"
visibility: "public"
target: "vscode"
tools: ["read", "edit", "search"]
references:
  - path: ".github/agents/template.agent.js"
    description: "JavaScript implementation template"
  - path: ".github/agents/template.agent.py"
    description: "Python implementation template"
  - path: ".github/agents/template.agent.sh"
    description: "Shell script implementation template"
  - path: ".github/instructions/agents.instructions.md"
    description: "Agent development guidelines"
metadata:
  guardrails: "Follow LightSpeed coding standards. Include comprehensive tests. Document all functionality. Validate against schema."
---

# Template Agent Specification

## Purpose

Provide a standardized template for creating new automation agents following LightSpeed organizational standards and best practices.

## Usage

This template provides:

1. **Frontmatter Structure**: Canonical YAML frontmatter for agent specifications
2. **Documentation Sections**: Standard sections for agent documentation
3. **Implementation Stubs**: Code templates in JavaScript, Python, and Shell
4. **Testing Framework**: Jest test templates for agent validation

## Creating a New Agent

### Step 1: Copy Template Files

```bash
# Copy the specification template
cp .github/agents/template.agent.md .github/agents/your-agent.agent.md

# Copy the implementation template (choose your language)
cp .github/agents/template.agent.js .github/agents/your-agent.agent.js
# or
cp .github/agents/template.agent.py .github/agents/your-agent.agent.py
# or
cp .github/agents/template.agent.sh .github/agents/your-agent.agent.sh
```

### Step 2: Update Frontmatter

Edit the YAML frontmatter in `your-agent.agent.md`:

- Update `name` to your agent's name
- Provide clear `description`
- Set appropriate `tags` and `category`
- Update `references` to point to your files
- Customize `metadata.guardrails`

### Step 3: Document Functionality

Fill in the specification sections:

- **Purpose**: What the agent does
- **Responsibilities**: Key functions and capabilities
- **Process**: Step-by-step workflow
- **Guardrails**: Safety constraints and validation
- **Integration**: How it fits with other systems

### Step 4: Implement Code

Develop the agent implementation following LightSpeed standards:

- Use modular, reusable code
- Include comprehensive error handling
- Add logging for audit trails
- Validate inputs and outputs
- Document all functions

### Step 5: Add Tests

Create tests in `.github/agents/__tests__/`:

```javascript
// your-agent.agent.test.js
const { runAgent } = require("../your-agent.agent.js");

describe("Your Agent", () => {
  it("should initialize without error", () => {
    expect(runAgent).toBeDefined();
  });

  // Add more tests...
});
```

### Step 6: Validate

Run validation to ensure compliance:

```bash
node scripts/validation/validate-agent-frontmatter.js
npm test
```

## Template Structure

### Frontmatter Fields (Required)

- `file_type`: Must be "agent"
- `name`: Unique agent identifier
- `description`: Clear purpose statement
- `version`: Semantic version (v1.0, v2.1, etc.)
- `last_updated`: ISO date (YYYY-MM-DD)
- `owners`: Array of owner teams

### Frontmatter Fields (Recommended)

- `author`: Original author
- `maintainer`: Current maintainer
- `tags`: Keywords for discovery
- `category`: Classification (automation, documentation, etc.)
- `status`: active, deprecated, experimental
- `target`: github-copilot, vscode, cli
- `tools`: Available capabilities
- `references`: Related files with descriptions

### Documentation Sections

1. **Purpose**: High-level goals
2. **Responsibilities**: What it manages
3. **Process**: How it works
4. **Guardrails**: Safety measures
5. **Integration**: System connections
6. **References**: Related documentation

## Best Practices

- **Modularity**: Keep agents focused on single responsibilities
- **Documentation**: Comprehensive inline and specification docs
- **Testing**: Full test coverage with edge cases
- **Validation**: Schema compliance and linting
- **Security**: No hardcoded secrets or credentials
- **Logging**: Audit trail for all actions
- **Error Handling**: Graceful degradation and recovery

## References

- [Agent Development Guidelines](../../.github/instructions/agents.instructions.md)
- [Coding Standards](../../.github/instructions/coding-standards.instructions.md)
- [Testing Standards](../../.github/instructions/tests.instructions.md)
- [Frontmatter Schema](../../schemas/frontmatter.schema.json)
