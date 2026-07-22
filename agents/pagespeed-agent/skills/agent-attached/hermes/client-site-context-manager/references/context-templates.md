# Client Site Context Templates

Use these templates when creating or updating workspace context files. Delete empty optional sections before saving.

## `index.md`

```markdown
# Client Site Context Index

| Client | Client ID | Sites | Status | Last Reviewed |
|---|---|---|---|---|
| Client Name | `client-slug` | `site-slug` | active | YYYY-MM-DD |
```

## `clients/client-slug/client.md`

```markdown
---
client_id: client-slug
canonical_name: Client Name
aliases: []
status: active
last_reviewed: YYYY-MM-DD
---

# Client Name

## Business Summary

One or two durable sentences about the organisation and why the website matters.

## Business Priorities

- **Priority:** Lead generation, ecommerce sales, bookings, subscriptions, donations, editorial reach, compliance, or similar.
  **Audit relevance:** How this should change future audit weighting.

## Primary Audiences

- Audience group.

## Markets

- Market or region when relevant to audits.

## Sites

| Site | Site ID | Role | Stable Domain |
|---|---|---|---|
| Site Name | `site-slug` | main website | example.com |

## Recurring Notes

| Note | Confidence | Source |
|---|---|---|
| Confirmed durable context note. | confirmed | user-provided |
```

## `clients/client-slug/sites/site-slug.md`

```markdown
---
site_id: site-slug
client_id: client-slug
canonical_name: Site Name
site_role: main website
stable_domain: example.com
last_reviewed: YYYY-MM-DD
---

# Site Name

## Platform

| Area | Value |
|---|---|
| CMS | WordPress |
| Ecommerce | WooCommerce |
| Theme or stack | LSXD / block theme / classic theme / custom / unknown |
| Hosting | Provider or durable hosting constraint when audit-relevant |

## Business Priorities

- **Priority:** Conversion, enquiries, bookings, subscriptions, editorial reach, or similar.
  **Audit relevance:** How future audits should weight findings.

## Constraints

| Constraint | Impact |
|---|---|
| Durable platform, hosting, legal, integration, or operational constraint. | Why future audits should know this. |

## Integrations

| Integration | Relevance |
|---|---|
| GA4, GTM, CRM, email platform, payment gateway, Wetu, booking engine, or similar. | Why auditors should consider it. |

## Recurring Notes

| Note | Confidence | Source |
|---|---|---|
| Confirmed durable site-level context. | confirmed | user-provided |
```

## `clients/client-slug/page-groups/site-slug.md`

```markdown
---
site_id: site-slug
client_id: client-slug
last_reviewed: YYYY-MM-DD

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
