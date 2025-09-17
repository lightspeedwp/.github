# GitHub Copilot MCP Configuration

This directory contains the Model Context Protocol (MCP) configuration for GitHub Copilot in LightSpeed WordPress projects.

## MCP.json

The `MCP.json` file configures the following MCP servers:

### Playwright Server
- **Purpose**: Browser automation for accessibility and end-to-end testing
- **Type**: Built-in server
- **Configuration**: 
  - Default browser: Chromium
  - Headless mode enabled
  - 30-second timeout

### GitHub Remote Server  
- **Purpose**: GitHub API access with OAuth authentication
- **Type**: Remote server
- **Authentication**: OAuth with scopes for repo access, user email, and organization read permissions
- **Organization**: lightspeedwp

## Usage

This configuration enables GitHub Copilot to:
- Automate browser testing using Playwright
- Access GitHub repositories and organization data
- Support accessibility testing workflows
- Integrate with existing LightSpeed development practices

The configuration aligns with the organization's coding standards and workflow expectations as defined in the custom instructions.