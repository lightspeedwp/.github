# Product Development — Automations

**Date:** 13-10-2025 — **Version:** v1.1

> Lean, predictable automations. Apply in **Project settings → Automations**.

---

## Core rules (enable all)

1. **On item added** → set **Status = Backlog**
2. **On Assignee set** → set **Status = In progress**
3. **On Pull Request opened** (linked) → set **Status = In review**
4. **On label `status:needs-qa` added** → set **Status = In QA**
5. **On Pull Request merged OR Issue closed** → set **Status = Done**

## Optional refinements

- **Auto-prioritise live critical bugs**:  
  If **Issue Type = Bug** AND **Environment = Live** AND **Severity IN {S0, S1}** → set **Priority = High**.

- **Release hygiene** (manual habit): ensure all in-scope items have **Milestone = vX.Y.Z** and **Release type** set before freeze.

## Order & conflict notes

- Avoid loops: do **not** auto-move from **In QA → In review** on comment events.  
- Manual overrides always win; automations should only react to clear, high-signal events (PR open/merge, label change).

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
