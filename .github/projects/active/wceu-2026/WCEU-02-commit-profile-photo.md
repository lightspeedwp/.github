---
title: "[WCEU-02] Commit profile photo to assets"
description: "Commit profile photo to WCEU 2026 assets"
created_date: "2026-05-29"
file_type: documentation
---

# [WCEU-02] Commit profile photo to assets

**Title**: Commit profile photo to `wceu-2026/assets/ash-shaw-profile.jpg`
**Priority**: Critical (NOW — next 6 hours)
**Status**: TODO
**Due**: May 29, 2026 (today, ASAP)
**Assignee**: Claude
**Parent**: WCEU 2026 Talk Preparation

---

## Overview

Commit Ash Shaw's profile photo to the repository assets folder. This photo will be used in Slide 2 (Speaker Introduction).

---

## Deliverable

**File**: `wceu-2026/assets/ash-shaw-profile.jpg`

**Photo Requirements**:

- Format: JPG (optimized for web)
- Dimensions: ~400x500px (portrait orientation)
- Quality: High-resolution headshot
- Usage: Slide 2 ("Meet the Speaker") in WCEU 2026 presentation
- Attribution: To be referenced in slide and NotebookLM sources

---

## Tasks

- [ ] Confirm photo from user (attached to initial prompt)
- [ ] Optimize for web (resize if needed, compress without quality loss)
- [ ] Create `wceu-2026/assets/` folder if not exists
- [ ] Commit photo as `ash-shaw-profile.jpg`
- [ ] Add to `.gitignore` exemption (if applicable) or include in tracking
- [ ] Document location in NotebookLM sources for Slide 2 reference

---

## Acceptance Criteria

- [ ] Photo committed to `wceu-2026/assets/ash-shaw-profile.jpg`
- [ ] File is JPG format, optimized for web
- [ ] Commit message includes attribution and reference to Slide 2
- [ ] Photo is discoverable by NotebookLM and referenced in sources-index.md
- [ ] Path is correct and accessible in GitHub UI

---

## Commit Message Template

```
feat(wceu-2026): Add Ash Shaw profile photo to assets

- Commit profile photo for Slide 2 (Speaker Introduction)
- File: wceu-2026/assets/ash-shaw-profile.jpg
- Usage: WCEU 2026 presentation, "Meet the Speaker" slide
- Format: JPG, optimized for web, 400x500px

Related: WCEU 2026 Talk Preparation (#parent-issue)
```

---

## Related Tasks

- **Previous**: [WCEU-01] Create NotebookLM sources index
- **Next**: [WCEU-03] Run NotebookLM session
- **Depends on**: Photo provided by Ash Shaw
- **Blocks**: [WCEU-06] Create speaker intro slide

---

**Status**: TODO
**Effort**: 15 minutes
**Created**: 2026-05-29
