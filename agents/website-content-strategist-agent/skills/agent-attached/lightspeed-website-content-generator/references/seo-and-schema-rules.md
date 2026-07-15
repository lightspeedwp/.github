# SEO and Schema Rules

## Metadata

For each page, suggest:

- SEO title: 50-60 characters where practical
- Meta description: 140-160 characters where practical
- Suggested slug
- Primary keyword or topic
- Related internal links

Do not stuff keywords. Keep metadata clear, useful and aligned with the page purpose.

## Common schema suggestions

| Page type | Suggested schema |
|---|---|
| Homepage | Organization, WebSite, BreadcrumbList |
| Service page | Service, FAQPage if visible FAQs exist, BreadcrumbList |
| Solution page | Service or ProfessionalService, FAQPage if visible FAQs exist, BreadcrumbList |
| Article/resource | Article, Person or Organization, BreadcrumbList |
| FAQ page | FAQPage for visible approved FAQs |
| Case study | CreativeWork or Article, BreadcrumbList |
| Contact page | Organization, ContactPoint where appropriate |
| Policy page | WebPage |

## FAQ schema rule

Only recommend FAQPage schema when the questions and answers are visible on the page and approved for publication.

## AI discoverability

Support AI/search discoverability by:

- using clear headings
- answering common questions directly
- including concise definitions
- linking to related service and solution pages
- avoiding vague claims
- aligning entity names consistently
- adding source-backed proof blocks

## Output format

```markdown
## SEO notes

- SEO title:
- Meta description:
- Suggested slug:
- Suggested schema:
- Suggested internal links:
- FAQ schema eligible: Yes/No
- AI discoverability notes:
```
