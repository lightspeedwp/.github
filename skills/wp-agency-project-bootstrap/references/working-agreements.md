# Working agreements

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

The numbered rules every agent on the project follows. Put them in `AGENTS.md`; keep them short and enforceable. A proven set (adapt per project):

1. **Respect scope.** Build only what the estimate covers; out-of-scope → Change-Control Register, not the build. (`agency-scope-change-control`)
2. **Read before you write.** Read the theme's own `AGENTS.md` before touching it; read the relevant spec before building a feature.
3. **Tokens over hardcoding.** Prefer `theme.json` preset tokens (by slug) over inline styles or raw values. Never paste raw hex/font literals into authored files. (`wp-blockstyle-css-field`, `DESIGN.md`)
4. **Security & a11y are non-negotiable.** Escape all PHP output with the text domain; semantic `tagName`s; heading hierarchy; keyboard support.
5. **Small, reasoned diffs.** No new build tooling or dependencies without explicit justification. No plugin-like features inside the theme.
6. **Don't touch WordPress core** (`wp-admin/`, `wp-includes/`, root `wp-*.php`) or secrets (`wp-config.php`).
7. **Write artifacts to the right place.** Reports and task lists to their designated folders — never the repo root or `docs/`.
8. **Keep the changelog current.** Update the theme's `CHANGELOG.md` after meaningful changes.
9. **Verify, then claim.** If something is untested or partial, say so. Don't report "done" without evidence. (`wp-mcp-wpcli-ops` verification discipline)
10. **Escalate model tiers, don't start at the top.** When delegating to a subagent, invoke a **lower-tier model first** (e.g. Haiku → Sonnet). Escalate to a higher tier (Opus) only on evidence the lower tier can't do it — repeated wrong results, missed requirements, or genuinely hard reasoning. Default low, escalate on evidence; don't reach for the most expensive model pre-emptively.

## Why these

Each rule closes a specific, recurring failure: scope drift (1), building blind (2), un-tokenised one-offs that break the design system (3), shipped a11y/security gaps (4), reviewer-hostile diffs and dependency sprawl (5), broken core/leaked secrets (6), repo clutter (7), undocumented change history (8), false "done" claims (9), and needless model cost (10).

## Make them load automatically where possible

Rules that must fire *every* time (e.g. "run the escape-for-i18n build before committing") belong in tool automation (hooks / CI), not just prose — an agent can forget a paragraph but not a hook.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
