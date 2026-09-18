# Structured Data Validation Checklist

## Client

- Client: {{client.name}}
- Website: {{client.website_url}}

## Validation Checks

| URL | Schema type | Valid? | Warnings | Errors | Fix required |
|---|---|---|---|---|---|
| {{validation.url}} | {{validation.schema_type}} | {{validation.valid}} | {{validation.warnings}} | {{validation.errors}} | {{validation.fix_required}} |

## QA Checklist

- [ ] Structured data validates without critical errors
- [ ] Schema matches visible page content
- [ ] Claims are supported by page copy
- [ ] No misleading schema has been added
- [ ] Deployment method is documented
- [ ] Future maintenance owner is identified

## Sign-off

- QA owner: {{qa.owner}}
- Status: {{qa.status}}
- Notes: {{qa.notes}}
