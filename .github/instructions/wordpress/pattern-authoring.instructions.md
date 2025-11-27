# Instruction — Pattern Authoring

**Goal:** Produce a file‑based WordPress block pattern (PHP) for `/patterns/`.

## Steps

1. Confirm the **type** (section / starter page / template-type / block-type).
2. Choose a **slug** using `lsx/<area>-<purpose>-<variant>` and a Title in Title Case.
3. Draft a pattern header containing: Title, Slug, Description, Categories, Keywords, Viewport width.
4. Add **targeting** headers where needed: `Block Types`, `Post Types`, `Template Types`, `Inserter`.
5. Write block markup with **i18n**, **escaping**, and **no inline CSS**.
6. Add **locking** for layout-critical containers and consider **content-only editing**.
7. Use **theme.json** tokens. Never hard-code colours/spacing.
8. Add meaningful ALT placeholders; ensure headings follow hierarchy.
9. Keep nesting shallow and performant.

## Output Spec

- One self-contained PHP pattern file (no extra dependencies).
- Include a short rationale and a post-code checklist.
