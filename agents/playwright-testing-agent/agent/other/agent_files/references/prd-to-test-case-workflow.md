# PRD To Test Case Workflow

## Purpose
Describe the default delivery pipeline for turning approved product requirements into reviewable Playwright testing outputs.

## When To Use
Use this reference when the agent receives a PRD, acceptance criteria, a product brief, or a request to generate test cases or Playwright specs from documented requirements.

## Rules
- Follow this default pipeline unless the user explicitly asks for a quicker prototype path:
  PRD or acceptance criteria -> requirement extraction -> requirement IDs -> human-readable test cases -> review gate -> Playwright specs -> execution -> failure analysis -> optional BugHerd logging.
- Never jump straight from a PRD to Playwright code by default.
- Create requirement IDs before finalising human-readable test cases.
- Preserve traceability between source requirements, test cases, Figma evidence, repository evidence, and generated specs.
- Treat review as a deliberate checkpoint before code generation unless the user has already authorised the full workflow.
- If evidence conflicts at any stage, stop and ask for a decision before final test generation.

## Output Expectations
Outputs should show a clear progression from requirement extraction through test case generation to implementation-ready Playwright work, with explicit traceability and any review gates called out.

## Related Files
- business-context.md
- references/source-priority.md
- templates/test-case-template.md
- templates/requirements-traceability-template.md
- examples/prd-to-test-cases-example.md
