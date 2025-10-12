# **Product Development** 

## *Project Template (Release Train)*

***Version:*** 1.3 • ***Last updated:*** 9 Oct 2025  
---

[Quick Start for Product Development](#quick-start-for-product-development)

[Release Cadence](#release-cadence)

[Branching Strategy for Release Train](#branching-strategy-for-release-train)

[PR Discipline](#pr-discipline)

[Project Template Overview](#project-template-overview)

[Field Definitions](#field-definitions)

[Views to Pin](#views-to-pin)

[Automations](#automations)

[Project Template Examples](#project-template-examples)

---

# **Quick Start for Product Development**  {#quick-start-for-product-development}

1) **Create the Project**  
     
   - **Name:** `Product – {ProductName}`  
   - **Description:** One-liner objectives \+ link to product README/roadmap.

   

2) **Add fields** *(Project → Settings → Fields)*  
     
   - **Status** *(Backlog, Ready, In progress, In review, In QA, Done)*  
   - **Issue Type** *(Epic, Feature, Story, Task, Bug, Refactor, Design, Research, Chore)*  
   - \**Priority, Area, Theme, Size (number), Start Date, Deadline, Milestone (vX.Y.Z), Environment, Parent Epic, Sub-issues Progress (auto), Time (hours)*  
   - **Colours:** Use the shared palette.

   

3) **Release scaffolding**  
     
   - Create **Milestone `vX.Y.Z`** (next train).  
   - Add target **Features/Stories** to that milestone.

   

4) **Wire automations** *(Project → Settings → Workflows)*  
     
   - **Auto-add** new items → `Status = Backlog`  
   - When **Assignee** is set → `Status = In progress`  
   - On **PR opened (linked)** → `Status = In review`  
   - On **label `status:needs-qa`** → `Status = In QA`  
   - On **issue closed / PR merged** → `Status = Done`

   

5) **Pin core views**  
     
   - **Release Gate — vX.Y.Z**: `Milestone = vX.Y.Z`; group **Issue Type**  
   - **Tech Debt**: `Issue Type IN (Refactor, Chore)` or `Area = Build & CI`  
   - **Roadmap**: group **Milestone** (or **Iteration**); bars **Start Date → Deadline**  
   - **Backlog — Table**: `Status = Backlog`; sort **Priority desc**, **Size asc**  
   - **Epic Drill-down**: group **Parent Epic**; show **Sub-issues Progress**  
   - **Epics (Tracking) — Table**: `Issue Type = Epic`; group **Milestone/Release**  
   - **Epics — Roadmap** and **Epics — Board (Milestone/Release)** *(optional, presentation)*

   

6) **PR templates**  
     
   - **Feature PR:** link Story/Epic; AC, screenshots/GIFs, tests, docs/changelog stub.  
   - **Release PR:** collate merged PRs; version bump; changelog; smoke-test matrix; rollback plan.  
   - **Hotfix PR:** target release branch; tests; short QA; tag patch; back-merge to main.

   

7) **Cut process**  
     
   - **Freeze** (24–48h) → **Smoke test** critical paths → **Release PR** → **Tag** `vX.Y.Z` → **Publish notes**.

   

8) **Optional iteration field**  
     
   - Add **Iteration** and use `iteration:@current` in a sprint execution board.  
   - Optional rule: if `Milestone = vX.Y.Z` **and** `Iteration = @current` → set `Status = In progress`.

   

9) **Guardrails**  
     
   - Every PR **must link** to a Project item (keeps status honest).  
   - Keep PRs small; CI green before review; squash on merge unless history matters.

**Done when:** Fields present, milestone ready, automations tested, views pinned, PR templates referenced in README, first Epic/Features in scope and linked.

---

# **Release Cadence** {#release-cadence}

Make releases boring and predictable. Keep scope inside the milestone; move stragglers to the next train.

## **Minors — monthly target**

- **Plan:** Create milestone `vX.Y.0`. Add scoped Features/Stories.  
- **Views:** Pin **Release Gate — vX.Y.0** (filter by milestone; group by Issue Type).

## **Patches — as needed**

- **Trigger:** Critical defect or urgent fix.  
- **Milestone:** `vX.Y.Z+1` for the patch.  
- **Flow:** Hotfix PR → QA on staging → merge → tag → release notes.

## **Milestones — the anchor**

- Use `vX.Y.Z` to group work, forecast, and generate changelogs.  
- Each issue in scope must have the milestone set.  
- Keep **Roadmap** grouped by **Milestone** (or **Iteration**) with bars **Start Date → Deadline**.

## **Cut — freeze, verify, ship**

- **Code freeze:** Short window (e.g., 24–48h) for stabilisation.  
- **Smoke test:** Critical paths (auth, purchase, settings).  
- **Release PR:** Aggregate changes; final review.  
- **Tag & Notes:** Tag `vX.Y.Z`; publish release notes (highlights, breaking changes, upgrade steps).

---

# **Branching Strategy for Release Train** {#branching-strategy-for-release-train}

**Default:** `develop` as integration branch; **`main` is always stable**.   
[Full list of Branch Prefixes for Product Development projects](?tab=t.1vtv9nlx4b6)  
Build features into `develop`, stabilise on a `release/vX.Y.Z` branch, then **Release PR → `main`**, **tag**, and **back‑merge**.

## **Rationale**

- Supports predictable release trains (vX.Y.Z) and multi‑team parallelism.  
- Keeps `main` deployable and production‑stable at all times.  
- Aligns with PR discipline (Feature, Release, Hotfix) and milestone views.

## **Branch Types & Naming**

Format: `{type}/{scope}-{short-title}`

- `feat/` — new capability (e.g., `feat/product-grid-quick-add`)  
- `fix/` — defect fix (e.g., `fix/coupon-total-miscalc`)  
- `refactor/` — internal rework, no behaviour change (e.g., `refactor/split-bundle`)  
- `chore/`, `docs/`, `perf/`, `ci/`, `test/`  
- `release/vX.Y.Z` — release stabilisation branch (e.g., `release/v1.6.0`)  
- `hotfix/<slug>` — production patch (e.g., `hotfix/csrf-cart-endpoint`)

Enforce naming via CI; require each PR to link a Project item and milestone where relevant.

## **Normal Flow**

1. **Branch** from `develop` (`feat/`, `fix/`, `refactor/`, etc.).  
2. **PR (Feature PR)** → target `develop`; CI green; 1–2 reviewers; design review when UI changes.  
3. **Merge** (squash). Repeat until scope for the next release is ready.  
4. **Cut** `release/vX.Y.Z` from `develop` for stabilisation and QA.  
5. **Release PR → `main`** from `release/vX.Y.Z`; include changelog and test matrix.  
6. **Tag** `vX.Y.Z` on `main` after merge; deploy.  
7. **Back‑merge `main → develop`** to carry hotfixes/misc merges forward.

## **Hotfix Flow**

1. **Branch** `hotfix/<slug>` from `main`.  
2. **PR → `main`**; minimal fix; CI green; at least one review.  
3. **Tag** a patch (e.g., `vX.Y.Z+1`) and deploy.  
4. **Back‑merge** `main → develop` and **cherry‑pick** to any open `release/` if needed.

## **Environments (Typical Mapping)**

- **Prototype** → experimental builds (optional).  
- **Staging** → from `release/vX.Y.Z` (preferred) or `develop` for early testing.  
- **Live** → from `main` (tagged releases).

## **Versioning & Releases**

- **SemVer:** `MAJOR.MINOR.PATCH` (vX.Y.Z).  
- Each release has a **milestone**; the **Release Gate** view tracks scope and readiness.  
- Produce **release notes**: highlights, fixes, breaking changes, upgrade steps.

## **Protections**

- Protect **`main`** and **`develop`**: PRs required, 1–2 approvals, passing checks, up‑to‑date before merge, squash‑only, dismiss stale reviews.  
- Optionally protect **`release/*`** during code freeze.  
- Require **linked Project item** and **milestone** for Feature/Release PRs.

## **Checklists**

**Feature PR:** link Story/Epic, AC, screenshots/GIFs, tests, docs/changelog stub.  
**Release PR:** merged PR list, version bump, changelog, migration notes, smoke‑test matrix, rollback plan.  
**Hotfix PR:** repro & root cause, focused fix, tests, fast QA, tag, back‑merge.

## **Examples**

- `feat/product-grid-quick-add`  
- `refactor/split-frontend-bundle`  
- `release/v1.6.0`  
- `hotfix/cart-csrf-check`

---

# **PR Discipline** {#pr-discipline}

Use three PR types. Keep PRs small, linked to a Project item, and green in CI before review.

## **Feature PR**

- **When:** New capability or significant enhancement.  
- **Checklist:** Link to Story/Epic; include AC; screenshots/GIFs; tests; docs/changelog stub.  
- **Review:** 1–2 reviewers; request design review if UI/UX changes.

## **Release PR**

- **When:** Preparing to ship a milestone (or hotfix rollup).  
- **Checklist:** Scoped list of merged PRs; version bump; full changelog; migration notes; test matrix; rollback plan.  
- **Review:** Tech lead \+ QA sign-off; **Status → In review** then **In QA** via rules.

## **Hotfix PR**

- **When:** Critical fix against the release branch.  
- **Checklist:** Clear repro & root cause; targeted fix; risk notes; tests; quick QA plan.  
- **Fast-track:** Bypass sprint, but still require at least one review and CI green.  
- **Post-merge:** Tag patch version; update release notes; back-merge to main if needed.

## **General rules**

- **Size:** Prefer \<400 LOC change sets; split large changes.  
- **Linkage:** Every PR must link a Project item (auto-moves status via rules).  
- **Quality:** CI green before review; no red merges.  
- **Commits:** Descriptive messages; squash on merge unless you need history.

---

# **Project Template Overview** {#project-template-overview}

## **Purpose**

Run a predictable release train for internal products (e.g., LSX Design, Tour Operator plugin, design system, platform R\&D).

## **Status Columns**

Backlog → Ready → In progress → In review → In QA → Done

## **Project Fields**

- **Status** (single select): Backlog, Ready, In progress, In review, In QA, Done  
- **Issue Type** (single select): Epic, Feature, Story, Task, Bug, Refactor, Design, Research, Chore  
- **Priority** (single select): P0 (Critical), P1 (High), P2 (Medium), P3 (Low)  
- **Milestone / Release** (milestone or text): `vX.Y.Z`  
- **Iteration (Sprint)** (iteration): optional two‑week cadence  
- **Theme** (single select): e.g., Performance, DX, Editor UX, Commerce  
- **Area** (single select): Frontend, Backend, Build & CI, Docs, A11y, Analytics  
- **Size** (number): story points or t‑shirt size mapped to a number  
- **Start Date** (date), **Deadline** (date)  
- **Parent Epic** (text or linked reference)  
- **Sub‑issues Progress** (number or progress)

## **Views to pin**

- **Release Gate — vX.Y.Z**: `Milestone = vX.Y.Z`; group by **Issue Type**; release focus.  
- **Tech Debt**: `Issue Type IN (Refactor, Chore)` or `Area = Build & CI`; plan refactors.  
- **Roadmap**: timeline grouped by **Milestone** (or **Iteration**), bars **Start → Deadline**.  
- **Backlog — Table**: `Status = Backlog`; sort **Priority desc**, **Size asc**; grooming.  
- **Epic Drill-down**: group by **Parent Epic**; show **Sub-issues Progress**.  
- **Epics (Tracking) VIEW**: `Issue Type = Epic`; group by **Milestone** (or **Theme**).

## **Automations**

- Auto‑add new items to this Project → **Status=Backlog**  
- When **Assignee** is set → **Status=In progress**  
- On **PR opened** linked to item → **Status=In review**  
- On **Issue closed/PR merged** → **Status=Done**  
- When label **status:needs-qa** is added → **Status=In QA**

## **Release Cadence**

- **Minor releases:** Monthly target  
- **Patches:** As needed  
- **Milestones:** Named `vX.Y.Z` and used to track scope and dates  
- **Cut:** Code freeze before release; smoke test; tag; publish notes

## **PR Discipline**

- **Feature PR:** For net‑new capability; link to Story/Epic; checklist included  
- **Release PR:** Aggregates completed work; changelog updated; version bump  
- **Hotfix PR:** Critical fixes against the release branch; fast‑track QA  
- Keep PRs small, reviewed, and linked to a Project item

## **Definition of Ready (DoR) — Checklist**

- [ ] Problem, rationale, and success metric stated  
- [ ] Acceptance criteria (Given/When/Then)  
- [ ] Design/spec attached (where needed)  
- [ ] Dependencies mapped; rollout/flags planned  
- [ ] Test approach and risk noted  
- [ ] Estimate added (Size and/or hours)  
- [ ] Milestone/Iteration assigned

## **Definition of Done (DoD) — Checklist**

- [ ] All acceptance criteria met  
- [ ] Tests added/updated; CI green  
- [ ] A11y, performance, and security checks  
- [ ] Docs and changelog updated  
- [ ] Version bump (where required)  
- [ ] QA pass on staging  
- [ ] Release notes drafted; monitors/alerts set

---

# **Field Definitions** {#field-definitions}

**Shared conventions:**  
Use this shared set across projects for consistent reporting. **Theme** values below are product-oriented.

- **Fields:** Priority, Area, Theme, Size, Start Date, Deadline, Milestone, Environment, Parent Issue, Sub-issues Progress, Time (hours).  
- **Colours:** Grey \#6E7781 · Blue \#58A6FF · Green \#3FB950 · Yellow/Amber \#D29922 · Orange \#DB6D28 · Red \#F85149 · Pink \#DB61A2 · Purple \#A371F7  
- **Tracking \= a View, not a Status:** Keep status purely lifecycle. Show Epics and roll-ups in an **Epics (Tracking)** view.  
- **One Issue Type per issue.** Use labels sparingly for cross-repo filters; prefer **Project fields** first.

---

## **Short Description**

A release-train framework for internal product and plugin development. Enables consistent versioning, milestone tracking, and feature delivery across teams with built-in automation for code reviews, QA, and release management.

## **Project README**

```
## Purpose
Run a release train for LSX/TO with clear milestones and PR discipline.

## Release cadence
Target monthly minors; patch as needed. Milestones: vX.Y.Z. Sprints optional (Iteration field).

## Views
Release Gate (filter by Milestone), Epic drill-down, Tech Debt (Refactor/Build & CI), Roadmap.

## PR discipline
Use pr_release.md for shipping, pr_hotfix.md for urgent fixes, pr_feature.md for features. Keep Global DoD checklist.

## Automations
Same as client template + Projects Bot label↔field sync.
```

## **Status & Colours**

**Board columns**  
Self-explanatory status lines with colour for the single-select option (Keep colours consistent with Client Delivery project template for cross-project reporting):

- **Backlog** — Grey (\#6E7781): Not started; awaiting prioritisation and grooming.  
- **Ready** — Blue (\#58A6FF): Meets DoR; groomed and prioritised, not yet scheduled.  
- **In progress** — Orange (\#DB6D28): Assigned and actively being worked on.  
- **In review** — Purple (\#A371F7): Awaiting peer review (code/design); changes may be requested.  
- **In QA** — Yellow/Amber (\#D29922): Internal QA on staging; validating acceptance criteria and edge cases. Defects return to **In progress**.  
- **Done** — Green (\#3FB950): Meets the Definition of Done; approved and released or ready to release.

**Nice-to-have automations**

- When **Milestone \= next release** *and* **Iteration \= current** → **Status \= In progress** (or **Todo** if you decide to add it)  
- On **PR opened** → **Status \= In review** · **Merge/close** → **Done**

## **Issue Type**

Use one per issue; colours help scanning.

- **Epic** — Purple (\#A371F7): Parent that groups Stories/Tasks/Bugs to deliver a larger client outcome; defines scope, KPIs, and timeframe; progress rolls up from child issues.  
- **Story** — Blue (\#58A6FF): User-centred increment within an Epic; demo-able; acceptance criteria define done; aimed at UAT/release.  
- **Task** — Grey (\#6E7781): Small, well-scoped delivery item (config/content/implementation); typically ≤2 days.  
- **Bug** — Red (\#F85149): Defect or incorrect behaviour with repro steps; prioritise, fix, and verify in staging/UAT.  
- **Chore** — Yellow/Amber (\#D29922): Light housekeeping/unblocking work (repo/admin/automation tweaks) requiring minimal planning.  
- **Design** — Pink (\#DB61A2): Design artefacts and decisions (flows, Figma, tokens); ends with clear developer handoff.  
- **Research** — Orange (\#DB6D28): Time-boxed investigation; state the question, approach, findings, and recommendation.

## **Issue Types**

- **Epic** — Purple (\#A371F7): Parent grouping multiple issues toward a product objective; defines scope, KPIs, and timeframe.  
- **Feature** — Green (\#3FB950): Net-new capability or significant enhancement; spec → build → review → QA → rollout.  
- **Story** — Blue (\#58A6FF): Vertical slice of a Feature/Epic; demo-able; acceptance criteria define done.  
- **Task** — Grey (\#6E7781): Small, concrete engineering work (config/docs/minor UI); typically ≤2 days.  
- **Bug** — Red (\#F85149): Defect or regression; include tests; capture user-visible changes in release notes.  
- **Refactor** — Yellow/Amber (\#D29922): Internal code improvement with no behaviour change; pays down debt; maintain test parity.  
- **Design** — Pink (\#DB61A2): Design system/tokens/components work; documents decisions and provides developer handoff.  
- **Research** — Orange (\#DB6D28): Research/PoC to de-risk decisions; document findings and next steps.  
- **Chore** — Grey (\#6E7781): Tiny hygiene tasks (lint/format/CI/repo admin) that keep repos healthy.

## **Priority**

Signals urgency and impact at a glance. Set during triage; one value per item.

- **P0 – Critical** — Red (\#F85149): Blocking defect, security issue, or release blocker; swarm immediately.  
- **P1 – Important** — Orange (\#DB6D28): High impact work targeted for the current or next release.  
- **P2 – Normal** — Blue (\#58A6FF): Planned roadmap work; schedule normally.  
- **P3 – Minor** — Green (\#3FB950): Low impact or tech-debt tidy-ups; batch where possible.

## **Area**

Primary functional area to aid ownership and reporting.

- **Frontend** — Blue (\#58A6FF): UI, blocks, patterns, theme.json, CSS.  
- **Backend** — Green (\#3FB950): PHP, plugins, APIs, data, cron.  
- **Build & CI** — Yellow/Amber (\#D29922): Tooling, pipelines, bundling, tests.  
- **DevOps** — Grey (\#6E7781): Infra, provisioning, releases, monitoring.  
- **Design** — Purple (\#A371F7): Tokens, components, Figma handoff.  
- **Analytics** — Pink (\#DB61A2): Telemetry, GA4, GTM, product analytics.  
- **A11y** — Purple (\#A371F7): Accessibility standards and fixes.

## **Theme**

Strategic product initiative. Keep stable across releases for clean reporting.

- **Design System** — Green (\#3FB950): Tokens, variables, components, theming.  
- **Performance** — Orange (\#DB6D28): CWV, build size, runtime optimisation.  
- **Editor UX** — Purple (\#A371F7): Authoring flows, block ergonomics, onboarding.  
- **Block Theme** — Blue (\#58A6FF): Templates, parts, patterns, theme architecture.  
- **Configuration** — Grey (\#6E7781): Settings, feature flags, environment toggles.

## **Environment**

Where the work is verified or will land.

- **Localhost** — Grey (\#6E7781): Developer local environment; pre-commit checks.  
- **Prototype** — Purple (\#A371F7): Experimental builds and previews.  
- **Staging** — Yellow/Amber (\#D29922): Pre-release; regression & performance suites.  
- **Live** — Green (\#3FB950): Production; canary/full rollout validation.

## **Size**

Relative effort for forecasting. Map T-shirt sizes to numbers (e.g., XS=1, S=2, M=3, L=5, XL=8).

## **Start Date**

Planned start of work; aligns with sprint or release planning.

## **Deadline**

Target completion date; used for release readiness tracking.

## **Milestone**

Release anchor (e.g., **vX.Y.Z**). Use to track scope, changelog, and dates per release.

## **Parent Issue**

Link to the **Epic** this work rolls up to. Required for release forecasting and roadmap grouping.

## **Sub-issues Progress**

Auto-calculated completion across child issues on the parent (read-only in Projects).

## **Time (hours)**

Numeric estimate for planning and tracking. Prefer consistent estimation rules across the product.

---

# **Views to Pin** {#views-to-pin}

**Setup Tips:**  
Use these short setup recipes to pin consistent, high-signal views on each Project. Create a view, apply the filter(s), grouping, and sort, then **Save & Pin**.

- Create a view via **\+ View → Table / Board / Roadmap**, then add **Filters**, **Group by**, **Sort**, and **Columns**; **Save** and **Pin** it.  
- For sprint boards, add an **Iteration** field and filter `iteration:@current` to show only current-cycle work.  
- Keep colours and field values shared across templates so saved searches and dashboards stay consistent.

**Recommended pinned views:**  
Below are the recommended pinned views with clear setup instructions. Use these consistently to keep release planning predictable and visible.

---

## **Epics (Tracking) — Table**

- **Purpose:** “Epics only” roll-up for release planning and slip detection.  
- **Why:** Keeps epic monitoring separate from story/task workflow to protect flow metrics.  
- **Filter:** `Issue Type = Epic`  
- **Layout:** Table  
- **Show fields:** Priority, Milestone/Release, Theme, Area, Deadline, Sub-issues Progress, Assignees  
- **Group by:** Milestone/Release  
- **Sort:** Deadline ascending (then Sub-issues Progress ascending)

## **Epics — Roadmap**

- **Purpose:** Visualise release trains and epic landing dates.  
- **Why:** Aligns teams on what’s shipping in **vX.Y.Z** and what rolls to the next train.  
- **Filter:** `Issue Type = Epic` *(optionally `Status != Done`)*  
- **Layout:** Roadmap  
- **Show fields:** Milestone/Release, Deadline  
- **Group by:** Milestone/Release *(or Iteration if you run sprints)*  
- **Bars:** **Start Date → Deadline**  
- **Sort:** Deadline ascending

## **Epics — Board (Milestone/Release)**

- **Purpose:** Presentation-friendly clustering of epics by release.  
- **Why:** Quick read for leadership on release scope without changing status.  
- **Filter:** `Issue Type = Epic`  
- **Layout:** Board  
- **Show fields (on cards):** Priority, Sub-issues Progress, Deadline, Assignees  
- **Columns (group by):** Milestone/Release  
- **Sort:** Deadline ascending  
- **Note:** Treat as a read‑only view; manage status on the normal team board.

## **Release Gate — vX.Y.Z**

- **Purpose:** Single focus for a specific release train.  
- **Why:** Makes scope and cut criteria explicit; simplifies go/no‑go decisions.  
- **Layout:** Table *(or Roadmap)*  
- **Filter:** `Milestone = vX.Y.Z`  
- **Group by:** Issue Type  
- **Sort:** Priority (desc), Updated (desc)  
- **Show fields:** Status, Priority, Area, Environment, Sub-issues Progress  
- **Variation (Roadmap):** Group by **Status**; bars **Start Date → Deadline** to visualise the cut.

## **Tech Debt**

- **Purpose:** Plan and pay down refactors and CI/build work.  
- **Why:** Keeps the codebase healthy and feature‑ready; avoids dragging debt across trains.  
- **Layout:** Table  
- **Filter:** `Issue Type IN ("Refactor","Chore") OR Area = "Build & CI"`  
- **Group by:** Area  
- **Sort:** Priority (desc)  
- **Show fields:** Issue Type, Priority, Area, Milestone, Assignees

## **Roadmap**

- **Purpose:** Forward plan across sprints/releases.  
- **Why:** Shows landing sequence and capacity fit for upcoming trains.  
- **Layout:** Roadmap  
- **Filter:** *(optional)* `Status != Done`  
- **Group by:** Milestone *(or Iteration)*  
- **Bars:** **Start Date → Deadline**  
- **Show fields:** Priority, Issue Type, Sub-issues Progress

## **Backlog — Table**

- **Purpose:** Grooming and prioritisation for upcoming releases.  
- **Why:** Maintains a high‑signal queue for the next train.  
- **Layout:** Table  
- **Filter:** `Status = Backlog`  
- **Group by:** Theme *(to keep strategic focus)*  
- **Sort:** Priority (desc), Size (asc)  
- **Show fields:** Priority, Size, Theme, Area, Parent Epic

---

# **Automations** {#automations}

Mirror Client Delivery rules to keep flow accurate; add release-aware tweaks if needed.

## **Auto-add new items → Status \= Backlog**

- **Setup:** Workflows → **Auto-add to project** (select repos) → **On add** set: `Status = Backlog`, optionally `Milestone = next` and default `Priority = P2`.

## **When Assignee is set → Status \= In progress**

- **Setup:** Rule: *When field changes* → `Assignees` **is not empty** → `Status = In progress`.

## **On PR opened (linked) → Status \= In review**

- **Setup:** Rule: *When field changes* → `Linked pull requests` **is not empty** → `Status = In review`.

## **On Issue closed / PR merged → Status \= Done**

- **Setup:** Two rules (issue closed → Done; PR merged → Done).

## **When label `status:needs-qa` is added → Status \= In QA**

- **Setup:** Projects “labeled” trigger if available, else the same **GitHub Action** shown in the Client Delivery section.

Optional rule (release-aware): *When* `Milestone = vX.Y.Z` **and** `Iteration = @current` → set `Status = In progress`.

---

# **Project Template Examples** {#project-template-examples}

## **Per-type labelling patterns (examples)**

Use these as **default field selections** when triaging by **Issue Type (Type field)**.  
(Labels may mirror these fields for cross-repo filters, but choose the **fields first**.)

- **Feature** — *New block variation for Product Grid*  
    
  - Priority: **P1 – Important**  
  - Area: **Frontend**  
  - Theme: **Block Theme**  
  - Environment: **Staging → Live**  
  - Milestone: **v1.6.0**  
  - Parent: Epic **“Product Grid Enhancements”**


- **Story** — *Add “Quick Add to Cart” interaction*  
    
  - Priority: **P2 – Normal**  
  - Area: **Frontend**  
  - Theme: **Editor UX**  
  - Environment: **Staging**  
  - Milestone: **v1.6.0**  
  - Parent: Epic **“Checkout Acceleration”**


- **Bug** — *Cart total miscalculation on coupons*  
    
  - Priority: **P0 – Critical**  
  - Area: **Backend**  
  - Theme: **Performance**  
  - Environment: **Live (hotfix)**  
  - Milestone: **v1.5.1**  
  - Parent: Epic **“Stability & Accuracy”**


- **Refactor** — *Split monolithic JS bundle*  
    
  - Priority: **P2 – Normal**  
  - Area: **Build & CI**  
  - Theme: **Performance**  
  - Environment: **Staging**  
  - Milestone: **v1.7.0**  
  - Parent: Epic **“Build Optimisation”**


- **Design** — *Tokens: spacing scale update*  
    
  - Priority: **P2 – Normal**  
  - Area: **Design**  
  - Theme: **Design System**  
  - Environment: **Prototype**  
  - Milestone: **v1.6.0**  
  - Parent: Epic **“Token Unification”**


- **Research** — *Evaluate Playwright vs. Cypress for E2E*  
    
  - Priority: **P2 – Normal**  
  - Area: **Analytics** (or **Build & CI**, depending on focus)  
  - Theme: **Configuration**  
  - Environment: **Prototype**  
  - Milestone: **None / TBC**  
  - Parent: Epic **“Quality Infrastructure”**

---

## **Per-area labelling patterns (examples)**

Defaults driven by the **Area** field to speed routing. Adjust **Priority** and **Theme** based on impact and release goals.

- **Frontend** — *Refactor Button block to use tokens*

  - Typical Type: **Story / Feature**  
  - Theme: **Block Theme**  
  - Env: **Staging**  
- **Backend** — *Harden REST endpoint auth for orders*

  - Typical Type: **Task / Bug**  
  - Theme: **Configuration**  
  - Env: **Staging → Live**


- **Build & CI** — *Enable incremental builds and cache restore*

  - Typical Type: **Refactor / Chore**  
  - Theme: **Performance**  
  - Env: **Staging**


- **DevOps** — *Rotate TLS certs and update HSTS*

  - Typical Type: **Task / Chore**  
  - Theme: **Configuration**  
  - Env: **Live** (with change window)


- **Design** — *Define typography modes for dark/light*

  - Typical Type: **Design / Story**  
  - Theme: **Design System**  
  - Env: **Prototype**

- **Analytics** — *Add GA4 custom events for checkout steps*

  - Typical Type: **Task / Research**  
  - Theme: **Configuration**  
  - Env: **Staging**

---

## **Per-theme labelling patterns (examples)**

Examples where **Theme \= Design System**. Keep the theme stable across releases to track investment and progress.

- **Feature** — *Introduce colour tokens with semantic roles*

  - Area: **Design**  
  - Priority: **P1**  
  - Env: **Prototype**  
  - Milestone: **v1.6.0**


- **Story** — *Migrate Alert component to tokens \+ modes*

  - Area: **Frontend** · Priority: **P2**  
  - Env: **Staging**  
  - Milestone: **v1.6.0**  
  - Parent: Epic **“Token Unification”**

- **Refactor** — *Remove hard-coded spacing; adopt spacing scale*

  - Area: **Frontend**  
  - Priority: **P2**  
  - Env: **Staging**  
  - Milestone: **v1.7.0**


- **Design** — *Figma variables: typography scale & ramps*

  - Area: **Design**  
  - Priority: **P2**  
  - Env: **Prototype**  
  - Milestone: **v1.6.0**


- **Bug** — *Token mis-map causing dark-mode contrast failures*

  - Area: **Frontend**  
  - Priority: **P1**  
  - Env: **Staging → Live (hotfix if needed)**  
  - Milestone: **v1.5.2**


- **Research** — *Map WooCommerce defaults to system tokens*

  - Area: **Design**  
  - Priority: **P2**  
  - Env: **Prototype**  
  - Milestone: **None / TBC**  
  - Output: comparison table \+ proposal

---

