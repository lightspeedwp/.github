# Shared Agent Usage Rules

Use this reference whenever the skill is running inside a shared workspace agent, when the current user's connector access is unknown, or when the request depends on Zendesk data that may not be available to every teammate.

## Core portability rule

The skill must be portable, permission-neutral, and evidence-driven. It should work for any teammate who has access to the shared agent, even when their Zendesk, Slack, Gmail, Google Drive, Linear, GitHub, Asana, or Memory access differs from the skill author.

## Do not assume

Do not assume:

- the current user is Ash, the ticket owner, the assignee, or the original support agent;
- the current user has the same Zendesk permissions as the skill author;
- private Memory contains the required project, customer, ticket, or workflow context;
- Gmail, Slack, Linear, GitHub, Asana, Google Drive, Bugherd, logs, analytics, or other secondary systems are available;
- the current user can see all related tickets, internal notes, side conversations, organisations, problem tickets, attachments, macros, or ticket events;
- real customer or ticket data is embedded in the skill package.

## When connector access is available

When Zendesk access is available, keep Zendesk as the source of truth and use ticket evidence before secondary systems. Still state which evidence was visible and avoid implying that unseen ticket history was checked.

If a secondary connector is used, name why it was needed and keep the relationship classification grounded in Zendesk or user-supplied support evidence.

## When connector access is unavailable or partial

When Zendesk or other connector access is unavailable, partial, declined, or ambiguous:

1. Classify only from supplied evidence.
2. Lower confidence where important ticket history is missing.
3. State that the classification is based on supplied evidence only.
4. Name the smallest missing Zendesk detail that would improve confidence.
5. Avoid merge, escalation, reporting, or incident recommendations that depend on unseen ticket history.
6. Prefer cautious handling: link or monitor rather than merge when customer-specific context may be missing.

## Memory usage

Memory may help with stable, reusable support conventions, but the skill must not depend on Memory being available or complete.

Good Memory candidates:

- stable Zendesk field names or team taxonomy;
- preferred support tags for related issues, duplicates, repeated pain, or incidents;
- whether the team usually links before merging;
- whether the team uses Zendesk problem tickets or another incident record;
- standard routing preferences between Zendesk-first skills.

Do not use Memory for:

- ticket-specific facts;
- real customer details;
- private internal notes;
- temporary incident details;
- credentials, tokens, exports, or screenshots;
- anything that applies only to one user's login or session.

## Skill package safety

Do not store real Zendesk ticket content, customer names, private notes, credentials, API tokens, screenshots, exports, attachments, or workspace-specific secrets inside the skill directory.

Examples inside the skill package must be synthetic or anonymised.

## Shared-agent wording

Use cautious, access-aware wording when evidence is incomplete:

- "Based on the supplied evidence..."
- "I cannot confirm whether Zendesk contains additional related tickets from the available evidence."
- "Do not merge yet; the smallest missing evidence is..."
- "This looks related, but duplicate status depends on confirming the same root cause and resolution path in Zendesk."

Avoid wording that overclaims access or certainty:

- "I checked all related tickets" unless that is true.
- "These should be merged" when internal notes, requester context, or resolution history are unseen.
- "This is an incident" when timing, spread, and shared operational cause are not supported.
