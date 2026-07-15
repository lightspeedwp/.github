# Shared agent usage

Use this reference when the skill runs inside a shared workspace agent, when a skill directory is shared across a team, or when connector access may differ depending on who is logged in.

## Portability rules

- Do not assume the logged-in user is Ash, a specific teammate, or the same person who created the skill.
- Do not depend on personal Memory for ticket facts, customer facts, private URLs, credentials, saved searches, or account-specific assumptions.
- Treat Memory as optional preference context only. It is not source-of-truth evidence for a Zendesk or Help Centre decision.
- Use available workspace connectors and user-supplied evidence. If a connector is unavailable, permission-limited, or returns insufficient evidence, say so and continue from the supplied evidence.
- Name the smallest missing Zendesk or Help Centre check that would improve confidence instead of blocking the whole review.
- Avoid user-specific wording such as "my Zendesk view" or "Ash's saved search" unless the user explicitly supplied that source in the current task.
- Do not include credentials, secrets, private workspace URLs, or real customer data in reusable examples or bundled references.

## Evidence handling

Prefer evidence in this order when available:

1. Zendesk ticket or thread evidence available to the current agent session.
2. Help Centre, macro, or internal knowledge overlap available to the current agent session.
3. User-supplied pasted evidence, screenshots, or summaries.
4. Secondary sources only when they materially clarify documentation stability or existing coverage.

If live Zendesk or Help Centre access is unavailable, use the normal low-confidence output path and include a `Smallest missing evidence` section.

## Shared-agent wording

Use workspace-neutral wording:

- "available Zendesk evidence" instead of "your Zendesk";
- "the support agent" or "the team" instead of a named individual;
- "permission-limited" instead of implying the user failed to connect a tool;
- "needs one more check" instead of "cannot decide" when supplied evidence is enough for a provisional decision.

## Reusable example safety

When adding examples to this skill or using it in demos:

- Use fake ticket IDs and fake organisation names.
- Remove personal data, email addresses, subscription details, billing data, and private logs.
- Avoid copying real Zendesk replies unless they are deliberately anonymised.
- Mark examples as illustrative rather than evidence.
