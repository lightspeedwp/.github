# Starter Prompts Guide

> **Create 5–8 starter prompts per agent.** These are ready-to-use examples users can
> copy-paste and adapt to start using the agent immediately.

**Folder:** `prompts/{slug}-agent/`  
**Run after:** Agent code + instructions merged.

---

## What Are Starter Prompts?

Starter prompts are **working examples** users can copy directly and adapt for their needs.
Each prompt demonstrates one core capability of the agent. They:

- Copy-paste ready (no setup needed beyond agent access)
- Realistic (solve real problems, not abstract examples)
- Adaptable (easy to modify for different inputs/scenarios)
- Documented (title + description + when to use + variants)

---

## Prompt Anatomy

**File name:** `prompt-{capability-slug}.md`  
**Example:** `prompt-site-analysis.md`, `prompt-setup-plan.md`

### Structure

```markdown
---
title: {Capability Name}
description: >
  One-sentence: what this prompt does and when to use it.
tags: [tag1, tag2]  # e.g., [analysis, setup, optimization]
effort: {Easy|Medium|Hard}  # How much work for the user to prepare inputs
---

# {Capability Name}

## When to use

One paragraph: the problem this prompt solves, the business value.

## How to use

1. [Preparation step 1 — what input/data do you need?]
2. [Preparation step 2]

## The prompt

Copy and paste this into your agent chat:

---

[**COPY FROM HERE** — the actual prompt text the user runs]

{Real example prompt, 50–200 lines}

---

**Expected output:** [What the user should get back]

## Variants

### Variant 1: [Different scenario]
Change: [specific tweak to the prompt above]
Example: [quick example]

### Variant 2: [Another scenario]
...

## Tips

- [Optimization 1: how to get better results]
- [Tip 2]
- [Common mistake to avoid]
```

---

## Starter Prompt Recommendations

**For every agent, create at least these 5:**

| # | Capability | Slug | Effort | Use Case |
| --- | --- | --- | --- | --- |
| 1 | **Core Analysis** | `{slug}-analysis` | Easy | "Analyze my current {domain} setup" |
| 2 | **Optimization Plan** | `{slug}-optimization-plan` | Medium | "Create a prioritized improvement roadmap" |
| 3 | **Quick Audit** | `{slug}-quick-audit` | Easy | "5-minute health check" |
| 4 | **Problem Diagnosis** | `{slug}-diagnosis` | Medium | "I'm seeing [symptom], what's wrong?" |
| 5 | **Setup Recommendation** | `{slug}-setup-recommendation` | Hard | "Design an ideal setup for [scenario]" |

**Optional extras (6–8):**

- Integration guide (setup for specific platforms/tools)
- Batch processing (handle multiple items)
- Advanced configuration (deep customization)

---

## Template Prompt

```markdown
# Starter Prompts for {Agent Name}

Create 5–8 ready-to-use prompts in `prompts/{slug}-agent/`.

Each prompt file should:
1. Have frontmatter (title, description, tags, effort)
2. Include "When to use" (1 paragraph on the problem)
3. Include "How to use" (2–3 prep steps)
4. Have "The prompt" section with copy-paste-ready prompt (50–200 lines)
5. Show "Expected output" (what user gets back)
6. Include 2–3 variants (how to adapt for different scenarios)
7. Have tips (how to get better results, common mistakes)

Reference: Existing prompts in `prompts/` (Phase 1) or any agent README use cases

Output: 5 files minimum, 8 is ideal
  - prompt-{slug}-analysis.md (Easy)
  - prompt-{slug}-optimization-plan.md (Medium)
  - prompt-{slug}-quick-audit.md (Easy)
  - prompt-{slug}-diagnosis.md (Medium)
  - prompt-{slug}-setup-recommendation.md (Hard)

Branch: `feat/agent-standards-{slug}-starter-prompts`
```

---

## Naming Convention

```
prompts/{slug}-agent/
├── prompt-analysis.md                 # Core analysis / assessment
├── prompt-optimization-plan.md        # Improvement strategy
├── prompt-quick-audit.md              # Fast health check
├── prompt-diagnosis.md                # Problem diagnosis
├── prompt-setup-recommendation.md     # Full setup design
├── prompt-integration-guide.md        # (Optional) Platform-specific setup
└── README.md                          # (Optional) Index of all prompts
```

---

## Quality Checklist

- [ ] 5+ prompts created
- [ ] Each has frontmatter (title, description, tags, effort)
- [ ] Each has "When to use" section (1 paragraph)
- [ ] Each has "How to use" section (2–3 prep steps)
- [ ] Each has copy-paste-ready prompt text (50–200 lines)
- [ ] Each shows expected output
- [ ] Each has 2–3 variants documented
- [ ] Each has tips section (3+ tips)
- [ ] All markdown lints clean
- [ ] Prompts are realistic (not toy examples)
- [ ] Prompts are adaptable (users can modify them)

---

*Use this in a dedicated chat for each agent. Reference: `AGENT_COMPLETE_WORKFLOW.md` step 5.*
