# Template Spec

## Purpose
Standardise how AI templates are named, stored and shipped so teams can consume them consistently.

## Structure
```
/chatgpt/
/claude/
/gemini/
/copilot/
/copilot-spaces/
/figma-make/
/models/
/github-new-repo/
/dist/           # release ZIPs only
```
Each model folder may have category subfolders (e.g. `/sales/`, `/support/`).

## Naming
- Kebab-case for files and folders.
- One template per file: `{category}-{purpose}.md`.
- Add front matter:
```
---
title: Short title
model: chatgpt|claude|gemini|copilot
use_case: sales|support|dev|research|general
status: draft|ready
version: 1.0.0
author: Team/Person
last_updated: YYYY-MM-DD
---
```

## Required sections
1. **Goal** – single sentence outcome.
2. **Inputs** – variables users must provide.
3. **Instructions** – numbered steps.
4. **Quality checks** – acceptance criteria.
5. **Safety/limits** – what not to do.
6. **Examples** – at least one example.
