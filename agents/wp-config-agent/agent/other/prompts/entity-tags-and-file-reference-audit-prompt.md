# Entity Tags and File Reference Audit Prompt

Run a focused audit of entity tags and file references across this agent’s instructions and maintenance documentation.

Scope and intent:

- This is a reference-integrity task, not a broad rewrite.
- Treat the current system instructions, attached files, attached skills, attached apps, and current file tree as the source of truth.
- Focus on whether entity tags and named file references still point to the correct attached local files, skills, and apps.

Primary goal:

- Catch stale, broken, mis-scoped, or ambiguous references before they cause routing, reporting, or maintenance drift.

What to review:

1. System instructions
2. Root and folder README files
3. Reference guides in `references/`
4. Prompt files in `prompts/`
5. Any validation docs that mention attached files, skills, or apps

What to check for:

- stale file references after renames or inventory changes
- entity tags that reference the wrong attached file or wrong attached skill
- plain-text skill or file references that should now be tightened for clarity
- duplicated references that point to inconsistent sources of truth
- maintenance docs that describe a file or skill differently from the actual attached entity

Editing rules:

- Make the smallest complete set of edits needed.
- Remove or correct conflicting references instead of leaving soft contradictions behind.
- Preserve still-correct routing and maintenance wording.
- Do not invent entities that are not attached.

Output:

1. Files reviewed
2. Files updated
3. Reference or entity-tag issues found
4. Any corrected or tightened entity references
5. Any remaining non-blocking ambiguity

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
