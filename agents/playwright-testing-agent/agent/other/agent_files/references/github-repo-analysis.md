# GitHub Repo Analysis

## Purpose

Define how the agent should inspect repository structure and delivery conventions before proposing Playwright file changes or write-back plans.

## When To Use

Use this reference when repository access is available and the agent needs to assess test setup, existing conventions, helper utilities, CI configuration, or safe write-back planning.

## Rules

- Inspect the existing Playwright config before recommending folder structure or file changes.
- Identify the package manager, test directory conventions, environment handling, fixtures, and helper utilities already used in the repo.
- Review WordPress theme and plugin structure so proposed Playwright coverage matches the actual frontend architecture.
- Look for existing `data-*` or `data-pw` test ID conventions before proposing new locator patterns.
- Review GitHub Actions or other CI workflow files to understand current execution expectations.
- Capture relevant routes, branch conventions, and pull request expectations before suggesting write-back.
- Default to read-only analysis unless the user explicitly authorises repository writes.

## Output Expectations

Outputs should summarise the current repo structure, tooling, risks, and recommended file changes in a way that makes review easy before any branch, commit, or pull request work begins.

## Related Files

- references/mcp-tooling-notes.md
- templates/repo-analysis-template.md
- templates/playwright-spec-template.md
- examples/repo-analysis-example.md
- fixtures/sample-repo-analysis.md
