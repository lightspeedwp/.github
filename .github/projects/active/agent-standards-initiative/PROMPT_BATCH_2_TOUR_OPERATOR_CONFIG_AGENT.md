# PHASE 2 BATCH PROMPT: Tour Operator Configuration Agent

**Agent:** tour-operator-config-agent  
**Domain:** configuration  
**Focus:** tour-operator  
**Purpose:** Configure and manage tour operator website settings and configurations  
**Effort:** 2-4 hours  
**Use:** Copy-paste into Claude Code chat and execute  

---

## CONTEXT

You are rewriting the **Tour Operator Config Agent** from ChatGPT format into a standardized multi-provider agent compatible with Claude, GitHub Copilot, and OpenAI Codex.

**Current Location:** `.github/agents/tour-operator-config-agent/`

**Reference Documents:**
- `PROMPT_2_GENERIC_AGENT_REWRITE.md` — Template structure (available in project folder)
- `AGENT_STANDARDIZATION_AUDIT.md` — Standardization framework

**Timeline:** 2-4 hours  
**Branch:** `feat/agent-standards-tour-operator-config`  
**Target:** `develop`

---

## QUICK PARAMETER MAP

| Parameter | Value |
| --- | --- |
| {AGENT_NAME} | Tour Operator Config Agent |
| {agent-slug} | tour-operator-config |
| {DOMAIN} | configuration |
| {FOCUS} | tour-operator |
| {Agent Purpose} | Configure and manage tour operator website settings, integrations, and deployment configurations |

---

## EXECUTION INSTRUCTIONS

Follow these 8 phases (reference PROMPT_2_GENERIC_AGENT_REWRITE.md for detailed guidance):

### Phase 1: Analyze Existing Export
- Examine `.github/agents/tour-operator-config-agent/`
- Document current capabilities & tools
- Create analysis file

### Phase 2: Create Folder Structure
- Backup existing → `tour-operator-config-agent-backup`
- Create new structure (claude/, copilot/, openai/, shared/)
- Preserve skills & manifests

### Phase 3: Create AGENT.md Specification
```yaml
name: tour-operator-config
title: Tour Operator Config Agent
description: >
  Configure and manage tour operator website settings, integrations,
  deployment configurations, and operational parameters for tour-based
  WordPress and WooCommerce sites.

version: '2.0.0'
category: configuration
providers:
  - claude
  - copilot
  - openai

capabilities:
  - tour-operator-configuration
  - settings-management
  - integration-setup
  - deployment-configuration
  - performance-optimization
  - backup-management

requirements:
  - WordPress 6.0+
  - WooCommerce 7.0+ (if ecommerce)
  - Tour plugin (specific version TBD)
  - SSH/SFTP access (optional)

constraints:
  - No production data modification without confirmation
  - Config backups required before changes
  - Limited to configuration files (no core modifications)
  - Requires admin credentials for some operations

security:
  rules:
    - No credentials in configuration files
    - Credentials stored in environment variables only
    - Config changes logged for audit
    - Backup before major changes
```

### Phase 4: Create Core Prompt
Write `.github/agents/tour-operator-config-agent/shared/core-prompt.md`:

```markdown
# Tour Operator Config Agent — Core Prompt

You are a tour operator website configuration expert. Your role is to:

1. **Configure** tour operator settings and integrations
2. **Manage** WordPress and WooCommerce configurations
3. **Optimize** performance and deployment settings
4. **Guide** users through configuration processes
5. **Validate** configuration changes before applying

## Key Responsibilities

- Tour operator plugin configuration
- Payment gateway integration setup
- Email notification configuration
- SEO and performance settings
- Backup and recovery procedures
- Deployment configuration

## Constraints

- Never modify code without explicit instruction
- Always backup configuration before changes
- Validate configurations after updates
- Log all changes for audit trail
- Never expose credentials in output

## Best Practices

1. Document all configuration changes
2. Test changes in staging before production
3. Maintain configuration version history
4. Provide clear rollback instructions
5. Validate third-party integrations
```

### Phase 5: Create Provider Configs
Create provider-specific files:
- `claude/agent.md` — Claude-specific instructions & tools
- `copilot/agent.md` — Copilot chat format & skills
- `openai/agent.md` — OpenAI function calling format

(See PROMPT_2 Phase 3 for templates)

### Phase 6: Define Tools Per Provider
Create tool definitions:
- `claude/tools.json` — 5+ tools (config-read, config-validate, config-update, file-backup, settings-apply)
- `copilot/skills.yaml` — Skill references (tour-operator-settings, wordpress-config, woocommerce-setup)
- `openai/tools.json` — Function definitions following OpenAI spec

### Phase 7: Create Plugin
- Create `.github/plugins/lightspeed-configuration-tour-operator/`
- Create `plugin.json` with agent reference
- Create `copilot-plugin.json` for GitHub Copilot
- Create provider-specific configs
- Create README.md & INSTALL.md

### Phase 8: Validate & Test
- Run schema validation
- Run hook validation
- Test provider configs load
- Verify documentation complete
- Create PR to develop

---

## FILE CHECKLIST

- [ ] Analysis document created
- [ ] Folder structure created
- [ ] AGENT.md written & validated
- [ ] Core prompt created
- [ ] Claude config & tools created
- [ ] Copilot config & skills created
- [ ] OpenAI config & functions created
- [ ] Plugin created with all configs
- [ ] README & INSTALL.md created
- [ ] Schema validation passing
- [ ] Hook validation passing
- [ ] Tests passing
- [ ] PR created & merged

---

## REFERENCE CHECKLIST

Use PROMPT_2_GENERIC_AGENT_REWRITE.md for:
- Task 1: Analysis procedure
- Task 2: Folder structure details
- Task 3: AGENT.md template
- Task 4: Core prompt template
- Tasks 5-7: Provider config templates
- Task 8: Tool definition formats
- Tasks 9-14: Plugin & documentation
- Tasks 15-20: Validation & testing
- Tasks 21-26: Git workflow

---

## DOMAIN NOTES

**Tour Operator Configuration Focus:**
- Settings specific to tour/travel websites
- Multi-location tour management
- Booking & availability configuration
- Integration with tour booking systems
- Guide assignment and scheduling
- Customer communication templates
- Pricing and discount structures

---

## SUCCESS CRITERIA

When all checkboxes above are checked, this agent is complete and ready for merge to develop.

---

**Total Estimated Time:** 2-4 hours  
**Begin with Phase 1 (Analysis)** → Work systematically through Phase 8 (Validation & Test)
