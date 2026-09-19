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

## Visual Workflow

```mermaid
flowchart TD
  accTitle: flowchart diagram
  accDescr: flowchart flowchart
  A[Start Here] --> B[Read Scope and Prerequisites]
  B --> C[Run the Documented Workflow]
  C --> D[Validate with Repo Tooling]
  D --> E[Open PR or Hand-off]

  classDef start fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#1B5E20;
  classDef prep fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#0D47A1;
  classDef run fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px,color:#E65100;
  classDef gate fill:#F3E5F5,stroke:#6A1B9A,stroke-width:2px,color:#4A148C;
  classDef done fill:#E0F2F1,stroke:#00695C,stroke-width:2px,color:#004D40;

  class A start;
  class B prep;
  class C run;
  class D gate;
  class E done;
```
