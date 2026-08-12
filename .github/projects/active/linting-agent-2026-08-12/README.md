---
title: Linting Agent — Design & Implementation
description: Multi-phase project to design and implement a portable, organisation-wide linting agent
status: active
phases:
  - Phase 1 (Specification & Planning) — weeks 1
  - Phase 2 (Implementation) — weeks 2-3
  - Phase 3 (Testing) — week 4
  - Phase 4 (Documentation & Deployment) — week 5
created: 2026-08-12
last_updated: 2026-08-12
---

# Linting Agent Design & Implementation Project

**Project Goal:** Design and implement a portable, organisation-wide linting agent that enforces code quality standards across all LightSpeedWP repositories (GitHub control plane, WordPress plugins, WordPress themes, and other projects).

**Status:** 🔵 Phase 1 — Specification & Planning (Active)

---

## 📋 Project Overview

### Current State

- ✅ Agent spec exists (`.github/agents/linting.agent.md`) with basic frontmatter
- ✅ JavaScript implementation exists (`scripts/agents/linting.agent.js`) with helper functions
- ❌ Full prompt not written
- ❌ Test coverage missing
- ❌ WordPress compatibility untested
- ❌ Documentation incomplete

### Desired State (Phase 4 Complete)

- ✅ Full agent prompt with organisation-wide standards integrated
- ✅ Enhanced JavaScript implementation with additional helpers
- ✅ ≥ 95% test coverage
- ✅ Tested across 3+ repository contexts (control plane, plugin, theme)
- ✅ Comprehensive documentation with Mermaid diagrams
- ✅ Ready for deployment to stable branch

---

## 🎯 Deliverables by Phase

### Phase 1: Specification & Planning (Week 1)

**Branch:** `design/linting-agent-specification`  
**Status:** 🟢 In Progress

- ✅ [SPECIFICATION.md](./SPECIFICATION.md) — Complete agent specification with architecture, requirements, test strategy
- ✅ [README.md](./README.md) — This project overview
- ✅ TEST_PLAN.md — Detailed test strategy and test cases
- ⏳ WORDPRESS_GUIDE.md — WordPress plugin/theme integration guide (Phase 2)
- ⏳ GitHub Issues created for Phases 2-4

**Artifacts:** Specification document with 5+ Mermaid diagrams

### Phase 2: Implementation (Weeks 2-3)

**Branch:** `feat/linting-agent-implementation`  
**Status:** 🔵 Planned

- Update `.github/agents/linting.agent.md` with full prompt from draft
- Enhance `scripts/agents/linting.agent.js`:
  - Add WordPress-specific config helpers
  - Improve error handling
  - Add logging/debugging output
- Create WordPress configuration guide
- Integration with organisation instruction files

**Deliverable:** Fully implemented agent ready for testing

### Phase 3: Testing (Week 4)

**Branch:** `test/linting-agent-coverage`  
**Status:** 🔵 Planned

- Unit tests for all `linting.agent.js` functions
- Integration tests with mock linters
- E2E tests across 3+ repository types:
  - `.github` control plane
  - WordPress plugin (block plugin)
  - WordPress theme (block theme)
- Achieve ≥ 95% code coverage
- Jest snapshot tests for report format validation

**Deliverable:** Full test suite with coverage report

### Phase 4: Documentation & Deployment (Week 5)

**Branch:** `docs/linting-agent-deployment`  
**Status:** 🔵 Planned

- User guide (how to run agent)
- Setup guide (per-repository configuration)
- Troubleshooting guide
- Mermaid diagrams:
  - Architecture flow
  - Test matrix
  - Repository compatibility matrix
  - Decision trees
- Deploy to `develop` branch
- Release notes and migration guide

**Deliverable:** Complete documentation + deployment to stable branch

---

## 🏗️ Architecture Highlights

### Single Portable Agent (Not Multiple)

The project uses **one agent** across all repository types, configured via:

- Canonical config files (`.eslintrc.json`, `.phpcsxml`, etc.)
- Repository-specific `CLAUDE.md` overrides
- Sensible defaults when configs are missing

**Benefit:** Reduced maintenance, unified experience, easier onboarding.

### Supported File Types (8+)

```
JavaScript/TypeScript → ESLint + Prettier
Markdown             → markdownlint + Prettier  
YAML                 → yamllint + Spectral
JSON                 → JSONLint + Prettier
Shell Scripts        → ShellCheck
PHP                  → PHPCS/WordPress Coding Standards
CSS/SCSS             → stylelint
HTML                 → htmlhint + accessibility rules
Python               → flake8 + black + isort
```

### WordPress Compatibility Matrix

| Repository Type | Supported | Config | Custom? |
|---|---|---|---|
| `.github` control plane | ✅ | Auto-discovery | Via CLAUDE.md |
| Modern WordPress Plugin | ✅ | phpcs.xml + eslint | Via plugin CLAUDE.md |
| Modern WordPress Theme | ✅ | phpcs.xml + stylelint | Via theme CLAUDE.md |
| Legacy WordPress (classic) | ⚠️ | phpcs.xml only | Via CLAUDE.md |
| Other repositories | ✅ | Auto-discovery | Via CLAUDE.md |

---

## 📊 Testing Strategy

### Target Coverage: ≥ 95%

```
Unit Tests (linting.agent.js)
├── parseLintTargets() — array, string, object, empty
├── normaliseFilePath() — Windows, absolute, relative
├── selectRulesForFile() — extension matching, ordering
├── normaliseConfig() — object, string, null, invalid
├── readConfigFile() — valid/invalid JSON, missing files
├── normaliseFinding() — multiple formats, missing fields
├── flattenFindings() — arrays, nested, empty
├── dedupeFindings() — exact duplicates, edge cases
├── groupFindingsByFile() — multiple files, counts
├── buildSummary() — empty/full results
└── formatLintReport() — output format, grouping

Integration Tests (Mock Linters)
├── ESLint mock with known issues
├── markdownlint mock with Markdown files
└── End-to-end flow verification

E2E Tests (3+ Real Repositories)
├── .github control plane
├── Sample WordPress plugin
└── Sample WordPress theme
```

**Tools:** Jest + mock file system + linter mocks

---

## 📁 Project Files

```
.github/projects/active/linting-agent-2026-08-12/
├── README.md                          (this file)
├── SPECIFICATION.md                   (complete spec with diagrams)
├── TEST_PLAN.md                       (detailed test strategy)
├── WORDPRESS_GUIDE.md                 (WordPress integration)
├── IMPLEMENTATION_CHECKLIST.md        (phase 2 tasks)
└── DEPLOYMENT_CHECKLIST.md            (phase 4 tasks)
```

---

## 🚀 Next Steps

### Immediate (Today)

1. ✅ Create specification document ← You are here
2. ⏳ Create GitHub issues for Phases 2-4
3. ⏳ Create PR with phase 1 deliverables
4. ⏳ Get stakeholder feedback on specification

### Phase 1 (This Week)

- Complete TEST_PLAN.md with all test cases
- Complete WORDPRESS_GUIDE.md with configuration examples
- Create GitHub issues for each phase
- Create detailed task checklists for Phases 2-4

### Phase 2 (Next Week)

- Update `.github/agents/linting.agent.md` with full prompt
- Enhance `linting.agent.js` with additional helpers
- Create WordPress-specific configuration examples

---

## 🔗 Related Issues

| Issue | Type | Phase | Status |
|---|---|---|---|
| [#1818](https://github.com/lightspeedwp/.github/issues/1818) | epic | 1-4 | 🟡 Draft |
| [#1819](https://github.com/lightspeedwp/.github/issues/1819) | task | 2 | 🔵 Planned |
| [#1821](https://github.com/lightspeedwp/.github/issues/1821) | task | 3 | 🔵 Planned |
| [#1822](https://github.com/lightspeedwp/.github/issues/1822) | task | 4 | 🔵 Planned |

---

## 📚 Related Documentation

- [Linting Agent Specification](./SPECIFICATION.md) — Complete specification with architecture
- [Linting Instructions](../../../instructions/linting.instructions.md) — Organisation linting standards
- [Coding Standards Instructions](../../../instructions/coding-standards.instructions.md) — Unified standards
- [Spec-Driven Workflow](../../../instructions/spec-driven-workflow.instructions.md) — Our development methodology
- [linting.agent.js](../../../scripts/agents/linting.agent.js) — JavaScript implementation

---

## 👥 Team

- **Owner:** LightSpeedWP/maintainers
- **Lead:** Ash Shaw
- **Status:** Active Planning

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
