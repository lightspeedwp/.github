# Quality Rubric

## General Artefact Quality

An artefact is ready when it has:

- A clear objective.
- Source context and confidence labels.
- Named target tool or environment.
- A clear routing decision: stay here, route first, route instead, or return from specialist skill.
- Named related skill when specialist ownership is more appropriate.
- Concrete files to inspect, create, or edit.
- Boundaries and non-goals.
- Acceptance criteria.
- Verification steps.
- Human review checkpoints.

## WordPress Quality Checks

Check that the output:

- Uses block theme conventions where relevant.
- Places design tokens in `theme.json` or style variations where appropriate.
- Places business logic and reusable functionality in a plugin.
- Uses core blocks, patterns, template parts, block styles, and block supports before custom blocks.
- Avoids hardcoded visual values when tokens exist.
- Includes editor experience checks.
- Includes escaping, sanitisation, permissions, and nonce notes for PHP where relevant.
- Includes asset loading and performance notes.
- Includes accessibility checks.

## Figma Mapping Checks

Check that the output:

- Identifies variables, styles, components, variants, auto layout, and responsive behaviour.
- Separates design intent from implementation detail.
- Maps components to WordPress blocks, patterns, template parts, custom blocks, or plugin views.
- Marks any screenshot-only mapping as approximate.
- Includes missing design states such as hover, focus, active, error, loading, empty, and mobile.

## Agent Prompt Checks

Check that each coding-agent prompt:

- Has one primary objective.
- Names the files to inspect first.
- Names likely files to edit.
- Defines boundaries and files to avoid.
- Provides implementation order.
- Provides verification commands.
- Includes acceptance criteria.
- Tells the agent when to stop and ask for human review.

## Failure Conditions

Revise the output if it:

- Produces generic frontend work with no WordPress mapping.
- Treats a prototype as production code.
- Ignores theme/plugin boundaries.
- Omits QA or acceptance criteria.
- Claims exact Figma parity without enough source evidence.
- Requires a heavy custom framework without a clear return on maintenance cost.
- Hides work that should be owned by a more specific LightSpeed shared team skill.
- Omits the next route when the artefact is not the final delivery step.
