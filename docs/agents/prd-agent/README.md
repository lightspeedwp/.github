---
title: PRD Agent Playbook
description: Comprehensive guide for setting up, using, and integrating the consolidated PRD agent across your workflows
created: 2026-09-17
updated: 2026-09-17
---

# PRD Agent Comprehensive Playbook

Welcome to the PRD (Product Requirements Document) Agent playbook. This guide helps you set up, configure, and effectively use the consolidated PRD agent across your organisation — from initial setup through advanced integration with your design, project management, and development tools.

## Quick Navigation

### Getting Started

New to the PRD agent? Start here:

- **[Setup Guide by Platform](./setup-claude-code.md)** — Install and configure for Claude Code, GitHub Copilot, or OpenAI API
  - [Claude Code Setup](./setup-claude-code.md) — Use the PRD agent as a Claude Code subagent
  - [GitHub Copilot Setup](./setup-copilot.md) — Integrate with GitHub Copilot custom agents
  - [OpenAI Setup](./setup-openai.md) — Configure for use with OpenAI API (GPT-4, GPT-3.5-turbo)
- **[FAQ & Troubleshooting](./faq.md)** — Common questions, setup issues, and solutions

### Creating & Using PRDs

Once set up, learn how to create effective PRDs:

- **[PRD Creation Workflow](./workflow.md)** — Step-by-step process for generating quality PRDs
- **[Best Practices](./best-practices.md)** — Quality standards, structure guidelines, and common pitfalls
- **[Estimation Strategy](./estimation-strategy.md)** — How to structure PRDs for accurate work breakdown and team estimates

### Scaling & Integration

Ready to integrate PRDs into your team's systems?

- **[Integration Guide](./integration-guide.md)** — Feed approved PRDs into Figma, Linear, Claude Code agents, and other tools
  - Figma design system integration
  - Linear issue/epic creation
  - Claude Code agent workflows
  - Custom CI/CD automation

## Document Map

| Document | Purpose | Audience |
|----------|---------|----------|
| [setup-claude-code.md](./setup-claude-code.md) | Install PRD agent in Claude Code | Individual developers, teams |
| [setup-copilot.md](./setup-copilot.md) | Configure GitHub Copilot custom agent | Teams using GitHub Copilot |
| [setup-openai.md](./setup-openai.md) | Set up with OpenAI API | OpenAI API users |
| [workflow.md](./workflow.md) | PRD creation step-by-step guide | Product managers, leads, developers |
| [best-practices.md](./best-practices.md) | Quality standards and structure | All PRD creators |
| [estimation-strategy.md](./estimation-strategy.md) | Structure PRDs for accurate estimates | Tech leads, engineering managers |
| [integration-guide.md](./integration-guide.md) | Connect PRDs to downstream tools | DevOps, automation engineers, team leads |
| [faq.md](./faq.md) | Q&A and troubleshooting | All users |

## Key Concepts

### The PRD Agent

The consolidated PRD agent is a multi-platform AI assistant designed to help teams create structured, actionable Product Requirements Documents. It:

- Guides you through PRD creation with a conversational interface
- Enforces consistency and completeness across all PRDs
- Works natively in Claude Code, GitHub Copilot, and OpenAI API environments
- Integrates seamlessly with your existing tools (Figma, Linear, Claude Code workflows)

### Three Platforms, One Agent

The same PRD agent logic is packaged for three environments:

1. **Claude Code** (recommended) — Portable, cross-platform, full feature set
2. **GitHub Copilot** — Integrated into your .github control plane (Copilot-native workflows)
3. **OpenAI API** — For teams using OpenAI API (GPT-4, GPT-3.5-turbo, other models)

All three produce identical PRD output — choose the platform that fits your workflow.

### PRD Structure

Every PRD produced by the agent follows a canonical structure:

1. **Executive Summary** — 1–2 sentence overview of what's being built and why
2. **User Stories & Acceptance Criteria** — Who needs it, what they need, how to know it's done
3. **Requirements & Constraints** — Functional and non-functional requirements, technical limitations
4. **Data Model & Entities** — Schema, relationships, state transitions (if applicable)
5. **Success Metrics** — How you'll measure whether the work succeeded
6. **Assumptions & Dependencies** — What you're taking for granted, what you rely on
7. **Risks & Mitigations** — What could go wrong, how to prevent it

This structure is designed to be:

- **Estimable** — Clear enough that engineering can break it into tasks and estimate effort
- **Testable** — Acceptance criteria are verifiable, not vague
- **Integrable** — Structured enough to feed into Figma, Linear, and automation tools
- **Reusable** — Clear specifications that teams can reference later

## Getting Help

### Before You Ask

Check the [FAQ](./faq.md) — it covers the most common questions and blockers.

### Still Stuck?

1. **Setup issues?** → See the platform-specific setup guide ([Claude Code](./setup-claude-code.md), [Copilot](./setup-copilot.md), [OpenAI](./setup-openai.md))
2. **PRD quality questions?** → See [Best Practices](./best-practices.md) and [Workflow](./workflow.md)
3. **Integration problems?** → See [Integration Guide](./integration-guide.md)
4. **Not listed above?** → Open an issue on the [LightSpeed .github repository](https://github.com/lightspeedwp/.github/issues) with the `[PRD-AGENT-SUPPORT]` tag

## Quick Reference

### Most Common Tasks

**I want to create my first PRD:**
→ Start with [Setup](./setup-claude-code.md) (or your platform), then [Workflow](./workflow.md)

**I'm getting quality feedback on my PRDs:**
→ Review [Best Practices](./best-practices.md) for structure and completeness

**I need to feed a PRD into Linear/Figma:**
→ See [Integration Guide](./integration-guide.md)

**I don't know if I'm structuring PRDs for estimation correctly:**
→ Read [Estimation Strategy](./estimation-strategy.md)

**I hit an error or don't understand the agent's response:**
→ Check [FAQ](./faq.md)

## Version History

- **v2.1** (2026-09-17) — Initial comprehensive playbook release with setup guides, workflow, best practices, estimation strategy, and integration guidance

---

**Last Updated**: 2026-09-17  
**Owner**: LightSpeed Product & Engineering  
**Questions?** Open an issue: [lightspeedwp/.github#issues](https://github.com/lightspeedwp/.github/issues)
