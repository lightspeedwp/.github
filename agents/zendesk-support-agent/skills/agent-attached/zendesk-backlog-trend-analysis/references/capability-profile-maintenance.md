# Capability Profile Maintenance

Use this reference when a shared workspace agent needs a portable record of what Zendesk evidence it can access. The profile prevents the skill from assuming that every teammate can see the same tickets, SLA fields, CSAT records, Help Centre articles, groups, brands, forms, or custom fields.

## When to create or update a profile

Create or update a capability profile when:

- the skill is installed into a new shared agent
- Zendesk connector permissions change
- reports produce different results for different teammates
- SLA, CSAT, Help Centre, custom-field, brand, group, organisation, or form visibility is uncertain
- a smoke test finds that a report had to fall back to limited evidence
- the team wants a repeatable preflight before rollout

Do not update the profile after every report. The profile is a description of shared-agent capability, not a live backlog snapshot.

## What belongs in the profile

Safe profile content:

- shared agent or workspace environment name
- available read capabilities
- available Zendesk filters
- visible ticket fields
- optional data visibility such as SLA, CSAT, comments, and custom fields
- known capability limitations
- last reviewed date

Unsafe profile content:

- credentials, tokens, API keys, cookies, or private URLs
- personal login assumptions
- private Zendesk view IDs
- customer-sensitive ticket text
- live ticket counts
- one-off backlog findings
- individual customer issue details
- temporary SLA or CSAT results
- assumptions from a single analysis run

## Review process

1. Start from `profiles/workspace-capability-profile.template.json`.
2. Run a capability preflight from the shared agent using only read actions.
3. Fill only fields that were actually confirmed.
4. Leave optional data as `uncertain` when it was not tested.
5. Record limitations in plain language.
6. Validate the profile with `scripts/validate_capability_profile.py`.
7. Re-run the shared-agent smoke test before rollout.

## Handling permission differences

If two teammates receive different results from the same shared agent, do not merge the difference into a single confident profile. Record the limitation clearly, for example:

```md
Ticket visibility may differ by teammate role. Reports should state the active Zendesk access used for the current run and avoid treating missing records as proof that no records exist.
```

When permission differences are significant, create separate redacted profiles for each shared-agent configuration or permission tier.

## Naming guidance

Use environment names such as:

- `shared-support-agent-production`
- `shared-support-agent-limited-read`
- `support-lead-agent-redacted`

Avoid names that include personal emails, private customer names, raw Zendesk subdomains, private URLs, or personal views.

## Runtime behaviour

During normal reporting, the skill should use the active Zendesk evidence first. The capability profile is a guardrail, not a substitute for live evidence.

If the live environment exposes less than the profile says, the report must state the live limitation and downgrade confidence. Do not force the report to match the profile.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
