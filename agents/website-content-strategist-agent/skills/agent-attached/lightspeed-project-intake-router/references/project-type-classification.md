# Project Type Classification

Use this table to classify the project and choose the likely route.

| Type | Indicators | Primary route | Notes |
|---|---|---|---|
| WordPress block theme | `theme.json`, templates, parts, patterns, global styles | `lightspeed-figma-wordpress-technical-brief` or `wordpress-block-theme-handoff` | Default route for new LightSpeed site builds once evidence is clear. |
| Block theme + block plugin | custom blocks, `src/blocks`, build files, SCF JSON, filters or dynamic UI | `lightspeed-figma-wordpress-technical-brief` | Clarify theme/plugin boundary before task planning. |
| Hybrid conversion | classic theme, PHP templates, partial block adoption, legacy customiser | `lightspeed-project-researcher` then technical brief | Needs migration and regression risk review. |
| WooCommerce or ecommerce | product templates, cart/checkout, subscriptions, bookings, brands, payments, shipping | `lightspeed-prd-generator` plus technical brief | Add ecommerce QA and conversion tracking later. |
| Publishing/content platform | archives, authors, taxonomy, ad inventory, editorial workflows, migration | `lightspeed-project-researcher` | Add redirects, schema, analytics and editorial workflow routes as needed. |
| Tourism/tour operator | tours, destinations, itineraries, Wetu, enquiries, trip content | `lightspeed-prd-generator` or `lightspeed-project-researcher` | Add content collection and chatbot/source routes where needed. |
| AI readiness/governance | readiness checklist, policy needs, source-of-truth, chatbot, approved prompts | `lightspeed-ai-readiness-router` | Split into readiness, governance, content and chatbot stages. |
| Migration/redesign | old and new URLs, IA changes, domain change, content consolidation | `lightspeed-project-researcher` plus redirect planner | Redirects and SEO controls are likely launch blockers. |
| Lead-generation/professional services | service pages, CTAs, forms, case studies, tracking | `lightspeed-prd-generator` | Add GA4/conversion tracking and claim review where needed. |
| Internal plugin/product | repo issues, release goals, plugin roadmap, docs, QA checklist | `lightspeed-project-researcher` or `lightspeed-task-breakdown-planner` | Do not route to client-facing content unless requested. |

## Build-type confidence

Use these labels:

- **High confidence:** explicit source evidence confirms build type.
- **Medium confidence:** indicators strongly suggest build type, but one confirmation is still needed.
- **Low confidence:** inferred from limited notes; ask one focused question or route to evidence review.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
