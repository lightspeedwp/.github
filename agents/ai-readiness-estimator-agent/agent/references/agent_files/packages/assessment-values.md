# AI Package Assessment Values

## Purpose
Use this file to drive intake before package routing or pricing.

## Operating Rules
- Gather values in batches.
- Try to source each value automatically first.
- Show the client what was found.
- Ask the client to confirm or correct it.
- Ask only for missing values.
- If Gmail, Figma, GitHub, or another source is not connected, do not imply it was scanned.

## Intake Batches

### 1. Reference Sources
Ask for or inspect:
- primary website URL
- staging site URL if available
- Google Docs or Drive links
- GitHub repo if relevant
- Figma links if relevant
- prior proposal or scope documents
- SEO or technical audit documents
- analytics or Search Console references
- policy, governance, or compliance documents
- chatbot or AI strategy notes if they already exist

### 2. Live Website / Platform Discovery
Try to identify from the live site or references:
- platform
- WooCommerce status
- blog, FAQ, and policy-page presence
- sitemap and robots.txt status
- visible search feature
- product and category scale signals
- critical plugins or technical dependencies
- integrations or third-party systems
- multilingual or multi-brand status

### 3. Business Goals / Package Intent
Confirm:
- project goal
- requested services or package intent
- delivery type
- target timeline
- internal owner
- whether a chatbot is already live, planned, or exploratory

### 4. Scope Confirmation / Commercial Routing
Confirm:
- whether the audit findings fit a standard package
- whether any fixed-fee disqualifiers are present
- whether add-ons are needed after the primary base package is chosen
- whether sensitive or regulated use cases change the routing or scope

## Shared Values Required Before Routing Or Pricing

| Value | Description | Try to source from | Ask if missing |
|---|---|---|---|
| `website_url` | Live site URL | client input, live site | website URL |
| `staging_url` | Staging site URL | client input, docs | staging URL |
| `platform` | CMS / stack | live site, repo | confirm platform |
| `woocommerce_status` | WooCommerce in use | live site, repo | confirm ecommerce |
| `product_count_estimate` | Rough product volume | live site, sitemap | approximate product count |
| `category_count_estimate` | Rough category volume | live site, navigation | approximate category count |
| `blog_presence` | Blog or resource content exists | live site | confirm |
| `faq_presence` | FAQ or help content exists | live site | confirm source pages |
| `policy_presence` | privacy / terms / returns pages exist | live site | confirm missing policies |
| `ga4_status` | GA4 present | site tags, docs | confirm analytics status |
| `gtm_status` | GTM present | site tags, docs | confirm tag manager status |
| `search_console_status` | Search Console access exists | docs, client input | confirm access |
| `critical_plugins` | plugins affecting scope | repo, plugin list, docs | list critical plugins |
| `integrations` | CRM, booking, ERP, helpdesk, API dependencies | website, docs | list integrations |
| `multilingual_or_multibrand_status` | multi-language or multi-brand status | live site, docs | confirm |
| `sensitive_or_regulated_use_cases` | privacy, regulated, or sensitive flows | docs, client input | describe risks |
| `project_goal` | main business goal | brief, client input | goal statement |
| `delivery_type` | audit only / implementation / implementation + chatbot | client input | delivery type |
| `target_timeline` | timing | client input, prior comms | deadline or target month |
| `internal_owner` | client-side owner | docs, client input | name and role |

## Client Confirmation Questions
Ask these after the first scan:
- What is the main AI-related outcome you want to achieve first?
- Are you looking for audit only, implementation, or implementation plus chatbot?
- Do you already have internal rules for AI content or chatbot governance?
- Are there any restricted topics or sensitive user-data flows we should know about?
- Is a chatbot already live, planned, or only exploratory?

## Output Rule
Do not finalise package recommendation until:
1. website findings are confirmed
2. missing business-goal fields are supplied
3. any sensitive or regulated use cases are disclosed
