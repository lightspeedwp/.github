# .github/PR_LABELS.md

## Purpose
Provide high‑signal, automated **PR labels** for review routing, release hygiene, and search—without introducing `type:*` PR labels.

## How labels are applied
1) **Paths → labels** via `.github/labeler.yml`:
   - `area:ci`, `area:dependencies`, `area:block-editor`, `area:theme`, `area:integration` …
   - `lang:php`, `lang:javascript`, `lang:css`, `lang:md` …
2) **Branch prefixes → status** (on PR open):
   - `feat/`, `fix/`, `docs/`, `chore/`, `build/` → add **`status:needs-review`** by default.

### Optional branch→type mapping (for Projects)
When the Project **Type** field is present, workflows may map PR branches to **Type**:
- `feat/`→`Feature` · `fix/`→`Bug` · `docs/`→`Documentation` · `chore/|build/`→`Task`.

## Changelog hygiene
- On PR open, if no changelog marker exists, add **`meta:needs-changelog`**.
- Remove it after updating changelog/README (or apply `meta:no-changelog` if internal‑only).

## Status rules (PRs)
- Keep **exactly one** `status:*`. The workflow adds `status:needs-review` if none exists and fails if multiple are present.

## Dependabot PRs
- Path rules label dependency updates (e.g. `area:dependencies`) to help batching and release notes.

## Files powering this
- `.github/labeler.yml` — path & branch rules.
- `.github/workflows/labels-issues-prs.yml` — defaults, status enforcement, changelog nudge.

---

# .github/PROJECT_META.md (shared core, updated)

## Purpose
Automatically **add issues/PRs to the org Project** and keep Project **fields in sync** with labels and branch semantics.

## What the workflow does
- **Triggers** on issue and PR events.
- **Adds the item** to the org Project using `LS_PROJECT_URL`.
- **Derives** and writes Project fields:
  - **Status** from `status:*` labels (closed/merged → `Done`; default `Triage`).
  - **Priority** from `priority:*` labels.
  - **Type** from **PR head branch** (see PR labels).

## Setup requirements
- **Org/repo variables:** `LS_PROJECT_URL`, `LS_APP_ID`.
- **Secrets:** `LS_APP_PRIVATE_KEY`.
- **Project fields:** Ensure **Status**, **Priority**, **Type** field names match exactly.

## Guardrails
- Labels are **signals**; the Project is the **source of truth** for delivery state.
- Mapping from branch → **Type** is **advisory**; **Issues** still set **Issue Type** manually.
- Keep Status values **lean**; use labels `needs-qa`, `needs-review`, `blocked` and let the workflow sync.

## Template‑specific READMEs
- **Client Delivery:** uses **Todo** instead of Ready and includes UAT views.
- **Product Development:** uses **Ready** and includes Release/Milestone views and PR discipline.

---

# .github/PROJECT_META.client-delivery.md (new)

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