# Public and Internal Boundary Guide

Use this reference when deciding whether an article should be public, internal, or marked as needing a visibility decision.

## Boundary rule

Public articles should contain only customer-safe guidance that can be reused without exposing private support context.

Internal notes can preserve support-only context, diagnostic detail, escalation triggers, and safe wording support agents may reuse.

When the boundary is unclear, do not publish. Mark visibility as `Needs decision` and route to `zendesk-knowledge-candidate-review` or `zendesk-evidence-quality-review`.

## Safe for public help-centre content

Public articles may include:

- customer-facing symptoms, questions, or tasks
- approved product, feature, or configuration names
- confirmed steps a customer can follow
- prerequisites the customer can verify
- supported workaround or mitigation steps
- confirmed product limitation wording
- general affected audience, when approved and non-sensitive
- exact customer-visible error wording
- support contact guidance and information the customer should provide
- links to approved public articles or product documentation

## Keep internal only

Do not include these in public drafts:

- customer names, account names, tenant IDs, or private account details
- Zendesk ticket IDs unless the article is explicitly internal
- private comments, agent notes, macros, or escalation chatter
- internal blame, staff names, team performance notes, or vendor blame
- unverified root-cause claims
- engineering speculation or implementation guesses
- security-sensitive diagnostics, exploit details, or abuse patterns
- billing, legal, contract, or commercial context not approved for publication
- roadmap promises, delivery dates, or release commitments
- private workaround history or failed support attempts
- references to one customer as proof of a general issue
- raw logs, screenshots, tokens, keys, personal data, or internal URLs

## Needs visibility decision

Use `Needs decision` when:

- the article may expose sensitive support context
- the workaround is temporary or not broadly approved
- the affected audience is unclear
- the content describes a product limitation that may need product review
- legal, privacy, billing, security, or contractual wording is involved
- the article mixes public guidance with internal diagnostic notes
- existing help-centre overlap is unclear

Recommended publishing note:

```md
- Visibility: Needs decision
- Public/internal boundary: The draft contains <specific risk or uncertainty>. Review is needed before deciding whether this should be public or internal.
```

## Public wording patterns

Use public wording that is plain and useful.

Prefer:

```md
This can happen when <customer-visible condition>. Follow the steps below to check your setup.
```

Avoid:

```md
Engineering thinks this is caused by <unconfirmed internal cause>.
```

Prefer:

```md
We are reviewing this behaviour. Use the workaround below while the status is being confirmed.
```

Avoid:

```md
This is a known bug and will be fixed next week.
```

Prefer:

```md
Contact support with your account email, a screenshot of the error, and the steps you have already tried.
```

Avoid:

```md
Reference ticket #12345 and ask for escalation to engineering.
```

## Internal note patterns

Internal notes should clearly label private content.

Use:

```md
> Internal support knowledge only. Do not publish this content publicly without review.
```

Include:

- when support should use the note
- confirmed symptoms or conditions
- diagnostic steps
- escalation triggers
- safe customer-facing wording
- information support needs from the customer

Do not use internal notes to make unsupported claims more strongly. Internal content still needs evidence.

## Redaction checklist

Before returning a public draft, check for:

- customer or account names
- ticket IDs
- internal URLs
- private comments
- staff names
- logs or screenshots containing personal data
- speculative causes
- unapproved timelines
- contractual or billing details
- security-sensitive details

If any item appears, either remove it, move it to an internal note, or mark the draft as `Needs decision`.

## Publishing notes guidance

Always make the boundary explicit.

Examples:

```md
- Public/internal boundary: Public-safe. The draft includes only customer-facing steps and avoids private ticket context.
```

```md
- Public/internal boundary: Internal-only. The draft includes support diagnostic steps and escalation triggers that should not be published.
```

```md
- Public/internal boundary: Needs review. The workaround appears temporary and product status is not confirmed.
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
