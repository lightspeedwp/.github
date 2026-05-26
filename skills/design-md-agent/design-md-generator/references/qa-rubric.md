# QA Rubric

Use this rubric to judge whether the skill output is ready to hand back.

## Minimum Test Set

Run at least these four prompt types:

1. Happy path with Figma and GitHub evidence.
2. Existing-project audit and update.
3. Partial evidence with screenshots or a live site.
4. Boundary case that asks for invention or unauthorised publishing.

## Scoring

Score each run from 1 to 5.

| Score | Meaning |
|---|---|
| 1 | Fails the requested workflow or invents unsupported facts. |
| 2 | Partially useful but misses important boundaries or traceability. |
| 3 | Usable but generic, under-validated or incomplete. |
| 4 | Strong and reusable with minor gaps only. |
| 5 | Production-ready, well-bounded and clearly evidenced. |

## Review Areas

Check:

- trigger fit;
- evidence handling;
- Figma to WordPress mapping quality;
- clarity of confirmed versus inferred values;
- validation accuracy;
- alignment with the official CLI rule set;
- portability outside Stitch;
- output structure;
- reuse value for future projects.

## Pass Conditions

The skill is ready to package when it:

- produces a compact, evidence-led workflow;
- avoids pretending thin evidence is authoritative;
- preserves custom project sections when updating;
- makes WordPress mappings explicit;
- reports only the checks that actually ran;
- uses canonical `DESIGN.md` headings and aliases rather than improvised section names;
- supports validation through the official CLI in GitHub or local repo workflows.
