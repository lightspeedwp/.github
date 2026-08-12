---
file_type: documentation
title: PR Creation Agent — Phase 2 Specification
description: Comprehensive specification for portable PR creation agent with implementation plan, test strategy, and WordPress compatibility
version: 2.0.0
created_date: 2026-08-12
last_updated: 2026-08-12
authors:
  - lightspeedwp/agents
tags:
  - openspec
  - specification
  - agents
  - pr-creation
  - phase-2
---

# PR Creation Agent — Phase 2: Specification & Implementation Plan

**Document ID:** `pr-creation-agent-phase-2-specification`  
**Version:** 2.0.0  
**Status:** 📋 Draft (Specification Phase)  
**Phase:** 2 of 4  
**Timeline:** 2026-08-16 → 2026-08-20  
**Related Issue:** [#1813 — Phase 2 Specification](https://github.com/lightspeedwp/.github/issues/1813)  
**Related PR:** [Phase 2 Planning](https://github.com/lightspeedwp/.github/pull/new/design/pr-creation-agent-phase-2-specification)  
**Parent Epic:** [#1722 — Repository Restructuring & Agent Standardisation](https://github.com/lightspeedwp/.github/issues/1722)

---

## 1. EXECUTIVE SUMMARY

### Phase 2 Objectives

Build comprehensive specification for a **single portable PR creation agent** that:

- Serves GitHub control plane AND 8–12 WordPress plugin/theme repositories
- Uses configuration-driven adaptations instead of separate implementations
- Includes comprehensive test strategy (95%+ coverage)
- Supports full documentation with architecture diagrams

### Key Decisions (From Phase 1)

| Decision | Specification |
|----------|---------------|
| **Agent Type** | Multi-file agent with skill-delegating architecture |
| **Portability** | Single codebase, per-repo configuration |
| **WordPress Support** | Optional skills + configuration, not separate agent |
| **Testing** | 95%+ unit coverage + mock + real integration tests |
| **Documentation** | API docs + deployment guides + troubleshooting + Mermaid diagrams |

---

## 2. AGENT ARCHITECTURE SPECIFICATION

### 2.1 Multi-File Agent Structure

```
agents/pr-creation-agent/
├── agent.md                              # Agent manifest
├── pr-orchestrator.js                    # Main orchestrator
├── config-loader.js                      # Configuration management
├── state-machine.js                      # Agent state management
├── skills/
│   ├── validate-branch-name.js          # Skill: Branch validation
│   ├── route-pr-template.js             # Skill: Template routing
│   ├── validate-and-apply-labels.js     # Skill: Label management
│   ├── enforce-issue-linking.js         # Skill: Issue validation
│   ├── draft-pr-description.js          # Skill: Description composition
│   └── create-pr.js                     # Skill: GitHub API
├── config/
│   ├── schema.json                      # Configuration schema
│   └── defaults.yml                     # Default configuration
├── tests/                               # Test files (95%+ coverage)
│   ├── unit/
│   │   ├── skills.test.js
│   │   ├── orchestrator.test.js
│   │   └── config-loader.test.js
│   └── integration/
│       ├── mock-github-api.test.js
│       └── real-github-e2e.test.js
└── README.md                             # Implementation guide
```

### 2.2 Skill Specifications

#### Existing Skills (4)

1. **code-review** — Optional pre-PR review (existing skill)
2. **commit-push-pr** — Git operations (existing patterns)
3. **commit** — Commit signing (existing patterns)
4. **figma** — Design-to-code integration (optional)

#### New Skills (6)

##### Skill 1: validate-branch-name

**Purpose:** Validate branch matches `{type}/{scope}-{short-title}`

**Inputs:**

- `branchName: string`
- `config: object` (allowed types, custom rules)

**Outputs:**

- `valid: boolean`
- `errors: string[]`

**Contracts:**

- Must validate against configured branch types
- Must support custom validation hooks
- Must return actionable error messages

##### Skill 2: route-pr-template

**Purpose:** Determine correct PR template from branch type

**Inputs:**

- `branchName: string`
- `templatesPath: string`
- `repoConfig: object`

**Outputs:**

- `templatePath: string`
- `templateType: string`
- `templateMetadata: object`

**Contracts:**

- Must load from `.github/PULL_REQUEST_TEMPLATE/config.yml` or fallback
- Must support custom template routing via hooks
- Must return template metadata (required sections, etc.)

##### Skill 3: validate-and-apply-labels

**Purpose:** Validate labels against canonical set and infer missing labels

**Inputs:**

- `userLabels: string[]`
- `files: string[]`
- `config: object` (canonical labels, inference rules)

**Outputs:**

- `validLabels: string[]`
- `inferredLabels: string[]`
- `errors: string[]`

**Contracts:**

- Must validate prefixed labels only (type:*, area:*, priority:*)
- Must infer labels from changed files if configured
- Must support custom inference via hooks

##### Skill 4: enforce-issue-linking

**Purpose:** Validate linked issues exist and are in correct state

**Inputs:**

- `linkedIssues: string[]` (e.g., ['#1234', '#1235'])
- `branchType: string`
- `githubClient: object`

**Outputs:**

- `validIssues: object[]`
- `errors: string[]`

**Contracts:**

- Must validate issue numbers exist in GitHub
- Must check issues are open (not closed)
- Must support required vs. optional linking per branch type

##### Skill 5: draft-pr-description

**Purpose:** Compose PR body with template, linked issues, changelog

**Inputs:**

- `template: string` (template content)
- `userDescription: string`
- `linkedIssues: object[]`
- `scope: string` ('single-file' | 'multi-file' | 'complex')
- `files: string[]`

**Outputs:**

- `prBody: string` (markdown)
- `metadata: object`

**Contracts:**

- Must populate all template sections
- Must adapt description depth based on scope
- Must include linked issues in correct format
- Must optionally include changelog entry

##### Skill 6: create-pr

**Purpose:** Create PR via GitHub API with error handling

**Inputs:**

- `prData: object` (title, body, branch, labels, etc.)
- `githubClient: object`

**Outputs:**

- `pr: object` (PR number, URL, sha)
- `error: string | null`

**Contracts:**

- Must create PR on specified branch
- Must support draft/ready modes
- Must apply labels programmatically
- Must handle API rate limits

---

## 3. CONFIGURATION SPECIFICATION

### 3.1 Schema: `.claude/pr-agent.config.yml`

```yaml
# PR Creation Agent Configuration Schema

pr_agent:
  # Base integration
  base_branch: string                    # 'develop' | 'main' | custom
  is_monorepo: boolean                   # true if monorepo
  
  # Path configuration
  templates_path: string                 # .github/PULL_REQUEST_TEMPLATE
  canonical_labels_path: string          # .github/labels.yml
  changelog_file: string                 # CHANGELOG.md | CHANGES.md
  
  # Branch validation
  branch_validation:
    enabled: boolean                     # default: true
    allowed_types:                       # list of allowed branch types
      - feat
      - fix
      - docs
      - chore
      - ci
      - refactor
    custom_rules: object                 # optional hooks reference
  
  # Label configuration
  labels:
    required_type_prefixes:              # require type:* label
      - type
    optional_prefixes:                   # optional area:*, priority:*
      - area
      - priority
    infer_from_files: boolean            # auto-infer labels from files
    file_patterns:                       # map file paths to labels
      '.github/**': 'area:ci'
      'wp-content/plugins/**': 'area:plugin'
  
  # Issue linking
  issue_linking:
    required: boolean                    # mandatory linking?
    allowed_verbs:                       # Resolves, Closes, Fixes
      - Resolves
      - Closes
    custom_validation: object            # hooks reference
  
  # Changelog configuration
  changelog:
    enabled: boolean
    required_for_types:                  # feat, fix → require entry
      - feat
      - fix
    optional_for_types:                  # docs, chore → optional
      - docs
      - chore
    format: string                       # markdown format
  
  # Feedback tracking
  feedback_tracking:
    enabled: boolean
    template_path: string                # FEEDBACK_RESPONSE.md
  
  # Mergify integration
  mergify:
    enabled: boolean
    use_queue: boolean                   # use merge queue?
    queue_mode: string                   # sequential | batch
  
  # WordPress-specific options
  wordpress:
    enabled: boolean                     # WordPress repo? (plugin/theme)
    repo_type: string                    # 'plugin' | 'theme' | 'other'
    enable_wordpress_skills: boolean     # enable WordPress-specific logic
    custom_hooks: string                 # path to hooks.js
```

### 3.2 Default Configuration

Located at: `agents/pr-creation-agent/config/defaults.yml`

```yaml
# Default configuration (applies to all repos unless overridden)

pr_agent:
  base_branch: develop
  is_monorepo: false
  templates_path: .github/PULL_REQUEST_TEMPLATE
  canonical_labels_path: .github/labels.yml
  changelog_file: CHANGELOG.md
  
  branch_validation:
    enabled: true
    allowed_types:
      - feat
      - fix
      - docs
      - chore
      - ci
      - refactor
      - test
      - perf
      - hotfix
      - release
  
  labels:
    required_type_prefixes:
      - type
    optional_prefixes:
      - area
      - priority
    infer_from_files: true
  
  issue_linking:
    required: true
    allowed_verbs:
      - Resolves
      - Closes
      - Fixes
  
  changelog:
    enabled: true
    required_for_types:
      - feat
      - fix
    optional_for_types:
      - docs
      - chore
    format: markdown
  
  feedback_tracking:
    enabled: true
    template_path: .github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md
  
  mergify:
    enabled: true
    use_queue: true
    queue_mode: sequential
  
  wordpress:
    enabled: false
    repo_type: other
    enable_wordpress_skills: false
```

---

## 4. WORDPRESS COMPATIBILITY SPECIFICATION

### 4.1 Single Agent, Configuration-Driven Approach

Instead of separate agents:

- **One agent codebase** (portable, maintainable)
- **Per-repo configuration** (GitHub vs WordPress plugin vs WordPress theme)
- **Optional WordPress skills** (enabled via config)
- **Custom hooks** for WordPress-specific logic

### 4.2 Configuration Differences by Repo Type

#### GitHub Control Plane

```yaml
pr_agent:
  base_branch: develop
  templates_path: .github/PULL_REQUEST_TEMPLATE
  changelog_file: CHANGELOG.md
  mergify:
    enabled: true
    use_queue: true
  wordpress:
    enabled: false
```

#### WordPress Plugin Repository

```yaml
pr_agent:
  base_branch: develop
  templates_path: .github/PULL_REQUEST_TEMPLATE
  changelog_file: CHANGELOG.md
  issue_linking:
    required: true
  mergify:
    enabled: false                       # WordPress repos don't use Mergify
  wordpress:
    enabled: true
    repo_type: plugin
    enable_wordpress_skills: true
    custom_hooks: .claude/pr-agent-wordpress-hooks.js
```

#### WordPress Theme Repository

```yaml
pr_agent:
  base_branch: develop
  templates_path: .github/PULL_REQUEST_TEMPLATE
  changelog_file: CHANGELOG.md
  wordpress:
    enabled: true
    repo_type: theme
    enable_wordpress_skills: true
```

### 4.3 WordPress-Specific Skills (Optional)

Enabled via `enable_wordpress_skills: true`:

1. **validate-wordpress-coding-standards**
   - Check WPCS compliance
   - Validate plugin/theme structure

2. **validate-wordpress-version-compatibility**
   - Check minimum WordPress version
   - Validate PHP version requirements

3. **wordpress-changelog-format**
   - Validate changelog follows WordPress format
   - Support for plugin/theme specific entries

---

## 5. TEST STRATEGY SPECIFICATION

### 5.1 Test Coverage Goals

| Component | Target | Approach |
|-----------|--------|----------|
| **Unit Tests** | 95%+ | Skills, orchestrator, config loading |
| **Integration Tests** | 80%+ | Agent workflows with mock GitHub |
| **E2E Tests** | Key workflows | Real GitHub API + test repos |
| **Overall Coverage** | 95%+ | Combined across all types |

### 5.2 Test Structure

```
.github/projects/active/pr-creation-agent-phase-2-2026-08-12/
└── test-plan/
    ├── UNIT_TESTS.md                   # Unit test specifications
    ├── INTEGRATION_TESTS.md             # Integration test specifications
    ├── E2E_TESTS.md                     # End-to-end workflow tests
    ├── TEST_DATA.md                     # Test fixtures & data
    ├── MOCK_GITHUB_API.md               # Mock GitHub API specification
    └── COVERAGE_REPORT.md               # Expected coverage breakdown
```

### 5.3 Test Categories

#### Unit Tests (95%+ coverage)

- **Skill unit tests** (each skill independently)
  - validate-branch-name: 10+ test cases
  - route-pr-template: 8+ test cases
  - validate-and-apply-labels: 12+ test cases
  - enforce-issue-linking: 10+ test cases
  - draft-pr-description: 15+ test cases
  - create-pr: 8+ test cases

- **Orchestrator tests**
  - Configuration loading: 10+ test cases
  - State machine transitions: 12+ test cases
  - Error handling: 8+ test cases

- **Configuration tests**
  - Schema validation: 10+ test cases
  - Default loading: 5+ test cases
  - Custom hooks: 8+ test cases

#### Integration Tests (80%+ coverage)

- **Workflow tests** (mock GitHub API)
  - Complete PR creation workflow
  - Branch validation + template routing + labels + description
  - Error recovery workflows
  - WordPress-specific workflows

- **Configuration integration**
  - Per-repo config loading
  - Template resolution
  - Label inference

#### E2E Tests (Key Workflows)

- **Real GitHub API tests** (against test repositories)
  - Create branch → commit → push → create PR
  - Apply labels → link issues → add feedback
  - Mergify queue integration (GitHub control plane only)

### 5.4 Mock GitHub API

Mock API endpoints needed:

- `GET /repos/{owner}/{repo}/contents/{path}` (template loading)
- `GET /repos/{owner}/{repo}/labels` (canonical labels)
- `GET /issues/{number}` (issue validation)
- `POST /repos/{owner}/{repo}/pulls` (PR creation)
- `PATCH /repos/{owner}/{repo}/pulls/{pr_number}/labels` (label application)

---

## 6. DOCUMENTATION SPECIFICATION

### 6.1 Documentation Deliverables

| Document | Purpose | Audience |
|----------|---------|----------|
| **API_REFERENCE.md** | Skill interfaces & contracts | Developers (Phase 3) |
| **DEPLOYMENT_GUIDE.md** | Install in each repo type | DevOps/Maintainers |
| **CONFIGURATION_GUIDE.md** | Configure per repo | Repository maintainers |
| **TROUBLESHOOTING.md** | Common issues & solutions | Users & maintainers |
| **ARCHITECTURE.md** | System design with Mermaid | Architects & reviewers |

### 6.2 Mermaid Diagrams (Required)

1. **Agent Workflow Diagram** (state machine)

   ```
   Input → Validate Branch → Route Template → Apply Labels → 
   Enforce Issues → Draft Description → Create PR → Output
   ```

2. **Skill Integration Diagram** (orchestrator pattern)

   ```
   Main Orchestrator
   ├── validate-branch-name
   ├── route-pr-template
   ├── validate-and-apply-labels
   ├── enforce-issue-linking
   ├── draft-pr-description
   └── create-pr
   ```

3. **Configuration Hierarchy** (per-repo loading)

   ```
   Defaults (agent/config/defaults.yml)
   ↓ Overridden by
   Repo Config (.claude/pr-agent.config.yml)
   ↓ Extended by
   Custom Hooks (.claude/pr-agent-hooks.js)
   ```

4. **WordPress Compatibility Matrix** (repo type variations)

---

## 7. DEPLOYMENT SPECIFICATION

### 7.1 Target Repositories (MVP Phase)

**High Priority (Rollout Week 1):**

1. lightspeedwp/.github (GitHub control plane)
2. lightspeedwp/wordpress-plugin-a (plugin example)
3. lightspeedwp/wordpress-theme-b (theme example)

**Medium Priority (Rollout Week 2):**
4–8. Additional WordPress plugins (5 repos)

**Lower Priority (Rollout Week 3):**
9–12. Additional WordPress themes (4 repos)

### 7.2 Installation Checklist

For each target repository:

- [ ] Copy agent to `agents/pr-creation-agent/`
- [ ] Create `.claude/pr-agent.config.yml` with repo-specific config
- [ ] Validate configuration against schema
- [ ] Test in dry-run mode
- [ ] Train team on new agent
- [ ] Enable in CI/CD workflows
- [ ] Monitor first 10 PRs

---

## 8. PHASE 2 DELIVERABLES

### Documentation Files (Phase 2)

- ✅ **README.md** (this project folder overview)
- 📝 **OPENSPEC.md** (this document)
- 📝 **ARCHITECTURE.md** (detailed architecture with Mermaid)
- 📝 **TEST_STRATEGY.md** (complete testing plan)
- 📝 **DOCUMENTATION_PLAN.md** (documentation strategy)
- 📝 **WORDPRESS_COMPATIBILITY.md** (WordPress analysis)
- 📝 **DEPLOYMENT_PLAN.md** (rollout schedule)

### Documentation Only

- No code files
- No dependencies (no package.json)
- No implementation
- All in `.github/projects/active/pr-creation-agent-phase-2-2026-08-12/`

---

## 9. SUCCESS CRITERIA

- ✅ Complete agent architecture specified
- ✅ All 6 skill interfaces fully specified with contracts
- ✅ Configuration schema documented
- ✅ Test strategy with 95%+ coverage plan
- ✅ WordPress compatibility analysis complete
- ✅ Deployment plan for 12 target repos
- ✅ Architecture diagrams (Mermaid) included
- ✅ Documentation templates ready for Phase 3

---

## 10. NEXT PHASE (Phase 3)

**Phase 3: Implementation & Validation** (2026-08-20 → 2026-09-02)

Deliverables:

- Multi-file agent implementation
- 6 skill implementations
- Test suite (95%+ coverage)
- Configuration loader
- Integration with existing systems

---

**Phase 2 Specification Complete**

Next: Architecture & Documentation Details
