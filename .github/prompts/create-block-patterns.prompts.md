---
description: "Create accessible, semantic block patterns with proper HTML structure, ARIA attributes, and theme.json integration"
mode: "ask"
license: "GPL-3.0-or-later"
---

# Create Block Patterns

Design and implement reusable block patterns that follow accessibility best practices, semantic HTML structure, and integrate seamlessly with theme.json design systems.

## Pattern Requirements

**Registration & Metadata:**
- Register patterns with descriptive titles and categories
- Include relevant keywords for discoverability
- Set appropriate viewport width for pattern previews
- Configure proper pattern categories and descriptions
- Add block types and inserter visibility settings

**Semantic HTML Structure:**
- Use proper heading hierarchy (h1-h6) with logical nesting
- Implement landmark roles and ARIA labels where appropriate
- Ensure semantic meaning matches visual presentation
- Provide alternative text for decorative and informational images
- Use list elements for grouped content

**Accessibility Standards:**
- Maintain WCAG 2.1 AA compliance throughout
- Ensure sufficient color contrast (4.5:1 minimum)
- Provide keyboard navigation support
- Include proper focus management for interactive elements
- Test with screen readers and assistive technology

## Implementation Guidelines

### Pattern Registration
```php
register_block_pattern(
    'mytheme/hero-section',
    array(
        'title'         => __( 'Hero Section', 'textdomain' ),
        'description'   => __( 'Large hero section with heading, content, and call-to-action button', 'textdomain' ),
        'content'       => '<!-- wp:group -->...<!-- /wp:group -->',
        'categories'    => array( 'featured', 'header' ),
        'keywords'      => array( 'hero', 'banner', 'header', 'cta' ),
        'viewportWidth' => 1200,
        'blockTypes'    => array( 'core/group', 'core/cover' ),
        'inserter'      => true,
    )
);
```

### Semantic Structure Examples
```html
<!-- Hero Pattern with Proper Semantics -->
<!-- wp:group {"tagName":"section","metadata":{"name":"Hero Section"},"ariaLabel":"Hero section with call to action"} -->
<section class="wp-block-group" aria-labelledby="hero-heading">
    <!-- wp:heading {"level":1,"textAlign":"center"} -->
    <h1 class="wp-block-heading has-text-align-center" id="hero-heading">Welcome Message</h1>
    <!-- /wp:heading -->
    
    <!-- wp:paragraph {"align":"center"} -->
    <p class="has-text-align-center">Supporting content that provides context</p>
    <!-- /wp:paragraph -->
    
    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
    <div class="wp-block-buttons">
        <!-- wp:button -->
        <div class="wp-block-button">
            <a class="wp-block-button__link wp-element-button" href="#main-content" aria-describedby="hero-heading">Get Started</a>
        </div>
        <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->
</section>
<!-- /wp:group -->
```

### Card Grid Pattern
```html
<!-- wp:group {"tagName":"section","metadata":{"name":"Services Grid"}} -->
<section class="wp-block-group" aria-labelledby="services-heading">
    <!-- wp:heading {"level":2,"textAlign":"center"} -->
    <h2 class="wp-block-heading has-text-align-center" id="services-heading">Our Services</h2>
    <!-- /wp:heading -->
    
    <!-- wp:columns {"align":"wide"} -->
    <div class="wp-block-columns alignwide">
        <!-- wp:column -->
        <div class="wp-block-column">
            <!-- wp:group {"style":{"spacing":{"padding":"var:preset|spacing|50"}},"backgroundColor":"tertiary"} -->
            <div class="wp-block-group has-tertiary-background-color">
                <!-- wp:heading {"level":3} -->
                <h3 class="wp-block-heading">Service Title</h3>
                <!-- /wp:heading -->
                
                <!-- wp:paragraph -->
                <p>Service description with clear, actionable content.</p>
                <!-- /wp:paragraph -->
                
                <!-- wp:buttons -->
                <div class="wp-block-buttons">
                    <!-- wp:button {"className":"is-style-outline"} -->
                    <div class="wp-block-button is-style-outline">
                        <a class="wp-block-button__link wp-element-button">Learn More</a>
                    </div>
                    <!-- /wp:button -->
                </div>
                <!-- /wp:buttons -->
            </div>
            <!-- /wp:group -->
        </div>
        <!-- /wp:column -->
    </div>
    <!-- /wp:columns -->
</section>
<!-- /wp:group -->
```

## Design System Integration

**Theme.json Token Usage:**
- Use CSS custom properties for colors, spacing, typography
- Reference preset values consistently throughout patterns
- Implement fluid typography where appropriate
- Leverage spacing scale for consistent layouts

**Color and Typography:**
```html
<!-- Use theme.json color tokens -->
<!-- wp:group {"backgroundColor":"primary","textColor":"base"} -->

<!-- Use theme.json font sizes -->
<!-- wp:heading {"fontSize":"x-large"} -->

<!-- Use theme.json spacing -->
<!-- wp:group {"style":{"spacing":{"padding":"var:preset|spacing|60"}}} -->
```

**Responsive Design:**
- Use WordPress alignment classes (alignwide, alignfull)
- Implement flexible layouts with columns and groups
- Consider mobile-first responsive patterns
- Test across various screen sizes and devices

## Common Pattern Types

### Layout Patterns
- **Hero Sections**: Full-width banners with compelling headlines
- **Feature Grids**: Service or product showcases in grid layouts
- **Testimonials**: Customer feedback with proper attribution
- **Call-to-Action**: Focused conversion-oriented sections
- **Content Sections**: Text-heavy areas with proper typography

### Navigation Patterns
- **Header Layouts**: Site branding and navigation combinations
- **Footer Layouts**: Contact info, links, and legal content
- **Sidebar Content**: Complementary content and navigation
- **Breadcrumbs**: Path indicators for complex site structures

### Content Patterns
- **Article Layouts**: Blog post and page content structures
- **Gallery Displays**: Image showcases with accessibility
- **Contact Forms**: User input with proper labeling
- **Pricing Tables**: Service comparison layouts
- **FAQ Sections**: Expandable question and answer formats

## Accessibility Checklist

### Semantic Structure
- [ ] Proper heading hierarchy without skipping levels
- [ ] Landmark roles (main, nav, aside, section, article)
- [ ] ARIA labels for complex interactive elements
- [ ] Alternative text for all informational images
- [ ] Descriptive link text (avoid "click here", "read more")

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Logical tab order through the pattern
- [ ] Visible focus indicators on all focusable elements
- [ ] Skip links for complex patterns
- [ ] No keyboard traps in interactive components

### Screen Reader Support
- [ ] Proper heading structure for navigation
- [ ] ARIA descriptions for complex interactions
- [ ] Live regions for dynamic content updates
- [ ] Table headers and captions where applicable
- [ ] Form labels and field descriptions

### Visual Accessibility
- [ ] Sufficient color contrast ratios
- [ ] Content readable without color alone
- [ ] Scalable text up to 200% zoom
- [ ] No content loss in responsive breakpoints
- [ ] Motion reduced for users with vestibular disorders

## Testing & Validation

**Manual Testing:**
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation testing
- High contrast mode compatibility
- Mobile device accessibility testing
- Print stylesheet verification

**Automated Testing:**
- axe-core accessibility scanning
- WAVE tool validation
- Lighthouse accessibility audits
- Color contrast analyzer tools
- HTML validation and semantic structure

**User Testing:**
- Test with actual users with disabilities
- Gather feedback on usability and accessibility
- Iterate based on real-world usage patterns
- Document common issues and solutions

## Documentation Requirements

For each pattern, provide:

1. **Usage guidelines** and when to use the pattern
2. **Customization options** available to users
3. **Accessibility features** and testing notes
4. **Browser compatibility** information
5. **Performance considerations** and optimization tips
6. **Integration instructions** with existing content

Focus on creating patterns that are not only visually appealing but also functionally robust, accessible to all users, and easy to customize within the WordPress editing experience.