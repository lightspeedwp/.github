# Google Sheets Canvas Prompt: Proposal Desk Tester Workbook

Use this prompt to create a Google Sheets workbook that helps LightSpeed testers onboard to Proposal Desk and run a consistent pilot.

```markdown
Create a Google Sheets workbook for onboarding and testing the ChatGPT agent "Proposal Desk".

The workbook should be clear, lightweight, and easy for non-builders to use.

## Goal
Build a tester workbook that helps LightSpeed teammates:
1. understand what Proposal Desk does
2. understand what it should not do
3. see the best starter prompts and testing scenarios
4. run consistent tests with clear pass/fail criteria
5. log feedback, issues, and retests in a structured way

## Workbook requirements
Create separate tabs with clear names and short helper text at the top of each tab.
Use frozen header rows, filterable tables, clean column widths, and readable formatting.
Use simple color-coding for status, severity, and pass/fail fields.

## Required tabs

### 1) Overview
This tab is mandatory and should help a human tester understand the agent before they begin.
Include:
- Agent name: Proposal Desk
- Plain-English summary of what the agent does
- Main capabilities
- Main boundaries and guardrails
- What kinds of tasks it is good at
- What kinds of tasks it should not be used for during the pilot
- Pilot scope summary
- Read-only rule for all testing
- Approved vs excluded materials policy
- Quick checklist before testing

This tab should clearly explain the agent's capabilities, limits, and the context testers need in order to test properly.

### 2) Starter Prompts
This tab is mandatory.
Include the agent's main starter prompts in a tester-friendly way.
For each starter prompt include:
- Prompt title
- What it helps with
- When to use it
- Suggested input type
- Example starter prompt text
- What good output should look like

Include these starter prompt themes:
- Review a new RFP
- Find supporting proof
- Build a response pack
- Draft the exec summary
- Create a gap tracker
- Review support risk

### 3) How To Test
Include:
- how to prompt the agent well
- what context to provide
- what files or source material to attach or paste
- how to judge output quality
- how to recognise weak evidence handling
- when to mark a result pass or fail
- when to escalate to Ash instead of continuing

### 4) Test Cases
Create a table for realistic pilot scenarios.
Include columns for:
- Test ID
- Tester role
- Scenario
- Prompt to test
- Inputs required
- Expected behaviour
- Pass criteria
- Risk area
- Status
- Notes

### 5) Testing Criteria
Create a rubric tab that helps testers score results consistently.
Include rows for criteria such as:
- task understanding
- evidence use
- missing-context handling
- claim safety
- structure and clarity
- actionability
- approval-boundary handling
- materials-policy handling
- overall usefulness

For each criterion include:
- Criterion
- What to check
- Pass signal
- Fail signal
- Score guidance (1-5)

### 6) Feedback Log
Create a structured feedback table.
Include columns for:
- Feedback ID
- Linked Test ID
- Tester
- Role
- Date
- Prompt used
- Expected result
- Actual result
- Pass/Fail
- Score
- Severity
- Issue type
- Suggested fix
- Needs instruction change?
- Retest owner
- Retest status
- Notes

### 7) Approved Materials
Create a simple tab that explains what materials are allowed in the pilot.
Separate into:
- Approved by default
- Excluded unless Ash explicitly approves

Include examples such as:
Approved by default:
- low-risk internal examples
- sanitised client examples
- approved briefs, questionnaires, and discovery notes
- non-sensitive real work needed for proposal and review testing

Excluded unless approved:
- live client proposals with confidential pricing or commercial terms
- NDA-bound or client-confidential documents
- sensitive security questionnaires
- private internal strategy, finance, legal, or people documents
- personal data or privacy-sensitive records
- unapproved claims decks or drafts

## Formatting guidance
- Make the workbook usable by a tester who has never opened the editor.
- Prefer short plain-English instructions over builder jargon.
- Keep each tab focused.
- Use dropdown-friendly values for status where useful.
- Make the workbook feel like a practical pilot kit, not a generic spreadsheet.

## Tone
Use practical, concise UK English.
Make everything easy to scan.
Do not assume the tester knows how the agent was built.
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
