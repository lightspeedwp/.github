---
file_type: documentation
title: ""Phase 1 Ai Config Audit 2026 07 22""
description: ""Project documentation""
created_date: 2026-07-22
last_updated: "2026-08-25"
status: active
---

# AI Configuration Audit — Phase 1

**Objective:** Review AI configurations and propose updates for multi-provider support.

**Audit Date:** 2026-07-22  
**Auditor:** Claude Code  
**Target:** feat/agent-standards-playwright-testing (Issue #1079)

---

## Current AI Configuration State

**Location:** `.github/ai/`

### Existing Files

| File | Status | Purpose |
|---|---|---|
| `Claude.md` | ⚠️ Stub | Claude-specific guidance |
| `Gemini.md` | ⚠️ Stub | Gemini-specific guidance |
| `RUNNERS.md` | ⚠️ Stub | Agent runner configurations |
| `agents.md` | ⚠️ Stub | Agent index and overview |
| `README.md` | ✅ Complete | Directory overview |
| `AUDIT-SUMMARY.md` | ✅ Complete | AI operations audit findings |

### Current Coverage

**Active Documentation:**

- ✅ README.md — Explains directory purpose and integration points
- ✅ AUDIT-SUMMARY.md — Contains AI operations findings
- Remaining files are metadata stubs (frontmatter only)

**Gaps for Multi-Provider Support:**

- ❌ **No Claude configuration details** (Claude.md is stub)
- ❌ **No Gemini configuration details** (Gemini.md is stub)
- ❌ **No OpenAI/Codex configuration** (missing entirely)
- ❌ **No provider capability matrix** (which agents support which providers)
- ❌ **No multi-provider mapping** (tool compatibility, capability alignment)
- ❌ **No agent migration tracking** (status of each agent conversion)
- ❌ **No provider tool definitions** (API references, tool specifications)

---

## Multi-Provider Support Analysis

### Current State

The `.github/ai/` directory structure supports:

- ✅ Claude references (file exists, but content missing)
- ✅ Gemini references (file exists, but content missing)
- ❌ OpenAI/Codex (no reference file)
- ❌ Generic agent guidance (RUNNERS.md is stub)

### Required for Phase 1

**Critical Files to Complete/Create:**

1. **Claude.md** (complete existing stub)
   - Claude-specific agent requirements
   - Tool availability and limitations
   - Model version support
   - Memory and context handling

2. **Gemini.md** (complete existing stub)
   - Gemini-specific agent requirements
   - Tool availability and limitations
   - Model version support
   - Safety and content policies

3. **OpenAI.md** (create new)
   - OpenAI Codex/GPT agent requirements
   - Function calling specifications
   - Model version support
   - API integration patterns

4. **RUNNERS.md** (complete existing stub)
   - Agent execution environment setup
   - Runtime requirements per provider
   - Execution patterns and triggers

---

## Proposed AI Config Framework

### New Files to Create

#### 1. **agents-unified.md** (Meta-Configuration)

**Purpose:** Central index of all agents and their provider support

**Content Structure:**

```markdown
---
title: Unified Agent Registry
description: Authoritative index of all LightSpeed agents and their multi-provider support
---

# Unified Agent Registry

## Agent Support Matrix

| Agent ID | Name | Status | Claude | Copilot | OpenAI | Gemini |
|---|---|---|---|---|---|---|
| playwright-testing | Playwright Testing | active | ✅ v1.0 | ✅ v1.0 | ✅ v1.0 | ⏳ planned |
| [future agents...] | | | | | | |

## Agent Details

### playwright-testing

**Status:** active  
**Type:** testing-automation  
**Providers:** claude, copilot, openai  
**Path:** `agents/playwright-testing/`  
**Plugin:** `plugins/lightspeed-playwright-testing/`

**Provider Versions:**
- Claude: v2.0.0 (supports claude-opus-4-8+)
- Copilot: v2.0.0 (supports GitHub Copilot 1.0+)
- OpenAI: v2.0.0 (supports GPT-4+)

**Capabilities:**
- Browser automation
- Visual regression testing
- Cross-browser validation
- Performance metrics
- Accessibility testing

**Last Provider Update:** 2026-07-22
```

**Usage:** CI/CD dashboard, agent discovery, provider support visibility

#### 2. **multi-provider-mapping.md** (Compatibility Guide)

**Purpose:** Tool mapping and capability parity matrix across providers

**Content Structure:**

```markdown
---
title: Multi-Provider Tool Mapping & Capability Parity
description: Maps tools across providers and tracks capability parity
---

# Multi-Provider Tool Mapping

## Playwright Testing Agent — Tool Mapping

### Browser Automation Core

| Capability | Claude Tool | Copilot Skill | OpenAI Function | Notes |
|---|---|---|---|---|
| Launch Browser | playwright_launch | playwright:launch | run_playwright_test | Claude & OpenAI unified |
| Navigate URL | playwright_navigate | browser:navigate | run_playwright_test | Copilot uses skill reference |
| Click Element | playwright_interact (action: click) | browser:click | run_playwright_test | Different abstraction levels |
| Fill Form | playwright_interact (action: type) | browser:fill | run_playwright_test | - |
| Screenshot | playwright_screenshot | browser:screenshot | screenshot_capture | All providers supported |

### Capability Parity

| Capability | Claude | Copilot | OpenAI | Gemini | Parity Status |
|---|---|---|---|---|---|
| Browser Launch | ✅ Native | ✅ via Skill | ✅ Function | ⏳ Planned | 3/4 complete |
| Visual Regression | ✅ Supported | ✅ via Skill | ✅ Function | ❌ Not planned | 3/4 complete |
| Performance Metrics | ✅ Full | ✅ via Skill | ⚠️ Limited | ❌ No support | Partial alignment |
| Accessibility Testing | ✅ Full | ✅ via Skill | ⚠️ Basic | ❌ No support | Partial alignment |

### Alignment Notes

**Full Parity:** Browser automation core (launch, navigate, interact, screenshot)  
**Partial Parity:** Advanced features vary by provider
**Gaps:** Gemini does not have planned support for this agent yet
```

**Usage:** Agent developers, provider compatibility checking, roadmap planning

#### 3. **provider-specifications.md** (Provider Reference)

**Purpose:** Consolidated provider capabilities, tool definitions, and constraints

**Content Structure:**

```markdown
---
title: AI Provider Specifications
description: Unified reference for Claude, Copilot, OpenAI, and Gemini capabilities
---

# Provider Specifications

## Claude

**Latest Model:** claude-opus-4-8  
**Model ID:** claude-opus-4-8  
**Capabilities:**
- Extended thinking (when enabled)
- Structured output (JSON mode)
- Tool use (100+ tools supported)
- Vision (image analysis)
- Document processing

**Agent Requirements:**
- Agent specs in AGENT.md format with YAML frontmatter
- Tools defined in JSON (tools.json)
- Response format: JSON, markdown, or plain text
- Memory: Handled via session context

**Limitations:**
- Tool use is request-based (no persistence)
- Token limits vary by model

## GitHub Copilot

**Latest Model:** Copilot Chat v1.0+  
**Capabilities:**
- Code completion in IDE
- Chat-based interaction
- Skill/agent composition
- GitHub-integrated workflows
- IDE extensions (VS Code, JetBrains)

**Agent Requirements:**
- Agent specs in GitHub Copilot format (copilot-plugin.json)
- Skills reference from skill files
- Response format: Markdown
- Memory: Limited to chat session

**Constraints:**
- Only available in supported IDEs
- Requires GitHub authentication
- Limited to GitHub-aware operations

## OpenAI (Codex/GPT-4)

**Latest Model:** gpt-4-turbo  
**Capabilities:**
- Function calling (structured tool calls)
- Vision (image analysis)
- JSON mode (structured output)
- Web search (when enabled)

**Agent Requirements:**
- Agent specs in OpenAI format
- Tools defined as OpenAI functions (functions.json)
- Response format: Function calls + JSON
- Memory: Session-based with context window

**Constraints:**
- Function calling requires specific formatting
- Higher latency than local models
- API rate limits apply

## Gemini

**Latest Model:** Gemini 2.0  
**Status:** Planned support  
**Planned Capabilities:**
- Tool use similar to Claude
- Multimodal input (text, images, video, audio)
- JSON output mode
- Safety filtering

**Future Requirements:**
- TBD based on Gemini API evolution
```

**Usage:** Architecture decisions, tool selection, provider-specific implementation

### Changes to Existing Files

#### Claude.md (Expand from Stub)

```markdown
---
title: Claude Canonical Reference
description: Authoritative Claude-specific agent and tool guidance
---

# Claude Configuration Guide

## Agent Specifications

All Claude agents use the standard agent spec format with YAML frontmatter in `AGENT.md`. See `ai/agents-unified.md` for agent registry.

## Tool Definitions

Claude agents define available tools in `{provider}/tools.json` using the JSON Schema format.

### Tool Example
[Insert example claude tool definition]

## Response Formats

Claude agents return responses in JSON format by default for structured output.

### Response Format Example
[Insert example response]

## Model Support

- **Recommended:** claude-opus-4-8 (latest, most capable)
- **Supported:** claude-opus-4-7, claude-sonnet-5
- **Legacy:** claude-3-opus, claude-3-sonnet (still functional)

## Integrations

- Claude Code IDE extension
- Direct API integration
- MCP (Model Context Protocol) support

## See Also
- `ai/agents-unified.md` — Agent registry with Claude support status
- `ai/multi-provider-mapping.md` — Claude tool mapping vs other providers
- `ai/provider-specifications.md` — Claude technical specifications
```

#### Gemini.md (Expand from Stub)

```markdown
---
title: Gemini Canonical Reference
description: Authoritative Gemini-specific agent and tool guidance (Planned)
---

# Gemini Configuration Guide (Planned)

**Status:** Planned support for multi-provider agents  
**Target Availability:** Phase 2 (2026 Q3+)

Gemini support for multi-provider agents is under development. Current focus is Claude, Copilot, and OpenAI. Gemini integration guidelines will be added as support is implemented.

See `ai/agents-unified.md` for current Gemini support status across agents.
```

#### RUNNERS.md (Expand from Stub)

```markdown
---
title: Agent Runner Specifications
description: Execution environments and runtime requirements per provider
---

# Agent Runner Specifications

## Claude Code Runner

**Environment:** Local IDE extension or cloud  
**Execution Model:** Request-response  
**Memory:** Session-scoped context window

## GitHub Copilot Runner

**Environment:** GitHub (web, IDE)  
**Execution Model:** Chat-based interaction  
**Memory:** Chat session (not persistent)

## OpenAI API Runner

**Environment:** HTTP API  
**Execution Model:** Function calling  
**Memory:** User manages via system prompt/context

## Execution Patterns

[Insert execution patterns per provider]
```

---

## Implementation Checklist

### New Files to Create

- [ ] `ai/agents-unified.md` — Agent registry with provider support matrix
- [ ] `ai/multi-provider-mapping.md` — Tool mapping and capability parity
- [ ] `ai/provider-specifications.md` — Unified provider reference
- [ ] `ai/OpenAI.md` — OpenAI configuration (new file)

### Existing Files to Complete

- [ ] `ai/Claude.md` — Expand from stub with Claude specifics
- [ ] `ai/Gemini.md` — Expand or mark as planned
- [ ] `ai/RUNNERS.md` — Expand with execution specifications
- [ ] `ai/agents.md` — Expand or point to agents-unified.md

### Documentation

- [ ] Update `.github/ai/README.md` with new files
- [ ] Add navigation between provider-specific files

---

## Success Criteria — Task 4

✅ Current AI config state reviewed  
✅ Coverage gaps identified (5 major gaps)  
✅ Provider support analysis completed  
✅ Multi-provider framework proposed with:

- 3 new files (agents-unified.md, multi-provider-mapping.md, provider-specifications.md)
- OpenAI.md (new file) for OpenAI support
- Expansion plan for existing stubs
✅ Implementation checklist created  

---

## Next Steps (Task 5)

Proceed to **Memory & Schema Structure Audit** to review memory persistence and work-focus organization.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
