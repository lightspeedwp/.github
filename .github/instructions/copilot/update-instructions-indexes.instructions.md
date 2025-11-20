---
file_type: "instructions"
title: "Update All Instructions Indexes"
description: "Guide for reviewing and updating all Copilot and LightSpeedWP instruction indexes."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["LightSpeedWP Engineering"]
tags: ["copilot", "instructions", "indexes", "ai"]
status: "active"
apply_to:
  [
    ".github/instructions/*.instructions.md",
    ".github/instructions/copilot/*.instructions.md",
  ]
references:
  - "../copilot.instructions.md"
  - "../custom-instructions.md"
  - "../coding-standards.instructions.md"
  - "../../README.md"
---

# Update All Instructions Indexes

## Steps

1. **Review all index files:**
   - [.github/instructions/copilot.instructions.md](../copilot.instructions.md)
   - [.github/instructions/tests.instructions.md](../tests.instructions.md)
   - [.github/instructions/agents.instructions.md](../agents.instructions.md)
   - [.github/instructions/workflows.instructions.md](../workflows.instructions.md)
2. **Verify all references are accurate and up-to-date.**
3. **Add any new instructions or templates to the appropriate index.**
4. **Check that all files use the correct frontmatter format and status.**
5. **Document your changes and open a PR for review.**

---

Always keep indexes synchronized with actual content to avoid broken references and outdated documentation.
