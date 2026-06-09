## ADDED Requirements

### Requirement: Coverage programme issue chain exists

The repository MUST maintain a parent epic plus six linked phase issues for the test coverage implementation programme.

#### Scenario: Parent and phase issues are created

- **WHEN** the coverage programme is prepared for execution
- **THEN** the parent issue and all six phase issues are created from the strict issue files

#### Scenario: Phase issues remain linked to the parent

- **WHEN** a phase issue is opened or updated
- **THEN** the issue body references the parent epic and the issue register records the relationship

### Requirement: Phase issues cover the full task list

Each phase issue MUST cover the tasks assigned to that phase in the active project README.

#### Scenario: Phase one captures baseline work

- **WHEN** the phase 1 issue is created
- **THEN** it covers tasks 1.1 through 1.4 from the source README

#### Scenario: Later phases capture their task ranges

- **WHEN** phase 2 through phase 6 issues are created
- **THEN** each issue covers its assigned task range from the source README

### Requirement: Closeout state stays synchronised

The repository MUST keep the issue register, run log, and PR/issue bodies aligned until the programme is closed.

#### Scenario: GitHub issues are created

- **WHEN** the live GitHub issues are opened
- **THEN** the issue register records their URLs and the run log records the creation pass

#### Scenario: Closeout checklists are completed

- **WHEN** the PR is ready to merge and the final issue state is complete
- **THEN** the PR body and the issue bodies show completed checkboxes before closeout
