# Data Model: Governance Audit System

**Purpose**: Define the core data entities, their relationships, and validation rules for the governance audit workflow.

## Core Entities

### 1. GovernanceFile

Represents a LOCKED governance file that is subject to audit.

**Fields**:

- `id` (string): Unique identifier (e.g., "labels-yml", "issue-types-yml", "pr-templates")
- `path` (string): Absolute path in repository (e.g., `.github/labels.yml`)
- `type` (enum): File type — "labels", "issue-types", "templates", "workflows"
- `format` (enum): File format — "yaml", "markdown", "json"
- `locked` (boolean): Whether file is LOCKED and requires explicit approval for changes
- `description` (string): Purpose of this governance file
- `lastModified` (ISO 8601 datetime): Timestamp of last modification
- `content` (object): Parsed file content (YAML → object, Markdown → metadata + sections)

**Relationships**:

- Has many: `GovernanceEntity` (labels, issue types, templates contained in file)
- Has many: `AuditRule` (validation rules applicable to this file)
- Has many: `AuditViolation` (violations found during audit)

### 2. GovernanceEntity

Individual items within a governance file (labels, issue types, templates, etc.).

**Fields**:

- `id` (string): Unique identifier within file (e.g., "type:bug", "template:task-pr", "issue-type:feature")
- `fileId` (string): Reference to parent GovernanceFile
- `name` (string): Display name or title
- `type` (enum): Entity type — "label", "issue-type", "issue-template", "pr-template"
- `value` (string): The actual value/definition (label string, template path, etc.)
- `metadata` (object): Additional properties (description, used-count, related-entities, etc.)
- `validatedAgainst` (array of strings): Constitutional principles this entity was validated against

**Constraints** (from specification FR):

- Labels MUST include required prefix (e.g., `type:`, `status:`, `priority:`, `area:`, `meta:`)
- Labels MUST have documented purpose
- Labels MUST be used at least once in active workflows/templates (or marked deprecated)
- Issue types MUST be used in at least one active issue template
- Templates MUST reference only labels from canonical set
- All entity names MUST use consistent naming conventions (lowercase, hyphens, no spaces)

### 3. AuditRule

Validation rule that checks governance files for compliance.

**Fields**:

- `id` (string): Unique rule identifier (e.g., "label-prefix-check", "template-routing-validation")
- `name` (string): Human-readable rule name
- `description` (string): What this rule validates and why it's important
- `applicableTo` (array): File types this rule applies to ["labels", "issue-types", "templates"]
- `severity` (enum): "critical" | "high" | "medium" | "low"
- `check` (object): Rule definition including:
  - `type` (string): Check type — "prefix-required", "naming-convention", "reference-exists", "duplicate-detection", "routing-validation", "format-validation", "content-check"
  - `pattern` (regex or value): Pattern to match against
  - `requirements` (array): Specific requirements to validate
- `constitutionalBasis` (string): Which constitution section/principle this rule enforces (e.g., "Section VIII: Branch Strategy")
- `enabled` (boolean): Whether this rule is active in audit

**Example Rules**:

- Rule: "label-prefix-check" — All labels must have one of: type:, status:, priority:, area:, meta: prefix (Section VIII)
- Rule: "template-routing" — Each branch prefix must map to exactly one PR template (Section V)
- Rule: "naming-consistency" — Label names must follow lowercase-hyphenated-format (Section VI)
- Rule: "uk-english" — All documentation must use UK English spelling (Section VI)
- Rule: "accessibility" — Templates must include WCAG 2.2 AA guidance (Section VI)

### 4. AuditViolation

Individual violation found when audit rule fails.

**Fields**:

- `id` (string): Unique violation identifier (e.g., "violation-20260914-001")
- `ruleId` (string): Reference to the AuditRule that was violated
- `fileId` (string): Reference to GovernanceFile where violation was found
- `entityId` (string): Reference to GovernanceEntity if violation is entity-specific
- `severity` (enum): Inherited from rule — "critical", "high", "medium", "low"
- `location` (object): Where in file violation occurs:
  - `line` (number): Line number
  - `column` (number): Column number (for YAML/JSON)
  - `path` (string): JSON path to property (for structured files)
- `message` (string): Human-readable violation description
- `currentValue` (string): The actual value that violated the rule
- `expectedValue` (string): What the value should be according to rule
- `remediation` (string): Suggested fix for this violation
- `affectedSystems` (array): List of repos/workflows/agents that would be affected if not fixed

### 5. ComplianceReport

Output artifact containing audit results, statistics, and recommendations.

**Fields**:

- `id` (string): Report identifier (e.g., "audit-20260914-143022")
- `timestamp` (ISO 8601 datetime): When audit was run
- `filesScanned` (array): List of GovernanceFile IDs scanned
- `rulesApplied` (array): List of AuditRule IDs used in this audit
- `summary` (object):
  - `totalFiles` (number): Count of governance files scanned
  - `totalRules` (number): Count of validation rules applied
  - `totalViolations` (number): Count of violations found
  - `criticalViolations` (number): Count of severity: critical
  - `compliancePercentage` (number): 0-100 score (rules passed / total rules)
- `violations` (array): List of AuditViolation objects with details
- `recommendations` (array): Prioritized list of remediation steps
- `metrics` (object): Compliance tracking over time:
  - `previousReportId` (string): Link to prior audit for trend comparison
  - `trendIndicator` (enum): "improved", "declined", "stable"
  - `violationsFixed` (number): Count of violations fixed since last report
  - `newViolations` (number): Count of new violations since last report
- `generatedBy` (string): Identifier of audit process/version
- `archiveLocation` (string): Where report is stored for historical tracking

### 6. RemediationPlan

Output artifact providing step-by-step guidance for fixing violations.

**Fields**:

- `id` (string): Plan identifier (e.g., "remediation-20260914-001")
- `timestamp` (ISO 8601 datetime): When plan was generated
- `sourceReport` (string): Reference to ComplianceReport this plan addresses
- `violations` (array): Violations covered by this plan (sorted by priority)
- `steps` (array): Remediation steps, each containing:
  - `stepNumber` (number): Execution order
  - `title` (string): Step name
  - `description` (string): What to do in this step
  - `affectedFile` (string): Which governance file to modify
  - `currentState` (string): Current (violating) content
  - `targetState` (string): Desired (compliant) content
  - `changeType` (enum): "add", "remove", "modify", "rename"
  - `effort` (enum): "trivial" | "simple" | "moderate" | "complex"
  - `risk` (enum): "low" | "medium" | "high"
  - `affectedRepositories` (array): Which repos this change impacts
  - `verificationSteps` (array): How to confirm change succeeded
  - `rollbackProcedure` (string): How to undo this change if needed
- `estimatedTotalEffort` (string): Overall effort estimate (e.g., "15 minutes")
- `estimatedRisk` (enum): Overall risk assessment
- `prerequisitesAndDependencies` (string): Any setup or ordering requirements
- `approvalGates` (array): Which roles need to approve each step (e.g., ["GitHub admin", "@ashley"])

## Relationships & Data Flow

```
GovernanceFile (input)
  ↓
  contains → GovernanceEntity
  ↓
  validated by → AuditRule
  ↓
  produces → AuditViolation
  ↓
  aggregated into → ComplianceReport
  ↓
  analyzed by → RemediationPlan (output)
```

## Validation Rules (Constitutional Basis)

| Rule | Input | Output | Constitutional Section |
|------|-------|--------|------------------------|
| Label prefix required | Label name | Violation if no prefix | Section VIII |
| Template routing consistency | PR templates + branch names | Violation if mismatch | Section V, VIII |
| No duplicate definitions | Label/issue type list | Violation if duplicates found | Section II |
| UK English spelling | All text content | Violation if non-UK spelling | Section VI |
| WCAG 2.2 AA compliance | Template content | Violation if accessibility gaps | Section VI |
| Referenced items exist | Labels used in templates | Violation if label not in canonical set | Section II |
| No implementation details | Governance file text | Violation if code/tech details present | Section VI |
| Changelog compliance | Changelog entries | Violation if >250 chars or has banned keywords | Section IX |

## Scale & Performance Considerations

**Data Volume**:

- ~160 labels across 5 label families
- ~24 issue types
- ~45 templates (26 issue + 19 PR)
- ~34 branch types (each mapping to PR template)
- ~15 audit rules per file type
- Expected violations per audit: 0-50 (depending on governance state)

**Storage**: File-based JSON/Markdown reports; no database required. Daily reports archived in `.github/reports/` with retention policy (keep 90 days, summarize older data).

**Performance**: Full audit of all files should complete in <30 seconds; data model operations optimized for sequential scanning rather than complex queries.
