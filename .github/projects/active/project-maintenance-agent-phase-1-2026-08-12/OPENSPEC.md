---
file_type: documentation
title: ""Project Maintenance Agent — OpenSpec Technical Specification""
description: ""Formal technical specification for the portable Project Maintenance Agent""
created_date: 2026-08-12
last_updated: "2026-08-25"
status: draft
---

# Project Maintenance Agent — OpenSpec Technical Specification

## 1. Executive Summary

**Project:** Project Maintenance Agent (Portable, Multi-Provider)  
**Purpose:** Automate maintenance of project documentation, metadata, and state across the `.github/projects/active` directory  
**Scope:** 3 phases, 4 weeks, ~70 hours total  
**Success Metric:** Agent maintains documentation for 50+ projects with >95% accuracy

---

## 2. Requirements

### 2.1 Functional Requirements

#### FR-1: Documentation Audit

- **Description:** Agent analyzes projects and identifies missing documentation
- **Input:** List of project slugs, audit level (basic/full)
- **Output:** Audit report with missing files, recommendations
- **Success Criteria:** Accurately identifies 100% of projects missing PLANNING.md, OPENSPEC.md, README.md

#### FR-2: Bulk Documentation Creation

- **Description:** Agent creates missing PLANNING.md, OPENSPEC.md, README.md files
- **Input:** Project list, files to create (PLANNING.md|OPENSPEC.md|README.md), dry-run flag
- **Output:** Creation report (created count, skipped, errors)
- **Success Criteria:** Creates files without overwriting existing docs, dry-run is always default

#### FR-3: Project Validation

- **Description:** Agent validates project structure and documentation completeness
- **Input:** Project list, validation level (basic/full)
- **Output:** Validation report (valid projects, issues found, recommendations)
- **Success Criteria:** Validates frontmatter, required fields, link integrity

#### FR-4: Project Archival

- **Description:** Agent moves projects from active → archive with completion documentation
- **Input:** Project slug, archive reason, optional archive comment
- **Output:** Archival report (old path, new path, status file created)
- **Success Criteria:** Projects in archive dir, `.archive-status.md` created, no broken links

#### FR-5: Metadata Synchronization

- **Description:** Agent syncs project metadata across multiple projects
- **Input:** Source project, target projects, fields to sync
- **Output:** Sync report (synced count, conflicts found, skipped)
- **Success Criteria:** Correctly identifies conflicts, prompts for resolution

### 2.2 Non-Functional Requirements

#### NF-1: Multi-Provider Support

- Support Claude (claude-opus-5), Copilot (GPT-4 Turbo), OpenAI (GPT-4 Turbo)
- Same capabilities across all providers
- Portable implementation (no provider-specific code in core logic)

#### NF-2: Performance

- Process 50 projects in <5 minutes (dry-run)
- Process 50 projects in <15 minutes (live execution)
- Script execution should not block other operations

#### NF-3: Reliability

- Success rate >99% for read operations
- Success rate >95% for write operations (creates account for template issues, permissions)
- All failures must be reported with actionable error messages

#### NF-4: Security

- No injection vectors (sed, shell commands, file paths)
- Input validation on all project names and paths
- No secrets in logs or error messages
- Safe handling of special characters (/, &, \, etc.)

#### NF-5: Maintainability

- Code coverage >80%
- All functions documented with examples
- Configuration files for different project types (GitHub, WordPress plugin, theme)
- Clear error messages with remediation steps

---

## 3. Architecture

### 3.1 Agent Architecture

```
┌─────────────────────────────────────────────┐
│     Project Maintenance Agent (Core)        │
├─────────────────────────────────────────────┤
│ • Operation Router (audit, create, etc.)    │
│ • Project State Manager                     │
│ • Error Handler & Logger                    │
├─────────────────────────────────────────────┤
│            Portable Skills                  │
├─────────────────────────────────────────────┤
│ • project-docs-updater (wraps Phase 1)     │
│ • project-validator (check structure)       │
│ • documentation-sync (metadata copy)        │
├─────────────────────────────────────────────┤
│        Provider-Specific Adapters           │
├─────────────────────────────────────────────┤
│ • Claude adapter (multi-turn conversation)  │
│ • Copilot adapter (function calling)        │
│ • OpenAI adapter (async job processing)     │
└─────────────────────────────────────────────┘
```

### 3.2 Skill Architecture

Each skill is independently callable and testable:

```
Skill: project-docs-updater
├── Handler (receives input, calls script, formats output)
├── Config (templates, paths, file list)
├── Tests (unit + integration)
└── Documentation (SKILL.md, examples)
```

### 3.3 Data Flow

```
User Input / Scheduled Task
        ↓
Provider Adapter (Claude/Copilot/OpenAI)
        ↓
Agent Core (operation router)
        ↓
Skill Handler (skill-specific logic)
        ↓
Operation Logic (audit/create/validate/archive)
        ↓
Phase 1 Scripts / File Operations
        ↓
Result Formatter
        ↓
Report to User / Post to Slack / Update Issues
```

---

## 4. API Specification

### 4.1 Agent Input Contract

All operations follow this pattern:

```json
{
  "operation": "audit|create|validate|archive|sync",
  "projects": ["project1", "project2"],
  "options": {
    "dry_run": true,
    "verbose": false,
    "check_level": "basic|full"
  }
}
```

### 4.2 Agent Output Contract

```json
{
  "status": "success|error|partial",
  "operation": "audit",
  "projects_processed": 2,
  "summary": {
    "checked": 2,
    "passed": 1,
    "failed": 1,
    "errors": []
  },
  "details": [
    {
      "project": "project1",
      "status": "passed",
      "missing_docs": [],
      "recommendations": []
    },
    {
      "project": "project2",
      "status": "failed",
      "missing_docs": ["PLANNING.md"],
      "recommendations": ["Create PLANNING.md from template"],
      "errors": []
    }
  ],
  "execution_time_ms": 1245,
  "next_steps": "Run: agent.create({projects: ['project2'], files: ['PLANNING.md']})"
}
```

### 4.3 Skill Input/Output

#### project-docs-updater

**Input:**

```json
{
  "projects": ["project1"],
  "files": ["PLANNING.md", "README.md"],
  "dry_run": true
}
```

**Output:**

```json
{
  "success": true,
  "created": {
    "PLANNING.md": 1,
    "README.md": 1,
    "OPENSPEC.md": 0
  },
  "skipped": {
    "PLANNING.md": 0,
    "README.md": 0,
    "OPENSPEC.md": 1
  },
  "errors": []
}
```

#### project-validator

**Input:**

```json
{
  "projects": ["project1"],
  "check_level": "full"
}
```

**Output:**

```json
{
  "valid": ["project1"],
  "invalid": [],
  "missing_docs": {
    "project1": []
  },
  "recommendations": {
    "project1": ["Update last_updated frontmatter field"]
  }
}
```

#### documentation-sync

**Input:**

```json
{
  "source_project": "template-project",
  "target_projects": ["project1", "project2"],
  "sync_fields": ["status", "owners"]
}
```

**Output:**

```json
{
  "synced": 2,
  "conflicts": 0,
  "skipped": 0,
  "details": {
    "project1": {"status": "synced", "conflicts": 0},
    "project2": {"status": "synced", "conflicts": 0}
  }
}
```

---

## 5. Operational Modes

### 5.1 Scheduled Mode (Proactive)

**When:** Nightly at 2 AM UTC  
**What:** Dry-run audit of all projects  
**Output:** Slack report with gaps and recommended actions  
**User Action:** Review report, decide if manual run needed

### 5.2 On-Demand Mode (Reactive)

**When:** Manual dispatch or called by Task Planning Agent  
**What:** Specified operation (audit/create/validate/archive)  
**Output:** Detailed report, dry-run preview, approval required before execution  
**User Action:** Review, approve or reject, monitor execution

### 5.3 Integration Mode (Programmatic)

**When:** Called by other agents (Task Planning, Task Research)  
**What:** Specific operation with predefined inputs  
**Output:** Structured JSON for downstream processing  
**Downstream Action:** Task Planning updates issues, creates follow-up tasks

---

## 6. Error Handling

### 6.1 Error Categories

#### E-1: Input Validation Errors

- Invalid project names (not found in active dir)
- Invalid operation (not in supported list)
- Invalid options (conflicting settings)

**Handling:** Reject with clear error message, no operation executed

#### E-2: File System Errors

- Missing templates directory
- Permission denied on project folder
- Disk full

**Handling:** Report error, skip project, continue with others

#### E-3: Script Execution Errors

- Phase 1 script fails
- sed command fails (shouldn't happen with Phase 1 fixes)
- Template variable substitution fails

**Handling:** Capture stderr, report error, log for debugging

#### E-4: Integration Errors

- GitHub API timeout
- Slack webhook failure
- Network connectivity issue

**Handling:** Retry with exponential backoff (3 attempts), then alert team

### 6.2 Error Recovery

**Transient Errors** (network, timeouts):

- Automatic retry up to 3 times with exponential backoff
- Report error if all retries exhausted

**Permanent Errors** (permission, invalid input):

- No retry
- Report error with remediation steps
- Continue with other projects (batch mode)

**Critical Errors** (script failure, disk full):

- Stop execution
- Alert team immediately
- Provide rollback instructions if needed

---

## 7. Security Specifications

### 7.1 Input Validation

All project names must:

- Contain only: a-z, 0-9, hyphen, underscore
- Match pattern: `^[a-z0-9_-]+$`
- Be <100 characters
- Exist in `.github/projects/active/`

All file paths must:

- Use only relative paths (no absolute paths)
- Stay within project directory (no `../` traversal)
- Match pattern: `^[A-Z_]+\.md$`

### 7.2 Injection Prevention

**Sed Command Safety:**

- Use safe delimiter (|) instead of (/)
- Escape pipe characters: `${var//|/\\|}`
- Never use unquoted variables in sed patterns
- ✅ Phase 1 implements these protections

**Shell Command Safety:**

- No `eval()` or shell interpolation of user input
- Use proper quoting: `"$var"` (always quoted)
- Use arrays for command arguments (not string concatenation)

**File Path Safety:**

- Validate paths before use
- Use `realpath` to resolve and check destinations
- Reject paths outside project directory

### 7.3 Secrets Management

- No GitHub tokens in logs
- No API keys in configuration files
- Use environment variables for sensitive values
- Strip secrets from error messages before reporting

---

## 8. Testing Strategy

### 8.1 Unit Tests

**Scope:** Individual functions and skills  
**Coverage Target:** >80%  
**Tools:** Jest, Mocha, or similar

**Test Cases:**

- Happy path (operation completes successfully)
- Input validation errors
- File system errors
- Special characters in project names
- Empty/null inputs
- Boundary conditions (very large project list)

### 8.2 Integration Tests

**Scope:** Skill combinations and workflows  
**Coverage Target:** All major workflows

**Test Cases:**

- Audit → create → validate workflow
- Concurrent operations on different projects
- Error recovery (partial failure handling)
- Dry-run → live execution transition

### 8.3 End-to-End Tests

**Scope:** Full agent operation with real GitHub API (staging environment)  
**Coverage Target:** Representative user scenarios

**Test Cases:**

- Nightly scheduled run
- Manual on-demand operation
- Integration with Task Planning Agent
- Slack notification delivery

### 8.4 Provider Tests

**Scope:** Each provider (Claude, Copilot, OpenAI)  
**Coverage Target:** All 3 providers pass same test suite

**Test Cases:**

- Same input produces consistent output across providers
- Provider-specific features work correctly
- Error handling consistent across providers

---

## 9. Configuration

### 9.1 GitHub Configuration

**File:** `agents/project-maintenance-agent/config/github.config.js`

```javascript
module.exports = {
  projectsDir: '.github/projects/active',
  archiveDir: '.github/projects/archive',
  templatesDir: '.github/projects/_templates',
  
  requiredFiles: ['README.md', 'PLANNING.md'],
  optionalFiles: ['OPENSPEC.md'],
  
  validStatuses: ['active', 'paused', 'archived', 'completed'],
  validOwners: ['team:ai', 'team:automation', '@ash', '@user'],
  
  auditRules: {
    checkFrontmatter: true,
    checkRelatedIssues: true,
    checkBranchLinks: true,
    requiredFrontmatterFields: ['title', 'status', 'created_date']
  },
  
  archiveRules: {
    requireArchiveStatus: true,
    moveToArchiveDir: true,
    updateRelatedIssues: true
  }
};
```

### 9.2 Logging Configuration

- **Level:** debug, info, warn, error
- **Format:** JSON for machine parsing, human-readable for console
- **Retention:** 7 days (configurable)
- **Sensitive Data:** Automatically redacted

### 9.3 Notification Configuration

- **Slack:** Post to #projects channel, mention @project-team on errors
- **GitHub Issues:** Link audit findings to related issues
- **Email:** Critical errors escalate to <admin@lightspeedwp.agency>

---

## 10. Performance Requirements

### 10.1 Response Time

| Operation | Target | Notes |
|-----------|--------|-------|
| Audit (50 projects, dry-run) | <5 min | Most common, non-blocking |
| Create docs (50 projects) | <15 min | IO-bound, can be parallel |
| Validate (50 projects) | <2 min | Fast, no file creation |
| Archive project | <30 sec | Single project operation |

### 10.2 Scalability

- Support up to 100 projects in single operation
- Support concurrent operations (e.g., 2 agents running simultaneously)
- Database/caching layer optional (start simple)

---

## 11. Monitoring & Observability

### 11.1 Metrics

- Operation count (audits, creates, archives per day)
- Success rate (% of projects processed successfully)
- Error rate (% of operations with errors)
- Execution time (p50, p95, p99)

### 11.2 Alerts

- Critical: Script fails on >10% of projects
- Warning: Audit finds >20 projects with missing docs
- Info: Nightly audit complete, results posted

### 11.3 Logs

- All operations logged with timestamps
- Error logs include full stack trace
- Success logs include summary (projects processed, files created)

---

## 12. Deployment

### 12.1 Deployment Stages

**Stage 1: Development**

- Local testing with phase 1 scripts
- Manual testing with subset of projects

**Stage 2: Staging**

- GitHub staging environment
- Dry-run only (no live execution)
- Full integration test suite

**Stage 3: Production**

- Scheduled nightly job (dry-run)
- Manual on-demand operation (with approval)
- Monitored and logged

### 12.2 Deployment Checklist

- [ ] All tests passing (unit, integration, e2e)
- [ ] Code review approved
- [ ] Security review passed
- [ ] Documentation complete
- [ ] Monitoring configured
- [ ] Alerting configured
- [ ] Runbook created
- [ ] Team trained

---

## 13. Success Criteria

### Phase 2 Completion

- ✅ Spec approved by team (this document)
- ✅ All 3 providers implemented and passing tests
- ✅ All 3 skills implemented and documented
- ✅ >80% code coverage
- ✅ Zero injection vulnerabilities
- ✅ Performance targets met (<5 min for 50 projects)

### Phase 3 Completion

- ✅ GitHub Actions workflows deployed
- ✅ Slack integration live
- ✅ Team trained
- ✅ Monitoring live
- ✅ Runbook completed

---

## 14. References & Dependencies

- **Phase 1 Scripts:** `scripts/automation/project-docs-update.sh`
- **Project Templates:** `.github/projects/_templates/`
- **Active Projects:** `.github/projects/active/`
- **Documentation:** [PLANNING.md](./PLANNING.md), [README.md](./README.md)
- **Related Epic:** [#1862](https://github.com/lightspeedwp/.github/issues/1862)

---

## Appendix A: Example Operations

### A.1: Audit Operation

```
Input:
{
  "operation": "audit",
  "projects": ["project1", "project2", "project3"],
  "options": {"verbose": true}
}

Output:
{
  "status": "success",
  "projects_processed": 3,
  "summary": {
    "complete": 2,
    "incomplete": 1
  },
  "details": [
    {
      "project": "project1",
      "status": "complete",
      "has_planning": true,
      "has_openspec": true,
      "has_readme": true
    },
    {
      "project": "project2",
      "status": "incomplete",
      "missing_docs": ["PLANNING.md"],
      "recommendations": ["Create PLANNING.md from template"]
    },
    ...
  ]
}
```

### A.2: Create Operation

```
Input:
{
  "operation": "create",
  "projects": ["project2"],
  "options": {"dry_run": true, "files": ["PLANNING.md"]}
}

Output (dry-run):
{
  "status": "success",
  "operation": "create (dry-run preview)",
  "would_create": {
    "project2": {
      "PLANNING.md": ".github/projects/active/project2/PLANNING.md"
    }
  },
  "next_steps": "Approve to execute: run with dry_run=false"
}

// After approval:

Output (live):
{
  "status": "success",
  "created_count": 1,
  "created": {
    "PLANNING.md": 1
  },
  "skipped": {},
  "errors": []
}
```

---

*Specification Version: 1.0.0*  
*Last Updated: 2026-08-12*  
*Status: Draft (Ready for Review)*
