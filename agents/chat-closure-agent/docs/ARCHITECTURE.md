# Chat Closure Agent — Architecture & Design

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-agent-validation](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![openspec-progress-phase](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml)
[![openspec-report-progression](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml)
[![openspec-sync-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml)
[![openspec-validate-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![pr-template-validation](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

**Overview:** The Chat Closure Agent is a Tier 1 portable agent that automates session closure workflows through modular, composable components. This document provides system architecture, component interactions, and design patterns.

## System Architecture

### High-Level Data Flow

```mermaid
accTitle: Graph Diagram
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
graph LR
accTitle: Graph Diagram
    A["Session Input<br/>(repoPath, options)"] -->|Analyze| B["Core Analysis<br/>(git metadata)"]
    B -->|Extract| C["Git Metadata<br/>(branch, commits, issues)"]
    C -->|Create| D["Memory Updater<br/>(10-family YAML)"]
    D -->|Index| E["Memory System<br/>(.remember/MEMORY.md)"]
    C -->|Generate| F["Continuation Prompt<br/>(Markdown)"]
    F -->|Report| G["Session Summary<br/>(handoff ready)"]
    C -->|Validate| H["Workspace Cleaner<br/>(git state)"]
    H -->|Cleanup| I["Clean Worktree<br/>(optional)"]
    style A fill:#e1f5ff,color:#0f172a
    style B fill:#f3e8ff,color:#3b0764,stroke:#7e22ce
    style D fill:#f3e8ff,color:#3b0764,stroke:#7e22ce
    style F fill:#f3e8ff,color:#3b0764,stroke:#7e22ce
    style H fill:#f3e8ff,color:#3b0764,stroke:#7e22ce
    style G fill:#dcfce7,color:#14532d,stroke:#14532d
    style I fill:#dcfce7,color:#14532d,stroke:#14532d
accDescr: Detailed diagram showing structure and relationships
```

### Component Stack

```mermaid
accTitle: Graph Diagram
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
graph TB
accTitle: Graph Diagram
    subgraph "Agent Layer"
        A["claude/prompt.md<br/>(orchestration)"]
    end
    
    subgraph "Core Modules"
        B["core-analysis.js<br/>(git metadata)"]
        C["memory-updater.js<br/>(10-family YAML)"]
        D["continuation-prompt-builder.js<br/>(handoff generation)"]
        E["workspace-cleaner.js<br/>(cleanup workflow)"]
    end
    
    subgraph "External Systems"
        F["Git Repository<br/>(branch, commits, state)"]
        G["Memory System<br/>(.remember/MEMORY.md)"]
        H["GitHub API<br/>(optional enrichment)"]
    end
    
    A -->|uses| B
    A -->|uses| C
    A -->|uses| D
    A -->|uses| E
    B -->|reads| F
    C -->|writes| G
    D -->|reads| G
    E -->|manages| F
    B -->|queries| H
    
    style A fill:#fff9c4,color:#0f172a
    style B fill:#e1bee7,color:#0f172a
    style C fill:#e1bee7,color:#0f172a
    style D fill:#e1bee7,color:#0f172a
    style E fill:#e1bee7,color:#0f172a
    style F fill:#b3e5fc,color:#0f172a
    style G fill:#b3e5fc,color:#0f172a
    style H fill:#b3e5fc,color:#0f172a
accDescr: Detailed diagram showing structure and relationships
```

## Module Interactions

### 1. Core Analysis Module

**Purpose:** Extract git metadata and repository context

```mermaid
accTitle: Sequence Diagram
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
sequenceDiagram
accTitle: Sequence Diagram
    Agent ->> CoreAnalysis: analyzeRepository(repoPath)
    CoreAnalysis ->> CoreAnalysis: detectRepoType()
    CoreAnalysis ->> CoreAnalysis: getCurrentBranch()
    CoreAnalysis ->> CoreAnalysis: parseBranch()
    CoreAnalysis ->> CoreAnalysis: getRecentCommits()
    CoreAnalysis ->> CoreAnalysis: extractIssueNumbers()
    CoreAnalysis ->> CoreAnalysis: getGitState()
    CoreAnalysis -->> Agent: {branch, repoType, commits, issues, gitState}
accDescr: Detailed diagram showing structure and relationships
```

**Key Responsibilities:**

- Repository type detection (control-plane, plugin, theme)
- Branch parsing (type/scope extraction)
- Commit history analysis
- Issue number extraction from commit messages
- Git state validation (clean/dirty)

### 2. Memory Updater Module

**Purpose:** Create and persist session memory in 10-family YAML format

```mermaid
accTitle: Sequence Diagram
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
sequenceDiagram
accTitle: Sequence Diagram
    Agent ->> MemoryUpdater: updateMemoryForSessionClosure(repoPath, analysis, options)
    MemoryUpdater ->> MemoryUpdater: createMemoryEntry(metadata)
    MemoryUpdater ->> MemoryUpdater: formatMemoryAsMarkdown(entry)
    MemoryUpdater ->> MemoryUpdater: writeMemoryEntry(entry)
    MemoryUpdater ->> MemoryUpdater: updateMemoryIndex()
    MemoryUpdater -->> Agent: {written, entry, markdown, indexed}
    Note over Agent,MemoryUpdater: Memory persisted in .remember/MEMORY.md
accDescr: Detailed diagram showing structure and relationships
```

**Key Responsibilities:**

- Memory entry creation with 10-family structure
- Markdown formatting with frontmatter
- File I/O and persistence
- Index management and deduplication

### 3. Continuation Prompt Builder Module

**Purpose:** Generate professional handoff prompts with full context

```mermaid
accTitle: Graph Diagram
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
graph LR
accTitle: Graph Diagram
    subgraph "Input Data"
        A["Core Analysis<br/>(branch, commits)"]
        B["Memory Entry<br/>(decisions, blockers)"]
        C["Optional: Projects<br/>Issues, PRs"]
    end
    
    subgraph "Processing"
        D["Extract Context<br/>Summary"]
        E["Format Projects<br/>List"]
        F["Format Issues<br/>Table"]
        G["Format PRs<br/>Table"]
        H["Format Branch<br/>Status"]
        I["Summarize Memory<br/>Updates"]
    end
    
    subgraph "Output"
        J["Continuation Prompt<br/>(Markdown)"]
    end
    
    A -->|title, scope| D
    A -->|branch, commits| H
    B -->|decisions, blockers| I
    C -->|array| E
    C -->|array| F
    C -->|array| G
    
    D --> J
    E --> J
    F --> J
    G --> J
    H --> J
    I --> J
    
    style A fill:#e3f2fd,color:#0f172a
    style B fill:#e3f2fd,color:#0f172a
    style C fill:#e3f2fd,color:#0f172a
    style J fill:#dcfce7,color:#14532d,stroke:#14532d
accDescr: Detailed diagram showing structure and relationships
```

**Key Responsibilities:**

- Context summary extraction
- Markdown table generation
- Prompt validation and formatting
- Multi-section orchestration

### 4. Workspace Cleaner Module

**Purpose:** Safe cleanup with validation and confirmation

```mermaid
accTitle: Graph Diagram
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
graph TB
accTitle: Graph Diagram
    A["cleanupWorktree()"]
    
    A -->|Step 1| B["validateCleanupSafety()"]
    B -->|Check| B1["Git state<br/>(clean/dirty)"]
    B -->|Check| B2["Commits ahead<br/>(rebase risk)"]
    B -->|Return| B3["warnings: Safety assessment"]
    
    A -->|Step 2| C["Handle uncommitted<br/>changes"]
    C -->|Option 1| C1["stashChanges()"]
    C -->|Option 2| C2["commitChanges()"]
    C -->|Option 3| C3["Cancel (no-op)"]
    
    A -->|Step 3| D["Confirmation callback<br/>(require user approval)"]
    
    A -->|Step 4| E["deleteWorktree()<br/>(if approved)"]
    E -->|Execute| E1["git worktree remove"]
    
    A -->|Return| F["Cleanup report<br/>(success/errors)"]
    
    style A fill:#fef3c7,color:#4a2c00,stroke:#b45309
    style B fill:#ffe0b2,color:#0f172a
    style C fill:#ffe0b2,color:#0f172a
    style D fill:#ffccbc,color:#0f172a
    style E fill:#dcfce7,color:#14532d,stroke:#14532d
    style F fill:#dcfce7,color:#14532d,stroke:#14532d
accDescr: Detailed diagram showing structure and relationships
```

**Key Responsibilities:**

- Pre-cleanup validation
- Git state analysis
- Confirmation workflow
- Non-destructive alternatives (stash/commit)
- Cleanup reporting

## Repository Type Detection

### Detection Logic

```mermaid
accTitle: Graph Diagram
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
graph TD
accTitle: Graph Diagram
    A["detectRepoType(repoPath)"] -->|Check| B{".github/projects/active<br/>AND<br/>.github/labels.yml?"}
    B -->|YES| C["control-plane"]
    B -->|NO| D{".plugin.php<br/>AND<br/>composer.json?"}
    D -->|YES| E["wordpress-plugin"]
    D -->|NO| F{".style.css<br/>AND<br/>theme.json?"}
    F -->|YES| G["wordpress-theme"]
    F -->|NO| H["Unknown type<br/>(throw error)"]
    
    style C fill:#dcfce7,color:#14532d,stroke:#14532d
    style E fill:#dcfce7,color:#14532d,stroke:#14532d
    style G fill:#dcfce7,color:#14532d,stroke:#14532d
    style H fill:#fee2e2,color:#7f1d1d,stroke:#b91c1c
accDescr: Detailed diagram showing structure and relationships
```

### Supported Repository Types

| Type | Markers | Purpose |
|------|---------|---------|
| **control-plane** | `.github/projects/active/` + `.github/labels.yml` | GitHub Actions workflows, org governance |
| **wordpress-plugin** | `plugin.php` + `composer.json` | WordPress plugin development |
| **wordpress-theme** | `style.css` + `theme.json` | WordPress theme development |

## Memory System Integration

### 10-Family YAML Structure

```mermaid
accTitle: Graph Diagram
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
graph LR
accTitle: Graph Diagram
    subgraph "10-Family Memory"
        A["metadata<br/>(session, branch, repo)"]
        B["user_defaults<br/>(preferences)"]
        C["project_context<br/>(work scope)"]
        D["decision_log<br/>(choices made)"]
        E["execution_state<br/>(progress)"]
        F["handoff<br/>(continuation)"]
    end
    
    G["Memory File<br/>(.remember/session-123.md)"]
    H["Memory Index<br/>(.remember/MEMORY.md)"]
    
    A --> G
    B --> G
    C --> G
    D --> G
    E --> G
    F --> G
    G --> H
    
    style G fill:#fff9c4,color:#0f172a
    style H fill:#dcfce7,color:#14532d,stroke:#14532d
accDescr: Detailed diagram showing structure and relationships
```

**Each family contains:**

```yaml
---
metadata:        # Agent tracking: session_id, branch, timestamp
---

## User Defaults
[4 standard user preferences]

## Project Context
- Branch: feat/implementation
- Repo type: control-plane
- Session date: 2026-08-12
- Work scope: [commit summary]

## Decision Log
✅ **decision-name**: Choice — Rationale

## Execution State
[Commits, issues referenced, blockers, next steps]

## Handoff
[Summary, continuation instructions, related issues]
```

## Error Handling & Recovery

### Validation & Safety Gates

```mermaid
accTitle: Graph Diagram
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
graph TB
accTitle: Graph Diagram
    A["Session Closure Request"]
    
    A -->|Gate 1| B["Repository Type<br/>Validation"]
    B -->|Fail| B1["Return: Unknown type"]
    B -->|Pass| C["Git State<br/>Analysis"]
    
    C -->|Dirty| D["Prompt user:<br/>stash/commit/cancel"]
    D -->|Stash| D1["Non-destructive preserve"]
    D -->|Commit| D2["Permanent record"]
    D -->|Cancel| D3["Abort cleanup"]
    
    C -->|Clean| E["Continue to<br/>Cleanup"]
    E -->|Gate 2| F["User Confirmation<br/>Callback"]
    F -->|Deny| F1["Return: Cancelled"]
    F -->|Confirm| G["Execute Cleanup"]
    
    G -->|Success| H["Generate Report<br/>(✅ Success)"]
    G -->|Error| I["Generate Report<br/>(❌ Error + recovery)"]
    
    style A fill:#e3f2fd,color:#0f172a
    style B1 fill:#fee2e2,color:#7f1d1d,stroke:#b91c1c
    style D1 fill:#dcfce7,color:#14532d,stroke:#14532d
    style D2 fill:#dcfce7,color:#14532d,stroke:#14532d
    style D3 fill:#fff9c4,color:#0f172a
    style F1 fill:#fff9c4,color:#0f172a
    style H fill:#dcfce7,color:#14532d,stroke:#14532d
    style I fill:#fee2e2,color:#7f1d1d,stroke:#b91c1c
accDescr: Detailed diagram showing structure and relationships
```

## Design Patterns

### 1. Modular Composition

- Each module is **independent** with clear interfaces
- Modules can be used standalone or as a pipeline
- No cross-module state management

### 2. Safety-First Cleanup

- Validation before any destructive operation
- User confirmation for irreversible actions
- Non-destructive alternatives (stash/commit)
- Detailed error reporting

### 3. Memory Persistence

- Structured, human-readable format (10-family YAML)
- Automatic indexing and deduplication
- Frontmatter metadata for search/filtering
- Backward-compatible additions

### 4. Multi-Repository Support

- Detection-based adaptation (no configuration needed)
- Type-specific metadata parsing
- Unified interface across all types

## Performance Characteristics

| Operation | Time | Scalability |
|-----------|------|-------------|
| Repository analysis | ~100-300ms | Linear with commit count |
| Memory creation | ~50-100ms | Constant (file I/O) |
| Prompt generation | ~50-150ms | Linear with project/issue count |
| Workspace cleanup | ~500-2000ms | Depends on worktree size |
| **Total workflow** | **~1-3 seconds** | **Linear with context size** |

## Extension Points

The agent is designed for extension:

1. **New repository types** — Add detection logic + metadata parser
2. **Provider implementations** — Copilot/OpenAI via `copilot/prompt.md`, `openai/prompt.md`
3. **Memory enrichment** — GitHub API integration for issue/PR details
4. **Custom cleanup strategies** — Extend `workspace-cleaner.js` with new options
5. **Continuation prompt customization** — Template system for different audiences

## References

- [AGENT.md](../AGENT.md) — Full agent specification
- [claude/prompt.md](../claude/prompt.md) — Claude implementation
- [USAGE_GUIDE.md](./USAGE_GUIDE.md) — How to invoke and customize
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) — Testing strategies

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
