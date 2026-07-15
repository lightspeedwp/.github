# Shared Agent Setup

This skill is designed for shared workspace agents. It must behave reliably for any teammate, not only the person who created it.

## Shared-agent rules

- Do not assume the current user is the ticket owner, account manager, original drafter, or support lead.
- Do not depend on personal memory, private preferences, personal folders, or one teammate's connector state.
- Treat connector availability as variable. If Help Center, Zendesk, Drive, Slack, or another documentation source is unavailable, state the limitation and use only pasted or accessible evidence.
- Prefer stable source locators: article IDs, URLs, document titles, version labels, and section headings.
- Distinguish public customer-facing sources from internal-only support documentation.
- Never reveal internal-only documentation as if it were customer-facing Help Center wording.
- Avoid wording such as "our policy definitely says" unless the source is current, approved, and directly quoted or accurately summarised.

## Source access expectations

The agent may have access to different sources depending on the workspace setup. Search broadly but conservatively across accessible approved documentation:

- Zendesk Help Center articles and Guide content
- Zendesk macros or internal notes explicitly approved as policy guidance
- approved internal support playbooks or policy docs
- approved product docs, changelogs, release notes, or implementation docs
- pasted documentation from the user

Do not use general web results, teammate recollection, customer claims, old ticket replies, or inferred behaviour as approved documentation unless the user explicitly identifies them as approved source material.

## Safe fallback when access is incomplete

When documentation cannot be accessed or verified, output:

- what was searched or provided
- what could not be checked
- whether the intended reply is unsupported from available evidence
- the smallest safe next step, such as asking for the relevant article link, routing to evidence review, or escalating policy confirmation

## Team-safe phrasing

Use internal-facing language such as:

- "available documentation supports..."
- "the source does not explicitly cover..."
- "this would require inference..."
- "avoid promising..."
- "safe to cite only if the public article is current and visible to the customer..."

Avoid attributing uncertainty to a person. Attribute it to source quality, scope, or freshness.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
