# PostCSS Configuration

## 🎨 CSS Processing & Optimization Pipeline

## Table of Contents

- [Overview](#overview)
- [Installation & Configuration](#installation--configuration)
- [WordPress Integration](#wordpress-integration)
- [Plugins & Features](#plugins--features)
- [Usage](#usage)
- [Integration](#integration)

## Overview

**PostCSS** processes CSS with JavaScript plugins to add vendor prefixes, optimize code, and enable modern CSS features. Our configuration uses WordPress PostCSS presets for optimal WordPress theme and plugin compatibility.

> **💡 Key Benefits:** Autoprefixing, CSS optimization, modern syntax support, WordPress compatibility

## Installation & Configuration

### **Quick Setup**

```bash
# Install PostCSS with WordPress preset
npm install --save-dev postcss @wordpress/postcss-plugins-preset

# Create configuration file
echo 'module.exports = { plugins: require("@wordpress/postcss-plugins-preset") };' > postcss.config.js
```

### **Configuration File Example**

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    ...require('@wordpress/postcss-plugins-preset'),
    // Additional custom plugins
    require('autoprefixer')({
      browsers: ['extends @wordpress/browserslist-config']
    }),
    require('cssnano')({
      preset: 'default'
    })
  ]
};
```

### **Advanced Configuration**

```javascript
// postcss.config.js - Full WordPress setup
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');

module.exports = {
	plugins: [
		postcssImport(),
		postcssNested(),
		autoprefixer({
			browserslist: ['extends @wordpress/browserslist-config']
		}),
		...(process.env.NODE_ENV === 'production' ? [cssnano()] : [])
	]
};
```

## WordPress Integration

### **WordPress PostCSS Preset**

The `@wordpress/postcss-plugins-preset` includes:

- ✅ **Autoprefixer** with WordPress browser support
- ✅ **PostCSS Import** for @import handling
- ✅ **PostCSS Nested** for nested CSS rules
- ✅ **PostCSS Custom Properties** for CSS variables

### **Package.json Configuration**

```json
{
	"devDependencies": {
		"postcss": "^8.4.0",
		"@wordpress/postcss-plugins-preset": "^4.0.0",
		"@wordpress/browserslist-config": "^5.0.0",
		"postcss-loader": "^7.0.0"
	},
	"browserslist": "extends @wordpress/browserslist-config"
}
```

### **WordPress Scripts Integration**

```json
{
	"scripts": {
		"build": "wp-scripts build",
		"start": "wp-scripts start",
		"build:css": "postcss src/style.css -o build/style.css"
	}
}
```

## Plugins & Features

### **Essential Plugins**

| Plugin | Purpose | WordPress Usage |
|--------|---------|----------------|
| `autoprefixer` | Add vendor prefixes | Browser compatibility |
| `postcss-import` | Process @import rules | Modular CSS |
| `postcss-nested` | Nested CSS support | Sass-like syntax |
| `cssnano` | CSS optimization | Production builds |
| `postcss-custom-properties` | CSS variables | Modern CSS features |

### **WordPress-specific Setup**

```javascript
// postcss.config.js - WordPress theme optimized
module.exports = {
	plugins: {
		// Import handling
		'postcss-import': {},
		
		// Modern CSS features
		'postcss-nested': {},
		'postcss-custom-properties': {
			preserve: false // Convert to static values
		},
		
		// Browser compatibility
		'autoprefixer': {
			browserslist: ['extends @wordpress/browserslist-config']
		},
		
		// Production optimization
		...(process.env.NODE_ENV === 'production' && {
			'cssnano': {
				preset: ['default', {
					discardComments: {
						removeAll: true
					}
				}]
			}
		})
	}
};
```

### **Theme Development Configuration**

```javascript
// postcss.config.js - Block theme setup
module.exports = {
	plugins: [
		require('postcss-import'),
		require('postcss-mixins'),
		require('postcss-nested'),
		require('postcss-custom-media'),
		require('autoprefixer'),
		// WordPress-specific
		require('@wordpress/postcss-themes')({
			themes: {
				light: './src/css/themes/light.css',
				dark: './src/css/themes/dark.css'
			}
		})
	]
};
```

## Usage

### **Command Line**

```bash
# Process single file
npx postcss src/style.css -o build/style.css

# Process with sourcemaps
npx postcss src/style.css -o build/style.css --map

# Watch mode
npx postcss src/style.css -o build/style.css --watch

# Use custom config
npx postcss src/style.css -o build/style.css --config postcss.config.js
```

### **Webpack Integration**

```javascript
// webpack.config.js
module.exports = {
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								config: './postcss.config.js'
							}
						}
					}
				]
			}
		]
	}
};
```

### **CSS Input Example**

```css
/* src/style.css */
@import 'normalize.css';

:root {
	--primary-color: #007cba;
	--font-size: 16px;
}

.my-component {
	display: flex;
	color: var(--primary-color);
	font-size: var(--font-size);
	
	&:hover {
		opacity: 0.8;
	}
	
	.nested-element {
		padding: 1rem;
	}
}
```

## Integration

**Related Configuration:**

- **[Stylelint Configuration](./lint-stylelint.md)** - CSS linting after processing  
- **[Babel Configuration](./project-babel.md)** - JavaScript compilation pipeline  
- **[Package.json Scripts](./npm-scripts.md)** - Build and development commands  
- **[VS Code Settings](./vscode-settings.md)** - Editor CSS processing support  

---

> **Next Steps:** Set up npm scripts for build automation → [npm-scripts.md](./npm-scripts.md)
