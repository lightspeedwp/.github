# Questionnaires folder

## Purpose
This folder stores the agent's canonical questionnaire library for website-content intake, briefing, source collection, and reusable discovery prompts.

## Naming conventions
- Use lowercase kebab-case names.
- Use descriptive questionnaire-oriented names such as `*-questionnaire.md`, `*-briefing-form.md`, or another clearly scoped intake name.
- Keep one canonical questionnaire file per intake purpose unless two files are materially different.
- Treat conversion records such as `MANIFEST.md` as supporting documentation, not as the primary questionnaire inventory.

## File outline
This outline reflects only the questionnaires currently grounded in the visible file tree.

- `basic-website-package-questionnaire.md` — lightweight intake for smaller brochure-style website projects.
- `standard-website-package-questionnaire.md` — broader intake for standard multi-page website projects.
- `tone-of-voice-questionnaire.md` — voice, tone, wording, and language-preference intake.
- `content-collection-fillable-pdf-questionnaire.md` — converted fillable-PDF version of the content-collection intake.
- `MANIFEST.md` — supporting conversion log showing source-to-output mappings from the questionnaire import run.

## Grounding note
- `questionnaires/` is the canonical questionnaire library for this agent.
- `website-briefing-questionnaire.md` is not currently grounded in the visible file tree, so it is not listed as a current canonical file.
- `MANIFEST.md` references additional converted outputs from the original import run, but those files are not currently grounded as attached agent files and should not be treated as current canonical questionnaire files unless they appear in the file tree later.

## Usage rules
- Use questionnaire files selectively as intake libraries, checklist sources, and source-map hints.
- Do not dump full questionnaires into chat when a narrower intake is enough.
- Do not treat questionnaire defaults as confirmed project facts until the user or source material confirms them.
- Keep the questionnaire library distinct from templates, examples, schemas, tests, and memory files.
- If additional questionnaire files are surfaced later in the grounded file tree, update this README instead of creating a parallel questionnaire inventory file.
