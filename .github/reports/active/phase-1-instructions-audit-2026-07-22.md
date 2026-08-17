---
file_type: audit
category: instructions
created_date: 2026-07-22
scope: phase-1-agent-standardization
---

# Instruction Files Audit — Phase 1

**Objective:** Review existing instruction files to identify conflicts with multi-provider agent standards.

**Audit Date:** 2026-07-22  
**Auditor:** Claude Code  
**Target:** feat/agent-standards-playwright-testing (Issue #1079)

---

## Files Reviewed

1. ✅ `instructions/agent-spec.instructions.md`
2. ✅ `instructions/automation.instructions.md`
3. ✅ `instructions/copilot-operations.instructions.md`
4. ✅ `instructions/plugin-structure.instructions.md`
5. ✅ `instructions/documentation-formats.instructions.md`

---

## Current State Analysis

### 1. Agent Specification (`agent-spec.instructions.md`)

**Status:** ⚠️ **Partial support**

**What it covers:**

- Agent specification format (YAML frontmatter, metadata)
- Permissions vocabulary (read, write, execute, etc.)
- Role and scope definitions
- Responsibilities and capabilities
- Allowed tools and integrations
- Input/output specifications
- Safety guardrails
- Failure/rollback strategy
- Test tasks and validation
- Observability and logging

**Multi-provider readiness:**

- ✅ Frontmatter structure is provider-agnostic
- ✅ Tools section supports multiple tools
- ❌ **GAP:** No guidance on provider-specific tool configurations
- ❌ **GAP:** No multi-provider compatibility matrix
- ❌ **GAP:** No handling of provider-specific response formats
- ❌ **GAP:** No documentation of provider overrides or fallbacks

**Recommendation:**

- Create companion file: `multi-provider-agent-specification.instructions.md`
- Extend this file with provider variation patterns
- Document how to structure agent specs for multi-provider deployment

---

### 2. Automation Standards (`automation.instructions.md`)

**Status:** ⚠️ **Partial support**

**What it covers:**

- Automation architecture overview
- Agent specification format (basic)
- Agent implementation standards (JavaScript)
- Agent testing patterns
- Labeling automation
- Release management
- Metrics & reporting
- Project synchronization
- Code review automation
- Planning automation
- CI/CD integration
- Best practices

**Multi-provider readiness:**

- ✅ Agent architecture patterns are provider-neutral
- ✅ Testing framework is language-agnostic
- ❌ **GAP:** Implementation examples assume JavaScript only
- ❌ **GAP:** Workflow examples assume GitHub Actions only
- ❌ **GAP:** No multi-provider deployment patterns
- ❌ **GAP:** No handling of provider-specific authentication or APIs

**Recommendation:**

- Extend with provider-specific automation patterns
- Add Copilot, Claude, OpenAI workflow examples
- Document provider-specific tool registration

---

### 3. Copilot Operations (`copilot-operations.instructions.md`)

**Status:** ❌ **Copilot-only**

**What it covers:**

- Session integrity protocols
- Boundary respect (repo isolation)
- Escalation procedures
- File placement conventions
- Process logging via session IDs
- Code review integration

**Multi-provider readiness:**

- ✅ Session and boundary concepts apply broadly
- ❌ **GAP:** File placement assumes Copilot context only
- ❌ **GAP:** Session tracking assumes Copilot-specific URLs
- ❌ **GAP:** No Claude, OpenAI, or generic agent guidance
- ❌ **CONFLICT:** Session ID tracking is Copilot-specific; Claude/OpenAI require different tracking

**Recommendation:**

- Create generic `ai-operations-unified.instructions.md` covering all providers
- Keep `copilot-operations.instructions.md` for Copilot-specific details
- Establish provider-neutral session tracking convention

---

### 4. Plugin Structure (`plugin-structure.instructions.md`)

**Status:** ⚠️ **Incomplete**

**What it covers:**

- (File header only; content not yet written)
- WordPress block plugin structure (title suggests)
- Directory layout expectations
- block.json conventions
- Asset enqueueing
- Security for plugins
- Internationalization (i18n)

**Multi-provider readiness:**

- ❌ **GAP:** Content not yet available for assessment
- ❌ **GAP:** Likely WordPress-specific; needs plugin container patterns for agents
- ❌ **GAP:** No guidance on multi-agent plugins or agent packaging

**Recommendation:**

- Complete this file with WordPress plugin standards
- Create separate `agent-plugin-packaging.instructions.md` for agent plugins
- Document agent plugin vs. WordPress plugin distinctions

---

### 5. Documentation Formats (`documentation-formats.instructions.md`)

**Status:** ✅ **Supports multi-provider**

**What it covers:**

- Markdown standards (UK English, formatting)
- YAML frontmatter conventions
- Mermaid diagram standards
- Code block formatting
- Link conventions
- Table formatting

**Multi-provider readiness:**

- ✅ Format standards are provider-neutral
- ✅ Frontmatter structure is extensible
- ✅ No provider-specific dependencies
- ✅ Markdown/YAML are portable across all providers

**Recommendation:**

- No changes needed for basic documentation
- May need extensions for provider-specific frontmatter fields (covered by new instruction files)

---

## Gaps Identified

### Critical Gaps (Blocking Multi-Provider Agent Standardization)

1. **Multi-Provider Agent Specification Template**
   - Missing: How to structure agent specs for Claude, Copilot, OpenAI simultaneously
   - Impact: No canonical reference for creating multi-provider agents
   - Solution: Create `multi-provider-agent-specification.instructions.md`

2. **Provider-Specific Configuration Patterns**
   - Missing: How to handle provider-specific tools, capabilities, response formats
   - Impact: Risk of inconsistent provider implementations
   - Solution: Document provider override patterns and capability matrices

3. **Multi-Provider Agent Packaging**
   - Missing: How to organize agents within plugins for multiple providers
   - Impact: No clear folder structure for multi-provider agent plugins
   - Solution: Create `agent-plugin-architecture.instructions.md`

4. **AI Operations Unified Guide**
   - Missing: Provider-neutral AI operations (session tracking, logging, escalation)
   - Impact: Copilot-only guidance; no Claude/OpenAI patterns
   - Solution: Create `ai-operations-unified.instructions.md`

5. **Provider Compatibility & Capability Matrix**
   - Missing: Which agents support which providers; capability alignment
   - Impact: No visibility into multi-provider coverage
   - Solution: Document in new instruction file or AI config file

---

## Conflicts Identified

### 1. Session Tracking Format

- **Conflict:** `copilot-operations.instructions.md` specifies Copilot session URLs (`https://claude.ai/code/session_[SESSION_ID]`)
- **Issue:** Claude Code uses different session tracking; OpenAI has no session concept
- **Resolution:** Create provider-neutral tracking convention or allow provider-specific formats

### 2. File Placement Assumptions

- **Conflict:** `copilot-operations.instructions.md` assumes `.github/` placement for Copilot artifacts
- **Issue:** Multi-provider agents may need different placement (portable `/agents/`, provider-specific `/agents/{provider}/`)
- **Resolution:** Extend file placement rules to cover multi-provider scenarios

---

## Recommendations for Phase 1

### New Instruction Files to Create

1. **`multi-provider-agent-specification.instructions.md`**
   - Extends agent-spec.instructions.md for multi-provider scenarios
   - Template showing how to structure for Claude, Copilot, OpenAI
   - Guidance on provider-specific overrides and fallbacks
   - Capability matrix and compatibility rules

2. **`agent-plugin-architecture.instructions.md`**
   - Folder structure for agent plugins (lightspeed-{domain}-{focus})
   - Multi-agent grouping patterns
   - Skill and hook organization
   - Provider configuration within plugins
   - Manifest structures (plugin.json, copilot-plugin.json, etc.)

3. **`ai-operations-unified.instructions.md`**
   - Provider-neutral AI operations framework
   - Session integrity for Claude, Copilot, OpenAI, generic agents
   - Provider-neutral escalation and logging
   - File placement for portable AI artifacts
   - Audit trail conventions per provider

### Modifications to Existing Files

1. **`agent-spec.instructions.md`**
   - Add section on provider-specific configurations
   - Add examples showing multi-provider frontmatter
   - Link to new multi-provider instruction file

2. **`automation.instructions.md`**
   - Add section on multi-provider agent deployment
   - Add examples for Claude, Copilot, OpenAI workflows
   - Document provider-specific tool registration patterns

3. **`copilot-operations.instructions.md`**
   - Rename or scope to clarify it's Copilot-specific
   - Add cross-reference to new unified AI operations file
   - Move generic session/logging patterns to unified file

4. **`plugin-structure.instructions.md`**
   - Complete the file with WordPress plugin standards
   - Add section on agent plugin container patterns
   - Distinguish between WordPress plugins and agent plugins

---

## Conflicts Requiring Resolution

### No blocking conflicts with existing instructions

**Note:** Current instructions are focused on single-provider (Copilot/GitHub) scenarios. Multi-provider requirements are **additive**, not **conflicting**. Existing patterns can be extended to support multiple providers.

---

## Success Criteria — Task 1

✅ All instruction files reviewed  
✅ Gaps documented and categorized  
✅ Conflicts identified (none blocking)  
✅ Recommendations provided for Phase 1  
✅ Audit report complete  

---

## Next Steps (Task 2)

Proceed to **Hooks Folder Audit** to review existing hooks and propose 4 new hooks for agent validation
---

---

📐 *Schema validated by LightSpeedWP — always compliant.*

[📋 Coding Standards](https://github.com/lightspeedwp/.github/blob/develop/instructions/coding-standards.instructions.md) · [🔗 Related Files](https://github.com/lightspeedwp/.github/tree/develop/instructions)
