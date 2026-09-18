# Audit Report Format: Broken References

**Version**: 1.0 | **Date**: 2026-09-18 | **Contract Type**: Machine-Readable Output Format

## Overview

Audit report documenting broken references resulting from agent file and folder renames. Output is in JSON format for machine parsing and human review.

## Top-Level Structure

```json
{
  "timestamp": "ISO 8601 datetime when audit was run",
  "audit_scope": "Description of what was scanned (e.g., 'all JavaScript imports in agents/ and scripts/')",
  "repository_state": "Git commit hash when audit ran",
  "summary": {
    "total_references_scanned": "number",
    "broken_references_found": "number",
    "critical_count": "number",
    "warning_count": "number",
    "info_count": "number"
  },
  "reference_types": [
    "javascript_import",
    "shell_script_path",
    "github_actions_reference"
  ],
  "references": [
    { ... },
    { ... }
  ]
}
```

## Reference Entry Schema

Each broken reference entry has:

```json
{
  "id": "Unique identifier for this reference",
  "file_path": "Relative path from repository root to file containing reference",
  "line_number": "Integer line number where reference appears",
  "column_number": "Integer column where reference starts (optional)",
  "reference_type": "One of: javascript_import, shell_script_path, github_actions_reference",
  "broken_reference": "The actual broken path/reference string",
  "expected_reference": "What the correct path should be (if determinable)",
  "severity": "One of: critical, warning, info",
  "category": "Import | Script path | Workflow reference",
  "reason": "Why this reference is broken (e.g., 'Agent folder renamed from prd-agent-old to prd-agent')",
  "suggested_fix": "Recommended remediation (e.g., 'Update import path to agents/prd-agent/config')",
  "auto_fixable": "Boolean: can fix be applied automatically or requires manual review",
  "affected_functionality": "What breaks if this reference is not fixed"
}
```

## Severity Levels

**Critical**

- Reference is in a core script or workflow that must work
- Code will fail at runtime without fix
- Example: Import of agent config in main execution path

**Warning**

- Reference may cause issues in certain scenarios
- Code may fail conditionally or in edge cases
- Example: Optional import with fallback

**Info**

- Reference is informational (comment, documentation)
- No runtime impact but should be updated for consistency
- Example: Agent name in a comment

## Examples

### Example 1: JavaScript Import (Critical)

```json
{
  "id": "js-import-001",
  "file_path": "scripts/agents/prd-agent/generate.js",
  "line_number": 45,
  "column_number": 23,
  "reference_type": "javascript_import",
  "broken_reference": "agents/prd-agent-old/config",
  "expected_reference": "agents/prd-agent/config",
  "severity": "critical",
  "category": "Import",
  "reason": "Agent folder was renamed from 'prd-agent-old' to 'prd-agent'",
  "suggested_fix": "Update line 45: change 'agents/prd-agent-old/config' to 'agents/prd-agent/config'",
  "auto_fixable": true,
  "affected_functionality": "Script cannot load agent configuration; will fail at runtime"
}
```

### Example 2: Shell Script Path (Warning)

```json
{
  "id": "shell-path-001",
  "file_path": ".github/workflows/agents.yml",
  "line_number": 23,
  "reference_type": "shell_script_path",
  "broken_reference": "scripts/agents/release-agent-old/release.sh",
  "expected_reference": "scripts/agents/release-agent/release.sh",
  "severity": "warning",
  "category": "Script path",
  "reason": "Script was moved as part of agent restructuring",
  "suggested_fix": "Update workflow to reference 'scripts/agents/release-agent/release.sh'",
  "auto_fixable": false,
  "affected_functionality": "Release workflow will fail when trying to execute script"
}
```

### Example 3: GitHub Actions Workflow Reference (Critical)

```json
{
  "id": "gh-actions-001",
  "file_path": ".github/workflows/ci.yml",
  "line_number": 52,
  "reference_type": "github_actions_reference",
  "broken_reference": "actions/agents/reviewer-agent-old",
  "expected_reference": "actions/agents/reviewer-agent",
  "severity": "critical",
  "category": "Workflow reference",
  "reason": "Agent was renamed during restructuring",
  "suggested_fix": "Update workflow step to use 'actions/agents/reviewer-agent'",
  "auto_fixable": false,
  "affected_functionality": "Code review workflow cannot invoke agent; CI will fail"
}
```

## Remediation Workflow

For each broken reference:

1. **Auto-fixable references** (auto_fixable=true)
   - Apply fix automatically using suggested_fix
   - Run broken-reference audit again to verify fix
   - Commit changes

2. **Manual review references** (auto_fixable=false)
   - Review suggested_fix and context
   - Apply fix manually to ensure correctness
   - Run broken-reference audit again to verify fix
   - Commit changes

3. **Info-level references** (severity=info)
   - Update for consistency but not urgent
   - Can be batched with other documentation updates

## Audit Report Validation

Reports are valid if:

- All required fields present in each reference entry
- Reference types match allowed values
- Severity levels match allowed values
- Line and column numbers are positive integers
- File paths are relative from repository root
- timestamp is ISO 8601 format
- No duplicate reference IDs

---

**Contract Complete**: Report format ready for implementation
