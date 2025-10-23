# .github/ISSUE_TYPES.md

> **Note:** All type assignment for issues and PRs is handled by the unified [labeling agent](./agents/labeling.agent.md) and [labeling workflow](./workflows/labeling.yml). The canonical type mapping is maintained in [issue-types.yml](./issue-types.yml).

---

## Purpose

Defines the org-wide standard for **Issue Types** in LightSpeed projects.  
This guide is for choosing a type, understanding type automation, and aligning with org-wide labeling and reporting.

---

## Issue Types

- **Task** — Small, well-scoped unit of work (e.g., config update, copy edit).  
  *Label:* `type:task`
- **Bug** — Broken/incorrect behaviour (e.g., error, regression, failed test).  
  *Label:* `type:bug`
- **Feature** — Net-new capability or enhancement (e.g., new block, API).  
  *Label:* `type:feature`
- **Design** — Design artefacts/decisions (e.g., Figma, specs, a11y checks).  
  *Label:* `type:design`
- **Epic** — Parent issue grouping stories/tasks for a larger outcome.  
  *Label:* `type:epic`
- **Story** — User-centred vertical slice within an Epic.  
  *Label:* `type:story`
- **Improvement** — Enhance existing behaviour or UX.  
  *Label:* `type:improve`
- **Refactor** — Internal restructure for maintainability, no behaviour change.  
  *Label:* `type:refactor`
- **Build & CI** — Tooling, pipelines, packaging, releases, deploys.  
  *Label:* `type:chore` or `area:ci`
- **Automation** — Bots/actions/scripts that reduce toil.  
  *Label:* `type:automation` or `area:ci`
- **Test Coverage** — Add or expand tests (unit, integration, E2E).  
  *Label:* `type:test`
- **Performance** — Improve speed/efficiency.  
  *Label:* `type:performance`
- **A11y** — Accessibility to WCAG 2.1 AA.  
  *Label:* `type:a11y`
- **Security** — Security issues or improvements.  
  *Label:* `type:security`
- **Compatibility** — Browser/device/plugin compatibility.  
  *Label:* `type:compat`
- **Integration** — Integration with external systems/services.  
  *Label:* `type:integration`
- **Release** — Release management and deployment.  
  *Label:* `type:release`
- **Maintenance** — Routine maintenance, updates, or audits.  
  *Label:* `type:chore`
- **Documentation** — Docs, guides, onboarding, or knowledge base.  
  *Label:* `type:documentation`
- **Research** — Discovery, investigation, or technical spikes.  
  *Label:* `type:research`
- **Audit** — Security, code, or process audits.  
  *Label:* `type:audit`
- **Code Review** — Peer review, QA, or validation.  
  *Label:* `type:review`
- **AI Ops** — AI/automation operations, agents, or datasets.  
  *Label:* `type:ai-ops`
- **Content Modelling** — Content structure, CPTs, or taxonomy.  
  *Label:* `type:content-modelling`

See [issue-types.yml](./issue-types.yml) for the up-to-date, machine-readable mapping.

---

## Usage

- Pick **one** issue type per issue or PR.  
- The unified labeling agent will enforce and correct the type label as needed.
- Type assignment is based on config, heuristics, branch, and content analysis.

---

## References

- [issue-types.yml](./issue-types.yml)
- [labels.yml](./labels.yml)
- [labeling.agent.md](./agents/labeling.agent.md)
- [labeling.yml](./workflows/labeling.yml)
- [Labeling Strategy](../docs/LABEL_STRATEGY.md)
- [Automation Governance](./AUTOMATION_GOVERNANCE.md)

---

*Type assignment is fully automated and standardized by the unified agent and workflow. All changes are canonical and traceable.*