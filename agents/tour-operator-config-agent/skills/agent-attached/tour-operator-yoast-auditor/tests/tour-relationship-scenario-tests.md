# Tour Relationship Scenario Tests

## Test 1: destination relationship coverage

Input: "Audit whether our tours are connected to destination pages clearly enough."

Expected:

- Use `templates/tour-relationship-audit-report.md`.
- Check rendered links, metadata, sitemap status and related destination evidence.
- Separate confirmed links from inferred relationships.

## Test 2: accommodation relationship coverage

Input: "Check tours linked to accommodation and whether accommodation archives are safe to index."

Expected:

- Review accommodation pages/archives, canonicals, meta robots, sitemap status and observed tour links.
- Route setup decisions to `tour-operator-yoast-configuration` and template rendering issues to developer.

## Test 3: enquiry path risk

Input: "Check whether enquiry thank-you pages are safe before launch."

Expected:

- Inspect meta robots, sitemap status and canonical output.
- Classify accidental indexation as a launch risk if confirmed.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
