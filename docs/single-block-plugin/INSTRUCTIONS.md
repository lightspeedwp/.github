---
title: "LightSpeed Default Single Block Plugin Instructions"
version: "v1.0"
last_updated: "2025-10-17"
author: "LightSpeed Block Dev Copilot"
maintainer: "Ash Shaw"
description: "How to scaffold, customize, and document a standards-compliant single-block WordPress plugin for community health using mustache placeholders."
tags: ["lightspeed","wordpress","block-plugin","community-health","template","instructions"]
type: "prompt"
---

# Role (required)
You are a plugin developer using the LightSpeed standard to create a single-block WordPress plugin.  
Follow LightSpeed and WordPress coding standards at all times.  
Reference: [LightSpeed Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)

# Style (required)
- Use clear, standards-compliant PHP, JS, CSS, and Markdown.
- All files and filenames must use **mustache placeholders** for project-specific values.
- Add comments in configs and code to explain non-obvious logic, placeholder usage, or LightSpeed-specific conventions.
- Reference the relevant LightSpeed instruction file for each config/source file.

# Purpose (required)
- Provide a robust, customizable base for single-block plugin development.
- Enable fast onboarding for contributors.
- Ensure code, tests, and docs meet WordPress and LightSpeed standards.
- Document every placeholder for easy customization.

# Type of Task (required)
- Initial scaffolding of new block plugin projects.
- Refactoring legacy block plugins.
- Contributor onboarding and extension.
- Setting up automated linting, formatting, and testing.

# How to ask for help (required)
- See `README.md`, `DEVELOPMENT.md`, and `SUPPORT.md` for common questions and workflows.
- Raise issues/PRs on GitHub for bugs, feature requests, and support.
- Reference [LightSpeed Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/) and WordPress docs.

# Conventions (optional)
- Use mustache placeholders for all project-specific values.
- Place block source in `src/`.
- Use `@wordpress/scripts` for build/test/lint.
- Always escape output and use i18n functions.

# Process (required)
1. **Clone the template repo**.
2. **Replace mustache placeholders** in all files and filenames.
3. **Install dependencies** (`npm install`, `composer install`).
4. **Run build, lint, and test scripts**.
5. **Update documentation** with any customizations.
6. **Reference instruction files** in comments throughout.

# Examples (optional)
- [WordPress/block-development-examples](https://github.com/WordPress/block-development-examples)
- [lightspeedwp/copyright-date-block](https://github.com/lightspeedwp/copyright-date-block)

# Important notes (optional)
- Never hardcode project-specific values.
- All config/source files must use placeholders and reference docs.

# Who is this for (optional)
- Plugin developers using WordPress blocks.
- Contributors onboarding to LightSpeed projects.
- Maintainers and reviewers.

# Responsibilities (optional)
- Keep code and docs up to date.
- Validate placeholder replacement in all files.
- Ensure standards compliance.

# Patterns or Frameworks to Follow (optional)
- [LightSpeed Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
- [WordPress Block API Docs](https://developer.wordpress.org/block-editor/reference-guides/block-api/)

# Practices (optional)
- Use ARIA/accessibility patterns.
- Escape all output, use i18n for text.
- Favor functional components and hooks.

# Tools (optional)
- `@wordpress/create-block` for scaffolding.
- `wp-scripts` for build/test.
- VS Code with recommended extensions.

# Coverage (optional)
- All files in the structure below must be included.

# Constraints (required)
- No hardcoded values—only placeholders.
- No deprecated WordPress APIs or patterns.
- All config, source, and documentation files are required.

# What to do (required)
- Scaffold the complete file structure below using placeholders in filenames and file contents.
- Clearly document placeholder usage and replacement in `README.md` and `DEVELOPMENT.md`.
- Reference instruction files in each config/source file.

# What not do (required)
- Do not omit any required file.
- Do not hardcode values.
- Do not use deprecated practices.

# Best Practices (required)
- Use standards-compliant code and comments.
- Add references to instruction files everywhere.
- Ensure accessibility and security.

# Guardrails (required)
- Lint and test all code before commit.
- Validate placeholder replacement.
- Keep documentation accurate and updated.

# Checklist relevant to instructions (required)
- [x] All files use mustache placeholders.
- [x] Every file references relevant instructions.
- [x] No deprecated patterns or APIs.
- [x] Docs explain placeholder usage.

# Outputs (required)
- A complete, customizable, standards-compliant single-block plugin repo.
- Documented file structure with placeholder usage.
- Links to references and standards for each file.

# Contribution & Collaboration (optional)
- Use PRs for all changes.
- Validate standards compliance before merge.

# Non-goals (optional)
- Not intended for multi-block plugins.
- No support for deprecated APIs.

# Resource links (optional)
- [LightSpeed Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
- [Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [HTML Templates](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/html-template.instructions.md)
- [Pattern Development](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/pattern-development.instructions.md)
- [PHP Block Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/php-block.instructions.md)
- [Theme JSON](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/theme-json.instructions.md)

# Prompt (required)
Scaffold a WordPress single-block plugin template repository using mustache placeholders in all config, source, and documentation files.  
Include:
- All config, source, and documentation files listed below
- Husky/lint-staged hooks, CI/CD workflows
- VS Code extensions list
- Clearly document all mustache placeholders and how to replace them
- Link to all referenced instruction files for each config/source file
Reference LightSpeed and WordPress standards throughout.

---

# File Structure (with Mustache Placeholders)

```text
{{slug}}/
├── .editorconfig
├── .eslintrc.json
├── .eslintignore
├── .babelrc
├── .browserslistrc
├── .prettierrc.js
├── .prettierignore
├── .npmpackagejsonlintrc.json
├── .npmrc
├── .markdownlint.json
├── .markdownlintignore
├── .distignore
├── .gitattributes
├── .gitignore
├── .shellcheckrc
├── .readthedocs.yaml
├── .all-contributorsrc
├── package.json
├── composer.json
├── webpack.config.js
├── postcss.config.js
├── stylelint.config.js
├── playwright.config.js
├── phpunit.xml
├── phpcs-baseline.xml
├── src/
│   ├── block.json
│   ├── index.js
│   ├── edit.js
│   ├── save.js
│   ├── style.scss
│   ├── editor.scss
│   └── render.php
├── {{slug}}.php
├── README.md
├── DEVELOPMENT.md
├── USAGE.md
├── SUPPORT.md
├── SECURITY.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── vscode-extensions.txt
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   ├── settings.json
│   └── tasks.json
├── .husky/
│   └── [git hooks]
├── .github/
│   └── [workflows, agents]
├── bin/
│   ├── build.sh
│   ├── test.sh
│   ├── install-wp-tests.sh
│   └── update-version.js
```

## Mustache Placeholders Defined

| Placeholder      | Description                                    | Example                  |
|------------------|------------------------------------------------|--------------------------|
| `{{slug}}`       | Plugin/block slug (kebab-case)                 | `copyright-date-block`   |
| `{{namespace}}`  | PHP/JS namespace                               | `lightspeedwp`           |
| `{{author}}`     | Author or organization                         | `LightSpeed`             |
| `{{description}}`| Short project description                      | `Display copyright date` |
| `{{license}}`    | License type                                   | `GPL-2.0-or-later`       |
| `{{textdomain}}` | Textdomain for translations                    | `copyright-date-block`   |
| `{{version}}`    | Project version                                | `1.0.0`                  |
| `{{projectName}}`| Display name                                   | `Copyright Date Block`   |

- **Replace all placeholders** in filenames and file contents during setup.
- **Document each replacement** in `README.md` and `DEVELOPMENT.md`.

## How to Replace Placeholders

- Use IDE multi-file search/replace for all `{{placeholder}}`.
- Update filenames (e.g., `{{slug}}.php` → `copyright-date-block.php`).
- Document all replacements in `README.md`.
- Reference [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md).

## Reference Links for Each Config/Source File

- Add a comment in each config/source file referencing its instruction doc, e.g.:
    - JS:  
      `// See https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md`
    - Markdown:  
      `See [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)`

---

**This file is the single source of truth for scaffolding, customizing, and documenting a default LightSpeed single-block plugin.**  
If in doubt, consult the referenced instruction files or reach out via your contributor channels.
