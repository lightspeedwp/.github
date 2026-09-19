# Hybrid discovery and ranking

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use high-recall search first, semantic matching second, and full-file verification third.

## Generate query families dynamically

For each capability, generate:

- direct query: domain or object + required action + Skill;
- operation query: input + transformation + output;
- supporting query: desired quality or reduced risk + operation;
- integration query: relevant system + CLI, MCP, API, connector, or browser automation;
- Chinese and English forms;
- synonyms, abbreviations, and desired artifact names;
- a GitHub query targeting `SKILL.md` when supported.

Do not reuse queries from a different domain. Humanizer-style helpers are found through queries about natural writing, tone, rewriting, or style quality rather than the main domain name.

## Search order

1. Current project profile and local Skill index.
2. Installed and archived Skills not yet indexed.
3. Registries such as skills.sh and agentskill.sh.
4. GitHub repository and file search.
5. OpenCLI or general web search for broader recall.
6. Platform-specific search only when current platform evidence is needed.

Search snippets discover candidates; they do not verify them. Verify from the canonical repository.

Run browser-backed OpenCLI searches sequentially. Retry one rejected navigation with an explicit profile and trace, then fall back to another read-only source.

## Match by capability

Compare each candidate against:

- input compatibility;
- operation performed;
- expected output;
- domain constraints;
- read/write boundary;
- environment and dependencies;
- evidence from full instructions and scripts.

Do not rank on title similarity alone.

## Internal trust record

Keep this record internally. In plain-language mode, translate it to `安全检查通过`, `安全试跑通过`, and `最近确认可用`.

```yaml
identity: canonical owner/repository:path@revision
source_url: canonical URL
license: value or unknown
capability: input -> operation -> output
covered_steps: []
evidence: []
dependencies: []
permissions: []
external_actions: []
community:
  installs: value or unknown
  stars: value or unknown
  feedback: value or unknown
  independent_usage: value or unknown
last_confirmed_working: YYYY-MM-DD or unknown
installation_safety_check: pass|fail|incomplete
safe_trial: pass|fail|not-run
local_status: absent|installed|duplicate|conflict
file_fingerprint: internal value
uncertainties: []
```

## Hard gates

Do not recommend installation while any of these remains unresolved:

- source or exact version cannot be identified;
- no readable installable Skill structure exists;
- full contents do not support the claimed capability;
- mandatory runtime, tool, account, or operating system is incompatible;
- critical security behavior is unexplained;
- the only test would mutate a real external system;
- intended use creates material license or terms uncertainty.

## Weighted score

Score only after the hard gates.

| Dimension | Weight | High score means |
|---|---:|---|
| Workflow fit | 30 | Matches the exact required input, operation, output, and boundaries |
| Community adoption | 25 | Credible installs, stars, feedback, and independent real-world use |
| Safety and control | 15 | Least privilege, clear approvals, no unexplained high-risk behavior |
| Evidence and safe trial | 15 | Full-file evidence and a reproducible non-destructive trial |
| Ease of use | 10 | Dependencies available, clear setup, stable output, useful errors |
| Maintenance and provenance | 5 | Canonical source, identifiable owner, recently maintained or intentionally stable |

Break the 25 community points down as guidance:

- installation or adoption count: up to 10;
- repository stars/forks relative to age and niche: up to 5;
- ratings and written feedback with enough volume: up to 5;
- independent examples, integrations, or repeated use: up to 5.

Avoid double-counting a monorepo's stars for every small Skill. Normalize numbers by source, age, and niche where possible. A recently released niche Skill may be labeled `promising` rather than treated as bad, but it should not outrank a similarly fitting and well-proven alternative without evidence.

Use confidence labels:

- **Confirmed**: hard gates pass, full check complete, safe trial passes.
- **Promising**: fit looks good but trial or dependency verification is incomplete.
- **Unconfirmed**: insufficient evidence; exclude from one-click installation.
- **Blocked**: hard gate failed or critical risk remains.

## Minimal stack selection

Choose the fewest non-overlapping Skills that cover all required success conditions.

Prefer:

1. an existing confirmed local Skill;
2. one well-routed Skill covering several necessary capabilities;
3. a primary Skill plus narrowly scoped helpers;
4. a new installation only for a real gap.

Do not recommend two primary Skills for the same step unless the user wants alternatives.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
