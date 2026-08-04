# Configuration scenario tests

Use these tests to check whether the skill routes to the right files and produces useful outputs.

## Scenario 1: standard business website setup

Input: "Configure Yoast for a new lead-generation WordPress site."

Expected routing:

- `intake/client-site-intake.md`
- `profiles/business-website.md`
- `references/configuration-reference.md`
- `templates/yoast-configuration-report.md`

Expected behaviour:

- State assumptions.
- Recommend safe content-type, taxonomy, archive, sitemap, canonical, schema and QA defaults.
- Avoid product entitlement claims unless verified.

## Scenario 2: publisher/blog audit

Input: "Audit Yoast settings for a blog with authors, tags and date archives."

Expected routing:

- `profiles/publisher-blog.md`
- `references/configuration-reference.md`
- `references/qa-checklists.md`
- `templates/yoast-audit-report.md`

Expected behaviour:

- Review author/date/category/tag indexation.
- Flag thin archive and duplicate-content risks.
- Check Article/Breadcrumb/WebPage schema output.

## Scenario 3: migration/rebuild launch QA

Input: "Prepare Yoast QA for a site migration with changed URLs."

Expected routing:

- `intake/migration-intake.md`
- `profiles/migration-rebuild.md`
- `references/qa-checklists.md`
- `templates/launch-qa-checklist.md`

Expected behaviour:

- Require redirect, canonical, noindex, sitemap, robots, schema and Search Console checks.
- Avoid promising Google recrawl timing or ranking outcomes.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
