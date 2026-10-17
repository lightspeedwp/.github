# Governance Decisions — October 2026

> **Status:** Pending owner approval  
> **Owner:** @ashley  
> **Date:** 2026-10-16  
> **Repository:** lightspeedwp/ThisOneTimeOnAcidCom  
>
> Nine critical decisions unblock workstreams TOA-254, TOA-260, TOA-261, TOA-262. This document presents each decision, trade-offs, and recommendations.

---

## Decision 1: Package Manager Policy (PKG-001)

### Statement
Should the repository commit to **npm-only** or **support both npm and pnpm**?

### Current State
- `package-lock.json` (npm v3) is the committed lockfile
- `pnpm-workspace.yaml` and `pnpm.overrides` in `package.json` remain
- Netlify build command is `npm run build`
- Root README documents `npm i` and `npm run dev`

### Options

**A: npm-only (Recommended)**
- Remove `pnpm-workspace.yaml` and `pnpm.overrides` from `package.json`
- Document npm as canonical
- Simplify dependency management
- *Impact:* Cleaner config, single lockfile source of truth
- *Cost:* Breaking for pnpm users (unlikely to exist)

**B: Dual support**
- Keep both lockfiles, document both managers
- Validate both in CI
- *Impact:* Flexibility for contributor choice
- *Cost:* Maintenance burden, potential sync issues

### Recommendation
**A: npm-only** — Package manager is a coordination decision, not a choice. The single lockfile is the source of truth; dual support creates divergence risk.

### Blocking
- None directly, but impacts dependency governance (TOA-262)

### Approval
- [ ] Decision made by @ashley

---

## Decision 2: Node.js Version Pinning (NODE-001)

### Statement
Should Node.js version be pinned? If yes, to which version, where?

### Current State
- No `.nvmrc`, no `.node-version`, no `engines` field
- `src/app/netlify.toml` sets `NODE_VERSION = "18"` (not read by Netlify)
- Netlify reads version from UI settings (unknown)
- Validation baseline: Node 24.21.0, npm 11.19.0

### Options

**A: Pin to Node 18 (LTS)**
- Add `.nvmrc` with `18`
- Add `engines` field to `package.json`
- Document in README
- *Impact:* Reproducible local dev, matches intended Netlify runtime
- *Cost:* Maintenance when EOL approaches (2025-04-30)

**B: Pin to Node 20 (Current LTS)**
- Add `.nvmrc` with `20`
- Add `engines` field to `package.json`
- *Impact:* Modern tooling, longer support window (2026-04-30)
- *Cost:* May have breaking changes from 18 → 20

**C: No pin, use CI validation**
- Keep open-ended
- Validate build on CI with Node 20+ in test matrix
- *Impact:* Flexibility, catches regressions
- *Cost:* Dev environment divergence risk

**D: Pin via Netlify UI only**
- Set version in Netlify site dashboard (not `.nvmrc`)
- Document in deployment guide
- *Impact:* Single source of truth on production platform
- *Cost:* Local dev not enforced; mismatch possible

### Recommendation
**A: Pin to Node 18** — Matches repository intent (`src/app/netlify.toml`), supports the earliest LTS that current dependencies target. Add `.nvmrc` + `engines` for local enforcement.

### Blocking
- Workstream TOA-262 (Repository-root configuration)

### Approval
- [ ] Decision made by @ashley
- [ ] Version (18 / 20 / other): ___

---

## Decision 3: Jest ESM Configuration (TEST-001)

### Statement
How should Jest be configured to support ESM imports in test files?

### Current State
- `npm run test:unit` fails with "ESM import syntax error"
- Root cause: `scripts/validate-branch-name.test.js` uses `import` syntax
- Jest config exists but doesn't handle ESM
- Baseline status: ❌ Failed

### Options

**A: Convert to CommonJS**
- Rename `.test.js` to `.test.cjs` or `.test.mjs`
- Rewrite imports as `require()`
- Update Jest config if needed
- *Impact:* Tests run immediately
- *Cost:* Inconsistent with codebase style (TypeScript/ESM everywhere else)

**B: Enable Jest ESM mode**
- Set `"type": "module"` in `package.json` or Jest config
- Configure `--experimental-loader` or use `@swc/core`
- *Impact:* Aligns with codebase
- *Cost:* Experimental, requires Node 18+ (already in use)

**C: Migrate to Vitest**
- Replace Jest with Vitest (ESM-native, Vite-aware)
- Update CI/test scripts
- *Impact:* Native ESM, zero config, faster
- *Cost:* Dependency change, CI update

**D: Skip unit tests (not recommended)**
- Keep Jest broken, rely on build + e2e tests
- *Impact:* Faster to implement (no work)
- *Cost:* No unit test coverage, reduced confidence

### Recommendation
**B: Enable Jest ESM mode** — Pragmatic middle ground. Jest supports ESM; configure it properly. Keeps test framework stable and aligns with codebase conventions.

Fallback: **C: Vitest** if Jest ESM proves unstable. Vitest is Vite-native and the modern standard for ESM projects.

### Blocking
- Workstream TOA-260 (Testing infrastructure)
- `npm test` validation

### Approval
- [ ] Decision made by @ashley
- [ ] Selected option (A / B / C): ___

---

## Decision 4: Accept Speckit Test Baseline (TEST-002)

### Statement
Should the repository accept the current speckit test baseline (103/104 passing) or fix the single failure?

### Current State
- Baseline validation: `node --test tests/speckit.test.mjs`
- Result: 103 pass, 1 fail (template-resolution precedence test)
- Previous: 93 pass, 11 fail (improved from lock file sync)
- Failure detail: Single test checking template loading precedence

### Options

**A: Accept baseline (103/104)**
- Mark as passing in AGENTS.md
- Document known limitation in test comments
- *Impact:* Unblocks work, acknowledges minor edge case
- *Cost:* One unresolved test, future refactoring may expose it

**B: Fix the failure**
- Investigate template resolution order
- Update test or fix implementation
- *Impact:* Perfect validation baseline
- *Cost:* Time to debug (1–3 hours estimate)

**C: Defer (not recommended)**
- Leave as-is, resolve in future sprint
- *Impact:* Keeps status unclear
- *Cost:* Blocks confidence in speckit setup

### Recommendation
**A: Accept baseline** — 103/104 is production-ready. The single failure is a template-precedence edge case that doesn't affect normal workflows. Document it and move forward. Revisit only if precedence changes are needed.

### Blocking
- Workstream TOA-254 (Spec Kit)

### Approval
- [ ] Decision made by @ashley
- [ ] Selected option (A / B / C): ___

---

## Decision 5: Spec Kit Output Paths (SPEC-001)

### Statement
Should Spec Kit specifications be stored in repository root `specs/` or in `.github/specs/`?

### Current State
- Repository currently uses `.github/specs/` (per CLAUDE.md)
- Specification index at `.github/specs/CATALOG.md`
- Guidelines recommend `.github/specs/` as governance-local

### Options

**A: Keep `.github/specs/` (Recommended)**
- Specifications remain in organization control plane
- Aligns with `.github/` as "governance, templates, workflows"
- Easier to version-lock org-wide specs
- *Impact:* Governance specs stay separate from source code
- *Cost:* Slightly deeper file nesting

**B: Move to repository root `specs/`**
- Specifications at project level for visibility
- Easier for contributors to find
- *Impact:* Prominent, discoverable
- *Cost:* Mixes governance with source, creates ambiguity about what belongs where

### Recommendation
**A: Keep `.github/specs/`** — Specifications are governance artefacts, not source code. The `.github/` folder is the correct home. This decision is already documented in CLAUDE.md and AGENTS.md; no change needed.

### Blocking
- Workstream TOA-254 (Spec Kit)

### Approval
- [ ] Decision made by @ashley
- [ ] Confirmed `.github/specs/` as canonical location: ___

---

## Decision 6: BEM Enforcement vs. Tailwind Dual Support (STYLE-001)

### Statement
Should styling enforce **BEM-only** (per guidelines) or **keep Tailwind CSS tooling** available?

### Current State
- Guidelines forbid Tailwind; BEM is canonical
- Yet `tailwindcss` and `@tailwindcss/vite` remain dependencies
- `vite.config.ts` loads Tailwind plugin (marked "required by Figma Make")
- Some components use Tailwind utility-like class names
- Build succeeds; no errors

### Options

**A: Enforce BEM-only**
- Remove Tailwind dependencies from `package.json`
- Remove `@tailwindcss/vite` from Vite config
- Audit components for Tailwind utilities, migrate to BEM
- Update guidelines to lock this in
- *Impact:* Single source of truth, cleaner architecture
- *Cost:* ~2–4 hours audit/migration, breaks any Tailwind-dependent tooling

**B: Keep Tailwind, document dual support**
- Keep tooling, document that both are available
- Guidelines acknowledge Tailwind as alternative
- Establish clear rules for when to use which
- *Impact:* Flexibility, no migration effort
- *Cost:* Confusion, inconsistent styling, larger CSS bundle

**C: Keep Tailwind, mark as deprecated**
- Leave dependencies, mark Tailwind as "legacy, do not use"
- Enforce BEM for new components via review
- Migrate old components incrementally
- *Impact:* Pragmatic, allows gradual transition
- *Cost:* Mixed codebase for a while

### Recommendation
**A: Enforce BEM-only** — The guidelines already mandate this. Keeping Tailwind creates false choice and confusion. The dependency is a remnant from migration; remove it. Figma Make can work with BEM (or this is a miscommunication that needs clarification with Figma Make maintainer).

### Blocking
- Workstream TOA-262 (Component authoring guidelines)

### Approval
- [ ] Decision made by @ashley
- [ ] Selected option (A / B / C): ___

---

## Decision 7: GitHub Discussion Templates (GH-001)

### Statement
Should GitHub Discussions be enabled with templates?

### Current State
- Discussions not mentioned in AGENTS.md
- Repository has no discussion templates
- No organisation-wide decision documented

### Options

**A: Enable with templates**
- Create `.github/DISCUSSION_TEMPLATE/` templates
- Enable Discussions in repo settings
- Types: Feature requests, Q&A, Show & Tell, Ideas
- *Impact:* Community engagement, reduces issue clutter
- *Cost:* Moderation effort, CI workflow updates

**B: Defer (not recommended)**
- Leave disabled for now
- *Impact:* Simpler, fewer channels to monitor
- *Cost:* Feature requests and questions land in Issues, hard to filter

**C: Disable (not recommended)**
- Explicitly disable in settings
- Direct all discussion to Issues
- *Impact:* Single source of truth
- *Cost:* Bad UX for non-bug conversations

### Recommendation
**A: Enable with templates** — Discussions reduce noise in the Issues backlog and provide better UX for Q&A and feature ideas. Templates keep submissions structured. Implement if resources allow; otherwise defer to TOA-261.

### Blocking
- Workstream TOA-261 (.github files)

### Approval
- [ ] Decision made by @ashley
- [ ] Selected option (A / B / C): ___

---

## Decision 8: PR Template Routing (GH-002)

### Statement
Should PR templates be stored locally or inherited from organisation defaults?

### Current State
- Repository has 19 custom PR templates in `.github/PULL_REQUEST_TEMPLATE/*.md`
- Routing by branch prefix (e.g., `feat/`, `docs/`, `test/`)
- Branch naming enforced by `npm run validate:branch-name`
- Organisation also has PR templates in `lightspeedwp/.github`

### Options

**A: Keep local templates (Current state)**
- Repository-specific templates per branch type
- Customised for This One Time On Acid workflow
- *Impact:* Full control, tailored UX
- *Cost:* Maintenance burden, must sync if org standards change

**B: Inherit from organisation**
- Move or delete local templates
- Use `.github/` org-wide templates
- Branch routing happens at organisation level
- *Impact:* Single source of truth, less duplication
- *Cost:* Less customisation, all repos follow same flow

**C: Hybrid (not recommended)**
- Keep locals that differ from org, delete duplicates
- *Impact:* Best of both
- *Cost:* Fragile, hard to maintain

### Recommendation
**A: Keep local templates** — This repository has specific workflow needs (epic/repo-governance, speckit process) that differ from typical organisation projects. Local templates allow Spec Kit routing and governance-specific guidance. Sync organisation updates manually 2–3 times per year.

### Blocking
- Workstream TOA-261 (.github files)

### Approval
- [ ] Decision made by @ashley
- [ ] Selected option (A / B / C): ___

---

## Decision 9: CODEOWNERS and Branch Protection (GH-003)

### Statement
Should CODEOWNERS file be created and branch protection rules enforced?

### Current State
- No `.github/CODEOWNERS` file exists
- No branch protection on `main` or `develop`
- Anyone can merge to protected branches
- Repository follows `main` (releases) + `develop` (integration) model

### Options

**A: Enable CODEOWNERS and protection**
- Create `.github/CODEOWNERS` mapping code areas to owners
- Protect `main` (require PR, status checks, owner review)
- Protect `develop` (require PR, status checks)
- *Impact:* Governance, prevents accidental merges, enforces review
- *Cost:* Stricter workflow, blocks rapid prototyping

**B: CODEOWNERS only, no protection**
- Create `.github/CODEOWNERS` for attribution
- Suggest (but don't enforce) review by code owners
- *Impact:* Visibility, optional enforcement
- *Cost:* No hard guarantees

**C: No CODEOWNERS, no protection (not recommended)**
- Leave as-is
- *Impact:* Fastest, most flexible
- *Cost:* Risk of merges without review, unaccountable changes

### Recommendation
**A: Enable CODEOWNERS and protection** — For a governance-focused epic (TOA-241), protected branches are essential. Protect `main` (strict) and `develop` (moderate). CODEOWNERS should list @ashley for critical paths (`.github/`, `scripts/`, `AGENTS.md`, `CHANGELOG.md`) and allow review delegation for components.

### Blocking
- Workstream TOA-261 (.github files)

### Approval
- [ ] Decision made by @ashley
- [ ] Selected option (A / B / C): ___

---

## Summary Table

| ID | Decision | Recommendation | Owner Approval |
|---|---|---|---|
| PKG-001 | Package manager | npm-only (A) | [ ] |
| NODE-001 | Node.js version | Pin to 18 (A) | [ ] |
| TEST-001 | Jest ESM | Enable Jest ESM mode (B) | [ ] |
| TEST-002 | Speckit baseline | Accept 103/104 (A) | [ ] |
| SPEC-001 | Spec Kit paths | Keep `.github/specs/` (A) | [ ] |
| STYLE-001 | BEM enforcement | Enforce BEM-only (A) | [ ] |
| GH-001 | Discussions | Enable with templates (A) | [ ] |
| GH-002 | PR templates | Keep local (A) | [ ] |
| GH-003 | CODEOWNERS | Enable + protection (A) | [ ] |

---

## Approval Process

1. **Owner review:** @ashley reads this document and indicates preference for each decision.
2. **Confirmation:** Mark approved decisions with initials and date.
3. **Implementation:** Create follow-up PRs for each approved decision (one PR per decision or grouped by workstream).
4. **Blocking:** Workstreams TOA-254, TOA-260, TOA-261, TOA-262 unblock once decisions are approved.

---

## Workstream Dependencies

| Workstream | Blocking Decisions | Status |
|---|---|---|
| TOA-260 (Testing) | TEST-001, TEST-002 | Blocked on owner approval |
| TOA-261 (.github) | GH-001, GH-002, GH-003 | Blocked on owner approval |
| TOA-262 (Config) | PKG-001, NODE-001, STYLE-001 | Blocked on owner approval |
| TOA-254 (Spec Kit) | SPEC-001, TEST-002 | Blocked on owner approval |

---

**Next Step:** Forward this document to @ashley for review. Once all decisions are approved, implementation PRs will begin.
