---
title: "Schema Centralization Analysis"
description: "Complete analysis and recommendation for centralizing all schema files"
version: "v1.0"
date: "2025-11-20"
---

# 📊 Schema Centralization Analysis & Recommendation

## Executive Summary

**Status**: Ready for next consolidation phase  
**Finding**: 11 schema files currently scattered across 3 locations  
**Recommendation**: Centralize all to `/schemas/` root level  
**Impact**: Cleaner organization, easier maintenance, improved discoverability

---

## 📁 Current Schema File Locations

### ✅ Consolidated (Frontmatter)

```
schemas/
├── frontmatter.schema.json          (CANONICAL - newly consolidated)
├── frontmatter/                     (tools, validation, docs)
└── ...
```

### ⚠️ Still Scattered (Needs Consolidation)

#### 1. **Old Automation Folder** (Most Problematic)

```
.github/automation/
├── front-matter.schema.json         (LEGACY - simple/old version)
└── schemas/
    ├── version.schema.json          (version validation)
    └── changelog.schema.json        (changelog validation)
```

#### 2. **Header-Footer Agent Subfolder**

```
schemas/header-footer-agent/
├── agent-config.schema.json
├── header.schema.json
├── footer.schema.json
└── header-footer.schema.json
```

#### 3. **WordPress Schemas Subfolder**

```
schemas/wp/
├── block-6.6.schema.json
└── theme-6.6.schema.json
```

#### 4. **Other Schemas at Root**

```
schemas/
├── collection.schema.json
├── coderabbit-overrides.v2.json     (not .schema.json but related)
└── link-audit.json                  (not .schema.json but related)
```

---

## 🔍 Detailed Schema Analysis

### Schema Files Summary (11 total)

| File                          | Location                       | Type                        | Used By          | Consolidate?  |
| ----------------------------- | ------------------------------ | --------------------------- | ---------------- | ------------- |
| **frontmatter.schema.json**   | `schemas/`                     | Frontmatter validation      | Agents, Copilot  | ✅ DONE       |
| **front-matter.schema.json**  | `.github/automation/`          | Legacy frontmatter (simple) | BRANDING.md      | 🚨 REMOVE     |
| **version.schema.json**       | `.github/automation/schemas/`  | Version validation          | Version control  | ✅ MOVE UP    |
| **changelog.schema.json**     | `.github/automation/schemas/`  | Changelog validation        | Release process  | ✅ MOVE UP    |
| **agent-config.schema.json**  | `schemas/header-footer-agent/` | Branding agent config       | Branding agent   | ✅ MOVE UP    |
| **header.schema.json**        | `schemas/header-footer-agent/` | Header template schema      | Branding agent   | ✅ MOVE UP    |
| **footer.schema.json**        | `schemas/header-footer-agent/` | Footer template schema      | Branding agent   | ✅ MOVE UP    |
| **header-footer.schema.json** | `schemas/header-footer-agent/` | Combined schema             | Branding agent   | ✅ MOVE UP    |
| **block-6.6.schema.json**     | `schemas/wp/`                  | WordPress block schema      | WordPress blocks | ✅ MOVE UP    |
| **theme-6.6.schema.json**     | `schemas/wp/`                  | WordPress theme schema      | WordPress themes | ✅ MOVE UP    |
| **collection.schema.json**    | `schemas/`                     | Collection definition       | Awesome Copilot  | ✅ ALREADY OK |

---

## 🎯 Proposed Final Structure

```
schemas/
├── README.md                        # Index of all schemas
│
├── SCHEMA_CONSOLIDATION_INDEX.md    # Completion records (moved here)
│
# Core Schemas (at root level)
├── frontmatter.schema.json
├── version.schema.json              ← MOVE from .github/automation/schemas/
├── changelog.schema.json            ← MOVE from .github/automation/schemas/
├── collection.schema.json
├── agent-config.schema.json         ← MOVE from header-footer-agent/
├── header.schema.json               ← MOVE from header-footer-agent/
├── footer.schema.json               ← MOVE from header-footer-agent/
├── header-footer.schema.json        ← MOVE from header-footer-agent/
├── block-6.6.schema.json            ← MOVE from wp/
├── theme-6.6.schema.json            ← MOVE from wp/
│
# Organizing Subfolders (for tools, not schemas)
├── frontmatter/                     # Validation tools, examples, tests
│   ├── validate.js
│   ├── README.md
│   ├── examples/
│   └── tests/
│
├── versioning/                      # Version management tools (NEW)
│   ├── validate.js
│   └── README.md
│
├── changelog/                       # Changelog management tools (NEW)
│   ├── validate.js
│   └── README.md
│
├── header-footer/                   # Branding tools (CONSOLIDATED)
│   ├── validate.js
│   └── examples/
│
├── wordpress/                       # WP schema tools (CONSOLIDATE)
│   ├── validate.js
│   └── documentation/
│
├── coderabbit/                      # CodeRabbit config (existing)
│   └── ...
│
└── README.md                        # Overview of all schemas
```

---

## 📋 Consolidation Plan (3 Phases)

### Phase 1: Clean Up Automation Folder ✅ COMPLETED

- ✅ Move `version.schema.json` from `.github/automation/schemas/` → `schemas/`
- ✅ Move `changelog.schema.json` from `.github/automation/schemas/` → `schemas/`
- ✅ Delete legacy `front-matter.schema.json` from `.github/automation/`
- ✅ Delete now-empty `.github/automation/schemas/` directory

### Phase 2: Consolidate Header-Footer Schemas

- Move `agent-config.schema.json` → `schemas/agent-config.schema.json`
- Move `header.schema.json` → `schemas/header.schema.json`
- Move `footer.schema.json` → `schemas/footer.schema.json`
- Move `header-footer.schema.json` → `schemas/header-footer.schema.json`
- Keep `schemas/header-footer/` for tools/validation
- Update all references (6-10 files)

### Phase 3: Consolidate WordPress Schemas

- Move `wp/block-6.6.schema.json` → `schemas/block-6.6.schema.json`
- Move `wp/theme-6.6.schema.json` → `schemas/theme-6.6.schema.json`
- Keep `schemas/wordpress/` for tools/validation
- Update all references (3-5 files)

---

## 🔍 Reference Analysis

### Automation Folder Schemas

```
.github/automation/front-matter.schema.json
  Referenced in: docs/BRANDING.md (3 locations) - OUTDATED
  Action: DELETE - superseded by schemas/frontmatter.schema.json

.github/automation/schemas/version.schema.json
  Referenced in: scripts/validate-version.js (1 location)
  Action: MOVE to schemas/version.schema.json

.github/automation/schemas/changelog.schema.json
  Referenced in: scripts/validate-changelog.js (1 location)
  Action: MOVE to schemas/changelog.schema.json
```

### Header-Footer Agent Schemas

```
schemas/header-footer-agent/*.schema.json (4 files)
  Used by: .github/agents/branding.agent.js
  Referenced in: docs/BRANDING.md, schemas/header-footer-agent/README.md
  Action: MOVE to schemas/ root with relative paths updated
```

### WordPress Schemas

```
schemas/wp/*.schema.json (2 files)
  Used by: WordPress validation tools
  Referenced in: docs/wordpress/, schemas/wp/README.md
  Action: MOVE to schemas/ root with relative paths updated
```

---

## ✅ Benefits of Full Consolidation

| Benefit             | Impact                                   |
| ------------------- | ---------------------------------------- |
| **Discoverability** | All schemas visible at root level        |
| **Consistency**     | Mirrors frontmatter consolidation        |
| **Maintenance**     | Single index file for all schemas        |
| **Import Paths**    | Shorter relative paths everywhere        |
| **Organization**    | Subfolders for tools, not schema storage |
| **Clarity**         | Clear separation of schemas from tools   |
| **Scalability**     | Easy to add new schema categories        |

---

## 🚀 Recommended Next Steps

### Immediate (Ready to Execute)

1. **Phase 1**: Move and consolidate automation folder schemas
   - Estimated effort: 15 minutes
   - Files affected: 5-8
   - Breaking changes: None

2. **Phase 2**: Consolidate header-footer schemas
   - Estimated effort: 20 minutes
   - Files affected: 8-12
   - Breaking changes: None

3. **Phase 3**: Consolidate WordPress schemas
   - Estimated effort: 15 minutes
   - Files affected: 5-8
   - Breaking changes: None

### Total Estimated Time: ~50 minutes for all 3 phases

---

## 📊 Consolidation Summary

### Current State

- 11 schema files
- 3 different locations (bad)
- 2 legacy/duplicate files (problematic)
- Scattered organization (confusing)

### Target State

- 11 schema files (all moved)
- 1 primary location: `schemas/` root (good)
- 0 legacy/duplicate files
- Organized subfolders for tools only

### Impact

- Eliminates duplicate consolidation work
- Matches frontmatter consolidation pattern
- Improves repository organization
- Simplifies documentation

---

## 🎓 Key Decisions

**Q: Should all schemas move to root?**  
**A**: YES - Matches pattern established by frontmatter consolidation. Subfolders for tools, not schema storage.

**Q: Delete legacy front-matter.schema.json?**  
**A**: YES - Superseded by comprehensive `schemas/frontmatter.schema.json`. Only 3 outdated references in docs.

**Q: Keep subdirectories like `header-footer-agent/`?**  
**A**: YES - But rename to generic names like `header-footer/`, `wordpress/` and keep only tools/validation code.

**Q: How many files need reference updates?**  
**A**: ~20-30 files total across all 3 phases.

---

## 📝 Implementation Readiness

| Phase                   | Readiness | Complexity | Risk     |
| ----------------------- | --------- | ---------- | -------- |
| Phase 1 (Automation)    | 🟢 READY  | Low        | Very Low |
| Phase 2 (Header-Footer) | 🟡 READY  | Medium     | Low      |
| Phase 3 (WordPress)     | 🟡 READY  | Medium     | Low      |

---

## 🎯 Recommendation

**PROCEED with full consolidation in 3 phases:**

1. Phase 1 eliminates problematic automation folder
2. Phase 2 aligns header-footer schemas with new pattern
3. Phase 3 consolidates WordPress schemas
4. Result: Clean, organized, centralized schema management

**Expected Outcome**: All schema files at `schemas/` root with organized subfolders for tools and validation.

---

*Analysis Created: November 20, 2025*
