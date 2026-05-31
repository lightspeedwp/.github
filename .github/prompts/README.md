---
file_type: "documentation"
title: ".github Prompts Directory"
description: "AI prompt templates and guidelines for automation, code review, and documentation generation"
version: "v1.0"
last_updated: "2026-05-31"
maintainer: "LightSpeed Team"
tags: ["prompts", "ai", "automation", "templates"]
---

# .github Prompts Directory

This directory contains reusable AI prompt templates designed for automation agents, code review, documentation generation, and AI-powered workflows across the LightSpeed organization.

## Prompt Categories

### Code Review & Quality

- **code-review.prompt.md** - Automated code quality assessment and feedback
- **accessibility-review.prompt.md** - WCAG 2.2 AA compliance validation
- **security-review.prompt.md** - Security vulnerability and OWASP analysis
- **performance-review.prompt.md** - Performance optimization recommendations

### Documentation & Content

- **documentation.prompt.md** - Documentation generation and standardization
- **markdown-validation.prompt.md** - Markdown syntax and structure validation
- **frontmatter-guidance.prompt.md** - Frontmatter metadata generation

### Automation & Workflows

- **labeling.prompt.md** - Issue and PR label suggestions
- **triage.prompt.md** - Issue categorization and routing
- **release-notes.prompt.md** - Release documentation generation

### Pattern & Template Generation

- **pattern-generation.prompt.md** - Code pattern and template creation
- **architecture-review.prompt.md** - Architecture documentation and analysis
- **testing-guidance.prompt.md** - Test case and coverage recommendations

## Usage

### With Copilot / Claude

1. Copy the relevant prompt template
2. Paste into your AI assistant chat
3. Provide repository context or specific code
4. Follow the prompt structure for best results

### With Custom Agents

1. Load prompts from this directory in agent specifications
2. Combine with runtime context (files, diffs, issues)
3. Use responses for automated workflows
4. Log results for quality metrics

### With Automation Workflows

1. Reference prompts in workflow files (e.g., `.github/workflows/*.yml`)
2. Pass relevant context via environment variables
3. Parse responses and take action
4. Track metrics and feedback

## Prompt Structure

Each prompt includes:

- **Role & Context** - The AI's role and the problem domain
- **Objective** - Specific goals and success criteria
- **Input Specifications** - What information will be provided
- **Output Format** - Expected response structure and format
- **Quality Standards** - Accuracy, completeness, and style requirements
- **Examples** - Sample inputs and expected outputs
- **Edge Cases** - Known limitations and special handling

## Best Practices

- **Versioning**: Update version field when prompt logic changes significantly
- **Context**: Provide sufficient context for accurate responses
- **Iteration**: Refine prompts based on feedback and results
- **Documentation**: Keep prompt purpose and limitations documented
- **Testing**: Validate prompt outputs before relying on them in automation
- **Accessibility**: Ensure prompts produce accessible, standards-compliant content

## Related Resources

- [Automation Governance](../automation/AUTOMATION_GOVERNANCE.md) - Prompt usage policies
- [Agents Directory](../agents/README.md) - Agent specifications using these prompts
- [Instructions](../instructions/README.md) - Development standards referenced by prompts
- [Custom Instructions](../custom-instructions.md) - Organization-wide Copilot settings

## Contributing

To add or improve prompts:

1. Follow the standardized prompt structure above
2. Include clear examples and edge cases
3. Document the prompt's purpose and limitations
4. Test with multiple inputs before submitting
5. Update this README with new prompt entries

---

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
