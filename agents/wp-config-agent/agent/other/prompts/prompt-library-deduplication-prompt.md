# Prompt Library Deduplication Prompt

Run a maintenance pass over the `prompts/` folder to identify overlap, scope drift, naming ambiguity, and unnecessary duplication across the recurring prompt library.

Scope and intent:

- This is a prompt-library hygiene task, not a rewrite of the agent’s main behaviour.
- Treat the current `prompts/` folder and current `prompts/README.md` as the source of truth.
- Focus on recurring prompt scope, naming, maintenance value, and redundancy.

Primary goal:

- Keep the prompt library useful, distinct, and easy to maintain as the number of recurring prompts grows.

What to review:

1. Every prompt file in `prompts/`
2. `prompts/README.md`
3. Any root or validation docs that summarise prompt-library coverage

What to check for:

- prompts that substantially duplicate another prompt’s job
- prompt names that are too similar to distinguish easily
- prompt descriptions that overlap too heavily
- prompt-library wording that no longer matches the actual prompt set
- prompts that should be merged, narrowed, renamed, or cross-referenced

Editing rules:

- Be conservative with consolidation.
- Do not remove a prompt just because it touches related files if its maintenance role is still materially distinct.
- Prefer tightening scope wording before proposing deletion.
- If a prompt is already distinct and useful, leave it unchanged.
- Do not broaden into unrelated instruction or app rewrites.

Output:

1. Prompt files reviewed
2. Prompt files updated
3. Any prompt-library overlaps found
4. Any prompts recommended for renaming, narrowing, or merging
5. Any remaining non-blocking ambiguity in the prompt library
6. A clear statement on whether the prompt library is now distinct and internally consistent
