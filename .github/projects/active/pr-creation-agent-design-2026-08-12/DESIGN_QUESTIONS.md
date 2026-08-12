# PR Creation Agent — Design Questions & Best-Practice Answers

## Executive Summary

This document answers 9 critical design questions for a portable PR creation agent. **Recommendations are based on:**

- Your existing agent architecture (35 agents, two-tier structure)
- Strict PR governance in this repo (branching, templates, labels, feedback tracking)
- Portability requirements (reusable across LightSpeed repos)
- Integration patterns observed in existing workflows

---

## Question 1: What Initiates PR Creation?

### Sub-question

What triggers PR creation? Manual user request? Workflow output? Analysis results?

### Recommended Answer

**Primary:** **Workflow output** (agent produces changes, PR agent creates PR)  
**Secondary:** **Manual user request** (user asks agent to create PR for provided changes)  
**Tertiary:** **Programmatic API** (other tools/agents invoke PR creation)

### Rationale

1. **Workflow-Driven** (Primary Use Case)
   - Aligns with your existing automation patterns (label-sync, issue triage, changelog generation)
   - Examples: After linter fixes, documentation generation, changelog updates
   - Agent receives: branch name, changes, PR metadata from upstream workflow
   - This enables full automation pipelines without manual intervention

2. **Manual Request** (Secondary)
   - Developer says: "Create a PR for these changes"
   - Agent validates changes, determines branch name, creates PR
   - Useful when developer has completed work in a branch

3. **Programmatic API** (Tertiary)
   - Other agents or tools call: `prCreationAgent.create({ changes, branchName, template, labels })`
   - Enables composition with other agents (code-review agent → PR agent → label enforcement)

### Implementation Pattern

**Input Interface:**

```yaml
trigger:
  type: 'workflow' | 'manual' | 'api'
  branch_name: string       # or auto-generated
  changes: object           # files to commit
  pr_metadata:
    title: string
    template_type: string   # 'feat', 'fix', 'docs', etc.
    labels?: string[]
    related_issues?: string[]
```

### Decision for Agent

**Use all three triggers** — Make the agent flexible enough to accept any input method. Detect trigger type from input shape.

---

## Question 2: What Scope of Changes?

### Sub-question

Single-file changes? Multi-file features? Both? Does the agent decide scope?

### Recommended Answer

**Support both single-file and multi-file changes.** Agent adapts PR composition based on scope.

### Rationale

1. **Single-File Changes** (20% of use cases)
   - Documentation updates
   - Config changes
   - Changelog entries
   - Simple bug fixes
   - **PR Composition:** Minimal description, focus on link to issue

2. **Multi-File Changes** (70% of use cases)
   - Feature implementation
   - Refactoring across modules
   - Breaking changes
   - Cross-system updates
   - **PR Composition:** Detailed description, breaking change notes, migration guides

3. **Complex, Multi-System Changes** (10% of use cases)
   - Architecture changes
   - Major version bumps
   - Cross-repo updates
   - **PR Composition:** Comprehensive description, design document reference, affected teams

### Agent Decision Logic

```
if (changedFiles.length === 1 && changedFiles[0].isDoc) {
  scope = 'single-file-docs'
  prTemplate = 'minimal'
} else if (changedFiles.length <= 5 && changeSize < 500 lines) {
  scope = 'small-multi-file'
  prTemplate = 'standard'
} else {
  scope = 'large-multi-system'
  prTemplate = 'comprehensive'
}
```

### Implementation Pattern

**Agent adapts template choice, description depth, and checklist items based on scope detection.**

---

## Question 3: Autonomy Level?

### Sub-question

Just create PR? Create + commit? Full pipeline: write → commit → PR → validate → request review?

### Recommended Answer

**Level 2 — Create PR + Auto-Commit** (Recommended for MVP)

Level 2 is the right balance between automation and safety. Here's why:

### Three Autonomy Levels Analysed

| Level | Scope | Best For | Risk | Recommended? |
|-------|-------|----------|------|--------------|
| **Level 1: Create PR Only** | Create PR on existing branch | Manual workflows | High trust needed | ✅ **Safe** |
| **Level 2: Create + Commit** | Write files → Commit → Create PR | Automated pipelines | Medium, gated | ✅ **Recommended** |
| **Level 3: Full Pipeline** | Write → Commit → PR → Validate → Review | End-to-end automation | High, needs safeguards | ⚠️ **Future** |

### Why Level 2

1. **Safety First**
   - Commit is signed and tied to agent identity
   - Branch history is clean and auditable
   - Validation workflows run before merge (not bypassed)
   - Human still reviews PR before merge

2. **Automation Efficiency**
   - No manual "push to branch" step needed
   - Integrates seamlessly with CI/CD pipelines
   - Reduced friction for generated content (docs, changelog, code-generation outputs)

3. **Audit Trail**
   - Every commit has agent signature
   - Git blame shows agent actions
   - Easy to trace changes back to automation pipeline

4. **Governance Compliance**
   - Your branch protection rules still enforce: all PRs need approval
   - Your Mergify sequential queue still enforces: checks re-run on rebase
   - Your templates and labels still required

### Implementation Pattern

**Level 2 Flow:**

```
Input: { branchName, files, commitMessage, prMetadata }
  ↓
1. Create branch (if needed)
2. Write files to branch
3. Commit with agent signature: "Co-Authored-By: PR Agent <bot@lightspeed>"
4. Push to origin
5. Create PR with template, labels, linked issues
6. Return PR URL to workflow/caller
  ↓
Output: { prUrl, branchName, commitSha }
```

### Future: Level 3 (Post-MVP)

Once the agent is stable and has 3+ repos using it, consider Level 3:

- Auto-request review from specific teams
- Auto-apply labels based on content analysis
- Auto-merge if: trivial change + tests pass + team approval

**But Level 2 is the sweet spot for initial rollout.**

---

## Question 4: Integration with Existing Systems?

### Sub-question

Which systems must it integrate with? Branch naming, templates, labels, issue linking, feedback tracking, Mergify?

### Recommended Answer

**All of them.** Integrate with the full governance stack:

| System | Integration Point | Required? | How |
|--------|-------------------|-----------|-----|
| **Branch Naming** | Validate branch name matches `{type}/{scope}-{short-title}` | ✅ Yes | Use `npm run validate:branch-name` before creating branch |
| **PR Templates** | Route to correct template based on branch type | ✅ Yes | Check `.github/PULL_REQUEST_TEMPLATE/config.yml` and route to `pr_${type}.md` |
| **Label Enforcement** | Apply only prefixed labels from `.github/labels.yml` | ✅ Yes | Lookup canonical label set, validate prefixes (e.g., `type:bug`, `area:ci`) |
| **Issue Linking** | Require `Resolves #123` or `Closes #456` in PR description | ✅ Yes | Parse linked issues from input, validate format, embed in PR body |
| **Feedback Tracking** | Copy `FEEDBACK_RESPONSE.md` template if AI feedback addressed | ✅ Conditional | Include if PR contains AI-generated or AI-reviewed changes |
| **Mergify Queue** | Enqueue PR instead of direct merge (for repos using sequential queue) | ✅ Yes | Use `gh pr ready` to add to queue, document in PR comment |
| **Validation Workflows** | Allow template enforcement, AI feedback, and branch policy checks | ✅ Yes | Ensure PR passes all checks before marking ready |

### Integration Implementation Pattern

**Pseudo-code for full integration:**

```javascript
async function createPRWithFullGovernance(input) {
  // 1. Validate branch name
  validateBranchName(input.branchName)
    .orThrow('Branch name must match {type}/{scope}-{short-title}')

  // 2. Determine PR template type from branch
  const templateType = extractTypeFromBranch(input.branchName)  // 'feat', 'fix', 'docs', etc.
  const template = loadTemplate(`pr_${templateType}.md`)

  // 3. Validate and apply labels
  const validLabels = validateLabelsAgainstCanonical(input.labels)
  
  // 4. Validate issue linking
  const linkedIssues = parseLinkedIssues(input.prDescription)
  if (!linkedIssues.length) {
    throw new Error('PR must link to at least one issue (Resolves/Closes)')
  }

  // 5. Compose PR body with template
  const prBody = composeWithTemplate(template, {
    userDescription: input.prDescription,
    linkedIssues,
    scope: detectChangeScope(input.files),
    hasAIFeedback: input.addressesAIFeedback
  })

  // 6. Create PR
  const pr = await gh.pr.create({
    base: 'develop',
    head: input.branchName,
    title: input.prTitle,
    body: prBody,
    labels: validLabels,
    draft: false  // PR should be ready for review
  })

  // 7. Enqueue in Mergify (if repo uses sequential queue)
  if (repoConfig.usesMergifyQueue) {
    await gh.pr.addToMergeQueue(pr.number)
  }

  return pr
}
```

### Configuration for Each Repo

**Each target repo provides config at `.claude/pr-agent.config.yml`:**

```yaml
# .claude/pr-agent.config.yml
pr_agent:
  base_branch: 'develop'
  template_routing: '.github/PULL_REQUEST_TEMPLATE/config.yml'
  canonical_labels: '.github/labels.yml'
  branch_validation:
    enabled: true
    script: 'npm run validate:branch-name'
  mergify:
    enabled: true
    use_queue: true
  issue_linking:
    required: true
    allowed_verbs: ['Resolves', 'Closes', 'Fixes']
  feedback_tracking:
    enabled: true
    template_path: '.github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md'
```

---

## Question 5: What Must Every PR Contain?

### Sub-question

Linked issues? Changelog? Labels? Description sections? Checklists?

### Recommended Answer

**Mandatory fields:**

| Field | Required? | Enforced How | Example |
|-------|-----------|-------------|---------|
| **Linked Issues** | ✅ Yes | PR description must contain `Resolves #123` or `Closes #456` | `Resolves #1771, #1772` |
| **PR Title** | ✅ Yes | Must follow template (under 70 chars, clear intent) | `feat: PR creation agent architecture design` |
| **Description** | ✅ Yes | Must populate template sections (Summary, Changes, Testing) | See template in `pr_${type}.md` |
| **Labels** | ✅ Yes | At least one `type:*` label, optional `area:*` and `priority:*` | `type:feature`, `area:agents`, `priority:normal` |
| **Changelog Entry** | ✅ Conditional | Required if user-facing change, not needed for docs-only | Entry in `CHANGELOG.md` |
| **Feedback Tracking** | ✅ Conditional | Only if PR addresses AI feedback | `FEEDBACK_RESPONSE.md` if applicable |

### Field Details

#### 1. Linked Issues (Mandatory)

**Why:** Establishes traceability and prevents orphan PRs.

**Format:** PR description must include:

```
Resolves #1234
Closes #1235, #1236
```

**Agent Responsibility:**

- Validate issue numbers exist
- Validate PR targets correct branch (develop for features, main for releases)
- Include in PR body automatically

#### 2. PR Title (Mandatory)

**Requirements:**

- 50–70 characters
- Format: `{type}: {description}` (e.g., `feat: PR creation agent design`)
- No period at end
- Clear, scanned by GitHub Insights and release notes

**Agent Responsibility:**

- Trim to 70 chars
- Add prefix based on branch type

#### 3. Description (Mandatory)

**Must include:**

- Summary (1–2 sentences)
- Changes (bulleted list of file groups)
- Testing (how to verify)
- Checklist (DoD from template)

**Agent Responsibility:**

- Populate template fields from input
- Detect scope and adjust depth
- Include breaking changes section if applicable

#### 4. Labels (Mandatory)

**At least:**

- One `type:*` label (`type:feature`, `type:bug`, `type:docs`, etc.)
- Optional: `area:*` labels based on files changed
- Optional: `priority:*` label

**Agent Responsibility:**

- Infer labels from branch type and files changed
- Validate against canonical label set (`.github/labels.yml`)
- Apply programmatically via GitHub API

#### 5. Changelog Entry (Conditional)

**Required if:**

- User-facing change (feature, bug fix, breaking change)
- New documentation for users

**Not required if:**

- Docs-only internal changes
- Maintenance, refactoring, or internal improvements

**Agent Responsibility:**

- Detect if changelog needed based on change type
- Generate entry format: `- {description} (#PR)`
- Append to top of `CHANGELOG.md` under appropriate section

**Format (from `docs/CHANGELOG_FORMAT.md`):**

```markdown
## [Unreleased]

### Added
- PR creation agent architecture design (#1234)

### Fixed
- Bug in label validation (#1235)

### Changed
- Refactored branching strategy docs (#1236)
```

#### 6. Feedback Tracking (Conditional)

**Required if:**

- PR addresses AI-generated feedback from a prior PR review
- Agent itself generated code/docs being committed

**Template:** `FEEDBACK_RESPONSE.md`

**Agent Responsibility:**

- Copy template to repo root if needed
- Populate feedback table with addressed items
- Mark each as `✅ Addressed`, `📋 Deferred`, or `❌ Rejected`

---

## Question 6: Skill Composition?

### Sub-question

Monolithic agent vs. skill-delegating agent? What's the right architecture?

### Recommended Answer

**Skill-Delegating Architecture** with **4–6 core sub-skills**

### Why Not Monolithic

| Aspect | Monolithic | Skill-Delegating |
|--------|-----------|------------------|
| **Complexity** | High (all logic in one agent) | Lower (split across skills) |
| **Reusability** | Low (tightly coupled) | High (skills reuse elsewhere) |
| **Testing** | Harder (many paths) | Easier (test skills independently) |
| **Maintenance** | Fragile (one change breaks others) | Safer (skills isolated) |
| **Observability** | Single log stream | Clear skill execution trace |

### Recommended Skill Set

| Skill | Purpose | Triggered By | Output |
|-------|---------|-------------|--------|
| **validate-branch-name** | Validate branch matches `{type}/{scope}-{short-title}` | Agent at start | Boolean + validation errors |
| **route-pr-template** | Determine correct PR template from branch type | Agent after validation | Template filepath + metadata |
| **validate-and-apply-labels** | Validate labels against canonical set, infer missing labels | Agent after template routing | Validated labels array |
| **draft-pr-description** | Compose PR body with template, linked issues, changelog | Agent after label validation | PR body markdown |
| **enforce-issue-linking** | Validate linked issues exist and are open | Agent before PR creation | Validated issue list |
| **create-pr** | Create PR via GitHub API, handle retries/errors | Agent orchestrator | PR object (URL, number, sha) |

### Agent Orchestration

**Main Agent** (`pr-creation-agent`):

```javascript
async function createPR(input) {
  // Delegate to skills in sequence
  
  1. validateBranchName(input.branchName)
     → skill: validate-branch-name
  
  2. routePRTemplate(input.branchName)
     → skill: route-pr-template
  
  3. validateAndApplyLabels(input.labels, input.files)
     → skill: validate-and-apply-labels
  
  4. enforceIssueLinking(input.linkedIssues)
     → skill: enforce-issue-linking
  
  5. draftPRDescription(template, input.description, changes)
     → skill: draft-pr-description
  
  6. createPR({ branch, title, body, labels })
     → skill: create-pr (or direct GitHub API call)

  return result
}
```

### Skill Reuse Opportunities

**These skills are not PR-specific; they're reusable:**

- ✅ **validate-branch-name** — Used by any workflow that creates branches
- ✅ **route-pr-template** — Used by template-enforcement workflow
- ✅ **validate-and-apply-labels** — Used by label-sync, triage agents
- ✅ **enforce-issue-linking** — Used by PR validation workflows, issue creation
- ⚠️ **draft-pr-description** — PR-specific, but template could be reused
- ⚠️ **create-pr** — GitHub-specific, but patterns reusable

**Recommendation:** Build validate-branch-name, route-pr-template, validate-and-apply-labels as **portable, reusable skills** (in `skills/` root folder). Build draft-pr-description and create-pr as **agent-specific** (in agent folder).

---

## Question 7: Existing Skills to Reuse?

### Sub-question

Are there existing skills that should integrate with this agent? (code-review, commit-push-pr, documentation generation, etc.)

### Recommended Answer

**Integrate with 4 existing skills; create 6 new skills:**

### Existing Skills to Integrate

| Skill | How to Use | Why |
|-------|-----------|-----|
| **code-review** | Optional skill, triggered before PR creation | User can review changes before PR if desired |
| **commit-push-pr** | Reuse the `push` and `create-pr` logic | Don't reinvent git operations |
| **commit** | Reuse commit signing pattern | Maintain consistency with repo standards |
| **figma (if applicable)** | Optional workflow: design→code→PR | For design-driven changes |

### Existing Skills NOT Needed

- ❌ **Documentation generation** — Agent should assume docs already exist; PR agent doesn't write docs
- ❌ **Changelog generation** — Agent composes changelog entry, doesn't auto-generate changelog
- ❌ **Code generation** — Agent assumes code already exists; doesn't generate it

### New Skills to Create (for Agent-Specific Needs)

1. **pr/validate-branch-name** — Branch naming validation
2. **pr/route-pr-template** — Template routing
3. **pr/validate-and-apply-labels** — Label validation and application
4. **pr/enforce-issue-linking** — Issue linking validation
5. **pr/draft-pr-description** — PR body composition
6. **pr/handle-feedback-tracking** — Feedback response template handling

### Integration Pattern

**Main agent can call existing skills for intermediate steps:**

```javascript
// Pseudo-code showing skill composition

async function createPR(input) {
  // Step 1: Validate branch (new skill)
  const branchValid = await skills['pr/validate-branch-name'].run(input.branchName)
  
  // Step 2: Route template (new skill)
  const template = await skills['pr/route-pr-template'].run(input.branchName)
  
  // Step 3: Optional code review (existing skill integration)
  if (input.reviewBefore) {
    const reviewResult = await skills['code-review'].run({
      target: input.branchName,
      effort: 'low'
    })
    // Report findings to user
  }
  
  // Step 4: Apply labels (new skill)
  const labels = await skills['pr/validate-and-apply-labels'].run({
    userLabels: input.labels,
    detectedLabels: inferLabelsFromFiles(input.files)
  })
  
  // Step 5: Enforce issue linking (new skill)
  const issues = await skills['pr/enforce-issue-linking'].run(input.linkedIssues)
  
  // Step 6: Draft description (new skill)
  const prBody = await skills['pr/draft-pr-description'].run({
    template,
    description: input.description,
    linkedIssues: issues,
    changedFiles: input.files
  })
  
  // Step 7: Create PR (use commit-push-pr pattern from existing skill)
  const result = await github.pr.create({
    title: input.title,
    body: prBody,
    labels,
    base: 'develop',
    head: input.branchName
  })
  
  return result
}
```

---

## Question 8: Target Repos?

### Sub-question

Just this .github repo? Other LightSpeedWP projects? External repos?

### Recommended Answer

**Phase 1: LightSpeed internal repos (8–12 repos)**  
**Phase 2+: Extensible to any repo with config**

### Target Repos (MVP)

**High Priority (Rollout Phase 1):**

1. **lightspeedwp/.github** (This repo)
   - Highest governance complexity
   - Good validation ground
   - Bleeds patterns to other repos

2. **lightspeedwp/[wordpress-plugins]** (5–7 repos)
   - Similar branching strategy
   - Benefit from automation
   - Standard PR governance

3. **lightspeedwp/[internal-tools]** (2–3 repos)
   - Applications, automation scripts
   - Less complex than plugins

**Future (Phase 2+):**

- External open-source repos
- Third-party integrations

### Portability Strategy

**Make the agent repo-agnostic through configuration:**

**Repo Config File (`.claude/pr-agent.config.yml`):**

```yaml
# Each target repo provides this config
pr_agent:
  base_branch: 'develop'                    # or 'main' for different repos
  is_monorepo: false                         # true for monorepo, affects labeling
  templates_path: '.github/PULL_REQUEST_TEMPLATE'
  canonical_labels_path: '.github/labels.yml'
  changlog_file: 'CHANGELOG.md'             # or 'CHANGES.md' in some repos
  branch_validation:
    enabled: true
    allowed_types:
      - feat
      - fix
      - docs
      - chore
      - ci
      - refactor
  issue_linking:
    required: true
    allowed_verbs:
      - Resolves
      - Closes
      - Fixes
  changelog:
    required_for_types:
      - feat
      - fix
    optional_for_types:
      - docs
      - chore
```

**Agent Detection Logic:**

```javascript
// Agent loads repo config at startup
const repoConfig = loadYAML('./.claude/pr-agent.config.yml') 
  || loadDefaultConfig()

// Use config throughout
const baseBranch = repoConfig.base_branch  // 'develop' or 'main'
const templates = loadDir(repoConfig.templates_path)
const labels = loadYAML(repoConfig.canonical_labels_path)
```

**This approach enables:**

- ✅ Single agent codebase
- ✅ Per-repo customization
- ✅ Default sensible config for repos without `.claude/pr-agent.config.yml`
- ✅ Easy onboarding (copy config from this repo as template)

---

## Question 9: Repo-Specific Customisation?

### Sub-question

Should each repo provide config for branch rules, templates, labels? How is customisation exposed?

### Recommended Answer

**Two-Level Customisation:**

**Level 1: Configuration File** (`.claude/pr-agent.config.yml`)  
**Level 2: Custom Hooks** (Optional repo-specific logic)

### Level 1: Configuration File

**Every target repo has `.claude/pr-agent.config.yml`** (see Question 8 above).

**This config controls:**

- Base branch (develop, main, release, etc.)
- Template routing rules
- Label validation
- Changelog requirements
- Issue linking rules
- Mergify queue configuration

### Level 2: Custom Hooks (Optional)

**For repos with non-standard needs**, provide hook mechanism:

```javascript
// .claude/pr-agent-hooks.js (optional)
module.exports = {
  
  // Validate branch name (override if repo has custom rules)
  validateBranchName: async (branchName, config) => {
    // Custom validation logic
    return { valid: true, errors: [] }
  },
  
  // Infer labels from files (customize label detection)
  inferLabels: async (files, config) => {
    // Custom label inference
    return ['type:feature', 'area:custom']
  },
  
  // Customize PR description (plugin custom sections)
  customizeDescription: async (body, context) => {
    // Add custom sections to PR body
    return body + '\n## Custom Section\n...'
  },
  
  // Post-creation hook (send to Slack, etc.)
  onPRCreated: async (pr, context) => {
    // Notify teams, update tracking, etc.
  }
}
```

**Agent loads hooks if present:**

```javascript
let hooks = {}
try {
  hooks = require('./.claude/pr-agent-hooks.js')
} catch (e) {
  // No custom hooks, use defaults
}

// Use throughout with fallback to defaults
const branchValid = await (hooks.validateBranchName || defaultValidate)(branch)
```

### Configuration Hierarchy

```
Default Config (in agent)
    ↓ (override with)
.claude/pr-agent.config.yml
    ↓ (extend with)
.claude/pr-agent-hooks.js (optional)
```

### Customisation Examples

**WordPress Plugin Repo (Standard):**

```yaml
# Uses defaults from .claude/pr-agent.config.yml
base_branch: 'develop'
```

**Internal Tool Repo (Different branch strategy):**

```yaml
# Customizes branch strategy
base_branch: 'main'
branch_validation:
  allowed_types:
    - feat
    - fix
    - hotfix  # Additional type for this repo
```

**Monorepo Plugin (Custom labels):**

```yaml
# Customizes label inference for monorepo
is_monorepo: true
label_inference:
  by_file_path:
    'packages/core/': 'area:core'
    'packages/ui/': 'area:ui'
    'packages/api/': 'area:api'
```

**Special Requirements (Uses hooks):**

```javascript
// .claude/pr-agent-hooks.js
onPRCreated: async (pr) => {
  // Notify Slack channel specific to this repo
  await slack.notify('#product-releases', `PR: ${pr.html_url}`)
  
  // Auto-assign to team
  await github.issues.addAssignees(pr.number, ['@team'])
}
```

---

## Summary: Recommended Architecture

### Agent Tier

**Multi-file agent** (not spec-based)

- Complexity requires multiple files (agent.md, orchestrator, skills)
- Reusable skills justify full implementation
- 4–6 portable sub-skills + core agent logic

### Skill Composition

**Skill-delegating architecture:**

- 4 existing skills integrated (code-review, commit-push-pr, commit, figma optional)
- 6 new PR-specific skills (validate-branch, route-template, apply-labels, enforce-issues, draft-description, feedback-tracking)

### Portability

**Configuration-driven with optional hooks:**

- `.claude/pr-agent.config.yml` for repo customization
- `.claude/pr-agent-hooks.js` for repo-specific logic
- Single agent codebase supporting 8–12+ repos

### Autonomy

**Level 2: Create + Commit + PR**

- Agent writes files, commits, pushes, creates PR
- Human reviews PR before merge
- Validation workflows run automatically

### Integration Points

**All governance layers:**

- Branch naming validation
- Template routing
- Label enforcement (prefixed labels)
- Issue linking (Resolves/Closes)
- Feedback tracking (conditional)
- Mergify queue management

---

**Next Step:** Phase 2 will convert these answers into a formal Agent Specification (SPEC.md).
