# OpenSpec Strict Variant

This variant is tailored for strict `/opsx:propose` parsing and uses frontmatter keys:

- `name`
- `about`
- `labels`

## Run Order

1. `parents/01-parent-test-coverage-hardening.md`
2. `children/01-phase-1-baseline-measurement.md`
3. `children/02-phase-2-metrics-agent-tests.md`
4. `children/03-phase-3-linting-agent-tests.md`
5. `children/04-phase-4-release-agent-enhancement.md`
6. `children/05-phase-5-utility-edge-cases.md`
7. `children/06-phase-6-validation-and-reporting.md`

## Notes

- Use the 62-task README as the source of truth for task content and acceptance criteria.
- Keep the parent issue focused on programme governance and the six phase issues focused on execution.
- Update the issue register and run log once the GitHub issues exist.
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
  classDef run fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px,color:#E65100;
  classDef gate fill:#F3E5F5,stroke:#6A1B9A,stroke-width:2px,color:#4A148C;
  classDef done fill:#E0F2F1,stroke:#00695C,stroke-width:2px,color:#004D40;

  class A start;
  class B prep;
  class C run;
  class D gate;
  class E done;
```
