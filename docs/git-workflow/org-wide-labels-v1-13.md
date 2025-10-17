# Org-wide Labels Catalogue

***Version:*** 1.13 • ***Last updated:*** 17 Oct 2025
---

**Scope:** Canonical list of organisation-wide GitHub labels. Use labels for **routing & search**. Keep **Project fields** authoritative for Status, Priority, Area/Theme, etc.

## Families
Labels follow the `family:value` convention. Colours follow a consistent palette for scanning across repos.

### `priority:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `priority:critical` | `#B60205` | Production-blocking or business-critical. |
| `priority:important` | `#B60205` | High-value or time-sensitive. |
| `priority:normal` | `#B60205` | Default priority. |
| `priority:minor` | `#B60205` | Low-impact or cosmetic. |

### `status:*`  *(exactly one)*

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `status:needs-triage` | `#C5DEF5` | Intake; awaiting initial review. |
| `status:ready` | `#0E8A16` | Approved and ready to start. |
| `status:in-progress` | `#1D76DB` | Actively being worked on. |
| `status:needs-dev` | `#C5DEF5` | Queued for engineering. |
| `status:needs-design` | `#C5DEF5` | Queued for design. |
| `status:needs-review` | `#C5DEF5` | Awaiting code/design review. |
| `status:needs-qa` | `#C5DEF5` | Awaiting QA verification. |
| `status:needs-testing` | `#C5DEF5` | Manual or automated testing required. |
| `status:needs-content` | `#C5DEF5` | Content update required. |
| `status:needs-docs` | `#C5DEF5` | Documentation to be added/updated. |
| `status:needs-more-info` | `#C5DEF5` | Blocked pending reporter details. |
| `status:needs-discussion` | `#C5DEF5` | Requires team discussion/decision. |
| `status:in-discussion` | `#C5DEF5` | Currently being discussed. |
| `status:on-hold` | `#F9D0C4` | Paused by product/ops decision. |
| `status:blocked` | `#B60205` | Cannot proceed due to dependency/issue. |
| `status:ready-for-deployment` | `#0E8A16` | Approved and queued to deploy. |
| `status:duplicate` | `#E1E4E8` | Duplicate of another issue. |
| `status:wontfix` | `#E1E4E8` | Won’t be actioned. |
| `status:needs-technical-feedback` | `#C5DEF5` | Awaiting technical review/feedback. |

### `type:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `type:bug` | `#D4C5F9` | Defects/regressions. |
| `type:feature` | `#D4C5F9` | New capabilities. |
| `type:performance` | `#D4C5F9` | Perf optimisation. |
| `type:refactor` | `#D4C5F9` | Internal rework. |
| `type:chore` | `#D4C5F9` | Hygiene/tooling. |
| `type:dev` | `#D4C5F9` | Engineering tasks. |
| `type:design` | `#D4C5F9` | Design tasks. |
| `type:content-management` | `#D4C5F9` | Content ops & modelling. |
| `type:a11y` | `#D4C5F9` | Accessibility work. |
| `type:ui` | `#D4C5F9` | UI polish/fixes. |
| `type:ux` | `#D4C5F9` | Research/UX flows. |
| `type:improve` | `#D4C5F9` | Enhancements/tech-debt reduction. |
| `type:task` | `#D4C5F9` | General task work. |

### `area:*`  *(broad area)*

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `area:checkout` | `#C5DEF5` | Checkout flows. |
| `area:navigation` | `#C5DEF5` | Menus/navigation. |
| `area:forms` | `#C5DEF5` | Form UX/validation. |
| `area:search` | `#C5DEF5` | Site search. |
| `area:ci` | `#C5DEF5` | CI pipelines. |
| `area:dependencies` | `#C5DEF5` | Dependency management. |
| `area:deployment` | `#C5DEF5` | Release/deploy. |
| `area:design-system` | `#C5DEF5` | Tokens/components. |

### `comp:*`  *(specific artefact)*

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `comp:hero` | `#C5DEF5` | Hero component. |
| `comp:theme-json` | `#C5DEF5` | `theme.json` tokens/settings. |
| `comp:menu` | `#C5DEF5` | Menu/Mega menu. |

### `env:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `env:live` | `#E1E4E8` | Production issues/changes. |
| `env:staging` | `#E1E4E8` | Pre-prod/staging. |
| `env:dev` | `#E1E4E8` | Local/dev. |

### `phase:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `phase:pre-launch` | `#E1E4E8` | Work prior to go-live. |
| `phase:post-launch` | `#E1E4E8` | Post-launch fixes/improvements. |

### `page:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `page:home` | `#C5DEF5` | Homepage. |
| `page:faq` | `#C5DEF5` | FAQ page. |
| `page:checkout` | `#C5DEF5` | Checkout page(s). |

### `issue:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `issue:js-error` | `#D93F0B` | JavaScript error thrown. |
| `issue:broken-link` | `#D93F0B` | Broken/misdirected link. |

### `device:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `device:mobile` | `#E1E4E8` | Mobile viewports. |
| `device:tablet` | `#E1E4E8` | Tablet viewports. |
| `device:desktop` | `#E1E4E8` | Desktop viewports. |

### `layout:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `layout:grid` | `#C5DEF5` | Grid/layout issues. |
| `layout:form` | `#C5DEF5` | Form layout. |

### `theme:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `theme:design-system` | `#C5DEF5` | DS tokens/components. |

### `size:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `size:XS` | `#C2E0C6` | Extra-small. |
| `size:S` | `#C2E0C6` | Small. |
| `size:M` | `#C2E0C6` | Medium. |
| `size:L` | `#C2E0C6` | Large. |
| `size:XL` | `#C2E0C6` | Extra-large. |

### `block:*` (Gutenberg)

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `block:button` | `#C5DEF5` | Button block. |
| `block:image` | `#C5DEF5` | Image block. |

### `template:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `template:category-archives` | `#C5DEF5` | Category archive template. |

### `template-part:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `template-part:header` | `#C5DEF5` | Header template part. |
| `template-part:footer` | `#C5DEF5` | Footer template part. |

### `woo:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `woo:block-cart` | `#D4C5F9` | Woo cart block. |
| `woo:block-checkout` | `#D4C5F9` | Woo checkout block. |

### `to:*` (Tour Operator)

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `to:import` | `#C5DEF5` | Import routines. |
| `to:meta` | `#C5DEF5` | Metadata/mapping. |

### `compat:*`

| Label | Colour | Purpose |
| :---- | :----- | :------ |
| `compat:rtl` | `#D93F0B` | Right-to-left layout support. |

### Usage notes
- Keep **exactly one** `status:*` and **one** `priority:*` on issues/PRs.
- Use `status:needs-*` to drive automation (e.g., `status:needs-qa` → moves to **In QA**).
- Prefer **Project fields** for Status/Priority/Area/Theme; use labels to echo for visibility/search.
