# Org-wide Issue Types (Aligned)

***Version:*** 1.11 • ***Last updated:*** 17 Oct 2025
---

**Purpose:** Single source of truth for GitHub **Issue Types** across LightSpeed. Field-first: use the **Project Type** field in Projects; labels remain routing/search signals.

## Issue Types

| Type | Emoji | Colour | Description |
| :--- | :---- | :----- | :---------- |
| Epic | 🧭 | `#A371F7` | Outcome-oriented parent that groups work across stories/tasks; defines scope and success measures. |
| Feature | ✨ | `#3FB950` | Net-new capability or significant enhancement; spans design→dev→QA→release. |
| Story | 📘 | `#58A6FF` | Vertical slice that delivers user value; demo-able; acceptance criteria define “done”. |
| Task | 🧩 | `#4393F8` | Small, well-scoped unit of work (typically ≤ 2 days). |
| Bug | 🐞 | `#F85149` | Defect or regression; include repro, expected vs actual, scope of impact, and env. |
| Refactor | 🧹 | `#D29922` | Internal rework/improvement without behaviour change; improves clarity/maintainability. |
| Design | 🎨 | `#DB61A2` | Design artefacts/decisions, tokens, prototypes; hand-off ready for engineering. |
| Documentation | 📚 | `#D4C5F9` | Developer/user docs, READMEs, changelogs, guides. |
| Research | 🔬 | `#9198A1` | Time-boxed investigation/spike to de-risk decision or solution. |
| Performance | ⚡ | `#3FB950` | Improve CWV/runtime/build performance; measurable targets (e.g., LCP, TBT). |
| Accessibility | ♿ | `#A371F7` | Remediate WCAG issues and improve inclusive UX. |
| Test | 🧪 | `#BFD4F2` | Add/extend unit/integration/e2e tests and fixtures. |
| Chore | 🧺 | `#E1E4E8` | Repo hygiene, tooling or ops work that keeps the system healthy. |

### Notes
- Use **one Issue Type** per issue.
- Optional branch mapping for automation: `feat/` → Feature, `fix/` → Bug, `refactor/` → Refactor, `docs/` → Documentation.
