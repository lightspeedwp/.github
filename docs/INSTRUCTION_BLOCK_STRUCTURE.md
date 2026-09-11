# Instruction Block Structure Standard

**Purpose**: Define the consistent structure and quality standard for all CodeRabbit instruction blocks  
**Status**: T010 - Phase 2 Foundational  
**Scope**: All `path_instructions` in `.coderabbit.yml`  
**Applies To**: 24+ existing blocks + 15-20+ new blocks planned for Phase 3+

---

## Executive Summary

Every CodeRabbit instruction block follows a consistent structure:

```yaml
- path: "{glob-pattern}"
  instructions: |
    {Header}: {Brief description}
      - {Focus Area 1}: {Specific checks}
      - {Focus Area 2}: {Specific checks}
      - {Focus Area 3+}: {Specific checks}
```

**Key Requirements:**
- 1 header line (category + brief description)
- 3+ focus areas (universal principles, not technology-specific)
- 3-5 specific checks per focus area
- Bullet-list format for readability
- Technology-agnostic language throughout

---

## Canonical Structure

### Line 1: Header

Format: `{File Type/Path}: {Brief Category Description}`

**Purpose**: Immediately identify what type of file or path this block addresses

**Examples:**
- ✅ "Review JavaScript/TypeScript source code:"
- ✅ "Review shell scripts for automation:"
- ✅ "Review package manifests:"
- ✅ "Review workflow definitions:"
- ❌ "Review WordPress block.json files:" (technology-specific)
- ❌ "Review TypeScript code:" (language-specific, not universal)

### Lines 2+: Focus Areas

Format:
```
  - {Focus Area Name}: {Category Description}
    - {Specific Check 1}
    - {Specific Check 2}
    - {Specific Check 3}
```

**Purpose**: Organize review guidance by thematic areas, making review priorities clear

**Requirements:**
- **Minimum 3 focus areas** per instruction block
- **Each focus area addresses a universal principle** (code quality, security, performance, accessibility, testing, maintainability)
- **Each focus area has 3-5 specific, testable checks**
- **Checks are actionable** (reviewer can verify them)
- **No technology-specific terminology**

**Standard Focus Area Categories:**

| Category | Description | Applies To |
|----------|-------------|-----------|
| **Code Quality** | Style, clarity, maintainability, naming | All code files |
| **Error Handling** | Exception handling, edge cases, validation | All code + config |
| **Security** | Input validation, secrets, access control | Sensitive files |
| **Performance** | Efficiency, scalability, caching | Performance-critical |
| **Testing** | Coverage, isolation, determinism | Test files + test-needing code |
| **Accessibility** | Keyboard nav, screen readers, contrast | UI/documentation |
| **Documentation** | Clarity, completeness, examples | Docs + code comments |
| **Compatibility** | Versions, breaking changes, APIs | Dependencies + interfaces |
| **Configuration** | Env vars, secrets, deployment setup | Config files |
| **Architecture** | Modularity, dependencies, patterns | Code structure |

---

## Example Blocks (Well-Structured)

### Example 1: Shell Scripts

```yaml
- path: "**/scripts/**/*.sh"
  instructions: |
    Review shell scripts for automation:
      - POSIX Compliance & Portability
        - Check for POSIX compliance and portability across platforms
        - Validate use of comments and usage/help output in scripts
        - Ensure functions are modular, reusable, and well-documented
      - Error Handling & Robustness
        - Validate error handling, input validation, and exit codes
        - Confirm scripts are tested and used consistently
        - Verify proper handling of edge cases and unexpected inputs
      - Code Quality & Maintainability
        - Check for code style, maintainability, and readability
        - Ensure use of `set -euo pipefail` and shebang at the top
        - Validate variable names are clear and whitespace is consistent
```

**Analysis:**
- ✅ Header clearly identifies file type (shell scripts)
- ✅ 3 focus areas (POSIX, Error Handling, Code Quality)
- ✅ 3 checks per focus area
- ✅ No bash/zsh-specific terminology
- ✅ Universal principles apply across all projects

---

### Example 2: Configuration Files

```yaml
- path: "**/package.json"
  instructions: |
    Review package manifests:
      - Dependency Quality & Security
        - Check for security vulnerabilities and outdated packages
        - Ensure dependencies are appropriate for project type
        - Validate semantic versioning and proper version pinning
      - Build Scripts & Automation
        - Ensure scripts are documented with clear, descriptive names
        - Validate that scripts follow org standards (lint, test, build, format)
        - Check for presence of automation scripts (postinstall, prepare)
      - Package Metadata & Completeness
        - Validate package metadata (name, version, description, author, license)
        - Check that repository, bugs, and homepage fields are accurate
        - Ensure devDependencies vs dependencies separation is correct
```

**Analysis:**
- ✅ Header identifies file type (package manifests)
- ✅ 3 focus areas (Dependencies, Scripts, Metadata)
- ✅ 3-4 checks per focus area
- ✅ No npm/yarn/package-manager specifics
- ✅ Applies equally to Node.js, PHP Composer, etc.

---

### Example 3: Test Files

```yaml
- path: "**/tests/*.*"
  instructions: |
    Review test files:
      - Test Coverage & Scope
        - Ensure tests cover critical code paths and user flows
        - Verify both positive and negative test cases exist
        - Check that edge cases and boundary conditions are tested
      - Test Isolation & Determinism
        - Ensure tests are independent and can run in any order
        - Validate that tests do not depend on external state
        - Confirm tests are repeatable and reliable (no flakiness)
      - Test Clarity & Documentation
        - Check that test names clearly describe what they test
        - Verify that assertions are specific and helpful
        - Ensure test output is diagnostic and actionable
```

**Analysis:**
- ✅ Header identifies file type (test files)
- ✅ 3 focus areas (Coverage, Isolation, Clarity)
- ✅ 3-4 checks per focus area
- ✅ No Jest/pytest/test-framework specifics
- ✅ Applies to any testing framework

---

## Anti-Patterns (What NOT to Do)

### ❌ Too Few Focus Areas

```yaml
- path: "**/*.js"
  instructions: |
    Review JavaScript:
      - Check for style issues
```

**Problem**: Only 1 focus area (should be 3+), no specific checks, vague guidance

---

### ❌ Technology-Specific Language

```yaml
- path: "**/*.php"
  instructions: |
    Review WordPress PHP code:
      - Check for WordPress security best practices
      - Validate WordPress hook usage
      - Ensure WordPress coding standards compliance
```

**Problem**: All three focus areas are WordPress-specific. Doesn't apply to non-WordPress PHP code.

---

### ❌ Weak or Unmeasurable Checks

```yaml
- path: "**/*.ts"
  instructions: |
    Review TypeScript:
      - Code Quality
        - Ensure code is good
        - Check for best practices
        - Verify it looks correct
```

**Problem**: Checks are vague ("good", "looks correct", "best practices" — not testable)

---

### ❌ Inconsistent Structure

```yaml
- path: "**/*.md"
  instructions: |
    Review markdown:
    Check for clear writing
    Ensure proper formatting
    Links should work
```

**Problem**: No bullet points, inconsistent wording, no focus area organization

---

## Updating Existing Blocks

### Phase 3 Remediation Plan

Current configuration has ~24 blocks. Some need enhancement to meet 3+ focus area standard:

**Blocks Needing Enhancement** (audited T009):
1. `**/*.{js,ts}` — Expand from 1 focus area → 3+ (Code Quality, Testing, Performance)
2. `**/package.json` — Expand from 1 focus area → 3 (Dependencies, Scripts, Metadata)
3. `**/composer.json` — Expand from 1 focus area → 3 (Dependencies, Config, Testing)

**Blocks That Meet Standard:**
- `**/scripts/**/*.sh` ✅ 3 focus areas
- `**/.github/workflows/*.yml` ✅ 3 focus areas
- `**/tests/*.*` ✅ 3+ focus areas
- `.github/agents/*.agent.js` ✅ 3+ focus areas

### Remediation Process

1. Read existing block
2. Identify current focus areas (if any)
3. Map to universal principles (security, performance, testing, etc.)
4. Expand to 3+ focus areas
5. Add 3-5 specific checks per focus area
6. Remove any technology-specific language
7. Validate against technology-agnosticism checklist
8. Commit as part of Phase 3 work

---

## New Block Template (for Phase 3+)

When adding a new instruction block for uncovered file types, use this template:

```yaml
- path: "{glob-pattern-priority-{90-100|70-89|50-69|1-49}}"
  instructions: |
    Review {file type or category}:
      - {Focus Area 1 - Universal Principle}
        - {Specific Check 1.1}
        - {Specific Check 1.2}
        - {Specific Check 1.3}
      - {Focus Area 2 - Universal Principle}
        - {Specific Check 2.1}
        - {Specific Check 2.2}
        - {Specific Check 2.3}
      - {Focus Area 3 - Universal Principle}
        - {Specific Check 3.1}
        - {Specific Check 3.2}
        - {Specific Check 3.3}
```

**Checklist for New Blocks:**
- [ ] Path pattern follows priority system (T007)
- [ ] 3+ focus areas (minimum)
- [ ] 3-5 checks per focus area
- [ ] All language is technology-agnostic (T009)
- [ ] Applies across multiple project types
- [ ] Specific, testable checks (not vague)
- [ ] No framework/tool/language assumptions

---

## Focus Area Examples by Category

### Security Focus Area

```
Security & Input Handling
- Validate and sanitize all user input before processing
- Ensure sensitive data is not logged or exposed in output
- Verify authentication requirements and access control logic
```

### Performance Focus Area

```
Performance & Scalability
- Document performance implications of changes
- Check for unnecessary operations or inefficient loops
- Verify that operations scale appropriately with data size
```

### Testing Focus Area

```
Testing & Coverage
- Verify critical code paths have corresponding tests
- Check that tests are isolated and don't depend on external state
- Ensure both success and failure cases are tested
```

### Accessibility Focus Area

```
Accessibility (WCAG 2.2 AA)
- Verify all interactive elements are keyboard accessible
- Check that focus indicators are visible and logical
- Ensure dynamic content updates are properly announced
```

### Documentation Focus Area

```
Documentation & Clarity
- Verify API contracts and interfaces are documented
- Check that examples are accurate and complete
- Ensure unclear terms are explained or linked to glossary
```

---

## Validation Checklist (For Reviewers)

When reviewing changes to `.coderabbit.yml`, verify each instruction block:

- [ ] **Header Line**: Identifies file type/category clearly
- [ ] **3+ Focus Areas**: Each addresses a universal principle
- [ ] **3-5 Checks Per Area**: Specific, testable, actionable
- [ ] **Technology-Agnostic**: No framework/language/tool specifics
- [ ] **Consistent Format**: Matches canonical structure above
- [ ] **No Duplicates**: Focus areas don't repeat across blocks
- [ ] **Cross-Org Applicable**: Works for WordPress + Node.js + Infrastructure + MCP projects

---

## Related Documentation

- [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md) — Branch-type context (also follows structure standard)
- [TECHNOLOGY_AGNOSTICISM.md](./checklists/technology-agnosticism.md) — Validation checklist
- [.coderabbit.yml](./.coderabbit.yml) — Configuration being maintained

---

**Version**: 1.0  
**Created**: 2026-09-11  
**Status**: T010 Complete  
**Applies To**: All 24+ existing blocks + 15-20+ new blocks (Phase 3+)
