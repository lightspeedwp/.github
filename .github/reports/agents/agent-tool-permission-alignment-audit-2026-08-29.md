---
title: "Agent Tool & Permission Alignment Audit"
description: "Phase 1 audit of all agents/*.agent.md files to inventory tool declarations and permissions, identify non-compliant agents, and document remediation priorities."
file_type: "report"
category: "agents"
created_date: "2026-08-29"
version: "v1.0"
authors:
  - "@copilot"
owners:
  - lightspeedwp/maintainers
tags:
  - audit
  - agents
  - tool-permissions
  - alignment
  - phase-1
status: "complete"
related_issue: "lightspeedwp/.github#1739"
parent_epic: "lightspeedwp/.github#1738"
---

# Agent Tool & Permission Alignment Audit

**Phase 1 — Audit Existing Agent Specs**
Issue: [#1739](https://github.com/lightspeedwp/.github/issues/1739) · Epic: [#1738](https://github.com/lightspeedwp/.github/issues/1738)

---

## Executive Summary

- **Total agents audited:** 40
- **Agents with `tools` declared:** 18 (45 %)
- **Agents with `permissions` declared:** 34 (85 %)
- **Agents missing both fields:** 1
- **Agents with tools but no permissions:** 5
- **Agents with permissions but no tools:** 21 (largest non-compliant group)
- **Three dominant tool patterns identified** (see §3)
- **Non-compliant agents requiring remediation:** 39

---

## 1. Inventory — All `agents/*.agent.md` Files

| File | Name | Version | Status | Has `tools` | Has `permissions` |
|---|---|---|---|---|---|
| `adr.agent.md` | ADR Generator | v1.0 | active | ❌ | ✅ |
| `ai-readiness-estimator.agent.md` | AI Readiness Estimator | v1.0 | active | ❌ | ✅ |
| `changelog.agent.md` | Changelog Agent | v1.0.0 | active | ❌ | ✅ |
| `chat-closure.agent.md` | Chat Closure Agent | v1.0.1 | active | ❌ | ✅ |
| `client-website-discovery-assistant.agent.md` | AGENT | — | active | ❌ | ❌ |
| `client-website-discovery.agent.md` | Client Website Discovery Assistant | v1.0.1 | active | ❌ | ✅ |
| `design-partner.agent.md` | Design Partner Agent | v1.0.1 | active | ❌ | ✅ |
| `harvest-analytical.agent.md` | Harvest Analytical Agent | v1.0.1 | active | ❌ | ✅ |
| `issues.agent.md` | Issues | v2.1 | active | ✅ (31) | ✅ |
| `labeling.agent.md` | Labeling | v2.0 | active | ✅ (31) | ✅ |
| `linear-advisor.agent.md` | Linear Advisor Agent | v1.0.1 | active | ❌ | ✅ |
| `linting.agent.md` | Linting | v0.1.0 | active | ✅ (31) | ✅ |
| `meta.agent.md` | Meta | v1.1 | active | ✅ (31) | ✅ |
| `metadata.agent.md` | Metadata Agent | v2.0.0 | active | ❌ | ✅ |
| `metrics.agent.md` | Metrics | v1.0 | active | ✅ (31) | ✅ |
| `mode-demonstrate-understanding.agent.md` | Demonstrate Understanding | v1.0 | active | ✅ (6) | ❌ |
| `mode-document-reviewer.agent.md` | Technical Content Evaluator | v1.0 | active | ✅ (8) | ❌ |
| `mode-prd.agent.md` | Product Requirements Document Generator | v1.0 | active | ✅ (11) | ❌ |
| `mode-thinking.agent.md` | Thinking Mode | v2.0 | active | ✅ (6) | ✅ |
| `pagespeed.agent.md` | PageSpeed Agent | v1.0.1 | active | ❌ | ✅ |
| `pr-creation.agent.md` | PR Creation Agent | v1.0.0 | active | ❌ | ✅ |
| `prd-factory-planner.agent.md` | PRD Factory & Planner Agent | v2.0.1 | active | ❌ | ✅ |
| `prd.agent.md` | PRD Agent | v2.0.1 | active | ❌ | ✅ |
| `project-meta-sync.agent.md` | Project Meta Sync | v1.0 | active | ✅ (31) | ✅ |
| `prompt-engineer.agent.md` | Prompt Engineer | v2.0 | active | ✅ (31) | ✅ |
| `proposal-desk.agent.md` | Proposal Desk Agent | v1.0.1 | active | ❌ | ✅ |
| `release.agent.md` | Release Manager | v2.2 | active | ✅ (31) | ✅ |
| `reporting.agent.md` | Reporting | v1.1 | active | ✅ (31) | ✅ |
| `reviewer.agent.md` | Reviewer | v1.0 | active | ✅ (31) | ✅ |
| `task-planner.agent.md` | Planner | v3.0 | active | ✅ (31) | ✅ |
| `task-researcher.agent.md` | Task Researcher Agent | v1.0 | active | ✅ (3) | ❌ |
| `template.agent.md` | Template | v1.1 | draft | ✅ (1) | ❌ |
| `testing.agent.md` | Testing | v0.1.0 | active | ✅ (31) | ✅ |
| `tour-operator-config.agent.md` | Tour Operator Config Agent | v2.0.1 | active | ❌ | ✅ |
| `website-content-strategist.agent.md` | Website Content Strategist | v1.0.1 | active | ❌ | ✅ |
| `website-scope-estimator.agent.md` | Website Scope Estimator | v1.0.1 | active | ❌ | ✅ |
| `woo-config.agent.md` | WooCommerce Config Agent | v2.0.1 | active | ❌ | ✅ |
| `wordpress.agent.md` | WordPress Release Utilities | v1.0 | active | ❌ | ✅ |
| `wp-config.agent.md` | WordPress Config Agent | v2.0.1 | active | ❌ | ✅ |
| `zendesk-support.agent.md` | Zendesk Support Agent | v1.0.1 | active | ❌ | ✅ |

---

## 2. Current Tool & Permission Patterns

### 2.1 `tools` field patterns

Three distinct patterns exist across the 40 agents:

#### Pattern A — Generic 31-tool boilerplate (12 agents)

These agents declare an identical 31-item list that appears to be copy-pasted from an early scaffold. The tools are largely abstract internal helpers (`file_system`, `markdown_generator`, `input_collector`, etc.) with a broad `github/*` wildcard at the end. They do not reflect the agent's actual operational surface.

**Agents:** `issues`, `labeling`, `linting`, `meta`, `metrics`, `project-meta-sync`, `prompt-engineer`, `release`, `reporting`, `reviewer`, `task-planner`, `testing`

**Example (truncated):**

```yaml
tools:
  - file_system
  - markdown_generator
  - input_collector
  # … 28 more generic helpers …
  - github/*
  - read
  - search
  - edit
```

**Issues:**
- Wildcard `github/*` grants excessive GitHub API access.
- Abstract helper names (`quality_checker`, `consequence_analyzer`) are not real Copilot tool identifiers.
- No differentiation between read-only and mutating tools.
- Does not reflect each agent's true capability boundary.

---

#### Pattern B — Mode-style targeted tools (5 agents)

These agents declare a small, concrete list of real Copilot tool identifiers scoped to the agent's task.

**Agents:** `mode-thinking`, `mode-demonstrate-understanding`, `mode-document-reviewer`, `mode-prd`, `task-researcher`

**Example (`mode-thinking`):**

```yaml
tools:
  - codebase
  - fetch
  - search
  - edit
  - bash
  - webSearch
```

**Compliance:** Best practice — minimal, purpose-scoped, real tool names. Missing `permissions` on 4 of the 5 agents.

---

#### Pattern C — No `tools` field declared (22 agents)

These agents have no `tools` key at all in their frontmatter. Some have detailed `permissions` lists and rich body content, but the tooling section is absent entirely.

**Agents:** `adr`, `ai-readiness-estimator`, `changelog`, `chat-closure`, `client-website-discovery-assistant`, `client-website-discovery`, `design-partner`, `harvest-analytical`, `linear-advisor`, `metadata`, `pagespeed`, `pr-creation`, `prd-factory-planner`, `prd`, `proposal-desk`, `tour-operator-config`, `website-content-strategist`, `website-scope-estimator`, `woo-config`, `wordpress`, `wp-config`, `zendesk-support`

Additionally, `template.agent.md` only declares `tools: - Copilot Agents` — a placeholder, not a functional tool list.

---

### 2.2 `permissions` field patterns

#### Pattern X — Specific scoped permissions (majority)

Most agents list 3–9 domain-specific permissions such as `github:repo`, `github:issues`, `filesystem`, `harvest-api`, `figma-integration`. These vary in granularity but are broadly aligned with each agent's purpose.

**Example (`linting.agent.md`):**

```yaml
permissions:
  - read
  - write
  - filesystem
  - github:repo
  - github:actions
  - github:workflows
  - shell
```

#### Pattern Y — Minimal generic permissions (subset)

Several agents only declare `read`, `write`, and one domain permission, with no specific scope.

**Example (`adr.agent.md`):**

```yaml
permissions:
  - read
  - write
  - filesystem
```

#### Pattern Z — No `permissions` field (6 agents)

**Agents:** `client-website-discovery-assistant`, `mode-demonstrate-understanding`, `mode-document-reviewer`, `mode-prd`, `task-researcher`, `template`

---

### 2.3 Unique permission values in use

The following 36 unique permission strings were found across all agents:

`analysis`, `billing`, `configuration`, `content-strategy`, `design-review`, `ecommerce`, `ecommerce-configuration`, `estimation`, `figma-integration`, `filesystem`, `git`, `github`, `github:actions`, `github:checks`, `github:issues`, `github:pulls`, `github:repo`, `github:workflows`, `harvest-api`, `linear-api`, `network`, `performance-monitoring`, `prd-generation`, `prd-management`, `project-management`, `project-planning`, `proposal-generation`, `read`, `shell`, `support-management`, `validation`, `web-scanning`, `wordpress-configuration`, `wordpress-management`, `write`, `zendesk-integration`

**Observation:** No canonical schema or approved list of permission values has been enforced. Names are free-form and inconsistent (`github` vs `github:repo`, `filesystem` vs `file_system`).

---

## 3. Non-Compliant Agents

An agent is considered **non-compliant** if it meets any of the following criteria:

| Criterion | Description |
|---|---|
| **C1** | Missing `tools` field entirely |
| **C2** | Missing `permissions` field entirely |
| **C3** | Uses the 31-item generic boilerplate tool list (Pattern A) |
| **C4** | Uses `github/*` wildcard (overly broad) |
| **C5** | Abstract/fictional tool names that are not real Copilot tool identifiers |

### Non-compliant agents by criterion:

| Agent | C1 | C2 | C3 | C4 | C5 |
|---|---|---|---|---|---|
| `adr.agent.md` | ❌ | | | | |
| `ai-readiness-estimator.agent.md` | ❌ | | | | |
| `changelog.agent.md` | ❌ | | | | |
| `chat-closure.agent.md` | ❌ | | | | |
| `client-website-discovery-assistant.agent.md` | ❌ | ❌ | | | |
| `client-website-discovery.agent.md` | ❌ | | | | |
| `design-partner.agent.md` | ❌ | | | | |
| `harvest-analytical.agent.md` | ❌ | | | | |
| `issues.agent.md` | | | ❌ | ❌ | ❌ |
| `labeling.agent.md` | | | ❌ | ❌ | ❌ |
| `linear-advisor.agent.md` | ❌ | | | | |
| `linting.agent.md` | | | ❌ | ❌ | ❌ |
| `meta.agent.md` | | | ❌ | ❌ | ❌ |
| `metadata.agent.md` | ❌ | | | | |
| `metrics.agent.md` | | | ❌ | ❌ | ❌ |
| `mode-demonstrate-understanding.agent.md` | | ❌ | | | |
| `mode-document-reviewer.agent.md` | | ❌ | | | |
| `mode-prd.agent.md` | | ❌ | | | |
| `pagespeed.agent.md` | ❌ | | | | |
| `pr-creation.agent.md` | ❌ | | | | |
| `prd-factory-planner.agent.md` | ❌ | | | | |
| `prd.agent.md` | ❌ | | | | |
| `project-meta-sync.agent.md` | | | ❌ | ❌ | ❌ |
| `prompt-engineer.agent.md` | | | ❌ | ❌ | ❌ |
| `proposal-desk.agent.md` | ❌ | | | | |
| `release.agent.md` | | | ❌ | ❌ | ❌ |
| `reporting.agent.md` | | | ❌ | ❌ | ❌ |
| `reviewer.agent.md` | | | ❌ | ❌ | ❌ |
| `task-planner.agent.md` | | | ❌ | ❌ | ❌ |
| `task-researcher.agent.md` | | ❌ | | | |
| `template.agent.md` | | ❌ | | | |
| `testing.agent.md` | | | ❌ | ❌ | ❌ |
| `tour-operator-config.agent.md` | ❌ | | | | |
| `website-content-strategist.agent.md` | ❌ | | | | |
| `website-scope-estimator.agent.md` | ❌ | | | | |
| `woo-config.agent.md` | ❌ | | | | |
| `wordpress.agent.md` | ❌ | | | | |
| `wp-config.agent.md` | ❌ | | | | |
| `zendesk-support.agent.md` | ❌ | | | | |

**Compliant agents (Pattern B, both fields present, no boilerplate):** `mode-thinking` only.

---

## 4. Remediation List

### Priority 1 — High: Remove `github/*` wildcard & boilerplate tools (12 agents)

These agents have the riskiest configuration: a wildcard GitHub permission paired with 31 abstract tool names. Each must be replaced with a minimal, role-specific tool list.

| Agent | Suggested Tool Scope |
|---|---|
| `issues.agent.md` | `issue_read`, `issue_write`, `search_issues`, `add_issue_comment`, `read`, `edit` |
| `labeling.agent.md` | `issue_read`, `issue_write`, `search_issues`, `label_read`, `label_write` |
| `linting.agent.md` | `bash`, `read`, `edit`, `shell` |
| `meta.agent.md` | `read`, `edit`, `filesystem` |
| `metrics.agent.md` | `read`, `search`, `fetch`, `githubRepo` |
| `project-meta-sync.agent.md` | `issue_read`, `issue_write`, `githubRepo`, `read` |
| `prompt-engineer.agent.md` | `read`, `edit`, `search` |
| `release.agent.md` | `read`, `edit`, `bash`, `githubRepo`, `shell` |
| `reporting.agent.md` | `read`, `edit`, `filesystem` |
| `reviewer.agent.md` | `read`, `search`, `githubRepo` |
| `task-planner.agent.md` | `read`, `search`, `edit`, `githubRepo` |
| `testing.agent.md` | `bash`, `read`, `edit`, `shell` |

---

### Priority 2 — Medium: Add missing `tools` field (22 agents)

These agents declare permissions but omit tools entirely. Each needs a `tools` list added that reflects its actual operational surface.

`adr`, `ai-readiness-estimator`, `changelog`, `chat-closure`, `client-website-discovery-assistant`, `client-website-discovery`, `design-partner`, `harvest-analytical`, `linear-advisor`, `metadata`, `pagespeed`, `pr-creation`, `prd-factory-planner`, `prd`, `proposal-desk`, `tour-operator-config`, `website-content-strategist`, `website-scope-estimator`, `woo-config`, `wordpress`, `wp-config`, `zendesk-support`

---

### Priority 3 — Medium: Add missing `permissions` field (6 agents)

`client-website-discovery-assistant`, `mode-demonstrate-understanding`, `mode-document-reviewer`, `mode-prd`, `task-researcher`, `template`

---

### Priority 4 — Low: Standardise permission vocabulary

Define a canonical approved list of permission tokens. Current usage mixes free-form strings (`harvest-api`, `figma-integration`) with structured scopes (`github:repo`, `github:issues`). A schema or enum should be agreed upon before Phase 2.

Suggested canonical tokens:

```
read  write  filesystem  git  shell  network
github:repo  github:issues  github:pulls  github:actions
github:workflows  github:checks
external:{service-name}  (e.g. external:harvest, external:linear, external:figma)
```

---

## 5. Pattern Analysis

### 5.1 Root cause of boilerplate proliferation

The 31-item generic tool list originated in the early scaffold for "agentic" agents (labeling, metrics, release, etc.). It was copy-pasted across all agents in that family without being tailored to each agent's role. The list contains fictional internal abstractions, not real Copilot-recognised tool names.

### 5.2 Mode agents are the closest to compliant

The `mode-*` agents (`mode-thinking`, `mode-demonstrate-understanding`, `mode-document-reviewer`, `mode-prd`) and `task-researcher` demonstrate the intended pattern: a small number of real, named Copilot tools (`codebase`, `fetch`, `search`, `edit`, `bash`). The gap is that `mode-thinking` is the only one that also declares `permissions`.

### 5.3 Permissions vocabulary is not standardised

36 unique permission strings exist with no canonical source of truth. Some use colon-scoped notation (`github:repo`), some use hyphenated API names (`harvest-api`), and some use vague nouns (`analysis`, `estimation`). Phase 2 should establish a schema.

### 5.4 `template.agent.md` does not model best practice

The template spec — which all new agents should derive from — itself lacks a `permissions` field and uses `tools: - Copilot Agents` as a placeholder rather than showing correct structure. This should be updated as part of remediation.

---

## 6. Summary Statistics

| Metric | Count |
|---|---|
| Total agents audited | 40 |
| Fully compliant (tools + permissions, no boilerplate) | 1 |
| Missing `tools` | 22 |
| Missing `permissions` | 6 |
| Missing both | 1 |
| Using 31-item boilerplate (C3) | 12 |
| Using `github/*` wildcard (C4) | 12 |
| Using abstract/fictional tool names (C5) | 12 |
| Non-compliant (any criterion) | 39 |
| Total unique permission tokens | 36 |
| Total unique non-boilerplate tool names | 18 |

---

## 7. Recommendations for Phase 2

1. **Define a canonical tools vocabulary** — align on the real Copilot tool identifiers and publish them in `template.agent.md` and a companion schema.
2. **Define a canonical permissions schema** — formalise the approved permission tokens and document them in an instruction file.
3. **Update `template.agent.md`** — ensure the template demonstrates correct `tools` and `permissions` blocks so future agents inherit the right pattern.
4. **Remediate Priority 1 agents first** — the 12 Pattern A agents carry the most risk due to `github/*` wildcards.
5. **Automate compliance checking** — add a lint rule or CI step that validates `tools` and `permissions` are present and do not contain `github/*` or the known boilerplate list.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
