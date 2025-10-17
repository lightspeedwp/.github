# Product Development — Views

**Date:** 13-10-2025 — **Version:** v1.1

> Opinionated saved views for GitHub Projects. Assumes these fields exist: **Status, Priority, Size, Severity, Environment, Issue Type, Phase, Theme, Area, Estimate (number), Start Date (date), Deadline (date), Milestone (iteration), Release type**.

---

## Summary table

| View name                   | Type    | Filter                                                                 | Group by       | Sort                           | Extras                    |
|-----------------------------|---------|------------------------------------------------------------------------|----------------|--------------------------------|---------------------------|
| Board (by Assignee)         | Board   | —                                                                      | Assignee       | Priority ↓                     | **Field sum:** Estimate   |
| Release Gate — vX.Y.Z       | Table   | `Milestone MATCHES ^v\d+\.\d+\.\d+$`                              | Issue Type     | Priority ↓, Size ↑             | **Field sum:** Estimate   |
| Backlog (Priority)          | Table   | `Status = Backlog`                                                     | —              | Priority ↓, Size ↑             | —                         |
| Hotfix Lane                 | Table   | `Release type = Hotfix OR Severity IN {S0, S1}`                      | —              | Severity ↓, Priority ↓         | —                         |
| QA Gate                     | Table   | `Status = In QA`                                                       | —              | Severity ↓, Priority ↓         | —                         |
| Epics — Tracking (Table)    | Table   | `Issue Type = Epic`                                                    | Milestone      | Priority ↓                     | —                         |
| Roadmap (Dates)             | Roadmap | —                                                                      | Theme          | —                              | Start = **Start Date** · Target = **Deadline** |
| Tech Debt                   | Table   | `label = tech-debt OR Issue Type = Refactor`                           | —              | Priority ↓                     | —                         |

> **Tip (Size ordering):** Use numeric prefixes in Size values (e.g., `1 – XS`, `2 – S`, … `6 – XXL`) so **Sort by Size ↑** follows the intended order.

## Recommended columns per view

Default columns: **Title, Assignee, Priority, Size, Severity, Environment, Release type, Estimate, Start Date, Deadline, Milestone, Theme, Area**.

- **Release Gate — vX.Y.Z:** Title, Assignee, Priority, Size, Release type, Estimate, Milestone
- **Hotfix Lane:** Title, Assignee, Severity, Priority, Environment, Release type
- **QA Gate:** Title, Assignee, Severity, Priority, Environment, Milestone
- **Epics — Tracking:** Title, Owner (Assignee), Priority, Milestone, Phase
- **Roadmap (Dates):** Title, Assignee, Priority, Theme, Milestone

## How to create

1) Open your Project → **Views** → **+ New view**.  
2) Choose **Table / Board / Roadmap**.  
3) Apply the **Filter**, **Group**, **Sort**, and **Columns** from the table above.  
4) Rename the view exactly as listed.  
5) For **Field sum**, click the column menu on **Estimate** → **Show sum**.

---

## Reference — Definition of Ready (DoR)

- [ ] Problem, rationale, and success metric stated  
- [ ] Acceptance criteria (Given/When/Then)  
- [ ] Design/spec attached (where needed)  
- [ ] Dependencies mapped; rollout/flags planned  
- [ ] Test approach and risk noted  
- [ ] Estimate added (Size and/or hours)  
- [ ] Milestone/Iteration assigned (vX.Y.Z in scope)  
- [ ] Fields set: Issue Type, Priority, Size, Theme, Area, Environment  

## Reference — Definition of Done (DoD)

- [ ] All acceptance criteria met  
- [ ] Tests added/updated; CI green  
- [ ] A11y, performance, and security checks  
- [ ] Docs and changelog updated  
- [ ] Version bump (where required)  
- [ ] QA pass on staging  
- [ ] Release notes drafted; monitors/alerts set  

---
