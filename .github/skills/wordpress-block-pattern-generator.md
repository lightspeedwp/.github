# WordPress Block Theme Pattern Generator

Expert in generating WordPress block theme patterns following specification-driven development with accessibility, proper spacing, and integration with WooCommerce, LifterLMS, and custom post types.

## Overview

This skill enables the creation of production-ready WordPress block patterns that integrate seamlessly with:
- **WordPress Block Editor (Gutenberg)**
- **WooCommerce** - Product displays, shopping features
- **LifterLMS** - Course cards, learning management
- **Custom Post Types** - Via ACF display field blocks
- **Custom Taxonomies** - Filtering and organization

All patterns follow the pattern specification defined in `pattern-specification.json` with emphasis on accessibility (WCAG 2.1 AA), proper semantic HTML, and WordPress preset spacing system.

## Capabilities

### Pattern Generation
- Create patterns from scratch based on specifications
- Generate query loops with custom post type integration
- Build accessible card components with proper ARIA labels
- Implement responsive grid layouts with proper spacing
- Integrate custom fields using ACF display field blocks

### Standards Compliance
- **WordPress Spacing Presets**: Uses numeric slugs (10, 20, 30, 40, 50, 56, 60, 64, 72, 80)
- **BEM Naming Convention**: `.block__element--modifier` structure
- **WCAG 2.1 AA**: Minimum 4.5:1 contrast, keyboard navigation, semantic HTML
- **Responsive Design**: Mobile-first with tablet (782px) and desktop (1024px) breakpoints
- **Performance**: Lazy loading, conditional script loading, optimized images

### Plugin Integration

#### WooCommerce
- Product query loops with ratings, pricing, add to cart buttons
- Product showcase grids with featured items
- Product filters and search functionality
- Cart and checkout pattern components

#### LifterLMS
- Course card layouts with progress tracking
- Course grids and lists with enrollment CTAs
- Lesson navigation and content display
- Achievement and certificate showcases

#### Custom Post Types (ma-plugin)
- Webinar cards with event date, CPD points, registration links
- Digital magazine cards with issue numbers, publication dates, PDF links
- Course extensions with subtitles and related content
- Custom field display using `acf/display-field` block

### Pattern Types

1. **Hero Sections**
   - Full-width covers with overlay
   - Split hero with image/content columns
   - CPD tracker hero with progress cards
   - Archive heroes with search and filters

2. **Card Components**
   - Webinar/event cards with custom fields
   - Digital magazine cards with multiple CTA options
   - Course cards with enrollment buttons
   - Product cards with WooCommerce integration

3. **Query Loops**
   - Grid layouts (2, 3, 4 columns)
   - List layouts with featured images
   - Filtered queries by taxonomy
   - Pagination with arrow navigation

4. **Feature Sections**
   - Multi-column feature grids
   - Icon + text combinations
   - Statistics and numbers
   - Testimonial carousels

5. **Call-to-Action**
   - Banner CTAs with background colors
   - Split CTAs with image backgrounds
   - Inline CTAs within content
   - Sticky footer CTAs

6. **Filter & Navigation**
   - Taxonomy filter tabs
   - Speciality browsing interfaces
   - Archive navigation with search
   - Breadcrumb navigation

## Pattern File Structure

### File Naming
- Use kebab-case: `webinar-card.php`, `product-showcase-woocommerce.php`
- Include descriptive names indicating purpose and plugin integration
- Store in `patterns/` directory

### File Header
```php
<?php
/**
 * Title: Pattern Name
 * Slug: theme-prefix/pattern-slug
 * Description: Clear description of pattern purpose and use cases.
 * Categories: category1, category2
 * Keywords: keyword1, keyword2, keyword3
 * Block Types: core/block-type, woocommerce/block-type
 * Post Types: post, custom_post_type
 * Viewport Width: 1400
 * Inserter: yes
 *
 * @package Theme Name
 * @since 1.0.0
 */
```

### Required Pattern Elements

#### 1. Container Structure
```php
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
	<!-- Inner content -->
</div>
<!-- /wp:group -->
```

#### 2. Spacing System
Use WordPress preset spacing via CSS custom properties:
```php
style="padding-top:var(--wp--preset--spacing--40)"
style="margin-bottom:var(--wp--preset--spacing--20)"
style="blockGap":"var:preset|spacing|30"
```

#### 3. Typography
Reference preset font sizes:
```php
{"fontSize":"large"}
{"fontSize":"medium"}
{"fontSize":"small"}
```

#### 4. Colors
Use theme color presets:
```php
{"backgroundColor":"primary"}
{"textColor":"base"}
{"overlayColor":"contrast"}
```

### Custom Field Integration

#### ACF Display Field Block
```php
<!-- wp:acf/display-field {"name":"acf/display-field","data":{"field":"field_name","_field":"field_key"},"mode":"preview","className":"component__element"} /-->
```

#### Example: Webinar Fields
```php
<!-- wp:acf/display-field {"name":"acf/display-field","data":{"field":"webinar_type","_field":"field_webinar_webinar_type"},"mode":"preview"} /-->

<!-- wp:acf/display-field {"name":"acf/display-field","data":{"field":"event_date","_field":"field_webinar_event_date"},"mode":"preview"} /-->

<!-- wp:acf/display-field {"name":"acf/display-field","data":{"field":"cpd_points","_field":"field_webinar_cpd_points"},"mode":"preview"} /-->
```

#### Example: Magazine Fields
```php
<!-- wp:acf/display-field {"name":"acf/display-field","data":{"field":"issue_number","_field":"field_digital_magazine_issue_number"},"mode":"preview"} /-->

<!-- wp:acf/display-field {"name":"acf/display-field","data":{"field":"publication_date","_field":"field_digital_magazine_publication_date"},"mode":"preview"} /-->
```

### Query Loop Patterns

#### Basic Structure
```php
<!-- wp:query {"queryId":1,"query":{"perPage":6,"postType":"custom_post_type"},"displayLayout":{"type":"flex","columns":3}} -->
<div class="wp-block-query">
	<!-- wp:post-template {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}}} -->
		<!-- Card content here -->
	<!-- /wp:post-template -->
	
	<!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"}} -->
		<!-- wp:query-pagination-previous /-->
		<!-- wp:query-pagination-numbers /-->
		<!-- wp:query-pagination-next /-->
	<!-- /wp:query-pagination -->
	
	<!-- wp:query-no-results -->
		<!-- No results message -->
	<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
```

## Accessibility Requirements

### Semantic HTML
- Use proper heading hierarchy (h1, h2, h3)
- Include ARIA labels for interactive elements
- Provide alt text for all images (or empty alt for decorative)

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators required
- Logical tab order maintained

### Color Contrast
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

### Form Elements
- All inputs must have associated labels
- Error messages must be accessible
- Required fields clearly indicated

## Responsive Behavior

### Mobile-First Approach
- Base styles work on 320px width
- Stack columns on mobile by default
- Touch-friendly targets (minimum 44px)

### Breakpoints
- **Mobile**: 0px - 781px
- **Tablet**: 782px - 1023px
- **Desktop**: 1024px+

### Responsive Spacing
```php
<!-- Fluid spacing with clamp -->
"padding":{"top":"clamp(var(--wp--preset--spacing--30), 5vw, var(--wp--preset--spacing--60))"}

<!-- Mobile/Desktop variations -->
"padding":{"top":"var:preset|spacing|30"} <!-- Mobile -->
"padding":{"top":"var:preset|spacing|60"} <!-- Desktop via media query -->
```

## BEM CSS Naming

### Pattern-level Classes
```php
<div class="wp-block-group webinar-card">
	<!-- Block -->
	
	<div class="webinar-card__header">
		<!-- Element -->
	</div>
	
	<div class="webinar-card__type webinar-card__type--live">
		<!-- Element with modifier -->
	</div>
</div>
```

### State Classes
```php
<div class="speciality-filter-tabs__tab is-active">
	<!-- State class -->
</div>
```

## Performance Optimization

### Images
- Enable lazy loading: `{"loading":"lazy"}`
- Use responsive images: Include srcset
- Optimize file sizes: Maximum 500KB per image
- Use appropriate aspect ratios

### Scripts & Styles
- Conditional loading: Only load when pattern used
- Defer non-critical scripts
- Inline critical CSS for above-the-fold content

## Testing Checklist

### Before Pattern Release
- [ ] Validates as proper block markup
- [ ] Renders correctly in block editor
- [ ] Displays properly on frontend
- [ ] Mobile responsive (tested 320px-1440px)
- [ ] Keyboard accessible
- [ ] Screen reader compatible
- [ ] Color contrast passes WCAG AA
- [ ] Custom fields display correctly
- [ ] Query loops paginate properly
- [ ] No console errors
- [ ] Performance optimized

## Example Pattern Reference

### Webinar Card Pattern
**Location**: `patterns/webinar-card.php`
**Features**:
- Custom field integration (event date, CPD points, webinar type)
- Responsive card layout
- Proper spacing using presets
- BEM naming convention
- Accessible markup

### CPD Tracker Hero
**Location**: `patterns/cpd-tracker-hero.php`
**Features**:
- Split layout (60/40 columns)
- Progress tracking card
- Multiple CTAs
- Full-width cover background
- Responsive columns stack on mobile

### Product Showcase (WooCommerce)
**Location**: `patterns/product-showcase-woocommerce.php`
**Features**:
- WooCommerce product query
- 4-column grid layout
- Product ratings and pricing
- Add to cart buttons
- Pagination controls

## Related Documentation

- **Pattern Specification**: `/pattern-specification.json`
- **Theme Guidelines**: `/.github/instructions/block-theme-development.instructions.md`
- **Accessibility Standards**: `/.github/instructions/a11y.instructions.md`
- **Naming Conventions**: `/.github/instructions/naming-conventions.instructions.md`
- **WordPress Spacing**: `/guidelines/design-tokens/spacing.md`

## Version History

- **1.0.0** (2026-02-03): Initial skill creation with comprehensive pattern generation capabilities
