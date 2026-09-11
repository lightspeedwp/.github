# Technology-Agnosticism Validation Checklist

**Purpose**: Validate that CodeRabbit instruction blocks use universal principles, not technology-specific details  
**Status**: T009 - Phase 2 Foundational  
**Scope**: All path_instructions in `.coderabbit.yml`  
**Owned By**: CodeRabbit configuration maintainers

---

## Why Technology-Agnosticism Matters

LightSpeed operates across **four distinct technology domains**:

1. **WordPress (PHP)** — Block themes, block plugins, classic PHP
2. **Node.js/TypeScript** — Microservices, React apps, tooling
3. **Infrastructure & DevOps** — Terraform, CloudFormation, GitHub Actions
4. **AI & SpecKit** — Agent specs, workflow files, prompt engineering

CodeRabbit configuration is **organization-wide central control plane** — it applies to ALL repositories across all domains.

**Consequence of technology-specificity:**
- ❌ JS-specific guidance fails for PHP projects
- ❌ WordPress guidance inapplicable to MCP servers
- ❌ Framework-specific rules exclude diverse tech stacks
- ❌ Creates false negatives in code review coverage

**Benefit of technology-agnosticism:**
- ✅ Single instruction block works across all domains
- ✅ Universal principles apply to diverse codebases
- ✅ No re-implementation per technology
- ✅ Consistent review quality across organization

---

## FORBIDDEN Patterns (Technology-Specific)

### ❌ Framework Assumptions

- "Use WordPress hooks for integration"
- "Implement async/await patterns in TypeScript"
- "Use React Context API for state management"
- "Leverage Next.js API routes"
- "Implement Terraform modules from registry"

### ❌ Language-Specific Guidance

- "Check for Node.js event loop blocking"
- "Validate PHP namespace declarations"
- "Ensure Go interfaces are properly defined"
- "Verify Python type hints with mypy"

### ❌ Tool-Specific Implementation Details

- "Use webpack for bundling"
- "Configure Babel transpiler"
- "Set up ESLint rules"
- "Run phpcs with WordPress ruleset"
- "Use tfmt for Terraform formatting"

### ❌ Library/Package Specifics

- "Update WordPress Gutenberg version"
- "Check @wordpress/scripts configuration"
- "Validate composer.json lock file"
- "Review package-lock.json"

### ❌ Environment Assumptions

- "Ensure WordPress is 6.0+"
- "Target Node.js 18+ environments"
- "Require PHP 8.1+"
- "Assume AWS infrastructure"

---

## REQUIRED Patterns (Universal Principles)

### ✅ Code Quality Universals

- "Validate all external input before processing"
- "Ensure error messages are helpful to users"
- "Check for proper error handling paths"
- "Verify code comments explain the why, not the what"
- "Confirm variable names are clear and descriptive"
- "Validate that code is DRY (Don't Repeat Yourself)"

### ✅ Security Universals

- "Validate and sanitize all user input"
- "Ensure sensitive data is not logged"
- "Check that secrets are handled securely"
- "Verify authentication requirements are documented"
- "Validate access control logic"

### ✅ Performance Universals

- "Document performance implications"
- "Check for unnecessary loops or operations"
- "Verify caching strategy is appropriate"
- "Ensure operations scale with data size"
- "Validate that blocking operations are justified"

### ✅ Accessibility Universals

- "Confirm all interactive elements are keyboard accessible"
- "Verify focus indicators are visible"
- "Check that content is announced by screen readers"
- "Validate color contrast meets WCAG 2.2 AA"
- "Ensure form labels are properly associated"

### ✅ Testing Universals

- "Verify tests cover critical code paths"
- "Ensure tests are independent and isolated"
- "Check that test names describe what they test"
- "Validate that tests are repeatable and deterministic"
- "Confirm error cases are tested"

### ✅ Documentation Universals

- "Ensure API/interface contracts are documented"
- "Verify examples are accurate and complete"
- "Check that unclear terms are explained"
- "Validate that documentation matches implementation"
- "Confirm usage instructions are clear"

### ✅ Architecture Universals

- "Verify module/component boundaries are clear"
- "Check that dependencies are documented"
- "Ensure error handling is consistent"
- "Validate that state transitions are documented"
- "Confirm lifecycle events are properly managed"

---

## Validation Checklist Items

### For Each Path Instruction Block

- [ ] **No Language-Specific Keywords**
  - Search instruction text for language names: "PHP", "JavaScript", "Python", "Go", "Rust", etc.
  - If found, replace with universal principle (e.g., "input validation" instead of "PHP input escaping")

- [ ] **No Framework Assumptions**
  - Search for framework names: "WordPress", "React", "Angular", "Vue", "Rails", "Laravel", "Next.js", "Terraform", etc.
  - If found, identify the universal principle and rewrite without framework reference

- [ ] **No Tool/Package Specifics**
  - Search for tool names: "webpack", "ESLint", "Prettier", "Babel", "pytest", "Jest", "phpcs", etc.
  - If found, replace with general quality principle (e.g., "ensure code follows consistent style" instead of "run ESLint")

- [ ] **No Environment Assumptions**
  - Search for version numbers: "Node 18+", "PHP 8.1+", "WordPress 6.0+", "Python 3.9+", etc.
  - If found, remove version specifics and focus on behavior (e.g., "use async/await patterns" → "handle asynchronous operations correctly")

- [ ] **Universal Principles Present (3+ per block)**
  - Review instruction text for at least 3 specific, testable review focus areas
  - Verify each focus area applies across multiple technology stacks

- [ ] **Accessibility Mentioned (if UI-related)**
  - UI-related instructions must reference WCAG 2.2 AA or keyboard navigation
  - Confirm WCAG reference is standard, not tool-specific

- [ ] **Security Mentioned (if applicable)**
  - Security-relevant instructions must address input validation, secret handling, or access control
  - Confirm principles apply across all programming languages

- [ ] **Performance Mentioned (if applicable)**
  - Performance-relevant instructions must address scalability, caching, or efficiency
  - Confirm principles are universal, not language-specific optimizations

---

## Example Rewrites

### ❌ Framework-Specific (WRONG)

```
Review WordPress block.json files:
  - Ensure block registration uses registerBlockType()
  - Check that block supports are properly configured
  - Validate that WordPress filter hooks are used correctly
```

### ✅ Technology-Agnostic (CORRECT)

```
Review block configuration files:
  - Ensure block interface is clearly documented
  - Check that block capabilities and constraints are specified
  - Validate that configuration matches implementation
```

---

### ❌ Language-Specific (WRONG)

```
Review TypeScript code:
  - Ensure all types are properly annotated
  - Check that strict mode is enabled
  - Validate async/await patterns are correct
  - Ensure Promise rejection is handled
```

### ✅ Technology-Agnostic (CORRECT)

```
Review code for type safety and error handling:
  - Ensure all variables have clear types or inferred types
  - Check that error cases are handled explicitly
  - Validate that asynchronous operations have proper completion handling
  - Ensure error messages are logged or reported to users
```

---

### ❌ Tool-Specific (WRONG)

```
Review shell scripts:
  - Run shellcheck for linting
  - Ensure scripts use bash features correctly
  - Validate sed/awk usage
```

### ✅ Technology-Agnostic (CORRECT)

```
Review shell scripts:
  - Ensure POSIX compliance and portability
  - Check for proper error handling and exit codes
  - Validate that edge cases are handled
  - Confirm scripts have clear usage documentation
```

---

## Applying This Checklist

### For Configuration Maintainers

1. Run this checklist **before adding or modifying any path_instruction block**
2. For each block, go through every checklist item
3. If any item fails, rewrite the block to pass
4. Document the rationale for any universal principles chosen
5. Link related technology-specific documentation if maintainers need it

### For Code Reviewers

1. When reviewing PRs that modify `.coderabbit.yml`, use this checklist
2. Flag any instruction blocks that fail technology-agnosticism checks
3. Request rewrites that follow universal principles
4. Link to this checklist as reference

### For Validation Automation

1. Create a linting script that searches for forbidden keywords
2. Fail CI if blocked keywords found in new/modified instruction blocks
3. Generate reports showing which blocks need remediation
4. Track compliance over time

---

## Current Configuration Status

**Last Audited**: 2026-09-11 (T009 implementation)

| Block | Technology-Agnostic? | Notes |
|-------|----------------------|-------|
| `.github/prompts/**` | ✅ Yes | Generic guidance |
| `.github/agents/**` | ✅ Yes | Generic guidance |
| `.github/custom-instructions.md` | ✅ Yes | Index file |
| `**/.github/workflows/*.yml` | ✅ Yes | GitHub Actions (universal CI/CD pattern) |
| `**/*.{js,ts}` | ⚠️ Partial | References "WordPress" and "block theme" — needs update |
| `**/package.json` | ⚠️ Partial | References "WordPress theme/plugin" — needs generalization |
| `**/composer.json` | ⚠️ Partial | References "WordPress" multiple times — needs generalization |
| `**/scripts/**/*.sh` | ✅ Yes | Universal shell principles |
| `**/*.md` | ✅ Yes | Universal documentation principles |
| `**/tests/*.*` | ✅ Yes | Universal testing principles |

**Remediation Priority**: Update JS/TS, package.json, composer.json blocks to remove WordPress-specific language (Phase 3)

---

## Related Documentation

- [BRANCH_CONTEXT_MAPPING.md](./BRANCH_CONTEXT_MAPPING.md) — Branch-type-specific guidance (also technology-agnostic)
- [.coderabbit.yml](./.coderabbit.yml) — Configuration under review
- [AGENTS.md](./AGENTS.md) — Global AI rules and standards

---

**Version**: 1.0  
**Created**: 2026-09-11  
**Status**: T009 Complete  
**Next**: Apply checklist to existing blocks (T010+)
