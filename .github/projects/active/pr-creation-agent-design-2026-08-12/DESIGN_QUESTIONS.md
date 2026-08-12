# PR Creation Agent — Design Questions & Best-Practice Answers

## Executive Summary

This document answers 9 critical design questions for a portable PR creation agent based on:

- Your existing agent architecture (35 agents, two-tier structure)
- Strict PR governance in this repo (branching, templates, labels, feedback tracking)
- Portability requirements (reusable across LightSpeed repos)
- Integration patterns observed in existing workflows

---

## 1. What Initiates PR Creation?

**Answer:** All three triggers supported:

- **Primary:** Workflow output (agent produces changes, PR agent creates PR)
- **Secondary:** Manual user request (user asks agent to create PR)
- **Tertiary:** Programmatic API (other tools/agents invoke PR creation)

**Rationale:** Workflow-driven approach aligns with existing automation patterns (label-sync, issue triage, changelog generation).

---

## 2. What Scope of Changes?

**Answer:** Support both single-file and multi-file changes. Agent adapts PR composition based on scope:

- **Single-file (20%):** Docs, config, changelog — minimal description
- **Multi-file (70%):** Features, refactoring — detailed description  
- **Complex (10%):** Architecture, major versions — comprehensive description

**Rationale:** Different scopes require different PR templates and description depth.

---

## 3. Autonomy Level?

**Answer:** **Level 2 — Create + Commit + PR** (Recommended for MVP)

Flow:

1. Create branch (if needed)
2. Write files to branch
3. Commit with agent signature
4. Push to origin
5. Create PR with template, labels, linked issues

**Rationale:** Balance between automation and safety. Commit is signed and auditable. Humans still review before merge.

---

## 4. Integration with Existing Systems?

**Answer:** Integrate with all governance layers:

- **Branch Naming:** Validate `{type}/{scope}-{short-title}` format
- **PR Templates:** Route to correct template based on branch type
- **Label Enforcement:** Apply only prefixed labels from `.github/labels.yml`
- **Issue Linking:** Require `Resolves #123` or `Closes #456`
- **Feedback Tracking:** Copy `FEEDBACK_RESPONSE.md` if AI feedback addressed
- **Mergify Queue:** Enqueue PR if repo uses sequential queue
- **Validation Workflows:** Ensure PR passes all checks before ready

**Rationale:** Full governance stack ensures consistency across repos.

---

## 5. What Must Every PR Contain?

**Mandatory Fields:**

- **Linked Issues:** PR description must contain `Resolves #123` or `Closes #456`
- **PR Title:** Under 70 chars, format: `{type}: {description}`
- **Description:** Summary, Changes, Testing, Checklist sections
- **Labels:** At least one `type:*` label, optional `area:*` and `priority:*`

**Conditional Fields:**

- **Changelog Entry:** Required if user-facing change
- **Feedback Tracking:** Only if PR addresses AI feedback

**Rationale:** Traceability, documentation, and governance enforcement.

---

## 6. Skill Composition?

**Answer:** **Skill-Delegating Architecture** with 6 core sub-skills:

1. `validate-branch-name` — Branch naming validation
2. `route-pr-template` — Template routing
3. `validate-and-apply-labels` — Label validation
4. `enforce-issue-linking` — Issue linking validation
5. `draft-pr-description` — PR body composition
6. `create-pr` — GitHub API PR creation

**Rationale:** Better reusability, testability, and maintainability than monolithic approach.

---

## 7. Existing Skills to Reuse?

**Integrate with 4 existing skills:**

- `code-review` — Optional pre-PR review
- `commit-push-pr` — Reuse git operations patterns
- `commit` — Reuse commit signing
- `figma` — Optional for design-driven changes

**Create 6 new PR-specific skills** (see Question 6).

**Rationale:** Don't reinvent git operations; maximize reuse.

---

## 8. Target Repos?

**Phase 1 MVP (8–12 repos):**

1. `lightspeedwp/.github` (this repo, highest complexity)
2. WordPress plugins (5–7 repos, similar branching)
3. Internal tools (2–3 repos, less complexity)

**Phase 2+:** Extensible to external repos via configuration.

**Rationale:** Phased rollout starting with internal repos.

---

## 9. Repo-Specific Customisation?

**Answer:** Two-level customisation:

**Level 1: Configuration File (`.claude/pr-agent.config.yml`)**

- Base branch (develop, main, etc.)
- Template routing rules
- Label validation
- Changelog requirements
- Issue linking rules
- Mergify queue configuration

**Level 2: Custom Hooks (Optional `.claude/pr-agent-hooks.js`)**

- Override validation logic
- Customize label inference
- Add custom PR sections
- Post-creation hooks (Slack notifications, auto-assign)

**Rationale:** Configuration for standard customization, hooks for non-standard needs.

---

## Summary: Recommended Architecture

### Agent Tier

**Multi-file agent** (not spec-based) — Complexity and skill reuse justify full implementation

### Skill Composition

**Skill-delegating:** 4 existing skills + 6 new PR-specific skills

### Portability

**Configuration-driven:** `.claude/pr-agent.config.yml` + optional `.claude/pr-agent-hooks.js`

### Autonomy

**Level 2:** Create + Commit + PR (human reviews before merge)

### Integration

**Full governance stack:** Branch naming, templates, labels, issues, feedback, Mergify

---

## Detailed Documentation

See expanded documentation files for:

- **SPECIFICATION.md** (Phase 2) — Agent specification and schema
- **ARCHITECTURE.md** (Phase 2) — Integration and portability architecture
- **IMPLEMENTATION_PLAN.md** (Phase 3) — Implementation roadmap

---

*Design Phase: 2026-08-12 → 2026-08-16*
