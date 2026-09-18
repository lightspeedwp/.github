"""Schema-to-template and example alignment validator specification.

Checks:
- Every schema field has a matching place in the relevant template.
- Every template field maps back to a schema field or a documented display-only field.
- Every example uses the current paired template structure.
- Every example satisfies the paired schema conceptually.
- No example uses outdated headings.
- No template has required output fields missing from the schema.
- No schema has fields that cannot appear in an output.

Must validate these pairs:
- schemas/budget-health-report.schema.json
  - templates/budget-health-report.template.md
  - examples/budget-health.example.md
- schemas/unbilled-time-report.schema.json
  - templates/unbilled-time-report.template.md
  - examples/unbilled-time.example.md
- schemas/invoice-opportunity.schema.json
  - templates/invoice-opportunity-report.template.md
  - examples/invoice-opportunity.example.md
- schemas/project-hygiene-report.schema.json
  - templates/project-hygiene-report.template.md
  - examples/project-hygiene.example.md
- schemas/retainer-health-report.schema.json
  - templates/retainer-health-report.template.md
  - examples/retainer-health.example.md
- schemas/weekly-ops-summary.schema.json
  - templates/weekly-ops-summary.template.md
  - examples/weekly-ops-summary.example.md

Severity rules:
- Missing schema-to-template mapping -> Error
- Example not matching template -> Warning
- Display-only field missing from schema but documented as display-only -> Notice
"""
