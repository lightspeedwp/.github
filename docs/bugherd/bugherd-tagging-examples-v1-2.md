# **Bugherd Tagging Examples**

## *Examples (copy/paste starters)*

---

[1\) Checkout error blocks payment](#1\)-checkout-error-blocks-payment)

[2\) Post‑launch typo on CTA section](#2\)-post‑launch-typo-on-cta-section)

[3\) LCP slow on homepage hero](#3\)-lcp-slow-on-homepage-hero)

[4\) Contrast fails on mobile form labels (A11y/Device)](#4\)-contrast-fails-on-mobile-form-labels-\(a11y/device\))

[5\) Theme token mismatch for headings (Comp/Theme)](#5\)-theme-token-mismatch-for-headings-\(comp/theme\))

[6\) FAQ page anchor links broken (Page/Issue)](#6\)-faq-page-anchor-links-broken-\(page/issue\))

[7\) Mega‑menu overflows on tablet landscape (Device/Layout)](#7\)-mega‑menu-overflows-on-tablet-landscape-\(device/layout\))

[8\) Testimonials switched to grid (Layout/Area)](#8\)-testimonials-switched-to-grid-\(layout/area\))

[9\) Button block spacing regression (Block)](#9\)-button-block-spacing-regression-\(block\))

[10\) Header alignment off after logo swap (Template‑part)](#10\)-header-alignment-off-after-logo-swap-\(template‑part\))

[11\) Category archive pagination incorrect (Template)](#11\)-category-archive-pagination-incorrect-\(template\))

[12\) Wetu importer mapping missing fields (TO plugin)](#12\)-wetu-importer-mapping-missing-fields-\(to-plugin\))

[13\) Mini‑cart totals mismatch (Woo)](#13\)-mini‑cart-totals-mismatch-\(woo\))

[14\) Define DS tokens for new brand (Theme)](#14\)-define-ds-tokens-for-new-brand-\(theme\))

[15\) Gate UAT for sign‑off (Phase/Env)](#15\)-gate-uat-for-sign‑off-\(phase/env\))

[16\) Unknown complexity — requires research (Size)](#16\)-unknown-complexity-—-requires-research-\(size\))

---

# **1\) Checkout error blocks payment** {#1)-checkout-error-blocks-payment}

```
Reported by:
- Client during UAT testing

Bugherd Fields:- Feedback = needs triage
- Severity = None
- Visible to = Members & Clients
- Assigned to = UnassignedTags to apply on triage:
- status:needs-dev
- type:bug- phase:staging-uat
- woo:page-checkout
- env:staging

Note: The woo family serves to replace the area & comp families.
```

# **2\) Post‑launch typo on CTA section** {#2)-post‑launch-typo-on-cta-section}

```
Reported by:
- Project Manager during testing

Bugherd Fields:- Board column = TODO 
- Severity = Normal
- Visible to = Members & Clients
- Assigned to = ClientNameTags applied:
- status:needs
- type:content-management
- page:home
- area:cta
- phase:post-launch
- env:live

Note: The client provided content with typo, they are able to edit
```

# **3\) LCP slow on homepage hero** {#3)-lcp-slow-on-homepage-hero}

```
Feedback:
- Developer during testing

Bugherd Fields:- Board column = TODO 
- Severity = Critical
- Visible to = Members
- Assigned to = DeveloperNameTags applied:
- status:needs
- type:performance
- page:home
- area:hero
- phase:pre-launch
- env:staging

Note: The site needs to launch soon, performance is critical to conversion, we cannot launch a slow site.

```

---

# **4\) Contrast fails on mobile form labels (A11y/Device)** {#4)-contrast-fails-on-mobile-form-labels-(a11y/device)}

```
Reported by:
- QA during UAT  

BugHerd Fields:
- Severity = Critical
- Assigned = DevName 

Tags applied:  
- status:needs-dev  
- type:a11y  
- area:forms  
- device:mobile  
- issue:js-error  
- phase:staging-uat  
- env:staging  
- size:S  

Note: Add tokenised colour variable to meet WCAG; JS error surfaced on blur.
```

---

# **5\) Theme token mismatch for headings (Comp/Theme)** {#5)-theme-token-mismatch-for-headings-(comp/theme)}

```
Reported by:
- Designer during design review  

BugHerd Fields:
- Severity = Normal
- Assigned = DevName 

Tags applied:  
- status:needs-dev  
- comp:theme-json  
- theme:design-system  
- page:about  
- size:S  

Note: Update theme.json typography scale; no template changes.
```

---

# **6\) FAQ page anchor links broken (Page/Issue)** {#6)-faq-page-anchor-links-broken-(page/issue)}

```
Reported by:
- Client during UAT 

Tags applied: 
- status:needs-dev  
- type:bug  
- page:faq  
- issue:broken-link  
- env:staging  
- size:S  

Note: Fix in-page anchors and regenerate ToC.
```

---

# **7\) Mega‑menu overflows on tablet landscape (Device/Layout)** {#7)-mega‑menu-overflows-on-tablet-landscape-(device/layout)}

```
Reported by:
- QA  

Tags applied:  
- status:needs-dev 
- area:mega-menu 
- layout:wide-width  
- device:tablet-landscape  
- env:staging  
- size:M  

Note: Adjust CSS clamps and container queries for breakpoint.
```

---

# **8\) Testimonials switched to grid (Layout/Area)** {#8)-testimonials-switched-to-grid-(layout/area)}

```
Reported by:
- PM (content update request)  

Tags applied:  
- status:needs-design  
- type:improve  
- area:testimonials  
- layout:grid  
- page:testimonials  
- env:live  
- size:S  

Note: Minor layout uplift; no new logic.
```

---

# **9\) Button block spacing regression (Block)** {#9)-button-block-spacing-regression-(block)}

```
Reported by:
- QA  

Tags applied:  
- status:needs-dev  
- block:button  
- comp:block-styles  
- page:services  
- env:staging  
- size:S  

Note: Restore spacing token; add regression test.
```

---

# **10\) Header alignment off after logo swap (Template‑part)** {#10)-header-alignment-off-after-logo-swap-(template‑part)}

```
Reported by:
- Client on live  

Tags applied:  
- status:needs-dev  
- template-part:header  
- area:navigation  
- env:live  
- size:S  

Note: Constrain logo aspect ratio; avoid CLS.
```

---

# **11\) Category archive pagination incorrect (Template)** {#11)-category-archive-pagination-incorrect-(template)}

```
Reported by:
- SEO specialist  

Tags applied:  
- status:needs-dev  
- template:category-archives  
- block:pagination  
- area:seo  
- size:M  

Note: Ensure rel=next/prev and canonical rules.
```

---

# **12\) Wetu importer mapping missing fields (TO plugin)** {#12)-wetu-importer-mapping-missing-fields-(to-plugin)}

```
Reported by:
- Developer during migration  

Tags applied:  
- status:needs-dev  
- to:wetu-importer  
- to:post-relationships  
- env:staging  
- size:M  

Note: Add new field mappings; backfill script required.
```

---

# **13\) Mini‑cart totals mismatch (Woo)** {#13)-mini‑cart-totals-mismatch-(woo)}

```
Reported by:
- Client during UAT  

Tags applied:  
- status:needs-dev  
- woo:part-mini-cart  
- woo:page-cart  
- env:staging  
- size:M  

Note: Sync tax/shipping calculation with backend; add E2E test.
```

---

# **14\) Define DS tokens for new brand (Theme)** {#14)-define-ds-tokens-for-new-brand-(theme)}

```
Reported by:
- Designer  

Tags applied:  
- status:needs-design-review  
- theme:design-system  
- comp:color-palette  
- comp:typography  
- size:L  

Note: Introduces new token set; cross‑component impact.
```

---

# **15\) Gate UAT for sign‑off (Phase/Env)** {#15)-gate-uat-for-sign‑off-(phase/env)}

```
Reported by:
- PM  

Tags applied:  
- status:ready  
- phase:staging-uat  
- env:staging  
- size:XS  

Note: No work, just readiness marker for controlled UAT.
```

---

# **16\) Unknown complexity — requires research (Size)** {#16)-unknown-complexity-—-requires-research-(size)}

```
Reported by:
- Developer  

Tags applied:  
- status:on-hold
- type:dev
- area:integration
- env:staging
- size:unknown 

Note: Add a time‑boxed research to de‑risk before sizing M/L.
```

---

