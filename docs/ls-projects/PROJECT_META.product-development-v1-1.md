# .github/PROJECT_META.product-development

**Date:** 13-10-2025 — **Version:** v1.1

## Quick Start

1) **Create Project** → Name `Product – {ProductName}`; Description with objective + README/roadmap link.
2) **Add fields**: Status (Backlog, **Ready**, In progress, In review, In QA, Done), Issue Type (Epic, Feature, Story, Task, Bug, Refactor, Design, Research, Chore), Priority, **Milestone/Release (vX.Y.Z)**, Area, Theme, **Size (single‑select)**, Start Date, Deadline, Environment, Parent Epic, Sub‑issues Progress, Time (hours). Optional: Iteration (Sprint).
3) **Automations**: Auto‑add → Backlog; On Assignee → In progress; On linked PR → In review; On `status:needs-qa` → In QA; On close/merge → Done.
4) **Release scaffolding**: Create Milestone `vX.Y.Z`; add scoped Features/Stories; pin **Release Gate — vX.Y.Z** view.
5) **Pin views**: Release Gate, Tech Debt, Roadmap, Backlog — Table, Epics — Table/Roadmap/Board, Epic drill‑down (group by Parent Epic).

## Status

Backlog → **Ready** → In progress → In review → In QA → Done.

## Field guidance

- **Milestone/Release**: Anchor the train (`vX.Y.Z`) and scope all items.
- **Iteration**: Optional two‑week cadence; sprint boards filter `iteration:@current`.
- **Issue Type**: Use **Feature** for net‑new capability; **Story** for demonstrable slices; **Refactor/Chore** for hygiene.

## Release cadence & PR discipline

- **Minors:** monthly target · **Patches:** as needed.
- **PR types:** Feature, Release, Hotfix. Keep PRs small; link a Project item; CI green before review; squash on merge unless history matters.

## Recommended Views

- **Release Gate — vX.Y.Z** — filter by Milestone; group by Issue Type.
- **Tech Debt** — `Issue Type IN (Refactor, Chore)` or `Area = Build & CI`.
- **Roadmap** — group by Milestone (or Iteration); bars **Start Date → Deadline**.
- **Backlog — Table** — `Status = Backlog`; sort Priority desc, Size asc.
- **Epics (Tracking)** — `Issue Type = Epic`; group by Milestone/Theme; show Sub‑issues Progress.
