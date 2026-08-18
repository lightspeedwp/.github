---
name: linear
description: This skill helps you efficiently manage your Linear workspace by creating, updating, labeling, and organizing issues, projects, and documents upon request. Use it when you need straightforward Linear operations, ensuring your work is neatly coordinated without handling complex specialist tasks.
---

# Linear

## Purpose

Use this skill as the safe, practical front door for Linear work at LightSpeed.

This skill should:

- Read and understand real Linear workspace context.
- Create, update, label, comment on, or organise Linear issues, projects, cycles, labels and documents only when requested.
- Route Linear-adjacent work to the correct specialist `linear-*` or LightSpeed delivery skill before performing any Linear workspace action.
- Keep outputs concise, practical and ready for team use.

This skill should not absorb specialist workflows. It coordinates them.

## Core operating rules

- Prefer the most specific specialist skill over this general Linear skill when the user is asking for analysis, triage, drafting, rewriting, decomposition, governance, duplicate handling, momentum review, project pulse, SOP design, voice-of-customer synthesis, QA routing, PRD work, launch planning, or delivery planning.
- Use this skill directly when the user needs real Linear MCP operations: list, read, search, create, update, label, comment, cycle, project, document, team or user lookup actions.
- Read before writing. Search or retrieve current Linear context before creating or updating issues, projects, comments, labels, cycles or documents.
- Do not create, update, delete, close, move, label, assign or comment in Linear unless the user clearly asked for a workspace change.
- If intent is unclear, produce a draft or recommendation first. Ask at most one focused follow-up only when a safe action cannot be completed without it.
- Separate observed Linear data from recommendations and assumptions.
- For LightSpeed work where context may live outside Linear, use connected internal sources when available before filling gaps from memory.

## Required routing check

Before using Linear MCP tools, classify the request.

1. **Direct Linear operation** - Continue with the Linear workflow below.
2. **Specialist Linear workflow** - Route to the most specific `linear-*` skill first. Return to this skill only if a Linear read/write operation is still needed.
3. **LightSpeed delivery workflow** - Route to the most specific LightSpeed delivery skill first. Return to this skill only to track approved work in Linear.
4. **Ambiguous workflow** - Give a safe draft or routing recommendation without changing Linear.

### Routing priority

When more than one route seems possible, use this order:

1. **Safety and readiness first** - `linear-gap-analyzer` for missing evidence, readiness checks or blockers.
2. **Intent and ownership next** - `linear-triage-router` for team, priority, label, owner and intake routing.
3. **Shape the issue before creating it** - `linear-the-architect` for unclear, messy or rough issue text.
4. **Break down complex work** - `linear-sub-issue-splitter` for parent issues, epics, implementation notes or broad features.
5. **Operational audits** - `linear-momentum-auditor`, `linear-project-pulse` or `linear-unplanned-work-intake-audit` for existing work health.
6. **Durable process changes** - `linear-decision-logger`, `linear-triage-rules-designer` or `linear-triage-sop-builder` for reusable rules and operating procedures.
7. **Workspace action last** - Use this skill to read or write Linear only after the above route is clear.

## Specialist `linear-*` routing matrix

Always consider these specialist skills before using this general Linear skill for analysis or transformation.

| User intent | Route first to | Return to this skill when |
|---|---|---|
| Route a new issue, bug, request, support signal, QA finding, design handoff, implementation note or unplanned ask by team, label, priority, ownership or escalation path | `linear-triage-router` | Applying the chosen route, labels, owner, priority, status or comment in Linear |
| Rewrite rough notes, vague asks, messy issue drafts or unclear implementation tasks into clear Linear-style issues | `linear-the-architect` | Creating or updating the polished issue in Linear |
| Identify missing context, readiness gaps, blockers, evidence gaps or focused follow-up questions for one work item | `linear-gap-analyzer` | Adding gap notes, comments, labels, blockers or status updates in Linear |
| Break a large issue, feature, QA finding, bug report, design handoff or implementation note into sub-issues | `linear-sub-issue-splitter` | Creating approved sub-issues or linking them to the parent issue |
| Identify duplicates, choose a canonical issue, preserve customer context or define duplicate-handling comments | `linear-duplicate-management-playbook` | Applying duplicate labels, links, comments or closure updates after approval |
| Find stale, stalled, blocked or low-momentum work and recommend recovery actions | `linear-momentum-auditor` | Fetching live issue data or applying agreed status/comment updates |
| Summarise current project health, status, risks, next actions or priority focus | `linear-project-pulse` | Reading live Linear data or posting the resulting project update |
| Capture durable routing, naming, label, priority, approval, escalation or workflow decisions | `linear-decision-logger` | Applying approved decisions to labels, docs, comments or issue updates |
| Transform customer feedback, support threads, emails or Slack notes into planning-ready problem statements | `linear-voice-of-customer` | Creating or updating Linear issues from approved insights |
| Audit how bugs, support requests and feedback enter Linear; reduce duplication or context loss | `linear-unplanned-work-intake-audit` | Implementing approved intake labels, docs or issue updates |
| Design rules for routing, priority, ownership and human triage decisions | `linear-triage-rules-designer` | Turning approved rules into Linear labels, docs or comments |
| Create a triage SOP, review process, inbox cadence or escalation operating procedure | `linear-triage-sop-builder` | Publishing approved SOP notes to Linear docs or linked issues |
| Create or improve a reusable Linear-focused ChatGPT skill | `linear-app-skill-creator` | Only when live Linear examples or workspace references are needed |
| Collect missing defaults for creating Linear or LightSpeed workflow skills | `linear-skill-intake-onboarding` | Only after onboarding unblocks a concrete skill creation/update request |

### Specialist routing examples

Use these as default interpretations:

- "Where should this issue go?" -> `linear-triage-router`.
- "Make this issue clearer" -> `linear-the-architect`.
- "What is missing before dev can start?" -> `linear-gap-analyzer`.
- "Split this into subtasks" -> `linear-sub-issue-splitter`.
- "Is this a duplicate?" -> `linear-duplicate-management-playbook`.
- "What is stuck?" -> `linear-momentum-auditor`.
- "Give me a quick status on this project" -> `linear-project-pulse`.
- "Remember this routing rule" -> `linear-decision-logger`.
- "Turn these customer notes into product work" -> `linear-voice-of-customer`.
- "Our intake process is messy" -> `linear-unplanned-work-intake-audit`.
- "Create triage rules" -> `linear-triage-rules-designer`.
- "Write the triage SOP" -> `linear-triage-sop-builder`.
- "Create a Linear workflow skill" -> `linear-app-skill-creator` or `skill-creator`.

## Related LightSpeed shared-team routing matrix

Use these routes when the request is about LightSpeed delivery planning rather than generic Linear operations.

| User intent | Route first to | Return to this skill when |
|---|---|---|
| PRD, product brief, goals, non-goals, personas, user stories, acceptance criteria, risks or assumptions | `lightspeed-prd-generator` or `lightspeed-prd-task-manager` | Creating or updating Linear work from an approved PRD |
| Developer-ready task breakdowns, epics, delivery waves, dependencies, estimates or issue drafts | `lightspeed-task-breakdown-planner` | Creating approved issues, sub-issues, cycles or project tasks |
| GitHub-ready issue drafts from PRDs, QA findings, implementation plans or acceptance criteria | `lightspeed-github-issue-drafter` | Mirroring approved GitHub planning into Linear when requested |
| Implementation sequencing, workstreams, branch strategy, testing approach or developer handoff | `lightspeed-implementation-plan-generator` | Tracking approved workstreams in Linear |
| QA findings, severity, launch blockers, ownership or retest steps | `lightspeed-qa-findings-router` | Creating or updating Linear bugs/tasks after QA triage |
| Acceptance test plans, QA scripts or validation matrices | `lightspeed-acceptance-test-planner` | Tracking approved QA tasks or coverage gaps in Linear |
| Launch QA, final launch checks, go/no-go gates or website launch readiness | `lightspeed-launch-qa-planner` or `lightspeed-launch-readiness-auditor` | Tracking approved launch tasks in Linear |
| Project status report, milestone update, blocker summary, risk update or stakeholder communication | `lightspeed-project-status-reporter` | Reading live Linear data or posting the prepared update |
| Approval gates, sign-off checklists, decision logs or go/no-go criteria | `lightspeed-approval-gate-manager` | Applying approved gate tasks, labels or comments in Linear |
| Scope-change triage, impact analysis, requirement deltas or estimate impact | `lightspeed-change-request-router` | Updating affected Linear issues only after the change route is clear |
| Requirement-to-task, acceptance, QA, issue or launch traceability | `lightspeed-requirements-traceability-mapper` | Fetching or updating Linear issue coverage after mapping |
| Release notes, launch handoff, support transition or closure reporting | `lightspeed-release-handoff-generator` | Linking or updating Linear release/support handoff tasks |

## Direct Linear MCP workflow

Follow these steps only after the routing check confirms that direct Linear read/write work is needed.

### Step 1: Confirm only required scope

Confirm only the missing details required to act safely, such as:

- Team, project, cycle, status, label or assignee.
- Issue ID, project ID, document ID or cycle name.
- Whether the user wants a draft, recommendation or actual Linear change.
- Whether to apply changes to one item, a batch or a whole project/cycle.

Avoid broad intake questions when the available context is enough for a safe draft or read-only summary.

### Step 2: Read context first

Use the most targeted Linear read/search tools available before changing anything:

- Issues: `list_issues`, `get_issue`, `list_my_issues`, `list_issue_statuses`, `list_issue_labels`
- Projects and teams: `list_projects`, `get_project`, `list_teams`, `get_team`, `list_users`
- Collaboration and planning: `list_documents`, `get_document`, `search_documentation`, `list_comments`, `list_cycles`

For LightSpeed work where source context may live outside Linear, use the relevant connected internal source before filling gaps from memory.

### Step 3: Plan the change

Before write operations, briefly state:

- What will change.
- Which Linear items are affected.
- Why the change is safe and useful.
- Any assumptions or gaps.

For bulk changes, group work by project, status, label, owner, priority or cycle so the user can audit the logic.

### Step 4: Execute requested Linear writes

Use write tools only after the user has clearly requested action:

- Create or update issues: `create_issue`, `update_issue`
- Create or update projects: `create_project`, `update_project`
- Create labels: `create_issue_label`
- Add comments: `create_comment`

Do not close, delete or mark work obsolete unless the user explicitly asked for that outcome or approved a duplicate/decline recommendation.

### Step 5: Report back

Use this concise structure:

1. **Value** - what improved or what the user can now act on.
2. **Risks / gaps** - unclear ownership, missing evidence, stale data, duplicate risk or blocked dependencies.
3. **Next step** - the smallest useful follow-up.

For workspace changes, include:

- Items read.
- Items changed.
- Items left unchanged.
- Failed or skipped operations.

## Direct-use cases

Use this skill directly when no specialist route is needed.

### Issue management

- Search, read, create, update, label, assign, prioritise or comment on issues.
- Convert an approved draft into a Linear issue.
- Add an approved status update or blocker note.
- Bulk update issues only when the grouping logic is clear and requested.

### Project, cycle and team management

- List projects, summarise live project state, update project metadata or create a project from an approved plan.
- Review cycle work, group issues by owner/status/priority and suggest cycle adjustments.
- Track release planning after requirements and task breakdowns have been approved.
- Look up teams, users, labels, statuses and cycles needed for safe actions.

### Documentation and collaboration

- Search Linear documents for a specific policy, decision, spec or process.
- Create or update Linear comments from approved summaries.
- Surface documentation gaps, then route to a specialist if the user needs a full audit or SOP.

### Reporting from live Linear data

- Produce a short operational summary from current Linear issues/projects.
- Group active work by status, owner, priority, blocker, project or due date.
- Highlight stale, blocked, unassigned, duplicate-prone or unclear work without changing it.

## Output quality rules

- Be specific. Name the project, team, issue key, status, priority and owner when available.
- Use LightSpeed's practical structure: value, risks/gaps and next step.
- Keep recommendations small enough for the team to apply.
- Preserve LightSpeed workflow language where relevant: approved source, evidence gap, owner, acceptance criteria, QA, launch gate, go/no-go, implementation note and handoff.
- Do not overstate certainty when Linear data is incomplete, stale or inaccessible.
- If routing was used, name the specialist route and explain why it was selected in one sentence.

## Linear MCP prerequisites

- Linear MCP server must be connected and accessible via OAuth.
- Confirm access to the relevant Linear workspace, teams, projects, cycles, labels and documents.
- If an MCP call fails because Linear MCP is not connected, pause the Linear operation and provide setup instructions.

### Linear MCP setup fallback

1. Add the Linear MCP:
   - `codex mcp add linear --url https://mcp.linear.app/mcp
2. Enable remote MCP client:
   - Set `[features] rmcp_client = true` in `config.toml` or run `codex --enable rmcp_client`.
3. Log in with OAuth:
   - `codex mcp login linear`
4. Tell the user to restart Codex after successful login, then continue from the read step next time.

**Windows/WSL note:** If connection errors occur on Windows, configure Linear MCP through WSL:

```json
{"mcpServers":{"linear":{"command":"wsl","args":["npx","-y","mcp-remote","https://mcp.linear.app/sse","--transport","sse-only"]}}}
```

## Troubleshooting

- **Authentication:** Re-run OAuth, verify workspace permissions, clear stale browser sessions and confirm API access.
- **Missing workspace data:** Confirm team/project names, archived state, permissions or whether the item lives outside Linear.
- **Tool errors:** Re-read required identifiers, split complex requests and retry with narrower filters.
- **Rate limits or large batches:** Process in smaller batches and report partial progress honestly.
- **Routing uncertainty:** Prefer a draft plus routing recommendation over making a workspace change.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
