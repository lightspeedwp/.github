# Client Delivery — Views

**Date:** 13-10-2025 — **Version:** v1.1

> Opinionated saved views for GitHub Projects. Assumes these fields exist: **Status, Priority, Size, Severity, Environment, Issue Type, Phase, Theme, Area, Estimate (number), Start Date (date), Deadline (date), Milestone (iteration)**.

---

## Summary table

| View name                | Type    | Filter                                                                 | Group by       | Sort                           | Extras                    |
|--------------------------|---------|------------------------------------------------------------------------|----------------|--------------------------------|---------------------------|
| Board (by Assignee)      | Board   | —                                                                      | Assignee       | Priority ↓                     | **Field sum:** Estimate   |
| Backlog (Priority)       | Table   | `Status = Backlog`                                                     | —              | Priority ↓, Size ↑             | **Field sum:** Estimate   |
| QA Gate                  | Table   | `Status IN {In review, In QA}`                                       | Environment    | Severity ↓, Priority ↓         | —                         |
| UAT (Staging)            | Table   | `Environment = Staging AND Status IN {In review, In QA}`             | —              | Priority ↓                     | —                         |
| Epics — Tracking (Table) | Table   | `Issue Type = Epic`                                                    | Phase          | Priority ↓                     | —                         |
| Epics — Roadmap (Table)  | Table   | `Issue Type = Epic`                                                    | Theme          | Phase ↑, Priority ↓            | —                         |
| Epics — Board            | Board   | `Issue Type = Epic`                                                    | Status         | Priority ↓                     | —                         |
| Roadmap (Dates)          | Roadmap | —                                                                      | Theme          | —                              | Start = **Start Date** · Target = **Deadline** |
| Blocked                  | Table   | `label = blocked OR status note CONTAINS "blocked"`                    | —              | Priority ↓                     | —                         |

> **Tip (Size ordering):** Use numeric prefixes in Size values (e.g., `1 – XS`, `2 – S`, … `6 – XXL`) so **Sort by Size ↑** follows the intended order.

## Recommended columns per view

Use these columns unless noted: **Title, Assignee, Priority, Size, Severity, Environment, Estimate, Start Date, Deadline, Milestone, Theme, Area**.

- **Board (by Assignee):** Title, Priority, Size, Estimate, Milestone
- **Backlog (Priority):** Title, Assignee, Priority, Size, Estimate, Milestone
- **QA Gate:** Title, Assignee, Severity, Priority, Environment, Milestone
- **UAT (Staging):** Title, Assignee, Priority, Environment, Milestone
- **Epics — Tracking / Roadmap:** Title, Owner (Assignee), Priority, Phase, Milestone
- **Roadmap (Dates):** Title, Assignee, Priority, Theme, Milestone
- **Blocked:** Title, Assignee, Priority, Size, Note

## How to create

1) Open your Project → **Views** → **+ New view**.  
2) Choose **Table / Board / Roadmap**.  
3) Apply the **Filter**, **Group**, **Sort**, and **Columns** from the table above.  
4) Rename the view exactly as listed.  
5) For **Field sum**, click the column menu on **Estimate** → **Show sum**.

---

## Reference — Definition of Ready (DoR)

- [ ] Problem statement and outcome defined  
- [ ] Acceptance criteria written (Given/When/Then)  
- [ ] Designs or references attached (if relevant)  
- [ ] Dependencies identified and unblocked  
- [ ] Estimates agreed (Size and/or hours)  
- [ ] Test approach noted (how we’ll verify)  
- [ ] Stakeholders and approver listed  
- [ ] Environment clarified (Prototype/Staging/Live)  

## Reference — Definition of Done (DoD)

- [ ] Acceptance criteria met  
- [ ] Unit/functional tests added or updated  
- [ ] A11y pass (key flows and components)  
- [ ] Docs updated (README/Changelog/Client notes)  
- [ ] Feature toggles/rollout considered  
- [ ] QA verified on Staging  
- [ ] UAT approved by client (if applicable)  
- [ ] Release notes prepared; monitoring in place  

---
