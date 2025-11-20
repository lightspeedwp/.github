---
title: "Claude: CLAUDE.md & Subagents"
description: "Guide to Anthropic Claude's CLAUDE.md and subagent configuration with YAML frontmatter."
last_updated: "2025-10-21"
version: "v0.1.0"
owners:
  - "lightspeedwp/maintainers"
file_type: "documentation"
category: "claude"
tags: ["claude", "agents", "subagents", "yaml"]
language: "en"
status: "active"
visibility: "public"
---

# Claude: CLAUDE.md & Subagents

Configure Anthropic Claude with project-wide instructions and specialized subagents.

## Example CLAUDE.md

```markdown
# Claude Instructions

- Use PHPDoc for all public functions.
- Prefer WordPress core APIs over custom implementations.
- Security: always sanitize and escape user inputs.
```

## Example Claude Subagent

```yaml
---
name: "wp-security-review"
description: "Audits code for escaping/sanitisation/nonces/cap checks"
tools: ["Read"]
---
# WP Security Review Agent

* Scan changed PHP files for unescaped output and unsanitised input.
* Verify nonces and capability checks for actions.
* Report concrete fixes with code examples.
```
