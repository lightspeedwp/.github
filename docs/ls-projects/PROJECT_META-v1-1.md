# .github/PROJECT_META (shared core)

**Date:** 13-10-2025 — **Version:** v1.1

## Purpose

Automatically **add issues/PRs to the org Project** and keep Project **fields in sync** with labels and branch semantics.

## What the workflow does

- **Triggers** on issue and PR events.
- **Adds the item** to the org Project using `LS_PROJECT_URL`.
- **Derives** and writes Project fields:
  - **Status** from `status:*` labels (closed/merged → `Done`; default **Backlog**).
  - **Priority** from `priority:*` labels.
  - **Type** from **PR head branch** (see PR labels).

## Setup requirements

- **Org/repo variables:** `LS_PROJECT_URL`, `LS_APP_ID`.
- **Secrets:** `LS_APP_PRIVATE_KEY`.
- **Project fields:** Ensure **Status**, **Priority**, **Type** field names match exactly.

## Guardrails

- Labels are **signals**; the Project is the **source of truth** for delivery state.
- Mapping from branch → **Type** is **advisory**; **Issues** still set **Issue Type** manually.
- Keep **Status** values **lean**; use labels `needs-qa`, `needs-review`, `blocked` and let the workflow sync.

## Template‑specific READMEs

- **Client Delivery:** uses **To‑do** instead of Ready and includes UAT views.
- **Product Development:** uses **Ready** and includes Release/Milestone views and PR discipline.
