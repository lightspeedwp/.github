# Branch Naming Strategy — One Page Reference

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
