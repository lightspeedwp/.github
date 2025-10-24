---
description: "Scaffold a new block pattern with correct header"
mode: "edit"
model: "GPT-4"
tools: []
---

# Pattern Scaffold

Generate a new block pattern in PHP with proper WordPress pattern headers and semantic block markup.

## Requirements

Create a block pattern file with the following structure:

### Pattern Header
- `title`: Descriptive name for the pattern
- `slug`: `ai-block-theme-template/pattern-slug` format
- `categories`: Include `ai-block-theme-template` and relevant categories
- `keywords`: Relevant search terms
- `description`: Brief description of the pattern's purpose

### File Organization
- Place file in `/patterns/<category>/` directory
- Use descriptive filename matching the pattern purpose
- Follow naming convention: `category-purpose.php`

### Block Markup
- Use semantic HTML with WordPress block comments
- Include proper block attributes and styling
- Ensure accessibility with proper heading hierarchy
- Use theme design tokens from `theme.json`
- Test with different content lengths

### Code Quality
- Include usage notes at the top of the file
- Use proper indentation and formatting
- Follow WordPress coding standards
- Add inline comments for complex layouts

## Example Pattern Structure

```php
<?php
/**
 * Title: Pattern Name
 * Slug: ai-block-theme-template/pattern-slug
 * Categories: ai-block-theme-template, featured
 * Keywords: keyword1, keyword2, keyword3
 * Description: Brief description of what this pattern creates
 */
?>
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
    <!-- Pattern content here -->
</div>
<!-- /wp:group -->
```

## Pattern Categories
- `hero` - Hero sections and banners
- `featured` - Featured content sections
- `gallery` - Image galleries and media
- `testimonials` - Customer testimonials
- `contact` - Contact forms and information
- `call-to-action` - CTA sections
- `text` - Text-heavy content layouts