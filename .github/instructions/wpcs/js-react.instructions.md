---
file_type: "instructions"
title: "WordPress JavaScript/React Development Standards"
description: "Comprehensive standards for WordPress JavaScript and React block development following WordPress and LightSpeed conventions."
version: "v2.1"
last_updated: "2025-11-27"
author: "LightSpeedWP Team"
maintainer: "Engineering Team"
owners: ["lightspeedwp/maintainers"]
tags: ["javascript", "react", "wordpress", "blocks", "jsx", "tsx"]
applyTo: "**/*.{js,jsx,ts,tsx}"
domain: "wp-core"
stability: "stable"
references:
  - path: ".github/instructions/coding-standards.instructions.md"
    description: "Unified coding standards"
  - path: ".github/instructions/inline-docs/inline-jsdoc.instructions.md"
    description: "JSDoc documentation standards"
  - path: ".github/instructions/linting/linting-javascript.instructions.md"
    description: "JavaScript linting standards"
  - path: ".github/instructions/wpcs.instructions.md"
    description: "WordPress coding standards index"
---

# WordPress JavaScript/React Development Standards

Comprehensive guide for JavaScript and React development in WordPress projects, including block development, utilities, and integration with WordPress APIs.

## Core Principles

- Follow [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- Use WordPress packages (`@wordpress/\*`) for core functionality
- Prioritize accessibility and semantic HTML
- Use hooks and functional components in React
- Escape all dynamic output appropriately
- Prefer composition over inheritance

## Language & Formatting

### JavaScript Standards

- **ES Version**: ES2020+ with Babel transpilation
- **Indentation**: 2 spaces (no tabs)
- **Line Length**: 80 characters maximum (120 recommended in some contexts)
- **Quotes**: Single quotes (`'`) for strings, template literals for interpolation
- **Semicolons**: Required at end of statements
- **Naming**: `camelCase` for variables/functions, `PascalCase` for classes/components
- **Constants**: `UPPER_SNAKE_CASE` for true constants

### Valid Examples

```javascript
// ✅ Good
const myVariable = "value";
function calculateTotal(price, tax) {
  return price * (1 + tax);
}

const MyComponent = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>;
};

// ❌ Bad
const myVariable = "value"; // Use single quotes
function calculateTotal(price, tax) {
  return price * (1 + tax);
} // Format properly
const my_variable = "value"; // Use camelCase
```

### TypeScript in WordPress

- Use TypeScript for new block development
- Define interfaces for props and component state
- Export type definitions from utilities
- Use strict mode in `tsconfig.json`

```typescript
interface MyComponentProps {
  title: string;
  onClick: (event: React.MouseEvent) => void;
  isLoading?: boolean;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onClick, isLoading = false }) => {
  return (
    <button onClick={onClick} disabled={isLoading}>
      {title}
    </button>
  );
};

export default MyComponent;
```

## WordPress Package Usage

### Recommended WordPress Packages

```javascript
// State Management
import { useSelect, useDispatch } from "@wordpress/data";

// Components
import { Button, Panel, PanelBody, TextControl } from "@wordpress/components";

// Block Editor
import {
  RichText,
  useBlockProps,
  InspectorControls,
} from "@wordpress/block-editor";

// Utilities
import { __ } from "@wordpress/i18n";
import { applyFilters } from "@wordpress/hooks";

// API
import apiFetch from "@wordpress/api-fetch";

// Notices
import { useNotices } from "@wordpress/notices";
```

### Priority Order for Imports

1. React and React-related (React, React Hooks)
2. WordPress packages (`@wordpress/\*`)
3. External libraries (third-party npm packages)
4. Local utilities and components
5. Constants and types

```javascript
// ✅ Good import order
import React, { useState, useCallback } from 'react';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import lodash from 'lodash';
import { MyUtility } from './utils';
import { SITE_NAME } from './constants';
import type { MyComponentProps } from './types';
```

## Block Development

### Block Structure

Standard block structure using `block.json`:

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "plugin-name/my-block",
  "title": "My Block",
  "category": "common",
  "icon": "star",
  "description": "A brief description of the block",
  "keywords": ["keyword1", "keyword2"],
  "textdomain": "plugin-name",
  "attributes": {
    "content": {
      "type": "string",
      "source": "html",
      "selector": "p"
    },
    "alignment": {
      "type": "string",
      "default": "left"
    }
  },
  "supports": {
    "anchor": true,
    "html": false,
    "align": ["left", "center", "right"],
    "color": {
      "text": true,
      "background": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./editor.css",
  "style": "file:./style.css"
}
```

### Block Component Template

```javascript
/**
 * WordPress dependencies
 */
import {
  RichText,
  useBlockProps,
  InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody, TextControl, SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import "./editor.css";

/**
 * Edit component for the block.
 *
 * @param {Object} props - Component props
 * @param {Object} props.attributes - Block attributes
 * @param {string} props.attributes.content - Block content
 * @param {string} props.attributes.alignment - Text alignment
 * @param {Function} props.setAttributes - Function to update attributes
 * @returns {Element} Block edit element
 */
export default function Edit({ attributes, setAttributes }) {
  const { content, alignment } = attributes;
  const blockProps = useBlockProps({
    className: `align-${alignment}`,
  });

  return (
    <>
      <div {...blockProps}>
        <RichText
          tagName="p"
          value={content}
          onChange={(newContent) => setAttributes({ content: newContent })}
          placeholder={__("Add content...", "plugin-name")}
        />
      </div>

      <InspectorControls>
        <PanelBody
          title={__("Block Settings", "plugin-name")}
          initialOpen={true}
        >
          <SelectControl
            label={__("Alignment", "plugin-name")}
            value={alignment}
            options={[
              { label: __("Left", "plugin-name"), value: "left" },
              { label: __("Center", "plugin-name"), value: "center" },
              { label: __("Right", "plugin-name"), value: "right" },
            ]}
            onChange={(newAlignment) =>
              setAttributes({ alignment: newAlignment })
            }
          />
        </PanelBody>
      </InspectorControls>
    </>
  );
}
```

## React & Hooks

### Functional Components

Always use functional components with hooks:

```javascript
// ✅ Good - Functional component
const MyComponent = ({ title, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  return isOpen ? <div>{title}</div> : null;
};

// ❌ Bad - Class component (use functional)
class MyComponent extends React.Component {
  // ...
}
```

### Hook Usage

**Essential Hooks:**

- `useState`: Manage component state
- `useEffect`: Side effects
- `useCallback`: Memoize callbacks
- `useMemo`: Memoize expensive computations
- `useContext`: Access context values
- `useReducer`: Complex state logic

**WordPress Hooks:**

- `useSelect`: Access WordPress data
- `useDispatch`: Dispatch actions to stores
- `useNotices`: Manage notifications
- `useBlockProps`: Apply block wrapper props

```javascript
// ✅ Good hook usage
const MyComponent = ({ postId }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data when postId changes
  const posts = useSelect(
    (select) => {
      return select("core").getEntityRecords("postType", "post", {
        search: searchTerm,
      });
    },
    [searchTerm],
  );

  // Memoized callback
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Effect for side effects
  useEffect(() => {
    // Cleanup logic
    return () => {
      // Cleanup
    };
  }, [postId]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

### Performance Optimization

```javascript
// Memoize components that receive props
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});

// Memoize values
const MyComponent = ({ items }) => {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return (
    <ul>
      {sortedItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// Memoize callbacks
const ParentComponent = () => {
  const handleClick = useCallback(() => {
    console.log("Clicked");
  }, []);

  return <Child onClick={handleClick} />;
};
```

## Internationalization (i18n)

### String Translation

Always wrap user-facing strings in translation functions:

```javascript
import { __, _x, _n } from "@wordpress/i18n";

// Simple translation
const label = __("Save Changes", "plugin-name");

// With context
const color = _x("Red", "color", "plugin-name");

// Pluralization
const message = _n("One item", "%d items", itemCount, "plugin-name");
```

### Translator Comments

```javascript
// translators: %s is the user's name
const greeting = sprintf(__("Hello %s!", "plugin-name"), userName);

// translators: This is shown in the admin
const adminText = __("Admin Only Content", "plugin-name");
```

## Security & Escaping

### Escaping Output

```javascript
import { escapeHtml } from '@wordpress/escape-html';
import { sanitizeUrl } from '@wordpress/url';

// For HTML
const safeName = escapeHtml(userInput);

// For URLs
const safeUrl = sanitizeUrl(userUrl);

// In JSX
<div>{escapeHtml(content)}</div>

// For HTML attributes
<button
  aria-label={escapeHtml(tooltipText)}
  data-value={escapeHtml(dataValue)}
>
  Click me
</button>
```

### Nonces in AJAX

```javascript
// In PHP (enqueue script with nonce)
wp_enqueue_script(
  'my-script',
  'my-script.js',
  array('jquery'),
  '1.0',
  true
);

wp_localize_script('my-script', 'myData', array(
  'nonce' => wp_create_nonce('my_nonce'),
  'ajaxUrl' => admin_url('admin-ajax.php'),
));

// In JavaScript (use nonce)
import apiFetch from '@wordpress/api-fetch';

apiFetch({
  path: '/wp/v2/posts',
  method: 'POST',
  headers: {
    'X-WP-Nonce': myData.nonce,
  },
  data: {
    title: 'My Post',
  },
});
```

## Data Fetching

### Using the REST API

```javascript
import apiFetch from "@wordpress/api-fetch";

// GET request
apiFetch({ path: "/wp/v2/posts" })
  .then((posts) => {
    console.log(posts);
  })
  .catch((error) => {
    console.error("Error fetching posts:", error);
  });

// POST request
apiFetch({
  path: "/wp/v2/posts",
  method: "POST",
  data: {
    title: "New Post",
    content: "Post content",
    status: "draft",
  },
})
  .then((post) => {
    console.log("Post created:", post);
  })
  .catch((error) => {
    console.error("Error creating post:", error);
  });
```

### Using WordPress Data Store

```javascript
import { useSelect, useDispatch } from "@wordpress/data";

// Selecting data
const posts = useSelect((select) => {
  return select("core").getEntityRecords("postType", "post");
}, []);

// Dispatching actions
const { saveEntityRecord } = useDispatch("core");

const handleSave = async (post) => {
  await saveEntityRecord("postType", "post", post);
};
```

## Testing

### Jest Setup

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
```

### Component Testing

```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(<MyComponent onClick={onClick} />);
    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalled();
  });
});
```

## Common Patterns

### Custom Hook

```javascript
/**
 * Hook to fetch posts with search.
 *
 * @param {Object} options - Hook options
 * @param {string} options.searchTerm - Search term
 * @param {number} options.limit - Results limit
 * @returns {Object} Posts data and loading state
 */
export function usePosts({ searchTerm = "", limit = 10 } = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/wp-json/wp/v2/posts?search=${searchTerm}&per_page=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [searchTerm, limit]);

  return { posts, loading, error };
}
```

### Context for Shared State

```javascript
// MyContext.js
const MyContext = React.createContext();

export function MyProvider({ children }) {
  const [state, setState] = useState(initialState);

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = React.useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within MyProvider");
  }
  return context;
}
```

## Documentation

### JSDoc Comments

```javascript
/**
 * Fetches posts from the REST API.
 *
 * @async
 * @param {Object} options - Fetch options
 * @param {string} options.search - Search term
 * @param {number} [options.limit=10] - Number of posts to fetch
 * @returns {Promise<Array>} Array of post objects
 * @throws {Error} If the fetch request fails
 *
 * @example
 * const posts = await fetchPosts({ search: 'hello', limit: 20 });
 * console.log(posts);
 */
export async function fetchPosts({ search = "", limit = 10 } = {}) {
  // Implementation
}
```

### Component Props Documentation

```javascript
/**
 * Post card component for displaying post previews.
 *
 * @param {Object} props - Component props
 * @param {number} props.postId - ID of the post
 * @param {string} props.title - Post title
 * @param {string} props.excerpt - Post excerpt
 * @param {Function} props.onOpen - Callback when card is clicked
 * @returns {Element} Rendered post card
 *
 * @example
 * <PostCard
 *   postId={123}
 *   title="My Post"
 *   excerpt="Post preview..."
 *   onOpen={() => console.log('opened')}
 * />
 */
export function PostCard({ postId, title, excerpt, onOpen }) {
  // Implementation
}
```

## CSS-in-JS & Styling

### Inline Styles in React

```javascript
// ✅ Good - Use style objects
const MyComponent = ({ isActive }) => {
  const styles = useMemo(
    () => ({
      button: {
        padding: "10px 15px",
        backgroundColor: isActive ? "#007cba" : "#ddd",
        color: isActive ? "#fff" : "#000",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      },
    }),
    [isActive],
  );

  return <button style={styles.button}>Click me</button>;
};
```

### Class Names

```javascript
// Use classnames utility
import classnames from "classnames";

const MyComponent = ({ isActive, isDisabled }) => {
  return (
    <div
      className={classnames(
        "my-component",
        { "is-active": isActive },
        { "is-disabled": isDisabled },
      )}
    >
      Content
    </div>
  );
};
```

## Best Practices Summary

✅ **DO:**

- Use functional components with hooks
- Follow WordPress package conventions
- Wrap user-facing strings in i18n functions
- Escape all dynamic output
- Write JSDoc comments for all functions
- Use meaningful variable/function names
- Test components thoroughly
- Handle errors gracefully
- Use TypeScript for type safety

❌ **DON'T:**

- Use class components (unless legacy)
- Mix `var` or untyped code in TypeScript files
- Forget to escape output
- Create inline callbacks in render (use useCallback)
- Violate component separation of concerns
- Hard-code strings that need translation
- Ignore performance optimization opportunities
- Skip error handling in async operations

## References

- [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- [WordPress JavaScript Documentation](https://developer.wordpress.org/coding-standards/inline-documentation-standards/javascript/)
- [WordPress Data Module](https://developer.wordpress.org/plugins/packages/packages-core-data/)
- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [ESLint Configuration](https://eslint.org/docs/latest/)
- [Testing React Components](https://testing-library.com/docs/react-testing-library/intro/)
