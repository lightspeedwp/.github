# LightSpeed Copilot Instructions

This directory contains `.instructions.md` files that provide context-specific guidance for GitHub Copilot when working with different file types in any LightSpeed WordPress project.

## What are Instruction Files?

Instruction files help Copilot understand the specific conventions, requirements, and best practices for different parts of any LightSpeed WordPress project. Each file contains YAML frontmatter that specifies which files the instructions apply to, followed by detailed guidelines.

## Available Instructions

| File                                                                           | Applies To          | Description                                                          |
| ------------------------------------------------------------------------------ | ------------------- | -------------------------------------------------------------------- |
| [`coding-standards.instructions.md`](./coding-standards.instructions.md)       | all code files      | WordPress coding standards and best practices                        |
| [`theme-json.instructions.md`](./theme-json.instructions.md)                   | `**/theme.json`     | Guidelines for working with theme.json (colors, typography, spacing) |
| [`php-block.instructions.md`](./php-block.instructions.md)                     | `**/*.php`          | Instructions for PHP files related to block patterns or theme setup  |
| [`html-template.instructions.md`](./html-template.instructions.md)             | `**/*.html`         | Guidelines for HTML template parts and block templates               |
| [`pattern-development.instructions.md`](./pattern-development.instructions.md) | `**/patterns/*.php` | Guidelines for creating and modifying block patterns                 |

## How They Work

GitHub Copilot automatically applies these instructions when you're working with matching file types. For example, when editing a file in the `patterns/` directory, Copilot will use the guidance from `pattern-development.instructions.md` to provide more contextually relevant suggestions.

## Adding New Instructions

When adding new instruction files:

1. Create a new `.instructions.md` file in this directory
2. Add YAML frontmatter with `applyTo` and `description` fields
3. Write detailed guidelines for working with the specific file type
4. Update the `.vscode/settings.json` file to include the new instruction file
5. Update this README to include the new file in the table

## Maintaining Instructions

These instructions should evolve as our project standards and requirements change. When updating:

1. Make sure changes align with our project guidelines
2. Keep the instructions concise and actionable
3. Consider backward compatibility with existing code
4. Document significant changes in the commit message
