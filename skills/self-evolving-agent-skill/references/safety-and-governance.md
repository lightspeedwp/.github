# Safety and Governance

Use this reference when proposed evolution touches tools, code execution, memory, connectors, customer data, external systems, or irreversible changes.

## Non-negotiable boundaries

- Do not create autonomous self-modifying systems.
- Do not claim an agent improved itself unless a specific human-approved change and evaluation are documented.
- Do not run generated code outside an isolated sandbox.
- Do not grant new tools, connector permissions, data access, or external actions without explicit user approval.
- Do not store sensitive personal data, secrets, credentials, private customer data, or short-lived incident details in durable memory unless explicitly requested and allowed by policy.
- Do not optimise for benchmark scores by weakening safety, privacy, or honesty constraints.

## Approval levels

Treat these as separate gates. Do not assume approval at one level grants approval at the next.

| Level | What is allowed | Requires |
|---|---|---|
| Proposal | Analyse, recommend, and draft mutations in chat. | User request for review or ideas. |
| Local package | Create or update files in a local sandbox and return a zip. | Explicit request to proceed, update, package, or create the deliverable. |
| Connected edit | Edit repo files, Drive docs, tickets, tasks, calendars, emails, CRM records, or other connected systems. | Explicit target, action, and approval for that system. |
| Publication | Install, publish, replace, or enable a skill/agent in a live workspace. | Explicit publication approval and any required validation. |
| Permission change | Add tools, connectors, scopes, memory retention, network access, or irreversible actions. | Explicit approval plus a safety review. |

## Approval gates

Require approval before:

- Installing, packaging, publishing, or replacing a skill.
- Editing a repo, connected document, ticket, calendar, email, CRM, or project-management record.
- Changing allowed tools, connector scope, or data retention rules.
- Adding scripts that execute network calls, shell commands, browser automation, or file deletion.
- Removing existing safety constraints or review steps.

When the user asks directly for a packaged deliverable, approval to create the local package is implied. Approval for external installation or publication is not implied.

## Sandboxed evaluation

For scripts or generated code:

1. Inspect the code for file deletion, network calls, subprocess usage, dynamic imports, secrets handling, and permission changes.
2. Run only representative safe commands in the local sandbox.
3. Capture command, result, and limitation.
4. If testing is skipped, state why and mark confidence lower.

## Memory policy

Store only durable, reusable preferences or decisions that will improve future runs. Prefer local archive entries for run-specific observations.

Good candidates:

- Stable evaluation criteria.
- Approved routing rules.
- Reusable output templates.
- Long-lived tool boundaries.
- Version decisions and rollback notes.

Poor candidates:

- Raw private feedback logs.
- Secrets, credentials, tokens, or private keys.
- Sensitive personal attributes.
- Temporary project status.
- Unverified research claims.
- One-off rejected ideas with no future value.

## Risk labels

- **Low**: wording, formatting, examples, small clarification.
- **Medium**: workflow order, routing changes, output contract changes.
- **High**: tool permissions, code execution, connector writes, memory policy, safety gates.
- **Blocked**: missing evidence, unsafe request, unavailable source, or unclear authority.

## Safe redirect for autonomous requests

When asked to build an agent that rewrites itself without review, respond with a governed alternative:

> I can help design a human-approved evolution loop: the agent records feedback, proposes versioned changes, evaluates them against tests, and waits for approval before anything is applied.
