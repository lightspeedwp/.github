---
title: "Footer Automation Script Audit — Issue #1486 Phase 3"
description: "Analysis of inject-footers.js and redesign requirements"
date: 2026-08-05
status: audit-complete
category: infrastructure
type: audit
issue_refs:
  - "1486"
  - "1531"
---

# Footer Automation Script Audit

**Audit Date**: 2026-08-05  
**Status**: AUDIT COMPLETE  
**Risk Level**: HIGH — Current script destroys content  

---

## Problem Statement

The current footer injection script (`scripts/inject-footers.js` and `.github/scripts/inject-footers.js`) **destroys existing template content** instead of safely appending footers.

### Critical Issue: Content Loss

**Lines 221-227** show the destructive logic:

```javascript
// Remove existing footer if present
const lastSeparatorIndex = content.lastIndexOf("\n---");
if (lastSeparatorIndex > 0) {
  newContent = content.substring(0, lastSeparatorIndex);  // ⚠️ TRUNCATES ALL CONTENT AFTER ---
}

// Append new footer
newContent += "\n" + footerTemplate.template.trim() + "\n";
```

### What Gets Deleted

1. **Definition of Ready (DoR)** sections in issue templates
2. **Definition of Done (DoD)** sections in PR templates  
3. **Acceptance Criteria** sections
4. **Checklist** sections
5. Any content after the YAML frontmatter separator (`---`)

### Example: Issue Template

**Before:**

```markdown
---
name: "Bug"
about: "Report a defect"
---

## Definition of Ready (DoR)
- [ ] Issue clearly described
- [ ] Environment details provided

## Definition of Done (DoD)
- [ ] Fix implemented
- [ ] Tests passing
```

**After (Current Script):**

```markdown
---
name: "Bug"
about: "Report a defect"
---

[FOOTER ONLY — DoR & DoD SECTIONS DELETED]
```

---

## Impact Assessment

### Current State

- **Files awaiting footers**: 510
- **Files with duplicate footers**: 6
- **Safe to run**: NO — will destroy 510+ files
- **Risk if deployed**: CRITICAL — permanent content loss

### Root Cause

The script assumes footers are only in the trailing section after the final `---` separator, but GitHub templates use `---` as both:

1. **YAML frontmatter delimiter** (lines 1-3)
2. **Visual separator** within template content (after sections, before footer)

When the script finds `lastIndexOf("\n---")`, it gets the **last** occurrence (visual separator), not the frontmatter end.

---

## Solution Requirements

### Redesign Must Address

1. **Preserve Frontmatter**
   - Do NOT truncate after ANY `---` separator
   - Extract YAML frontmatter (lines 1-3 only)
   - Preserve all content between frontmatter and footer

2. **Safe Footer Placement**
   - Check if footer already exists (by ID or signature)
   - Append footer ONLY if missing
   - NO TRUNCATION of existing content

3. **Safeguards**
   - Dry-run mode (show changes without writing)
   - Backup creation (before any modification)
   - Schema validation (footer content valid)
   - Rollback capability (restore from backup)
   - Duplicate detection (skip if footer exists)

4. **Test Coverage**
   - GitHub issue templates (ISSUE_TEMPLATE/*.md)
   - GitHub PR templates (PULL_REQUEST_TEMPLATE/*.md)
   - README files (various formats)
   - Documentation files (docs/, instructions/)
   - Agent specifications (agents/*.md)

---

## Algorithm: Safe Footer Injection

### Pseudocode

```
FUNCTION safeInjectFooter(filePath, content):
    
    // Step 1: Parse frontmatter (always lines 1-3)
    frontmatter = extractFrontmatterOnly(content)  // Match ^---\n...\n---$
    
    // Step 2: Extract body (everything after frontmatter)
    body = content.substring(frontmatter.length)
    
    // Step 3: Check if footer exists
    IF body.contains(FOOTER_SIGNATURE) THEN
        SKIP with reason "footer already present"
    ENDIF
    
    // Step 4: Build new content (preserve all body content)
    newContent = frontmatter + body.trim() + "\n\n" + footer
    
    // Step 5: Validate
    IF newContent.length <= content.length THEN
        ERROR "new content smaller than original (data loss detected)"
    ENDIF
    
    // Step 6: Backup & Write
    IF NOT dryRun THEN
        createBackup(filePath, content)
        writeFile(filePath, newContent)
    ENDIF
    
    RETURN success
```

### Key Invariants

- **INVARIANT 1**: `newContent.length >= content.length` (never shrink)
- **INVARIANT 2**: `frontmatter` at start of both old and new content
- **INVARIANT 3**: All original body content preserved before footer
- **INVARIANT 4**: Backups created before ANY write

---

## Implementation Checklist

### Phase 1: Redesign (Priority: CRITICAL)

- [ ] Rewrite frontmatter parsing (extract lines 1-3 only)
- [ ] Rewrite body extraction (everything after frontmatter)
- [ ] Implement dry-run mode with diff output
- [ ] Add backup creation before modifications
- [ ] Implement footer-exists detection
- [ ] Add size validation (length check)

### Phase 2: Testing (Priority: CRITICAL)

- [ ] Test with issue templates (DoR/DoD preserved)
- [ ] Test with PR templates (acceptance criteria preserved)
- [ ] Test with README files (markdown structure intact)
- [ ] Test with agent specifications
- [ ] Dry-run test on 20 files (verify no changes)
- [ ] Run with --dry-run on all 510 files

### Phase 3: Validation (Priority: HIGH)

- [ ] Manual verification of sample files
- [ ] Schema validation of footers
- [ ] Duplicate footer detection
- [ ] Rollback testing (restore from backups)

### Phase 4: Deployment (Priority: MEDIUM)

- [ ] Document rollback procedure
- [ ] Create issue for phase 3 footer injection
- [ ] Set expectations for 510 files
- [ ] Plan batched execution (avoid mass failures)

---

## Success Criteria

✅ **Redesign Complete When:**

- [ ] Frontmatter-only parsing implemented
- [ ] Zero content loss on test files
- [ ] Dry-run mode produces correct output
- [ ] Backup/restore tested successfully
- [ ] 20+ manual verification passes

✅ **Ready for Phase 3 When:**

- [ ] All tests passing
- [ ] CI green
- [ ] Code review approved
- [ ] Rollback plan documented

---

## References

- **Script**: `scripts/inject-footers.js`, `.github/scripts/inject-footers.js`
- **Test Files**: `.github/ISSUE_TEMPLATE/*.md`, `.github/PULL_REQUEST_TEMPLATE/*.md`
- **Config**: `config/quirky-footers.yaml`, `config/footers.config.yaml`
- **Parent Issue**: #1486 (infrastructure cleanup)
- **Task Issue**: #1531 (Phase 3)

---

Maintained by the 🤖 LightSpeedWP Automation Team
