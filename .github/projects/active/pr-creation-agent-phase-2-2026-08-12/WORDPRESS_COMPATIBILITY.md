# PR Creation Agent — WordPress Compatibility Analysis

**Phase:** 2 (Specification)  
**Document Type:** Platform Compatibility & Configuration  
**Timeline:** Reference for Phase 3 Implementation (2026-08-20 → 2026-09-02)

---

## 1. EXECUTIVE SUMMARY

The PR Creation Agent is **single-codebase portable** to all LightSpeed repository types (GitHub control plane, WordPress plugins, WordPress themes) with **zero code changes**—all differences are configuration-driven.

**Single Agent, Three Config Profiles:**

| Repository Type | Config Profile | Key Differences |
|---|---|---|
| **GitHub Control Plane** | `standard` | Full governance stack (Mergify, labels, feedback tracking) |
| **WordPress Plugin** | `wordpress.plugin` | Simplified workflow, disable Mergify, WordPress-specific labels |
| **WordPress Theme** | `wordpress.theme` | Simplified workflow, disable Mergify, WordPress-specific labels |

**Core Principle:** The agent codebase remains identical across all repos. Configuration determines behavior per environment.

---

## 2. REPOSITORY TYPE PROFILES

### 2.1 GitHub Control Plane Profile

**Repository:** `lightspeedwp/.github`

**Characteristics:**

- Organisational governance and orchestration repository
- Full governance infrastructure in place (Mergify, branch protection, label automation)
- Complex multi-skill workflows required
- AI-driven governance and standards

**Configuration Profile:** `standard`

**Key Settings:**

```yaml
repository:
  type: github-control-plane
  governance_level: full
  
merging:
  strategy: mergify  # Full Mergify queue integration
  auto_merge: true
  merge_method: squash
  
labeling:
  canonical_path: .github/labels.yml
  enforce_prefixes: true
  label_count: 158  # Full canonical label set
  
issue_linking:
  required: true
  allowed_verbs: [Resolves, Closes, Fixes, Related to]
  
wordpress:
  enabled: false
```

**Enabled Skills:**

- ✅ validate-branch-name
- ✅ route-pr-template
- ✅ validate-and-apply-labels
- ✅ enforce-issue-linking
- ✅ draft-pr-description
- ✅ create-pr
- ✅ (Optional) code-review
- ✅ (Optional) figma

**PR Templates Available:**

- `pr_feature.md`, `pr_bug.md`, `pr_hotfix.md`, `pr_release.md`, `pr_ci.md`, `pr_chore.md`, `pr_docs.md`, `pr_dep_update.md`, `pr_refactor.md`

**Mergify Integration:**

- ✅ Enabled
- Sequential queue processing (one PR at a time)
- Auto-rebase on base branch changes
- Require all checks green before merge

---

### 2.2 WordPress Plugin Profile

**Repository Examples:** `lightspeedwp/wordpress-plugin-a`, `lightspeedwp/wordpress-plugin-b`, etc.

**Characteristics:**

- Plugin development repositories
- Simpler governance than control plane
- No Mergify (direct merge or simpler CI/CD)
- WordPress-specific PR templates and labels
- Plugin development workflows (testing, building, releasing)

**Configuration Profile:** `wordpress.plugin`

**Key Settings:**

```yaml
repository:
  type: wordpress-plugin
  governance_level: simplified
  
merging:
  strategy: direct  # Direct merge or simple CI/CD
  auto_merge: false  # Manual review required
  merge_method: squash
  mergify_enabled: false  # WordPress plugins don't use Mergify
  
labeling:
  canonical_path: .github/labels.yml  # Shared canonical labels
  enforce_prefixes: true
  label_count: 158  # Subset of full set used
  wordpress_labels: true  # Add WordPress-specific labels
  
issue_linking:
  required: false  # Optional, not required
  allowed_verbs: [Resolves, Closes, Fixes]
  
wordpress:
  enabled: true
  repo_type: plugin
  
plugin_specific:
  build_script: npm run build
  test_script: npm run test
  release_script: npm run release
  changelog_file: CHANGELOG.md
```

**Enabled Skills:**

- ✅ validate-branch-name
- ✅ route-pr-template
- ✅ validate-and-apply-labels
- ✅ enforce-issue-linking (optional)
- ✅ draft-pr-description
- ✅ create-pr
- ⚠️ code-review (optional, for plugin QA)

**Custom PR Templates:**

- `pr_plugin_feature.md` (plugin-specific features)
- `pr_plugin_bugfix.md` (plugin bug fixes)
- `pr_plugin_maintenance.md` (dependency updates, docs)

**WordPress-Specific Labels:**

- `type:wordpress-compatibility` — WordPress version compatibility
- `area:plugin-core` — Core plugin functionality
- `area:admin` — WordPress admin interface
- `priority:wordpress-release` — Blocks plugin release
- `test:wordpress-multisite` — Requires multisite testing

---

### 2.3 WordPress Theme Profile

**Repository Examples:** `lightspeedwp/wordpress-theme-a`, `lightspeedwp/wordpress-theme-b`, etc.

**Characteristics:**

- Theme development repositories
- Similar governance to plugins (simplified)
- No Mergify (direct merge or simple CI/CD)
- Theme-specific PR templates and labels
- Theme development workflows (block patterns, styles, testing)

**Configuration Profile:** `wordpress.theme`

**Key Settings:**

```yaml
repository:
  type: wordpress-theme
  governance_level: simplified
  
merging:
  strategy: direct  # Direct merge or simple CI/CD
  auto_merge: false  # Manual review required
  merge_method: squash
  mergify_enabled: false  # WordPress themes don't use Mergify
  
labeling:
  canonical_path: .github/labels.yml  # Shared canonical labels
  enforce_prefixes: true
  label_count: 158  # Subset of full set used
  wordpress_labels: true  # Add WordPress-specific labels
  
issue_linking:
  required: false  # Optional, not required
  allowed_verbs: [Resolves, Closes, Fixes]
  
wordpress:
  enabled: true
  repo_type: theme
  
theme_specific:
  build_script: npm run build
  test_script: npm run test:theme
  release_script: npm run release
  changelog_file: CHANGELOG.md
```

**Enabled Skills:**

- ✅ validate-branch-name
- ✅ route-pr-template
- ✅ validate-and-apply-labels
- ✅ enforce-issue-linking (optional)
- ✅ draft-pr-description
- ✅ create-pr
- ⚠️ figma (for design-driven theme changes)

**Custom PR Templates:**

- `pr_theme_feature.md` (theme features, blocks, patterns)
- `pr_theme_style.md` (styling, CSS, design tokens)
- `pr_theme_maintenance.md` (dependency updates, docs)

**WordPress-Specific Labels:**

- `type:wordpress-compatibility` — WordPress version compatibility
- `area:theme-core` — Core theme functionality
- `area:block-patterns` — Theme block patterns
- `area:styles` — Theme CSS/styling
- `priority:wordpress-release` — Blocks theme release
- `test:theme-browser-compat` — Requires browser testing

---

## 3. CONFIGURATION MATRIX: KEY DIFFERENCES

### 3.1 Governance & Merging

| Feature | Control Plane | WordPress Plugin | WordPress Theme |
|---------|---|---|---|
| **Mergify Queue** | ✅ Full integration | ❌ Disabled | ❌ Disabled |
| **Branch Protection** | Strict (all checks required) | Moderate (PR review only) | Moderate (PR review only) |
| **Auto-Merge** | Yes (if all checks green) | No (manual merge) | No (manual merge) |
| **Merge Strategy** | Squash merge | Squash merge | Squash merge |
| **Require Issue Link** | ✅ Required | ⚠️ Optional | ⚠️ Optional |
| **Label Enforcement** | Strict (all mandatory) | Moderate (type + area) | Moderate (type + area) |

### 3.2 PR Templates

| Template | Control Plane | Plugin | Theme |
|---|---|---|---|
| **Feature** | ✅ `pr_feature.md` | ✅ `pr_plugin_feature.md` | ✅ `pr_theme_feature.md` |
| **Bug Fix** | ✅ `pr_bug.md` | ✅ `pr_plugin_bugfix.md` | ✅ `pr_theme_style.md` |
| **Release** | ✅ `pr_release.md` | ⚠️ N/A (manual) | ⚠️ N/A (manual) |
| **CI/CD** | ✅ `pr_ci.md` | ❌ N/A | ❌ N/A |
| **Docs** | ✅ `pr_docs.md` | ✅ `pr_plugin_maintenance.md` | ✅ `pr_theme_maintenance.md` |

### 3.3 Labels

| Label Category | Control Plane | Plugin | Theme |
|---|---|---|---|
| **Canonical Labels** | 158 (all) | 158 (subset) | 158 (subset) |
| **Type Prefixes** | ✅ All 16 types | ✅ Basic types | ✅ Basic types |
| **Area Prefixes** | ✅ All 20+ areas | ⚠️ Subset (plugin areas) | ⚠️ Subset (theme areas) |
| **WordPress Labels** | ❌ No | ✅ Yes (10+) | ✅ Yes (10+) |
| **Prefix Enforcement** | Strict | Moderate | Moderate |

---

## 4. SKILL BEHAVIOR DIFFERENCES

### 4.1 validate-branch-name

**Behavior Difference:** Minor

```yaml
# Control Plane
allowed_types:
  - feat, fix, hotfix, chore, docs, ci, build, deps
  - security, refactor, perf, test, design, a11y, ux, i18n
  - ops, research, revert
max_length: 72

# WordPress (Plugin & Theme)
allowed_types:
  - feat, fix, chore, docs, test
  - refactor, perf
max_length: 72  # Same limit
```

**WordPress Deviation:** Simplified type list (no ci, build, deps, security, etc. — not applicable to plugin/theme development)

---

### 4.2 route-pr-template

**Behavior Difference:** High

```yaml
# Control Plane
template_routing:
  feat: .github/PULL_REQUEST_TEMPLATE/pr_feature.md
  fix: .github/PULL_REQUEST_TEMPLATE/pr_bug.md
  hotfix: .github/PULL_REQUEST_TEMPLATE/pr_hotfix.md
  ci: .github/PULL_REQUEST_TEMPLATE/pr_ci.md

# WordPress Plugin
template_routing:
  feat: .github/PULL_REQUEST_TEMPLATE/pr_plugin_feature.md
  fix: .github/PULL_REQUEST_TEMPLATE/pr_plugin_bugfix.md
  chore: .github/PULL_REQUEST_TEMPLATE/pr_plugin_maintenance.md
  fallback: .github/PULL_REQUEST_TEMPLATE/pr_default.md

# WordPress Theme
template_routing:
  feat: .github/PULL_REQUEST_TEMPLATE/pr_theme_feature.md
  fix: .github/PULL_REQUEST_TEMPLATE/pr_theme_style.md
  chore: .github/PULL_REQUEST_TEMPLATE/pr_theme_maintenance.md
  fallback: .github/PULL_REQUEST_TEMPLATE/pr_default.md
```

**Reason:** Each repository type has different PR template sets adapted to that context.

---

### 4.3 validate-and-apply-labels

**Behavior Difference:** High

```yaml
# Control Plane
label_validation:
  require_type: true  # e.g., type:bug
  require_area: true  # e.g., area:ci
  require_priority: false
  canonical_set: .github/labels.yml (158 labels)

# WordPress Plugin
label_validation:
  require_type: true  # e.g., type:feature
  require_area: true  # e.g., area:plugin-core
  require_priority: false
  require_wordpress: false  # Optional
  canonical_set: .github/labels.yml (158 labels)
  wordpress_inferred:
    - "if files contain 'src/admin/': area:admin"
    - "if files contain 'includes/': area:plugin-core"
    - "if any file matches version requirement: type:wordpress-compatibility"

# WordPress Theme
label_validation:
  require_type: true
  require_area: true
  require_priority: false
  require_wordpress: false  # Optional
  canonical_set: .github/labels.yml (158 labels)
  wordpress_inferred:
    - "if files contain 'patterns/': area:block-patterns"
    - "if files contain 'assets/css/': area:styles"
    - "if any file matches version requirement: type:wordpress-compatibility"
```

**Reason:** WordPress repos can infer WordPress-specific labels from file patterns.

---

### 4.4 enforce-issue-linking

**Behavior Difference:** High

```yaml
# Control Plane (REQUIRED)
issue_linking:
  required: true
  allowed_verbs: [Resolves, Closes, Fixes, Related to]
  verify_open: true

# WordPress Plugin (OPTIONAL)
issue_linking:
  required: false  # Don't block on missing issues
  allowed_verbs: [Resolves, Closes, Fixes]
  verify_open: false  # Don't validate against GitHub

# WordPress Theme (OPTIONAL)
issue_linking:
  required: false  # Don't block on missing issues
  allowed_verbs: [Resolves, Closes, Fixes]
  verify_open: false  # Don't validate against GitHub
```

**Reason:** WordPress plugins/themes often have simpler issue tracking; issue linking is enforced only in the control plane.

---

### 4.5 draft-pr-description

**Behavior Difference:** Medium

```yaml
# Control Plane
description:
  include_changelog: true
  include_feedback_tracking: true
  include_test_plan: true
  include_related_issues: true
  scope_adaptation: true  # Detailed for complex changes

# WordPress Plugin
description:
  include_changelog: true  # CHANGELOG.md
  include_feedback_tracking: false
  include_test_plan: false
  include_related_issues: optional
  scope_adaptation: true  # Simpler for plugin changes
  include_wordpress_compat: true  # Add WP version notes

# WordPress Theme
description:
  include_changelog: true  # CHANGELOG.md
  include_feedback_tracking: false
  include_test_plan: false
  include_related_issues: optional
  scope_adaptation: true  # Simpler for theme changes
  include_wordpress_compat: true  # Add WP version notes
  include_design_context: true  # Reference Figma/design
```

**Reason:** WordPress repos have simpler PR descriptions; control plane requires more governance metadata.

---

### 4.6 create-pr

**Behavior Difference:** High

```yaml
# Control Plane
pr_creation:
  draft: false  # Create immediately ready
  auto_merge: conditional  # If all checks green
  label_batch_size: 10
  notify: [slack, github-discussion]

# WordPress Plugin
pr_creation:
  draft: false  # Create immediately ready
  auto_merge: false  # Never auto-merge plugins
  label_batch_size: 5
  notify: [none]  # No notifications for plugins

# WordPress Theme
pr_creation:
  draft: false  # Create immediately ready
  auto_merge: false  # Never auto-merge themes
  label_batch_size: 5
  notify: [none]  # No notifications for themes
```

**Reason:** WordPress repos don't use Mergify, so auto-merge is disabled. Control plane uses Mergify queue for sequential merging.

---

## 5. CONFIGURATION FILE EXAMPLES

### 5.1 GitHub Control Plane Config

**File:** `lightspeedwp/.github/.claude/pr-agent.config.yml`

```yaml
---
agent:
  name: pr-creation-agent
  version: "1.0.0"

repository:
  type: github-control-plane
  governance_level: full
  
branching:
  allowed_types:
    - feat
    - fix
    - hotfix
    - release
    - refactor
    - chore
    - docs
    - test
    - perf
    - ci
    - build
    - deps
    - security
    - revert
    - research
    - design
    - a11y
    - ux
    - i18n
    - ops
  max_length: 72

merging:
  strategy: mergify
  auto_merge: true
  merge_method: squash
  mergify_queue: dependabot-develop

labeling:
  canonical_path: .github/labels.yml
  enforce_prefixes: true
  require_type: true
  require_area: true
  file_pattern_mapping:
    '\.github/.*': area:github
    'docs/.*': area:docs
    'scripts/.*': area:scripts

issue_linking:
  required: true
  allowed_verbs:
    - Resolves
    - Closes
    - Fixes
    - Related to

pr_description:
  include_changelog: true
  include_feedback_tracking: true
  changelog_file: CHANGELOG.md

wordpress:
  enabled: false

custom_hooks: null
```

---

### 5.2 WordPress Plugin Config

**File:** `lightspeedwp/wordpress-plugin-a/.claude/pr-agent.config.yml`

```yaml
---
agent:
  name: pr-creation-agent
  version: "1.0.0"

repository:
  type: wordpress-plugin
  governance_level: simplified
  
branching:
  allowed_types:
    - feat
    - fix
    - chore
    - docs
    - test
    - refactor
    - perf
  max_length: 72

merging:
  strategy: direct
  auto_merge: false
  merge_method: squash
  mergify_enabled: false

labeling:
  canonical_path: .github/labels.yml
  enforce_prefixes: true
  require_type: true
  require_area: true
  infer_wordpress_labels: true
  file_pattern_mapping:
    'src/admin/.*': area:admin
    'includes/.*': area:plugin-core
    'tests/.*': area:testing

issue_linking:
  required: false
  allowed_verbs:
    - Resolves
    - Closes
    - Fixes

pr_description:
  include_changelog: true
  include_feedback_tracking: false
  include_wordpress_compat: true
  changelog_file: CHANGELOG.md

wordpress:
  enabled: true
  repo_type: plugin
  build_script: npm run build
  test_script: npm run test
  release_script: npm run release

custom_hooks: .claude/pr-agent-wordpress-hooks.js
```

---

### 5.3 WordPress Theme Config

**File:** `lightspeedwp/wordpress-theme-a/.claude/pr-agent.config.yml`

```yaml
---
agent:
  name: pr-creation-agent
  version: "1.0.0"

repository:
  type: wordpress-theme
  governance_level: simplified
  
branching:
  allowed_types:
    - feat
    - fix
    - chore
    - docs
    - test
    - refactor
    - perf
  max_length: 72

merging:
  strategy: direct
  auto_merge: false
  merge_method: squash
  mergify_enabled: false

labeling:
  canonical_path: .github/labels.yml
  enforce_prefixes: true
  require_type: true
  require_area: true
  infer_wordpress_labels: true
  file_pattern_mapping:
    'patterns/.*': area:block-patterns
    'assets/css/.*': area:styles
    'tests/.*': area:testing

issue_linking:
  required: false
  allowed_verbs:
    - Resolves
    - Closes
    - Fixes

pr_description:
  include_changelog: true
  include_feedback_tracking: false
  include_wordpress_compat: true
  include_design_context: true
  changelog_file: CHANGELOG.md

wordpress:
  enabled: true
  repo_type: theme
  build_script: npm run build
  test_script: npm run test:theme
  release_script: npm run release

custom_hooks: .claude/pr-agent-wordpress-hooks.js
```

---

## 6. DEPLOYMENT COMPATIBILITY MATRIX

### 6.1 Target Repositories (12 Total)

| Repository | Type | Compatibility | Notes |
|---|---|---|---|
| `lightspeedwp/.github` | Control Plane | ✅ Full | Standard config profile |
| `lightspeedwp/wordpress-plugin-a` | Plugin | ✅ Full | WordPress.plugin profile |
| `lightspeedwp/wordpress-plugin-b` | Plugin | ✅ Full | WordPress.plugin profile |
| `lightspeedwp/wordpress-plugin-c` | Plugin | ✅ Full | WordPress.plugin profile |
| `lightspeedwp/wordpress-plugin-d` | Plugin | ✅ Full | WordPress.plugin profile |
| `lightspeedwp/wordpress-theme-a` | Theme | ✅ Full | WordPress.theme profile |
| `lightspeedwp/wordpress-theme-b` | Theme | ✅ Full | WordPress.theme profile |
| `lightspeedwp/internal-tools-repo` | Control Plane (Internal) | ✅ Full | Standard config (simpler) |
| `lightspeedwp/documentation-site` | Control Plane (Docs) | ✅ Full | Standard config (docs-focused) |
| Additional repos | Mixed | ✅ Flexible | Config per repo type |

**Total Coverage:** 12 repositories across 3 types, single portable agent codebase.

---

## 7. WORDPRESS-SPECIFIC FEATURES

### 7.1 WordPress Compatibility Checking

When `wordpress.enabled: true`, the agent adds:

```yaml
WordPress Compatibility Checks:
  - Detects minimum/maximum WP version from code
  - Adds type:wordpress-compatibility label if detected
  - Includes WP version notes in PR description
  - Checks for deprecated WordPress APIs (if scanners available)
```

### 7.2 WordPress Custom Hooks

Optional file: `.claude/pr-agent-wordpress-hooks.js`

```javascript
module.exports = {
  // Called for WordPress plugins/themes
  inferWordPressLabels: async (files, repo) => {
    // Custom WordPress label inference
    const labels = [];
    
    // Example: if files touch WP hooks, add label
    if (files.some(f => f.includes('hooks') || f.includes('filter'))) {
      labels.push('area:wordpress-hooks');
    }
    
    return labels;
  },
  
  // Custom WP version detection
  detectWordPressRequirements: async (files) => {
    // Parse composer.json or similar
    return { min: '6.0', max: '6.4' };
  }
};
```

---

## 8. SINGLE-AGENT PORTABILITY GUARANTEE

### 8.1 Code Coverage

**No repository-specific code in agent implementation:**

```
✅ agents/pr-creation-agent/pr-orchestrator.js — generic
✅ agents/pr-creation-agent/config-loader.js — generic
✅ agents/pr-creation-agent/skills/*.js — generic (no repo checks)
❌ agents/pr-creation-agent/wp-only-skill.js — FORBIDDEN
```

**All WordPress differences:**

- Live in configuration (`wordpress.enabled: true/false`)
- Configured via `.claude/pr-agent.config.yml` per repo
- Implemented via optional hooks (`.claude/pr-agent-wordpress-hooks.js`)
- **Zero WordPress-specific code in agent core**

### 8.2 Installation Steps (Identical for All Repos)

```bash
# 1. Install agent (same for all repos)
cp -r agents/pr-creation-agent .claude/agents/pr-creation-agent

# 2. Copy repo-specific config (DIFFERENT per repo type)
cp config.templates/pr-agent-config-{standard|wordpress.plugin|wordpress.theme}.yml \
   .claude/pr-agent.config.yml

# 3. Optionally add WordPress hooks (WordPress repos only)
cp config.templates/pr-agent-wordpress-hooks.js .claude/
```

---

## 9. VALIDATION & TESTING

### 9.1 Configuration Validation

**Validation Schema:** `schemas/pr-agent-config.schema.json`

```
✓ All configs validate against same schema
✓ Repository type determines allowed values
✓ Incompatible settings rejected (e.g., mergify_enabled: true in WordPress)
```

### 9.2 Test Coverage by Repository Type

| Test Type | Control Plane | Plugin | Theme |
|---|---|---|---|
| **Unit Tests** | 100+ | 100+ | 100+ |
| **Config Tests** | 20+ | 20+ | 20+ |
| **Integration Tests** | 30+ | 30+ | 30+ |
| **E2E (Real Repos)** | 5+ | 2-3 | 2-3 |

**Total Test Count:** 700+ tests covering all 3 profiles

---

## 10. PHASE 3 IMPLEMENTATION GUIDANCE

**Based on this compatibility analysis, Phase 3 will:**

1. **Implement core agent** — Single codebase, all tests generic
2. **Create config schema** — Validates all 3 profile types
3. **Deploy to 3 test repos** — One per type (control plane, plugin, theme)
4. **Validate behavior differences** — Confirm skills adapt per config
5. **Test WordPress-specific features** — Hooks, label inference, compatibility checking

---

**Compatibility Analysis Complete. Single Agent, Multiple Configs, Full Portability Guaranteed.**
