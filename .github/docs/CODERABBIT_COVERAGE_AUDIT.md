# CodeRabbit Configuration Coverage Audit Guide

**Purpose**: Help maintainers verify that CodeRabbit review instructions cover all critical file types in the repository.

**Last Updated**: 2026-09-17

**Target Audience**: Repository maintainers, DevOps, code review leads

---

## Overview

The `.coderabbit.yml` file contains path-based review instructions organized by file type and category. Coverage audits verify that:

1. **File Type Inventory** (FR-015): All distinct file types in use are catalogued
2. **Coverage Mapping** (FR-015): Each file type has explicit or catch-all instruction blocks
3. **Gap Analysis** (FR-015): Missing file types are identified and prioritized
4. **Priority Verification** (FR-015): Priorities within blocks are unique and follow specificity rules
5. **Focus Area Validation** (FR-015): Each block has 3-4 distinct focus areas for substantive guidance

---

## Part 1: File Type Inventory Procedure

**Objective**: Create a master list of all file types across the organisation repositories.

### Steps

1. **Scan Repository File Types**

Run this command to list all file types currently in the repository:

```bash
find . -type f -not -path '*/\.*' -not -path '*/node_modules/*' -not -path '*/.git/*' | \
  sed 's/.*\.//' | sort | uniq -c | sort -rn | head -30
```

1. **Extract file paths and extensions** from multiple repository types:
   - WordPress plugin repositories (PHP, JS, CSS, YAML, Markdown)
   - Node.js/TypeScript repositories (TS, TSX, JS, JSON, YAML, Markdown)
   - Infrastructure-as-code repositories (Terraform, YAML, Shell, Markdown)
   - CLI tool repositories (Python/Go/Rust, config files, Markdown)
   - MCP server repositories (TypeScript, JSON, Markdown)
   - Documentation repositories (Markdown, YAML frontmatter)

2. **Categorize by type**:
   - Language source files (PHP, JavaScript, TypeScript, Python, etc.)
   - Configuration files (YAML, JSON, TOML, .env*)
   - Documentation (Markdown, reStructuredText)
   - Build/CI/CD (Dockerfile, GitHub Actions, Terraform)
   - Package/Dependency management (package.json, composer.json, requirements.txt)
   - Spec/Template files (.specify/*, templates/*)
   - Infrastructure (Kubernetes, Terraform, CloudFormation)

3. **Create master file type list** and document ownership per file type

---

## Part 2: Coverage Mapping Procedure

**Objective**: Cross-reference each file type against `.coderabbit.yml` instruction blocks.

### Steps

1. **Extract instruction blocks from `.coderabbit.yml`**:

   ```bash
   grep -E '^\s+- path:' .coderabbit.yml | sed 's/.*path: //' | sed 's/ # priority:.*//' | sort
   ```

2. **Map file types to instruction blocks**:
   - **Explicit coverage**: Dedicated instruction block (e.g., `src/**/*.php`)
   - **Fallback coverage**: Category-level block (e.g., `**/*.php`)
   - **Catch-all coverage**: Default `**/*` block with generic guidance
   - Document specificity levels

3. **Record coverage status** for each file type:
   - ✅ **Covered**: Explicit or fallback instruction block exists
   - ⚠️ **Partially covered**: Pattern matches but guidance is generic
   - ❌ **Not covered**: No matching pattern exists

4. **Flag coverage gaps**:
   - Any file type with CATCH-ALL ONLY coverage
   - File types with <3 focus areas
   - High-priority file types (PHP, TypeScript, Documentation) with insufficient specificity

---

## Part 3: Gap Analysis Procedure

**Objective**: Identify missing file types and prioritize new instruction blocks.

### Steps

1. **Compare inventory vs coverage**:
   - List all file types from Part 1 inventory
   - Mark each as: Explicit, Fallback, Catch-All, or Uncovered
   - Flag critical gaps

2. **Assess impact of each gap**:
   - **Critical**: File type appears in >30% of repos → HIGH priority
   - **High**: File type appears in 10-30% of repos → MEDIUM priority
   - **Medium**: File type appears in <10% of repos → LOW priority

3. **Recommend priority order** for new instruction blocks

4. **Estimate effort**: Each new explicit block takes ~1-2 hours (research + writing + testing)

---

## Part 4: Priority Verification Procedure

**Objective**: Validate that priorities are unique and follow specificity rules.

### Steps

1. **Extract priorities from `.coderabbit.yml`**:

   ```bash
   grep -E '# priority:' .coderabbit.yml | sed 's/.*# priority: //' | sort -n
   ```

2. **Check for duplicates**:
   - No two patterns should have identical priority at same specificity level
   - Priorities should decrease with generality (higher number = more specific)

3. **Verify specificity rules**:
   - Explicit/specific patterns (e.g., `src/**/*.ts`) must have HIGHER priority than fallback patterns (e.g., `**/*.ts`)
   - Fallback patterns must have HIGHER priority than catch-all
   - Within same specificity level, no overlaps with identical priority

4. **Document any conflicts** found and recommended fixes

---

## Part 5: Focus Area Validation Procedure

**Objective**: Ensure each instruction block has 3-4 substantive focus areas.

### Steps

1. **Audit focus areas per block**:
   - Count focus area lines (starting with `**` in markdown)
   - Each focus area should have 2-3 checks beneath it

2. **Count focus areas**:
   - **Explicit blocks**: Target 3-4 focus areas
   - **Fallback blocks**: Target 2-3 focus areas
   - **Catch-all**: Acceptable at 2 areas

3. **Flag blocks failing the standard**:
   - Blocks with <2 focus areas
   - Blocks with unclear or vague focus areas
   - Blocks missing critical dimension (security, performance, accessibility)

4. **Document exceptions** with rationale

---

## Part 6: Examples for Diverse Project Types

### Example 1: WordPress Plugin Repository Audit

```
WordPress Plugin Project Structure:
├── src/
│   ├── Block/
│   │   └── **/*.php
│   ├── API/
│   │   └── **/*.php
│   └── Utility/
│       └── **/*.php
├── assets/
│   ├── src/
│   │   ├── **/*.ts
│   │   ├── **/*.tsx
│   │   └── **/*.scss
├── tests/
│   └── **/*.php
└── .github/
    └── workflows/
        └── **/*.yml

Coverage Status:
✓ src/**/*.php → Explicit block (priority 10)
✓ assets/src/**/*.ts → Explicit block (priority 8)
⚠ assets/src/**/*.scss → Fallback block (priority 3)
✓ tests/**/*.php → Fallback block (priority 5)
✓ .github/workflows/** → Explicit block (priority 12)

Gaps Identified:
- SCSS files use fallback (generic CSS guidance) - consider explicit SCSS block for BEM/design system alignment
- Tests use PHP fallback - consider explicit testing block

Recommendation: MEDIUM priority (SCSS adds value; testing explicit guidance improves quality)
```

### Example 2: Node.js/TypeScript Repository Audit

```
Node.js Project Structure:
├── src/
│   ├── **/*.ts
│   └── **/*.tsx
├── tests/
│   └── **/*.test.ts
├── scripts/
│   └── **/*.ts
├── .github/
│   └── workflows/
│       └── **/*.yml
└── docs/
    └── **/*.md

Coverage Status:
✓ src/**/*.ts → Explicit block (priority 8)
✓ src/**/*.tsx → Explicit block (priority 8)
⚠ tests/**/*.test.ts → Fallback block (priority 4)
⚠ scripts/**/*.ts → Fallback block (priority 4)
✓ .github/workflows/** → Explicit block (priority 12)
✓ docs/**/*.md → Explicit block (priority 2)

Gaps Identified:
- Test files use generic TypeScript guidance - would benefit from testing-specific focus areas
- Scripts use generic TypeScript guidance - would benefit from CLI/automation focus areas

Recommendation: HIGH priority (testing guidance improves test quality; script guidance improves reliability)
```

### Example 3: Infrastructure-as-Code Repository Audit

```
IaC Project Structure:
├── terraform/
│   ├── **/*.tf
│   ├── modules/
│   └── **/*.tf
├── kubernetes/
│   ├── manifests/
│   │   └── **/*.yaml
│   └── helm/
│       └── **/*.yaml
├── scripts/
│   └── **/*.sh
└── docs/
    └── **/*.md

Coverage Status:
✓ terraform/**/*.tf → Fallback block (priority 4)
✓ kubernetes/**/*.yaml → Fallback block (priority 3)
✓ scripts/**/*.sh → Fallback block (priority 4)
✓ docs/**/*.md → Explicit block (priority 2)

Gaps Identified:
- Terraform uses fallback only - would benefit from IaC-specific focus areas (state management, resource patterns, compliance)
- Kubernetes YAML uses generic YAML guidance - would benefit from k8s-specific focus areas (security policies, resource limits, health checks)

Recommendation: HIGH priority (IaC specificity improves configuration safety; k8s-specific guidance improves cluster reliability)
```

---

## Part 7: Maintenance Schedule & Trigger Events

### Quarterly Review (Scheduled)

- **Frequency**: Once per quarter (end of Q1, Q2, Q3, Q4)
- **Time**: Run full audit (Parts 1-5) taking ~4-6 hours
- **Output**: Update `.github/docs/coverage_summary.txt` with current status
- **Action**: File issue if gaps identified; assign priority for new blocks

### Triggered Re-Audit (On Demand)

#### When New Repository Type Added

- Trigger: First repository of a new language/platform joins organisation (e.g., first Rust project, first Terraform repository)
- Timeline: Run Part 1 (inventory) + Part 3 (gap analysis) within 2 weeks
- Action: Add explicit blocks for critical new types within 1 month

#### When File Type Frequency Changes

- Trigger: A file type previously at <10% adoption rises to >30% of repos
- Escalation: Move from LOW to HIGH priority in gap queue
- Timeline: Add explicit block within 1 month

#### When User Feedback Indicates Gap

- Trigger: Code reviewer or maintainer reports "CodeRabbit guidance for X isn't relevant to our project"
- Investigation: Run Part 3 (gap analysis) for that file type
- Assessment: Determine if catch-all or fallback coverage is insufficient

### Post-Deployment Checklist (Every Release)

After expanding `.coderabbit.yml` with new blocks, verify:

- [ ] All new blocks have 3-4 focus areas (Part 5)
- [ ] No priority conflicts introduced (Part 4)
- [ ] Coverage map reflects new blocks (Part 2)
- [ ] Examples updated if project types affected (Part 6)
- [ ] Test PR created and feedback verified against new guidance

---

## Part 8: Summary & Reporting

### Coverage Report Template

**File**: `coverage-report.txt` (generate after each audit)

```
CodeRabbit Configuration Coverage Report
==========================================
Generated: [TODAY'S DATE]
Report Type: Quarterly Audit (or event-triggered)

Coverage Statistics:
- Total file types identified: [N]
- Explicit instruction blocks: [N] ([%])
- Fallback instruction blocks: [N] ([%])
- Catch-all coverage only: [N] ([%])
- Overall coverage: [%] ✓ (Target: ≥95%)

File Types by Coverage Level:

EXPLICIT ([N] types - [%]):
- [List 5-10 examples]

FALLBACK ([N] types - [%]):
- [List 5-10 examples]

CATCH-ALL ONLY ([N] types - [%]):
- [List any types with only catch-all coverage]

Priority Verification:
✓ No duplicate priorities
✓ Priorities align with specificity
✓ No pattern overlaps at same priority level

Focus Area Audit:
✓ [X]% of explicit blocks have 3-4 areas
✓ [X]% of fallback blocks have 2-3 areas
✓ Catch-all block: [N] areas ✓ (acceptable)

Critical Gaps:
- [List any gaps identified]

Recommendations:
1. [Priority 1 recommendation]
2. [Priority 2 recommendation]

Next Audit: [DATE + 3 MONTHS]
```

### Coverage Summary Template

**File**: `coverage_summary.txt` (quick reference)

```
CodeRabbit Coverage Summary (Quick Reference)
==============================================
Last Updated: [TODAY'S DATE]

Coverage: [%] ([N] of [N] file types covered; target ≥95%) ✓

Instruction Blocks: [N] total
- Explicit blocks: [N] (tech/project-specific guidance)
- Fallback blocks: [N] (category-level guidance)
- Catch-all block: 1 (generic guidance)

Focus Areas: [N] total across all blocks (avg [X.XX] per block)
- Blocks with 4 areas: [N] ([%])
- Blocks with 3 areas: [N] ([%])
- Blocks with 2 areas: [N] ([%])

Priority Distribution:
- Priorities 10-15: [N] blocks (highest specificity)
- Priorities 5-9: [N] blocks (high specificity)
- Priorities 1-4: [N] blocks (category and catch-all)

Validation Status:
✓ No priority conflicts
✓ No pattern overlaps
✓ All blocks: 2-4 focus areas
✓ Coverage ≥95%

Emerging Types (Tracked):
- [File type 1] → [Status: Covered/Gap]
- [File type 2] → [Status: Covered/Gap]

Action Items:
- [Any outstanding items]
```

---

## Coverage Audit Checklist

Use this checklist to verify CodeRabbit configuration completeness:

### File Type Coverage

- [ ] **Markdown (`.md`)**: Documentation, README, guides
  - Expected pattern: `**/*.md` or more specific paths
  - Risk: Critical for user documentation, accessibility, SEO

- [ ] **YAML (`.yaml`, `.yml`)**: Workflows, configs, CI/CD
  - Expected patterns: `**/.github/workflows/*.yml`, `**/*.yaml`
  - Risk: Workflow failures, CI/CD breakage if misconfigured

- [ ] **JSON (`.json`)**: Configuration, manifests, localization
  - Expected pattern: `**/*.json`
  - Risk: Configuration errors, type safety

- [ ] **JavaScript/TypeScript (`.js`, `.ts`, `.jsx`, `.tsx`)**: Source code
  - Expected pattern: `**/*.{js,ts}`
  - Risk: Core functionality, performance, security

- [ ] **PHP (`.php`)**: WordPress plugins, backend code
  - Expected pattern: `**/*.php` or more specific
  - Risk: Security (input validation, escaping), WordPress standards

- [ ] **Shell Scripts (`.sh`, `.bash`)**: Automation, deployment
  - Expected pattern: `**/scripts/**/*.sh` or `**/*.sh`
  - Risk: POSIX compliance, portability, error handling

- [ ] **CSS/SCSS (`.css`, `.scss`, `.sass`)**: Stylesheets
  - Expected pattern: `**/*.css`, `**/*.scss`, `**/*.sass`
  - Risk: Accessibility (contrast, focus states), responsive design

- [ ] **Test Files (`.test.*`, `.spec.*`)**: Unit/integration tests
  - Expected pattern: `**/tests/*`, `**/*.test.*`, `**/*.spec.*`
  - Risk: Test quality, coverage, reliability

- [ ] **Configuration Files**: `.env`, `.editorconfig`, `.gitignore`
  - Expected pattern: Multiple patterns for different config types
  - Risk: Secret leakage, consistency, environment setup

- [ ] **Package Managers**: `package.json`, `composer.json`, `requirements.txt`, `setup.py`
  - Expected pattern: Multiple patterns per language
  - Risk: Dependency vulnerabilities, version conflicts

- [ ] **SpecKit Files**: `.specify/spec.md`, `.specify/plan.md`, `.specify/tasks.md`
  - Expected pattern: Exact paths with priority 95
  - Risk: Specification quality, planning rigor, task clarity

- [ ] **Workflow Documentation**: `workflows/*.md`
  - Expected pattern: `workflows/*.md` with priority 75
  - Risk: Workflow usability, agent capability documentation

- [ ] **Plugin Documentation**: `plugins/*/SKILL.md`
  - Expected pattern: `plugins/*/SKILL.md` with priority 75
  - Risk: Plugin usability, integration clarity

---

## Coverage Statistics

### Current Configuration (Last Audit: 2026-09-12)

**Baseline Assessment** (from Phase 0 research):

- File types identified: ~50
- File types with specific instructions: 35+
- Coverage target: 95%+ (target: 47-50 types)

**Instruction Block Distribution**:

- Priority 95 (Exact paths): 8 blocks (agents, specs, prompts)
- Priority 90 (Specific directories): 2 blocks (agent infrastructure)
- Priority 88 (Critical configuration): 1 block (custom instructions)
- Priority 85 (Critical automation): 3 blocks (workflows, templates)
- Priority 80 (Tests): 2 blocks (e2e, general tests)
- Priority 75 (Prompts, workflows, plugins): 3 blocks
- Priority 65 (Package managers): 3 blocks
- Priority 60 (Language-specific code): 3 blocks
- Priority 45 (General documentation): 1 block
- Additional configuration/special files: 15+ blocks

**Total instruction blocks**: 40+

**Estimated Coverage**: 85-90% of repository file types

**Gap Analysis** (as of Phase 1):

- Missing patterns: 5-8 identified
- Newly added (Phase 14): 5 patterns (.specify/ files, workflows/, plugins/)
- Remaining gaps: To be identified in next audit

---

## Common Coverage Gaps & Solutions

### Gap 1: Project-Specific File Types

**Example**: Custom `.example`, `.custom`, `.proprietary` files

**Solution**:

1. Identify the purpose of this file type
2. Determine review focus (syntax, structure, security, performance)
3. Add pattern to `.coderabbit.yml`:

   ```yaml
   - path: "**/*.example"
     instructions: |
       Review .example files:
         - Ensure [review focus area 1]...
         - Validate [focus area 2]...
   ```

4. Set priority based on specificity (70-90 for custom types)
5. Test with a sample PR modifying this file type

### Gap 2: Technology-Specific Files

**Example**: Terraform (`.tf`), Kubernetes (`.yaml`), Dockerfile

**Solution**:

1. Add technology-specific pattern
2. Ensure guidance is technology-agnostic (universal principles, not framework-specific)
3. Example for Terraform:

   ```yaml
   - path: "**/*.tf"
     instructions: |
       Review infrastructure-as-code files:
         - Ensure state management practices are documented
         - Validate resource definitions follow security best practices
         - Check for clear, maintainable code structure
   ```

### Gap 3: Nested/Multi-Level Patterns

**Example**: Files deeply nested (e.g., `src/components/*/**.tsx`)

**Solution**:

1. Consider if a more general pattern already covers this
2. Add specific pattern only if it needs distinct review guidance
3. Use priority 70-85 for type-in-directory patterns
4. Document specificity in comments

---

## Maintenance Procedures

### Quarterly Audit (Every 3 Months)

1. Run Step 1-2 above
2. Compare file type list with previous audit
3. Identify new file types added to repository
4. For each new type:
   - Decide if CodeRabbit guidance is needed
   - If yes, add instruction block and test
   - If no, document why (e.g., generated files, auto-excluded)
5. Update this guide with new findings

### Adding New File Type Instruction

**Checklist**:

- [ ] File type identified and prioritized by risk/frequency
- [ ] Instruction block drafted with 3+ review focus areas
- [ ] Technology-agnostic guidance confirmed (no framework-specific details)
- [ ] UK English terminology verified
- [ ] Priority level assigned (1-100 scale)
- [ ] Block added to `.coderabbit.yml` in priority order
- [ ] Test PR created modifying this file type
- [ ] CodeRabbit feedback verified against new guidance
- [ ] Update to this audit guide documented (optional)

**Estimated time**: 5-10 minutes per new instruction block

### Removing Obsolete Instruction

**When to remove**:

- File type no longer used in repository
- Pattern becomes redundant (covered by more specific pattern)
- Pattern conflicts with newer guidance

**Steps**:

1. Confirm file type is truly obsolete (no recent changes)
2. Comment out pattern in `.coderabbit.yml` (don't delete for history)
3. Add note: `# DEPRECATED [date]: [reason]`
4. Test with sample PR to verify fallback behavior
5. Remove comment after 2 quarterly audits (6 months retention)

---

## Priority & Specificity Rules

### Path Pattern Priority Scale (1-100)

| Priority | Type | Example | Use Case |
|----------|------|---------|----------|
| 90-100 | Exact paths | `agents/*.agent.js`, `.specify/spec.md` | Critical files requiring precise guidance |
| 70-89 | Specific directories | `**/.github/workflows/*.yml`, `plugins/*/` | Infrastructure, specialized components |
| 50-69 | Type in directory | `**/*.{js,ts}`, `**/tests/*`, `**/*.md` | Language/type-specific guidance |
| 1-49 | General patterns | `**/*.yaml`, `**/*.json`, docs/** | Catch-all, fallback guidance |

### Resolution Rules

When a file matches multiple patterns:

1. **First matching rule wins**: CodeRabbit applies the first pattern found
2. **Organize by priority**: Place high-priority patterns first in config
3. **Specificity wins**: More specific patterns should have higher priority
4. **Document conflicts**: Add comments explaining priority choices

**Example**:

```yaml
# Priority order: specific test patterns first, then general patterns
- path: "**/e2e/*.spec.ts"        # Priority 85: specific test type
- path: "**/tests/**/*.ts"         # Priority 75: tests directory
- path: "**/*.ts"                  # Priority 60: all TypeScript
```

---

## Validation Checklist

Before committing CodeRabbit config changes:

- [ ] All path patterns are valid glob syntax
- [ ] Priority values are unique or intentionally duplicated
- [ ] No circular or conflicting patterns
- [ ] All patterns match actual files in repository
- [ ] Review guidance is technology-agnostic (no framework specifics)
- [ ] Instruction blocks follow consistent structure (3+ focus areas)
- [ ] UK English terminology throughout
- [ ] WCAG 2.2 AA and accessibility considerations included where relevant
- [ ] No duplication with AGENTS.md or CLAUDE.md guidance
- [ ] Label references match `.github/labels.yml` (if applicable)
- [ ] Configuration is backward compatible (no breaking changes)
- [ ] Test PR created and CodeRabbit review verified

---

## Troubleshooting

### Issue: CodeRabbit Not Applying Expected Guidance

**Diagnosis**:

1. Check file path matches pattern exactly (glob syntax can be tricky)
2. Verify pattern priority is higher than fallback patterns
3. Ensure `.coderabbit.yml` is deployed to organization (central config)
4. Check for repo-specific overrides that might be superseding central config

**Resolution**:

1. Test pattern with explicit test file
2. Verify in PR that CodeRabbit feedback references expected guidance
3. Check CodeRabbit logs/dashboard for pattern matching errors

### Issue: Multiple Patterns Match, Unclear Which Applied

**Diagnosis**:

1. File matches 2+ patterns with overlapping priority
2. CodeRabbit feedback doesn't clearly indicate which pattern was used

**Resolution**:

1. Increase priority spread between patterns (avoid ties)
2. Add comments in config clarifying why specific pattern takes precedence
3. Consider consolidating overlapping patterns

### Issue: New File Type Added, No Review Guidance

**Steps**:

1. Identify file type (extension, location)
2. Assess if CodeRabbit guidance is needed (use Gap analysis above)
3. If yes, follow "Adding New File Type Instruction" checklist
4. If no, document decision (e.g., "auto-generated, excluded via .gitignore")

---

## References

- **CodeRabbit Config**: `.coderabbit.yml` (primary source of truth)
- **Organization Standards**: `CLAUDE.md`, `AGENTS.md`
- **Branch Strategy**: `docs/BRANCHING_STRATEGY.md` section 5.3
- **Label System**: `.github/labels.yml` (canonical labels)
- **CodeRabbit Documentation**: <https://docs.coderabbit.ai/>
- **Pattern Specification**: CodeRabbit overrides schema (v2.0)

---

## Document History

| Date | Audit Result | Changes | Author |
|------|--------------|---------|--------|
| 2026-09-12 | 85-90% coverage | Initial audit guide created; 5 file types added | Claude |
| TBD | Quarterly | Next audit due Q4 2026 | — |

---

**Last Review**: 2026-09-12  
**Next Review**: Q4 2026 (October 1)  
**Maintainer**: Repository maintainers, DevOps team  
**Questions?**: Refer to `.coderabbit.yml` comments or create issue with `[CODERABBIT-AUDIT]` tag
