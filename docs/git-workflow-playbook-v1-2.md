# **GitHub Workflow Playbook**

***Version:*** 1.2 *— **Last updated:** 9 Oct 2025* 

---

[0\) Purpose](#0\)-purpose)

[1\) Principles](#1\)-principles)

[2\) Branching model](#2\)-branching-model)

[3\) Local dev → PR flow](#3\)-local-dev-→-pr-flow)

[4\) Pull Request standards](#4\)-pull-request-standards)

[5\) Testing & quality gates (CI)](#5\)-testing-&-quality-gates-\(ci\))

[6\) Releases & environments](#6\)-releases-&-environments)

[7\) Repo hygiene & automation](#7\)-repo-hygiene-&-automation)

[7A) AI‑assisted contributor workflow (Copilot \+ CodeRabbit \+ Playwright)](#7a\)-ai‑assisted-contributor-workflow-\(copilot-+-coderabbit-+-playwright\))

[8\) Intern quick‑start (PRs the LightSpeed way)](#8\)-intern-quick‑start-\(prs-the-lightspeed-way\))

[9\) Default community health files (org‑wide)](#9\)-default-community-health-files-\(org‑wide\))

[A) CONTRIBUTING.md (ideal description & structure)](#a\)-contributing.md-\(ideal-description-&-structure\))

[B) CODE\_OF\_CONDUCT.md (ideal description & structure)](#b\)-code_of_conduct.md-\(ideal-description-&-structure\))

[10\) Example PR template (.github/pull\_request\_template.md)](#10\)-example-pr-template-\(.github/pull_request_template.md\))

[11\) Example CODEOWNERS](#11\)-example-codeowners)

[12\) Intern FAQ (rapid answers)](#12\)-intern-faq-\(rapid-answers\))

[13\) References & further reading](#13\)-references-&-further-reading)

[14\) Adoption checklist (for each repo)](#14\)-adoption-checklist-\(for-each-repo\))

[15\) Version history](#15\)-version-history)

---

## **0\) Purpose** {#0)-purpose}

A clear, repeatable GitHub workflow keeps work flowing, reduces risk, and shortens release cycles. This playbook standardises how we branch, commit, review, test, and release across all LightSpeed repos (themes, plugins, client sites, and internal tools). It is written for teammates and interns alike.

---

## **1\) Principles** {#1)-principles}

* **Trunk is sacred**: `main` is always deployable. Everything lands via Pull Request (PR).

* **Small, frequent, testable**: Prefer narrowly scoped, short‑lived branches.

* **Automate the boring stuff**: CI runs linting, tests, builds, and security checks on every PR.

* **Conversation before integration**: PRs exist to discuss, improve, and learn.

* **Docs as part of the work**: Update READMEs / changelogs / site docs in the same PR.

---

## **2\) Branching model** {#2)-branching-model}

**Default model**: Trunk‑based (GitHub Flow) with short‑lived feature branches. **Optionally add** a long‑lived `develop` branch for GitFlow‑style release staging on projects that need scheduled releases or parallel hardening.

**Branches**

* `main` → protected; auto‑deploys to **staging**; manual approval to **production**.

* `develop` (when enabled) → integration branch; features merge here; cut `release/x.y` from here.

* `release/x.y` (optional for larger milestones) → stabilisation; only fixes.

* `hotfix/<slug>` → cut from `main` for emergency production fixes.

* Feature branches: `{type}/{scope}-{short-title}`

  * Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`

  * Examples: `feat/cart-coupon-flow`, `fix/wp6-6-compat`, `chore/deps-2025-09`

  * **Tip**: include the Asana task id if available, e.g. `feat/as-123-checkout-upsell`.

**Conventions**

* Use **Conventional Commits** in messages: `feat:`, `fix:`, `docs:`, etc.

* Keep branches under \~5 working days. If bigger, split into vertical slices and integrate behind a **feature flag**.

**Project policy**

* Each repo must explicitly choose **GitHub Flow** (no `develop`) or **GitFlow‑lite** (with `develop`).

* **Tour Operator (OSS)**: uses `develop` for integration and `release/x.y.z` for hardening.

---

## **3\) Local dev → PR flow** {#3)-local-dev-→-pr-flow}

1. **Sync**: `git switch main && git pull --ff-only`.

2. **Branch**: `git switch -c feat/<scope>-<title>`.

3. **Code**: commit early/often with clear messages; include tests; run `lint` and `test` locally.

4. **Push & draft**: push and open a **Draft PR** once the shape is clear (even if WIP).

5. **Make it green**: CI must pass (lint, unit/integration tests, build).

6. **Ready for review**: convert to **Ready** and request reviewers (CODEOWNERS auto‑assigns).

7. **Address feedback**: push follow‑ups; keep PR description up to date; re‑request review if needed.

8. **Merge**: **Squash & merge** by default. Ensure the squash title follows Conventional Commit and the body includes a crisp changelog entry.

9. **Cleanup**: delete the branch. If user‑visible, add release notes.

---

## **4\) Pull Request standards** {#4)-pull-request-standards}

**Titles** (Conventional Commit \+ context)

* Good: `feat(cart): add coupon code field to mini‑cart`

* Good: `fix(assets): prevent double‑enqueue of block CSS on classic theme`

**PR body template (use this format)**

* **Summary**: what & why (1–3 sentences).

* **Context/Issue**: link Asana task / issue.

* **Changes**: bullets of key changes.

* **Screenshots/recordings**: before/after, responsive, a11y view.

* **Testing notes**: how to verify locally; edge cases.

* **Risks & roll‑back**: risk level (Low/Med/High), mitigation, revert plan.

* **Docs/Changelog**: updated? (Yes/No — link)

* **Checklist**: see below.

**PR checklist** (paste into every PR)

* CI green (lint, tests, build)

* Security: no secrets; dependency diffs reviewed; sanitise/escape output (WP)

* Performance: avoids N+1 queries; no heavy loops in templates

* Accessibility: semantic HTML; focus order; colour contrast; labels; keyboard

* i18n: strings wrapped in translation functions; text domain correct

* Docs: README/CHANGELOG updated; screenshots refreshed

* Rollback: simple revert or feature flag present

**Review rules**

* 1 approval for Low‑risk; **2 approvals** for core libs, schema changes, or public APIs.

* No self‑merge unless emergency hotfix approved by Tech Lead.

* Keep comments kind, specific, and actionable; prefer suggestions.

* If you “Request changes”, include **what** and **why** and (ideally) a code suggestion.

**Merge strategy**

* Default **Squash & merge** → clean linear history; PR body becomes one commit.

* Use **Merge commit** only for release branch merges. Avoid **Rebase & merge** on shared branches.

---

## **5\) Testing & quality gates (CI)** {#5)-testing-&-quality-gates-(ci)}

Run on every PR:

* **Static**: ESLint, Prettier check; PHPCS (WordPress‑Extra \+ project rules); PHPStan (level agreed per repo).

* **Unit**: PHPUnit (plugins), Jest/ Vitest (JS UI),

* **Integration / e2e**: Playwright or Cypress for critical flows.

* **Build**: npm build; enqueue outputs; ensure artefacts are ignored in git if built in CI.

* **Security**: Dependabot, `npm audit` (allowlist low‑risk dev‑deps), CodeQL/code scanning.

* **Packaging checks**: composer.json, readme.txt, version headers; `theme.json` / `block.json` validity (for WP block work).

* **AI‑assisted tests (optional)**: allow AI to **propose** tests (e.g., Copilot/CodeRabbit unit tests; Playwright MCP‑generated e2e), but human reviewers must approve and CI must pass.

*Fail fast, fix fast. PRs shouldn’t be reviewable until the lights are green.*

---

## **6\) Releases & environments** {#6)-releases-&-environments}

* **Versioning**: SemVer. Bump in code and changelog.

* **Tags**: `vX.Y.Z`. Auto‑create GitHub Release with notes (Release Drafter or action).

* **Deploys**: `main` → staging auto; require one manual gate to production. Rollbacks via previous tag.

* **Hotfix**: branch from `main` → PR (priority review) → tag `vX.Y.Z+hotfix1` → back‑merge to `main`/`release`.

---

## **7\) Repo hygiene & automation** {#7)-repo-hygiene-&-automation}

* **Branch protection**: require status checks to pass; up‑to‑date with base; linear history; signed commits optional.

* **CODEOWNERS**: auto‑assign reviewers by path (e.g. `/plugins/tour-operator/ @lightspeedwp/plugin-core`).

* **Templates**: Issue templates (bug, feature, docs) \+ PR template below.

* **Labels** (examples): `type:feat|fix|docs|refactor|chore`, `size:XS|S|M|L|XL`, `risk:low|med|high`, `area:plugin|theme|infra|docs`.

* **Bots**: Dependabot (weekly), Release Drafter, `danger` for PR size and required sections.

## **7A) AI‑assisted contributor workflow (Copilot \+ CodeRabbit \+ Playwright)** {#7a)-ai‑assisted-contributor-workflow-(copilot-+-coderabbit-+-playwright)}

**Goal**: use AI to speed planning, coding, and reviews — **without** weakening our standards.

**A) Plan issues & project work**

* Use **GitHub Copilot** to draft issue bodies and acceptance criteria from our templates.

* Add **repository custom instructions** and **prompt files** (in `.github/`) so Copilot follows our coding standards, test strategy, and PR format.

* Use **GitHub Projects** for planning; summarise progress with Copilot as needed.

**B) Implement changes in IDE**

* Use **Copilot code suggestions** and **Chat / Inline Chat** to scaffold functions, refactors, and tests.

* When appropriate, use **agent mode / coding agent** to automate multi‑file edits or open a PR for a well‑bounded task (still reviewed by humans).

**C) Author PRs faster**

* Generate PR descriptions and summaries with **Copilot** (then edit for accuracy).

* Link issues; keep the PR template sections complete.

**D) Review with AI \+ humans**

* Enable **Copilot Code Review** as an auto‑reviewer; configure automatic reviews on PR open/update.

* Add **CodeRabbit** to run AI reviews, summaries, and **Pre‑merge Checks**; keep a human reviewer accountable for the final approval.

* Useful CodeRabbit actions in PR comments: `@coderabbitai generate docstrings`, `@coderabbitai generate unit tests`, `@coderabbitai improve` (examples; see docs per repo config).

**E) Tests with AI assistance**

* Let CodeRabbit/Copilot propose unit tests;

* Use **Playwright MCP** to generate or refine e2e tests when helpful; commit them like any other change.

**Guardrails**

* No secrets or customer data in prompts.

* Treat AI suggestions as proposals: run locally, write/verify tests, and keep commits small.

* Respect licenses; never paste verbatim third‑party code without attribution/review.

---

## **8\) Intern quick‑start (PRs the LightSpeed way)** {#8)-intern-quick‑start-(prs-the-lightspeed-way)}

1. Create a branch: `feat/<scope>-<short-title>`.

2. Commit often with clear, present‑tense messages.

3. Open a **Draft PR** early.

4. Fill in the template fully; add screenshots.

5. Keep commits/PR small; aim \< \~300 lines changed.

6. Make CI green yourself before asking for review.

7. Request reviewers; be responsive to feedback.

8. Squash & merge, then delete the branch.

9. Confirm staging deploy; smoke‑test.

10. Update Asana and any user‑facing docs.

---

## **9\) Default community health files (org‑wide)** {#9)-default-community-health-files-(org‑wide)}

Place these in `lightspeedwp/.github` (public) so they apply to all repos without their own overrides.

### **A) CONTRIBUTING.md (ideal description & structure)** {#a)-contributing.md-(ideal-description-&-structure)}

**Purpose**: Explain *how to contribute* (issues, discussions, branches, commits, PRs, reviews, releases), what standards we follow, and how to get help.

**Recommended outline**

1. **Welcome** — scope of contributions (code, docs, design, testing).

2. **Before you start** — search issues, propose via discussion, confirm scope.

3. **Local setup** — prerequisites, quick start, commands (`install`, `lint`, `test`, `build`).

4. **Branching & commits** — naming, Conventional Commits, small PRs.

5. **Pull requests** — template, screenshots, tests, accessibility notes, changelog.

6. **Code style & quality** — ESLint/Prettier rules, PHPCS standard, PHPStan level, i18n, a11y.

7. **Security** — how to report vulnerabilities (private email), secrets policy.

8. **Review process** — SLAs, approvals required, how to respond to feedback.

9. **Releases** — versioning, tagging, changelog, deployment.

10. **License** — how contributions are licensed.

11. **Contact** — maintainer email/Slack channel.

**Starter content (drop‑in)**

\# Contributing to LightSpeed projects  
Thanks for taking the time to contribute\! This guide explains how to propose changes and get them merged.

\#\# Ground rules  
\- Keep PRs small, focused, and testable. Open a Draft PR early.  
\- Use branch names like \`feat/\<scope\>-\<title\>\` and Conventional Commit messages.  
\- All changes land via PR with passing CI (lint, tests, build, security checks).  
\- Update docs and changelog as part of the PR.

\#\# How to contribute  
1\. \*\*Discuss\*\*: Search existing issues/PRs. If unsure, open a brief proposal.  
2\. \*\*Branch\*\*: \`git switch \-c feat/\<scope\>-\<title\>\`.  
3\. \*\*Code & test\*\*: run \`npm run lint && npm test\` (or repo equivalents) locally.  
4\. \*\*PR\*\*: Fill in the PR template fully; include screenshots and testing notes.  
5\. \*\*Review\*\*: Address feedback. We squash‑merge by default.

\#\# Style & quality  
\- JS/TS: ESLint \+ Prettier; PHP: PHPCS (WordPress‑Extra) \+ PHPStan.  
\- Accessibility: semantic HTML, labels, focus, colour contrast.  
\- i18n: wrap strings and set correct text domain.

\#\# Security  
Please report vulnerabilities privately to \*\*security@lightspeedwp.agency\*\* (or use the repo’s Security tab). Do not open public issues for security reports.

\#\# License  
Unless stated otherwise, contributions are licensed under the repository’s LICENSE.

\#\# Contact  
Maintainers: @ashley and team — email \*\*dev@lightspeedwp.agency\*\*.

### **B) CODE\_OF\_CONDUCT.md (ideal description & structure)** {#b)-code_of_conduct.md-(ideal-description-&-structure)}

**Purpose**: Define behaviour standards and reporting channels to keep our community safe, inclusive, and harassment‑free.

**Recommendation**: Adopt **Contributor Covenant v2.1** verbatim with LightSpeed‑specific contact details. This is the industry standard and is recognised by GitHub.

**Starter content (short form with external reference)**

\# Code of Conduct  
We follow the \[Contributor Covenant v2.1\](https://www.contributor-covenant.org/version/2/1/code\_of\_conduct/) for all LightSpeed projects.

Instances of abusive, harassing, or otherwise unacceptable behaviour may be reported to \*\*conduct@lightspeedwp.agency\*\* (or your project’s listed maintainer). All reports will be reviewed and investigated promptly and fairly.

By participating, you agree to uphold these standards of respectful, collaborative behaviour.

*Why link instead of copy?* Linking avoids divergence from the canonical text and simplifies updates. If you prefer a single‑file policy, paste the v2.1 text verbatim and replace the enforcement contacts accordingly.

---

## **10\) Example PR template (`.github/pull_request_template.md`)** {#10)-example-pr-template-(.github/pull_request_template.md)}

\#\# Summary  
(What \+ why in 1–3 sentences)

\#\# Context  
\- Asana: \<link\>  
\- Issue: \#

\#\# Changes  
\-  
\-

\#\# Screenshots / Recordings  
\- Before:  
\- After:

\#\# Testing notes  
1\. Steps to reproduce  
2\. Edge cases  
3\. Browser/Device matrix (if UI)

\#\# Risks & Rollback  
\- Risk: Low/Medium/High  
\- Rollback plan:

\#\# AI assistance  
\- \[ \] PR description drafted with Copilot (reviewed/edited)  
\- \[ \] CodeRabbit/Copilot tests added or updated  
\- \[ \] Prompt file / custom instructions used: \<path or N/A\>

\#\# Checklist  
\- \[ \] CI green (lint, tests, build)  
\- \[ \] a11y reviewed  
\- \[ \] i18n strings updated  
\- \[ \] Docs & changelog updated

---

## **11\) Example CODEOWNERS** {#11)-example-codeowners}

\# Plugins  
/plugins/tour-operator/ @lightspeedwp/plugin-core  
/plugins/wetu-importer/ @lightspeedwp/integrations

\# Themes  
/themes/lsx-design/ @lightspeedwp/theme-team

\# Workflows & infra  
/.github/ @lightspeedwp/maintainers

---

## **12\) Intern FAQ (rapid answers)** {#12)-intern-faq-(rapid-answers)}

* **When do I open a PR?** As soon as the branch direction is clear — open a **Draft PR**.

* **How big is too big?** Aim for \<300 LOC changed and \<6 files if possible.

* **Do I rebase?** Keep your branch up to date; avoid force‑pushes after reviews start unless you coordinate.

* **Can I merge my own PR?** Only if it’s a hotfix approved by a lead and the rules allow it.

* **What if CI fails?** Fix it locally; don’t assign reviewers until it’s green.

---

## **13\) References & further reading** {#13)-references-&-further-reading}

* Atlassian — Why Git: [https://www.atlassian.com/git/tutorials/why-git](https://www.atlassian.com/git/tutorials/why-git)

* Atlassian — Making a Pull Request: [https://www.atlassian.com/git/tutorials/making-a-pull-request](https://www.atlassian.com/git/tutorials/making-a-pull-request)

* Atlassian — Agile workflows: [https://www.atlassian.com/agile/project-management/workflow](https://www.atlassian.com/agile/project-management/workflow)

* GitHub Docs — Default community health files: [https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)

* GitHub Docs — Contributor guidelines: [https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors)

* Example guidelines — Rails: [https://github.com/rails/rails/blob/main/CONTRIBUTING.md](https://github.com/rails/rails/blob/main/CONTRIBUTING.md)

* Example guidelines — OpenGovernment: [https://github.com/opengovernment/opengovernment/blob/master/CONTRIBUTING.md](https://github.com/opengovernment/opengovernment/blob/master/CONTRIBUTING.md)

* GitHub/docs examples — README: [https://github.com/github/docs/blob/main/README.md](https://github.com/github/docs/blob/main/README.md)

* GitHub/docs examples — CONTRIBUTING: [https://github.com/github/docs/blob/main/.github/CONTRIBUTING.md](https://github.com/github/docs/blob/main/.github/CONTRIBUTING.md)

* GitHub/docs examples — Code of Conduct: [https://github.com/github/docs/blob/main/.github/CODE\_OF\_CONDUCT.md](https://github.com/github/docs/blob/main/.github/CODE_OF_CONDUCT.md)

* GitHub/docs — .github/config.yml: [https://github.com/github/docs/blob/main/.github/config.yml](https://github.com/github/docs/blob/main/.github/config.yml)

**AI & automation**

* GitHub Copilot — write PR descriptions: [https://docs.github.com/en/copilot/how-tos/get-code-suggestions/write-pr-descriptions](https://docs.github.com/en/copilot/how-tos/get-code-suggestions/write-pr-descriptions)

* Copilot Chat in IDE: [https://docs.github.com/copilot/using-github-copilot/copilot-chat](https://docs.github.com/copilot/using-github-copilot/copilot-chat)

* Copilot code review (request & auto‑review): [https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review)

* Configure automatic Copilot reviews: [https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/configure-automatic-review](https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/configure-automatic-review)

* VS Code — Copilot overview & AI suggestions: [https://code.visualstudio.com/docs/copilot/overview](https://code.visualstudio.com/docs/copilot/overview) | [https://code.visualstudio.com/docs/copilot/ai-powered-suggestions](https://code.visualstudio.com/docs/copilot/ai-powered-suggestions)

* VS Code — Prompt crafting: [https://code.visualstudio.com/docs/copilot/chat/prompt-crafting](https://code.visualstudio.com/docs/copilot/chat/prompt-crafting)

* VS Code — Custom instructions & prompt files: [https://code.visualstudio.com/docs/copilot/customization/custom-instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) | [https://code.visualstudio.com/docs/copilot/customization/prompt-files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)

* VS Code — MCP servers (tools): [https://code.visualstudio.com/docs/copilot/customization/mcp-servers](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)

* Copilot response customization: [https://docs.github.com/en/copilot/concepts/response-customization](https://docs.github.com/en/copilot/concepts/response-customization)

* Copilot coding agent (concept): [https://docs.github.com/en/copilot/concepts/coding-agent/coding-agent](https://docs.github.com/en/copilot/concepts/coding-agent/coding-agent)

* CodeRabbit — intro & quickstart: [https://docs.coderabbit.ai/overview/introduction](https://docs.coderabbit.ai/overview/introduction) | [https://docs.coderabbit.ai/getting-started/quickstart](https://docs.coderabbit.ai/getting-started/quickstart)

* CodeRabbit — commands & improvements: [https://docs.coderabbit.ai/guides/commands](https://docs.coderabbit.ai/guides/commands) | [https://docs.coderabbit.ai/guides/generate-improvements](https://docs.coderabbit.ai/guides/generate-improvements)

* CodeRabbit — pre‑merge checks & config: [https://docs.coderabbit.ai/pr-reviews/pre-merge-checks](https://docs.coderabbit.ai/pr-reviews/pre-merge-checks) | [https://docs.coderabbit.ai/reference/configuration](https://docs.coderabbit.ai/reference/configuration)

* CodeRabbit — docstrings & test generation: [https://docs.coderabbit.ai/finishing-touches/docstrings](https://docs.coderabbit.ai/finishing-touches/docstrings) | [https://docs.coderabbit.ai/finishing-touches/unit-test-generation](https://docs.coderabbit.ai/finishing-touches/unit-test-generation)

* Playwright — intro, CI, and MCP test generation: [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro) | [https://playwright.dev/docs/ci-intro](https://playwright.dev/docs/ci-intro) | [https://playwright.dev/agents/playwright-mcp-generating-tests](https://playwright.dev/agents/playwright-mcp-generating-tests)

---

## **14\) Adoption checklist (for each repo)** {#14)-adoption-checklist-(for-each-repo)}

* Protect `main` with required checks, approvals, and linear history.

* Choose branching mode: **GitHub Flow** (no `develop`) or **GitFlow‑lite** (with `develop`). Document it in README.

* Add CODEOWNERS and PR/issue templates.

* Enable Dependabot (security \+ updates) and CodeQL.

* Configure CI (lint, tests, build, package checks) on PRs.

* Decide deploy gates: staging auto vs prod manual.

* Add Release Drafter and CHANGELOG policy.

* Publish CONTRIBUTING.md and CODE\_OF\_CONDUCT.md.

* **AI setup**: enable Copilot Chat; add `.github/copilot-instructions.md` \+ prompt files; configure **Copilot Code Review** (auto on PR open/update).

* **CodeRabbit**: install app; add `.coderabbit.yaml`; enable **Pre‑merge Checks**; document allowed commands in CONTRIBUTING.

* **Playwright**: ensure e2e in CI; optionally add Playwright MCP server to dev docs for AI‑assisted test authoring.

*Questions or improvements? Open an issue in the **lightspeedwp/.github** repo with the label `playbook`.*

---

## **15\) Version history** {#15)-version-history}

* **v1.2 (7 October 2025\)** — Add ToC.

* **v1.1 (16 September 2025\)** — Polished language; fixed duplicated PR template; added AI-assisted workflow & guardrails; clarified `main` vs `develop` (Tour Operator uses `develop`); expanded references; tightened adoption checklist; minor typo fixes.

* **v1.0 (16 September 2025\)** — Initial baseline: branching model, PR standards, CI gates, releases, automation, examples.

