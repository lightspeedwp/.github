---
"title": "Use Connectors Prompt Template"
"description": "Template for requesting data retrieval from internal sources via connectors."
"last_updated": "2025-10-17"
"version": "v1.0"
"owners":
  - "LightSpeed Engineering"
"file_type": "documentation"
---

# Purpose

This template helps you compose a prompt that instructs ChatGPT to fetch information from internal sources using authorised connectors.

# Paste or reference instructions

Ensure the **Use Connectors Instructions** are loaded or included. They define how to search safely and respect privacy.

# User input checklist

- [ ] Identify the connector to use (Google Drive, GitHub or Gmail).
- [ ] Provide search keywords or file names.
- [ ] Define the scope (repository, folder, date range, labels).
- [ ] State what information you need (summary, specific section, metadata).
- [ ] Clarify any privacy considerations.

# System constraints

- Do not attempt to write or modify data.
- Respect the connector’s API limits and your permission scope.

# Example first message to Copilot

```
Use the Google Drive connector to search for “Project Phoenix Kickoff Notes”. Summarise the main decisions and action items from the most recent document containing these keywords. Please cite the lines you reference.
```

# Verification steps

- Ensure the connector used matches the request.
- Check that the summary includes citations.
- Confirm that private or sensitive information is omitted unless authorised.
