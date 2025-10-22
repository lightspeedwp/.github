# Babel Configuration

## ⚙️ JavaScript Compilation & Transformation

## Table of Contents

- [Overview](#overview)
- [Installation & Configuration](#installation--configuration)
- [WordPress Integration](#wordpress-integration)
- [Presets & Plugins](#presets--plugins)
- [Usage](#usage)
- [Integration](#integration)

## Overview

**Babel** compiles modern JavaScript (ES6+, JSX) into backward-compatible code for WordPress environments. Our configuration uses WordPress Babel presets to ensure compatibility with WordPress core and block development.

> **💡 Key Benefits:** Modern JavaScript syntax, JSX support, WordPress compatibility, optimized builds

## Installation & Configuration

### **Quick Setup**

```bash
# Install Babel with WordPress preset
npm install --save-dev @babel/core @wordpress/babel-preset-default

# Create configuration file
echo 'module.exports = { presets: ["@wordpress/babel-preset-default"] };' > .babelrc.js
```

### **Configuration File Example**

```javascript
// .babelrc.js
module.exports = {
	presets: [
		[
			'@wordpress/babel-preset-default',
			{
				// WordPress-specific options
				modules: false, // Preserve ES modules for tree-shaking
				targets: {
					browsers: ['extends @wordpress/browserslist-config']
				}
			}
		]
	],
	plugins: [
		// Additional plugins for advanced features
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-object-rest-spread'
	],
	env: {
		test: {
			presets: [['@wordpress/babel-preset-default', { modules: 'commonjs' }]]
		}
	}
};
```

## WordPress Integration

### **WordPress Babel Preset**

The `@wordpress/babel-preset-default` includes:

- ✅ **ES2015+ transformation** for older browser support
- ✅ **JSX compilation** for React components
- ✅ **WordPress block JSX pragma** (`wp.element.createElement`)
- ✅ **Dynamic imports** for code splitting
- ✅ **Object spread** and **optional chaining**

### **Package.json Configuration**

```json
{
	"devDependencies": {
		"@babel/core": "^7.22.0",
		"@wordpress/babel-preset-default": "^7.0.0",
		"@wordpress/browserslist-config": "^5.0.0",
		"babel-loader": "^9.0.0"
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
		"format": "wp-scripts format"
	}
}
```

## Presets & Plugins

### **Core Presets**

| Preset | Purpose | WordPress Usage |
|--------|---------|----------------|
| `@wordpress/babel-preset-default` | WordPress-optimized compilation | Block development |
| `@babel/preset-env` | Modern JS transformation | Included in WP preset |
| `@babel/preset-react` | JSX transformation | Included in WP preset |
| `@babel/preset-typescript` | TypeScript support | Optional add-on |

### **Essential Plugins**

```javascript
// Advanced .babelrc.js configuration
module.exports = {
	presets: ['@wordpress/babel-preset-default'],
	plugins: [
		// WordPress-specific
		'@wordpress/babel-plugin-makepot', // i18n extraction
		
		// Modern JavaScript
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-optional-chaining',
		'@babel/plugin-proposal-nullish-coalescing-operator',
		
		// Development
		['@babel/plugin-transform-react-jsx', {
			pragma: 'wp.element.createElement'
		}]
	]
};
```

### **Environment-specific Configuration**

```javascript
module.exports = {
	presets: ['@wordpress/babel-preset-default'],
	env: {
		// Test environment (Jest)
		test: {
			presets: [
				['@wordpress/babel-preset-default', {
					modules: 'commonjs' // Required for Jest
				}]
			]
		},
		// Production optimizations
		production: {
			plugins: [
				'babel-plugin-transform-remove-console',
				['babel-plugin-transform-remove-debugger']
			]
		}
	}
};
```

## Usage

### **With Webpack (WordPress Scripts)**

```javascript
// webpack.config.js (if customizing)
module.exports = {
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
};
```

### **Command Line Usage**

```bash
# Compile single file
npx babel src/index.js --out-file build/index.js

# Compile directory
npx babel src --out-dir build

# Watch mode
npx babel src --out-dir build --watch

# Use specific config
npx babel src --config-file ./custom.babel.config.js
```

### **Integration with Jest**

```javascript
// jest.config.js
module.exports = {
	preset: '@wordpress/jest-preset-default',
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
			configFile: './.babelrc.js'
		}]
	}
};
```

## Integration

**Related Configuration:**

- **[Jest Configuration](./project-jest.md)** - Testing with Babel compilation  
- **[ESLint Configuration](./lint-eslint.md)** - Linting compiled code  
- **[PostCSS Configuration](./project-postcss.md)** - CSS processing pipeline  
- **[Package.json Scripts](./npm-scripts.md)** - Build and development commands  

---

> **Next Steps:** Set up PostCSS for CSS processing → [project-postcss.md](./project-postcss.md)
