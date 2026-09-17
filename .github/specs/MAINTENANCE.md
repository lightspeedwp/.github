# Specification Maintenance Procedures

## Overview

This document defines the standardized procedures for maintaining the SpecKit folder structure at `.github/specs/`, including guidelines for creating new specifications, updating existing ones, archiving outdated specifications, maintaining the centralized catalog, and enforcing quality gates. These procedures enable consistent, predictable specification management across the organisation while preserving historical traceability and governance authority.

---

## Numbering Scheme

### How Numbers Are Assigned

- **Current specifications**: 001-012 (preserved as-is, no renumbering)
- **New specifications**: Start at 013, increment by 1 (next = highest current + 1)
- **Example**: If spec 013 exists, next spec is 014
- **Rationale**: Preserves historical traceability, enables predictable numbering, maintains chronological ordering

### Number Reuse

- ❌ **Number reuse is NOT allowed** after a spec is archived
- **Reason**: Maintain chronological traceability—historical queries must unambiguously identify original specifications. Reusing a number after archival creates ambiguity and breaks audit trails.

---

## Creating a New Specification

### Prerequisites

Before initiating specification creation, ensure:

- Specification scope is clear: What problem does it solve? Who benefits?
- Stakeholder need is documented: Why is this specification needed? What decision does it enable?
- No duplicate specification exists covering the same scope

### Step-by-Step Process

#### 1. Determine Next Number

List all existing specification directories in `.github/specs/`:

```bash
ls -d .github/specs/[0-9][0-9][0-9]-*/
```

Find highest number (e.g., if 013 exists, next is 014):

```bash
ls -d .github/specs/[0-9][0-9][0-9]-*/ | sed 's/.*\///' | cut -d- -f1 | sort -n | tail -1
```

Confirm number not already assigned (no gaps in sequence).

#### 2. Create Directory Structure

```bash
mkdir -p .github/specs/NNN-{slug}
touch .github/specs/NNN-{slug}/spec.md
mkdir -p .github/specs/NNN-{slug}/checklists
```

**Naming conventions**:

- `NNN` = 3-digit number, zero-padded (001, 002, ..., 013, 014)
- `{slug}` = lowercase, hyphens for word separation, no spaces/special characters
- Example: `.github/specs/014-user-authentication-overhaul`

#### 3. Use SpecKit Workflow

Execute the four-phase specification workflow:

```bash
# Phase 1: Define requirements
/speckit-specify "Your feature description here"

# Phase 2: Resolve ambiguities
/speckit-clarify

# Phase 3: Design technical approach
/speckit-plan

# Phase 4: Decompose into tasks
/speckit-tasks
```

Each command generates required artefacts in `.github/specs/NNN-{slug}/`:

- `spec.md` — User stories, requirements, acceptance criteria
- `plan.md` — Technical design, architecture decisions
- `tasks.md` — Implementation task breakdown

#### 4. Update CATALOG.md

Add entry to `.github/specs/CATALOG.md` using the canonical catalog schema:

**Canonical Schema**: `| # | Slug | Title | Status | Created | Link |`

1. Add row to index table with EXACT canonical columns (in this order): # | Slug | Title | Status | Created | Link
2. Use Slug value matching directory name (e.g., `spec-folder-refactor` for `013-spec-folder-refactor`)
3. Add detailed entry section with status, phase, created/updated dates, and link fields (see CATALOG.md structure)
4. Ensure entry appears in correct sequential position (001, 002, ..., 013, 014)
5. Update "Last Updated" timestamp at top of CATALOG.md
6. Use relative link format: `./NNN-{slug}/spec.md`

#### 5. Approval Gate

New specification requires formal approval before becoming normative:

- [ ] Specification passes all 8 quality dimensions (see Quality Gate Enforcement section)
- [ ] Quality checklist at `.github/specs/NNN-{slug}/checklists/requirements.md` shows 100% items checked
- [ ] @ashley reviews specification and approves for use

**Timeline**: Approval typically takes 1-2 business days. If urgent, escalate to @ashley directly.

### Acceptance Checklist for New Specification

Use this checklist to verify new specification meets all requirements:

- [ ] Directory created at `.github/specs/NNN-{slug}/` with correct naming
- [ ] spec.md file exists and contains all required sections
- [ ] checklists/ directory exists with requirements.md
- [ ] Specification number is sequential (no gaps in sequence)
- [ ] Folder name slug matches specification title (lowercase, hyphens)
- [ ] CATALOG.md updated with new entry within 7 days
- [ ] All 8 quality dimensions passing: Completeness, Clarity, Consistency, Measurability, Scenario Coverage, Edge Cases, Dependencies, Ambiguities
- [ ] Quality checklist shows 100% items passing (all items marked [x])
- [ ] @ashley has reviewed and approved specification

---

## Updating an Existing Specification

### When to Update

Update a specification when:

- Clarification needed from stakeholders
- Ambiguity or unclear requirement discovered during planning/implementation
- Scope change required by business decision
- Quality issues identified in audit results
- Terminology or requirements need alignment with related specs

### Update Process

#### 1. Open Change Request Issue

Create GitHub issue with:

- **Title**: `[SPEC-UPDATE] NNN - [specific change needed]`
- **Description**: What changed and why. Include rationale for change.
- **Reference**: Link to original specification directory

#### 2. Update Specification

1. Edit `.github/specs/NNN-{slug}/spec.md`
2. Document change in `Clarifications` section (add session date and Q&A summary)
3. If ambiguity introduced, re-run `/speckit-clarify` to resolve
4. Update any `updated_date` field in specification metadata (if present)
5. Preserve all historical changes (do not delete or rewrite requirements retroactively)

#### 3. Update Quality Checklist

Review `.github/specs/NNN-{slug}/checklists/requirements.md` against updated spec:

- Re-evaluate each dimension against updated requirements
- Mark items unchecked (`[ ]`) if they become unmet by the update
- Re-run quality assessment to ensure all dimensions still pass

**If quality dimensions fail after update**: Specification must be clarified again before approval.

#### 4. Update CATALOG.md

Modify entry in `.github/specs/CATALOG.md`:

- Update `Updated` date to reflect actual update time (within 7 days per SC-008)
- Update `Status` if changed (Draft → Active, etc.)
- Do NOT change `Created` date (original creation date should remain unchanged)

#### 5. Approval Gate

Changes require formal approval:

- [ ] Change is documented with rationale in GitHub issue
- [ ] spec.md updated with changes (additions/revisions clearly marked in Clarifications section)
- [ ] Quality checklist re-validated (all items passing)
- [ ] CATALOG.md updated with new date and status
- [ ] @ashley has reviewed and approved changes

**Self-service updates** (no approval needed):

- Minor wording/clarification fixes that do NOT change requirement scope
- CATALOG.md date updates for existing specs
- Formatting corrections

### Acceptance Checklist for Specification Update

- [ ] Change is documented with rationale (GitHub issue)
- [ ] spec.md updated with changes marked in Clarifications section
- [ ] Quality checklist re-validated (all items passing after update)
- [ ] CATALOG.md updated with new date and status (if applicable)
- [ ] @ashley has reviewed and approved significant changes (if applicable)
- [ ] Updated date reflects actual update time

---

## Archiving a Specification

### When to Archive

Archive a specification when:

- Specification is obsolete or no longer used
- Specification is completely superseded by a newer version
- Specification scope is no longer relevant to organisation
- Technology or approach described is end-of-life

**Important**: Archived specifications remain in the repository for historical reference. They are NOT deleted.

### Archive Process

#### 1. Mark as Archived

Edit `.github/specs/NNN-{slug}/spec.md`:

- Change `status` field from "Active" to "Archived"
- Add note: "Archived on [DATE]. Reason: [brief reason]"
- If replaced by newer spec: "See spec NNN for replacement"

#### 2. Preserve in Catalog

Update `.github/specs/CATALOG.md`:

- If Archived section exists, move entry there (keep full metadata)
- If no Archived section: Keep entry in main list but update `Status` field to "Archived"
- ❌ Do NOT delete the entry from the catalog
- ❌ Do NOT delete the specification directory from `.github/specs/`

**Archived specifications must remain discoverable** via CATALOG.md for historical reference.

#### 3. Update References

Search for and update any references to the archived specification:

```bash
grep -r "spec NNN" .github/ docs/
grep -r "{NNN}-{slug}" .github/ CLAUDE.md
```

- Update CLAUDE.md or README links
- Link to replacement specification (if new spec created)
- Add note: "This specification is archived; see spec [NEW_NNN] for current version"

#### 4. Governance Tracking

Document archival in change records:

- Add entry to CHANGELOG.md (if applicable): Specification NNN archived on [DATE]
- Record rationale and replacement spec (if any)
- Preserve in audit trail for historical traceability

### Acceptance Checklist for Specification Archival

- [ ] Archived specification remains in `.github/specs/` directory (not deleted)
- [ ] spec.md marked with `status: Archived`
- [ ] CATALOG.md entry moved to Archived section (or status updated)
- [ ] Historical links still valid and point to archived spec
- [ ] Replacement specification documented (if any)
- [ ] CHANGELOG.md updated with archival record

---

## Maintaining CATALOG.md

### Update Frequency

- **Automatic**: Update CATALOG.md within 7 days of any new specification creation (per SC-008)
- **Triggered**: Any time specification status changes (Active → Archived, Draft → Active, etc.)
- **Manual check**: Monthly review to ensure all entries are current and links are valid

### When to Update

Update CATALOG.md after:

1. New specification created (add entry within 7 days)
2. Specification status changed (draft → active, active → archived)
3. Specification updated (update date field)
4. Specification archived (move to archive section or update status)

### Checklist for CATALOG.md Updates

When updating catalog entries, verify:

- [ ] All specification directories in `.github/specs/` have a CATALOG.md entry
- [ ] Specification numbers are sequential with no gaps (001, 002, ..., 013, 014)
- [ ] Status field matches current spec file status (Active, Draft, Archived, etc.)
- [ ] Created date is accurate (matches spec creation date; does not change)
- [ ] Updated date (if present) is accurate and recent (≤7 days)
- [ ] All links are valid and point to existing directories
- [ ] Links use format: `./NNN-{slug}/spec.md` (relative paths)
- [ ] Index table is sorted by number (ascending order: 001, 002, ..., 013)
- [ ] Detailed entry sections follow same sequential order as index table
- [ ] CATALOG.md "Last Updated" date is current (updated today)

### Common Catalog Maintenance Tasks

**Task: Add new specification to catalog**

```
1. Determine correct row position (maintain sequential order)
2. Add row to index table with canonical columns: # | Title | Purpose | Status | Created | Link
3. Add detailed entry section below with status, phase, created/updated dates, and relative link (./NNN-slug/spec.md)
4. Update "Last Updated" date at top of CATALOG.md
5. Verify all links are valid and use relative format
6. Test link by navigating from CATALOG.md to spec directory
```

**Task: Update specification status from Draft to Active**

```
1. Find entry in CATALOG.md index table
2. Change Status field from "Draft" to "Active"
3. Update date field (if present) to today's date
4. Update "Last Updated" date at top
```

**Task: Archive specification**

```
1. Move CATALOG.md entry to Archived section (if section exists)
2. OR update Status field to "Archived"
3. Add note if section created: "Created YYYY-MM-DD, archived YYYY-MM-DD"
4. Ensure link still points to spec directory (do NOT remove)
```

---

## Quality Gate Enforcement

### Before Specification Becomes Normative

Every specification must pass all 8 quality dimensions before it can be used as normative governance guidance, implementation guidance, or architectural decision.

The 8 quality dimensions (from Constitution Principle VII):

1. **Completeness** — All requirements present, all user stories complete with independent value, edge cases identified
2. **Clarity** — Requirements specific and unambiguous, vague terms quantified with metrics
3. **Consistency** — Requirements aligned without conflicts, terminology consistent across sections
4. **Measurability** — Acceptance criteria objective and testable, metrics defined
5. **Scenario Coverage** — User flows and primary/secondary paths addressed, critical journeys complete
6. **Edge Cases** — Boundary conditions defined, failure modes specified, error handling documented
7. **Dependencies** — Assumptions documented, external dependencies identified, constraints clear
8. **Ambiguities** — No unclear areas remain, terminology defined, no open-ended placeholders

### Quality Checklist Validation

**File location**: `.github/specs/NNN-{slug}/checklists/requirements.md`

**Validation rule**: All items must be checked (`[x]`) before specification can be approved

**Process**:

1. Run `/speckit-specify` to create initial specification
2. Run `/speckit-clarify` to resolve ambiguities (may produce checklist)
3. Automatically generated checklist validates specification quality
4. Review each checklist item; uncheck items if requirements do NOT meet criteria
5. If unchecked items exist, specification is BLOCKED from approval
6. Author must fix gaps and re-run `/speckit-clarify`
7. Once all checklist items pass, specification can proceed to approval

### Failure Action

**If quality checklist has unchecked items**:

- [ ] Specification is BLOCKED from approval (do not proceed to implementation)
- [ ] Specification author must identify and fix quality gaps
- [ ] Author re-runs `/speckit-clarify` to update specification
- [ ] Updated checklist must show 100% items passing
- [ ] @ashley reviews updated quality checklist before final approval

**Quality gate exception** (rare):

- Exceptions require documented justification and @ashley approval
- Exception does not override requirement to pass all 8 dimensions
- Exception must be recorded with rationale for future reference

### Checklist for Quality Gate Enforcement

- [ ] Quality checklist exists at `.github/specs/NNN-{slug}/checklists/requirements.md`
- [ ] Specification has been through `/speckit-clarify` phase (ambiguities resolved)
- [ ] All 8 dimensions are addressed in specification
- [ ] All checklist items marked [x] (100% pass rate)
- [ ] No [NEEDS CLARIFICATION] markers remain in spec.md
- [ ] Specification ready for @ashley final approval

---

## Governance Authority

**Specification Approval Authority**: @ashley (organisation owner)

@ashley is the sole governance authority for specification lifecycle decisions. All normative specifications must be approved by @ashley before use.

### Decisions Requiring @ashley Approval

✅ **Must be approved by @ashley**:

- New specification creation (any new spec in `.github/specs/`)
- Significant specification updates (changes to requirements, user stories, acceptance criteria)
- Specification archival or deprecation
- Changes to numbering scheme or maintenance procedures
- Quality gate exceptions (rare; must be documented)
- Changes to MAINTENANCE.md procedures or governance rules

### Self-Service Decisions (No Approval Needed)

✅ **Can be done without @ashley approval**:

- Minor clarifications or wording fixes (do not change requirement meaning)
- CATALOG.md entry updates for existing specs (status, dates)
- Bug fixes or corrections to implementation tasks
- Typo corrections in spec.md or markdown formatting fixes

### How to Request Approval

1. Ensure specification has passed all quality gate checks (all checklist items marked [x])
2. Open GitHub issue or mention @ashley in PR/discussion
3. Provide link to specification and summary of key requirements
4. @ashley will review within 1-2 business days (or escalate as needed)

---

## SpecKit Tools & Commands

### SpecKit Workflow Commands

These commands guide you through the specification development process:

| Phase | Command | Purpose | Input | Output |
|-------|---------|---------|-------|--------|
| Specify | `/speckit-specify` | Create new specification from description | Feature description | spec.md with user stories and requirements |
| Clarify | `/speckit-clarify` | Resolve ambiguities with Q&A | Interactive questions | Updated spec.md with clarifications resolved |
| Plan | `/speckit-plan` | Design technical approach | spec.md | plan.md with architecture and design decisions |
| Tasks | `/speckit-tasks` | Decompose into implementation tasks | plan.md + spec.md | tasks.md with implementation task breakdown |
| Implement | `/speckit-implement` | Execute implementation tasks | tasks.md | Completed implementation with all tasks marked done |

### Filesystem Audit Commands

These commands help manage specification directories:

#### List all specification directories

```bash
ls -d .github/specs/[0-9][0-9][0-9]-*/
```

#### Count existing specifications

```bash
ls -d .github/specs/[0-9][0-9][0-9]-*/ | wc -l
```

#### Find highest number

```bash
ls -d .github/specs/[0-9][0-9][0-9]-*/ | sed 's/.*\///' | cut -d- -f1 | sort -n | tail -1
```

#### Verify spec.md exists in all directories

```bash
for dir in .github/specs/[0-9][0-9][0-9]-*/; do 
  [ ! -f "$dir/spec.md" ] && echo "Missing: $dir"; 
done
```

#### Verify sequential numbering (no gaps)

```bash
for i in $(seq 1 $(ls -d .github/specs/[0-9][0-9][0-9]-*/ | wc -l)); do
  num=$(printf '%03d' $i)
  [ ! -d ".github/specs/$num-"* ] && echo "Gap found: spec $num missing"
done
```

---

## Examples

### Example: Creating Specification 014

**Scenario**: Need to create a new specification for "API Response Format Standardization"

#### Step 1: Determine Next Number

```bash
# Current highest: 013
# Next number: 014
```

#### Step 2: Create Directory Structure

```bash
mkdir -p .github/specs/014-api-response-format
mkdir -p .github/specs/014-api-response-format/checklists
touch .github/specs/014-api-response-format/spec.md
```

#### Step 3: Run SpecKit Workflow

```bash
# Phase 1: Specify requirements
/speckit-specify "Standardize API response format across all endpoints with consistent error handling and status codes"

# Phase 2: Clarify ambiguities (if needed)
/speckit-clarify

# Phase 3: Plan technical approach
/speckit-plan

# Phase 4: Break into implementation tasks
/speckit-tasks
```

#### Step 4: Update CATALOG.md

Add to index table (maintaining sequential position) using the canonical schema:

```markdown
| 014 | api-response-format | API Response Format Standardization | Draft | 2026-09-17 | [./014-api-response-format/spec.md](./014-api-response-format/spec.md) |
```

Add detailed entry:

```markdown
### 014 - API Response Format Standardization

Defines standard JSON response envelope, error response format, status codes, and pagination approach for all organisation APIs. Ensures consistent developer experience and simplifies client-side error handling across all services.
```

#### Step 5: Request Approval

- Ensure quality checklist shows 100% items passing
- Mention @ashley with link to specification
- Wait for approval (typically 1-2 business days)

### Example: Updating Specification 011 with Clarifications

**Scenario**: Spec 011 (Workflow Consolidation Phase 2) has ambiguous terminology

#### Step 1: Open Change Request

```
Title: [SPEC-UPDATE] 011 - Clarify terminology inconsistencies

Description:
Specification 011 uses "workflow", "action", and "process" interchangeably. 
This ambiguity creates confusion during implementation planning.

Reference: .github/specs/011-workflow-consolidation-phase-2/spec.md
```

#### Step 2: Update Specification

Edit `.github/specs/011-workflow-consolidation-phase-2/spec.md`:

```markdown
## Clarifications

### Session 2026-09-16

- Q: "Should terminology be standardized (workflow vs action vs process)?" 
- A: Use "workflow" consistently. "Action" refers to individual steps within workflow. "Process" is generic.

Update: Replace all instances of "process" with "workflow" (except in compound terms like "change process"). Updated Clarifications section.
```

#### Step 3: Update Quality Checklist

Review `.github/specs/011-workflow-consolidation-phase-2/checklists/requirements.md`:

- Check that Clarity dimension now passes (terminology standardized)
- Check that Consistency dimension now passes (all sections use same terms)

#### Step 4: Update CATALOG.md

```markdown
# Updated: 2026-09-16 (clarified terminology per [SPEC-UPDATE] issue)
```

#### Step 5: Request Approval

- Mention @ashley with link to change request issue
- @ashley approves terminology clarification update

---

## Escalation & Support

### When Specifications Are Blocked

If a specification is blocked and you need help:

1. **Quality checklist failures**: Run `/speckit-clarify` again to resolve ambiguities
2. **Numbering questions**: Check "Find highest number" command in Filesystem Audit Commands section
3. **Approval delays**: Mention @ashley directly in GitHub or escalate via team communication

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Quality checklist has unchecked items | Re-run `/speckit-clarify` to resolve ambiguities |
| Cannot determine next spec number | Run "Find highest number" command in Filesystem Audit section |
| Link broken in CATALOG.md | Verify directory name matches link (case-sensitive) |
| Specification directory missing spec.md | Create file or restore from version control |
| Need to archive but worried about breaking references | See Archiving section; specification directory remains, just marked archived |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-09-16 | Initial maintenance procedures documentation | Claude Haiku 4.5 |

---

**Governance Authority**: @ashley  
**Last Updated**: 2026-09-16  
**Related Documentation**: [CATALOG.md](./CATALOG.md), [Specification Audit Report](./013-spec-folder-refactor/audit-reports/audit-report.md)

*Built with 🧱 LightSpeedWP SpecKit Framework*
