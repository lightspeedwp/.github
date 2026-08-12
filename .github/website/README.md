---
file_type: documentation
title: "Awesome GitHub Site"
description: "Public website for the Awesome GitHub project and its WCEU 2026 talk."
version: "0.1.4"
created_date: "2026-06-03"
last_updated: "2026-06-03"
language: "en-GB"
status: active
stability: stable
domain: governance
owners:
  - Ash Shaw
tags:
  - website
  - conference
  - talk
---

# Awesome GitHub Site

Public website for the `Awesome GitHub` project and its WCEU 2026 talk.

## Scope

- Home
- WCEU 2026 talk
- WCEU 2026 slides index
- WCEU 2026 slide subpages
- Why this exists
- References

## Behaviour

- Uses GitHub Pages-friendly static output.
- Includes a light and dark mode switcher in the shared shell.
- Keeps the header and footer reusable across all pages.
- Scans the full `wceu-2026` tree to build slide pages, accessibility notes, and references.

## Local development

```bash
cd website
npm install
npm run dev
```

## Build

```bash
cd website
npm run build
```
