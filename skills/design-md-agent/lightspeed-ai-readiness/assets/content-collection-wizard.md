# Content Collection Wizard Prompt

```text
Use the content-collection-planner workflow.

Create a tailored content collection plan for a client.

First ask:
- Client name
- Website URL
- Project type or sector
- Whether this is a new build, redesign, content audit, AI governance project or chatbot preparation
- Which documents or files are already available

Then build:
1. Generic website content checklist
2. Relevant sector/project add-ons
3. Page-level briefs
4. Source-of-truth register
5. Chatbot suitability flags
6. Content gap report if evidence exists
7. Suggested downloadable folder/zip structure
8. Client email requesting content

Use these status labels:
- Missing
- Received
- Approved
- Needs Rewrite
- Not for Chatbot
- Legal Review

Classify each item as one or more of:
- Website
- Governance
- Chatbot
- Compliance
- Optional

Output in Markdown with spreadsheet-style tables.
```
