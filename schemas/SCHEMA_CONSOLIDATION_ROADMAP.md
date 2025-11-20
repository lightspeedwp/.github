---
title: "Schema Organization Roadmap"
description: "Visual roadmap for schema centralization across all 3 phases"
version: "v1.0"
---

# 🗺️ Schema Centralization Roadmap

## Current State (Fragmented)

```
PROJECT ROOT (.github/)
│
├── .github/
│   ├── automation/
│   │   ├── front-matter.schema.json      🚨 LEGACY (simple)
│   │   └── schemas/
│   │       ├── version.schema.json       ⚠️ SCATTERED
│   │       └── changelog.schema.json     ⚠️ SCATTERED
│   │
│   ├── agents/
│   ├── instructions/
│   ├── prompts/
│   └── ...
│
├── schemas/                              📁 Primary location
│   ├── frontmatter.schema.json           ✅ CONSOLIDATED
│   ├── collection.schema.json            ✅ Already there
│   │
│   ├── header-footer-agent/             ⚠️ Needs consolidation
│   │   ├── agent-config.schema.json
│   │   ├── header.schema.json
│   │   ├── footer.schema.json
│   │   ├── header-footer.schema.json
│   │   ├── validate.js
│   │   ├── examples/
│   │   └── tests/
│   │
│   ├── wp/                              ⚠️ Needs consolidation
│   │   ├── block-6.6.schema.json
│   │   ├── theme-6.6.schema.json
│   │   └── documentation/
│   │
│   ├── frontmatter/                     ✅ Tools folder
│   │   ├── validate.js
│   │   ├── examples/
│   │   └── tests/
│   │
│   ├── coderabbit/
│   └── ...
│
└── docs/
```

---

## ✅ Phase 1: Automation Folder Cleanup (IMMEDIATE)

### Actions
```
DELETE:  .github/automation/front-matter.schema.json
MOVE:    .github/automation/schemas/version.schema.json      → schemas/
MOVE:    .github/automation/schemas/changelog.schema.json    → schemas/
DELETE:  .github/automation/schemas/ (empty directory)
```

### Result After Phase 1
```
schemas/
├── frontmatter.schema.json          ✅ DONE (from previous)
├── version.schema.json              ✅ NEW (moved up)
├── changelog.schema.json            ✅ NEW (moved up)
├── collection.schema.json           ✅ Already here
├── header-footer-agent/             ⚠️ Next phase
├── wp/                              ⚠️ Phase 3
└── frontmatter/
```

### References to Update
- `scripts/validate-version.js` (1 file) - Update path
- `scripts/validate-changelog.js` (1 file) - Update path
- `docs/BRANDING.md` (3 references) - Remove/update

**Estimated Effort**: 15 minutes | **Files**: 5-8 | **Risk**: Very Low

---

## ⚠️ Phase 2: Header-Footer Consolidation

### Actions
```
MOVE:    schemas/header-footer-agent/agent-config.schema.json      → schemas/
MOVE:    schemas/header-footer-agent/header.schema.json            → schemas/
MOVE:    schemas/header-footer-agent/footer.schema.json            → schemas/
MOVE:    schemas/header-footer-agent/header-footer.schema.json     → schemas/
RENAME:  schemas/header-footer-agent/                              → schemas/header-footer/
```

### Result After Phase 2
```
schemas/
├── frontmatter.schema.json          ✅ From Phase 1
├── version.schema.json              ✅ From Phase 1
├── changelog.schema.json            ✅ From Phase 1
├── agent-config.schema.json         ✅ NEW (moved up)
├── header.schema.json               ✅ NEW (moved up)
├── footer.schema.json               ✅ NEW (moved up)
├── header-footer.schema.json        ✅ NEW (moved up)
├── collection.schema.json           ✅ Already here
│
├── frontmatter/                     📁 Tools folder
│   ├── validate.js
│   ├── examples/
│   └── tests/
│
├── header-footer/                   📁 Tools folder (renamed)
│   ├── validate.js
│   ├── examples/
│   └── tests/
│
├── wp/                              ⚠️ Phase 3
└── coderabbit/
```

### References to Update
- `.github/agents/branding.agent.js` (5+ references)
- `.github/agents/branding.agent.md` (2+ references)
- `docs/BRANDING.md` (4+ references)
- `schemas/header-footer/README.md` (5+ references)
- Other documentation files (5-10 references)

**Estimated Effort**: 20 minutes | **Files**: 8-12 | **Risk**: Low

---

## 📦 Phase 3: WordPress Schemas Consolidation

### Actions
```
MOVE:    schemas/wp/block-6.6.schema.json     → schemas/
MOVE:    schemas/wp/theme-6.6.schema.json     → schemas/
RENAME:  schemas/wp/                          → schemas/wordpress/
```

### Result After Phase 3 (FINAL)
```
schemas/
├── frontmatter.schema.json          ✅ CONSOLIDATED
├── version.schema.json              ✅ CONSOLIDATED
├── changelog.schema.json            ✅ CONSOLIDATED
├── agent-config.schema.json         ✅ CONSOLIDATED
├── header.schema.json               ✅ CONSOLIDATED
├── footer.schema.json               ✅ CONSOLIDATED
├── header-footer.schema.json        ✅ CONSOLIDATED
├── block-6.6.schema.json            ✅ CONSOLIDATED
├── theme-6.6.schema.json            ✅ CONSOLIDATED
├── collection.schema.json           ✅ CONSOLIDATED
│
# Organizing folders (for tools/validation only)
├── frontmatter/
│   ├── validate.js
│   ├── CONSOLIDATION_INDEX.md       (moved from root)
│   ├── examples/
│   └── tests/
│
├── header-footer/
│   ├── validate.js
│   ├── examples/
│   └── tests/
│
├── wordpress/
│   ├── validate.js
│   ├── examples/
│   └── tests/
│
├── versioning/                      📁 NEW (optional)
│   ├── validate.js
│   └── README.md
│
├── changelog/                       📁 NEW (optional)
│   ├── validate.js
│   └── README.md
│
├── coderabbit/
│   └── ...
│
├── README.md                        (schema index)
└── SCHEMA_CENTRALIZATION_ANALYSIS.md
```

### References to Update
- WordPress validation tools (2-3 references)
- Documentation files (3-5 references)
- Configuration files (1-2 references)

**Estimated Effort**: 15 minutes | **Files**: 5-8 | **Risk**: Low

---

## 📊 Consolidation Metrics

### Schema Files by Location (Before)
```
.github/automation/schemas/      2 files  🚨
schemas/header-footer-agent/     4 files  ⚠️
schemas/wp/                      2 files  ⚠️
schemas/ root                    3 files  ✅
───────────────────────────────────────
Total                           11 files
```

### Schema Files by Location (After)
```
schemas/ root                   11 files  ✅
.github/automation/schemas/      0 files  ✅
───────────────────────────────────────
Total                           11 files
```

### Total Reference Updates Across All Phases
```
Phase 1: 5-8 files
Phase 2: 8-12 files
Phase 3: 5-8 files
─────────────────
Total: 20-30 files
```

---

## 🎯 Timeline & Milestones

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  BASELINE (Nov 20)                                          │
│  ✅ Frontmatter consolidated                                │
│                                                             │
│         ↓ (15 min)                                          │
│                                                             │
│  PHASE 1 (Automation Cleanup)                               │
│  ✅ Version & Changelog moved to root                        │
│  ✅ Legacy front-matter deleted                              │
│  ✅ Automation folder cleaned                                │
│                                                             │
│         ↓ (20 min)                                          │
│                                                             │
│  PHASE 2 (Header-Footer Consolidation)                      │
│  ✅ Agent-config moved to root                               │
│  ✅ Header/Footer schemas moved to root                      │
│  ✅ Subfolder renamed to header-footer/                      │
│                                                             │
│         ↓ (15 min)                                          │
│                                                             │
│  PHASE 3 (WordPress Consolidation)                          │
│  ✅ Block & Theme schemas moved to root                      │
│  ✅ Subfolder renamed to wordpress/                          │
│                                                             │
│         ↓                                                   │
│                                                             │
│  COMPLETE ✅                                               │
│  • 11 schemas centralized at root                           │
│  • 0 legacy files remaining                                 │
│  • Single source of truth                                   │
│  • Clean, organized structure                               │
│                                                             │
│  Total Time: ~50 minutes                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Final Benefits

| Benefit | Value |
|---------|-------|
| **Single Schema Location** | `schemas/` root directory |
| **Clean Organization** | Subfolders for tools only |
| **Improved Discoverability** | All 11 schemas visible at root |
| **Simpler Imports** | Shorter relative paths |
| **Legacy Files Removed** | No duplicates or outdated files |
| **Reference Consistency** | All point to same central location |
| **Maintenance** | Single README.md for all schemas |
| **Future Scalability** | Easy to add new schemas |

---

## 🚀 Ready to Execute

All three phases are ready for immediate execution with:
- ✅ Clear action items
- ✅ Reference mappings complete
- ✅ Low risk (no breaking changes)
- ✅ Estimated 50 minutes total effort
- ✅ Zero dependencies between phases (can be done sequentially)

**Proceed?** Yes / Awaiting Your Decision

---

*Roadmap Created: November 20, 2025*
