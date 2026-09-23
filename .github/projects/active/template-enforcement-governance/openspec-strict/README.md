# OpenSpec Strict Variant

This variant is prepared for strict `/opsx:propose` parsing for the template enforcement governance project.

Required frontmatter keys for each input:

- `name`
- `about`
- `labels`

## Run Order

1. `children/01-issue-template-governance-enforcement.md`
2. `children/02-pr-template-governance-enforcement.md`

## Notes

- Inputs are derived from `ISSUES.md` in this project folder.
- Each proposal is intentionally scoped to one track to avoid cross-contamination.
- Update `RUN_LOG.md` after each `/opsx:propose` attempt.

## Visual Workflow

```mermaid
flowchart TD
  accTitle: flowchart diagram
  accDescr: flowchart flowchart
  A[Start Here] --> B[Read Scope and Prerequisites]
  B --> C[Run the Documented Workflow]
  C --> D[Validate with Repo Tooling]
  D --> E[Open PR or Hand-off]

  classDef start fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#1B5E20;
  classDef prep fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#0D47A1;
  classDef run fill:#fef3c7,stroke:#b45309,stroke-width:2px,color:#4a2c00;
  classDef gate fill:#f3e8ff,stroke:#7e22ce,stroke-width:2px,color:#3b0764;
  classDef done fill:#E0F2F1,stroke:#00695C,stroke-width:2px,color:#004D40;

  class A start;
  class B prep;
  class C run;
  class D gate;
  class E done;
```
