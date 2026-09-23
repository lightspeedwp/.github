# Branch Naming Strategy Rollout Announcement

**Subject:** Introducing Mandatory Branch Naming Rules — All Developers

**From:** LightSpeed Engineering Leadership

**Date:** 2026-09-18

**Status:** 🚀 Now Live in Pilot Repos | 📋 Org-wide Rollout Timeline Below

---

## What's Changing?

Effective immediately, **new branches in the five pilot repositories should follow this pattern. Phase 1 uses soft enforcement with warnings and guidance, but no blocking:**

```
{type}/{scope}-{title}
```

**Examples:**

- ✅ `feat/user-preferences-panel`
- ✅ `fix/authentication-timeout`
- ✅ `security/xss-vulnerability-fix`
- ✅ `docs/branching-strategy-guide`
- ❌ `feature/my-feature` ← Wrong (use `feat/`)
- ❌ `claude/my-feature` ← FORBIDDEN (reserved prefix)

---

## Why This Matters

1. **Prevents cascading failures** — Broken branch names break PR template routing and GitHub Actions workflows
2. **Eliminates manual work** — PR templates route automatically based on branch type
3. **Scales across 50+ repos** — Consistent naming supports org-wide automation
4. **Enforced by validation** — Invalid branches are rejected automatically

---

## Authorized Branch Types (38 Total)

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat/user-auth-panel` |
| `fix` | Bug fix | `fix/database-connection-leak` |
| `security` | Security fix | `security/csrf-token-validation` |
| `docs` | Documentation | `docs/branching-strategy-guide` |
| `test` | Tests, test infrastructure | `test/integration-test-suite` |
| `refactor` | Code refactoring | `refactor/response-routing` |
| `chore` | Maintenance, no code changes | `chore/dependency-updates` |
| `perf` | Performance improvements | `perf/query-optimization` |
| `ci` | CI/CD, pipelines | `ci/github-actions-workflow` |
| `hotfix` | Urgent production fix | `hotfix/critical-security-patch` |
| `design`, `a11y`, `ux`, `i18n` | Design, accessibility, UX, localization | `a11y/wcag-compliance-audit` |
| `api`, `schema`, `ops`, `proto` | API, data, operations, prototype | `api/rest-endpoint-versioning` |
| `research`, `audit`, `codex` | Investigation, compliance, AI-assisted | `research/performance-benchmarks` |
| `aiops`, `automation`, `epic` | AI ops, workflow automation, epics | `automation/issue-routing` |
| **+14 more** | See [BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md) for full list | — |

---

## Forbidden Prefixes (NEVER Use)

- ❌ **`claude/`** — Reserved for Claude Code internal sessions
- ❌ **`copilot/`** — Reserved for GitHub Copilot integration
- ❌ **`openai/`** — Reserved for OpenAI integration

Invalid prefixes normally block pushes through the local pre-push hook. If the hook is bypassed, a PR may still be created, but its branch-validation check will fail and can block merging until the branch is renamed.

---

## How It Works

### Before You Push

Validate your branch locally (instant feedback, <1 second):

```bash
npm run validate:branch-name -- --branch feat/my-feature
```

**Expected output:**

```
✅ Branch 'feat/my-feature' is valid
```

### PR Creation (Automatic)

When you create a PR from a valid branch:

1. ✅ **Template routes automatically** — Correct PR template loads based on type
2. ✅ **Labels apply automatically** — Type labels applied (e.g., `type:feature`)
3. ✅ **Area detection works** — Keywords in scope auto-detect area labels (e.g., `area:api`)

**Example:** Branch `feat/api-endpoint` → Uses `pr_feature.md` template + `type:feature` + `area:api` labels

---

## Rollout Timeline

### Phase 1: Pilot (Week 1 — Sept 18-24)

- Applies to: 5 pilot repos
- Mode: Soft enforcement (warnings and guidance, with no blocking)
- Dev support: Team leads answer questions in Slack #branch-naming

### Phase 2: Expansion (Week 2-3 — Sept 25 - Oct 6)

- Enforced in: 20+ repos
- Mode: Hard enforcement (invalid branches are rejected)
- Compliance target: 95% valid branches

### Phase 3: Org-wide (Week 4+ — Oct 7+)

- Enforced in: All 50+ repos
- Metrics dashboard: Not yet available
- Support: Escalate to engineering if issues arise

---

## Support & Resources

### Get Help

- **❓ Questions?** Post in [#branch-naming Slack channel](https://slack.com/archives/lightspeed)
- **📖 Full Guide:** Read [docs/BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md)
- **🔗 CLAUDE.md:** [Branch Naming Rules](../../../CLAUDE.md#-branch-naming--critical-read-first)

### Examples by Scenario

**Adding a user feature?**

```bash
git checkout -B feat/user-preferences-panel origin/develop
```

**Fixing a bug?**

```bash
git checkout -B fix/authentication-timeout origin/develop
```

**Security patch?**

```bash
git checkout -B security/xss-vulnerability-fix origin/develop
```

**Documentation?**

```bash
git checkout -B docs/branching-strategy-guide origin/develop
```

### Troubleshooting

**"Invalid branch name" — what do I do?**

1. Check your branch name against the pattern: `{type}/{scope}-{title}`
2. Ensure type is in the 38 authorized list (see table above)
3. Ensure no uppercase, underscores, or special characters
4. Delete and recreate: `git branch -D old-name && git checkout -B new-name origin/develop`

**"I already created an invalid branch" — how do I fix it?**

1. Push to a temporary branch: `git push origin old-name:temp-old-name`
2. Create correct branch: `git checkout -B correct-name origin/develop`
3. Cherry-pick commits: `git cherry-pick origin/develop..origin/temp-old-name`
4. Push correct branch and create PR
5. Delete temp branch: `git push origin --delete temp-old-name`

---

## FAQ

**Q: Do I have to memorize all 38 types?**
A: No. Use the table above or run `npm run validate:branch-name -- --help` for quick reference. For detailed guidance on choosing the right type, see [BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md).

**Q: What if my existing branches don't follow the pattern?**
A: Existing branches are grandfathered in — they are not renamed retroactively. Only NEW branches must follow the pattern. Note: the pre-push hook and CI validate the branch on every push, so pushing new commits to a non-conforming existing branch will be blocked until it is renamed; plan the rename before your next push.

**Q: Can I use branch aliases or shortcuts?**
A: No. All branches must follow the exact pattern: `{type}/{scope}-{title}`. Branch shortcuts should be configured locally in your `.gitconfig` if desired.

**Q: What happens if I force-push an invalid branch?**
A: GitHub Actions will comment on any PR you create, explaining the issue and suggesting the correct name. You'll need to rename the branch and recreate the PR.

---

## Thank You

This change improves developer experience across LightSpeed by:

- ✅ Eliminating manual work (PR templates route automatically)
- ✅ Preventing failures (validation catches errors upfront)
- ✅ Scaling automation (consistent naming enables org-wide workflows)
- ✅ Supporting 50+ repos with zero per-repo configuration

**Questions?** Reach out in [#branch-naming Slack](https://slack.com/archives/lightspeed) or [@engineering-team](mailto:team@lightspeedwp.agency).

---

**Welcome to standardized branch naming! 🚀**

*Generated by speckit-implement (2026-09-18)*
[View Implementation Plan](./plan.md)
