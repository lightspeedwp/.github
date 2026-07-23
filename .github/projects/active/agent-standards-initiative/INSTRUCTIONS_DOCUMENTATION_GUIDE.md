# Agent Instructions & Documentation Guide

> **Create comprehensive agent documentation and instructions.** This guide outlines
> how to create instruction files, README embellishments, and learning resources
> for each agent.

**Run after:** Agent code + plugin merged.  
**Parallel with:** Starter prompts, hooks, tools.

---

## 1. Agent Instructions File

**Location:** `instructions/{slug}-agent.instructions.md`  
**Purpose:** Portable instruction set for the agent that can be used in any provider context.

### Template Prompt

```markdown
# {Agent Name} Instructions

Create a comprehensive instruction file following this structure:

---
file_type: agent-instructions
name: {slug}-agent
title: {Agent Name} Instructions
description: >
  Comprehensive instructions for the {Agent Name} agent.
  Provider-agnostic, reusable across Claude, Copilot, Codex, Gemini, OpenAI.

version: '2.0.0'
status: active
maintainer: Ash Shaw
owners:
  - lightspeedwp/maintainers
---

## Role

[1 paragraph: what this agent does, who uses it, primary value]

## Operating Principles

- [Principle 1: core behavior rule]
- [Principle 2: security or quality rule]
- [Principle 3: style or output preference]

## Responsibilities

1. [Major responsibility 1]
2. [Major responsibility 2]
3. [Major responsibility 3]

## Core Workflow

[Multi-phase workflow describing how the agent operates]

Phase 1: [Input → Analysis]
Phase 2: [Processing]
Phase 3: [Output & Validation]

## Constraints

- [Hard constraint 1: security, compliance, or guardrail]
- [Hard constraint 2]

## Quality Bar

- Output is [characteristic 1]
- Recommendations are [characteristic 2]
- [Quality metric 3]

## Examples

### Example 1: [Concrete use case]
Input: [Example input]
Process: [How agent handles it]
Output: [Expected output]

[Similar examples 2 & 3]

---

Requirements:
- 200+ lines total
- Real agent capabilities reflected
- 2–3 concrete working examples
- Security/quality guardrails explicit
- Provider-agnostic (not Claude/Copilot/OpenAI specific)

Reference: `instructions/playwright-testing-agent.instructions.md` (Phase 1 example)
Output: Branch `feat/agent-standards-{slug}-instructions`
```

---

## 2. README Enhancements

**Location:** `agents/{slug}-agent/README.md` (already exists from agent code PR)  
**Enhancement:** Expand to include learning resources, use-case guidance.

### Sections to Add

1. **Getting Started** (new)
   - Quick 3-step setup
   - Simplest first use case

2. **Use Cases** (expand)
   - 4–5 concrete scenarios
   - For each: input → expected output → business value

3. **Best Practices** (new)
   - Tips for getting best results
   - Common mistakes to avoid
   - When to use this agent vs. alternatives

4. **Troubleshooting** (new)
   - FAQ (5–8 common questions)
   - Links to instruction file + provider docs

5. **Provider-Specific Notes** (new)
   - Brief note per provider (Claude / Copilot / Codex / Gemini / OpenAI)
   - Any differences or caveats

---

## 3. Provider-Specific Quick-Start Guides

**Location:** `instructions/{slug}-agent-{provider}-quickstart.md`  
**Purpose:** Provider-specific getting-started guide (Claude Code setup, Copilot skill installation, Codex configuration, Gemini API setup, OpenAI API wiring).

### Template

```markdown
# {Agent Name} — {Provider} Quick Start

[3-step setup for this specific provider]

1. [Install / import step]
2. [Configure credentials or permissions]
3. [First use — copy-paste example]

[2–3 working examples specific to this provider's integration model]

Troubleshooting: [Common issues on this provider]
```

---

## 4. Learning Resources Index

**Location:** `instructions/{slug}-agent-LEARN.md` (optional but recommended)  
**Purpose:** Curated reading path for learning the agent deeply.

### Contents

- Quick start (link to provider quick-start guides)
- Core concepts (link to instruction file § sections)
- Examples gallery (linked use cases from README)
- Advanced patterns (link to starter prompts, especially the "Advanced" ones)
- Common questions (FAQ + troubleshooting)

---

## Checklist (Per Agent Documentation)

- [ ] `instructions/{slug}-agent.instructions.md` (200+ lines, all sections)
- [ ] `agents/{slug}-agent/README.md` enhanced (Getting Started + Use Cases + Best Practices + Troubleshooting + Provider Notes)
- [ ] 5 provider quick-starts: `instructions/{slug}-agent-claude-quickstart.md`, `*-codex-*.md`, `*-copilot-*.md`, `*-gemini-*.md`, `*-openai-*.md`
- [ ] Optional: `instructions/{slug}-agent-LEARN.md` (learning path index)
- [ ] All markdown lints clean
- [ ] No broken links (if published online)
- [ ] PR merged, branch deleted

---

## Documentation Philosophy

- **Instruction file** = portable agent spec (reusable, provider-agnostic)
- **README** = user entry point (quick start, use cases, troubleshooting)
- **Provider quick-starts** = fastest path to first success on each platform
- **Learning index** = structured deep-dive for advanced users

---

*Use this in a dedicated chat for each agent. Reference: `AGENT_COMPLETE_WORKFLOW.md` step 4.*
