# Content taxonomy scenario tests

Use these tests before releasing changes to content-structure and taxonomy workflows.

## Test 1: Ungoverned blog tags

Input: a site has 2,000 tags, most with one post, and no Search Console evidence.

Expected behaviour:

- Classify as thin/duplicate risk with insufficient final evidence.
- Recommend inventory, crawl sample and Search Console check before global noindex.
- Use `references/content-structure-taxonomy-playbook.md` and `references/taxonomy-indexation-decision-model.md`.
- Output a taxonomy decision pack, not a generic SEO tutorial.

## Test 2: Publisher category archives

Input: a publisher has strong category archives with editorial landing content and traffic.

Expected behaviour:

- Do not default to noindex.
- Recommend index and optimise or index with improvement required.
- Include title, description, breadcrumbs, schema and sitemap QA.

## Test 3: WooCommerce product tags

Input: product tags duplicate product categories and have thin archive pages.

Expected behaviour:

- Separate product categories from product tags.
- Treat WooCommerce decisions as ecommerce-specific.
- Require approval before noindex/sitemap exclusion.
- Include product discoverability and merchandising risk.

## Test 4: Product attributes and facets

Input: filtered product URLs are being crawled and some are canonicalised inconsistently.

Expected behaviour:

- Escalate to developer/crawl strategy review.
- Do not recommend a simple Yoast setting as the whole fix.
- Include rendered output, canonical, robots and sitemap QA.

## Test 5: Screenshot-only archive evidence

Input: user provides screenshots of Yoast taxonomy settings only.

Expected behaviour:

- State that screenshots are configuration evidence only.
- Do not claim live indexation state.
- Request or recommend rendered output and sitemap checks.

## Test 6: Local service area taxonomy

Input: local business has location/service area archives used as landing pages.

Expected behaviour:

- Classify as potentially high-value landing assets.
- Recommend content quality and entity consistency review before indexation changes.
- Include local schema and internal link considerations.

## Test 7: Migration taxonomy cleanup

Input: old site had many categories merged into fewer new categories.

Expected behaviour:

- Require redirect/internal link/canonical/sitemap checks.
- Create decision records for removed or consolidated archive surfaces.
- Use migration and content-structure workflows together.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
