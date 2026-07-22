# Connectors

This document describes the external apps currently attached to this agent and how they should be used.

## Current Connectors

### Linear

**Permission level**

Linear is currently configured as **read-only**.

**Purpose**

Use Linear when the task depends on real Linear workspace context such as:

- issues and comments;
- projects and initiatives;
- cycles and milestones;
- documents and status updates;
- teams, labels, and statuses;
- customer and customer-need records.

**Use Linear for**

- understanding how a workflow maps to actual Linear entities;
- grounding skills in real issue, project, planning, or documentation context;
- checking how statuses, labels, teams, or other structures are used;
- informing reusable skills with real workspace evidence;
- validating whether a proposed skill matches real Linear operating patterns.

**Do not use Linear for**

- inventing planning facts or workspace state that is not present;
- implying that the agent can currently create or update Linear records;
- relying on app data when the requested skill can be created reliably from the prompt and attached files alone.

### GitHub

**Permission level**

GitHub is currently configured as **read-only**.

**Purpose**

Use GitHub when the task depends on repository or engineering context such as:

- repository structure;
- source files;
- issues;
- pull requests;
- implementation examples;
- code review or audit context.

**Use GitHub for**

- inspecting existing implementation patterns;
- grounding skills in real repository structure;
- auditing code-related workflows;
- reviewing issues, pull requests, and file-level context;
- validating assumptions against actual repository evidence.

**Do not use GitHub for**

- making repository changes;
- treating GitHub as required for all skill-factory work;
- inventing code behaviour or project standards that are not present.

### Google Drive

**Permission level**

Google Drive is currently configured as **read-only**.

**Purpose**

Use Google Drive when the task depends on Google Docs, Sheets, Slides, or other Drive files as inputs.

**Use Google Drive for**

- reading relevant documents, spreadsheets, or presentations;
- grounding skills in real workspace artefacts; and
- using stored source material when it materially improves the result.

**Do not use Google Drive for**

- creating or updating Drive files;
- assuming Drive is the default destination unless the request or saved preferences point there;
- treating Drive content as authoritative when newer user-provided context overrides it.

## Usage Rules

- Use apps only when they materially improve the current task.
- Prefer the minimum necessary app usage.
- Use the attached apps as source systems, not action targets.
- Keep outputs grounded in evidence from the connected source.
- Separate confirmed facts from assumptions.
- If key context is missing, continue as far as possible and state what is still needed.

## Access Pattern

All current attached apps are configured for end-user account access. Use them as contextual sources during runs, not as proof of broader system access beyond the connected account.

## App Selection Heuristic

- Use **Linear** when the task starts from issues, projects, initiatives, documents, status updates, or customer-request data.
- Use **GitHub** when the task starts from repository, issue, pull request, or implementation context.
- Use **Google Drive** when the task starts from Docs, Sheets, Slides, or stored workspace artefacts.
- Use multiple apps only when the task genuinely needs cross-source grounding.
- Use **none** when the requested output can be produced reliably from the user’s request and attached files alone.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
