# Chat Closure Agent — Architecture & Design

**Overview:** The Chat Closure Agent is a Tier 1 portable agent that automates session closure workflows through modular, composable components. This document provides system architecture, component interactions, and design patterns.

## System Architecture

### High-Level Data Flow

```mermaid
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
    style A fill:#e1f5ff
    style B fill:#f3e5f5
    style D fill:#f3e5f5
    style F fill:#f3e5f5
    style H fill:#f3e5f5
    style G fill:#c8e6c9
    style I fill:#c8e6c9
accDescr: Visual diagram showing structure, relationships, and flow
```

### Component Stack

```mermaid
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
    
    style A fill:#fff9c4
    style B fill:#e1bee7
    style C fill:#e1bee7
    style D fill:#e1bee7
    style E fill:#e1bee7
    style F fill:#b3e5fc
    style G fill:#b3e5fc
    style H fill:#b3e5fc
accDescr: Visual diagram showing structure, relationships, and flow
```

## Module Interactions

### 1. Core Analysis Module

**Purpose:** Extract git metadata and repository context

```mermaid
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
accDescr: Visual diagram showing structure, relationships, and flow
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
sequenceDiagram
accTitle: Sequence Diagram
    Agent ->> MemoryUpdater: updateMemoryForSessionClosure(repoPath, analysis, options)
    MemoryUpdater ->> MemoryUpdater: createMemoryEntry(metadata)
    MemoryUpdater ->> MemoryUpdater: formatMemoryAsMarkdown(entry)
    MemoryUpdater ->> MemoryUpdater: writeMemoryEntry(entry)
    MemoryUpdater ->> MemoryUpdater: updateMemoryIndex()
    MemoryUpdater -->> Agent: {written, entry, markdown, indexed}
    Note over Agent,MemoryUpdater: Memory persisted in .remember/MEMORY.md
accDescr: Visual diagram showing structure, relationships, and flow
```

**Key Responsibilities:**

- Memory entry creation with 10-family structure
- Markdown formatting with frontmatter
- File I/O and persistence
- Index management and deduplication

### 3. Continuation Prompt Builder Module

**Purpose:** Generate professional handoff prompts with full context

```mermaid
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
    
    style A fill:#e3f2fd
    style B fill:#e3f2fd
    style C fill:#e3f2fd
    style J fill:#c8e6c9
accDescr: Visual diagram showing structure, relationships, and flow
```

**Key Responsibilities:**

- Context summary extraction
- Markdown table generation
- Prompt validation and formatting
- Multi-section orchestration

### 4. Workspace Cleaner Module

**Purpose:** Safe cleanup with validation and confirmation

```mermaid
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
    
    style A fill:#fff3e0
    style B fill:#ffe0b2
    style C fill:#ffe0b2
    style D fill:#ffccbc
    style E fill:#c8e6c9
    style F fill:#c8e6c9
accDescr: Visual diagram showing structure, relationships, and flow
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
graph TD
accTitle: Graph Diagram
    A["detectRepoType(repoPath)"] -->|Check| B{".github/projects/active<br/>AND<br/>.github/labels.yml?"}
    B -->|YES| C["control-plane"]
    B -->|NO| D{".plugin.php<br/>AND<br/>composer.json?"}
    D -->|YES| E["wordpress-plugin"]
    D -->|NO| F{".style.css<br/>AND<br/>theme.json?"}
    F -->|YES| G["wordpress-theme"]
    F -->|NO| H["Unknown type<br/>(throw error)"]
    
    style C fill:#c8e6c9
    style E fill:#c8e6c9
    style G fill:#c8e6c9
    style H fill:#ffcdd2
accDescr: Visual diagram showing structure, relationships, and flow
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
    
    style G fill:#fff9c4
    style H fill:#c8e6c9
accDescr: Visual diagram showing structure, relationships, and flow
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
    
    style A fill:#e3f2fd
    style B1 fill:#ffcdd2
    style D1 fill:#c8e6c9
    style D2 fill:#c8e6c9
    style D3 fill:#fff9c4
    style F1 fill:#fff9c4
    style H fill:#c8e6c9
    style I fill:#ffcdd2
accDescr: Visual diagram showing structure, relationships, and flow
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
