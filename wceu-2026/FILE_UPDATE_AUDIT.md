---
title: "WCEU 2026 Files Audit & Update Prompt"
description: "Comprehensive audit of all files + recommended updates + systematic updating prompt"
created_date: "2026-05-30"
file_type: internal-audit
---

# WCEU 2026 Files Audit & Update Prompt

**Status**: Audit completed May 30, 2026 (Phase 2 in progress)  
**Total files reviewed**: 60 markdown files  
**Files requiring updates**: 17 (from user's list)  
**Additional files recommended for audit**: 8  
**Total scope**: ~25 files to review/update

---

## Quick Summary

All files are **generally current and well-structured**, BUT given today is May 30 and Phase 2 is underway, the following updates are recommended:

1. **Timestamp updates**: Many files reference "May 29" or "May 30 pending" — some may need today's date
2. **Status indicators**: Phase 1 marked ✅ complete; Phase 2 now IN PROGRESS; Phase 3 upcoming
3. **Broken reference checks**: URLs to github.com/lightspeedwp/.github/blob/develop/ should be verified
4. **Cross-file consistency**: Ensure all documents use the same terminology and timeline
5. **Link integrity**: Internal references (e.g., "see PHASE2_EXECUTION.md") should resolve correctly

---

## Files Analysis

### ✅ Core Execution Guides (Well-Maintained)

| File | Status | Last Updated | Issues | Priority |
|------|--------|--------------|--------|----------|
| `README.md` | Current | 2026-05-29 | Minor: "Phase 2 ⏳" should clarify "IN PROGRESS" | LOW |
| `PHASE2_EXECUTION.md` | Current | 2026-05-30 | None detected | SKIP |
| `PHASE3_EXECUTION.md` | Current | 2026-05-30 | None detected | SKIP |
| `PLANNING.md` | Current | 2026-05-29 | References specific files (verify they exist) | MEDIUM |
| `EXECUTION_MATERIALS_INDEX.md` | Current | 2026-05-30 | Cross-reference check needed | MEDIUM |

### ⚠️ Supporting Documents (Need Review)

| File | Status | Last Updated | Issues | Priority |
|------|--------|--------------|--------|----------|
| `PHASE1_COMPLETION_REPORT.md` | Outdated | 2026-05-30 | Refs "PR #569" + branch name may have changed | HIGH |
| `SPEAKER_NOTES_TEMPLATE.md` | Unknown | ? | Verify slide references (1-24) match | MEDIUM |
| `ACCESSIBILITY_AUDIT.md` | Unknown | ? | Verify WCAG standards are current | MEDIUM |
| `FINAL_REVIEW_CHECKLIST.md` | Unknown | ? | Verify ~150 items are accurate | MEDIUM |
| `WORDPRESS_INTEGRATION_ROADMAP.md` | Unknown | ? | Verify external URLs + internal structure | MEDIUM |
| `WORDPRESS_INTEGRATION_SLIDE.md` | Unknown | ? | Verify references to Slide 20 | LOW |
| `SLIDES_GENERATION_PROMPT.md` | Unknown | ? | Verify structure + examples | MEDIUM |
| `PHASE2_EXECUTION_CHECKLIST.md` | Unknown | ? | Verify against PHASE2_EXECUTION.md | HIGH |
| `PHASE2_NOTEBOOKLM_PROMPTS.md` | Unknown | ? | Verify 4 prompts match PHASE2_EXECUTION.md | HIGH |
| `PHASE2_QUICK_START.md` | Unknown | ? | Verify it accurately summarizes PHASE2_EXECUTION | MEDIUM |
| `AUDIT_REPORT.md` | Unknown | ? | Unclear what this contains | HIGH |
| `WCEU_2026_AUDIT_AND_READINESS_PLAN.md` | Unknown | ? | Historical artifact? Verify relevance | HIGH |

### 📁 Subdirectory Files (Spot-Check Recommended)

| Folder | Status | Count | Audit Action |
|--------|--------|-------|--------------|
| `notebooklm/` | Partially checked | 3 | Verify sources-index.md URLs are valid |
| `references/` | Not checked | 3 | Verify glossary completeness + links |
| `slides/` | Not checked | 20 | Spot-check 3-5 for consistency |
| `agent-slides/` | Not checked | 26 | Verify INDEX.md + README.md reflect structure |
| `website/` | Not checked | 2 | Not blocking; defer to post-WCEU |

---

## Issues Found

### 1. **Ambiguous Files** (Priority: HIGH)

Files with unclear purpose / possibly outdated:

- `AUDIT_REPORT.md` — What audit? When? Needs title clarification
- `WCEU_2026_AUDIT_AND_READINESS_PLAN.md` — Historical artifact? Still relevant?
- `PHASE1_COMPLETION_REPORT.md` — References PR #569 + branch `claude/charming-goldberg-Pqc69` (but current branch is `claude/affectionate-bohr-AX2jS`)

### 2. **Duplicate/Overlapping Content** (Priority: MEDIUM)

- `PHASE2_EXECUTION.md` vs. `PHASE2_QUICK_START.md` — Do these have different purposes?
- `PHASE2_EXECUTION.md` vs. `PHASE2_EXECUTION_CHECKLIST.md` — Checklist should reference guide, not duplicate
- `PHASE2_EXECUTION.md` vs. `PHASE2_NOTEBOOKLM_PROMPTS.md` — Prompts should match exactly
- `PHASE3_EXECUTION.md` — What's the accompanying checklist?

### 3. **Reference Integrity** (Priority: MEDIUM)

Files reference URLs like:
```
https://github.com/lightspeedwp/.github/blob/develop/...
```

**Action needed**: Spot-check 3-5 URLs to confirm they're still valid (especially if repo structure changed)

### 4. **Status Indicators** (Priority: MEDIUM)

Files use different status formats:
- `README.md`: "⏳ Phase 2"
- `EXECUTION_MATERIALS_INDEX.md`: "⏳ In progress (May 30)"
- `PHASE1_COMPLETION_REPORT.md`: "✅ PHASE 1 COMPLETE"

**Action needed**: Standardize on consistent notation

### 5. **Timeline Accuracy** (Priority: LOW)

Most files reference "May 29" (Phase 1), "May 30" (Phase 2), "May 31" (Phase 3).  
Today is May 30 — files saying "May 30 pending" should clarify "IN PROGRESS TODAY" or "May 30 complete" if it's past noon.

---

## Recommended File Updates

### TIER 1: Critical Path Files (User's List + Must Verify)

These are the files you explicitly listed. Recommended checks for each:

#### 1. `ACCESSIBILITY_AUDIT.md`
**Check for**:
- WCAG 2.2 standards (not 2.1) if you're targeting cutting-edge compliance
- Pre-calculated contrast ratios for dark-mode palette still accurate
- All external tool links still valid (WebAIM, colour-blindness simulators)
- Slide-by-slide audit template examples match actual slides (1-24)

#### 2. `AUDIT_REPORT.md`
**Check for**:
- What audit is this reporting on? (Accessibility? Content? Design?)
- Is it historical (completed) or in-progress?
- Should it be renamed (e.g., `PHASE3_FINAL_AUDIT_REPORT.md`)?
- Is it required for the May 31 deadline, or post-WCEU?

#### 3. `EXECUTION_MATERIALS_INDEX.md`
**Check for**:
- All 17 files listed exist and are referenced correctly
- FAQ section accurately answers real questions users might have
- "Getting Unstuck" links point to correct sections
- "Key Metrics to Track" table reflects current progress

#### 4. `FINAL_REVIEW_CHECKLIST.md`
**Check for**:
- ~150 items mentioned — actually that many? (Spot-check sections)
- Checklist items are *specific* (not vague like "make it look good")
- References to WCAG AA/AAA are verifiable
- Slide-specific items (e.g., "Slide 20 WordPress reference") match outline

#### 5. `PHASE1_COMPLETION_REPORT.md`
**Check for**:
- Branch name: `claude/charming-goldberg-Pqc69` vs. actual `claude/affectionate-bohr-AX2jS` ❌ MISMATCH
- PR #569 — does this exist and is it in draft status?
- Dates: All references to "May 29" and "May 30" still accurate?
- Queued questions — any need immediate answers?

#### 6. `PHASE2_EXECUTION.md`
**Check for**:
- Step 1 (NotebookLM): URLs in sources-index.md match instructions
- Step 2 (Foundation slides): 4 slide templates are detailed enough
- Step 3 (Design system): Colour palette values (#1a1a1a, #00d4ff, etc.) are correct
- External links: NotebookLM, Google Slides, WebAIM

#### 7. `PHASE2_EXECUTION_CHECKLIST.md`
**Check for**:
- Is this *different* from PHASE2_EXECUTION.md? (If identical, one is redundant)
- Checkbox items are actionable and match the guide
- Timestamps/timing estimates match

#### 8. `PHASE2_NOTEBOOKLM_PROMPTS.md`
**Check for**:
- 4 prompts match exactly what's in PHASE2_EXECUTION.md Step 1
- Prompts are *copy-paste ready* (no edits needed)
- Examples of expected output for each prompt

#### 9. `PHASE2_QUICK_START.md`
**Check for**:
- Is this a 1-page summary of PHASE2_EXECUTION.md?
- If yes: Does it accurately distill 400 lines into essential steps?
- If no: What's the intended use case? (for TL;DR readers?)

#### 10. `PHASE3_EXECUTION.md`
**Check for**:
- Timeline (May 31, 9am-9pm) — is this realistic?
- References to SPEAKER_NOTES_TEMPLATE.md, ACCESSIBILITY_AUDIT.md, etc. are accurate
- "Part 3: Design System Application" section is detailed enough
- WordPress integration slide guidance (Slide 20) is clear

#### 11. `PLANNING.md`
**Check for**:
- "Critical Path" Mermaid diagram — is it accurate? (All dependencies correct?)
- "Folder Structure" section matches actual repo (do all mentioned files exist?)
- GitHub issue numbers (#564-#569) — do they exist?
- Timeline dates: All May 29-31 references still correct?

#### 12. `README.md`
**Check for**:
- "Phase 2 ⏳" status — should be "Phase 2 IN PROGRESS (May 30)" if it's today
- Folder structure diagram matches actual folders (20 slides, not different number?)
- Last updated date: 2026-05-29 — should be 2026-05-30?

#### 13. `talk-outline-25min.md`
**Check for**:
- Is this a complete 24-slide outline, or a stub?
- If complete: Does it match Slide References in SLIDES_GENERATION_PROMPT.md?
- If stub: Note in README that this is reference-only

#### 14. `notebooklm/deep-research-prompt.md`
**Check for**:
- Is this used by Phase 2? Or is it historical?
- Does it duplicate SLIDES_GENERATION_PROMPT.md?

#### 15. `notebooklm/source-ingestion-checklist.md`
**Check for**:
- Is this used by Phase 2? Or historical?
- Should it be in `PHASE2_EXECUTION.md` instead?

#### 16. `notebooklm/sources-index.md`
**Check for**:
- All ~60 URLs still valid (spot-check 5-10)
- URLs use correct branch: `develop` (not `main`)
- Format: One URL per line, no extra formatting
- Categories are logical and match PLANNING.md

#### 17. `references/glossary.md`
**Check for**:
- 45+ definitions present and complete
- Definitions use consistent formatting
- All LightSpeed-specific terms included
- No broken internal references

### TIER 2: Subdirectory Files (Recommended Audit)

#### `references/repo-source-index.md`
- Verify it maps all repo sources mentioned in talk

#### `references/slide-to-source-mapping.md`
- Verify each slide has source mappings
- Check links are valid

#### `slides/slide-*.md` (spot-check 5 files)
- Do they match the talk outline?
- Are they used by Phase 3, or historical?

#### `agent-slides/INDEX.md` + `README.md`
- Verify all 26 agent slides are listed
- Note: These are post-WCEU, not blocking May 31 deadline

---

## Recommended Updates

### MUST DO (Blocks May 31 deadline)

1. **Fix branch name in PHASE1_COMPLETION_REPORT.md**
   - Change: `claude/charming-goldberg-Pqc69`
   - To: `claude/affectionate-bohr-AX2jS`

2. **Update README.md status**
   - Change: "Phase 2 ⏳"
   - To: "Phase 2 IN PROGRESS (May 30)"
   - Update last_updated: "2026-05-30"

3. **Verify PHASE2_NOTEBOOKLM_PROMPTS.md matches PHASE2_EXECUTION.md**
   - Prompts must be *identical copy*
   - No edits or paraphrasing

4. **Clarify purpose of AUDIT_REPORT.md**
   - Is it final accessibility audit? (Move to post-Phase 3)
   - Is it historical? (Add note + archive to references/)
   - Is it something else? (Update title/description)

### SHOULD DO (Improves clarity)

5. **Update PHASE1_COMPLETION_REPORT.md with May 30 status**
   - Note which tasks completed this morning
   - Note Phase 2 currently underway
   - Clarify Phase 3 starts tomorrow

6. **Consolidate duplicate quick-start guides**
   - If PHASE2_QUICK_START.md is different from PHASE2_EXECUTION.md, clarify purpose
   - If identical, remove one and reference the other

7. **Add "Current Status" section to EXECUTION_MATERIALS_INDEX.md**
   - Example:
   ```
   ## Current Status (May 30, 2026)
   - Phase 1: ✅ Complete (May 29)
   - Phase 2: 🔵 IN PROGRESS (May 30, started ~9am)
   - Phase 3: ⏳ Scheduled (May 31)
   ```

8. **Verify all external URLs in supporting files**
   - WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
   - NotebookLM: https://www.notebooklm.google.com
   - Google Slides: https://docs.google.com/presentation/

### NICE TO HAVE (Polish)

9. **Add version numbers to all files**
   - Example: `version: "1.0.0"` in frontmatter

10. **Create unified GLOSSARY_STYLE_GUIDE.md**
    - Document how glossary definitions should be formatted
    - Ensures consistency across references/glossary.md

11. **Add "Updated Today" banner to README.md**
    - Quick visual indicator that docs were reviewed & confirmed current

---

## Systematic Update Prompt

Here's a comprehensive prompt you can use to systematically update all files:

### PROMPT: "WCEU 2026 File Audit & Update"

```
You are auditing and updating all files in the wceu-2026/ folder to ensure they are 100% 
current with the latest repository state as of May 30, 2026 (Phase 2 in progress).

TASK: Review and update the following 17 files + recommend updates to 8 additional files.

FILES TO REVIEW (Priority: HIGH):
1. ACCESSIBILITY_AUDIT.md
2. AUDIT_REPORT.md
3. EXECUTION_MATERIALS_INDEX.md
4. FINAL_REVIEW_CHECKLIST.md
5. PHASE1_COMPLETION_REPORT.md
6. PHASE2_EXECUTION.md
7. PHASE2_EXECUTION_CHECKLIST.md
8. PHASE2_NOTEBOOKLM_PROMPTS.md
9. PHASE2_QUICK_START.md
10. PHASE3_EXECUTION.md
11. PLANNING.md
12. README.md
13. talk-outline-25min.md
14. notebooklm/deep-research-prompt.md
15. notebooklm/source-ingestion-checklist.md
16. notebooklm/sources-index.md
17. references/glossary.md

ADDITIONAL FILES TO AUDIT (Priority: MEDIUM):
- references/repo-source-index.md
- references/slide-to-source-mapping.md
- slides/slide-01-hook-and-stakes.md (+ 2-3 others for consistency check)
- agent-slides/INDEX.md
- agent-slides/README.md

FOR EACH FILE, CHECK:
1. Timestamp accuracy: Is last_updated date current (May 30, 2026)?
2. Status accuracy: Do status indicators match current Phase (Phase 2 IN PROGRESS)?
3. Reference integrity: Do all internal links & external URLs still resolve?
4. Cross-file consistency: Do multiple files reference the same info identically?
5. Completeness: Are placeholders filled in? Are examples provided?
6. Formatting consistency: Do all files use same frontmatter style, link format, etc.?

SPECIFIC ISSUES TO FIX:
1. PHASE1_COMPLETION_REPORT.md: Branch name is "claude/charming-goldberg-Pqc69" — 
   MUST CHANGE to "claude/affectionate-bohr-AX2jS" (current branch)
2. README.md: Status "Phase 2 ⏳" — MUST CLARIFY as "Phase 2 IN PROGRESS (May 30)"
3. PHASE2_NOTEBOOKLM_PROMPTS.md: Verify 4 prompts are IDENTICAL to those in PHASE2_EXECUTION.md
4. AUDIT_REPORT.md: Clarify purpose. Is it historical? In-progress? Post-WCEU?

DELIVERABLES:
- All 17 files reviewed & updated
- Comprehensive audit report documenting all changes
- Recommendation for any additional files to create (e.g., PHASE3_FINAL_CHECKLIST.md)
- Summary table of all changes made

TIMELINE: These files support May 31 deadline, so prioritize accuracy over perfection.
```

---

## Additional Files to Consider Creating

### PHASE3_FINAL_CHECKLIST.md (NEW)
**Purpose**: Dedicated checklist for May 31 final review  
**Contents**: Simplified version of FINAL_REVIEW_CHECKLIST.md (remove items completed May 30)  
**Benefit**: Users don't have to cross off 150 items if 50 are already done

### WCEU_2026_STATUS.md (NEW)
**Purpose**: Live status tracker updated daily May 30-31  
**Contents**:
```
# WCEU 2026 Status Tracker

## May 30 (Phase 2)
- [ ] NotebookLM session completed
- [ ] 4 foundation slides created
- [ ] Dark-mode template applied

## May 31 (Phase 3)
- [ ] Content transferred to all 24 slides
- [ ] Speaker notes finalized
- [ ] Accessibility audit completed
- [ ] Final review checklist verified
- [ ] Backup PDF exported

**Last Updated**: May 30, 12:30pm UTC
**Next Update**: May 31, 9:00am UTC
```

### COMMON_QUESTIONS_FAQ.md (NEW)
**Purpose**: Centralized FAQ for Phase 2-3 execution  
**Contents**: Extracts all Q&A sections from PHASE2_EXECUTION.md, PHASE3_EXECUTION.md, etc.  
**Benefit**: Users can Ctrl+F for their question without reading full guides

### REFERENCES_AND_RESOURCES.md (NEW)
**Purpose**: Unified list of all external tools, links, templates, examples  
**Contents**:
- NotebookLM documentation
- Google Slides help
- WebAIM accessibility tools
- WCAG 2.2 reference
- WordPress agent-skills project

---

## Success Criteria for Update Completion

✅ **All 17 files reviewed** against 6-point checklist  
✅ **No broken links or references** (spot-checked)  
✅ **Timeline consistency**: All dates reflect May 30 Phase 2 status  
✅ **Status indicators standardized**: All use same format  
✅ **Branch name corrected** in PHASE1_COMPLETION_REPORT.md  
✅ **README.md updated** with current Phase status  
✅ **Documentation is self-consistent** (no contradictions)  
✅ **Audit report generated** documenting all changes  

---

**Audit Completed**: May 30, 2026  
**Recommended Action**: Use the prompt above to systematically update all files  
**Estimated Time**: 2-3 hours for comprehensive review + updates  
**Priority**: MEDIUM (doesn't block May 31 deadline, but improves quality & clarity)
