---
applyTo: ['**/*.css', '**/*.scss', '**/*.sass']
description: "Enforce WordPress CSS coding standards, naming, specificity and formatting."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Provide clear guidelines for writing CSS (and Sass) consistent with the WordPress coding standards. Aim to keep styles readable, maintainable and accessible.

# Language & Frameworks
- CSS and SCSS. When possible, leverage WordPress’s block API and `theme.json` presets instead of custom styles.

# Project Structure
- Organise styles by component or feature in an `assets/css` or `src/css` folder.
- Use a `globals` or `base` file for variables and resets.

# Coding Standards
- Use **hyphenated lowercase** class names. Do not use IDs for styling.
- Place **one selector per line** and **one declaration per line** to improve readability.
- Follow the order: **position → box model → typography → visual → misc** for declarations.
- Keep specificity low; prefer utility classes and `var()` references to `theme.json` presets.
- Group related rules together and include comments describing the purpose of complex sections.
- Use logical properties (`margin-block-start` instead of `margin-top`) where practical and avoid deprecated vendor prefixes.

# Testing & Quality
- Use **stylelint** with the WordPress stylelint configuration to catch naming and formatting issues.
- Run Prettier only after stylelint to enforce consistent formatting.

# Performance & Security
- Avoid deeply nested selectors and expensive combinators.
- Use CSS variables and the cascade to promote reusability.
- Ensure colour contrast and font sizes meet accessibility guidelines.

# Documentation
- Document custom mixins or complex rules with inline comments.

# Examples
```css
/* Good: hyphenated class names and logical property order */
.alert-success {
  position: relative;
  margin-block-start: 1rem;
  padding: 1rem;
  color: var(--wp--preset--color--base);
  background-color: var(--wp--preset--color--primary-light);
}
```

# Checklists
- [ ] All class names are lowercase and hyphenated.
- [ ] Stylelint passes without errors.
- [ ] Colours and spacing reference `theme.json` presets where available.

# References
- https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/
