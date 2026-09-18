# Contract: Path Pattern Priority & Specificity Rules

**Phase 1 Design Deliverable** | **Date**: 2026-09-17 | **For**: Code Review Instructions (FR-014, SC-012)

---

## Overview

This contract defines the priority/specificity ordering rules for path patterns in CodeRabbit configuration. When multiple patterns match the same file, these rules determine which instruction block applies.

---

## Priority Scale

**Scale**: 1-100 (higher number = higher priority/more specific)

| Priority Range | Category | Examples | Pattern Type |
|---|---|---|---|
| 90-100 | Exact paths / Most specific | `.specify/spec.md`, `.github/AGENTS.md` | Exact file paths |
| 70-89 | Specific directories | `.specify/`, `.github/instructions/`, `plugins/*/SKILL.md` | Directory patterns with 3+ segments |
| 50-69 | File type in directory | `**/.github/workflows/*.yml`, `**/e2e/*.spec.ts` | Type-in-directory patterns |
| 30-49 | General file types | `**/*.md`, `**/*.{ts,js}`, `**/package.json` | General glob patterns |
| 10-29 | Generic patterns | `**/*.yaml`, `**/*.config.*` | Broad patterns |
| 1-10 | Catch-all / Lowest priority | `**/*` | Universal fallback |

---

## Specificity Rules

**Rule 1: Exact Paths > Specific Directories > File Types > Generic Patterns**

```
Example: File `.github/workflows/ci.yml` matches multiple patterns:

1. (priority 95) `.github/workflows/ci.yml`          ← WINS (exact match)
2. (priority 80) `.github/workflows/*.yml`           ← Would be second choice
3. (priority 50) `**/.github/workflows/*.yml`        ← Would be third choice
4. (priority 30) `**/*.yml`                          ← Would be fourth choice
5. (priority 10) `**/*`                              ← Would be fallback
```

**Rule 2: More Path Segments = Higher Priority**

```
Patterns for `plugins/my-plugin/SKILL.md`:

1. (priority 85) `plugins/*/SKILL.md`                ← WINS (3 segments)
2. (priority 50) `plugins/**/*.md`                   ← Would be second (glob but specific)
3. (priority 30) `**/*.md`                           ← Would be third (general)
4. (priority 10) `**/*`                              ← Would be fallback
```

**Rule 3: Glob Specificity (**, *, exact, [...])**

Specificity from highest to lowest:

1. Exact matches (e.g., `README.md`)
2. Character/bracket patterns (e.g., `*.{ts,js}` before `*.*`)
3. Single-level glob (`*`)
4. Multi-level glob (`**`)

```
Patterns for `src/utils/helpers.ts`:

1. (priority 80) `src/utils/helpers.ts`              ← WINS (exact)
2. (priority 70) `src/utils/*.ts`                    ← Would be second (single-level glob)
3. (priority 50) `src/**/*.ts`                       ← Would be third (multi-level glob)
4. (priority 40) `**/*.{ts,js}`                      ← Would be fourth
5. (priority 30) `**/*.ts`                           ← Would be fifth
6. (priority 10) `**/*`                              ← Would be fallback
```

---

## Ordering in Configuration

**Recommendation**: Define patterns from highest to lowest priority (descending order)

```yaml
code_review_rules:
  path_instructions:
    # Priority 90-100: Exact and most specific patterns
    - priority: 95
      paths: [".specify/spec.md", ".specify/plan.md"]
    
    - priority: 90
      paths: [".github/AGENTS.md", ".github/CLAUDE.md"]
    
    # Priority 70-89: Specific directories and deep paths
    - priority: 85
      paths: [".github/workflows/*.yml"]
    
    - priority: 80
      paths: ["plugins/*/SKILL.md"]
    
    # Priority 50-69: File type in directory patterns
    - priority: 65
      paths: [".specify/**/*.md"]
    
    - priority: 60
      paths: ["**/e2e/**/*.spec.ts"]
    
    # Priority 30-49: General file types
    - priority: 50
      paths: ["**/*.{ts,js,php}"]
    
    - priority: 40
      paths: ["**/*.md"]
    
    # Priority 1-10: Catch-all (always last)
    - priority: 10
      paths: ["**/*"]
```

---

## Conflict Resolution Examples

### Example 1: SpecKit Files

```
File: .specify/spec.md

Matching patterns:
- (95) .specify/spec.md                             [WINNER]
- (65) .specify/**/*.md
- (40) **/*.md
- (10) **/*

Result: Priority 95 pattern wins → Specification-specific instructions applied
```

### Example 2: TypeScript Test Files

```
File: src/app.e2e.test.ts

Matching patterns:
- (60) **/e2e/**/*.spec.ts                          [NO MATCH - wrong filename]
- (60) **/tests/**/*.ts                             [NO MATCH - wrong directory]
- (50) **/*.{ts,js,php}                             [WINNER]
- (40) **/*.md                                      [NO MATCH - wrong type]
- (10) **/*

Result: Priority 50 pattern wins → General code review instructions applied
```

### Example 3: GitHub Workflows

```
File: .github/workflows/build.yml

Matching patterns:
- (95) .github/workflows/build.yml                  [NO MATCH - wrong priority]
- (85) .github/workflows/*.yml                      [WINNER]
- (50) **/*.{yml,yaml}                              [Would be second choice]
- (40) **/*.yaml                                    [Would be third choice]
- (10) **/*

Result: Priority 85 pattern wins → Workflow-specific instructions applied
```

---

## CodeRabbit Behavior

**CodeRabbit Implementation** (research findings):

- Processes path_instructions in configuration order
- When a file matches multiple patterns, the first matching pattern's instructions apply
- No cascading or merging of instructions
- If no pattern matches, review proceeds without CodeRabbit-provided instruction context

**Implication for Configuration**:

- Order matters; define patterns from most-specific to most-general
- Explicit priority numbering documents intent and prevents accidental reordering
- Comments explain why certain patterns have priority

---

## Best Practices

**DO**:

- ✅ Define exact paths with priority 90-100
- ✅ Group patterns by specificity (90-100, 70-89, 50-69, 30-49, 1-10)
- ✅ Add comments explaining priority rationale
- ✅ Test configuration with sample files to verify correct pattern matching
- ✅ Review pattern order quarterly (or on config changes)

**DON'T**:

- ❌ Use overlapping priorities (same priority for different specificity levels)
- ❌ Rely on definition order alone; use explicit priority numbers
- ❌ Mix specific and general patterns without clear grouping
- ❌ Assume pattern order is stable if priorities change elsewhere

---

## Testing & Validation

**Validation Checklist** (SC-012):

- [ ] All path patterns have explicit priority (1-100)
- [ ] No duplicate priorities within overlapping path sets
- [ ] Patterns ordered descending by priority (100→1) in config
- [ ] Specificity order documents clear rationale for each priority
- [ ] Test with 10+ sample files to verify correct pattern matching
- [ ] Comments explain priority decisions for non-obvious cases

**Test Procedure**:

1. Select 10-15 files covering all priority ranges
2. For each file, manually determine which pattern(s) should match
3. Verify CodeRabbit applies instructions from highest-priority matching pattern
4. Document results; flag any surprises as config issues

---

## Migration & Maintenance

**When Changing Priorities**:

1. Document rationale for change
2. Test with affected file types
3. Verify no breaking changes to existing code review workflows
4. Update this document with new priority assignments

**When Adding New Patterns**:

1. Assign priority based on specificity (use priority scale above)
2. Ensure no conflicts with existing patterns at same priority
3. Test with sample files matching the new pattern
4. Update configuration comments

---

**Status**: ✅ PRIORITY RULES COMPLETE | Ready for configuration implementation
