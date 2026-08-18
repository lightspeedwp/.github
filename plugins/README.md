---
file_type: 'documentation'
title: 'Plugin Bundles & Integration Strategy'
description: 'Ownership index for installable LightSpeed AI plugin bundles, plugin-family strategy, and integration guidelines.'
version: 'v0.3.1'
created_date: '2026-05-29'
last_updated: '2026-05-29'
maintainer: 'LightSpeed Team'
authors:
  - LightSpeed Team
license: 'GPL-3.0'
stability: 'stable'
domain: 'governance'
tags:
  - plugins
  - ai-ops
  - integration
  - automation
---

# Plugin Bundles & Integration Strategy

This folder contains bundled plugin configurations, integration specifications, and plugin-family strategy documentation for deploying LightSpeed AI solutions.

## Overview

Plugin bundles are curated collections of:

- **Skills** – Self-contained AI capabilities
- **Agents** – Specialised automation agents
- **Hooks** – Security and safety guardrails
- **Workflows** – Reproducible process templates
- **Configuration** – Platform-specific settings

Each bundle is designed for specific use cases (e.g., WordPress development, PR automation, documentation management).

## Plugin Bundles

Bundles are defined in `PLUGIN_MANIFEST.json` and include:

- **Bundle ID** – Unique identifier for the plugin
- **Description** – What the bundle does
- **Components** – Skills, agents, hooks, and workflows included
- **Platform** – Target platforms (Claude Code, GitHub, Slack, etc.)
- **Installation** – How to install and configure the bundle
- **Version** – Semantic versioning for updates

## Installation Guide

For comprehensive installation instructions, see [PLUGIN_INSTALLATION_GUIDE.md](../docs/PLUGIN_INSTALLATION_GUIDE.md).

### Quick Start

1. **View Available Bundles** – Check `PLUGIN_MANIFEST.json`
2. **Install Bundle** – Run installation command for your platform
3. **Configure Settings** – Update `.claude/settings.json` or equivalent
4. **Verify Installation** – Test the bundle in your environment
5. **Enable Features** – Activate specific skills and agents as needed

### Installation Examples

#### Claude Code

```bash
# Install a plugin bundle
claude code --install plugin:lightspeed-wordpress-dev@latest

# Or configure in settings.json
{
  "plugins": {
    "enabled": true,
    "bundles": ["lightspeed-wordpress-dev"]
  }
}
```

#### GitHub Actions

```yaml
# Reference bundle in workflow
- name: Install LightSpeed plugins
  uses: lightspeedwp/.github/plugins@main
  with:
    bundle: lightspeed-wordpress-dev
    auto-enable: true
```

## Plugin Development

To create a new plugin bundle:

1. Design the bundle composition (which skills, agents, hooks)
2. Document the bundle in a README
3. Add manifest entry to `PLUGIN_MANIFEST.json`
4. Include installation and configuration instructions
5. Write integration tests
6. Submit PR for review

### Plugin Manifest Format

```json
{
  "id": "plugin-id",
  "name": "Display Name",
  "version": "v1.0.0",
  "description": "What this plugin does",
  "author": "LightSpeed Team",
  "platforms": ["claude-code", "github"],
  "components": {
    "skills": ["skill-id"],
    "agents": ["agent-id"],
    "hooks": ["hook-id"],
    "workflows": ["workflow-id"]
  },
  "dependencies": [],
  "configuration": {
    "required": ["key1"],
    "optional": ["key2"]
  }
}
```

## Plugin Roadmap

See [PLUGIN_PACK_ROADMAP.md](../docs/PLUGIN_PACK_ROADMAP.md) for:

- Planned plugin bundles
- Timeline for releases
- Feature priorities
- Deprecation notices

## Best Practices

- **Keep bundles focused** – Each bundle solves one clear problem
- **Document thoroughly** – Include examples and troubleshooting
- **Test integration** – Verify bundles work across platforms
- **Version carefully** – Use semantic versioning for compatibility
- **Communicate changes** – Announce breaking changes early

## Related Documentation

- [PLUGIN_PACK_ROADMAP.md](../docs/PLUGIN_PACK_ROADMAP.md) – Plugin development roadmap
- [PLUGIN_INSTALLATION_GUIDE.md](../docs/PLUGIN_INSTALLATION_GUIDE.md) – Installation and configuration
- [AGENTS.md](../AGENTS.md) – Global AI rules for plugins
- [agents/](../agents/README.md) – Available agents
- [skills/](../skills/README.md) – Available skills

---

---

*🎼 Orchestrated automation — where intelligence meets operations*
