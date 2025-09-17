# WordPress Block Structure Examples

This directory demonstrates the typical file structure for WordPress blocks following the [WordPress documentation](https://developer.wordpress.org/block-editor/getting-started/fundamentals/file-structure-of-a-block/) and LightSpeed coding standards.

## Directory Structure

```
examples/
├── example-block/              # Main block directory
│   ├── src/                   # Source files
│   │   ├── index.js          # Main block registration
│   │   ├── edit.js           # Editor interface component
│   │   ├── save.js           # Frontend save component
│   │   ├── editor.scss       # Editor-only styles
│   │   └── style.scss        # Frontend and editor styles
│   ├── block.json            # Block configuration
│   ├── example-block.php     # PHP registration and server-side logic
│   └── package.json          # Build configuration
└── patterns/                  # Block patterns directory
    ├── hero-cta.php          # Hero section pattern
    └── simple-cta.php        # Simple CTA pattern
```

## File Descriptions

### Core Block Files

- **`block.json`** - The block configuration file containing metadata, attributes, and settings
- **`src/index.js`** - Main entry point that registers the block
- **`src/edit.js`** - React component for the block editor interface
- **`src/save.js`** - React component that defines the frontend output
- **`src/editor.scss`** - Styles that only apply in the editor
- **`src/style.scss`** - Styles that apply both in editor and frontend
- **`example-block.php`** - PHP file for server-side registration and functionality

### Pattern Files

- **`patterns/hero-cta.php`** - Complex hero section with multiple elements
- **`patterns/simple-cta.php`** - Simple call-to-action pattern

## Key Features Demonstrated

### Block Structure
- ✅ **API Version 3** - Uses latest block API
- ✅ **Block.json Configuration** - Modern block registration
- ✅ **React Components** - Separate edit and save components
- ✅ **SCSS Preprocessing** - Organized stylesheets
- ✅ **Internationalization** - Proper translation support
- ✅ **Accessibility** - ARIA labels and keyboard navigation
- ✅ **Color Support** - Theme color integration
- ✅ **Typography Support** - Font size and line height controls
- ✅ **Spacing Support** - Padding and margin controls

### LightSpeed Standards
- ✅ **WordPress Coding Standards** - PHP follows WordPress guidelines
- ✅ **4-space Indentation** - Consistent formatting
- ✅ **Proper Escaping** - Security best practices
- ✅ **Translation Ready** - Correct text domain usage
- ✅ **Theme.json Integration** - Uses theme design tokens
- ✅ **Performance Optimized** - Minimal dependencies

### Pattern Features
- ✅ **Pattern Headers** - Proper metadata for discovery
- ✅ **Category Assignment** - Organized in logical groups
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Theme Integration** - Uses theme.json variables
- ✅ **Content Strategy** - Realistic placeholder content

## Getting Started

### 1. Set Up Build Process

```bash
# Navigate to the block directory
cd examples/example-block

# Install dependencies
npm install

# Start development mode
npm run start

# Build for production
npm run build
```

### 2. Register the Block

Include the PHP file in your theme's `functions.php`:

```php
// Include the block registration
require_once get_template_directory() . '/examples/example-block/example-block.php';
```

### 3. Register Patterns

Include pattern files in your theme:

```php
// Register patterns
require_once get_template_directory() . '/examples/patterns/hero-cta.php';
require_once get_template_directory() . '/examples/patterns/simple-cta.php';
```

## Development Workflow

### Building Assets

- **Development mode**: `npm run start` - Watches for changes and rebuilds automatically
- **Production build**: `npm run build` - Creates optimized production files

### Code Quality

- **Lint JavaScript**: `npm run lint:js`
- **Lint CSS**: `npm run lint:css`
- **Format code**: `npm run format`

### File Organization

```
build/                    # Generated files (after npm run build)
├── index.js             # Compiled JavaScript
├── index.asset.php      # WordPress asset dependencies
├── editor.css           # Compiled editor styles
└── style.css            # Compiled frontend styles
```

## Integration with WordPress

### Block Categories

The example includes custom block category registration:
- Category slug: `lsx-blocks`
- Category title: "LSX Blocks"

### Asset Management

- Automatic dependency management via `index.asset.php`
- Proper enqueuing for editor and frontend
- Version management for cache busting
- Translation support via `wp_set_script_translations()`

### Server-side Rendering

The example shows both:
- **Client-side rendering** (default) - Saves HTML in post content
- **Server-side rendering** (optional) - Dynamic PHP-generated output

## Best Practices Demonstrated

### Accessibility
- Proper heading hierarchy
- ARIA labels and roles
- Keyboard navigation support
- High contrast mode support
- Reduced motion preferences

### Performance
- Minimal dependencies
- Optimized asset loading
- Efficient CSS selectors
- Reduced motion support

### Security
- Input sanitization
- Output escaping
- Nonce verification (where applicable)
- Capability checks

### Internationalization
- Translatable strings
- Proper text domain usage
- Translation function usage
- Script translations setup

## Further Reading

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [LightSpeed Coding Standards](./../.github/instructions/coding-standards.instructions.md)

## Support

For questions or issues:
- Review the [GitHub Copilot instructions](../.github/copilot-instructions.md)
- Check the [prompt files](../.github/prompts/) for guidance
- Open an issue in the repository