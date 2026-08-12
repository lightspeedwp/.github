---
name: discovery-source-intake
description: gather and normalise current-project evidence for lightspeed website discovery work before drafting discovery packs, client summaries, follow-up questions, source triage, section drafts, or handoff notes. use when inputs are scattered across pasted notes, uploaded files, google drive, email, asana, github, figma/design notes, meeting transcripts, bug or feedback reports, or mixed links. route durable reusable defaults to discovery-onboarding, existing-draft review to discovery-pack-review, chatbot evidence to project-intake-evidence-normaliser or project-evidence-harvester, broad lightspeed kickoff routing to lightspeed-project-intake-router, and final workflow routing to handoff-router.
---

# Discovery Source Intake

## Purpose

Create a clean working intake from messy, run-specific LightSpeed discovery evidence before drafting or routing the final output.

Use this skill to:

1. identify the smallest useful set of available sources
2. extract only evidence that materially affects the requested discovery outcome
3. separate source-backed facts, assumptions, inferred observations, open questions, and internal LightSpeed notes
4. normalise the evidence into `references/intake-schema.md`
5. hand the cleaned intake into the correct downstream LightSpeed skill or produce the requested discovery output directly

## Skill boundaries and routing

Keep this skill focused on **current-run evidence intake**. Route elsewhere when another LightSpeed skill is the better owner.

| User need | Use or route to |
|---|---|
| Missing reusable website-discovery defaults that should be saved for future runs | `discovery-onboarding` |
| Messy current project evidence before a discovery pack, summary, follow-up list, or section draft | `discovery-source-intake` |
| Review an already drafted discovery pack, client summary, or discovery section | `discovery-pack-review` |
| Chatbot-specific intake, source approval, exclusions, and evidence normalisation | `project-intake-evidence-normaliser` |
| Chatbot planning, governance, source suitability, or estimating evidence base | `project-evidence-harvester` |
| Early, broad LightSpeed project kickoff routing across website, WordPress, Figma, ecommerce, AI, QA, launch, GitHub, or content | `lightspeed-project-intake-router` |
| Preparing a consolidated design/website implementation packet from mixed approved and unconfirmed inputs | `design-execution-packet` |
| Reconciling scattered design context before a design brief, page concept, or Figma-ready handoff | `design-context-synthesis` |
| Deciding the next specialist workflow after intake, when the destination is unclear | `handoff-router` |

If multiple related skills apply, run intake first only when messy evidence must be clarified before the specialist skill can work safely. Do not add an intake layer when the specialist skill already has clean, sufficient inputs.

## Input handling

### Acceptable inputs

Handle any mix of:

- pasted notes, rough briefs, meeting notes, transcripts, or call summaries
- uploaded documents, PDFs, screenshots, spreadsheets, decks, or exported notes
- Google Drive docs, Asana tasks, Gmail threads, GitHub issues/PRs, repo notes, Figma links, website URLs, and support or feedback exports when the connector or source is available
- partial discovery packs, source registers, design notes, QA findings, launch notes, or client emails used as current evidence

### Source access rules

1. Prefer user-pasted notes and current attachments first.
2. For LightSpeed work, use available internal connectors when the user names internal docs, tasks, issues, files, repos, or source systems.
3. Use public web sources only when the user asks for website/public evidence or internal sources are insufficient for the requested discovery output.
4. If a named source is unavailable, say it was not reviewed and turn the missing source into an explicit gap.
5. Do not pretend to have reviewed email, Drive, Asana, GitHub, Figma, BugHerd, Slack, or any other system unless the relevant source was actually accessed in the current run.
6. Do not exhaustively search every available system. Pull only the sources that materially improve the requested output.

### Clarification rules

- Do not ask a follow-up question when the available evidence is enough to produce a useful provisional intake.
- Ask only one grouped blocker question when the project anchor, requested output, or source-of-truth status is too unclear to proceed responsibly.
- Mark non-blocking gaps as assumptions, unconfirmed items, or open questions and continue.
- Do not ask the user to restate information that is already clearly present in the supplied sources.

## Memory and reuse boundary

Treat onboarding and intake as different jobs.

- **Onboarding** captures durable user or team defaults that may help on future runs.
- **Intake** captures current-project evidence for the task happening now.

Do not store one-off client notes, meeting details, bug lists, source registers, stakeholder comments, draft project assumptions, or transient blockers in Memory.

If the current request reveals a missing reusable LightSpeed default, route that specific default to `discovery-onboarding` and keep all current-project evidence inside this run only.

## Supporting files

- `references/intake-schema.md` — source of truth for the normalised intake structure, source categories, and evidence-handling rules.

Read this file when the request needs anything more than a very small cleanup.

## Preflight workflow

1. Read `references/intake-schema.md` when intake is material to the output.
2. Identify the requested discovery outcome:
   - internal discovery pack
   - client-facing summary
   - follow-up questions document
   - section draft
   - cleanup pass
   - source triage
   - handoff/routing note
3. Identify the project anchor: client, project, website, product surface, repo, Figma file, campaign, or working name.
4. List the source material explicitly available in the current run.
5. Decide whether the source set is enough for a draft, a provisional draft, or only a gap report.
6. If another skill owns the requested final output, prepare the intake as a handoff and route there.

## Source selection rules

Choose the smallest source set that can support a reliable draft.

Prioritise in this order unless the request clearly points elsewhere:

1. user-pasted notes and current attachments
2. directly named project files, briefs, docs, decks, sheets, or exports
3. directly relevant email threads, Asana tasks, GitHub issues/PRs, or repo files
4. recent meeting transcripts or discovery notes
5. structured feedback, QA, support, or bug reports
6. design, Figma, implementation, launch, SEO, analytics, or planning context
7. public website pages or public references when relevant to the current task

For dated or long-running documents, check the content date and section context rather than trusting modified dates alone.

## Intake workflow

### Step 1: classify the evidence

For each source, identify which categories it supports:

- business background
- website goals
- audience or positioning clues
- scope or feature requests
- content requirements
- integrations or technical constraints
- design, brand, Figma, or WordPress implementation context
- analytics, SEO, performance, accessibility, QA, launch, or governance context
- feedback, bugs, stakeholder concerns, or pain points
- approvals, ownership, timelines, or delivery constraints
- unanswered questions

### Step 2: extract with attribution

For each meaningful point, preserve practical source attribution, such as:

- user notes
- attached brief
- Google Doc
- Asana task
- GitHub issue
- repo file
- client email
- meeting transcript
- design context
- QA report
- public website page

Use formal citations when the final answer references connector or web sources that require citations. Otherwise, keep lightweight attribution in the intake itself.

### Step 3: normalise the material

Convert messy evidence into the normalised structure from `references/intake-schema.md`.

While normalising:

- merge duplicates
- keep contradictions visible
- separate stakeholder requests from confirmed project decisions
- preserve uncertainty
- distinguish approved sources from unconfirmed or merely available sources when approval matters
- keep internal LightSpeed working notes separate from client-facing content

### Step 4: separate evidence classes

Always distinguish:

- **source-backed facts** — directly supported by reviewed evidence in the current run
- **assumptions** — plausible but not directly evidenced
- **inferred observations** — reasoned conclusions drawn from multiple clues
- **open questions** — missing details that matter
- **internal working notes** — LightSpeed-only observations, delivery risks, routing comments, or margin/scope concerns

If a source contains a stakeholder opinion, keep it as stakeholder input rather than upgrading it to fact.

### Step 5: produce the intake handoff

Create a compact intake handoff before or within the final response when intake materially affects the output.

Default handoff structure:

1. **Sources reviewed**
2. **Normalised intake**
3. **Evidence classes**
4. **Open questions or contradictions**
5. **Recommended next use / route**

For small requests, compress this into a short paragraph or bullet group.

### Step 6: continue the original task

After the intake is clear enough, continue into the requested discovery output or route to the correct specialist skill. Do not stop at source collection unless the user asked only for intake.

## Missing source handling

If key sources are unavailable or only partially available:

- state which evidence was actually used
- note the missing source category briefly
- continue with the best structured draft possible
- convert missing critical evidence into explicit open questions
- avoid filling missing source facts with plausible but unsupported assumptions

## Output rules

Match the output to the user's request.

Use a fuller intake layer for:

- multi-source discovery packs
- client-facing summaries based on messy evidence
- follow-up lists where source provenance matters
- handoffs into another LightSpeed skill
- source triage or approval-sensitive work

Use a compressed intake layer for:

- small note cleanups
- one-source summaries
- minor section drafting
- straightforward evidence cleanup

When client-facing output is requested, keep internal LightSpeed notes separate and do not include blunt internal delivery concerns unless they are rewritten as appropriate client-facing risks or next steps.

## Quality bar

A good intake result:

- reduces ambiguity before drafting
- makes the evidence trail clear enough for the LightSpeed team to trust
- prevents facts, assumptions, inferences, and stakeholder opinions from being blended together
- routes to the right related skill without forcing the user to know the skill library
- avoids unnecessary onboarding questions
- avoids storing run-specific evidence as reusable memory
- makes unresolved decisions and source gaps obvious

## Example request shapes

### Example 1: messy multi-source website discovery request

User request:
> Pull together everything we know about this client from the kickoff notes, recent emails, Asana tasks, and feedback exports, then build an internal discovery pack.

Expected behaviour:

- identify which sources are actually available
- gather only high-signal project evidence
- normalise the evidence into the intake schema
- preserve contradictions and missing details
- continue into the internal discovery pack or route to the right pack-building workflow

### Example 2: transcript-first intake

User request:
> Use this discovery call transcript and these follow-up notes to draft a cleaner project summary and list the biggest unanswered questions.

Expected behaviour:

- treat transcript and notes as current-project evidence
- extract goals, constraints, audience clues, requirements, and open questions
- avoid storing transcript details as reusable defaults
- produce a normalised intake and then the requested summary

### Example 3: chatbot evidence boundary

User request:
> Review these pages, policy notes, and internal FAQs before we estimate a chatbot for this site.

Expected behaviour:

- use this skill only if broad discovery evidence must first be cleaned up
- otherwise route to `project-intake-evidence-normaliser` or `project-evidence-harvester`
- separate approved, unconfirmed, excluded, and missing source evidence
- avoid treating available internal material as approved chatbot grounding unless approval is explicit

### Example 4: existing discovery draft review

User request:
> Check whether this discovery pack is ready to share with the client.

Expected behaviour:

- route to `discovery-pack-review`
- do not rerun intake unless the draft depends on missing or unclear source evidence

### Example 5: current evidence is already enough

User request:
> Clean up these discovery notes into a clearer internal summary.

Expected behaviour:

- skip extra source searching
- normalise the notes directly
- preserve evidence classes and continue to the requested summary

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
