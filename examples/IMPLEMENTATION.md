# WordPress Block Structure Implementation

This implementation demonstrates the typical file structure for WordPress blocks based on the [WordPress Block Editor documentation](https://developer.wordpress.org/block-editor/getting-started/fundamentals/file-structure-of-a-block/) and follows LightSpeed coding standards.

## What Has Been Implemented

### ✅ Complete Block Structure
Following the WordPress documentation, this implementation includes all essential files for a modern WordPress block:

1. **`block.json`** - Block metadata and configuration (API version 3)
2. **`src/index.js`** - Main block registration entry point
3. **`src/edit.js`** - Editor interface with React components
4. **`src/save.js`** - Frontend save function
5. **`src/editor.scss`** - Editor-specific styles
6. **`src/style.scss`** - Frontend and editor styles
7. **`example-block.php`** - PHP registration and server-side functionality
8. **`package.json`** - Build configuration and dependencies

### ✅ LightSpeed Standards Compliance
- **WordPress Coding Standards**: PHP follows WordPress guidelines
- **4-space indentation**: Consistent throughout all files
- **Security**: Proper escaping and sanitization
- **Internationalization**: Correct text domain and translation functions
- **Theme.json integration**: Uses design tokens for styling
- **Performance optimization**: Minimal dependencies and efficient code

### ✅ Block Patterns
Two example patterns demonstrating LightSpeed pattern development:
- **Hero CTA**: Complex responsive hero section
- **Simple CTA**: Basic call-to-action pattern

Both patterns follow the pattern development guidelines with proper headers, categories, and theme.json integration.

## Key Features

### Modern WordPress Block API
- Uses API version 3 (latest)
- Block.json configuration approach
- React component architecture
- SCSS preprocessing
- Webpack build process

### Accessibility & Performance
- ARIA labels and semantic markup
- Keyboard navigation support
- High contrast mode compatibility
- Reduced motion preferences
- Mobile-first responsive design
- Optimized asset loading

### Developer Experience
- Hot reloading with `npm start`
- Linting and formatting tools
- Clear documentation
- Consistent code organization
- Build optimization

## File Organization

```
examples/
├── README.md                     # Complete documentation
├── example-block/               # Main block directory
│   ├── .gitignore              # Ignore build files
│   ├── block.json              # Block configuration
│   ├── example-block.php       # PHP registration
│   ├── package.json            # Dependencies & scripts
│   ├── webpack.config.js       # Build configuration
│   └── src/                    # Source files
│       ├── index.js           # Block registration
│       ├── edit.js            # Editor component
│       ├── save.js            # Save component
│       ├── editor.scss        # Editor styles
│       └── style.scss         # Frontend styles
└── patterns/                   # Block patterns
    ├── hero-cta.php           # Complex hero pattern
    └── simple-cta.php         # Simple CTA pattern
```

## Usage Instructions

### 1. Development Setup
```bash
cd examples/example-block
npm install
npm run start  # Development mode with hot reloading
```

### 2. Production Build
```bash
npm run build  # Creates optimized build files
```

### 3. Integration
Include in your theme's `functions.php`:
```php
require_once get_template_directory() . '/examples/example-block/example-block.php';
```

## Standards Followed

### WordPress Documentation
- [File Structure of a Block](https://developer.wordpress.org/block-editor/getting-started/fundamentals/file-structure-of-a-block/)
- [Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)

### LightSpeed Guidelines
- [PHP Block Instructions](../.github/instructions/php-block.instructions.md)
- [Pattern Development Instructions](../.github/instructions/pattern-development.instructions.md)
- [Coding Standards](../.github/instructions/coding-standards.instructions.md)

## Next Steps

This implementation serves as a template for creating WordPress blocks in LightSpeed projects. Developers can:

1. Copy this structure for new blocks
2. Modify the configuration in `block.json`
3. Customize the React components in `edit.js` and `save.js`
4. Add custom styling in the SCSS files
5. Extend PHP functionality as needed
6. Create additional patterns following the examples

The structure is designed to be scalable and maintainable while following WordPress and LightSpeed best practices.