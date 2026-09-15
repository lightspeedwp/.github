# CodeRabbit Configuration: Quick Reference for Adding New Patterns

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

**Purpose**: Enable rapid addition of new file type instruction blocks to `.coderabbit.yml` in under 5 minutes  
**Target Users**: Repository maintainers, configuration stewards  
**Scope**: This guide covers adding a single new path pattern and its review instructions

---

## When to Add a New Pattern

Add a new pattern to `.coderabbit.yml` when:

- A file type or directory is consistently reviewed by CodeRabbit but lacks specific guidance
- Coverage audit identifies an under-reviewed file type (see `CODERABBIT_COVERAGE_AUDIT.md`)
- A new tool, file type, or project structure emerges that needs specialized review context
- An existing pattern is too broad and needs refinement with a more specific subset

**Do NOT add** if:

- The file type is already covered by an existing pattern (check coverage first)
- The guidance would duplicate existing content in AGENTS.md, CLAUDE.md, or `.github/instructions/`

---

## Template: Anatomy of a Path Instruction Block

```yaml
    - path: "path/pattern/**/*.ext"
      instructions: |
        Review description of what this file type is and why it matters:
          - First review focus area (what reviewers should check for)
          - Second review focus area (e.g., security, performance, accessibility)
          - Third review focus area (e.g., maintainability, consistency, clarity)
          - [Optional] Additional focus areas for complex file types
```

**Key Structure**:

- `path`: A glob pattern matching the files (e.g., `agents/*.agent.js`, `**/*.md`, `workflows/*.yml`)
- `instructions`: Plain text with bullet points describing review priorities

---

## Priority Assignment Quick Guide

**Choose priority based on specificity level:**

| Priority Range | Use For | Example Pattern | Example |
|---|---|---|---|
| **90-100** (Exact) | Specific files/agent types requiring precise guidance | `agents/*.agent.js` | Agent implementations, critical configs |
| **70-89** (Specific) | Technology-specific directories or clear-purpose folders | `**/.github/workflows/*.yml` | Infrastructure, CI/CD, testing frameworks |
| **50-69** (Type-in-Dir) | Language/type patterns in broader directories | `**/*.md`, `**/scripts/**/*.sh` | Documentation, scripts, tests |
| **1-49** (General) | Broad patterns, fallback guidance | `**/*` | Catch-all for unmapped file types |

**Rule**: If adding a new pattern, choose priority 1–2 levels higher than existing patterns covering similar file types.

---

## Step-by-Step: Adding a New Pattern (<5 min)

### Step 1: Choose Path and Priority (1 min)

1. Decide the glob pattern matching your file type (e.g., `plugins/**/*.php`)
2. Check `.coderabbit.yml` for existing patterns that might overlap
3. Assign priority:
   - If this is the **most specific** pattern for these files → priority 85–95
   - If more specific patterns exist → priority 50–70
   - If this is a broad fallback → priority 1–49

**Example**: Adding guidance for plugin PHP files in `plugins/` directory.

- Path: `plugins/**/*.php`
- Existing patterns: `**/*.php` (priority 60)
- Decision: Assign priority 80 (more specific than general PHP guidance)

### Step 2: Draft Review Guidance (2 min)

Write 3–5 bullet points describing what CodeRabbit should check for **this specific file type**:

- Focus on file-type-specific concerns (not generic "write good code")
- Use universal principles (security, performance, accessibility, correctness) — NOT language/framework specifics
- Keep bullets concise and testable

**Template to follow:**

```
Review {file type description}:
  - Check for {specific thing CodeRabbit should verify}
  - Ensure {specific requirement or standard}
  - Validate {specific quality criterion}
  - Confirm {specific completeness criterion}
```

**Example for plugins/**/*.php**:

```
Review WordPress plugin PHP files:
  - Check for proper namespacing and no globals pollution
  - Ensure all user input is validated and all output is escaped
  - Verify proper hook registration and callback parameter alignment
  - Validate compatibility with WordPress coding standards and security practices
  - Confirm database queries use prepared statements
```

### Step 3: Locate Insertion Point in .coderabbit.yml (1 min)

1. Open `.coderabbit.yml`
2. Find the `path_instructions:` section (around line 68)
3. Patterns are organized by priority (descending: 95 → 1)
4. Find the group where your priority belongs
5. Place your new pattern **within that priority group**, maintaining descending order within the group

**Priority Groups** (look for comments like `=== PRIORITY 80: ...`):

- Lines ~69–200: Priority 95–90 (exact paths)
- Lines ~200–400: Priority 80–70 (specific directories)
- Lines ~400–600: Priority 60–50 (type-in-dir)
- Lines ~600–750: Priority 40–1 (general/fallback)

### Step 4: Add Your Pattern (1 min)

Copy this template and fill in your details:

```yaml
    - path: "YOUR_GLOB_PATTERN_HERE"
      instructions: |
        Review YOUR_FILE_TYPE_DESCRIPTION:
          - YOUR_FIRST_FOCUS_AREA
          - YOUR_SECOND_FOCUS_AREA
          - YOUR_THIRD_FOCUS_AREA
```

**Paste it** in the correct priority group from Step 3.

### Step 5: Validate Your Addition (<1 min)

Checklist before committing:

- [ ] Path pattern uses glob syntax (`*`, `**`, `?`, `[...]`)
- [ ] Priority matches the pattern specificity (90–95 for exact, 70–89 for specific, etc.)
- [ ] Instruction block has ≥3 bullet points
- [ ] No framework/language-specific terms (check CODERABBIT_CONFIG_STANDARDS.md if unsure)
- [ ] No duplication with existing patterns
- [ ] Indentation matches surrounding patterns (2 spaces for `- path:`, consistent with others)
- [ ] YAML syntax is valid (test with `yaml lint .coderabbit.yml` if available)

---

## Complete Example: Adding Plugin PHP Pattern

**Starting state**: `.coderabbit.yml` has generic `**/*.php` (priority 60) but no specific guidance for plugin files.

**Goal**: Add specific guidance for `plugins/**/*.php` files.

### My Decisions

- **Pattern**: `plugins/**/*.php`
- **Priority**: 85 (more specific than `**/*.php`)
- **Focus Areas**: WordPress standards, security (escaping/validation), database safety

### My Pattern Block

```yaml
    - path: "plugins/**/*.php"
      instructions: |
        Review WordPress plugin PHP files:
          - Check for proper namespacing to avoid global scope pollution
          - Ensure all user input is validated and all output is properly escaped per WordPress security standards
          - Verify proper WordPress hook registration and correct callback parameter passing
          - Validate use of prepared statements in database queries and no direct SQL strings
          - Confirm adherence to WordPress Coding Standards for readability and maintainability
```

### Insertion in .coderabbit.yml

1. Find line ~72 (start of PRIORITY 70–89 group)
2. Look for existing patterns at priority 80–89
3. Insert in descending priority order (if none exist at 85, put it before priority 80 patterns)
4. Maintain 4-space indentation

---

## Validation Scenarios

**After adding your pattern**, verify it works:

1. **File Matching**: Does your glob pattern match intended files?

   ```bash
   cd /path/to/repo
   ls | grep -E "your_pattern"  # Roughly test the pattern
   ```

2. **Priority Doesn't Conflict**: Check no two patterns at same priority cover the same files
   - Review existing patterns near your priority level
   - Ensure your pattern is more/less specific as intended

3. **YAML Syntax**: Verify the file is still valid YAML

   ```bash
   yamllint .coderabbit.yml  # If yamllint available
   # OR manually check: proper indentation, no syntax errors
   ```

4. **Documentation**: If you added a high-priority (85+) pattern, add a brief comment above it:

   ```yaml
   # === PRIORITY 85: PLUGIN PHP FILES ===
   # Plugin-specific PHP review guidance for WordPress ecosystem
   - path: "plugins/**/*.php"
   ```

---

## Common Mistakes to Avoid

| Mistake | Problem | Fix |
|---------|---------|-----|
| **Overlapping patterns** | Two patterns at same priority match same files; unclear which applies | Check priority uniqueness; use specificity rule to assign priorities |
| **Vague guidance** | Bullets say "write good code" or "be careful with X" | Replace with specific testable checks: "Ensure X is Y", "Verify Z behavior" |
| **Framework-specific terms** | "Use Laravel's cache", "React hooks", "WordPress transients" | Use universal terms: "caching mechanism", "state management", "data persistence" |
| **Too few focus areas** | Only 1–2 bullets; doesn't meet SC-002 requirement of 3+ | Add more specific review areas; ask "what could go wrong in this file type?" |
| **Wrong indentation** | YAML parse error; file becomes invalid | Maintain 2-space indentation for `- path:` entries and instructions content |
| **Duplication** | New pattern overlaps with existing pattern at different priority | Check existing patterns first; adjust priority if overlap is intentional |

---

## Reference: Priority System Summary

**When files match multiple patterns, the HIGHEST priority wins:**

```
File: agents/my-agent.js

Matches:
  • agents/*.agent.js       (priority 95) ← WINS: most specific
  • agents/**               (priority 85)
  • **/*.js                 (priority 60)
  • **/*                    (priority 1)

Result: Instructions from agents/*.agent.js are applied
```

**See** `.coderabbit.yml` lines 34–67 for full priority system documentation and resolution algorithm.

---

## Quick Checklist Template

Save this and use before adding any pattern:

```
[ ] File type is not already covered by existing pattern
[ ] Glob pattern is correct (test with ls/find locally)
[ ] Priority assigned: _____ (based on specificity)
[ ] 3+ focus areas drafted and reviewed
[ ] No framework/language specifics (tech-agnostic ✓)
[ ] Indentation matches existing patterns
[ ] YAML syntax valid
[ ] Pattern inserted in correct priority group
[ ] Comment added if priority 85+ (high-specificity)
[ ] Example file tested to ensure match
```

---

## Help & Escalation

**Pattern not working?**

- Check glob syntax with `ls` locally: `ls | grep "your-pattern"`
- Verify priority range in context of existing patterns
- Ensure no typos in path

**Unclear which priority to use?**

- See Priority Assignment Quick Guide above
- Compare with similar existing patterns
- Ask: "How specific is this pattern?" (exact → 95, specific → 85, type → 60, general → 1)

**Need to remove or update an existing pattern?**

- Do NOT modify without checking dependencies (other patterns, workflows)
- Document the change in commit message and/or `CHANGELOG.md`
- Verify backward compatibility (existing patterns still work as before)

---

**Last Updated**: 2026-09-14  
**See Also**: `.coderabbit.yml` (full configuration), `CODERABBIT_COVERAGE_AUDIT.md` (coverage verification), `BRANCHING_STRATEGY.md` § 5.3 (branch-type context)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
