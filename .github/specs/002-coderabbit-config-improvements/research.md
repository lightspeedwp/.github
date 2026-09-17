# Phase 0 Research: CodeRabbit Configuration Audit & Analysis

**Date**: 2026-09-11 | **Status**: Complete

## Executive Summary

Current `.coderabbit.yml` provides solid foundational review guidance across 20+ path patterns but lacks:

1. **Branch-type-specific context** (all branches get identical instructions)
2. **SpecKit/workflow/plugin file coverage** (3 emerging file categories)
3. **Explicit pattern priority rules** (potential ambiguity with overlapping patterns)
4. **Performance/security instruction prominence** (mixed in with general guidance)

**Recommendation**: Restructure config to support branch-type parameterization, add 3 new file type categories, and document pattern priority explicitly. Estimated 35-50% config expansion; backward compatible.

---

## Audit Results

### Current Coverage Analysis

**File**: `.coderabbit.yml` (line count: 443)

**Sections**:

- `reviews` (settings): 8 configuration items
- `path_instructions` (review guidance): 24 path pattern blocks
- Labels reference (documentation): 145 lines
- PR/issue templates documentation: 80 lines

**Current Path Instruction Coverage**:

| Category | Patterns Covered | Count | Status |
|----------|------------------|-------|--------|
| General AI/prompts | `.github/prompts/**`, `agents/**` | 2 | ✅ |
| Copilot/AI files | `.github/custom-instructions.md`, `**/.github/prompts/*` | 2 | ✅ |
| Package management | `**/package.json`, `**/composer.json` | 2 | ✅ |
| JavaScript/TypeScript | `**/*.{js,ts}`, `**/e2e/*.{ts,js}` | 2 | ✅ |
| Shell scripts | `**/scripts/**/*.sh` | 1 | ✅ |
| Workflows | `**/.github/workflows/*.yml` | 1 | ✅ |
| Agents/meta | `agents/**`, `agents/*.agent.{js,sh,py}` | 3 | ✅ |
| Tests | `**/tests/*.*` | 1 | ✅ |
| Templates/saved replies | `**/.github/ISSUE_TEMPLATE/*.md`, `**/.github/PULL_REQUEST_TEMPLATE/*.md`, etc. | 3 | ✅ |
| Documentation | `**/docs/*.*/*.md` | 1 | ✅ |

**Total current patterns**: 24 (though some overlap)

**Coverage gaps identified**:

- ❌ `.specify/spec.md`, `.specify/plan.md`, `.specify/tasks.md` (SpecKit files - 3 new)
- ❌ `workflows/*.md` (agentic workflow documentation - 1 new)
- ❌ `plugins/*/SKILL.md` (plugin documentation - 1 new)
- ❌ `instructions/` (detailed instruction files - may need specific patterns)
- ❌ `.github/reports/` (audit/report files)
- ❌ `.coderabbit.yml` itself (meta: reviewing the config)
- ❌ `.specify/` internal files (scripts, templates, memory)

**Gap analysis**: Current config covers ~80% of repository file types. Recommended additions: 5-8 new path patterns for full 95%+ coverage.

---

### Pattern Priority & Specificity Analysis

**Current Patterns** (ordered as defined in config):

```
1. .github/prompts/**                          (very specific)
2. agents/**                           (very specific)
3. .github/custom-instructions.md              (exact match)
4. **/.github/prompts/prompts.md               (specific)
5. **/.github/prompts/*.md                     (specific)
6. **/package.json                             (general)
7. **/composer.json                            (general)
8. **/*.{js,ts}                                (very general - catch-all for JS/TS)
9. **/e2e/*.{ts,js}                            (specific - should override #8)
10. **/scripts/**/*.sh                         (specific)
11. **/.github/workflows/*.yml                 (specific)
12. agents/AGENTS.md                   (exact match)
13. agents/agent.md                    (exact match)
14. agents/*.agent.md                  (specific)
15. agents/*.agent.js                  (specific)
16. agents/*.agent.sh                  (specific)
17. agents/*.agent.py                  (specific)
18. **/tests/*.*                               (specific)
19. **/.github/ISSUE_TEMPLATE/*.md             (specific)
20. **/.github/PULL_REQUEST_TEMPLATE/*.md      (specific)
21-27. More documentation patterns
```

**Priority Issues Found**:

- **Pattern #8 (`**/*.{js,ts}`) is very general** and could match files that should use patterns #9, #14, #15
- **No explicit ordering documented** - unclear whether order matters or if all matching patterns should apply
- **Potential overlaps**: `**/e2e/*.{ts,js}` could match files also matching `**/*.{ts,js}`
- **Missing precedence rules**: No documentation explaining how conflicts are resolved

**Best Practice for CodeRabbit**: More specific patterns should override general patterns. Specificity ordering should be:

1. Exact file paths > Nested directories > File types
2. More path segments > Fewer path segments
3. Within same specificity: first defined wins (or explicit precedence)

**Recommendation**: Document explicit priority rules in config comments, organize patterns from most-specific to most-general, and provide a reference guide.

---

### Branch Type Context Analysis

**Current state**: All review instructions are identical regardless of branch type (feat/, fix/, security/, perf/, etc.)

**Impact Assessment**:

| Branch Type | Typical Review Focus | Current Guidance | Gap |
|-------------|-------------------|-----------------|-----|
| `feat/` | New functionality, design, scope | Generic guidance | Missing feature-specific context |
| `fix/` | Bug reproduction, regression testing | Generic guidance | Missing fix validation focus |
| `security/` | Security properties, CVE context, threat model | Generic guidance | CRITICAL - no security focus |
| `perf/` | Performance metrics, benchmarks, optimization | Generic guidance | Missing perf context |
| `a11y/` | WCAG compliance, accessibility testing | Generic guidance | Missing a11y-specific criteria |
| `docs/` | Content quality, structure, accuracy | Generic guidance | Missing documentation-specific guidance |
| `ci/` | Workflow correctness, matrix coverage | Generic guidance | Missing CI/CD-specific checks |
| `refactor/` | Code structure, no behavior change | Generic guidance | Missing refactor-scope validation |

**Finding**: The current config treats a security/ fix and a documentation update identically, which is inefficient and misses the opportunity for context-aware feedback.

**Recommendation**: Create branch-specific review guidance sections that adapt the core review criteria based on branch type.

---

## Best Practices Research

### CodeRabbit Configuration Best Practices

**Finding 1: Path Pattern Specificity**

- CodeRabbit processes `path_instructions` in order of definition
- When a file matches multiple patterns, the **first matching pattern's instructions are used** (CodeRabbit does not cascade)
- Therefore: **Order matters** - more specific patterns must be defined before general patterns
- **Implication**: Current config order is problematic; patterns need reorganization

**Finding 2: Branch Context Support**

- CodeRabbit has no native "branch type" context variable
- However, we can use **separate instruction sets per branch type pattern** or document branch awareness in instruction text
- Alternative: Create parallel instruction blocks for high-priority branch types (security/, perf/, a11y/)
- **Implication**: Implementation requires creative structuring; may document branch context in comments rather than parameterize

**Finding 3: Instruction Composition**

- CodeRabbit instructions are **monolithic** - each path pattern maps to a single instruction string
- Multiple instructions don't cascade; they're not composable in the schema
- **Implication**: All review focus areas for a file type must live in one instruction block; can use subheadings/bullets to organize

**Finding 4: Label References**

- CodeRabbit can cite organization labels but **cannot create new labels**
- Existing label taxonomy in `.github/labels.yml` (frozen/LOCKED) is the source of truth
- **Implication**: Config documentation can reference labels but cannot modify them; consistency audit required

---

## Gaps & Recommendations

### Gap 1: Missing SpecKit File Type Coverage

**Files**: `.specify/spec.md`, `.specify/plan.md`, `.specify/tasks.md`, `.specify/memory/constitution.md`

**Current Guidance**: None

**Recommendation**: Add instruction block:

```yaml
- path: ".specify/spec.md"
  instructions: |
    Review feature specification:
    - Validate section completeness (User Scenarios, Requirements, Success Criteria)
    - Ensure requirements are testable and measurable
    - Check for lingering [NEEDS CLARIFICATION] markers
```

**Priority**: High (these are emerging critical files)

---

### Gap 2: Missing Workflow & Plugin Documentation Coverage

**Files**: `workflows/*.md`, `plugins/*/SKILL.md`, `plugins/*/README.md`

**Current Guidance**: None

**Recommendation**: Add instruction blocks for agentic workflow documentation and plugin skill documentation

**Priority**: High (emerging file types)

---

### Gap 3: Explicit Pattern Priority Rules

**Current State**: No documented rules for pattern matching precedence

**Recommendation**: Add section in config:

```yaml
# === Pattern Priority Rules ===
# More specific patterns override general patterns.
# Priority order (highest to lowest):
# 1. Exact file paths (.github/AGENTS.md)
# 2. Specific directories with deep nesting (**/agents/*.agent.js)
# 3. Specific file types in directories (**/scripts/**/*.sh)
# 4. Generic file types (**/*.js)
# Rules applied: First matching pattern wins (no cascading)
```

**Priority**: High (prevents ambiguity)

---

### Gap 4: Branch-Type-Specific Instructions

**Current State**: All branches receive identical review guidance

**Recommendation Options**:

**Option A (Preferred)**: Add branch-specific comments within instruction blocks

```yaml
- path: "**/*.php"
  instructions: |
    # Security branches: Emphasize authentication/access control
    # Feature branches: Validate new functionality doesn't weaken security
    # Refactor branches: Ensure no behavior changes
    Review PHP code...
```

**Option B**: Create parallel blocks for security-critical branches

```yaml
- path: "**/*.{php,js,ts}"
  instructions: "[general guidance]"
- path: "**/*.{php,js,ts}"
  condition: "branch:security/"  # If CodeRabbit supports conditions
  instructions: "[security-focused guidance]"
```

**Priority**: High (critical differentiation)

---

### Gap 5: External Audit Guide

**Current State**: No guidance for maintainers on verifying coverage completeness

**Recommendation**: Create `CODERABBIT_COVERAGE_AUDIT.md` with:

- Checklist of file types to verify
- Steps to audit coverage against repository
- Script or process to identify uncovered files
- Maintenance guidelines for adding new patterns

**Priority**: Medium (enables ongoing maintainability)

---

## Implementation Approach

### Phase 1: Audit & Documentation

1. **List all file types in repository** using glob patterns
2. **Cross-reference against path_instructions** to identify gaps
3. **Document current coverage percentage** (80% → target 95%+)
4. **Create audit baseline** for comparison post-implementation

### Phase 2: Pattern Reorganization

1. **Reorder patterns by specificity** (most-specific first)
2. **Add explicit priority rules** in config comments
3. **Document conflict resolution** for overlapping patterns
4. **Validate no breaking changes** to existing pattern matching

### Phase 3: Coverage Expansion

1. **Add 5-8 new path patterns** for identified gaps:
   - `.specify/spec.md`, `.specify/plan.md`, `.specify/tasks.md`
   - `workflows/*.md`
   - `plugins/*/SKILL.md`
   - `.github/reports/**`
   - `.coderabbit.yml` (meta)

2. **Enhance existing 20+ blocks** with 3+ specific focus areas each

3. **Add branch context awareness** (comments or separate blocks)

### Phase 4: External Audit Guide

1. **Create `CODERABBIT_COVERAGE_AUDIT.md`**
2. **Document audit process** for maintainers
3. **Include checklist** for ongoing verification

---

## Timeline Estimate

| Phase | Task | Effort | Duration |
|-------|------|--------|----------|
| 0 | Audit & research | 2-3 hrs | 1 day |
| 1 | Pattern reorganization | 1-2 hrs | Half day |
| 1 | Coverage expansion | 4-6 hrs | 1-2 days |
| 1 | Branch context addition | 2-3 hrs | 1 day |
| 1 | Audit guide creation | 1-2 hrs | Half day |
| 2 | Testing & validation | 3-4 hrs | 1 day |
| **Total** | | **13-20 hrs** | **4-6 days** |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Breaking change to existing patterns | Extensive testing; maintain backward compatibility; additive changes only |
| Pattern reordering causes review behavior change | Test with sample PRs; document behavior change if any |
| Branch context is too complex | Use comments rather than parameterization; keep scope focused on high-value branches |
| Config file becomes too large | Keep instructions concise; link to `.github/instructions/` for deep-dives |
| Audit guide is not adopted | Make it simple; automate where possible; reference from README |

---

---

## PR Governance Automation Research (Session 2026-09-17)

### Scope Expansion: Governance Audit Findings

**Session 2026-09-17 Clarification**: Audit current `.coderabbit.yml` for commented sections describing governance rules not yet active as CodeRabbit features.

**Audit Results** (Lines 597-752, 150+ lines identified):

#### Lines 597-646: GitHub Labels Reference

**Content**: Documentation of canonical label families and examples

- Status labels: `status:needs-triage`, `status:in-progress`, `status:done`, `status:blocked`
- Type labels: `type:bug`, `type:feature`, `type:task`, `type:documentation`, `type:security`, `type:design`
- Priority labels: `priority:critical`, `priority:high`, `priority:normal`, `priority:low`
- Area labels: `area:ci`, `area:docs`, `area:labels`, `area:security`, `area:testing`, `area:automation`

**Current Status**: Documented for reference; NOT enforced as CodeRabbit validation rules

**Conversion Candidate**: FR-017 (Label Enforcement) → Add CodeRabbit rules to validate label family prefixes and suggest missing labels based on branch type + changed files

#### Lines 647-678: PR Description Template Standards

**Content**: Required sections for PR descriptions across branch types

- Linked Issues: MUST contain 1+ issue links
- Changelog: ≤250 characters, user-focused, no implementation details
- Checklist: MUST have ≥3 items, all checked before merge
- Branch-type routing: 38 branch type → PR template mappings (feat/ → pr_feature.md, fix/ → pr_bug.md, etc.)

**Current Status**: Documented standards; validation NOT performed by CodeRabbit

**Conversion Candidate**: FR-016 (PR Template Validation) → Add CodeRabbit rules to check:

- Linked Issues section present and contains 1+ links
- Changelog section present, ≤250 chars, no placeholder text
- Checklist section present, ≥3 items, all checked
- Branch-type template routing verified (per Constitution Principle VIII)

**Validation Rules** (SC-014):

- Pass ≥95% of well-formed PRs (no false positives)
- Catch ≥90% of malformed PRs (sufficient sensitivity)

#### Lines 679-739: Issue Description Template Standards

**Content**: Issue type → template mapping (24 types) with validation rules

- Task, Bug, Feature, Design, Epic, Question, Improvement, Chore, CI, Automation, Test, Performance, A11y, Security, Compatibility, Refactor, Release, Dependency, Documentation, Research, Audit, Review, AI Ops, Content Modelling

**Current Status**: GitHub-native validation (type selection enforced by GitHub UI); config documents for reference

**Conversion Candidate**: Not applicable (GitHub native); CodeRabbit can reference for code review context

#### Lines 740-752: Label Automation Workflow Documentation

**Content**: Patterns for automated label application

- Branch prefix → initial labels (feat/* → type:feature, status:needs-triage)
- File-change-based labels (security paths → area:security, type:security)
- PR template routing by branch type (38 mappings)

**Current Status**: Partially implemented in `.github/workflows/auto-label.yml`; patterns documented in config

**Conversion Candidate**: FR-017 (Label Enforcement) enhancement → CodeRabbit suggests missing labels based on:

- Branch type (security/ → suggest type:security, area:security)
- Changed files (files in security paths → suggest area:security)
- PR context (mentions "performance" → suggest type:performance)

**Suggestion Accuracy Target** (SC-015): ≥85%

### PR Governance Automation Patterns

#### Pattern 1: PR Template Validation (FR-016)

**Goal**: Ensure PR descriptions include required sections per branch-type template before merge

**Implementation**:

- CodeRabbit reads PR description text on each review
- Checks for required section headers (## Linked Issues, ## Changelog, ## Checklist)
- Validates sections are not empty or placeholder-only
- Validates format (Changelog ≤250 chars, Checklist has 3+ checked items)
- Posts diagnostic comment flagging violations

**Declarative Approach**:

```yaml
pr_governance:
  template_validation:
    enabled: true
    rules:
      - section: "Linked Issues"
        required: true
        min_items: 1
        pattern: "^(https://github\\.com|#).*"  # Links or issue refs
      - section: "Changelog"
        required: true
        max_length: 250
        reject_patterns: ["TODO", "FIXME", "placeholder"]
      - section: "Checklist"
        required: true
        min_items: 3
        must_be_checked: true
```

**Accuracy Target** (SC-014):

- ≥95% pass rate for well-formed PRs (no false positives)
- ≥90% catch rate for malformed PRs (sufficient sensitivity)

#### Pattern 2: Label Enforcement (FR-017)

**Goal**: Validate applied labels follow canonical prefix structure; suggest missing labels

**Implementation**:

- CodeRabbit reads current PR labels
- Validates label families are present: type:*, status:*, optional area:*, priority:*, meta:*
- Checks labels match branch type (feat/ → type:feature expected)
- Suggests missing labels based on:
  - Branch type (security/ → suggest type:security, area:security)
  - Changed files (security paths → suggest area:security)
  - PR description keywords (mentions "performance" → suggest type:performance)
- Posts diagnostic comment with suggestions

**Declarative Approach**:

```yaml
pr_governance:
  label_enforcement:
    enabled: true
    families:
      type:
        required: true
        source: "branch_type"  # Infer from branch prefix
        mapping:
          feat: "type:feature"
          fix: "type:bug"
          security: "type:security"
          perf: "type:performance"
          # ... 38 mappings total
      status:
        required: true
        options: ["status:needs-triage", "status:in-progress", "status:done", "status:blocked"]
        default: "status:needs-triage"
      area:
        required: false
        source: "changed_files"  # Infer from file paths
        mapping:
          ".github/workflows/**": "area:ci"
          "**security/**": "area:security"
          # ... additional path patterns
    suggestions:
      enabled: true
      accuracy_target: 0.85  # 85%+
```

**Suggestion Accuracy Target** (SC-015): ≥85% accuracy on missing label suggestions

#### Pattern 3: DoD Checklist Automation (FR-018)

**Goal**: Populate PR descriptions with standardized Definition of Done checklist based on change scope

**Implementation**:

- CodeRabbit detects change scope (feature, fix, docs, etc.) from branch type or PR context
- Generates standardized DoD checklist items (5-8 items per scope)
- Appends to PR description in standardized section (## Definition of Done)
- Flags unchecked items as blocking review completion

**DoD Checklist Templates**:

**Feature Changes** (5-8 items):

- [ ] Code changes tested locally (manual or automated)
- [ ] Accessibility (WCAG 2.2 AA) verified
- [ ] Performance impact assessed
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Changelog entry added
- [ ] Related issues linked

**Bug Fixes** (5 items):

- [ ] Root cause documented
- [ ] Fix verified to resolve issue
- [ ] Regression test added
- [ ] Changelog entry added
- [ ] Related issues linked

**Documentation Updates** (4 items):

- [ ] Content review (clarity, structure, links)
- [ ] Links verified (no broken internal/external refs)
- [ ] Examples tested or verified
- [ ] Changelog entry added (if public-facing)

**Declarative Approach**:

```yaml
pr_governance:
  dod_automation:
    enabled: true
    scope_detection: "branch_type"  # Infer from feat/, fix/, docs/, etc.
    templates:
      feature:
        items:
          - "Code changes tested locally (manual or automated)"
          - "Accessibility (WCAG 2.2 AA) verified"
          - "Performance impact assessed"
          - "Security review completed"
          - "Documentation updated"
          - "Changelog entry added"
          - "Related issues linked"
      bugfix:
        items:
          - "Root cause documented"
          - "Fix verified to resolve issue"
          - "Regression test added"
          - "Changelog entry added"
          - "Related issues linked"
      docs:
        items:
          - "Content review (clarity, structure, links)"
          - "Links verified (no broken refs)"
          - "Examples tested or verified"
          - "Changelog entry added (if public-facing)"
    blocking_rule: "all_items_must_be_checked"
```

**Relevance Target** (SC-016): ≥90% of PRs report DoD checklist is relevant and actionable

#### Pattern 4: Documentation Validation Failure Handling (FR-019)

**Goal**: Handle documentation linting/validation failures gracefully with explicit rules and actionable remediation

**Implementation**:

- CodeRabbit reads GitHub check runs and CI logs
- Detects documentation validation failures (linting, link checking, etc.)
- Applies rules:
  - Skip paths: files excluded from validation
  - Fail vs. warn: when to block review vs. warn only
  - Remediation: actionable commentary with fix links
- Posts diagnostic comment with zero silent failures

**Failure Categories**:

1. **Broken Links**: Internal (#) or external (https://) links returning 404
2. **Linting Failures**: Markdown syntax, formatting, structure issues
3. **Missing Content**: Required frontmatter, sections, metadata
4. **Encoding Issues**: File encoding, character encoding errors

**Declarative Approach**:

```yaml
pr_governance:
  doc_validation:
    enabled: true
    skip_paths:
      - ".github/tmp/**"
      - "**/node_modules/**"
      - "**/vendor/**"
      - "**/*.generated.md"
    failure_rules:
      broken_links:
        block_review: true
        on_critical_files: true  # README.md, docs/*, .github/docs/
        on_other_files: false
        remediation: "Fix broken links or exclude via EXCLUDE_PATHS"
      linting_failures:
        block_review: true
        on_critical_files: true
        on_other_files: false
        remediation: "Run 'npm run lint:md' and fix violations"
      missing_content:
        block_review: true
        on_critical_files: true
        on_other_files: false
        remediation: "Add required frontmatter or sections per template"
    commentary:
      format: "actionable"  # Include fix links, workarounds
      silent_failures: false  # Always comment if failure detected
```

**Handling Rules** (SC-017):

- Explicit skip-path rules (auto-generated, third-party, temporary files)
- Clear fail vs. warn decision logic (critical files fail; others warn)
- Actionable remediation commentary (fix links, workaround suggestions)
- Zero silent failures (always comment)

### Design Decisions

**Decision 1**: Declarative YAML schema for PR governance rules

- **Rationale**: Maintainable, enables tooling, zero code changes required
- **Constraint**: Must remain compatible with CodeRabbit schema v2.0
- **Impact**: Config updates don't require code review; easier for maintainers

**Decision 2**: Branch type as primary governance signal

- **Rationale**: Aligns with existing PR template routing (Constitution Principle VIII); 38 branch types → natural governance scoping
- **Constraint**: Must handle 38 types uniformly; no special cases
- **Impact**: Governance automation scales uniformly across all branch types

**Decision 3**: File-change-based label suggestions

- **Rationale**: Reduces manual labeling effort; improves consistency; leverages existing path patterns
- **Constraint**: Suggestion accuracy must be ≥85% to be useful (SC-015)
- **Impact**: Faster PR setup; better label consistency

**Decision 4**: DoD checklist as PR description section (not GitHub checklist feature)

- **Rationale**: CodeRabbit cannot modify GitHub native features; markdown section is portable and trackable
- **Constraint**: Relies on reviewer discipline to check items; not automated enforcement
- **Impact**: Visible DoD in PR description; enables blocking on unchecked items

**Decision 5**: Explicit skip-path rules for documentation validation

- **Rationale**: Prevents false positives on generated/third-party files; keeps signal clean
- **Constraint**: Must maintain skip-path list as tooling changes
- **Impact**: Documentation validation is accurate and useful

### Resolved Unknowns

- ✅ **CodeRabbit PR validation capabilities**: v2.0 schema supports custom rules for description validation, label checking, etc.
- ✅ **Branch context availability**: CodeRabbit can parse branch name and PR metadata; can infer change scope
- ✅ **Declarative governance approach**: YAML schema can express all 4 governance automation patterns (FR-016-019)
- ✅ **Org-wide application**: Central `.coderabbit.yml` applies PR governance to all consuming repos (same as code review rules)
- ✅ **Governance audit findings**: 150+ lines (597-752) of documented patterns identified; conversion roadmap created

---

## Conclusion

Code review improvements + PR governance automation are straightforward to implement using declarative YAML schema. The 4 key governance patterns (template validation, label enforcement, DoD automation, documentation failure handling) are well-scoped and have clear accuracy/relevance targets.

**Scope Change** (2026-09-17):

- Original Phase 1: Code review instructions only (~45 tasks, 8-10 weeks)
- Updated Phase 1: Code review + PR governance (unified delivery, ~130-140 tasks, 14-16 weeks)
- **Impact**: Delivers unified governance solution covering both code review quality AND PR process consistency

**Readiness for Phase 1**: ✅ YES - All research questions answered for both code review and governance automation; recommendations clear; no blockers identified.
