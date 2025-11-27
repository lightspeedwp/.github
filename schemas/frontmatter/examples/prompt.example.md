---
$schema: "../frontmatter.schema.json"
file_type: "prompt"
title: "Generate WordPress Block Pattern"
description: "Prompt for generating WordPress block patterns from design specifications or descriptions"
version: "v1.0.0"
last_updated: "2025-11-12"
author: "LightSpeed Team"
mode: "edit"
model: "claude-sonnet-4.0"
domain: "wp-core"
stability: "stable"
tags: ["blocks", "patterns", "wordpress", "generation"]
tools: ["edit", "write", "read"]
references:
  - path: "../../docs/BLOCK-PATTERNS.md"
    description: "Block patterns documentation"
  - path: "../../.github/instructions/block-theme/pattern-development.instructions.md"
    description: "Pattern development guidelines"
  - path: "../frontmatter.schema.json"
    description: "Frontmatter schema definition"
---

# Generate WordPress Block Pattern

This is an example prompt specification showing proper frontmatter structure.

## Prompt

You are a WordPress block pattern generator. Given a design specification or description, create a WordPress block pattern following WordPress coding standards and best practices.

## Requirements

1. **Pattern Structure**: Follow WordPress block pattern registration format
2. **Accessibility**: Include proper ARIA labels and semantic HTML
3. **Responsiveness**: Use WordPress responsive utilities
4. **Internationalization**: Wrap user-facing strings in `__()` or `_e()`
5. **Naming**: Use kebab-case for pattern slugs
6. **Categories**: Assign to appropriate pattern categories

## Expected Input

User provides one of:

- Design mockup or screenshot
- Text description of desired layout
- Example website or pattern to recreate
- Specific blocks and arrangement

## Expected Output

Generate:

1. Pattern registration code (PHP)
2. Pattern metadata (title, description, categories, keywords)
3. Block markup with proper structure
4. Inline documentation

## Example

**User Input:**

> Create a hero section with a heading, paragraph, and button in two columns

**Assistant Output:**

```php
<?php
/**
 * Title: Hero Section Two Column
 * Slug: mytheme/hero-two-column
 * Categories: featured, call-to-action
 * Description: A hero section with heading, text, and button in a two-column layout
 * Keywords: hero, cta, columns
 */
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"4rem","bottom":"4rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:4rem;padding-bottom:4rem">
    <!-- wp:columns {"verticalAlignment":"center"} -->
    <div class="wp-block-columns are-vertically-aligned-center">
        <!-- wp:column {"verticalAlignment":"center"} -->
        <div class="wp-block-column is-vertically-aligned-center">
            <!-- wp:heading {"level":1} -->
            <h1><?php esc_html_e('Welcome to Our Site', 'mytheme'); ?></h1>
            <!-- /wp:heading -->

            <!-- wp:paragraph -->
            <p><?php esc_html_e('Discover amazing content and features.', 'mytheme'); ?></p>
            <!-- /wp:paragraph -->

            <!-- wp:buttons -->
            <div class="wp-block-buttons">
                <!-- wp:button -->
                <div class="wp-block-button">
                    <a class="wp-block-button__link">
                        <?php esc_html_e('Get Started', 'mytheme'); ?>
                    </a>
                </div>
                <!-- /wp:button -->
            </div>
            <!-- /wp:buttons -->
        </div>
        <!-- /wp:column -->

        <!-- wp:column {"verticalAlignment":"center"} -->
        <div class="wp-block-column is-vertically-aligned-center">
            <!-- wp:image {"sizeSlug":"large"} -->
            <figure class="wp-block-image size-large">
                <img src="" alt="<?php esc_attr_e('Hero image', 'mytheme'); ?>"/>
            </figure>
            <!-- /wp:image -->
        </div>
        <!-- /wp:column -->
    </div>
    <!-- /wp:columns -->
</div>
<!-- /wp:group -->
```

## Validation

After generation, verify:

- [ ] Valid WordPress block markup
- [ ] Proper escaping and internationalization
- [ ] Accessibility attributes present
- [ ] Pattern metadata complete
- [ ] Responsive design considerations

## Usage

```bash
# Via GitHub Copilot
Create a block pattern for a testimonial section with three columns
```

## Related

- [Block Pattern Directory](https://wordpress.org/patterns/)
- [Pattern Registration](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-patterns/)
- [Block Markup Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/)
