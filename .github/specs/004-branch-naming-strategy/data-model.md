# Data Model: Branch Naming Strategy

**Created**: 2026-09-13

**Purpose**: Define entities and data structures for branch naming validation, routing, and compliance tracking

---

## Entity: BranchName

Represents a Git branch with validation and routing metadata.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `full_name` | String | ✅ | Complete Git branch name (e.g., `feat/user-auth-improvements`) |
| `type` | Enum (38 values) | ✅ | Branch type (e.g., `feat`, `fix`, `security`) |
| `scope` | String | ✅ | Feature domain (e.g., `user-auth`, `api-response`); lowercase alphanumeric + hyphens |
| `title` | String | ✅ | Specific change within domain (e.g., `improvements`, `routing-bug`); lowercase alphanumeric + hyphens |
| `is_valid` | Boolean | Computed | True if matches pattern and not forbidden prefix |
| `validation_errors` | String[] | Computed | List of validation failures: `invalid_type`, `forbidden_prefix`, `malformed_scope`, `malformed_title`, `empty_scope`, `empty_title` |
| `suggested_name` | String | Computed | Suggested correction for invalid branch (e.g., `Did you mean: feat/user-auth-improvements?`) |
| `pr_template` | String | Computed | Routed PR template (relative path, e.g., `pr_feature.md`). Null if invalid branch. |
| `default_labels` | String[] | Computed | Labels to apply from canonical set (e.g., `["type:feature", "area:auth"]`). Empty if invalid. |
| `area_labels` | String[] | Computed | Auto-detected area labels based on scope keywords (e.g., `["area:api"]` if scope contains "api"). |
| `created_at` | ISO8601 | Optional | Git commit timestamp of first commit on branch |
| `last_push` | ISO8601 | Optional | Timestamp of last push to this branch |
| `pr_opened_at` | ISO8601 | Optional | Timestamp when PR was opened from this branch |
| `merged_at` | ISO8601 | Optional | Timestamp when branch was merged |
| `merge_commit` | String | Optional | Merge commit hash (e.g., `abc123def456`) |
| `pr_number` | Number | Optional | GitHub PR number if PR exists |

### Validation Rules

**Pattern Match** (Required):

```regex
^(feat|fix|hotfix|release|refactor|chore|task|doc|docs|test|perf|ci|build|deps|security|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex|revert|research|aiops|automation|epic)/[a-z0-9]+(-[a-z0-9]+)*-[a-z0-9]+(-[a-z0-9]+)*$
```

**Forbidden Prefixes** (Reject):

- `claude/` — Reserved for Claude Code internal sessions
- `copilot/` — Reserved for GitHub Copilot integration
- `openai/` — Reserved for OpenAI integration

**Length Constraints**:

- Full branch name: ≤255 characters (Git standard)
- Type: exactly one of 38 values
- Scope: 1+ characters, recommended ≤50
- Title: 1+ characters, recommended ≤50
- Scope + title: recommended ≤80 combined

**Scope & Title Rules**:

- Must contain only lowercase letters, numbers, and hyphens
- Cannot start or end with hyphen
- Cannot contain consecutive hyphens (e.g., `user--auth` is invalid)
- Cannot contain underscores, spaces, or special characters

### Computed Properties

**`is_valid`** — Boolean

- True if `full_name` matches pattern AND type is not forbidden prefix
- False otherwise

**`validation_errors`** — String[]

- Empty if `is_valid` is true
- Contains error codes: `invalid_type`, `forbidden_prefix`, `malformed_scope`, `malformed_title`, `empty_scope`, `empty_title`
- Example: `["invalid_type", "malformed_scope"]`

**`suggested_name`** — String

- If `is_valid` is false, suggests the corrected branch name
- Uses machine learning or fuzzy matching to find closest valid branch
- Example: "Did you mean: `feat/user-auth-improvements`?"
- Null if `is_valid` is true

**`pr_template`** — String

- Extracted from BranchType mapping using `type`
- Example: `pr_feature.md` for `feat` type
- Null if `is_valid` is false
- Used for GitHub Actions PR template routing

**`default_labels`** — String[]

- Extracted from BranchType.default_labels using `type`
- Example: `["type:feature"]` for `feat`
- Follows canonical label format: `family:value` (e.g., `type:feature`, `priority:critical`)
- Empty array if `is_valid` is false
- Do NOT include area labels (see next field)

**`area_labels`** — String[]

- Auto-detected from `scope` using BranchType.area_detection rules
- Keywords matching map to area labels
- Example: scope `api-response` with keywords `["api"]` → `["area:api"]`
- Can return multiple labels if scope matches multiple keywords
- Always empty if `is_valid` is false

### Relationships

- **BranchName → BranchType**: `type` field links to BranchType.type (e.g., `feat` links to the `feat` BranchType)
- **BranchName → ComplianceMetrics**: Tracked in compliance metrics by type and validation result

---

## Entity: BranchType

Configuration entity defining each of the 24 authorized branch types and their routing rules.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `type` | String (Enum) | Type identifier; key field (e.g., `feat`, `fix`, `security`) |
| `purpose` | String | Human-readable description (e.g., "New feature", "Bug fix", "Security vulnerability") |
| `example` | String | Example branch name (e.g., `feat/user-preferences-panel`) |
| `pr_template` | String | PR template file path relative to `.github/PULL_REQUEST_TEMPLATE/` (e.g., `pr_feature.md`) |
| `default_labels` | String[] | Labels to apply to every PR from this type (e.g., `["type:feature"]`) |
| `priority_suggestion` | String | Optional suggested priority label for this type (e.g., `priority:critical` for security) |
| `area_detection.keywords` | String[] | Keywords in scope that auto-trigger area labels (e.g., `["api", "endpoint"]` for area:api) |
| `area_detection.mappings` | Map<String, String> | Explicit scope-to-area mappings (e.g., `auth → area:auth`) |

### Complete Type Definitions

All 24 types are listed in [contracts/branch-naming.contract.md](./contracts/branch-naming.contract.md) with full routing rules.

### Key Invariants

1. **Uniqueness**: Each type value is unique (exactly one BranchType per type)
2. **Template Coverage**: Every type must map to exactly one PR template (fallback: `pull_request_template.md`)
3. **Label Compliance**: All labels must exist in canonical `.github/labels.yml` with required family prefix
4. **Consistency**: Type definitions are immutable during a release cycle (changes via PR review and @ashley approval)

### Relationships

- **BranchType ← BranchName**: One-to-many (multiple branches can use the same type)
- **BranchType → PR Templates**: Links to actual template files in `.github/PULL_REQUEST_TEMPLATE/`
- **BranchType → Labels**: References canonical labels from `.github/labels.yml`

---

## Entity: ComplianceMetrics

Tracking entity for branch naming compliance across repositories and time.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `date` | ISO8601 | Metric collection date; part of composite key |
| `repository` | String | Repository name (e.g., `lightspeedwp/.github`) or `__org_aggregate__` for org-wide totals; part of composite key |
| `total_branches` | Number | Total number of branches in repository |
| `valid_branches` | Number | Branches following the naming pattern |
| `invalid_branches` | Number | Branches violating the pattern |
| `forbidden_prefix_branches` | Number | Branches using reserved prefixes (`claude/`, `copilot/`, `openai/`) |
| `compliance_percentage` | Number | Calculated: `(valid_branches / total_branches) * 100`, rounded to 1 decimal |
| `type_distribution` | Map<String, Number> | Branches by type (e.g., `feat: 245, fix: 120, docs: 50, ...`) |
| `top_invalid_patterns` | Array<Object> | Most common invalid patterns |
| `top_invalid_patterns[].pattern` | String | Invalid pattern (e.g., `feature/...`, `claude/...`) |
| `top_invalid_patterns[].count` | Number | How many branches use this pattern |
| `top_invalid_patterns[].suggested_fix` | String | Suggested correct pattern |
| `prs_created_from_valid_branches` | Number | Count of PRs created from valid branches this period |
| `pr_template_routing_success_rate` | Number | % of PRs that received correct template (from valid branches) |
| `label_routing_success_rate` | Number | % of PRs that received all correct labels (from valid branches) |
| `timestamp` | ISO8601 | When metrics were computed |

### Key Invariants

1. **Summation**: `total_branches = valid_branches + invalid_branches`
2. **Subset**: `forbidden_prefix_branches ⊆ invalid_branches` (forbidden are a subset of invalid)
3. **Percentage Range**: `0 ≤ compliance_percentage ≤ 100`
4. **Type Distribution Sum**: `sum(type_distribution.values()) ≤ valid_branches` (some valid branches may not be fully typed)
5. **Success Rates**: `0 ≤ routing_success_rate ≤ 100`

### Relationships

- **ComplianceMetrics ← BranchName**: Aggregated from all BranchName entities in the repository
- **ComplianceMetrics → Repository**: One metric record per repository per day

### Aggregation Strategy

- Computed daily (or on-demand)
- Org-wide aggregates calculated by summing across all repositories
- Trend analysis: Compare monthly metrics to identify improvement or regression
- Alerting: Flag repositories with <80% compliance for team lead follow-up

---

## Validation & Constraints

### Type-to-Template Mapping Invariants

Every type in BranchType must map to exactly one PR template:

- `feat` → `pr_feature.md`
- `fix` → `pr_bugfix.md`
- `security` → `pr_security.md`
- ... (20 more)

Validation: Audit `.github/PULL_REQUEST_TEMPLATE/` directory to confirm all mapped templates exist.

### Type-to-Label Mapping Invariants

Every label in BranchType.default_labels must exist in `.github/labels.yml` with correct family prefix:

- Valid: `type:feature`, `priority:critical`, `area:api`
- Invalid: `feature` (missing prefix), `typefeature` (wrong format), `undefined-label`

Validation: Check each label in canonical set before applying.

### Scope & Title Validation

Both scope and title must:

1. Start and end with lowercase letter or number
2. Contain only lowercase letters, numbers, and hyphens
3. Not contain consecutive hyphens
4. Be at least 1 character long

Regex for each: `[a-z0-9]+(-[a-z0-9]+)*`

---

## State Transitions (Optional)

Branch lifecycle states (informational):

```
Created → Valid/Invalid → PR Opened → Reviewed → Merged → Archived
   ↓
 Deleted
```

- **Created**: Branch exists in Git, passes local validation
- **Valid/Invalid**: Validation result determined
- **PR Opened**: Pull request created from branch
- **Reviewed**: PR received review feedback
- **Merged**: PR merged to base branch
- **Archived**: Old branch deleted or archived
- **Deleted**: Branch force-deleted before any of above

Compliance metrics track branches in each state to understand lifecycle impact.

---

## Storage & Persistence

- **BranchName**: Computed in real-time from Git API and GitHub Actions
  - Stored temporarily as GitHub Actions artifact (JSON)
  - Queried via GitHub REST API
  - Persisted for historical compliance metrics

- **BranchType**: Static configuration, version-controlled in Git
  - Stored as YAML in `.github/branch-types.yml`
  - Loaded at workflow execution time
  - Updated only via PR review and governance approval

- **ComplianceMetrics**: Historical data
  - Stored as JSON artifacts in GitHub Actions
  - Optionally synced to Google Sheets for dashboarding
  - Retention policy: 30/90/365 days (TBD in research phase)
  - Queryable for trends and org-wide reporting

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
