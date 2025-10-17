# .github/PROJECT_META.client-delivery.md

## Quick Start
1) **Create Project** → Name `Client – {ClientName}`; Description with scope + contract link.
2) **Add fields**: Status (Backlog, **Todo**, In progress, In review, In QA, Done), Issue Type (Epic, Story, Task, Bug, Chore, Design, Research), Priority, Area, Theme, Size (number), Start Date, Deadline, Milestone, Environment, Parent Issue, Sub‑issues Progress, Time (hours). Optional: Iteration.
3) **Automations**: Auto‑add → Backlog; On Assignee → In progress; On linked PR → In review; On `status:needs-qa` → In QA; On close/merge → Done.
4) **Pin views**: Board — Team Flow (group by Assignee), Backlog — Table, **QA Gate**, **UAT (Client)**, Roadmap, Blocked, Epics (Tracking) — Table/Roadmap.
5) **Intake hygiene**: Create **Intake** view (`Status = Backlog` AND missing Assignee/Priority/Issue Type) and clear it weekly.

## Status
Backlog → **Todo** → In progress → In review → In QA → Done.

## Field guidance
- **Environment**: Prototype · Staging · Live (drives QA/UAT views).
- **Issue Type**: Use **Story** mainly during initial scoping; prefer **Task/Improvement** for ongoing delivery.
- **Parent Issue**: Link the Epic; track roll‑up via **Sub‑issues Progress**.

## Recommended Views
- **QA Gate** — filter `Status IN (In review, In QA)`; group by Environment.
- **UAT (Client)** — `Environment = Staging AND Status IN (In review, In QA)`.
- **Board — Team Flow** — daily stand‑ups; group by Assignee; sort by Priority.
- **Roadmap** — group by Theme (or Area); bars **Start Date → Deadline**.
- **Epics (Tracking)** — `Issue Type = Epic`; show Sub‑issues Progress.

## Cadence
Groom weekly · Stand‑up daily (focus on Blocked) · UAT weekly (e.g., Thu) · Release after UAT sign‑off.