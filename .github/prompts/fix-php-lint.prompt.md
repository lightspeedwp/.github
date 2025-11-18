---
"description": "Run a PHPCS-inspired cleanup for WordPress PHP style; safe auto-fixes only."
"mode": "edit"
"model": "GPT-4"
"file_type": "prompt"
---
Run PHP_CodeSniffer using the WordPress rulesets on the selected PHP files and apply automatic fixes where safe. Focus on:

1. Correcting indentation, spacing and brace placement.
2. Enforcing Yoda conditions and proper parentheses.
3. Ensuring sanitisation and escaping functions are used.

Provide a concise description of the changes made and note any manual fixes needed.
