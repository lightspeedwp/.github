# **BugHerd Tagging Guide**

## *Internal guidelines for LightSpeed team to use when processing BugHerd feedback*

***Version:*** v1.6 · ***Last updated:*** 8 Oct 2025  
***Scope:*** LightSpeed projects using BugHerd.  
***Objective:*** Standardise family-based tags so intake, triage, assignment, QA and release are fast and predictable.  
***Purpose:*** Keep feedback organised, prioritised and searchable. Tags must make triage, assignment, and review faster — not noisier. Use **fewer, clearer tags** applied **consistently**.

---

[Global Tagging Rules](#global-tagging-rules)

[Notes](#notes)

[Required tag set (every task)](#required-tag-set-\(every-task\))

[status:\*](#status:*)

[type:\*](#type:*)

[area:\*](#area:*)

[comp:\*](#comp:*)

[Optional / Recommended Families](#optional-/-recommended-families)

[phase:\*](#phase:*)

[env:\*](#env:*)

[Recommended tag sets (if relevant)](#recommended-tag-sets-\(if-relevant\))

[page:\*](#page:*)

[issue:\*](#issue:*)

[device:\*](#device:*)

[layout:\*](#layout:*)

[Optional Theme Family](#optional-theme-family)

[theme:\*](#theme:*)

[size:\* (T‑shirt effort sizing — values use CAPS)](#size:*-\(t‑shirt-effort-sizing-—-values-use-caps\))

[WP Theme Families](#wp-theme-families)

[block:\*](#block:*)

[template-part:\*](#template-part:*)

[template:\*](#template:*)

[Plugin Families](#plugin-families)

[to:\* (Tour Operator plugin)](#to:*-\(tour-operator-plugin\))

[woo:\*](#woo:*)

---

# **Global Tagging Rules** {#global-tagging-rules}

- **Tag format:** `family:value` (lower‑case, no spaces, kebab‑case). Example: `area:navigation`.  
- **One per family:** Apply **one** tag per family on a feedback item.  
- **Tag families:**  
  - **Required:** `status:*`, **one** of `area:*` or `comp:*`  
  - **Optional / Recommended:** `phase:*`, `env:*`, `type:*`, `device:*`  
  - **Recommended if relevant:** `page:*` and `issue:*`   
  - **Optional:** `theme:*`, `size:*`  
  - **WP Theme:** `block:*`, `template-part:*`, `template:*`  
  - **Plugins:** `to:*`, `woo:*`  
- **Severity, not priority tags:** Use BugHerd’s built‑in **Severity** for urgency. Do **not** create `priority:*` tags.  
- **Titles & descriptions:** Include **expected vs actual**, **minimal repro steps**, **URL**, and an annotated **screenshot/recording**.  
- **Governance:** Propose new tags before use; review boards weekly to correct/retire tags.  
- **Duplicates & blockers:** Mark duplicates and link the canonical item. Mark blockers and note the reason.

## **Notes** {#notes}

- **Rule of thumb:** Severity \= how bad; Size \= how big; Status \= where it is; Type \= what kind of work.  
- Use **Severity** for urgency/priority. Tags aid routing/reporting; they do not replace planning.  
- Keep the applied tag set **small** (typically 3–6 per item) to preserve signal.  
- If in doubt, add `status:needs-triage` and request missing information.

---

# **Required tag set (every task)** {#required-tag-set-(every-task)}

Apply these **at triage**:

- **status:** use a single current state (see `status:*` family).  
- **type:** choose one category that best fits (see `type:*`).  
- **area or comp:** prefer **one** of `area:*` or `comp:*` that best routes the item. Add the other only if it clarifies ownership.

---

## **`status:*`** {#status:*}

- **Family Description:** Single current workflow state for each feedback item from intake to release.  
- **Purpose:** Enable readable boards and precise hand‑offs across design, development, review, QA and release.  
- **What it is:** Canonical state names. Keep **one** status per item.  
- **When to use:** Update whenever work moves state.  
- **When to choose:** Use **status** for stage; use **Severity** for urgency; use **type** for category.  
- **When not to use:** Don’t apply multiple status tags.  
- **Who uses it:** Designers, developers, PMs, QA, stakeholders.  
- **Who decides:** PM on intake; assignee/QA/PM update as work progresses.  
- **How to choose:** Pick the best‑fit current state; if none fit, propose one before using.  
- **How to apply:** Apply one status tag; keep current during standups/reviews.  
- **How to maintain:** Audit weekly; merge/remove little‑used states.  
- **Scope:** All BugHerd feedback items.  
- **Benefits:** Clear workflow enables planning and reliable throughput.  
- **Tag format:** `status:<state>`  
- **Related labels:** `type:*`, `area:*`, `comp:*`, `phase:*`, `device:*`  
- **Process:** Intake → `needs-triage` → `ready`/`needs-*` queues → review/QA → deployment/closure.

**Default tags (grouped):**

### **Ready & Execution**

- `status:ready` — Scoped and approved; ready to pull.  
- `status:on-hold` — Intentionally paused (sequence/strategy).  
- `status:in-progress` — Actively being worked on by the assignee. Use when implementation or design has started and the task has left planning. Move to a review/QA state when the change is ready for verification (BugHerd’s “Doing” column).  
- `status:needs-dev` — Ready for engineering implementation.  
- `status:needs-design` — Requires UX/UI solution before dev.  
- `status:needs-figma-update` — Update Figma/source‑of‑truth to match decision.

### **Review & Feedback**

- `status:needs-review` — Peer/tech/content review required.  
- `status:needs-design-review` — Design sign‑off against spec/frames.

### **Clarification& Scope**

- `status:scope-creep` — Exceeds agreed scope; needs re‑scoping.  
- `status:needs-discussion` — Requires a decision or alignment.  
- `status:needs-more-info` — Missing context/assets/repro details.  
- `status:needs-client-discussion` — Paused pending a client decision or clarification (scope, acceptance criteria, priority, content/legal approval). Assign a PM, schedule the touch-point, and capture the outcome in the task before resuming normal flow. Leverage BugHerd’s sharing/client-permission features to make the review efficient and visible.  
- `status:needs-loom-video` — Request a short screen recording to demonstrate the issue or desired behaviour (voiceover recommended). Acceptable evidence includes a Loom link or BugHerd’s built-in video feedback capture added directly to the task. This reduces back-and-forth and speeds reproduction.  
- `status:needs-documentation` — Deliverable is blocked pending docs: release notes, change log, admin/how-to steps, or onboarding content. Add links or attachments (screenshots/GIFs), then move to review/QA once documentation is complete.

### **QA & Testing**

- `status:needs-qa` — QA verification against acceptance criteria.  
- `status:needs-testing` — UAT/stakeholder verification required.

### **Blockers & Closure**

- `status:blocked` — Blocked by dependency/external factor; note the owner.  
- `status:duplicate` — Closed as duplicate; link canonical task.  
- `status:wontfix` — Won’t address; record rationale/alternative.

### **Deployment**

- `status:ready-for-deployment` — Approved and queued for release.

---

## **`type:*`** {#type:*}

- **Family Description:** Nature of work for routing, reporting and resourcing.  
- **Purpose:** Communicate work category alongside status and severity.  
- **What it is:** One category tag.  
- **When to use:** On intake for all tasks.  
- **When to choose:** Use to signal design vs dev vs defect vs improvement.  
- **When not to use:** Don’t duplicate meanings across families.  
- **Who uses it:** Everyone.  
- **Who decides:** PM on intake; assignee can adjust.  
- **How to choose:** Pick the single best‑fit category.  
- **How to apply:** Add one type tag.  
- **How to maintain:** Review during refinement.  
- **Scope:** All items.  
- **Benefits:** Quicker routing and reporting.  
- **Tag format:** `type:<category>`  
- **Related labels:** `status:*`, `area:*`, `issue:*`  
- **Process:** Intake → classify → assign

**Default tags (grouped):**

### **Defects & Compatibility**

- `type:bug` — Defect causing incorrect behaviour.  
- `type:compat` — Browser/device/plugin compatibility issue.  
- `type:fix` — Small, targeted correction.

### **Features & Improvements**

- `type:feature` — New capability to be delivered.  
- `type:improve` — Enhancement to existing behaviour.

### **Code & Performance**

- `type:dev` — Engineering task not covered elsewhere.  
- `type:refactor` — Internal code restructure without changing behaviour.  
- `type:performance` — Performance work (speed, memory, Core Web Vitals).  
- `type:chore` — Housekeeping tasks (dependencies, configs).

### **Design & Experience**

- `type:design` — Visual/interaction design work.  
- `type:ux` — User experience flows/journeys.  
- `type:ui` — Interface-level adjustments.  
- `type:a11y` — Accessibility compliance/experience.  
- `type:usability` — Ease‑of‑use improvements.  
- `type:task` — Generic to‑do when none of the above apply.

### **Content**

- `type:content-import` — Content to be imported/migrated.  
- `type:missing-content` — Content not yet provided.  
- `type:content-management` — Client owns creation/updates.

---

## **`area:*`** {#area:*}

- **Family Description:** Outcome‑oriented product surfaces (navigation, SEO, forms, etc.).  
- **Purpose:** Route work by functional area independent of implementation.  
- **What it is:** One area tag.  
- **When to use:** On intake when the affected surface is known.  
- **When to choose:** Prefer `area:*` for user/business‑facing impact; pair with `comp:*` if the artefact is known.  
- **When not to use:** Don’t stack with `comp:*` unless it clarifies routing.  
- **Who uses it:** PMs, devs, designers.  
- **Who decides:** Triage owner.  
- **How to choose:** Pick the user‑facing surface impacted.  
- **How to apply:** Add one area tag.  
- **How to maintain:** Merge or retire rarely used areas.  
- **Scope:** All user‑visible work.  
- **Benefits:** Keeps boards readable by outcome.  
- **Tag format:** `area:<surface>`  
- **Related labels:** `comp:*`, `page:*`, `type:*`  
- **Process:** Identify surface → tag → route

**Default tags (grouped):**

### **Foundations & Ops**

- `area:seo` — Search visibility, metadata, schema.  
- `area:analytics` — Measurement, tagging, dashboards.  
- `area:theme` — Theme‑level behaviour/look & feel.  
- `area:plugins` — Third‑party/first‑party plugin concerns.  
- `area:integration` — External services and bridges.

### **Navigation & Findability**

- `area:navigation` — Global/site navigation patterns.  
- `area:mega-menu` — Large structured menus.  
- `area:mobile-menu` — Mobile menus.  
- `area:search` — Site search UX/results.

### **Content Surfaces & CTAs**

- `area:hero` — Above‑the‑fold hero section.  
- `area:testimonials` — Social proof components.  
- `area:gallery` — Media galleries.  
- `area:cards` — Card lists and grids.  
- `area:cta` — Primary/secondary CTAs.  
- `area:emails` — Transactional/marketing emails.  
- `area:block-visibility` — Conditional display of blocks.  
- `area:post-format` — Presentation of posts by format.

### **Overlays, Motion & Compliance**

- `area:modal` — Dialogs and overlays.  
- `area:slider` — Carousels/sliders.  
- `area:cookie-policies` — Consent and cookie banners.

### **Forms**

- `area:forms` — Form UX, validation, submission.

---

## **`comp:*`** {#comp:*}

- **Family Description:** WP/Gutenberg components, settings or artefacts.  
- **Purpose:** Route precisely to engineers/designers owning components.  
- **What it is:** One component tag.  
- **When to use:** When the exact artefact is known (e.g., `theme.json`, `template-parts`).  
- **When to choose:** Prefer over `area:*` for low‑level changes.  
- **When not to use:** Avoid if only the outcome is known.  
- **Who uses it:** Devs, designers, QA.  
- **Who decides:** Triage owner/assignee.  
- **How to choose:** Pick the most specific artefact.  
- **How to apply:** Add one comp tag.  
- **How to maintain:** Consolidate overlapping components.  
- **Scope:** Implementation‑level work.  
- **Benefits:** Faster assignment and PR mapping.  
- **Tag format:** `comp:<component>`  
- **Related labels:** `area:*`, `type:*`, `template:*`, `block:*`  
- **Process:** Identify artefact → tag → assign

**Default tags (grouped):**

### **Editors & Admin**

- `comp:site-editor` — Site Editor (Appearance → Editor).  
- `comp:block-editor` — Block editor (post/page).  
- `comp:wp-admin` — Classic admin screens.  
- `comp:settings` — Global/settings screens.  
- `comp:post-settings` — Inspector/Document settings.

### **Templates & Patterns**

- `comp:block-templates` — Block templates.  
- `comp:block-patterns` — Pattern management.  
- `comp:template-parts` — Template parts.

### **Theme Config & Tokens**

- `comp:theme-json` — `theme.json` settings/styles.  
- `comp:block-json` — `block.json` definitions.  
- `comp:color-palette` — Colour tokens/palette.  
- `comp:typography` — Type scales/tokens.  
- `comp:spacing` — Spacing scale/tokens.  
- `comp:section-styles` — Section‑level style presets.  
- `comp:block-styles` — Per‑block style variations.

---

# **Optional / Recommended Families**  {#optional-/-recommended-families}

Recommended to apply these at triage when helpful:

- **phase:** project stage  
- **env:** where to reproduce/verify  
- **type:** work category (if not already set)  
- **device:** affected form factor

---

## **`phase:*`**  {#phase:*}

- **Family Description:** Delivery phase to set expectations for completeness, QA depth and stakeholders.  
- **Purpose:** Route work and set acceptance bar based on lifecycle stage.  
- **What it is:** A single tag describing project phase.  
- **When to use:** Apply to all items; update as the project moves phase.  
- **When to choose:** Use when phase affects scope, acceptance criteria or comms.  
- **When not to use:** Don’t stack multiple phases.  
- **Who uses it:** PMs, QA, devs, designers.  
- **Who decides:** PM on intake.  
- **How to choose:** Pick the current project phase.  
- **How to apply:** Add one phase tag.  
- **How to maintain:** Update when moving stage (e.g., staging → live).  
- **Scope:** All feedback items.  
- **Benefits:** Sets the “definition of done” per phase.  
- **Tag format:** `phase:<stage>`  
- **Related labels:** `env:*`, `status:*`  
- **Process:** Plan → build → `pre-launch` → `staging-uat` → `post-launch`

**Default tags:** 

- `phase:staging-uat` — Pre-production validation on staging; stakeholders run UAT to confirm requirements, performance and tracking before release. No new scope unless agreed.  
- `phase:pre-launch` — Build, design and internal QA ahead of UAT; changes are frequent. Work may run on prototype or staging. Objective: reach production-like readiness for acceptance.  
- `phase:post-launch` — Live operations after release: hotfixes, regression control and incremental improvements. Emphasis on stability, monitoring and user impact.

---

## **`env:*`** {#env:*}

- **Family Description:** Environment where the issue exists or is verified.  
- **Purpose:** Prevent “can’t reproduce” by clarifying test/fix location.  
- **What it is:** One environment tag.  
- **When to use:** Add for bugs and verification tasks.  
- **When to choose:** Use when environment impacts reproduction or acceptance.  
- **When not to use:** Don’t add if environment is obvious and unique.  
- **Who uses it:** QA, devs, PMs.  
- **Who decides:** Assignee/QA during triage.  
- **How to choose:** Select the origin or target environment.  
- **How to apply:** Add one env tag.  
- **How to maintain:** Update after promotion/deploy.  
- **Scope:** All issues needing verification.  
- **Benefits:** Clear test location and hand‑offs.  
- **Tag format:** `env:<environment>`  
- **Related labels:** `phase:*`, `status:*`  
- **Process:** Fix in source env → verify → promote

**Default tags:** 

- `env:local` — Developer’s machine/environment for building, debugging and experiments; isolated and not client-visible.  
- `env:prototype` — Early mock or preview (design prototype or pre-code build) for exploring flows and gathering feedback before full implementation.  
- `env:staging` —  Production-like environment used for integration testing, UAT and release rehearsals; mirrors live configuration and data where safe.  
- `env:live` — Production site serving real users and data; changes go through controlled releases with monitoring and rollback paths.

---

# **Recommended tag sets (if relevant)** {#recommended-tag-sets-(if-relevant)}

Recommended to apply these at triage when helpful:

- **page:** add the tag for the `page:*` if relevant  
- **issue:** add the tag for the `issue:*` if relevant  
- **device:** add the tag for the `device:*` if relevant  
- **layout:** add the tag for the `layout:*` if relevant

---

## **`page:*`** {#page:*}

- **Family Description:** Pages/routes where the issue occurs.  
- **Purpose:** Speed filtering and ownership for core routes.  
- **What it is:** One page tag.  
- **When to use:** When the problem is page‑specific.  
- **When to choose:** Use with `area:*`/`comp:*` for clarity.  
- **When not to use:** Don’t add for purely global/site‑wide items.  
- **Who uses it:** Everyone.  
- **Who decides:** Triage owner.  
- **How to choose:** Pick the closest matching route.  
- **How to apply:** Add one page tag.  
- **How to maintain:** Add new routes only if they’re durable.  
- **Scope:** Site pages.  
- **Benefits:** Easier filtering and comms.  
- **Tag format:** `page:<route>`  
- **Related labels:** `area:*`, `template:*`  
- **Process:** Identify route → tag → route to owner

**Default tags (grouped):**

### **Core Marketing & Company**

- `page:home` — Homepage.  
- `page:about` — Company/about page.  
- `page:team` — Team/people listing.  
- `page:services` — Services/offerings.  
- `page:solutions` — Solution landing page(s).  
- `page:portfolio` — Case studies/portfolio.

### **Trust, Content & Engagement**

- `page:testimonials` — Testimonials/reviews page.  
- `page:newsletter-subscribe` — Subscribe/lead capture.  
- `page:blog` — Blog index/landing.  
- `page:faq` — Frequently asked questions.

### **Contact & Legal**

- `page:contact` — Contact page.  
- `page:thank-you` — Post‑form thank‑you page.  
- `page:legal` — Legal/terms/privacy.

### **Commerce & Catalogue**

- `page:products` — Product overview page.  
- `page:events` — Events listing.  
- `page:gallery` — Media gallery page.

---

## **`issue:*`** {#issue:*}

- **Family Description:** Common defect classes for faster triage and reporting.  
- **Purpose:** Speed identification of recurring bug types and playbooks.  
- **What it is:** One issue class.  
- **When to use:** When a bug matches a known pattern.  
- **When to choose:** Add for quick filtering and playbooks.  
- **When not to use:** Don’t invent micro‑classes; keep to defaults unless agreed.  
- **Who uses it:** QA, devs.  
- **Who decides:** QA/assignee.  
- **How to choose:** Pick the best‑fit class.  
- **How to apply:** Add one issue tag.  
- **How to maintain:** Evolve sparingly.  
- **Scope:** Defects only.  
- **Benefits:** Faster triage; clearer reports.  
- **Tag format:** `issue:<class>`  
- **Related labels:** `type:bug`, `area:*`  
- **Process:** Detect → tag issue class → fix

**Default tags:**

- `issue:404-error` — Not found resource.  
- `issue:broken-link` — Link target is missing or wrong.  
- `issue:open-link_blank` — Link target opens incorrectly (e.g., new tab handling).  
- `issue:redirect` — Incorrect/missing/looping redirects.  
- `issue:js-error` — JavaScript error in console/runtime.

---

## **`device:*`** {#device:*}

- **Family Description:** Device form factor impacting reproduction or acceptance.  
- **Purpose:** Make device‑specific behaviour explicit.  
- **What it is:** One device tag.  
- **When to use:** Only when behaviour differs by device.  
- **When to choose:** Add when testing/acceptance must target a form factor.  
- **When not to use:** Don’t add routinely; rely on captured metadata where possible.  
- **Who uses it:** QA, devs, PMs.  
- **Who decides:** Triage owner/QA.  
- **How to choose:** Select the affected form factor.  
- **How to apply:** Add one device tag.  
- **How to maintain:** Keep to the defaults below.  
- **Scope:** Responsive behaviour.  
- **Benefits:** Clear test focus.  
- **Tag format:** `device:<form-factor>`  
- **Related labels:** `layout:*`, `status:*`  
- **Process:** Reproduce on target devices → verify

**Default tags (grouped):**

### **Handheld & Tablet**

- `device:mobile` — Phone viewport.  
- `device:tablet-portrait` — Tablet portrait orientation.  
- `device:tablet-landscape` — Tablet landscape orientation.

### **Desktop**

- `device:laptop` — Typical laptop widths.  
- `device:desktop` — Large desktop widths.

---

## **`layout:*`** {#layout:*}

- **Family Description:** Layout treatments influencing composition and spacing.  
- **Purpose:** Clarify layout expectations and CSS breakpoints.  
- **What it is:** One layout tag.  
- **When to use:** When the layout style is central to the task.  
- **When to choose:** Use for requests/bugs tied to layout behaviour.  
- **When not to use:** Don’t add for copy tweaks.  
- **Who uses it:** Designers, devs.  
- **Who decides:** Triage owner.  
- **How to choose:** Pick the intended layout.  
- **How to apply:** Add one layout tag.  
- **How to maintain:** Keep set small.  
- **Scope:** Presentation.  
- **Benefits:** Faster CSS and template routing.  
- **Tag format:** `layout:<style>`  
- **Related labels:** `device:*`, `template:*`  
- **Process:** Define → implement → verify at breakpoints

**Default tags:**

- `layout:list` — Vertical list layout.  
- `layout:grid` — Grid layout (cards/tiles).  
- `layout:content-width` — Constrained to content width.  
- `layout:wide-width` — Wide content span.  
- `layout:full-width` — Edge‑to‑edge layout.

---

# **Optional Theme Family**  {#optional-theme-family}

Apply if helpful to filter feedback by bigger picture or to signal relative effort:

- **theme:** add tag `theme:*` to filter feedback by bigger picture  
- **size:** add tag `size:*` to signal relative effort 

---

## **`theme:*`** {#theme:*}

- **Family Description:** Theme scope and configuration.  
- **Purpose:** Separate theme‑level work from plugin/module concerns.  
- **What it is:** One theme tag.  
- **When to use:** When work targets the theme or its config/add‑ons.  
- **When to choose:** Add for theme config, block plugin bridges, CPT integration.  
- **When not to use:** Avoid for content‑only tasks.  
- **Who uses it:** Devs, designers.  
- **Who decides:** Triage owner.  
- **How to choose:** Pick the relevant theme scope.  
- **How to apply:** Add one theme tag.  
- **How to maintain:** Keep aligned to active stack.  
- **Scope:** Theme and related modules.  
- **Benefits:** Clear ownership for theme work.  
- **Tag format:** `theme:<scope>`  
- **Related labels:** `comp:*`, `template:*`  
- **Process:** Identify theme scope → tag → assign

**Default tags:**

- `theme:design-system` — DS tokens, components, patterns.  
- `theme:content-model` — CPTs, taxonomies, relationships.  
- `theme:configuration` — Config, settings, env wiring.  
- `theme:tour-operator` — Tour Operator plugin integration.  
- `theme:woocommerce` — WooCommerce plugin integration.  
- `theme:block-theme` — Block theme scaffolding.  
- `theme:plugin` — Plugin theme scaffolding.

---

## **`size:*` (T‑shirt effort sizing — values use CAPS)** {#size:*-(t‑shirt-effort-sizing-—-values-use-caps)}

- **Family Description:** A **relative** scale of effort/complexity using T‑shirt sizes to keep planning quick and comparable. Sizes are **not time**; they reflect scope, uncertainty and risk.  
- **Purpose:** Align the team on how “big” something is without false precision; support capacity planning and release slicing.  
- **What it is:** A **categorical** estimate chosen from a fixed set: **XS, S, M, L, XL, unknown**. Calibrated by comparing tasks to past examples.  
- **When to use:** During intake/refinement for every item that will be scheduled; update if the size materially changes after discovery.  
- **When to choose:** Use alongside **Severity** (urgency) and **status** (stage) to communicate scope quickly.  
- **When not to use:** Don’t treat sizes as hours; don’t use to sneak priority changes.  
- **Who uses it:** PMs, designers, developers, QA during triage/refinement.  
- **Who decides:** The delivery team in refinement; PM records the decision.  
- **How to choose:** Compare to known examples; consider complexity, unknowns, dependencies, test scope. If unknowns dominate, choose **`size:unknown`** and schedule a research.  
- **How to apply:** Add exactly **one** `size:*` tag; keep values **capitalised** (`size:XS|S|M|L|XL|unknown`).  
- **How to maintain:** Keep a **living calibration list** of sample tasks per size; review quarterly.  
- **Scope:** All BugHerd feedback items intended for delivery (design, dev, content, QA).  
- **Benefits:** Faster, less contentious estimation; clearer batching; easier stakeholder comms.  
- **Tag format:** `size:<XS|S|M|L|XL|unknown>`  
- **Related labels:** `status:*`, `phase:*`, `type:*`, `area:*`, `comp:*`, `device:*`  
- **Process:** Intake → provisional **`size:*`** (or `size:unknown`) → discovery/research → confirm size in refinement → deliver

**Default tags:**

### **Execution sizes**

- `size:XS` — Minimal effort; trivial copy/CSS token tweak; low risk.  
- `size:S` — Small change; one component/file; isolated tests; likely \< a day of flow (not time‑boxed).  
- `size:M` — Moderate effort; multiple components or small template; some logic/data; modest QA.

### **Project sizes**

- `size:L` — Significant scope; cross‑component impacts; higher QA breadth; coordination likely.  
- `size:XL` — Large/epic‑level scope; multiple slices/releases; high uncertainty; needs discovery.  
- `size:unknown` — Unscoped; insufficient info. Add a time‑boxed research, then re‑size.

**Calibration tips (keep in your team wiki):**

- Keep 3–5 canonical examples per size from recent work; re-use them during refinement.  
- If debate drags on, pick the larger of the two sizes and move on; the cost of arguing exceeds the precision you’ll gain.  
- If you feel compelled to convert sizes to hours, that’s a smell — step back to relative comparison.

---

# **WP Theme Families**  {#wp-theme-families}

Apply WordPress Block Theme related tag families if relevant **at triage**:

- **block:** add the specific WordPres core block like `block:featured-image` or potentially a third party plugin block like `block:yoast-faq`   
- **template-part:** add the relevant tag for the specific template part like `template-part:header`  or  `template-part:footer`  
- **template:** add the relevant tag for the specific block theme template like `template:index`  or  `template:all-archives`

---

## **`block:*`** {#block:*}

- **Family Description:** WordPress blocks in scope.  
- **Purpose:** Pinpoint issues to specific blocks for faster fixes.  
- **What it is:** One block tag.  
- **When to use:** When a particular block is the source or target of the work.  
- **When to choose:** Add when it clarifies responsibility.  
- **When not to use:** Don’t add if the issue is purely layout/templating.  
- **Who uses it:** Devs, designers, QA.  
- **Who decides:** Assignee/QA.  
- **How to choose:** Pick the affected block.  
- **How to apply:** Add one block tag.  
- **How to maintain:** Keep to common blocks.  
- **Scope:** Block‑level issues.  
- **Benefits:** Reduces guesswork.  
- **Tag format:** `block:<block>`  
- **Related labels:** `comp:*`, `template:*`  
- **Process:** Identify block → tag → assign

**Default tags (grouped):**

### **Structure & Layout**

- `block:group` — Group wrapper block.  
- `block:columns` — Columns layout.  
- `block:cover` — Cover hero/media overlay.  
- `block:list` — Ordered/unordered lists.

### **Media**

- `block:featured-image` — Post/page featured image.  
- `block:gallery` — Media gallery block.  
- `block:image` — Image block.  
- `block:video` — Video block.  
- `block:audio` — Audio block.  
- `block:site-logo` — Site logo block.

### **Content & Meta**

- `block:query-loop` — Post query loop.  
- `block:excerpt` — Post excerpt.  
- `block:read-more` — Read more link.  
- `block:quote` — Quote/pullquote.  
- `block:comments` — Comments block.  
- `block:post-navigation` — Previous/next post links.  
- `block:pagination` — List pagination.

### **Interaction & Social**

- `block:button` — Button block.  
- `block:social` — Social links block.  
- `block:yoast-faq` — Yoast FAQ block.

---

## **`template-part:*`** {#template-part:*}

- **Family Description:** Specific template parts (header, footer, etc.).  
- **Purpose:** Precision routing to the owning partial.  
- **What it is:** One template‑part tag.  
- **When to use:** When a partial is directly affected.  
- **When to choose:** Prefer over `template:*` for isolated parts.  
- **When not to use:** Avoid stacking both unless needed.  
- **Who uses it:** Devs, designers, QA.  
- **Who decides:** Triage owner.  
- **How to choose:** Pick the part in scope.  
- **How to apply:** Add one template‑part tag.  
- **How to maintain:** Keep list tight.  
- **Scope:** Theme partials.  
- **Benefits:** Clear code ownership.  
- **Tag format:** `template-part:<name>`  
- **Related labels:** `block:*`, `comp:*`  
- **Process:** Identify partial → tag → assign

**Default tags:** 

- `template-part:footer` —  Reusable site footer region shared across templates; commonly includes copyright, menus, and contact/social links. Changes to the footer template part propagate to all templates that use it.  
- `template-part:header` —  Reusable site header region shared across templates; typically contains Site Title/Logo, primary Navigation and utility elements. Editing the header template part updates every template that includes it.  
- `template-part:breadcrumbs` —  A template part that renders a breadcrumb trail (home → section → page) to show page hierarchy and aid wayfinding/SEO. Often added via a breadcrumbs block from an SEO plugin or theme pattern and placed near the header or page title.  
- `template-part:sidebar` — A secondary content area used for widgets/blocks such as navigation, recent posts, promos or CTAs. In classic themes it’s a registered widget area; in block themes it’s commonly implemented as a reusable template part included across relevant templates.  
- `template-part:post-meta`  — The strip that displays post metadata (e.g., author, date, categories, tags). Built with core blocks such as Post Author, Post Date, and Post Tags/Post Terms, and usually placed near the title or footer of single and archive templates.  
- `template-part:comments` — The comments area for single templates, powered by the Comments block, which bundles the title, comment list/template, pagination and the Post Comments Form. Typically sits after the main content.

---

## **`template:*`** {#template:*}

- **Family Description:** WordPress templates in scope.  
- **Purpose:** Route by template ownership/acceptance.  
- **What it is:** One template tag.  
- **When to use:** When a specific template is affected.  
- **When to choose:** Use with `area:*`/`comp:*` for clarity.  
- **When not to use:** Avoid if the change is global.  
- **Who uses it:** Devs, designers.  
- **Who decides:** Triage owner.  
- **How to choose:** Pick the affected template.  
- **How to apply:** Add one template tag.  
- **How to maintain:** Keep aligned to theme.  
- **Scope:** Theme templates.  
- **Benefits:** Faster PR mapping.  
- **Tag format:** `template:<name>`  
- **Related labels:** `template-part:*`, `block:*`  
- **Process:** Identify template → tag → assign

**Default tags (grouped):**

### **Core Templates**

- `template:front-page` — Static front page.  
- `template:index` — Blog index fallback.  
- `template:single` — Single post/page fallback.  
- `template:page` — Generic page template.  
- `template:page-default` — Theme default page.  
- `template:page-no-title` — Page without title.  
- `template:page-blank` — Minimal/blank canvas.

### **Archives & Search**

- `template:all-archives` — All archives base.  
- `template:category-archives` — Category archive.  
- `template:tag-archives` — Tag archive.  
- `template:search-results` — Search results page.

### **Error & Utility**

- `template:404` — Not found page.

---

# **Plugin Families**  {#plugin-families}

Apply Plugin specific tag families if relevant **at triage**, take note that these would which would replace the need for using other tag sets like area:\*, com:\*, block::\*, template-part:\*, template:\* or even a plugin extension and potentially more than 1 tag from that plugin family could be applied:

- **to:** add the specific Tour Operator tag like `to:single-destination` or `to:wetu-importer`   
- **woo:** add the specific tag for the specific template part like `woo:part-checkout-header`  or  `woo:block-product-collection`

---

## **`to:*` (Tour Operator plugin)** {#to:*-(tour-operator-plugin)}

- **Family Description:** TO plugin surfaces and features.  
- **Purpose:** Route TO‑specific work precisely.  
- **What it is:** One TO tag.  
- **When to use:** When TO data models, templates or UI are in scope.  
- **When to choose:** Add for single entities, relationships, importer, search and UI.  
- **When not to use:** Avoid for non‑TO features.  
- **Who uses it:** Devs, QA, PMs.  
- **Who decides:** Triage owner.  
- **How to choose:** Pick the specific TO surface.  
- **How to apply:** Add one TO tag.  
- **How to maintain:** Keep list aligned to current TO version.  
- **Scope:** Tour Operator plugin.  
- **Benefits:** Faster routing; clearer QA matrices.  
- **Tag format:** `to:<surface>`  
- **Related labels:** Can be used instead of these tag sets `area:*`, `comp:*`, `block:*`, `template-part:*`, `template:*`  
- **Process:** Identify TO surface → tag → assign

**Default tags (grouped):**

### **Singles**

- `to:single-destination` — Destination detail.  
- `to:single-region` — Region detail.  
- `to:single-country` — Country detail.  
- `to:single-tour` — Tour detail.  
- `to:single-accommodation` — Accommodation detail.  
- `to:single-team` — Team member detail.  
- `to:single-review` — Review detail.  
- `to:single-special` — Special offer detail.

### **Archives**

- `to:destinations-archive` — Destination post type archive.  
- `to:continent-archive` — Geographic continents taxonomy archive.  
- `to:travel-style-archive` — Travel style taxonomy archive.  
- `to:accommodation-type-archive` — Accommodation Type taxonomy archive.  
- `to:accommodation-archive` — Accommodation post type archive.  
- `to:tour-archive` — Tour post type archive.  
- `to:brand-archive` — Accommodation Brands taxonomy archive.  
- `to:team-archive` — Team post type archive.

### **Relationships & Discovery**

- `to:related-tours` — Related tours component.  
- `to:related-accommodation` — Related accommodation.  
- `to:related-destinations` — Related destinations.  
- `to:search-results` — TO search results.  
- `to:read-more` — Read‑more panels/links.  
- `to:maps` — Mapping/locations.

### **System & Data**

- `to:wetu-importer` — Wetu import flows.  
- `to:fast-facts` — Fast facts module.  
- `to:core` — Core plugin functions.  
- `to:post-relationships` — Post relationships model.  
- `to:prices` — Pricing/rates logic.  
- `to:tour-itinerary` — Itinerary presentation.  
- `to:accommodation-rooms` —   
- `to:accommodation-facilities` —   
- `to:specials` — Specials/promotions.  
- `to:reviews` — Reviews module.  
- `to:team` — Team module.

---

## **`woo:*`** {#woo:*}

- **Family Description:** WooCommerce surfaces and features.  
- **Purpose:** Route commerce‑specific work to the right owners.  
- **What it is:** One Woo tag.  
- **When to use:** When the issue concerns product/catalogue/cart/checkout/account or Woo logic.  
- **When to choose:** Add for templates, parts, shipping, tax and extension work.  
- **When not to use:** Avoid for non‑commerce surfaces.  
- **Who uses it:** Devs, QA, PMs.  
- **Who decides:** Triage owner.  
- **How to choose:** Pick the most specific Woo surface.  
- **How to apply:** Add one Woo tag.  
- **How to maintain:** Consolidate where overlap occurs.  
- **Scope:** Commerce.  
- **Benefits:** Faster routing and regression checks.  
- **Tag format:** `woo:<surface>`  
- **Related labels:** Can be used instead of these tag sets `area:*`, `comp:*`, `page:*`, `block:*`, `template-part:*`, `template:*`, `template:*`   
- **Process:** Identify surface → tag → route

**Default tags (grouped):**

### **Product Pages & Parts**

- `woo:single-product` — Single product template.  
- `woo:product-gallery` — Product gallery UI.  
- `woo:product-image` — Main/alt images handling.  
- `woo:product-reviews` — Reviews UI/logic.  
- `woo:related-products` — Related/recommended modules.  
- `woo:part-single-product-info` — Buy box/details area.

### **Woo Blocks**

- `woo:block-product-collections` — Curated collections.  
- `woo:block-product-search` — Search form/logic.  
- `woo:block-cart` — Cart block with inner blocks.   
- `woo:block-checkout` — Checkout block with inner blocks.

### **Woo Pages**

- `woo:page-cart` — Cart page.  
- `woo:page-checkout` — Checkout page.  
- `woo:page-order-confirmation` — Order received/thank‑you.  
- `woo:page-my-account` — Account dashboard/areas.  
- `woo:page-coming-soon` — Temporary storefront state.

### **Woo Features**

- `woo:shipping` — Shipping rules/UI/integration.  
- `woo:tax` — Taxes/config.  
- `woo:coupons` — Coupons/discounts.  
- `woo:extension-subscriptions` — Subscriptions extension.  
- `woo:emails` — Transactional emails.

### **Woo Patterns**

- `woo:patterns` — Woo patterns used.

### **Woo Template Parts**

- `woo:part-mini-cart` — Off‑canvas/mini cart.  
- `woo:part-checkout-header` — Checkout header/steps.

### **Woo Block Templates**

- `woo:template-shop` — Shop index page.  
- `woo:template-product-archives` — All product archives.  
- `woo:template-product-attribute-archives` — Attribute archives.  
- `woo:template-product-category-archives` — Category archives.  
- `woo:template-product-tag-archives` — Tag archives.  
- `woo:template-product-brand-archives` — Brand archives.  
- `woo:template-product-search-results` — Results listing.

---

