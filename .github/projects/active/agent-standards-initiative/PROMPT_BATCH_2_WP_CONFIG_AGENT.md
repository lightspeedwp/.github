# PHASE 2 BATCH PROMPT: WordPress Configuration Agent

**Agent:** wp-config-agent  
**Domain:** wordpress  
**Focus:** configuration  
**Purpose:** Configure and manage core WordPress settings, security, and performance  
**Effort:** 2-4 hours  
**Reference:** PROMPT_2_GENERIC_AGENT_REWRITE.md (8 phases, standard process)

---

## PARAMETER MAP

| Parameter | Value |
| --- | --- |
| {AGENT_NAME} | WordPress Config Agent |
| {agent-slug} | wp-config |
| {DOMAIN} | wordpress |
| {FOCUS} | configuration |
| {Agent Purpose} | Configure and manage WordPress core settings, security hardening, performance optimization, and theme/plugin management |

---

## AGENT SPECIFICATION

```yaml
name: wp-config
title: WordPress Configuration Agent
description: >
  Manage WordPress core configuration, security settings, performance
  optimization, theme configuration, and plugin management for
  LightSpeed WordPress projects.

version: '2.0.0'
category: wordpress
providers: [claude, copilot, openai]

capabilities:
  - wordpress-core-configuration
  - security-hardening
  - performance-optimization
  - plugin-management
  - theme-configuration
  - backup-management
  - wp-cli-automation

requirements:
  - WordPress 6.0+
  - WP-CLI installed (optional but recommended)
  - SSH/SFTP access
  - Database access

constraints:
  - No core file modifications (use filters/actions)
  - Respects WordPress coding standards
  - Limited to WordPress Coding Standards
  - Requires admin credentials

security:
  rules:
    - Never expose credentials
    - Validate all settings before applying
    - Maintain audit logs
    - Backup before major changes
```

---

## CORE RESPONSIBILITIES

1. Configure WordPress core settings (general, reading, discussion, etc.)
2. Implement security hardening (SSL, headers, firewall rules)
3. Optimize performance (caching, lazy loading, minification)
4. Manage plugins (installation, updates, security)
5. Configure themes (customization, settings, performance)
6. Setup backups and recovery procedures
7. Automate configuration via WP-CLI

---

## KEY TOOLS/CAPABILITIES

**Claude Tools:**
- wp-config-read
- wp-config-validate
- wp-config-update
- security-hardener
- performance-optimizer
- backup-manager

**Copilot Skills:**
- wordpress-core-settings
- security-hardening
- wp-cli-commands
- plugin-management
- theme-configuration

**OpenAI Functions:**
- configure_wordpress_setting
- apply_security_settings
- optimize_performance
- manage_plugins
- generate_backup

---

## DOMAIN NOTES

**WordPress Configuration Focus:**
- Core WordPress settings (general, reading, discussion, media)
- WordPress security (SSL, headers, firewall, 2FA)
- Performance optimization (caching, lazy loading, CDN)
- Plugin & theme management
- Multisite configuration (if applicable)
- User roles & capabilities
- WP-CLI automation

---

## EXECUTION PHASES (See PROMPT_2 for details)

1. **Analyze** — Examine wp-config-agent folder
2. **Structure** — Create new folder layout
3. **Spec** — Write AGENT.md with YAML frontmatter
4. **Core Prompt** — Provider-agnostic instructions
5. **Provider Configs** — Claude, Copilot, OpenAI customizations
6. **Tools** — Define tools per provider
7. **Plugin** — Create lightspeed-wordpress-configuration plugin
8. **Validate** — Test all schemas & hooks

---

## ESTIMATED EFFORT

- Analysis & Setup: 30-45 min
- AGENT.md & Core Prompt: 45-60 min
- Provider Configs & Tools: 45-60 min
- Plugin & Documentation: 30-45 min
- Testing & Validation: 20-30 min
- Git & Merge: 15-20 min

**Total: 2.5-4 hours**

---

## SUCCESS CRITERIA

✅ All 8 phases completed  
✅ AGENT.md created with YAML frontmatter  
✅ Core prompt (provider-agnostic) written  
✅ 3 provider configs created (Claude, Copilot, OpenAI)  
✅ Tool definitions specified per provider  
✅ Plugin created with all provider configs  
✅ Schema validation passing  
✅ Hook validation passing  
✅ Documentation complete  
✅ PR merged to develop  

---

**Follow PROMPT_2_GENERIC_AGENT_REWRITE.md for step-by-step guidance on all 8 phases.**
