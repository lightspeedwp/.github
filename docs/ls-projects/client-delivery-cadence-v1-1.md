# Client Delivery — Cadence

**Date:** 13-10-2025 — **Version:** v1.1

> Lean Scrumban rhythm tuned for agency delivery. Uses the saved **Views** and **Automations** docs.

## Purpose

Keep client work flowing from intake → UAT → release with clear checkpoints, predictable ceremonies, and fast feedback on risk (blocked, live bugs, date slippage).

## Weekly rhythm (Mon–Fri)

- **Mon — Intake & Plan (45–60m)**
  - View: **Backlog (Priority)**; clear **Intake** subset (missing Assignee/Priority/Type).
  - Actions: confirm **Theme/Area**, set **Priority/Size**, add **Start Date/Deadline** for time-bound items.
- **Tue — Build Focus**
  - View: **Board (by Assignee)**; swarm **Blocked** and live **S0/S1** bugs first.
- **Wed — QA Prep & Reviews**
  - Views: **QA Gate**, **UAT (Staging)**. Ensure test notes and staging links on each item.
- **Thu — UAT Day**
  - Client UAT window; triage feedback into **Bugs/Tasks** for the current Milestone/Phase.
- **Fri — Ship & Sweep**
  - Ship when ready; close **Done**; move stragglers to next **Milestone**; update **Epic Tracking**.

## Ceremonies

- **Daily stand‑up (15m)** — focus on **Blocked**, **Hot/Live bugs**, and handoffs.
- **Grooming (weekly, 45–60m)** — refine **Backlog (Priority)**; keep it small & high-signal.
- **UAT (weekly, Thu)** — joint review on staging; decide Go/No‑go for ready items.
- **Retro (monthly, 45m)** — inspect flow metrics; pick 1–2 improvements.

## SLAs (target)

- **S0 – Blocker (Live):** swarm immediately; hotfix; comms hourly until resolved.
- **S1 – Critical:** fix within 24h; client update daily.
- **S2 – Major:** within 3 business days or next UAT.
- **S3 – Minor:** schedule in next maintenance window.
- **S4 – Trivial:** backlog; batch fixes.

## Definition of Ready (DoR) — Checklist

- [ ] Problem statement and outcome defined
- [ ] Acceptance criteria written (Given/When/Then)
- [ ] Designs or references attached (if relevant)
- [ ] Dependencies identified and unblocked
- [ ] Estimates agreed (Size and/or hours)
- [ ] Test approach noted (how we’ll verify)
- [ ] Stakeholders and approver listed
- [ ] Environment clarified (Prototype/Staging/Live)

## Definition of Done (DoD) — Checklist

- [ ] Acceptance criteria met
- [ ] Unit/functional tests added or updated
- [ ] A11y pass (key flows and components)
- [ ] Docs updated (README/Changelog/Client notes)
- [ ] Feature toggles/rollout considered
- [ ] QA verified on Staging
- [ ] UAT approved by client (if applicable)
- [ ] Release notes prepared; monitoring in place

## Roles

- **PM/Lead:** owns prioritisation, ceremonies, client comms, Phase/Milestone.
- **Engineer:** drives delivery; keeps **Environment/Status** honest.
- **Designer:** provides assets/specs; reviews UI in **UAT**.
- **QA (where applicable):** triage severity; runs **QA Gate**.

## Calendared reminders

- Mon 09:00 — **Intake & Plan**
- Thu 14:00 — **UAT**
- Fri 15:00 — **Ship & Sweep**
- 1st Friday monthly — **Retro**

## View usage by ceremony

- **Stand‑up:** Board (by Assignee), Blocked
- **Grooming:** Backlog (Priority), Epics — Tracking
- **QA/UAT:** QA Gate, UAT (Staging)
- **Planning/Reporting:** Roadmap (Dates), Epics — Roadmap

## Notes

- **Environment default:** **Staging** for new items unless explicitly Live/Prototype.
- Keep **Theme** stable across issues to preserve reporting; move **Phase** as the release window changes.
