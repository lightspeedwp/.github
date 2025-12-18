# **GitHub Labels Guide**

## *Organisation wide defaults*

***Version:*** 1.11 • ***Last updated:*** 9 Oct 2025  
***Scope:*** Global labels for the **lightspeedwp** organisation only. Repo-specific labels may exist, but this document defines the **canonical, cross-repo** set we expect in every repository.  
***Objective:*** Make issues scannable and automatable across repos by standardising **label families, colours, and usage rules**. This spec complements our Issue Types and Projects workflow.  
---

[0\) How to use this document](#0\)-how-to-use-this-document)

[1\) Naming Conventions](#1\)-naming-conventions)

[2\) Colour system overview](#2\)-colour-system-overview)

[3\) Families](#3\)-families)

[4\) How to use labels (flows that matter)](#4\)-how-to-use-labels-\(flows-that-matter\))

[5\) Automation & rollout](#5\)-automation-&-rollout)

[6\) Relationship to Issue Types & Projects](#6\)-relationship-to-issue-types-&-projects)

[**7\) Master table of default labels**](#7\)-master-table-of-default-labels)

---

# **0\) How to use this document** {#0)-how-to-use-this-document}

## **Goals**

- A common mental model: same names, same colours, same meaning.  
- Fast scanning & reliable saved searches across repos.  
- **Orthogonal to Issue Types** — labels are **routing signals** (area, status, component, env, etc.), not classifiers of work type.

## **Principles**

- **One job per label.** Use labels for routing and signals; use **Issue Types** for classification.  
- **Stable names & colours.** Don’t churn colours—people learn them.  
- **Keep it minimal.** Prefer a curated set over dozens of one‑offs.  
- **Project fields first.** Status/Priority/Area should exist as **Project fields**; labels echo the same values for cross‑repo filtering.  
- **Naming:** `family:value` in **lower‑case kebab‑case** (e.g., `priority:critical`, `status:needs-qa`).  
- **Triage recipe:** on intake, set **Issue Type → Priority \+ Area \+ Status**; add `env:*`/`compat:*` only if relevant.  
- ***Tip:*** When triaging, set **Issue Type**, then add **Priority \+ Area \+ Status**. Add Compatibility/Environment only when relevant.

## **Naming rules**

- `family:value` in lower-case **kebab-case**, e.g. `comp:theme-json`, `status:needs-qa`, `env:staging`.  
- One job per label; avoid synonyms and one-off variants.  
- Prefer **global** labels for cross-repo filters; add **repo-local** labels only when a component is unique to that repo.  
- Keep `family:value` in kebab-case. 

---

# **1\) Naming Conventions** {#1)-naming-conventions}

**Issue Titles:**

- **Convention:** *Short Title Case, one clear meaning.*  
- **Example:** *Checkout: Apple Pay fails on iOS 17*

**Labels:**

- **Convention:** `family:value` in lower-case **kebab-case**.  
- **Example:** `priority:critical`, `status:needs-design`, `comp:theme-json`.

**Milestones (versions):**

- **Convention:** `vX.Y.Z` (set **due date** \+ short **description**).  
- **Example:** `v2.1.0` — *Due 2025-11-14 · Woo blocks parity MVP*

**Sprints (iterations):**

- **Convention:** `Sprint-YYYY-WW` (set **due date** \+ short **description**).  
- **Example:** `Sprint-2025-41` — *Due Fri 2025-10-10 · Checkout & perf focus*

**Projects:**

- **Convention:** `Client / Product — Board` **or** `Theme — <Name>`.  
- **Example:** `Novus Media — Board` · `Theme — LSX Design`

**Epics:**

- **Convention:** `Epic: <Clear outcome statement>`  
- **Example:** `Epic: Reduce LCP to ≤2.5s on Home`

**Stories:**

- **Convention:** `As a <user>, I want <capability> so that <outcome>.` Include **AC** (acceptance criteria) \+ **test notes**.  
- **Example:** `As a shopper, I want to save my cart so that I can finish later. AC: shows “Save Cart” when logged in; restores items within 30 days.`

---

# **2\) Colour system overview** {#2)-colour-system-overview}

- We reuse GitHub's standard palette for consistency and legibility across boards.  
- Colours are fixed per family (e.g. area/component \= Light-blue outline, with SEO/Analytics exceptions). 

**Colours system by family:**

- **Priority** → warm urgency gradient: **Red** (critical) → **Orange** (important) → **Blue** (normal) → **Green (outline)** (minor).  
- **Status** → workflow signals: **Green** (ready), **Light-blue** (in progress), **Yellow** (QA/testing), **Blue/Purple** (reviews/feedback), **Red** (blocked/duplicate/won’t-fix).  
- **Component / Area** → **Light-blue (outline)** for most editor/theme surfaces; **Ops/Deploy** uses **Dark-green**; **Woo/ecosystem** exceptions may use **Purple (outline)**.  
- **Compatibility** → **Orange** family (external constraints).  
- **Environment** → traffic-light semantics: **Prototype** (Grey-outline), **Staging** (Blue-outline), **Live** (Green).  
- **Community** → welcoming tones (**Green/Purple outlines**).  
- **Meta** → neutral **Greys**; **AI-Ops** → **Blue** (engineering ops); **Lang** → **Light-blue (outline)**; **CPT** → **Light-blue (outline)**.

---

# **3\) Families** {#3)-families}

## **`priority:*`**

- **Family Description:** Prioritises work by business urgency so triage and planning can focus attention where it matters. A simple, shared scale (critical → minor) keeps scheduling honest, makes risk visible, and supports cross‑repo reporting and escalation.  
- **What it is:** An urgency signal that orders work for planning and escalation.  
- **Why this colour:** Warm→cool gradient maps naturally to urgency (red critical → green minor).  
- **When to use:** Always at triage for issues; optionally on hotfix PRs.  
- **When to choose:** Use **priority** to express urgency; use **status** to express workflow stage.  
- **Scope:** Issues (PRs optional).  
- **Relevant Issue types:** Bug, Incident, Task, Feature, Improvement.  
- **Purpose:** Make queues sortable and roadmaps realistic.  
- **Process:** Set at intake; adjust during planning or incident review; avoid churn mid‑sprint.

**Default labels**

- `priority:critical` — Production/launch-blocking. **Red** `#B60205`  
- `priority:important` — Must do in the current/next iteration. **Orange** `#D93F0B`  
- `priority:normal` — Default priority. **Blue** `#0052CC`  
- `priority:minor` — Nice-to-have/low urgency. **Green (outline)** `#C2E0C6`

---

## **`status:*`**

- **Family Description:** Shows the single current workflow state for issues and PRs, from intake to done. Clear, mutually exclusive states enable readable boards, predictable automation, and precise hand‑offs across design, development, review, QA and release.  
- **What it is:** The canonical workflow stage.  
- **Why this colour:** Distinct cues for ready (green), doing (light‑blue), testing (yellow), reviews (blue/purple), and blocked/closed (red/grey).  
- **When to use:** Update whenever work moves state; keep exactly **one** status.  
- **When to choose:** Use **status** for stage; use **meta** for housekeeping; use **priority** for urgency.  
- **Scope:** Issues & PRs.  
- **Relevant Issue types:** All.  
- **Purpose:** Drive board visibility and automations.  
- **Process:** Intake → `needs-triage` → `ready`/`needs-*` queues → `in-progress` → review/QA → done or closure.

**Default labels:**

- **Triage & Intake:**  
  - `status:needs-triage` **Blue (outline)** \#BFD4F2 — intake queue prior to grooming.  
- **Ready & Execution:**   
  - `status:ready` **Green** `#0E8A16`  
  - `status:in-progress` **Light-blue** `#1D76DB`  
  - `status:on-hold` **Orange (outline)** `#F9D0C4`  
- **Design & Development**  
  - `status:needs-design` **Light-Blue (outline)** `#C5DEF5`   
  - `status:needs-figma-update` **Light-Blue (outline)** `#C5DEF5`   
  - `status:needs-dev` **Light-Blue (outline)** `#C5DEF5`  
- **Review & Feedback:**   
  - `status:needs-review` **Blue (outline)** `#BFD4F2`   
  - `status:needs-design-review` **Purple (outline)** `#D4C5F9`  
- **QA & Testing:**   
  - `status:needs-qa` **Yellow** `#FBCA04`  
  - `status:needs-testing` **Yellow (outline)** `#FEF2C0`  
- **Clarification:**   
  - `status:in-discussion` **Blue (outline)** `#BFD4F2`   
  - `status:needs-more-info` **Blue (outline)** `#BFD4F2`  
- **Blockers & Closure:**   
  - `status:blocked` **Red (outline)** `#E99695`   
  - `status:duplicate` **Red (outline)** `#E99695`   
  - `status:wontfix` **Grey (outline)** `#E1E4E8`

To be considered

* status:needs-documentation  
* 

---

## **`comp:*` (components)**

- **Family Description:** Targets precise WordPress/Gutenberg artefacts — blocks, templates, theme.json, settings and style tokens. Useful for routing to the right specialists, aggregating related changes, and auditing configuration over time across repos.  
- **What it is:** Named UI/config artefacts we modify.  
- **Why this colour:** Light‑blue outline \= editor/theme surfaces.  
- **When to use:** The change touches a specific component (e.g., `theme.json`, block, template part).  
- **When to choose:** Prefer **comp** when the exact artefact is known; use **area** for broader functional work.  
- **Scope:** Issues & PRs.  
- **Relevant Issue types:** Feature, Improvement, Task, Bug.  
- **Purpose:** Route to specialists and enable component‑level reporting.  
- **Process:** Add the most specific component; avoid stacking multiple `comp:*` unless truly required.

**Default component labels:**

- **Blocks Editor:**   
  - `comp:block-editor`   
  - `comp:block-variations`  
  - `comp:block-bindings`  
  - `comp:block-inserter`   
  - `comp:block-locking`  
  - `comp:block-supports`  
- **Templates:**   
  - `comp:block-templates`  
  - `comp:block-patterns`  
  - `comp:template-parts`  
- **Config objects:**   
  - `comp:block-json`  
  - `comp:theme-json`  
- **Admin & Settings:**   
  - `comp:wp-admin`   
  - `comp:settings`  
  - `comp:post-settings`   
  - `comp:help-tabs`  
- **Global styles (JSON-based):**   
  - `comp:style-variations`  
  - `comp:block-styles`  
  - `comp:color-palette`  
  - `comp:typography`  
  - `comp:section-styles`  
  - `comp:spacing`

*All component labels use **Light-blue (outline)** `#C5DEF5` by default.*

---

## **`area:*`**

- **Family Description:** Groups work by broader functional surface when component granularity isn’t needed. Ideal for stakeholder views and roadmaps (navigation, forms, search, SEO, analytics, CI/deploy, dependencies) while staying compatible with component‑level labels.  
- **What it is:** Broad functional grouping.  
- **Why this colour:** Aligns with components (light‑blue outline) for UX/theme surfaces; exceptions use distinct colours for clarity.  
- **When to use:** Product‑level routing and reporting; when multiple components contribute to the same outcome.  
- **When to choose:** Use **area** for scope/outcome; use **comp** when the artefact is clear.  
- **Scope:** Issues & PRs.  
- **Relevant Issue types:** All.  
- **Purpose:** Keep roadmaps readable and stakeholder‑friendly.  
- **Process:** Pick one primary area; avoid duplicating with `comp:*` unless both levels add value.

**Default area labels:**

- **Core build & delivery:**   
  - `area:ci` **Blue (outline)** `#BFD4F2`  
  - `area:infrastructure` **Dark-green** `#006B75`  
  - `area:deployment` **Dark-green** `#006B75`  
- **UX & Theme:**   
  - `area:content` — **Light-blue (outline)** `#C5DEF5`  
  - `area:forms` — **Light-blue (outline)** `#C5DEF5`  
  - `area:theme` — **Light-blue (outline)** `#C5DEF5`  
  - `area:plugins` — **Light-blue (outline)** `#C5DEF5`  
  - `area:navigation` — **Light-blue (outline)** `#C5DEF5`  
  - `area:search` — **Light-blue (outline)** `#C5DEF5`  
- **Dependencies:**   
  - `area:dependencies` **Orange (outline)** `#F9D0C4`  
- **Design System:**   
  - `area:design-system` **Light-blue (outline)** `#C5DEF5`  
- **Integrations/Ecosystem:**   
  - `area:integration` **Orange** `#D93F0B`  
  - `area:woocommerce` **Purple (outline)** `#D4C5F9`  
- **Internationalisation:**  
- `area:i18n` — **Light-blue (outline)** `#C5DEF5`  
- **Growth & Measurement:**  
- `area:seo` — **Green (outline)** `#C2E0C6`  
- `area:analytics` — **Green (outline)** `#C2E0C6`

---

## **`lang:*` (languages/formats)**

- **Family Description:** Indicates primary implementation or content format to route reviewers, linters and tests. Helps search across mixed stacks and keeps conversations on‑topic when repos contain PHP, JS/TS, CSS, JSON, YAML and Markdown side‑by‑side.  
- **What it is:** The main language/format of the change.  
- **Why this colour:** Editor‑adjacent; same light‑blue outline as components.  
- **When to use:** Cross‑stack repos, reviewer routing, lint/test dashboards.  
- **When to choose:** Use **lang** to indicate code/content flavour; still add **comp/area** for scope.  
- **Scope:** Issues & PRs.  
- **Relevant Issue types:** All (esp. Bug/Task/Docs).  
- **Purpose:** Speed up reviews and searches.  
- **Process:** Add one `lang:*`; avoid stacking unless the change truly spans languages.

**Default language labels**:

- `lang:php`  
- `lang:js`  
- `lang:css`  
- `lang:html`  
- `lang:md`  
- `lang:json`  
- `lang:yaml`

---

## **`env:*` (environment)**

- **Family Description:** Marks which runtime environment is impacted or required for verification. Supports UAT and release comms by showing whether work is prototype‑only, staged for testing, or live in production, and helps coordinate smoke tests after deploy.  
- **What it is:** Deployment/testing context.  
- **Why this colour:** Traffic‑light semantics (grey prototype, blue staging, green live).  
- **When to use:** For UAT, release notes, ops coordination.  
- **When to choose:** Use **env** to show where to test; use **compat** to show what versions we support.  
- **Scope:** Issues & PRs.  
- **Relevant Issue types:** Bug, Task, Incident, Release.  
- **Purpose:** Improve hand‑offs and traceability across environments.  
- **Process:** Add during QA/UAT and at release; remove/move as the work promotes.

**Default environment labels:**

- `env:prototype` **Grey (outline)** `#E1E4E8`  
- `env:staging` **Blue (outline)** `#BFD4F2`  
- `env:live` **Green** `#0E8A16`

---

## **`compat:*` (compatibility)**

- **Family Description:** Captures external matrix constraints — WordPress core, PHP, WooCommerce, Gutenberg, RTL and more. Keeps minimum and tested‑up‑to versions explicit, de‑risks upgrades, and prevents regressions when dependencies change.  
- **What it is:** Platform/version constraints.  
- **Why this colour:** Orange family signals external alignment and caution.   
- **When to use:** Version bumps, deprecations, compatibility fixes, matrix testing.  
- **When to choose:** Use **compat** to express version support; use **env** for runtime stage.  
- **Scope:** Issues & PRs.  
- **Relevant Issue types:** Bug, Task, Maintenance, Release.  
- **Purpose:** Make support matrices explicit and testable.  
- **Process:** Add relevant `compat:*` for any change that alters supported ranges; link to matrix notes.

**Default compatibility labels:** 

- `compat:wordpress`  
- `compat:php`  
- `compat:woocommerce`  
- `compat:rtl`  
- `compat:gutenberg`  
- `compat:multisite`  
- ***Note:** All `compat:*` labels use **Orange** `#D93F0B` unless noted.*

---

## **`cpt:*` (content types)**

- **What it is:** WordPress post types impacted.  
- **Post Formats:** prefer `tax:post-format-*` as **repo-local** if formats are in use; avoid globalising until there’s cross-repo demand.  
- **Colour:** **Light-blue (outline)** `#C5DEF5`.  
- **Scope:** **Issue & PR**.

**Defaults cpt labels:** 

- `cpt:posts`  
- `cpt:pages`   
- NOTE: global only; project repos can add local `cpt:*` as needed.

---

## **`meta:*`**

- **Family Description:** Housekeeping and automation signals independent of workflow stage. Enables bots and maintainers to manage linked PRs, inactivity and staleness without conflating status or priority, keeping boards clean and reducing manual toil.  
- **What it is:** Non‑workflow automation signals.  
- **Why this colour:** Neutral greys indicate low semantic weight.  
- **When to use:** Linking PRs, stale detection, activity sweeps.  
- **When to choose:** Use **meta** for bot/ops hygiene; keep **status/priority** for human decisions.  
- **Scope:** Issues & PRs.  
- **Relevant Issue types:** All.  
- **Purpose:** Reduce maintenance overhead.  
- **Process:** Applied by bots or during hygiene; do not use as a proxy for status.

**Default meta labels**:

- `meta:has-pr` **Grey (outline)** `#E1E4E8` — issue has an open PR linked.  
- `meta:no-issue-activity` **Grey (outline)** `#E1E4E8`  
- `meta:no-pr-activity` **Grey (outline)** `#E1E4E8`  
- `meta:needs-changelog` **Grey (outline)** `#E1E4E8`  
- `meta:stale` **Grey (solid)** `#9198A1`

---

## **`ai-ops:*`**

- **Family Description:** Organises in‑repo AI artefacts (instructions, chat modes, agents, prompts, datasets, evaluations) for discoverability, review and governance. Separates experiments from product features while enabling targeted reviews and audits.  
- **What it is:** Labels for AI operational artefacts.  
- **Why this colour:** Blue denotes engineering/ops; outline blue for lighter touch docs.  
- **When to use:** When storing or changing AI prompts, agents, tools, datasets, evaluations.  
- **When to choose:** Use **ai‑ops** for AI assets; do not overload **area/comp**.  
- **Scope:** Issues & PRs.  
- **Relevant Issue types:** Docs, Task, Research, Improvement.  
- **Purpose:** Keep AI work auditable and discoverable.  
- **Process:** Add the most specific ai‑ops label; link to evaluation notes when relevant.

**Default AI-Ops labels**

- `ai-ops:instructions` — system/developer instruction docs.  
- `ai-ops:chat-modes` — prompt sets or UX modes (kebab-case).  
- `ai-ops:agents` — agent definitions/manifests.  
- `ai-ops:prompts` — reusable prompts or fragments. **Optional (add when needed):** `ai-ops:datasets`, `ai-ops:evaluations`, `ai-ops:tools`.

---

## **`contrib:*` (community)**

- **Family Description:** Helps newcomers find friendly entry points and highlights where maintainers welcome assistance. Improves contributor experience and throughput without altering priority or status, and supports community‑led triage during busy periods.  
- **What it is:** Community contribution signals.  
- **Why this colour:** Welcoming green/purple outlines.  
- **When to use:** Label issues suitable for external contributors or where help is requested.  
- **When to choose:** Use **contrib** to invite help; do not use to change urgency or status.  
- **Scope:** Issues.  
- **Relevant Issue types:** Feature, Bug, Task, Docs.  
- **Purpose:** Grow healthy contributions and reduce maintainer load.  
- **Process:** Add when scope is clear, AC are present, and newcomer guidance included.

**Default community labels:**

- `contrib:help-wanted` **Green (outline)** `#C2E0C6`  
- `contrib:good-first-issue` **Purple (outline)** `#D4C5F9`

---

# **4\) How to use labels (flows that matter)**  {#4)-how-to-use-labels-(flows-that-matter)}

## **Triage (new issue)**

1. Set **Issue Type**.  
2. Add one `priority:*` and one `area:*` **or** `comp:*`.  
3. Add `status:needs-triage` (intake). If already groomed, skip to `status:ready` **or** route via `status:needs-design` / `status:needs-dev`.  
4. Link Epic/Theme; set Milestone/Iteration in the Project.

## **In progress**

* On assign/start: switch to `status:in-progress`.  
* If blocked: add `status:blocked` and fill **Blocked reason** field.

## **Reviews & QA**

* Code/design review: add `status:needs-review` (and `status:needs-design-review` if applicable).  
* QA: add `status:needs-qa` (automation can set Project Status \= In QA).

## **UAT & Release**

* For UAT builds: add `env:staging`.  
* After deploy: add `env:live` to the shipping issue/PR as a release marker.

---

# **5\) Automation & rollout**  {#5)-automation-&-rollout}

**Repo bootstrap (one‑time):** keep a canonical label set in `.github/labels.yml` (see file below) or use the GitHub CLI:

```
# example: create a few core labels
gh label create "priority:critical" --color B60205 --description "Production/launch-blocking"
gh label create "status:ready" --color 0E8A16 --description "Groomed and ready to start"
gh label create "area:theme" --color C5DEF5 --description "Theme & styles (templates, parts, FSE)"
```

**Project automations (recommended):**

- When `status:needs-qa` is added → set **Project Status \= In QA**.  
- When PR opens on a linked issue → set **Status \= In review**.  
- When issue closes / PR merges → set **Status \= Done**.

**Governance:** 

- Monthly hygiene check — unused labels, colour drift, naming drift, and saved views stay healthy.

---

## **`.github/labels.yml`** 

Keep this as the org-canonical source and sync via gh-cli.

```
- name: priority:critical
  color: B60205
  description: Production/launch-blocking
- name: status:in-progress
  color: 1D76DB
  description: Work actively underway
- name: comp:theme-json
  color: C5DEF5
  description: Tokens, presets, settings
# …extend using the table above
```

---

# **6\) Relationship to Issue Types & Projects**  {#6)-relationship-to-issue-types-&-projects}

* Labels provide **signals**; **Issue Types** provide **meaning**.  
* Projects remain the **system of record** for Status/Priority/Area; labels mirror those values so cross‑repo filters and saved searches work everywhere.

---

# **7\) Master table of default labels** {#7)-master-table-of-default-labels}

We intentionally **exclude** `type:*` labels—Issue Types cover that.

| Label | Description | Family | Colour |
| :---- | :---- | :---- | :---- |
| `priority:critical` | Production/launch-blocking | priority | `#B60205` |
| `priority:important` | Must-do in current/next iteration | priority | `#D93F0B` |
| `priority:normal` | Default priority | priority | `#0052CC` |
| `priority:minor` | Nice-to-have / low urgency | priority | `#C2E0C6` |
| `status:needs-triage` | New/ungroomed; needs review by PM/lead | status | `#BFD4F2`  |
| `status:ready` | Groomed and ready to start | status | `#0E8A16` |
| `status:in-progress` | Work actively underway | status | `#1D76DB` |
| `status:on-hold` | Paused, awaiting external input | status | `#F9D0C4` |
| `status:needs-design` | Early execution signal (triage queue for design) | status | `#C5DEF5` |
| `status:needs-design-review` | Awaiting design review | status | `#D4C5F9` |
| `status:needs-figma-update` | Existing Figma design needs updating | status | `#C5DEF5` |
| `status:needs-dev` | Early execution signal (triage queue for engineering) | status | `#C5DEF5` |
| `status:needs-review` | Awaiting code review | status | `#BFD4F2` |
| `status:needs-qa` | QA pass required | status | `#FBCA04` |
| `status:needs-testing` | Testing needed (manual/auto) | status | `#FEF2C0` |
| `status:in-discussion` | Needs alignment/decision | status | `#BFD4F2` |
| `status:needs-more-info` | Missing details to proceed | status | `#BFD4F2` |
| `status:blocked` | Blocked; see Blocked reason | status | `#E99695` |
| `status:duplicate` | Duplicate of another issue | status | `#E99695` |
| `status:wontfix` | Not planned to address | status | `#E1E4E8` |
| `comp:block-editor` | Block/site editor work | comp | `#C5DEF5` |
| `comp:block-inserter` | Inserter UI/behaviour | comp | `#C5DEF5` |
| `comp:block-variations` | Block variations | comp | `#C5DEF5` |
| `comp:block-supports` | Block supports | comp | `#C5DEF5` |
| `comp:block-locking` | Block locking  | comp | `#C5DEF5` |
| `comp:block-bindings` | Block bindings  | comp | `#C5DEF5` |
| `comp:block-templates` | Template files/editor | comp | `#C5DEF5` |
| `comp:block-patterns` | Patterns library/registration | comp | `#C5DEF5` |
| `comp:template-parts` | Header/footer/loop/nav parts | comp | `#C5DEF5` |
| `comp:block-json` | Block metadata (`block.json`) | comp | `#C5DEF5` |
| `comp:theme-json` | Tokens, presets, settings | comp | `#C5DEF5` |
| `comp:wp-admin` | WP Admin screens | comp | `#C5DEF5` |
| `comp:settings` | Global/settings UX | comp | `#C5DEF5` |
| `comp:post-settings` | Post editor settings panel | comp | `#C5DEF5` |
| `comp:style-variations` | JSON style variations | comp | `#C5DEF5` |
| `comp:block-styles` | Styles registered via JSON | comp | `#C5DEF5` |
| `comp:color-palette` | Palette tokens/usage | comp | `#C5DEF5` |
| `comp:typography` | Type scale/fluids | comp | `#C5DEF5` |
| `comp:section-styles` | Section/background styles | comp | `#C5DEF5` |
| `comp:spacing` | Spacing tokens/layout gaps | comp | `#C5DEF5` |
| `area:content` | Anything that needs copy-editing assistance | area | `#C5DEF5` |
| `area:design-system` | Tokens/components guidelines | area | `#C5DEF5` |
| `area:navigation` | Menus & nav UX | area | `#C5DEF5` |
| `area:forms` | Forms (Gravity Forms etc.) | area | `#C5DEF5` |
| `area:theme` | Theme & styles (templates, template parts, FSE) | area | `#C5DEF5` |
| `area:plugins` | Plugin configuration/internals | area | `#C5DEF5` |
| `area:search` | Search/filters (incl. FacetWP) | area | `#C5DEF5` |
| `area:seo` | Technical SEO (meta/schema/sitemaps) | area | `#C2E0C6` |
| `area:analytics` | Analytics & tracking | area | `#C2E0C6` |
| `area:woocommerce` | WooCommerce templates, blocks, hooks | area | `#D4C5F9` |
| `area:infrastructure` | Infrastructure | area | `#006B75` |
| `area:i18n` | Internationalisation  | area | `#C5DEF5` |
| `area:ci` | Build and CI pipelines | area | `#BFD4F2` |
| `area:deployment` | Deploy/release operations | area | `#006B75` |
| `area:dependencies` | Composer/npm dependency work | area | `#F9D0C4` |
| `lang:php` | PHP code | lang | `#C5DEF5` |
| `lang:js` | JavaScript/TypeScript | lang | `#C5DEF5` |
| `lang:css` | Stylesheets | lang | `#C5DEF5` |
| `lang:html` | Markup | lang | `#C5DEF5` |
| `lang:md` | Markdown content/docs | lang | `#C5DEF5` |
| `lang:json` | JSON config/content | lang | `#C5DEF5` |
| `lang:yaml` | YAML config | lang | `#C5DEF5` |
| `env:prototype` | Prototype/sandbox | env | `#E1E4E8` |
| `env:staging` | Staging/UAT | env | `#BFD4F2` |
| `env:live` | Live/production | env | `#0E8A16` |
| `compat:wordpress` | Core/Gutenberg versions | compat | `#D93F0B` |
| `compat:php` | Min/tested-up-to PHP | compat | `#D93F0B` |
| `compat:woocommerce` | WooCommerce versions | compat | `#D93F0B` |
| `compat:gutenberg` | Package compatibility | compat | `#D93F0B` |
| `compat:multisite` | Multisite/network considerations. | compat | `#F9D0C4` |
| `cpt:posts` | WordPress Posts | cpt | `#C5DEF5` |
| `cpt:pages` | WordPress Pages | cpt | `#C5DEF5` |
| `meta:has-pr` | Issue has a linked PR | meta | `#E1E4E8` |
| `meta:no-issue-activity` | No recent issue activity | meta | `#E1E4E8` |
| `meta:no-pr-activity` | No recent PR activity | meta | `#E1E4E8` |
| `meta:stale` | Marked as stale | meta | `#9198A1` |
| `meta:needs-changelog` | Requires a changelog entry before merge | meta | `#E1E4E8` |
| `ai-ops:instructions` | AI instruction docs | ai-ops | `#0052CC` |
| `ai-ops:chat-modes` | Prompt sets / modes | ai-ops | `#0052CC` |
| `ai-ops:agents` | Agent definitions | ai-ops | `#0052CC` |
| `ai-ops:prompts` | Reusable prompts | ai-ops | `#0052CC` |
| `ai-ops:datasets` | Training/eval datasets | ai-ops | `#BFD4F2` |
| `ai-ops:evaluations` | Evaluation results | ai-ops | `#BFD4F2` |
| `ai-ops:tools` | Tool/plugin manifests | ai-ops | `#BFD4F2` |
| `contrib:help-wanted` | Maintainer requests help. | contrib | `#C2E0C6` |
| `contrib:good-first-issue` | Good for first-time contributors. | contrib | `#D4C5F9` |

---

*Aligned with our **Issue Types v1.8** and **Projects/Issues/Milestones strategy v1.2**.*  
