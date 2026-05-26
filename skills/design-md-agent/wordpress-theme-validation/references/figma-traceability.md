# Figma Traceability Guidance

When Figma evidence is available, try to relate implementation values to one of these source shapes:

- Figma variables -> `theme.json` presets or custom settings
- Figma text styles -> typography presets or semantic typography tokens
- Figma color styles or semantic variables -> palette entries, semantic custom color tokens, or variation-specific values
- Figma component patterns -> block styles, section styles, style variations, or reusable theme surfaces
- Figma layout patterns -> spacing scales, layout constraints, section spacing, and container behavior

If the implementation uses a value that appears visually correct but has no reliable Figma or approved-system mapping, classify it as Inferred or Drift rather than Verified.

If a Figma source supports only one part of a mapping, say what it supports and what remains unverified.
