# Changelog

## 1.1.0 - 2026-07-04

- Created `woocommerce-yoast-auditor` as a WooCommerce-only version of the Yoast audit skill.
- Refocused triggering, routing examples, intake prompts and output contracts on WordPress sites running WooCommerce core and WooCommerce extension plugins only.
- Removed broad non-WooCommerce audit profiles that are not needed for the WooCommerce Configuration Agent.
- Confirmed the skill is scoped to WordPress websites running WooCommerce core and WooCommerce extension plugins, with no non-WooCommerce vertical files required.
- Preserved WooCommerce SEO audit, schema, migration, launch QA, evidence review, proposed edit review and developer handoff workflows.

## 1.0.4 - 2026-07-03

- Refreshed `references/source-register.md` after scanning the official Yoast, Yoast developer, WordPress.org plugin, Google Search Central and Schema.org sources on 2026-07-03.
- Standardised template wording to use `Owner / next route` throughout report templates.
- Tightened template contract wording so future checks expect the standard `Owner / next route` field.

## 1.0.3 - 2026-07-03

- Added client-safe note wording to product/page metadata, taxonomy/archive and evidence gap templates so partial reports stay safe if reused in client-facing documents.

## 1.0.2 - 2026-07-03

- Added `Risk` columns to specialised finding tables.
- Added score fallback wording to scored templates so partial evidence can use `## Score status` instead of an unsupported numeric score.
- Added client-safe notes to client-facing specialised templates.
- Added maintenance guidance to run a template contract check after editing templates.
- Added `tests/template-contract-tests.md` to validate required finding fields across report templates.

## 1.0.1 - 2026-07-03

- Added Skill QA / self-verification guidance so verification checks the entrypoint, referenced files, routing, safety rules, templates and tests before readiness is declared.
- Added output contract enforcement for full audits, client reports, internal reports, handoffs and template outputs.
- Added fast audit mode for lightweight Yoast triage when evidence is partial or the user asks for a quick review.
- Embedded core scope, evidence, scoring, product-capability and owner-routing models in `SKILL.md` so the skill does not rely on references for core behaviour.
- Updated report templates and tests to require evidence status, owner routing and retest fields.

## 1.0.0 - 2026-07-03

- Initial source version based on the original Yoast audit workflow.
- Refocused the source skill on audit, report, QA, completed-change validation and developer handoff.
- Removed edit ownership as a default behaviour.
- Added explicit routing boundary with `woocommerce-yoast-configuration`.
- Added lean version-one references, intake files, profiles, templates, team docs and scenario tests.
- Added source register structure with pending-scan source entries.

---

*🧭 Your compass through the documentation landscape*
