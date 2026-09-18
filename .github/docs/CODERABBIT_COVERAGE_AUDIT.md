# CodeRabbit Configuration Coverage Audit Guide

**Purpose**: Help maintainers verify that CodeRabbit review instructions cover all critical file types in the repository.

**Last Updated**: 2026-09-12

**Target Audience**: Repository maintainers, DevOps, code review leads

---

## Quick Start: Running a Coverage Audit

### Step 1: Scan Repository File Types

Run this command to list all file types currently in the repository:

```bash
find . -type f -not -path '*/\.*' -not -path '*/node_modules/*' -not -path '*/.git/*' | \
  sed 's/.*\.//' | sort | uniq -c | sort -rn | head -30
```

This will show you the top 30 most common file types by frequency.

### Step 2: Cross-Reference Against CodeRabbit Config

Open `.coderabbit.yml` and review the `path_instructions` section. For each file type from Step 1:

1. **Check if coverage exists**: Search `.coderabbit.yml` for a path pattern matching that file type
2. **Record coverage status**:
   - ✅ **Covered**: A specific instruction block exists (e.g., `**/*.md` for markdown)
   - ⚠️ **Partially covered**: Pattern matches but review guidance is generic
   - ❌ **Not covered**: No matching pattern exists

### Step 3: Identify Coverage Gaps

File types NOT covered are candidates for new instruction blocks. Prioritize by:

1. **Frequency**: How often do contributors modify this file type?
2. **Risk**: Are there security, performance, or accessibility implications?
3. **Visibility**: Is this a user-facing or critical infrastructure file?

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
