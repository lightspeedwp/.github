---
file_type: "instructions"
applyTo: "**/*.{js,jsx,ts,tsx,php}"
description: "Comprehensive WordPress block development standards for block plugins"
license: "GPL-3.0-or-later"
---

> ⚠️ **Scope Notice**: These instructions are intended for **WordPress block plugin repositories** within the `lightspeedwp` GitHub organisation. They should **not** be applied to the `lightspeedwp/.github` community health repository, as that repository does not contain WordPress code.

# WordPress Block Development Guidelines

## Overview

Modern WordPress block development using `@wordpress/scripts`, block.json-first approach, and best practices for maintainability, accessibility, and performance.

## Project Structure

```
my-block-plugin/
├── block.json              # Block registration and metadata
├── package.json            # Dependencies and scripts
├── src/
│   ├── index.js           # Block registration
│   ├── edit.js            # Editor component
│   ├── save.js            # Saved content
│   ├── style.scss         # Frontend + editor styles
│   ├── editor.scss        # Editor-only styles
│   └── view.js            # Frontend interactivity (optional)
├── build/                 # Compiled assets (gitignored)
├── render.php             # Dynamic rendering (optional)
└── README.md
```

## Block Registration

### Modern Registration with block.json

```javascript
// src/index.js
import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import save from "./save";
import metadata from "../block.json";
import "./style.scss";
import "./editor.scss";

registerBlockType(metadata.name, {
  edit: Edit,
  save,
});
```

### Block Metadata (block.json)

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "myplugin/my-block",
  "title": "My Block",
  "category": "widgets",
  "icon": "smiley",
  "description": "A description of my block",
  "keywords": ["keyword1", "keyword2"],
  "version": "1.0.0",
  "textdomain": "my-plugin",
  "editorScript": "file:./build/index.js",
  "editorStyle": "file:./build/index.css",
  "style": "file:./build/style-index.css",
  "viewScript": "file:./build/view.js",
  "render": "file:./render.php"
}
```

## Editor Component (edit.js)

### Functional Component Pattern

```javascript
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from "@wordpress/block-editor";
import { PanelBody, ToggleControl, SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export default function Edit({ attributes, setAttributes }) {
  const { content, showTitle, alignment } = attributes;
  const blockProps = useBlockProps({
    className: `align-${alignment}`,
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Settings", "my-plugin")}>
          <ToggleControl
            label={__("Show Title", "my-plugin")}
            checked={showTitle}
            onChange={(value) => setAttributes({ showTitle: value })}
          />
          <SelectControl
            label={__("Alignment", "my-plugin")}
            value={alignment}
            options={[
              { label: __("Left", "my-plugin"), value: "left" },
              { label: __("Center", "my-plugin"), value: "center" },
              { label: __("Right", "my-plugin"), value: "right" },
            ]}
            onChange={(value) => setAttributes({ alignment: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        {showTitle && (
          <RichText
            tagName="h2"
            value={content}
            onChange={(value) => setAttributes({ content: value })}
            placeholder={__("Enter title...", "my-plugin")}
          />
        )}
      </div>
    </>
  );
}
```

## Save Function (save.js)

### Static Rendering

```javascript
import { useBlockProps, RichText } from "@wordpress/block-editor";

export default function save({ attributes }) {
  const { content, showTitle, alignment } = attributes;
  const blockProps = useBlockProps.save({
    className: `align-${alignment}`,
  });

  return (
    <div {...blockProps}>
      {showTitle && <RichText.Content tagName="h2" value={content} />}
    </div>
  );
}
```

### Dynamic Rendering (render.php)

```php
<?php
/**
 * Dynamic block rendering
 *
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */
$alignment = $attributes['alignment'] ?? 'left';
$show_title = $attributes['showTitle'] ?? true;
$content = $attributes['content'] ?? '';

$wrapper_attributes = get_block_wrapper_attributes([
 'class' => 'align-' . esc_attr($alignment),
]);
?>

<div <?php echo $wrapper_attributes; ?>>
 <?php if ($show_title && !empty($content)) : ?>
  <h2><?php echo wp_kses_post($content); ?></h2>
 <?php endif; ?>
</div>
```

## Block Supports

### Leveraging Core Features

Use `block.json` supports instead of custom controls:

```json
{
  "supports": {
    "align": ["left", "center", "right", "wide", "full"],
    "color": {
      "background": true,
      "text": true,
      "gradients": true
    },
    "spacing": {
      "margin": true,
      "padding": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true
    },
    "anchor": true,
    "html": false
  }
}
```

### Benefits of Block Supports

- Consistent UI across blocks
- Automatic accessibility features
- Reduced code maintenance
- Theme.json integration
- Future WordPress compatibility

## Frontend Interactivity

### View Script (view.js)

```javascript
import domReady from "@wordpress/dom-ready";

domReady(() => {
  const blocks = document.querySelectorAll(".wp-block-myplugin-my-block");

  blocks.forEach((block) => {
    const button = block.querySelector(".my-button");
    if (button) {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        // Handle interaction
      });
    }
  });
});
```

### Interactive API (WordPress 6.5+)

```javascript
import { store, getContext } from "@wordpress/interactivity";

store("myplugin/my-block", {
  actions: {
    toggle: () => {
      const context = getContext();
      context.isOpen = !context.isOpen;
    },
  },
  callbacks: {
    logIsOpen: () => {
      const { isOpen } = getContext();
      console.log("Is open:", isOpen);
    },
  },
});
```

## Internationalization

### Translating Strings

```javascript
import { __ } from "@wordpress/i18n";

// Simple translation
__("Hello World", "my-plugin");

// Translation with context
_x("Post", "noun", "my-plugin");

// Plural forms
_n("One item", "%d items", count, "my-plugin");

// Translation with sprintf
sprintf(__("Welcome, %s!", "my-plugin"), userName);
```

### PHP Translations

```php
<?php
// Simple translation
esc_html__('Hello World', 'my-plugin');

// Escape and translate
esc_html__('Safe text', 'my-plugin');
esc_attr__('Attribute value', 'my-plugin');

// With context
esc_html_x('Post', 'noun', 'my-plugin');

// Plural forms
esc_html(
 _n('One item', '%d items', $count, 'my-plugin')
);
```

## Performance Best Practices

### Code Splitting

```javascript
// Lazy load heavy dependencies
const HeavyComponent = lazy(() => import("./HeavyComponent"));

// Use Suspense for loading state
<Suspense fallback={<Spinner />}>
  <HeavyComponent />
</Suspense>;
```

### Efficient Rendering

```javascript
import { memo } from "@wordpress/element";

// Memoize components that don't need frequent re-renders
export default memo(MyComponent, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});
```

### Asset Optimization

- Use `@wordpress/scripts` for automatic optimization
- Minimize dependencies
- Tree-shake unused code
- Lazy load frontend scripts
- Optimize images and SVGs

## Accessibility Requirements

### Keyboard Navigation

```javascript
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }}
  aria-label={__("Descriptive label", "my-plugin")}
>
  {__("Click me", "my-plugin")}
</button>
```

### ARIA Attributes

```javascript
<div
  role="region"
  aria-labelledby="block-title"
  aria-describedby="block-description"
>
  <h2 id="block-title">{title}</h2>
  <p id="block-description">{description}</p>
</div>
```

### Screen Reader Support

- Use semantic HTML elements
- Provide descriptive labels
- Include skip links where appropriate
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Follow WCAG 2.2 AA standards

## Testing

### Manual Testing

- [ ] Block inserts correctly
- [ ] Attributes save and restore
- [ ] Block variations work
- [ ] Mobile responsive
- [ ] RTL language support
- [ ] Keyboard accessible
- [ ] Screen reader compatible

### Automated Testing

```javascript
// Jest test example
import { render } from "@testing-library/react";
import Edit from "../edit";

describe("Edit component", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <Edit attributes={{}} setAttributes={() => {}} />,
    );
    expect(container).toBeTruthy();
  });
});
```

## Build Process

### Using @wordpress/scripts

```json
{
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start",
    "lint:js": "wp-scripts lint-js",
    "lint:style": "wp-scripts lint-style",
    "test:unit": "wp-scripts test-unit-js"
  }
}
```

### Zero Configuration

`@wordpress/scripts` provides:

- Webpack configuration
- Babel transpilation
- PostCSS processing
- ESLint rules
- Jest testing
- Dependency extraction

## Security

### Input Validation

```php
// Validate attributes
function validate_attributes($attributes) {
 return array_merge([
  'alignment' => 'left',
  'showTitle' => true,
 ], array_intersect_key($attributes, [
  'alignment' => true,
  'showTitle' => true,
 ]));
}
```

### Output Escaping

```php
// Escape based on context
echo esc_html($text);           // Plain text
echo esc_attr($attribute);      // HTML attribute
echo esc_url($url);            // URL
echo wp_kses_post($html);      // HTML content
```

### Capability Checks

```php
if (!current_user_can('edit_posts')) {
 wp_die(__('Unauthorized', 'my-plugin'));
}
```

## References

- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [@wordpress/scripts Documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [Block Supports](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [WPCS Accessibility](../wpcs/wpcs-accessibility.instructions.md)
- [Block JSON Reference](./block-json.instructions.md)
