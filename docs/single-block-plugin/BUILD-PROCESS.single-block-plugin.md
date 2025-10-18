# Single Block Plugin Build Process

This document details the build process specifically for WordPress single block plugins, covering development workflow, tools, and best practices.

## Table of Contents

1. [Introduction](#introduction)
2. [Development Environment Setup](#development-environment-setup)
3. [Scaffolding and Initialization](#scaffolding-and-initialization)
4. [Core Development Workflow](#core-development-workflow)
5. [Asset Compilation](#asset-compilation)
6. [Block Development Components](#block-development-components)
7. [Testing](#testing)
8. [Deployment and Distribution](#deployment-and-distribution)
9. [AI-Assisted Block Development](#ai-assisted-block-development)
10. [Advanced Customizations](#advanced-customizations)

## Introduction

A single block plugin represents one of the most focused WordPress development projects: it adds exactly one custom block to the WordPress block editor (Gutenberg). Despite its targeted scope, a single block plugin requires modern build tools and processes to create an optimized, maintainable, and user-friendly experience.

Single block plugins are ideal for:
- Focused functionality that works independently
- Learning block development fundamentals
- Creating highly specialized content elements
- Deploying specific functionality quickly without broader theme changes

This document outlines the complete build process from initial setup through deployment, emphasizing best practices for efficient, high-quality development.

## Development Environment Setup

Before starting development, set up a consistent and reliable local environment:

### WordPress Installation

Choose one of these approaches:

1. **wp-env (Recommended)**
   - Install: `npm i -g @wordpress/env`
   - Initialize: `wp-env start` (from project directory)
   - Advantages: Docker-based, consistent across team members, simple configuration

2. **LocalWP**
   - Install from [localwp.com](https://localwp.com/)
   - Create a new site with latest WordPress version
   - Advantages: User-friendly GUI, easy database management

3. **Manual LAMP/LEMP Stack**
   - Configure Apache/Nginx, MySQL, and PHP
   - Install WordPress manually
   - Advantages: Full control over server configuration

### Required Development Tools

1. **Node.js and npm**
   - Install Node.js (LTS version recommended)
   - Update npm: `npm install -g npm@latest`

2. **Code Editor Setup**
   - VS Code with WordPress extensions (recommended)
   - ESLint and Stylelint configuration
   - PHP_CodeSniffer with WordPress standards

3. **Version Control**
   - Git repository initialization
   - .gitignore for build artifacts and dependencies

## Scaffolding and Initialization

The fastest way to start a single block plugin is with the official WordPress create-block tool:

### Using @wordpress/create-block

```bash
# Navigate to your plugins directory
cd wp-content/plugins/

# Create new block plugin
npx @wordpress/create-block my-single-block

# Navigate to new plugin directory
cd my-single-block

# Install dependencies
npm install
```

This command generates a complete plugin structure with:
- Main plugin PHP file
- block.json for block registration
- JavaScript source files (edit.js, save.js, index.js)
- SCSS files for styling
- Build configuration using @wordpress/scripts

### Alternative: Manual Setup

For more customization, you can create the structure manually:

1. Create plugin directory and main PHP file
2. Set up package.json with dependencies
3. Configure webpack (or use @wordpress/scripts)
4. Create src directory with block files
5. Configure block.json manually

### Project Structure

A typical single block plugin structure:

```
my-single-block/
├── build/                  # Compiled assets (generated)
├── src/
│   ├── block.json          # Block metadata
│   ├── edit.js             # Editor interface
│   ├── editor.scss         # Editor-only styles
│   ├── index.js            # Main entry point
│   ├── save.js             # Saved content structure
│   └── style.scss          # Front-end styles
├── my-single-block.php     # Main plugin file
├── package.json            # Dependencies and scripts
└── readme.txt              # WordPress.org readme
```

## Core Development Workflow

The development process centers around these key files:

### Main Plugin File (PHP)

The entry point that registers your block with WordPress:

```php
<?php
/**
 * Plugin Name: My Single Block
 * Description: A custom block for the WordPress editor
 * Version: 1.0.0
 * Author: Your Name
 */

// Exit if accessed directly.
defined('ABSPATH') || exit;

/**
 * Register the block
 */
function my_single_block_init() {
    register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'my_single_block_init' );
```

### block.json

The block metadata file defines your block's properties:

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "my-namespace/my-block",
  "version": "1.0.0",
  "title": "My Block",
  "category": "widgets",
  "icon": "smiley",
  "description": "My custom block description",
  "supports": {
    "html": false
  },
  "textdomain": "my-single-block",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "attributes": {
    "content": {
      "type": "string",
      "default": ""
    }
  }
}
```

### JavaScript Files

1. **index.js** - Entry point that imports and registers your block
2. **edit.js** - React component for the editor interface
3. **save.js** - React component for the saved content (or null for dynamic blocks)

## Asset Compilation

The build process transforms modern source code into compatible, optimized assets:

### Development Build

```bash
# Start development mode with auto-reloading
npm start
```

This command:
- Watches for file changes
- Compiles JavaScript with webpack
- Transpiles modern JS with Babel
- Compiles SCSS to CSS
- Refreshes the browser

### Production Build

```bash
# Build for production
npm run build
```

This command:
- Optimizes and minifies JS and CSS
- Removes development-only code
- Creates source maps
- Prepares assets for deployment

## Block Development Components

### Static vs. Dynamic Blocks

**Static Blocks:**
- Save output as HTML in the database
- Render exactly as saved
- Implementation: Both edit.js and save.js export React components

**Dynamic Blocks:**
- Save attributes in the database
- Render with PHP on the front end
- Implementation: save.js returns null, render.php handles front-end display

### Block Attributes

Define data that can be modified in the editor:

```js
// In block.json
"attributes": {
  "content": {
    "type": "string",
    "default": "Default content"
  },
  "alignment": {
    "type": "string",
    "default": "left"
  }
}
```

### Block Controls

Add settings and controls in the editor:

```jsx
// In edit.js
import { useBlockProps, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { ToolbarGroup, PanelBody, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();
  
  return (
    <>
      <InspectorControls>
        <PanelBody title="Block Settings">
          <TextControl
            label="Custom Setting"
            value={attributes.content}
            onChange={(content) => setAttributes({ content })}
          />
        </PanelBody>
      </InspectorControls>
      
      <BlockControls>
        <ToolbarGroup>
          {/* Toolbar controls here */}
        </ToolbarGroup>
      </BlockControls>
      
      <div {...blockProps}>
        {/* Block content here */}
        {attributes.content}
      </div>
    </>
  );
}
```

### Styling

Style your block for both editor and front end:

```scss
// editor.scss - Editor-only styles
.wp-block-my-namespace-my-block {
  border: 1px dashed #f00;
}

// style.scss - Editor and front-end styles
.wp-block-my-namespace-my-block {
  padding: 20px;
  background: #f8f8f8;
}
```

## Testing

Comprehensive testing ensures your block works properly:

### JavaScript Testing

```bash
# Run Jest tests
npm test
```

Create tests in `__tests__` directories:

```js
// edit.test.js
import { render, screen } from '@testing-library/react';
import Edit from '../edit';

describe('Edit', () => {
  test('renders content', () => {
    render(<Edit attributes={{ content: 'Test content' }} setAttributes={() => {}} />);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
```

### End-to-End Testing

Test the block in the actual editor:

```bash
# Run Playwright e2e tests
npm run test:e2e
```

```js
// block-e2e.spec.js
describe('Block', () => {
  test('can be inserted', async ({ page }) => {
    await page.goto('/wp-admin/post-new.php');
    await page.click('.block-editor-inserter__toggle');
    await page.fill('input[placeholder="Search"]', 'My Block');
    await page.click('button:has-text("My Block")');
    
    // Test block is inserted and works correctly
    await expect(page.locator('.wp-block-my-namespace-my-block')).toBeVisible();
  });
});
```

### WordPress Compatibility

Test your block with:
- Different WordPress versions
- Various themes
- Common plugins that might interact with your block

## Deployment and Distribution

### Packaging for WordPress.org

1. **Prepare your readme.txt**
   - Follow WordPress.org requirements
   - Include screenshots and detailed descriptions

2. **Build production assets**
   ```bash
   npm run build
   ```

3. **Create distributable zip**
   ```bash
   npm run plugin-zip
   ```

4. **Submit to WordPress.org**
   - Upload your zip file
   - Follow the plugin review process

### Direct Distribution

For client work or premium plugins:
1. Create zip file with build assets
2. Distribute through your chosen channels
3. Provide installation instructions

## AI-Assisted Block Development

Leverage AI tools to accelerate development:

### Code Generation

- Use GitHub Copilot to suggest block code
- Generate editor components based on descriptions
- Create test cases automatically

### Block Design Assistance

- Generate CSS styling with AI
- Create accessible color schemes
- Convert design mockups to block code

### Documentation

- Generate block usage documentation
- Create code comments
- Write WordPress.org readme content

## Advanced Customizations

### Custom webpack Configuration

If @wordpress/scripts doesn't meet your needs:

```js
// webpack.config.js
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
  ...defaultConfig,
  // Add custom config here
};
```

### Extending @wordpress/scripts

Add custom npm scripts:

```json
// package.json
"scripts": {
  "start": "wp-scripts start",
  "build": "wp-scripts build",
  "custom": "node ./scripts/custom-process.js && wp-scripts build"
}
```

### Multiple Entry Points

For more complex single blocks:

```js
// webpack.config.js
module.exports = {
  ...defaultConfig,
  entry: {
    index: './src/index.js',
    frontend: './src/frontend.js',
    admin: './src/admin.js',
  }
};
```

---

This build process guide provides a comprehensive approach to developing a single block plugin. By following these steps and best practices, you can create high-quality, maintainable blocks that enhance the WordPress editing experience.
