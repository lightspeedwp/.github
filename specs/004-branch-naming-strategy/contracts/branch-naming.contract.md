# Branch Naming Contract

**Purpose**: Authoritative specification of the 24 branch types, their routing rules, and validation contract

**Effective Date**: 2026-09-13

**Governance**: Maintained by @ashley; changes via PR review and approval

---

## Type Definitions (24 Authorized Types)

| Type | Purpose | Example | PR Template | Default Labels | Area Detection |
|------|---------|---------|-------------|-----------------|-----------------|
| `feat` | New feature | `feat/user-preferences-panel` | `pr_feature.md` | `type:feature` | {scope} |
| `fix` | Bug fix | `fix/authentication-timeout` | `pr_bugfix.md` | `type:bug` | {scope} |
| `hotfix` | Urgent production fix | `hotfix/critical-security-patch` | `pr_hotfix.md` | `type:bug, priority:critical` | {scope} |
| `release` | Release branch | `release/v1.0.0` | `pr_release.md` | `type:release` | n/a |
| `refactor` | Code refactoring | `refactor/api-response-structure` | `pr_refactor.md` | `type:refactor` | {scope} |
| `chore` | Maintenance, no code changes | `chore/dependency-updates` | `pr_chore.md` | `type:chore` | n/a |
| `task` | Scoped unit of work | `task/authentication-refactor` | `pr_task.md` | `type:task` | {scope} |
| `docs` | Documentation | `docs/branching-strategy-guide` | `pr_docs.md` | `type:documentation` | n/a |
| `test` | Tests, test infrastructure | `test/integration-test-suite` | `pr_test.md` | `type:test` | {scope} |
| `perf` | Performance improvements | `perf/query-optimization` | `pr_perf.md` | `type:enhancement` | {scope} |
| `ci` | CI/CD, pipelines | `ci/github-actions-workflow` | `pr_ci.md` | `type:ci, area:ci` | n/a |
| `build` | Build system, package changes | `build/webpack-config-update` | `pr_build.md` | `type:build, area:build` | n/a |
| `deps` | Dependency updates | `deps/upgrade-npm-packages` | `pr_deps.md` | `type:deps, area:deps` | n/a |
| `security` | Security fixes | `security/xss-vulnerability-fix` | `pr_security.md` | `type:security, priority:critical` | area:security |
| `design` | Design system, UI | `design/button-component-update` | `pr_design.md` | `type:design, area:design` | area:design |
| `a11y` | Accessibility | `a11y/wcag-compliance-audit` | `pr_a11y.md` | `type:a11y, area:a11y` | area:a11y |
| `ux` | User experience | `ux/form-validation-feedback` | `pr_ux.md` | `type:ux, area:ux` | area:ux |
| `i18n` | Internationalization | `i18n/german-translation-pack` | `pr_i18n.md` | `type:i18n, area:i18n` | area:i18n |
| `ops` | Operations, deployment | `ops/database-migration-script` | `pr_ops.md` | `type:ops, area:ops` | area:ops |
| `proto` | Prototype, experimental | `proto/new-caching-strategy` | `pr_proto.md` | `type:proto, area:experimental` | area:experimental |
| `ds` | Design system | `ds/component-library-update` | `pr_ds.md` | `type:design, area:design` | area:design |
| `audit` | Audit, compliance, review | `audit/security-code-review` | `pr_audit.md` | `type:audit, area:audit` | area:audit |
| `codex` | Code generation, AI-assisted | `codex/auto-documentation-tool` | `pr_codex.md` | `type:codex, area:codex` | area:codex |
| `revert` | Revert previous commit | `revert/pr-2345-bad-merge` | `pr_revert.md` | `type:revert` | {reverted_type} |
| `research` | Research, investigation | `research/performance-benchmarks` | `pr_research.md` | `type:research, area:research` | area:research |

---

## Validation Rules

### Pattern (Required)

All branch names MUST match this regular expression:

```regex
^(feat|fix|hotfix|release|refactor|chore|task|docs|test|perf|ci|build|deps|security|design|a11y|ux|i18n|ops|proto|ds|audit|codex|revert|research)/[a-z0-9]+(-[a-z0-9]+)*-[a-z0-9]+(-[a-z0-9]+)*$
```

**Breakdown**:
- `^` — Start of string
- `(feat|fix|...|research)` — One of the 24 authorized types
- `/` — Literal slash separator
- `[a-z0-9]+(-[a-z0-9]+)*` — Scope: lowercase alphanumeric + hyphens, no consecutive hyphens
- `-` — Literal hyphen separator between scope and title
- `[a-z0-9]+(-[a-z0-9]+)*` — Title: lowercase alphanumeric + hyphens, no consecutive hyphens
- `$` — End of string

### Forbidden Prefixes (Reject)

The following prefixes are **NEVER** allowed:

- `claude/` — Reserved for Claude Code internal sessions
- `copilot/` — Reserved for GitHub Copilot integration
- `openai/` — Reserved for OpenAI integration

Any branch starting with these prefixes is **invalid** regardless of the rest of the name.

### Length Constraints

- **Full branch name**: ≤255 characters (Git standard limit)
- **Type**: Exactly one of 24 values (1-9 characters each)
- **Scope**: 1-50 characters recommended (1+ required)
- **Title**: 1-50 characters recommended (1+ required)
- **Total scope + title**: ≤100 characters recommended

### Scope & Title Rules

Both scope and title must:
1. **Start with**: lowercase letter or number
2. **End with**: lowercase letter or number
3. **Contain only**: lowercase letters (a-z), numbers (0-9), and hyphens (-)
4. **No consecutive hyphens**: `user-auth` ✅, `user--auth` ❌
5. **No underscores**: `user_auth` ❌, use `user-auth` ✅
6. **No spaces**: `user auth` ❌
7. **No special characters**: `user@auth` ❌, `user/auth` ❌

---

## Error Messages & Corrections

### Invalid Type

**Message**:
```
❌ Invalid type '{type}'. Not recognized.

Allowed types (24):
  feat fix hotfix release refactor chore task docs test perf
  ci build deps security design a11y ux i18n ops proto ds
  audit codex revert research

Example: feat/user-auth-improvements
```

**Suggestion**:
```
Did you mean: {suggested_type}/{scope}-{title}?
```

### Forbidden Prefix

**Message** (for `claude/`):
```
❌ Forbidden prefix 'claude/'.

The prefix 'claude/' is reserved for Claude Code internal sessions.

Use the pattern:
  {type}/{scope}-{title}

Example: feat/user-auth-improvements
```

### Malformed Scope

**Message**:
```
❌ Scope must use lowercase letters, numbers, and hyphens only.

Invalid scope: '{scope}'

Rules:
  - Start with lowercase letter or number
  - End with lowercase letter or number
  - No consecutive hyphens (use 'user-auth', not 'user--auth')
  - No underscores (use 'user-auth', not 'user_auth')

Example: feat/user-auth-improvements
```

**Suggestion**:
```
Did you mean: feat/{corrected_scope}-{title}?
```

### Malformed Title

**Message**:
```
❌ Title must use lowercase letters, numbers, and hyphens only.

Invalid title: '{title}'

Rules:
  - Start with lowercase letter or number
  - End with lowercase letter or number
  - No consecutive hyphens
  - No underscores, spaces, or special characters

Example: feat/user-auth-improvements
```

### Empty Scope or Title

**Message**:
```
❌ Scope and title cannot be empty.

Pattern: {type}/{scope}-{title}

Your branch: feat/-improvements
               ↑
               Scope is missing

Did you mean: feat/user-improvements?
```

### Suggestion System

When a branch is invalid, the validation system attempts to suggest a correction:

1. **Identify the problem**: invalid type, forbidden prefix, malformed scope/title
2. **Correct the identified part**: lowercase, remove special chars, fix hyphenation
3. **Return suggestion**:
   ```
   Did you mean: {corrected_branch_name}?
   ```
4. **If multiple issues**: Fix in priority order (type > forbidden prefix > scope/title)

**Example**: `FEAT/User-Auth` (3 issues: uppercase type, uppercase scope)
→ Suggestion: `Did you mean: feat/user-auth?`

---

## PR Template Routing

When a PR is created from a valid branch, GitHub Actions automatically applies the appropriate template:

1. **Extract branch type** from branch name (the part before the `/`)
2. **Look up type in this contract** to find the PR template file
3. **Load template** from `.github/PULL_REQUEST_TEMPLATE/{template}.md`
4. **Apply to PR**: Set PR description to template content

**Fallback**: If no template file exists for a type, use `.github/pull_request_template.md` (generic template)

### Template Files (19 templates for 24 types)

- `pr_feature.md` — feat, task, proto
- `pr_bugfix.md` — fix, revert
- `pr_hotfix.md` — hotfix
- `pr_release.md` — release
- `pr_refactor.md` — refactor
- `pr_chore.md` — chore, deps
- `pr_docs.md` — docs
- `pr_test.md` — test
- `pr_perf.md` — perf
- `pr_ci.md` — ci, build
- `pr_security.md` — security
- `pr_design.md` — design, ds
- `pr_a11y.md` — a11y
- `pr_ux.md` — ux
- `pr_i18n.md` — i18n
- `pr_ops.md` — ops
- `pr_audit.md` — audit
- `pr_codex.md` — codex
- `pr_research.md` — research

---

## Label Routing

When a PR is created from a valid branch, GitHub Actions automatically apply labels from the canonical set (`.github/labels.yml`):

1. **Extract branch type** from branch name
2. **Look up default_labels** in this contract for that type
3. **Check each label exists** in canonical `.github/labels.yml`
4. **Apply labels to PR**: Use GitHub REST API to add labels
5. **Area detection**: If scope matches area keywords, add area label (e.g., scope `api-response` → `area:api`)

### Label Format

All labels must follow the prefixed format from canonical set:
- `type:feature`, `type:bug`, `type:security`, etc.
- `priority:critical`, `priority:high`, `priority:normal`, `priority:low`
- `area:api`, `area:docs`, `area:ui`, `area:ci`, etc.
- `status:in-progress`, `status:done`, `status:blocked`, etc.
- `meta:duplicate`, `meta:needs-changelog`, `meta:has-pr`, etc.

**Validation**: Every label in `default_labels` for each type must exist in `.github/labels.yml`.

### Area Detection Rules

Area labels are auto-detected from branch scope using keyword mapping:

- Scope contains `api`, `endpoint`, `route`: → `area:api`
- Scope contains `doc`, `guide`, `readme`: → `area:docs`
- Scope contains `ui`, `component`, `button`: → `area:ui`
- Scope contains `ci`, `workflow`, `action`: → `area:ci`
- Scope contains `security`, `auth`, `crypto`: → `area:security`
- Scope contains `db`, `schema`, `migrate`: → `area:database`
- Scope contains `test`, `spec`, `coverage`: → `area:testing`

**Multiple Matches**: If scope matches multiple keywords, apply all matching area labels (e.g., `api-auth` → `area:api` + `area:security`)

---

## Enforcement Rules

### Local Validation (Pre-Push Hook)

Before a developer pushes a branch, the local hook validates:
1. Branch name matches pattern
2. Type is one of 24 authorized values
3. Prefix is not forbidden
4. Scope and title are properly formatted

**Rejection**: If invalid, prevent push and show error message with suggestion.

### Remote Validation (GitHub Actions)

On every push to any branch, GitHub Actions workflow validates:
1. Branch name is valid
2. Applies default labels
3. Detects area labels
4. Routes PR template (if PR exists)
5. Logs validation result to compliance metrics

**Enforcement**: Validation workflow runs but does not block push (remote gate is handled by PR merge blocking if policy enforced).

### PR Template Routing (GitHub Actions)

When PR is created from a valid branch:
1. Extract type from branch name
2. Load corresponding PR template
3. Apply template to PR description
4. Apply default labels
5. Apply area labels (auto-detected)

**Fallback**: If template or labels not found, use generic template and minimal labels.

---

## Backwards Compatibility

Existing invalid branches created before rollout:

- **Local hook**: Only validates NEW branches created after rollout
- **Remote validation**: Validates all branches (existing and new)
- **PR template routing**: Routes templates for all PRs (existing and new)
- **Label routing**: Applies labels to all PRs (existing and new)

**Grandfathering** (if applicable): [TBD in research phase]
- Option A: Enforce from Day 1 (all branches must be valid)
- Option B: Grace period (grandfather existing branches, enforce only new ones for 30/60/90 days)

---

## Change Management

**This contract is governed by LightSpeed `.github` repository governance.**

To request changes to this contract:
1. Open GitHub issue on `.github` repo with tag `[BRANCH-TYPE-UPDATE-REQUEST]`
2. Propose the specific change (e.g., "Add new type 'xyz'", "Change security template to X")
3. Include impact analysis (affected repos, developers, workflows)
4. Wait for @ashley's approval

Changes to this contract require:
- Update this file with new rules
- Update `.github/branch-types.yml` if adding/removing types
- Update `.github/branch-labels.yml` if changing label mappings
- Re-test GitHub Actions workflows
- Communicate changes to all developers

**No changes permitted to**:
- The 24 authorized type values (frozen)
- Forbidden prefix list (frozen)
- Pattern validation regex (frozen)

These are governance-critical and cannot be changed without escalation.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
