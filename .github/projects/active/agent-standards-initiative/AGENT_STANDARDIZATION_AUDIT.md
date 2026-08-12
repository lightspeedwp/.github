# Agent & Plugin Standardization Audit & Implementation Plan

**Date:** 2026-07-22  
**Author:** Claude Code  
**Status:** Planning Phase  

---

## Executive Summary

The LightSpeedWP `.github` repository contains **16 ChatGPT agent exports** in mixed folder structures alongside **41 existing agent specifications**. This audit identifies gaps in standardization and proposes a unified architecture for **multi-provider agent exports** (Claude, GitHub Copilot, OpenAI Codex) with supporting plugins, hooks, and documentation.

---

## Part 1: Current State Analysis

### 1.1 Agent Landscape

**Agent Specs (`.agent.md` files):** 25 files
- Format: YAML frontmatter + Markdown content
- Standards: Defined in `agents/agent.md` and `instructions/agent-spec.instructions.md`
- Examples: `testing.agent.md`, `release.agent.md`, `reporting.agent.md`

**ChatGPT Exports (Folder-based):** 16 folders
- Structure: `agent/`, `skills/`, `manifests/`, `checksums.sha256`, `README.md`
- Status: **NOT integrated with Claude/Copilot/OpenAI ecosystems**
- Examples:
  - `playwright-testing-agent/`
  - `prd-agent/`
  - `design-partner-agent/`
  - `linear-advisor-agent/`
  - `zendesk-support-agent/`

**Key Gap:** ChatGPT exports exist in isolation; they need rewriting as portable, multi-provider agents.

### 1.2 Plugin Architecture

**Existing Plugins:** 6 fully structured
- Pattern: `lightspeed-{domain}-{focus}` (kebab-case)
- Multi-provider support: `.claude-plugin/`, `.codex-plugin/`, `.gemini-plugin/` directories
- Agents storage: `agents/` subfolder per plugin
- Skills storage: `skills/` subfolder with relative imports
- Hooks: `hooks/` subfolder with hook definitions
- Manifest: `copilot-plugin.json` for GitHub Copilot

**Key Gap:** No standardized naming or folder structure for plugin-agent relationships.

### 1.3 Instruction Landscape

**Coverage:** 42 files including dedicated agent guidance
- `agent-spec.instructions.md` — Agent specification standards
- `automation.instructions.md` — Agent automation patterns
- `copilot-operations.instructions.md` — GitHub Copilot-specific rules

**Key Gap:** No instruction file for **agent creation workflow** or **multi-provider agent exports**.

### 1.4 Hooks & Security

**Existing Hooks:** 3 hooks registered
- `secrets-scanner` — Detect hardcoded secrets
- `session-logger` — Session tracking
- `tool-guardian` — Tool access controls

**Key Gap:** No hooks for **agent validation** or **plugin integrity checks**.

### 1.5 Schema & Configuration

**Existing Schemas:** 16 JSON schemas
- `agent-config.schema.json` — Agent configuration
- `plugin-manifest.schema.json` — Plugin manifest
- `skill-agent-config.schema.json` — Skill-agent binding
- `frontmatter.schema.json` — Markdown frontmatter validation

**Key Gap:** No unified schema for **multi-provider agent exports** or **agent-plugin bindings**.

### 1.6 Documentation & Cookbook

**Cookbook Entries:** 4
- `project-planning-and-prd-playbook.md`
- `spec-driven-workflow-example.md`
- `wordpress-plugin-checklist.md`

**Key Gap:** No **agent creation playbook** or **plugin integration guide**.

---

## Part 2: Standardization Framework

### 2.1 Naming Conventions

#### Agents

| Context | Pattern | Examples |
| --- | --- | --- |
| Agent spec files | `{domain}-{focus}.agent.md` | `testing.agent.md`, `release.agent.md` |
| Agent export folders | `{domain}-{function}-agent` | `playwright-testing-agent`, `linear-advisor-agent` |
| Agent subfolder inside plugin | `agents/{domain}-{focus}` | `agents/playwright-testing/` |

**Rule:** Use lowercase, kebab-case throughout. Suffix `agent` only on export folders, not files.

#### Plugins

| Context | Pattern | Examples |
| --- | --- | --- |
| Plugin folders | `lightspeed-{domain}-{focus}` | `lightspeed-playwright-testing`, `lightspeed-linear-advisor` |
| Plugin manifest | `{plugin-name}/copilot-plugin.json` | `lightspeed-playwright-testing/copilot-plugin.json` |
| Provider subdirs | `{plugin}/.{provider}-plugin/` | `.claude-plugin/`, `.codex-plugin/`, `.gemini-plugin/` |
| Agents inside plugin | `{plugin}/agents/{agent-slug}/` | `lightspeed-playwright-testing/agents/playwright-e2e-testing/` |

**Rule:** Plugin names begin with `lightspeed-` to disambiguate from external plugins.

### 2.2 Folder Structure: Agent Export

**New Standard for ChatGPT-to-Multi-Provider Conversion:**

```
.github/agents/playwright-testing-agent/
├── AGENT.md                    # Agent spec (derived from .agent.md template)
├── README.md                   # Export summary (updated)
├── .github/
│   ├── INSTALL.md             # Installation instructions
│   ├── MANIFEST.json          # Agent metadata (schema: agent-config.schema.json)
│   └── security-policy.md     # Provider-specific security rules
├── claude/
│   ├── agent.md               # Claude-specific agent instructions
│   └── tools.json             # Claude tool definitions
├── copilot/
│   ├── agent.md               # GitHub Copilot instructions
│   ├── copilot-plugin.json    # Copilot manifest
│   └── skills.yaml            # Copilot skill bindings
├── openai/
│   ├── agent.md               # OpenAI Codex instructions
│   └── tools.json             # OpenAI function definitions
├── shared/
│   ├── core-prompt.md         # Base prompt (provider-agnostic)
│   ├── tools/                 # Shared tool definitions
│   ├── memory/                # Shared memory templates
│   └── hooks/                 # Agent-specific hooks
├── skills/                    # Shared skills (from ChatGPT export)
├── manifests/                 # Metadata & inventories
└── checksums.sha256           # Integrity verification
```

**Rationale:**
- Separates provider-specific instructions from shared base
- Enables single-source-of-truth for common logic
- Provides per-provider customization without duplication
- Maintains backward compatibility with ChatGPT export format

### 2.3 Folder Structure: Plugin

**Standard for Multi-Agent Plugins:**

```
.github/plugins/lightspeed-playwright-testing/
├── plugin.json                # Master plugin manifest
├── README.md                  # Plugin overview & capabilities
├── INSTALL.md                 # Installation guide (links to agent INSTALL.md files)
├── LICENSE                    # Plugin license
├── .claude-plugin/
│   ├── manifest.json          # Claude plugin config
│   └── instructions.md        # Claude-specific rules
├── .codex-plugin/
│   ├── copilot-plugin.json    # GitHub Copilot config
│   └── instructions.md        # Copilot-specific rules
├── .gemini-plugin/
│   ├── manifest.json          # Google Gemini config
│   └── instructions.md        # Gemini-specific rules
├── agents/
│   ├── playwright-e2e-testing/
│   │   ├── agent.md
│   │   ├── manifest.json
│   │   └── provider-configs/   # Provider-specific overrides
│   └── playwright-integration/
│       └── [same structure]
├── skills/
│   ├── playwright-selectors/
│   ├── browser-automation/
│   └── [shared skills]
├── hooks/
│   ├── agent-validation.js
│   └── security-checks.js
├── .schemas/
│   └── agent-manifest.schema.json  # Plugin-specific schema
└── cookbook/
    └── playwright-testing-playbook.md
```

**Rationale:**
- Plugin groups related agents under common identity
- Provider-specific configs live in `.{provider}-plugin/` directories
- Shared skills & hooks avoid duplication
- Cookbook provides integration recipes

### 2.4 Schema Additions Required

**New Schemas to Create:**

1. **`multi-provider-agent.schema.json`**
   - Validates agents compatible with Claude, Copilot, OpenAI
   - Fields: `providers`, `tools`, `capabilities`, `provider_overrides`

2. **`agent-plugin-binding.schema.json`**
   - Links agents to plugins
   - Fields: `agent_id`, `plugin_id`, `required_skills`, `hooks`

3. **`provider-config.schema.json`**
   - Per-provider agent configuration
   - Fields: `provider`, `instructions`, `tools`, `memory_config`, `security_rules`

4. **`agent-capability-manifest.schema.json`**
   - Declares agent capabilities and prerequisites
   - Fields: `capabilities`, `requirements`, `constraints`, `performance_targets`

### 2.5 Hook Additions Required

**New Hooks to Create:**

1. **`agent-spec-validator.js`**
   - Validates agent YAML frontmatter against `agent-config.schema.json`
   - Checks for provider compatibility
   - Reports missing translations

2. **`multi-provider-consistency-checker.js`**
   - Ensures Claude, Copilot, OpenAI versions stay synchronized
   - Detects divergences in core prompts
   - Flags provider-specific customizations

3. **`plugin-integrity-checker.js`**
   - Validates plugin manifest completeness
   - Checks agent-skill bindings
   - Verifies provider-specific configs exist

4. **`agent-security-auditor.js`**
   - Scans agents for security violations
   - Checks tool access controls
   - Validates secrets handling

### 2.6 Instruction File Additions

**New Files to Create:**

1. **`agent-creation-workflow.instructions.md`**
   - Step-by-step guide for converting ChatGPT agents
   - Provider-specific configuration patterns
   - Testing & validation procedures

2. **`multi-provider-compatibility.instructions.md`**
   - How to write provider-agnostic core prompts
   - Per-provider customization patterns
   - Tool mapping across providers

3. **`plugin-architecture.instructions.md`**
   - Plugin structure & folder organization
   - Agent-plugin binding patterns
   - Hook integration guidelines

### 2.7 AI Configuration Updates

**Updates to `/ai/` folder:**

1. **`agents-unified.md`**
   - Meta-config for all agents
   - Provider support matrix
   - Migration status tracker

2. **`multi-provider-mapping.md`**
   - Tool mapping: Claude → Copilot → OpenAI
   - Capability parity matrix
   - Provider-specific constraints

---

## Part 3: Implementation Roadmap

### Phase 1: Playwright Testing Agent (Initial Pilot)

**Branch:** `feat/agent-standards-playwright-testing`

**Deliverables:**
1. Rewrite `playwright-testing-agent/` folder per new structure
2. Create Claude, Copilot, OpenAI provider configs
3. Create `lightspeed-playwright-testing` plugin
4. Add hooks: agent-validation, multi-provider-consistency, plugin-integrity
5. Create schemas: multi-provider-agent, agent-plugin-binding, provider-config
6. Create cookbook: `playwright-agent-creation-guide.md`
7. Create instructions: `agent-creation-workflow.instructions.md`
8. Documentation & validation tests

### Phase 2: Agent Standardization Loop

**Approach:** Generic reusable prompt for remaining 15 ChatGPT agents

**Per-Agent:** ~2-3 hours each
- Rewrite folder structure
- Create provider configs
- Create/update plugin (group by domain)
- Add tests

### Phase 3: Repo-wide Governance

**Deliverables:**
1. Merge all phase 1 & 2 schemas
2. Deploy hooks as org-wide enforcement
3. Update instruction files
4. Update memory schema
5. Create unified AI config

---

## Part 4: Detailed Prompts

### Prompt 1: Playwright Testing Agent + Repo Audit (This Session)

See **PLAYWRIGHT_AGENT_REWRITE_PROMPT.md** (separate document)

**Scope:**
- Audit: instructions, hooks, schema, ai configs
- Create: standardized folder structure & naming conventions
- Implement: playwright-testing-agent rewrite
- Create: lightspeed-playwright-testing plugin
- Documentation: INSTALL, cookbook, instruction files

**Estimated Effort:** 6-8 hours

### Prompt 2: Generic Agent Rewrite Prompt (Reusable)

See **GENERIC_AGENT_REWRITE_PROMPT.md** (separate document)

**Scope:**
- Single agent conversion (ChatGPT → multi-provider)
- Provider-specific config generation
- Plugin integration
- Hook configuration
- Testing & validation

**Estimated Effort:** 2-3 hours per agent

---

## Part 5: Success Criteria

### Phase 1 (Playwright Testing)

- [ ] Agent folder restructured per new standard
- [ ] Claude, Copilot, OpenAI provider configs created & validated
- [ ] Plugin created and installable
- [ ] Hooks functional and enforcing standards
- [ ] New schemas validated against all configs
- [ ] Cookbook & instruction files created
- [ ] All tests passing
- [ ] PR approved & merged to `develop`

### Phase 2 (Remaining Agents)

- [ ] 15 agents rewritten using generic prompt
- [ ] 6 plugins created/updated with agents
- [ ] Hook enforcement active repo-wide
- [ ] Memory schema updated for agent persistence

### Phase 3 (Governance)

- [ ] All schemas merged into canonical registry
- [ ] Instruction files consolidated
- [ ] AI configs unified
- [ ] Documentation complete

---

## Part 6: Risk Assessment

| Risk | Mitigation |
| --- | --- |
| Provider API changes break compatibility | Version-pin configs; add provider version matrix |
| Skill/tool mismatch across providers | Multi-provider-consistency hook; automated testing |
| Large PR scope causes merge conflicts | Phase into separate PRs per agent; use feature branches |
| Agent behavior diverges across providers | Comprehensive testing suite; provider-specific CI/CD |
| Memory/state inconsistency | Unified schema for memory persistence |

---

## Recommendations

1. **Start with playwright-testing-agent** as pilot to validate structure
2. **Create schemas first** before implementing agents
3. **Test provider compatibility early** (Claude, Copilot, OpenAI SDKs)
4. **Use hooks for enforcement** to catch divergences
5. **Document heavily** — cookbook & instruction files are critical
6. **Batch plugins by domain** (e.g., `lightspeed-testing` for all test-related agents)
7. **Version-control everything** — even provider configs

---

## Next Steps

1. Review this audit with team
2. Approve naming conventions & folder structure
3. Execute Prompt 1 (playwright agent + repo audit)
4. Generate Prompt 2 (generic agent rewrite)
5. Begin Phase 2 conversion loop
