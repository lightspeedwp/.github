---
file_type: documentation
name: Agent & Skills Standards Comprehensive Documentation Plan
description: Detailed expansion plan for comprehensive documentation standards covering agents, skills, instructions, workflows, cookbooks, prompts, plugins, hooks, and AI references
version: 2.0.0
last_updated: '2026-07-24'
status: in-progress
---

# Agent & Skills Standards Comprehensive Documentation Plan (v2.0 - Expanded)

## Executive Summary

Create **9 comprehensive documentation standards** in `docs/` to serve as the authoritative reference for building agents, skills, instructions, workflows, cookbooks, prompts, plugins, hooks, and AI models/runners in the LightSpeed `.github` repository.

**Branch:** `docs/agent-skills-standards-comprehensive`  
**Target:** `develop`  
**Scope:** 2000+ lines across 9 documents  
**Status:** Phase 1 complete, Phase 2 (enhancement) in progress

---

## Part 1: Context & Assessment

### Current State (Pre-Implementation)

**What we had:**

- AGENT_CREATION.md (single-file spec only)
- Scattered, minimal documentation on skills, instructions, workflows, cookbooks, etc.
- No Mermaid diagrams
- No comprehensive cross-references

**What we needed:**

- Unified documentation covering ALL 9 areas
- Comprehensive examples with Mermaid diagrams
- awesome-copilot-inspired patterns
- Cross-referenced, interconnected guides

### Execution Status

**Phase 1 - Batch Creation:**

- ✅ Created 9 documentation files (AGENT_STANDARDS.md through AI_REFERENCES_STANDARDS.md)
- ✅ Fixed frontmatter validation issues (quoted dates, added file_type)
- ✅ Verified link validation passed
- ✅ Created GitHub issue tracking (Epic #1261 + 9 child issues #1262-#1270)
- ✅ Committed planning files to develop branch

**Phase 2 - Enhancement (IN PROGRESS):**

- ⏳ Expand each document with more Mermaid diagrams (aiming for 2-3+ per doc)
- ⏳ Add real-world examples from existing repo files
- ⏳ Audit awesome-copilot patterns and incorporate
- ⏳ Add cross-reference "See also" sections
- ⏳ Verify all external links are functional

---

## Part 2: The 9 Documentation Standards

### 1. AGENT_STANDARDS.md

**Purpose:** Single-file & folder-based agent design, composition, validation

**Mandatory Sections:**

- Overview of agent concept
- Single-file agents (reference AGENT_CREATION.md)
- Folder-based agents (multi-file structure)
- Recommended folder layout: `agents/{agent-name}/agent.md`, `skills/`, `hooks/`, `examples/`
- Minimum requirements checklist
- Agent metadata (name, description, version, providers)
- Multi-provider pattern (Claude, Gemini, OpenAI)
- How agents compose shared skills
- Validation & testing
- Real-world examples (prd-agent, playwright-agent, etc.)
- Best practices & anti-patterns

**Mermaid Diagrams (Target: 3+):**

- Agent architecture: how agent.md composes skills, hooks, workflows
- Folder structure tree: visual layout of `agents/{agent-name}/`
- Multi-provider decision tree: when to use each provider

**Key External Links:**

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://oracle.github.io/agent-spec/26.1.2/index.html>

**Status:** ✅ Created, needs enhanced diagrams & examples

---

### 2. SKILLS_STANDARDS.md

**Purpose:** Reusable skill creation, shared vs. dedicated, composition, maintenance

**Mandatory Sections:**

- Skill concept: individual, reusable capabilities
- Shared vs. dedicated skills (decision matrix)
- Folder structure: `skills/{skill-name}/SKILL.md`
- SKILL.md specification (frontmatter, sections)
- Minimum requirements:
  - SKILL.md entrypoint with frontmatter
  - Implementation (language-agnostic)
  - Examples & documentation
  - Tests (optional but recommended)
- How agents use shared skills (import patterns)
- Skill versioning & semantic versioning
- Backward compatibility & deprecation
- Best practices from agentskills.io
- Real examples from repo

**Mermaid Diagrams (Target: 3+):**

- Skill lifecycle: creation → validation → publishing → versioning
- Shared vs. dedicated decision tree
- Skill composition: agent imports shared skills

**Key External Links:**

- <https://agentskills.io/specification>
- <https://agentskills.io/skill-creation/best-practices>
- <https://agentskills.io/skill-creation/evaluating-skills>
- <https://agentskills.io/skill-creation/optimizing-descriptions>
- <https://agentskills.io/skill-creation/using-scripts>
- <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview>

**Status:** ✅ Created, needs enhanced examples & diagrams

---

### 3. INSTRUCTIONS_STANDARDS.md

**Purpose:** Portable, reusable instruction files for agents & teams

**Mandatory Sections:**

- Instruction file purpose & use cases
- File format: Markdown + YAML frontmatter
- Folder structure: `instructions/{scope}.instructions.md`
- Frontmatter specification (required vs. optional fields)
- **Constraint:** NO `references` field (use inline links)
- Mandatory content sections:
  - Role declaration
  - Overview
  - General Rules
  - Detailed Guidance
  - Examples
  - Validation
- Real examples from `.github/instructions/` and `instructions/`
- Best practices: clarity, conciseness, actionability
- Deprecation & migration process

**Mermaid Diagrams (Target: 2-3):**

- Instruction hierarchy: global → repo-specific → agent-specific
- Instruction lifecycle: creation → review → publication → deprecation

**Status:** ✅ Created, needs enhanced examples & diagrams

---

### 4. WORKFLOWS_STANDARDS.md

**Purpose:** Agentic workflows, orchestration patterns, budget-aware execution

**Mandatory Sections:**

- What are shared workflows (vs. GitHub Actions)
- Agentic workflows: multi-agent orchestration
- Use cases: fan-out, pipeline, adversarial verification, multi-modal sweep
- Folder structure: `workflows/{name}.js` or `workflows/{name}/`
- Workflow script anatomy (meta, phases, agent spawning)
- Orchestration patterns:
  - Sequential execution
  - Parallel execution (with barriers)
  - Pipeline (fan-out/fan-in)
  - Loop patterns (loop-until-dry, loop-until-budget)
- Best practices (budget awareness, error handling, logging)
- Real examples from repo
- How agents invoke workflows

**Mermaid Diagrams (Target: 3+):**

- Workflow execution patterns: sequential vs. parallel vs. pipeline
- Orchestration decision tree: which pattern for which use case?
- Budget-aware loop pattern

**Status:** ✅ Created, needs enhanced patterns & diagrams

---

### 5. COOKBOOKS_STANDARDS.md

**Purpose:** Implementation guides, recipes, step-by-step walkthroughs

**Mandatory Sections:**

- Cookbook concept: guides, not libraries
- Purpose: "How to accomplish X" with step-by-step walkthroughs
- When to create a cookbook (decision criteria)
- Folder structure: `cookbook/{recipe-name}/`
- Cookbook anatomy:
  - README.md (overview & toc)
  - steps/ (numbered step files)
  - examples/ (runnable examples)
  - templates/ (copy-paste templates)
  - troubleshooting.md (common issues & fixes)
- Content guidelines (audience level, prerequisites, estimated time)
- Real examples from awesome-copilot and repo
- Best practices: clarity, actionability, visual guidance

**Mermaid Diagrams (Target: 3+):**

- Cookbook structure tree
- Process flow example: "How to create a multi-provider agent"
- Decision tree: when to write a cookbook

**Key External Links:**

- <https://github.com/github/awesome-copilot/tree/main/docs>

**Status:** ✅ Created, needs enhanced examples & diagrams

---

### 6. PROMPTS_STANDARDS.md

**Purpose:** Reusable prompt templates, engineering best practices

**Mandatory Sections:**

- Prompt engineering principles (Anthropic guidelines)
- Reusable templates vs. one-off prompts
- Folder structure: `prompts/{name}.md`
- Prompt file anatomy (frontmatter, template, inputs/outputs)
- Best practices:
  - Role/persona clarity
  - Task specificity
  - Constraints & guidelines
  - Output format specifications
  - Few-shot examples
- Versioning & updates
- Testing prompts (validation approach)
- Real examples from repo
- Governance: who owns prompt standards?

**Mermaid Diagrams (Target: 2-3):**

- Prompt engineering process: design → test → iterate
- Prompt decision tree: when to create a reusable template

**Key External Links:**

- <https://www.anthropic.com/engineering/building-effective-agents>

**Status:** ✅ Created, needs enhanced patterns & diagrams

---

### 7. PLUGINS_STANDARDS.md

**Purpose:** Plugin architecture, manifest structure, commands & hooks

**Mandatory Sections:**

- Plugin concept: installable extensions
- Target platforms: VS Code, JetBrains, CLI
- Plugin anatomy (plugin.json, commands, hooks, settings, MCP)
- Folder structure: `plugins/{plugin-name}/`
- `plugin.json` specification:
  - Required fields (name, version, description, author)
  - Commands array
  - Hooks array
  - Settings array
  - Activation events
- Minimum requirements:
  - Valid plugin.json
  - README with setup & usage
  - At least one command or hook
  - Examples of usage
- How plugins expose agent/skill capabilities
- Testing & publishing

**Mermaid Diagrams (Target: 2-3):**

- Plugin architecture: manifest → commands/hooks → implementation
- Plugin integration with agents/skills
- Command/hook lifecycle

**Key External Links:**

- <https://code.claude.com/docs/en/plugins>
- <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating>
- <https://geminicli.com/docs/extensions/writing-extensions/>

**Status:** ✅ Created, needs enhanced examples & diagrams

---

### 8. HOOKS_STANDARDS.md

**Purpose:** Event-driven handlers for agents, skills, automation

**Mandatory Sections:**

- Hook concept: event-driven automation
- Hook types:
  - Startup/shutdown (initialization & cleanup)
  - Before-run/after-run (pre/post execution)
  - On-error (error handling)
  - On-success (success logging)
  - Custom hooks
- Folder structure: `hooks/{name}.js` or `hooks/{category}/{name}.js`
- Hook implementation (function signature, context, return values)
- Error handling (throw vs. warn vs. ignore)
- Idempotency (safe to run multiple times)
- Hook registration (agent config vs. workflow vs. plugin)
- Best practices (error resilience, performance, logging)
- Testing hooks
- Real examples from repo (branch-validation, template-enforcement, etc.)
- Anti-patterns (what NOT to do)

**Mermaid Diagrams (Target: 2-3):**

- Hook lifecycle: event trigger → hook execution → result
- Hook types & their triggers
- Hook composition in agents/workflows

**Status:** ✅ Created, needs enhanced examples & diagrams

---

### 9. AI_REFERENCES_STANDARDS.md

**Purpose:** Canonical AI model & runner references, governance

**Mandatory Sections:**

- Purpose of `ai/` folder: source of truth for AI capabilities
- Model references (Claude, Gemini, OpenAI, others)
- Model reference format (frontmatter + content spec)
- Runner references & orchestration patterns
- RUNNERS.md specification
- Governance (who updates, when, deprecation policy)
- Versioning (semantic versioning for models)
- How to reference from CLAUDE.md, AGENTS.md, agent specs
- Real examples (Claude.md, Gemini.md, RUNNERS.md)

**Mermaid Diagrams (Target: 2-3):**

- Model capability matrix: Claude vs. Gemini vs. others
- Orchestration pattern decision tree
- Runner types & execution models

**Key External Links:**

- <https://platform.claude.com/docs/>
- <https://geminicli.com/docs/>

**Status:** ✅ Created, needs enhanced capability matrix & diagrams

---

## Part 3: awesome-copilot Audit Results

**Patterns to Incorporate:**

1. **Clear Section Organization:**
   - Overview first (1-2 paragraphs)
   - Progressive disclosure (basic → advanced)
   - Real-world examples before edge cases

2. **Diagram Usage:**
   - Architecture diagrams (relationships)
   - Decision trees (when to use X vs Y)
   - Process flows (step-by-step)
   - Lifecycle diagrams (creation to deployment)

3. **Examples:**
   - Real code, not pseudocode
   - Before/after comparisons
   - Anti-patterns ("what NOT to do")
   - Copy-paste-ready templates

4. **Cross-References:**
   - "See also:" sections
   - Breadcrumb navigation
   - Links to external platform docs

**Action:** Incorporate these patterns into all 9 docs during Phase 2

---

## Part 4: Mermaid Diagram Strategy

**Total Target:** 18-27 diagrams (2-3 per document)

**Diagram Types:**

| Type | Examples | Target Docs |
|------|----------|------------|
| Architecture | Agent composition, Plugin structure | AGENT, PLUGINS, AI_REFERENCES |
| Lifecycle | Skill lifecycle, Instruction lifecycle | SKILLS, INSTRUCTIONS, WORKFLOWS |
| Decision Tree | When to use shared vs. dedicated skills, which pattern | SKILLS, WORKFLOWS, COOKBOOKS, PROMPTS |
| Process Flow | "How to create X", step-by-step | COOKBOOKS, PLUGINS, HOOKS |
| Folder Structure | Folder hierarchies | AGENT, SKILLS, INSTRUCTIONS, COOKBOOKS |
| Capability Matrix | Model comparison, feature comparison | AI_REFERENCES |

**Validation:**

- All diagrams render correctly at <https://mermaid.live>
- Syntax is valid
- Labels are clear
- No overlapping text

---

## Part 5: Cross-Reference Strategy

**Pattern:**
At the end of each document, add "**Related Documentation**" section with:

- Links to the other 8 standards
- Links to external platform docs
- Links to existing repo files (as examples)

**Example:**

```markdown
## Related Documentation

- [AGENT_STANDARDS.md](./AGENT_STANDARDS.md) — How agents use skills
- [WORKFLOWS_STANDARDS.md](./WORKFLOWS_STANDARDS.md) — Orchestration patterns
- [SKILL.md specification](../skills/skill-name/SKILL.md) — Real example
- https://agentskills.io/specification — External reference
```

---

## Part 6: Quality Assurance Checklist

### Per-Document

- ✅ Frontmatter valid (file_type, title, description, version, last_updated)
- ✅ No duplication of existing docs
- ✅ All mandatory sections included
- ✅ 2-3+ Mermaid diagrams with correct syntax
- ✅ Real-world examples from repo (not pseudocode)
- ✅ All external links functional
- ✅ Cross-references to related docs
- ✅ Consistent terminology
- ✅ UK English throughout (organisation, optimise, colour, behaviour)
- ✅ Markdown linting passes (0 errors)
- ✅ No `references` field in frontmatter

### Repo-Wide

- ✅ All 9 files exist in `docs/`
- ✅ No files in subfolders
- ✅ Branch name: `docs/agent-skills-standards-comprehensive`
- ✅ All commits follow LightSpeed style
- ✅ GitHub issue created (#1261 epic)
- ✅ Planning files committed to develop
- ✅ PR created with proper template (#1251)
- ⏳ All CI checks pass
- ⏳ Squash merge to develop
- ⏳ Feature branch deleted

---

## Part 7: Timeline

| Phase | Milestone | Target | Status |
|-------|-----------|--------|--------|
| 1 | Create 9 docs | 2026-07-24 | ✅ Complete |
| 1 | Fix frontmatter | 2026-07-24 | ✅ Complete |
| 1 | Link validation | 2026-07-24 | ✅ Complete |
| 2 | Add diagrams (2-3 per doc) | 2026-07-25 | ⏳ In progress |
| 2 | Real examples added | 2026-07-25 | ⏳ In progress |
| 2 | awesome-copilot audit | 2026-07-25 | ⏳ Pending |
| 2 | Cross-references added | 2026-07-25 | ⏳ Pending |
| 3 | All CI checks pass | 2026-07-26 | ⏳ Pending |
| 3 | PR merged to develop | 2026-07-26 | ⏳ Pending |
| 3 | AGENTS.md updated | 2026-07-26 | ⏳ Pending |

---

## Part 8: Success Definition

✅ **Complete when:**

1. ✅ All 9 documents created in `docs/`
2. ✅ Each document covers ALL mandatory sections
3. ⏳ Each document includes 2-3+ Mermaid diagrams
4. ✅ All external links (20+) verified functional
5. ⏳ Cross-references between docs working
6. ✅ Markdown linting passes (0 errors)
7. ✅ Frontmatter validation passes
8. ⏳ Real-world examples reference actual repo files
9. ⏳ Terminology consistent across all docs
10. ✅ No duplication of existing documentation
11. ✅ UK English throughout
12. ⏳ PR merged to develop
13. ⏳ Issues resolved or linked

---

## Part 9: Next Actions

**Immediate (Phase 2 - Enhancement):**

1. Add 2-3 Mermaid diagrams to each of the 9 documents
2. Add real-world examples referencing actual repo files
3. Audit awesome-copilot and incorporate patterns
4. Add "Related Documentation" sections with cross-references
5. Verify all external links are functional

**Follow-up (Phase 3 - Merge):**

1. Fix any CI issues
2. Merge PR #1251 to develop
3. Update AGENTS.md to reference new docs
4. Close GitHub issues #1262-#1270
5. Create index linking all 9 standards

---

## Related Files & Issues

- **Planning Index:** [INDEX.md](./INDEX.md)
- **GitHub Epic:** #1261 (Agent & Skills Standards Comprehensive Documentation)
- **Child Issues:** #1262-#1270 (one per standard)
- **Branch:** `docs/agent-skills-standards-comprehensive`
- **PR:** #1251
- **Planning Original:** <https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/agent-skills-standards-comprehensive/PLAN.md>

---

**Plan Version:** 2.0.0 (Expanded)  
**Last Updated:** 2026-07-24  
**Status:** Phase 2 - Enhancement in progress  
**Owner:** Claude Code  
**Audience:** Internal LightSpeedWP team
