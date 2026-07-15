# Validation Guide

Validate this agent by checking:

- Zendesk remains the main workflow anchor
- all attached apps are represented in the instructions with the right role boundaries
- the instructions point to real files and current validation assets
- skill routing remains narrow, non-overlapping, and complete across the attached Zendesk skill directory
- templates, examples, fixtures, profiles, schemas, memory files, and references are present and internally consistent
- memory guidance matches the approved files, examples, schemas, and scripts
- output templates and examples stay aligned

## Validation inventory

Use these files as the primary validation inventory:

- `tests/schema-validation-smoke-tests.md`
- `tests/schema-validation-tests.md`
- `tests/skill-routing-tests.md`
- `tests/starter-prompt-tests.md`
- `tests/reply-safety-tests.md`
- `tests/app-usage-consistency-tests.md`
- `tests/memory-validation-tests.md`
- `tests/zendesk-support-agent-smoke-tests.md`

## Suggested run order

1. `python scripts/run_agent_file_checks.py`
2. `python scripts/validate_templates.py`
3. `python scripts/validate_memory.py`
4. `python scripts/validate_instruction_references.py --instructions-file references/instructions.snapshot.md`
5. `python scripts/validate_skill_routing_inventory.py --instructions-file references/instructions.snapshot.md`
6. `python scripts/validate_app_usage_consistency.py --instructions-file references/instructions.snapshot.md`
7. `python scripts/validate_schema_files.py`
8. `python scripts/validate_memory_content.py`
9. `python scripts/validate_profiles_and_fixtures.py`
10. `python scripts/validate_template_example_parity.py`
11. `bash scripts/validate-folder-schemas.sh`

## Pass criteria

- no stale file references in the instructions snapshot
- no missing attached-app coverage in the instructions snapshot
- every attached Zendesk skill is represented correctly in the routing inventory
- all required templates, examples, memory files, schemas, fixtures, profiles, scripts, and tests exist
- memory content remains constrained to approved durable data
- profile and fixture files match their schemas and expected headings
- templates and paired examples stay structurally aligned

## Common failure patterns

- a material instruction rewrite was made without refreshing `references/instructions.snapshot.md`
- a new or renamed validation file was not added to the inventory
- a memory file includes case-specific detail or suspicious copied evidence
- a template and its paired example drifted apart
- a routing reference misses an attached Zendesk skill or places it in the wrong section
