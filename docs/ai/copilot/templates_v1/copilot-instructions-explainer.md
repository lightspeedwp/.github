# Copilot Instructions Explainer

GitHub Copilot uses **instructions files** to tailor its behaviour to a specific project or task. These files provide context about your codebase, describe preferred patterns and tools, and define constraints. Copilot reads instructions in `.github/copilot-instructions.md` and any task‑specific files under `.github/instructions/`.

## Purpose

Instructions files guide Copilot on how to generate, review and refactor code. They set expectations about languages, frameworks, testing requirements, naming conventions and repository structure.

## Structure of an Instructions File

An instructions file typically includes:

- **Front matter** – A YAML header containing `applyTo` (file matching patterns), `description` and optional metadata (e.g. owners, last_updated). This determines which files or tasks the instructions apply to.
- **Mission statement** – A clear description of Copilot’s role. For example: “As GitHub Copilot, you assist in building a WordPress plugin following our coding standards.”
- **Guidelines and best practices** – Sections covering language versions, frameworks, architecture patterns, error handling, security practices, testing strategies, and performance considerations.
- **Examples** – Code snippets illustrating preferred patterns or anti‑patterns.
- **Checklists** – Lists of rules that Copilot should enforce, such as “Avoid hardcoded credentials” or “Use prepared statements for database queries”.
- **References** – Links to official documentation or internal guidelines.

## How to Use Instructions

1. **Create a top‑level instructions file**: Place a file named `.github/copilot-instructions.md` in your repository. Provide general guidelines that apply to the entire codebase.
2. **Add task‑specific instructions**: In `.github/instructions/`, create files like `build.instructions.md` or `database.instructions.md` for specialised topics. Copilot merges these with the top‑level file based on `applyTo` patterns.
3. **Update regularly**: Keep instructions up to date as your architecture or standards evolve. Use the `last_updated` field to track changes.
4. **Reference them in prompts**: When writing a Copilot prompt (e.g. in a PR description), mention relevant instruction files to give Copilot full context.

## Best Practices

- **Be explicit**: The more specific your guidelines, the better Copilot can assist. Include language versions, library versions and command examples.
- **Keep it short**: Long instructions may dilute the message. Use headings, tables and lists to improve readability.
- **Use examples**: Show small, self‑contained code snippets illustrating the correct approach.
- **Avoid contradictions**: Ensure that different instruction files do not conflict. If multiple files apply, Copilot may struggle to choose which to follow.
- **Separate concerns**: Use separate instruction files for different domains (e.g. frontend, backend, infrastructure) to keep guidelines organised.

By crafting clear, concise instructions, you make it easier for Copilot to understand your project’s requirements, leading to more accurate and useful AI‑generated suggestions.
