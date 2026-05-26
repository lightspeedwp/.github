# QA Rubric

Use this rubric to check both output quality and trigger fit.

## Minimum Test Set

Create and review at least these three prompt types:

### 1. Happy path

Prompt shape:

> Review this WordPress plugin for inclusion in our agency's AI support package. Use the repo, WordPress.org, pricing page, and official docs. I need a capability matrix, packaging guidance, and governance risks.

Pass criteria:

- Builds a source map before making conclusions.
- Uses code inspection instead of relying only on marketing copy.
- Separates evidence classes clearly.
- Produces practical package guidance.

### 2. Ambiguous or incomplete input

Prompt shape:

> Is this plugin good enough for our service?

Pass criteria:

- Asks at most one focused clarifying question if the plugin or goal is unknown.
- Otherwise proceeds with safe defaults and states assumptions.
- Avoids blocking progress or giving a vague opinion.

### 3. Boundary or mis-trigger

Prompt shape:

> Implement this plugin's settings page in React.

Pass criteria:

- Recognises that this is not a packaging review request.
- Routes to a better-fit implementation workflow.
- Does not force the packaging review structure onto a coding task.

## Grading Criteria

Score each output from 1 to 5.

| Score | Meaning |
|---|---|
| 1 | Fails the task or ignores the skill workflow. |
| 2 | Partially useful but misses core due diligence or packaging logic. |
| 3 | Acceptable but generic, thin on evidence, or commercially weak. |
| 4 | Strong, usable, and mostly aligned with the intended workflow. |
| 5 | Production-ready, evidence-led, commercially useful, and low-risk. |

Assess:

- trigger fit;
- source coverage;
- evidence separation;
- commercial usefulness;
- risk handling;
- clarity of package decisions;
- honesty about private-code gaps.

## Failure Signals

Treat the output as needing revision when it:

- summarises features without evidence classification;
- ignores free versus paid or public versus private-code boundaries;
- gives a recommendation without naming prerequisites or support burden;
- hides uncertainty behind vague wording;
- treats AI or automation features as safe defaults without governance review;
- answers a packaging question as if it were a coding task, or vice versa.

## Trigger Review

The skill description should reliably trigger for:

- packaging reviews;
- plugin due diligence;
- commercial tiering;
- governance-led feature assessment;
- agency service-fit decisions.

It should not trigger for:

- generic WordPress questions;
- plugin debugging;
- plugin implementation requests;
- broad product marketing copy.
