# Research Synthesis Template

Use this structure for `research-synthesis`.

## Sections

1. `Objective` What decision or design problem the synthesis should inform.
2. `Inputs` Evidence sources and any notable gaps in coverage.
3. `Themes` Repeated patterns across sources.
4. `Tensions` Contradictions, tradeoffs, or mismatches between user needs and current behavior.
5. `User needs` Clear statements of needs, jobs, or expectations.
6. `Opportunity areas` Where design can reduce friction or create value.
7. `Implications for design` What the team should do differently.

## Theme schema

For each major theme, structure the synthesis with:

- `User job`: what the user is actually trying to get done
- `Breakdown`: where the current experience fails or becomes unreliable
- `Observed evidence`: what directly supports the theme
- `Current workaround`: what users do instead today
- `Cost of workaround`: time, risk, trust, operational burden, or churn risk
- `Design implication`: what should change in the product or workflow
- `Confidence`: `high`, `medium`, or `low`

Treat this as a root-cause-oriented synthesis, not a request list.

## Evidence quality checks

- Remove exact duplicates and collapse near-duplicates.
- Preserve corroboration count even when repeated items are merged.
- Do not let repeated phrasing in one source inflate theme importance.
- Separate:
  - symptoms
  - likely root causes
  - requests
  - workarounds
  - evidence gaps
- Prefer direct evidence over summary-of-summary documents when both exist.
- Treat the same issue across multiple source types as corroboration, not as separate themes.

## Confidence rubric

- `High`: repeated across multiple independent sources or source types, with observed behavior, clear workaround patterns, or obvious operational impact
- `Medium`: repeated within one source type or supported by several examples, but the root cause still has some ambiguity
- `Low`: sparse evidence, isolated requests, or plausible interpretation with weak corroboration

Do not assign high confidence just because the complaint is strongly worded.

## Prioritization rules

Rank opportunities using:

- impact on user outcomes
- frequency across sources
- severity of friction
- cost of workaround
- strategic relevance to the feature or workflow
- confidence in the evidence

When opportunities are close, prefer the one that:

- improves trust
- reduces repeated manual coordination
- removes user-invented operating models
- unblocks task completion for more than one persona or workflow step

## Guardrails

- Bias toward product and design inputs first.
- Distinguish evidence-backed findings from interpretation.
- Avoid broad market narratives unless the user asks for them.
- Favor recurring workflow failures over isolated preference requests.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
