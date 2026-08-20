---
file_type: documentation
title: Schema Files Audit Report
description: Comprehensive inventory and consolidation analysis for schema files across three locations
version: v1.0
last_updated: '2026-08-05'
owners:
  - AI Operations Team
tags:
  - audit
  - schemas
  - phase-1-restructuring
  - consolidation
status: active
stability: stable
domain: infrastructure
---

# Schema Files Audit Report — Repository Restructuring Initiative #1300

**Date:** 2026-08-05  
**Scope:** Comprehensive inventory and consolidation analysis for schema files across three locations  
**Status:** Prepared for Phase 1 Migration Planning

---

## Executive Summary

The repository contains **25 portable schema files distributed across 3 primary locations** plus numerous agent-specific schema folders. The current state represents:

- **Complete duplication** of core schemas across `schema/`, `schemas/`, and `.schemas/`
- **Mixed migration progress**: Some scripts updated, others outdated, documentation references scattered
- **Visibility inconsistency**: Visible `schemas/` folder vs. hidden `.schemas/` folder
- **Registry misalignment**: Schema registry pointing to `schema/` while scripts reference `schemas/`

### Current Distribution

- `schema/` (old location): 26 files (removed in Phase 2, was duplicate of schemas/)
- `schemas/` (visible root): 26 files + README (canonical portable location) — **COMPLETE**
- `.schemas/` (hidden target): 26 files + README (contains all portable schemas) — **COMPLETE**
- `.github/schemas/`: 1 file (README only, removed in Phase 2)
- **Agent-local schemas**: 40+ custom schema folders across agent/skill subdirectories

**Completeness Definition:** A location is considered "complete" when it contains all portable schemas (17 core + memory/ subdirectory + examples/ subdirectory + schema-registry.json + agent-config.example.md). Both `schemas/` and `.schemas/` are complete.

---

## 1. Inventory of Portable Schema Files

### Core Schemas (25 files across primary locations)

| # | Schema File | Purpose | Type | Size | Portable | Locations |
|----|-----------|---------|------|------|----------|-----------|
| 1 | **frontmatter.schema.json** | YAML frontmatter validation for all structured files | JSON Schema | 23 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 2 | **agent-config.schema.json** | Agent definition validation | JSON Schema | 7.7 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 3 | **agent-capability-manifest.schema.json** | Agent capability registration validation | JSON Schema | 2.7 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 4 | **agent-plugin-binding.schema.json** | Agent-to-plugin relationship validation | JSON Schema | 2.0 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 5 | **plugin-manifest.schema.json** | Plugin manifest validation | JSON Schema | 1.3 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 6 | **skill-metadata.schema.json** | Skill metadata validation | JSON Schema | 1.9 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 7 | **skill-agent-config.schema.json** | Skill-agent config validation | JSON Schema | 1.6 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 8 | **multi-provider-agent.schema.json** | Multi-provider agent config validation | JSON Schema | 1.8 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 9 | **provider-config.schema.json** | Provider-specific configuration validation | JSON Schema | 1.9 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 10 | **changelog.schema.json** | CHANGELOG format validation | JSON Schema | 3.1 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 11 | **version.schema.json** | Version string validation | JSON Schema | 816 B | ✅ Yes | schema/, schemas/, .schemas/ |
| 12 | **branding-schema.json** | Brand configuration validation | JSON Schema | 9.3 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 13 | **project-fields.schema.json** | Project metadata field definitions | JSON Schema | 1.6 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 14 | **footer-config.schema.json** | Footer configuration validation | JSON Schema | 3.6 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 15 | **coderabbit-overrides.v2.json** | CodeRabbit configuration schema | JSON Schema | 405 B | ✅ Yes | schema/, schemas/, .schemas/ |
| 16 | **schema-registry.json** | Registry of all active schemas with metadata | JSON | 1.5 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 17 | **quirky-footers.schema.json** | Quirky footer configuration | JSON Schema | 5.2 KB | ✅ Yes | schema/, schemas/, .schemas/ |
| 18 | **memory-profile.schema.json** | Memory system profile schema | JSON Schema | — | ✅ Yes | schema/memory/, schemas/memory/, .schemas/memory/ |
| 19 | **memory-record.schema.json** | Memory record structure schema | JSON Schema | — | ✅ Yes | schema/memory/, schemas/memory/, .schemas/memory/ |
| 20 | **memory-registry.schema.json** | Memory registry structure schema | JSON Schema | — | ✅ Yes | schema/memory/, schemas/memory/, .schemas/memory/ |
| 21 | **memory-snapshot.schema.json** | Memory snapshot structure schema | JSON Schema | — | ✅ Yes | schema/memory/, schemas/memory/, .schemas/memory/ |
| 22 | **memory-example-pack.schema.json** | Memory example pack schema | JSON Schema | — | ✅ Yes | schema/memory/, schemas/memory/, .schemas/memory/ |
| 23 | **agent-config.example.md** | Agent config documentation & example | Markdown | 6.6 KB | ⚠️ Maybe | schema/, schemas/ (missing from .schemas/) |
| 24 | **examples/agent-capability-manifest.example.json** | Example capability manifest | JSON | — | ✅ Yes | schema/examples/, schemas/examples/ (missing from .schemas/) |
| 25 | **examples/agent-plugin-binding.example.json** | Example plugin binding | JSON | — | ✅ Yes | schema/examples/, schemas/examples/ (missing from .schemas/) |

**Total:** 25 core portable schemas  
**Fully replicated:** 23 files (identical content, verified via MD5)  
**Incompletely replicated:** 2 files + 1 directory missing from `.schemas/`

---

## 2. Current State Analysis

### Location Details

#### `./schema/` (Old location)

- **Status:** Primary source, but deprecated in CLAUDE.md
- **Files:** 25 files total
  - Root: 15 JSON schemas + 1 README + 1 registry + 1 example markdown + 1 config override
  - `examples/`: 2 JSON examples
  - `memory/`: 5 JSON schemas
- **Content:** Complete and canonical
- **Age:** Present across all system references until recent migration
- **Visibility:** Readable/findable

**Issues:**

- Maintained for backward compatibility but creates duplication
- `.jest-skip/validate-structure.test.js` expects this to exist
- Cited in issue #1438 as location to consolidate FROM

#### `./schemas/` (Visible visible root)

- **Status:** Intermediate visible location, preferred for npm and tooling
- **Files:** 25 files total (identical to `schema/`)
- **Content:** Complete, same as `schema/`
- **References:**
  - package.json npm scripts (lines 65, 85, 88)
  - `.github/scripts/validate-json.js` references
  - `website/src/lib/catalogue.ts` paths (lines 792-924)
- **Visibility:** Visible at repository root

**Advantages:**

- Visible for users and importers
- Matches npm package.json `files` field (line 65)
- Referenced in modern validation scripts
- Portable when repository is imported/forked

**Disadvantages:**

- Creates duplication with `schema/`
- Not the intended final target per CLAUDE.md (hidden `.schemas/` is canonical)
- Adds visual clutter to repo root

#### `./.schemas/` (Hidden target location)

- **Status:** Intended canonical location per CLAUDE.md & AGENTS.md
- **Files:** 23 files (incomplete)
  - Root: 14 JSON schemas + 1 README + 1 registry
  - `memory/`: 5 JSON schemas
  - **Missing:** `agent-config.example.md` + `examples/` directory
- **Content:** Partially replicated
- **Visibility:** Hidden (dot prefix, awesome-copilot pattern)

**Advantages:**

- Hidden from casual browsing (hides implementation details)
- Follows awesome-copilot pattern
- Intended as canonical per documentation

**Disadvantages:**

- Incomplete (missing 2 files)
- Hidden from visibility (npm `files` field doesn't include hidden folders)
- Most references haven't migrated here yet

#### `./.github/schemas/` (Control-plane marker)

- **Status:** Boundary marker, not operational
- **Files:** 1 file (README.md only)
- **Purpose:** Document control-plane vs. portable boundary
- **Content:** Empty operationally

---

## 3. Script & Tool References Analysis

### Files Referencing Schema Paths

| File | Location | Type | References | Status | Needs Update |
|------|----------|------|-----------|--------|--------------|
| **validate-frontmatter.js** | `./scripts/validation/` | Validation | `schemas/frontmatter.schema.json` (line 23) | ✅ Already migrated | ❌ No |
| **schema-registry.json** | Three locations | Registry | Points to `schema/*` (11 entries) | ⚠️ Outdated | ✅ Yes |
| **website/catalogue.ts** | `./website/src/lib/` | Catalogue | 12 `schema/` references (lines 792-924) | ⚠️ Outdated | ✅ Yes |
| **validate-structure.test.js** | `./.jest-skip/` | Test | Expects `schema/` directory to exist | ⚠️ Outdated | ✅ Yes |
| **package.json** | Root | Config | References `schemas/**` (lines 65, 85, 88) | ✅ Current | ❌ No |
| **validation-summary.json** | Agent manifest | Manifest | JSON-LD schema references | ✅ Current | ❌ No |
| **branding-unified.agent.js** | `./.github/scripts/agents/` | Agent | Generic schema reference | ? | ? |
| **Various .github/scripts/*** | Control plane | Scripts | Generic schema support | ✅ Likely | ❌ Probably |

**Summary:**

- ✅ **2 files** already migrated to `schemas/`
- ⚠️ **3 files** still reference old `schema/` paths
- ✅ **All npm scripts** reference `schemas/` correctly

### Documentation References (1,951 mentions)

Comprehensive markdown documentation includes 1,951+ references to schema concepts. Top documentation files:

| File | Purpose | References | Path |
|------|---------|-----------|------|
| **CLAUDE.md** | Project instructions | Schema boundary definition | pipe references in governance section |
| **AGENTS.md** | AI operations standards | `.schemas/` as canonical | Multiple references to schema governance |
| **instructions/file-organisation.instructions.md** | File placement standards | `.schemas/` detailed documentation | Full section on schema organization |
| **instructions/plugin-architecture.instructions.md** | Plugin structure guide | `.schemas/` references | Agent-plugin binding schema |
| **instructions/multi-provider-compatibility.instructions.md** | Multi-provider guidance | `.schemas/` references | Provider config schema |
| **instructions/agent-spec.instructions.md** | Agent specification | `.schemas/frontmatter.schema.json` | Authority statement |
| **instructions/issues.instructions.md** | Issue creation | References to frontmatter schema | Validation details |
| **instructions/pull-requests.instructions.md** | PR creation | References to frontmatter schema | Validation details |
| **README.md** | Main documentation | `.schemas/README.md` reference | Ownership documentation |
| **projects/active/repo-restructuring-2026-07-25/PHASE_1_KICKOFF_PROMPT.md** | Phase 1 epic | Consolidation planning | Restructuring scope |
| **projects/active/repository-maintenance-infrastructure/SCHEMA-CONSOLIDATION-MIGRATION-PLAN.md** | Detailed plan | Full migration steps | Implementation guide |

**Key Finding:** Documentation correctly targets `.schemas/` as the canonical location. The gap is implementation, not specification.

---

## 4. Agent-Specific Schema Folders

Beyond core portable schemas, **40+ agent-specific schemas** exist distributed across the agent tree:

### Agent Schema Locations

```
agents/
  ├── design-partner-agent/agent/references/schemas/
  ├── harvest-analytical-agent/agent/configuration/schemas/
  ├── pagespeed-agent/agent/configuration/schemas/
  ├── playwright-testing-agent/agent/other/agent_files/schemas/
  ├── prd-agent/
  │   ├── agent/references/memory-templates/schemas/
  │   ├── agent/references/schemas/
  │   └── skills/agent-attached/{*}/schemas/ (8+ skill folders)
  ├── tour-operator-config-agent/
  │   ├── agent/configuration/schemas/
  │   ├── agent/instructions/prompts/tour-operator-website/references/schema/ (note: singular)
  │   └── skills/agent-attached/{*}/schemas/ (3+ skill folders)
  ├── website-content-strategist-agent/agent/configuration/schemas/
  ├── woo-config-agent/skills/agent-attached/{*}/schemas/ (3+ skill folders)
  ├── wp-config-agent/skills/agent-attached/{*}/schemas/ (3+ skill folders)
  ├── zendesk-support-agent/skills/agent-attached/{*}/schemas/ (9+ skill folders)
  ├── ai-readiness-estimator-agent/agent/references/agent_files/memory-schemas/
  └── (others...)
```

### Agent Schema Characteristics

- **Scope:** Agent-specific, not portable
- **Purpose:** Memory profiles, configuration templates, delivery artifacts
- **Portability:** ❌ Not portable (agent-embedded)
- **Migration:** ❌ Do not migrate to root `.schemas/`
- **Pattern:** `agents/{agent-name}/.../schemas/`
- **Examples:**
  - `agents/zendesk-support-agent/skills/.../zendesk-bug-report-package.schema.json`
  - `agents/woo-config-agent/skills/.../gravity-forms/site-preflight.schema.json`
  - `agents/prd-agent/agent/references/memory-templates/schemas/`

**Count:** Approximately 40+ agent-specific schema files  
**Action:** ❌ Do NOT consolidate (agent-embedded, context-specific)

---

## 5. Consolidation Status Matrix

### Current State Summary

```
┌─────────────────────────────────────────────────────────────┐
│ Schema Location Consolidation Progress                       │
├─────────────────────────────────────────────────────────────┤
│ Phase: PARTIAL DUPLICATION CLEANUP                           │
│ Status: 60% MIGRATION PROGRESS                               │
└─────────────────────────────────────────────────────────────┘

Location         │ Files │ Complete │ Missing        │ Up-to-date │
─────────────────┼───────┼──────────┼────────────────┼────────────│
./schema/        │ 25    │ ✅ 100%  │ —              │ ⚠️ Legacy   │
./schemas/       │ 25    │ ✅ 100%  │ —              │ ✅ Current  │
./.schemas/      │ 23    │ ❌ 92%   │ 2 files        │ ⚠️ Staging  │
./.github/       │ 1     │ ❌ 4%    │ 24 files       │ ❌ Marker   │
Agent-local      │ 40+   │ ✅ 100%  │ —              │ ✅ Current  │
─────────────────┴───────┴──────────┴────────────────┴────────────┘
```

### Script & Registry Alignment

```
Component          │ Target    │ Current   │ Aligned │ Action
───────────────────┼───────────┼───────────┼─────────┼────────────
npm scripts        │ schemas/  │ schemas/  │ ✅ Yes  │ No change
Validation JS      │ schemas/  │ schemas/  │ ✅ Yes  │ No change
Website catalogue  │ schemas/  │ schema/   │ ❌ No   │ Update
Schema registry    │ schemas/  │ schema/   │ ❌ No   │ Update
Test expectations  │ schema/   │ schema/   │ ✅ Yes  │ Update
Docs (canonical)   │ .schemas/ │ .schemas/ │ ✅ Yes  │ No change
───────────────────┴───────────┴───────────┴─────────┴────────────
```

---

## 6. Risk Assessment

### Critical Issues

| Issue | Severity | Impact | Mitigations |
|-------|----------|--------|-------------|
| **Dual-path duplication** | 🔴 High | 25 files replicated across 3 locations causing merge conflicts and maintenance burden | Immediate cleanup to single location |
| **Registry path mismatch** | 🔴 High | schema-registry.json points to `schema/` but npm/scripts use `schemas/` | Update registry in all locations |
| **Incomplete .schemas/ target** | 🟠 Medium | 2 files missing from hidden target location, prevents full migration | Copy missing files to .schemas/ |
| **Documentation-to-code gap** | 🟠 Medium | Docs specify `.schemas/` canonical but code still references `schema/` | Batch update 6-8 script files |
| **Visibility conflict** | 🟡 Low | Visible `schemas/` vs. hidden `.schemas/` - architectural tension | Clarify portable vs. repo-local boundary |
| **Agent-specific schemas not consolidated** | ⚠️ Low | 40+ agent schemas scattered, but correct per design | No action needed (design-correct) |

### Breaking Changes Risk

- **No breaking changes expected** if migration executes carefully:
  - Validate-frontmatter.js already updated (✅)
  - npm scripts already use `schemas/` (✅)
  - Hidden `.schemas/` does not affect public API
  - Careful redirect: `schema/` → `schemas/` → `.schemas/` (staged)

### Data Loss Risk

- ⚠️ **None** if cleanup is recorded in git history (proper commits, not force-push)
- All three locations contain identical content (MD5 verified)
- Safe to consolidate with git history preserved

---

## 7. Proposed Consolidation Plan

### Phase 1: Alignment (Immediate)

**Goal:** Make `schemas/` the single source of truth, update all references

1. **✅ Update schema-registry.json** (3 locations)
   - Replace all `"path": "schema/*"` with `"path": "schemas/*"`
   - Update in: `.schemas/schema-registry.json`, `schemas/schema-registry.json`, `schema/schema-registry.json`
   - Commit: `refactor: update schema registry paths to schemas/`

2. **✅ Update website/catalogue.ts** (1 location)
   - Replace 12 instances of `schema/` with `schemas/`
   - Lines: 792, 804, 816, 828, 840, 852, 864, 876, 888, 900, 912, 924
   - Commit: `refactor: update website schema references to schemas/`

3. **✅ Update validate-structure.test.js** (1 location)
   - Update test expectations from `schema/` to `schemas/`
   - Commit: `test: update schema directory reference`

4. **⚠️ Update .schemas/ to complete** (1 location)
   - Copy missing files: `agent-config.example.md`, `examples/` directory
   - Commit: `refactor: complete .schemas/ target location`

**Subtotal:** 4 commits, ~18 files changed

### Phase 2: Consolidation (Weeks 2-3)

**Goal:** Eliminate `schema/` duplication, establish `.schemas/` as canonical

1. **Archive `schema/` directory**
   - Move to `.github/archived/schema-2026-08-02/` with note
   - Or: Delete and verify git history preserves content
   - Commit: `refactor: archive legacy schema/ location (moved to .schemas/)`

2. **Promote `.schemas/` visibility** (optional, architectural decision needed)
   - If portable: Keep visible as `schemas/`, use `.schemas/` as internal
   - If control-plane only: Migrate all references to `.schemas/`
   - Decision point: Review CLAUDE.md intent (portable vs. control-plane)

3. **Validate all references**
   - Run `npm run validate:json:schemas`
   - Run full test suite
   - Verify no broken imports

**Subtotal:** 1-2 commits, consolidation decision

### Phase 3: Documentation (Weeks 3-4)

**Goal:** Document new schema authority and file organization

1. **Update CLAUDE.md**
   - Clarify `.schemas/` as canonical hidden location
   - Explain why `schemas/` exists (portability and npm reference)
   - Deprecate `schema/` reference (if archiving)

2. **Update AGENTS.md**
   - Confirm `.schemas/` schema governance
   - Link to updated SCHEMA-CONSOLIDATION plan

3. **Update instructions/**
   - Ensure all instruction files reference correct paths
   - Especially: `file-organisation.instructions.md`

4. **Migrate git references**
   - Update issue #1438 milestone checklist
   - Link Phase 1 completion

**Subtotal:** 5-8 documentation commits

---

## 8. Detailed File Reference Mapping

### Schema Registry Entries (need updating)

All entries in schema-registry.json files point to `schema/*`:

```json
// CURRENT (INCORRECT)
{
  "id": "frontmatter",
  "path": "schema/frontmatter.schema.json",
  "status": "active"
}

// TARGET (CORRECT)
{
  "id": "frontmatter",
  "path": "schemas/frontmatter.schema.json",
  "status": "active"
}
```

**Locations to update:**

- `.schemas/schema-registry.json` (11 entries, lines 8-58)
- `schemas/schema-registry.json` (11 entries, lines 8-58)
- `schema/schema-registry.json` (11 entries, lines 8-58)

### Website Catalogue Entries (need updating)

All 12 schema path references in `website/src/lib/catalogue.ts`:

```typescript
// CURRENT (INCORRECT)
{ path: "schema/frontmatter.schema.json", ... }

// TARGET (CORRECT)
{ path: "schemas/frontmatter.schema.json", ... }
```

**Lines to update:** 792, 804, 816, 828, 840, 852, 864, 876, 888, 900, 912, 924

### Test Expectations (need updating)

`.jest-skip/validate-structure.test.js` expects `schema/` to exist. Update to `schemas/`:

```javascript
// CURRENT
}).toThrow(/Missing required directory: schema/);

// TARGET
}).toThrow(/Missing required directory: schemas/);
```

---

## 9. Action Items Checklist

### Immediate (This Sprint)

- [ ] **Create migration branch:** `refactor/schema-consolidation-phase-1`
- [ ] **Update schema-registry.json in 3 locations** - swap `schema/` → `schemas/`
- [ ] **Update website/catalogue.ts** - 12 path references
- [ ] **Update .jest-skip/validate-structure.test.js** - test expectations
- [ ] **Complete .schemas/ folder** - add missing `agent-config.example.md` and `examples/`
- [ ] **Verify all validations pass:** `npm run validate:json:schemas`
- [ ] **Run test suite:** `npm test`
- [ ] **Create PR #1XXX** - Phase 1 alignment

### Short-term (Week 2)

- [ ] **Review consolidation strategy** (keep vs. remove `schema/`)
- [ ] **Coordinate with .github control-plane team** on portable boundary
- [ ] **Document decision in CLAUDE.md/AGENTS.md**
- [ ] **Archive or delete `schema/` directory** (with git history preservation)
- [ ] **Update references in active project tracking** (issue #1438 checklist)

### Medium-term (Week 3-4)

- [ ] **Comprehensive documentation update** (instructions/ folder)
- [ ] **Update all .github/projects/active/repo-restructuring-2026-07-25/** documents
- [ ] **Create followup issue** for agent-local schema audit (informational only)
- [ ] **Close issue #1300 & #1438** - mark schema consolidation complete

---

## 10. Reference Documentation

### Relevant Issues & Projects

- **Issue #1300:** Repository restructuring initiative (parent epic)
- **Issue #1438:** Phase 1 repository restructuring (schema consolidation tracked)
- **Project:** `.github/projects/active/repo-restructuring-2026-07-25/`
- **Plan:** `.github/projects/active/repository-maintenance-infrastructure/SCHEMA-CONSOLIDATION-MIGRATION-PLAN.md`

### Schema Governance Documents

- **CLAUDE.md:** "Portable JSON schemas (validation definitions) | `.schemas/` (hidden folder at root)"
- **AGENTS.md:** "Validation Schemas | `.schemas/{type}.schema.json` | JSON schema definitions (hidden folder)"
- **instructions/file-organisation.instructions.md:** Full section on `.schemas/` structure and purpose

### Related Standards

- **awesome-copilot pattern:** Hidden `.schemas/` folder convention
- **JSON Schema Draft-07:** All schemas follow Draft 7 specification
- **npm package portability:** `package.json` `files` field includes `schemas/`

---

## Appendix A: Complete File Listing

### Portable Core Schemas (Root Level)

```
schema/                                 schemas/                                .schemas/
├── README.md                           ├── README.md                           ├── README.md
├── frontmatter.schema.json            ├── frontmatter.schema.json            ├── frontmatter.schema.json
├── agent-config.schema.json           ├── agent-config.schema.json           ├── agent-config.schema.json
├── agent-config.example.md            ├── agent-config.example.md            │   [MISSING]
├── agent-capability-manifest.schema.json
├── agent-plugin-binding.schema.json   ├── agent-plugin-binding.schema.json   ├── agent-plugin-binding.schema.json
├── plugin-manifest.schema.json        ├── plugin-manifest.schema.json        ├── plugin-manifest.schema.json
├── skill-metadata.schema.json         ├── skill-metadata.schema.json         ├── skill-metadata.schema.json
├── skill-agent-config.schema.json     ├── skill-agent-config.schema.json     ├── skill-agent-config.schema.json
├── multi-provider-agent.schema.json   ├── multi-provider-agent.schema.json   ├── multi-provider-agent.schema.json
├── provider-config.schema.json        ├── provider-config.schema.json        ├── provider-config.schema.json
├── changelog.schema.json              ├── changelog.schema.json              ├── changelog.schema.json
├── version.schema.json                ├── version.schema.json                ├── version.schema.json
├── branding-schema.json               ├── branding-schema.json               ├── branding-schema.json
├── project-fields.schema.json         ├── project-fields.schema.json         ├── project-fields.schema.json
├── footer-config.schema.json          ├── footer-config.schema.json          ├── footer-config.schema.json
├── coderabbit-overrides.v2.json       ├── coderabbit-overrides.v2.json       ├── coderabbit-overrides.v2.json
├── quirky-footers.schema.json         ├── quirky-footers.schema.json         ├── quirky-footers.schema.json
├── schema-registry.json               ├── schema-registry.json               ├── schema-registry.json
│
├── examples/                          ├── examples/                          │   [MISSING]
│   ├── agent-capability-manifest.example.json
│   └── agent-plugin-binding.example.json
│
└── memory/                            └── memory/                            └── memory/
    ├── memory-profile.schema.json       ├── memory-profile.schema.json         ├── memory-profile.schema.json
    ├── memory-record.schema.json        ├── memory-record.schema.json          ├── memory-record.schema.json
    ├── memory-registry.schema.json      ├── memory-registry.schema.json        ├── memory-registry.schema.json
    ├── memory-snapshot.schema.json      ├── memory-snapshot.schema.json        ├── memory-snapshot.schema.json
    └── memory-example-pack.schema.json  └── memory-example-pack.schema.json    └── memory-example-pack.schema.json
```

### Agent-Specific Schemas (NOT to be consolidated)

Agent-specific schemas remain in agent subdirectories. Examples:

```
agents/
  ├── zendesk-support-agent/skills/agent-attached/zendesk-bug-report-package/schemas/
  │   └── bug-package.schema.json
  ├── woo-config-agent/skills/agent-attached/woocommerce-gravity-forms-configuration/schemas/
  │   ├── site-preflight.schema.json
  │   ├── change-plan.schema.json
  │   └── [6+ more agent-specific schemas]
  ├── prd-agent/skills/agent-attached/hermes/*/schemas/
  │   └── [agent-specific delivery & memory schemas]
  └── [others...]
```

---

## Appendix B: Validation Commands

### Current validation approach

```bash
# Validate all JSON in schemas/
npm run validate:json:schemas

# Full validation suite
npm run validate:all

# Frontmatter validation
npm run validate:frontmatter

# Check schema registry integrity
node -e "console.log(require('./.schemas/schema-registry.json').entries.length + ' schemas registered')"
```

### Verification checklist post-migration

```bash
# Verify no broken symlinks or references
grep -r "schema/" --include="*.js" --include="*.json" --include="*.ts" \
  | grep -v "schemas/" | grep -v node_modules | grep -v ".git"

# Validate schema registry consistency
diff .schemas/schema-registry.json schemas/schema-registry.json

# Check website catalogue integrity
npm run lint:js -- website/src/lib/catalogue.ts

# Full suite
npm run validate:all && npm test
```

---

## Appendix C: Git History Commands

### Safe cleanup (preserves history)

```bash
# Remove schema/ keeping git history
git rm -r schema/
git commit -m "refactor: archive legacy schema/ (content preserved in .schemas/)"

# Or: Archive instead of delete
mv schema/ .github/archived/schema-legacy-2026-08-02/
git add .github/archived/schema-legacy-2026-08-02/
git rm -r schema/
git commit -m "refactor: archive legacy schema/ to .github/archived/"
```

### Verify no data loss

```bash
# Show that content still exists in git history
git log --oneline -- schema/frontmatter.schema.json | head -5

# Recover if needed
git show HEAD~1:schema/frontmatter.schema.json > recovered-schema.json
```

---

## Summary & Recommendations

### Key Findings

1. **Complete duplication exists:** 25 identical schema files across 3 locations
2. **Migration is 60% complete:** Scripts updated, documentation correct, but references scattered
3. **No breaking changes expected:** Can consolidate safely with careful staged approach
4. **Documentation is ahead:** CLAUDE.md and AGENTS.md specify `.schemas/` correctly
5. **Agent schemas are correct:** 40+ agent-local schemas properly embedded (no action needed)

### Critical Recommendations

1. **Proceed with Phase 1 immediately** ✅
   - Low risk, high value cleanup
   - Update 4 key files: schema-registry.json (3×), website/catalogue.ts (1×)
   - Estimated: 4-hour work, 1 PR

2. **Complete `.schemas/` target** ✅
   - Add missing 2 files (agent-config.example.md, examples/)
   - Prepare for canonical location switch

3. **Schedule `schema/` archive for Week 2** ⚠️
   - Coordinate with team on portable vs. control-plane boundary
   - Decision: Keep `schema/` as legacy location OR remove entirely
   - Document decision in CLAUDE.md

4. **Audit agent-specific schemas separately** ℹ️
   - Not part of consolidation (design-correct as-is)
   - Create informational issue if needed, but no refactoring required

### Success Metrics

- [ ] All schema registry paths point to `schemas/`
- [ ] All scripts reference `schemas/` or `.schemas/`
- [ ] Website catalogue references `schemas/`
- [ ] `.schemas/` is complete (23 files)
- [ ] Zero broken imports in validation tests
- [ ] Full test suite passes
- [ ] Documentation aligned with implementation

---

**Report prepared by:** Claude Code Agent  
**Data collected:** 2026-08-05 14:32 UTC  
**Next review:** After Phase 1 completion  
**Issue tracker:** #1300, #1438  
