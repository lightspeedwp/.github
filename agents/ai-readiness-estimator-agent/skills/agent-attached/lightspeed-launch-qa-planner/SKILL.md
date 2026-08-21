---
name: lightspeed-launch-qa-planner
description: plan final launch qa for lightspeed wordpress projects where a figma design system is implemented as a wordpress block theme, block plugin or pattern library. use when the user needs a launch qa plan, figma-to-wordpress qa scope, block theme checklist, block plugin checklist, page/template qa matrix, accessibility and responsive qa plan, conversion tracking qa, launch gates, specialist skill routing or a go/no-go planning framework before running final audits.
---

# LightSpeed Launch QA Planner

## Purpose

Plan final launch QA for LightSpeed WordPress projects that translate Figma design-system intent into a WordPress block theme, block plugin, pattern library or hybrid implementation.

This skill is the planning and coordination layer. It does not replace specialist audit skills; it scopes the work, creates QA matrices, defines launch gates and routes each workstream to the right specialist workflow.

## Core rule

Do not mark a site ready for launch without evidence. If implementation, analytics, redirects, accessibility, policies, claims, schema or Figma parity have not been reviewed, mark them as `Pending` and add them to the launch gate checklist.

## Inputs to accept

Accept any combination of:

- current live URL
- staging/dev URL
- Figma design system URL
- Figma prototype or Make URL
- WordPress theme or plugin repo notes
- page inventory
- template list
- block and pattern list
- theme.json or token export
- content collection outputs
- claim register
- redirect map
- schema plan
- GA4/GTM plan
- policy page drafts
- accessibility or Lighthouse notes
- launch date or phase

If evidence is missing, generate a QA plan and list missing evidence instead of assuming readiness.

## Build types

Classify the launch as one or more of:

- block theme only
- block theme plus custom block plugin
- block plugin only
- hybrid theme
- WooCommerce/block theme
- publishing/content-heavy site
- lead-generation site
- AI-readiness or chatbot-enabled site

## Workflow

1. Confirm launch context: live URL, dev URL, Figma links, build type, launch stage and available evidence.
2. Define QA workstreams: Figma parity, templates, block theme, block plugin, patterns, content, accessibility, responsive, forms, analytics, redirects, schema, policies, performance and launch operations.
3. Create QA matrices: page/template QA, pattern QA, block/plugin QA, responsive QA, accessibility QA and conversion QA.
4. Define launch gates using: Launch Blocker, Must Fix, Can Launch With Follow-up, Post-launch Improvement and Not Applicable.
5. Route specialist tasks to other LightSpeed skills where relevant.
6. Produce a practical launch QA plan with owners, evidence needed and next actions.
7. Summarise go/no-go readiness as a planning recommendation, not a final audit result unless enough evidence exists.

## Required outputs

When planning a full launch QA pack, include:

- launch QA plan
- QA workstream checklist
- page/template QA matrix
- Figma-to-WordPress parity QA plan
- block theme QA checklist
- block plugin QA checklist
- pattern library QA matrix
- accessibility and responsive QA plan
- forms and tracking QA plan
- launch gate checklist
- specialist skill routing notes
- go/no-go planning summary

## Specialist routing

Route specialist tasks as follows:

- Figma variables, theme.json, blocks, patterns, light/dark mode and states: use `lightspeed-figma-wordpress-parity-auditor`.
- Final page QA, forms, broken links, accessibility, Lighthouse and go/no-go: use `lightspeed-launch-readiness-auditor`.
- URL inventory, redirects, 404 risk and SEO migration: use `lightspeed-redirect-map-planner`.
- Schema, FAQ schema, AI visibility, internal linking and claim-safe AI/search wording: use `lightspeed-schema-and-ai-discoverability-planner`.
- GA4 events, GTM triggers, forms, lead magnets, consultation clicks and chatbot handoffs: use `lightspeed-ga4-conversion-tracking-planner`.
- Privacy, cookies, accessibility statement, AI governance and chatbot disclosure: use `lightspeed-policy-page-generator`.
- Stats, proof points, AI/ROI claims and approved wording: use `lightspeed-claim-register-auditor`.
- FAQs and chatbot-safe sources: use `lightspeed-faq-and-chatbot-source-curator`.

## Reference loading

Use these references as needed:

- `references/launch-qa-planning-workflow.md` for the full process.
- `references/figma-to-wordpress-qa.md` for design-system parity scope.
- `references/block-theme-qa.md` for block theme checks.
- `references/block-plugin-qa.md` for custom block/plugin checks.
- `references/pattern-and-template-qa.md` for template, pattern and section QA.
- `references/accessibility-responsive-qa.md` for accessibility, mobile and responsive checks.
- `references/conversion-and-tracking-qa.md` for forms, CTAs and tracking.
- `references/launch-gate-model.md` for readiness categories.
- `references/specialist-skill-routing.md` for workflow routing.

## Output standard

Use UK English. Keep outputs practical, structured and suitable for Google Docs, GitHub issues or Asana tasks. Separate launch blockers from follow-up improvements. Include owners when known; otherwise add `Owner: TBD`.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
