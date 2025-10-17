# Product Development — Cadence

**Date:** 13-10-2025 — **Version:** v1.1

> Release‑train rhythm: predictable minors monthly; patches as needed. Uses the saved **Views** and **Automations** docs.

---

## Purpose

Ship product increments on a regular train (**vX.Y.Z**), with tight QA, changelogs, and clear decision points.

## Monthly release train

- **Week 1 — Scope & Plan**
  - Set Milestone **vX.Y.0**; select Features/Stories; create **Release Gate — vX.Y.Z** view.
- **Week 2–3 — Build**
  - Drive via **Board (by Assignee)**; prioritise **P1/P0**; keep PRs small and linked.
- **Week 4 — Freeze & Cut**
  - **Code freeze (24–48h)**; **QA Gate** on RC; **Release PR → main**; **tag** and publish notes.

## Weekly rhythm (Mon–Fri)

- **Mon — Planning & Intake (45m)**: prune **Backlog (Priority)**; ensure **Milestone** on in‑scope items.
- **Wed — Demo/Design review (30–45m)**: show increments; capture decisions; adjust scope.
- **Fri — Readiness (30m)**: check **Release Gate**, date risks (**Roadmap (Dates)**), and hotfixes.

## Hotfix lane

- Trigger: **S0/S1** or severe regression on **Live**.
- Flow: `hotfix/<slug>` → fast QA on **Staging** → tag **PATCH** → back‑merge to `develop` and open **Follow‑ups**.
- View: **Hotfix Lane** (Release type = Hotfix OR Severity in S0/S1).

## SLAs (target)

- **S0 – Blocker:** immediate hotfix; owner + deputy online until resolved.
- **S1 – Critical:** within 24h, or escalate to hotfix.
- **S2 – Major:** in current/next train.
- **S3 – Minor:** schedule; batch in a patch.
- **S4 – Trivial:** backlog with theme labels.

## Definition of Ready (DoR) — Checklist

- [ ] Problem, rationale, and success metric stated
- [ ] Acceptance criteria (Given/When/Then)
- [ ] Design/spec attached (where needed)
- [ ] Dependencies mapped; rollout/flags planned
- [ ] Test approach and risk noted
- [ ] Estimate added (Size and/or hours)
- [ ] Milestone/Iteration assigned

## Definition of Done (DoD) — Checklist

- [ ] All acceptance criteria met
- [ ] Tests added/updated; CI green
- [ ] A11y, performance, and security checks
- [ ] Docs and changelog updated
- [ ] Version bump (where required)
- [ ] QA pass on staging
- [ ] Release notes drafted; monitors/alerts set

## Roles

- **PM/Release Lead:** owns Milestone scope, freeze/cut, and comms
- **Tech Lead:** code health, CI, reviews
- **Engineers:** delivery; link PRs; keep **Status** accurate
- **Designer/Researcher:** UX artefacts, validations

## Calendared reminders

- Mon 09:30 — **Planning & Intake**
- Wed 15:00 — **Demo/Design review**
- Fri 15:30 — **Release Readiness**
- Last Thu of month — **Freeze window starts (optional)**

## View usage by ceremony

- **Planning:** Backlog (Priority), Epics — Tracking
- **Execution:** Board (by Assignee), Tech Debt
- **Release:** Release Gate — vX.Y.Z, QA Gate, Roadmap (Dates)

## Notes

- **Environment default:** **Prototype/Staging** (per flow); flip to **Live** only for production changes.
- Keep **Theme** stable across releases; use **Milestone** for the anchor and **Iteration** for sprint optics (optional).

---
