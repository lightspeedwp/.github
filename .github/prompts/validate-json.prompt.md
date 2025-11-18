---
"description": "Validate JSON files against schemas and report exact errors."
"mode": "ask"
"model": "GPT-4"
"file_type": "prompt"
---
Given a JSON file and a corresponding schema file, validate the JSON and produce a report. The report should include:

1. A concise summary of the validation outcome (pass/fail).
2. A list of errors with JSON pointers (`dataPath`) and human‑readable messages.
3. Suggested fixes for each error when possible.

Do not modify the original file; provide feedback only.
