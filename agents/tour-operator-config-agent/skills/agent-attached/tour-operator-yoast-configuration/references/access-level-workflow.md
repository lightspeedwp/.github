# Access Level Workflow

Use this reference to state what the current evidence can and cannot prove.

## Access levels

- **No access**: planning only. Use assumptions clearly.
- **Screenshots**: medium confidence for visible settings only.
- **Settings export**: proves configured values, not rendered output.
- **Rendered source**: proves current crawler-facing output for sampled URLs.
- **Crawl evidence**: supports broader patterns, subject to crawl scope.
- **WordPress admin**: can verify settings and content, but still QA rendered output.
- **Search Console**: supports Google interpretation, not Yoast configuration by itself.
- **Codebase**: supports implementation review, not live behaviour unless deployed and tested.
