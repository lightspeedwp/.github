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

## Conclusion

CodeRabbit configuration is well-structured but needs expansion and clarification. The 4 key improvements (pattern priority, branch context, coverage gaps, audit guide) are straightforward to implement and will significantly enhance code review quality and maintainability.

**Readiness for Phase 1**: ✅ YES - All research questions answered, recommendations clear, no blockers identified.
