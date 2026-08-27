# PHASE 2 BATCH PROMPT: Agents 5–14 (ten agents, one branch)

> **Self-contained brief for a fresh Claude Code chat.** This branch standardises
> **ten** agents in a single PR, so it is the largest of the four (~10,000+ lines
> of real content when done properly). Read the playbook first, then work agent
> by agent, verifying each on disk before moving on.

| | |
| --- | --- |
| **Scope** | 10 agents (see table) |
| **Branch** | `feat/agent-standards-batch-5-14` |
| **PR** | [#1143](https://github.com/lightspeedwp/.github/pull/1143) |
| **Base** | `develop` |

## Required reading (in order)

1. **`PHASE_2_EXECUTION_PLAYBOOK.md`** — real-content rules + verification, the
   six pre-existing `develop` CI blockers + fixes, commit/push mechanics, PR-body
   template, merge protocol, definition of done. **Do not skip.**
2. `agents/woo-config-agent/` — the Phase 2 **reference implementation**. Copy
   its shape and depth for every agent here.
3. `PROMPT_2_GENERIC_AGENT_REWRITE.md` — detailed per-phase templates.

## Current state (as of hand-off)

- Branch exists and is pushed; PR #1143 is open against `develop`.
- ⚠️ **All ten agents are stub/foundation-level only** — a prior run reported
  them complete but wrote near-empty files. Each agent needs real content per the
  playbook §0 line floors. Realistic budget: **10 × ~1,000+ lines ≈ 10,000+
  lines**. Do **not** claim completion without pasting the per-agent
  line-count verification.
- All six pre-existing `develop` CI blockers (playbook §2) apply to this branch.
- Because ten agents ride one PR, the `CHANGELOG.md` entry and PR body should
  cover all ten and link all ten issues.

## The ten agents and their issues

| # | Agent | Slug (`agents/{slug}-agent/`) | Issue | Plugin |
| --- | --- | --- | --- | --- |
| 1 | Design Partner | `design-partner` | [#1090](https://github.com/lightspeedwp/.github/issues/1090) | `lightspeed-design-partner` |
| 2 | Proposal Desk | `proposal-desk` | [#1096](https://github.com/lightspeedwp/.github/issues/1096) | `lightspeed-proposals` |
| 3 | Client Website Discovery Assistant | `client-website-discovery-assistant` | [#1089](https://github.com/lightspeedwp/.github/issues/1089) | `lightspeed-discovery-services` |
| 4 | Website Scope Estimator | `website-scope-estimator` | [#1100](https://github.com/lightspeedwp/.github/issues/1100) | `lightspeed-estimation-services` |
| 5 | Website Content Strategist | `website-content-strategist` | [#1099](https://github.com/lightspeedwp/.github/issues/1099) | `lightspeed-content-strategy` |
| 6 | PageSpeed | `pagespeed` | [#1093](https://github.com/lightspeedwp/.github/issues/1093) | `lightspeed-performance-optimization` |
| 7 | Linear Advisor | `linear-advisor` | [#1092](https://github.com/lightspeedwp/.github/issues/1092) | `lightspeed-project-management-linear` |
| 8 | Harvest Analytical | `harvest-analytical` | [#1091](https://github.com/lightspeedwp/.github/issues/1091) | `lightspeed-time-tracking-analytics` |
| 9 | Zendesk Support | `zendesk-support` | [#1103](https://github.com/lightspeedwp/.github/issues/1103) | `lightspeed-support-zendesk` |
| 10 | AI Readiness Estimator | `ai-readiness-estimator` | [#1088](https://github.com/lightspeedwp/.github/issues/1088) | `lightspeed-assessment-ai-readiness` |

> Note: the PRD Agent (#1094) and PRD Factory Planner (#1095) are **not** in this
> batch — they were merged separately as the combined PRD agent (PR #1139).

## Per-agent capabilities & tools

Each agent gets the full nine-file structure (playbook §1) with real content at
the §0 floors. Domain, capabilities, and tool/skill/function names per agent:

**1. Design Partner** (`design`, partner-collaboration) — design consultation,
design-system management, UI/UX review, WCAG 2.2 AA accessibility assessment,
design documentation, Figma integration.
Tools: `design_review`, `accessibility_checker`, `design_system_validator`,
`figma_context`, `component_library_manager`, `wcag_auditor`.

**2. Proposal Desk** (`proposals`, proposal-generation) — proposal templates,
quote/estimation, scope definition, client communication, proposal tracking,
invoice generation.
Tools: `proposal_create`, `quote_generator`, `scope_estimator`,
`timeline_planner`, `invoice_generator`, `proposal_tracker`.

**3. Client Website Discovery Assistant** (`discovery`, website-assessment) —
website audit, competitor analysis, feature-gap analysis, UX assessment,
performance analysis, recommendation generation.
Tools: `website_analyzer`, `seo_auditor`, `performance_tester`, `ux_assessor`,
`competitor_analyzer`, `recommendation_engine`.

**4. Website Scope Estimator** (`estimation`, project-scoping) — feature-scope
analysis, effort estimation, timeline generation, resource planning, budget
estimation, risk assessment.
Tools: `scope_analyzer`, `effort_estimator`, `timeline_planner`,
`resource_calculator`, `budget_estimator`, `risk_assessor`.

**5. Website Content Strategist** (`content`, content-strategy) — content
strategy, content audit, gap analysis, SEO optimisation, content-calendar
generation, user-journey mapping.
Tools: `content_strategist`, `content_auditor`, `gap_analyzer`, `seo_optimizer`,
`keyword_researcher`, `content_planner`.

**6. PageSpeed** (`performance`, performance-optimization) — Core Web Vitals
analysis, load-time optimisation, resource optimisation, caching strategy, CDN,
image optimisation.
Tools: `pagespeed_analyzer`, `bottleneck_detector`, `optimization_recommender`,
`caching_strategist`, `cdn_optimizer`, `image_optimizer`.

**7. Linear Advisor** (`project-management`, linear-integration) — issue
management, project planning, workflow automation, release planning, sprint
management, resolution guidance. (Linear MCP available in this workspace.)
Tools: `linear_client`, `issue_manager`, `project_planner`, `sprint_organizer`,
`release_planner`, `workflow_automator`.

**8. Harvest Analytical** (`analytics`, time-tracking-analysis) — time-tracking
analysis, project profitability, productivity metrics, budget utilisation,
report generation, billing/insights. (Harvest MCP available in this workspace.)
Tools: `harvest_client`, `time_data_analyzer`, `profitability_calculator`,
`productivity_reporter`, `budget_tracker`, `insights_engine`.

**9. Zendesk Support** (`support`, customer-support) — ticket management,
customer communication, resolution guidance, knowledge-base/FAQ creation,
support metrics, workflow automation.
Tools: `zendesk_client`, `ticket_manager`, `response_generator`,
`kb_creator`, `sentiment_analyzer`, `escalation_router`.

**10. AI Readiness Estimator** (`assessment`, ai-readiness) — readiness
assessment, data-maturity analysis, infrastructure evaluation, team-capability
analysis, implementation roadmap, risk/ROI.
Tools: `readiness_assessor`, `data_quality_checker`, `infrastructure_evaluator`,
`capability_assessor`, `roadmap_generator`, `roi_calculator`.

## How to work this batch

Work **one agent at a time**, and verify each on disk before starting the next
(playbook §0 verification loop). Commit in logical groups (e.g. per agent or per
few agents) with `--no-verify` (playbook §3). This keeps context manageable and
prevents the stub failure mode from recurring silently.

For real MCP-backed agents (Linear #7, Harvest #8), inspect the live MCP tools
available in the workspace and reflect the actual tool surface in the configs.

## Success criteria (verified, not claimed)

- [ ] All 10 agents have the nine files, each meeting the playbook §0 floors;
      the per-agent `wc -l` verification output is pasted in the PR.
- [ ] Every `tools.json` / `skills.yaml` across all 10 agents parses.
- [ ] `npm run validate:agents` / `validate:json:all` / `validate:frontmatter` pass.
- [ ] All six playbook §2 CI blockers resolved on this branch; `npm ci --dry-run` clean.
- [ ] All 10 agent plugin packages exist (`plugins/lightspeed-{domain}-{focus}/` for each agent)
      with README.md (60+ lines), INSTALL.md (80+ lines), manifests; all JSON/YAML parses cleanly.
- [ ] `CHANGELOG.md` has an `### Added` entry covering the batch and linking all
      ten issues (#1088–#1093, #1096, #1099, #1100, #1103).
- [ ] PR body has the three required sections and lists all ten `Closes #…`
      references; `validate-pr-template` green.
- [ ] CI green (or only the acknowledged footers item, handled per playbook §2.5).
- [ ] Squash-merged to `develop`, branch deleted, all ten issues closed.

**Begin:** read the playbook, read `agents/woo-config-agent/`, then standardise
agent #1 (Design Partner), verify it on disk, and proceed down the table.
