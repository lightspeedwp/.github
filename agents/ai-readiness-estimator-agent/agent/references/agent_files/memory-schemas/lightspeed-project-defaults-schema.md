# lightspeed-project-defaults.yaml schema

Use this schema for stable, reusable project anchors and project-level defaults that should help future runs.

## Purpose

Store durable project facts that are unlikely to change often and that the agent should reuse across later estimating work.

## Root shape

```yaml
projects:
  - project_key: string
    client_name: string
    primary_domain: string
    business_type: string
    default_audience: string
    preferred_output_style: string
    recurring_sources:
      - type: string
        label: string
        status: approved | reference_only | stale | excluded
    delivery_preferences:
      use_uk_english: boolean
      default_estimate_confidence_style: explicit | concise | detailed
    updated_at: YYYY-MM-DD
    confidence: confirmed | provisional
```

## Required fields

- `project_key`
- `client_name`
- `updated_at`
- `confidence`

## Field guidance

- `project_key`: stable project identifier, usually a domain or client-project slug.
- `primary_domain`: preferred when the project is tied to one live website.
- `recurring_sources`: only include reusable source locations, not one-off files.
- `delivery_preferences`: store only preferences that should persist across future runs.
- `confidence`: use `confirmed` for grounded defaults; use `provisional` only when the value is useful but not fully settled.

## Do store

- stable client or project identity
- recurring source locations
- default audience and output preferences
- project-level defaults likely to matter again

## Do not store

- temporary blockers
- one-off run notes
- copied source content
- secrets or credentials

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
