---
file_type: 'prompt'
title: 'Standardised Prompts Directory'
description: 'Reusable prompt templates for agents and AI scenarios across LightSpeed projects'
version: 'v1.0.0'
created_date: '2026-05-31'
last_updated: '2026-05-31'
maintainer: 'LightSpeed Team'
authors:
  - LightSpeed Team
license: 'GPL-3.0'
license: 'GPL-3.0'
stability: 'stable'
domain: 'awesome-copilot'
  - prompts
  - ai
  - templates
  - agents
owners:
  - ashley@lightspeedwp.agency
status: 'active'
---

# Standardised Prompts

This directory contains reusable prompt templates for agents and AI scenarios across LightSpeed projects. Use these prompts as starting points for common tasks—customise as needed for your specific context.

## Prompt Templates

- **[agent-setup.prompt](./agent-setup.prompt)** — Initial agent context, instructions, and configuration
- **[code-generation.prompt](./code-generation.prompt)** — Code implementation, scaffolding, and generation
- **[code-review.prompt](./code-review.prompt)** — Code review, quality feedback, and standards enforcement
- **[debugging.prompt](./debugging.prompt)** — Problem diagnosis, root cause analysis, and resolution
- **[documentation.prompt](./documentation.prompt)** — Documentation creation, updates, and refinement
- **[testing.prompt](./testing.prompt)** — Test suite creation, debugging, and coverage improvements
- **[refactoring.prompt](./refactoring.prompt)** — Code refactoring, optimisation, and modernisation

## Usage

Each prompt is designed to be:

- **Customisable:** Adapt sections to your project context
- **Focused:** Addresses a specific task or workflow stage

### Example: Code Generation

```bash
# Copy the template
cp prompts/code-generation.prompt my-task.prompt

# Edit for your context
# Add project-specific details, file paths, acceptance criteria

# Use with your agent or AI tool
claude --load-prompt my-task.prompt
```

## Prompt Structure

All prompts follow a consistent structure:

1. **Context** — Project, scope, and relevant background
2. **Task** — Clear, specific objective
3. **Constraints** — Limitations, standards, or requirements
4. **Acceptance Criteria** — Definition of done
5. **References** — Links to relevant docs, files, or examples

## Contributing

To add or improve prompts:

1. Follow the standard structure above
2. Use UK English and clear, concise language
3. Include real examples where helpful
4. Document any dependencies or prerequisites
5. Create a PR with rationale for the new prompt

---
