---
title: "Reviewer Agent Slide Deck Prompt"
description: "NotebookLM and design prompt for generating Reviewer Agent presentation slides"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Reviewer Agent Slide Deck Prompt

## Agent Overview

The **Reviewer Agent** automates code and documentation quality review across pull requests. It performs static analysis, identifies logic errors, detects security issues, and suggests improvements in style, performance, and clarity without blocking human judgment. It integrates with the development workflow as an automated first-pass reviewer.

**Operational scope**: PR-scoped review automation, code quality gates, security scanning, style consistency, performance recommendations.

**Owned by**: LightSpeedWP engineering & security teams

## Key Capabilities

1. **Static Code Analysis** - Detect logic errors, type mismatches, unused variables, common patterns
2. **Security Scanning** - Identify potential vulnerabilities (SQL injection, XSS, credential leaks, OWASP Top 10)
3. **Performance Analysis** - Flag inefficient algorithms, N+1 queries, unnecessary re-renders
4. **Documentation Review** - Validate docs are clear, examples work, links resolve
5. **Style & Consistency** - Enforce naming conventions, formatting, architectural patterns
6. **Summaries & Explanations** - Plain-language explanation of issues, not just error codes

## Integration Points

- **Upstream**: Linting Agent (syntax/format issues), Meta Agent (documentation quality)
- **Downstream**: Release Agent (blocks release if critical issues unresolved)
- **Governance**: `.coderabbit.yml` (review configuration), CLAUDE.md (code standards)

## Use Cases & Examples

### Use Case 1: Feature PR Review

A developer submits a new feature PR with 500 lines of code changes.

**Reviewer Agent workflow:**

1. Analyze code for logic errors, potential bugs
2. Check security: any credential strings, injection vulnerabilities?
3. Performance: any inefficient loops or queries?
4. Style: naming, spacing, function size consistent?
5. Documentation: examples clear, edge cases explained?
6. Generate comment: "3 findings: consider renaming X for clarity, performance tip on Y, missing edge case Z"
7. Suggest improvements without being prescriptive

### Use Case 2: Security Hotfix

Critical bug fix needs to ship quickly; need confidence it's safe.

**Reviewer Agent workflow:**

1. Deep security scan: Could this introduce new vulns while fixing old one?
2. Regression check: Does fix affect other code paths unexpectedly?
3. Test coverage: Are new/modified paths covered by tests?
4. Confidence summary: "Safe to merge after addressing 1 concern: line 42 needs bounds check"

### Use Case 3: Documentation-Heavy PR

New guide or how-to document submitted for review.

**Reviewer Agent workflow:**

1. Check clarity: Is the narrative clear and well-structured?
2. Example validation: Do code examples run successfully?
3. Link health: All referenced files exist and links work?
4. Completeness: Are prerequisites mentioned, edge cases covered?
5. Feedback: "Great guide! 2 issues: example on line 15 missing import, link on line 23 is broken"

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Manual PR review time-consuming; easy to miss issues; inconsistent feedback quality
- Stakes: Bugs shipped; security issues overlooked; poor documentation; slow merge velocity

**Slide 02** - Reviewer Agent Role

- Automated first-pass review on every PR
- Identifies issues early, freeing humans for architecture/design questions
- Consistent, evidence-based feedback

**Slide 03** - Code Quality Analysis

- Logic errors: unused variables, type mismatches, unreachable code
- Common patterns: anti-patterns, better alternatives
- Complexity metrics: function size, cyclomatic complexity
- Maintainability: is code easy to understand and modify?

**Slide 04** - Security Scanning

- Credential detection: catch hardcoded passwords, API keys
- Injection vulnerabilities: SQL, XSS, command injection patterns
- OWASP Top 10: coverage of major categories
- Dependency vulns: Known vulnerable packages

**Slide 05** - Performance Analysis

- Algorithm efficiency: O(n²) when O(n) possible?
- Database queries: N+1 patterns, missing indexes
- Memory usage: large allocations, leaks
- Rendering: unnecessary re-renders, expensive operations in loops

**Slide 06** - Documentation Quality

- Clarity: Is explanation clear to newcomers?
- Completeness: Are prerequisites mentioned? Edge cases covered?
- Examples: Do code samples work? Are all imports included?
- Accuracy: Does documentation match actual behavior?

**Slide 07** - Style & Consistency

- Naming conventions: Variables, functions, classes follow patterns?
- Formatting: Indentation, spacing, line length consistent?
- Architectural patterns: Design matches team conventions?
- Comments: Clear intent, no obvious comments, updated with code

**Slide 08** - Integration with Linting Agent

- Linting Agent catches syntax errors (bare URLs, spacing)
- Reviewer Agent catches logic/semantic issues
- Both run in PR: lint first, then review
- Different scopes: linting is objective, review is nuanced

**Slide 09** - Integration with Release Agent

- Release Agent checks: Did all review findings get resolved?
- Blocks release if critical security/logic issues remain open
- Feedback: Unresolved review findings → release blocker

**Slide 10** - Human + AI Review Model

- Reviewer Agent: Fast, comprehensive, objective checks (hours of human review)
- Human Reviewers: Architecture, design, team knowledge, judgment calls
- Together: Faster reviews, better coverage, less repetitive work

**Slide 11** - Review Quality & Confidence

- Finding categories: Logic bug (high confidence), style suggestion (medium confidence)
- False positive handling: Clear explanation lets humans quickly reject wrong suggestions
- Learning: Over time, Reviewer Agent improves with feedback

**Slide 12** - Adoption Workflow

- PR submitted → Reviewer Agent comments automatically
- Developer addresses findings (or discusses if disagrees)
- Human reviewer focuses on architecture/design
- All stakeholders: faster feedback, earlier issue detection

**Slide 13** - Metrics & Impact (optional)

- Review turnaround time: reduced from hours/days to minutes
- Finding coverage: % of bugs/issues caught before merge
- False positive rate: % of suggestions developers dismiss
- Developer satisfaction: Feedback quality, tone, usefulness

**Slide 14** - Lessons & Limitations (optional)

- Lesson: AI excels at pattern recognition; humans needed for context
- Limitation: Cannot assess architectural fit or business logic
- Best practice: Combine with human expertise, not replace it

**Slide 15** - Close & Next Actions

- Reviewer Agent augments human judgment
- Contribute: Address findings thoughtfully; discuss if disagree
- Questions & feedback

## Evidence Anchors

- `.coderabbit.yml` - Reviewer Agent configuration
- `.github/workflows/` - PR review automation workflows
- `CLAUDE.md` - Code standards and review expectations
- `AGENTS.md` - Reviewer Agent responsibility specification
- Sample PR comments (from actual reviewed PRs)

## Design Notes

- **Visual theme**: Quality assurance & intelligence (checkmarks, magnifying glass, insights)
- **Color palette**: Use review/quality colors (green for approve, red for issues)
- **Key visuals**: PR review comment screenshot, finding categorization (critical/medium/low), confidence indicator
- **Accessibility**: Clear icons for finding types; high contrast for severity levels
- **Animations**: Consider finding reveal animation, category highlighting

## Quality Bar

- Distinguish automated checks (high confidence) from suggestions (medium/low)
- Include examples of different finding types (logic, security, performance, style)
- Explain why each finding matters (bugs prevented, security improved, etc.)
- Validate against actual `.coderabbit.yml` configuration
- Be honest about limitations (context, architectural judgment)
