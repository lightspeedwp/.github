# Example: Multi-Column Application Form

## Scenario

A client wants a long application form made shorter by placing related fields in columns.

## Correct behaviour

- Use the Form Editor's layout/column controls where available instead of legacy Ready Classes.
- Check conditional logic before grouping fields into rows; hidden fields can break expected row balance.
- Keep long labels, consent text, and paragraph fields full width.
- Test mobile wrapping, validation errors, keyboard focus, and multi-page navigation if present.
- Treat migration away from Ready Classes on production forms as a staged change with visual regression checks.

## Safe output

Create a layout plan showing sections, field groups, mobile behaviour, and regression tests. Do not apply production layout changes without approval.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
