---
mode: "agent"
description: "Normalise all .github docs and configs to the canonical label + issue-type strategy, fix frontmatter references, and align human-readable references across the repo."
model: "gpt-4.1"
tools: ["codebase", "search", "editFiles"]
---

# Normalise .github Documentation for Labels, Issue Types, and Frontmatter

## 0. Goal

You are working on the `lightspeedwp/.github` repository, branch **`recover/readmes`**.  
Your job is to:

1. **Align configuration** (`labels.yml`, `labeler.yml`, `issue-types.yml`) with the agreed label & issue-type strategy.
2. **Normalise documentation** in `docs/` and `.github/` so that:
   - All references to labels and issue types match the canonical configuration.
   - All frontmatter `references` arrays are accurate and machine-useful.
   - All human-readable “References” sections at the bottom of files are correct and in sync with frontmatter.
3. **Remove `type:*` labels from configuration and documentation** while keeping **Issue Types** themselves intact. Classification should be via Issue Type fields, not label prefixes.

Work in **UK English**, preserve the existing structure and tone of each document, and prefer minimal edits that strictly improve consistency.

---

## 1. Inputs & Scope

You have access to:

- The repository contents (including the uploaded zip snapshot for this branch).
- Canonical configuration files in repo root or `.github/`:
  - `.github/labels.yml`
  - `.github/labeler.yml`
  - `.github/issue-types.yml`
- Documentation under:
  - `docs/` (for human-facing guides: `ISSUE_CREATION_GUIDE.md`, `LABEL_STRATEGY.md`, `ORGANIZATION.md`, `PR_CREATION_PROCESS.md`, `WORKFLOWS.md`, `VERSIONING.md`, etc.)
  - `.github/` (community health files, automation governance, AI/agent docs, instructions).
- Frontmatter schema and governance:
  - `docs/FRONTMATTER_SCHEMA.md` (or equivalent)
  - `docs/VERSIONING.md` for version and frontmatter rules.

**Out of scope:**

- Changing core semantics of branching, release, or workflow docs beyond what’s needed to fix labels, links, and references.
- Inventing new labels, issue types, or files that do not exist in the canonical configs.

---

## 2. Hard Constraints

When editing files, always respect these rules:

1. **No `type:*` labels in configuration or docs**
   - Remove `type:*` label definitions from `.github/labels.yml`.
   - Remove `type:*` label usage from `.github/labeler.yml`.
   - Update all docs that currently talk about `type:*` labels (e.g. `LABEL_STRATEGY.md`, `ISSUE_CREATION_GUIDE.md`, `PR_CREATION_PROCESS.md`, `AUTOMATION_GOVERNANCE.md`) so they describe **Issue Types** and Project fields, not `type:*` labels.
   - Keep **Issue Types** as-is in `issue-types.yml` and docs; just stop mirroring them with label prefixes.

2. **Canonical label strategy**
   - Treat `.github/labels.yml` as the single source of truth for:
     - Label names
     - Families (status, priority, area, comp, env, lang, compat, release, meta, contrib, ai-ops, discussion, etc.)
   - Ensure label docs describe labels that actually exist in `labels.yml`:
     - **Add/confirm** families: `env:*`, `compat:*`, `lang:*`, `area:*`, `comp:*`, `meta:*`, `ai-ops:*`, `release:*`, `discussion:*`.
     - **Do not describe** any label that is not defined in `labels.yml`.

3. **Frontmatter schema & references**
   - Follow the frontmatter schema rules from `FRONTMATTER_SCHEMA.md`:
     - Required keys (where applicable) like `file_type`, `title`, `description`, `version`, `last_updated`, `author/maintainer`.
     - `references` is for AI/automation cross-links (machine-facing).
   - For every Markdown file that has frontmatter:
     - Ensure `references:` only includes **existing, valid relative paths**.
     - Do not include external URLs (those should only live in the human “References” section at the bottom).
   - Do **not** introduce new frontmatter keys that are not documented in the schema, unless they already appear consistently elsewhere.

4. **Human “References” sections**
   - Most docs end with a “References” / “Related Documentation” style section.
   - Make sure:
     - Links are valid and point to current files (no `FRONTMATTER-SCHEMA.md` vs `FRONTMATTER_SCHEMA.md` confusion, no `labels-guide.md` if the file has been renamed to `ISSUE_LABELS.md`, etc.).
     - The set of links is consistent with frontmatter `references` (same targets, different formatting).

5. **Repository structure assumptions**
   - Use `docs/ORGANIZATION.md` as the canonical map for where documentation is expected to live. If a link doesn’t match that structure, treat it as suspect and fix it. :contentReference[oaicite:13]{index=13}
   - Keep all paths relative to the current file.

6. **Version fields**
   - Do not arbitrarily bump `version` in frontmatter; only fix obviously incorrect or inconsistent values if needed.
   - Ensure `version` values are syntactically valid SemVer strings and conform to `docs/VERSIONING.md`. :contentReference[oaicite:14]{index=14}

7. **Minimal, targeted edits**
   - Avoid rewriting whole documents. Change only:
     - Label references and descriptions
     - Frontmatter `references`
     - Footer “References” sections
     - Obvious contradictions about label usage (especially `type:*`).
   - Preserve voice, structure, and examples where possible.

---

## 3. High-level Plan (Phases)

### Phase 1 – Build a Canonical Model

1. **Inspect configuration:**
   - Read `.github/labels.yml`, `.github/labeler.yml`, `.github/issue-types.yml`.
   - Construct an internal model of:
     - Label families and members (from `labels.yml`).
     - File/branch → label rules (from `labeler.yml`), excluding type labels.
     - Issue Types (from `issue-types.yml`) → canonical names and colours.

2. **Apply minimal-path label changes (config side):**
   - Remove all `type:*` labels from `.github/labels.yml`.
   - Ensure env/compat/lang/area/comp/meta/ai-ops/release/discussion label families exist and are correctly coloured and described.
   - In `.github/labeler.yml`, remove any rules that assign `type:*` labels; keep status/priority/area/lang rules.
   - Do **not** change `issue-types.yml` beyond what’s necessary to keep it consistent with docs.

3. **Identify canonical label docs:**
   - Treat:
     - `docs/LABEL_STRATEGY.md`
     - `docs/ISSUE_CREATION_GUIDE.md`
     - `docs/PR_CREATION_PROCESS.md`
     - `.github/AUTOMATION_GOVERNANCE.md`
     - `.github/ISSUE_LABELS.md` / `.github/PR_LABELS.md` (if present)
   - …as the primary human-facing label and issue-type docs to reconcile.

### Phase 2 – Normalise Documentation Content

For each Markdown file in `docs/` and `.github/`:

1. **Normalise label semantics:**
   - Search for any mention of `type:*` labels.
     - Replace with wording that refers to **Issue Types** and Project fields, not labels. E.g., “Select an Issue Type (Bug, Feature, Task…)” rather than “Apply `type:bug`”.
   - Ensure label family descriptions match the canonical model built from `labels.yml`:
     - Status, priority, area/comp, env, compat, lang, release, meta, contrib, ai-ops, discussion.
   - Where docs currently list label examples that no longer exist, update them to valid labels or remove the examples.

2. **Align branching / workflow docs with label strategy:**
   - In `BRANCHING_STRATEGY.md` and `WORKFLOWS.md`, ensure:
     - They say Issue Types + project fields carry the semantics.
     - Labels are described as **routing and automation signals** (status, priority, area, etc.), not as a parallel type system.

3. **Normalise discussion/community labels:**
   - Ensure `LABEL_STRATEGY.md` and any community docs use the canonical `discussion:*` family (e.g., `discussion:community`, `discussion:showcase`) instead of bare `community`, `showcase`, etc. :contentReference[oaicite:19]{index=19}

4. **Fix frontmatter metadata:**
   - Where frontmatter exists:
     - Ensure keys follow `FRONTMATTER_SCHEMA.md`.
     - Correct any outdated paths in `references` to match the current repo structure and filenames.
   - Do not add frontmatter to files that currently have none, unless clearly required for governance or instructions.

5. **Fix footer “References” / “Related Documentation”:**
   - Update each link to:
     - Point to the right file (e.g., `FRONTMATTER-SCHEMA.md` → `FRONTMATTER_SCHEMA.md`, `labels-guide.md` → `ISSUE_LABELS.md`, etc.).
     - Use consistent link text (e.g. “Issue Labels Guide”, “Issue Types Guide”, “Automation Governance”).
   - Ensure that for each path in frontmatter `references`, there is a corresponding human-readable link in the footer (and vice versa), unless it would be redundant.

6. **Respect organisation doc:**
   - Cross-check against `docs/ORGANIZATION.md`:
     - If a document claims another file exists somewhere else, update the link to match the structure defined in `ORGANIZATION.md`. :contentReference[oaicite:22]{index=22}

### Phase 3 – Validation & Reporting

1. **Self-checks:**
   - Search the entire workspace for `type:` labels in YAML and Markdown:
     - `type:` in `labels.yml` → should only exist as values in `issue-types.yml`, not label names.
     - `type:` in docs → should not suggest adding `type:*` labels to issues/PRs.
   - Check for references to:
     - `FRONTMATTER-SCHEMA.md` (should be `FRONTMATTER_SCHEMA.md` or whatever the canonical filename is). :contentReference[oaicite:23]{index=23}
     - `labels-guide.md` (should be the current label doc: `ISSUE_LABELS.md` or `LABEL_STRATEGY.md`).
   - Ensure all `references:` frontmatter entries resolve to existing paths.

2. **CI alignment:**
   - Ensure that any doc references to workflows and agents (`labeling.yml`, `labeling.agent.js`, release workflows, frontmatter validation workflow) match actual filenames in `.github/workflows/` and `.github/agents/`.

3. **Output a summary (for humans):**
   - List:
     - Which files had `type:*` label references removed/rewritten.
     - Which docs had frontmatter `references` updated.
     - Which docs had footer “References” updated.
     - Any remaining ambiguous or suspect links you couldn’t confidently fix.

---

## 4. File-by-File Priority Checklist

When you run, prioritise edits in this order:

1. **Configuration:**
   - `.github/labels.yml`
   - `.github/labeler.yml`
   - `.github/issue-types.yml` (verify, do not heavily modify).

2. **Core governance & automation docs:**
   - `.github/AUTOMATION_GOVERNANCE.md`
   - `docs/LABEL_STRATEGY.md`
   - `docs/ISSUE_CREATION_GUIDE.md`
   - `docs/PR_CREATION_PROCESS.md`
   - `docs/WORKFLOWS.md`

3. **Foundational navigation & versioning docs:**
   - `docs/ORGANIZATION.md`
   - `docs/VERSIONING.md`
   - `docs/FRONTMATTER_SCHEMA.md`

4. **Other docs in `docs/` and `.github/` that mention labels, workflows, or automation.**

Handle each file in isolation but keep the **global model** of labels and issue types consistent.

---

## 5. Editing Rules & Style

- Keep language in **UK English** (“labelling”, “behaviour”, etc.).
- Use existing headings and structure; insert new sections only when clearly needed.
- When in doubt about semantics:
  - Prefer not to change the meaning of a document.
  - Add a short clarifying parenthetical note instead of a full rewrite.

---

## 6. Final Deliverables

At the end of your run you should have:

1. **Updated configuration files** with:
   - No `type:*` labels in `labels.yml`.
   - No `type:*` assignments in `labeler.yml`.
   - Unchanged but verified `issue-types.yml`.

2. **Updated documentation** where:
   - All label references match `.github/labels.yml`.
   - All Issue Type references match `.github/issue-types.yml` and do **not** tell users to apply `type:*` labels manually.
   - Frontmatter `references` and footer “References” sections are consistent and valid.
   - Links reflect the current `docs/` and `.github/` structure.

3. **A short machine-readable summary** (e.g. JSON or markdown list) of:
   - Files changed.
   - Types of changes (config/labels, frontmatter, references, text semantics).
   - Any remaining TODOs or ambiguous cases for human review.

---
