# Mermaid Diagrams — Testing Agent Architecture

## 1. 2-Tier Agent Architecture

This diagram shows the overall architecture with control-plane and portable agents.

```mermaid
graph TD
    subgraph Repos["Repository Layer"]
        GH[".github<br/>(Control-Plane)"]
        BP["Block Plugins"]
        BT["Block Themes"]
        OR["Other Repos"]
    end
    
    subgraph Agents["Testing Agents Layer"]
        CP[".github/agents/<br/>testing.agent.md<br/>(Coordinator)"]
        PA["agents/testing-agent/<br/>(Multi-Framework<br/>Orchestrator)"]
    end
    
    subgraph Providers["Test Execution Layer"]
        JEST["Jest Provider<br/>(JavaScript/TypeScript)"]
        PHP["PHPUnit Provider<br/>(PHP)"]
        PY["pytest Provider<br/>(Python)"]
        PW["Playwright Provider<br/>(Browser E2E)"]
    end
    
    GH -->|delegates| CP
    BP -->|delegates| CP
    BT -->|delegates| CP
    OR -->|delegates| CP
    
    CP -->|delegates to| PA
    
    PA --> JEST
    PA --> PHP
    PA --> PY
    PA --> PW
    
    JEST -->|executes| JS["Jest Tests"]
    PHP -->|executes| PHU["PHPUnit Tests"]
    PY -->|executes| PYT["pytest Tests"]
    PW -->|executes| PWT["Playwright Tests"]
    
    JS -->|reports| CP
    PHU -->|reports| CP
    PYT -->|reports| CP
    PWT -->|reports| CP
    
    CP -->|results| GH
    CP -->|results| BP
    CP -->|results| BT
    CP -->|results| OR
```

---

## 2. Delegation Flow (Sequence Diagram)

This diagram shows how requests flow through the 2-tier system.

```mermaid
sequenceDiagram
    participant R as Repository
    participant CP as Control-Plane<br/>Agent
    participant PA as Portable<br/>Agent
    participant S as Framework<br/>Skills
    participant F as Framework<br/>Executable
    
    R->>CP: "Run tests on PR"
    CP->>CP: Detect framework<br/>(Jest? PHPUnit?<br/>pytest? Playwright?)
    
    alt Jest Detected
        CP->>PA: Delegate: Run Jest
        PA->>S: Load jest-skill
        S->>S: Mock WordPress REST API
        S->>S: Setup block utilities
        S->>F: npm run test
    else PHPUnit Detected
        CP->>PA: Delegate: Run PHPUnit
        PA->>S: Load phpunit-skill
        S->>S: Mock WordPress globals
        S->>S: Setup database mocking
        S->>F: vendor/bin/phpunit
    else pytest Detected
        CP->>PA: Delegate: Run pytest
        PA->>S: Load pytest-skill
        S->>S: Setup CI environment
        S->>F: pytest
    else Playwright Detected
        CP->>PA: Delegate: Run Playwright
        PA->>S: Load playwright-skill
        S->>S: Setup browsers
        S->>F: npx playwright test
    end
    
    F->>S: Test results
    S->>PA: Results + coverage
    PA->>CP: Aggregated results
    CP->>R: Display in GitHub check
```

---

## 3. Test Execution Pipeline

This diagram shows the complete test execution flow.

```mermaid
graph TB
    subgraph Input["1️⃣ Input"]
        PR["Pull Request or<br/>Workflow Trigger"]
    end
    
    subgraph Detect["2️⃣ Framework Detection"]
        D1{"Jest?"}
        D2{"PHPUnit?"}
        D3{"pytest?"}
        D4{"Playwright?"}
    end
    
    subgraph Execute["3️⃣ Test Execution"]
        E1["Jest Tests<br/>npm test"]
        E2["PHPUnit Tests<br/>phpunit"]
        E3["pytest Tests<br/>pytest"]
        E4["Playwright Tests<br/>playwright test"]
        E5["Accessibility<br/>Checks"]
    end
    
    subgraph Report["4️⃣ Result Reporting"]
        R1["GitHub Check Status<br/>(Pass/Fail)"]
        R2["Coverage Report<br/>(% lines covered)"]
        R3["Annotations<br/>(Failed test details)"]
    end
    
    PR --> D1
    PR --> D2
    PR --> D3
    PR --> D4
    
    D1 -->|yes| E1
    D2 -->|yes| E2
    D3 -->|yes| E3
    D4 -->|yes| E4
    E4 --> E5
    
    D1 -->|no| D5{"Multiple<br/>frameworks?"}
    D2 -->|no| D5
    D3 -->|no| D5
    D4 -->|no| D5
    
    D5 -->|yes| E1
    D5 -->|yes| E2
    D5 -->|yes| E3
    D5 -->|yes| E4
    
    E1 --> R1
    E2 --> R1
    E3 --> R1
    E4 --> R1
    E5 --> R1
    
    R1 --> R2
    R1 --> R3
    
    R2 -->|≥ threshold| PASS["✅ PR Can Merge"]
    R2 -->|< threshold| FAIL["❌ PR Needs Work"]
    
    R3 --> FAIL
```

---

## 4. Framework Coverage Matrix

This diagram shows which frameworks are supported for different project types.

```mermaid
graph TB
    subgraph Frameworks["Testing Frameworks"]
        J["Jest<br/>JavaScript/TypeScript<br/>Block Plugin Tests"]
        P["PHPUnit<br/>PHP<br/>Plugin & Theme Tests"]
        PY["pytest<br/>Python<br/>Utility & Script Tests"]
        PW["Playwright<br/>Browser E2E<br/>Multi-Framework Tests"]
    end
    
    subgraph Integration["WordPress Integration Patterns"]
        API["REST API<br/>Mocking<br/>@wordpress/api-fetch"]
        GLOBALS["Globals<br/>Mocking<br/>get_option, apply_filters"]
        STATE["Stateful<br/>Testing<br/>Login, create posts"]
        WPCS["WPCS<br/>Validation<br/>Coding standards"]
        CI["CI<br/>Integration<br/>GitHub Actions"]
    end
    
    subgraph Coverage["Coverage Targets"]
        CP["Control-Plane: 75%"]
        BP["Block Plugins: 85%"]
        BT["Block Themes: 80%"]
        OTH["Other Repos: 75%"]
        E2E["E2E: 70%"]
    end
    
    J -.->|uses| API
    J -.->|enables| STATE
    
    P -.->|uses| GLOBALS
    P -.->|validates| WPCS
    P -.->|enables| STATE
    
    PY -.->|integrates| CI
    
    PW -.->|enables| STATE
    PW -.->|supports| API
    PW -.->|validates| E2E
    
    J -->|for| BP
    P -->|for| BP
    P -->|for| BT
    J -->|for| BT
    
    PY -->|for| OTH
    PW -->|for| E2E
```

---

## 5. Jest + WordPress Testing Flow

This diagram shows how Jest tests execute with WordPress mocking.

```mermaid
graph LR
    START["Jest Config<br/>Detected"]
    
    START --> DETECT["Detect Jest<br/>Configuration"]
    DETECT --> MOCK["Setup WordPress<br/>Mocking"]
    
    MOCK --> MOCK1["Mock REST API<br/>(@wordpress/api-fetch)"]
    MOCK --> MOCK2["Setup Block<br/>Utilities"]
    MOCK --> MOCK3["Mock Hooks<br/>(actions/filters)"]
    
    MOCK1 --> RUN["Run Jest<br/>Test Suite"]
    MOCK2 --> RUN
    MOCK3 --> RUN
    
    RUN --> REPORT["Collect Results"]
    
    REPORT --> COV["Coverage Report"]
    REPORT --> FAIL["Failure Analysis"]
    REPORT --> PERF["Performance Metrics"]
    
    COV --> SUCCESS{"≥ 85%?"}
    SUCCESS -->|yes| PASS["✅ Pass"]
    SUCCESS -->|no| FAIL_MSG["❌ Fail"]
    
    FAIL --> ANNO["GitHub<br/>Annotations"]
    FAIL_MSG --> ANNO
```

---

## 6. PHPUnit + WordPress Testing Flow

This diagram shows how PHPUnit tests execute with WordPress and database mocking.

```mermaid
graph LR
    START["PHPUnit Config<br/>Detected"]
    
    START --> DETECT["Detect PHPUnit<br/>Configuration"]
    DETECT --> MOCK["Setup WordPress<br/>Mocking"]
    
    MOCK --> MOCK1["Mock WordPress<br/>Globals"]
    MOCK --> MOCK2["Mock Database<br/>Operations"]
    MOCK --> MOCK3["Mock Plugin<br/>Functions"]
    
    MOCK1 --> RUN["Run PHPUnit<br/>Test Suite"]
    MOCK2 --> RUN
    MOCK3 --> RUN
    
    RUN --> WPCS["Run WordPress<br/>Coding Standards<br/>(WPCS)"]
    
    WPCS --> REPORT["Collect Results"]
    
    REPORT --> COV["Coverage Report"]
    REPORT --> WPCS_CHECK["WPCS Report"]
    REPORT --> MULTI["Multi-Version<br/>Check"]
    
    COV --> SUCCESS{"≥ 85%?"}
    WPCS_CHECK --> STANDARDS{"Compliant?"}
    
    SUCCESS -->|yes| MULTI_CHECK{"All Versions<br/>OK?"}
    Standards -->|yes| MULTI_CHECK
    
    MULTI_CHECK -->|yes| PASS["✅ Pass"]
    MULTI_CHECK -->|no| FAIL["❌ Fail"]
    
    SUCCESS -->|no| FAIL
    STANDARDS -->|no| FAIL
```

---

## 7. pytest + CI Integration Flow

This diagram shows how pytest integrates with GitHub Actions.

```mermaid
graph LR
    START["pytest Config<br/>Detected"]
    
    START --> CI_SETUP["Setup CI<br/>Environment"]
    CI_SETUP --> RUN["Run pytest<br/>Test Suite"]
    
    RUN --> ARTIFACTS["Collect<br/>Artifacts"]
    ARTIFACTS --> LOGS["Test Logs"]
    ARTIFACTS --> COV["Coverage Report"]
    ARTIFACTS --> METRICS["Metrics"]
    
    LOGS --> PARSE["Parse<br/>Results"]
    COV --> PARSE
    METRICS --> PARSE
    
    PARSE --> REPORT["Generate<br/>Report"]
    
    REPORT --> SUCCESS{"All Tests<br/>Passed?"}
    
    Success -->|yes| PASS["✅ Pass"]
    Success -->|no| FAIL["❌ Fail"]
    
    FAIL --> ANNO["GitHub<br/>Annotations"]
```

---

## 8. Playwright + WordPress E2E Testing Flow

This diagram shows how Playwright executes end-to-end tests with WordPress.

```mermaid
graph LR
    START["Playwright Config<br/>Detected"]
    
    START --> BROWSERS["Setup Browsers"]
    BROWSERS --> CHROME["Chrome"]
    BROWSERS --> FIREFOX["Firefox"]
    BROWSERS --> SAFARI["Safari"]
    BROWSERS --> EDGE["Edge"]
    
    CHROME --> SETUP["Setup Test<br/>Environment"]
    FIREFOX --> SETUP
    SAFARI --> SETUP
    EDGE --> SETUP
    
    SETUP --> LOGIN["Login to<br/>WordPress"]
    LOGIN --> TESTS["Run E2E<br/>Tests"]
    
    TESTS --> TEST1["Product<br/>Tests"]
    TESTS --> TEST2["Checkout<br/>Tests"]
    TESTS --> TEST3["Admin<br/>Tests"]
    TESTS --> TEST4["Accessibility<br/>Tests"]
    
    TEST1 --> SCREEN["Collect<br/>Screenshots"]
    TEST2 --> SCREEN
    TEST3 --> SCREEN
    TEST4 --> A11Y_REPORT["A11Y<br/>Report"]
    
    SCREEN --> REPORT["Generate<br/>Report"]
    A11Y_REPORT --> REPORT
    
    REPORT --> SUCCESS{"All Tests<br/>Passed?"}
    
    Success -->|yes| PASS["✅ Pass"]
    Success -->|no| FAIL["❌ Fail"]
```

---

## 9. Multi-Framework Project Support

This diagram shows how projects with multiple frameworks are handled.

```mermaid
graph TB
    subgraph Project["Project with Multiple Frameworks"]
        PJ["Block Plugin Project"]
        PKG["package.json<br/>(Jest)"]
        COMPOSER["composer.json<br/>(PHPUnit)"]
    end
    
    subgraph Detection["Framework Detection"]
        DETECT["Control-Plane<br/>Agent Detects"]
        JEST_CHECK{"Jest?"}
        PHP_CHECK{"PHPUnit?"}
    end
    
    subgraph Execution["Parallel Execution"]
        JEST_RUN["Run Jest Tests"]
        PHP_RUN["Run PHPUnit Tests"]
    end
    
    subgraph Results["Results Aggregation"]
        JEST_RESULT["Jest Results"]
        PHP_RESULT["PHPUnit Results"]
        COMBINED["Combined Results"]
    end
    
    PJ --> DETECT
    PKG -->|detected by| JEST_CHECK
    COMPOSER -->|detected by| PHP_CHECK
    
    JEST_CHECK -->|yes| JEST_RUN
    PHP_CHECK -->|yes| PHP_RUN
    
    JEST_RUN --> JEST_RESULT
    PHP_RUN --> PHP_RESULT
    
    JEST_RESULT --> COMBINED
    PHP_RESULT --> COMBINED
    
    COMBINED --> CHECK{"All Tests<br/>Passed?"}
    
    CHECK -->|yes| PASS["✅ Merge OK"]
    CHECK -->|no| FAIL["❌ Fix Issues"]
```

---

## 10. Provider-Specific Coordination

This diagram shows how the agent works with different AI providers.

```mermaid
graph TB
    subgraph Agents["Control-Plane Agent"]
        COORD["Coordinator"]
    end
    
    subgraph Providers["AI Providers"]
        CLAUDE["Claude Provider<br/>(claude/agent.md)"]
        COPILOT["Copilot Provider<br/>(copilot/agent.md)"]
        OPENAI["OpenAI Provider<br/>(openai/agent.md)"]
    end
    
    subgraph Portable["Portable Agent"]
        TESTING["Testing Agent<br/>(agents/testing-agent/)"]
    end
    
    subgraph Skills["Framework Skills"]
        JEST["Jest Skill"]
        PHP["PHPUnit Skill"]
        PYTEST["pytest Skill"]
        PLAYWRIGHT["Playwright Skill"]
    end
    
    COORD -->|delegates| CLAUDE
    COORD -->|delegates| COPILOT
    COORD -->|delegates| OPENAI
    
    CLAUDE -->|uses| TESTING
    COPILOT -->|uses| TESTING
    OPENAI -->|uses| TESTING
    
    TESTING -->|selects| JEST
    TESTING -->|selects| PHP
    TESTING -->|selects| PYTEST
    TESTING -->|selects| PLAYWRIGHT
```

---

## 11. Coverage Threshold Enforcement

This diagram shows how coverage targets are enforced.

```mermaid
graph TB
    subgraph Tests["Test Execution"]
        RUN["Tests Run"]
        COV_CHECK["Coverage Check"]
    end
    
    subgraph Thresholds["Project-Specific Thresholds"]
        CP_THRESH["Control-Plane: ≥75%"]
        BP_THRESH["Block Plugins: ≥85%"]
        BT_THRESH["Block Themes: ≥80%"]
        OTHER_THRESH["Other Repos: ≥75%"]
        E2E_THRESH["E2E Tests: ≥70%"]
    end
    
    subgraph Decision["Coverage Decision"]
        CHECK{"Coverage<br/>≥ Threshold?"}
    end
    
    subgraph Result["Result"]
        PASS["✅ Merge Allowed"]
        FAIL["❌ Coverage Too Low"]
        ANNOTATION["GitHub<br/>Annotation"]
    end
    
    RUN --> COV_CHECK
    COV_CHECK -->|compares| CP_THRESH
    COV_CHECK -->|compares| BP_THRESH
    COV_CHECK -->|compares| BT_THRESH
    COV_CHECK -->|compares| OTHER_THRESH
    COV_CHECK -->|compares| E2E_THRESH
    
    CP_THRESH --> CHECK
    BP_THRESH --> CHECK
    BT_THRESH --> CHECK
    OTHER_THRESH --> CHECK
    E2E_THRESH --> CHECK
    
    CHECK -->|yes| PASS
    CHECK -->|no| FAIL
    
    FAIL --> ANNOTATION
```

---

## Diagram Usage Guide

### When to Use Each Diagram

| Diagram | Use Case |
|---------|----------|
| **1. 2-Tier Architecture** | Explaining overall system structure |
| **2. Delegation Flow** | Showing how requests flow through the system |
| **3. Test Pipeline** | Explaining complete test execution |
| **4. Coverage Matrix** | Showing framework support matrix |
| **5. Jest Flow** | Deep-dive into Jest testing process |
| **6. PHPUnit Flow** | Deep-dive into PHPUnit testing process |
| **7. pytest Flow** | Deep-dive into pytest testing process |
| **8. Playwright Flow** | Deep-dive into Playwright testing process |
| **9. Multi-Framework** | Explaining multi-framework project support |
| **10. Provider Coordination** | Showing provider-specific workflows |
| **11. Coverage Thresholds** | Explaining coverage enforcement |

---

## Diagram Rendering Notes

All Mermaid diagrams use:

- **Color scheme:** Dark theme friendly with high contrast
- **Layout:** Top-to-bottom or left-to-right for clarity
- **Labels:** Clear, concise descriptions
- **Symbols:** Standard flowchart notation

For best rendering:

- Use in Markdown viewers that support Mermaid (GitHub, GitLab, etc.)
- Zoom in if text is too small
- Copy individual diagrams if needed

---

## Related Documentation

- [README.md](./README.md) — Architecture overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Detailed design
- [PROJECT_PLAN.md](./PROJECT_PLAN.md) — Implementation phases

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
