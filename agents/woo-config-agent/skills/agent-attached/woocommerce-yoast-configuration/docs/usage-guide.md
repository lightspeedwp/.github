# Usage guide

Use this guide when a team member needs to understand how to operate the Yoast configuration skill.

## Fast routes

| User request | Load first | Then load if needed | Output |
|---|---|---|---|
| Configure Yoast for a WooCommerce store | `intake/client-site-intake.md`, matching `profiles/` file | `references/configuration-reference.md`, `templates/yoast-configuration-report.md` | Configuration plan |
| Audit an existing WooCommerce Yoast setup | `intake/wordpress-site-intake.md` | `references/configuration-reference.md`, `references/qa-checklists.md`, `templates/yoast-audit-report.md` | Audit report |
| Review Yoast settings export | `references/settings-export-review-playbook.md` | `references/configuration-reference.md`, matching `profiles/` file, `templates/settings-export-review.md` | Settings export review |
| QA rendered page output | `references/rendered-output-qa-playbook.md` | `references/feature-behaviour-reference.md`, `references/qa-checklists.md`, `templates/rendered-output-qa-report.md` | Rendered output QA report |
| Compare Free/Premium/WooCommerce SEO/AI Plus | `references/product-capability-matrix.md` | `references/source-register.md` | Product recommendation |
| Configure WooCommerce SEO | `intake/woocommerce-intake.md` | `profiles/ecommerce-*.md`, `references/woocommerce-seo-reference.md`, `templates/yoast-woocommerce-report.md` | WooCommerce SEO plan |
| Review schema output | `references/schema-reference.md` | `references/developer-api-reference.md`, `templates/developer-handoff.md` | Schema review or handoff |
| Prepare migration SEO QA | `intake/migration-intake.md` | `profiles/migration-rebuild.md`, `references/qa-checklists.md`, `templates/launch-qa-checklist.md` | Migration QA plan |
| Refresh reference data | `docs/research-workflow.md` | `references/research-pack-output-spec.md`, `references/source-register.md` | Research pack/update notes |
| Refine this skill package | `references/future-skill-architecture.md` | `docs/maintenance-guide.md`, `tests/` | Updated package plan |

## Default response pattern

1. Start with confirmed evidence and confidence.
2. State assumptions and missing evidence.
3. Recommend the configuration or next action.
4. Add QA checks and risk notes.
5. End with the smallest practical next step.

## Evidence posture

- Use scanned source-register rows only when they have an accessed date and confidence.
- Treat `research target` rows as queued evidence, not proof.
- Verify current Yoast packaging, UI paths, changelog-sensitive features, Google Search interpretation, and developer APIs before making high-confidence claims.

## Deliverable selection

- Use configuration reports for planned setups.
- Use audit reports for existing settings or rendered output reviews.
- Use WooCommerce reports for product/archive/schema work.
- Use developer handoffs for code, filters, APIs, schema customisation, and integration risks.
- Use launch QA checklists for migration, release, or retest work.
- Use research packs when building or refreshing reference data.

## Choosing the right file quickly

For ambiguous requests, start with `references/file-routing-index.md`. It maps common user request patterns to primary files, supporting files, templates, and validation checks.

Use `references/evidence-state-model.md` whenever the answer depends on whether a source is current, scanned, stale, contradicted, or only queued as a research target.

Use `docs/reference-refresh-protocol.md` when the user asks to update reference data, refresh a product claim, verify a developer API, or prepare a package release.

## Common fast routes

- Product comparison: product capability matrix plus source register.
- WooCommerce setup: client intake, WooCommerce intake, matching WooCommerce profile, configuration reference, WooCommerce report template.
- WooCommerce setup: WooCommerce intake, ecommerce profile, WooCommerce reference, schema reference, WooCommerce report template.
- Developer handoff: developer API reference, feature reference, source register, developer handoff template.
- Research pack: research workflow, research pack output spec, source register, evidence state model, research pack template.
- Package refinement: maintenance guide, future architecture, file routing index, validators, changelog.

## Audit triage and troubleshooting

Use `references/audit-triage-model.md` when a finding needs severity, priority, confidence, owner direction, or the smallest safe next action. Use `templates/yoast-troubleshooting-note.md` for concise internal issue notes when a full audit report would be too heavy. Use `docs/current-verification-playbook.md` before making firm claims about current Yoast packaging, UI paths, developer APIs, Google rich-result eligibility, WooCommerce behaviour, or rendered live-site output.

## Client-safe summaries and decision logs

Use `templates/client-safe-summary.md` when turning internal Yoast findings into client-facing language. Use `templates/yoast-decision-log.md` when a recommendation changes indexation, canonicals, schema, WooCommerce archive strategy, redirects, product mix, AI-assisted metadata approval, or developer customisation. Use `references/conflict-resolution-playbook.md` when sources, settings, rendered output, Google guidance, client preference, or developer behaviour disagree.

## Artefact review routes

Use `references/settings-export-review-playbook.md` when the input is a Yoast settings export, copied admin setting, option snippet, screenshot or partial configuration dump. Use `references/rendered-output-qa-playbook.md` when the input is rendered HTML, page source, HTTP headers, robots.txt, llms.txt, XML sitemap output, schema JSON-LD or crawl output. Settings artefacts show intended configuration; rendered output shows what crawlers can observe. Do not collapse those evidence types into one conclusion.

## Comparison, regression and acceptance workflows

Use the comparison/regression layer when the user provides a baseline and current state, asks whether an update changed Yoast output, or needs a release gate.

- Settings-only evidence: use `references/settings-export-review-playbook.md` plus `references/state-comparison-playbook.md`; require rendered-output QA before firm conclusions.
- Rendered-output evidence: use `references/rendered-output-qa-playbook.md` plus `references/state-comparison-playbook.md`.
- Plugin updates: use `references/plugin-update-regression-playbook.md` and produce `templates/yoast-regression-test-report.md`.
- Sign-off gates: use `templates/yoast-acceptance-criteria.md` and keep criteria evidence-led, pass/fail and owner-aware.

## Access-aware remediation

When the user asks for action items, implementation plans, backlog entries, or owner routing, load `references/access-level-workflow.md` and `references/remediation-backlog-model.md`. Use `templates/yoast-remediation-backlog.md` for multi-item action lists and `templates/wordpress-admin-change-plan.md` when the work must be limited to WordPress or Yoast admin.

Do not turn an unverified suspicion into an implementation task. If the current evidence is incomplete, create a `verify_first` item with the smallest evidence request and a clear QA path.

## Portfolio and defaults-drift reviews

Use the portfolio workflow when reviewing multiple client sites, retainer sites, or agency-wide Yoast consistency. Load `references/portfolio-audit-playbook.md` first, then group sites by site type before comparing settings or output. Use `templates/yoast-portfolio-audit-summary.md` for the deliverable.

Use the defaults-drift workflow when comparing a site or site group against agency defaults, standard Yoast defaults, WooCommerce defaults, schema defaults, or a previous approved baseline. Load `references/agency-defaults-drift-model.md` and use `templates/yoast-defaults-drift-report.md`. Treat drift as a difference first, not automatically a defect.

Do not compare business sites, publishers, ecommerce stores and multilingual sites as if they should share identical indexation, archive and schema decisions. Approved exceptions should be logged, not repeatedly re-raised as defects.

## Periodic health reviews

Use periodic health reviews for retainers and maintenance check-ins where the user wants a light status update rather than a full Yoast audit.

Good prompts:

- `Create a quarterly Yoast health summary from this settings export and rendered homepage source.`
- `What changed since the last Yoast review?`
- `Give this site a Yoast configuration health status, but only score what the evidence supports.`
- `Write a short retainer note for this month's Yoast checks.`

Load `references/periodic-health-review-playbook.md`, `references/yoast-health-score-model.md`, and the relevant template. Do not present the score as a Google ranking, traffic, or AI visibility score.

## AI-assisted metadata workflow

Use `references/ai-assisted-seo-workflow.md` when a user provides AI-generated titles, descriptions, social metadata, product metadata or Yoast SEO AI Plus notes. Classify each item with `references/ai-metadata-review-model.md` before approval. Use `templates/ai-metadata-approval-pack.md` for reviewer/client approval and `templates/yoast-ai-plus-positioning-note.md` only after current product packaging has been verified.

Do not treat AI-generated copy as approved source evidence. Do not claim rankings, rich results, indexing or AI visibility improvements from AI-generated metadata.

## Bulk metadata and approval queue usage

Use the bulk metadata workflow when the input is a spreadsheet, CSV excerpt, pasted table, migration mapping, large AI-generated metadata set, or a request to update many Yoast fields.

Recommended prompt starters:

- `Review this Yoast metadata spreadsheet and create an approval queue.`
- `Turn these proposed titles and descriptions into a safe bulk edit plan.`
- `Identify which rows need source evidence before we update Yoast.`
- `Create a client-safe approval queue for these AI-generated meta descriptions.`

Expected output:

- A clear distinction between candidate, approved, implemented and verified rows.
- Risk flags for unsupported claims, product promises, stale wording, AI drafts and template-level changes.
- An approval owner and QA requirement for each risky row or batch.
- A rendered-output QA requirement before marking changes complete.

Do not use this workflow to bypass client approval or to recommend direct production changes from unverified spreadsheet data.

## Content structure and taxonomy decisions

Use the content-structure route when a user asks whether categories, tags, author archives, date archives, media archives, product tags, product categories, attributes or filtered URL groups should be indexed, noindexed, consolidated or improved.

Load `references/content-structure-taxonomy-playbook.md` first, then `references/taxonomy-indexation-decision-model.md` when a clear decision is needed. Use `templates/taxonomy-indexation-decision-pack.md` for approval-ready outputs and `templates/content-structure-remediation-plan.md` when the right next step is cleanup rather than a Yoast setting change.

Do not treat screenshots, settings exports or taxonomy inventories as proof of live output. Rendered archive output, sitemap state and canonical state must be verified before implementation.

## Multilingual and translated metadata requests

For multilingual Yoast requests, first identify the language architecture and translation layer. Use `references/multilingual-hreflang-playbook.md` before assigning responsibility to Yoast, a translation plugin, custom code, or editorial workflow. Use `references/locale-metadata-governance.md` when translated metadata, AI translated copy, machine translation, or market-specific wording needs approval.

Safe default: a settings export does not prove hreflang or translated metadata output. Prefer rendered source, crawl evidence, sitemap samples, and translation-plugin context.

## Redirect maps and migration launch controls

When the user provides a redirect map, migration spreadsheet, Yoast Premium redirect export, server/CDN rule summary, or launch checklist, route to `references/redirect-migration-governance.md` before producing a recommendation. Keep proposed mapping, approval state, implementation route, live status-code evidence, canonical/sitemap state, rollback plan and post-launch monitoring separate.

Use `templates/redirect-map-review.md` for old-to-new URL decisions and `templates/migration-launch-seo-control-plan.md` when the user needs launch readiness or a migration control plan. If Yoast Premium redirect manager is the proposed route, verify product entitlement or mark it as an explicit verification task before recommending import.

## Related skill routing

Use `woocommerce-yoast-configuration` for planning, evidence interpretation, reports, decision packs and handoffs. Route live WordPress admin inspection or approved Yoast edits to `woocommerce-yoast-auditor` using `references/related-skills-routing.md`.

---

*🧭 Your compass through the documentation landscape*
