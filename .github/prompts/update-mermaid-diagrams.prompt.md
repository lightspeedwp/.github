---
file_type: "prompt"
title: "Update Mermaid Diagrams"
description: "Refresh Mermaid diagrams across the repository or targeted paths with WCAG 2.2 AA colour contrast, updated content, and current standards."
mode: "agent"
tools: ["read", "edit", "search", "shell"]
tags: ["mermaid", "documentation", "a11y", "wcag", "colour-contrast", "readme"]
last_updated: "2026-06-19"
---

# Update Mermaid Diagrams

Refresh Mermaid diagrams across the repository to conform with the v2.0 standards in `instructions/mermaid.instructions.md`.

## Standards Reference

- **Instructions**: `instructions/mermaid.instructions.md` — v2.0 approved palette, required structure, emoji vocabulary
- **Validator**: `scripts/validation/validate-mermaid-colour-contrast.js` — WCAG 2.2 AA contrast checker
- **Workflow**: `.github/workflows/validate-mermaid-pr.yml` — PR enforcement

## What to Fix in Every Diagram

### 1. Required accessibility attributes — inline format only

Every ` ```mermaid ` block must have `accTitle` and `accDescr` placed **inline**, immediately after the diagram type and before any nodes. GitHub's Mermaid renderer does **not** support the YAML `---` front-matter syntax — diagrams using it will show an error instead of rendering.

**Correct format:**

```text
flowchart LR
    accTitle: Short accessible title (max 80 chars)
    accDescr: One-sentence description of what the diagram shows.
    ...
```

Use the block form for complex diagrams:

```text
flowchart TD
    accTitle: Title here
    accDescr {
      Multi-sentence description for screen readers.
    }
    ...
```

**Do NOT use** the YAML front-matter form (it breaks GitHub rendering):

```text
❌ WRONG — GitHub cannot render this:
---
accTitle: Title
accDescr: Description
---
flowchart LR
    ...
```

Remove any YAML `---` header blocks and replace them with inline attributes as shown above.

### 2. Approved colour palette — replace ALL old `style` declarations

Replace every old `style X fill:#colour` (single property) with an approved triple. Choose the role that best matches the node's meaning:

| Role | fill | color | stroke |
|------|------|-------|--------|
| Information (entry points, primary) | `#dbeafe` | `#1e3a5f` | `#1e3a5f` |
| Success (outputs, completed) | `#dcfce7` | `#14532d` | `#14532d` |
| Warning (caution, external) | `#fef3c7` | `#4a2c00` | `#b45309` |
| Error / Alert (failure, blockers) | `#fee2e2` | `#7f1d1d` | `#b91c1c` |
| Documentation (specs, instructions, AI) | `#f3e8ff` | `#3b0764` | `#7e22ce` |
| Neutral (connectors, supporting) | `#f1f5f9` | `#0f172a` | `#334155` |
| Highlight (automation, key actions) | `#ecfdf5` | `#064e3b` | `#059669` |

Example:

```text
style A fill:#dbeafe,color:#1e3a5f,stroke:#1e3a5f
style B fill:#ecfdf5,color:#064e3b,stroke:#059669
style C fill:#dcfce7,color:#14532d,stroke:#14532d
```

### 3. Diagram type and direction

- Prefer `flowchart` over `graph` (current Mermaid standard).
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

1. Run the contrast validator to get the full list of affected files:

   ```bash
   npm run validate:mermaid-contrast
   ```

2. For each file with findings, open it and apply the fixes above.

3. After fixing all files, run the full suite to confirm zero failures:

   ```bash
   npm run validate:mermaid
   ```

4. If adding new diagrams to README files that don't have one, ensure the diagram accurately represents what that file/folder contains.

## Validation Gate

All three checks must pass before committing:

```bash
npm run validate:mermaid-syntax        # diagram type, direction, bracket matching
npm run validate:mermaid-accessibility # accTitle and accDescr present
npm run validate:mermaid-contrast      # WCAG 2.2 AA colour contrast
```
