---
title: "Linting Agent Slide Deck Prompt"
description: "NotebookLM and design prompt for generating Linting Agent presentation slides"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Linting Agent Slide Deck Prompt

## Agent Overview

The **Linting Agent** enforces objective code, markdown, YAML, and JSON style rules across the repository. It detects syntax errors, formatting violations, and structural problems with automated fixes. It operates as the first quality gate: all code must pass linting before review or merge.

**Operational scope**: Repository-wide style enforcement, syntax validation, formatting consistency, structural correctness.

**Owned by**: LightSpeedWP engineering & automation teams

## Key Capabilities

1. **Markdown Linting** - Enforce heading structure, list formatting, bare URL detection, table syntax
2. **YAML Validation** - Detect syntax errors, schema violations, indentation problems
3. **JSON Validation** - Ensure valid JSON, schema compliance, formatting consistency
4. **Code Linting** - JavaScript, TypeScript, Python, Bash: style, naming, complexity
5. **Auto-Fixing** - Apply automatic fixes for formatting issues (spacing, quotes, indentation)
6. **Pre-Commit Enforcement** - Run hooks to prevent committing style violations

## Integration Points

- **Upstream**: None (runs first in quality pipeline)
- **Downstream**: Reviewer Agent (focus on logic, not syntax), Meta Agent (report violations)
- **Governance**: `.eslintrc.cjs`, `.markdownlintrc.yml`, `.prettierrc` (configuration files)

## Use Cases & Examples

### Use Case 1: Developer Commits Code

A developer finishes a feature and runs `npm run lint` before committing.

**Linting Agent workflow:**

1. Scan staged files for syntax/style issues
2. For formatting issues: auto-apply fixes (prettier, eslint --fix)
3. For structural issues: report errors requiring manual fix
4. If all issues resolved: allow commit to proceed
5. If issues remain: block commit with clear error messages

### Use Case 2: PR Review with Linting Violations

PR submitted with markdown formatting errors (bare URLs, missing blank lines).

**Linting Agent workflow:**

1. Run on PR: detect markdown violations
2. Auto-fix formatting issues (if safe)
3. Comment on PR: "Fixed 3 formatting issues; 1 issue requires manual fix: bare URL on line 45"
4. Developer reviews fixes, manually addresses remaining issue
5. Recommend: run `npm run lint:md -- --fix` locally next time

### Use Case 3: Organization-Wide Style Update

Team decides to enforce new rule: all function names must be camelCase.

**Linting Agent workflow:**

1. Update .eslintrc.cjs with new rule
2. Run across entire repository: detect violations
3. Auto-fix violations where safe (most cases)
4. Flag violations requiring human judgment
5. Generate report: "50 files need attention; 45 auto-fixed, 5 manual review required"

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Code style inconsistent; syntax errors shipped; time wasted on formatting during review
- Stakes: Harder to read code; merge conflicts over style; quality degradation

**Slide 02** - Linting Agent Role

- Enforces objective style rules across all file types
- First-pass quality gate: must pass before human review
- Automates formatting: saves time, prevents merge conflicts

**Slide 03** - Markdown Linting Rules

- Heading structure: H1 = title, H2+ = sections (no skipping levels)
- List formatting: Blank lines around lists; consistent bullet/number syntax
- Bare URLs: All URLs must be markdown links `[text](url)`
- Code blocks: Must have language specifier (```js,```yaml)
- Table syntax: Proper alignment, no bare pipes in content

**Slide 04** - YAML Validation

- Syntax correctness: Indentation (2 spaces), quotes (consistent)
- Schema validation: If schema defined, contents must match
- Common errors: Tabs instead of spaces, missing colons, quoted numbers
- Workflow files: Special validation for GitHub Actions syntax

**Slide 05** - JSON Validation

- Syntax: Valid JSON (matching braces, commas)
- Schema compliance: If schema defined, all fields must validate
- Formatting: Consistent indentation, trailing commas per style
- Config files: package.json, tsconfig.json, eslintrc all validated

**Slide 06** - Code Linting (JavaScript/TypeScript)

- ESLint rules: naming conventions, complexity, unused variables
- TypeScript: Type correctness, inference vs. explicit
- Import/export: Consistent order, proper module structure
- Comments: No obvious comments; auto-disabled rules flagged
- Function size: Too large functions recommended for refactoring

**Slide 07** - Code Linting (Bash/Shell)

- ShellCheck: Detect common shell script errors
- Quoting: Proper variable quoting, glob safety
- Pipelines: Proper error handling, set -e discipline
- Security: No credential literals, safe command substitution

**Slide 08** - Auto-Fixing & Manual Fixes

- Auto-fixable: Prettier handles most formatting (quotes, spacing)
- Auto-fixable: ESLint --fix handles many style issues
- Manual required: Logic errors, naming violations, structure changes
- Developer experience: Run `npm run lint -- --fix` to auto-apply

**Slide 09** - Pre-Commit Hooks

- Husky setup: Git hooks prevent committing style violations
- Fast feedback: Developers know about issues before push
- Consistency: Same rules locally and in CI
- Opt-out: Developer can skip hook if necessary, but discouraged

**Slide 10** - CI/CD Integration

- Every PR: Full linting run (check mode, don't fix)
- Fail on violations: CI gate must pass before merge
- Report: Comment on PR with violations and suggested fixes
- Trend tracking: Track violation reduction over time

**Slide 11** - Configuration Management

- Central config files: `.eslintrc.cjs`, `.markdownlintrc.yml`, `.prettierrc`
- Inheritance: Project configs can extend base configs
- Updates: Team agrees on rule changes; applied repository-wide
- Documentation: Each rule explained in inline comments

**Slide 12** - Adoption Patterns

- Onboarding: New developers learn rules via linting feedback
- Feedback loop: Clear error messages teach style conventions
- Team discussion: Controversial rules can be debated and refined
- Documentation: Style guide complements linting configuration

**Slide 13** - Metrics & Compliance (optional)

- Violation trend: Track if style quality improving/declining
- Auto-fix coverage: % of violations fixable automatically
- Rule compliance: % of files with zero violations
- Adoption: % of developers running pre-commit hooks

**Slide 14** - Lessons & Best Practices (optional)

- Lesson: Strict linting prevents merge conflicts over style
- Best practice: Auto-fix what you can; require judgment elsewhere
- Challenge: Balance strictness with pragmatism
- Tip: Communicate rule rationale to gain team buy-in

**Slide 15** - Close & Next Actions

- Linting Agent is the first quality gate
- Contribute: Run `npm run lint` before committing
- Questions & feedback

## Evidence Anchors

- `.eslintrc.cjs` - JavaScript/TypeScript linting configuration
- `.markdownlintrc.yml` - Markdown linting rules
- `.prettierrc` - Code formatting configuration
- `.github/workflows/linting.yml` - CI linting workflow
- `.husky/pre-commit` - Pre-commit hook definition
- `AGENTS.md` - Linting Agent responsibility specification
- `scripts/validation/` - Validation scripts and utilities

## Design Notes

- **Visual theme**: Automated quality & consistency (checkmarks, gears, lint-free)
- **Color palette**: Use automation/quality colors (green for pass, red for violation)
- **Key visuals**: Linting error example, auto-fix before/after, configuration file snippet
- **Accessibility**: Clear violation categories; high contrast for error severity
- **Animations**: Consider error highlighting, auto-fix reveal animation

## Quality Bar

- Distinguish auto-fixable vs. manual-fix violations
- Include realistic examples of each violation type
- Show actual linting error messages (not sanitized)
- Validate against current `.eslintrc.cjs` and `.markdownlintrc.yml`
- Be clear about rule rationale (why this rule exists)
