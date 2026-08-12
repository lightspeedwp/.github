# PR Creation Agent — Test Strategy & Coverage Plan

**Phase:** 2 (Specification)  
**Document Type:** Planning & Specification  
**Test Coverage Target:** 95%+ overall  
**Timeline:** Implemented in Phase 3 (2026-08-20 → 2026-09-02)

---

## 1. TEST STRATEGY OVERVIEW

### Goals

- **95%+ unit test coverage** for all skills and core logic
- **Mock GitHub API tests** for agent integration workflows
- **Real GitHub E2E tests** for critical workflows
- **Configuration validation tests** for all config paths
- **WordPress compatibility tests** for plugin/theme repos

### Test Pyramid

```
         /\
        /  \  E2E Tests (Real GitHub API)
       /----\  5-10 key workflows
      /      \
     /        \  Integration Tests (Mock GitHub)
    /----------\ 30-50 workflow combinations
   /          \
  /            \  Unit Tests (Skills & Core)
 /---------------\ 100+ test cases
```

---

## 2. UNIT TEST SPECIFICATIONS

### 2.1 Test Structure

```
Phase 3 Implementation:
agents/pr-creation-agent/
└── tests/
    └── unit/
        ├── skills.test.js               # All 6 skills
        ├── orchestrator.test.js         # Main orchestrator
        ├── config-loader.test.js        # Configuration loading
        └── state-machine.test.js        # State transitions
```

### 2.2 Skill Unit Tests (95%+ each)

#### Skill 1: validate-branch-name (10+ test cases)

| Test Case | Input | Expected Output | Notes |
|-----------|-------|-----------------|-------|
| Valid branch name | `feat/pr-creation-agent` | `{valid: true}` | Standard format |
| Invalid prefix | `feature/something` | `{valid: false, errors: [...]}` | Wrong prefix |
| Invalid format | `feat/with spaces` | `{valid: false, errors: [...]}` | Spaces not allowed |
| Custom allowed types | type list: `[feat, fix]` | Validates against custom list | Config-driven |
| Custom validation hook | hook returns error | `{valid: false}` | Hook integration |
| Too long | 100+ char branch | `{valid: false, errors: [...]}` | Length limit |
| Valid hotfix | `hotfix/critical-bug` | `{valid: true}` | Hotfix type |
| Valid release | `release/v1.0.0` | `{valid: true}` | Release type |
| Empty string | `` | `{valid: false}` | Edge case |
| Special characters | `feat/pr#1234` | `{valid: false}` | Invalid chars |

#### Skill 2: route-pr-template (8+ test cases)

| Test Case | Input | Expected | Notes |
|-----------|-------|----------|-------|
| Feat branch | `feat/something` | `pr_feature.md` | Feature template |
| Fix branch | `fix/bug` | `pr_bug.md` | Bug template |
| Docs branch | `docs/readme` | `pr_docs.md` | Docs template |
| Chore branch | `chore/deps` | `pr_chore.md` | Chore template |
| Custom template routing | config with custom routes | Custom template | Config-driven |
| Missing template file | invalid path | `{error: '...'}` | Error handling |
| Template metadata | `feat/...` | `{path, type, sections, ...}` | Return metadata |
| Config override | custom config | Custom routing | Per-repo config |

#### Skill 3: validate-and-apply-labels (12+ test cases)

| Test Case | Input | Expected | Notes |
|-----------|-------|----------|-------|
| Valid type label | `['type:feature']` | Valid | Prefixed label |
| Invalid label | `['invalid']` | Error | No prefix |
| Type + area | `['type:feat', 'area:ci']` | Valid | Multiple valid |
| Type + priority | `['type:fix', 'priority:high']` | Valid | Multiple prefixes |
| Infer from files | files: `['.github/workflows']` | `area:ci` | Auto-infer |
| Multiple inferred | files from different areas | Multiple labels | Multi-area repo |
| Config validation rules | custom config | Validates against rules | Config-driven |
| Canonical label set | check against `.github/labels.yml` | Only canonical | Validation |
| Custom inference hook | hook returns labels | Applied labels | Hook integration |
| Empty labels | `[]` | Inferred labels | Auto-populate if config |
| Duplicate labels | `['type:feat', 'type:feat']` | Deduplicated | Single entry |
| Invalid prefix | `['badprefix:test']` | Error | Must match schema |

#### Skill 4: enforce-issue-linking (10+ test cases)

| Test Case | Input | Expected | Notes |
|-----------|-------|----------|-------|
| Single issue | `['#1234']` | Valid if issue exists | Standard case |
| Multiple issues | `['#1234', '#1235']` | All valid | Multiple linking |
| Invalid format | `['1234']` | Error | Missing `#` |
| Non-existent issue | `['#9999']` | Error | Issue not found |
| Closed issue | `['#123']` (closed) | Error or warning | Open only? Config |
| Required linking | config: `required: true` | Error if none | Enforce config |
| Optional linking | config: `required: false` | Valid if any | Conditional |
| Custom verbs | `['Closes #123', 'Resolves #234']` | Valid | Verb validation |
| Invalid verb | `['Blocks #123']` | Error | Verb not allowed |
| Custom validation hook | hook returns error | Error | Hook integration |

#### Skill 5: draft-pr-description (15+ test cases)

| Test Case | Input | Expected | Notes |
|-----------|-------|----------|-------|
| Single-file scope | scope: `'single-file'` | Minimal template | Short description |
| Multi-file scope | scope: `'multi-file'` | Standard template | More detail |
| Complex scope | scope: `'complex'` | Comprehensive template | Maximum detail |
| Template sections | all sections populated | Complete PR body | Required sections |
| Linked issues | issues: `['#1234']` | Included in body | Issue references |
| Changelog entry | scope: 'feat', type: 'feat' | Changelog section | Auto-changelog |
| No changelog | scope: 'docs' | No changelog | Conditional |
| Feedback tracking | hasAIFeedback: true | Feedback template | Conditional |
| Custom description | userDescription input | Merged with template | User input |
| Scope detection | infer from file count | Scope detected | Auto-detect |
| Breaking changes | feature with breaking flag | Breaking section | Special section |
| Migration guide | complex change | Migration section | High-complexity feature |
| Code snippets | code examples in input | Code in description | Preserved |
| Links normalization | relative links | Normalized to absolute | Link handling |
| Markdown formatting | markdown content | Preserved | Format preserved |

#### Skill 6: create-pr (8+ test cases)

| Test Case | Input | Expected | Notes |
|-----------|-------|----------|-------|
| Valid PR data | complete PR object | PR created, returns PR object | Success case |
| Missing title | no title | Error | Required field |
| Missing body | no body | Error | Required field |
| Missing branch | no branch | Error | Required field |
| Draft mode | draft: true | PR created as draft | Draft handling |
| Ready mode | draft: false | PR created, ready for review | Ready handling |
| Apply labels | labels array | Labels applied | Label application |
| API rate limit | rate limit hit | Retry or error | Error handling |
| Network error | connection fails | Error with retry logic | Resilience |

### 2.3 Orchestrator Unit Tests (10+ test cases)

| Test Case | Expected Behavior |
|-----------|-------------------|
| Complete workflow | All skills execute in sequence |
| Validation failure | Early exit, error returned |
| State transitions | All states reached correctly |
| Config loading | Configuration loaded and applied |
| Error handling | Errors caught and reported |
| Retry logic | Retries on transient failures |
| Logging | Events logged appropriately |
| Custom hooks | Hooks called at right points |
| Timeout handling | Timeouts managed correctly |
| Concurrent calls | Single instance handles serial calls |

### 2.4 Configuration Tests (10+ test cases)

| Test Case | Input | Expected |
|-----------|-------|----------|
| Load defaults | no config file | Defaults applied |
| Override defaults | repo config provided | Config merges with defaults |
| Schema validation | invalid config | Error with hint |
| Branch types validation | unknown type | Error |
| Label prefixes | valid prefixes | Accepted |
| Missing required fields | incomplete config | Error |
| Custom hooks path | hooks.js provided | Loaded and executed |
| WordPress config | wordpress.enabled: true | WordPress settings applied |
| Monorepo config | is_monorepo: true | Monorepo behavior |
| Per-repo variations | different per repo | Correct config per repo |

---

## 3. INTEGRATION TEST SPECIFICATIONS

### 3.1 Mock GitHub API

Mock endpoints needed:

```javascript
// Mock GitHub API Server
class MockGitHub {
  // Template endpoints
  GET /repos/{owner}/{repo}/contents/{path}   // Load templates
  GET /repos/{owner}/{repo}/labels            // Get canonical labels
  
  // Issue endpoints
  GET /repos/{owner}/{repo}/issues/{number}   // Validate issue exists
  PATCH /repos/{owner}/{repo}/issues/{number} // Update issue
  
  // PR endpoints
  POST /repos/{owner}/{repo}/pulls            // Create PR
  PATCH /repos/{owner}/{repo}/pulls/{pr}      // Update PR
  POST /repos/{owner}/{repo}/pulls/{pr}/labels // Add labels
  
  // Branch endpoints
  GET /repos/{owner}/{repo}/git/refs/heads    // List branches
  POST /repos/{owner}/{repo}/git/refs         // Create branch
}
```

### 3.2 Integration Test Workflows (30–50 scenarios)

#### Workflow 1: Complete PR Creation (Happy Path)

```
Input:
  branchName: 'feat/new-feature'
  files: ['src/agent.js', 'tests/agent.test.js']
  title: 'Add new feature'
  description: 'Feature details...'
  linkedIssues: ['#1234']

Execution Flow:
  1. Validate branch name ✓
  2. Route template (feat → pr_feature.md) ✓
  3. Infer labels from files (area:agents) ✓
  4. Apply user labels ✓
  5. Validate issue #1234 exists ✓
  6. Draft description with template ✓
  7. Create PR with all data ✓

Output:
  PR #1827 created successfully
  All skills executed without error
```

#### Workflow 2: Multi-File Change with Breaking Change

```
Input:
  branchName: 'feat/major-refactor'
  files: [50+ files changed]
  breaking: true
  linkedIssues: ['#1234', '#1235']

Execution Flow:
  1. Validate branch ✓
  2. Route template (complex scope detected) ✓
  3. Infer labels (multiple areas) ✓
  4. Validate both issues ✓
  5. Draft description with breaking change section ✓
  6. Generate changelog entry ✓
  7. Create PR ✓

Assertions:
  - Scope detected as 'complex'
  - Breaking change section included
  - Changelog entry generated
  - Multiple labels applied
  - Both issues linked
```

#### Workflow 3: Validation Error Handling

```
Input:
  branchName: 'invalid-branch-name'  # No prefix/scope

Execution Flow:
  1. Validate branch name ✗ (error)
  2. Stop execution
  3. Return error to user

Output:
  Error: "Branch name must match {type}/{scope}-{short-title}"
  No PR created
```

#### Workflow 4: WordPress Plugin Configuration

```
Input:
  repo: 'lightspeedwp/wordpress-plugin-example'
  config: wordpress: {enabled: true, repo_type: 'plugin'}

Execution Flow:
  1. Load WordPress-specific config ✓
  2. Use WordPress label prefixes ✓
  3. Skip Mergify integration ✓
  4. Validate plugin structure ✓
  5. Use plugin-specific template ✓

Assertions:
  - WordPress settings applied
  - Mergify disabled
  - Plugin validation run
```

#### Workflow 5: Custom Hooks Integration

```
Input:
  custom hooks: .claude/pr-agent-hooks.js

Execution Flow:
  1. Load custom hooks ✓
  2. Call onBeforePRCreate hook ✓
  3. Create PR ✓
  4. Call onAfterPRCreate hook ✓

Assertions:
  - All hooks executed at right time
  - Custom logic applied
  - Original flow not broken
```

---

## 4. END-TO-END TEST SPECIFICATIONS

### 4.1 Test Environment Setup

**Test Repository:**

- GitHub org: `lightspeedwp-test`
- Test repo: `pr-creation-agent-test`
- Test branches: `test/e2e-*`
- Test issues: Pre-created for validation

### 4.2 Key E2E Workflows

#### E2E 1: GitHub Control Plane Workflow

```
1. Create test branch: test/e2e-github-control-plane
2. Create test issue: #9999
3. Run agent:
   - Validate branch
   - Route template (.github/PULL_REQUEST_TEMPLATE/pr_feature.md)
   - Apply labels (type:feature, area:agents)
   - Link issue (#9999)
   - Draft description
   - Create PR
4. Verify in GitHub:
   - PR created with correct title/description
   - Labels applied
   - Issue linked
   - All markdown rendered correctly
5. Cleanup: Delete test branch & PR
```

#### E2E 2: WordPress Plugin Workflow

```
1. Create test branch: test/e2e-plugin
2. Run agent with WordPress config
3. Verify:
   - Plugin-specific template used
   - WordPress labels applied
   - Mergify NOT invoked
   - Plugin structure validated
4. Cleanup
```

#### E2E 3: Multi-Issue Linking

```
1. Create 3 test issues: #9999, #9998, #9997
2. Create branch linking all issues
3. Verify all 3 linked in PR description
4. Verify PR created successfully
5. Cleanup
```

---

## 5. COVERAGE BREAKDOWN

### Expected Coverage by Component

| Component | Target | Method |
|-----------|--------|--------|
| **validate-branch-name** | 95%+ | 10+ unit tests |
| **route-pr-template** | 95%+ | 8+ unit tests |
| **validate-and-apply-labels** | 95%+ | 12+ unit tests |
| **enforce-issue-linking** | 95%+ | 10+ unit tests |
| **draft-pr-description** | 95%+ | 15+ unit tests |
| **create-pr** | 95%+ | 8+ unit tests |
| **Orchestrator** | 95%+ | 10+ unit tests |
| **Config loading** | 95%+ | 10+ unit tests |
| **State machine** | 90%+ | 8+ unit tests |
| **Integration** | 80%+ | 30–50 mock API tests |
| **E2E Workflows** | Key paths | 5–10 real GitHub tests |
| **Overall** | **95%+** | **100+ unit + 50+ integration** |

### Coverage Exclusions

- ❌ External library code (GitHub API client)
- ❌ Test utilities and helpers
- ❌ Generated config files

### Coverage Tools

- **Jest** (unit & integration testing)
- **Istanbul** (coverage reporting)
- **Mock GitHub API** (local mock server)
- **GitHub test organization** (real E2E)

---

## 6. TEST DATA & FIXTURES

### Test Fixtures Needed

1. **Test Templates**
   - pr_feature.md (sample template)
   - pr_bug.md
   - pr_chore.md
   - pr_docs.md

2. **Test Issues**
   - Open issues (#9999, #9998, #9997)
   - Closed issue (#9990)
   - Issues with various labels

3. **Test Branches**
   - Valid feature branch
   - Valid fix branch
   - Invalid branches (test error cases)
   - WordPress-specific branches

4. **Test Labels**
   - Canonical label set
   - Per-repo label sets
   - WordPress-specific labels

5. **Test Configuration Files**
   - GitHub control plane config
   - WordPress plugin config
   - WordPress theme config
   - Invalid configs (test error handling)

---

## 7. CONTINUOUS INTEGRATION

### CI/CD Pipeline (Phase 3)

```
On PR creation/update:
  1. Run unit tests (Jest)
  2. Generate coverage report
  3. Check coverage ≥ 95%
  4. Run integration tests (mock API)
  5. Run linter (ESLint)
  6. Report results
```

### Coverage Gates

- ❌ Merge blocked if coverage < 95%
- ⚠️ Warning if coverage drops from previous
- ✅ Pass if coverage ≥ 95%

---

## 8. PHASE 3 TEST DELIVERY CHECKLIST

- ✅ All unit tests implemented (100+)
- ✅ Integration tests with mock GitHub API (50+)
- ✅ E2E tests against real GitHub (5–10)
- ✅ Coverage reports generated
- ✅ Coverage ≥ 95% overall
- ✅ CI/CD pipeline configured
- ✅ Test documentation complete

---

**Test Strategy Ready for Phase 3 Implementation**
