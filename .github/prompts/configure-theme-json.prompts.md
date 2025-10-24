---
description: "Configure theme.json with design tokens, typography scales, color palettes, and global styles for WordPress block themes"
mode: "ask"
license: "GPL-3.0-or-later"
---

# Configure Theme.json Design System

Create a comprehensive `theme.json` configuration that establishes a cohesive design system with proper token hierarchy, accessibility standards, and performance optimization.

## Design System Requirements

**Core Structure:**
- Use theme.json version 3 with proper schema reference
- Enable `appearanceTools` and `useRootPaddingAwareAlignments`
- Configure layout settings (`contentSize`, `wideSize`)
- Set up proper block editor experience

**Typography System:**
- Fluid typography with appropriate min/max values
- Semantic font size scale (small, medium, large, x-large, xx-large)
- Font family definitions with proper fallbacks
- Line height, letter spacing, and text decoration controls
- Web font loading optimization

**Color System:**
- Accessible color palette (4.5:1 contrast minimum)
- Semantic color naming (base, contrast, primary, secondary, tertiary)
- Gradient definitions using CSS custom properties
- Duotone configurations for images
- Support for custom colors (disabled by default)

**Spacing System:**
- Consistent spacing scale with mathematical progression
- T-shirt sizing (xs, s, m, l, xl, xxl) or numeric system
- Spacing scale configuration with proper units
- Custom spacing properties for complex layouts

## Implementation Guidelines

### Color Palette Standards
```json
{
    "settings": {
        "color": {
            "palette": [
                {
                    "name": "Base",
                    "slug": "base",
                    "color": "#ffffff"
                },
                {
                    "name": "Contrast", 
                    "slug": "contrast",
                    "color": "#000000"
                },
                {
                    "name": "Primary",
                    "slug": "primary",
                    "color": "#007cba"
                }
            ]
        }
    }
}
```

### Typography Scale
```json
{
    "settings": {
        "typography": {
            "fontSizes": [
                {
                    "name": "Small",
                    "size": "0.875rem",
                    "slug": "small",
                    "fluid": {
                        "min": "0.875rem",
                        "max": "1rem"
                    }
                }
            ]
        }
    }
}
```

### Spacing System
```json
{
    "settings": {
        "spacing": {
            "spacingSizes": [
                {
                    "name": "Small",
                    "size": "1rem",
                    "slug": "50"
                }
            ]
        }
    }
}
```

## Block-Specific Styling

**Core Block Customization:**
- Style common blocks (button, heading, group, columns)
- Implement consistent spacing and typography
- Add hover and focus states for interactive elements
- Configure block supports and variations

**Element Styling:**
- Link states (default, hover, focus, active)
- Button styling with proper accessibility
- Heading hierarchy (h1-h6) with semantic sizing
- Form elements with consistent appearance

**Layout & Structure:**
- Container queries for responsive design
- Grid and flexbox utilities
- Consistent block gaps and alignment
- Wide and full-width content handling

## Accessibility Requirements

**Color Contrast:**
- Minimum 4.5:1 ratio for normal text
- Minimum 3:1 ratio for large text (18pt+ or 14pt+ bold)
- Test with various color combinations
- Provide high contrast alternatives

**Focus Management:**
- Visible focus indicators (2px minimum outline)
- Proper focus order and keyboard navigation
- Skip links and navigation landmarks
- Screen reader announcements

**Typography Accessibility:**
- Readable font sizes (16px minimum for body text)
- Sufficient line height (1.5 minimum for body text)
- Adequate letter spacing for readability
- Support for user font size preferences

## Performance Optimization

**CSS Custom Properties:**
- Use CSS variables for runtime theme switching
- Minimize specificity and cascade issues
- Enable efficient style inheritance
- Support for reduced motion preferences

**Font Loading:**
- Optimize web font delivery
- Use font-display: swap for better performance
- Minimize font variations and weights
- Provide system font fallbacks

**Bundle Size:**
- Keep theme.json focused and minimal
- Use semantic tokens over hardcoded values
- Leverage WordPress core features
- Avoid duplicate or conflicting styles

## Advanced Features

**Style Variations:**
- Create theme style variations (light, dark, high-contrast)
- Configure variation-specific color palettes
- Implement consistent styling across variations
- Test variations for accessibility compliance

**Custom Properties:**
- Define reusable design tokens
- Create complex spacing and sizing systems
- Configure animation and transition properties
- Enable advanced layout capabilities

**Template Integration:**
- Configure template part areas
- Define custom template options
- Set up proper template hierarchy
- Enable full-site editing features

## Testing & Validation

**Browser Testing:**
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile and tablet responsive behavior
- High DPI and retina display support
- Print stylesheet considerations

**Accessibility Testing:**
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Keyboard navigation testing
- Color blindness simulation
- High contrast mode support

**Performance Testing:**
- Core Web Vitals measurement
- Font loading impact assessment
- CSS bundle size optimization
- Runtime performance monitoring

## Documentation Requirements

When creating the theme.json configuration, include:

1. **Design rationale** for color and typography choices
2. **Token naming conventions** and usage guidelines  
3. **Accessibility compliance** documentation
4. **Browser support** matrix and testing notes
5. **Migration guide** from previous versions
6. **Customization instructions** for child themes

Focus on creating a maintainable, scalable design system that enhances the user experience while maintaining performance and accessibility standards.