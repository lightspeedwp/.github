# GitHub MCP Server Configuration

## 🚀 Essential GitHub Integration for AI-Powered Development

## Table of Contents

- [Overview](#overview)
- [Installation & Configuration](#installation--configuration)
- [🔥 Key Features](#-key-features)
- [🎯 Critical Tools & Commands](#-critical-tools--commands)
- [GitHub Copilot Spaces Integration](#github-copilot-spaces-integration)
- [Authentication Setup](#authentication-setup)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Overview

The **GitHub MCP Server** (`@modelcontextprotocol/server-github`) is the **most important MCP server** for development workflows. It provides **direct access** to GitHub repositories, issues, pull requests, and **Copilot Spaces** through AI chat interfaces.

> **⚡ Why This Matters:** Transform your development workflow by letting AI directly interact with your GitHub resources, eliminating context switching and manual repository navigation.

## Installation & Configuration

### MCP Configuration (`.vscode/mcp.json`)

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_AUTH_TYPE": "oauth"
      }
    }
  }
}
```

### VS Code Settings (`.vscode/settings.json`)

```json
{
  "github.copilot.chat.enableMcp": true,
  "github.copilot.chat.allowMcpPrompts": true,
  "github.copilot.chat.allowMcpResources": true,
  "github.copilot.chat.mcpConfigFile": ".vscode/mcp.json"
}
```

## 🔥 Key Features

### **Repository Management**

- ✅ **Browse files and directories** without leaving your editor
- ✅ **Read file contents** from any repository you have access to
- ✅ **Search code** across repositories and organizations
- ✅ **Create, update, and delete files** programmatically
- ✅ **Search across repositories** with advanced filters
- ✅ **Clone and fork repositories** programmatically

### **Issue & PR Management**

- ✅ **Create and manage issues** with AI assistance
- ✅ **Review and comment on pull requests**
- ✅ **Assign issues and reviewers**
- ✅ **Merge pull requests** with validation
- ✅ **Automated code review** with intelligent suggestions
- ✅ **Branch and tag management** for version control

### **🎯 GitHub Copilot Spaces** (Premium Feature)

- ✅ **Create and join development Spaces**
- ✅ **Share context across team members**
- ✅ **Persistent conversation history**
- ✅ **Organization-wide knowledge sharing**
- ✅ **Real-time collaborative editing** with context sharing
- ✅ **AI-assisted project planning** and task management

### **Team Collaboration**

- ✅ **List team members and permissions**
- ✅ **Organization-level operations**
- ✅ **Workflow and action management**

## 🎯 Critical Tools & Commands

### **Essential Repository Commands**

```bash
# 🔍 SEARCH & DISCOVERY
@github search repositories "WordPress block theme"
@github search code "function wp_enqueue_scripts"
@github list repositories --org lightspeedwp

# 📁 FILE OPERATIONS (Most Important!)
@github get file README.md
@github get file src/blocks/hero/block.json
@github list files --path src/blocks/
@github create file docs/new-feature.md "Content here"
@github update file package.json "Updated content"

# 🐛 ISSUE MANAGEMENT
@github list issues --state open --assignee @me
@github create issue "Bug: Header styling broken" "Description..."
@github update issue 123 --state closed
@github assign issue 123 @ashleyshaw
```

### **🎯 GitHub Copilot Spaces Commands** (Game Changer!)

```bash
# 🚀 SPACES MANAGEMENT (Premium Feature)
@github spaces list
@github spaces create "LightSpeed Block Development"
@github spaces join space-abc123
@github spaces leave space-abc123

# 📚 CONTEXT SHARING
@github spaces add context src/blocks/hero/
@github spaces add context docs/development-guide.md
@github spaces share conversation "Latest UI updates"

# 👥 TEAM COLLABORATION
@github spaces invite @ashleyshaw
@github spaces members list
@github spaces history --limit 50
```

### **Pull Request Workflows**

```bash
# 🔄 PR OPERATIONS
@github list pull-requests --state open
@github create pull-request --title "Feature: New hero block" --branch feature/hero-block
@github review pull-request 456 --approve
@github merge pull-request 456 --method squash
@github request review 456 @lightspeedwp/developers
```

### **Team & Organization Commands**

```bash
# 👥 TEAM MANAGEMENT
@github list teams --org lightspeedwp
@github team members lightspeedwp/developers
@github team repositories lightspeedwp/copilot
```

## GitHub Copilot Spaces Integration

### **🌟 What Makes This Special**

GitHub Copilot Spaces through MCP provides **unprecedented team collaboration**:

#### **Space Creation & Management**

```bash
# Create development-focused Spaces
@github spaces create "WordPress Block Theme Development" --description "Collaborative space for block theme development at LightSpeed"
@github spaces create "Bug Triage & Resolution" --description "Space for tracking and resolving critical bugs"
```

#### **Context Sharing**

```bash
# Share entire project context
@github spaces add context --recursive src/
@github spaces add context package.json
@github spaces add context docs/

# Share specific issues and PRs
@github spaces add context --issue 123
@github spaces add context --pull-request 456
```

#### **Team Knowledge Base**

- **Persistent Conversations:** All discussions remain accessible
- **Shared Context:** Team members inherit project knowledge
- **Cross-Repository Insights:** Connect work across multiple repos
- **Decision History:** Track why architectural decisions were made

## Authentication Setup

### **OAuth Authentication (Strongly Recommended)**

**Why OAuth?**

- ✅ **Secure:** No token storage in configuration files
- ✅ **Automatic:** VS Code handles authentication flow
- ✅ **Scoped:** Only request needed permissions
- ✅ **Refreshable:** Tokens auto-refresh without intervention

### **Setup Process**

1. **Configure MCP:** Ensure `GITHUB_AUTH_TYPE: "oauth"` in configuration
2. **First Command:** Use any `@github` command in Copilot Chat
3. **Browser Authentication:** VS Code opens GitHub OAuth flow
4. **Permission Grant:** Review and accept requested scopes
5. **Automatic Connection:** MCP server authenticated automatically

## Advanced Usage

### **Multi-Repository Workflows**

```bash
# Cross-repository analysis
@github search code "lightspeedwp" --repos lightspeedwp/.github,lightspeedwp/ai-block-theme

# Bulk operations
@github list issues --org lightspeedwp --label "priority:high"
@github create issue --repo lightspeedwp/docs "Update installation guide" "Description..."
```

### **Automation & Integration**

```bash
# Workflow management
@github list workflows --repo lightspeedwp/.github
@github run workflow "CI/CD Pipeline" --branch main

# Release management
@github list releases --repo lightspeedwp/ai-block-theme
@github create release v1.2.0 --title "Block Theme Update" --body "Release notes..."
```

## Troubleshooting

### **🚨 Common Issues & Solutions**

#### **"GitHub MCP server not responding"**

```bash
# Check server status
@github ping

# Restart MCP servers
# VS Code Command Palette → "Developer: Reload Window"
```

#### **"Authentication failed"**

```bash
# Re-authenticate
# VS Code: Sign out of GitHub → Sign back in
# Try command again to trigger OAuth flow
```

#### **"Rate limit exceeded"**

- **Wait:** GitHub API rate limits reset hourly
- **Optimize:** Use more specific queries
- **Authenticate:** Authenticated requests have higher limits

### **Debug Information**

```bash
# Check MCP configuration
# Open: VS Code Output Panel
# Select: "GitHub Copilot Chat"
# Look for: MCP server connection status
```

## Best Practices

### **🎯 Performance Optimization**

1. **Specific Queries:** Use targeted searches instead of broad scans
2. **Batch Operations:** Combine related commands when possible
3. **Cache Awareness:** Leverage MCP's built-in caching
4. **Rate Limiting:** Respect GitHub API limits

### **🔒 Security Guidelines**

1. **OAuth Only:** Never use personal access tokens in configuration
2. **Permission Review:** Regularly audit GitHub app permissions
3. **Team Access:** Use organization-level authentication policies
4. **Audit Trails:** Monitor MCP server usage in GitHub audit logs

### **👥 Team Collaboration**

1. **Shared Configurations:** Version control MCP configurations
2. **Naming Conventions:** Use consistent Space and repository naming
3. **Documentation:** Document custom workflows and commands
4. **Training:** Ensure team understands MCP capabilities

### **🚀 Workflow Integration**

```bash
# Example: Complete feature development workflow
@github create issue "Feature: User authentication" "Detailed description..."
@github create branch feature/user-auth
@github spaces create "User Auth Development"
@github spaces add context --issue 789
# ... development work ...
@github create pull-request --title "Feature: User authentication" --issue 789
@github request review 890 @lightspeedwp/developers
@github merge pull-request 890 --method squash
```

## Integration

This GitHub MCP server integrates with:

- [VS Code MCP Overview](./vscode-mcp.md) for general setup
- [VS Code Settings](./vscode-settings.md) for editor integration
- [MCP Server Playwright](./mcp-server-playwright.md) for testing workflows
- [NPM Package.json](./npm-package-json.md) for dependency management
