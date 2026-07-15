# Agent improvement implementation plan

## Phase 1: Reliability validators

### 1. Skill routing inventory validator

- **File:** `scripts/validate_skill_routing_inventory.py`
- **Goal:** verify that the skill-routing model matches the currently attached Zendesk skill inventory
- **Checks:**
  - all expected skill-routing sections exist
  - every referenced Zendesk skill name is attached and approved
  - no unknown or stale Zendesk skill names appear in routing references
  - optional instructions snapshot references only attached skills

### 2. Report-defaults key validator

- **File:** `scripts/validate_report_defaults_keys.py`
- **Goal:** tighten semantic validation for `memory/report-defaults.yaml`
- **Checks:**
  - required keys present
  - only approved keys allowed
  - approved values for `default_scope`, `grouping_priority`, `include_sections`, and `example_ticket_rule`

### 3. User-preferences schema

- **File:** `schemas/user-preferences.schema.json`
- **Goal:** define a stricter schema for durable preference categories

### 4. Drafting-preferences schema

- **File:** `schemas/drafting-preferences.schema.json`
- **Goal:** define a stricter schema for tone, brevity, escalation style, and handoff style defaults

## Phase 2: Output consistency

### 5. Backlog report template

- **File:** `templates/agent-backlog-report-template.md`
- **Goal:** standardize backlog-analysis outputs

### 6. Backlog report example

- **File:** `examples/templates/agent-backlog-report.example.md`
- **Goal:** provide a validated example for the backlog report template

### 7. Handoff template

- **File:** `templates/agent-handoff-template.md`
- **Goal:** standardize internal support handoff outputs

### 8. Handoff example

- **File:** `examples/templates/agent-handoff.example.md`
- **Goal:** provide a validated example for the handoff template

### 9. Triage summary template

- **File:** `templates/agent-triage-summary-template.md`
- **Goal:** standardize first-pass triage deliverables

### 10. Triage summary example

- **File:** `examples/templates/agent-triage-summary.example.md`
- **Goal:** provide a validated example for triage summary outputs

## Phase 3: Behavior assurance

### 11. Skill routing tests

- **File:** `tests/skill-routing-tests.md`
- **Goal:** verify common request types route to the expected skill family

### 12. Starter prompt tests

- **File:** `tests/starter-prompt-tests.md`
- **Goal:** verify each starter prompt matches a supported workflow

### 13. Reply safety tests

- **File:** `tests/reply-safety-tests.md`
- **Goal:** verify grounded wording, promise safety, and escalation boundaries for reply drafts

## Recommended execution order

1. `scripts/validate_skill_routing_inventory.py`
2. `scripts/validate_report_defaults_keys.py`
3. `schemas/user-preferences.schema.json`
4. `schemas/drafting-preferences.schema.json`
5. backlog report template and example
6. handoff template and example
7. triage summary template and example
8. skill-routing and starter-prompt tests
9. reply safety tests
