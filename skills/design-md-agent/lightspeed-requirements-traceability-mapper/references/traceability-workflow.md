# Traceability Workflow

## 1. Gather sources

List all available planning and delivery artefacts:

- PRD
- technical brief
- task breakdown
- GitHub issue drafts
- implementation plan
- QA plan
- launch gate checklist
- project memory files

## 2. Extract requirements

Create a requirement register. Each requirement should have:

- requirement ID
- source document
- short description
- category
- priority
- owner or role
- acceptance expectation
- launch relevance

## 3. Map downstream coverage

For each requirement, map:

- technical brief item
- epic or task
- GitHub issue draft
- acceptance criteria
- QA check
- launch gate
- status

## 4. Identify gaps

Flag:

- requirements with no task
- tasks with no requirement
- issues with no acceptance criteria
- requirements with no QA check
- launch-critical requirements without a launch gate
- duplicated requirements
- unclear requirements

## 5. Recommend fixes

For every gap, recommend one practical action:

- add task
- add issue
- add acceptance criterion
- add QA check
- clarify requirement
- merge duplicate
- move out of scope
- mark launch blocker
