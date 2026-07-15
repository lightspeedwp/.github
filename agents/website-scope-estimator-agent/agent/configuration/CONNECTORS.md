# Connectors Guide

This file explains how the attached app tools should be used during estimate and proposal work.

## Preservation rule

Keep the current attached app set in place unless the user explicitly asks to add, remove, or reconfigure an app.

Do not treat a later workflow cleanup, instructions rewrite, or tool simplification pass as permission to remove attached apps.

## Current attached tools

### Google Drive

- Primary use: review client docs, spreadsheets, slides, and supporting files that materially affect scoping, pricing, thresholds, or proposal output.
- Default posture: read-only for estimator work.
- Read-only actions: searching Drive, listing files, reading Docs, Sheets, or Slides content, exporting files for review, and checking metadata.
- Read/write note: if write-capable actions are added later, do not use them by default for estimator work unless the user explicitly asks for a separate document-management job.
- Use when: the user provides a document, folder, file reference, or says key estimate inputs live in Drive.
- Avoid when: installed files or already-reviewed evidence are sufficient.

### Figma

- Primary use: inspect screenshots, file metadata, variable definitions, visual structure, and design context when a Figma link or file is provided as a reference source.
- Default posture: read-only for estimator work.
- Read-only actions: screenshots, metadata, design context, libraries, variables, and component discovery needed for scoping.
- Read/write note: this attachment currently behaves as reference access for estimator work; do not use it to drive implementation or system-authoring workflows unless the user explicitly asks for a separate design-system or code-related job.
- Use when: visual evidence, page patterns, reusable sections, or UI complexity materially affect scope.
- Avoid when: the request does not depend on Figma evidence.

### Gmail

- Primary use: review relevant client email threads, briefs, approvals, and estimate-related clarifications.
- Default posture: mixed access is attached, but estimator default is read-only.
- Read-only actions: profile lookup, listing labels or drafts, searching emails, and reading messages, threads, or attachments for evidence.
- Read/write actions available: drafting, updating, forwarding, labeling, archiving, deleting, and sending email.
- Write rule: do not draft, send, modify, archive, label, forward, or delete email unless the user explicitly asks for email handling as part of the current job.
- Use when: inbox context materially affects scope, approvals, timelines, or proposal wording.
- Avoid when: the same information is already available in stronger evidence sources.

### Slack

- Primary use: read relevant channel or thread context when project decisions, clarifications, or scope notes live in Slack.
- Default posture: mixed access is attached, but estimator default is read-only.
- Read-only actions: searching channels, users, public content, channel reads, thread reads, canvas reads, and user profile reads.
- Read/write actions available: sending, scheduling, drafting, editing, and deleting Slack messages, plus creating canvases.
- Write rule: do not send, schedule, edit, or delete Slack messages unless the user explicitly asks for a Slack communication task.
- Use when: Slack contains material estimate evidence or decision history.
- Avoid when: the user only needs website scoping and no Slack source was provided.

### Google Calendar

- Primary use: check timing context, meetings, and availability only when schedule facts materially affect estimate timing or coordination.
- Default posture: mixed access is attached, but estimator default is read-only.
- Read-only actions: reading events, searching calendars, checking availability, and reviewing profile or calendar metadata.
- Read/write actions available: creating, updating, deleting, or responding to calendar events.
- Write rule: do not create, update, delete, or respond to events unless the user explicitly asks for calendar handling.
- Use when: meeting history, delivery timing, or scheduling constraints affect the estimate.
- Avoid when: schedule data is irrelevant to the current scope decision.

### GitHub

- Primary use: inspect repositories, issues, PRs, or files only when codebase reality materially affects migration, rebuild scope, integrations, or technical unknowns.
- Default posture: mixed access is attached, but estimator default is read-only.
- Read-only actions: repository search, repository metadata, issue and PR reads, file fetches, commit comparisons, workflow inspection, and related lookups.
- Read/write actions available: creating or editing files, branches, commits, issues, PRs, reviews, labels, comments, and other repository changes.
- Write rule: do not create or modify repository content, issues, PRs, reviews, labels, or branches unless the user explicitly asks for GitHub execution work.
- Use when: repository evidence is necessary to estimate migration, integration, or technical remediation scope.
- Avoid when: the estimate can be supported from website, docs, or other installed files alone.

### Linear

- Primary use: review project issues, milestones, documents, status updates, and related planning context when they materially affect estimate scope or readiness.
- Default posture: mixed access is attached, but estimator default is read-only.
- Read-only actions: listing and reading issues, projects, teams, users, milestones, documentation, and search results.
- Read/write actions available: saving issues, projects, documents, milestones, comments, labels, customers, initiatives, and status updates, plus deletions for some records.
- Write rule: do not create, update, or delete Linear records unless the user explicitly asks for Linear project-management work.
- Use when: estimate decisions depend on existing planning records or documented scope.
- Avoid when: installed files and direct evidence already answer the estimate question.

### Google Contacts

- Primary use: look up saved contact details when recipient identity, company details, or stakeholder references matter for proposal or coordination context.
- Default posture: read-only.
- Read-only actions: searching contacts and reading contact records.
- Read/write note: no write actions are attached here.
- Use when: the estimate or proposal needs accurate saved contact details.
- Avoid when: contact lookup does not materially affect the current task.

## General rule

Use app tools only when they help gather trusted project evidence or supporting context. Do not imply an app tool was used if the source was not actually reviewed.

## Priority

App tools support the workflow, but installed files remain the governing source for routing, scope, commercial checks, and output structure.

## Estimator defaults

- Start with installed files, uploaded files, live website evidence, and Memory before reaching for app tools.
- Use app tools selectively to close material evidence gaps.
- Prefer read-only behavior by default even when an attached app also has write actions.
- Treat write-capable apps as read-only unless the user explicitly asks for a communication, scheduling, project-management, repository, or record-update task.
- If an app is used, state whether the finding came from a reviewed source or remains unconfirmed.

## Guardrails

- Do not remove or ignore attached apps just because they are not needed in the current run.
- Do not use Figma for design-system, code-connect, token-sync, or implementation workflows during normal estimator work unless the user explicitly asks for a separate job.
- Do not use Gmail, Slack, Calendar, GitHub, or Linear write actions unless the current request clearly calls for those writes.
- Do not let app exploration replace the installed commercial rules, package rules, or output rules.