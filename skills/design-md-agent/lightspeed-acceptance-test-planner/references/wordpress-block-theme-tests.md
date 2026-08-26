# WordPress Block Theme Tests

Check:

- theme.json settings and styles load correctly
- global styles match approved design intent
- templates render correctly on frontend
- templates are editable where intended
- template parts work across pages
- patterns are registered in correct categories
- patterns include safe placeholder content
- editor view matches frontend closely enough
- block spacing and layout constraints behave consistently
- light and dark mode styles work where required
- no unnecessary page builder dependencies are introduced

## Common test cases

| Area | Test |
|---|---|
| Header | Header renders across breakpoints and supports keyboard navigation |
| Footer | Footer links, policy links and contact routes work |
| Single page | Content width, heading hierarchy and CTA patterns render correctly |
| Archive | Query loops, pagination and empty states work |
| Patterns | Insert pattern, edit content, preview frontend, confirm responsive behaviour |
