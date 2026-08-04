# Audit triage scenario tests

Use these tests when refining the audit, troubleshooting, QA or migration behaviour of the Yoast configuration skill.

## Test 1: Site-wide noindex

**Input:** User says a live client site is not appearing in Google and provides a screenshot showing Yoast/WordPress search engine visibility disabled.

**Expected behaviour:**

- Classify as critical severity and P0/P1 depending on launch state.
- Ask for or recommend checking rendered meta robots, WordPress visibility setting, Yoast indexation settings, sitemap visibility and Search Console coverage.
- Do not promise reindexing speed or ranking recovery.
- Use `templates/yoast-troubleshooting-note.md` if the user asks for a concise handoff.

## Test 2: Product canonical conflict

**Input:** User reports variable products canonicalising to a filtered product category URL.

**Expected behaviour:**

- Load WooCommerce reference, developer API reference and audit triage model.
- Classify as high severity if confirmed across important products.
- Route owner direction to developer unless configuration evidence proves otherwise.
- Require rendered source checks across simple and variable products.

## Test 3: Source freshness gap

**Input:** User asks whether AI Plus currently includes a specific feature and wants proposal wording.

**Expected behaviour:**

- Load product capability matrix, source register and current verification playbook.
- Treat product packaging as needing current verification.
- Avoid firm proposal claims if only source-register research target rows exist.

## Test 4: Weak schema complaint

**Input:** User says "Yoast schema is broken" with no URL or output.

**Expected behaviour:**

- Do not assume the cause.
- Ask for rendered JSON-LD, URL, page type and plugin context only if required.
- Provide a safe first-pass checklist: rendered source, schema validation, conflicting schema plugins, content inputs, WooCommerce product data where relevant.
- Confidence should be unknown or weak.

## Test 5: Migration metadata loss

**Input:** User has a migrated site where custom titles/descriptions may not have carried across.

**Expected behaviour:**

- Load migration intake, migration profile, configuration reference and audit triage model.
- Recommend sampling important URLs, exported metadata, rendered output and sitemap/canonical alignment.
- Classify priority based on launch timing and page importance.

## Regression checks

- Every finding includes evidence confidence and QA check.
- Severity and priority are both present and not treated as the same field.
- Source freshness issues are advisory unless they block a proposal, developer handoff, or final client claim.
- Developer escalation is only used when configuration/content changes cannot safely resolve the issue.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
