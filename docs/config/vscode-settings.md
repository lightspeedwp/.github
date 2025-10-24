# VS Code Configuration

Documentation for VS Code settings, extensions, and workspace configuration used across LightSpeed projects.

## Table of Contents

- [Configuration Files](#configuration-files)
- [Key Settings](#key-settings)
- [MCP Configuration](#mcp-configuration)
- [Recommended Extensions](#recommended-extensions)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Integration](#integration)

## Configuration Files

### `.vscode/settings.json`

Main workspace settings file with project-specific configurations.

### Key Settings

#### GitHub Copilot & MCP

```json
{
  "github.copilot.chat.enableMcp": true,
  "github.copilot.chat.allowMcpPrompts": true,
  "github.copilot.chat.allowMcpResources": true,
  "github.copilot.chat.mcpConfigFile": ".vscode/mcp-servers.json"
}
```

#### GitHub Authentication

```json
{
  "github.gitAuthentication": true,
  "git.autofetch": true,
  "github.authenticate": "on"
}
```

#### File Associations

```json
{
  "files.associations": {
    "*.chatmode.md": "markdown",
    "*.instructions.md": "markdown", 
    "*.agent.md": "markdown",
    "*.prompt.md": "markdown",
    "*.theme.json": "jsonc",
    "theme.json": "jsonc"
  }
}
```

#### WordPress Development

```json
{
  "phpcs.enable": true,
  "phpcs.standard": "WordPress",
  "emmet.includeLanguages": {
    "php": "html"
  }
}
```

## MCP Configuration

### `.vscode/mcp-servers.json`

Model Context Protocol servers configuration for enhanced AI capabilities.

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_AUTH_TYPE": "oauth"
      }
    },
    "github-spaces": {
      "command": "npx", 
      "args": ["@github/copilot-spaces-mcp-server"],
      "env": {
        "GITHUB_AUTH_TYPE": "oauth",
        "COPILOT_SPACES_ACCESS": "true"
      }
    }
  }
}
```

## Recommended Extensions

### WordPress Development

### WordPress Extensions

- **PHP Intelephense** - PHP language support
- **WordPress Snippets** - WordPress code snippets
- **WPCS** - WordPress Coding Standards

### Linting & Formatting

- **ESLint** - JavaScript/TypeScript linting
- **Stylelint** - CSS/SCSS linting
- **Prettier** - Code formatting
- **markdownlint** - Markdown linting

### AI & Productivity

- **GitHub Copilot** - AI code assistance
- **Spectral** - YAML/API linting
- **GitLens** - Enhanced Git capabilities

## Usage

### Setup New Workspace

1. Copy `.vscode/` folder to your project root
2. Install recommended extensions
3. Configure MCP servers if using AI features
4. Customize settings for project-specific needs

### Authentication

- VS Code will prompt for GitHub OAuth on first use
- MCP servers use OAuth automatically
- No manual token configuration required

## Troubleshooting

### MCP Servers Not Loading

1. Check MCP configuration file path
2. Verify OAuth permissions
3. Restart VS Code after configuration changes

### PHPCS Not Working

1. Install PHPCS globally: `composer global require squizlabs/php_codesniffer`
2. Install WordPress standards: `composer global require wp-coding-standards/wpcs`
3. Configure PHPCS: `phpcs --config-set installed_paths ~/.composer/vendor/wp-coding-standards/wpcs`

## Integration

This configuration integrates with:

- [LINTING.md](../LINTING.md) — Main linting strategy
- [HUSKY-PRECOMMITS.md](../HUSKY-PRECOMMITS.md) — Pre-commit automation
- [npm-scripts.md](./npm-scripts.md) — NPM automation
- [lint-eslint.md](./lint-eslint.md) — ESLint config
- [lint-stylelint.md](./lint-stylelint.md) — Stylelint config
- [lint-prettier.md](./lint-prettier.md) — Prettier config
- [workflow-husky.md](./workflow-husky.md) — Husky setup
- [workflow-lint-staged.md](./workflow-lint-staged.md) — Lint-staged setup
- [frontmatter.schema.json](../../schemas/frontmatter.schema.json) — Frontmatter schema

> See [docs/CHECKLIST_CROSSLINKING.md](../CHECKLIST_CROSSLINKING.md) for cross-linking best practices.
