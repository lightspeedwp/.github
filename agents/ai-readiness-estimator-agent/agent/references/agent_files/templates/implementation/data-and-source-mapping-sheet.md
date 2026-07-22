---
template_id: data-and-source-mapping-sheet
version: 1.0.0
status: draft
---

# Data and Source Mapping Sheet

Use this sheet to map data fields between source systems and the AI solution.  
This helps ensure that data flows are understood, documented, and approved.

## Project

- **Client:** {{client.name}}
- **Package:** {{package.name}}
- **Prepared by:** {{owner.name}}

## Mapping Table

| Field / Data element | Source system | Source field | Destination / AI use | Transformation or processing | Owner | Notes |
|---|---|---|---|---|---|---|
| {{mapping.field}} | {{mapping.source_system}} | {{mapping.source_field}} | {{mapping.destination}} | {{mapping.processing}} | {{mapping.owner}} | {{mapping.notes}} |

## Data Sensitivity

Identify any fields containing personal or sensitive information and note the measures required to protect them.

| Field | Sensitivity level | Protection method | Approval |
|---|---|---|---|
| {{sensitive.field}} | {{sensitive.level}} | {{sensitive.protection}} | {{sensitive.approval}} |

## Data Ownership and Custody

List the owners or custodians of each source system and clarify responsibilities for data accuracy and access.

| Source system | Owner | Custodian | Notes |
|---|---|---|---|
| {{owner.system}} | {{owner.owner}} | {{owner.custodian}} | {{owner.notes}} |

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
