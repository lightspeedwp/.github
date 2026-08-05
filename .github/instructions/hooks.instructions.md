---
file_type: "instructions"
title: "Hook File Instructions"
description: "Guidelines for authoring portable guardrail hooks with explicit inputs, outputs, and safety outcomes"
scope: "repo-local"
version: "v1.0"
last_updated: "2026-05-29"
owners: ["LightSpeed Team"]
tags: ["hooks", "guardrails", "safety", "automation", "validation"]
applyTo: ["hooks/**/*.md"]
status: "active"
---

# LightSpeed Hook File Instructions

Create reusable, safety-focused hooks for pre-commit, CI/CD, and automation workflows. Hooks must have explicit guardrails and clear documentation.

## General Rules

- Hook files are stored in `hooks/` at repository root
- Each hook must have a clear purpose and trigger condition
- Document all inputs, outputs, and side effects explicitly
- Include safety constraints and guardrails upfront
- Test hooks locally before committing
- Use descriptive file names (e.g., `validate-commit-message.md`)

## Hook Frontmatter

- `title` — Descriptive name of the hook
- `description` — What it validates or enforces
- `version` — Semantic version
- `scope` — "organization-wide" (for reusable hooks) or "repo-local"
- `trigger` — When hook runs (pre-commit, pre-push, CI, etc.)
- `exit_code` — Success (0) and failure codes
- `tags` — Searchable keywords

## Hook Structure

1. **Purpose** — What safety risk or validation this hook addresses
2. **Trigger** — When and how the hook executes
3. **Input** — What data/files the hook receives
4. **Validation Rules** — Specific checks performed
5. **Output** — Success/failure messages
6. **Guardrails** — Constraints and limitations
7. **Examples** — Sample passing and failing cases

## Safety Requirements

All hooks must:

- Fail safely (err on the side of caution)
- Have clear error messages
- Not require user secrets or credentials
- Be reversible or non-destructive
- Document any system changes
- Include rollback instructions if applicable

## Testing Hooks

- Test locally with various file types and edge cases
- Verify exit codes match documentation
- Ensure error messages are helpful
- Test on both success and failure paths

---

## Related Files

- [automation.instructions.md](./automation.instructions.md) — Automation standards and workflow integration
- [coding-standards.instructions.md](./coding-standards.instructions.md) — Code quality standards hooks enforce

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
