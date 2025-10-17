# Client delivery — Field specs

**Date:** 13-10-2025 — **Version:** v1.1

> Single-select tables use the format: **Fields | description | colour**.  
> Size uses numeric prefixes to guarantee sort order in GitHub “Sort by field” views.

---

## Theme

* **Field:** Theme
* **Purpose:** Strategic lens explaining *why/what programme* the work supports.
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** Creation or triage
* **Who sets:** PM/Lead
* **Options & colours:**

| Fields                      | description                   | colour  |
| --------------------------- | ----------------------------- | ------- |
| Design System               | Tokens, components, patterns  | #AB7DF8 |
| Content Management          | Modelling, imports, migration | #C5DEF5 |
| Commerce (WooCommerce)      | Storefront, checkout, orders  | #D4C5F9 |
| Editorial UX (Authoring)    | Writing flows, editor UI      | #4393F8 |
| Performance                 | CWV, speed, scalability       | #D29922 |
| Accessibility (A11y)        | WCAG, semantics               | #DB61A2 |
| Security & Privacy          | Hardening, policies           | #9F3734 |
| Integrations & APIs         | Third-party, webhooks         | #8D4821 |
| Internationalisation (i18n) | Locales, formats              | #C5DEF5 |
| Analytics & Measurement     | Tracking, reporting           | #C2E0C6 |
| SEO                         | Technical SEO                 | #C2E0C6 |
| Release & Deployment        | Rollouts, flags, rollback     | #006B75 |

* **Defaults:** None
* **Do:** Pick one; change only if the *why* changes; use *Release & Deployment* for rollout work.
* **Don’t:** Duplicate **Area**; set multiple themes.
* **Examples:** Wetu import mapping → Content Management · Web vitals fixes → Performance
* **Related fields:** Area, Milestone, Phase

## Area

* **Field:** Area
* **Purpose:** Who/where primarily executes the work.
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** Creation
* **Who sets:** PM/Lead
* **Options & colours:**

| Fields            | description                 | colour  |
| ----------------- | --------------------------- | ------- |
| Frontend          | Blocks, UI, theme layer     | #BFD4F2 |
| Backend           | PHP, data, services         | #BFD4F2 |
| Build & CI        | Pipelines, tests, tooling   | #BFD4F2 |
| Deployment/DevOps | Infra, hosting, releases    | #006B75 |
| Design System     | Tokens/components work      | #C5DEF5 |
| Content           | Modelling, copy, imports    | #C5DEF5 |
| Analytics         | GA4/GTM, dashboards         | #C2E0C6 |
| A11y              | Accessibility fixes/reviews | #DB61A2 |

* **Defaults:** None
* **Do:** Choose the executing lane; split if two teams truly own parts.
* **Don’t:** Encode outcomes—use **Theme** for that.
* **Examples:** CloudFront config → Deployment/DevOps · Copy migration → Content
* **Related fields:** Theme, Assignee

## Priority

* **Field:** Priority
* **Purpose:** Scheduling urgency for all issues.
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** Creation; refine in grooming
* **Who sets:** PM/Lead
* **Options & colours:**

| Fields | description                     | colour  |
| ------ | ------------------------------- | ------- |
| High   | Deadline/regulatory/live impact | #D93F0B |
| Medium | Planned/standard work           | #0052CC |
| Low    | Nice-to-have/backlog            | #C2E0C6 |

* **Defaults:** Medium
* **Do:** Use **High** for firm deadlines/live impact; otherwise start **Medium**.
* **Don’t:** Encode bug impact here (that’s **Severity**).
* **Examples:** Legal notice by Friday → High · Copy tidy → Low
* **Related fields:** Severity, Phase

## Severity

* **Field:** Severity
* **Purpose:** Impact level for **Bugs** only.
* **Type:** Single-select
* **Applies to:** Issues (Bug)
* **When to set:** Bug creation/triage
* **Who sets:** QA/Engineer; confirmed by Lead
* **Options & colours:**

| Fields        | description                    | colour  |
| ------------- | ------------------------------ | ------- |
| S0 – Blocker  | Outage/data loss/security      | #B60205 |
| S1 – Critical | Core flow broken/hotfix likely | #D93F0B |
| S2 – Major    | Common path degraded           | #FBCA04 |
| S3 – Minor    | Limited impact/workaround      | #BFD4F2 |
| S4 – Trivial  | Cosmetic/typo                  | #E1E4E8 |

* **Defaults:** None
* **Do:** Keep independent from **Priority**; escalate only with context.
* **Don’t:** Set on non-Bugs.
* **Examples:** Checkout down → S0 · Typo on About → S4
* **Related fields:** Priority, Environment

## Size

* **Field:** Size
* **Purpose:** Coarse effort bucket to aid sorting and capacity planning.
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** Creation/triage (update after discovery if needed)
* **Who sets:** Lead/Engineer
* **Options & colours:** *(numeric prefixes enforce sort order)*

| Fields       | description               | colour  |
| ------------ | ------------------------- | ------- |
| 0 – Unknown  | Not yet sized             | #E1E4E8 |
| 1 – XS       | Trivial (≤2h)             | #BFD4F2 |
| 2 – S        | Small (≤0.5d)             | #C5DEF5 |
| 3 – M        | Medium (1–2d)             | #58A6FF |
| 4 – L        | Large (2–3d)              | #4393F8 |
| 5 – XL       | Very large (≈1 week)      | #D4C5F9 |
| 6 – XXL      | Huge (≈1–2 weeks)         | #AB7DF8 |

* **Defaults:** 0 – Unknown
* **Do:** Keep rough; refine as understanding improves; combine with **Estimate** for budgeting.
* **Don’t:** Treat as a commitment; use **Deadline**/**Milestone** for dates.
* **Examples:** Favicon tidy → XS · Theme PHP upgrade → L
* **Related fields:** Estimate, Priority

## Phase

* **Field:** Phase
* **Purpose:** Communicate pre/post-launch flow.
* **Type:** Single-select
* **Applies to:** Both (esp. Epics)
* **When to set:** Triage; update across release window
* **Who sets:** PM
* **Options & colours:**

| Fields      | description        | colour  |
| ----------- | ------------------ | ------- |
| Pre-launch  | Prep/build-up      | #C5DEF5 |
| Staging/UAT | Client testing     | #BFD4F2 |
| Launch      | Go-live activities | #0E8A16 |
| Post-launch | Follow-ups, polish | #C2E0C6 |
| Maintenance | Warranty/BAU fixes | #9198A1 |

* **Defaults:** Pre-launch
* **Do:** Move to Staging/UAT during test; use Maintenance for warranty.
* **Don’t:** Replace **Status** with Phase.
* **Examples:** UAT fixes → Staging/UAT · Warranty bug → Maintenance
* **Related fields:** Milestone, Environment, Status

## Release type

* **Field:** Release type
* **Purpose:** Optionally classify client drops.
* **Type:** Single-select
* **Applies to:** Epics/Issues tied to a drop
* **When to set:** Cut planning
* **Who sets:** PM/Lead
* **Options & colours:**

| Fields | description            | colour  |
| ------ | ---------------------- | ------- |
| Major  | Large scope/breaking   | #D29922 |
| Minor  | Enhancements           | #58A6FF |
| Patch  | Small fixes            | #C2E0C6 |
| Hotfix | Urgent live correction | #F85149 |

* **Defaults:** None
* **Do:** Use Hotfix for out-of-band live fixes.
* **Don’t:** Force SemVer on content-only phases.
* **Examples:** Post-launch sweep → Patch · Analytics tag fix → Hotfix
* **Related fields:** Milestone, Phase

## Environment

* **Field:** Environment
* **Purpose:** Where the change is targeted/tested.
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** Creation or first PR
* **Who sets:** Engineer/QA
* **Options & colours:**

| Fields    | description     | colour  |
| --------- | --------------- | ------- |
| Prototype | Spike/sandboxes | #E1E4E8 |
| Staging   | QA/UAT          | #BFD4F2 |
| Live      | Production      | #0E8A16 |

* **Defaults:** Staging
* **Do:** Keep updated as work moves.
* **Don’t:** Use as proxy for severity.
* **Examples:** Dry-run import → Prototype · Go-live checklist → Live
* **Related fields:** Phase, Severity

## Status

* **Field:** Status
* **Purpose:** Workflow state for execution.
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** Auto + manual
* **Who sets:** Automation + team
* **Options & colours:**

| Fields      | description        | colour  |
| ----------- | ------------------ | ------- |
| Backlog     | Not yet planned    | #BFD4F2 |
| To-do       | Ready to start     | #0E8A16 |
| In progress | Being worked on    | #1D76DB |
| In review   | PR open/reviewing  | #BFD4F2 |
| In QA       | Testing/validation | #FBCA04 |
| Done        | Complete/merged    | #E1E4E8 |

* **Defaults:** Backlog
* **Do:** Let PR/labels move it; override only if needed.
* **Don’t:** Encode phase gates here.
* **Examples:** PR opened → In review · `status:needs-qa` → In QA
* **Related fields:** Phase, Environment

## Issue Type

* **Field:** Issue Type
* **Purpose:** Nature of the work item.
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** Creation
* **Who sets:** Creator; confirmed by PM
* **Options & colours:**

| Fields   | description                | colour  |
| -------- | -------------------------- | ------- |
| Epic     | Cross-cutting body of work | #AB7DF8 |
| Story    | User-facing value slice    | #4393F8 |
| Task     | Execution work item        | #4393F8 |
| Bug      | Defect/incorrect behaviour | #9F3734 |
| Chore    | Ops/cleanup                | #9198A1 |
| Design   | UI/UX design output        | #AB7DF8 |
| Research | Investigation/spike        | #9198A1 |

* **Defaults:** Task
* **Do:** Use Story for user-facing value; Chore for non-user ops.
* **Don’t:** Mislabel Bugs as Chores.
* **Examples:** Copy QA batch → Task · Favicon tidy → Chore
* **Related fields:** Severity, Priority

## Milestone

* **Field:** Milestone
* **Purpose:** Group scope to a delivery window/outcome.
* **Type:** Iteration
* **Applies to:** Both (Epics preferred)
* **When to set:** Planning
* **Who sets:** PM
* **Options & colours:** N/A
* **Defaults:** None
* **Do:** Name outcomes (e.g., UAT-1, Go-Live) or release tags; maintain rolling future iterations.
* **Don’t:** Over-granulate or backdate without note.
* **Examples:** Go-Live checklist → “Go-Live” iteration
* **Related fields:** Phase, Release type
* **Iteration schedule (example):**

| Iteration name      | Start (YYYY-MM-DD) | End (YYYY-MM-DD) | Notes            |
| ------------------- | ------------------ | ---------------- | ---------------- |
| UAT-1               | 2025-10-20         | 2025-10-31       | 2‑week UAT cycle |
| Go-Live             | 2025-11-03         | 2025-11-07       | Launch window    |

## Estimate

* **Field:** Estimate
* **Purpose:** Numeric estimate for planning (hours).
* **Type:** Number
* **Applies to:** Both
* **When to set:** Creation/triage; updated in refinement
* **Who sets:** Engineer/Lead
* **Options & colours:** N/A
* **Defaults:** None
* **Do:** Use whole hours; show **Field sum** in board/table groups.
* **Don’t:** Mix hours and points in the same project.
* **Examples:** “Homepage copy tidy” → 2; “Theme PHP upgrade” → 16
* **Related fields:** Size, Deadline

## Start Date

* **Field:** Start Date
* **Purpose:** When work is expected to begin (roadmap).
* **Type:** Date
* **Applies to:** Both
* **When to set:** When scheduled
* **Who sets:** PM/Lead
* **Options & colours:** N/A
* **Defaults:** None
* **Do:** Use **YYYY-MM-DD**; use roadmap layout with **Start/Deadline** as axes.
* **Don’t:** Backfill without comment.
* **Examples:** UAT hardening → 2025-10-22
* **Related fields:** Deadline, Milestone

## Deadline

* **Field:** Deadline
* **Purpose:** Target completion date.
* **Type:** Date
* **Applies to:** Both
* **When to set:** When scheduled or at cut planning
* **Who sets:** PM/Lead
* **Options & colours:** N/A
* **Defaults:** None
* **Do:** Use **YYYY-MM-DD**; protect with scope control; surface in views.
* **Don’t:** Treat as SLA for research spikes.
* **Examples:** Legal page update → 2025-11-01
* **Related fields:** Start Date, Priority

---
