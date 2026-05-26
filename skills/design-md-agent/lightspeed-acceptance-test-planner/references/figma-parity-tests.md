# Figma Parity Tests

Check:

- Figma variables map to theme.json tokens
- colour tokens match approved names and values
- typography styles map to WordPress presets
- spacing scale maps to WordPress spacing presets
- components map to WordPress blocks or patterns
- Figma sections map to WordPress patterns/templates
- light and dark modes are represented
- mobile states match approved responsive intent
- focus and hover states are implemented
- accessibility states are visible and testable

## Output fields

| Field | Description |
|---|---|
| Figma source | Page/frame/component/variable reference |
| WordPress target | theme.json, block, pattern, template or CSS file |
| Expected behaviour | Approved design intent |
| Test result | Pass, fail, not tested, needs clarification |
