# Prompt Library Audit Prompt

## Purpose

Use this recurring prompt to audit the `prompts/` folder so prompt names, descriptions, categories, and usage guidance stay internally consistent.

## Prompt

Audit the prompt library for consistency so the prompt files in `prompts/` and `prompts/README.md` describe the same maintenance library clearly and accurately.

Primary goal:

- keep prompt names, purposes, and usage guidance aligned
- identify missing README entries, stale prompt categories, or overlapping prompt scopes
- leave the prompt-library layer organised and non-blocking

Scope priorities:

1. `prompts/README.md`
2. prompt file names and stated purposes
3. adjacent validation-facing docs only where they materially depend on prompt-library wording

Required working rules:

- Treat the real `prompts/` folder contents as source of truth.
- Prefer tight scope descriptions over broad or overlapping prompt definitions.
- Do not invent prompt files or categories that are not present.
- Keep the pass focused on prompt-library clarity, not general documentation rewrite work.

During the pass:

- compare `prompts/README.md` against the actual prompt files present
- check for missing prompt entries, stale names, inconsistent category labels, or outdated usage notes
- tighten overlapping prompt descriptions where they create avoidable ambiguity
- update validation-facing docs only when they materially depend on prompt-library wording

Output requirements:

1. short prompt-library audit summary
2. exact files updated or still inconsistent
3. non-blocking follow-up opportunities, if any
4. explicit confirmation of whether any prompt-library inconsistency remains blocking

Validation expectation:

- Run the documented validation entry point when prompt-library docs change.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
