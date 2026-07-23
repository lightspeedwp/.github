# Developer Handoff Reference

## When to load

Load when the user asks for developer tasks, implementation notes, risky change review, code-level SEO output issues or handoff from audit findings.

## What it helps decide

Turn findings into safe, testable developer notes without writing a configuration playbook.

## Key checks

- State the problem in observable terms.
- Include evidence and affected locations.
- Define expected output rather than prescribing risky database edits.
- Prefer supported Yoast APIs, filters or WordPress hooks where code changes are genuinely required.
- Avoid direct edits to Yoast generated tables.
- Include QA steps for rendered output, sitemap, schema, canonical, robots and metadata where relevant.

## Routing notes

- Developer handoff from findings: `woocommerce-yoast-auditor`.
- Configuration setup instructions: `woocommerce-yoast-configuration`.
- Code implementation: developer or repo workflow.

## Output expectations

Each handoff item must include problem, evidence, affected locations, expected output, suggested implementation route, QA steps, risk, dependencies and owner.
