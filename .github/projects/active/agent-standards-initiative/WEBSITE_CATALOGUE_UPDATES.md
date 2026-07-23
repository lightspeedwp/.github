# Website Catalogue & Learn Page Updates

> **Update the website to showcase all Phase 2 agents, prompts, hooks, tools, and
> documentation.** Fix the develop/main branch switcher, update catalogue pages,
> and create a Learn section.

**Priority:** After 2–3 agents are complete (get early feedback on structure).  
**Coordination:** Works in parallel with agent development.

---

## Problems to Fix

### 1. Branch Switcher Not Working

**Location:** `website/src/components/Header.tsx` (or similar)  
**Problem:** The develop/main toggle doesn't update links or refresh content  
**Fix Steps:**

```markdown
# Fix: Branch Switcher (Develop/Main Toggle)

**File:** `website/src/components/Header.tsx` (or theme switcher component)

Current state: Toggle exists but doesn't work
Expected: Toggle switches between main and develop branch references

Tasks:
1. Inspect toggle implementation (is it localStorage? URL param? state?)
2. Find link generation (likely a utility function)
3. Add branch parameter to all links
4. Test with local navigation
5. Verify branch-specific resources load correctly

Expected: Toggle works → pages reference correct branch in GitHub links
```

---

## 2. Catalogue Pages Update

**Location:** `website/src/pages/catalogue.tsx` or `website/src/pages/agents.tsx`  
**Current:** Shows some agents (likely Phase 1 only)  
**Need:** Auto-generated or manually curated list of all Phase 1 + Phase 2 agents

### Catalogue Sections

1. **Agents** (all 14)
   - Playwright Testing (Phase 1) — 1
   - Tour Operator Config, WP Config, WooCommerce Config (Phase 2) — 3
   - 10 Batch agents (Phase 2) — 10

2. **Plugins** (14 total: 1 core + 13 agent-specific)
   - lightspeed-playwright-testing
   - lightspeed-{domain}-{focus} × 13

3. **Hooks** (17 total: 4 core + 13 agent-specific)
   - agent-spec-validator (core)
   - multi-provider-consistency-checker (core)
   - plugin-integrity-checker (core)
   - agent-security-auditor (core)
   - {agent-slug}-spec-validator × 13 (one per agent)

4. **Tools** (CLI scripts)
   - agent-{slug}-{tool} per agent

5. **Instructions** (documentation)
   - Agent instruction files
   - Quick-start guides per provider

6. **Starter Prompts** (per agent)
   - 5–8 prompts per agent
   - Searchable/filterable by capability/domain

7. **Workflows** (GitHub Actions)
   - agent-{slug}-validate.yml
   - agent-{slug}-integration-test.yml
   - agent-{slug}-prompts-verify.yml

---

## 3. Learn Page Expansion

**Location:** `website/src/pages/learn.tsx` or `website/src/pages/learning.tsx`  
**Current:** Likely empty or minimal  
**Need:** Comprehensive learning path for agents

### Proposed Learn Page Structure

```markdown
# Learn — Agent Standardization Guide

## Getting Started

### For Users
1. Choose an agent by capability (analysis, optimization, configuration, etc.)
2. Find the agent in Catalogue
3. Follow its Quick-Start guide (provider-specific)
4. Run a starter prompt (copy-paste ready)
5. Adapt for your use case

### For Developers
1. Understand Phase 1 / Phase 2 structure
2. Read AGENT_COMPLETE_WORKFLOW.md
3. Start with Playwright agent as reference
4. Execute per-agent workflow for new agents

## By Use Case

### I want to analyze my site
→ Website Discovery Assistant Agent

### I want to optimize performance
→ PageSpeed Agent

### I want to configure WooCommerce
→ WooCommerce Config Agent

[... 10+ similar paths]

## By Provider

### Claude (Claude Code)
- Setup: link to `instructions/{slug}-agent-claude-quickstart.md`
- Tools: 5+ deep-dive examples
- Advanced: custom integration patterns

### Codex (Anthropic Codex)
- Setup: link to `instructions/{slug}-agent-codex-quickstart.md`
- Tools: code generation and analysis examples
- Advanced: custom agent implementations

### Copilot (GitHub)
- Setup: link to `instructions/{slug}-agent-copilot-quickstart.md`
- Skills: how to integrate with Issues, PRs, Actions
- Advanced: Copilot chat in Issues workflow

### Gemini (Google)
- Setup: link to `instructions/{slug}-agent-gemini-quickstart.md`
- Tools: API integration and capabilities
- Advanced: Gemini extensions and custom workflows

### OpenAI (API)
- Setup: link to `instructions/{slug}-agent-openai-quickstart.md`
- Functions: schema definitions + examples
- Advanced: batch processing, webhooks

## Architecture

### Phase 1: Playwright Testing Agent
- Why this is the reference implementation
- How it combines 3 providers
- Folder structure breakdown
- How to extend it

### Phase 2: Agent Standardization Pattern
- From Playwright → 13 new agents
- What changed? What stayed the same?
- Multi-provider architecture decisions
- Future: Phase 3 governance layer

## Documentation Index

- Playbook: `PHASE_2_EXECUTION_PLAYBOOK.md`
- Workflow: `AGENT_COMPLETE_WORKFLOW.md`
- Agent templates: `AGENTS_*.md` prompts
- Plugin guide: `PLUGINS_INTEGRATION_GUIDE.md`
- Infrastructure: `INFRASTRUCTURE_HOOKS_TOOLS_WORKFLOWS.md`
- Instructions: `INSTRUCTIONS_DOCUMENTATION_GUIDE.md`
- Prompts: `STARTER_PROMPTS_GUIDE.md`
- Index: `PHASE_2_BATCH_PROMPTS_INDEX.md`

## FAQ

Q: Which agent should I use for [scenario]?
A: [Routing guide]

Q: How do I install an agent for [provider]?
A: [Provider-specific steps, link to quick-start]

Q: Can I use multiple agents together?
A: [Composition guide]

[... 10+ more Q&A]
```

---

## Implementation Prompt

```markdown
# Website Catalogue & Learn Page Updates

**Goal:** Update website to showcase all Phase 1 + Phase 2 agents, plugins, tools, instructions, starter prompts, hooks, workflows.

**Tasks:**

1. Fix branch switcher (develop/main toggle)
   - Location: `website/src/components/Header.tsx` (or similar)
   - Make toggle functional
   - Test navigation works on both branches

2. Update Catalogue pages
   - Add agents section (all 15)
   - Add plugins section
   - Add hooks section
   - Add tools section
   - Add instructions section
   - Add starter prompts section (filterable)
   - Add workflows section

3. Create/Expand Learn page
   - Getting started (users vs developers)
   - By use case (10+ routing paths)
   - By provider (Claude, Copilot, Codex, Gemini, OpenAI)
   - Architecture overview
   - Documentation index
   - FAQ (10+ questions)

**Reference:**
- Existing catalogue structure in `website/`
- Playbook: `.github/projects/active/agent-standards-initiative/PHASE_2_EXECUTION_PLAYBOOK.md`
- Agent guides: `.github/projects/active/agent-standards-initiative/AGENTS_*.md`

**Output:** Branch `feat/website-agent-standards-catalogue-learn`
```

---

## Checklist (Website Updates)

### Branch Switcher

- [ ] Toggle code inspected
- [ ] Branch parameter threaded through link generation
- [ ] Works locally (test on localhost)
- [ ] Toggles between main/develop without errors

### Catalogue Pages

- [ ] Agents section added (15 agents listed + linked)
- [ ] Plugins section added (13 plugins listed + linked)
- [ ] Hooks section added (4 core + 13 agent-specific)
- [ ] Tools section added
- [ ] Instructions section added (all 15 agent instruction files)
- [ ] Starter Prompts section added (filterable by agent/domain)
- [ ] Workflows section added

### Learn Page

- [ ] Getting Started section complete
- [ ] Use-case routing paths (10+ scenarios)
- [ ] Provider-specific guides (Claude, Copilot, OpenAI)
- [ ] Architecture overview (Phase 1 → Phase 2 → Phase 3)
- [ ] Documentation index (links to all guides)
- [ ] FAQ section (10+ Q&A)

### Testing

- [ ] All links valid (no 404s)
- [ ] Branch switcher toggles correctly
- [ ] Mobile responsive (test on tablet/mobile)
- [ ] Markdown renders correctly
- [ ] Code blocks syntax-highlight properly

---

*Use this in a dedicated chat for website work. Reference: `AGENT_COMPLETE_WORKFLOW.md` step 7 (optional, runs in parallel).*
