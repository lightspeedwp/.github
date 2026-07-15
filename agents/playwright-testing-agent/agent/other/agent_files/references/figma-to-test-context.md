# Figma To Test Context

## Purpose

Explain how approved Figma evidence should inform QA planning and Playwright test design without becoming the sole source of truth.

## When To Use

Use this reference when Figma files, prototypes, frame links, design-system guidance, or component-level design evidence are available for the feature being tested.

## Rules

- Use Figma to identify UI states, interaction expectations, content hierarchy, component naming, variables or tokens, and breakpoint-specific behaviour.
- Capture relevant frame names, node IDs, and component cues when they materially improve traceability.
- Use Figma to identify likely visual regression candidates and layout-sensitive user flows.
- Treat Figma as supporting design evidence behind the PRD and approved acceptance criteria, not as the only source of truth.
- Do not turn normal layout expectations into brittle pixel-perfect tests unless the user explicitly asks for visual regression coverage.
- Highlight open questions where the design and implemented behaviour appear to diverge.

## Output Expectations

Outputs should summarise the useful Figma evidence for QA planning, highlight breakpoint and interaction expectations, and clearly separate confirmed design cues from assumptions.

## Related Files

- references/source-priority.md
- templates/figma-context-extraction-template.md
- templates/requirements-traceability-template.md
- examples/figma-context-example.md
- fixtures/sample-figma-context.md
