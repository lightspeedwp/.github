---
title: Claude Code Setup Guide
description: Step-by-step installation and configuration of Claude Code for development
created: 2026-07-26T00:00:00.000Z
updated: 2026-07-26T00:00:00.000Z
type: guide
---

# Claude Code Setup Guide

A comprehensive guide to installing, configuring, and using Claude Code in your development workflow.

## What is Claude Code?

Claude Code is an official AI-powered development assistant for VS Code that helps with code generation, refactoring, debugging, and project-wide analysis. It integrates Claude's capabilities directly into your editor.

**Key Features:**

- Multi-file project analysis and code generation
- Intelligent debugging and error diagnosis
- Refactoring suggestions and automated improvements
- Documentation generation and standards enforcement
- Natural language code search across projects
- Built-in terminal for running commands
- Git integration and commit message generation

---

## Prerequisites

- **VS Code:** Version 1.86 or higher
- **Operating System:** macOS (Apple Silicon or Intel), Windows (10/11), or Linux (Ubuntu 18.04+)
- **Internet Connection:** Required for API calls to Claude
- **Claude API Access:** Active Anthropic API key (paid account required)

---

## Installation Steps

### Step 1: Install the VS Code Extension

1. Open **VS Code**
2. Go to **Extensions** (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for **"Claude Code"** (published by Anthropic)
4. Click **Install**
5. Wait for installation to complete (usually 30 seconds)

### Step 2: Authenticate with Anthropic

1. After installation, you'll see a **"Sign In"** button in the VS Code sidebar
2. Click **"Authenticate with Claude Code"**
3. Your browser will open to claude.ai
4. **Sign in** with your Anthropic account (create one if needed)
5. Allow Claude Code to access your account
6. Return to VS Code—you should be authenticated

### Step 3: Add Your API Key (Alternative Authentication)

If you prefer direct API key authentication:

1. Open **VS Code Settings** (Code → Preferences → Settings)
2. Search for **"Claude Code API Key"**
3. Paste your API key from [console.anthropic.com](https://console.anthropic.com)
4. Save settings (Cmd+S / Ctrl+S)

**⚠️ Important:** Never commit API keys to version control. Use environment variables or VS Code's secure settings.

---

## Configuration

### Essential Settings

Open **VS Code Settings** (Command Palette: `Cmd+Shift+P` → "Preferences: Open Settings") and configure:

| Setting | Value | Purpose |
|---------|-------|---------|
| `claude.model` | `claude-opus-5` or `claude-sonnet-5` | Choose reasoning capability |
| `claude.context-window` | `200000` | Max tokens per request |
| `claude.temperature` | `0.7` | Creativity level (0=precise, 1=creative) |
| `claude.project` | Your repo name | Tag requests by project |
| `claude.workspace-mode` | `true` | Enable multi-file analysis |

### Recommended Extensions to Pair With

- **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)** — Real-time linting feedback
- **[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)** — Code formatting
- **[GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)** — Enhanced git integration
- **[GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)** — Complementary inline suggestions

---

## First-Time Setup: Project Context

Claude Code works best when it understands your project structure:

### 1. Create a `.claude/` Directory (Optional but Recommended)

```bash
mkdir -p .claude
touch .claude/claude.json
```

### 2. Configure Your Project

Create `.claude/claude.json`:

```json
{
  "name": "Your Project Name",
  "description": "Brief description of what this project does",
  "language": "typescript",
  "framework": "react",
  "entry-points": [
    "src/index.ts",
    "src/App.tsx"
  ],
  "documentation": "docs/",
  "coding-standards": ".github/CLAUDE.md"
}
```

### 3. Link Project Instructions

Claude Code will automatically read:

- `.claude/CLAUDE.md` — Project-specific rules
- `.github/CLAUDE.md` — Organization rules
- `README.md` — Project overview

---

## Using Claude Code

### Command Palette

Open **Command Palette** (`Cmd+Shift+P` / `Ctrl+Shift+P`) and type:

| Command | Purpose |
|---------|---------|
| `Claude: Ask Claude` | General chat with Claude |
| `Claude: Generate Code` | Create code from description |
| `Claude: Refactor Code` | Improve selected code |
| `Claude: Add Tests` | Generate test cases |
| `Claude: Document Code` | Generate JSDoc/docstrings |
| `Claude: Fix Error` | Debug selected error |
| `Claude: Run Command` | Execute shell commands |
| `Claude: Create Agent` | Build custom agent |

### Right-Click Context Menu

Select any code and right-click to:

- **Ask Claude About Selection** — Get explanation
- **Generate from Template** — Code generation
- **Add Unit Tests** — Test generation
- **Explain Error** — Error diagnosis

### Claude Sidebar

The **Claude Code panel** (left sidebar) offers:

1. **Chat** — Direct conversation with Claude
2. **Files** — Project file tree and search
3. **Terminal** — Run commands, view output
4. **Agents** — Run pre-built agents
5. **Settings** — Extension configuration

---

## Common Workflows

### Workflow 1: Quick Code Generation

1. Open **Command Palette** → `Claude: Generate Code`
2. Describe what you need:

   ```
   Create a React hook that manages form state with validation. 
   Should handle text, email, and checkbox inputs.
   ```

3. Claude generates the code
4. Review and accept (or iterate)
5. Code is pasted at cursor or in new file

### Workflow 2: Debugging an Error

1. Select the error message or problematic code
2. Right-click → **Explain Error**
3. Claude analyzes the error and suggests fixes
4. Accept the fix or ask follow-up questions
5. Test your changes

### Workflow 3: Adding Tests

1. Select a function or component
2. Right-click → **Generate from Template**
3. Choose **Unit Tests**
4. Claude generates test cases
5. Review coverage and adjust as needed

### Workflow 4: Large Refactor

1. Open **Claude Chat** (sidebar)
2. Describe the refactor goal:

   ```
   I need to refactor my authentication module to use environment 
   variables instead of hardcoded secrets. What's the safest approach?
   ```

3. Claude analyzes your files and provides a plan
4. Execute the changes one step at a time
5. Commit after verification

---

## Advanced Features

### Multi-File Edits

Claude Code can edit multiple files in a single request:

1. Open **Claude Chat**
2. Ask for changes across files:

   ```
   Add TypeScript types to all JavaScript files in src/utils/. 
   Use strict typing with no implicit any.
   ```

3. Claude identifies affected files and shows a changeset
4. Review and accept all changes at once

### Agent Creation

Create custom agents for repetitive tasks:

1. **Command Palette** → `Claude: Create Agent`
2. Define the agent:
   - Name: e.g., "Test Coverage Analyzer"
   - Description: What it does
   - Trigger: When to run (manual, on save, on push)
   - Instructions: Detailed behaviour rules
3. Save your agent to `.claude/agents/`
4. Run from **Agents panel** anytime

### Terminal Integration

Claude proposes terminal commands for your approval before execution:

1. In **Claude Chat**, ask Claude to run a command:

   ```
   Run npm test and show me which tests failed
   ```

2. Claude proposes the command — **review it before approving**, especially for destructive or network-affecting operations (e.g. `rm -rf`, deployments, database changes)
3. Approve to execute; Claude shows the output and you can ask follow-up questions

---

## Troubleshooting

### Issue: "Authentication Failed"

**Solution:**

1. Open **Command Palette** → `Claude: Sign Out`
2. Sign out completely
3. Restart VS Code
4. Sign back in
5. If still failing, generate an API key at [console.anthropic.com](https://console.anthropic.com) and use Step 3 above

### Issue: "API Key Expired" or "Quota Exceeded"

**Solution:**

1. Check your [Anthropic account](https://console.anthropic.com) for active subscriptions
2. Verify your API key is current (regenerate if needed)
3. Check usage limits in your account dashboard
4. Consider upgrading your plan if quota is exceeded

### Issue: "Project Files Not Found"

**Solution:**

1. Ensure VS Code is opened at **project root** (where `.git/` or `package.json` is)
2. Run **Command Palette** → `Claude: Reload Context`
3. Check `.claude/CLAUDE.md` or `.github/CLAUDE.md` exists
4. Verify `.gitignore` isn't hiding important files

### Issue: "Slow Responses" or "Timeouts"

**Solution:**

1. Check internet connection
2. Reduce context window in settings (set to `100000` instead of `200000`)
3. Ask Claude to use a faster model: `Claude: Select Model` → choose `claude-haiku-4-5`
4. Close other heavy applications
5. Try again in a few minutes (service may be under high load)

### Issue: "Extension Won't Start"

**Solution:**

1. Open **Extension Details** (left sidebar → Claude Code → three dots)
2. Click **Disable** → Close VS Code → Open → **Enable**
3. If still failing, uninstall completely:
   - VS Code: Extensions → Claude Code → Uninstall
   - Restart VS Code
   - Reinstall from marketplace
4. Check VS Code version (must be 1.86+): `Code → About Visual Studio Code`

---

## Best Practices

### ✅ Do

- ✅ Use **clear, specific prompts** — "Add unit tests for the `calculateTotal()` function with edge case coverage"
- ✅ **Review generated code** before committing — AI isn't perfect
- ✅ **Provide context** — Include file paths, existing patterns, and constraints
- ✅ **Use multi-file mode** for related changes (refactors, migrations)
- ✅ **Keep conversations focused** — Start a new chat for unrelated topics
- ✅ **Run tests** after Claude generates code
- ✅ **Save your custom agents** to `.claude/agents/` for reuse

### ❌ Don't

- ❌ Don't **trust generated secrets or credentials** — Always verify
- ❌ Don't **commit API keys** in settings or code
- ❌ Don't **skip security review** for generated authentication code
- ❌ Don't **ask for exact copies** of proprietary code
- ❌ Don't **use without understanding** the generated code
- ❌ Don't **ignore linting errors** after generation

---

## Getting Help

### In VS Code

1. **Command Palette** → `Claude: Help`
2. Open **Extension Details** → **Read the Docs** (link to full documentation)
3. Click **Report Issue** to file a bug

### Online Resources

- **[Official Claude Code Documentation](https://claude.ai/code)** — Features and API
- **[Anthropic API Reference](https://docs.anthropic.com)** — Models, pricing, rate limits
- **[GitHub Issues](https://github.com/anthropics/claude-code/issues)** — Known issues and workarounds

### Support Channels

- **Team Help:** GitHub issues with label `[plugin-help]`
- **Escalations:** Contact Ash Shaw (<ashley@lightspeedwp.agency>)
- **Enterprise Support:** Available via Anthropic account manager

---

## What's Next?

1. **[Pair With GitHub Copilot](./plugin-setup-github-copilot.md)** — Set up complementary inline suggestions
2. **[Compare All Plugins](./plugin-comparison.md)** — Understand when to use each tool
3. **[VSCode Workspace Setup](./vscode-workspace-setup.md)** — Optimize your editor configuration
4. **[Plugin Troubleshooting](./vscode-plugin-troubleshooting.md)** — Resolve common issues

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-26 | Initial setup guide for Claude Code v1.0+ |

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
