---
file_type: framework
category: agent-standardization
created_date: 2026-07-22
version: v1.0.0
status: active
scope: phase-1-implementation
---

# Multi-Provider Agent Standardization Framework — Phase 1

**Framework Version:** v1.0.0  
**Effective Date:** 2026-07-22  
**Initiative:** LightSpeedWP Agent Standards (Issue #1079)  
**Phase:** 1 (Playwright Testing Agent + Repository Standardization)

---

## Post-Implementation Corrections (2026-07-22)

This document was drafted before implementation. The following points supersede
any conflicting text below; the implemented code and the living guidance in
`instructions/` are authoritative.

- **Asset locations are top-level**, not under `.github/`: `hooks/`, `.schemas/`,
  `instructions/`, `plugins/`, `cookbook/`, `agents/`. (Report/audit files
  correctly live under `.github/reports/`.)
- **Plugin manifest contract:** a plugin has **no root `plugin.json`**. It ships
  four provider manifests — `copilot-plugin.json`, `.claude-plugin/plugin.json`,
  `.codex-plugin/plugin.json`, `.gemini-plugin/plugin.json` — and is registered
  in `plugins/PLUGIN_MANIFEST.json`. This is what `validate:plugins` and
  `plugin-integrity-checker` enforce. `.codex-plugin` is the Codex/OpenAI
  manifest (not a Copilot asset).
- **Validation guarantees reflect the implemented hooks only.**
  `agent-spec-validator` enforces required fields (`name`, `description`,
  `providers`, `capabilities`), semantic-version and status formats, and array
  types. `multi-provider-consistency-checker` enforces core-prompt presence,
  per-provider config presence, minimum provider coverage, and rejects
  unsupported declared providers — it does **not** compare provider prose for
  contradictions.
- **Security findings block.** `agent-security-auditor` treats confirmed
  credential assignments (quoted or unquoted, incl. `.env`) and private-key /
  bearer-token patterns as **errors** (exit 1). The `SKIP:agent-security-auditor`
  directive is surfaced as a warning so bypasses remain auditable.
- **Instruction filenames:** `multi-provider-compatibility.instructions.md` and
  `plugin-architecture.instructions.md` (earlier draft names differed).

## Executive Summary

This framework establishes authoritative standards for converting ChatGPT agent exports into **multi-provider agents** compatible with Claude, GitHub Copilot, and OpenAI Codex. It synthesizes findings from five comprehensive audits (instructions, hooks, schemas, AI config, memory) and provides normative guidance for Phase 1 implementation.

**Key Outcomes:**

- Establish naming conventions and folder structures
- Define validation rules and schemas
- Describe hooks for automated checking
- Create instruction files for future conversions
- Document decision rationale

---

## Part 1: Naming Conventions

### Agent Specifications

#### Agent Spec Files

```
{domain}-{focus}.agent.md
```

**Examples:**

- `testing.agent.md`
- `playwright-testing.agent.md`
- `content-strategist.agent.md`
- `project-management.agent.md`

**Rules:**

- Lowercase, kebab-case
- Descriptive but concise
- Domain first, then specific focus
- Applied to: `agents/` and `.github/agents/`

#### Agent Export Folders

```
{domain}-{focus}-agent/
```

**Examples:**

- `agents/playwright-testing-agent/`
- `agents/testing-agent/`
- `.github/agents/playwright-testing-agent/`

**Rules:**

- Lowercase, kebab-case
- Matches agent spec file prefix
- Suffix: `-agent`
- Parent: `agents/` or `.github/agents/`

#### Agent Within Plugin

```
agents/{domain}-{focus}/
```

**Examples:**

- `plugins/lightspeed-playwright-testing/agents/playwright-testing/`
- `plugins/lightspeed-project-management/agents/linear-sync/`

**Rules:**

- Folder name matches agent ID (without `-agent` suffix)
- Located inside plugin's `agents/` directory
- Consistent naming across multi-agent plugins

### Plugin Naming

#### Plugin Folders

```
lightspeed-{domain}-{focus}
```

**Examples:**

- `plugins/lightspeed-playwright-testing`
- `plugins/lightspeed-project-management-linear`
- `plugins/lightspeed-support-zendesk`

**Rules:**

- Prefix: `lightspeed-` (organisation identifier)
- Lowercase, kebab-case
- Domain and focus separated by hyphens
- No version suffix in folder name

#### Plugin Manifests

```
{plugin-name}/plugin.json
{plugin-name}/copilot-plugin.json
```

**Examples:**

- `plugins/lightspeed-playwright-testing/plugin.json`
- `plugins/lightspeed-playwright-testing/copilot-plugin.json`

**Rules:**

- Master manifest: `plugin.json` (generic)
- Copilot manifest: `copilot-plugin.json` (Copilot-specific)
- Provider-specific: `.{provider}-plugin/` subdirs (optional)

#### Provider Subdirectories

```
.{provider}-plugin/
```

**Examples:**

- `.claude-plugin/`
- `.codex-plugin/`
- `.gemini-plugin/`

**Rules:**

- Prefix: `.` (hidden directory convention)
- Provider name: `claude`, `codex`, `gemini`
- Located inside plugin root

---

## Part 2: Folder Structures

### Agent Export Structure (Multi-Provider)

```
agents/playwright-testing-agent/
├── AGENT.md                          # Master spec with YAML frontmatter
├── README.md                          # Agent documentation
├── shared/
│   ├── core-prompt.md                # Provider-agnostic instructions
│   ├── tools/                        # Shared tool definitions (if any)
│   ├── memory/                       # Shared memory schemas
│   └── hooks/                        # Shared hook references
├── claude/
│   ├── agent.md                      # Claude-specific instructions
│   ├── tools.json                    # Claude tools definition
│   └── response-format.json          # Claude response schema
├── copilot/
│   ├── agent.md                      # Copilot-specific instructions
│   ├── skills.yaml                   # Copilot skills reference
│   └── config.yaml                   # Copilot configuration
├── openai/
│   ├── agent.md                      # OpenAI-specific instructions
│   ├── tools.json                    # OpenAI functions definition (JSON Schema)
│   └── response-format.json          # OpenAI response format
├── .github/
│   ├── INSTALL.md                    # Installation instructions
│   ├── MANIFEST.json                 # Agent manifest (tools per provider)
│   └── security-policy.md            # Agent security guidelines
├── skills/                           # Reusable skills
│   ├── playwright-selectors.md
│   ├── browser-automation.md
│   └── test-reporting.md
├── manifests/                        # (Preserved from ChatGPT export)
│   └── [existing manifests]
└── checksums.sha256                  # (Preserved from ChatGPT export)
```

**Folder Purposes:**

| Folder | Purpose | Files |
|---|---|---|
| `shared/` | Provider-agnostic core | core-prompt.md, tool defs, hooks |
| `claude/` | Claude-specific config | agent.md, tools.json, response-format.json |
| `copilot/` | Copilot-specific config | agent.md, skills.yaml, config.yaml |
| `openai/` | OpenAI-specific config | agent.md, tools.json, response-format.json |
| `.github/` | Agent-level metadata | INSTALL.md, MANIFEST.json, security-policy.md |
| `skills/` | Reusable skill definitions | skill-name.md, tool-usage.md |
| `manifests/` | Preserved ChatGPT artifacts | (original folder) |

---

### Plugin Structure (Multi-Agent Container)

```
plugins/lightspeed-playwright-testing/
├── plugin.json                       # Master plugin manifest
├── copilot-plugin.json               # Copilot-specific manifest
├── README.md                         # Plugin overview & features
├── INSTALL.md                        # Installation guide per provider
├── CHANGELOG.md                      # Plugin changelog
├── .claude-plugin/
│   └── [Claude-specific assets]
├── .codex-plugin/
│   └── [Copilot-specific assets]
├── .gemini-plugin/
│   └── [Gemini-specific assets]
├── agents/
│   ├── playwright-testing/           # Agent 1 (multi-provider)
│   │   ├── AGENT.md
│   │   ├── shared/
│   │   ├── claude/
│   │   ├── copilot/
│   │   ├── openai/
│   │   └── skills/
│   └── [future-agents]/              # Agent 2, 3, etc.
├── skills/
│   ├── playwright-selectors/
│   │   ├── skill.md
│   │   ├── examples.md
│   │   └── tools.json
│   ├── browser-automation/
│   └── test-reporting/
├── hooks/
│   ├── hook-references.json
│   └── [hook implementations if plugin-specific]
├── .schemas/
│   └── [plugin-specific schemas if needed]
├── docs/
│   ├── agent-guide.md
│   ├── skill-guide.md
│   └── troubleshooting.md
└── tests/
    ├── agent.test.js
    └── manifest.test.js
```

**Key Structure Rules:**

1. **One plugin = One or more agents** (grouped by domain/function)
2. **Multi-agent plugins use `agents/` subfolder** (not root-level agents)
3. **Provider-specific assets use `.{provider}-plugin/` convention**
4. **Skills are shared** (referenced by all agents in plugin)
5. **Hooks are registered** (via plugin.json)

---

## Part 3: Validation Rules

### AGENT.md Frontmatter Validation

**Required Fields:**

```yaml
---
name: {kebab-case-id}
title: {Human Readable Title}
description: {Brief description}
version: X.Y.Z
status: active|inactive|deprecated|experimental
providers: [claude, copilot, openai]
capabilities:
  - capability-1
  - capability-2
---
```

**Validation Rules:**

| Field | Rule | Example |
|---|---|---|
| `name` | Lowercase, kebab-case, alphanumeric-dash | `playwright-testing` |
| `title` | Human-readable title | `Playwright Testing Agent` |
| `version` | Semantic versioning (X.Y.Z) | `2.0.0` |
| `status` | One of enum | `active` |
| `providers` | Array of valid providers (min 1) | `["claude", "copilot", "openai"]` |
| `capabilities` | Non-empty array of strings | `["browser-automation", "visual-regression"]` |

**Schema:** `.schemas/multi-provider-agent.schema.json`

### Provider Configuration Validation

**Claude (`claude/agent.md`):**

- Must include tools.json with tool definitions
- Response format: JSON or markdown
- Memory scope: session

**Copilot (`copilot/agent.md`):**

- Must include skills.yaml with skill references
- Response format: markdown (preferred)
- Must reference valid skills from `skills/` folder

**OpenAI (`openai/agent.md`):**

- Must include tools.json in OpenAI function format
- Response format: function_call + JSON
- Must follow OpenAI API specifications

**Schema:** `.schemas/provider-config.schema.json`

### Plugin Manifest Validation

**plugin.json:**

```json
{
  "name": "lightspeed-{domain}-{focus}",
  "displayName": "{Human Readable Name}",
  "version": "X.Y.Z",
  "description": "...",
  "agents": [...],
  "skills": [...],
  "hooks": [...],
  "providers": {
    "claude": {"supported": true, "minVersion": "..."},
    "copilot": {"supported": true, "minVersion": "..."},
    "openai": {"supported": true, "minVersion": "..."}
  }
}
```

**Validation Rules:**

- ✅ All agents exist in `agents/` subfolder
- ✅ All skills exist in `skills/` subfolder
- ✅ All hooks are registered in `hooks/hook-registry.json`
- ✅ Providers object has valid entries

**Schema:** `.schemas/agent-plugin-binding.schema.json`

### Capability Manifest Validation

**Capability Definition:**

- Name must be unique within agent
- Description must be provided
- Requirements (libraries, versions) must be specific
- Performance targets must be measurable

**Constraint Definition:**

- Type must be one of: data_access, timeout, network, resource, security
- Rule must be clear and enforceable
- Scope must be one of: strict, moderate, permissive, restricted

**Schema:** `.schemas/agent-capability-manifest.schema.json`

---

## Part 4: Validation Hooks

### Hook: agent-spec-validator

**Purpose:** Validate AGENT.md frontmatter against schema

**Triggers:** `pre-commit`, `pre-push`

**Checks:**

- ✅ YAML frontmatter present
- ✅ Required fields present (name, title, version, providers, capabilities)
- ✅ Field formats valid (semantic versioning, kebab-case, enums)
- ✅ Providers list contains valid values

**Failure Handling:** Exit code 1, display line numbers and field errors

**Reference:** `hooks/agent-spec-validator/`

### Hook: multi-provider-consistency-checker

**Purpose:** Detect divergences across provider configs

**Triggers:** `pre-commit`, `pre-push`

**Checks:**

- ✅ All declared providers have config files
- ✅ shared/core-prompt.md exists
- ✅ Minimum provider coverage met (2+ providers)
- ✅ No contradictions between core and provider-specific configs

**Failure Handling:** Errors block commit; warnings are informational

**Reference:** `hooks/multi-provider-consistency-checker/`

### Hook: plugin-integrity-checker

**Purpose:** Validate plugin folder structure and manifests

**Triggers:** `pre-commit`, `pre-push`

**Checks:**

- ✅ plugin.json valid JSON
- ✅ copilot-plugin.json exists
- ✅ Required subdirectories present
- ✅ All referenced agents, skills, hooks exist

**Failure Handling:** Exit code 1 on errors

**Reference:** `hooks/plugin-integrity-checker/`

### Hook: agent-security-auditor

**Purpose:** Scan for hardcoded secrets and unsafe patterns

**Triggers:** `pre-push` (recommended)

**Checks:**

- ✅ No hardcoded passwords, API keys, tokens
- ✅ No credentials in plaintext
- ✅ No unsafe patterns (db connection strings, etc.)

**Failure Handling:** Warnings logged; override with `# SKIP:agent-security-auditor` if intentional

**Reference:** `hooks/agent-security-auditor/`

---

## Part 5: Instruction Files

### agent-creation-workflow.instructions.md

**Purpose:** Step-by-step guide for converting agents to multi-provider format

**Sections:**

- Overview of 7-phase process
- Audit phase (analyze current export)
- Structure phase (create new folders)
- Specification phase (write AGENT.md, core prompt)
- Configuration phase (provider-specific configs)
- Plugin phase (create plugin wrapper)
- Validation phase (run hooks)
- Merge phase (git workflow)

**Reference:** `instructions/agent-creation-workflow.instructions.md`

### multi-provider-compatibility.instructions.md

**Purpose:** How to write agent specs for multiple providers

**Sections:**

- Separation of concerns (shared vs provider-specific)
- Folder structure
- Writing core prompts (provider-agnostic)
- Provider-specific customization patterns
- Examples for each provider

**Reference:** `instructions/multi-provider-compatibility.instructions.md`

### plugin-architecture.instructions.md

**Purpose:** Plugin structure and organization patterns

**Sections:**

- What is a plugin
- Naming conventions
- Folder structure with examples
- Multi-agent grouping patterns
- Skill and hook organization
- Validation checklist

**Reference:** `instructions/plugin-architecture.instructions.md`

### ai-operations-unified.instructions.md

**Purpose:** Provider-neutral AI operations (session tracking, logging, escalation)

**Sections:**

- Session integrity across providers
- Logging and audit trails
- Escalation procedures
- File placement for AI artifacts
- Integration with code review

**Reference:** `instructions/ai-operations-unified.instructions.md`

---

## Part 6: Schemas

### Registered Schemas (New)

| ID | File | Purpose | Use |
|---|---|---|---|
| multi-provider-agent | multi-provider-agent.schema.json | Agent specs across providers | Validate AGENT.md |
| agent-plugin-binding | agent-plugin-binding.schema.json | Agent-plugin relationships | Validate plugin.json |
| provider-config | provider-config.schema.json | Per-provider agent config | Validate claude/copilot/openai agent.md |
| agent-capability-manifest | agent-capability-manifest.schema.json | Capabilities and constraints | Validate capability definitions |

**Location:** `.schemas/` with entries in `schema-registry.json`

---

## Part 7: Decision Log

### Key Decisions Made (Phase 1A)

**Decision 001: Audit Report Location**

- **Date:** 2026-07-22
- **Status:** Active
- **Decision:** Save audit reports to `.github/reports/audits/` (not `.github/tmp/`)
- **Rationale:** CLAUDE.md specifies reports belong in `.github/reports/{category}/`; tmp is for temporary scratch
- **Impact:** Audit reports are persistent and discoverable

**Decision 002: Naming Conventions**

- **Date:** 2026-07-22
- **Status:** Active
- **Decision:** Use `{domain}-{focus}` pattern for agents and `lightspeed-{domain}-{focus}` for plugins
- **Rationale:** Clear, descriptive, follows organisation conventions
- **Impact:** All agents and plugins follow consistent naming

**Decision 003: Multi-Provider Folder Structure**

- **Date:** 2026-07-22
- **Status:** Active
- **Decision:** Separate provider configs into `claude/`, `copilot/`, `openai/` subdirectories with shared `shared/` folder
- **Rationale:** Clear separation of concerns; provider-specific customization without duplication
- **Impact:** Minimal duplication; easy to understand which code is provider-specific vs shared

**Decision 004: Validation Hook Approach**

- **Date:** 2026-07-22
- **Status:** Active
- **Decision:** Implement 4 hooks (agent-spec-validator, multi-provider-consistency-checker, plugin-integrity-checker, agent-security-auditor)
- **Rationale:** Automated validation catches issues early; prevents invalid agents from merging
- **Impact:** Higher quality of multi-provider agents; lower review burden

---

## Part 8: Success Criteria

### Phase 1A (Audits) ✅ COMPLETE

- [x] Instructions folder audited
- [x] Hooks folder audited
- [x] Schemas folder audited
- [x] AI config folder audited
- [x] Memory & schema structure audited
- [x] Framework document created

### Phase 1B (Framework) ✅ COMPLETE

- [x] Naming conventions documented
- [x] Folder structures specified
- [x] Validation rules defined
- [x] Hooks documented
- [x] Instruction files planned
- [x] Schemas defined
- [x] Decision log established

### Phase 1C-J (Implementation) — PENDING

Implementation of agent rewrite, plugin creation, validation, and merge follows this framework.

---

## Part 9: Next Steps

**Immediate (Tasks 7-16):**

1. Create new folder structure for playwright agent
2. Write AGENT.md with YAML frontmatter
3. Create shared core prompt
4. Create provider-specific configs and tools
5. Create plugin wrapper
6. Implement 4 hooks
7. Create 4 instruction files
8. Run full validation
9. Create feature branch and commit
10. Create PR and merge

**After Phase 1 Completion:**

- Apply framework to remaining 15 agents (Phase 2)
- Iterate based on Phase 1 learnings
- Expand to additional providers (Gemini, etc.)

---

## Appendix A: Glossary

| Term | Definition |
|---|---|
| **Agent** | Autonomous AI system with specific capabilities and constraints |
| **Agent Spec** | AGENT.md file with YAML frontmatter defining agent properties |
| **Provider** | AI system/platform (Claude, Copilot, OpenAI, Gemini) |
| **Multi-Provider** | Single agent supporting multiple providers simultaneously |
| **Plugin** | Package containing one or more agents, skills, and hooks |
| **Skill** | Reusable capability that agents can reference |
| **Hook** | Validation or automation rule triggered on events |
| **Manifest** | Configuration file (plugin.json, copilot-plugin.json) |

---

## Appendix B: File Checklist for Phase 1 Implementation

**Agent Folder:**

- [ ] `AGENT.md` (with YAML frontmatter)
- [ ] `README.md`
- [ ] `shared/core-prompt.md`
- [ ] `claude/agent.md` + `tools.json`
- [ ] `copilot/agent.md` + `skills.yaml`
- [ ] `openai/agent.md` + `tools.json`
- [ ] `.github/INSTALL.md`
- [ ] `.github/MANIFEST.json`
- [ ] `.github/security-policy.md`

**Plugin Folder:**

- [ ] `plugin.json`
- [ ] `copilot-plugin.json`
- [ ] `README.md`
- [ ] `INSTALL.md`
- [ ] `agents/playwright-testing/` (complete agent)
- [ ] `skills/` (reusable skills)
- [ ] `hooks/` (hook references)

**Repository Updates:**

- [ ] `.schemas/multi-provider-agent.schema.json`
- [ ] `.schemas/agent-plugin-binding.schema.json`
- [ ] `.schemas/provider-config.schema.json`
- [ ] `.schemas/agent-capability-manifest.schema.json`
- [ ] Update `.schemas/schema-registry.json`
- [ ] `hooks/agent-spec-validator/`
- [ ] `hooks/multi-provider-consistency-checker/`
- [ ] `hooks/plugin-integrity-checker/`
- [ ] `hooks/agent-security-auditor/`
- [ ] Update `hooks/hook-registry.json`
- [ ] `instructions/agent-creation-workflow.instructions.md`
- [ ] `instructions/multi-provider-compatibility.instructions.md`
- [ ] `instructions/plugin-architecture.instructions.md`
- [ ] `instructions/ai-operations-unified.instructions.md`
- [ ] `.github/cookbook/playwright-agent-creation-guide.md`

---

**Framework Status:** ✅ ACTIVE  
**Last Updated:** 2026-07-22  
**Maintained By:** Ash Shaw  
**Reference:** Issue #1079
---

---

🔍 *Audit report generated {audit_date} by the LightSpeedWP team.*

[📋 Reports Index](https://github.com/lightspeedwp/.github/tree/develop/.github/reports) · [📞 Contact](https://lightspeedwp.agency/contact)
