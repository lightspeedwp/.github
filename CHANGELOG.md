---
title: "Changelog"
description: "All notable changes to this project, formatted per Keep a Changelog 1.1.0 and Semantic Versioning"
file_type: "documentation"
created_date: "2025-09-20"
last_updated: "2026-06-07"
owners:
  - LightSpeed Team
tags:
  - changelog
  - release
  - documentation
status: active
stability: stable
domain: governance
language: en
---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **Awesome GitHub Site Phase 14: Full light/dark token audit** — Final systematic audit of every CSS colour value in the Awesome GitHub site against `AWESOME_GITHUB_THEME_TOKENS_SPEC.md`. All deviations fixed across 7 files. Hero sections on catalogue, tools, learn, and lesson pages now use `var(--bg)` + `var(--fg-1)` instead of hardcoded dark gradients. `.ag-action-btn--primary` changed from `var(--accent)` to `var(--c-brand-blue)` (spec mandates btn-primary never uses `--accent`). Status/type badges converted from `rgba()` hardcodes to `color-mix(in srgb, var(--c-status-*) …, transparent)`. Progress bar tracks now use `var(--panel-2)` + `var(--hair)` per §3.6 spec. `SearchPalette` hover states refactored to new `--overlay-hover` token (eliminates dark-mode overrides). Fixed `.lesson-h1` white-on-white visibility bug in light mode. WCAG AA contrast corrected: `.ag-status-active` and `.tb-script` switched from `--c-status-success-2` (#22C55E, ~2.3:1) to `--c-status-success` (#16A34A, ≥4.5:1). Added `--c-type-pack` and `--c-type-schema` palette tokens; added `--overlay-hover` surface token. `npm run build` exits 0 at 333 pages. ([#891](https://github.com/lightspeedwp/.github/issues/891), [#892](https://github.com/lightspeedwp/.github/pull/892))

- **Awesome GitHub Site Phase 12: Editorial pages missing header/footer** — All 7 Phase 12 editorial pages (`getting-started`, `why`, `onboarding`, `references`, `glossary/index`, `glossary/[term]`, `404`) were using `BaseLayout` (an HTML-only scaffold with no nav or footer). Switched all to `AwesomeGithubLayout` which provides `<Header />`, `<AwesomeGithubFooter />`, skip-to-content link, and theme initialisation. Removed now-redundant inner `<main>` wrappers. Fixed hardcoded hex colours in `getting-started.astro` `.run-pill`. ([#887](https://github.com/lightspeedwp/.github/issues/887), [#888](https://github.com/lightspeedwp/.github/pull/888))

### Added

- **Awesome GitHub Site Phase 06: Wapuu mascot system** — Added a reusable `WapuuHero` Astro component with a canonical page-type mapping, copied the three confirmed Wapuu assets into `website/public/assets/wapuus/`, and wired the learn, cookbook, tools, and catalogue hero sections to render the correct mascot with responsive hiding at ≤860px and decorative accessibility attributes. ([#864](https://github.com/lightspeedwp/.github/issues/864))
- **Awesome GitHub Site Phase 07: Catalogue list pages with filter bar and Wapuu hero** — Replaced the old catalogue index with a spec-aligned `/c/[cat]` route, added the shared Wapuu hero component, introduced tag-chip filtering with AND logic, and surfaced the category type note and install-action cards for all eight catalogue pages. ([#866](https://github.com/lightspeedwp/.github/issues/866), [#867](https://github.com/lightspeedwp/.github/pull/867))
- **Awesome GitHub Site Phase 05: Homepage all 5 blocks wired to live data** — Rebuilt the homepage with the spec-aligned hero, live catalogue counts, feature strip, and Cook+Learn cards. Added the typed catalogue exports used by the homepage counts, copied the Wapuu assets into `website/public/assets/wapuus/`, and added an `onboarding/` alias that redirects to `getting-started/` for the primary CTA. ([#861](https://github.com/lightspeedwp/.github/issues/861), [#862](https://github.com/lightspeedwp/.github/pull/862))

- **Awesome GitHub Site Phase 13: Search command palette** — Site-wide ⌘K search palette (`website/src/components/SearchPalette.astro` + `website/src/scripts/search.js`) added to `AwesomeGithubLayout`. Build-time JSON index of all catalogue items serialised into a `data-items` attribute. Empty query shows 7 Popular items; typed query uses multi-word AND substring matching across name, description, tags, and category (capped at 12 results). Keyboard navigation (↑↓ arrow keys, Enter to open result, Escape to close, Tab focus-trap between input, close button, and result items). Fully accessible: `role="dialog"`, `aria-modal`, `aria-selected`, focus returns to trigger on dismiss. ([#764](https://github.com/lightspeedwp/.github/issues/764), [#889](https://github.com/lightspeedwp/.github/pull/889))

- **Awesome GitHub Site Phase 11: Tools page + Phosphor Icons sitewide** — Standalone `/c/tools.astro` with astropuu Wapuu hero, section nav pills (AI Defaults, Scripts, Schemas, Config & Setup), and a build-time Phosphor icon loader (`website/src/lib/phosphor.ts`) using `createRequire` for robust package resolution. Updated `Icon.astro` with `ph:` prefix routing to load any Phosphor icon at SSG time. Migrated item card and type badge styles into `global.css` for reuse across catalogue and tools pages. Updated all category, nav, learn, and home icons to Phosphor equivalents sitewide. ([#885](https://github.com/lightspeedwp/.github/issues/885), [#886](https://github.com/lightspeedwp/.github/pull/886))

- **Awesome GitHub Site Phase 02: CSS Token Layer + Global Styles** — Established the complete CSS foundation for the Awesome GitHub site. Added `website/src/styles/site-tokens.css` with app-specific surface tokens (`--panel`, `--panel-2`, `--hair`), font stacks, radius/shadow/transition scales, and `color-scheme` declarations for both light and dark themes. Added `website/src/styles/global.css` with container system (`.wrap` 1320px, `.wrap-prose` 820px), section rhythm via `clamp()`, button system (`.btn-primary`, `.btn-ghost`, `.btn-soft`, `.icon-btn`) with `:focus-visible` rings and browser-compat fallbacks, breadcrumb, kbd chip, burger breakpoints, `.md` prose styles, and scroll-motion accessibility guard. Fixed `BaseLayout.astro` CSS import order and corrected `localStorage` theme key to `ag-theme`. ([#852](https://github.com/lightspeedwp/.github/issues/852), [#853](https://github.com/lightspeedwp/.github/pull/853))

- **Awesome GitHub Site: UI Redesign — Dark Mode, Navigation & Responsive Layout** — Complete navigation and UI overhaul. Added desktop Browse mega-dropdown with 4-column category grid (hover/click open, keyboard Escape dismiss, focus-out close). Added full-height mobile drawer sliding from right with backdrop overlay, scroll-lock, and `inert` guard. Fixed dark-mode nav header (was showing light background). Added fluid responsive CSS tokens for spacing and font sizes across breakpoints. Improved accessibility: Disclosure pattern (`aria-expanded`/`aria-controls`, no `role="menu"`), `aria-pressed` on theme toggle buttons, `inert` on closed drawer, nav z-index raised above drawer so hamburger stays accessible. ([#847](https://github.com/lightspeedwp/.github/issues/847), [#845](https://github.com/lightspeedwp/.github/pull/845))
- **Awesome GitHub Site: Phosphor Icon System** — Replaced all emoji icons (🤖 📖 💬 ✨ 🛡️ ⚙️ 🧩 🔧 🗺️ ✅ 📚 🍳 ☀️ 🌙) with Phosphor SVG icons via a new `Icon.astro` component that reads from `@phosphor-icons/core` at build time — zero runtime JS. Covers catalogue type icons, learning track icons, getting-started cards, cookbook placeholder, and theme toggle buttons. ([#844](https://github.com/lightspeedwp/.github/issues/844), [#843](https://github.com/lightspeedwp/.github/pull/843))

### Fixed

- **Issue-Field Write Boundary Verification Docs (`#879`)** — Clarified the live project-meta-sync write boundary, documented that `Status`/`Priority`/`Type` are label-mapped while `Effort` and `Start date` are derived from canonical defaults/runtime context, and added a dedicated verification audit record for private-project issue-field support decisions. ([#884](https://github.com/lightspeedwp/.github/pull/884))

- **Awesome GitHub Site: Mobile Nav Menu** — Fixed `z-index` on the fixed-position mobile menu so it renders above page content; added body scroll-lock (`overflow: hidden`) while the menu is open to prevent background scroll. ([#844](https://github.com/lightspeedwp/.github/issues/844), [#843](https://github.com/lightspeedwp/.github/pull/843))
- **Awesome GitHub Site: Phase 01 Scaffold Merge Hardening (`#851`)** — Finalised the Phase 01 scaffold branch for merge by replacing stale `/talk/*` links with valid `/wceu-2026/slides/*` routes on agent pages and aligning key CI workflows to Node `22.22.1` so Astro 6/lint-staged engine checks pass in PR validation.

---

- **Awesome GitHub Site: Complete Astro Rebuild** — Rebuilt the Awesome GitHub site from a React/Babel prototype into a production-ready Astro 5 static site. Includes: a fully-typed TypeScript data layer (`catalogue.ts`, `learn.ts`, `glossary.ts`) porting 110+ catalogue items across 8 categories; Svelte `SearchPalette` component with Cmd/Ctrl+K activation; 252 statically-generated pages (catalogue, learn tracks, glossary, cookbook, getting-started, why); detail pages with Install-in-VS-Code, copy-URL, copy-file, and View-on-GitHub action buttons; mobile hamburger navigation with animated X icon and keyboard Escape support; expanded footer with brand and navigation columns; and a `why.astro` editorial page. ([#841](https://github.com/lightspeedwp/.github/pull/841), [#842](https://github.com/lightspeedwp/.github/issues/842))

- **LightSpeedWP Agency Homepage: Complete Component System** — Built a production-ready homepage for the LightSpeedWP Agency website with 9 modular Astro components (Nav, HeroPlanner, TrustStrip, SolutionPaths, WhyLightSpeed, FAQ, FinalCTA, Footer, ContactOverlay). Features include sticky navigation with scroll detection, mobile drawer with theme toggle, AI project planner with form validation, responsive stats grid, 4 solution path cards with highlighting, single-open accordion FAQ with 7 questions, contact modal with success state, and comprehensive design system with light/dark mode support across 9 responsive breakpoints. All components include WCAG 2.2 AA accessibility attributes, semantic HTML5, and CSS variable theming for consistent branding.
- **Awesome GitHub Navigation Redesign: Mega Menu & Accessibility Enhancements** — Redesigned header navigation with single "Browse" mega menu organizing 22 resources across 4 logical sections (Catalogues, More, Cook & Learn, Resources). Implemented comprehensive accessibility improvements including keyboard navigation (Tab+Enter/Space activation), proper ARIA attributes, semantic button elements replacing non-focusable anchors, centered menu positioning to prevent viewport clipping at 1025-1180px widths, and fixed drawer overflow for smooth scrolling. All changes comply with WCAG 2.2 AA+ contrast ratios in both light and dark modes.
- **Awesome GitHub Site Phase 2a: Three-Pillar Governance Framework** — Integrated PR #809's three-pillar design approach on top of Phase 2a's dynamic foundation by adding comprehensive CSS styling for the pillar section (`.pillar-grid`, `.pillar`, `.pillar-links`). Features 3-column responsive grid layout with hover effects, accent color styling, light/dark theme variants, and mobile collapse to single column. Completes visual integration of Automation, Governance, and AI Integration framework while preserving dynamic catalogue loading and conference messaging.
- **Awesome GitHub Site Phase 2a: Homepage & Navigation Redesign** — Initiated Phase 2a execution by restructuring header navigation to support Phase 2 catalogues, redesigning homepage with "One .GitHub to Rule Them All" positioning, and establishing foundation for Phase 2b–2c expansion:
  - Reorganized nav sections (Conference → Catalogues → About) with dedicated catalogue dropdown showing all 8 Phase 2 resources (agents, instructions, skills, hooks, plugins, workflows, tools, learning-hub).
  - Redesigned homepage hero and value proposition to position site as unified discovery platform for AI operations ecosystem.
  - Added 8-catalogue card grid with direct links to Phase 2 resources on homepage.
  - Reorganized Phase 1 conference content into dedicated "Phase 1" section.
  - Created Phase 2a implementation roadmap (`.github/projects/active/awesome-github-site/phase-2a/IMPLEMENTATION_ROADMAP.md`) documenting remaining Phase 2a tasks, success criteria, and Phase 2 gate requirements.
  - Website builds successfully with 62 pages and no errors; foundation ready for Phase 2b catalogue population.
- **AI Governance: Workflow Enforcement Clarity & PR Merge Protocol** — Enhanced `CLAUDE.md` governance documentation to precisely align with `main-branch-guard.yml` workflow enforcement. Added comprehensive PR Merge & Cleanup Protocol with strict enforcement requirements (branch verification, merge execution, automatic cleanup). Clarified that only `release/*` and `hotfix/*` branches are permitted to merge to main, enforced automatically by `.github/workflows/main-branch-guard.yml` and `scripts/workflows/branch-policy/validate-main-branch-pr.cjs`. Emphasizes "NO EXCEPTIONS" in AI Governance header and removes ambiguity about enforcement mechanisms.
- **AI Governance & Branch Protection Enforcement** — Added comprehensive AI governance rules to `CLAUDE.md` with explicit branch naming enforcement (`{type}/{scope}-{short-title}` format, no `claude/` prefixes), clarification that explicit user instructions must be executed immediately without reinterpretation, and main branch protection policies for release cycles only.
- **Awesome GitHub Site Planning Pack** — Created a new active project under `.github/projects/active/awesome-github-site/` with phase 1 and phase 2 planning docs, normalised briefing copies, and an updated execution tracker for the new GitHub-led website programme.
- **Awesome GitHub Site GitHub Pages Implementation** — Added the Astro phase 1 site scaffold, GitHub Pages deployment workflow, custom `404` page, canonical `github.lightspeedwp.agency` domain support, and review-driven fixes for frontmatter, motion, and package metadata.
- **WCEU 2026 Conference Site Expansion** — Expanded the public site into a conference-ready talk hub with per-slide pages, updated navigation and footer elements, a light/dark mode switcher, and GitHub Pages-safe slide parsing dependencies for CI builds.
- **Fullscreen Slideshow Component for WCEU 2026 Talk** — Implemented a production-ready Svelte slideshow viewer with keyboard navigation (arrow keys, space, N for notes, R for references, F for fullscreen), speaker notes and references overlays, slide indicator grid, responsive design, and light/dark mode support. Component integrates with 20 pre-built slide pages and is optimized for conference presentation delivery.

- **Awesome GitHub Site: Enhanced Wapuu Character Integration Across Pages** — Added Wapuu SVG graphics to hero sections across five key pages for improved visual engagement and character consistency:
  - Getting Started page: Wapuu-Rocket for dynamic energy and action orientation
  - Why This Exists page: Wapuu-Astropuu for big-picture vision and exploration
  - Onboarding page: Wapuu-Yoduu for wisdom and guidance
  - Glossary page: Wapuu-Astropuu for reference and learning
  - References page: Wapuu-Rocket for navigation and discovery
  All Wapuus feature responsive sizing (clamp 100-200px), drop-shadow filters for visual depth, proper accessibility attributes (aria-hidden), and fluid flexbox layouts for hero sections that adapt across mobile, tablet, and desktop viewports.

### Fixed

- **Awesome GitHub Site: NotFound Page Accessibility Improvement** — Added `aria-hidden="true"` attribute to decorative Wapuu-Astropuu image in the NotFound component (learn.jsx) to improve WCAG 2.2 AA+ accessibility compliance. Empty alt text combined with aria-hidden ensures screen readers properly skip decorative content.
- **Awesome GitHub Site: Duplicate Route Collision Fix** — Removed duplicate `/references` route caused by `website/src/pages/references.astro` conflicting with `website/src/pages/references/index.astro`. The build now generates 62 pages with no route collision warnings. Workflow updated with `--legacy-peer-deps` flag for `npm ci` to resolve `@astrojs/svelte` compatibility with Astro 5.18.2.

## [0.5.0] - 2026-06-03

### Fixed

- **v0.5.0 Readiness: Frontmatter schema cleanup for release docs and site-planning briefs** — Normalised invalid frontmatter values across the Awesome GitHub Site planning tree and related website docs so the repo’s frontmatter validator no longer trips on release-blocking schema errors:
  - Replaced unsupported `domain: website` and `domain: opsx` values with schema-valid `domain: governance`.
  - Updated draft-only site brief metadata to use supported `stability: experimental`.
  - Converted the stray `report` frontmatter type in the agent permissions audit to `documentation`.

- **v0.5.0 Readiness: Coverage and Reliability Gate Execution (`#746`, `#602`, `#599`, `#600`, `#601`)** — Re-activated planner/reviewer test coverage from skipped state into active Jest suites, added module-system consistency guards, and improved reviewer workflow dry-run support for safe validation:
  - Added `scripts/agents/__tests__/planner.agent.test.js` and `scripts/agents/__tests__/reviewer.agent.test.js` with expanded fatal-path, dry-run, blocker-detection, and API-failure coverage.
  - Added `scripts/agents/__tests__/module-system-consistency.test.js` to enforce ESM consistency across planner/reviewer and `package.json` module type.
  - Removed obsolete skipped test files `.jest-skip/planner.agent.test.js` and `.jest-skip/reviewer.agent.test.js` after active coverage migration.
  - Updated `.github/workflows/reviewer.yml` to support `workflow_dispatch` and `workflow_call` dry-run inputs via `DRY_RUN` environment pass-through.
  - Updated planner/reviewer CLI guard logic to remove `import.meta` runtime coupling in test execution paths.
  - Validation evidence: focused reliability suite `20/20` passing; focused statement coverage `planner.agent.js 82.20%` and `reviewer.agent.js 91.34%`; release gates (`validate:frontmatter`, `validate:workflows`, `validate:agents`, `validate:skill-manifests`, `validate:plugins`, `npm test`) passing.

- **v0.5.0 Readiness: Release Completeness Execution (`#594`, `#592`, `#591`, `#595`, `#593`)** — Completed release safety/governance hardening and removed legacy duplication:
  - Added `scripts/workflows/release/rollback.cjs` for failed-release recovery (`--version`, `--force`, `--dry-run`).
  - Strengthened `.github/workflows/release.yml` post-release changelog validation with schema + utility checks.
  - Enforced explicit version/scope alignment guard in `scripts/agents/release.agent.js` with controlled `RELEASE_FORCE_VERSION=1` bypass.
  - Removed obsolete `scripts/create-release-pr.cjs` duplicate flow.
  - Completed `instructions/release.instructions.md` with full phase/gate/rollback governance content.

- **v0.5.0 Readiness: Launch-Gate and Scope Closeout (`#729`, `#730`, `#731`, `#728`, `#614`, `#615`, `#616`, `#627`, `#628`, `#629`, `#632`, `#747`)** — Closed launch child/parent gate issues after blocker completion, then performed release-scope triage for non-blocking enhancement/debt items and closed them as `not planned` for the milestone, followed by final meta-tracker closure.

- **v0.5.0 Readiness: CI gate verification and frontmatter blocker remediation** — Verified CI hard-blocker chain (`#642`, `#643`, `#644`) against live `develop` with passing `npm test`, `npm run validate:agents`, and `npm run validate:workflows`. Resolved release-gate regression in `validate:frontmatter` by fixing invalid frontmatter in 13 active prompt-migration artefacts under `.github/projects/active/refactor-migrate-prompts/`, restoring `npm run validate:frontmatter` to zero errors.
- **Mermaid Accessibility Compliance (Issue #669)** — Added missing `accTitle` and `accDescr` accessibility attributes to 7 non-compliant Mermaid diagrams across `.github/`, `.vscode/`, and root-level README files. All 24 diagrams now achieve 100% WCAG 2.2 AA compliance. Also improved validation scripts with cross-platform line ending support and enhanced diagram type detection ([#696](https://github.com/lightspeedwp/.github/pull/696))
- **Wave 5: Label Color Consistency Audit** — Comprehensive audit of all 160 canonical labels in `.github/labels.yml` against documented 8-family colour strategy with findings, recommendations, and migration roadmap:
  - `.github/reports/audits/label-color-consistency-audit-2026-06-01.md` — Executive summary identifying 96 aligned labels (60%), 64 misaligned labels (40%), critical semantic mismatches in 5+ families, and detailed family-by-family analysis with root cause analysis and prioritised Phase 1–3 recommendations
  - `.github/reports/audits/label-color-audit-spreadsheet-2026-06-01.csv` — Complete label-by-label audit data (160+ labels) with current vs. recommended colours, family assignments, alignment status, and prioritised migration levels
  - Deliverables ready for dependent implementation work (Issues #683–#686): label update, documentation refresh, and follow-up validation ([#658](https://github.com/lightspeedwp/.github/issues/658))
- **Wave 5.1: Issue Template Audit, Automation Recommendations & AI Agent Integration Guide** — Completed comprehensive audit of all 25 GitHub issue templates with documentation, automation gap analysis, and contributor guidance:
  - `.github/reports/issue-template-audit-2026-05-31.md` — Complete audit report cataloguing all 25 templates, documenting current state analysis (strengths/gaps), identifying critical automation gap in labeler.yml, and providing 6 prioritised recommendations with effort/impact estimates
  - `docs/ISSUE_CREATION_GUIDE.md` — Comprehensive guide for contributors and AI agents with quick-reference template selection table, step-by-step issue creation instructions, clear distinction between current (manual) vs planned (Wave 5.1.2) automation, label selection logic for agents
  - `.github/labeler.yml` — Cleaned up configuration by removing unsupported issue-body/issue-labels rules pending infrastructure upgrade, maintained stable PR/branch rules, added documentation comments for Wave 5.1.2 planned work
  - `.github/projects/active/next-issues-execution-plan.md` — Updated execution plan documenting Wave 5 structure and sequence for remaining audits (5.2–5.5)
  - All deliverables validated and ready for next phase implementation ([#649](https://github.com/lightspeedwp/.github/issues/649))
- **Wave 5 Audit #654: Template Inventory & Standardisation Findings** — Completed comprehensive audit of 26 issue templates in `.github/ISSUE_TEMPLATE/` documenting 100% frontmatter compliance, identifying 1 critical duplicate numbering issue (07-improvement + 07-user-experience-feedback), 2 type mapping gaps (Chore, User Experience Feedback, Help/Support), and providing recommendations for Phase 1 (numbering fixes), Phase 2 (type clarification), and Phase 3 (documentation updates). Created audit findings document at `.github/projects/active/wave-5-documentation-audit/findings/654-template-inventory-findings.md` with complete inventory metrics, critical/medium/low issue analysis, and phased remediation roadmap ([#654](https://github.com/lightspeedwp/.github/issues/654))
- **WCEU 2026 Documentation: Merge Conflict Resolution and Frontmatter Corrections** — Resolved merge conflict marker in CHANGELOG.md, corrected `file_type: documentation` in ROLLOUT_PLAN_60_DAYS.md (was `rollout_plan`), added missing frontmatter fields (`stability: stable`, `domain: governance`), and fixed UK English spelling (`finalize`→`finalise`, `customize`→`customise`, `customizations`→`customisations`) ([#676](https://github.com/lightspeedwp/.github/pull/676))
- **Planner & Reviewer Agents: Code Review Fixes** — Fixed six critical issues from CodeRabbit review: dryRun option precedence, CLI entry point execution, null-safe comment body checks, extended dependency file detection (package.json, composer.json), improved rollback migration detection (.down.sql), and prevented crashes from null comment bodies ([#603](https://github.com/lightspeedwp/.github/issues/603), [#604](https://github.com/lightspeedwp/.github/issues/604), [#605](https://github.com/lightspeedwp/.github/issues/605), [#606](https://github.com/lightspeedwp/.github/issues/606), [#607](https://github.com/lightspeedwp/.github/issues/607))
- **Reviewer Agent: File Pagination** — Implemented proper pagination using `octokit.paginate()` for PR file analysis to ensure all files are analyzed even when a PR has >100 changed files; prevents missing high-risk files on subsequent pages
- **Release Agent: Branch Push Upstream Tracking** — Fixed release agent to use `git push -u origin` when pushing release branches, ensuring proper upstream tracking for subsequent PR creation ([#585](https://github.com/lightspeedwp/.github/issues/585))
- **Release Agent: [Unreleased] Section Recreation** — Fixed release agent to inject new `[Unreleased]` section after rolling version, ensuring changelog is ready for next contribution cycle ([#586](https://github.com/lightspeedwp/.github/issues/586))
- **Release Agent: Sandboxed Dry-Run Mode** — Implemented proper dry-run mode that creates temporary git branch, validates file changes, runs linting, and tests git operations before cleanup—enabling safe end-to-end release testing ([#587](https://github.com/lightspeedwp/.github/issues/587))
- **Release Workflow: Enforce Authorization Gate** — Fixed release workflow authorization check to actually block unauthorized trigger attempts. Modified `trigger-telemetry.cjs` to validate actor membership in `lightspeedwp/maintainers` team via GitHub API; workflow now exits with error if actor is not authorized. Updated `.github/workflows/release.yml` to pass `GITHUB_TOKEN` for authorization validation and report `is_authorized` status ([#588](https://github.com/lightspeedwp/.github/issues/588))
- **Release Workflow: Tests as Hard Gate** — Added test job to release workflow as mandatory pre-release gate. New `test` job runs full test suite (`npm test`) and must pass before release proceeds. Updated `release` job to depend on both `lint` and `test`, ensuring untested code cannot be released ([#589](https://github.com/lightspeedwp/.github/issues/589))
- **Release Agent: PR Creation Failures Block Release** — Fixed release agent to treat PR creation failures as fatal errors, stopping the entire release process. Removed silent error catch block in `createReleasePR()` to propagate exceptions to outer error handler, preventing release tag/GitHub release publication when PR creation fails ([#590](https://github.com/lightspeedwp/.github/issues/590))
- **Release Agent: Version Override Scope Alignment** — Added validation to ensure explicit version overrides (`--version=X.Y.Z`) align with the specified scope. Version mismatches now throw an error unless `RELEASE_FORCE_VERSION=1` environment variable is set. Includes clear warning when override is forced ([#591](https://github.com/lightspeedwp/.github/issues/591))
- **Mergify Dependabot Auto-merge Rules** — Corrected Mergify configuration to automatically merge Dependabot PRs by fixing the author condition from `author=dependabot` to `author=dependabot[bot]` to match GitHub's actual Dependabot bot account name ([#573](https://github.com/lightspeedwp/.github/issues/573))
- **WCEU 2026 Branch Name References** — Updated references in `FINAL_REVIEW_CHECKLIST.md` and `PHASE1_COMPLETION_REPORT.md` from old branch name `claude/charming-goldberg-Pqc69` to correct branch `claude/affectionate-bohr-AX2jS`

### Added

- **WCEU 2026 Phase 2 Refinement: Complete Speaker Notes and Visual Design Specifications** — Finalised all speaker notes and visual design guidance for 25-minute WordCamp Europe 2026 presentation on ".github repository automation":
  - `wceu-2026/SPEAKER_NOTES_FINAL.md` — Complete speaker notes for all 24 slides including key messages, talking points, timing (25:10 total), transitions, and emergency cut list; pacing checkpoints at 12:30, 18:00, 23:00
  - `wceu-2026/VISUAL_DESIGN_SPECIFICATIONS.md` — Full design system guide (dark mode, 8-colour palette with WCAG AA+ contrast, typography 44–56pt titles/18–24pt body, layout specs, accessibility checklist)
  - `wceu-2026/SLIDES_INDEX.md` — Quick-reference index of all 24 slides organised by section (Hook/Architecture/Implementation/Adoption) with layout, timing, key message, accent colour assignments, and build checklist
  - All three files validated for WCAG 2.2 AA accessibility compliance and ready for Phase 3 Google Slides implementation ([#640](https://github.com/lightspeedwp/.github/pull/640))

- **Documentation Consolidation & Repository Structure Refinement** — Streamlined documentation by consolidating redundant files and clarifying scope boundaries:
  - Consolidated labelling documentation: merged `docs/LABEL_STRATEGY.md`, `docs/ISSUE_LABELS.md`, `docs/PR_LABELS.md` into single comprehensive `docs/LABELING.md` (covers strategy, issue/PR/discussion labelling, agent integration, and best practices)
  - Consolidated automation documentation: merged `docs/AUTOMATION_GOVERNANCE.md`, `docs/WORKFLOWS.md` into single `docs/AUTOMATION.md` (covers strategy, governance, workflow registry, and configuration management)
  - Corrected nested file path: moved `.github/.github/docs/workflow-coordination.md` to `docs/WORKFLOW_COORDINATION.md`
  - Updated `instructions/DEPRECATED.md` with deprecation index and migration guide for consolidated files
  - Maintained portable instructions (`instructions/labeling.instructions.md`, `instructions/automation.instructions.md`) for cross-repository reusability
  - Result: Eliminated 5 redundant documentation files; improved discoverability and maintainability ([#636](https://github.com/lightspeedwp/.github/issues/636))

- **Standardised Prompts Directory** — Created `/prompts` directory at repository root with 7 reusable prompt templates for agents and AI scenarios:
  - `agent-setup.prompt` — Initial agent context, instructions, and operational guidelines
  - `code-generation.prompt` — Code implementation, scaffolding, and generation scenarios
  - `documentation.prompt` — Documentation creation, updates, and refinement workflows
  - `testing.prompt` — Test suite creation, coverage improvement, and test debugging
  - `code-review.prompt` — Code review, quality feedback, and standards enforcement
  - `debugging.prompt` — Problem diagnosis, root cause analysis, and resolution procedures
  - `refactoring.prompt` — Code refactoring, optimisation, and modernisation workflows
  - Each prompt follows consistent structure (Context, Task, Constraints, Acceptance Criteria, References) for reusability across agents and projects
  - Added `prompts/README.md` with usage guide and contribution guidelines ([#636](https://github.com/lightspeedwp/.github/issues/636))

- **Workflow Standards Comprehensive Audit & Improvement Plan** — Completed systematic audit of linting, meta, branding, and CI/CD workflows with detailed improvement roadmap:
  - `.github/reports/audits/workflow-standards-audit-2026-05-31.md` — Full audit identifying 6 priority improvements with effort estimates (23 hours total, 5–8 day timeline)
  - Identified critical gap: no changelog auto-sync on PR merge to develop
  - High priorities: automated project archival, planner agent implementation, workflow consolidation
  - Created 6 GitHub issues (#618–#623) tracking each improvement with acceptance criteria
  - Success criteria defined for changelog, projects, CI/CD, and documentation ([#618](https://github.com/lightspeedwp/.github/issues/618), [#619](https://github.com/lightspeedwp/.github/issues/619), [#620](https://github.com/lightspeedwp/.github/issues/620), [#621](https://github.com/lightspeedwp/.github/issues/621), [#622](https://github.com/lightspeedwp/.github/issues/622), [#623](https://github.com/lightspeedwp/.github/issues/623))

- **Changelog Auto-Sync Workflow** — Implemented `.github/workflows/changelog-auto-update.yml` to automatically synchronise changelog entries when PRs merge to develop:
  - Triggers on PR merge with CHANGELOG.md changes
  - Extracts entries from merged PR using `extract-pr-entries.cjs`
  - Merges entries into main CHANGELOG.md [Unreleased] section
  - Deduplicates entries to prevent duplicates
  - Validates schema before committing changes
  - Uses `[skip ci]` flag to prevent workflow loops ([#618](https://github.com/lightspeedwp/.github/issues/618))

- **Automated Project Archival Workflow** — Implemented `.github/workflows/project-archival.yml` to detect and archive completed projects:
  - Triggers on-demand (workflow_dispatch) or weekly (Sunday 02:00 UTC)
  - Scans active projects for completion markers (status: completed)
  - Moves completed projects to `.github/projects/archived/{YYYY-MM-DD}-{name}/`
  - Creates archival summary with metrics and completion date
  - Dry-run mode for safe preview before archiving
  - Generates audit trail and report for archival actions ([#619](https://github.com/lightspeedwp/.github/issues/619))

- **Planner Agent Implementation** — Enhanced and enabled `scripts/agents/planner.agent.js` with project detection logic:
  - Detects active projects from `.github/projects/active/` directory
  - Supports dry-run mode (default) for safe analysis
  - Ready for GitHub API integration to auto-assign issues to projects
  - Logs proposed project assignments with reasoning
  - Enabled planner workflow in `.github/workflows/planner.yml` (removed if: false condition) ([#620](https://github.com/lightspeedwp/.github/issues/620))

- **Standardised Project Planning Template** — Created `.github/projects/PLANNING_TEMPLATE.md` to structure issue planning before creation:
  - Comprehensive template with 9 sections: overview, scope, timeline, architecture, risks, testing, documentation, references, sign-off
  - Includes planning checklist before creating related GitHub issues
  - Standardises documentation of goals, success criteria, milestones, and dependencies
  - Helps ensure planning decisions are captured and shared with team ([#621](https://github.com/lightspeedwp/.github/issues/621))

- **Unified Checks Workflow** — Created `.github/workflows/checks.yml` to consolidate pre-merge validation:
  - Consolidates linting, testing, and validation into single workflow
  - Uses concurrency groups to prevent redundant runs
  - Clear trigger: pull_request and push (develop branch)
  - Composite status job ensures all checks pass before merge
  - Separate meta.yml workflow maintains different cadence (post-push)
  - Recommended replacement for scattered linting.yml and testing.yml ([#622](https://github.com/lightspeedwp/.github/issues/622))

- **Weekly Metrics Summary Workflow** — Implemented `.github/workflows/metrics-summary.yml` for scheduled reporting:
  - Triggers weekly (Monday 09:00 UTC) or on-demand via workflow_dispatch
  - Aggregates metrics from meta.json, git activity, and changelogs
  - Generates human-readable markdown summary report
  - Archives weekly reports in `.github/reports/metrics/weekly/`
  - Posts report to GitHub discussions (configurable)
  - Provides visibility into repository health, activity, and automation effectiveness ([#623](https://github.com/lightspeedwp/.github/issues/623))

- **WCEU 2026 Comprehensive Audit and Execution Plan** — Completed systematic audit and documentation update for May 30–31 Phase 2–3 execution:
  - `wceu-2026/FILE_UPDATE_AUDIT.md` — Comprehensive audit of 17 primary + 8 supporting files with critical issue identification and update recommendations
  - `wceu-2026/EXECUTION_PLAN.md` — Master execution plan consolidating Phase 1 validation results (16/18 passing), Phase 2 content generation workflow (4–6 hours), Phase 3 finalization timeline (6–8 hours), success criteria, risk mitigation, and open questions
  - Updated `wceu-2026/README.md` to reflect Phase 2 in-progress status with detailed checklist tracking
  - Fixed branch name references in `FINAL_REVIEW_CHECKLIST.md` and `PHASE1_COMPLETION_REPORT.md`
  - All wceu-2026 documentation validated and consistent; ready for Phase 2–3 execution ([#564](https://github.com/lightspeedwp/.github/issues/564), [#567](https://github.com/lightspeedwp/.github/issues/567), [#573](https://github.com/lightspeedwp/.github/issues/573))

- **WCEU 2026 Validation Scripts (Bash-to-JavaScript Migration)** — Completed migration of WCEU validation scripts from Bash to JavaScript with improvements:
  - `scripts/verify-wceu-readiness.js` — Automated Phase 1 validation for schema migration, agent slides reorganization, and content file completeness
  - `scripts/validate-phase2-completion.js` — Interactive Phase 2 validation for NotebookLM output, Google Slides foundation, and design system documentation
  - Benefits: ES module compatibility, robust error handling, cross-platform support (no sed/awk/grep dependencies), comprehensive logging
  - Added npm scripts: `validate:wceu:phase1` and `validate:wceu:phase2` for CLI integration
  - Comprehensive unit tests in `scripts/__tests__/wceu-validation-scripts.test.js` validating script structure, syntax, and completeness
  - Updated `scripts/README.md` with usage examples and feature documentation ([#13](https://github.com/lightspeedwp/.github/issues/13), [#16](https://github.com/lightspeedwp/.github/issues/16))

- **Release Automation Framework Phase 2: Semantic Versioning & Release Notes Generation** — Implemented core semantic versioning detection and release notes formatting modules enabling automated version bumping and changelog generation ([#598](https://github.com/lightspeedwp/.github/pull/598)):
  - `scripts/agents/includes/versionDetector.js` — Semantic version bump detection from changelog entries with Conventional Commits integration. Analyzes breaking changes, feature additions, deprecations, and removals to determine patch/minor/major version bumps per Semantic Versioning 2.0.0. Functions: parseVersion, formatVersion, compareVersions, determineBumpType, calculateNextVersion, detectBump, suggestNextVersion
  - `scripts/agents/includes/releaseNotesFormatter.js` — Release notes generation from changelog entries with Markdown formatting and metadata support (scope, commit hash, PR number, author). Configurable section ordering (security → removed → deprecated → added → changed → fixed → documentation → performance) and summary text generation. Functions: formatSectionTitle, formatEntry, buildReleaseNotes, generateReleaseNotes, extractSummary, generateSummaryText
  - `scripts/agents/includes/duplicateDetector.js` — Enhanced duplicate detection using fuzzy matching with Levenshtein distance algorithm and semantic analysis via key-term overlap. Configurable similarity threshold (default 0.85). Functions: normalize, levenshteinDistance, calculateSimilarity, isFuzzyDuplicate, hasSemanticDuplicate, findBestMatch, deduplicateEntries, groupDuplicates
  - Comprehensive test coverage: 99 Jest tests across all three modules (32 versionDetector tests, 27 releaseNotesFormatter tests, 40 duplicateDetector tests) with >90% code coverage
  - Integration tests validate semantic versioning logic, Markdown formatting, fuzzy matching algorithms, and edge case handling

- **Complete Agent Specifications & Documentation Audit** — Completed specification documentation for tracking agents and audited documentation cross-references:
  - Completed `agents/template.agent.md` with canonical agent specification template, usage guidelines, structure documentation, and best practices ([#488](https://github.com/lightspeedwp/.github/issues/488))
  - Enhanced `agents/testing.agent.md` with comprehensive role/responsibilities, capabilities, configuration, examples, and related agent references ([#490](https://github.com/lightspeedwp/.github/issues/490))
  - Audited documentation cross-references to CONTRIBUTING.md, GOVERNANCE.md, coding standards, and linting instructions ([#22](https://github.com/lightspeedwp/.github/issues/22))
  - Verified CONTRIBUTING.md has adequate Quick Start section and workflow diagram ([#18](https://github.com/lightspeedwp/.github/issues/18))
  - Verified PR template includes comprehensive accessibility and security checklists ([#21](https://github.com/lightspeedwp/.github/issues/21))

- **Comprehensive 25-Slide Deck Prompt Suite** — Added `.github/wceu-2026/agent-slides/` directory with 25 NotebookLM and Figma-ready presentation prompts covering the complete .github automation ecosystem:
  - **7 Agent Prompts**: Release, Branding, Meta, Reviewer, Linting, Labelling, and Planner agents with capabilities, integration points, and use cases
  - **3 Infrastructure Prompts**: Plugin/Agents/Skills/Hooks integration, Scripts & Automation orchestration, and Workflows architecture
  - **8 Process & Lifecycle Prompts**: PR lifecycle, issue triage, release process, documentation standards, repository metrics, QA/testing, plugin deep-dive, and observability/logging
  - **2 Governance & Standards Prompts**: WordPress-specific requirements and contributing guidelines
  - **5 Developer Experience & Strategy Prompts**: Getting started, best practices, troubleshooting/debugging, roadmap/vision, and case studies/success stories
  - Each prompt includes system overview, key components, integration points, 3+ use cases, 12-15 slide structure, evidence anchors linking to repository files, design notes for visual consistency, and quality bars for validation. Enables presentation creation with NotebookLM, Figma, and other design tools. ([#549](https://github.com/lightspeedwp/.github/pull/549))

- **Design Markdown Agent: P3 Shell Script Modernization** — Completed migration of PDF tooling dependency installation from Bash to JavaScript:
  - `skills/design-md-agent/pdfs/js/installDeps.js` — New JavaScript module replacing `install_deps.sh` shell script with async/await pattern
  - `skills/design-md-agent/pdfs/js/__tests__/installDeps.test.js` — Comprehensive test suite with 11 tests covering node_modules fast-path, package.json validation, error handling, npm install execution, and console logging
  - Performance improvement: promisified `exec()` replaces blocking subprocess; non-blocking async operation for CI/CD pipelines
  - Code review refinements: proper error wrapping, fast-path optimization, comprehensive mock-based testing, silent npm install flag validation
  - Returns structured result object with success/installed/directory properties for programmatic integration ([#616](https://github.com/lightspeedwp/.github/issues/616), [#639](https://github.com/lightspeedwp/.github/pull/639))

- **Consolidated Branding Agent Module** — Unified `scripts/agents/branding.agent.js` consolidates header, footer, and badge logic from previously scattered modules:
  - Merged header-footer.js, badges.js, footerUtils.js, and badgeUtils.js into single ES Module
  - Maintains all public API functions for footer selection, insertion, removal, and badge generation
  - Supports configuration-driven footer phrases and badge schema mapping
  - Provides unified import path for all branding utilities in meta agent workflows ([#47](https://github.com/lightspeedwp/.github/issues/47))

- **Wave 3C: README and Mermaid Maintenance Workflow** — New `.github/workflows/readme-update.yml` workflow automates README and Mermaid diagram maintenance with:
  - Mermaid accessibility updates (adds `accTitle` and `accDescr` attributes per WCAG 2.2 AA)
  - Stale frontmatter date updates (6+ month threshold)
  - Support for manual dispatch (`workflow_dispatch`) and Release Agent orchestration (`workflow_call`)
  - Dry-run mode for safe preview before applying changes
  - Audit reporting at `.github/reports/mermaid-audit/update-report.md`
  - Integrated into Release Agent post-release phase ([#536](https://github.com/lightspeedwp/.github/pull/536))

- **Wave 4 Specification** — Added `.github/projects/active/wave-4-continuous-monitoring.md` comprehensive specification for continuous README and Mermaid diagram monitoring:
  - Scheduled weekly audit workflows
  - Drift detection on push events
  - Monthly freshness notifications
  - Quarterly health reports with recommendations
  - CI/CD integration patterns and metric collection
  - Foundation for long-term automation roadmap (Waves 5-7) ([#536](https://github.com/lightspeedwp/.github/pull/536))

- **Comprehensive Documentation Index** — Created `docs/README.md` with complete documentation hub and navigation guide:
  - Quick-start sections for First-Time Contributors, Maintainers, and Workflow & Automation teams
  - 9 logical documentation categories with 36+ indexed files (Architecture & Strategy, Workflows & Processes, Labeling & Project Management, Configuration & Setup, Development & Standards, Governance & Decisions, Monitoring & Metrics, Adoption & Integration)
  - Role-based navigation table (Developer, Reviewer, Maintainer, Automation/DevOps, Organisation Lead)
  - Task-based quick-reference table (8 common tasks with relevant documentation links)
  - Documentation standards reference (UK English, Markdown with YAML frontmatter, relative links, WCAG 2.2 AA compliance)
  - Related resources and help section for discoverability
  - Updated Mermaid diagrams with WCAG 2.2 AA accessibility attributes (`accTitle`, `accDescr`)
  - Removed prohibited `references` fields from README files per CLAUDE.md governance rules
  - Closes Issue [#19](https://github.com/lightspeedwp/.github/issues/19) ([#552](https://github.com/lightspeedwp/.github/pull/552))

- **Wave 4C: Current-State Audit & Remediation Plan** — Completed comprehensive audit of 932 markdown files with detailed remediation strategy:
  - `scripts/audit-branding-patterns.js`: New ES Module audit script detecting footers, badges, and frontmatter compliance across repository
  - Category-based analysis: 31.7% footer coverage, 1.5% badge coverage, 8.7% frontmatter compliance (critical 851-file gap)
  - `.github/reports/wave-4c-audit-report.md`: Current-state findings with category-specific breakdown and recommendations
  - `.github/reports/wave-4c-remediation-plan.md`: Phased remediation roadmap (Phase 1-3 over 9-12 hours, Waves 4D-4F)
  - High-priority focus: Skills category (696 files, 18.1% footer coverage) and frontmatter schema compliance
  - Risk assessment, success criteria, and dependency analysis for phased execution
  - Unblocks Wave 4D (Issue #554) schema implementation, Wave 4E (Issue #555) agent merge, and Wave 4F (Issue #556) bulk remediation
  - Closes Issue [#553](https://github.com/lightspeedwp/.github/issues/553) (PR #558)

### Fixed

- **Plugin Structure Instructions Frontmatter** — Added missing `title` and `category` fields to `instructions/plugin-structure.instructions.md` to meet frontmatter schema requirements ([#535](https://github.com/lightspeedwp/.github/pull/547))

### Changed

- Added guarded Dependabot security auto-merge automation for `develop` by introducing Mergify conditions tied to Dependabot author, dependency/security labels, conflict/draft guards, and successful required checks. Added and wired a Dependabot security labelling workflow and aligned labels to canonical naming (`meta:dependabot-security`) to satisfy label governance and enable controlled auto-merge behaviour. ([#563](https://github.com/lightspeedwp/.github/pull/563))

- **Release Agent Integration** — Updated `agents/release.agent.md` (v2.2 → v2.3) with post-release `readme-update.yml` invocation:
  - Documented workflow contract with inputs, outputs, and failure handling
  - Added to orchestration algorithm as non-blocking post-release action
  - Conditional execution based on README maintenance requirements ([#536](https://github.com/lightspeedwp/.github/pull/536))

- **Workflow Coordination Documentation** — Updated `.github/docs/workflow-coordination.md` (v1.0.0 → v1.1.0):
  - Documented `readme-update.yml` in Agent-Triggered Workflow Registry
  - Added comprehensive specification with inputs, outputs, and integration points
  - Clarified Release Agent orchestration pattern for post-release actions ([#536](https://github.com/lightspeedwp/.github/pull/536))

- **Plugin Structure Migration** — Migrated `instructions/plugin-structure.instructions.md` from `.github/instructions/` to top-level `instructions/` folder:
  - Follows CLAUDE.md guidelines for portable reusable assets
  - Updated references across `.github/README.md` and `CLAUDE.md`
  - Clarified repository structure: GitHub-native files in `.github/`, portable assets in top-level folders ([#536](https://github.com/lightspeedwp/.github/pull/536))

### Documentation

- Confirmed GitHub Copilot continuation in `.github/projects/active/next-issues-execution-plan.md` (v2.1.2) for the remaining Wave 2A issues (`#476`, `#480`, `#482`) and Wave 2C issues (`#488`, `#490`), explicitly requiring execution to continue until implementation, validation, and PR-ready merge state for `develop` are reached.
- Added comprehensive WCEU 2026 talk asset pack audit and NotebookLM hardening plan (Issue #529): `.github/wceu-2026/WCEU_2026_AUDIT_AND_READINESS_PLAN.md` (500+ lines). Audits folder structure, identifies critical gaps in NotebookLM prompts, provides hardening roadmap with explicit develop-branch URLs. Hardened `wceu-2026/notebooklm/deep-research-prompt.md` (450+ lines) with 14 canonical approved sources, source ingestion order, analysis objectives, and constraints. Created comprehensive `wceu-2026/notebooklm/source-ingestion-checklist.md` (350+ lines) with repo-only source policy, validation checklist, prohibited sources list, and enforcement rules. Ensures NotebookLM analysis is grounded in authoritative internal sources only. ([#543](https://github.com/lightspeedwp/.github/pull/543))
- Clarified mandatory execution ownership in `.github/projects/active/next-issues-execution-plan.md` (v2.1.1), explicitly splitting task streams between **GitHub Copilot** and **Claude Code** with a dedicated ownership matrix, updated wave labels, and explicit no-cross-execution policy language for exclusive workstreams.
- Updated `.github/projects/active/next-issues-execution-plan.md` to v2.1.0 and synchronised the Active Project Files Inventory with all current artefacts in `.github/projects/active/`, including Wave 3B/3C specs, Wave 4 branding specifications (`ISSUE_33`, `ISSUE_46`, `ISSUE_48`, `ISSUE_49`), planning summaries, plugin-pack wave task lists, and continuous monitoring planning assets.
- Added comprehensive current-state audit specification for unified branding agent (Issue #48): `.github/projects/active/ISSUE_48_CURRENT_STATE_AUDIT.md` (489 lines). Audits existing branding implementations against new schema/config standards, inventories frontmatter completeness (90.6% compliant, 70 files missing required fields), category mapping accuracy (98%+ correct), header/footer patterns (84.5% missing footers), badge usage (1.9% adoption), and WCAG AA accessibility (95%+ compliance). Documents gap analysis, remediation priorities with effort estimates (16–23 hours), remediation scripts needed, risk assessment, and success criteria. Provides baseline for planning agent rollout and documentation updates. ([#541](https://github.com/lightspeedwp/.github/pull/541))
- Added comprehensive schema and config implementation specification for unified branding agent (Issue #49): `.github/projects/active/ISSUE_49_SCHEMA_CONFIG_IMPLEMENTATION.md` (800+ lines). Specification defines YAML + JSON Schema approach for configuration, documents all 16 document categories with metadata, specifies 4 required and 7 optional frontmatter fields, details path-based category inference with priority rules, documents badge types and category-specific placement rules, defines header/footer template reference structure, specifies validation rules and safe failure behavior, includes complete example configuration, and establishes dependency relationships with Issues #33 and #46. Unblocks current-state audit (Issue #48) and agent implementation. ([#539](https://github.com/lightspeedwp/.github/pull/539))
- Added comprehensive template design specification for unified branding agent (Issue #46): `.github/projects/active/ISSUE_46_TEMPLATE_DESIGN.md` (950+ lines). Specification defines header templates for all 16 document categories, footer variants (5 each for 6 key categories: Docs, Agents, Instructions, Schemas, Prompts, Governance; 1 each for 10 other categories), badge templates (Status, Category, Version, Review Status), accessibility constraints (WCAG AA compliance, contrast ratios, alt text), readability guidelines (line length, nesting, bullet lists), and YAML configuration structure for `config/templates.config.yaml`. Unblocks schema/config implementation (Issue #49) and current-state audit (Issue #48). Depends on Issue #33 parent specification. ([#538](https://github.com/lightspeedwp/.github/pull/538))
- Added comprehensive parent specification for unified branding agent (Issue #33): `.github/projects/active/ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md` (1,100+ lines). Specification locks down category taxonomy (16 document categories), header/footer requirements with 5 variants each for 6 key categories, badge system, schema/config model (YAML + JSON Schema), frontmatter standards, and 4-phase delivery roadmap. Unblocks child issues #46 (template design), #49 (schema implementation), and #48 (agent development). ([#537](https://github.com/lightspeedwp/.github/pull/537))
- Added WCAG 2.2 AA accessibility attributes (`accTitle` and `accDescr`) to all Mermaid diagrams across `profile/README.md`, `scripts/README.md`, `.github/README.md`, and supporting files. Closes [#513](https://github.com/lightspeedwp/.github/issues/513). ([#526](https://github.com/lightspeedwp/.github/pull/526))

### Fixed

- Remediated duplicate and multiple footer blocks across 664 Markdown files using schema-driven validation. Created footer configuration schema (`schema/footer-config.schema.json`), centralized footer library with 15 document categories (`config/footers.config.yaml`), and automated validation/remediation script (`.github/scripts/validate-footers.js`). Violations fixed: 51 duplicate footer files → 0, 613 multiple-footer files → 0. Published remediation guide (`.github/FOOTER_REMEDIATION_GUIDE.md`). Related to branding meta agent planning (#33, #46, #48, #49). ([#534](https://github.com/lightspeedwp/.github/pull/534))
- Removed prohibited `references:` frontmatter field from 9 README files (`README.md`, `.github/README.md`, `.github/agents/README.md`, `.github/instructions/README.md`, `.github/metrics/README.md`, `.github/schemas/README.md`, `schema/README.md`, `profile/README.md`, `scripts/README.md`) per CLAUDE.md governance rule. Added missing required frontmatter fields (`owners`, `status`, `stability`, `domain`) to affected files. Removed 13 duplicate footer blocks from root `README.md`. Added `.lycheeignore` excluding social-platform and LightSpeed external domains from CI link checking. Added `docs/MIGRATION.md` portable AI plugin restructure migration maps (completed and pending migrations, file placement quick-reference). Related to [#18](https://github.com/lightspeedwp/.github/issues/18). ([#527](https://github.com/lightspeedwp/.github/pull/527))
- Replaced deprecated MCP tool references (`create_issue`, `update_issue`, `get_issue`) with current equivalents (`issue_write`, `issue_read`) across agent specs and prompt files. Closes [#52](https://github.com/lightspeedwp/.github/issues/52). ([#455](https://github.com/lightspeedwp/.github/pull/455))
- Expanded issue template DoD checklists with discrete accessibility (WCAG 2.2 AA), security (OWASP Top 10), and performance items, aligning issue templates with the PR template. Closes [#21](https://github.com/lightspeedwp/.github/issues/21). ([#460](https://github.com/lightspeedwp/.github/pull/460))
- Updated `.coderabbit.yml`: corrected schema URL to `docs.coderabbit.ai/schema/schema.v2.json`; added `language: en-GB`, `inheritance: true`, `chat.auto_reply: true`; added `reviews.profile: chill` and `reviews.review_details: true`; hardened workflow path instructions with security guidance (least-privilege permissions, secret injection prevention, action pinning); added `instructions/**` and `CHANGELOG.md` path instructions; expanded path filters. Closes [#23](https://github.com/lightspeedwp/.github/issues/23).

### Documentation

- **Comprehensive 25-Slide-Deck Prompt Suite** — Complete NotebookLM and design-tool integration documentation with 25 production-ready slide deck prompts:
  - **7 Agent Prompts**: Release, Branding, Meta, Reviewer, Linting, Labelling, Planner agents
  - **3 Infrastructure Prompts**: Plugin/agents/skills/hooks ecosystem, scripts and automation, GitHub Actions workflows
  - **15 Ecosystem Prompts**: Pull request lifecycle, issue triage, release process, documentation standards, repository metrics/KPIs, QA/testing, plugin architecture, observability/logging, WordPress governance, contributing guidelines, onboarding, developer experience, troubleshooting, roadmap/vision, case studies
  - **Navigation**: Updated `.github/wceu-2026/agent-slides/README.md` with comprehensive index across all 25 prompts
  - **Structure**: Each prompt includes overview, capabilities, integration points, use cases, slide structure, evidence anchors, design notes, quality bar
  - Enables complete NotebookLM knowledge base generation and design system documentation ([#539](https://github.com/lightspeedwp/.github/pull/539))

- Added comprehensive branding meta agent planning documentation: `branding-meta-agent-planning-2026-05-28.md` (2,100 lines with 6-phase implementation roadmap), `PLANNING_SUMMARY_2026-05-28.md` (359 lines executive summary), and `SLIDES_GENERATION_PROMPT.md` (789 lines for WCEU 2026 20-slide generation). Updated `next-issues-execution-plan.md` with Wave 4 (branding meta agent, Claude-exclusive) and Wave 3D (WCEU 2026 talk planning). Hardened NotebookLM source prompts with explicit develop-branch URLs. Related to issues #33, #46, #48, #49, #529. ([#534](https://github.com/lightspeedwp/.github/pull/534))
- Added plugin-pack specialised skill rollout updates across active packs with per-platform manifest parity, expanded `SKILL_REGISTRY` scope coverage (`batch6PlatformYamlScope`), and refreshed rollout task tracking documentation. Closes [#524](https://github.com/lightspeedwp/.github/issues/524). ([#525](https://github.com/lightspeedwp/.github/pull/525))

- Added `accTitle` and `accDescr` accessibility attributes to all 15 Mermaid diagrams across 8 README files (`.github/README.md`, `profile/README.md`, `scripts/README.md`, `scripts/validation/README.md`, `.github/ISSUE_TEMPLATE/README.md`, `.github/projects/README.md`, `.vscode/README.md`, `tests/README.md`), bringing WCAG 2.2 AA compliance to 100%. Added Wave 3A/3B audit report, findings CSV, and repair log to `.github/reports/mermaid-audit/`. Closes [#513](https://github.com/lightspeedwp/.github/issues/513).
- Upgraded `.github/instructions/markdown.instructions.md` to v1.1: added canonical scope and precedence statement, related-files summary table, expanded WCAG 2.2 AA accessibility section with required checks, expanded examples (tables, images, links, frontmatter), contribution/review process, and branded footer. Closes [#31](https://github.com/lightspeedwp/.github/issues/31).
- Added universal issue-field governance for `Priority`, `Start date`,
  `Target date`, and `Effort`; aligned canonical config and instructions; and
  automated project sync updates for `Effort` and `Start date`. ([#501](https://github.com/lightspeedwp/.github/pull/501))

- CONTRIBUTING.md: removed forbidden `references` frontmatter field, corrected stale body date, and applied UK English consistency. Closes [#18](https://github.com/lightspeedwp/.github/issues/18). ([#457](https://github.com/lightspeedwp/.github/pull/457))
- Clarified frontmatter version governance to use SemVer-aligned change
  classification with patch-first progression where appropriate, and aligned
  release instructions to Keep a Changelog 1.1.0 taxonomy.
- Updated the active next-issues execution plan with current closure state
  (`#61` merged via `#493`), explicit Codex/Claude ownership split, and next
  actionable focus on `#60` while `#52` remains in-flight.
- Added `docs/downstream/tour-operator-adoption.md` with pilot telemetry
  baseline checklist, target metrics, documented opt-out points, metrics
  emission example, and dashboard-consumption stub for `#60`.
- Added spec-only agent issue conversion tracking under `#61`, including
  canonical issue mapping and duplicate cleanup notes.
- Added Husky pre-push hook (`.husky/pre-push`) and updated `DEVELOPMENT.md` to document the enforced pre-push test gate (`npm run test:js`, `npm run test:bash`). Closes [#62](https://github.com/lightspeedwp/.github/issues/62). ([#458](https://github.com/lightspeedwp/.github/pull/458))
- Expanded issue field governance to an organisation-level v2 model aligned to
  GitHub field capabilities (typed custom fields, hidden/system fields, and
  iteration policy) with stricter validation.
- Clarified adoption workstream tracker links and historical issue references
  in the active adoption pack documentation.
- Hardened canonical label seeding with policy-gated orphan cleanup, added
  label-governance policy config, and documented #95 decision gating for
  destructive cleanup.
- Started Wave 2A execution for `#465` (`issues.agent`) by validating canonical
  spec/runtime paths, documenting current apply-mode gap, and recording the
  next implementation step for guarded mutation support.
- Started Wave 2A execution for `#466` (`labeling.agent`) by confirming
  spec/runtime parity, recording implemented status, and capturing the next
  hardening step for edge-case test coverage.
- Started Wave 2A execution for `#467` (`linting.agent`) by confirming
  spec/runtime paths, documenting the stub implementation gap, and recording
  the next step for structured lint orchestration and test coverage.
- Started Wave 2A execution for `#468` (`meta.agent`) by confirming
  spec/runtime parity, recording active workflow-integrated status, and
  capturing hardening follow-ups for header cleanup and opt-out edge-case
  tests.

- Closed Wave 2A tracking issue `#469` (`metrics.agent`) by confirming
  spec/runtime references, documenting the current runtime placeholder gap, and
  queuing implementation follow-up under the next ready Wave 2A issue.
- Upgraded `agents/mode-demonstrate-understanding.agent.md` to v1.1: added complete frontmatter fields (`version`, `last_updated`, `owners`, `tags`, `file_type`, `status`, `domain`, `stability`, `permissions`), Implementation Status gap-analysis table, Dependencies section, and Changelog; confirmed no workflow needed (conversational mode agent). Closes [#470](https://github.com/lightspeedwp/.github/issues/470). ([#515](https://github.com/lightspeedwp/.github/pull/515))
- Upgraded `agents/mode-document-reviewer.agent.md` to v1.1: added complete frontmatter fields (`version`, `last_updated`, `owners`, `tags`, `file_type`, `status`, `domain`, `stability`, `permissions`), Implementation Status gap-analysis table, Dependencies section, and Changelog; confirmed no workflow needed (conversational mode agent). Closes [#471](https://github.com/lightspeedwp/.github/issues/471). ([#516](https://github.com/lightspeedwp/.github/pull/516))
- Upgraded `agents/mode-prd.agent.md` to v1.1: added complete frontmatter fields (`version`, `last_updated`, `owners`, `tags`, `file_type`, `status`, `domain`, `stability`, `permissions`), Implementation Status gap-analysis table, Dependencies section, and Changelog; confirmed no workflow needed (conversational mode agent with inline `issue_write`). Closes [#473](https://github.com/lightspeedwp/.github/issues/473). ([#517](https://github.com/lightspeedwp/.github/pull/517))
- Upgraded `agents/mode-thinking.agent.md` to v2.1: added missing frontmatter fields (`owners`, `tags`, `domain`, `stability`), Implementation Status gap-analysis table, Dependencies section, and Changelog; confirmed no workflow needed (conversational mode agent). Closes [#475](https://github.com/lightspeedwp/.github/issues/475). ([#518](https://github.com/lightspeedwp/.github/pull/518))
- Upgraded `agents/prompt-engineer.agent.md` to v2.1: added missing frontmatter fields (`domain`, `stability`), Implementation Status gap-analysis table (including prompt-tester handoff gap), Dependencies section, and Changelog. Closes [#478](https://github.com/lightspeedwp/.github/issues/478). ([#519](https://github.com/lightspeedwp/.github/pull/519))
- Upgraded `agents/task-planner.agent.md` to v3.1: added Implementation Status gap-analysis table confirming spec/workflow parity with `planner.yml`, and Changelog. Closes [#484](https://github.com/lightspeedwp/.github/issues/484). ([#520](https://github.com/lightspeedwp/.github/pull/520))
- Upgraded `agents/task-researcher.agent.md` to v1.1: added complete frontmatter, full spec body (was an empty stub in v1.0), Implementation Status gap-analysis table, Dependencies section, and Changelog. Closes [#486](https://github.com/lightspeedwp/.github/issues/486). ([#521](https://github.com/lightspeedwp/.github/pull/521))

## [0.4.0] - 2026-05-27

### Documentation

- Added a canonical shared `.github` adoption guide with required, recommended,
  optional, and repo-local-only classifications, plus update and validation
  workflows for consuming repositories.
- Added a downstream override policy document for org defaults and linked it
  from contribution and docs index pages to support repository-level adoption
  decisions.
- Added canonical issue-field governance documentation and automation, including
  `.github/issue-fields.yml`, `docs/ISSUE-FIELDS.md`, and workflow validation
  support for metadata consistency across issues and PRs.

## [0.3.0] - 2025-12-18

### Changed

- Repository maintenance: metrics snapshot updates, documentation and script syncs, and archive moves ([#64c3662](https://github.com/lightspeedwp/.github/commit/64c3662927b55996ad3c1966b9d65fe0d5253e16), [#aa66dc6](https://github.com/lightspeedwp/.github/commit/aa66dc6fe959113f24080d35749524d1f6784338), [#dd5b55f](https://github.com/lightspeedwp/.github/commit/dd5b55f14c4a2b697ca4f370f50830e099f197aa)).

## [0.2.0] - 2025-12-18

### Added

- Comprehensive meta agent (`meta.agent.js`) for unified front matter, badge, human reference, and footer automation (renamed from branding agent)
- Unified labeling agent (`labeling.agent.js`) replacing split status/type/standardization agents
- Extended README management with support for dynamic header/footer insertion and frontmatter validation
- Footer schema configuration (`footer.schema.json`) and header schema for consistent presentation
- Enhanced frontmatter validation across all `.md` files in repository
- Support for multiple footer variants with deterministic selection via seeding
- Emoji support in README headings for improved visual hierarchy
- Mermaid diagram preservation in all README updates
- Batch processing capabilities for efficient multi-file updates

### Changed

- Updated all README files with emoji-enhanced headings for better visual hierarchy
- Migrated frontmatter across core documentation to unified `frontmatter.schema.json` standard
- Reorganised `.github/agents/` structure with shared utilities in `includes/` subdirectory
- Consolidated badge management under meta agent (deprecated `badges.agent.js`)
- Unified header/footer handling under meta agent (deprecated `header-footer.agent.js`)
- Standardised YAML frontmatter metadata across all documentation files
- Enhanced README file templates with proper frontmatter structure
- Updated version numbers for all core README files to reflect latest changes

### Deprecated

- `badges.agent.js` - Use `meta.agent.js` instead for unified badge/header/footer management
- `header-footer.agent.js` - Use `meta.agent.js` instead for unified automation

### Documentation

- Added comprehensive meta agent specification in `.github/agents/meta.agent.md`
- Updated unified labeling agent documentation with latest configuration options
- Created detailed README templates for nested project directories
- Enhanced footer-content.json with multiple funky footer variants
- Documented footer schema validation and implementation
- Added examples for frontmatter validation across file types
- Created inline documentation for all agent helper functions

### Fixed

- Corrected frontmatter schema validation errors in documentation files
- Fixed missing `created_date` fields in core README files
- Resolved inconsistent emoji usage across headings
- Fixed footer text alignment and markdown formatting
- Corrected references paths in frontmatter to use relative paths consistently
- Fixed mermaid diagram formatting in README files

### Performance

- Optimised README file updates with batch multi-replace operations
- Improved footer selection performance with deterministic seeding
- Enhanced memory efficiency in meta agent for large file batches

## [0.1.0] - 2025-09-25

### Added

- Initial release of LightSpeed WordPress organisation community health files
- GitHub Copilot custom instructions and organisation-wide guidelines
- Comprehensive instruction files for WordPress development:
  - `coding-standards.instructions.md` - WordPress coding standards for PHP, JS, CSS
  - `html-template.instructions.md` - Block template and template part guidelines
  - `pattern-development.instructions.md` - Block pattern creation and advanced usage
  - `php-block.instructions.md` - PHP block development and theme setup
  - `playwright-tests.instructions.md` - Browser automation and accessibility testing
  - `theme-json.instructions.md` - Theme.json configuration and design tokens
- AI prompt templates for:
  - `accessibility-review.prompt.md` - Accessibility compliance review
  - `dev-code-review.prompt.md` - Code review and standards verification
  - `pattern-generation.prompt.md` - Block pattern generation assistance
  - `refactor-theme-types.prompt.md` - WordPress theme refactoring guidance
- Issue templates for comprehensive project management:
  - Bug reports, feature requests, documentation requests
  - Performance issues, UX feedback, integration issues
  - Code refactoring, task management, custom instructions proposals
- Pull request templates with WordPress-specific checklists
- VS Code configuration optimised for WordPress development:
  - MCP (Model Context Protocol) auto-start configuration
  - WordPress-specific extensions and settings
  - GitHub Copilot integration with custom instructions
  - Proper file associations for instruction and prompt files
- Example WordPress block structure following best practices
- Comprehensive documentation and README files
- GitHub Actions workflows for issue metrics and labeling
- Saved replies for common support scenarios
- Organisation profile README showcasing LightSpeed projects

### Deprecated

- [placeholder]

### Fixed

- Standardised YAML frontmatter across all instruction files
- Corrected indentation and formatting inconsistencies
- Aligned VS Code settings with repository structure
- Removed non-standard configuration keys for better compatibility

### Changed

- Updated author attribution to "LightSpeedWP Team" for consistency
- Standardised related_links format as simple URL lists
- Enhanced MCP configuration for WordPress development context
- Improved file associations and discovery paths for AI tools

### Documentation

- Added comprehensive README files for instructions and prompts
- Created implementation guide for WordPress block development
- Established clear contribution guidelines and coding standards
- Documented VS Code configuration and MCP setup procedures

### Performance

- [placeholder]

### Removed

- [placeholder]

### Security

- Implemented proper input sanitisation and output escaping in examples
- Added security guidelines in coding standards
- Established secure development practices in instruction files

## Reference

- [Branching Strategy](docs/BRANCHING_STRATEGY.md): Org-wide branch naming, merge discipline, and automation mapping.
- [CHANGELOG.md](./CHANGELOG.md): Changelog format, release notes, and versioning.
- [CONTRIBUTING.md](./CONTRIBUTING.md): Contribution guidelines, templates, coding standards.
- [AUTOMATION.md](docs/AUTOMATION.md): Org-wide automation, branching, labelling, and release strategy.
- [LABELING.md](docs/LABELING.md): Default issue, PR, and discussion label guidance.
- [Issue Types Guide](docs/ISSUE_TYPES.md): Classification and usage of issue types.
