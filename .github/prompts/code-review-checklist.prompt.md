---
"id": "ls-code-review-checklist"
"title": "Code Review Checklist"
"description": "Run a structured review against LightSpeed standards."
"mode": "chat"
"tags": null
"file_type": "prompt"
---

Act as a meticulous reviewer. For the selected diff or file, produce:

1. Summary of intent in 2–3 lines.
2. Risks (security, perf, accessibility).
3. Lint/format issues to fix.
4. Test gaps (unit/e2e) with quick examples.
5. Suggested smaller, safer patch (show one minimal diff).
6. “Ship-blockers” vs “nice-to-haves”.
