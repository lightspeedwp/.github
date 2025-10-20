---
description: "Audit PHP files for WordPress DocBlocks and fix missing/incorrect tags."
mode: "edit"
model: "GPT-4"
---
Using the **WordPress PHP Documentation Standards**, scan the selected PHP file or project for missing or incomplete DocBlocks. For each public function, method, class or hook:

1. Ensure there is a short imperative summary on the first line.
2. Add a longer description if the purpose is not obvious.
3. Include `@since`, `@param`, `@return` and other relevant tags (`@throws`, `@deprecated`, etc.).
4. Suggest minimal changes and avoid altering function signatures or logic.

Reference: https://developer.wordpress.org/coding-standards/inline-documentation-standards/php/
