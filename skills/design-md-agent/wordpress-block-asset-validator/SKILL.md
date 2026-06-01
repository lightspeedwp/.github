---
name: wordpress-block-asset-validator
description: validate wordpress block theme assets, block markup, pattern headers, template names, template part references and custom template registrations against official wordpress rules and project conventions. use when the user asks to check compliance, review generated assets, catch invalid metadata, or verify block theme files before delivery.
---

# WordPress Block Asset Validator

## Purpose

Validate WordPress block theme assets before they are treated as complete.

This skill reviews:

- pattern files and pattern metadata headers
- template part markup and naming
- template markup and hierarchy-aware filenames
- custom template file and `theme.json` alignment
- block style registrations and scoped CSS guidance
- section style guidance and section-scoped CSS
- handoff outputs from generator skills

It focuses on correctness, standards compliance, and low-risk delivery. It does not silently repair broken assets; it reports findings and suggests the smallest safe fix.

## Trigger Conditions

Use this skill when the request is about:

- checking whether a pattern, template part, template, or custom template is valid
- reviewing generated block theme asset code before commit or handoff
- catching missing headers, bad slugs, wrong file placement, or hierarchy mistakes
- confirming that a custom template is registered correctly
- reviewing block-style or section-style outputs for scope, naming, and preset usage
- validating the output from router or generator skills

Do not use this skill as the main asset generator. If the user needs a final asset built from scratch, route to the relevant specialist skill after validation planning.

## Inputs

Accept any mix of:

- a pattern PHP file
- template or template part HTML
- a `theme.json` fragment
- a parameter object from `wordpress-asset-parameter-generator`
- block style registration guidance
- section style CSS or `theme.json` guidance
- repository paths or folder structure
- brief notes about the intended asset purpose

If the user provides incomplete material, validate what is present and list the unverified areas clearly.

## Fast Decision Flow

1. Identify the asset type:
   - pattern
   - template part
   - template
   - custom template
   - block style
   - section style
   - mixed asset bundle
2. Inspect confirmed inputs only.
3. Apply official WordPress rules first.
4. Apply project conventions where they do not conflict with WordPress behavior.
5. Return findings ordered by severity.
6. Provide concrete fixes and any follow-on routing.

## Workflow

1. Determine the exact asset surface being checked.
2. Confirm the expected path or registration shape.
3. Validate required structure and metadata.
4. Check naming consistency and hierarchy alignment.
5. Flag unsupported or risky patterns.
6. Return:
   - findings
   - open questions
   - fix guidance
   - pass/fail summary

## Validation Rules

### Patterns

Check that:

- the file is intended for `/patterns/*.php`
- the pattern header exists
- the header uses supported keys only:
  - `Title`
  - `Slug`
  - `Categories`
  - `Description`
  - `Viewport Width`
  - `Inserter`
  - `Keywords`
  - `Block Types`
  - `Post Types`
  - `Template Types`
- the `Slug` is namespaced
- `Inserter` is appropriate for the pattern’s purpose
- categories prefer core categories unless there is a justified custom category
- the body is WordPress block markup appropriate for a theme pattern file

### Template Parts

Check that:

- the target path is `/parts/{slug}.html`
- the content is block markup
- the slug is stable and not inventing an unnecessary new shared part name
- any template-part call markup is structurally valid, for example:

```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
```

- wrapper tags are sensible and consistent with the part purpose
- any stated `area` does not drift from supported project conventions without reason

### Templates

Check that:

- the target path is `/templates/{name}.html`
- `index.html` exists where the task implies a complete block theme baseline
- the filename matches the intended hierarchy role
- the content is valid block markup
- included template parts and patterns use appropriate block syntax

### Custom Templates

Check that:

- the template has a matching file in `/templates`
- `theme.json` includes the corresponding `customTemplates` entry
- the entry includes `name`, `title`, and `postTypes` when known
- the chosen `postTypes` fit the request
- the template includes `core/post-content` when editable entry content must render

### Block Styles

Check that:

- the target block is clearly identified
- the style name is readable and the slug is lowercase hyphen-case
- the output stays scoped to a specific block or tightly related block family
- registration guidance matches the intended block-style workflow
- CSS selectors are scoped to the named style and block context
- presets or existing theme tokens are preferred over unnecessary hardcoded values

### Section Styles

Check that:

- the output is really for a reusable section or layout zone, not a single-block style
- section naming is stable and readable
- CSS or `theme.json` guidance stays scoped to the section treatment
- presets or existing theme tokens are preferred over unnecessary hardcoded values
- the output does not drift into full template composition

## Output Format

Present results in a compact review structure.

```markdown
## Findings
- Severity: high | medium | low
- Asset: /patterns/hero-default.php
- Issue: pattern slug is not namespaced
- Why it matters: unnamespaced slugs are not aligned with theme pattern conventions
- Fix: change `Slug: hero-default` to `Slug: theme-slug/hero-default`

## Open questions
- Is this meant to be hidden from the inserter?

## Summary
- Status: fail
- Ready for generator handoff after fixes: yes
```

If there are no issues, say so clearly and mention any unverified gaps.

## Severity Guide

- High: breaks WordPress behavior, makes the asset invalid, or risks incorrect theme behavior
- Medium: technically may work but conflicts with standards, conventions, or editor expectations
- Low: polish, consistency, or documentation gaps that should still be cleaned up

## Failure Modes And Escalation

Escalate briefly when:

- repository conventions conflict with official WordPress rules
- the user asks to approve a knowingly invalid structure
- too much source material is missing to verify a critical claim
- a requested fix belongs in plugin logic rather than theme asset structure

When blocked, validate the confirmed parts and clearly mark the unknowns instead of overstating confidence.

## Test Prompts

### Test prompt: broken pattern header

Prompt:
> Validate this pattern file. It uses `Slug: hero-default`, `Categories: utility`, and should be hidden from the inserter, but the file header does not include `Inserter`.

Expected behaviour:

- flag the missing `Inserter` field
- flag the unnamespaced slug
- question the custom category if no reason is given
- return specific fixes

### Test prompt: custom template alignment

Prompt:
> Review this Content Canvas custom template. I have `/templates/content-canvas.html` and a `theme.json` entry with `name` and `title`, but no `postTypes`.

Expected behaviour:

- validate what is present
- note that `postTypes` should be explicit when known
- check whether the template should include `core/post-content`

### Test prompt: block style review

Prompt:
> Validate this `core/button` style output. It registers `outline-accent`, but the CSS uses hardcoded colors and a generic `.button-outline` selector.

Expected behaviour:

- flag the weak selector scoping
- flag the hardcoded values if theme presets should be used instead
- return a concrete fix direction

### Test prompt: boundary case

Prompt:
> Create a new About page starter pattern and wire it into the theme.

Expected behaviour:

- do not act as the main generator
- state that this request belongs to the pattern generator
- optionally provide a validation checklist for the downstream output

## References

- `references/workflow.md`
- `references/wordpress-rules.md`
- `references/output-templates.md`
- `references/qa-rubric.md`
