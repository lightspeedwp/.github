# Documentation Cross-Linking Checklist for Maintainers

To keep your `.github/instructions/` and related documentation discoverable, consistent, and future-proof, use this checklist during reviews and before merging PRs that add or change instruction files.

---

## 1. Index Coverage

- [ ] **Every new instruction file** is referenced by at least one index (e.g. `tests.instructions.md`, `agents.instructions.md`, `workflows.instructions.md`, `copilot.instructions.md`).
- [ ] **All indexes** (WordPress, tests, agents, workflows, linting, copilot) reference each other where relevant.

## 2. Back-References

- [ ] Individual instruction files (e.g., `tests-jest.instructions.md`) reference their parent index.
- [ ] Index files reference their most important children (e.g., `tests.instructions.md` links to all `tests-*.instructions.md` files).

## 3. Related Standards

- [ ] Files reference any directly related instructions (e.g., `coding-standards.instructions.md` links to `linting`, `footer-header-style`, `markdown-style-guide`).
- [ ] Style and footer/header guides are cross-linked in Markdown/content-heavy instructions.

## 4. Agent & Workflow Cross-Linking

- [ ] Agent spec files (`agent-*.agent.md`) reference the workflows and indexes that use them.
- [ ] Workflow instruction files reference the agent spec files powering them.

## 5. Template & Example References

- [ ] Where templates exist (e.g., `.github/COPILOT_TEMPLATE/`), instructions reference these as examples in their frontmatter.

## 6. Frontmatter Validation

- [ ] All instruction files contain required fields (`file_type`, `title`, `description`, `version`, `last_updated`, `owners`, `status`, `references`).
- [ ] The `references` array contains **real, repo-relative links** (not placeholders).

## 7. Docs & Custom Instructions

- [ ] Any org-wide custom instructions or Copilot-specific files (`custom-instructions.md`, `copilot.instructions.md`) are referenced in all relevant indexes and contributor guides.

## 8. README/Contributor Guide

- [ ] The main `README.md` (or contributor onboarding docs) explains the documentation architecture, cross-linking philosophy, and where to find each index or template.

---

**Tip:**  
Use this checklist as a PR review template or automate with a docs linter!