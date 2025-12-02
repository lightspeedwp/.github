---
file_type: "instructions"
applyTo: ['**/*.html', '**/*.htm', '**/*.php']
description: "Guidelines for HTML template parts and block templates in any LightSpeed WordPress project."
author: "LightSpeedWP Team. Enforce WordPress HTML standards and semantic markup."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
title: "[Instructions] HTML Coding Standards"
contributors:
  - name: "Ash Shaw"
    github: "ashleyshaw"
  - name: "LightSpeedWP"
    github: "lightspeedwp"
version: "1.0.0"
permalink: "/instructions/html-template"
license: "MIT"
tags:
  - html
  - template
  - wordpress
  - accessibility
  - responsive
  - performance
categories:
  - documentation
  - instructions
  - guides
version: "1.0.0"
permalink: "/instructions/html-template"
license: "GPL-3.0"
file_type: "instructions"
mode: "agent"
---

# WordPress HTML Coding Standards

## Mission

Guide developers to write semantic, accessible HTML templates and PHP files that embed HTML.

## Language & Frameworks

- HTML5. When working within WordPress, leverage template parts, block patterns and `theme.json` to structure content.

## Project Structure

- Place template files under `templates/` or `partials/`.
- Use descriptive file names (e.g. `header.php`, `footer.php`, `archive.html`).

## Coding Standards

- Use valid, semantic markup; avoid presentational attributes (`align`, `bgcolor`).
- Ensure headings (`<h1>`–`<h6>`) follow a hierarchical order and reflect document structure.
- Wrap form controls with `<label>` elements and associate them using the `for` attribute.
- Provide `alt` attributes for images and only use ARIA attributes when native semantics are insufficient.
- Avoid inline styles and JavaScript; separate structure, presentation and behaviour.

## Testing & Quality

- Validate markup with tools such as the W3C HTML validator.
- Use accessibility testing tools (e.g. axe‑core) to catch missing labels and ARIA misuse.

## Performance & Security

- Escape dynamic content using appropriate PHP functions (`esc_html`, `esc_attr`, etc.).
- Avoid client‑side injection vulnerabilities; never trust user input directly.

## Documentation

- Comment complex template logic and describe the purpose of custom wrappers or ARIA landmarks.

## Block Template Structure

related_links: - "<https://developer.wordpress.org/themes/block-themes/templates/>" - "<https://developer.wordpress.org/themes/block-themes/template-parts/>" - "<https://developer.wordpress.org/block-editor/reference-guides/template-structure/>" - "<https://github.com/lightspeedwp/.github>"

- Test templates with both light and dark color schemes.

## Template Parts

- Store reusable components in the `parts/` directory.
- Use descriptive filenames that reflect the component's purpose.
- Keep template parts focused on a single responsibility.
- Use proper comments to document template structure.
- Prefer core blocks over custom HTML when possible.

## Accessibility

- Maintain proper heading hierarchy (h1-h6) in sequential order.
- Include appropriate ARIA roles and landmarks where needed.
- Ensure sufficient color contrast for all text elements.
- Provide alt text placeholders for images.
- Make interactive elements keyboard accessible.

## Responsive Design

- Design for mobile-first, then enhance for larger screens.
- Use fluid layouts rather than fixed pixel dimensions.
- Test templates at various viewport sizes.
- Ensure content readability at all screen sizes.
- Implement appropriate tap targets for touch devices.

## Block Attributes

- Use theme.json variables for spacing, colors, and typography.
- Apply consistent alignment and width attributes.
- Configure appropriate default block settings.
- Use block variations appropriately for different contexts.
- Test with different block attribute combinations.

## Performance

- Keep markup clean and minimal.
- Avoid deep nesting of blocks when possible.
- Optimize for First Contentful Paint (FCP).
- Consider loading strategies for media-heavy templates.
- Test template rendering performance.

# Examples

```html
<!-- Good: semantic section and labelled form field -->
<section role="region" aria-labelledby="contact-heading">
  <h2 id="contact-heading">Contact Us</h2>
  <form action="/contact" method="post">
    <label for="email">Email address</label>
    <input id="email" type="email" name="email" required />
    <button type="submit">Submit</button>
  </form>
</section>
```

## HTML Coding Standards

### Validation

All HTML pages should be verified against [the W3C validator](https://validator.w3.org/) to ensure that the markup is well formed. This in and of itself is not directly indicative of good code, but it helps to weed out problems that are able to be tested via automation. It is no substitute for manual code review. (For other validators, see [HTML Validation](https://codex.wordpress.org/Validating_a_Website#HTML_-_Validation) in the Codex.)

### Self-closing Elements

All tags must be properly closed. For tags that can wrap nodes such as text or other elements, termination is a trivial enough task. For tags that are self-closing, the forward slash should have exactly one space preceding it:

```html
<br />
```

rather than the compact but incorrect:

```html
<br />
```

The W3C specifies that a single space should precede the self-closing slash ([source](https://w3.org/TR/xhtml1/#C_2)).

### Attributes and Tags

All tags and attributes must be written in lowercase. Additionally, attribute values should be lowercase when the purpose of the text therein is only to be interpreted by machines. For instances in which the data needs to be human readable, proper title capitalization should be followed.

For machines:

```html
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
```

For humans:

```html
<a href="http://example.com/" title="Description Here">Example.com</a>
```

### Quotes

According to the W3C specifications for XHTML, all attributes must have a value, and must use double- or single-quotes ([source](https://www.w3.org/TR/xhtml1/#h-4.4)). The following are examples of proper and improper usage of quotes and attribute/value pairs.

Correct:

```html
<input type="text" name="email" disabled="disabled" />
<input type="text" name="email" disabled="disabled" />
```

Incorrect:

```html
<input type="text" name="email" disabled />
```

In HTML, attributes do not all have to have values, and attribute values do not always have to be quoted. While all of the examples above are valid HTML, _failing to quote attributes can lead to security vulnerabilities_. Always quote attributes. Omitting the value on boolean attributes is allowed. The values `true` and `false` are not valid on boolean attributes ([HTML5 source](https://www.w3.org/TR/2011/WD-html5-20110405/common-microsyntaxes.html#boolean-attributes)).

Correct:

```html
<input type="text" name="email" disabled />
```

Incorrect:

```html
<input type="text" name="email" disabled="true" />
```

### Indentation

As with PHP, HTML indentation should always reflect logical structure. Use tabs and not spaces.

When mixing PHP and HTML together, indent PHP blocks to match the surrounding HTML code. Closing PHP blocks should match the same indentation level as the opening block.

Correct:

```php
<?php if ( ! have_posts() ) : ?>
<div id="post-1" class="post">
 <h1 class="entry-title">Not Found</h1>
 <div class="entry-content">
  <p>Apologies, but no results were found.</p>
  <?php get_search_form(); ?>
 </div>
</div>
<?php endif; ?>
```

Incorrect:

```php
<?php if ( ! have_posts() ) : ?>
<div id="post-0" class="post error404 not-found">
<h1 class="entry-title">Not Found</h1>
<div class="entry-content">
<p>Apologies, but no results were found.</p>
<?php get_search_form(); ?>
</div>
</div>
<?php endif; ?>
```

## Credits

- HTML code standards adapted from [Fellowship Tech Code Standards](https://developer.fellowshipone.com/patterns/code.php) ([CC license](https://creativecommons.org/licenses/by-nc-sa/3.0/)).n

# Checklists

- [ ] Headings are used in order and never skipped.
- [ ] All form controls have associated labels.
- [ ] Dynamic content is properly escaped in PHP files.

# References

- <https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/>
