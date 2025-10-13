# Product development — Field specs

**Date:** 13-10-2025 — **Version:** v1.1

> Single-select tables use the format: **Fields | description | colour**.  
> Size uses numeric prefixes to guarantee sort order in GitHub “Sort by field” views.

## Theme

* **Field:** Theme
* **Purpose:** Strategic programme for product work.
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** Creation/triage
* **Who sets:** PM/Lead
* **Options & colours:** *(same set/colours as Client delivery; table repeated for clarity)*

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
* **Do:** Tie to roadmap pillar.
* **Don’t:** Duplicate **Area**.
* **Examples:** theme.json tokens → Design System
* **Related fields:** Area, Milestone

## Area

* **Field:** Area
* **Purpose:** Primary engineering lane owning the change.
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** Creation
* **Who sets:** PM/Tech Lead
* **Options & colours:**

| Fields            | description                 | colour  |
| ----------------- | --------------------------- | ------- |
| Frontend          | Blocks, UI, theme layer     | #BFD4F2 |
| Backend           | PHP, data, services         | #BFD4F2 |
| Build & CI        | Pipelines, tests, tooling   | #BFD4F2 |
| Deployment/DevOps | Infra, hosting, releases    | #006B75 |
| Design System     | Tokens/components work      | #C5DEF5 |
| Analytics         | GA4/GTM, dashboards         | #C2E0C6 |
| A11y              | Accessibility fixes/reviews | #DB61A2 |

* **Defaults:** None
* **Do:** Use Build & CI for pipelines/tests; DevOps for infra/release tooling.
* **Don’t:** Put Content here unless product truly owns it.
* **Examples:** Playwright flake fix → Build & CI
* **Related fields:** Theme

## Priority

* **Field:** Priority
* **Purpose:** Scheduling urgency in the train.
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** Creation; refine in planning
* **Who sets:** PM/Lead
* **Options & colours:**

| Fields | description                 | colour  |
| ------ | --------------------------- | ------- |
| High   | Must land this/next release | #D93F0B |
| Medium | Planned work                | #0052CC |
| Low    | Opportunistic/tech debt     | #C2E0C6 |

* **Defaults:** Medium
* **Do:** Let OKRs/release gates drive High.
* **Don’t:** Use as impact proxy for bugs.
* **Examples:** Security patch for release → High
* **Related fields:** Severity, Release type

## Severity

* **Field:** Severity
* **Purpose:** Impact for **Bugs** (hotfix vs train).
* **Type:** Single-select
* **Applies to:** Issues (Bug)
* **When to set:** Triage
* **Who sets:** Eng/QA; Lead confirms
* **Options & colours:**

| Fields        | description                    | colour  |
| ------------- | ------------------------------ | ------- |
| S0 – Blocker  | Outage/data loss/security      | #B60205 |
| S1 – Critical | Core flow broken/hotfix likely | #D93F0B |
| S2 – Major    | Common path degraded           | #FBCA04 |
| S3 – Minor    | Limited impact/workaround      | #BFD4F2 |
| S4 – Trivial  | Cosmetic/typo                  | #E1E4E8 |

* **Defaults:** None
* **Do:** S0/S1 may trigger **Hotfix**.
* **Don’t:** Auto-escalate Priority without context.
* **Examples:** Data loss bug → S0
* **Related fields:** Priority, Release type, Environment

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
* **Don’t:** Treat as a commitment; use **Milestone** for release gating.
* **Examples:** Block bindings refactor → L
* **Related fields:** Estimate, Priority

## Release type

* **Field:** Release type
* **Purpose:** Classify versioned releases (SemVer + hotfix lane).
* **Type:** Single-select
* **Applies to:** Both (esp. Epics)
* **When to set:** Planning/freeze
* **Who sets:** PM/Release Lead
* **Options & colours:**

| Fields | description                   | colour  |
| ------ | ----------------------------- | ------- |
| Major  | Breaking/large scope          | #D29922 |
| Minor  | Backwards-compatible features | #58A6FF |
| Patch  | Bugfix roll-ups               | #C2E0C6 |
| Hotfix | Out-of-band critical fix      | #F85149 |

* **Defaults:** Minor
* **Do:** Map tag/branch to type where possible.
* **Don’t:** Call internal refactors “Major” unless breaking.
* **Examples:** v2.1.3 rollup → Patch · Critical prod fix → Hotfix
* **Related fields:** Milestone, Theme

## Phase

* **Field:** Phase
* **Purpose:** Lightweight gate around the train (freeze/UAT/post).
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** Around release window
* **Who sets:** PM
* **Options & colours:**

| Fields      | description        | colour  |
| ----------- | ------------------ | ------- |
| Pre-launch  | Prep/freeze window | #C5DEF5 |
| Staging/UAT | RC validation      | #BFD4F2 |
| Launch      | Release tasks      | #0E8A16 |
| Post-launch | Follow-ups         | #C2E0C6 |
| Maintenance | BAU fixes          | #9198A1 |

* **Defaults:** Pre-launch
* **Do:** Flip to Staging/UAT during RC; Post-launch for follow-ups.
* **Don’t:** Replace **Status** with Phase.
* **Examples:** Release notes → Post-launch
* **Related fields:** Release type, Status

## Environment

* **Field:** Environment
* **Purpose:** Target runtime for validation.
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** On first PR
* **Who sets:** Engineer/QA
* **Options & colours:**

| Fields    | description   | colour  |
| --------- | ------------- | ------- |
| Prototype | Spike/sandbox | #E1E4E8 |
| Staging   | RC/UAT        | #BFD4F2 |
| Live      | Production    | #0E8A16 |

* **Defaults:** Prototype/Staging (per flow)
* **Do:** Keep current; Live only for prod changes.
* **Don’t:** Use as readiness proxy.
* **Examples:** RC smoke test → Staging
* **Related fields:** Phase

## Status

* **Field:** Status
* **Purpose:** Execution state (automation-friendly).
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** Auto + manual
* **Who sets:** Automation + team
* **Options & colours:**

| Fields      | description            | colour  |
| ----------- | ---------------------- | ------- |
| Backlog     | Not yet planned        | #BFD4F2 |
| Ready       | Groomed/ready to start | #0E8A16 |
| In progress | Being worked on        | #1D76DB |
| In review   | PR open/reviewing      | #BFD4F2 |
| In QA       | Testing/validation     | #FBCA04 |
| Done        | Complete/merged        | #E1E4E8 |

* **Defaults:** Backlog
* **Do:** Drive via PR/labels; keep lanes tidy.
* **Don’t:** Encode release gates here.
* **Examples:** PR merged → Done
* **Related fields:** Phase

## Issue Type

* **Field:** Issue Type
* **Purpose:** Nature of work for product engineering.
* **Type:** Single-select
* **Applies to:** Both
* **When to set:** Creation
* **Who sets:** Creator; PM confirms
* **Options & colours:**

| Fields   | description                | colour  |
| -------- | -------------------------- | ------- |
| Epic     | Cross-cutting body of work | #AB7DF8 |
| Feature  | Net-new capability         | #3FB950 |
| Story    | User-facing value slice    | #4393F8 |
| Task     | Execution work item        | #4393F8 |
| Bug      | Defect/incorrect behaviour | #9F3734 |
| Refactor | Internal restructure       | #9198A1 |
| Design   | UI/UX design output        | #AB7DF8 |
| Research | Investigation/spike        | #9198A1 |

* **Defaults:** Task
* **Do:** Use Feature for net-new; Refactor for internal.
* **Don’t:** File performance work as Feature—use Task + Theme *Performance*.
* **Examples:** Add Block Bindings variant → Feature
* **Related fields:** Theme, Severity

## Milestone

* **Field:** Milestone
* **Purpose:** Version anchor for the train.
* **Type:** Iteration
* **Applies to:** Both (Epics preferred)
* **When to set:** Planning
* **Who sets:** PM/Release Lead
* **Options & colours:** N/A
* **Defaults:** None
* **Do:** Use strict `vX.Y.Z`; maintain rolling future iterations.
* **Don’t:** Mix unrelated changes into the milestone.
* **Examples:** v2.1.0 epic & PRs → v2.1.0
* **Related fields:** Release type, Phase
* **Iteration schedule (example):**

| Iteration name  | Start (YYYY-MM-DD) | End (YYYY-MM-DD) | Notes                 |
| --------------- | ------------------ | ---------------- | --------------------- |
| v2.1.0          | 2025-11-03         | 2025-11-17       | 2‑week release window |
| v2.1.1 (patch)  | 2025-11-18         | 2025-11-22       | Patch window          |

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
* **Examples:** “Block Bindings feature” → 40
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
* **Examples:** v2.1.0 development → 2025-11-03
* **Related fields:** Deadline, Milestone

## Deadline

* **Field:** Deadline
* **Purpose:** Target completion date.
* **Type:** Date
* **Applies to:** Both
* **When to set:** When scheduled or at freeze
* **Who sets:** PM/Lead
* **Options & colours:** N/A
* **Defaults:** None
* **Do:** Use **YYYY-MM-DD**; protect with scope control; surface in views.
* **Don’t:** Treat as SLA for spikes.
* **Examples:** v2.1.0 tag → 2025-11-17
* **Related fields:** Start Date, Priority
