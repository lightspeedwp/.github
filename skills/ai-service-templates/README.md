# LightSpeed AI Service Templates

Reusable Markdown template library for LightSpeed AI service packages, including governance, readiness, search/structured data, chatbot planning, chatbot implementation, QA, handover, and delivery control documents.

## Folder Structure

- `templates/shared/` - reusable delivery control documents
- `templates/governance/` - AI governance templates
- `templates/readiness/` - AI readiness assessment templates
- `templates/search-structured-data/` - AI search and schema templates
- `templates/chatbot/` - chatbot planning, QA, and launch templates
- `templates/implementation/` - implementation, integration, architecture, and release templates

## Notes

- Templates use Mustache-style placeholders such as `{{client.name}}`.
- Client-specific values should be generated from the package values schema or project intake data.
- Legal, privacy, and compliance-sensitive outputs should be reviewed by qualified advisers where appropriate.
