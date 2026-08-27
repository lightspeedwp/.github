# Workflow

## Purpose

This reference expands the custom-template generation sequence.

## Standard Sequence

1. Confirm the request is for a custom template rather than a hierarchy template.
2. Normalize the template name, title, and `postTypes`.
3. Draft the target file path in `/templates/{name}.html`.
4. Generate the matching `customTemplates` entry.
5. Compose the template markup with shared parts and patterns.
6. Include `core/post-content` where content must render.
7. Return assumptions and validation notes.

## Pairing Rule

Do not return only half of the deliverable unless the user explicitly asks for it.

The normal output is:

- the template file
- the matching `theme.json` fragment

## Things To Avoid

- treating a normal hierarchy template as a custom template
- omitting `postTypes` when the intended scope is known
- returning the file without the registration entry
- returning the registration entry without the file unless the user asks
