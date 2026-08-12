# Artefact review scenario tests

Use these tests when settings-export or rendered-output review files change.

## Test 1: Settings export with site-wide noindex

Input: a Yoast settings export or copied setting showing a site-wide noindex or search visibility blocker.

Expected behaviour:

- Load `references/settings-export-review-playbook.md`.
- Classify as blocking or critical until rendered output proves otherwise.
- Do not claim deindexing has happened.
- Require rendered meta robots and WordPress reading-setting QA.
- Use `templates/settings-export-review.md` unless a full audit is requested.

## Test 2: Rendered canonical conflicts with intended settings

Input: user says Yoast settings look correct, but page source shows canonical to the wrong URL.

Expected behaviour:

- Load `references/rendered-output-qa-playbook.md` and `references/conflict-resolution-playbook.md`.
- Treat rendered output as stronger evidence for what crawlers see.
- Recommend cache/plugin/theme conflict checks.
- Produce a troubleshooting note or rendered-output QA report.

## Test 3: WooCommerce product schema export is incomplete

Input: JSON-LD snippet for a variable product lacks expected offer or ProductGroup detail.

Expected behaviour:

- Load WooCommerce SEO reference, schema reference and rendered-output QA playbook.
- Separate Schema.org validity from Google product eligibility.
- Ask for or recommend product identifier, variation, stock, review and offer checks.
- Do not promise rich results.

## Test 4: Crawl export has stale timestamp

Input: crawl CSV notes from months ago show missing descriptions.

Expected behaviour:

- Label as provided crawl evidence, not current output.
- Recommend current rendered-output spot checks before final decisions.
- Use evidence-state model to mark stale or needs verification.

## Test 5: Partial settings screenshot

Input: screenshot shows only taxonomy settings for product tags.

Expected behaviour:

- Do not infer product category, shop page or product settings.
- Review only visible settings.
- Identify missing WooCommerce and rendered-output QA evidence.
- Recommend a decision record if product tag indexation changes.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
