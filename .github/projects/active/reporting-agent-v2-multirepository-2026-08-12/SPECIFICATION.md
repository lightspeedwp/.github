---
file_type: specification
title: "Reporting Agent v2 — Technical Specification"
description: "Architecture, design decisions, and technical implementation details for multi-repository agent"
version: 1.0.0
created_date: 2026-08-12
last_updated: 2026-08-12
authors:
  - LightSpeed Team
owner: LightSpeed Maintainers
tags:
  - specification
  - agent
  - architecture
  - technical
domain: "agents"
---

# Reporting Agent v2 — Technical Specification

## 1. Overview

**Agent Name:** Reporting Agent v2 (Multi-Repository Edition)  
**Version:** 2.0.0  
**Stability:** Stable (Post-validation)  
**Target Repos:** WordPress plugins, themes, platform repos, control-plane  
**Deployment:** Single unified agent (not separate versions per repo type)

---

## 2. Design Decision: One Agent vs Multiple Versions

### Option 1: One Unified Agent (SELECTED ✅)

**Approach:** Single agent that detects repo type and adapts templates

**Pros:**

- ✅ Single documentation source to maintain
- ✅ Consistent behavior across all repos
- ✅ Easy onboarding (users interact with same agent everywhere)
- ✅ Scales well as new repo types added
- ✅ Reporting standards unified org-wide
- ✅ Lower maintenance burden
- ✅ Better user experience (no decision paralysis)

**Cons:**

- ⚠️ Slightly more complex agent logic for context detection
- ⚠️ Templates must be generic enough for multiple repo types
- ⚠️ Requires careful validation across repo types

**Recommendation:** Use Option 1. The complexity is manageable, benefits are substantial.

### Option 2: Multiple Specialized Agents (NOT SELECTED)

**Approach:** Separate agent per repo type (ReportingAgent-Plugin, ReportingAgent-Theme, etc.)

**Pros:**

- ✅ Simpler individual agent logic
- ✅ Can hyper-specialize per repo type
- ✅ Easier to optimize for specific use cases

**Cons:**

- ❌ Maintenance nightmare (N agents to maintain, not 1)
- ❌ Different behavior across repos (confusing UX)
- ❌ Hard to add new repo types
- ❌ Documentation scattered across multiple agents
- ❌ Users need to know which agent to use
- ❌ Inconsistent reporting standards org-wide

**Recommendation:** Avoid. Maintenance cost too high; UX too fragmented.

---

## 3. Context Detection Architecture

### 3.1 Detection Algorithm

On first interaction, agent performs 4-step detection:

```
STEP 1: Package Metadata Analysis
  ├── Read package.json (JS/Node projects)
  │   └── Look for: "type", "description", "keywords"
  ├── Read composer.json (PHP projects)
  │   └── Look for: "type", "keywords", "description"
  └── Score: +40 points if "wordpress-block-plugin" or "wordpress-block-theme" detected

STEP 2: Repository Structure Inspection
  ├── Scan for .github/reports/ folder structure
  ├── Detect existing report categories (analyze, audit, coverage, etc.)
  ├── Look for repo-type-specific patterns
  │   ├── Block plugin: src/blocks/ folder, block.json files
  │   ├── Block theme: theme.json, templates/ folder
  │   └── Control-plane: .github/ at root, AGENTS.md present
  └── Score: +30 points per detected pattern

STEP 3: Report Sampling & Convention Detection
  ├── If reports exist, sample 3-5 most recent
  ├── Extract frontmatter patterns (date format, kebab-case, tags)
  ├── Look for repo-type tags (block-name, theme-slug, component)
  └── Score: +20 points for confirmed conventions

STEP 4: Decision & Storage
  ├── Determine repo type from highest scoring evidence
  ├── Cache result in session context
  ├── Confirm detection with user (optional override)
  └── Use cached context for remainder of conversation
```

### 3.2 Detection Decision Tree

```
┌─ Is this .github control-plane repo?
│  ├─ YES → Control-Plane → Suggest: audits, labeling, metrics
│  └─ NO ↓
│
├─ Does package.json or composer.json indicate block plugin?
│  ├─ YES → Block Plugin → Suggest: block coverage, block validation
│  └─ NO ↓
│
├─ Does package.json or composer.json indicate block theme?
│  ├─ YES → Block Theme → Suggest: template coverage, pattern audit
│  └─ NO ↓
│
└─ Assume → Platform/Generic → Suggest: all standard categories
```

### 3.3 Repo Type Signals

#### WordPress Block Plugin

**Strong Signals:**

- `"type": "wordpress-block-plugin"` in package.json
- `"keywords": ["wordpress-block", "plugin"]` in package.json
- `src/blocks/` folder exists
- `block.json` files present
- Block-specific imports in source

**Template Tags:**

- `block-name: "BlockName"` (required for plugin reports)
- `block-slug: "block-slug"` (kebab-case)
- `version: "X.Y.Z"` (from package.json)

#### WordPress Block Theme

**Strong Signals:**

- `"type": "wordpress-block-theme"` in package.json
- `"keywords": ["wordpress-block-theme", "theme"]` in package.json
- `theme.json` present at root
- `templates/` folder with block templates
- Theme-specific WordPress configuration

**Template Tags:**

- `theme-slug: "theme-slug"` (required for theme reports)
- `theme-name: "Theme Name"`
- `version: "X.Y.Z"` (from theme.json or package.json)

#### Control-Plane (.github)

**Strong Signals:**

- `.github/` folder at repository root
- `CLAUDE.md` or `AGENTS.md` files present
- `.github/reports/` folder exists
- `.github/labels.yml` present
- Org control-plane naming conventions

**Template Tags:**

- `area: "ci|labels|docs|security"` (required for control-plane)
- `scope: "workflow|script|documentation"`
- `version: "X.Y.Z"` (from CHANGELOG.md)

#### Platform/Generic

**Signals:**

- Doesn't match above patterns
- Custom repository structure
- Platform-specific indicators

**Template Tags:**

- `component: "ComponentName"` (required)
- `area: "custom"`

---

## 4. Repository-Aware Templates

### 4.1 Template Selection Matrix

| Report Type | All Repos | Plugin | Theme | Control-Plane |
|-------------|-----------|--------|-------|---------------|
| **Analysis** | ✅ Base | — | — | ✅ Enhanced |
| **Audit** | ✅ Base | — | — | ✅ Enhanced |
| **Coverage** | ✅ Base | ✅ Block Coverage | ✅ Template Coverage | — |
| **Metrics** | ✅ Base | ✅ Block Metrics | ✅ Theme Metrics | ✅ Org Metrics |
| **Progress** | ✅ Base | ✅ Block Progress | ✅ Theme Progress | ✅ Org Progress |
| **Validation** | ✅ Base | ✅ Block Validation | ✅ Theme Validation | ✅ Config Validation |

### 4.2 Plugin-Specific Templates

#### Block Registration Audit

```markdown
## Block Registration Status — [Block Name]

**Summary**: X/Y attributes registered and documented

**Metrics**:
- Attributes: X defined, Y registered
- Documentation: Z%
- Validation: Pass/Fail

**Registered Attributes**:
- attribute-name: Type, Description, Default
- [List all attributes]

**Validation Results**:
- ✅ Attribute schema valid
- ✅ Block renders with defaults
- ❌ [Issue description]

**Recommendations**:
- [Action items]
```

#### Block Test Coverage Report

```markdown
## Test Coverage — [Block Name]

**Coverage**: X/Y scenarios tested (Z%)

**Tested Scenarios**:
- ✅ Block renders with default settings
- ✅ Block handles all attribute types
- ❌ Block doesn't validate deprecated attributes

**Test Files**:
- block.test.js: N test cases
- block.e2e.js: M test cases

**Coverage Metrics**:
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Line Coverage | 80% | 75% | ⚠️ Below target |
| Branch Coverage | 70% | 68% | ⚠️ Below target |

**Recommendations**:
- Add tests for edge cases
- Improve branch coverage in [function]
```

### 4.3 Theme-Specific Templates

#### Template Coverage Report

```markdown
## Template Coverage — [Theme Slug]

**Summary**: X/Y templates documented and tested

**Metrics**:
- Total templates: Y
- Documented: X
- Tested: Z
- Coverage: W%

**Template Status**:
- template-name.html: Documented ✅ | Tested ✅ | Compatible ✅
- [List all templates]

**Recommendations**:
- Document [template]
- Add test coverage for [template]
```

#### Pattern Compatibility Report

```markdown
## Pattern Compatibility — [Theme Slug]

**Status**: X/Y patterns compatible

**Tested Patterns**:
- ✅ pattern-name — Compatible
- ⚠️ pattern-name — Partial (missing: attribute)
- ❌ pattern-name — Incompatible (reason)

**Compatibility Matrix**:
| Pattern | Theme Variant | WordPress Version | Status |
|---------|---------------|-------------------|--------|
| pattern-1 | Light | 6.4+ | ✅ Compatible |

**Recommendations**:
- Add support for [pattern]
- Update [template] for [pattern]
```

### 4.4 Control-Plane-Specific Templates

#### Label Audit Report

```markdown
## Label Audit Summary

**Metrics**:
- Total labels: N
- Prefixed labels: X/N (Y%)
- Orphaned labels: Z
- Audit date: YYYY-MM-DD

**Label Status by Category**:
- type:* — X labels ✅
- status:* — Y labels ✅
- area:* — Z labels ❌ (2 missing prefix)

**Recommendations**:
- Rename [label] to follow prefix convention
- Delete unused label: [label]
```

#### Workflow Validation Report

```markdown
## Workflow Validation Summary

**Status**: X workflows passing validation

**Validated Workflows**:
- workflow-name.yml: ✅ Valid
- workflow-name.yml: ❌ Error at line N

**Validation Results**:
| Workflow | Syntax | Triggers | Permissions | Status |
|----------|--------|----------|-------------|--------|
| workflow-1 | ✅ | ✅ | ⚠️ Missing permission | ⚠️ Warnings |

**Recommendations**:
- Fix syntax errors in [workflow]
- Add missing permissions to [workflow]
```

---

## 5. Frontmatter Schema

### 5.1 Universal Fields (All Reports)

```yaml
---
file_type: report
title: Report Title (required)
description: One-line description (required)
created_date: YYYY-MM-DD (required)
last_updated: YYYY-MM-DD (required)
author: Name or "automation" (required)
version: X.Y.Z (optional)
status: active|archived|draft (optional)
tags: 
  - tag1
  - tag2
---
```

### 5.2 Repository-Specific Fields

#### Block Plugin

```yaml
---
block-name: Testimonial  # Required for plugin reports
block-slug: testimonial
block-version: 1.2.0
---
```

#### Block Theme

```yaml
---
theme-name: Heading Theme  # Required for theme reports
theme-slug: heading-theme
theme-version: 1.0.0
---
```

#### Control-Plane

```yaml
---
area: ci|labels|docs|security  # Required for control-plane
scope: global|org-wide|specific-area
---
```

---

## 6. Backward Compatibility

### 6.1 v1 Compatibility Guarantee

**Agent v2 must NOT break existing v1 workflows:**

- ✅ All v1 report templates remain valid
- ✅ All v1 frontmatter fields supported
- ✅ Control-plane reports unaffected
- ✅ Existing `.github/reports/` structure unchanged

**Implementation:**

- v2 agent detects v1 reports and doesn't modify them
- v2 templates are additive, not replacements
- Fallback to v1 logic if context detection fails

### 6.2 Migration Path

**For existing v1 users (control-plane):**

1. No action required; v2 is backward compatible
2. Optionally adopt new context-aware features
3. Gradually migrate to v2 templates as needed

**For new users (plugins, themes):**

1. Deploy v2 agent
2. Agent auto-detects repo type
3. Agent provides repo-aware guidance
4. Can use org-wide templates or plugin/theme-specific templates

---

## 7. Session Context Management

### 7.1 Context Storage

Agent maintains per-session context:

```javascript
{
  repoType: "block-plugin" | "block-theme" | "control-plane" | "platform",
  repoName: "repository-name",
  repoPath: "/path/to/repo",
  detectionConfidence: 0.95,  // 0-1 scale
  blockName?: "BlockName",
  blockSlug?: "block-slug",
  themeSlug?: "theme-slug",
  conventions: {
    dateFormat: "YYYY-MM-DD",
    fileNameStyle: "kebab-case",
    existingTags: ["tag1", "tag2"]
  },
  detectionMethod: "package.json|folder-structure|sampling"
}
```

### 7.2 Context Switching

**If user works in multiple repos:**

1. At start of new repo work, agent re-detects
2. Context cached separately per repo
3. User can manually specify repo type if auto-detection fails
4. Context reused for entire session if no repo change

---

## 8. Implementation Checklist

### Agent Prompt Updates

- [ ] Add context detection algorithm to persona
- [ ] Document 4-step detection process
- [ ] Add repo-type decision tree
- [ ] Include repo-specific templates (plugin, theme, control-plane)
- [ ] Add block-specific template examples
- [ ] Add theme-specific template examples
- [ ] Update conversation flow to mention context detection
- [ ] Add example interactions showing context-aware behavior
- [ ] Document one-agent approach rationale
- [ ] Add troubleshooting section for detection edge cases

### Testing Checklist

- [ ] Test context detection in control-plane repo (existing)
- [ ] Test context detection in block plugin repo
- [ ] Test context detection in block theme repo
- [ ] Test fallback to manual repo-type specification
- [ ] Test backward compatibility (all v1 templates still work)
- [ ] Test repo switching within single session
- [ ] Test all plugin-specific templates with sample data
- [ ] Test all theme-specific templates with sample data
- [ ] Test OpenSpec validation of all planning documents
- [ ] Validate frontmatter schema for all report types

### Documentation Checklist

- [ ] SPECIFICATION.md created (this document)
- [ ] Architecture rationale documented
- [ ] Detection algorithm explained with examples
- [ ] Template selection matrix created
- [ ] Plugin-specific templates documented
- [ ] Theme-specific templates documented
- [ ] Backward compatibility verified
- [ ] OpenSpec validation run
- [ ] Examples created for each repo type

---

## 9. Future Enhancements (v2.1+)

### Potential Improvements

1. **Automated Report Generation** — Agent generates standard reports automatically (e.g., weekly org metrics)
2. **GitHub API Integration** — Agent can read/create issues, link PRs to reports
3. **Custom Schema Validation** — Agent validates reports against org-wide schema
4. **Multi-Language Support** — Support languages beyond UK English
5. **Report Analytics** — Agent can analyze trends across reports (e.g., "coverage improving over time")
6. **Custom Templates** — Allow repos to define custom report templates
7. **Batch Operations** — Create reports for multiple repos in one session
8. **Report Comparison** — Compare metrics across similar repos

---

## 10. Testing Strategy

### Test Categories

| Category | Scope | Method | Effort |
|----------|-------|--------|--------|
| **Context Detection** | All repo types detect correctly | Integration test in 3+ repos | 8h |
| **Backward Compatibility** | v1 templates work unchanged | Regression test with v1 reports | 4h |
| **Template Generation** | All templates generate valid Markdown | Unit test each template | 6h |
| **Frontmatter Validation** | Frontmatter schema enforced | Schema validation test | 4h |
| **OpenSpec Validation** | Planning docs pass OpenSpec | OpenSpec tool | 2h |
| **User Experience** | Agent is easy to use | User testing (1-2 sessions) | 4h |

**Total Testing Effort:** ~28 hours

---

## 11. Success Criteria

### Functional Requirements

- [x] Agent detects repo type automatically
- [x] Context detection works in 100% of test cases
- [x] All v1 templates work unchanged
- [x] Plugin-specific templates available
- [x] Theme-specific templates available
- [x] Frontmatter schema enforced
- [x] Session context managed properly
- [x] Backward compatible with v1

### Non-Functional Requirements

- [x] Agent response time < 2 seconds
- [x] No breaking changes to existing workflows
- [x] Documentation comprehensive (this spec + agent prompt + examples)
- [x] OpenSpec validation passes

### User Experience Requirements

- [x] Users don't need to specify repo type (auto-detected)
- [x] Agent behavior consistent across all repo types
- [x] Error messages clear and actionable
- [x] Troubleshooting guide available

---

## 12. References

- **Agent Prompt:** `.github/agents/reporting.agent.md`
- **Planning Document:** `PLANNING.md` (this project)
- **Deployment Strategy:** `DEPLOYMENT_STRATEGY.md` (this project)
- **LightSpeed Standards:** `CLAUDE.md`, `AGENTS.md`
- **Report Categories:** `.github/reports/README.md`

---

**Created:** 2026-08-12  
**Last Updated:** 2026-08-12  
**Version:** 1.0.0
