---
description: "Documentation and content creation standards"
applyTo: "**/*.md"
---

# INLINE-MARKDOWN.md

file_type: "instructions"

LightSpeedWP **Markdown** standards for docs and READMEs.

## Principles

- Clear, concise, **task-focused** writing.
- Use H1 once per file; start with a short summary.
- Prefer lists, tables, and code blocks over paragraphs for steps.

## Formatting

- Wrap long lines naturally; Prettier/markdownlint will format.
- Use fenced code blocks with language hints: `js,`php, ```bash.
- Prefer **relative links** within the repo.

## Frontmatter (if site generator uses it)

```yaml
---
title: Getting Started
description: Quick start for Tour Operator
---
```

## Markdown Content Rules

The following markdown content rules are enforced in the validators:

1. **Headings**: Use appropriate heading levels (H2, H3, etc.) to structure your content. Do not use an H1 heading, as this will be generated based on the title.
2. **Lists**: Use bullet points or numbered lists for lists. Ensure proper indentation and spacing.
3. **Code Blocks**: Use fenced code blocks for code snippets. Specify the language for syntax highlighting.
4. **Links**: Use proper markdown syntax for links. Ensure that links are valid and accessible.
5. **Images**: Use proper markdown syntax for images. Include alt text for accessibility.
6. **Tables**: Use markdown tables for tabular data. Ensure proper formatting and alignment.
7. **Line Length**: Limit line length to 400 characters for readability.
8. **Whitespace**: Use appropriate whitespace to separate sections and improve readability.
9. **Front Matter**: Include YAML front matter at the beginning of the file with required metadata fields.

## Formatting and Structure

Follow these guidelines for formatting and structuring your markdown content:

- **Headings**: Use `##` for H2 and `###` for H3. Ensure that headings are used in a hierarchical manner. Recommend restructuring if content includes H4, and more strongly recommend for H5.
- **Lists**: Use `-` for bullet points and `1.` for numbered lists. Indent nested lists with two spaces.
- **Code Blocks**: Use triple backticks (`) to create fenced code blocks. Specify the language after the opening backticks for syntax highlighting (e.g.,`csharp).
- **Links**: Use `[link text](URL)` for links. Ensure that the link text is descriptive and the URL is valid.
- **Images**: Use `![alt text](image URL)` for images. Include a brief description of the image in the alt text.
- **Tables**: Use `|` to create tables. Ensure that columns are properly aligned and headers are included.
- **Line Length**: Break lines at 80 characters to improve readability. Use soft line breaks for long paragraphs.
- **Whitespace**: Use blank lines to separate sections and improve readability. Avoid excessive whitespace.

## Validation Requirements

Ensure compliance with the following validation requirements:

- **Front Matter**: Include the following fields in the YAML front matter:
  - `post_title`: The title of the post.
  - `author1`: The primary author of the post.
  - `post_slug`: The URL slug for the post.
  - `microsoft_alias`: The Microsoft alias of the author.
  - `featured_image`: The URL of the featured image.
  - `categories`: The categories for the post. These categories must be from the list in /categories.txt.
  - `tags`: The tags for the post.
  - `ai_note`: Indicate if AI was used in the creation of the post.
  - `summary`: A brief summary of the post. Recommend a summary based on the content when possible.
  - `post_date`: The publication date of the post.

- **Content Rules**: Ensure that the content follows the markdown content rules specified above.
- **Formatting**: Ensure that the content is properly formatted and structured according to the guidelines.
- **Validation**: Run the validation tools to check for compliance with the rules and guidelines.

# Role

You are the Markdown documentation linter for LightSpeed projects. Enforce clarity, formatting, and style consistency using markdownlint and Prettier.

# Configuration

- Linter: [markdownlint-cli](https://github.com/DavidAnson/markdownlint)
- Config: [`.markdownlint.json`](../../.markdownlint.json), [`.markdownlintignore`](../../.markdownlintignore)
- Formatter: [Prettier](https://prettier.io/) ([`prettier.config.js`](../../prettier.config.js))
- Editor: [`.editorconfig`](../../.editorconfig)
- NPM script: `"lint:md": "markdownlint '**/*.md' --fix"`
- CI: Linting is enforced via [`.github/workflows/lint.yml`](../../.github/workflows/lint.yml)
- VS Code: Tasks available for Markdown linting
- **Recommended:** Husky pre-commit hook for Markdown linting

# Setup

1. **Install dependencies:**

   ```bash
   npm install --save-dev markdownlint-cli prettier husky
   ```

2. **Config files:**
   Ensure `.markdownlint.json`, `.markdownlintignore`, and `prettier.config.js` exist.
3. **NPM script:**

   ```json
   "lint:md": "markdownlint '**/*.md' --fix"
   ```

4. **VS Code:**
   Use Task Runner (`npm: lint-md`).
5. **Pre-commit hook (optional, recommended):**

   ```bash
   npx husky add .husky/pre-commit "npm run lint:md"
   ```

6. **CI:**
   Markdown linting runs on every PR.

# Rules & Practices

- Enforces [WordPress Markdown documentation standards](https://developer.wordpress.org/coding-standards/markdown/).
- ATX headings (`#`, `##`, etc.), no skipped heading levels.
- Blank lines between sections and lists.
- Fenced code blocks with language specified.
- Lines ≤ 120 characters.
- Excludes files/folders listed in `.markdownlintignore`.

# Running & Fixing

- Manually: `npm run lint:md` (autofixes where possible)
- VS Code: Use Task Runner for Markdown linting.
- CI: Linting is enforced on PRs.
- Prettier: For formatting, run `npx prettier --write '**/*.md'`.

# References

- [markdownlint docs](https://github.com/DavidAnson/markdownlint)
- [Prettier docs](https://prettier.io/)
