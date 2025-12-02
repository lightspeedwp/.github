---
file_type: "instructions"
title: "JavaScript & React Development for WordPress Block Plugins"
description: "Comprehensive JavaScript and React development standards for WordPress block plugin development at LightSpeed."
version: "v2.0"
last_updated: "2025-11-27"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
owners: ["lightspeedwp/maintainers"]
applyTo: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]
tags: ["javascript", "react", "blocks", "plugin", "coding-standards"]
domain: "block-plugin"
stability: "stable"
references:
  - path: ".github/instructions/block-plugin-development.instructions.md"
    description: "Main block plugin development index"
  - path: ".github/instructions/inline-docs/inline-jsdoc.instructions.md"
    description: "JavaScript inline documentation (JSDoc) standards"
  - path: ".github/instructions/linting/linting-javascript.instructions.md"
    description: "JavaScript linting and formatting"
  - path: ".github/instructions/coding-standards.instructions.md"
    description: "Unified coding standards"
---

# JavaScript & React Development for WordPress Block Plugins

## Overview

This guide covers JavaScript and React development standards specifically for WordPress block plugins, following WordPress coding standards and LightSpeed conventions.

## Core Principles

1. **Use WordPress packages** (`@wordpress/*`) whenever available
2. **Follow WordPress Coding Standards** for JavaScript
3. **Prefer modern JavaScript** (ES6+, React Hooks)
4. **Minimize external dependencies**
5. **Prioritize accessibility** in all components
6. **Include comprehensive JSDoc** for all public functions
7. **Write tests for all components and utilities**

## File Organization

### Directory Structure

```
src/
├── blocks/              # Individual block definitions
│   ├── my-block/
│   │   ├── index.js
│   │   ├── save.js
│   │   ├── edit.js
│   │   ├── variations.js
│   │   ├── inspector.js
│   │   └── style.scss
│   └── ...
├── components/         # Reusable components
│   ├── BlockControls/
│   ├── InspectorPanel/
│   └── ...
├── utils/             # Utility functions
│   ├── helpers.js
│   ├── constants.js
│   └── validators.js
├── hooks/             # Custom React hooks
│   └── useBlockData.js
└── index.js           # Entry point
```

### Naming Conventions

- **Files**: Use kebab-case for file names: `my-component.js`
- **Components**: Use PascalCase: `MyComponent`, `BlockEditor`
- **Functions**: Use camelCase: `getBlockAttributes`, `validateInput`
- **Constants**: Use UPPER_SNAKE_CASE: `DEFAULT_SPACING`, `MAX_COLUMNS`
- **Blocks**: Use kebab-case with descriptive names: `hero-section`, `testimonial-card`

## Block Structure

### Basic Block Template

```javascript
/**
 * My Block
 * A reusable block for displaying content
 */

import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import BlockEdit from "./edit";
import BlockSave from "./save";
import blockMetadata from "./block.json";

/**
 * Register the block
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
 */
registerBlockType(blockMetadata.name, {
  ...blockMetadata,

  /**
   * Block edit component
   *
   * @param {Object} props Block properties
   * @returns {Element} Edit element
   */
  edit: BlockEdit,

  /**
   * Block save component
   *
   * @param {Object} props Block properties
   * @returns {Element} Save element
   */
  save: BlockSave,

  /**
   * Block variations
   */
  variations: [
    {
      name: "default",
      title: __("Default", "plugin-name"),
      isDefault: true,
    },
  ],
});
```

### Block Edit Component

```javascript
/**
 * Block edit component
 *
 * @param {Object} props Block properties
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Attribute setter
 * @param {Object} props.clientId Block client ID
 * @returns {Element} Edit element
 */
function BlockEdit({ attributes, setAttributes, clientId }) {
  const { title, content } = attributes;

  return (
    <div className="wp-block-plugin-my-block">
      <BlockControls>
        <ToolbarGroup>{/* Toolbar controls */}</ToolbarGroup>
      </BlockControls>

      <InspectorControls>
        <PanelBody title={__("Settings", "plugin-name")}>
          {/* Inspector controls */}
        </PanelBody>
      </InspectorControls>

      <div className="wp-block-plugin-my-block__content">
        <RichText
          value={title}
          onChange={(value) => setAttributes({ title: value })}
          placeholder={__("Enter title", "plugin-name")}
          tagName="h2"
        />
      </div>
    </div>
  );
}

export default BlockEdit;
```

### Block Save Component

```javascript
/**
 * Block save component
 *
 * @param {Object} props Block properties
 * @param {Object} props.attributes Block attributes
 * @returns {Element} Saved block element
 */
function BlockSave({ attributes }) {
  const { title, content } = attributes;

  return (
    <div className="wp-block-plugin-my-block">
      <h2>{title}</h2>
      <div className="wp-block-plugin-my-block__content">{content}</div>
    </div>
  );
}

export default BlockSave;
```

## Component Development

### Functional Components with Hooks

```javascript
/**
 * Custom component using React hooks
 *
 * @param {Object} props Component properties
 * @param {string} props.title Component title
 * @param {string} props.content Component content
 * @param {Function} props.onChange Change handler
 * @returns {Element} Component element
 */
function MyComponent({ title, content, onChange }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div className="my-component">
      <button onClick={handleToggle} aria-expanded={isExpanded}>
        {title}
      </button>
      {isExpanded && <div>{content}</div>}
    </div>
  );
}

export default MyComponent;
```

### Custom Hooks

```javascript
/**
 * Custom hook for managing block data
 *
 * @param {string} clientId Block client ID
 * @returns {Object} Block data and setter
 */
function useBlockData(clientId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/wp-json/api/block/${clientId}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  return { data, loading, error };
}

export default useBlockData;
```

## WordPress Package Usage

### Recommended Packages

```javascript
// UI Components
import { Button, Panel, PanelBody, TextControl } from "@wordpress/components";

// Block Editor
import {
  useBlockProps,
  InspectorControls,
  BlockControls,
} from "@wordpress/block-editor";

// Data & State
import { useSelect, useDispatch } from "@wordpress/data";
import { useAsyncList } from "@wordpress/compose";

// Internationalization
import { __ } from "@wordpress/i18n";

// REST API
import apiFetch from "@wordpress/api-fetch";

// Element
import { render } from "@wordpress/element";
```

### Example: Using useSelect and useDispatch

```javascript
/**
 * Component that uses WordPress data store
 *
 * @returns {Element} Component
 */
function BlockWithData() {
  const posts = useSelect((select) => {
    return select("core").getEntityRecords("postType", "post", {
      per_page: 10,
    });
  }, []);

  const { updateEntityRecord } = useDispatch("core");

  const handleUpdate = useCallback(
    (postId, data) => {
      updateEntityRecord("postType", "post", postId, data);
    },
    [updateEntityRecord],
  );

  return <div>{/* Render posts */}</div>;
}

export default BlockWithData;
```

## State Management

### Block Attributes

Always use block.json for attribute definitions:

```json
{
  "apiVersion": 3,
  "name": "plugin/my-block",
  "title": "My Block",
  "category": "widgets",
  "attributes": {
    "title": {
      "type": "string",
      "default": ""
    },
    "content": {
      "type": "string",
      "default": ""
    },
    "columns": {
      "type": "number",
      "default": 3
    },
    "align": {
      "type": "string",
      "default": "wide"
    }
  },
  "supports": {
    "align": ["wide", "full"],
    "anchor": true,
    "className": true
  }
}
```

### Managing Complex State

For complex state, use the WordPress data store:

```javascript
/**
 * Register a custom data store
 */
register({
  reducer(state = initialState, action) {
    switch (action.type) {
      case "SET_DATA":
        return { ...state, data: action.payload };
      case "SET_LOADING":
        return { ...state, loading: action.payload };
      default:
        return state;
    }
  },
  actions: {
    setData(data) {
      return { type: "SET_DATA", payload: data };
    },
    setLoading(loading) {
      return { type: "SET_LOADING", payload: loading };
    },
  },
  selectors: {
    getData(state) {
      return state.data;
    },
    isLoading(state) {
      return state.loading;
    },
  },
});
```

## Internationalization (i18n)

### String Translation

```javascript
// Simple string
__("Hello World", "plugin-text-domain");

// String with placeholder
sprintf(__("Hello %s", "plugin-text-domain"), name);

// Pluralization
_n("%d item", "%d items", count, "plugin-text-domain");

// Context
_x("Post", "noun", "plugin-text-domain");
```

### Add Translator Comments

```javascript
// translators: This is the block title shown in the block inserter
__("My Custom Block", "plugin-text-domain");

// translators: %s is the post title
sprintf(__("Related to %s", "plugin-text-domain"), title);
```

## Accessibility (a11y)

### ARIA Attributes

```javascript
/**
 * Component with accessibility features
 */
function AccessibleButton({ isExpanded, onClick }) {
  return (
    <button
      aria-expanded={isExpanded}
      aria-label={__("Toggle menu", "plugin-text-domain")}
      onClick={onClick}
    >
      Menu
    </button>
  );
}
```

### Keyboard Navigation

```javascript
/**
 * Handle keyboard events
 */
function handleKeyDown(event) {
  // Enter or Space
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleActivate();
  }
  // Escape
  if (event.key === "Escape") {
    handleClose();
  }
}
```

### Focus Management

```javascript
/**
 * Component with focus management
 */
function Modal({ isOpen, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div role="dialog" aria-modal="true">
      <button ref={closeButtonRef} onClick={onClose}>
        Close
      </button>
    </div>
  );
}
```

## Testing

### Component Tests

```javascript
/**
 * Test file: MyComponent.test.js
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("should render with title", () => {
    render(<MyComponent title="Test" content="Content" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should toggle expanded state", async () => {
    const user = userEvent.setup();
    render(<MyComponent title="Test" content="Content" />);
    const button = screen.getByRole("button");

    await user.click(button);
    expect(screen.getByText("Content")).toBeVisible();
  });
});
```

## Performance Optimization

### Memoization

```javascript
/**
 * Memoized component
 */
const MyComponent = memo(({ title, content }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
});

export default MyComponent;
```

### useCallback and useMemo

```javascript
function MyComponent({ items, onItemSelect }) {
  // Memoize the handler
  const handleSelect = useCallback((id) => onItemSelect(id), [onItemSelect]);

  // Memoize expensive computation
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items],
  );

  return (
    <div>
      {sortedItems.map((item) => (
        <button key={item.id} onClick={() => handleSelect(item.id)}>
          {item.name}
        </button>
      ))}
    </div>
  );
}
```

## Debugging

### Console Logging

```javascript
// Use descriptive log messages
console.log("Block attributes:", attributes);
console.warn("Attribute validation failed:", error);
console.error("Failed to fetch data:", error);
```

### React DevTools

- Install React DevTools browser extension for debugging
- Use Profiler to identify performance issues
- Inspect component props and state

## Common Patterns

### Conditional Rendering

```javascript
function MyBlock({ showAdvanced, attributes }) {
  return (
    <div>
      <BasicSettings />
      {showAdvanced && <AdvancedSettings />}
    </div>
  );
}
```

### List Rendering

```javascript
function ItemList({ items }) {
  return (
    <div>
      {items?.length > 0 ? (
        items.map((item) => <Item key={item.id} item={item} />)
      ) : (
        <p>No items found</p>
      )}
    </div>
  );
}
```

### Error Boundaries

```javascript
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Block error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

## References

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [WordPress Data Handbook](https://developer.wordpress.org/plugins/wordpress-org/how-wordpress-org-plugins-are-organized/)

---

_For general coding standards, see [Coding Standards Instructions](../coding-standards.instructions.md). For JSDoc requirements, see [JSDoc Standards](../inline-docs/inline-jsdoc.instructions.md)._
