---
file_type: "prompt"
title: "Update Mermaid Diagrams"
description: "Refresh Mermaid diagrams across the repository with WCAG 2.2 AA contrast, explicit accessibility metadata, and current repository standards."
mode: "agent"
tools: ["read", "edit", "search", "shell"]
tags: ["mermaid", "documentation", "a11y", "wcag", "colour-contrast", "readme"]
last_updated: "2026-06-18"
---

# Update Mermaid Diagrams

Refresh Mermaid diagrams across the repository to conform with the current standards in `instructions/mermaid.instructions.md`.

## Standards Reference

- **Instructions**: `instructions/mermaid.instructions.md` - required structure, palette, and accessibility rules
- **Validator**: `scripts/validation/validate-mermaid-accessibility.js` - accTitle / accDescr checks
- **Validator**: `scripts/validation/validate-mermaid-colour-contrast.js` - WCAG 2.2 AA colour contrast checks
- **Workflow**: `.github/workflows/readme-audit.yml` and `.github/workflows/readme-update.yml` - audit and update automation

## What to Fix in Every Diagram

### 1. Required accessibility header block

Every `\`\`\`mermaid` block must open with an accessibility header before the diagram type:

```text
---
accTitle: Short accessible title (max 80 chars)
accDescr: One-sentence description of what the diagram shows.
---
flowchart LR
    ...
```

Use the block form for complex diagrams:

```text
---
accTitle: Title here
accDescr {
  Multi-sentence description for screen readers.
}
---
```

Remove any legacy inline `accTitle` / `accDescr` attributes that appear after the diagram type line.

### 2. Approved colour palette

Replace every `style` or `classDef` declaration that sets a `fill:` colour with an approved triple. Choose the role that best matches the node's meaning:

| Role | fill | color | stroke |
|------|------|-------|--------|
| Information | `#dbeafe` | `#1e3a5f` | `#1e3a5f` |
| Success | `#dcfce7` | `#14532d` | `#14532d` |
| Warning | `#fef3c7` | `#4a2c00` | `#b45309` |
| Error / Alert | `#fee2e2` | `#7f1d1d` | `#b91c1c` |
| Documentation | `#f3e8ff` | `#3b0764` | `#7e22ce` |
| Neutral | `#f1f5f9` | `#0f172a` | `#334155` |
| Highlight | `#ecfdf5` | `#064e3b` | `#059669` |

Example:

```text
style A fill:#dbeafe,color:#1e3a5f,stroke:#1e3a5f
style B fill:#ecfdf5,color:#064e3b,stroke:#059669
style C fill:#dcfce7,color:#14532d,stroke:#14532d
```

### 3. Diagram type and direction

- Prefer `flowchart` over `graph`.
- Always specify direction: `flowchart LR`, `flowchart TD`, etc.

### 4. Emoji vocabulary

Use the canonical mapping from `instructions/mermaid.instructions.md`:

- 👤 Developer/user, 📁 Repository, ⚙️ Automation, 📋 Instructions, 🤖 AI,
  📝 Template, 🏷️ Labels, 🛡️ Security, 📊 Report, 🚀 Deploy,
  ✅ Passed, ❌ Failed, ⚠️ Warning, 🌐 External, 🏛️ Organisation,
  🧪 Tests, 🔒 Protected

### 5. Content accuracy

Update diagram content to reflect the current codebase. Check:

- Node labels against actual file/folder names
- Connection logic against real workflows
- Subgraph titles against current repository structure

## Process

1. Run the Mermaid validators to identify all affected files:

   ```bash
   npm run validate:mermaid-accessibility
   npm run validate:mermaid-contrast
   ```

2. For each file with findings, open it and apply the fixes above.

3. After fixing all files, run the full Mermaid suite:

   ```bash
   npm run validate:mermaid
   ```

4. If a documentation file does not yet contain a diagram, only add one when the visual adds clear value over prose.

## Validation Gate

All Mermaid checks must pass before merging:

```bash
npm run validate:mermaid-syntax
npm run validate:mermaid-accessibility
npm run validate:mermaid-contrast
```
