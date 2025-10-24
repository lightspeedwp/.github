# VS Code Workspace Configuration (`.vscode`)

This folder contains all Visual Studio Code workspace settings, tasks, and recommended extensions for the LightSpeedWP project.  
It ensures a consistent, automated, and standards-driven development experience for all contributors.

---

## Folder Contents

- **extensions.json**  
  Recommended VS Code extensions for this project, including:
    - AI coding assistants (Copilot, Claude, Gemini, CodeRabbit, etc.)
    - GitHub workflow tools (PRs, Codespaces, Actions, GitLens)
    - Linting and formatting (Prettier, ESLint, Stylelint, Markdownlint)
    - WordPress/PHP development (Intelephense, PHPCS, WP Toolbox)
    - Testing (Playwright)
    - JSON, Docker, and other core dev tools

- **settings.json**  
  Workspace-wide editor and tool settings:
    - Enforces formatting on save, trailing whitespace trimming, and newline rules
    - Language-specific formatting and linting (PHP, JS, CSS, JSON, Markdown)
    - Copilot and AI agent configuration
    - File associations for custom doc types
    - Excludes build and dependency folders from search and file watching
    - YAML schema mapping for documentation and automation

- **tasks.json**  
  Predefined tasks for common workflows:
    - Run unit tests (`npm: test-unit`)
    - Lint JavaScript, CSS, and Markdown
    - Run Playwright E2E tests
    - Collect test coverage

- **launch.json**  
  Debugger configuration for PHP (Xdebug on port 9003).

- **mcp.json**  
  Model Context Protocol (MCP) server configuration:
    - Integrates GitHub and Playwright MCP servers for advanced automation, E2E testing, and Copilot Spaces.

---

## Usage

- Open the project in VS Code to automatically apply these settings and see extension recommendations.
- Use the Task Runner (`Cmd+Shift+P` → "Run Task") for linting, testing, and E2E workflows.
- The workspace is pre-configured for collaborative, standards-compliant WordPress and automation development.

---

_Maintained by the LightSpeedWP team for a seamless contributor experience._
