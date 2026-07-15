# Memory Policy

This skill should be conservative about Memory because support documentation and case facts can be sensitive, temporary, or customer-specific.

## Default rule

Do not save anything to Memory by default.

## Safe to consider saving only when explicitly requested or clearly durable

Only consider saving reusable, non-sensitive, document-level patterns that will improve future shared-agent behaviour, such as:

- stable routing preferences between Zendesk skills
- approved naming conventions for documentation sources
- durable source-of-truth locations, such as "refund policy lives in Help Center collection X"
- reusable documentation risk labels or workflow conventions
- broad support documentation rules that are not customer-specific and not confidential beyond the shared workspace context

Even then, save only the minimal useful rule, not full document contents.

## Do not save by default

Never save these items by default:

- customer names, account details, ticket IDs, emails, order IDs, invoices, payments, or refund amounts
- case-specific facts, diagnosis, exception approvals, or commitments
- private customer communications or sensitive attachments
- internal-only policy text copied from documents
- security, legal, compliance, health, financial, or other sensitive details from a case
- temporary documentation gaps, draft wording, or stale article snapshots
- teammate-specific assumptions, such as who owns a workflow or who has connector access

## If the user explicitly asks to remember something

If the user explicitly asks to save a durable rule, keep it narrow and reusable. Prefer saving a routing or source-location rule over saving policy content.

Good memory candidate:

- "For the shared Zendesk agent, treat the public Help Center refund policy article as the first source to check before internal refund notes."

Unsafe memory candidate:

- "Customer ACME received a refund exception on ticket 12345 because their plan was misconfigured."

## If unsure

Do not save. Ask for confirmation only when Memory is necessary for future shared-agent behaviour. Otherwise keep the information in the current grounding brief only.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
