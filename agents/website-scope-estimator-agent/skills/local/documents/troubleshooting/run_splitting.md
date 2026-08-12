# Troubleshooting: run splitting ("why isn't my replace working?")

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
<!-- BADGES-END -->

## Reality

Word splits text into runs unpredictably (style changes, proofing boundaries, fields, etc.).
So searching for a substring and replacing it "as text" often fails.

## Practical strategies

- Work at the `<w:r>` / `<w:t>` level, not the paragraph text level.
- When you must replace a token, consider inserting a hidden marker run first (during `python-docx` authoring) so you can reliably locate the target later when patching OOXML.
- For tracked changes replacements, wrap **exact runs** you want deleted as `<w:del>`, then insert new `<w:ins>` adjacent.

## Helper script

`scripts/docx_ooxml_patch.py` contains utilities that:

- find paragraphs by simple predicates (e.g., indentation)
- replace the Nth tracked insertion inside a paragraph

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
