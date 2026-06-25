---
name: pagespeed-audit-automation
description: 'Run PageSpeed Insights desktop/mobile audits for URL lists or sitemaps, save raw JSON locally, and produce a readable Google Doc report with prioritized fixes. Use when auditing site performance for business owners or developers.'
argument-hint: 'Provide a URL, multiple URLs, sitemap URL, or PSI report link.'
user-invocable: true
---


# PageSpeed Audit Automation

## What This Skill Produces

- A reproducible page-speed audit workflow using PageSpeed Insights API plus Chrome DevTools MCP context.
- Raw PSI JSON files saved locally for each tested URL and strategy.
- A readable Google Doc report with:
  - an index list of all tested URLs at the top
  - per-URL findings grouped by category
  - mobile and desktop metrics shown together for each URL

## When to Use

Use this skill when the user asks for:

- a PageSpeed review of one page, several pages, or a whole site
- sitemap-driven page selection for testing
- actionable performance recommendations rather than raw metrics
- a final report suitable for non-technical and technical audiences

## Required Inputs

At least one of:

- single page URL
- list of page URLs
- sitemap URL
- PSI report link

Optional:

- maximum number of pages to test
- preferred Google Doc title
- notes about priority pages or templates

## Safety And Data Rules

- Never invent measured metrics, CWV values, or scores.
- Never claim a tool run that was not executed in the current session.
- Treat API keys as secrets:
  - do not print, log, or commit keys
  - do not store keys in this skill file, repo files, or reports
- If no URL/report is supplied, ask for one before proceeding.

## Workflow

1. Confirm Scope
- Resolve whether the request is for one URL, a fixed URL list, or sitemap discovery.
- If no explicit pages are provided, default to the primary URL the user mentions.

2. Resolve URL Set
- If user supplies a page list, use it directly after deduplication.
- If user supplies a sitemap:
  - fetch and parse sitemap URLs
  - prioritize representative and high-value pages (home, top-level destination/category pages, key commercial pages, and one or more content pages)
  - exclude utility/non-index pages where possible (login, cart, account, tag archives, feeds, query-heavy URLs)
  - default cap: 15 URLs unless user requests a different limit
- Output the final URL test list before running audits.

3. Obtain And Persist PSI API Key
- First check user configuration for `pagespeedInsights.apiKey`.
- If missing, prompt once for the key.
- Persist it to user settings for reuse at:
  - `~/Library/Application Support/Code/User/settings.json`
  - JSON key: `pagespeedInsights.apiKey`
- Do not echo the key in chat after capture.

4. Run PSI For Every URL (Desktop + Mobile)
- Use [run-pagespeed.sh](./scripts/run-pagespeed.sh) for live runs to guarantee output naming and folder conventions.
- For each URL, run both strategies via the PSI endpoint:
  - `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<url>&key=<key>&strategy=mobile`
  - `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<url>&key=<key>&strategy=desktop`
- Capture relevant fields including:
  - performance score
  - Core Web Vitals and diagnostics available in the payload
  - opportunities and audit details with estimated impact

5. Gather Browser Evidence With Chrome DevTools MCP
- Use Chrome DevTools MCP tools to inspect the page and collect supporting context for recommendations (for example: render-blocking resources, network-heavy assets, and third-party load patterns).
- Keep this as supporting evidence; PSI metrics remain the source for measured values.

6. Save Raw JSON Locally
- Ask whether the user wants a custom output path.
- If no custom path is provided, save in the workspace at `reports/pagespeed/`.
- Save all PSI responses to a single timestamped folder, for example:
  - `reports/pagespeed/<YYYY-MM-DD>_<HHMMSS>/` (timestamped to allow multiple runs on the same day).
- Use URL-based filenames in that folder:
  - `"url"--mobile.json`
  - `"url"--desktop.json`
- Normalize the URL string for filesystem safety (for example, replace unsupported path characters with `-`).
- Also save a lightweight manifest file listing tested URLs and output file paths.

7. Build Audit Findings
- Identify highest-impact issues first.
- Group findings by practical categories such as:
  - Core Web Vitals
  - render-blocking resources
  - images/media
  - JavaScript
  - CSS
  - caching and compression
  - fonts
  - third-party scripts
  - general front-end efficiency
- Prioritize recommendations by impact and implementation effort:
  - Quick wins
  - Medium-effort improvements
  - Larger engineering work

8. Create Google Doc Deliverable
- Create a new Google Doc titled:
  - `PageSpeed Audit - <site-or-page-name> - <YYYY-MM-DD>`
- Include:
  - executive summary
  - URL index list at the beginning
  - per-URL sections with mobile/desktop together
  - prioritized recommendations and limitations
- First attempt a tab-like structure with one URL per tab if supported by the integration.
- Fallback mode: one document with clear per-URL section headings and mobile/desktop side-by-side.
- Use marginless layout if supported by the document integration.

9. Return Completion Summary
- Return a short completion note with:
  - tested URL count
  - local JSON output folder
  - Google Doc name/link or reference
  - any limitations affecting confidence

## Completion Checks

Before finishing, verify:

- every tested URL has both `mobile` and `desktop` PSI JSON outputs
- URL index in the doc matches the tested URL list
- all measured numbers in the report are traceable to PSI output
- inferred recommendations are labelled as inferred where needed
- API key is stored only in user configuration and never in repo files

## Handling Missing Tooling

If Google Docs integration is unavailable in the current environment:

- still complete PSI collection and local JSON outputs
- produce a report-ready Markdown file with the same structure
- explicitly state that doc publishing is pending due to unavailable integration
