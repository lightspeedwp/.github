# PR Creation Agent — OpenSpec Planning

**Agent Type:** Portable Multi-File Agent  
**Scope:** Automated pull request creation with governance integration  
**Status:** Phase 2 Specification Complete  
**Timeline:** Phase 3 (2026-08-20 → 2026-09-02)

## Overview

A portable PR creation agent that automates pull request generation across LightSpeed repositories (GitHub control plane, WordPress plugins, WordPress themes). The agent encapsulates best practices for branch validation, template routing, label enforcement, issue linking, and PR composition.

## Project Structure

```
.github/projects/active/
├── pr-creation-agent-phase-2-2026-08-12/     (Specification docs)
│   ├── README.md                               (Project overview)
│   ├── OPENSPEC.md                             (Formal specification)
│   ├── ARCHITECTURE.md                         (Agent design)
│   ├── WORDPRESS_COMPATIBILITY.md              (Multi-repo analysis)
│   ├── DEPLOYMENT_PLAN.md                      (Rollout strategy)
│   ├── DOCUMENTATION_PLAN.md                   (Doc strategy)
│   └── TEST_STRATEGY.md                        (Test coverage)
│
└── openspec/changes/pr-creation-agent/         (OpenSpec tracking)
    ├── README.md                               (This file)
    ├── tasks.md                                (Task tracking)
    └── .openspec.yaml                          (Metadata)
```

## Key Decisions

| Decision | Value |
|----------|-------|
| **Agent Tier** | Multi-file (not spec-based) |
| **Autonomy Level** | Level 2: Create + Commit + PR |
| **Skill Approach** | Skill-delegating (6 new + 4 existing) |
| **Configuration Model** | Config-driven (.claude/pr-agent.config.yml + hooks) |
| **Portability** | Single codebase, per-repo configuration |
| **Target Repos** | 12 repositories (1 control plane + 4 plugins + 4 themes + 3 internal) |

## Phase Timeline

- **Phase 1** ✅ Design & Requirements (Complete)
  - 9 design questions answered
  - OPENSPEC specification written
  - Agent tier and skill architecture decided

- **Phase 2** ✅ Specification & Planning (Complete)
  - Architecture document with 6 Mermaid diagrams
  - WordPress compatibility analysis
  - Deployment plan (6-wave rollout)
  - Documentation plan (5,200+ lines)

- **Phase 3** → Implementation & Validation (2026-08-20 → 2026-09-02)
  - Agent core implementation
  - 6 skills implementation
  - Full test suite (95%+ coverage)
  - Integration testing

- **Phase 4** → GA & Rollout (2026-09-02 → 2026-09-09)
  - 12-repo deployment
  - Comprehensive documentation
  - Team training

## Skills Architecture

**New Skills (6):**

1. `validate-branch-name` — Branch naming validation
2. `route-pr-template` — Template routing and loading
3. `validate-and-apply-labels` — Label validation and application
4. `enforce-issue-linking` — Issue linking enforcement
5. `draft-pr-description` — PR description composition
6. `create-pr` — GitHub PR creation

**Reused Skills (4):**

- `code-review` — Optional pre-PR review
- `commit-push-pr` — Reference for Git patterns
- `commit` — Commit signing pattern
- `figma` — Design-driven PR support

## Specification Documents

All Phase 2 specification documents are complete and stored in `.github/projects/active/pr-creation-agent-phase-2-2026-08-12/`:

- **OPENSPEC.md** — 2,000+ line formal specification
- **ARCHITECTURE.md** — Agent design with 6 Mermaid diagrams
- **WORDPRESS_COMPATIBILITY.md** — Multi-repo analysis
- **DEPLOYMENT_PLAN.md** — 6-wave rollout for 12 repos
- **DOCUMENTATION_PLAN.md** — 5,200+ line documentation plan
- **TEST_STRATEGY.md** — 95%+ coverage test strategy

## Related GitHub Issues

- **#1812** — PR Creation Agent Design Initiative (tracking issue)
- **#1822** — Phase 2 Specification & Planning (tracking issue)
- **#1722** — Repository Restructuring & Agent Standardisation (parent epic)

## Pull Requests

- **PR #1834** — Phase 1 Design Specification
- **PR #1835** — Phase 2 Specification & Planning

## Success Criteria (Phase 2 Complete)

- ✅ All 9 design questions answered with rationale
- ✅ Formal OPENSPEC specification (2,000+ lines)
- ✅ Agent tier and skill architecture finalized
- ✅ Portability strategy documented
- ✅ Integration points identified
- ✅ Deployment plan with 6-wave rollout
- ✅ Documentation plan (5,200+ lines)
- ✅ Test strategy (95%+ coverage)

## Next Steps (Phase 3)

1. Implement agent core (pr-orchestrator, config-loader, state-machine)
2. Implement all 6 skills with interfaces
3. Write comprehensive test suite (100+ unit, 30+ integration, 5+ E2E)
4. Validate against mock and real GitHub APIs
5. Prepare for Phase 4 rollout

---

**OpenSpec Documentation Complete — Ready for Phase 3 Implementation**
