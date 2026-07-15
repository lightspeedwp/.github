# Validation Scripts

These scripts provide lightweight checks for the agent's structured reference files and report template before content is turned into a Google Doc.

## Scripts

- `validate-client-sites.py` validates the expected client-section structure in `references/client-sites.md`
- `validate-report-outline.py` validates that `templates/report-template.md` contains the required report headings

## Notes

These checks validate local agent files and templates.
They do not fully validate the final Google Doc after creation. For Google Docs, use the template and naming conventions to keep reports consistent before writing them to Drive.
