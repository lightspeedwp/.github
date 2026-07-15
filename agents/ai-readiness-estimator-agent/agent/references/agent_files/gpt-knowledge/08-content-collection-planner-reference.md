# Skill Reference: content-collection-planner

## Purpose
Use `content-collection-planner` to create tailored content collection checklists, content gap reports, source-of-truth registers, sector add-ons and client request emails for website, AI governance and chatbot projects.

## Required output types
Depending on the request, produce:

- Markdown checklist
- spreadsheet-style tracking table
- client-facing content request email
- content gap report
- folder structure
- source-of-truth register
- chatbot-safe content classification

## Generic website checklist sections
Include:

1. Core business content
2. Brand assets and style inputs
3. Page and content inventory
4. AI and chatbot source material
5. Governance and approvals
6. Page-level content briefs
7. Sector-specific add-ons
8. Approval and sign-off checklist

## Content classification labels
Classify content as:

- Website
- Governance
- Chatbot
- Compliance
- Optional

## Status labels
Use these status labels:

- Missing
- Received
- Approved
- Needs Rewrite
- Not for Chatbot
- Legal Review

## Chatbot source suitability
Every relevant source should be classified as:

- Approved for chatbot
- Not for chatbot
- Needs review before chatbot use
- Internal context only
- Outdated / excluded

## Sector add-ons
Support these sectors and project types:

### Tour Operator
Add:
- destinations
- itineraries
- accommodations
- departures
- pricing rules
- seasonal information
- booking terms
- cancellation rules
- traveller FAQs
- Wetu or tour data sources where relevant

### WooCommerce / Ecommerce
Add:
- product data
- categories
- variations
- stock/availability rules
- shipping zones
- returns/refunds
- payment methods
- product recommendations
- transactional email content
- reviews policy

### Publisher
Add:
- publication structure
- sections/categories
- authors
- editorial workflows
- advertising inventory
- sponsored content rules
- taxonomy rules
- archive/migration notes
- SEO and structured data rules

### Education / LMS
Add:
- courses
- lessons
- learner groups
- enrolment rules
- access rules
- certification rules
- support paths
- policies
- multilingual/localisation needs

### Professional services
Add:
- methodology
- credentials
- case studies
- proof of outcomes
- consultation flow
- compliance claims

### Memberships / Subscriptions
Add:
- plans
- billing rules
- renewals
- cancellation rules
- member onboarding
- gated content
- support routes

## Folder structure recommendation
Use:

```text
/01 Brand and company information
/02 Website content drafts
/03 Product, service or offer data
/04 Policies and compliance
/05 Images, video and media
/06 AI and chatbot source content
/07 Approved final versions
```

## Client email output
When asked, create a friendly client-facing email explaining:

- what is needed
- why it is needed
- how to organise it
- what can be linked instead of rewritten
- deadline or next step
- contact route for questions
