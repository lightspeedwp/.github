# Design Tokens & Naming Scheme Implementation Report

**Theme:** AI Block Theme Template  
**Branch:** `feat/new-patterns-parts-templates`  
**Date:** 2025-10-09  
**Maintainer:** LightSpeed WP

---
## 1. Objectives
Establish a consistent, extensible, and fluid design token system for colours, typography, and spacing across:
- `theme.json` presets (palette, fontSizes, spacingSizes)
- Section style variations (`/styles/block/section-*.json`)
- Block patterns & template parts (token references only)
- Editor UX (discoverable, predictable scales)

Key goals:
1. Semantic + systematic palette (neutral + accent families) with stable slugs.
2. Numeric, fluid typography scale avoiding hierarchy inversion at narrow / wide extremes.
3. Fluid spacing tokens (clamp-based) replacing ad-hoc pixel padding/gaps.
4. Section style variations leveraging only tokens (no ad-hoc hex / raw values) to preserve portability.
5. Low CSS specificity leveraging WordPress 6.6 cascade (`blocks.*`, `elements.*`).

---
## 2. Colour System
| Group | Slugs | Purpose |
|-------|-------|---------|
| Core semantic | `base`, `contrast`, `primary` | Background, text, brand CTA |
| Neutral scale | `neutral-0` → `neutral-900` | Surfaces, borders, subtle backgrounds, dark UI |
| Accent scale (cool) | `accent-100` → `accent-500` | Primary brand hue tints & tones |
| Accent scale (warm) | `accent-600` → `accent-900` | Secondary / supporting accent band |

**Guidelines**
- Patterns & sections reference only `var(--wp--preset--color--<slug>)` / `var:preset|color|<slug>`.
- No mixing of semantic & raw hex in patterns (future rebranding safe).
- High-contrast combos validated (contrast text on accent backgrounds; base on contrast, etc.).

---
## 3. Typography Scale (Fluid)
Numeric progressive scale with explicit min/max per size to prevent overlap.

| Slug | Label | Base Size | Fluid Min | Fluid Max | Typical Usage |
|------|-------|-----------|-----------|-----------|---------------|
| `font-size-100` | Tiny | 0.75rem | 0.7rem | 0.8rem | Fine print, meta micro-labels |
| `font-size-200` | Base | 1rem | 0.9rem | 1.05rem | Paragraph body |
| `font-size-300` | Small | 1.25rem | 1.1rem | 1.35rem | Lead paragraph / small subhead |
| `font-size-400` | Medium | 1.5rem | 1.3rem | 1.7rem | H5/H6 / emphasized text |
| `font-size-500` | Large | 2rem | 1.7rem | 2.2rem | H4 / feature headings |
| `font-size-600` | X-Large | 2.5rem | 2.1rem | 2.8rem | H3 |
| `font-size-700` | Huge | 3rem | 2.4rem | 3.3rem | H2 / hero sub-heading |
| `font-size-800` | Gigantic | 4rem | 3.2rem | 4.5rem | Hero H1 (large) |
| `font-size-900` | Colossal | 5rem | 3.8rem | 5.5rem | Hero H1 (primary) |

**Why explicit fluid bounds?** Avoids default WP heuristics producing crossovers (H3 surpassing H2 at certain widths). Ensures monotonic scale from smallest to largest at all viewport sizes.

---
## 4. Spacing Scale (Fluid Tokens)
Fluid `clamp()` expressions balance mobile density and wide-screen comfort.

| Slug | Clamp Expression | Approx Mobile → Desktop | Use Case |
|------|------------------|-------------------------|----------|
| spacing-10 | clamp(0.25rem, 0.5vw, 0.5rem) | 4px → 8px | Micro gap (icon, chip) |
| spacing-20 | clamp(0.5rem, 1vw, 0.75rem) | 8px → 12px | Tight inline gaps |
| spacing-30 | clamp(0.75rem, 1.5vw, 1.25rem) | 12px → 20px | Small padding / card gap |
| spacing-40 | clamp(1rem, 2vw, 1.5rem) | 16px → 24px | Section inner gap / list spacing |
| spacing-50 | clamp(1.5rem, 3vw, 2rem) | 24px → 32px | Standard vertical rhythm |
| spacing-60 | clamp(2rem, 4vw, 3rem) | 32px → 48px | Large vertical padding |
| spacing-70 | clamp(2.5rem, 5vw, 3.5rem) | 40px → 56px | Feature band padding |
| spacing-80 | clamp(3rem, 6vw, 4rem) | 48px → 64px | Hero internal padding (base) |
| spacing-90 | clamp(3.5rem, 7vw, 4.5rem) | 56px → 72px | Tall hero / CTA band |
| spacing-100 | clamp(4rem, 8vw, 5rem) | 64px → 80px | Highest emphasis hero top/bottom |

**Rationale:** Step slopes (vw factors) increase with size to preserve perceived proportion across breakpoints. Smaller tokens remain near-fixed to avoid jitter in tight UI clusters.

---
## 5. Section Style Variations
Location: `/styles/block/section-*.json` (auto-registered WP 6.6 block style variations).

| Slug | Intent | Key Tokens |
|------|--------|------------|
| section-base | Default neutral surface | BG neutral-0, text contrast, pad spacing-60 |
| section-contrast | Inverted/dark band | BG contrast, text base, link primary |
| section-soft | Subtle muted | BG neutral-100, border neutral-300, headings font-size-400 |
| section-accent-primary | Brand highlight | BG accent-100, link contrast→accent-600 hover |
| section-accent-warm | Warm alt brand | BG accent-700, text base, buttons inverse |
| section-hero-light | Light hero | BG neutral-0, heading font-size-800/900, pad spacing-90/100 |
| section-hero-dark | Dark hero | BG neutral-800, text base, accent links |
| section-cta | High-impact CTA | BG primary, text base, internal gap spacing-40, buttons large |
| section-cards | Card grid container | BG neutral-0, blockGap spacing-40 |
| section-muted | Low emphasis info | BG neutral-200, subdued links accent-300 → accent-400 |

**Variation Principles**
- One purpose per variation (no multi-role mixes).
- Inner semantics (headings, links, buttons) tuned via `blocks.core/*` & `elements.link`.
- Only preset tokens: safe for future re-theming.

---
## 6. Fluid & Viewport Strategy
- Typography: rem-based min/max ensures accessibility (user zoom unaffected). No vh text sizing to avoid dynamic viewport shifts.
- Large vertical rhythms (hero sections) combine spacing tokens at upper bounds to approximate comfortable fold coverage without using fixed vh.
- No token uses pure vw without clamp to prevent extreme expansion on ultrawide screens.

---
## 7. Specificity & Cascade Compliance
Aligned with WP 6.6 low-specificity model:
- No `!important` used.
- Variation JSON: root colour / background only; targeted heading & link adjustments inside `blocks.*` / `elements.*`.
- Patterns avoid inline style overrides of tokenized attributes except where block UI requires explicit attribute (e.g. cover overlay dimRatio).

---
## 8. Migration Summary
| Aspect | Old | New |
|--------|-----|-----|
| Spacing token syntax | `var:preset|spacing|50` | `var:preset|spacing|spacing-50` |
| Colour white/black | `white` / `black` | `base` / `contrast` |
| Heading size in hero | ad-hoc clamp | `font-size-800` / `font-size-900` |
| Card gap | hard-coded px | spacing-30 / spacing-40 |

All pattern & part files updated for spacing token rename; hero & CTA patterns aligned to new scale.

---
## 9. Accessibility Considerations
- Minimum body size >= 0.9rem fluid bound prevents unreadable scaling.
- Contrast pairs tested (contrast on base, base on contrast, accent backgrounds with contrast or base text) meet AA for body text.
- Hierarchy preserved at every viewport: for all widths, `font-size-100 < … < font-size-900`.

---
## 10. Future Extension Points
| Category | Option | Notes |
|----------|--------|-------|
| Colours | semantic `success`, `warning`, `info` | Add as separate scales or single-step accents |
| Typography | Add `font-size-950` | For oversized marketing hero; maintain monotonic ordering |
| Spacing | Introduce negative tokens | Consider only if design requires consistent negative margins (rare) |
| Motion (future) | `transition-duration-*` custom tokens | Would live under `settings.custom.motion` |

---
## 11. Governance & Change Policy
- **Slug stability:** Changing values is allowed; renaming slugs is a breaking change requiring migration tooling.
- **Review checklist for new tokens:** Contrast check, fluid bounds test (320px / 1440px / 1920px), hierarchy diff.
- **Deprecation:** Mark in CHANGELOG and maintain alias for ≥1 minor release if removal required.

---
## 12. QA Checklist (Executed)
- [x] Monotonic typography scale across 320px–1920px.
- [x] Spacing clamps produce no overlaps or regressions (spacing-40 < spacing-50 at all widths).
- [x] Section variations render unique purpose without style collisions nested two levels deep.
- [x] Patterns reference only token slugs (grep audit passed).
- [x] No inline hex in new or updated patterns (palette tokens only).

---
## 13. Editor Guidance (Author UX)
| Scenario | Recommended Action |
|----------|--------------------|
| New marketing hero | Apply `section-hero-light` or `section-hero-dark` + use heading at `font-size-800/900`. |
| Subtle info band | Use `section-soft` or `section-muted`. |
| Primary CTA stripe | Use `section-cta` + Buttons block (default style). |
| Card grid page segment | Wrap Query Loop in Group with `section-cards`. |
| Dark mode emphasis area | Use `section-contrast` for inversion. |

---
## 14. Tooling / Scripts
Migration assistance (spacing token rename):
```bash
grep -RIl 'var:preset|spacing|[0-9][0-9]' patterns parts | while read -r f; do
  sed -i.bak -E 's/var:preset\|spacing\|([0-9]{2,3})/var:preset|spacing|spacing-\1/g' "$f"
  echo "Updated $f"
done
```
Remove backups when satisfied:
```bash
find patterns parts -name '*.bak' -delete
```

---
## 15. Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Existing content referencing old spacing slugs outside patterns | Provide optional alias map via custom CSS variables for one release cycle. |
| Overly compressed hero on very tall but narrow devices | Consider future conditional min-height using `min(100vh, clamp(...))`. |
| Editors apply multiple section variations nested excessively | Document best practice + Site Editor training notes. |

---
## 16. Changelog Entry (Proposed)
```
feat: adopt standardized semantic & systematic tokens (colour, typography, spacing); add section style variations; update patterns & parts to fluid scale.
```

---
## 17. Approval
- Design Lead: _Pending_
- Engineering Review: _Pending_
- Accessibility Review: _Pending_

---
**End of Report**