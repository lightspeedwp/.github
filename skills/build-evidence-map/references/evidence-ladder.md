# Evidence ladder

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

Use the strongest evidence practical for the decision. A higher class can still
be stale, irrelevant, or too broad for the nearby claim.

1. **Direct current observation** — reproduced behavior, command output,
   inspected artifact, or measured result.
2. **Authoritative primary source** — official specification, dataset, law,
   documentation, first-party repository, or original research.
3. **Independent corroboration** — competent sources with distinct underlying
   evidence.
4. **Explicit inference** — a conclusion whose premises and assumptions are
   visible in the map.
5. **Weak proxy** — related metric, benchmark, anecdote, or test that does not
   exercise the exact claim.
6. **Unsupported assertion** — confidence, repetition, or polished language
   without evidence.

## Source-region test

Before creating an evidence node, answer:

- What exact sentence, table, command output, page, section, or line range is
  being relied on?
- Does it entail the node text, or merely discuss the same subject?
- Is its date and version appropriate for the claim?
- Is the evidence independent, or copied from another cited source?
- What context would reverse or narrow the interpretation?

If the exact region cannot be located, create an `unknown` node instead of an
evidence node.

## Edge test

| Relation | Use when | Common counterfeit |
| --- | --- | --- |
| `supports` | The source increases reason to accept the target | Topical similarity |
| `contradicts` | Both cannot hold under the same scope and conditions | Different dates or populations |
| `qualifies` | The source narrows scope, strength, or applicability | Hiding inconvenient evidence |
| `missing` | A specific absent fact blocks or could reverse the target | Generic “more research needed” |

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
