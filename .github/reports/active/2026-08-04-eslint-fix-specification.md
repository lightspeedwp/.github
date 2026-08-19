---
file_type: report
title: "ESLint Fix Specification — Issue #1486"
description: "Specification for fixing 68 ESLint no-unused-vars violations"
date: "2026-08-04"
status: "documented"
category: "linting"
version: "1.0.0"
---

# ESLint Fix Specification — Issue #1486

**Date**: 2026-08-04
**Status**: DOCUMENTED (ready for implementation)
**Total Warnings**: 68 (0 errors)

## Warning Breakdown

| Pattern | Count | Fix | Example |
|---------|-------|-----|---------|
| **Unused caught errors** | 35 | Prefix parameter with `_` | `catch (_e)`, `catch (_err)` |
| **Unused imports, constants, parameters** | 33 | Prefix with `_` | `_glob`, `_config`, `_theme` |
| **TOTAL** | **68** | Apply underscore convention | |

## Pattern 1: Unused Caught Errors (35 instances)

Change: `catch (e)` → `catch (_e)` | `catch (err)` → `catch (_err)` | `catch (error)` → `catch (_error)`

**Files**:

- `.github/scripts/agents/__tests__/planner.agent.test.js:69` - exitSpy
- `.github/scripts/agents/issue-type.agent.js:24` - e
- `.github/scripts/agents/meta.agent.js:104` - e
- `.github/scripts/audit-branding-patterns.js:51,152` - e (2x)
- `agents/design-partner-agent/agent/scripts/design-md-agent/__tests__/ciDesignMdCheck.test.js` - execSync
- `agents/design-partner-agent/agent/scripts/design-md-agent/validateDesignMd.js:5` - searchRoots
- `.github/scripts/identify-changed-markdown.js:45` - err
- `.github/scripts/remediation-wave-4f.js:110` - config
- `.github/scripts/validate-footers.js:58,220` - err (2x)
- `.github/scripts/validate-markdown-lint.js:72` - error
- `.github/scripts/validate-reports-structure.js:39` - err
- `hooks/multi-provider-consistency-checker/index.js:200` - error
- `scripts/agents/__tests__/planner.agent.test.js:11,70` - envToken, exitSpy
- `scripts/agents/__tests__/release.agent.mcp.test.js:2` - path
- `scripts/agents/branding-unified.agent.js:63,469` - loadFrontmatterSchema, verbose
- `scripts/agents/branding.agent.js:196` - config
- `scripts/agents/includes/__tests__/milestone-allocation.test.js:2` - readConfig
- `scripts/agents/includes/__tests__/sync-version.test.js:7` - path
- `scripts/agents/includes/changelog-cli.js:86` - e
- `scripts/agents/includes/en-gb-normalise.js:79` - fenceLang
- `scripts/agents/includes/header-footer.js:300` - config
- `scripts/agents/issue-type.agent.js:24` - e
- `scripts/agents/labeling.agent.js:26,42,47` - fetchCanonicalLabels, formatErrors, ISSUE_TYPES_CONFIG
- `scripts/agents/meta.agent.js:104` - e
- `scripts/audit-branding-patterns.js:51,152` - e (2x)
- `agents/design-partner-agent/agent/scripts/design-md-agent/__tests__/ciDesignMdCheck.test.js:4` - execSync
- `agents/design-partner-agent/agent/scripts/design-md-agent/validateDesignMd.js:5` - searchRoots
- `scripts/identify-changed-markdown.js:45` - err
- `scripts/inject-footers.js:127,161,174` - shouldExclude, e, getFooterBlock
- `scripts/remediation-wave-4f.js:110` - config
- `scripts/test-footer-injection-safety.js:22,260` - crypto, category
- `scripts/validate-footer-injection.js:23` - glob
- `scripts/validate-markdown-lint.js:72` - error
- `scripts/validate-reports-structure.js:39` - err
- `scripts/validation/run-agent-handoff-audit.js:28` - e
- `scripts/validation/validate-agent-frontmatter.js:64` - filename
- `scripts/validation/validate-agents.js:29` - WORKFLOWS_DIR
- `scripts/validation/validate-mermaid-colour-contrast.js:240` - theme
- `scripts/validation/validate-readme-links.js:40` - filePath
- `scripts/workflows/__tests__/release-workflow-scripts.test.js:38` - error
- `skills/slides/pptxgenjs_helpers/code.js:40` - err
- `skills/slides/pptxgenjs_helpers/image.js:163` - blockLength
- `skills/slides/pptxgenjs_helpers/layout.js:120` - proj
- `skills/slides/pptxgenjs_helpers/text.js:208,224,335,600,628` - text, measurer, lines, err (2x)

## Pattern 2: Other Unused Variables (33 instances)

Unused imports, constants, function parameters, and local variables that don't follow the underscore convention.

**Examples**: Unused imports (`_glob`, `_path`), unused parameters (`_config`, `_theme`, `_filename`), unused constants (`_WORKFLOWS_DIR`, `_ISSUE_TYPES_CONFIG`).

**Fix**: Apply the same underscore convention: prefix unused variables with `_` to indicate intentional non-use.

**Note**: This covers the remaining 33 warnings after catch-error pattern (35) = 68 total.

## Implementation Options

### Option A: Automated (Sed/Perl)

```bash
# Unused caught errors
find . -name "*.js" -type f | xargs sed -i 's/} catch (e) {/} catch (_e) {/g'
find . -name "*.js" -type f | xargs sed -i 's/} catch (err) {/} catch (_err) {/g'
find . -name "*.js" -type f | xargs sed -i 's/} catch (error) {/} catch (_error) {/g'
```

### Option B: Manual File-by-File

Use Edit tool with exact line references (preferred for safety)

### Option C: Manual Verification

Use detailed code review to confirm each change is safe

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Missed files | Cross-reference against full warning list |
| Pattern overcatch | Verify sed matches only catch blocks |
| Variables in use | Grep to confirm unused before prefixing |

## Verification

After fixes:

```bash
npm run lint:js -- --max-warnings=0
npm run lint:md
npm run validate:frontmatter
```

## Related Work

- **Footers**: Document separately - script needs safer implementation
- **Tests**: All passing (1,074 tests, 112 suites) ✅
- **Documentation**: See primary audit report

---

Maintained by the 🤖 LightSpeedWP Automation Team
