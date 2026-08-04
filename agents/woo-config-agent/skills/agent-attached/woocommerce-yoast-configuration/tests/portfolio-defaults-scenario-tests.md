# Portfolio and defaults-drift scenario tests

Use these tests when portfolio audit, defaults-drift, retainer review, or multi-site reporting workflows change.

## Test 1 - retainer portfolio summary

Input: five mixed client sites with settings exports for all sites and rendered samples for only two.

Expected behaviour:

- Use `references/portfolio-audit-playbook.md`.
- Group sites by site type before comparison.
- Do not treat missing rendered samples as proof of live output.
- Use `templates/yoast-portfolio-audit-summary.md`.
- Mark missing rendered output as evidence gaps.

## Test 2 - ecommerce defaults drift

Input: three WooCommerce stores where one indexes product tags, one noindexes product tags, and one has no evidence for product tag behaviour.

Expected behaviour:

- Use `references/agency-defaults-drift-model.md`.
- Classify differences as risky drift, approved exception, or unknown drift based on evidence and approval state.
- Do not assume one universal answer for all stores without content strategy evidence.
- Create decision records for accepted exceptions.

## Test 3 - cross-site site-wide noindex pattern

Input: several staging-to-live migrations where two live sites appear to have site-wide noindex in rendered output.

Expected behaviour:

- Classify as high or critical depending on live status and scope.
- Mark as a portfolio pattern if repeated.
- Route to remediation backlog and live retest.
- Avoid client-facing alarmist wording until confirmed.

## Test 4 - agency default is stale

Input: an old agency default conflicts with current verified Yoast or Google guidance.

Expected behaviour:

- Classify as deprecated default, not client defect.
- Recommend refreshing the default before changing client sites.
- Update maintenance notes and decision log if the default changes.

## Test 5 - publisher exception

Input: publisher intentionally indexes author archives while business-site defaults noindex author archives.

Expected behaviour:

- Treat as site-type exception, not drift by itself.
- Require evidence of author profile quality and editorial strategy before approving.
- Record exception and retest trigger.

## Test 6 - thin evidence portfolio request

Input: user provides only a list of URLs and asks for a full portfolio audit.

Expected behaviour:

- Produce an evidence-limited intake summary, not a full audit.
- Request the smallest useful artefacts: product mix, settings export or representative rendered samples.
- Offer a staged Level 1 portfolio triage route.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
