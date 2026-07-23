# Agent Plugin Integration Guide

> **Create and validate the agent plugin.** Every Phase 2 agent gets a plugin wrapper
> in `plugins/lightspeed-{domain}-{focus}/` with provider manifests, README, INSTALL guide.
> Run this prompt after the agent code is merged to `develop`.

---

## What Is an Agent Plugin?

A plugin bundles agent metadata, provider configurations, and installation instructions
for reuse. It lives in `plugins/` (NOT `.github/plugins/`), is versioned independently,
and can be published or shared as a unit.

**Structure:**

```
plugins/lightspeed-{domain}-{focus}/
├── README.md                          # 60+ lines: agent overview, use cases, provider matrix
├── INSTALL.md                         # 80+ lines: step-by-step installation & setup
├── copilot-plugin.json                # Copilot-specific manifest
├── provider-manifests/
│   ├── claude-manifest.json
│   ├── codex-manifest.json
│   ├── copilot-manifest.json
│   ├── gemini-manifest.json
│   └── openai-manifest.json
├── package.json                       # Plugin metadata: name, version, keywords
└── LICENSE                            # (usually GPL-3.0 like the repo)
```

---

## Plugin Prompt Template

**When running this prompt in a fresh chat:**

```markdown
# {Agent Name} Plugin Integration

**Agent:** {agent-slug}  
**Plugin folder:** `plugins/lightspeed-{domain}-{focus}/`  
**Related issue(s):** #{issue-numbers}  
**Related agent PR:** #{pr-number}  

## Task: Create a complete, production-ready plugin wrapper

### What to include

1. **README.md (60+ lines)**
   - Agent overview (what it does, who uses it)
   - Key capabilities matrix (Claude / Copilot / Codex / Gemini / OpenAI)
   - Use-case examples (3–5 concrete scenarios)
   - Installation path (quick link to INSTALL.md)
   - Troubleshooting section (common issues)
   - Link back to the agent's full documentation

2. **INSTALL.md (80+ lines)**
   - Prerequisites (API keys, permissions, versions)
   - Step-by-step installation for each provider (Claude, Copilot, Codex, Gemini, OpenAI)
   - Configuration checklist
   - Verification steps (how to confirm it's working)
   - Uninstall / cleanup instructions

3. **copilot-plugin.json**
   - Plugin manifest for GitHub Copilot Marketplace
   - Skills registered from the agent's copilot/skills.yaml
   - Permissions & scopes required
   - Repository link

4. **provider-manifests/** (Claude, Copilot, Codex, Gemini, OpenAI)
   - claude-manifest.json: agent name, tools, version
   - codex-manifest.json: agent configuration, tools, capabilities
   - copilot-manifest.json: skills, commands
   - gemini-manifest.json: agent capabilities, function definitions
   - openai-manifest.json: functions, schema

5. **package.json**
   - name: "lightspeed-{domain}-{focus}"
   - version: "1.0.0"
   - description: (from agent README)
   - keywords: (agent, claude, codex, copilot, gemini, openai, {domain})

### Reference implementations

- Phase 1 plugin: `plugins/lightspeed-playwright-testing/`
  - Use its structure and style as the template
  - Copy INSTALL.md pattern (step-by-step per provider)
  - Match README.md tone and length

### Validation

- Lint all JSON (copilot-plugin.json, manifests)
- Verify INSTALL.md has steps for all 5 providers (Claude, Copilot, Codex, Gemini, OpenAI)
- Confirm README links to agent documentation (if public)
- Test that package.json is valid

### Output

Push to branch `feat/agent-standards-{slug}-plugin` off `develop`.  
Create PR to `develop` with squash merge.  
Once merged, run the **Hooks Integration** prompt next.
```

---

## Plugin Naming Convention

| Domain | Focus | Plugin Name | Folder |
| --- | --- | --- | --- |
| design | partner-collaboration | lightspeed-design-partner | `plugins/lightspeed-design-partner/` |
| ecommerce | woocommerce | lightspeed-ecommerce-woocommerce | `plugins/lightspeed-ecommerce-woocommerce/` |
| configuration | wordpress | lightspeed-configuration-wordpress | `plugins/lightspeed-configuration-wordpress/` |
| performance | optimization | lightspeed-performance-optimization | `plugins/lightspeed-performance-optimization/` |
| project-management | linear | lightspeed-project-management-linear | `plugins/lightspeed-project-management-linear/` |

---

## Checklist (Per Plugin)

- [ ] README.md written (60+ lines, agent overview + capabilities + use cases)
- [ ] INSTALL.md written (80+ lines, step-by-step for all 5 providers)
- [ ] copilot-plugin.json valid and matches agent skills
- [ ] provider-manifests/ created (5 JSON files, all valid)
- [ ] package.json complete with correct name, version, keywords
- [ ] All JSON lints clean (`npm run lint:json`)
- [ ] Verified against Phase 1 plugin template
- [ ] PR created, merged to develop, branch deleted

---

*Use this prompt in a dedicated chat after the agent code is merged. Reference: `AGENT_COMPLETE_WORKFLOW.md` step 2.*
