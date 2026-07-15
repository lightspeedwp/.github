# LightSpeed AI Service Templates Overview

This folder contains a structured collection of reusable Markdown templates for LightSpeed’s AI service packages. These files are organised by category to support assessments, chatbot planning, governance work, implementation discovery, QA, approvals, and delivery handover.

## Directory Structure

```text
service-templates/
├── shared/
├── readiness/
├── chatbot/
└── implementation/
```

## What This Adds To The Current Agent

The current file library already covers package routing, commercial rules, memory schemas, skill routing, and estimate logic.

This template library adds the reusable delivery artefacts that were mostly missing from the current setup:
- shared project registers and logs
- chatbot discovery and governance templates
- readiness audit and roadmap templates
- implementation, security, privacy, integration, and data-mapping templates

## How To Use This Library

- Start here when a task needs a reusable workshop, assessment, governance, implementation, QA, or handover document.
- Choose the narrowest template that matches the requested deliverable.
- Use the current package files, commercial rules, and approved sources to populate the templates.
- Do not invent values for placeholders. Replace them only with confirmed project information or clearly labelled assumptions.
- Use the shared registers to keep evidence, risks, decisions, commercial assumptions, and source approval aligned across the engagement.

## Folder Summary

### `shared/`
Reusable cross-project registers and logs:
- source-of-truth register
- claim register
- commercial assumptions sheet
- risk and review log
- decision log

### `readiness/`
Reusable readiness assessment outputs:
- AI readiness audit checklist
- AI readiness roadmap

### `chatbot/`
Reusable chatbot planning and governance outputs:
- chatbot discovery questionnaire
- chatbot recommendation memo
- source suitability checklist
- boundaries and escalation worksheet
- launch readiness checklist

### `implementation/`
Reusable delivery and solution-planning outputs:
- security and privacy review checklist
- data and source mapping sheet
- integration requirements template
- detailed solution discovery document

## Selection Rule

Use the template that is closest to the user’s requested outcome. If the task is still package scoping or estimate routing, use the package and commercial files first. Use these service templates when the user needs a reusable document, register, checklist, worksheet, memo, or implementation artefact.