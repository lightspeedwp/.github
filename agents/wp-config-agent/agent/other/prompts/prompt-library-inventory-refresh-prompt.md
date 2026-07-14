# Prompt Library Inventory Refresh Prompt

Refresh the `prompts/` folder inventory and prompt-library documentation so it matches the current attached prompt set exactly.

Scope and intent:
- This is a prompt-library maintenance task, not a rewrite of the agent.
- Treat the current attached `prompts/` folder and current prompt contents as the source of truth.
- Focus on prompt inventory accuracy, prompt-library grouping, and stale or missing prompt references.

Primary goal:
- Keep `prompts/README.md`, the root README, and nearby maintenance references aligned with the current recurring prompt library.

What to review:
1. `prompts/README.md`
2. Root `README.md` where it lists current prompt files
3. Any maintenance note that enumerates or describes the prompt library
4. The actual current prompt files in `prompts/`

What to check for:
- missing prompt inventory entries
- stale prompt inventory entries
- prompt-library descriptions that no longer match the current prompt set
- prompt names that imply duplicate coverage when the files now have distinct roles
- maintenance docs that mention prompt categories which no longer match the current files

Editing rules:
- Make the smallest complete set of edits needed.
- Do not invent prompt files that are not attached.
- Preserve still-correct wording where possible.
- If the inventory is already correct, leave it unchanged.

Output:
1. Files reviewed
2. Files updated
3. Prompt inventory gaps found
4. Any prompt-library grouping changes made
5. Any remaining non-blocking ambiguity
