# Access-level workflow

Use this reference when the user's Yoast task depends on what evidence or system access is available. The goal is to prevent the skill from recommending actions that cannot be safely confirmed or implemented with the current access level.

## Access levels

| Access level | What it proves | What it does not prove | Safe output |
|---|---|---|---|
| `no access` | Only the user's description | Current settings, rendered output, plugin versions or Google interpretation | Intake questions, assumptions, likely risks, evidence request list |
| `screenshots` | Visible UI state at screenshot time | Hidden settings, live output, code overrides, indexables state | Partial settings review with validation gaps |
| `settings export` | Exported or copied Yoast/admin values | Rendered page output, HTTP headers, robots response, sitemap availability, schema validity | Settings export review and live QA checklist |
| `wordpress admin` | Current visible settings and content structure | Theme/plugin filters, server headers, cache/CDN behaviour, Google interpretation | Admin change plan plus rendered-output QA requirement |
| `staging` | Testable implementation environment | Production crawl/indexing behaviour unless mirrored | Change plan, regression test plan, pre-launch QA |
| `codebase` | Theme/plugin/customisation logic | Runtime settings, production output or content completeness unless supplied | Developer handoff and code review checklist |
| `rendered source` | Actual HTML/JSON-LD/meta output for supplied URLs | Admin setting cause unless settings/code are supplied | Rendered-output QA and likely cause notes |
| `crawl export` | Crawled URL status and extracted elements | Exact Yoast configuration or server-side cause | Pattern review, triage, QA follow-up list |
| `Search Console` | Google-reported visibility/indexing signals for verified property | Full site configuration or immediate Google behaviour | Evidence-backed impact notes and verification plan |
| `live scan` | Current public output and HTTP responses | Hidden admin intent or code ownership | Current-output QA and implementation routing |

## Access-aware routing rules

- If the user wants implementation instructions but only provides a finding, produce a `templates/yoast-remediation-backlog.md` style output and mark owner/access requirements.
- If the user has WordPress admin access but not codebase access, use `templates/wordpress-admin-change-plan.md` and avoid code-level assumptions.
- If the user has codebase access but no rendered output, use `templates/developer-handoff.md` and require rendered-source QA after deployment.
- If the user provides only settings exports, use `references/settings-export-review-playbook.md` and explicitly state that exports do not prove live output.
- If evidence conflicts across access levels, use `references/conflict-resolution-playbook.md` and prefer rendered output/live scan over intended settings for current-state claims.

## Minimum evidence by task

| Task | Minimum evidence | Better evidence | Stop condition |
|---|---|---|---|
| Product capability recommendation | Current product pages or source register marked verified current | Product page + WordPress.org listing + changelog context | Product packaging is unverified and commercial decision depends on it |
| Settings audit | Settings export or admin screenshots | Admin access + rendered source sample | User asks for exact current output but no output is supplied |
| Rendered-output QA | Page source or crawl export | Live scan + settings/code context | User asks for cause/remediation but only supplies symptoms |
| WooCommerce schema review | Product page rendered JSON-LD | Product data + variation/product type data + settings | Product identifiers/variation data missing for ProductGroup/Offer conclusions |
| Developer customisation | Codebase snippet or desired output | Codebase + rendered output + official Yoast API source | Direct DB/indexables edit is requested without official support |
| Migration acceptance | Old/new URLs + settings/output samples | Redirect map + crawl + Search Console | No old/new URL evidence for redirect/canonical decisions |

## Output requirements

Always state:

1. Access level used.
2. What the evidence confirms.
3. What remains unverified.
4. Safest next action available with current access.
5. Whether implementation needs admin, developer, client or SEO lead approval.
