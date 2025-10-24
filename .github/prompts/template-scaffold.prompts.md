---
description: "Scaffold a new template with proper block structure"
mode: "edit"
model: "GPT-4"
tools: []
---

# Template Scaffold

Generate a new WordPress block template with proper structure and semantic markup.

## Requirements

Create a template file with the following characteristics:

### Template Structure
- Use HTML format with WordPress block comments
- Include proper template parts (header, footer)
- Implement semantic HTML elements
- Follow WordPress template hierarchy

### File Organization
- Place file in `/templates/` directory
- Use descriptive filename matching WordPress conventions
- Follow naming pattern: `template-name.html`

### Block Markup Requirements
- Start with header template part: `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->`
- Include main content area with proper layout blocks
- End with footer template part: `<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`
- Use constrained layout for content areas
- Implement proper spacing using theme design tokens

### Accessibility
- Use semantic HTML5 elements (main, section, article, aside)
- Ensure proper heading hierarchy
- Include skip links where appropriate
- Test keyboard navigation

### Responsive Design
- Use flexible layouts that work on all screen sizes
- Implement proper spacing and typography scaling
- Test on mobile, tablet, and desktop viewports

## Common Template Types

### Page Templates
- `page.html` - Default page template
- `front-page.html` - Homepage template
- `single.html` - Single post template
- `archive.html` - Archive listing template
- `search.html` - Search results template
- `404.html` - Error page template

### Custom Templates
- Use descriptive names for custom templates
- Include template metadata in file comments
- Document intended use cases

## Example Template Structure

```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
    <!-- Template content here -->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
```

Always ensure templates are tested with various content types and lengths.