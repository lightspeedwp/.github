# Feature Specification: SpecKit Folder Organization Refactoring & Quality Audit

**Feature Branch**: `chore/update-github-speckit-folder-numbers`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Speckit Folder Organization Refactoring - audit the GitHub speckit folder numbers for sequential organization, create a spec catalog/index, and audit quality across all 12 existing specs"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Audit Current SpecKit Folder Structure (Priority: P1)

As a governance team member, I need to audit the current speckit folder organization to understand the existing numbering scheme, identify any gaps or inconsistencies, and verify alignment with the sequential numbering requirement.

**Why this priority**: Understanding the current state is foundational to all refactoring work. Without a clear audit, we risk introducing inconsistencies or missing existing specifications.

**Independent Test**: Can be fully tested by running a folder audit script that scans `.github/specs/` and reports: (1) all numbered directories found, (2) numbering gaps detected, (3) naming convention compliance, (4) specification file presence/integrity. The audit delivers a clear inventory of the current state.

**Acceptance Scenarios**:

1. **Given** the existing `.github/specs/` directory structure, **When** we run the folder audit, **Then** we receive a complete inventory listing all numbered spec directories (001-012), their names, and status
2. **Given** multiple numbered spec directories, **When** we validate naming conventions, **Then** all directories follow the `{NNN}-{slug}` format with consistent hyphenation and lowercase
3. **Given** 12 existing specification directories, **When** we check file presence, **Then** all directories contain required files (spec.md, optional checklists/) and no broken references

---

### User Story 2 - Create Specification Catalog & Index (Priority: P1)

As a documentation maintainer, I need a centralized catalog and index of all specifications, including their purpose, status, phase/category, and when they were created, so stakeholders can quickly locate and understand the governance specifications.

**Why this priority**: With 12+ specifications scattered across numbered directories, there's no single place to see what governance work has been done. A catalog makes governance transparent and helps prevent duplication.

**Independent Test**: Can be fully tested by creating a `specs/CATALOG.md` file that lists all 12+ specifications with title, purpose, status, and quick-link. Teams can navigate and understand the full governance landscape from this single document.

**Acceptance Scenarios**:

1. **Given** 12 existing numbered specifications, **When** I visit `.github/specs/CATALOG.md`, **Then** I see a complete list of all specifications with title, purpose, status (Draft/Active/Complete), and last-updated date
2. **Given** the catalog exists, **When** I click a specification link, **Then** I navigate directly to that specification's directory and README
3. **Given** the catalog is created, **When** a new specification is added, **Then** the catalog is automatically updated (or a process exists to keep it current)

---

### User Story 3 - Audit Specification Quality Across All 12 Specs (Priority: P1)

As a specification governance lead, I need to audit all existing specifications against the 8-dimension quality framework (Completeness, Clarity, Consistency, Measurability, Scenario Coverage, Edge Cases, Dependencies, Ambiguities) to identify which specifications meet quality standards and which require remediation before implementation work continues.

**Why this priority**: Specifications are the foundation of all governance work. If existing specs have quality gaps, they'll cause rework and misalignment. A cross-spec quality audit ensures all governance specifications meet minimum standards before being used as normative guidance.

**Independent Test**: Can be fully tested by running `/speckit-analyze` on each of the 12 specifications and generating a quality report showing: (1) which specs pass all 8 quality dimensions, (2) specific gaps identified in each spec, (3) prioritized remediation plan. The audit delivers actionable feedback for improving governance specifications.

**Acceptance Scenarios**:

1. **Given** 12 existing specifications, **When** I run quality analysis on each, **Then** I receive a report showing pass/fail status for each of 8 quality dimensions (Completeness, Clarity, Consistency, Measurability, Scenario Coverage, Edge Cases, Dependencies, Ambiguities)
2. **Given** specifications with quality gaps, **When** I review the audit report, **Then** specific examples are cited (e.g., "Spec 004 has vague requirement: 'System MUST be scalable'")
3. **Given** audit findings, **When** I create a remediation plan, **Then** I can prioritize fixes by impact and effort (e.g., "Spec 006 needs 2 clarifications; Spec 003 is complete")

---

### User Story 4 - Establish SpecKit Maintenance Process & Governance (Priority: P2)

As a governance maintainer, I need clear procedures for maintaining the speckit folder structure going forward—including how new specs are numbered, how existing specs are updated, how the catalog stays current, and what quality gates must be met before a specification becomes normative governance.

**Why this priority**: Without clear maintenance processes, the speckit structure will decay over time. Clear governance ensures consistency as new specifications are added and existing ones evolve.

**Independent Test**: Can be fully tested by creating a `specs/MAINTENANCE.md` document that defines: (1) numbering scheme and how next numbers are assigned, (2) process for adding new specifications, (3) process for updating existing specifications, (4) quality gate requirements, (5) catalog update procedures. A new specification creation following this process should result in correctly numbered folder and properly indexed catalog entry.

**Acceptance Scenarios**:

1. **Given** new specifications are created, **When** I follow the maintenance procedures, **Then** the new spec is numbered sequentially (not skipping numbers), named consistently, and automatically added to the catalog
2. **Given** a governance specification needs updates, **When** I follow the update process, **Then** the change goes through quality review, stakeholder approval, and changelog documentation
3. **Given** the maintenance procedures exist, **When** auditing compliance, **Then** ≥95% of new specs follow the procedures and catalog is kept current

---

### User Story 5 - Identify Specification Numbering Gaps & Correct if Needed (Priority: P2)

As a structure auditor, I need to verify that the numbering sequence is truly sequential without gaps, and correct any gaps if they exist, so the system is clean and future specs can be numbered predictably.

**Why this priority**: Sequential numbering enables automated assignment of next spec numbers. Gaps create confusion and make numbering less predictable. This is a one-time cleanup task that enables better maintenance going forward.

**Independent Test**: Can be fully tested by: (1) scanning all numbered directories, (2) building a complete list of current numbers, (3) identifying any gaps (e.g., if 001-012 exist but 004 is missing), (4) planning renumbering strategy if gaps exist, (5) executing renumbering if needed. Result should be confirmed sequential numbering (001-013 or similar) with no gaps.

**Acceptance Scenarios**:

1. **Given** 12 numbered spec directories, **When** I audit the numbering, **Then** I verify all numbers are sequential with no gaps (e.g., 001, 002, 003...012)
2. **Given** [NEEDS CLARIFICATION: If gaps are discovered in the current sequence, should we renumber to close gaps or leave historical numbering intact?], **When** gaps are found, **Then** a remediation plan is documented
3. **Given** the refactoring is complete, **When** new specs are created, **Then** the next number assigned is always the highest current number + 1 (e.g., if 013 exists, next is 014)

---

### Edge Cases

- What happens if a specification directory exists but contains no `spec.md` file? (Should fail audit with clear error message)
- How should historical/archived specifications be handled in the numbering scheme? (Should they be preserved with legacy numbers or consolidated?)
- What if a specification has been superseded by another? (Should both exist or should the old one be marked as deprecated?)
- Can specification numbers be reused after a spec is archived? (No—maintain historical traceability)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST audit all numbered directories in `.github/specs/` and generate a complete inventory with folder names, file presence, and compliance status
- **FR-002**: System MUST verify sequential numbering scheme (001, 002, 003...N) and identify any gaps in the sequence
- **FR-003**: System MUST validate that all spec directories follow the `{NNN}-{slug}` naming convention with 3-digit numbers and lowercase hyphenated slugs
- **FR-004**: System MUST create a `CATALOG.md` file listing all specifications with title, purpose, status, creation date, and direct navigation links
- **FR-005**: System MUST run quality analysis (using `/speckit-analyze` framework) against all 12 existing specifications to validate against 8-dimension quality framework
- **FR-006**: System MUST generate a comprehensive quality audit report showing pass/fail status for each specification against Completeness, Clarity, Consistency, Measurability, Scenario Coverage, Edge Cases, Dependencies, and Ambiguities dimensions
- **FR-007**: System MUST identify specific quality gaps in each specification (with examples and line references where applicable)
- **FR-008**: System MUST create a prioritized remediation plan for quality gaps, ordered by impact and effort
- **FR-009**: System MUST document maintenance procedures for adding new specifications (numbering scheme, naming convention, quality gates, catalog updates)
- **FR-010**: System MUST document procedures for updating existing specifications (change process, approval gates, traceability)
- **FR-011**: System MUST establish governance authority for specification changes (who can create, approve, merge specification updates)
- **FR-012**: System MUST [NEEDS CLARIFICATION: Should the numbering scheme be preserved exactly as-is (001-012) or renumbered to remove any historical gaps, or should new specs start at 013?] ensure predictable numbering for future specifications

### Key Entities

- **Specification**: A governance document defining requirements, user scenarios, success criteria, and assumptions for a feature or governance change. Located in `.github/specs/{NNN}-{slug}/spec.md`
- **Specification Catalog**: A central index file (`CATALOG.md`) listing all specifications for discovery and navigation
- **Specification Checklist**: Quality validation files in `.github/specs/{NNN}-{slug}/checklists/` that track specification quality dimensions
- **Specification Number**: A 3-digit sequential identifier (001, 002, 003...N) used to order specifications chronologically and enable automated numbering
- **Quality Dimension**: One of 8 attributes used to validate specification quality: Completeness, Clarity, Consistency, Measurability, Scenario Coverage, Edge Cases, Dependencies, Ambiguities

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of numbered specification directories (001-013+) follow the `{NNN}-{slug}` naming convention with no exceptions
- **SC-002**: Specification numbering is fully sequential with zero gaps (e.g., 001, 002, 003...N with no missing numbers)
- **SC-003**: A `CATALOG.md` file exists at `.github/specs/CATALOG.md` and is linked from CLAUDE.md, listing all 12+ specifications with title, purpose, status, and creation date
- **SC-004**: Quality audit report generated covering all 12 existing specifications with pass/fail status for each 8-quality dimensions; ≥95% accuracy when spot-checked against specifications
- **SC-005**: Remediation plan for quality gaps is documented with specific actions, owners, and effort estimates; ≥90% of identified gaps have actionable remediation steps
- **SC-006**: Maintenance procedures documented in `specs/MAINTENANCE.md` covering: numbering scheme, new spec creation process, update process, quality gates, catalog maintenance, and governance authority
- **SC-007**: All governance team members can locate any specification in <30 seconds using the catalog (usability/discoverability metric)
- **SC-008**: Documentation is current within 7 days of any new specification being added (maintenance compliance metric)
- **SC-009**: Subsequent new specifications (spec 014+) are created following the documented procedures with 100% compliance to naming, numbering, and quality gate requirements
- **SC-010**: Specification quality scores improve by ≥20% post-remediation (measured against baseline quality audit scores)

## Assumptions

- **Current State**: There are currently 12 specifications numbered 001-012 in `.github/specs/`, following sequential numbering with no gaps
- **Numbering Scheme**: The sequential 3-digit numbering scheme (001, 002, 003...N) is the desired long-term pattern and should be preserved going forward
- **Scope**: Only specifications in `.github/specs/` are in scope; specifications in other locations (e.g., `.github/projects/active/openspec/`) are out of scope for this audit
- **Quality Framework**: The 8-dimension quality framework (Completeness, Clarity, Consistency, Measurability, Scenario Coverage, Edge Cases, Dependencies, Ambiguities) as defined in `.specify/memory/constitution.md` Principle VII is the authoritative standard for specification quality
- **Catalog Maintenance**: The `CATALOG.md` will be maintained manually by governance team members; automation for auto-updates is out of scope for v1 (can be a future enhancement)
- **Remediation Timeline**: Quality gap remediation is out of scope for this project; this specification only identifies gaps and creates a remediation plan. Actual fixes are handled in follow-up specifications
- **Historical Specifications**: All 12 existing specifications will be preserved; no specifications are being deleted or consolidated in this refactoring
- **Governance Authority**: @ashley (organisation owner) retains authority over changes to locked governance files and specification amendments, per the constitution
- **Process Documentation**: Maintenance procedures will be documented in plain English suitable for non-technical governance stakeholders; they will be reviewed and approved before implementation

---

## References & Related Work

- **Constitution**: `.specify/memory/constitution.md` — Principle VII (Specification Quality Standards) defines the 8-dimension quality framework
- **CLAUDE.md**: Branch naming requirements and specification-first workflow
- **Existing Specifications**: All 12 specifications in `.github/specs/001-*/` through `.github/specs/012-*/`
- **SpecKit Tools**: `/speckit-analyze`, `/speckit-checklist`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks` — available tools for specification work
