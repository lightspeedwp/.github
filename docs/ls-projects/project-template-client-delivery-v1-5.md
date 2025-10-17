# **Client Delivery Project Template**
## *Scrumban + UAT*

***Version:*** 1.5 • ***Last updated:*** 17 Oct 2025  
---

[Quick Start for Client Delivery](#quick-start-for-client-delivery)  
[Project Cadence](#project-cadence)  
[Branching Strategy for Scrumban + UAT](#branching-strategy-for-scrumban-uat)  
[PR Discipline](#pr-discipline)  
[Project Template Overview](#project-template-overview)  
[Field Definitions](#field-definitions)  
[Views to Pin](#views-to-pin)  
[Automations](#automations)  
[Naming & Intake Hygiene](#naming--intake-hygiene)  
[Definition of Ready](#definition-of-ready-dor)  
[Definition of Done](#definition-of-done-dod)

---

# **Quick Start for Client Delivery** {#quick-start-for-client-delivery}
1) Create the Project → `Client – {ClientName}` (add one-liner scope + contract link).  
2) Add fields: **Status**, **Issue Type**, **Priority**, **Area**, **Theme**, **Size**, **Start Date**, **Deadline**, **Milestone**, **Environment**, **Parent Issue**, **Sub-issues Progress**, **Time (hours)**.  
3) Status columns: **Backlog → Todo → In progress → In review → In QA → Done**.  
4) Wire automations: intake to Backlog; PR opened → In review; `status:needs-qa` → In QA; closed/merged → Done.  
5) Pin core views: Board (Assignee), Backlog (Priority desc), QA Gate, UAT (Staging), Roadmap (Theme), Blocked, Epics (Tracking).

# **Project Template Overview** {#project-template-overview}
**Purpose:** Track client work intake → UAT → release with a lean Scrumban flow.  
**Status columns:** Backlog → Ready → In progress → In review → In QA → Done

**Project Fields**
- **Issue Type:** Epic, Story, Task, Bug, Chore, Design, Spike  
- **Priority:** P0, P1, P2, P3  
- **Area / Theme / Size / Dates / Milestone / Environment / Parent Issue / Sub-issues Progress / Time (hours)**

**Views to pin**
- Board (group Assignee, sort Priority), Backlog (Priority desc, Size asc)
- QA Gate (Status in *In review*, *In QA*; group by Environment)
- UAT (Staging + Status in *In review*, *In QA*)
- Roadmap (group Theme; bar Start → Deadline), Blocked, Epic drill-down

# **Automations** {#automations}
- Auto-add: **Status = Backlog**  
- Assignee set → **In progress**  
- PR opened (linked) → **In review**  
- Issue closed / PR merged → **Done**  
- Label `status:needs-qa` → **In QA**

# **Naming & Intake Hygiene** {#naming--intake-hygiene}
- Use consistent labels: `priority:*`, `status:*`, `area:*`  
- Name projects `Client – {ClientName}`; milestones `vX.Y.Z` (as relevant)  
- One Issue Type per item; always set Issue Type, Priority, Owner

# **Definition of Ready (DoR) — Checklist** {#definition-of-ready-dor}
- Problem & outcome defined; acceptance criteria (G/W/T)  
- Designs/references attached; dependencies clear  
- Estimates; test approach; stakeholders; environment noted

# **Definition of Done (DoD) — Checklist** {#definition-of-done-dod}
- Acceptance criteria met; tests updated; a11y pass  
- Docs/changelog updated; flags/rollout considered  
- QA verified on Staging; UAT sign-off (if applicable)  
- Release notes prepared
