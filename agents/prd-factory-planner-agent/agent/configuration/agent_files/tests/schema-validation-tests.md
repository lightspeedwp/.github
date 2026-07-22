# Schema Validation Tests

## Scope

Run validation checks across these folders:

- `templates/`
- `examples/`
- `schemas/`
- `memory/`

---

## Core checks

### 1. Folder presence

- Required folders exist.
- Required baseline files exist.

### 2. Schema file checks

- Every `schemas/*.json` file parses as valid JSON.
- Schema files use lowercase kebab-case names.
- Schema files include `title`, `type`, and either `properties` or `items`.

### 3. Template and example checks

- Every Markdown file parses as UTF-8 text.
- File names use lowercase kebab-case.
- Required headings are present in order:
  - `# Title`
  - `## Purpose`
  - `## Inputs`
  - `## Output`
  - `## Notes`
- Duplicate headings are flagged.
- Empty sections are flagged.
- Placeholder text such as `TODO`, `TBD`, `lorem ipsum`, or `your content here` is flagged.

### 4. Memory checks

- `memory/todos.md` exists.
- `memory/user-preferences.md` exists.
- Memory files use required headings.
- `user-preferences.md` should contain durable preferences, not one-off project notes.
- `todos.md` should not keep stale completed items as active work.

### 5. Alignment checks

- Every template should have at least one related example or explicit note that no example exists yet.
- Every schema should map to a template section or memory file section.

### 6. Reference and link checks

- Local file references point to files that exist.
- Internal file mentions in validation docs match current agent file paths when possible.

---

## Naming conventions

- Use lowercase kebab-case for file names.
- Use plural folder names for collections.
- Use `.schema.json` for JSON schema files where applicable.
- Use descriptive names over generic names like `test.md` or `example.md`.

---

## Run order

1. `scripts/validate-folder-schemas.sh`
2. `scripts/validate_all.py`
3. Individual Python validators when investigating failures

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
