# **Client Delivery Project Template**

## *Scrumban \+ UAT*

***Version:*** 1.3 • ***Last updated:*** 9 Oct 2025  
---

[Quick Start for Client Delivery](#quick-start-for-client-delivery)

[Project Cadence](#project-cadence)

[Branching Strategy for Scrumban \+ UAT](#branching-strategy-for-scrumban-+-uat)

[PR Discipline](#pr-discipline)

[Project Template Overview](#project-template-overview)

[Field Definitions](#field-definitions)

[Views to Pin](#views-to-pin)

[Automations](#automations)

[Naming & Intake Hygiene](#naming-&-intake-hygiene)

[Project Template Examples](#project-template-examples)

---

# **Quick Start for Client Delivery** {#quick-start-for-client-delivery}

1) **Create the Project**  
   - **Name:** `Client – {ClientName}`  
   - **Description:** One-liner scope \+ link to contract/brief.

   

2) **Add fields** *(Project → Settings → Fields)*  
   - **Status** *(Backlog, Todo, In progress, In review, In QA, Done)*  
   - **Issue Type** *(Epic, Story, Task, Bug, Chore, Design, Research)*  
   - \**Priority, Area, Theme, Size (number), Start Date, Deadline, Milestone, Environment, Parent Issue, Sub-issues Progress (auto), Time (hours)*  
   - **Colours:** Use the shared palette.

   

3) **Set statuses (board columns)**  
   - Use **Todo** (not “Ready”) to mean **committed this cycle**.  
   - Keep “Tracking” as a **view**, not a status.

   

4) **Wire automations** *(Project → Settings → Workflows)*  
   - **Auto-add** new items → `Status = Backlog`  
   - When **Assignee** is set → `Status = In progress`  
   - On **PR opened (linked)** → `Status = In review`  
   - On **label `status:needs-qa`** → `Status = In QA`  
   - On **issue closed / PR merged** → `Status = Done`

   

5) **Pin core views**  
   - **Board — Team Flow**: group **Assignee**, sort **Priority**  
   - **Backlog — Table**: `Status = Backlog`; sort **Priority desc**, **Size asc**  
   - **QA Gate**: `Status IN (In review, In QA)`; group **Environment**  
   - **UAT (Client)**: `Environment = Staging AND Status IN (In review, In QA)`  
   - **Roadmap**: group **Theme** (or **Area**); bars **Start Date → Deadline**  
   - **Blocked**: filter `label:status:blocked` (or “Blocked reason” set)  
   - **Epics (Tracking) — Table**: `Issue Type = Epic`; group **Theme**  
   - **Epics — Roadmap** and **Epics — Board (Theme)** *(optional, presentation)*

   

6) **Intake templates**  
   - **Epic**: outcome, KPIs, scope, risks, links to Stories/Tasks.  
   - **Story/Task**: brief, acceptance criteria (Given/When/Then), env, estimate.

   

7) **Create an “Intake” guard view**  
   - Table filter: `Status = Backlog AND (missing: Assignee OR missing: Priority OR missing: Issue Type)`  
   - Use this in weekly grooming; aim to keep it empty.

   

8) **Share the UAT view**  
   - Invite client as **read-only** (or share link); add short UAT how-to at top.

   

9) **Milestones / phases**  
   - Use **Phase-1 UAT**, **Go-Live**, etc. (or `vX.Y.Z` if versioned).  
   - Roadmap grouped by Milestone helps expectations and dates.

   

10) **Definition of Ready / Done**  
- DoR on **Backlog/Todo**; DoD on **Done**. Pin checklists in templates.

**Done when:** Fields present, automations tested, views pinned, UAT view shared, first Epic/Stories created and linked.

---

# **Project Cadence** {#project-cadence}

**Baseline (good as is):**

- **Grooming:** Weekly  
- **Stand-up:** Daily (focus on **Blocked**)  
- **UAT:** Weekly (e.g., Thursdays)  
- **Release:** As needed after UAT sign-off

**Optional (use if helpful):**

- **Mid-week triage:** 15 min to rebalance work / clear blockers  
- **Show-and-tell:** Fortnightly demo for stakeholders  
- **Retro:** Monthly, 30 min; capture 1–2 concrete improvements

---

# **Branching Strategy for Scrumban \+ UAT** {#branching-strategy-for-scrumban-+-uat}

**Default:** **Main-only** for speed and clarity.   
[Full list of Branch Prefixes for Client Delivery projects](?tab=t.jm9bg26nolue)  
Work on short-lived branches → open PRs → merge to `main` (kept stable). Use **UAT on Staging** before go‑live. Enable a `develop` branch **only** when concurrent streams or longer stabilisation phases demand it.

## **Rationale**

- Avoids ceremony: less overhead for engagements and migrations.  
- Keeps a single source of truth (`main`) that mirrors Staging/Live.  
- Aligns with PR discipline (Implementation, Release, Hotfix) and UAT cadence.

## **Branch Types & Naming**

Use lowercase prefixes to drive clarity and automation.  
Format: `{type}/{scope}-{short-title}`

- `feat/` — new capability (e.g., `feat/express-checkout`)  
- `fix/` — defect fix (e.g., `fix/nl-postcode-validation`)  
- `chore/` — repo hygiene (e.g., `chore/enable-webhook-logs`)  
- `refactor/` — internal rework without behaviour change (e.g., `refactor/split-cart-module`)  
- `docs/`, `perf/`, `ci/` as needed  
- `hotfix/` — critical live fix (e.g., `hotfix/checkout-timeout`)

Enforce with a branch‑name regex in CI and require PRs to link a Project item.

## **Normal Flow (Main‑only)**

1. **Branch** from `main` using an appropriate prefix.  
2. **PR (Implementation PR)** → target `main`; link to Story/Epic; CI must be green; include UAT notes.  
3. **Review** (1–2 reviewers; add design where UI changes).  
4. **Merge** (squash). Auto‑deploy to **Staging** (if configured).  
5. **UAT** on Staging (use the UAT view). Address findings via new branches/PRs.  
6. **Release PR** to promote Staging → Live (scope list, backups, rollback).  
7. **Go‑live**; tag if versioned (optional for client repos).

## **Hotfix Flow**

1. **Branch** `hotfix/<slug>` from `main`.  
2. **PR → main**; minimal change; CI green; at least one review.  
3. **Merge**; deploy; **tag** a patch if you version.  
4. **Back‑merge**: if a `develop` or long‑lived release branch exists, merge `main` back to it.

## **Optional: Integrator Branch (`develop`) — Use When Needed**

Enable **only** if you have many parallel streams or require stabilisation before go‑live.

- **Feature PRs** target `develop`.  
- Cut `release/<phase>` to stabilise; open **Release PR** to `main` for go‑live.  
- After merge, **back‑merge `main → develop`**.

If in doubt, prefer **Main‑only** for client delivery.

## **Environments (Typical Mapping)**

- **Localhost** → dev work and checks.  
- **Staging** (from `main` or release branch) → UAT and regression.  
- **Live** (from `main`) → production.

## **Protections**

- Protect **`main`**: PRs required, 1–2 approvals, passing checks, up‑to‑date before merge, squash‑only, dismiss stale reviews.  
- If `develop` exists: apply the same protections.  
- Require **linked Project item**; block merges with failing status checks.

## **Checklists**

**Implementation PR:** link Story/Epic, restate AC, screenshots/GIFs, tests, UAT notes (where/how), docs snippet.  
**Release PR:** merged scopes, UAT sign‑off link, changelog, backups, cache/CDN plan, monitoring & rollback.  
**Hotfix PR:** incident/ref, root cause & risk, focused fix, quick QA, tag & back‑merge.

## **Examples**

- `feat/payments-paypal-express`  
- `fix/checkout-totals-after-shipping-change`  
- `refactor/cart-module-split`  
- `hotfix/ga4-purchase-event-duplicate`

---

# **PR Discipline** {#pr-discipline}

Use three core PR types. Keep PRs small, linked to a Project item, and green in CI before review. Always state **where to test** (Prototype/Staging/Live) and include UAT notes for the client.

## **Implementation PR (Story/Task)**

**When:** User-facing changes or configuration that fulfil a Story/Task.  
**Checklist:**

- Link to **Story/Epic**; restate **acceptance criteria**.  
- Screenshots/GIFs of key states; note **a11y** considerations.  
- **Environment:** where to test (Staging URL) \+ any **feature flags**.  
- Tests where relevant (unit/functional/smoke).  
- Docs/client notes (brief **release note** snippet).  
  **Review:** 1–2 reviewers (dev \+ design if UI). PR open → **Status \= In review** via rule.

## **Release PR**

**When:** Promoting a batch from Staging to Live (phase cut or go-live).  
**Checklist:**

- Scoped list of merged PRs included in this release.  
- Evidence of **UAT sign-off** (link to comment, checklist, or ticket).  
- Version/tag or deploy reference; **changelog** and **migration notes**.  
- **Go-live checklist:** backups, cache/CDN plan, SEO redirects (if any).  
- **Monitoring/rollback** plan (what to watch, how to revert).  
  **Review:** Tech lead \+ PM (and client approver if required). **Status → In review → In QA** via rules; validate on **Live** post-merge.

## **Hotfix PR**

**When:** Critical defect on Live (checkout broken, data loss, security).  
**Checklist:**

- Incident/reference, **root cause** summary, and risk note.  
- Small, targeted fix; include tests or a reproducible check.  
- **Change window** noted; comms to stakeholders prepared.  
- **Back-merge** to main/release branches as needed.  
  **Fast-track:** Minimum one reviewer; CI must be green.  
  **Post-merge:** Tag/record patch, update release notes, verify on **Live**.

## **Content/Config PR (optional)**

**When:** Safe configuration/content changes in repo (e.g., `theme.json`, redirects, CMS schema export).  
**Checklist:** Scope, impact, revert steps, and a short **Staging** test plan.  
**Review:** 1 reviewer; QA on **Staging** before release.

## **General rules**

- **Size:** Prefer \<400 LOC; split large changes into reviewable chunks.  
- **Linkage:** Every PR must link a **Project item** (auto-moves status via rules).  
- **Quality:** CI green before review; no red merges.  
- **Commits:** Descriptive messages; squash on merge unless history matters.  
- **UAT notes:** Each PR includes “How to verify on Staging” steps.  
- **A11y:** Call out accessibility impacts in UI-touching PRs.

---

# **Project Template Overview** {#project-template-overview}

## **Purpose**

Track client work from intake to UAT and release with a lean Scrumban flow. Suitable for new builds, retainers, migrations, and editorial rollouts.

## **Status Columns**

Backlog → Ready → In progress → In review → In QA → Done

## **Project Fields**

- **Status** (single select): Backlog, Ready, In progress, In review, In QA, Done  
- **Issue Type** (single select): Epic, Story, Task, Bug, Chore, Design, Spike  
- **Priority** (single select): P0 (Critical), P1 (High), P2 (Medium), P3 (Low)  
- **Area** (single select): e.g., Frontend, Backend, Content, A11y, Analytics  
- **Theme** (single select): e.g., Checkout, Performance, Editor UX  
- **Size** (number): story points or t‑shirt size mapped to a number  
- **Start Date** (date)  
- **Deadline** (date)  
- **Milestone** (text or milestone)  
- **Environment** (single select): Prototype, Staging, Live  
- **Parent Issue** (text or linked reference)  
- **Sub‑issues Progress** (number or progress)  
- **Time (hours)** (number)

## **Views to pin**

- **Board — Team Flow**: group by **Assignee**, sort by **Priority**; daily stand-up view.  
- **Backlog — Table**: `Status = Backlog`; sort **Priority desc**, **Size asc**; grooming.  
- **QA Gate**: `Status IN (In review, In QA)`; group by **Environment**; tester pull list.  
- **UAT (Client)**: `Environment = Staging AND Status IN (In review, In QA)`; client testing.  
- **Roadmap**: timeline grouped by **Theme** (or **Area**), bars **Start → Deadline**.  
- **Blocked**: saved filter (label or field indicates blocked); escalations.  
- **Epic Drill-down**: group by **Parent Issue**; show **Sub-issues Progress**.  
- **Epics (Tracking) VIEW**: `Issue Type = Epic`; group by **Theme**; roll-up progress.

## **Automations**

- Auto‑add new items to this Project → **Status=Backlog**  
- When **Assignee** is set → **Status=In progress**  
- On **PR opened** linked to item → **Status=In review**  
- On **Issue closed/PR merged** → **Status=Done**  
- When label **status:needs-qa** is added → **Status=In QA**

## **Naming & Intake Hygiene**

- Use consistent labels: `priority:*`, `status:*`, `area:*`  
- Name Projects: `Client – {ClientName}`  
- Milestones: `vX.Y.Z` where applicable  
- Sprints (optional): `Sprint-YYYY-WW`  
- Each new item must have **Issue Type**, **Priority**, and **Owner** set

## **Definition of Ready (DoR) — Checklist**

- [ ] Problem statement and outcome defined  
- [ ] Acceptance criteria written (Given/When/Then)  
- [ ] Designs or references attached (if relevant)  
- [ ] Dependencies identified and unblocked  
- [ ] Estimates agreed (Size and/or hours)  
- [ ] Test approach noted (how we’ll verify)  
- [ ] Stakeholders and approver listed  
- [ ] Environment clarified (Prototype/Staging/Live)

## **Definition of Done (DoD) — Checklist**

- [ ] Acceptance criteria met  
- [ ] Unit/functional tests added or updated  
- [ ] A11y pass (key flows and components)  
- [ ] Docs updated (README/Changelog/Client notes)  
- [ ] Feature toggles/rollout considered  
- [ ] QA verified on Staging  
- [ ] UAT approved by client (if applicable)  
- [ ] Release notes prepared; monitoring in place

## **Cadence**

- **Grooming:** Weekly  
- **Stand‑up:** Daily (focus on Blocked)  
- **UAT:** Weekly (e.g., Thursdays)  
- **Release:** As needed after UAT sign‑off

---

# **Field Definitions** {#field-definitions}

**Shared conventions:**  
Use this shared set across projects for consistent reporting. Customise **Theme** values (below) for client work.

- **Fields:** Priority, Area, Theme, Size, Start Date, Deadline, Milestone, Environment, Parent Issue, Sub-issues Progress, Time (hours).  
- **Colours:** Grey \#6E7781 · Blue \#58A6FF · Green \#3FB950 · Yellow/Amber \#D29922 · Orange \#DB6D28 · Red \#F85149 · Pink \#DB61A2 · Purple \#A371F7  
- **Tracking \= a View, not a Status:** Keep status purely lifecycle. Show Epics and roll-ups in an **Epics (Tracking)** view.  
- **One Issue Type per issue.** Use labels sparingly for cross-repo filters; prefer **Project fields** first.

---

## **Short Description**

```
A structured Scrumban workflow for managing client projects from intake to UAT and release. Designed to streamline delivery, QA, and client collaboration with automated progress tracking and standardised definitions of ready and done.
```

## **Project README** 

```
## Purpose
Track client work from intake to UAT and release with a lean Scrumban flow.

## Status columns
Backlog → Ready → In progress → In review → In QA → Done

## Views
Board (by Assignee), Backlog (Priority desc), QA Gate, UAT (staging), Epic drill-down, Roadmap, Blocked.

## Automations
Auto-add new items; on assignee → In progress; on PR open → In review; on merge/close → Done; label `status:needs-qa` → In QA.

## Cadence
Weekly grooming; daily stand-up focused on Blocked; UAT every Thursday; ship as needed.
```

## **Status & Colours**

**Board columns**  
Self-explanatory status lines with colour for the single-select option (Keep colours consistent with Product Development project template for cross-project reporting):

- **Backlog** — Grey (\#6E7781): Not started; awaiting prioritisation and grooming.  
- **Todo** — Blue (\#58A6FF): Selected for this cycle and ready to start; all prerequisites met.  
- **In progress** — Orange (\#DB6D28): Assigned and actively being worked on.  
- **In review** — Purple (\#A371F7): Awaiting peer review (code/design); changes may be requested.  
- **In QA** — Yellow/Amber (\#D29922): Internal QA on staging; validating acceptance criteria and edge cases. Defects return to **In progress**.  
- **Done** — Green (\#3FB950): Meets the Definition of Done; approved (incl. QA/UAT as applicable) and released or ready to release.

**Nice-to-have automations**

- When **Iteration \= current** → set **Status \= Todo**  
- On **PR opened** → **Status \= In review**  
- On **label `status:needs-qa`** → **Status \= In QA**  
- On **merge/close** → **Status \= Done**

## **Priority**

Signals urgency and impact at a glance. Set during triage; one value per item.

- **P0 – Critical** — Red (\#F85149): Outage, data loss, security issue, or hard deadline blocker; swarm immediately.  
- **P1 – Important** — Orange (\#DB6D28): High impact or date-driven; prioritise next.  
- **P2 – Normal** — Blue (\#58A6FF): Standard work or routine defects; schedule normally.  
- **P3 – Minor** — Green (\#3FB950): Nice-to-have or low impact; batch with other work.

## **Area**

Primary functional area touched. Choose one to aid routing/ownership.

- **Frontend** — Blue (\#58A6FF): UI, blocks, patterns, theme.json, CSS.  
- **Backend** — Green (\#3FB950): PHP, plugins, APIs, data, cron.  
- **Content** — Orange (\#DB6D28): Copy, IA, taxonomies, migrations.  
- **A11y** — Purple (\#A371F7): Accessibility standards and fixes.  
- **Analytics** — Pink (\#DB61A2): GA4, GTM, tracking, reporting.  
- **Build & CI** — Yellow/Amber (\#D29922): Tooling, pipelines, bundling.  
- **DevOps** — Grey (\#6E7781): Infra, hosting, DNS, certs, monitoring.

## **Theme**

Strategic stream/initiative for the client engagement. Use sparingly; add only what’s needed.

- **Checkout** — Green (\#3FB950): Cart, payment, trust signals, conversion.  
- **Performance** — Orange (\#DB6D28): Core Web Vitals, caching, optimisation.  
- **Editor UX** — Purple (\#A371F7): Gutenberg/editor flows, roles, onboarding.  
- **Migration** — Blue (\#58A6FF): Content moves, redirects, parity checks.  
- **Configuration** — Grey (\#6E7781): Plugin/site settings, feature flags.  
- **SEO** — Pink (\#DB61A2): Metadata, schema, internal linking, sitemaps.

## **Environment**

Where the work is verified or will land. Useful for QA/UAT views and release checks.

- **Localhost** — Grey (\#6E7781): Developer local environment; pre-commit checks.  
- **Prototype** — Purple (\#A371F7): Concept/preview builds for early demos.  
- **Staging** — Yellow/Amber (\#D29922): Pre-prod; UAT, regression, performance checks.  
- **Live** — Green (\#3FB950): Production; client-facing; post-release validation.

## **Size**

Relative effort for forecasting. Map T-shirt sizes to numbers (e.g., XS=1, S=2, M=3, L=5, XL=8). Set on every issue.

## **Start Date**

Planned start of work. Powers Roadmap and capacity views.

## **Deadline**

Target completion date. Use for date-driven deliverables and UAT windows.

## **Milestone**

Delivery anchor for the work (e.g., “Phase-1 UAT”, “Go-Live”, or Sprint label). Use to group scope and dates for reporting.

## **Parent Issue**

Link the **Epic** this work rolls up to. Enables roll-up progress and grouping by parent in views.

## **Sub-issues Progress**

Auto-calculated completion across child issues on the parent (read-only in Projects).

## **Time (hours)**

Numeric estimate for planning and tracking. Choose ideal hours or points—pick one convention and stick to it.

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

- **Purpose:** “Epics only” roll-up for leadership/client visibility and risk spotting.  
- **Why:** Preserves flow metrics, avoids a “parking bay” column, and keeps Epics visible without breaking lifecycle states.  
- **Filter:** `Issue Type = Epic`  
- **Layout:** Table  
- **Show fields:** Priority, Theme, Area, Milestone, Deadline, Sub-issues Progress, Assignees  
- **Group by:** Theme  
- **Sort:** Deadline ascending (then Sub-issues Progress ascending)

## **Epics — Roadmap**

- **Purpose:** Timeline view to communicate delivery phases and UAT/go-live windows.  
- **Why:** Makes date risk obvious and helps sequence UAT activities.  
- **Filter:** `Issue Type = Epic` *(optionally `Status != Done`)*  
- **Layout:** Roadmap  
- **Show fields:** Milestone, Theme, Deadline  
- **Group by:** Theme *(or Area, if that’s how you manage streams)*  
- **Bars:** **Start Date → Deadline**  
- **Sort:** Deadline ascending

## **Epics — Board (Theme)**

- **Purpose:** Presentation-friendly clustering of epic scope by stream.  
- **Why:** Useful for stakeholder reviews without touching lifecycle status.  
- **Filter:** `Issue Type = Epic`  
- **Layout:** Board  
- **Show fields (on cards):** Priority, Sub-issues Progress, Deadline, Assignees  
- **Columns (group by):** Theme  
- **Sort:** Deadline ascending  
- **Note:** Do **not** move epics between columns to signal status—use this as a read-only lens.

## **Release Gate — vX.Y.Z**

- **Purpose:** Single focus for a specific release or phase cut (use phases like *Phase‑1 UAT*, *Go‑Live* if you don’t version client work).  
- **Why:** Creates a tight execution lane and makes scope creep visible.  
- **Layout:** Table *(or Roadmap)*  
- **Filter:** `Milestone = vX.Y.Z` *(or a named phase milestone)*  
- **Group by:** Issue Type  
- **Sort:** Priority (desc), Updated (desc)  
- **Show fields:** Status, Priority, Area, Environment, Sub-issues Progress  
- **Variation (Roadmap):** Group by **Status**; bars **Start Date → Deadline** to visualise the cut.

## **Tech Debt**

- **Purpose:** Plan and pay down refactors, CI/build work, and hardening for launch.  
- **Why:** Prevents “invisible” hygiene from being dropped during delivery pressure.  
- **Layout:** Table  
- **Filter:** `Issue Type IN ("Refactor","Chore") OR Area = "Build & CI"`  
- **Group by:** Area  
- **Sort:** Priority (desc)  
- **Show fields:** Issue Type, Priority, Area, Milestone, Assignees

## **Roadmap**

- **Purpose:** Forward plan across phases and deadlines.  
- **Why:** Shows whether dates and capacity are realistic at a glance.  
- **Layout:** Roadmap  
- **Filter:** *(optional)* `Status != Done`  
- **Group by:** Milestone *(or Iteration)*  
- **Bars:** **Start Date → Deadline**  
- **Show fields:** Priority, Issue Type, Sub-issues Progress

## **Backlog — Table**

- **Purpose:** Grooming and prioritisation for upcoming work.  
- **Why:** Keeps intake tidy and makes trade‑offs explicit.  
- **Layout:** Table  
- **Filter:** `Status = Backlog`  
- **Group by:** Theme *(to keep strategic focus)*  
- **Sort:** Priority (desc), Size (asc)  
- **Show fields:** Priority, Size, Theme, Area, Parent Epic

## **Board — Team Flow**

- **Purpose:** Day‑to‑day execution view that shows who’s doing what, now.  
- **Why:** Aligns stand‑ups to reality; highlights workload imbalance.  
- **Layout:** Board  
- **Filter:** *(none or)* `Status != Done`  
- **Group by:** Assignee  
- **Sort:** Priority (desc)  
- **Show fields (on cards):** Priority, Status, Environment, Deadline

## **QA Gate**

- **Purpose:** Single place for testers to pull from.  
- **Why:** Reduces ping‑pong; clarifies what is truly ready to test.  
- **Layout:** Table *(or Board)*  
- **Filter:** `Status IN ("In review","In QA")`  
- **Group by:** Environment  
- **Sort:** Updated (desc)  
- **Show fields:** Environment, Issue Type, Priority, Assignees, Sub-issues Progress

## **UAT (Client)**

- **Purpose:** What the client should test on staging.  
- **Why:** Focuses client effort and speeds sign‑off.  
- **Layout:** Table  
- **Filter:** `Environment = Staging AND Status IN ("In review","In QA")`  
- **Group by:** Theme *(to reflect business areas)*  
- **Sort:** Deadline (asc)  
- **Show fields:** Priority, Theme, Assignees, Deadline, Links

## **Blocked**

- **Purpose:** Escalation list to unblock quickly.  
- **Why:** Ensures blockers are visible and acted on fast.  
- **Layout:** Table  
- **Filter:** `label:status:blocked` *(or a “Blocked reason” field ≠ empty)*  
- **Group by:** Assignee *(or Area)*  
- **Sort:** Updated (desc)  
- **Show fields:** Blocked reason, Assignees, Parent Epic, Priority

---

# **Automations** {#automations}

Use **Project → Settings → Workflows** to add these rules. Keep status purely lifecycle and let rules move work forward automatically.

## **Auto-add new items → Status \= Backlog**

- **Why:** Everything starts in the same place for grooming.  
- **Setup:** Workflows → **Auto-add to project** → select repositories (and optional filters like `is:issue`) → **On add, set**: `Status = Backlog`, `Priority = P2 – Normal` (optional), `Area` (optional).

## **When Assignee is set → Status \= In progress**

- **Why:** Assignment means work has started.  
- **Setup:** Workflows → **New rule**  
  - **Trigger:** *When field changes* → `Assignees`  
  - **Condition:** `Assignees` **is not empty**  
  - **Action:** Set `Status = In progress`.

## **On PR opened (linked) → Status \= In review**

- **Why:** A linked PR signifies code is ready for review.  
- **Setup Option A (no-code):**  
  - **Trigger:** *When field changes* → `Linked pull requests`  
  - **Condition:** `Linked pull requests` **is not empty**  
  - **Action:** Set `Status = In review`.  
- **Setup Option B (if your UI lacks this trigger):** use a small GitHub Action that updates the Project item when a PR links to or references the issue.

## **On Issue closed / PR merged → Status \= Done**

- **Why:** Closed/merged equals finished work.  
- **Setup:** Two rules  
  1) **Trigger:** *When issue is closed* → **Action:** `Status = Done`  
  2) **Trigger:** *When pull request is merged* → **Action:** `Status = Done`

## **When label `status:needs-qa` is added → Status \= In QA**

- **Why:** Fast lane from review to testing.  
- **Setup Option A (if available):**  
  - **Trigger:** *When item is labeled* (`status:needs-qa`) → **Action:** `Status = In QA`  
- **Setup Option B (portable):** GitHub Action (drop in at `.github/workflows/project-status-qa.yml`)

```
name: Move to In QA on label
on:
  issues:
    types: [labeled]
jobs:
  to-qa:
    if: github.event.label.name == 'status:needs-qa'
    runs-on: ubuntu-latest
    steps:
      - name: Set Status to In QA in Project
        run: |
          gh api graphql -f query='
          mutation($item:ID!) {
            updateProjectV2ItemFieldValue(input:{
              projectId:"<PROJECT_ID>",
              itemId:$item,
              fieldId:"<STATUS_FIELD_ID>",
              value:{ singleSelectOptionId:"<IN_QA_OPTION_ID>" }
            }) { clientMutationId } }'               -F item="${{ github.event.issue.node_id }}"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

  Replace the IDs once using `gh project` or GraphQL explorer.

---

# **Naming & Intake Hygiene** {#naming-&-intake-hygiene}

Make new work predictable and searchable. Prefer **Project fields** first; mirror with labels only for cross-repo filters.

## **Conventions**

- **Labels:** `priority:*`, `status:*`, `area:*` (e.g., `priority:p1`, `status:needs-qa`, `area:frontend`).  
- **Project name:** `Client – {ClientName}` (e.g., `Client – Novus Media`).  
- **Milestones:** Use meaningful anchors: `Phase-1 UAT`, `Go-Live`, or versions `vX.Y.Z` where applicable.  
- **Sprints (optional):** `Sprint-YYYY-WW` (e.g., `Sprint-2025-41`).

## **Intake checklist (apply at creation)**

- Set **Issue Type**, **Priority**, **Owner (Assignee)**.  
- Add **Parent Issue** (Epic) if applicable.  
- Choose **Area** and **Theme**.  
- Add **Start Date** and **Deadline** if date-driven.  
- Attach design/specs and write clear **AC** (acceptance criteria).

## **“Intake” view (enforcement)**

- Create a **Table** view filtered to: `Status = Backlog AND (missing: Assignee OR missing: Priority OR missing: Issue Type)`  
- Review this list in triage; empty \= healthy intake.

---

# **Project Template Examples** {#project-template-examples}

## **Per-type labelling patterns (examples)**

Use these as **default field selections** when triaging by **Issue Type (Type field)**.  
(Labels may mirror these fields for cross-repo filters, but choose the **fields first**.)

- **Story** — *Implement Express Checkout with PayPal*  
    
  - Priority: **P1 – Important**  
  - Area: **Frontend**  
  - Theme: **Checkout**  
  - Environment: **Staging → Live**  
  - Milestone: **Go-Live**  
  - Parent: Epic **“Checkout Optimisation”**


- **Task** — *Configure VAT display and rounding rules (EU/UK)*  
    
  - Priority: **P2 – Normal**  
  - Area: **Backend**  
  - Theme: **Configuration**  
  - Environment: **Staging**  
  - Milestone: **Phase 1 UAT**  
  - Parent: Epic **“Regional VAT Compliance”**


- **Bug** — *Address validation fails for NL postcodes at checkout*  
    
  - Priority: **P0 – Critical**  
  - Area: **Backend**  
  - Theme: **Checkout**  
  - Environment: **Live (hotfix)**  
  - Milestone: **1.5.1**  
  - Parent: Epic **“Checkout Stability”**


- **Design** — *Checkout form layout & mobile ergonomics*  
    
  - Priority: **P2 – Normal**  
  - Area: **Frontend**  
  - Theme: **Editor UX**  
  - Environment: **Prototype**  
  - Milestone: **Phase 1 UAT**  
  - Parent: Epic **“Checkout UX Improvements”**


- **Research** — *Compare PayPal Express vs Stripe Link for EU*  
    
  - Priority: **P2 – Normal**  
  - Area: **Analytics**  
  - Theme: **Checkout**  
  - Environment: **Prototype**  
  - Milestone: **TBC**  
  - Parent: Epic **“Payment Options Review”**


- **Chore** — *Enable webhook logging for payment gateways*  
    
  - Priority: **P3 – Minor**  
  - Area: **DevOps**  
  - Theme: **Configuration**  
  - Environment: **Live**  
  - Milestone: **Go-Live Prep**  
  - Parent: Epic **“Launch Hardening”**

---

## **Per-area labelling patterns (examples)**

Defaults driven by the **Area** field to speed routing. Adjust **Priority** and **Theme** based on impact and deadlines.

- **Frontend** — 	*Style checkout error states and focus rings*

  - Typical Type: **Story / Task**  
  - Theme: **Checkout** or **Editor UX**  
  - Env: **Staging → Live**


- **Backend** — *Add UK postcode \+ house number validation*

  - Typical Type: **Task / Bug** ·   
  - Theme: **Configuration** or **Checkout**  
  - Env: **Staging → Live**


- **Content** — *Rewrite category copy and add internal links*

  - Typical Type: **Task**  
  - Theme: **SEO**  
  - Env: **Staging**


- **A11y** — *WCAG 2.2 focus indicators on form controls*

  - Typical Type: **Task / Bug**  
  - Theme: **Editor UX**  
  - Env: **Staging**


- **Analytics** — *Implement GA4 purchase event via GTM*

  - Typical Type: **Task / Research**  
  - Theme: **SEO** or **Configuration**  
  - Env: **Staging**


- **DevOps** — *Set up automated backups and uptime alerts*

  - Typical Type: **Task / Chore**  
  - Theme: **Configuration**  
  - Env: **Live** (change window)

---

## **Per-theme labelling patterns (examples)**

Examples where **Theme \= Checkout**. Keep the theme stable across the engagement to track investment and progress.

- **Story** — *Add one-click “Pay with PayPal” button on cart*

  - Area: **Frontend**  
  - Priority: **P1**  
  - Env: **Staging → Live**  
  - Milestone: **Go-Live**


- **Task** — *Configure payment method ordering and fallbacks*

  - Area: **Backend**  
  - Priority: **P2**  
  - Env: **Staging**  
  - Milestone: **Phase 1 UAT**  
  - Parent: Epic **“Checkout Optimisation”**


- **Bug** — *Totals not updating after shipping method change*  
  - Area: **Backend**  
  - Priority: **P0**  
  - Env: **Live (hotfix)**  
  - Milestone: **1.5.1**


- **Design** — *Simplify checkout form: group shipping/billing fields*

  - Area: **Frontend**  
  - Priority: **P2**  
  - Env: **Prototype → Staging**  
  - Milestone: **Phase 1 UAT**


- **Research** — *Evaluate payment success vs. friction metrics per step*

  - Area: **Analytics**  
  - Priority: **P2**  
  - Env: **Staging**  
  - Milestone: **TBC**  
  - Output: funnel chart \+ recommendations


- **Chore** — *Enable server-side logging for gateway timeouts*

  - Area: **DevOps**  
  - Priority: **P3**  
  - Env: **Live**  
  - Milestone: **Go-Live Prep**

---

