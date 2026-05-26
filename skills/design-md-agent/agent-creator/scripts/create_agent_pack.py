#!/usr/bin/env python3
"""Create a blank agent design pack scaffold."""

from __future__ import annotations

import argparse
import re
from pathlib import Path


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "agent"


def title(value: str) -> str:
    return " ".join(part.capitalize() for part in re.split(r"[\s_-]+", value.strip()) if part)


def write(path: Path, content: str, force: bool) -> None:
    if path.exists() and not force:
        raise FileExistsError(f"refusing to overwrite existing file: {path}")
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a blank agent design pack scaffold.")
    parser.add_argument("name", help="agent name, for example 'pre-call researcher'")
    parser.add_argument("--out", default=".", help="output directory")
    parser.add_argument("--force", action="store_true", help="overwrite existing files")
    args = parser.parse_args()

    slug = slugify(args.name)
    display = title(args.name)
    root = Path(args.out).expanduser().resolve() / slug
    root.mkdir(parents=True, exist_ok=True)

    files = {
        "README.md": f"""
# {display} Agent Pack

Use this folder to review, test, and iterate the {display} agent.

## Files

- `AGENT_REQUIREMENTS.md` - requirements and scope.
- `AGENT_SYSTEM_PROMPT.md` - copy-ready agent prompt.
- `TOOL_AND_PERMISSION_MATRIX.md` - access rules and approval gates.
- `OUTPUT_TEMPLATES.md` - reusable output structures.
- `QUALITY_CHECKLIST.md` - acceptance and test checks.
- `FILE_MANIFEST.md` - file list and purpose.

## Next steps

1. Fill the requirements doc.
2. Draft or refine the system prompt.
3. Test against happy-path, missing-context, stale-source, write-approval, and out-of-scope scenarios.
""",
        "AGENT_REQUIREMENTS.md": f"""
# Workspace Agent Requirements Doc: {display}

## Agent mission

[What does the agent do? What output does it produce?]

## Scope and boundaries

1. [Task 1]
2. [Task 2]
3. [Task 3]

**Out of scope**

- [Boundary]

## Inputs and trusted context

[What information does this agent need to know to be successful?]

## Tools and permissions

| Tool/source | Access | Purpose | Approval required? | Notes |
|---|---|---|---|---|
| [Tool] | Read-only | [Purpose] | No | [Notes] |

## Output requirements

[What should the agent produce by the end of the workflow?]

## Quality checklist

- [ ] [Quality check]

## Human-in-the-loop and escalations

[When should the agent stop and ask for assistance or review?]

## Assumptions and open questions

| Type | Item | Impact | Recommended default |
|---|---|---|---|
| Assumption | [Assumption] | [Impact] | [Default] |
""",
        "AGENT_SYSTEM_PROMPT.md": f"""
# {display} Agent System Prompt

```markdown
# {display}

## Mission
You are {display}. Your job is to [mission]. You produce [deliverable] for [target user/team].

## Workflow
1. Understand the request.
2. Gather required inputs and trusted context.
3. Identify gaps, risks, and assumptions.
4. Produce the required output using the approved template.
5. Add review notes and next actions.

## Tool and source rules
- Use trusted sources before general knowledge.
- Default to read-only access.
- Draft write actions for review; do not execute them without approval.

## Output format
[Output template]

## Escalation rules
Stop and ask for human review when information is missing, stale, contradictory, sensitive, or requires a write action.
```
""",
        "TOOL_AND_PERMISSION_MATRIX.md": """
# Tool and Permission Matrix

| Tool/source | Required? | Access | Purpose | Freshness requirement | Human approval gate | Risk notes |
|---|---:|---|---|---|---|---|
| [Tool/source] | Yes | Read-only | [Purpose] | [Freshness] | No | [Risk] |
""",
        "OUTPUT_TEMPLATES.md": """
# Output Templates

## Default output

```markdown
# [Deliverable Title]

## Summary
- Value: [Value]
- Risk: [Risk]
- Next step: [Next step]

## Main output
[Content]

## Assumptions
[Assumptions]

## Open questions
[Questions]

## Review checklist
- [ ] [Check]
```
""",
        "QUALITY_CHECKLIST.md": """
# Quality Checklist

- [ ] Mission is clear.
- [ ] Scope and boundaries are explicit.
- [ ] Inputs and trusted sources are listed.
- [ ] Read and write permissions are separated.
- [ ] Output format is copy-ready.
- [ ] Assumptions and risks are labelled.
- [ ] Human review gates are clear.

## Test scenarios

1. Complete inputs.
2. Missing source.
3. Contradictory source.
4. Write action requiring approval.
5. Out-of-scope request.
""",
        "FILE_MANIFEST.md": """
# File Manifest

| File | Required? | Purpose | Owner |
|---|---:|---|---|
| README.md | Yes | Usage guide | [Owner] |
| AGENT_REQUIREMENTS.md | Yes | Requirements and scope | [Owner] |
| AGENT_SYSTEM_PROMPT.md | Yes | Copy-ready prompt | [Owner] |
| TOOL_AND_PERMISSION_MATRIX.md | Yes | Tool and permission rules | [Owner] |
| OUTPUT_TEMPLATES.md | Yes | Reusable output formats | [Owner] |
| QUALITY_CHECKLIST.md | Yes | Acceptance checks | [Owner] |
""",
    }

    for filename, content in files.items():
        write(root / filename, content, args.force)

    print(root)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
