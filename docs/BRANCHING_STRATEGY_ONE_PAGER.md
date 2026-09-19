# Branch Naming Strategy — One Page Reference

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

**Quick Links:**

- Full Guide: [docs/BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)
- Validation: `npm run validate:branch-name -- --branch <your-branch>`

## Pattern

```
{type}/{scope}-{title}
```

**Example:** `feat/user-authentication-system`

## Quick Type Selector

| Need | Type | Example |
|------|------|---------|
| New feature | `feat` | `feat/dark-mode` |
| Bug fix | `fix` | `fix/login-timeout` |
| Urgent fix | `hotfix` | `hotfix/payment-down` |
| Code restructure | `refactor` | `refactor/api-structure` |
| Cleanup | `chore` | `chore/remove-debug` |
| Documentation | `docs` | `docs/api-guide` |
| Tests | `test` | `test/unit-tests` |
| Performance | `perf` | `perf/query-optimization` |
| CI/CD | `ci` | `ci/github-actions` |
| Dependencies | `deps` | `deps/npm-upgrade` |
| Security | `security` | `security/xss-fix` |
| Design/UI | `design` | `design/button-update` |
| Accessibility | `a11y` | `a11y/wcag-compliance` |
| API changes | `api` | `api/v2-endpoint` |
| Database/Schema | `schema` | `schema/user-table` |
| Other | See full guide | — |

## Naming Rules

✅ **DO:**

- Use lowercase: `user-auth`
- Use hyphens: `add-feature` (not `add_feature`)
- Be specific: `fix-null-pointer-in-payment`
- Use 2-4 words

❌ **DON'T:**

- Use underscores: ❌ `user_auth`
- Use uppercase: ❌ `User-Auth`
- Use `claude/`, `copilot/`, or `openai/`
- Use single-word scope: ❌ `fix/bug`
- Use spaces: ❌ `user auth`

## Validation

```bash
npm run validate:branch-name -- --branch <your-branch>
```

## 24 Allowed Types

| Type | Purpose | Type | Purpose |
|------|---------|------|---------|
| `feat` | New feature | `security` | Security fix |
| `fix` | Bug fix | `design` | Design changes |
| `hotfix` | Urgent fix | `a11y` | Accessibility |
| `release` | Release branch | `ux` | UX improvements |
| `refactor` | Code restructure | `i18n` | Internationalization |
| `chore` | Maintenance | `ops` | Operations |
| `task` | Project work | `proto` | Prototype |
| `docs` | Documentation | `ds` | Design system |
| `test` | Tests | `api` | API changes |
| `perf` | Performance | `schema` | Data schema |
| `ci` | CI/CD | `telemetry` | Analytics |
| `build` | Build system | `content` | Content changes |
| `deps` | Dependencies | `seo` | SEO |
| `research` | Research | `config` | Configuration |
| `audit` | Code audit | `migrate` | Data migration |
| `codex` | Code generation | `qa` | QA processes |
| `revert` | Revert commit | `uat` | UAT changes |

## Forbidden Prefixes

**NEVER use:**

- ❌ `claude/` — Reserved for internal sessions
- ❌ `copilot/` — Reserved for Copilot
- ❌ `openai/` — Reserved for OpenAI

## Examples

**Good Examples:**

- `feat/user-registration-with-email-verification`
- `fix/infinite-loop-in-search-results`
- `docs/getting-started-installation`
- `perf/database-query-optimization`
- `security/prevent-xss-in-comments`
- `design/button-hover-animation`

**Poor Examples:**

- ❌ `my-feature` — missing type
- ❌ `feature/my-feature` — wrong type (use `feat`)
- ❌ `feat/auth` — too vague
- ❌ `feat/user_registration` — use hyphens
- ❌ `claude/my-work` — forbidden prefix

## Common Questions

**Q: What if my work doesn't fit one type?**  
A: Choose the closest match. Most work is `feat`, `fix`, `refactor`, or `task`.

**Q: Can I use multiple types?**  
A: No. One type per branch. Split multi-part work into separate branches.

**Q: What if I make a mistake?**  
A: Run `git branch -m old-name new-name` to rename locally, push, and update PR.

**Q: Are there exceptions?**  
A: No. Naming is strictly enforced via automation.

---

**Full Guide:** [docs/BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)  
**Support:** Ask your team lead or check Slack

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
