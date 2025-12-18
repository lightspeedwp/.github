# Copilot Processing Log

## Request Details

- User wants to update Mermaid diagrams per `.github/prompts/update-mermaid-diagrams.prompt.md` and follow `.github/instructions/mermaid.instructions.md` while validating and improving diagrams.
- Need to audit diagram usage, accessibility, placements, and produce updates as guided.
- Output should follow instructions for mermaid diagrams (WCAG AA, metadata, etc.).

## Action Plan

1. **Inventory diagrams** — Search the repository for existing Mermaid diagrams (README, docs, `.github/` files). Document which files have diagrams that require validation or updating and note any missing alt/context. (Dependency: none.) ✅
2. **Review instructions** — Re-read `mermaid.instructions.md` and relevant README placement guidance so updates respect WCAG AA palette choices, metadata, and prose context. (Dependency: reference files must be in place.) 🟡
3. **Audit target files** — For each diagram from step 1, check contrast, `accTitle`/`accDescr`, prose summaries, and placement according to the prompt. Capture findings to inform edits. (Dependency: inventory from step 1.) ⚪
4. **Apply updates** — Modify identified Mermaid diagrams to meet requirements (diagram blocks, metadata, palette, alt descriptions, splits if needed). Add or refresh nearby prose as needed. (Dependency: audit insights.) ⚪
5. **Validate + document** — Re-check updated diagrams (syntax, palette, metadata) and optionally summarize results for the user, noting any outstanding concerns or next steps. (Dependency: completion of updates.) ⚪
