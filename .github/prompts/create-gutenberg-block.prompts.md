---
description: "Scaffold a complete Gutenberg block with block.json, React components, PHP registration, and styles"
mode: "ask"
license: "GPL-3.0-or-later"
---

# Create Gutenberg Block

Create a complete, production-ready Gutenberg block following WordPress best practices.

## Requirements

**Block Configuration:**
- Create `block.json` with complete metadata (API version 3)
- Include proper supports, attributes, and editor/style scripts
- Add appropriate keywords, category, and description
- Configure block supports (anchor, spacing, typography, etc.)

**React Components:**
- `Edit` component with `useBlockProps()` and modern hooks
- `Save` component for static blocks OR null for dynamic blocks
- Inspector controls for block settings
- Toolbar controls for quick actions
- Error boundaries and loading states

**PHP Integration:**
- Server-side registration with `register_block_type()`
- Render callback for dynamic blocks (if needed)
- Proper escaping and sanitization
- Internationalization support

**Styling:**
- Editor-specific styles (`editor.scss`)
- Frontend styles (`style.scss`) 
- Use CSS custom properties and theme.json tokens
- Responsive design considerations

**Development Setup:**
- Build configuration with `@wordpress/scripts`
- Proper file structure and organization
- Development and production build processes

## Implementation Checklist

### File Structure
```
blocks/my-block/
├── block.json
├── index.js
├── edit.js
├── save.js
├── style.scss
├── editor.scss
└── render.php (for dynamic blocks)
```

### Security & Performance
- [ ] Escape all output (`esc_html`, `esc_attr`, `wp_kses_post`)
- [ ] Sanitize all input (`sanitize_text_field`, etc.)
- [ ] Use nonces for AJAX operations
- [ ] Implement proper capability checks
- [ ] Optimize for Core Web Vitals
- [ ] Minimize JavaScript bundle size

### Accessibility
- [ ] Semantic HTML structure
- [ ] Proper ARIA labels and roles
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Focus management
- [ ] Color contrast compliance (4.5:1 minimum)

### Internationalization
- [ ] All user-facing strings wrapped with `__()`
- [ ] Proper text domain usage
- [ ] Context provided with `_x()` where needed
- [ ] JavaScript strings localized with `wp_localize_script()`

### Testing
- [ ] Unit tests for JavaScript components (Jest)
- [ ] PHP unit tests (PHPUnit)
- [ ] E2E tests with Playwright
- [ ] Accessibility testing
- [ ] Cross-browser compatibility

## Example Implementation

When implementing, provide:

1. **Complete block.json** with all necessary metadata
2. **Modern React components** using functional components and hooks
3. **Proper PHP registration** and render callbacks
4. **Comprehensive styling** with CSS custom properties
5. **Build configuration** and development scripts
6. **Documentation** for usage and customization

Focus on creating a maintainable, performant, and accessible block that follows WordPress coding standards and modern development practices.

Include examples for common patterns:
- RichText components for editable content
- MediaUpload for image/media selection
- Inspector controls for block settings
- Block variations for different use cases
- Block patterns for pre-configured layouts

Ensure the block is compatible with WordPress 6.0+ and follows the latest Gutenberg development guidelines.