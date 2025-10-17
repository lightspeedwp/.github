# **BugHerd Tagging Guide**

## *Front-Matter Explainer*

---

[How this guide works](#how-this-guide-works)

[What tags are for (and not for)](#what-tags-are-for-\(and-not-for\))

[Families and where they live](#families-and-where-they-live)

[“How to report” (mini-guide)](#“how-to-report”-\(mini-guide\))

[Tag families explained (field glossary)](#tag-families-explained-\(field-glossary\))

[Document conventions](#document-conventions)

[Family section template (copy-me)](#family-section-template-\(copy-me\))

[Default tags (grouped):](#default-tags-\(grouped\):)

[Example of a filled family (illustrative only)](#example-of-a-filled-family-\(illustrative-only\))

[Sources used](#sources-used)

---

# **How this guide works** {#how-this-guide-works}

This guide standardises how we label BugHerd feedback so intake, triage, assignment, QA and release are fast and predictable. Tags are written `family:value` in lower-case kebab-case (e.g., `area:navigation`). Apply **one tag per family** to keep boards readable and reporting reliable. Use BugHerd’s built-in **Severity** for urgency, and attach clear steps, expected vs. actual, and a screenshot/recording for actionability. BugHerd auto-captures useful context (URL, browser, OS, screen size), so keep manual inputs focused on the decision-making bits. [BugHerd+1](https://bugherd.com/blog/bug-reporting?utm_source=chatgpt.com)

## **What tags are for (and not for)** {#what-tags-are-for-(and-not-for)}

* **For routing & reporting**: tags help the team find, scope and assign work quickly. [GitHub Docs](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels?utm_source=chatgpt.com)  
* **Not for urgency**: use **Severity** (crit/major/normal/minor) when you mean urgency/impact.  
* **Keep the set small**: 3–6 tags per item is typical; more creates noise.  
* **Use visual evidence**: clear screenshots/annotations or short screen recordings reduce back-and-forth and raise fix quality. [BugHerd+2BugHerd+2](https://bugherd.com/blog/bug-reporting?utm_source=chatgpt.com)

## **Families and where they live** {#families-and-where-they-live}

We group tags into **families**. Each family has a single purpose (e.g., workflow state, area of impact, device). Families are categorised to make triage fast:

* **Required**: always apply (e.g., `status:*`, plus **one** of `area:*` or `comp:*`).  
* **Recommended**: apply if known at intake (e.g., `page:*`, `issue:*`).  
* **Optional**: add when it improves routing or acceptance (e.g., `phase:*`, `env:*`, `device:*`, `type:*`).  
* **Project/Plugin-specific**: only when relevant to the stack (e.g., `woo:*`, `to:*`).  
* **Sizing**: `size:*` (T-shirt sizing) signals relative **effort/complexity**, not hours. Keep values in CAPS (XS/S/M/L/XL) for clarity. [ActiveCollab+1](https://activecollab.com/blog/project-management/t-shirt-sizing?utm_source=chatgpt.com)

Rule of thumb: **Severity** \= how bad, **Size** \= how big, **Status** \= where it is, **Type** \= what kind of work.

## **“How to report” (mini-guide)** {#“how-to-report”-(mini-guide)}

When creating a BugHerd task, include:

* **Title**: specific and brief.  
* **Steps to reproduce** (numbered) \+ **URL**.  
* **Expected vs actual** result.  
* **Severity** (Critical/Major/Normal/Minor).  
* **Screenshot/recording** with on-screen annotation if possible.  
* **Environment** (staging/live) and **device** only if it affects reproduction/acceptance.  
   This keeps reports actionable and reduces rework during UAT. [BugHerd](https://bugherd.com/blog/bug-reporting?utm_source=chatgpt.com)

---

# **Tag families explained (field glossary)** {#tag-families-explained-(field-glossary)}

Each family section in this guide follows the same structure. Use these definitions as you read any family.

* **Family Description** — What the family represents (its single purpose in the workflow or product).  
* **Purpose** — Why we use this family; the decision it helps us make quickly.  
* **What it is** — The core concept (e.g., a workflow state, a page route, a component name).  
* **When to use** — When this family applies at all (e.g., always, only for defects, only during UAT).  
* **When to choose** — How to decide this family adds value on a given task (signal vs. noise).  
* **When not to use** — Common misuse; when it creates duplication/ambiguity.  
* **Who uses it** — Roles that read and apply this family (PM, dev, designer, QA, client).  
* **Who decides** — The role that sets/changes it during intake/refinement/QA.  
* **How to choose** — Criteria or heuristics to pick the **one** best option within the family.  
* **How to apply** — Exact format and where to add it on the BugHerd task.  
* **How to maintain** — Hygiene: review cadence, retiring/merging values, adding new ones with governance.  
* **Scope** — The kinds of tasks this family covers (design/dev/content/QA) and any exclusions.  
* **Benefits** — What we gain (e.g., faster routing, cleaner dashboards, better hand-offs).  
* **Tag format** — The canonical pattern `family:value` (lower-case kebab-case).  
* **Related labels** — Other families commonly used together (to avoid over- or under-tagging).  
* **Process** — Where this family appears in the end-to-end flow (e.g., Intake → Dev → Review → QA → Release).

These sections make families **self-describing**, so new teammates (or clients in UAT) can apply them consistently. [BugHerd+1](https://bugherd.com/article/the-ultimate-guide-to-bug-tracking-strategies-tools-and-best-practices?utm_source=chatgpt.com)

---

# **Document conventions** {#document-conventions}

* **One tag per family** on each task (mutually exclusive values keep dashboards trustworthy). [GitHub Docs+1](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels?utm_source=chatgpt.com)  
* **Lower-case kebab-case** values (e.g., `page:thank-you`, `area:mega-menu`).  
* **Keep values durable**: prefer reusable, long-lived values over one-offs.  
* **Propose before adding**: avoid synonyms and duplication (e.g., `area:call-to-action` vs `area:cta`).  
* **Sizing** uses **CAPS** values by design: `size:XS|S|M|L|XL|unknown` (relative effort only). [ActiveCollab](https://activecollab.com/blog/project-management/t-shirt-sizing?utm_source=chatgpt.com)  
* **Evidence first**: good reports \= steps \+ expected/actual \+ annotated image/clip. [BugHerd+1](https://bugherd.com/blog/bug-reporting?utm_source=chatgpt.com)

---

# **Family section template (copy-me)** {#family-section-template-(copy-me)}

Duplicate this block for each family. Replace `family` with the actual family name (e.g., `status`, `type`, `area`, `comp`, `page`, `issue`, `device`, `layout`, `phase`, `env`, `theme`, `size`, `woo`, `to`, etc.). Do **not** change the field headings—keep them consistent across families.

### **`family:*`**

* **Family Description:** *\[what this family represents in one sentence\]*  
* **Purpose:** *\[why we use it; what decision it speeds up\]*  
* **What it is:** *\[the concept/value type this family holds\]*  
* **When to use:** *\[intake only, always, only for X, etc.\]*  
* **When to choose:** *\[how to decide this family adds signal on a task\]*  
* **When not to use:** *\[common misuses to avoid\]*  
* **Who uses it:** *\[roles that read/apply it\]*  
* **Who decides:** *\[role that sets/changes it\]*  
* **How to choose:** *\[selection criteria or heuristics\]*  
* **How to apply:** *\[`family:value` format; one per family\]*  
* **How to maintain:** *\[review/retire/merge cadence and governance\]*  
* **Scope:** *\[what kinds of tasks it covers\]*  
* **Benefits:** *\[routing/reporting/QA/UX outcomes\]*  
* **Tag format:** `family:<value>`  
* **Related labels:** *\[`other-family:*` commonly paired\]*  
* **Process:** *\[where it fits in the end-to-end flow\]*

## **Default tags (grouped):** {#default-tags-(grouped):}

Add groups (2–5 is ideal) so readers scan quickly. In each group, list the default values with **short, concrete** descriptions (what someone should pick them for).

* **Group A — *\[name\]***  
  * `family:value-1` — *\[short description\]*  
  * `family:value-2` — *\[short description\]*

* **Group B — *\[name\]***  
  * `family:value-3` — *\[short description\]*  
  * `family:value-4` — *\[short description\]*

* **Group C — *\[name\]***  
  * `family:value-5` — *\[short description\]*

Tip: prefer **mutually-exclusive** values where possible. If two values can be true at once, consider whether one belongs in a **different family**. [GitHub Docs](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels?utm_source=chatgpt.com)

## **Example of a filled family (illustrative only)** {#example-of-a-filled-family-(illustrative-only)}

This shows tone/length and how grouped defaults read. Replace it with your real family content later.

### **`size:*` (T-shirt effort sizing — values use CAPS)**

* **Family Description:** Relative effort/complexity for planning and batching.  
* **Purpose:** Fast, low-friction signal of scope; supports capacity planning.  
* **What it is:** One of **XS, S, M, L, XL, unknown** (not time; relative).  
* **When to use:** At intake/refinement for any deliverable task.  
* **When to choose:** Use whenever work must be scheduled or compared.  
* **When not to use:** Don’t equate sizes to hours; don’t use for urgency.  
* **Who uses it:** PM, dev, design, QA.  
* **Who decides:** Delivery team in refinement; PM records.  
* **How to choose:** Compare to benchmark tasks; consider complexity/unknowns/dependencies/test scope.  
* **How to apply:** Add one tag; keep values **CAPS** (`size:XS|S|M|L|XL|unknown`).  
* **How to maintain:** Keep a small set of benchmark examples per size; review quarterly.  
* **Scope:** All deliverable tasks.  
* **Benefits:** Faster estimation, clearer batching, better comms.  
* **Tag format:** `size:<XS|S|M|L|XL|unknown>`  
* **Related labels:** `status:*`, `phase:*`, `type:*`  
* **Process:** Intake → provisional size → research if needed → confirm at refinement. [ActiveCollab+1](https://activecollab.com/blog/project-management/t-shirt-sizing?utm_source=chatgpt.com)

### **Default tags (grouped):**

* **Execution sizes**  
  * `size:XS` — Trivial tweak; low risk.  
  * `size:S` — Small change to one component/file.  
  * `size:M` — Moderate scope; multiple components or small template.  
* **Project sizes**  
  * `size:L` — Significant scope; cross-component impacts.  
  * `size:XL` — Epic-level; split into slices/releases.  
  * `size:unknown` — Needs discovery/research before sizing.

---

# **Sources used** {#sources-used}

* What to include in a good bug report; value of steps, expected vs actual, and visuals; BugHerd’s role in streamlining reporting. [BugHerd](https://bugherd.com/blog/bug-reporting?utm_source=chatgpt.com)  
* End-to-end bug tracking strategy and consistent workflows. [BugHerd](https://bugherd.com/article/the-ultimate-guide-to-bug-tracking-strategies-tools-and-best-practices?utm_source=chatgpt.com)  
* UAT best practices and modern visual feedback in place of spreadsheets/email. [BugHerd](https://bugherd.com/blog/user-acceptance-testing?utm_source=chatgpt.com)  
* Website annotation to make feedback precise and actionable. [BugHerd](https://bugherd.com/blog/website-annotation-a-complete-guide-on-annotating-web-projects?utm_source=chatgpt.com)  
* T-shirt sizing as relative estimation (XS–XL) and calibration guidance. [ActiveCollab+1](https://activecollab.com/blog/project-management/t-shirt-sizing?utm_source=chatgpt.com)

* Label discipline and governance (one clear purpose; avoid duplication). [GitHub Docs+1](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels?utm_source=chatgpt.com)

---

