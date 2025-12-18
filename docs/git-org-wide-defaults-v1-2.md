# **GitHub Defaults Strategy**

## *Projects, Issues, Labels & Milestones* 

***Version:*** 1.2 • ***Last updated:*** 7 Oct 2025  
***Scope:*** Org-wide defaults for WordPress themes, plugins, and blocks (incl. WooCommerce).  
***Goal:*** Fast triage, predictable reporting, contributor-friendly workflows using **GitHub Projects** \+ **Issue Types** \+ **Labels** \+ **Milestones**.  
---

[0\) System overview](#0\)-system-overview)

[1\) Core principles](#1\)-core-principles)

[2\) Naming conventions](#2\)-naming-conventions)

[3\) How we use issues (hierarchy)](#3\)-how-we-use-issues-\(hierarchy\))

[4\) Scrumban workflow (applies to projects)](#4\)-scrumban-workflow-\(applies-to-projects\))

[5\) Project setup — standard configuration](#5\)-project-setup-—-standard-configuration)

[6\) Governance & migration](#6\)-governance-&-migration)

[7\) Colour systems (Issue Types and Labels)](#7\)-colour-systems-\(issue-types-and-labels\))

---

# **0\) System overview** {#0)-system-overview}

- **Projects** \= day-to-day planning/tracking across repos (boards, tables, roadmap, insights).  
- **Issue Types** \= top-level classification (Bug / Feature / Task / …).  
- **Labels** \= routing & signals (priority, status, area, compatibility, environment).  
- **Milestones** \= release trains or timeboxes (sprints).  
- **Themes/Initiatives → Epics → Stories**:  
  - **Theme / Initiative** \= broad, long-lived objective (e.g., “Performance & Core Web Vitals”).  
  - **Epic** \= parent issue that groups deliverables for a Theme (e.g., “Reduce LCP on Home”).  
  - **Stories** are primarily for **first-pass scoping** before we split into implementable issues. They are also child issues (Feature/Task/Bug) in GitHub that deliver part of an Epic.  
- **Scrumban**: maintain a continuously prioritised **Backlog → Ready → In progress → In review → In QA → Done** flow with WIP limits.

---

# **1\) Core principles** {#1)-core-principles}

1) Keep the model **small and consistent**. Prefer a handful of Issue Types and a curated label set.  
2) Make **fields first-class** in Projects (Status, Priority, Area, Theme, Iteration/Milestone). Labels add cross-cutting context.  
3) Optimise for **search and saved views** across repos; standardise names and casing.  
4) Define **Definition of Ready (DoR)** and **Definition of Done (DoD)**; enforce them via issue templates and checklists.  
5) Use **automation** to move Status, add items, and post progress updates.  
6) Tie everything back to **customer outcomes** (metrics, acceptance criteria, a11y and performance budgets).

---

# **2\) Naming conventions** {#2)-naming-conventions}

- **Issue Types:**   
  - Short **Title Case**, one clear meaning  
  - e.g. `Bug,Feature,Performance`, etc   
- **Labels:**   
  - `family:value` in lower-case kebab-case  
  - e.g. `priority:critical`, `status:needs-design`, `area:theme-json`  
- **Milestones:**   
  - `vX.Y.Z` (with due date \+ description).    
  - e.g. `v`  
- **Sprints:**    
  - `Sprint-YYYY-WW` (with due date \+ description)  
  - e.g. `Sprint-2025-42` (*Sprint-*: fixed prefix, *YYYY*: four-digit year, WW: week number. Use the starting week of the sprint.)  
- **Projects:**   
  - `Client / Product — Board` or `Theme — <Name>`   
  - e.g. `E-commerce Theme — Board`  
- **Epics:**   
  - `Epic: <Clear outcome statement>`   
  - e.g. `Epic: Reduce LCP to ≤2.5s on Home`  
- **Stories:**   
  - `As a <user>, I want <capability> so that <outcome>` `with AC and test notes.`  
  - e.g. `As a shopper, I want to save my cart so that I can finish later. AC: shows “Save Cart” when logged in; restores items within 30 days.`

---

# **3\) How we use issues (hierarchy)** {#3)-how-we-use-issues-(hierarchy)}

- **Theme / Initiative** \= broad, long-lived objective (e.g., “Performance & Core Web Vitals”). These will not be labels and added to projects as a custom field when needed.  
- **Epics (parents):** Outcome-oriented parent issues (Issue Type \= **Epic**) used to group deliverables. Use task lists to create/link **child issues**. In Project views, group by **Parent** to see roll-up progress.  
- **Stories (children, scoping):** Child issues (Issue Type \= **Story**) capture user-facing slices **only during initial scoping**. As we move to execution, draft Feature/Task/Bug issues and link them to the Epic; Stories may be closed or left for context.  
- **Progress fields:** Enable **Parent issue** and **Sub-issue progress** system fields to visualise completion and filter by hierarchy.

---

# **4\) Scrumban workflow (applies to projects)** {#4)-scrumban-workflow-(applies-to-projects)}

- **Status (single‑select):** `Backlog` → `Ready` → `In progress` → `In review` → `In QA` → `Done`  
- **WIP limits**: set caps on `In progress` and `In review` to reduce context switching.  
- **Labels echo status where useful** (e.g., `status:needs-triage`, `status:blocked`) but **do not replace the Status field**.  
- **Columns/Status**: `Backlog`, `Ready`, `In progress`, `In review`, `In QA`, `Done`.  
- **Pull not push**: engineers pull from **Ready** based on priority; PMs keep **Backlog** tidy.  
- **Cadence**: weekly backlog grooming; daily stand-up focuses on **Blocked**; sprint/iteration optional.  
- **DoR** (Ready): Issue Type set, Priority set, Area/Theme set, AC defined, design/dev notes attached.  
- **DoD** (Done): Acceptance Checks met, a11y checks pass, tests updated, documentation/readme/changelog updated, merged and released (or queued).

## **4.1 Themes / Initiatives (broad, long-lived)**

- **What:** Strategic umbrellas like “Accessibility”, “Performance”, “Block Editor”, or “WooCommerce”.  
- **How to model:**  
  **A. Project field (preferred):** add a **single-select Project field** named `Theme` with options (e.g., `Performance`, `Accessibility`, `Editor UX`, `WooCommerce`).  
  **B. Optional label:** use `theme:<slug>` when you need to pivot outside Projects (e.g., cross-org search).  
  **C. Optional portfolio project:** a Project view that filters by `Theme = <X>` to give stakeholders a live dashboard.

## **4.2 Epics (parents)**

- **What:** Outcome-oriented parent issue that tracks completion across multiple repos.  
- **Issue Type:** **🧭 Epic**.  
- **How to link Stories:** create a **task list** in the Epic description and **convert checkboxes to issues**; these become **child stories** and progress auto-rolls up.  
- **Fields:** set `Theme`, `Priority`, `Area`, `Milestone/Iteration`.  
- **Progress:** use the Project’s **Parent/Sub-issue progress** field to visualise completion; pin an **Epic view** grouped by Parent.

## **4.3 Stories (children)**

- **What:** Deliverable units (Feature/Task/Bug).  
- **Linking:** each Story references its Epic via the task-list link (or the Parent field).  
- **Quality:** every Story has AC, test notes, and a release note snippet; Stories inherit the Epic’s Theme and Milestone.  
- **Size:** every issue should have a size defined,  which approximately relates to the estimation value.  
- **Estimation (optional):** add a numeric `Estimate` field (points or ideal hours) for forecasting.

---

# **5\) Project setup — standard configuration** {#5)-project-setup-—-standard-configuration}

## **5.1 Main project settings**

- **Project name** — stable, human-readable.  
- **Short description** — 1–2 lines for purpose & scope.  
- **README** — how the board is used (cadence, Definition of Ready/Done links, saved views, field semantics).

## **5.2 Essential Fields (add these to every Project)**

- **Status** *(single-select)*: `Backlog`, `Ready`, `In progress`, `In review`, `In QA`, `Done`.  
- **Type** *(Issue Type)*: from the table below (emojis included).  
- **Priority** *(single-select)*: `Critical`, `Important`, `Normal`, `Minor`.  
- **Theme** *(single-select)*: e.g., `Performance`, `Accessibility`, `Editor UX`, `SEO`, `Analytics`, `Checkout`.  
- **Iteration** *(iteration field, optional)*: 1–2 week sprints.

## **5.3 Views (pin these)**

- **Board — Team Flow:** Columns by **Status**, lanes by **Assignee**.  
- **Backlog — Table:** `Status in (Backlog, Ready)` sorted by `Priority desc`, then `Updated desc`.  
- **Epic drill-down:** Group by **Parent** to show roll-up progress of child issues.  
- **QA Gate:** Filter `Status in (In review, In QA)` \+ `Type in (🐞 Bug, 🧪 Test Coverage)`; group by **Environment**.  
- **Roadmap:** Group by **Milestone** or **Iteration**; show **Start Date** and **Deadline**.  
- **UAT (Client):** Filter `Environment = staging` and `Status in (In review, In QA)`.  
- **Blocked:** Filter `Status = Backlog` \+ `Blocked reason != null` OR use `status:blocked` label as a catch-all.

## **5.4 Automations (minimum viable)**

- Auto-add new items from target repos → `Status = Backlog`.  
- On **assignee set** → `Status = In progress`.  
- On **PR opened** → `Status = In review`.  
- On **issue closed / PR merged** → `Status = Done`.  
- If label `status:needs-qa` added → `Status = In QA`.

## **5.4 Insights & charts (keep lean)**

- **Throughput** (Done per week).  
- **Cycle time** (Ready → Done).  
- **Open by Type** (Bug/Feature/Task).  
- **Work by Theme/Area** to show investment mix.

## **5.5 Quick-start GitHub project checklist**

1) **Create Project** from the “Product Board (Scrumban)” template; copy standard **fields** and **views**.  
2) **Enable Issue Type**, add fields: `Status`, `Priority`, `Area`, `Theme`, `Iteration`, `Milestone`, `Environment`, `Blocked reason`.  
3) **Wire automations:** add items automatically; move on assign/PR open/close; set `Status = In QA` when `status:needs-qa` is added.  
4) **Pin views:** Board, Backlog Table, QA Gate, Epic Drill-down, Roadmap, Blocked.  
5) **Create the first Theme(s)** and **Epic(s)**; write task-lists for Stories and convert them to issues.  
6) **Set WIP limits & cadence**; add DoR/DoD checklists to templates.  
7) **Define charts** (Throughput, Cycle time, Type mix, Work by Theme).

## **5.6 Milestones — how we use them**

- **Releases:** Use `vX.Y.Z` milestones to collect issues/PRs that ship together, show burn-down and remaining work.  
- **Sprint milestones** (`Sprint-YYYY-WW`): optional timebox for throughput/velocity.  
- **Epic milestones** (optional): if an Epic spans repos and benefits from burn-down.  
- Within a milestone, drag to prioritise; use **Saved filters** and **Project views** to keep stakeholders aligned.

## **5.6 Sprints — how we use them**

Use **`Sprint-YYYY-WW`** as the **milestone (or iteration)** name for a sprint time-box. Projects themselves keep a stable name (e.g., “Client / Product — Board”); the sprint label lives in **Milestones** (and optionally the Iteration field).

### **Format**

* **`Sprint-`**: fixed prefix  
* **`YYYY`**: four-digit year  
* **`WW`**: **ISO week number** (01–53). Use the **starting week** of the sprint; for a 2-week sprint this covers WW and WW+1. Include a short description \+ due date on the milestone.

We work Scrumban; sprints are optional, but when used we keep them consistent across repos with this naming.

### **Examples**

* **One-week sprint** starting Mon **6 Oct 2025** (ISO week **41**):  
  **`Sprint-2025-41`** — set due date to Sun 12 Oct (or your team’s chosen end-day).  
* **Two-week sprint** starting the same day:  
  **`Sprint-2025-41`** — covers **weeks 41–42**; set due date to Sun 19 Oct.

### **Where it’s used**

* **Milestones:** create `Sprint-YYYY-WW` to time-box work & report throughput/velocity.  
* **Iterations (optional):** add an Iteration field entry matching the same dates (`1–2 week sprints`).

### **Why this way**

* Keeps Project names stable and readable; sprints roll via **Milestones/Iterations**, not Project renames.  
* Normalised names make cross-repo queries trivial (e.g., `is:open milestone:Sprint-2025-41`).

## **5.7 Notes on consistency**

- Keep **Status** as a field; keep “needs-\*” and “in-discussion” as **labels** only. This avoids double states and keeps boards readable.  
- Stories are an **early-phase device** for shaping scope; don’t over-index on maintaining Story status once execution moves to Feature/Task/Bug.

## **5.8 Saved searches (use across repos & pin in Projects)**

- **Engineers’ queue:** `is:open is:issue label:"status:ready" -label:"status:blocked" sort:updated-desc`  
- **Release gate (v1.4):** `is:open milestone:v1.4`  
- **QA sweep:** `is:open label:"status:needs-qa"`  
- **Accessibility:** filter by **Issue Type \= ♿ A11y** in Projects or label `area:a11y` if added.

## **5.8 Expanded Project fields & usage guidelines**

- ***Source of truth:*** Project **fields** (Status/Priority/Area/etc.) are primary. Use **labels** to **echo** values only for cross-repo searches or contributor signalling.  
- ***Field rule:*** Projects are the **system of record** for Status/Priority/Area/etc. Labels mirror these values for cross-repo searches.

### **Field types & behaviour:**

- **Status** *(single-select)*  
  Values: `Backlog`, `Ready`, `In progress`, `In review`, `In QA`, `Done`.  
  Purpose: Drives board columns and flow. Keep “needs-\* / in-discussion” as labels for intake and filtering — do **not** add them as columns.  
    
- **Type** *(Issue Type field)*  
  Purpose: Classify work at the top level (Epic, Story, Feature, Task, Bug, Refactor, Design, research, Chore, etc.).  
  Source of truth: `issue-types-guide-v1-7.md` (organisation defaults).  
    
- **Priority** *(single-select)*  
  Values: `Critical`, `Important`, `Normal`, `Minor`.  
  Note: Mirrors the label family `priority:*` for cross-repo filtering. Pick **one** source of truth per Project (prefer the field), and optionally echo with labels.  
    
- **Size** *(single-select)*  
  Values: `XS`, `S`, `M`, `L`, `XL`.  
  Guidance: Relative complexity/effort signal used during planning.  
    
- **Time Estimation** *(number)*  
  Unit: **hours** (preferred) or **points** — pick one per project and document in the README.  
  Tips: Use numeric filters in table views for capacity planning.  
    
- **Sprints** *(iteration field)*  
  Naming: `Sprint-YYYY-WW`.  
  Cadence: 1–2 weeks.  
  Usage: Filter by `@current`, `@previous`, `@next`; use roadmap layout for span visualisation.  
    
- **Start Date** *(date)*  
  Definition: When work is expected to begin.  
  Usage: Useful for roadmap timelines and lead-time calculations (`>= @today`, ranges).  
    
- **Deadline (End Date)** *(date)*  
  Definition: Target completion date for the item/PR.  
  Usage: Enables “at risk/overdue” views and burndown checks.  
    
- **Parent issue** *(system field)*  
  Definition: Links an item to its **Epic** (parent).  
  Usage: Enables grouping, roll-up views, and parent-based filtering.  
    
- **Sub-issues progress** *(system field)*  
  Definition: Read-only roll-up of completed child issues (shows count and %).  
  Settings: Enable **Show numerical value** for visibility in table views.  
    
- **Linked pull requests** & **Reviewers** *(pull request fields)*  
  Purpose: Surface PR state and assigned reviewers in the Project.  
  Automation: Consider moving Status to **In review** on PR open and to **Done** on merge.  
    
- **Milestone** *(text/link or repo milestone)*  
  Purpose: Target release (e.g., `v2.1`).  
  Note: Use repo milestones where feasible; use free-text/link if spanning repos.  
    
- **Environment** *(single-select)*  
  Values: `prototype`, `staging`, `live`.  
  Usage: Handy for UAT & release views.

### **References:**

- [About text and number fields \- GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-text-and-number-fields)  
- [About date fields \- GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-date-fields)  
- [About single select fields \- GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-single-select-fields)  
- [About iteration fields \- GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-iteration-fields)  
- [About parent issue and sub-issue progress fields \- GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-parent-issue-and-sub-issue-progress-fields)  
- [About pull request fields \- GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-pull-request-fields)   
- [About the issue type field \- GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-the-issue-type-field) 

| Field | Type | Values / Settings | Notes |
| :---- | :---- | :---- | :---- |
| **Status** | Single-select | **Backlog**, **Ready**, **In progress**, **In review**, **In QA**, **Done** | Keep lean; use `status:*` labels for routing (e.g., `status:needs-design`, `status:needs-dev`, `status:needs-qa`, `status:in-discussion`). |
| **Issue Type** | Issue Type | As per **Issue Types Guide v1.6** | Includes 🧭 Epic, 📖 Story, ✨ Feature, 🧩 Task, 🐞 Bug, etc. |
| **Priority** | Single-select | **Critical**, **Important**, **Normal**, **Minor** | Mirrors `priority:*` labels for org-wide filters. |
| **Area** | Single-select | e.g., **theme**, **plugins**, **navigation**, **search**, **ci**, **deployment**, **design-system**, **woocommerce**, **seo**, **analytics**, **i18n** | Align options with your `area:*` labels for consistency. |
| **Component (Comp)** | Single-select | e.g., **block-editor**, **block-templates**, **template-parts**, **block-patterns**, **block-variations**, **block-inserter**, **block-json**, **theme-json**, **wp-admin**, **settings**, **post-settings**, **style-variations**, **block-styles**, **color-palette**, **typography**, **section-styles**, **spacing** | Remove duplicates (e.g., `block-json` must appear once). |
| **Theme (Initiative)** | Single-select | e.g., **Performance**, **Accessibility**, **Editor UX**, **SEO**, **Analytics**, **Checkout** | Optional: also mirror as `theme:<slug>` labels if needed. |
| **Iteration (Sprints)** | Iteration | Configure 1–2 week iterations | Name sprints `Sprint-YYYY-WW`. See sprint section. |
| **Milestone** | Text/Link | `vX.Y.Z` or `Sprint-YYYY-WW` | Releases always use version milestones; sprints may be milestone **or** iteration (see below). |
| **Environment** | Single-select | **prototype**, **staging**, **live** | Mirrors `env:*` labels for UAT and release comms. |
| **Blocked reason** | Text | Free text | Used when `status:blocked` is added. |
| **Sub-issues progress** | Parent/Sub-issue progress | Auto-computed | GitHub-managed (cannot rename). Shows roll-up % on epics. |
| **Size** | Single-select | **XS**, **S**, **M**, **L**, **XL** | T-shirt size; helps forecast. |
| **Time Estimation** | Number | Ideal hours or points (pick one and note in README) | Keep one unit org-wide. |
| **Start Date** | Date | Start date for Issue/PR | For scheduling/roadmaps. |
| **Deadline** | Date | Due date (Issue/PR) | Drives Roadmap/Insights. |

---

# **6\) Governance & migration** {#6)-governance-&-migration}

- **Org defaults:** maintain Issue Types, labels, and palette centrally; apply to new repos by default.  
- **Backfill:** migrate any legacy `type:*` labels to **Issue Types**; keep a temporary workflow to mirror until dashboards are updated.  
- **Field registry:** single source of truth (names/values) in `.github/PROJECT_FIELDS.md`.  
- **Reviews:** monthly hygiene review (labels used, WIP limits respected, stale items archived).

---

# **7\) Colour systems (Issue Types and Labels)** {#7)-colour-systems-(issue-types-and-labels)}

- ***Default Organization Issue Types:*** See the [**Issue Types Guide tab**](?tab=t.d3hztco9dzpk) for a detailed list of organisation wide default Issue Types and usage guidelines.  
- ***Default Organization Repository Labels:*** See the [**Labels Guide tab**](?tab=t.n09aog55k22h) for a detailed list of organisation wide default Labels and usage guidelines.  
- ***Note about Labels:*** We **exclude** `type:*` labels (Issue Types cover that). Colours use GitHub’s standard solid/outline label palette.

## **Colour mapping cheat-sheet**

### **Issue Types**

- Red: Bug, Security  
- Green: Feature, Release  
- Blue: Task, Build & CI, Automation, Code Review  
- Yellow: Performance, Test Coverage  
- Purple: Epic  
- Pink: A11y  
- Grey: Improvement, Refactor, Maintenance, Research

### **Labels**

- Priority: Red/Orange/Blue/Light Blue (outline)  
- Status: Green (ready), Light Blue (in-progress), Purple (blocked), Orange (on-hold), Yellow (QA/testing), Blue/Purple outlines (reviews/feedback)  
- Area: Light Blue (outline) family; selective exceptions (Woo \= Purple outline, Deployment \= Dark Green)  
- Compatibility: Orange family (solid/outline)  
- Environment: Prototype \= Grey (outline), Staging \= Blue (outline), Live \= Green (solid)  
- Community: Green/Purple (outlines)

## **Issue Type colours (global palette)**

Available palette for **Issue Types**:

* Grey `#9198a1`  
* Blue `#4393f8`  
* Green `#3fb950`  
* Yellow `#d29922`  
* Orange `#8d4821`  
* Red `#9f3734`  
* Pink `#db61a2`  
* Purple `#ab7df8`.

### **Why this mapping?**

- **Red** \= risk/breakage (**Bug**, **Security**) — instantly draws attention.  
- **Green** \= value/delivery (**Feature**, **Release**) — “go/shipped” semantics.  
- **Blue** \= engineering systems (**Task**, **Build & CI**, **Automation**, **Code Review**) — neutral operational work.  
- **Yellow** \= quality signals (**Performance**, **Test Coverage**) — health/attention needed.  
- **Purple** \= strategy/structure (**Epic**) — parent-level planning.  
- **Pink** \= inclusion (**A11y**) — distinct, memorable.  
- **Grey** \= hygiene (**Improvement**, **Refactor**, **Maintenance**, **Research**) — behind-the-scenes upkeep.

## **Label colours (GitHub standard palette)**

| Solid colours: | Outline colours:  |
| :---- | :---- |
| Red `#B60205` | Red `#E99695` |
| Orange `#D93F0B` | Orange `#F9D0C4` |
| Yellow `#FBCA04` | Yellow `#FEF2C0` |
| Green `#0E8A16` | Green `#C2E0C6` |
| Dark Green `#006B75` | Dark Green `#BFDADC` |
| Light Blue `#1D76DB` | Light Blue `#C5DEF5` |
| Blue `#0052CC` | Blue `#BFD4F2` |
| Purple `#5319E7` | Purple `#D4C5F9` |

### **How we apply them (by family):**

- **Priority** → warm urgency gradient:  
  - `priority:critical` **Red** (solid) — immediate action.  
  - `priority:important` **Orange** (solid) — next up.  
  - `priority:normal` **Blue** (solid) — default.  
  - `priority:minor` **Green** (outline) — nice-to-have.  
- **Status** → intuitive signals:  
  - `status:ready` **Green** — good to start.  
  - `status:in-progress` **Light Blue** — active.  
  - `status:blocked` **Red** (outline) — stands out distinctly.  
  - `status:on-hold` **Orange** (outline) — paused.  
  - QA/test states:   
    - `status:needs-qa` **Yellow**,   
    - `status:needs-testing` **Yellow (outline)**.  
  - Reviews/feedback (design/dev): **Blue/Purple (outline)** to differentiate from active work.  
- **Area** → consistent visuals for components: **Light Blue (outline)** across most areas for easy scanning; exceptions:  
  - `area:woocommerce` **Purple (outline)** (ecosystem),  
  - `area:deployment` **Dark Green (solid)** (ops).  
- **Compatibility** → **Orange family** (solid/outline) to indicate external constraints (Core/PHP/Woo/Multisite/RTL).  
- **Environment** → traffic-light semantics:   
  - `env:prototype` **Grey (outline)**  
  - `env:staging` **Blue (outline)**  
  - `env:live` **Green (solid)**.  
- **Community** → welcoming tones:   
  - `contrib:help-wanted` **Green (outline)**,   
  - `contrib:good-first-issue` **Purple (outline)**.

### **Do / Don’t**

- **Do** keep colours stable over time to build team intuition.  
- **Do** reserve **Red/Orange** for urgency; **Green** for “go/live”; **Yellow** for QA/testing.  
- **Don’t** overload with many unique colours; favour family groupings so boards remain readable.

---

