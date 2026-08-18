# Organization Context: Using PRD Agent v2.1 Across LightSpeedWP

## Overview

The PRD Agent v2.1 is designed to serve all LightSpeedWP WordPress projects from a single unified prompt. This document explains how organization-wide portability works, why it's valuable, and how to integrate it with your workflows.

**Key Principle:** One agent, one prompt, all project types (plugins, themes, hybrid projects).

---

## Why Organization-Wide Portability?

### The Old Way

- **Separate agents** for plugins, themes, and hybrid projects
- **Duplicated prompt maintenance** — changes ripple across multiple versions
- **Inconsistent methodologies** — teams follow slightly different processes
- **Repo-specific forks** — some repos have custom PRD templates
- **Learning curve** — teams need to learn project-specific agent variants

### The New Way (v2.1)

- **Single unified agent** works for all project types
- **Context auto-detection** determines project type from repo structure
- **Consistent methodology** across all teams
- **Centralized updates** — fix or enhance once, all projects benefit
- **Faster onboarding** — one agent to learn, works everywhere

---

## How Context Auto-Detection Works

The agent examines your repository structure to determine project type:

- **Block Plugin:** `plugin.php` + `blocks/` folder
- **Block Theme:** `theme.json` + `templates/` folder
- **Hybrid:** Both plugin and theme files present
- **Custom:** User specifies project type

---

## Key Capabilities

✅ Single unified prompt serves all project types  
✅ Automatic context detection from repo structure  
✅ Organization-wide consistency  
✅ No repo-specific versions needed  
✅ WordPress version alignment built-in  
✅ WCAG 2.2 AA accessibility emphasized  

---

## Related Documentation

- **[README.md](README.md)** — Product overview, quick start guide
- **[AGENT.md](AGENT.md)** — Agent metadata, capabilities, configuration
- **[CONTEXT_DETECTION.md](CONTEXT_DETECTION.md)** — Technical details on detection logic
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** — GitHub workflows, CI/CD patterns, roadmap sync

---

**Built by 🧱 LightSpeedWP for organization-wide WordPress product planning**
