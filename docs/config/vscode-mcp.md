# MCP Configuration Overview

**🚀 Model Context Protocol (MCP) Server Configuration for AI-Enhanced Development**

## Table of Contents

- [Overview](#overview)
- [Quick Setup](#quick-setup)
- [Available MCP Servers](#available-mcp-servers)
- [Configuration Files](#configuration-files)
- [Essential Commands](#essential-commands)
- [Server-Specific Documentation](#server-specific-documentation)
- [Authentication](#authentication)
- [Troubleshooting](#troubleshooting)
- [Integration](#integration)

## Overview

**Model Context Protocol (MCP)** revolutionizes AI-assisted development by enabling **direct integration** between GitHub Copilot and external tools. This setup provides **seamless access** to GitHub repositories, Copilot Spaces, and automated browser testing.

> **⚡ Transform Your Workflow:** Let AI directly interact with your GitHub repositories, generate browser tests, and automate development tasks through natural language commands.

## Quick Setup

### **1-Minute MCP Setup** ⚡

```json
// .vscode/mcp.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": { "GITHUB_AUTH_TYPE": "oauth" }
    },
    "playwright": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-playwright"]
    }
  }
}
```

```json
// .vscode/settings.json
{
  "github.copilot.chat.enableMcp": true,
  "github.copilot.chat.allowMcpPrompts": true,
  "github.copilot.chat.allowMcpResources": true,
  "github.copilot.chat.mcpConfigFile": ".vscode/mcp.json"
}
```

**That's it!** Restart VS Code and start using `@github` and `@playwright` commands.

## Available MCP Servers

### 🚀 **GitHub MCP Server** (`@modelcontextprotocol/server-github`)

**🔥 Most Critical Tool for Development**

**Key Capabilities:**
- ✅ **Repository & file management** - Browse, read, create, update files
- ✅ **Issue & PR workflows** - Create, assign, review, merge
- ✅ **🎯 GitHub Copilot Spaces** - Team collaboration & context sharing  
- ✅ **Organization management** - Teams, permissions, workflows
- ✅ **Advanced search** - Code, repositories, issues across organizations

**Authentication:** OAuth (automatic via VS Code)

### 🎭 **Playwright MCP Server** (`@modelcontextprotocol/server-playwright`)

**🎯 AI-Powered Browser Testing**

**Key Capabilities:**
- ✅ **Test generation** - AI writes complete test suites from descriptions
- ✅ **Browser automation** - Multi-browser testing & mobile emulation
- ✅ **Visual testing** - Screenshot comparison & regression detection
- ✅ **Performance testing** - Core Web Vitals & network monitoring

**Authentication:** None required

## Essential Commands

### 🚀 **GitHub Operations (Most Important!)**

```bash
# 🔍 Repository & File Management
@github search repositories "WordPress block theme"
@github get file README.md
@github create file docs/setup.md "Content here"
@github list files --path src/blocks/

# 🐛 Issue & PR Workflows  
@github create issue "Bug: Header styling" "Description..."
@github create pull-request --title "Feature: New block"
@github review pull-request 123 --approve

# 🎯 Copilot Spaces (Team Collaboration)
@github spaces create "Block Development"
@github spaces add context src/blocks/hero/
@github spaces invite @teammate
```

### 🎭 **Playwright Testing**

```bash
# 🤖 AI Test Generation
@playwright generate tests for login flow
@playwright generate tests for WordPress block editor
@playwright generate accessibility tests for homepage

# ▶️ Test Execution
@playwright run all tests
@playwright run tests --project chromium --headed
@playwright debug failed test login.spec.js

# 📸 Browser Automation
@playwright screenshot current page
@playwright navigate to https://lightspeedwp.agency
@playwright fill form field "email" with "test@example.com"
```

## Server-Specific Documentation

For detailed documentation on each MCP server:

### 📚 **Complete Server Guides**

- **[GitHub MCP Server](./github-mcp-server.md)** - Repository management, Copilot Spaces, team collaboration
- **[Playwright MCP Server](./playwright-mcp-server.md)** - Browser automation, test generation, visual testing

### 🎯 **When to Use Each Server**

| Use Case | MCP Server | Key Commands |
|----------|------------|--------------|
| **Repository Management** | GitHub | `@github get file`, `@github search code` |
| **Issue Tracking** | GitHub | `@github create issue`, `@github assign` |
| **Team Collaboration** | GitHub | `@github spaces create`, `@github teams` |
| **Browser Testing** | Playwright | `@playwright generate tests`, `@playwright run` |
| **UI Automation** | Playwright | `@playwright click`, `@playwright screenshot` |
| **Performance Testing** | Playwright | `@playwright audit lighthouse` |

## Configuration Files

### **Main Configuration** (`.vscode/mcp.json`)

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
    "playwright": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-playwright"]
    }
  }
}
```

### **VS Code Settings** (`.vscode/settings.json`)

```json
{
  "github.copilot.chat.enableMcp": true,
  "github.copilot.chat.allowMcpPrompts": true,
  "github.copilot.chat.allowMcpResources": true,
  "github.copilot.chat.mcpConfigFile": ".vscode/mcp.json"
}
```

## Authentication

### **🔒 Secure OAuth Authentication (Recommended)**

**GitHub MCP Server:**
- ✅ **Automatic:** VS Code handles entire OAuth flow
- ✅ **Secure:** No tokens stored in configuration files
- ✅ **Scoped:** Only necessary permissions requested
- ✅ **Refreshable:** Tokens auto-refresh without intervention

**Playwright MCP Server:**
- ✅ **No authentication required** - Works immediately

### **⚡ First-Time Setup**

1. **Add MCP configuration** to your project
2. **Restart VS Code** to load MCP servers
3. **Use any `@github` command** in Copilot Chat
4. **Complete OAuth flow** when prompted
5. **Start automating** your development workflow!

## Troubleshooting

### **🚨 Quick Fixes**

#### **MCP Servers Not Responding**
```bash
# 1. Restart VS Code
# Command Palette → "Developer: Reload Window"

# 2. Check configuration
# Verify mcp.json syntax and file path

# 3. Check authentication  
# Try: @github ping
```

#### **Commands Not Recognized**
- ✅ Ensure MCP is enabled in VS Code settings
- ✅ Verify `mcpConfigFile` path is correct
- ✅ Check VS Code Output panel for MCP errors

#### **Authentication Issues**
- ✅ Sign out and re-authenticate in VS Code
- ✅ Clear VS Code authentication cache
- ✅ Verify internet connectivity

### **📊 Debug Information**

```bash
# Check MCP server status in VS Code:
# 1. Open Output panel (View → Output)
# 2. Select "GitHub Copilot Chat" from dropdown  
# 3. Look for MCP server connection status
```

## Integration

### **🔗 Related Configuration**

This MCP setup integrates with:

- **[VS Code Settings](./vscode-settings.md)** - Editor settings and extensions
- **[MCP Server GitHub](./mcp-server-github.md)** - Detailed GitHub integration guide  
- **[MCP Server Playwright](./mcp-server-playwright.md)** - Complete testing automation guide
- **[NPM Package.json](./npm-package-json.md)** - Dependencies and scripts

### **🚀 Workflow Enhancement**

**Complete Development Workflow Example:**
```bash
# 1. Analyze existing code
@github get file src/components/Hero.jsx

# 2. Generate comprehensive tests  
@playwright generate tests for Hero component functionality

# 3. Create improvement issue
@github create issue "Enhance Hero component accessibility"

# 4. Test accessibility compliance
@playwright generate accessibility tests for Hero component

# 5. Share context with team
@github spaces create "Hero Component Enhancement"
@github spaces add context src/components/Hero.jsx
```

## Best Practices

### **🎯 Maximize Productivity**

1. **Use Specific Commands:** `@github get file path/to/file.js` vs generic queries
2. **Combine Servers:** Use GitHub for context, Playwright for testing
3. **Team Collaboration:** Leverage Copilot Spaces for shared knowledge
4. **Automate Testing:** Generate tests as you develop features

### **🔒 Security & Performance**

1. **OAuth Only:** Never use personal access tokens in configuration
2. **Regular Updates:** Keep MCP servers updated to latest versions  
3. **Resource Management:** Use specific queries to avoid rate limits
4. **Team Coordination:** Share MCP configurations via version control
