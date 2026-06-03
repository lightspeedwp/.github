---
title: "Slide to Source Mapping"
description: "Fast mapping from each slide to supporting repository files."
last_updated: "2026-06-02"
owners: ["Ash Shaw"]
---

# Slide to Source Mapping

| Deck order | Slide brief | Theme | Primary files |
| --- | --- | --- | --- |
| 1 | [slide-01-hook-and-stakes.md](../slides/slide-01-hook-and-stakes.md) | Hook and stakes | `README.md`, `docs/AUTOMATION_GOVERNANCE.md` |
| 2 | [slide-02-why-github-control-plane.md](../slides/slide-02-why-github-control-plane.md) | Control plane start | `README.md`, `.github/labels.yml`, `.github/issue-types.yml` |
| 3 | [slide-03-inheritance-boundaries.md](../slides/slide-03-inheritance-boundaries.md) | Inheritance boundaries | `docs/SHARED_GITHUB_ADOPTION_GUIDE.md`, `instructions/labeling.instructions.md` |
| 4 | [slide-04-control-plane-architecture.md](../slides/slide-04-control-plane-architecture.md) | Architecture | `README.md`, `AGENTS.md`, `instructions/file-organisation.instructions.md` |
| 5 | [slide-05-canonical-governance-assets.md](../slides/slide-05-canonical-governance-assets.md) | Canonical governance assets | `.github/labels.yml`, `docs/LABEL_STRATEGY.md`, `instructions/coding-standards.instructions.md` |
| 6 | [slide-17-issue-template-system.md](../slides/slide-17-issue-template-system.md) | Issue templates | `.github/ISSUE_TEMPLATE/config.yml`, `.github/ISSUE_TEMPLATE/README.md`, `.github/ISSUE_TEMPLATE/23-ai-ops.md` |
| 7 | [slide-18-pr-template-system.md](../slides/slide-18-pr-template-system.md) | PR templates | `.github/PULL_REQUEST_TEMPLATE/README.md`, `.github/PULL_REQUEST_TEMPLATE/pr_feature.md`, `.github/PULL_REQUEST_TEMPLATE/pr_release.md` |
| 8 | [slide-16-workflow-layer.md](../slides/slide-16-workflow-layer.md) | Workflow layer | `.github/workflows/labeling.yml`, `.github/workflows/release.yml`, `docs/WORKFLOWS.md` |
| 9 | [slide-13-agent-layer.md](../slides/slide-13-agent-layer.md) | Agent layer | `agents/agent.md`, `agents/labeling.agent.md`, `ai/agents.md` |
| 10 | [slide-14-skill-layer.md](../slides/slide-14-skill-layer.md) | Skill layer | `skills/SKILL_REGISTRY.json`, `skills/README.md`, `plugins/lightspeed-github-ops/skills/` |
| 11 | [slide-15-hook-layer.md](../slides/slide-15-hook-layer.md) | Hook layer | `hooks/README.md`, `hooks/hook-registry.json`, `hooks/secrets-scanner/` |
| 12 | [slide-19-ai-governance-model.md](../slides/slide-19-ai-governance-model.md) | AI governance model | `AGENTS.md`, `ai/RUNNERS.md`, `instructions/automation.instructions.md`, `docs/AUTOMATION_GOVERNANCE.md` |
| 13 | [slide-06-why-we-pivoted.md](../slides/slide-06-why-we-pivoted.md) | Pivot rationale | `docs/MIGRATION.md`, `docs/PLUGIN_PACK_ROADMAP.md`, `plugins/README.md` |
| 14 | [slide-07-plugin-pack-architecture.md](../slides/slide-07-plugin-pack-architecture.md) | Plugin pack internals | `plugins/lightspeed-github-ops/README.md` |
| 15 | [slide-08-multi-platform-parity.md](../slides/slide-08-multi-platform-parity.md) | Multi-platform parity | `plugins/lightspeed-github-ops/*.json`, `skills/SKILL_REGISTRY.json` |
| 16 | [slide-09-quality-and-release-gates.md](../slides/slide-09-quality-and-release-gates.md) | Quality and release | `docs/RELEASE_PROCESS.md`, `docs/TESTING.md`, `.github/workflows/` |
| 17 | [slide-10-metrics-and-governance-outcomes.md](../slides/slide-10-metrics-and-governance-outcomes.md) | Metrics and governance | `docs/METRICS.md`, `docs/GOVERNANCE_REVISION_LOG.md` |
| 18 | [slide-11-lessons-and-anti-patterns.md](../slides/slide-11-lessons-and-anti-patterns.md) | Lessons learned | `docs/override-policy.md`, `instructions/spec-driven-workflow.instructions.md` |
| 19 | [slide-12-adoption-playbook.md](../slides/slide-12-adoption-playbook.md) | Adoption path | `docs/SHARED_GITHUB_ADOPTION_GUIDE.md`, `plugins/PLUGIN_MANIFEST.json` |
| 20 | [slide-20-ecosystem-and-acknowledgements.md](../slides/slide-20-ecosystem-and-acknowledgements.md) | Ecosystem and acknowledgements | `plugins/README.md`, `plugins/PLUGIN_MANIFEST.json`, `docs/ROADMAP.md` |

## Attribution reminder

Include this line on the References page and in spoken closing:

"With thanks to `github/awesome-copilot` for inspiration across skills, agents, and workflow patterns."
