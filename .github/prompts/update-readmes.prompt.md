---
name: "Update READMEs"
description: "Regenerate README files to match LightSpeed standards, including structure, Mermaid diagram policy, and references."
mode: "agent"
tools: ["read", "edit", "search", "shell"]
---

# Update READMEs Prompt

## Purpose

Regenerate or update README files to align with `readme.instructions.md`, use diagram craft rules from `mermaid.instructions.md`, and respect file placement from `file-organisation.instructions.md`.

## Steps

1. **Gather Standards**
   - Load `.github/instructions/readme.instructions.md` (structure, required sections, Mermaid usage rules).
   - Load `.github/instructions/mermaid.instructions.md` (how to craft/validate diagrams).
   - Load `.github/instructions/file-organisation.instructions.md` (ensure files stay in correct locations).

2. **Audit Targets**
   - Identify README(s) to update (single file or folder).
   - Check existing sections, links, commands, and diagrams against the standards checklist.

3. **Apply Structure**
   - Ensure frontmatter (description, last_updated; file_type if required).
   - Include Overview, Structure, Usage/How to Run, Validation/Testing, Governance Links, References.
   - Add folder-specific content (agents, workflows, prompts, schemas, tests, scripts) per `readme.instructions.md`.

4. **Mermaid Diagrams**
   - Decide necessity per `readme.instructions.md` (mandatory/optional/unnecessary).
   - Craft diagrams using `mermaid.instructions.md` (labelled nodes/edges, alt text, size limits).
   - Place diagrams after Overview or before detailed sections; describe them in prose.

5. **Validation**
   - Verify links and commands.
   - Use UK English spelling and naming conventions.
   - Ensure compatibility with `meta.agent` (badges/footer) and `linting.agent` (lint/test instructions accurate).

6. **Output**
   - Update the target README(s) in place.
   - Summarise changes and call out any intentionally skipped sections/diagrams.

## References

- `.github/instructions/readme.instructions.md`
- `.github/instructions/mermaid.instructions.md`
- `.github/instructions/file-organisation.instructions.md`
