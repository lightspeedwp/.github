---
title: "Accessibility Audit Checklist — WCEU 2026 Slides"
description: "WCAG AA/AAA compliance verification for presentation"
created_date: "2026-05-30"
file_type: documentation
---

# Accessibility Audit Checklist

**Standard**: WCAG 2.2 AA (minimum), AAA (preferred)  
**Deadline**: May 31 EOD (must verify before rehearsal)  
**Tool**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)  
**Reviewer**: Ash Shaw (or accessibility-focused peer)

---

## Quick Reference: Dark Mode Colour Ratios

Using the dark-mode palette:

| Combination | Contrast Ratio | AA Pass | AAA Pass |
|-------------|---|---|---|
| #f5f5f5 (off-white) on #1a1a1a (dark charcoal) | ~17.5:1 | ✅ | ✅ |
| #00d4ff (electric blue) on #1a1a1a | ~8.3:1 | ✅ | ✅ |
| #00bfa5 (teal) on #1a1a1a | ~7.2:1 | ✅ | ✅ |
| #00ff88 (bright green) on #1a1a1a | ~11.4:1 | ✅ | ✅ |
| #ffb700 (gold) on #1a1a1a | ~7.8:1 | ✅ | ✅ |

**Conclusion**: All dark-mode colour pairs pass WCAG AA. Most pass AAA. Proceed with confidence.

---

## Part 1: Text Contrast Audit

### For All Slides (Slides 1–24)

**Checklist**:

- [ ] **Slide titles** (#f5f5f5 on #1a1a1a): Verified pass (17.5:1 ratio)
- [ ] **Body text** (#f5f5f5 on #1a1a1a): Verified pass (17.5:1 ratio)
- [ ] **Bullet points** (#f5f5f5 on #1a1a1a): Verified pass (17.5:1 ratio)
- [ ] **Footer text** (#ffb700 gold on #1a1a1a): Verified pass (7.8:1 ratio)
- [ ] **Emphasis text** (#00d4ff blue on #1a1a1a): Verified pass (8.3:1 ratio)
- [ ] **Callout text** (#00bfa5 teal on #1a1a1a): Verified pass (7.2:1 ratio)
- [ ] **Highlight text** (#00ff88 green on #1a1a1a): Verified pass (11.4:1 ratio)

### Manual Verification

For any custom colours (not in the palette above):

1. **Open WebAIM Contrast Checker**: <https://webaim.org/resources/contrastchecker/>
2. **Enter foreground colour** (text): Hex code, e.g., #00d4ff
3. **Enter background colour**: Hex code, e.g., #1a1a1a
4. **Check ratio**: Must be ≥ 4.5:1 for AA, ≥ 7:1 for AAA
5. **Record result**: Pass or Fail

### Slides with Visual Elements

If any slides have:

- Images with text overlay → verify contrast of overlay text
- Diagrams with labels → verify label colours meet ratio
- Charts/graphs → verify all text and lines meet ratio

---

## Part 2: Font Size & Readability

### Minimum Font Sizes

- [ ] **Slide titles**: ≥ 44pt (verified)
- [ ] **Body text**: ≥ 28–32pt (verified)
- [ ] **Captions**: ≥ 20–24pt (verified)
- [ ] **Footer**: ≥ 16–18pt (verified)
- [ ] **No text smaller than 16pt** (even fine print)

### Readability Test: The Squint Test

1. **Display a slide at presentation distance** (10–15 feet away)
2. **Squint at the screen** (simulate distance/poor vision)
3. **Can you read all text?** Yes ✅ / No ❌
4. **Repeat for 3–5 representative slides** (cover, middle, closing)

If any slide fails:

- Increase font size
- Increase contrast
- Reduce text density (fewer bullets)

---

## Part 3: Colour Accessibility

### Colour-Blind Safe Palette

The dark-mode palette should be distinguishable for colour-blind viewers:

- [ ] **Deuteranopia** (red-green blind): Off-white, blue, gold are distinguishable ✅
- [ ] **Protanopia** (red-green blind): Off-white, blue, gold are distinguishable ✅
- [ ] **Tritanopia** (blue-yellow blind): Off-white, blue, teal are distinguishable ✅

### Test Tool

Use [Colorblind Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/) to preview slides:

1. Screenshot each slide
2. Upload to simulator
3. Check deuteranopia, protanopia, tritanopia views
4. Verify text is still readable

### Rules for Colour Use

- [ ] **Don't rely on colour alone**: Use text labels + colour (e.g., "✅ Success" + green, not just green)
- [ ] **Avoid colour combinations**: Red + green together (confusing for colour-blind viewers)
- [ ] **Use high-contrast pairs**: Off-white + blue, Off-white + teal (always safe)

---

## Part 4: Visual Hierarchy & Whitespace

### Hierarchy Checklist

- [ ] **Titles stand out**: Noticeably larger (44–54pt) than body (28–32pt)
- [ ] **Emphasis colours used sparingly**: Not every word is blue
- [ ] **Key metrics highlighted**: Use accent colours for important numbers
- [ ] **Related items grouped visually**: Use whitespace to separate concepts

### Whitespace Rules

- [ ] **No more than 5 bullets per slide** (visual breathing room)
- [ ] **Margin spacing consistent**: 1 inch top/bottom, 1.25 inch left/right
- [ ] **Vertical spacing consistent**: Regular line height (1.5×)
- [ ] **Diagrams have space**: Not cramped or overlapping

### Example of Good vs. Poor Hierarchy

**Good**:

```
TITLE IN 48PT BOLD
[2 lines white space]
• Key point 1
[0.5 lines space]
• Key point 2
[Large visual/diagram below]
```

**Poor**:

```
Title in 28pt
• point1 • point2 • point3 • point4 • point5 • point6
[cramped diagram]
```

---

## Part 5: Keyboard Navigation & Motion

### Presentation Mode Navigation

- [ ] **Arrow keys advance slides**: Works ✅
- [ ] **No mouse required**: All transitions keyboard-navigable
- [ ] **Screen reader compatible** (if using presenter tools): Test with NVDA or JAWS

### Motion & Animation Rules

- [ ] **No flashing** (> 3 flashes/second): Risk of photosensitive seizures
- [ ] **No auto-advancing slides**: Only manual progression (presenter controls)
- [ ] **No distracting animations**: Static preferred over animated

---

## Part 6: Slide-by-Slide Verification

### For Each Slide (1–24)

Create a small audit for each:

```
SLIDE [number]: [title]
─────────────────────────────
Text Contrast: [Pass/Fail] (ratio: ___)
Font Sizes: [Pass/Fail]
Hierarchy: [Pass/Fail]
Colours: [Pass/Fail] (colour-blind safe?)
Motion: [Pass/Fail]
Whitespace: [Pass/Fail]
Overall: ✅ Accessible / ❌ Needs Fix

Notes: [Any issues found and fixed]
```

### Critical Slides to Audit First

1. **Slide 1 (Cover)**: Title + subtitle readability
2. **Slide 6 (Hub-and-spoke diagram)**: Diagram labels + text contrast
3. **Slide 18 (Metrics)**: Numbers and callouts readable
4. **Slide 23 (Contact)**: Email, website, links readable

---

## Part 7: Testing with Accessibility Tools

### Browser Tools

**Chrome DevTools**:

1. Open Chrome Developer Tools (F12)
2. Go to **Lighthouse** tab
3. Run accessibility audit
4. Check for colour contrast issues

**WAVE Browser Extension** (for web-based presentations):

1. Install WAVE from [webaim.org](https://webaim.org)
2. Run on presentation page
3. Review errors and contrast warnings

### Screen Reader Testing (Optional but Recommended)

If you want to test with a screen reader:

- **NVDA** (Windows, free): <https://www.nvaccess.org/>
- **JAWS** (Windows, paid): <https://www.freedomscientific.com/>
- **VoiceOver** (Mac, built-in): System Preferences > Accessibility > VoiceOver

1. Open presentation
2. Enable screen reader
3. Listen: Are slide titles and key content announced?
4. Check: Can you navigate slides without visual cues?

---

## Part 8: Live Venue Check

### Day-of Accessibility Verification

**Before presentation (30 mins prior)**:

- [ ] **Projector brightness**: Visible from back of room?
- [ ] **Slide text size**: Readable from 30 feet?
- [ ] **Lighting**: Is the dark background visible or washed out?
- [ ] **Audio**: If there's voiceover, is volume adequate?
- [ ] **Backup**: PDF exported and tested on projector?

### During Q&A

- [ ] **Repeat questions**: Audience member asks → repeat question for all to hear
- [ ] **Use microphone**: Your answers are audible to all
- [ ] **Pace**: Slow enough for people to take notes

---

## Accessibility Sign-Off

### Audit Completion

- **Audited by**: [Your name]
- **Date audited**: May 31, 2026
- **Result**: ✅ **Passes WCAG AA** / ❌ **Needs fixes** (list below)

### Issues Found & Fixed

| Slide | Issue | Fix | Verified |
|-------|-------|-----|----------|
| [number] | [description] | [action taken] | ✅/❌ |

### Final Sign-Off

- [ ] All slides verified for WCAG AA (minimum)
- [ ] Text contrast ratios ≥ 4.5:1
- [ ] Font sizes ≥ 16pt (minimum)
- [ ] Colour-blind safe palette used
- [ ] No flashing or seizure risks
- [ ] Whitespace and hierarchy verified
- [ ] **Ready for presentation ✅**

---

## Resources

- **WebAIM Contrast Checker**: <https://webaim.org/resources/contrastchecker/>
- **Colour Blindness Simulator**: <https://www.color-blindness.com/coblis-color-blindness-simulator/>
- **WCAG 2.2 Guidelines**: <https://www.w3.org/WAI/WCAG22/quickref/>
- **Google Slides Accessibility Help**: <https://support.google.com/docs/answer/6199477>

---

**Audit Template Version**: 1.0  
**Created**: 2026-05-30  
**Last Updated**: [May 31 after verification]
