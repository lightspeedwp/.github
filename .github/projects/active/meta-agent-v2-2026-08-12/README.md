---
title: Meta Agent v2.0 — Organisation-Wide Schemas
description: >
  Implement organisation-wide Meta agent with automatic repo-type detection
  and context-specific metadata standards for WordPress block plugins, themes,
  and control-plane repos.
project_start_date: '2026-08-12'
project_phase: implementation
status: active
---

# Meta Agent v2.0 — Organisation-Wide Metadata & Schemas

## Project Overview

This project implements a unified Meta agent that standardises documentation metadata and structure across the entire LightSpeedWP GitHub organisation. The agent auto-detects repo type and applies context-appropriate standards without manual configuration.

**Goal:** Single reusable agent works across WordPress block plugins, block themes, and `.github` control-plane repos.

## Problem Statement

Currently:

- Different repo types need different metadata standards
- No unified approach to frontmatter validation
- Documentation inconsistencies across organisation
- Manual metadata configuration required per repo

**Solution:** Auto-detecting, context-aware Meta agent with repo-type-specific schemas.

## Success Criteria

- ✅ Single Meta agent works across all repo types
- ✅ Automatic repo-type detection (no config needed)
- ✅ Four comprehensive schemas (plugin, theme, control-plane, documentation)
- ✅ Clear validation rules and error messages
- ✅ Integration with CI/CD pipelines
- ✅ Comprehensive documentation and examples
- ✅ Zero breaking changes to existing repos

## Phases & Deliverables

### Phase 1: Design & Schema Definition ✅ COMPLETE

**Duration:** 2026-08-12 (1 day)  
**Owner:** Ash Shaw  
**PR:** [#1893](https://github.com/lightspeedwp/.github/pull/1893)

**Deliverables:**

- [x] Improved Meta Agent v2.0 (`.github/agents/meta.agent.md`)
- [x] Four frontmatter schemas (`schemas/*.frontmatter.schema.json`)
  - `block-plugin.frontmatter.schema.json` — WordPress block plugin docs
  - `block-theme.frontmatter.schema.json` — WordPress block theme docs
  - `control-plane.frontmatter.schema.json` — `.github` governance files
  - `documentation.frontmatter.schema.json` — Generic documentation
- [x] Schema documentation (`schemas/README.md`)
  - Field reference tables
  - Validation rules
  - Usage examples
  - Troubleshooting guide

**Key Features Implemented:**

- Repo-type auto-detection from filesystem markers
- Context-specific metadata application
- Frontmatter validation against schemas
- Badges and footer auto-application
- UK English enforcement
- File-level opt-out markers

**Status:** ✅ Phase 1 complete, awaiting merge (PR #1893 under review)

### Phase 2: Validation & Testing

**Duration:** 2026-08-13–2026-08-15 (est. 3 days)  
**Owner:** TBD  
**Status:** ⏳ Planned

**Deliverables:**

- [ ] Schema validation test suite
  - Unit tests for each schema
  - Sample frontmatter test cases
  - Error message validation
- [ ] Integration tests
  - Block plugin repo samples
  - Block theme repo samples
  - Control-plane file samples
- [ ] CI/CD validation workflow
  - GitHub Action for frontmatter validation
  - Schema validation in pre-commit hooks

**Acceptance Criteria:**

- All four schemas have ≥5 test cases each
- Test coverage ≥90% for validation logic
- Integration tests cover all three repo types
- CI/CD validation runs on PR changes

### Phase 3: Deployment & Distribution

**Duration:** 2026-08-16–2026-08-20 (est. 5 days)  
**Owner:** TBD  
**Status:** ⏳ Planned

**Deliverables:**

- [ ] Deployment guide (`DEPLOYMENT.md`)
  - Three distribution models (single source, federated, auto-sync)
  - Step-by-step setup for each model
  - Troubleshooting guide
- [ ] GitHub Action for auto-sync (optional)
  - Syncs meta.agent.md to target repos on update
  - Handles merge conflicts
  - Reports sync status
- [ ] Organisation-wide announcement
  - Slack notification
  - Documentation link
  - Getting started guide

**Acceptance Criteria:**

- Deployment guide covers all three models
- Clear step-by-step instructions
- Auto-sync workflow tested and working
- Team aware and trained on usage

### Phase 4: Real-World Testing & Refinement

**Duration:** 2026-08-21–2026-08-30 (est. 10 days)  
**Owner:** TBD  
**Status:** ⏳ Planned

**Deliverables:**

- [ ] Pilot repo selection (2–3 repos)
  - Block plugin repo
  - Block theme repo
  - Control-plane repo
- [ ] Pilot testing results
  - Docs applied with Meta agent
  - Schema validation feedback
  - Bug reports and fixes
- [ ] Schema refinements
  - Add missing fields based on feedback
  - Improve validation rules
  - Update documentation
- [ ] Integration with existing workflows
  - Update CLAUDE.md references
  - Link from agent registry
  - Add to automation docs

**Acceptance Criteria:**

- Pilot testing completed on 3 repos
- Zero critical bugs in Phase 2/3 deliverables
- Schema updated with real-world feedback
- Team feedback incorporated

### Phase 5: Organisation-Wide Rollout

**Duration:** 2026-09-01 onwards (ongoing)  
**Owner:** TBD  
**Status:** ⏳ Future

**Deliverables:**

- [ ] Organisation-wide adoption
  - Meta agent copied to all WordPress repos
  - Schemas documented in each repo
  - Team training completed
- [ ] Metrics & monitoring
  - Track schema validation adoption
  - Monitor error reports
  - Gather team feedback
- [ ] Continuous improvement
  - Regular schema updates
  - Community feedback incorporation
  - Documentation improvements

**Acceptance Criteria:**

- All WordPress repos have Meta agent installed
- Frontmatter validation running in CI/CD
- Team reports positive feedback
- Zero critical issues in production

## Repo Type Specifications

### Block Plugin

**Detection:** `block.json` or `{name}.php` with `Block Name` header

**Required frontmatter fields:**

- `title`, `description`, `status`, `language`

**Plugin-specific fields:**

- `block_name` — Block identifier (e.g. `lightspeed/user-input`)
- `block_supports` — Array of supported features
- `plugin_name`, `plugin_version`, `requires_wordpress`, `requires_php`

**Auto-applied badges:**

- WordPress Plugin Version, Tested Up To, License, Downloads

**Example:** WordPress block plugin documentation

### Block Theme

**Detection:** `theme.json` + `style.css` with `Text Domain` header

**Required frontmatter fields:**

- `title`, `description`, `status`, `language`

**Theme-specific fields:**

- `theme_name`, `theme_slug` — Theme identity
- `block_pattern_name` — Pattern identifier (e.g. `lightspeed/hero-section`)
- `supported_features` — WordPress feature support

**Auto-applied badges:**

- WordPress Theme Version, Tested Up To, License

**Example:** WordPress block theme documentation

### Control-Plane (.github)

**Detection:** `.github/agents/`, `.github/workflows/`, or AGENTS.md present

**Required frontmatter fields:**

- `title`, `description`, `file_type`, `category`, `status`, `language`, `owners`

**Control-plane-specific fields:**

- `maintainer`, `permissions_required`, `audience`
- `related_issues`, `related_prs`
- `last_reviewed`, `next_review_date`
- `deprecation_date`, `successor`

**Auto-applied badges:**

- Status (active/archived/deprecated), License, Last Updated

**Example:** .github governance and instruction files

### Generic Documentation

**Detection:** `docs/`, README.md, or no repo-type markers

**Required frontmatter fields:**

- `title`, `description`, `status`, `language`

**Documentation-specific fields:**

- `category` — doc category (guide, tutorial, reference, etc.)
- `difficulty` — For tutorials (beginner, intermediate, advanced)
- `estimated_read_time`, `prerequisites`, `audience`

**Auto-applied badges:**

- Status (active/archived), Last Updated

**Example:** Documentation, guides, and tutorials

## Technical Implementation

### Schemas

All schemas use JSON Schema Draft 2020-12:

```
schemas/
├── block-plugin.frontmatter.schema.json
├── block-theme.frontmatter.schema.json
├── control-plane.frontmatter.schema.json
├── documentation.frontmatter.schema.json
└── README.md (schema reference & usage)
```

**Universal validation rules:**

- `title` (required): 3–120 characters
- `description` (required): 10–300 characters
- `status` (required): `draft|review|active|archived`
- `language` (required): `en` only (UK English)
- Date format: YYYY-MM-DD (ISO 8601)
- Version format: Semantic (X.Y.Z) or vX.Y

### Agent Logic

Meta agent detects repo type (in order):

1. **Block Plugin:** `block.json` exists → use `block-plugin.frontmatter.schema.json`
2. **Block Theme:** `theme.json` + `style.css` exist → use `block-theme.frontmatter.schema.json`
3. **Control-Plane:** `.github/agents/` or AGENTS.md exists → use `control-plane.frontmatter.schema.json`
4. **Generic:** Default case → use `documentation.frontmatter.schema.json`

### Validation Pipeline

1. **Load frontmatter** — Extract YAML from Markdown file
2. **Select schema** — Auto-detect repo type
3. **Validate** — Check against schema (ajv or similar)
4. **Enrich** — Add missing recommended fields
5. **Apply** — Add badges, footer, status markers
6. **Show diff** — Display changes before applying

## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1893](https://github.com/lightspeedwp/.github/pull/1893) | PR | Meta Agent v2.0 implementation | 🟡 Review |
| TBD | epic | Phase 2: Validation & Testing | 🔵 Planned |
| TBD | epic | Phase 3: Deployment & Distribution | 🔵 Planned |
| TBD | epic | Phase 4: Real-World Testing | 🔵 Planned |
| TBD | epic | Phase 5: Organisation-Wide Rollout | 🔵 Future |

## Team & Ownership

| Role | Owner | Email |
|------|-------|-------|
| **Project Lead** | Ash Shaw | <ashley@lightspeedwp.agency> |
| **Phase 1 Owner** | Ash Shaw | <ashley@lightspeedwp.agency> |
| **Phase 2 Owner** | TBD | TBD |
| **Phase 3 Owner** | TBD | TBD |
| **Maintainer** | lightspeedwp/maintainers | — |

## Dependencies

- GitHub organisation setup (schemas, agents directories)
- JSON Schema validation tools (ajv or similar)
- Markdown frontmatter parsing (gray-matter or similar)
- GitHub Actions for CI/CD validation

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Schema too restrictive | Dev friction | Medium | Gather feedback in Phase 4, iterate |
| Adoption friction | Low adoption | Medium | Clear documentation, team training |
| Merge conflicts | Blocked PRs | Low | Auto-sync workflow handles conflicts |
| Performance impact | CI slowdown | Low | Validate only changed files |

## Success Metrics

- **Adoption:** ≥80% of WordPress repos using Meta agent by 2026-09-30
- **Validation:** 100% of new PRs pass frontmatter validation
- **Satisfaction:** Team satisfaction ≥8/10 in post-launch survey
- **Maintenance:** ≤1 critical bug report per month

## References

- [Meta Agent v2.0](./.github/agents/meta.agent.md) — Full agent documentation
- [Schema Reference](./schemas/README.md) — Field reference and validation rules
- [CLAUDE.md](./CLAUDE.md) — Organisation-wide standards
- [PR #1893](https://github.com/lightspeedwp/.github/pull/1893) — Implementation PR

## Project Timeline

```
Phase 1: Design & Schemas      |████| ✅ 2026-08-12
Phase 2: Validation & Testing  |    | ⏳ 2026-08-13–08-15
Phase 3: Deployment            |    | ⏳ 2026-08-16–08-20
Phase 4: Real-World Testing    |    | ⏳ 2026-08-21–08-30
Phase 5: Organisation Rollout  |    | 🔵 2026-09-01+
```

## How to Contribute

1. **Phase 2 (Validation):** Test schemas, write test cases, build CI validation
2. **Phase 3 (Deployment):** Create deployment guide, auto-sync workflow
3. **Phase 4 (Testing):** Pilot in 2–3 repos, gather feedback
4. **Phase 5 (Rollout):** Deploy to all WordPress repos, monitor adoption

See [AGENTS.md](./AGENTS.md) for contribution guidelines.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
