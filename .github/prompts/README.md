# LightSpeed Copilot Prompt Library

This folder contains reusable prompts for common development and review tasks in any LightSpeed WordPress project.
To run a prompt, open the file or use `/filename` in Copilot Chat.

## Available Prompts

| File                                                                 | Description                                            |
| -------------------------------------------------------------------- | ------------------------------------------------------ |
| [`generate-pattern.prompt.md`](./generate-pattern.prompt.md)         | Generate a WordPress block pattern using design tokens |
| [`accessibility-audit.prompt.md`](./accessibility-audit.prompt.md)   | Audit a template file for accessibility issues         |
| [`accessibility-review.prompt.md`](./accessibility-review.prompt.md) | Comprehensive accessibility review guidelines          |
| [`refactor-theme-types.prompt.md`](./refactor-theme-types.prompt.md) | Improve theme.json typography structure                |
| [`code-review.prompt.md`](./code-review.prompt.md)                   | Review pull request code for standards and style       |
| [`dev-code-review.prompt.md`](./dev-code-review.prompt.md)           | Guidelines for providing feedback to junior developers |
| [`pattern-generation.prompt.md`](./pattern-generation.prompt.md)     | Template for creating new WordPress block patterns     |

## How to Use

1. Copy the content of the relevant prompt
2. Paste it into GitHub Copilot Chat
3. Customize the prompt with your specific requirements
4. Use the generated response as a starting point

## Creating New Prompts

When creating new prompts for this directory, please follow these guidelines:

1. Use clear, descriptive filenames with the `.prompt.md` extension for agent mode prompts
2. Include a YAML frontmatter with `mode` and `description` fields
3. Structure the prompt with clear instructions
4. Update this README to include the new prompt

## Maintaining Prompts

These prompts should evolve as our project standards and requirements change. When updating:

1. Make sure changes align with our project guidelines
2. Test the updated prompt with GitHub Copilot before committing
3. Consider backward compatibility with existing code
4. Document significant changes in the commit message

## License

These prompt files are part of the LightSpeed organization's community health files, licensed under the GNU General Public License v3.0.
