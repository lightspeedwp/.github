# Accessibility Instructions (WCAG-focused)

## Objectives
Ensure Block Editor patterns and blocks meet **WCAG 2.2 AA** and deliver inclusive UX in both editor and front end.

## Must-do Checklist
- **Semantic HTML**: headings, lists, landmarks; avoid `div`-itis.
- **Keyboard support**: Tab/Shift+Tab order, focus visible, Esc for dialogs.
- **ARIA**: Use only when needed; do not override native semantics.
- **Colour & contrast**: Meet AA contrast; respect `prefers-reduced-motion`.
- **Images & media**: Always provide meaningful `alt` text; captions/transcripts as required.
- **Forms**: Labels linked to inputs; error messages with `aria-live` and programmatic focus.
- **Announcements**: Use polite `aria-live` for async updates.
- **Editor UX**: Provide meaningful block titles, descriptions, and `block.json` keywords.
- **RTL/i18n**: Test RTL; never concatenate translatable strings.

## Testing
- **axe-core**: No serious/critical violations.
- **Playwright**: Keyboard paths and focus order verified.
- **Manual**: Screen reader smoke test (NVDA/VoiceOver).
