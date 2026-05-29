---
title: "Contributing Guidelines & Code Standards Slide Deck Prompt"
description: "NotebookLM and design prompt for contribution standards and code quality expectations"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Contributing Guidelines & Code Standards Slide Deck Prompt

## System Overview

The **Contributing Guidelines System** defines clear expectations for contributions, establishes code quality standards, and provides structure for collaboration. It includes contribution types, review processes, code style requirements, testing standards, and community norms.

**Operational scope**: Contribution standards, code quality expectations, review guidelines, community norms, quality gates.

**Owned by**: LightSpeed ops & engineering teams

## Key Components

1. **Contribution Types** - Bug fixes, features, documentation, tests
2. **Code Style Standards** - Formatting, naming, organization
3. **Testing Requirements** - Unit tests, integration tests, coverage minimums
4. **Documentation Standards** - Comments, README updates, changelog entries
5. **Review Process** - Who reviews, what they look for, approval criteria
6. **Community Guidelines** - Code of conduct, respectful collaboration
7. **Commit Standards** - Message format, atomic commits, sign-off

## Integration Points

- **CONTRIBUTING.md**: Primary contribution guide
- **Linting Agent**: Enforces code style
- **Testing Workflow**: Validates test coverage and quality
- **Reviewer Agent**: Performs automated code review
- **Meta Agent**: Tracks contribution metrics

## Use Cases & Examples

### Use Case 1: Developer Fixing a Bug

Developer finds bug, fixes it, follows contribution standards.

**Contribution flow:**

1. Developer finds: Labels not applied to some issues
2. Investigates code, identifies root cause
3. Creates branch: `git checkout -b fix/labels-not-applied`
4. Fixes code: Corrects labeling logic
5. Adds test: Creates test case that would have caught this
6. Runs tests: `npm test` - all pass
7. Runs linting: `npm run lint` - all pass
8. Writes commit message:

   ```
   fix: apply labels to all issue types
   
   Previously, labels were only applied to certain issue types.
   Now all issue types get labeled correctly.
   
   Fixes: #1234
   ```

9. Creates PR with test and description
10. Linting agent validates automatically
11. Reviewer requests minor change
12. Developer iterates, PR merges

### Use Case 2: Feature Addition with Full Documentation

Developer adding new skill; demonstrates excellence in contributions.

**Contribution flow:**

1. Developer implements new skill: `wordpress-block-validation`
2. Writes code following style standards
3. Adds comprehensive tests (92% coverage)
4. Updates SKILL_REGISTRY.json
5. Adds skill documentation with examples
6. Writes meaningful commit messages (3 commits, logical progression)
7. Includes changelog entry under "Added" section
8. Creates PR with detailed description explaining:
   - What the skill does
   - Why it was added
   - How to use it
   - Test coverage included
9. Reviewer provides feedback on approach
10. Developer responds, makes suggested improvements
11. Second reviewer approves
12. PR merged with all quality gates passed

### Use Case 3: Contribution Review & Feedback

Reviewer reviewing contribution; applies standards constructively.

**Review flow:**

1. Developer submits PR
2. Linting agent runs: Detects 3 style issues
3. Testing agent runs: 78% coverage (needs 80%)
4. Reviewer performs manual review:
   - Checks logic correctness
   - Verifies test quality
   - Reviews documentation
   - Suggests improvements
5. Reviewer comments constructively:
   - "Please add test for error case"
   - "Consider extracting this function for reusability"
   - "Great changelog entry!"
6. Developer iterates, adds improvements
7. Reviewer approves
8. PR merges

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Inconsistent contributions lead to quality issues and reviewer burden
- Stakes: Rework required, slow review cycles, maintainer burnout

**Slide 02** - Contributing Guidelines Overview

- Clear paths for different contribution types
- Code style standards (enforced by linting agent)
- Testing requirements (> 80% coverage)
- Review process (reviewers and approval criteria)
- Community standards (respectful collaboration)

**Slide 03** - Types of Contributions

- **Bug fixes**: Target specific issues, tested against regression
- **Features**: New capabilities, full tests and documentation
- **Documentation**: Clarifications, examples, standards compliance
- **Tests**: Improving coverage, adding integration tests
- **Refactoring**: Improving code quality, no behavior changes
- **Dependencies**: Updating packages with security/compatibility review

**Slide 04** - Contribution Selection

- **For beginners**: Look for issues labeled `good-first-issue`
- **For experience**: Issues labeled `help-wanted`
- **Feature ideas**: Check ROADMAP.md for planned work
- **Documentation**: Look for missing docs or outdated information
- **Questions first**: Comment on issue before starting major work

**Slide 05** - Code Style Standards

- **Language**: JavaScript/TypeScript
- **Formatting**: Prettier auto-formats (run `npm run format`)
- **Naming**: camelCase for variables, PascalCase for classes/components
- **Line length**: Preferably < 100 characters
- **Comments**: Only WHY, not WHAT (code should be self-documenting)
- **No console logs**: Remove before committing
- **No commented code**: Delete instead of commenting out

**Slide 06** - Testing Requirements

- **Minimum coverage**: > 80% for new code
- **Unit tests**: Test individual functions/modules
- **Integration tests**: Test workflows end-to-end
- **Test naming**: `describe('feature', () => it('should...', () => {}))`
- **Mocking**: Mock external dependencies for isolation
- **Fixtures**: Use realistic test data
- **No skipped tests**: Remove `it.skip()` before committing

**Slide 07** - Documentation Standards

- **Comments**: Explain non-obvious logic, complex algorithms
- **README updates**: Document new features
- **Changelog**: Update CHANGELOG.md per Keep-a-Changelog format
- **Inline docs**: Add JSDoc comments for public functions
- **Examples**: Include usage examples for new features
- **DEVELOPMENT.md**: Update setup/architecture docs if relevant

**Slide 08** - Commit Message Standards

- **Format**: `type(scope): subject`
  - type: fix, feat, docs, test, refactor, style, chore
  - scope: what part (e.g., "labeler", "release")
  - subject: concise description (lowercase, < 50 chars)
- **Body**: Explain what and why (not how)
- **Footer**: Reference issues: `Fixes: #1234`
- **Example**:

  ```
  feat(release): add pre-release validation
  
  Validates that pre-releases follow semantic versioning.
  Prevents accidental pre-release publishing.
  
  Fixes: #5678
  ```

**Slide 09** - Pull Request Standards

- **Title**: Clear description of change
- **Description**: What, why, how - fill PR template
- **Linked issue**: Reference related GitHub issue
- **Reviewers**: Request 1-2 reviewers
- **Labels**: Add relevant labels (feature, bugfix, etc.)
- **WIP**: Use draft PR for work-in-progress
- **CI**: Ensure all checks pass before requesting review

**Slide 10** - Code Review Process

- **Automated checks**:
  - Linting (style)
  - Testing (unit + integration)
  - Coverage (> 80%)
  - Security (dependency scanning)
- **Reviewer checklist**:
  - Logic correctness
  - Test quality and coverage
  - Documentation completeness
  - Performance implications
  - Security considerations
- **Approval**: 1 approval required for merge (more for major changes)

**Slide 11** - Responding to Feedback

- **Be respectful**: Reviews are about code, not people
- **Ask questions**: If feedback is unclear, ask for clarification
- **Respond substantively**: Explain your reasoning or make changes
- **Acknowledge good points**: "Great catch, thanks!"
- **Request re-review**: After changes, ask reviewer to re-check
- **Disagreement**: Discuss in PR comments, escalate if needed

**Slide 12** - Performance & Security Considerations

- **Performance**: Don't add expensive operations
- **Bundle size**: Check for unintended size increases
- **Security**: Escape output, validate input, no hardcoded secrets
- **Accessibility**: Ensure UI changes are accessible (WCAG AA)
- **Backwards compatibility**: Don't break existing APIs

**Slide 13** - Community Norms

- **Respectful**: Treat all contributors with respect
- **Inclusive**: Welcome contributors from all backgrounds
- **Code of conduct**: Follow community standards
- **Patience**: Remember reviewers are volunteers
- **Timeliness**: Try to respond to feedback within 24-48 hours
- **No harassment**: Report violations via CODE_OF_CONDUCT.md

**Slide 14** - Common Mistakes & How to Avoid

- **Not running tests locally**: Always run `npm test` before pushing
- **Ignoring linting errors**: Run `npm run lint -- --fix`
- **Low test coverage**: Aim for > 85%, not just 80%
- **Vague commit messages**: Explain what and why
- **Large PRs**: Keep PRs focused and under 400 lines if possible
- **Skipping documentation**: Document all public APIs

**Slide 15** - Close & Next Actions

- Contributing guidelines ensure quality and consistency
- Contribute: Follow standards, ask questions, iterate constructively
- Questions & feedback

## Evidence Anchors

- `.github/CONTRIBUTING.md` - Main contribution guidelines
- `.github/CODE_OF_CONDUCT.md` - Community norms
- `.github/.github/PULL_REQUEST_TEMPLATE.md` - PR template
- `.github/.github/ISSUE_TEMPLATE/` - Issue templates
- `.eslintrc.cjs` or similar - Code style configuration
- `.jest.config.cjs` - Testing configuration

## Design Notes

- **Visual theme**: Quality and standards (checkmarks, quality gates, building blocks)
- **Color palette**: Use constructive colors (greens for good, blues for guidance)
- **Key visuals**: Contribution flow diagram, code style examples (before/after), PR checklist, review process diagram
- **Accessibility**: Clear examples of good/bad code, high contrast for code blocks
- **Animations**: Consider review cycle animation, quality gate progression

## Quality Bar

- Show real examples from repository (anonymized PRs)
- Include actual code style violations and corrections
- Validate standards against actual linting configuration
- Show realistic PR feedback examples
- Include examples of good and bad contributions
- Ensure all evidence references point to current develop branch
