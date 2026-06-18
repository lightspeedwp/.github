---
title: Mermaid Diagram Accessibility Compliance Report — Issue #669
description: Accessibility compliance audit of all 24 Mermaid diagrams for accTitle and accDescr attributes
version: 1.1.0
created_date: "2026-05-31"
last_updated: "2026-06-18"
file_type: documentation
maintainer: Claude Code
owners:
  - Claude Code
license: GPL-3.0
tags:
  - audit
  - mermaid
  - accessibility
  - a11y
  - diagrams
  - wave-5
domain: a11y
status: active
stability: stable
---

# Mermaid Diagram Accessibility Compliance Report

**Generated**: 2026-05-31T19:20:17.360Z

## Summary

- **Total diagrams**: 71
- **Accessible diagrams**: 50
- **Non-compliant diagrams**: 21
- **Compliance rate**: 70.4%

## Files Analyzed

- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/DISCUSSION_TEMPLATE/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/ISSUE_TEMPLATE/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/PULL_REQUEST_TEMPLATE/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/SAVED_REPLIES/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/agents/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/instructions/.archive/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/instructions/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/metrics/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/active/openspec/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/active/openspec/changes/test-coverage-implementation/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/active/template-enforcement-governance/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/active/template-enforcement-governance/openspec-strict/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/active/test-coverage-implementation/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/active/test-coverage-implementation/openspec-strict/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/active/wave-5-documentation-audit/execution/issue-seed-2026-06-08/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/archived/awesome-github-site/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/archived/awesome-github-site/openspec/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/archived/awesome-github-site/phase-1/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/archived/awesome-github-site/phase-2/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/adoption-workstream-2026-05-26/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/agent-skill-memory-platform/issues/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/awesome-github-site/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/awesome-github-site/openspec/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/awesome-github-site/phase-1/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/awesome-github-site/phase-2/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/branch-governance-hardening-2026-06-08/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/branch-governance-hardening-2026-06-08/openspec-strict/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/github-workflow-consolidation-2026-05-28/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/github-workflow-consolidation-2026-05-28/issues/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/issue-35-instruction-audit/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/issue-670-readme-refresh/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/label-governance-stabilisation-2026-05-27/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/label-governance-stabilisation-2026-05-27/issues/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/plugin-pack-waves/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/plugin-pack-waves/issues/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/plugin-pack-waves/openspec-strict/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/portable-ai-plugin-restructure/issues/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/refactor-migrate-prompts/openspec-strict/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/refactor-migrate-prompts/openspec/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/root-cleanup-dependency-audit-closed-2026-06-08/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/root-cleanup-dependency-audit-closed-2026-06-08/openspec-strict/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/projects/completed/wave-5-documentation-audit-closed-2026-06-01/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/prompts/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/reports/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/rulesets/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/schemas/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/tests/fixtures/pr-templates/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.github/workflows/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.schemas/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/.vscode/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/agents/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/ai/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/cookbook/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/docs/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/hooks/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/hooks/secrets-scanner/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/hooks/session-logger/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/hooks/tool-guardian/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/instructions/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/plugins/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/plugins/lightspeed-github-ops/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/plugins/lightspeed-github-ops/hooks/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/plugins/lightspeed-metrics-and-reporting/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/plugins/lightspeed-quality-assurance/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/plugins/lightspeed-release-ops/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/plugins/lightspeed-wordpress-governance/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/plugins/lightspeed-wordpress-planning/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/profile/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/prompts/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/schema/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/scripts/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/scripts/agents/**tests**/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/scripts/agents/includes/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/scripts/agents/includes/**tests**/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/scripts/validation/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/skills/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/skills/design-md-agent/markdown-content-validator/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/skills/design-md-agent/slides/artifact_tool/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/tests/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/website/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/workflows/README.md
- .claude/worktrees/agent-a9b97b2c5ae3e0432/workflows/memory/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/DISCUSSION_TEMPLATE/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/ISSUE_TEMPLATE/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/PULL_REQUEST_TEMPLATE/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/SAVED_REPLIES/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/agents/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/instructions/.archive/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/instructions/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/metrics/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/projects/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/projects/archived/portable-ai-plugin-restructure/issues/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/prompts/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/reports/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/schemas/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/workflows/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.schemas/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/.vscode/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/agents/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/cookbook/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/docs/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/hooks/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/instructions/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/plugins/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/plugins/lightspeed-github-ops/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/plugins/lightspeed-github-ops/hooks/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/profile/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/scripts/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/scripts/agents/**tests**/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/scripts/agents/includes/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/scripts/agents/includes/**tests**/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/scripts/validation/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/skills/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/skills/design-md-agent/markdown-content-validator/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/skills/design-md-agent/slides/artifact_tool/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/tests/README.md
- .claude/worktrees/agent-ad0b044aa1f4b21f2/workflows/README.md
- .github/DISCUSSION_TEMPLATE/README.md
- .github/ISSUE_TEMPLATE/README.md
- .github/PULL_REQUEST_TEMPLATE/README.md
- .github/README.md
- .github/SAVED_REPLIES/README.md
- .github/agents/README.md
- .github/instructions/.archive/README.md
- .github/instructions/README.md
- .github/metrics/README.md
- .github/projects/README.md
- .github/projects/active/openspec/README.md
- .github/projects/active/openspec/changes/test-coverage-implementation/README.md
- .github/projects/active/template-enforcement-governance/README.md
- .github/projects/active/template-enforcement-governance/openspec-strict/README.md
- .github/projects/active/test-coverage-implementation/README.md
- .github/projects/active/test-coverage-implementation/openspec-strict/README.md
- .github/projects/active/wave-5-documentation-audit/execution/issue-seed-2026-06-08/README.md
- .github/projects/archived/awesome-github-site/README.md
- .github/projects/archived/awesome-github-site/openspec/README.md
- .github/projects/archived/awesome-github-site/phase-1/README.md
- .github/projects/archived/awesome-github-site/phase-2/README.md
- .github/projects/completed/adoption-workstream-2026-05-26/README.md
- .github/projects/completed/agent-skill-memory-platform/issues/README.md
- .github/projects/completed/awesome-github-site/README.md
- .github/projects/completed/awesome-github-site/openspec/README.md
- .github/projects/completed/awesome-github-site/phase-1/README.md
- .github/projects/completed/awesome-github-site/phase-2/README.md
- .github/projects/completed/branch-governance-hardening-2026-06-08/README.md
- .github/projects/completed/branch-governance-hardening-2026-06-08/openspec-strict/README.md
- .github/projects/completed/github-workflow-consolidation-2026-05-28/README.md
- .github/projects/completed/github-workflow-consolidation-2026-05-28/issues/README.md
- .github/projects/completed/issue-35-instruction-audit/README.md
- .github/projects/completed/issue-670-readme-refresh/README.md
- .github/projects/completed/label-governance-stabilisation-2026-05-27/README.md
- .github/projects/completed/label-governance-stabilisation-2026-05-27/issues/README.md
- .github/projects/completed/plugin-pack-waves/README.md
- .github/projects/completed/plugin-pack-waves/issues/README.md
- .github/projects/completed/plugin-pack-waves/openspec-strict/README.md
- .github/projects/completed/portable-ai-plugin-restructure/issues/README.md
- .github/projects/completed/refactor-migrate-prompts/openspec-strict/README.md
- .github/projects/completed/refactor-migrate-prompts/openspec/README.md
- .github/projects/completed/root-cleanup-dependency-audit-closed-2026-06-08/README.md
- .github/projects/completed/root-cleanup-dependency-audit-closed-2026-06-08/openspec-strict/README.md
- .github/projects/completed/wave-5-documentation-audit-closed-2026-06-01/README.md
- .github/prompts/README.md
- .github/reports/README.md
- .github/rulesets/README.md
- .github/schemas/README.md
- .github/tests/fixtures/pr-templates/README.md
- .github/workflows/README.md
- .schemas/README.md
- .vscode/README.md
- README.md
- agents/README.md
- ai/README.md
- cookbook/README.md
- docs/README.md
- hooks/README.md
- hooks/secrets-scanner/README.md
- hooks/session-logger/README.md
- hooks/tool-guardian/README.md
- instructions/README.md
- plugins/README.md
- plugins/lightspeed-github-ops/README.md
- plugins/lightspeed-github-ops/hooks/README.md
- plugins/lightspeed-metrics-and-reporting/README.md
- plugins/lightspeed-quality-assurance/README.md
- plugins/lightspeed-release-ops/README.md
- plugins/lightspeed-wordpress-governance/README.md
- plugins/lightspeed-wordpress-planning/README.md
- profile/README.md
- prompts/README.md
- schema/README.md
- scripts/README.md
- scripts/agents/**tests**/README.md
- scripts/agents/includes/README.md
- scripts/agents/includes/**tests**/README.md
- scripts/validation/README.md
- skills/README.md
- skills/design-md-agent/markdown-content-validator/README.md
- skills/design-md-agent/slides/artifact_tool/README.md
- tests/README.md
- website/README.md
- workflows/README.md
- workflows/memory/README.md

## Compliance Criteria

All diagrams must include:

- ✅ **accTitle attribute** — Brief accessible title for screen readers
- ✅ **accDescr attribute** — Detailed accessible description of diagram content

Supported formats:

- Single-line: `accTitle Title text` or `accDescr: "Description text"`
- Block format: `accDescr { ... }`

## Detailed Results

⚠️ 21 diagram(s) missing accessibility attributes:

### .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/ISSUE_TEMPLATE/README.md — Diagram #1 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/README.md — Diagram #1 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/README.md — Diagram #2 (sequenceDiagram)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/README.md — Diagram #3 (graph)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/README.md — Diagram #4 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/.github/projects/README.md — Diagram #1 (graph)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/.vscode/README.md — Diagram #1 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/README.md — Diagram #5 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/README.md — Diagram #6 (stateDiagram)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/README.md — Diagram #7 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/profile/README.md — Diagram #1 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/profile/README.md — Diagram #2 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/profile/README.md — Diagram #3 (graph)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/profile/README.md — Diagram #4 (stateDiagram)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/scripts/README.md — Diagram #1 (graph)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/scripts/README.md — Diagram #2 (sequenceDiagram)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/scripts/README.md — Diagram #3 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/scripts/validation/README.md — Diagram #1 (graph)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/tests/README.md — Diagram #1 (graph)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/tests/README.md — Diagram #2 (sequenceDiagram)

- Missing accTitle attribute
- Missing accDescr attribute

### .claude/worktrees/agent-ad0b044aa1f4b21f2/tests/README.md — Diagram #3 (flowchart)

- Missing accTitle attribute
- Missing accDescr attribute

## Recommendations

⚠️ Recommended actions:

1. Add missing `accTitle` attributes to identify each diagram
2. Add comprehensive `accDescr` blocks describing diagram purpose and key relationships
3. Test with screen readers to verify readability
4. Re-run validation after fixes
5. Consult [Mermaid Accessibility Docs](https://mermaid.js.org/config/accessibility.html)

---

**Audit Conducted By**: Claude Code
**Date**: 2026-05-31
**Related Issues**: #667, #668, #669, #670
