---
name: woocommerce-yoast-configuration
description: configure, audit, validate, troubleshoot and document yoast seo setups only for wordpress websites running woocommerce core and relevant woocommerce extension plugins, including product schema, product archives, variations, offers, reviews, stock, shipping, returns, categories, tags, attributes, facets, filtered urls, metadata, sitemaps, canonicals, redirects, breadcrumbs, ai metadata, multilingual ecommerce, migration and research-pack workflows. use for woocommerce seo planning, reports, evidence interpretation, decision packs, remediation plans and handoffs; route live wordpress admin audits or approved yoast edits to woocommerce-yoast-auditor.
---

# WooCommerce Yoast Configuration

Use this skill to produce agency-ready Yoast SEO configuration plans, audits, QA checklists, troubleshooting notes, research packs, source registers, and developer handoffs only for WordPress websites running WooCommerce core and relevant WooCommerce extension plugins.

## Operating posture

- Keep the answer practical, evidence-led, UK English, and suitable for a WordPress agency workflow.
- Treat this skill as a WooCommerce-only configuration and validation workflow, not a generic Yoast, generic WordPress, or general SEO workflow.
- Do not use this skill for non-WooCommerce WordPress sites unless the task is explicitly about preparing a WooCommerce migration or WooCommerce extension SEO decision.
- Prefer the smallest reliable output for the user's task: setup plan, audit notes, QA checklist, settings export review, rendered-output QA report, remediation backlog, WordPress admin change plan, portfolio audit summary, defaults drift report, periodic health summary, retainer review note, AI metadata approval pack, metadata bulk edit plan, Yoast approval queue, taxonomy indexation decision pack, content-structure remediation plan, multilingual SEO QA report, translated metadata approval pack, redirect-map review, migration launch SEO control plan, AI Plus positioning note, state comparison, regression test report, acceptance criteria, WooCommerce reference, schema review, developer handoff, client-safe summary, decision log, or research pack.
- Separate confirmed facts, assumptions, recommendations, risks, and open questions.
- State the access level used: no access, screenshots, exported settings, WordPress admin, staging, codebase, Search Console, live crawl evidence, rendered source, or scanned documentation.


## Mandatory output structure

Use this response structure for all normal outputs unless the user explicitly asks for a different template or a specialist template in `templates/` is clearly more appropriate:

1. **3-bullet summary**: value, main risk, and next step.
2. **Access and evidence**: access level used, source status, confidence, and key limitations.
3. **Findings or decisions**: prioritised table or grouped bullets with severity, risk, confidence, owner direction, and smallest next action where useful.
4. **Recommended configuration or remediation**: separate confirmed facts, assumptions, recommendation, rationale, risk, approval state, and implementation route.
5. **QA and validation**: state the exact rendered-output, sitemap, robots, schema, canonical, redirect, metadata, WooCommerce, multilingual, approval, or post-change checks required.
6. **Open questions and next actions**: include only questions that block approval, implementation, or QA.

For very small answers, keep the same order but compress sections rather than dropping evidence, risk, or QA. Do not hide uncertainty in prose; label it directly.

## Fast audit mode

Use fast audit mode when the user asks for a quick audit, skim, triage, sanity check, first pass, rough review, or fast opinion, or when the available input is small and the user has not asked for a full report.

Fast audit mode must:

- Use only the provided evidence, already-loaded skill instructions, and the embedded core models below unless a version-sensitive claim must be checked.
- Avoid loading long reference files unless the request is WooCommerce-specific, migration-specific, multilingual, developer/API-specific, or the evidence is contradictory.
- Return at most 7 findings and at most 3 open questions.
- Prefer a compact table with `finding`, `severity`, `confidence`, `risk`, and `next action`.
- Label the result as a fast audit and state what it does not prove, especially live rendered output, current Yoast UI paths, Google interpretation, redirects, sitemap state, or rich-result eligibility.
- Route to full audit, rendered-output QA, research refresh, or `woocommerce-yoast-auditor` only when the fast pass exposes a material blocker or live admin inspection/editing is needed.

## Embedded core models

Use these models immediately without loading reference files. Load the detailed reference only when the case is high-risk, ambiguous, client-facing, implementation-ready, or needs structured artefacts.

### Evidence confidence model

- **High confidence**: current live rendered output, crawl evidence, Search Console evidence, current official documentation, verified WordPress admin state, or validated structured export that directly proves the claim.
- **Medium confidence**: screenshots, settings exports, user-provided admin notes, staging evidence, recent but not current documentation, or partial crawls that support the claim but do not prove live output.
- **Low confidence**: memory, assumptions, AI-generated drafts, uncited notes, old exports, source-register rows still marked research target, or evidence that implies but does not show the behaviour.

Evidence boundaries:

- Settings exports do not prove rendered metadata, schema, canonicals, sitemap state, or robots output.
- Redirect maps do not prove live status codes, chains, canonical targets, or sitemap cleanup.
- Schema validity does not prove Google rich-result eligibility or display.
- AI-generated metadata is candidate copy until approved against source evidence and QAed in rendered output.

### Severity and priority model

Use severity for impact and priority for action order.

- **Critical / P0**: likely indexation outage, widespread noindex/canonical/robots/sitemap failure, broken migration redirect path for high-value URLs, severe product schema corruption on transactional pages, or client/legal/compliance exposure. Act immediately.
- **High / P1**: material SEO, migration, ecommerce, schema, metadata, multilingual, or discoverability risk affecting important templates, page groups, revenue pages, or launch readiness. Schedule before launch or next release.
- **Medium / P2**: localised issue, weak metadata, taxonomy bloat, partial schema gap, QA gap, or configuration drift with plausible but bounded impact. Add to planned remediation.
- **Low / P3**: documentation, naming, minor consistency, low-value archive, or monitoring improvement. Batch with housekeeping.

### Risk model

- **High risk**: changes to indexation, canonical targets, robots rules, XML sitemaps, redirects, schema graph, WooCommerce product data, multilingual alternates, bulk metadata, or production settings. Require approval and post-change QA.
- **Medium risk**: metadata templates, archive visibility, breadcrumbs, social metadata, AI-assisted copy, taxonomy cleanup, or staging changes that affect important page groups. Require evidence and sample QA.
- **Low risk**: documentation, checklists, non-production planning, source-register cleanup, or advisory notes with no direct site change.

### Owner and route model

- **Planning/configuration/reporting**: keep in `woocommerce-yoast-configuration`.
- **Live WordPress admin inspection or edits**: route to `woocommerce-yoast-auditor` with confirmed evidence, proposed change, approval state, fields affected, risk, QA, and rollback notes.
- **Developer implementation**: produce a developer handoff with target layer, documented API/filter status, pseudo-code label when needed, tests, and rollback.
- **Client-facing explanation**: use client-safe wording, remove unsupported ranking or rich-result claims, and state confidence plainly.

### Decision record model

Create or recommend a decision record when the recommendation changes indexation, canonicals, sitemaps, schema, redirects, WooCommerce archive strategy, multilingual alternates, bulk metadata approval, AI-assisted metadata approval, or developer customisation. Minimum fields:

- decision
- context and evidence
- options considered
- recommendation and rationale
- risk level
- approval owner and status
- implementation route
- QA checks
- rollback or monitoring notes

### Remediation item model

For actionable findings, include:

- issue
- affected URL/template/taxonomy/product group
- evidence and confidence
- severity and priority
- recommended change
- owner route
- approval needed
- QA required
- smallest next action

## Non-goals

- Do not give generic SEO tutorials unless the advice directly affects a Yoast configuration or audit decision.
- Do not promise rankings, rich results, AI visibility, indexing, crawl frequency, or commercial outcomes.
- Do not treat Yoast marketing/product pages as stronger evidence than Google Search Central for Google Search behaviour.
- Do not invent exact admin UI paths; verify current help-centre or live-product navigation when path accuracy matters.
- Do not recommend direct database edits to Yoast indexables or metadata unless an official Yoast source explicitly supports the approach.
- Do not claim a source has been scanned, accessed, or verified unless it has actually been opened in the current workflow or captured in the source register with an accessed date.
- Do not convert every task into a full research project; use existing references when enough evidence is already present and labelled.

## Source hierarchy

Use this evidence order:

1. Yoast developer documentation for behaviour, output, APIs, filters, indexables, schema, sitemaps, canonicals, metadata, robots, and technical specifications.
2. Yoast product pages for product positioning and packaging claims.
3. WordPress.org plugin listings for plugin availability, high-level capability, version context, and packaging cross-checks.
4. Google Search Central for canonical, robots, structured data, product, FAQ, HowTo, hreflang, sitemap, and Google Search interpretation.
5. Schema.org for schema vocabulary validation.
6. WordPress and WooCommerce official documentation where Yoast behaviour depends on platform behaviour.
7. Weak or unofficial sources only when clearly labelled as weak supporting evidence.

## Evidence handling rules

- Preserve uncertainty from the source register and references; do not smooth over gaps.
- Browse or otherwise verify current sources when the answer depends on product packaging, entitlement, UI navigation, Google Search rich-result eligibility, current plugin behaviour, changelog-sensitive functionality, or developer API status.
- Label unverified items as `needs verification`, `source not captured`, `research target`, `inference`, or `unclear from available sources`.
- Treat Yoast output validity and Google Search visibility as different checks.
- For research packs, capture page title, URL, accessed date, product/feature area, key facts, configuration relevance, developer relevance, limitations/version notes, source type, duplicate status, and confidence for every scanned source.
- Preserve duplicate URLs in `references/source-register.md`, but scan the canonical page once unless the duplicate reveals a redirect or changed content.
- When using a source-register row still marked `research target`, say that it is queued for verification and not scanned evidence.

## Required caveats

Always preserve these caveats when relevant:

- FAQ and HowTo blocks may still output schema, but they must not be oversold as reliable current Google rich-result wins.
- `llms.txt` may be useful for non-Google AI consumers, but it must not be presented as a Google Search ranking or visibility lever.
- Yoast SEO AI Plus is broader than AI writing and includes AI visibility / brand-insight positioning; verify current packaging and entitlements before making commercial claims.
- IndexNow is documented, but implementation details may require fresh Yoast documentation or live-product verification.
- Exact Yoast admin UI paths can change; verify them for client-facing instructions.
- Yoast, WordPress, WooCommerce, Google Search Central, Schema.org, and product packaging are version-sensitive.


## Related skill routing

Use this skill as the planning, configuration, evidence interpretation, reporting, research-pack, decision, and handoff workflow for Yoast SEO in WooCommerce and WordPress ecommerce contexts.

Route to `woocommerce-yoast-auditor` when the user needs live WordPress admin inspection, content-level Yoast review, direct Yoast field edits, batch metadata updates inside WordPress, taxonomy SEO edits, noindex changes, schema setting edits, breadcrumbs setting edits, redirect-manager edits, or any approved production/staging change through a WordPress connector.

Do not duplicate live audit or edit workflows from `woocommerce-yoast-auditor`. Instead, prepare the safest handoff:

- confirmed evidence
- access level
- proposed change
- approval state
- risk level
- exact fields/settings affected
- post-change QA
- rollback or monitoring notes where relevant

If the request mixes planning and live edits, complete the planning/decision output first, then route the implementation portion to `woocommerce-yoast-auditor`.

If the installed live-auditor skill uses a different slug, replace `woocommerce-yoast-auditor` with that exact installed slug throughout the routing layer.

## Progressive loading

If the task is ambiguous, consult `references/file-routing-index.md` first, then load only the files needed for the user's request. For fast audit mode, use the embedded core models first and load references only for blockers, contradictions, or specialist depth:

- Live WordPress Yoast audits, WordPress-admin SEO edits, content-level Yoast field updates, approved bulk metadata implementation, taxonomy SEO edits, redirect-manager edits, or production/staging changes -> prepare a handoff using `references/related-skills-routing.md`, `references/access-level-workflow.md`, `references/remediation-backlog-model.md`, `templates/wordpress-admin-change-plan.md`, `templates/yoast-remediation-backlog.md`, or `templates/metadata-bulk-edit-plan.md`, then route implementation to `woocommerce-yoast-auditor`.

- Product choice, feature boundary, packaging, or entitlement -> `references/product-capability-matrix.md` and `references/source-register.md`.
- Yoast SEO AI Plus positioning, AI-assisted SEO workflows, AI-generated title/meta drafts, metadata approval packs, or AI visibility claim review -> `references/ai-assisted-seo-workflow.md`, `references/ai-metadata-review-model.md`, `references/product-capability-matrix.md` when product scope matters, `references/source-register.md` for current packaging verification, `references/client-communication-guardrails.md` for client-facing claims, `templates/ai-metadata-approval-pack.md`, and `templates/yoast-ai-plus-positioning-note.md` as needed.
- Bulk metadata edits, metadata spreadsheets, title/description import plans, approval queues, or high-volume admin updates -> `references/bulk-metadata-governance.md`, `references/approval-queue-workflow.md`, `references/ai-metadata-review-model.md` when AI-generated copy is involved, `references/access-level-workflow.md`, `references/decision-register-model.md` when traceability is needed, `templates/metadata-bulk-edit-plan.md`, and `templates/yoast-approval-queue.md` as needed.
- Multilingual sites, translated metadata, hreflang, locale-specific canonicals, translated sitemaps, language archives, or multilingual WooCommerce output -> `references/multilingual-hreflang-playbook.md`, `references/locale-metadata-governance.md`, `profiles/multilingual-site.md`, `references/rendered-output-qa-playbook.md` when source/crawl evidence is provided, `references/woocommerce-seo-reference.md` when ecommerce is involved, `templates/multilingual-seo-qa-report.md`, and `templates/translated-metadata-approval-pack.md` as needed.
- Redirect maps, Yoast Premium redirect-manager planning, migration launch controls, domain or URL migrations, deleted URL decisions, 410/404 decisions, redirect chains, old URLs in sitemaps, or rollback-safe redirect QA -> `references/redirect-migration-governance.md`, `references/redirect-map-decision-model.md`, `intake/migration-intake.md`, `profiles/migration-rebuild.md`, `references/rendered-output-qa-playbook.md`, `references/conflict-resolution-playbook.md` when redirects/canonicals/sitemaps disagree, `templates/redirect-map-review.md`, and `templates/migration-launch-seo-control-plan.md` as needed.
- General settings, metadata, archives, canonical, robots, llms.txt, sitemaps, breadcrumbs -> `references/configuration-reference.md`.
- Content structure, taxonomy strategy, category/tag archive indexation, author/date/media archive decisions, thin archive cleanup, or taxonomy sitemap/canonical decisions -> `references/content-structure-taxonomy-playbook.md`, `references/taxonomy-indexation-decision-model.md`, `references/configuration-reference.md`, `references/decision-register-model.md` when approval is needed, `templates/taxonomy-indexation-decision-pack.md`, and `templates/content-structure-remediation-plan.md` as needed.
- Yoast settings exports, copied admin settings, option snippets, or partial configuration artefacts -> `references/settings-export-review-playbook.md`, `references/configuration-reference.md`, matching `profiles/` file when site type is known, and `templates/settings-export-review.md`.
- Rendered HTML, page source, HTTP headers, XML sitemaps, robots.txt, llms.txt, schema JSON-LD, or crawl-output QA -> `references/rendered-output-qa-playbook.md`, `references/feature-behaviour-reference.md`, `references/qa-checklists.md`, and `templates/rendered-output-qa-report.md`.
- Before/after Yoast state comparison, post-update regression checks, release QA, retainer comparisons, migration output comparisons, or acceptance gates -> `references/state-comparison-playbook.md`, `references/plugin-update-regression-playbook.md`, `references/audit-triage-model.md`, `references/decision-register-model.md` when decisions are accepted, `templates/yoast-state-comparison-report.md`, `templates/yoast-regression-test-report.md`, and `templates/yoast-acceptance-criteria.md` as needed.
- Periodic Yoast health reviews, monthly or quarterly retainer notes, health scores, what-changed summaries, or low-touch monitoring -> `references/periodic-health-review-playbook.md`, `references/yoast-health-score-model.md`, `references/state-comparison-playbook.md` when comparing with a baseline, `templates/yoast-health-summary.md`, and `templates/yoast-retainer-review-note.md` as needed.
- Portfolio audits, multi-site retainer reviews, cross-site Yoast health summaries, or agency-defaults drift checks -> `references/portfolio-audit-playbook.md`, `references/agency-defaults-drift-model.md`, `references/access-level-workflow.md`, `references/remediation-backlog-model.md` when implementation actions are needed, `templates/yoast-portfolio-audit-summary.md`, and `templates/yoast-defaults-drift-report.md` as needed.
- Feature behaviour, output changes, common mistakes, QA and extension points -> `references/feature-behaviour-reference.md`.
- WooCommerce products, variations, product schema, product archives, facets, filtered URLs -> `references/woocommerce-seo-reference.md` and `intake/woocommerce-intake.md`.
- Schema graph, schema pieces, rich-result eligibility, validators -> `references/schema-reference.md`.
- APIs, filters, presenters, indexables, sitemaps, schema customisation, canonical changes -> `references/developer-api-reference.md` and `templates/developer-handoff.md` when a handoff is requested.
- Standard setup strategy for a site type -> matching `profiles/` file plus `references/configuration-playbooks.md`.
- QA, audit triage, launch/migration checks, remediation backlogs, WordPress admin change plans, or troubleshooting -> `references/qa-checklists.md`, `references/audit-triage-model.md`, `references/access-level-workflow.md`, `references/remediation-backlog-model.md`, `references/conflict-resolution-playbook.md` when evidence conflicts, `templates/launch-qa-checklist.md`, `templates/yoast-remediation-backlog.md`, `templates/wordpress-admin-change-plan.md`, and `templates/yoast-troubleshooting-note.md` when a concise issue note is requested.
- Research pack creation, reference-data refresh, current verification, or source freshness handling -> `docs/research-workflow.md`, `docs/reference-refresh-protocol.md`, `docs/current-verification-playbook.md`, `references/research-pack-output-spec.md`, `references/source-register.md`, `references/evidence-state-model.md`, `templates/yoast-research-pack.md`, `templates/source-register-row-template.md` when editing source rows, and the relevant reference file.
- Future skill architecture, packaging design, adoption, or versioning -> `references/future-skill-architecture.md`, `references/file-routing-index.md`, `docs/maintenance-guide.md`, and `rollout/` where needed.
- Client-safe summaries, decision logs, approval notes, or conflict explanations -> `references/client-communication-guardrails.md`, `references/decision-register-model.md`, `references/conflict-resolution-playbook.md`, `templates/client-safe-summary.md`, and `templates/yoast-decision-log.md` as needed.
- Consistent deliverable format -> `templates/` first; use `examples/templates/` only for style comparison or training.
- Machine-readable output or validation -> `schemas/`, `memory/schemas/`, `fixtures/`, `scripts/`, and `tests/` only when a structured artefact or validation run is requested. Use `scripts/validate_skill_structure.py` for package hygiene and routing coverage, `scripts/validate_evidence_states.py` when evidence-state or audit-finding files change, `scripts/validate_regression_pack.py` when comparison, regression or acceptance files change, `scripts/validate_portfolio_pack.py` when portfolio or defaults-drift files change, `scripts/validate_health_review_pack.py` when health review files change, `scripts/validate_ai_metadata_pack.py` when AI-assisted metadata files change, and `scripts/validate_bulk_metadata_pack.py` when bulk metadata or approval queue files change.
- Skill use, evidence rules, maintenance, rollout, or adoption -> `docs/` and `rollout/`.

## Intake workflow

1. Confirm the site is a WordPress website running WooCommerce core and identify the WooCommerce context: catalogue store, transactional store, subscription or membership extension, bookings or appointments extension, multilingual store, migration/rebuild, duplicate product/archive exposure, weak product/category content, or product schema customisation.
2. Ask only for missing information that materially changes the recommendation. Prefer safe defaults when enough context exists.
3. For WooCommerce, always load `intake/woocommerce-intake.md` or ask the equivalent questions before giving product/archive/schema recommendations.
4. For migrations, always check old/new URL structure, redirects, existing metadata, sitemaps, canonicals, noindex rules, WooCommerce migration state, and schema changes.
5. For schema customisation, confirm whether the goal is vocabulary validity, Google eligibility, entity modelling, plugin conflict resolution, or custom data mapping.
6. For developer tasks, confirm the target layer: WordPress theme, custom plugin, block/plugin integration, headless output, third-party plugin conflict, or data migration.
7. Record source status: user-provided evidence, approved page copy, partial page copy, translated metadata draft, multilingual page set, hreflang crawl, translation-plugin export, redirect map, migration launch checklist, redirect crawl, Yoast redirect export, server/CDN redirect rules, AI-generated draft, taxonomy inventory, content inventory, bulk metadata spreadsheet, approval queue, settings export, rendered output, crawl export, baseline/current comparison, plugin-update regression evidence, portfolio summary evidence, defaults-drift baseline, live scan, source-register research target, or current verified source.
8. For translated or locale-specific metadata, classify the evidence with `references/locale-metadata-governance.md` before recommending approval, import, or admin entry. For AI-assisted metadata, classify the draft with `references/ai-metadata-review-model.md` before recommending approval or admin entry. For bulk metadata changes, use `references/bulk-metadata-governance.md` and `references/approval-queue-workflow.md` before recommending implementation.
9. Create or recommend a decision record when a recommendation changes indexation, canonicals, sitemaps, schema, WooCommerce archive strategy, redirects, product mix, AI-assisted metadata approval, or developer customisation.

## Output workflow

Start every normal response from the mandatory output structure above, then apply the relevant template or specialist workflow. For settings-export, rendered-output, comparison, regression, portfolio and defaults-drift reviews, separate observed values from inferred Yoast behaviour and expected SEO impact. Do not treat a settings export as proof of live output, a baseline comparison as proof of current behaviour without current evidence, or cross-site drift as a defect without site-type and approval context. For AI-assisted metadata, separate generated draft copy from approved source evidence, human approval and rendered-output QA; never treat AI-generated copy as approved source evidence. For bulk metadata edits, separate candidate rows, approval status, implementation route, and post-change verification; never treat a spreadsheet as production approval or rendered output evidence. For content-structure and taxonomy decisions, separate taxonomy inventory, content quality, rendered archive output, sitemap inclusion, canonical state and approval status; never treat a global noindex/sitemap exclusion as low risk without site-type and business-value context. For redirect maps and migration controls, separate proposed mapping, implementation route, approval state, live status-code evidence, canonical/sitemap state, rollback plan and post-launch monitoring; never treat a redirect map as proof of live redirects. For audits and troubleshooting, classify findings with `references/audit-triage-model.md` when severity, priority, owner, confidence, or smallest next action is not obvious. Use `references/conflict-resolution-playbook.md` when settings, output, sources, client preference, or developer behaviour disagree. Use `references/decision-register-model.md` when the recommendation needs approval or future traceability.

1. State confirmed facts and evidence confidence.
2. State assumptions and missing evidence.
3. Recommend configuration decisions with risk level and rationale.
4. Include QA actions for every metadata, canonical, robots, sitemap, schema, breadcrumb, redirect, WooCommerce, AI-assisted, or developer change.
5. Provide open questions only where they affect implementation or approval.
6. End with practical next steps for agency delivery.

## Research-pack workflow

When asked to build or update Yoast reference data:

1. Load `docs/research-workflow.md` and `references/research-pack-output-spec.md`.
2. Start from `references/source-register.md`; scan official Yoast URLs first, then secondary authoritative sources only for verification gaps.
3. Capture evidence in the source register before writing capability, configuration, feature, schema, WooCommerce, or developer conclusions.
4. Populate matrices and reference entries only with sourced facts; mark unknowns as `unclear from available sources` or `needs verification`.
5. Keep product packaging claims separate from developer behaviour and Google Search interpretation.
6. Preserve duplicate URLs in the source register and mark their duplicate relationship.
7. Update `docs/changelog.md`, `docs/maintenance-guide.md`, and any relevant tests after reference data changes.

## Developer customisation rules

- Prefer documented Yoast APIs, filters, presenters, and schema graph extension points.
- Do not advise direct manipulation of Yoast indexables or internal database tables as routine practice.
- Treat deprecated filters/actions as unsafe for new work unless maintaining legacy code and labelled as such.
- Label unverified code examples as pseudo-code.
- Require testing in rendered page source, Yoast REST/surfaces output where applicable, schema validators, sitemap URLs, robots.txt, llms.txt, and Search Console tools.
- Check canonical/noindex conflicts and sitemap exclusion behaviour after any indexation change.
- Use `schemas/` and `fixtures/` only for structure validation; they do not prove Yoast or Google behaviour.

## WooCommerce-specific rules

- Treat WooCommerce SEO as a distinct workflow, not a generic WordPress audit.
- Check product type, variation handling, identifiers, brand/manufacturer data, offers, stock, reviews/ratings, shipping/returns data, product categories, product tags, shop/archive strategy, faceted navigation, and filtered URLs.
- Validate Product, ProductGroup, Offer/AggregateOffer, AggregateRating/Review, and breadcrumb output against both Schema.org vocabulary and Google Search product structured-data expectations.
- Do not assume schema validity guarantees rich results.

## QA expectations

Recommend QA after every Yoast configuration change, plugin upgrade, migration, canonical/noindex decision, schema change, WooCommerce product-data change, redirect change, sitemap exclusion, robots rule, llms.txt change, AI-generated metadata approval, translated metadata approval, hreflang or multilingual sitemap change, redirect-map approval, Yoast redirect import, migration launch control, bulk metadata edit, approval queue decision, taxonomy indexation decision, content-structure remediation, or developer customisation.

## Package maintenance workflow

When asked to refine or package this skill:

1. Preserve the progressive-loading architecture.
2. Keep `SKILL.md` as the compact router and move detailed material into references, intake, profiles, templates, docs, tests, or scripts.
3. Do not add binary assets unless they are genuinely needed and small.
4. Run `scripts/validate_source_register.py`, `scripts/validate_reference_data.py`, `scripts/validate_skill_structure.py`, `scripts/validate_evidence_states.py`, `scripts/validate_decision_records.py`, `scripts/validate_artefact_review.py`, `scripts/validate_regression_pack.py`, `scripts/validate_portfolio_pack.py`, `scripts/validate_health_review_pack.py`, `scripts/validate_ai_metadata_pack.py`, `scripts/validate_bulk_metadata_pack.py`, `scripts/validate_taxonomy_pack.py`, `scripts/validate_redirect_migration_pack.py`, `scripts/validate_related_skill_routing.py`, and a skill packaging validation before returning `skill.zip`.
5. Return the full repackaged skill, not a patch.

## Output formats

Use the templates in `templates/` unless the user asks for a different format. Keep outputs practical, evidence-led, UK English, and agency-ready.
