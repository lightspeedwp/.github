---
name: "Reviewer"
description: "Automated PR review agent that posts review summaries, CI status checks, and actionable recommendations for pull requests."
file_type: "agent"
version: "v1.0"
created_date: "2025-12-10"
last_updated: "2025-12-10"
author: "LightSpeed Team"
maintainer: "Ash Shaw"
category: "automation"
status: "active"
visibility: "public"
tags: ["pr-review", "automation", "ci", "quality-gate", "pull-requests"]
language: "en"
references:
  - path: "../../scripts/agents/reviewer.agent.js"
    description: "Main implementation script"
  - path: "../workflows/reviewer.yml"
    description: "GitHub Actions workflow"
  - path: "../instructions/pull-requests.instructions.md"
    description: "PR standards and guidelines"
  - path: "../instructions/coding-standards.instructions.md"
    description: "Coding standards reference"
owners: ["lightspeedwp/maintainers"]
---

# Reviewer Agent

## Purpose

Automatically review pull requests and post comprehensive summaries including CI status, file analysis, changelog presence, and actionable recommendations to help maintainers make informed merge decisions.

## Responsibilities

- **CI Status Monitoring**: Check and report combined CI/CD pipeline status
- **File Analysis**: Review changed files and identify potential issues
- **Changelog Validation**: Verify changelog entries are present when required
- **Review Summary**: Post structured comment with all findings
- **Quality Gates**: Flag PRs that don't meet quality standards

## Workflow Integration

Triggered by the `.github/workflows/reviewer.yml` workflow on:

- Pull request opened
- Pull request synchronized (new commits pushed)
- Pull request ready for review

## Implementation

**Script**: `scripts/agents/reviewer.agent.js`

### Key Functions

1. **run()** - Main orchestrator
   - Fetches PR context
   - Checks CI/CD status
   - Analyses changed files
   - Posts review summary comment

2. **CI Status Check**
   - Queries GitHub combined status API
   - Reports: success, pending, failure, error, or unknown

3. **File Analysis**
   - Lists changed files
   - Identifies file types
   - Flags high-risk changes

4. **Changelog Validation**
   - Checks for CHANGELOG.md updates
   - Can be required or optional (configurable)

### Review Summary Format

```markdown
## 🤖 Automated Review Summary

### CI/CD Status
✅ All checks passing
⏳ Checks pending
❌ Some checks failed

### Changed Files
- `file1.js` - Modified
- `file2.md` - Added
- `file3.test.js` - Modified

### Changelog
✅ Changelog updated
⚠️ No changelog entry found

### Recommendations
- Review test coverage
- Update documentation
- Consider adding migration notes
```

## Configuration

The workflow accepts these inputs:

- `github-token`: GitHub token for API access (required)
- `require-changelog`: Whether to enforce changelog entries (default: `false`)

## Best Practices

1. **Review Automation**: This agent assists reviewers but doesn't replace human code review
2. **CI Integration**: Always wait for CI to complete before merging
3. **Changelog**: Update CHANGELOG.md for user-facing changes
4. **Quick Feedback**: Agent provides instant feedback to PR authors

## Error Handling

- Gracefully handles missing PR context
- Reports API errors without failing the workflow
- Provides dry-run mode for testing

## Related Agents

- [Testing Agent](./testing.agent.md) - Runs test suites
- [Linting Agent](./linting.agent.md) - Code quality checks
- [Labeling Agent](./labeling.agent.md) - PR label automation
- [Release Agent](./release.agent.md) - Release preparation

## Reference Documentation

- [Pull Request Process](../instructions/pull-requests.instructions.md)
- [Coding Standards](../instructions/coding-standards.instructions.md)
- [GitHub Actions Workflows](../../docs/WORKFLOWS.md)

---

*Reviewer Agent - Automated PR quality gates and review assistance*
