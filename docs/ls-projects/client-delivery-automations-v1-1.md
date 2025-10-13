# Client Delivery — Automations

**Date:** 13-10-2025 — **Version:** v1.1

> Lean, predictable automations. Apply in **Project settings → Automations**.

## Core rules (enable all)

1. **On item added** → set **Status = Backlog**
2. **On Assignee set** → set **Status = In progress**
3. **On Pull Request opened** (linked) → set **Status = In review**
4. **On label `status:needs-qa` added** → set **Status = In QA**
5. **On Pull Request merged OR Issue closed** → set **Status = Done**

## Optional refinements

- **Auto-prioritise live critical bugs** (use sparingly):  
  If **Issue Type = Bug** AND **Environment = Live** AND **Severity IN {S0, S1}** → set **Priority = High**.

- **Blocked signal (manual)**: keep using label **`blocked`**. No automation required—**Blocked** view filters on this.

## Order & conflict notes

- Avoid loops: do **not** auto-move from **In QA → In review** on comment events.  
- Manual overrides always win; automations should only react to clear, high-signal events (PR open/merge, label change).

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
