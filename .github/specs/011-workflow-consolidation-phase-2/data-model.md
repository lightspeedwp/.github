---
title: "Workflow State and Metadata"
---

# Data Model

## Workflow Metadata

Each unified workflow manages:

- Workflow triggers (PR, issue, push, schedule)
- Job dependencies and parallelization
- Output artifacts (logs, reports, metrics)
- Status notifications and checks

## Consolidated Entities

### LabelingState

- Input: PR/Issue events
- Output: Applied labels (prefixed per label taxonomy)
- Related workflows: 9 archived labeling workflows

### ValidationState

- Input: Branch names, PR templates, changelog
- Output: Validation check results, comments
- Related workflows: 12 archived validation workflows

### TestExecutionState

- Input: Push/PR events
- Output: Test results, coverage reports, artifacts
- Related workflows: 8 archived testing workflows

### QualityGateState

- Input: Code changes, secrets, specs
- Output: Security findings, audit reports
- Related workflows: 5 utilities workflows
