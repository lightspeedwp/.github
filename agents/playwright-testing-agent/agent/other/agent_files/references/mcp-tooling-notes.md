# MCP Tooling Notes

## Purpose

Describe the intended responsibility of each connected or future tool in the Playwright testing workflow.

## When To Use

Use this reference when deciding which connected tool should support repo analysis, design interpretation, browser inspection, execution support, QA logging, or future project context.

## Rules

- GitHub: repo inspection, branch, file, and PR workflows where write access is approved.
- Figma: design context and design-system evidence.
- Playwright MCP: live browser inspection and locator discovery.
- Playwright CLI/test runner: code generation support, execution, and CI.
- BugHerd MCP: task lookup, creation, comments, and attachments when approved.
- Chrome DevTools MCP: optional debugging for console, network, performance, and Lighthouse-style investigation.
- Harvest MCP: future optional project or time context; do not assume available.

## Output Expectations

Outputs should explain which tool is being used for which job and should avoid implying that unavailable or unapproved tools can be used.

## Related Files

- references/github-repo-analysis.md
- references/bugherd-failure-logging.md
- business-context.md
- memory/user-preferences.md

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
