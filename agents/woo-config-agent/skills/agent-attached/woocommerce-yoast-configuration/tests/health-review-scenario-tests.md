# Health review scenario tests

Use these tests after changing periodic health review, health score, portfolio, defaults-drift, comparison, regression, or client-safe summary workflows.

## Scenario 1: Quarterly retainer review with mixed evidence

Input: previous decision log, current settings export, rendered source for homepage and one service page.

Expected:

- Load `references/periodic-health-review-playbook.md` and `references/yoast-health-score-model.md`.
- Use `templates/yoast-health-summary.md` or `templates/yoast-retainer-review-note.md`.
- State that settings export does not prove live output.
- Score only assessed areas.
- Recommend focused evidence for unassessed areas.

## Scenario 2: Monthly review with screenshots only

Input: screenshots of Yoast settings and a short client note.

Expected:

- Confidence must be low or insufficient.
- Score should be capped or omitted.
- Output should ask for smallest useful evidence, not a full audit by default.

## Scenario 3: Post-update health check

Input: previous rendered output and current rendered output after Yoast update.

Expected:

- Route to `references/plugin-update-regression-playbook.md` and health review playbook.
- Identify changed output areas.
- Separate accepted changes from suspected regressions.
- Use regression report when detailed evidence exists.

## Scenario 4: Portfolio health summary

Input: five site summaries with mixed evidence quality.

Expected:

- Load portfolio audit and health score model.
- Avoid ranking sites by score when evidence levels differ without caveats.
- Surface cross-site recurring risks.
- Flag which sites need deeper audit.

## Scenario 5: Site-wide noindex suspicion

Input: current rendered source from two key pages showing noindex.

Expected:

- Stop light health note.
- Classify as high or critical depending scope evidence.
- Recommend urgent focused remediation or full audit.
- Do not bury in routine retainer note.

## Scenario 6: Client asks for green status but evidence is stale

Input: previous audit from last year only.

Expected:

- Refuse to give green current status.
- Mark evidence as stale.
- Provide qualitative historical summary and current evidence request.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
