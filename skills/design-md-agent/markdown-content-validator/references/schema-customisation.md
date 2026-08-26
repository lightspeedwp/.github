# Schema Customisation

The validator reads schema rules from `references/frontmatter.schema.yaml` or another schema path provided with `--schema`.

## Safe customisations

You can adapt the schema by changing:

- required fields
- allowed properties
- enum values
- string length limits
- property count limits
- whether additional properties are allowed
- array item constraints
- regex patterns such as the `version` rule

## Guidance

- Keep `version` required unless the project intentionally drops version validation.
- Tighten enums or field limits in the schema, not in the script.
- Prefer schema changes over hard-coding project-specific logic in `validate_markdown_content.py`.
- If a project already has a stronger compatible schema, keep that schema and point the script at it.
