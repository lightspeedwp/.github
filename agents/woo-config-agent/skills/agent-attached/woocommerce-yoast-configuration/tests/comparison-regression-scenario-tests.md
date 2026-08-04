# Comparison and regression scenario tests

Use these tests when updating state-comparison, regression, acceptance or artefact review workflows.

## Scenario 1: before/after settings export

Input: pre-update and post-update Yoast settings exports show taxonomy visibility changed.

Expected behaviour:

- Use `references/state-comparison-playbook.md`.
- Classify the change as expected, intentional, regression or needs verification.
- Do not claim rendered output changed until representative taxonomy archive output is checked.
- Recommend a decision record if accepting a risky indexation change.

## Scenario 2: Yoast plugin update regression check

Input: Yoast SEO Premium and WooCommerce SEO were updated; product schema looks different.

Expected behaviour:

- Use `references/plugin-update-regression-playbook.md`.
- Require baseline/current representative product output.
- Check product, variable product, category and sitemap coverage.
- Use `templates/yoast-regression-test-report.md`.

## Scenario 3: migration acceptance criteria

Input: site rebuild is ready for approval with Yoast settings configured.

Expected behaviour:

- Use `templates/yoast-acceptance-criteria.md`.
- Include metadata, canonicals, robots, sitemap, schema, redirects and decision records.
- Keep acceptance criteria pass/fail and evidence-led.

## Scenario 4: current-source mismatch after update

Input: existing reference says a feature exists, but current Yoast product page or docs suggest packaging changed.

Expected behaviour:

- Use current verification and conflict-resolution playbooks.
- Treat existing reference as stale until verified.
- Update source register after scanning.

## Scenario 5: accepted regression

Input: client approves noindexing product tags after post-update comparison flags sitemap removal.

Expected behaviour:

- Create or recommend a decision record.
- Classify as intentional decision, not unresolved regression.
- Include QA checks for sitemap exclusion and rendered meta robots.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
