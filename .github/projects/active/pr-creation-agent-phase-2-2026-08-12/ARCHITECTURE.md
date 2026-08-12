# PR Creation Agent — Architecture & Design

**Phase:** 2 (Specification)  
**Document Type:** Architecture & Integration Patterns  
**Timeline:** Reference for Phase 3 Implementation (2026-08-20 → 2026-09-02)

---

## 1. AGENT ARCHITECTURE OVERVIEW

### 1.1 High-Level System Diagram

```mermaid
graph TB
    Input["Input: PR Data<br/>(branch, files, metadata)"]
    
    Orchestrator["PR Orchestrator<br/>(Main Agent)"]
    
    S1["Skill 1<br/>validate-branch-name"]
    S2["Skill 2<br/>route-pr-template"]
    S3["Skill 3<br/>validate-and-apply-labels"]
    S4["Skill 4<br/>enforce-issue-linking"]
    S5["Skill 5<br/>draft-pr-description"]
    S6["Skill 6<br/>create-pr"]
    
    Config["Configuration Loader<br/>(.claude/pr-agent.config.yml)"]
    StateMachine["State Machine<br/>(workflow transitions)"]
    
    Output["Output: PR Created<br/>(PR number, URL, etc.)"]
    GitHub["GitHub API"]
    
    Input --> Orchestrator
    Orchestrator --> S1
    Orchestrator --> S2
    Orchestrator --> S3
    Orchestrator --> S4
    Orchestrator --> S5
    Orchestrator --> S6
    
    S1 --> StateMachine
    S2 --> StateMachine
    S3 --> StateMachine
    S4 --> StateMachine
    S5 --> StateMachine
    S6 --> StateMachine
    
    StateMachine --> Output
    
    Config -.-> Orchestrator
    S6 --> GitHub
    
    style Orchestrator fill:#4A90E2
    style S1 fill:#7ED321
    style S2 fill:#7ED321
    style S3 fill:#7ED321
    style S4 fill:#7ED321
    style S5 fill:#7ED321
    style S6 fill:#7ED321
    style Config fill:#F5A623
    style StateMachine fill:#BD10E0
```

---

## 2. AGENT WORKFLOW STATE MACHINE

### 2.1 State Diagram

```mermaid
stateDiagram-v2
    [*] --> IDLE
    
    IDLE --> VALIDATE_BRANCH: receive input
    
    VALIDATE_BRANCH --> BRANCH_VALID: valid
    VALIDATE_BRANCH --> ERROR: invalid branch
    
    BRANCH_VALID --> ROUTE_TEMPLATE: get template
    
    ROUTE_TEMPLATE --> TEMPLATE_FOUND: template exists
    ROUTE_TEMPLATE --> ERROR: template not found
    
    TEMPLATE_FOUND --> VALIDATE_LABELS: check labels
    
    VALIDATE_LABELS --> LABELS_OK: labels valid
    VALIDATE_LABELS --> ERROR: invalid labels
    
    LABELS_OK --> ENFORCE_ISSUES: validate issues
    
    ENFORCE_ISSUES --> ISSUES_VALID: issues exist
    ENFORCE_ISSUES --> ERROR: issues not found
    
    ISSUES_VALID --> DRAFT_DESCRIPTION: compose body
    
    DRAFT_DESCRIPTION --> DESCRIPTION_READY: body created
    DRAFT_DESCRIPTION --> ERROR: composition failed
    
    DESCRIPTION_READY --> CREATE_PR: submit to GitHub
    
    CREATE_PR --> PR_CREATED: success
    CREATE_PR --> ERROR: API error
    
    PR_CREATED --> SUCCESS: return PR data
    ERROR --> FAILED: report error
    
    SUCCESS --> [*]
    FAILED --> [*]
    
    style IDLE fill:#e1f5ff,color:#000
    style SUCCESS fill:#c8e6c9,color:#000
    style FAILED fill:#ffcdd2,color:#000
    style ERROR fill:#ffcdd2,color:#000
```

---

## 3. SKILL EXECUTION SEQUENCE

### 3.1 Sequential Skill Flow

```mermaid
sequenceDiagram
    participant Orchestrator
    participant Skill1 as validate-branch-name
    participant Skill2 as route-pr-template
    participant Skill3 as validate-and-apply-labels
    participant Skill4 as enforce-issue-linking
    participant Skill5 as draft-pr-description
    participant Skill6 as create-pr
    participant GitHub
    
    Orchestrator->>Skill1: validate branch
    Skill1-->>Orchestrator: {valid: true}
    
    Orchestrator->>Skill2: get template path
    Skill2-->>Orchestrator: template data
    
    Orchestrator->>Skill3: validate & apply labels
    Skill3-->>Orchestrator: validated labels
    
    Orchestrator->>Skill4: validate issues
    Skill4-->>Orchestrator: valid issues
    
    Orchestrator->>Skill5: draft description
    Skill5-->>Orchestrator: PR body
    
    Orchestrator->>Skill6: create PR
    Skill6->>GitHub: POST /repos/.../pulls
    GitHub-->>Skill6: PR created
    Skill6-->>Orchestrator: PR data
    
    Orchestrator-->>Orchestrator: return result
```

---

## 4. CONFIGURATION HIERARCHY

### 4.1 Configuration Loading Diagram

```mermaid
graph TD
    A["Agent Default Config<br/>(agents/pr-creation-agent/config/defaults.yml)"]
    B["Repo Config<br/>(.claude/pr-agent.config.yml)"]
    C["Custom Hooks<br/>(.claude/pr-agent-hooks.js)"]
    D["Final Config<br/>(merged & validated)"]
    
    A -->|override| D
    B -->|override| D
    C -->|extend| D
    
    D -->|used by| E["Orchestrator"]
    D -->|used by| F["Skills"]
    
    style A fill:#fff9c4,color:#000
    style B fill:#fff9c4,color:#000
    style C fill:#fff9c4,color:#000
    style D fill:#4CAF50,color:#fff
    style E fill:#2196F3,color:#fff
    style F fill:#2196F3,color:#fff
```

---

## 5. SKILL INTERFACE CONTRACTS

### 5.1 Skill 1: validate-branch-name

```
Interface: validateBranchName(branchName, config)
Input:
  - branchName: string (e.g., 'feat/pr-creation-agent')
  - config: {
      allowedTypes: string[],
      customRules?: function,
      maxLength?: number
    }

Output:
  {
    valid: boolean,
    errors: string[],
    branch: {
      type: string,
      scope: string,
      title: string
    }
  }

Contract:
  ✓ Must validate format {type}/{scope}-{short-title}
  ✓ Must check type against allowed_types config
  ✓ Must call custom validation hooks if provided
  ✓ Must return actionable error messages
```

### 5.2 Skill 2: route-pr-template

```
Interface: routePRTemplate(branchName, templatesPath, config)
Input:
  - branchName: string
  - templatesPath: string
  - config: {
      customRouting?: object,
      fallbackTemplate?: string
    }

Output:
  {
    templatePath: string,
    templateType: string,
    metadata: {
      requiredSections: string[],
      optionalSections: string[]
    }
  }

Contract:
  ✓ Must load from .github/PULL_REQUEST_TEMPLATE/config.yml
  ✓ Must support custom routing via config
  ✓ Must return template metadata (sections, etc.)
  ✓ Must provide fallback template
```

### 5.3 Skill 3: validate-and-apply-labels

```
Interface: validateAndApplyLabels(userLabels, files, config)
Input:
  - userLabels: string[]
  - files: string[]
  - config: {
      canonicalLabelsPath: string,
      inferFromFiles: boolean,
      filePatterns?: object
    }

Output:
  {
    validLabels: string[],
    inferredLabels: string[],
    allLabels: string[],
    errors: string[]
  }

Contract:
  ✓ Must validate against canonical label set
  ✓ Must infer labels from files if enabled
  ✓ Must support file pattern mapping
  ✓ Must return deduplicated label list
```

### 5.4 Skill 4: enforce-issue-linking

```
Interface: enforceIssueLinking(linkedIssues, config, githubClient)
Input:
  - linkedIssues: string[] (e.g., ['#1234', '#1235'])
  - config: {
      required: boolean,
      allowedVerbs: string[]
    }
  - githubClient: GitHub API client

Output:
  {
    validIssues: object[],
    errors: string[],
    requirementMet: boolean
  }

Contract:
  ✓ Must validate issue numbers exist
  ✓ Must check issues are open (not closed)
  ✓ Must enforce required linking if configured
  ✓ Must validate verb format (Resolves, Closes, etc.)
```

### 5.5 Skill 5: draft-pr-description

```
Interface: draftPRDescription(template, metadata, config)
Input:
  - template: string (markdown template)
  - metadata: {
      userDescription: string,
      linkedIssues: object[],
      files: string[],
      scope: 'single-file' | 'multi-file' | 'complex'
    }
  - config: {
      changelogFile: string,
      changelogRequired: boolean
    }

Output:
  {
    prBody: string,
    metadata: {
      sections: string[],
      hasChangelog: boolean,
      scope: string
    }
  }

Contract:
  ✓ Must populate all template sections
  ✓ Must adapt description depth based on scope
  ✓ Must include linked issues in PR body
  ✓ Must optionally generate changelog entry
```

### 5.6 Skill 6: create-pr

```
Interface: createPR(prData, githubClient)
Input:
  - prData: {
      title: string,
      body: string,
      branch: string,
      labels: string[],
      draft?: boolean,
      repo: string
    }
  - githubClient: GitHub API client

Output:
  {
    pr: {
      number: number,
      url: string,
      sha: string,
      draft: boolean
    },
    error?: string
  }

Contract:
  ✓ Must create PR on specified branch
  ✓ Must apply labels programmatically
  ✓ Must support draft/ready modes
  ✓ Must handle GitHub API rate limits
  ✓ Must return PR details or error
```

---

## 6. ERROR HANDLING ARCHITECTURE

### 6.1 Error Flow Diagram

```mermaid
graph TB
    Error["Error Occurs<br/>(in any skill)"]
    Classify["Classify Error<br/>(type & severity)"]
    
    Transient{"Transient<br/>(network, rate limit)?"}
    Permanent{"Permanent<br/>(validation, config)?"}
    
    Retry["Retry Logic<br/>(exponential backoff)"]
    RetrySuccess{"Retry<br/>Successful?"}
    
    Report["Report Error<br/>(user-facing message)"]
    Abort["Abort Workflow<br/>(rollback if needed)"]
    
    Error --> Classify
    Classify --> Transient
    
    Transient -->|yes| Retry
    Transient -->|no| Permanent
    
    Retry --> RetrySuccess
    RetrySuccess -->|yes| Success["✓ Continue"]
    RetrySuccess -->|no| Report
    
    Permanent -->|yes| Report
    
    Report --> Abort
    Abort --> [*]
    
    style Error fill:#ffcdd2
    style Retry fill:#fff9c4
    style Report fill:#ffcdd2
    style Success fill:#c8e6c9
```

---

## 7. CONFIGURATION LOADING SEQUENCE

### 7.1 Config Loading Flow

```
1. Check for .claude/pr-agent.config.yml
   ├─ If exists: load and validate
   └─ If not: use defaults

2. Load defaults from agents/pr-creation-agent/config/defaults.yml

3. Merge: defaults + repo config
   ├─ Repo config overrides defaults
   └─ Validate merged config against schema

4. Check for .claude/pr-agent-hooks.js
   ├─ If exists: load custom hooks
   └─ Register hooks with orchestrator

5. Validate complete config
   ├─ Schema validation
   ├─ Path existence checks
   └─ Permission verification

6. Return config to orchestrator
```

---

## 8. INTEGRATION POINTS

### 8.1 GitHub Integration Points

| Integration | Method | Purpose |
|-------------|--------|---------|
| **Load Templates** | GitHub API `GET /repos/.../contents/.github/PULL_REQUEST_TEMPLATE/` | Fetch PR templates |
| **Load Labels** | GitHub API `GET /repos/.../labels` | Get canonical label set |
| **Validate Issues** | GitHub API `GET /repos/.../issues/{number}` | Check issue exists & status |
| **Create PR** | GitHub API `POST /repos/.../pulls` | Create pull request |
| **Apply Labels** | GitHub API `PATCH /repos/.../pulls/{pr}/labels` | Add labels to PR |

### 8.2 Existing Skill Integrations

| Skill | Integration | Usage |
|-------|-------------|-------|
| **code-review** | Optional pre-PR review | Can be called before PR creation |
| **commit-push-pr** | Git operations | Uses patterns from this skill |
| **commit** | Commit signing | Uses agent signature pattern |
| **figma** | Design-to-code | Optional for design-driven PRs |

---

## 9. EXTENSION POINTS

### 9.1 Custom Hooks Architecture

```javascript
// .claude/pr-agent-hooks.js

module.exports = {
  // Called before validation
  onBeforeValidate: async (input) => {
    // Custom pre-validation logic
    return input; // modified input or original
  },
  
  // Called after branch validation
  onAfterValidateBranch: async (result) => {
    // Custom branch handling
    return result;
  },
  
  // Called for custom label inference
  inferLabelsCustom: async (files, config) => {
    // Custom label inference
    return ['type:custom', 'area:custom'];
  },
  
  // Called before PR creation
  onBeforeCreatePR: async (prData) => {
    // Final modifications to PR data
    return prData;
  },
  
  // Called after PR creation
  onAfterCreatePR: async (pr) => {
    // Post-creation actions (Slack, etc.)
    return pr;
  }
};
```

---

## 10. WORDPRESS-SPECIFIC ARCHITECTURE

### 10.1 WordPress Config Integration

```mermaid
graph TD
    Config["Check: wordpress.enabled?"]
    
    Config -->|false| Standard["Use Standard Config"]
    Config -->|true| WPConfig["Load WordPress Config"]
    
    WPConfig --> RepoType{"repo_type?"}
    RepoType -->|plugin| PluginConfig["Load Plugin Config<br/>- Disable Mergify<br/>- Enable WordPress Skills"]
    RepoType -->|theme| ThemeConfig["Load Theme Config<br/>- Disable Mergify<br/>- Enable WordPress Skills"]
    
    PluginConfig --> Hooks{"custom_hooks?"}
    ThemeConfig --> Hooks
    
    Hooks -->|yes| LoadHooks["Load Custom Hooks<br/>(.claude/pr-agent-wordpress-hooks.js)"]
    Hooks -->|no| FinalConfig["Final Config Ready"]
    
    LoadHooks --> FinalConfig
    Standard --> FinalConfig
    
    style Config fill:#2196F3,color:#fff
    style PluginConfig fill:#FF9800,color:#fff
    style ThemeConfig fill:#FF9800,color:#fff
    style FinalConfig fill:#4CAF50,color:#fff
```

---

## 11. DEPLOYMENT ARCHITECTURE

### 11.1 Multi-Repo Deployment Pattern

```
Agent Location: agents/pr-creation-agent/

Per-Repo Configuration:
├── lightspeedwp/.github/
│   └── .claude/pr-agent.config.yml (GitHub control plane config)
│
├── lightspeedwp/wordpress-plugin-a/
│   └── .claude/pr-agent.config.yml (plugin config)
│   └── .claude/pr-agent-hooks.js (optional plugin hooks)
│
├── lightspeedwp/wordpress-theme-b/
│   └── .claude/pr-agent.config.yml (theme config)
│
└── ... 9 more repos (all with repo-specific config)

Skill Usage:
├── validate-branch-name (all repos)
├── route-pr-template (all repos)
├── validate-and-apply-labels (all repos)
├── enforce-issue-linking (all repos)
├── draft-pr-description (all repos)
├── create-pr (all repos)
└── WordPress-specific skills (enabled only if wordpress.enabled: true)
```

---

## 12. PHASE 3 IMPLEMENTATION GUIDANCE

**Based on this architecture, Phase 3 will implement:**

1. **Core Agent Files**
   - `pr-orchestrator.js` — main orchestrator following state machine
   - `config-loader.js` — configuration loading with hierarchy
   - `state-machine.js` — workflow state transitions

2. **Skill Implementations**
   - Each skill file implements its contract
   - All skills follow orchestrator interface
   - Custom hooks supported throughout

3. **Integration Layer**
   - GitHub API client wrapper
   - Error handling & retries
   - Rate limit management

4. **Test Suite**
   - Unit tests per skill (95%+ coverage)
   - Integration tests with mock GitHub API
   - E2E tests against real repos

---

**Architecture Complete. Ready for Phase 3 Implementation.**
