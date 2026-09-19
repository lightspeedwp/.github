# AI Readiness Checklist for Your Website

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Target audience: Business owners, marketing managers, ecommerce teams, professional services firms and content-heavy organisations.  
Purpose: Help clients assess whether their website, content, data, brand and governance foundations are ready for responsible AI use.  
Recommended format: Downloadable lead magnet, worksheet, web form or guided assessment tool.  
Suggested CTA: Book an AI Website Readiness Assessment.

> This checklist is a practical starting point, not legal advice. Where privacy, regulatory or compliance obligations apply, confirm requirements with a qualified legal or privacy adviser.

## How to use this checklist

1. Score each item from 0 to 3.
2. Add notes or evidence for low-scoring items.
3. Highlight anything that blocks safe AI-assisted content, search visibility or chatbot implementation.
4. Use the final score to decide whether you need foundation work, guided AI adoption or a full AI readiness assessment.

## Scoring system

| Score | Meaning | Use this score when... |
|---|---|---|
| 0 | Not in place | There is no clear evidence, process, owner or working implementation. |
| 1 | Partially in place | Something exists, but it is incomplete, inconsistent, undocumented or not trusted. |
| 2 | In place but needs improvement | The foundation exists but needs updates, evidence, governance, testing or better ownership. |
| 3 | Strong foundation | The item is documented, maintained, owned, tested and suitable for responsible AI use. |

## Readiness levels

| Result | Readiness level | What it means |
|---|---|---|
| 0-30% | Not ready - foundation work required | AI should not be added yet without fixing core website, content, data or governance gaps. |
| 31-60% | Partially ready - priority gaps to fix | Some AI use may be possible, but high-risk gaps should be addressed first. |
| 61-80% | Mostly ready - suitable for guided AI adoption | The business has enough foundation for scoped AI adoption with governance controls. |
| 81-100% | AI-ready foundation - ready for governance and implementation planning | The website and organisation are in a strong position to plan AI-assisted content or chatbot use. |

## Score summary

| Section | Maximum score | Your score | Percentage | Priority |
|---|---:|---:|---:|---|
| A. Website foundations | 30 |  |  |  |
| B. Content readiness | 30 |  |  |  |
| C. Search, structured data and AI discoverability | 24 |  |  |  |
| D. Brand, UX and design system readiness | 24 |  |  |  |
| E. Data, privacy and governance | 30 |  |  |  |
| F. Chatbot readiness | 24 |  |  |  |
| Total | 162 |  |  |  |

Formula: `Total score / 162 x 100 = readiness percentage`

---

## A. Website foundations

Purpose: AI tools work best when your website is fast, secure, accessible, maintainable and easy to understand. Weak foundations create poor user experience and unreliable AI inputs.

| Check | Question | Evidence to look for | Score | Notes |
|---|---|---|---:|---|
| Technical health | Is the website free from obvious errors, broken layouts, server issues and failed updates? | WordPress Site Health, uptime logs, error logs, support tickets. |  |  |
| Performance | Do key pages load quickly on mobile and desktop? | PageSpeed Insights, Lighthouse, Core Web Vitals, hosting metrics. |  |  |
| Mobile experience | Is the site easy to use on smaller screens? | Manual mobile review, responsive layouts, tap targets, forms. |  |  |
| Accessibility | Can people use the site with keyboard, screen readers and different accessibility needs? | Manual testing, WAVE, axe, WCAG 2.2 review. |  |  |
| Security | Is the site maintained, backed up and protected from common WordPress risks? | Update logs, backup logs, security scans, SSL, security headers. |  |  |
| Navigation | Can users and search engines understand the main structure? | Menus, breadcrumbs, internal links, XML sitemap, crawl report. |  |  |
| CMS maintainability | Can non-technical users safely edit content without breaking layouts? | WordPress roles, reusable blocks, templates, editor experience. |  |  |
| Reusable templates | Are pages built from consistent templates, blocks or components? | Block theme templates, patterns, Figma components, theme settings. |  |  |
| Regular maintenance | Is there a documented maintenance process? | Update schedule, backup checks, QA process, owner. |  |  |
| Recovery | Can the site be restored quickly if something breaks? | Tested backups, staging site, deployment process, rollback plan. |  |  |

### Recommended self-assessment tools

| Tool | What it checks | Why it matters | Problem signal |
|---|---|---|---|
| Google PageSpeed Insights | Core Web Vitals, loading, interactivity and layout stability. | AI adoption should not distract from poor UX or slow pages. | Poor LCP, INP or CLS, especially on key landing pages. |
| Lighthouse | Performance, accessibility, best practices and SEO basics. | Useful first-pass audit, especially before deeper manual review. | Low scores or repeated warnings across page types. |
| Google Search Console | Indexing, search queries, page experience, structured data and errors. | Shows whether Google can find, understand and index important content. | Important pages not indexed, crawl errors, schema errors or poor visibility. |
| W3C WAI guidance | Accessibility evaluation approach and manual testing guidance. | Accessibility cannot be solved by automated tools alone. | No manual keyboard, screen reader or content readability review. |
| WAVE / axe DevTools | Automated accessibility issues. | Helps identify common content and interface failures. | Missing labels, contrast failures, heading problems or ARIA issues. |
| Google Rich Results Test | Eligibility for supported rich results. | Helps confirm whether structured data is valid for search features. | Schema errors, missing required properties or invisible structured content. |
| Schema Markup Validator | General structured data validation. | Useful beyond Google's rich result eligibility. | Invalid JSON-LD, duplicate entities or incomplete schema. |
| Security Headers | HTTP security headers. | Helps assess browser-level protections. | Missing HSTS, CSP, X-Frame-Options or weak configuration. |
| WordPress Site Health | WordPress configuration, PHP, HTTPS and background tasks. | Provides a baseline for WordPress maintainability. | Critical issues or repeated recommendations ignored. |
| Analytics / heatmap tools | User behaviour, conversion paths and friction. | AI decisions should be based on real user behaviour, not assumptions. | No conversion tracking, unclear events or unreviewed user friction. |

---

## B. Content readiness

Purpose: AI systems and AI-assisted workflows need accurate, current and structured content. If the website content is vague, outdated or inconsistent, AI outputs will inherit those problems.

| Check | Question | Evidence to look for | Score | Notes |
|---|---|---|---:|---|
| Accuracy | Is the content factually correct and up to date? | Recent review dates, subject matter owner sign-off. |  |  |
| Completeness | Are core products, services, people, locations, case studies, FAQs and policies covered? | Content inventory, sitemap, missing page list. |  |  |
| Page purpose | Does each page have a clear purpose and primary action? | Page briefs, CTA map, analytics goals. |  |  |
| Duplication | Is duplicate, thin or outdated content controlled? | Crawl report, content audit, redirect map. |  |  |
| Voice and tone | Is the writing consistent across the site? | Voice guide, example copy, editor guidance. |  |  |
| Source of truth | Are there trusted documents AI can use for drafting and answers? | Knowledge base, policies, product data, service docs. |  |  |
| Content ownership | Does each content area have a named owner? | Ownership matrix, review workflow. |  |  |
| Review cycle | Are pages reviewed regularly? | Review dates, content calendar, governance process. |  |  |
| Claims and proof | Are claims backed by evidence? | Case studies, testimonials, certifications, policies. |  |  |
| AI boundaries | Are there rules for what AI can and cannot say? | Governance guide, prohibited topics, approval rules. |  |  |

### Content gap notes

| Gap | Impact | Priority | Owner | Next action |
|---|---|---|---|---|
|  |  | High / Medium / Low |  |  |
|  |  | High / Medium / Low |  |  |
|  |  | High / Medium / Low |  |  |

---

## C. Search, structured data and AI discoverability

Purpose: Search engines and AI assistants need clear structure, entities, evidence and internal links to interpret content accurately.

| Check | Question | Evidence to look for | Score | Notes |
|---|---|---|---:|---|
| Heading structure | Do pages use clear headings in a logical order? | H1-H6 review, templates, content audit. |  |  |
| Semantic page structure | Are page sections meaningful and consistent? | Block patterns, landmarks, content models. |  |  |
| Structured data | Is schema used where appropriate? | JSON-LD, schema validation, plugin settings. |  |  |
| Entity clarity | Are organisation, service, product, author, location and FAQ entities clear? | About page, author bios, product data, local profiles. |  |  |
| FAQ structure | Are FAQs specific, accurate and maintained? | FAQ inventory, support queries, review dates. |  |  |
| Evidence and trust | Is expertise, experience, authority and trust visible? | Case studies, author bios, credentials, reviews. |  |  |
| Internal linking | Are important pages linked from relevant related pages? | Crawl report, content hub map, manual checks. |  |  |
| Search intent | Does each page match a real user question or decision stage? | Keyword research, sales questions, analytics. |  |  |

---

## D. Brand, UX and design system readiness

Purpose: AI-assisted content and interface work needs clear brand, UX and design system rules so future outputs remain consistent and accessible.

| Check | Question | Evidence to look for | Score | Notes |
|---|---|---|---:|---|
| Brand guidelines | Are logo, colour, typography and usage rules documented? | Brand guide, Figma file, style guide. |  |  |
| Voice and tone | Is the brand voice clear enough for humans and AI tools to follow? | Tone matrix, examples, do/don't list. |  |  |
| Design consistency | Are buttons, forms, cards, spacing and imagery consistent? | Component audit, template review. |  |  |
| Design tokens | Are colours, typography, spacing and radius rules reusable? | Figma variables, theme.json, design tokens. |  |  |
| Accessibility constraints | Are contrast, type size and interaction rules built into the design system? | Token rules, WCAG checks, QA checklist. |  |  |
| Template scalability | Can new pages be created without custom rebuilding each time? | Patterns, blocks, page templates, reusable sections. |  |  |
| Editorial usability | Can content editors create pages safely and consistently? | Editor roles, locked patterns, instructions. |  |  |
| AI interface readiness | Are rules defined for AI-generated blocks, summaries, FAQs or recommendations? | Governance notes, UX patterns, approval flow. |  |  |

---

## E. Data, privacy and governance

Purpose: Responsible AI use depends on knowing what data is collected, where it goes, who can access it and which information must not be entered into AI tools.

| Check | Question | Evidence to look for | Score | Notes |
|---|---|---|---:|---|
| Data map | Is website data collection documented? | Forms, cookies, analytics, CRM, ecommerce, email tools. |  |  |
| Privacy notices | Are privacy and cookie notices current and accurate? | Privacy policy, cookie banner, consent records. |  |  |
| Consent | Are consent mechanisms appropriate for forms, analytics and marketing? | Consent tool, form wording, CRM permissions. |  |  |
| AI data rules | Are staff clear on what must not be entered into AI tools? | AI use policy, training notes, prohibited data list. |  |  |
| Human review | Is AI-generated content reviewed before publication? | Approval workflow, publishing checklist. |  |  |
| Error correction | Is there a process for correcting AI errors? | Reporting route, owner, revision log. |  |  |
| Sensitive data | Are special categories, minors, financial, health or vulnerable-user risks identified? | DPIA, legal review, risk register. |  |  |
| Data retention | Are website and chatbot logs retained only as needed? | Retention policy, tool settings, data processor terms. |  |  |
| Tool governance | Are approved and prohibited AI tools documented? | Vendor list, risk review, procurement notes. |  |  |
| Accountability | Is there a named owner for AI governance? | Governance owner, review cadence, escalation route. |  |  |

---

## F. Chatbot readiness

Purpose: A chatbot should only be implemented when it has reliable knowledge sources, clear boundaries, privacy controls and a human escalation path.

| Check | Question | Evidence to look for | Score | Notes |
|---|---|---|---:|---|
| Reliable content | Is there enough trusted content for the chatbot to answer from? | FAQs, service pages, policies, product data, support docs. |  |  |
| Approved sources | Are source documents approved and kept current? | Knowledge base owner, review dates. |  |  |
| Scope | Is the chatbot's role clearly defined? | Use cases, excluded topics, bot purpose. |  |  |
| Fallback | Does the bot know when to say it does not know? | Fallback response, confidence rules. |  |  |
| Escalation | Is there a clear handoff to a human? | Contact route, support owner, SLA wording. |  |  |
| Disclosure | Are users told they are interacting with AI? | Chat intro, privacy notice, UI copy. |  |  |
| Personal data | Are collection rules and consent requirements clear? | Lead capture rules, privacy wording, retention policy. |  |  |
| Log review | Are conversations reviewed and used to improve content? | Review schedule, log access rules, improvement backlog. |  |  |

---

## Priority action plan

| Priority | Issue | Why it matters | Recommended action | Owner | Timing |
|---|---|---|---|---|---|
| 1 |  |  |  |  |  |
| 2 |  |  |  |  |  |
| 3 |  |  |  |  |  |
| 4 |  |  |  |  |  |
| 5 |  |  |  |  |  |

## CTA: Book an AI Website Readiness Assessment

This checklist gives you a starting point. An AI Website Readiness Assessment turns your score into a practical action plan covering website foundations, content structure, governance, accessibility, technical SEO, performance, analytics and chatbot feasibility.

Suggested next step: Share your completed checklist before the assessment meeting so the session can focus on priorities rather than basic information gathering.

## Agency-facing notes

- Use low scores to qualify discovery and scope.  
- Watch for hidden project needs: content audit, redesign, accessibility remediation, analytics setup, content model restructuring, brand system work or chatbot knowledge base creation.  
- Do not recommend chatbot implementation where content ownership, privacy rules and escalation are unclear.  
- Use this checklist as a lead magnet, then move qualified clients into the governance questionnaire.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
