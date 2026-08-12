---
title: "Portable Prompt Engineer Agent — OpenSpec Proposal"
description: "OpenSpec proposal for portable prompt engineer agent initiative"
file_type: "openspec"
created_date: "2026-08-12"
last_updated: "2026-08-12"
status: "active"
domain: "agent"
---

# Portable Prompt Engineer Agent — OpenSpec Proposal

## Why

Currently, the Prompt Engineer Agent is control-plane specific (`.github`-only), limiting its value across the LightSpeed organisation. By making it portable, we enable **unified prompt engineering capabilities** across `.github` governance, WordPress block plugins, and WordPress block themes—reducing duplication, improving consistency, and accelerating development across all repositories.

**Timing:** Identified as Phase 5 of the Issue Maintenance & Agent Ecosystem initiative; aligns with organisation-wide portability standards (CLAUDE.md Tier 2 agents).

## What Changes

- **Move agent from `.github/agents/` (control-plane) to `agents/` (root, portable)**
- **Add context-aware behavior** to adapt to three repository types (`.github`, plugins, themes) without creating variants
- **Implement universal prompt analysis framework** (clarity, completeness, testability, constraint validation)
- **Add repository-specific validation rules** and example libraries for each context
- **Include comprehensive test suite** (80% code coverage, 30+ integration tests, repository-specific validation)
- **Create production-ready documentation** with mermaid architecture diagrams
- **Publish to NPM** (`@lightspeedwp/prompt-engineer-agent`) + Git clone option for wider adoption
- **Implement four-phase delivery** (Specification → Core → Testing → Documentation & Release; 9–12 weeks)

**Non-breaking changes:** Existing `.github/agents/prompt-engineer.agent.md` maintained as backward-compatibility mirror; new workflows can opt-in to portable version.

## Capabilities

### New Capabilities

- `prompt-analysis-framework`: Universal prompt analysis methodology (clarity, completeness, testability detection) that works across repository contexts
- `context-detection`: Automatic repository-type detection (`.github`, WordPress plugin, WordPress theme) to enable context-aware behavior
- `improvement-generation`: Structured improvement suggestion engine with reasoning and trade-off documentation
- `repository-specific-validation`: Validation rules and standards awareness for `.github` governance, WordPress plugins, and WordPress themes
- `test-fixture-management`: Curated corpus of real-world test prompts (30+) for validation across all repository types
- `wordpress-plugin-support`: WordPress block plugin context awareness (hook naming, block registration, deprecation patterns)
- `wordpress-theme-support`: WordPress block theme context awareness (design tokens, patterns, CSS custom properties)
- `documentation-generation`: Auto-generated documentation with mermaid diagrams, quickstart guides, API specs
- `npm-distribution`: NPM package publishing and version management (@lightspeedwp/prompt-engineer-agent)
- `multi-model-testing`: Validation across multiple Claude models (Sonnet, Haiku) for consistency

### Modified Capabilities

- `prompt-engineer-agent`: Changed from control-plane-specific to portable with context-awareness; moved from `.github/agents/` to `agents/` root location; API and output format backward-compatible

## Impact

**Affected Systems:**

- `.github` control plane (governance, workflows, labels)
- WordPress block plugin development repositories
- WordPress block theme development repositories
- Agent ecosystem (Tier 2 portable agents registry)

**Affected Code/Paths:**

- `.github/agents/prompt-engineer.agent.md` → `agents/prompt-engineer/` (root)
- New folder: `agents/prompt-engineer/` with multi-file structure (spec, skills, templates, tests, docs)
- New CI/CD: Test suite integration, NPM publishing pipeline
- New documentation: README, ARCHITECTURE, API, EXAMPLES, CONTRIBUTING, TROUBLESHOOTING

**API Changes:**

- None (backward-compatible); existing control-plane workflows continue unchanged
- New installation paths (NPM registry, Git clone) available for other repos

**Dependencies:**

- Claude API (unchanged)
- GitHub Actions CI/CD (for testing and publishing)
- NPM registry access (@lightspeedwp organization)
- Mermaid diagram rendering (for documentation)

**Maintenance Burden:**

- Distributed ownership (lead maintainer + context-specific sub-maintainers)
- Quarterly release cycle with monthly patch releases
- Semantic versioning with clear deprecation policy

## Success Criteria

**Phase 1 (Specification):**

- ✅ QUESTIONS.md, ANSWERS.md, SCOPE.md complete and approved
- ✅ ARCHITECTURE.md created with system diagrams
- ✅ Test strategy documented with 80% coverage target
- ✅ OpenSpec change initialized and proposal approved

**Phase 2 (Core Implementation):**

- ✅ Agent passes 10+ integration test cases
- ✅ Context detection works for all three repository types
- ✅ API documented with examples
- ✅ 80%+ code coverage achieved

**Phase 3 (Testing & Validation):**

- ✅ 30+ integration tests passing
- ✅ 15 repository-specific validation cases pass
- ✅ Expert-approved improvements on random sample
- ✅ Zero critical bugs

**Phase 4 (Release):**

- ✅ Comprehensive documentation published
- ✅ NPM package published and validated
- ✅ Git installation script working
- ✅ First release tagged and announced

## Related Documents

- **Planning Project:** `.github/projects/active/portable-prompt-engineer-agent-spec-2026-08-12/`
- **QUESTIONS.md:** Strategic planning questions and decision framework
- **ANSWERS.md:** Best practice answers with detailed rationale
- **SCOPE.md:** Scope boundaries, constraints, and success criteria
- **Architecture Standards:** CLAUDE.md (Tier 2 agents), AGENTS.md
- **Source Agent:** `.github/agents/prompt-engineer.agent.md` (current control-plane version)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
