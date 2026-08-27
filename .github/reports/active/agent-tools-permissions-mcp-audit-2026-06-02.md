---
title: "Agent Tools and MCP Permissions Audit"
description: "Deep audit of all agent specifications against the release agent tools and permissions baseline, including MCP-related access posture."
file_type: "documentation"
category: "agents"
created_date: "2026-06-02"
last_updated: "2026-06-02"
version: "v1.0.0"
authors: ["github-copilot"]
tags: ["agents", "audit", "mcp", "permissions", "tools"]
---

# Agent Tools and MCP Permissions Audit

## Scope

- Baseline: `agents/release.agent.md`
- Population: all `**/*.agent.md` files in repository
- Date: 2026-06-02

## Baseline Contract (Release Agent)

- Baseline tools count: 31
- Baseline permissions count: 9
- Baseline tools: file_system, markdown_generator, input_collector, adr_naming_helper, quality_checker, template_filler, context_analyzer, decision_rationale_extractor, alternative_evaluator, consequence_analyzer, implementation_planner, reference_manager, date_manager, stakeholder_identifier, status_manager, tag_manager, supersession_tracker, yaml_front_matter_generator, markdown_saver, language_enforcer, structure_enforcer, completeness_verifier, clarity_checker, consistency_checker, timeliness_checker, connection_checker, contextual_accuracy_checker, github/*, read, search, edit
- Baseline permissions: read, write, filesystem, network, github:repo, github:actions, github:workflows, github:pulls, shell

## Executive Summary

- Total agent specs audited: 25
- Exact baseline matches: 1
- Non-matching specs: 24
- Severity breakdown: critical=11, high=11, medium=2

### Top Risk Findings

- `10` agent specs define zero permissions.
- `6` agent specs define zero tools.
- Most-missing permissions: github:pulls(23), github:workflows(22), shell(22), github:actions(22), network(21), filesystem(16), github:repo(12), write(11), read(10)
- Most-missing tools: github/*(13), read(12), contextual_accuracy_checker(12), timeliness_checker(12), connection_checker(12), file_system(12), markdown_generator(12), input_collector(12)

## Detailed Matrix

| Agent file | Severity | Tools | Permissions | Missing tools | Missing permissions | Extra tools | Extra permissions |
|---|---:|---:|---:|---:|---:|---:|---:|
| `agents/adr.agent.md` | critical | 27 | 0 | 4 | 9 | 0 | 0 |
| `agents/issues.agent.md` | high | 31 | 4 | 0 | 6 | 0 | 1 |
| `agents/labeling.agent.md` | high | 31 | 4 | 0 | 6 | 0 | 1 |
| `agents/linting.agent.md` | medium | 31 | 7 | 0 | 2 | 0 | 0 |
| `agents/meta.agent.md` | high | 31 | 4 | 0 | 5 | 0 | 0 |
| `agents/metrics.agent.md` | high | 31 | 5 | 0 | 4 | 0 | 0 |
| `agents/mode-demonstrate-understanding.agent.md` | critical | 0 | 0 | 31 | 9 | 0 | 0 |
| `agents/mode-document-reviewer.agent.md` | high | 8 | 2 | 29 | 7 | 6 | 0 |
| `agents/mode-prd.agent.md` | critical | 11 | 0 | 30 | 9 | 10 | 0 |
| `agents/mode-thinking.agent.md` | high | 6 | 3 | 29 | 6 | 4 | 0 |
| `agents/project-meta-sync.agent.md` | high | 31 | 6 | 0 | 4 | 0 | 1 |
| `agents/prompt-engineer.agent.md` | high | 31 | 4 | 0 | 5 | 0 | 0 |
| `agents/release.agent.md` | low | 31 | 9 | 0 | 0 | 0 | 0 |
| `agents/reporting.agent.md` | high | 31 | 5 | 0 | 4 | 0 | 0 |
| `agents/reviewer.agent.md` | high | 31 | 6 | 0 | 5 | 0 | 2 |
| `agents/task-planner.agent.md` | high | 31 | 4 | 0 | 5 | 0 | 0 |
| `agents/task-researcher.agent.md` | critical | 3 | 1 | 29 | 8 | 1 | 0 |
| `agents/template.agent.md` | critical | 0 | 0 | 31 | 9 | 0 | 0 |
| `agents/testing.agent.md` | medium | 31 | 7 | 0 | 2 | 0 | 0 |
| `plugins/lightspeed-github-ops/agents/reviewer.agent.md` | critical | 0 | 0 | 31 | 9 | 0 | 0 |
| `plugins/lightspeed-metrics-and-reporting/agents/metrics-reporting-orchestrator.agent.md` | critical | 0 | 0 | 31 | 9 | 0 | 0 |
| `plugins/lightspeed-quality-assurance/agents/qa-orchestrator.agent.md` | critical | 0 | 0 | 31 | 9 | 0 | 0 |
| `plugins/lightspeed-release-ops/agents/release-ops-orchestrator.agent.md` | critical | 0 | 0 | 31 | 9 | 0 | 0 |
| `plugins/lightspeed-wordpress-governance/agents/wordpress-governance-reviewer.agent.md` | critical | 4 | 0 | 31 | 9 | 4 | 0 |
| `plugins/lightspeed-wordpress-planning/agents/project-spec-orchestrator.agent.md` | critical | 4 | 0 | 31 | 9 | 4 | 0 |

## Per-Agent Gap Details

### `agents/adr.agent.md`

- Severity: critical
- Missing tools: github/*, read, search, edit
- Missing permissions: read, write, filesystem, network, github:repo, github:actions, github:workflows, github:pulls, shell

### `agents/issues.agent.md`

- Severity: high
- Missing permissions: filesystem, network, github:actions, github:workflows, github:pulls, shell
- Extra permissions: github:issues

### `agents/labeling.agent.md`

- Severity: high
- Missing permissions: filesystem, network, github:actions, github:workflows, github:pulls, shell
- Extra permissions: github:issues

### `agents/linting.agent.md`

- Severity: medium
- Missing permissions: network, github:pulls

### `agents/meta.agent.md`

- Severity: high
- Missing permissions: network, github:actions, github:workflows, github:pulls, shell

### `agents/metrics.agent.md`

- Severity: high
- Missing permissions: github:actions, github:workflows, github:pulls, shell

### `agents/mode-demonstrate-understanding.agent.md`

- Severity: critical
- Missing tools: file_system, markdown_generator, input_collector, adr_naming_helper, quality_checker, template_filler, context_analyzer, decision_rationale_extractor, alternative_evaluator, consequence_analyzer, implementation_planner, reference_manager, date_manager, stakeholder_identifier, status_manager, tag_manager, supersession_tracker, yaml_front_matter_generator, markdown_saver, language_enforcer, structure_enforcer, completeness_verifier, clarity_checker, consistency_checker, timeliness_checker, connection_checker, contextual_accuracy_checker, github/*, read, search, edit
- Missing permissions: read, write, filesystem, network, github:repo, github:actions, github:workflows, github:pulls, shell

### `agents/mode-document-reviewer.agent.md`

- Severity: high
- Missing tools: file_system, markdown_generator, input_collector, adr_naming_helper, quality_checker, template_filler, context_analyzer, decision_rationale_extractor, alternative_evaluator, consequence_analyzer, implementation_planner, reference_manager, date_manager, stakeholder_identifier, status_manager, tag_manager, supersession_tracker, yaml_front_matter_generator, markdown_saver, language_enforcer, structure_enforcer, completeness_verifier, clarity_checker, consistency_checker, timeliness_checker, connection_checker, contextual_accuracy_checker, github/*, read
- Missing permissions: filesystem, network, github:repo, github:actions, github:workflows, github:pulls, shell
- Extra tools: shell, fetch, runTasks, githubRepo, todos, runSubagent

### `agents/mode-prd.agent.md`

- Severity: critical
- Missing tools: file_system, markdown_generator, input_collector, adr_naming_helper, quality_checker, template_filler, context_analyzer, decision_rationale_extractor, alternative_evaluator, consequence_analyzer, implementation_planner, reference_manager, date_manager, stakeholder_identifier, status_manager, tag_manager, supersession_tracker, yaml_front_matter_generator, markdown_saver, language_enforcer, structure_enforcer, completeness_verifier, clarity_checker, consistency_checker, timeliness_checker, connection_checker, contextual_accuracy_checker, github/*, read, edit
- Missing permissions: read, write, filesystem, network, github:repo, github:actions, github:workflows, github:pulls, shell
- Extra tools: codebase, edit/editFiles, fetch, findTestFiles, list_issues, githubRepo, add_issue_comment, issue_write, issue_read, search_issues

### `agents/mode-thinking.agent.md`

- Severity: high
- Missing tools: file_system, markdown_generator, input_collector, adr_naming_helper, quality_checker, template_filler, context_analyzer, decision_rationale_extractor, alternative_evaluator, consequence_analyzer, implementation_planner, reference_manager, date_manager, stakeholder_identifier, status_manager, tag_manager, supersession_tracker, yaml_front_matter_generator, markdown_saver, language_enforcer, structure_enforcer, completeness_verifier, clarity_checker, consistency_checker, timeliness_checker, connection_checker, contextual_accuracy_checker, github/*, read
- Missing permissions: filesystem, network, github:actions, github:workflows, github:pulls, shell
- Extra tools: codebase, fetch, bash, webSearch

### `agents/project-meta-sync.agent.md`

- Severity: high
- Missing permissions: github:actions, github:workflows, github:pulls, shell
- Extra permissions: github:issues

### `agents/prompt-engineer.agent.md`

- Severity: high
- Missing permissions: network, github:actions, github:workflows, github:pulls, shell

### `agents/reporting.agent.md`

- Severity: high
- Missing permissions: github:actions, github:workflows, github:pulls, shell

### `agents/reviewer.agent.md`

- Severity: high
- Missing permissions: filesystem, network, github:actions, github:workflows, shell
- Extra permissions: github:issues, github:checks

### `agents/task-planner.agent.md`

- Severity: high
- Missing permissions: network, github:actions, github:workflows, github:pulls, shell

### `agents/task-researcher.agent.md`

- Severity: critical
- Missing tools: file_system, markdown_generator, input_collector, adr_naming_helper, quality_checker, template_filler, context_analyzer, decision_rationale_extractor, alternative_evaluator, consequence_analyzer, implementation_planner, reference_manager, date_manager, stakeholder_identifier, status_manager, tag_manager, supersession_tracker, yaml_front_matter_generator, markdown_saver, language_enforcer, structure_enforcer, completeness_verifier, clarity_checker, consistency_checker, timeliness_checker, connection_checker, contextual_accuracy_checker, github/*, edit
- Missing permissions: write, filesystem, network, github:repo, github:actions, github:workflows, github:pulls, shell
- Extra tools: fetch

### `agents/template.agent.md`

- Severity: critical
- Missing tools: file_system, markdown_generator, input_collector, adr_naming_helper, quality_checker, template_filler, context_analyzer, decision_rationale_extractor, alternative_evaluator, consequence_analyzer, implementation_planner, reference_manager, date_manager, stakeholder_identifier, status_manager, tag_manager, supersession_tracker, yaml_front_matter_generator, markdown_saver, language_enforcer, structure_enforcer, completeness_verifier, clarity_checker, consistency_checker, timeliness_checker, connection_checker, contextual_accuracy_checker, github/*, read, search, edit
- Missing permissions: read, write, filesystem, network, github:repo, github:actions, github:workflows, github:pulls, shell

### `agents/testing.agent.md`

- Severity: medium
- Missing permissions: network, github:pulls

### `plugins/lightspeed-github-ops/agents/reviewer.agent.md`

- Severity: critical
- Missing tools: file_system, markdown_generator, input_collector, adr_naming_helper, quality_checker, template_filler, context_analyzer, decision_rationale_extractor, alternative_evaluator, consequence_analyzer, implementation_planner, reference_manager, date_manager, stakeholder_identifier, status_manager, tag_manager, supersession_tracker, yaml_front_matter_generator, markdown_saver, language_enforcer, structure_enforcer, completeness_verifier, clarity_checker, consistency_checker, timeliness_checker, connection_checker, contextual_accuracy_checker, github/*, read, search, edit
- Missing permissions: read, write, filesystem, network, github:repo, github:actions, github:workflows, github:pulls, shell

### `plugins/lightspeed-metrics-and-reporting/agents/metrics-reporting-orchestrator.agent.md`

- Severity: critical
- Missing tools: file_system, markdown_generator, input_collector, adr_naming_helper, quality_checker, template_filler, context_analyzer, decision_rationale_extractor, alternative_evaluator, consequence_analyzer, implementation_planner, reference_manager, date_manager, stakeholder_identifier, status_manager, tag_manager, supersession_tracker, yaml_front_matter_generator, markdown_saver, language_enforcer, structure_enforcer, completeness_verifier, clarity_checker, consistency_checker, timeliness_checker, connection_checker, contextual_accuracy_checker, github/*, read, search, edit
- Missing permissions: read, write, filesystem, network, github:repo, github:actions, github:workflows, github:pulls, shell

### `plugins/lightspeed-quality-assurance/agents/qa-orchestrator.agent.md`

- Severity: critical
- Missing tools: file_system, markdown_generator, input_collector, adr_naming_helper, quality_checker, template_filler, context_analyzer, decision_rationale_extractor, alternative_evaluator, consequence_analyzer, implementation_planner, reference_manager, date_manager, stakeholder_identifier, status_manager, tag_manager, supersession_tracker, yaml_front_matter_generator, markdown_saver, language_enforcer, structure_enforcer, completeness_verifier, clarity_checker, consistency_checker, timeliness_checker, connection_checker, contextual_accuracy_checker, github/*, read, search, edit
- Missing permissions: read, write, filesystem, network, github:repo, github:actions, github:workflows, github:pulls, shell

### `plugins/lightspeed-release-ops/agents/release-ops-orchestrator.agent.md`

- Severity: critical
- Missing tools: file_system, markdown_generator, input_collector, adr_naming_helper, quality_checker, template_filler, context_analyzer, decision_rationale_extractor, alternative_evaluator, consequence_analyzer, implementation_planner, reference_manager, date_manager, stakeholder_identifier, status_manager, tag_manager, supersession_tracker, yaml_front_matter_generator, markdown_saver, language_enforcer, structure_enforcer, completeness_verifier, clarity_checker, consistency_checker, timeliness_checker, connection_checker, contextual_accuracy_checker, github/*, read, search, edit
- Missing permissions: read, write, filesystem, network, github:repo, github:actions, github:workflows, github:pulls, shell

### `plugins/lightspeed-wordpress-governance/agents/wordpress-governance-reviewer.agent.md`

- Severity: critical
- Missing tools: file_system, markdown_generator, input_collector, adr_naming_helper, quality_checker, template_filler, context_analyzer, decision_rationale_extractor, alternative_evaluator, consequence_analyzer, implementation_planner, reference_manager, date_manager, stakeholder_identifier, status_manager, tag_manager, supersession_tracker, yaml_front_matter_generator, markdown_saver, language_enforcer, structure_enforcer, completeness_verifier, clarity_checker, consistency_checker, timeliness_checker, connection_checker, contextual_accuracy_checker, github/*, read, search, edit
- Missing permissions: read, write, filesystem, network, github:repo, github:actions, github:workflows, github:pulls, shell
- Extra tools: runTests, file_search, read_file, grep_search

### `plugins/lightspeed-wordpress-planning/agents/project-spec-orchestrator.agent.md`

- Severity: critical
- Missing tools: file_system, markdown_generator, input_collector, adr_naming_helper, quality_checker, template_filler, context_analyzer, decision_rationale_extractor, alternative_evaluator, consequence_analyzer, implementation_planner, reference_manager, date_manager, stakeholder_identifier, status_manager, tag_manager, supersession_tracker, yaml_front_matter_generator, markdown_saver, language_enforcer, structure_enforcer, completeness_verifier, clarity_checker, consistency_checker, timeliness_checker, connection_checker, contextual_accuracy_checker, github/*, read, search, edit
- Missing permissions: read, write, filesystem, network, github:repo, github:actions, github:workflows, github:pulls, shell
- Extra tools: runTests, file_search, read_file, grep_search

## Audit Conclusion

- The release agent is the only exact match to the target contract.
- Tool definitions are generally aligned in core agents, but permissions are inconsistently under-scoped.
- Several mode/template/plugin agents have little or no declared tools/permissions and require contract hardening before MCP-reliant execution.

## Recommended Remediation Waves

1. Critical: add full baseline permissions to zero-permission agents and zero-tool agents where they are expected to execute.
2. High: normalise missing `github:actions`, `github:workflows`, `github:pulls`, `shell`, `network` permissions across orchestrator agents.
3. Medium: reconcile intentional extras (for example `github:issues`, `github:checks`) into a documented superset policy.
