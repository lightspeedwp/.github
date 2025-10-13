# Project Settings — Product Development

**Date:** 13-10-2025 — **Version:** v1.6

> Use `{}` to indicate placeholders (e.g., `Product – {ProductName}`).

## Project name

`Product – {ProductName}`

## Short description

**Rule:** one sentence, ≤160 characters.  
**Default:** `Plan and ship versioned releases with a lean Scrumban flow and clear release gates.`

## README

### Purpose

Run a predictable **release train**: plan, build, validate, and ship versioned releases with clear gates.

### Status columns

Backlog → Ready → In progress → In review → In QA → Done

### Views

- **Board (by Assignee)** — *board*  
  Group by **Assignee** · Sort **Priority desc** · **Field sum:** Estimate

- **Release Gate — vX.Y.Z** — *table*  
  Filter **Milestone matches `^v\d+\.\d+\.\d+$`** (current release) · Group by **Issue Type** · Sort **Priority desc, Size asc** · **Field sum:** Estimate

- **Backlog (Priority)** — *table*  
  Filter **Status = Backlog** · Sort **Priority desc, Size asc** *(Size uses numeric prefixes to enforce order)*

- **Hotfix Lane** — *table* *(optional to pin)*  
  Filter **Release type = Hotfix** OR **Severity ∈ {S0, S1}** · Sort **Severity desc, Priority desc**

- **QA Gate** — *table*  
  Filter **Status = In QA** · Sort **Severity desc, Priority desc**

- **Epics — Tracking (Table)** — *table*  
  Filter **Issue Type = Epic** · Group by **Milestone/Release** · Sort **Priority desc**

- **Roadmap (Dates)** — *roadmap*  
  Start field = **Start Date** · Target field = **Deadline** · Group by **Theme**

- **Tech Debt** — *table*  
  Filter **Label = tech-debt** OR **Issue Type = Refactor**

### Automations

- On item added → **Status = Backlog**  
- On assignee set → **Status = In progress**  
- On PR opened → **Status = In review**  
- On label `status:needs-qa` → **Status = In QA**  
- On PR merged / issue closed → **Status = Done**  
- *(Optional rule)* If **Issue Type = Bug** AND **Environment = Live** AND **Severity ∈ {S0, S1}** → **Priority = High**

### Cadence

- Weekly planning (select **Release Gate — vX.Y.Z** scope)  
- Daily stand-up (focus **Hotfix Lane** + blockers)  
- **Monthly Minor** releases; **Patches as needed**; short freeze window before release  
- Release notes on merge to `main`; tag **vX.Y.Z**

### Field defaults

- **Priority:** **Medium** (default)  
- **Phase:** **Pre-launch** (default)  
- **Release type:** **Minor** (default; set to **Patch**/**Hotfix** as needed)  
- **Environment:** **Prototype/Staging** (default; per flow)  
- **Size:** **0 – Unknown** (default)  
- **Theme, Area:** set at triage (choose exactly **one** Theme per item)  
- **Milestone (Iteration):** required for all in-scope release items (**vX.Y.Z**)  
- **Estimate/Start Date/Deadline:** set when scheduled

### Definition of Ready (DoR) — Checklist

- [ ] Problem, rationale, and success metric stated
- [ ] Acceptance criteria (Given/When/Then)
- [ ] Design/spec attached (where needed)
- [ ] Dependencies mapped; rollout/flags planned
- [ ] Test approach and risk noted
- [ ] Estimate added (Size and/or hours)
- [ ] Milestone/Iteration assigned

### Definition of Done (DoD) — Checklist

- [ ] All acceptance criteria met
- [ ] Tests added/updated; CI green
- [ ] A11y, performance, and security checks
- [ ] Docs and changelog updated
- [ ] Version bump (where required)
- [ ] QA pass on staging
- [ ] Release notes drafted; monitors/alerts set
