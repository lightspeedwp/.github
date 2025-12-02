---
file_type: "instructions"
title: "WordPress JavaScript/React Development Standards"
description: "Comprehensive guidelines for JavaScript/React development in WordPress projects using @wordpress/* packages, ESM modules, and modern tooling."
version: "v2.1"
last_updated: "2025-11-27"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
owners: ["lightspeedwp/maintainers"]
tags: ["wordpress", "javascript", "react", "blocks", "gutenberg"]
applyTo: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]
domain: "wp-core"
stability: "stable"
references:
  - path: ".github/instructions/coding-standards.instructions.md"
    description: "Unified coding standards"
  - path: ".github/instructions/inline-docs/inline-jsdoc.instructions.md"
    description: "JSDoc documentation standards"
  - path: ".github/instructions/linting-javascript.instructions.md"
    description: "ESLint and Prettier configuration"
  - path: "https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/"
    description: "WordPress JavaScript Coding Standards"
  - path: "https://developer.wordpress.org/block-editor/"
    description: "Block Editor Handbook"
---

# WordPress JavaScript/React Development Standards

## Purpose

Guide development of JavaScript and React code in WordPress projects, ensuring consistency with WordPress core patterns, modern ES6+/ESM practices, and the `@wordpress/*` package ecosystem.

## Principles

1. **WordPress-first approach** – Use `@wordpress/*` packages where available
2. **Modern JavaScript** – ES6+, ESM modules, destructuring, arrow functions
3. **React best practices** – Functional components, hooks (not class components)
4. **Accessibility first** – ARIA, semantic HTML, keyboard navigation
5. **Minimal dependencies** – Avoid external packages when WordPress provides equivalents
6. **Type safety** – Use JSDoc for type hints (or TypeScript where appropriate)

---

## File Organization

### Directory Structure

```
src/
├── blocks/
│   ├── MyBlock/
│   │   ├── block.json
│   │   ├── index.js
│   │   ├── edit.js
│   │   ├── save.js
│   │   ├── style.scss
│   │   └── __tests__/
│   │       └── edit.test.js
│   └── AnotherBlock/
│
├── components/
│   ├── MyComponent/
│   │   ├── index.js
│   │   ├── style.scss
│   │   └── __tests__/
│   │       └── index.test.js
│   └── ...
│
├── hooks/
│   ├── useBlockAttributes.js
│   ├── usePosts.js
│   └── __tests__/
│       └── hooks.test.js
│
├── utils/
│   ├── formatters.js
│   ├── validators.js
│   └── __tests__/
│       └── utils.test.js
│
├── styles/
│   ├── common.scss
│   ├── utilities.scss
│   └── variables.scss
│
└── index.js (main entry)
```

---

## Naming Conventions

### Files & Folders

- **Blocks:** Use PascalCase for block folders: `MyBlock/`, `HeroSection/`, `CallToAction/`
- **Components:** PascalCase for component files: `Button.js`, `Card.js`, `Modal.js`
- **Utilities/Helpers:** kebab-case: `format-date.js`, `validate-input.js`, `fetch-posts.js`
- **Hooks:** camelCase, prefixed with `use`: `useBlockAttributes.js`, `usePosts.js`, `useAsync.js`
- **Tests:** Same name as the file with `.test.js` suffix: `edit.test.js`, `MyComponent.test.js`

### Exports

- **Default export:** Main component or function per file
- **Named exports:** Utility functions, helpers, types

```javascript
// ✅ Good
export default function MyBlock(props) { ... }

// ✅ Good (utilities)
export const formatDate = (date) => { ... };
export const validateEmail = (email) => { ... };

// ❌ Avoid
export MyBlock; // use default export instead
```

---

## Block Development

### Block Structure (block.json)

```json
{
  "$schema": "https://schemas.wp.org/wp/6.6/block.json",
  "apiVersion": 3,
  "name": "myns/my-block",
  "title": "My Block",
  "category": "common",
  "description": "A custom block for…",
  "icon": "smiley",
  "supports": {
    "html": false,
    "align": ["wide", "full"],
    "anchor": true,
    "className": true
  },
  "attributes": {
    "title": {
      "type": "string",
      "default": "Hello World"
    },
    "backgroundColor": {
      "type": "string",
      "default": ""
    }
  },
  "textdomain": "my-plugin",
  "editorScript": "file:./index.js",
  "style": "file:./style.scss",
  "render": "file:./render.php"
}
```

### Block Main File (index.js)

```javascript
/**
 * WordPress dependencies
 */
import { registerBlockType } from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import metadata from "./block.json";
import Edit from "./edit";
import save from "./save";

/**
 * Register block type
 *
 * @since 1.0.0
 */
registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save,
});
```

### Block Edit Component (edit.js)

```javascript
/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useBlockProps, RichText } from "@wordpress/block-editor";
import { TextControl } from "@wordpress/components";

/**
 * Internal dependencies
 */
import "./editor.scss";

/**
 * Edit component for the block
 *
 * @since 1.0.0
 *
 * @param {object} props
 * @param {object} props.attributes Block attributes
 * @param {Function} props.setAttributes Set attributes
 * @returns {JSX.Element} Block editor element
 */
export default function Edit({ attributes, setAttributes }) {
  const { title, content } = attributes;
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <TextControl
        label={__("Title", "my-plugin")}
        value={title}
        onChange={(value) => setAttributes({ title: value })}
        placeholder={__("Enter title...", "my-plugin")}
      />
      <RichText
        tagName="div"
        className="my-block__content"
        value={content}
        onChange={(value) => setAttributes({ content: value })}
        placeholder={__("Add content...", "my-plugin")}
      />
    </div>
  );
}
```

### Block Save Component (save.js)

```javascript
/**
 * WordPress dependencies
 */
import { useBlockProps, RichText } from "@wordpress/block-editor";

/**
 * Save component for the block
 *
 * @since 1.0.0
 *
 * @param {object} props
 * @param {object} props.attributes Block attributes
 * @returns {JSX.Element} Block markup
 */
export default function save({ attributes }) {
  const { title, content } = attributes;
  const blockProps = useBlockProps.save();

  return (
    <div {...blockProps}>
      <h2 className="my-block__title">{title}</h2>
      <RichText.Content
        tagName="div"
        className="my-block__content"
        value={content}
      />
    </div>
  );
}
```

---

## React Best Practices

### Functional Components & Hooks

Always use functional components with hooks. Class components are discouraged.

```javascript
// ✅ Good – Functional component with hooks
export default function MyComponent({ title, onSubmit }) {
  const [count, setCount] = useState(0);
  const { data, loading } = useFetch("/api/data");

  useEffect(() => {
    // Side effect
  }, []);

  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      {loading && <Spinner />}
    </div>
  );
}

// ❌ Avoid – Class component
class MyComponent extends React.Component {
  state = { count: 0 };
  render() {
    return <div>Count: {this.state.count}</div>;
  }
}
```

### Custom Hooks

Extract reusable logic into custom hooks.

```javascript
/**
 * Hook for fetching posts with pagination
 *
 * @param {object} args Query arguments
 * @returns {object} Posts data and functions
 */
export function usePosts(args = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await apiFetch({
          path: `/wp/v2/posts?per_page=10&page=${page}`,
        });
        setPosts(response);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  return { posts, loading, page, setPage };
}
```

### Props & Destructuring

Always destructure props in function signatures.

```javascript
// ✅ Good
function Card({ title, description, image, onSelect }) {
  return (
    <div onClick={onSelect}>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// ❌ Avoid
function Card(props) {
  return (
    <div onClick={props.onSelect}>
      <img src={props.image} alt={props.title} />
      <h3>{props.title}</h3>
    </div>
  );
}
```

### Conditional Rendering

Use short-circuit evaluation or ternary operators. Avoid `&& null` patterns.

```javascript
// ✅ Good
{
  loading && <Spinner />;
}
{
  error ? <Error message={error} /> : <Content />;
}

// ⚠️ Acceptable but verbose
{
  loading === true ? <Spinner /> : null;
}

// ❌ Avoid – renders "false" in DOM
{
  isVisible && "Content";
}
```

---

## ES Modules (ESM)

All JavaScript should use ES modules for imports/exports.

### Import Order

1. **WordPress dependencies** – `@wordpress/*` packages
2. **External dependencies** – npm packages
3. **Internal dependencies** – project files

```javascript
/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/**
 * External dependencies
 */
import classnames from "classnames";

/**
 * Internal dependencies
 */
import MyComponent from "./components/MyComponent";
import { formatDate } from "./utils/formatters";

// Code follows...
```

### Named vs Default Exports

- **Default export:** Main export per file (typically a component or function)
- **Named exports:** Multiple utilities, types, or helpers

```javascript
/**
 * components/Button.js
 */
export default function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

/**
 * utils/helpers.js
 */
export const debounce = (fn, delay) => { ... };
export const throttle = (fn, delay) => { ... };
export const deepClone = (obj) => { ... };
```

---

## WordPress Dependencies

### Recommended @wordpress/\* Packages

| Package                   | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `@wordpress/i18n`         | Translations and i18n                         |
| `@wordpress/block-editor` | Block editor components and utilities         |
| `@wordpress/components`   | UI components (Button, Modal, etc.)           |
| `@wordpress/data`         | Data store and state management               |
| `@wordpress/api-fetch`    | API requests (uses nonces)                    |
| `@wordpress/hooks`        | Action and filter hooks                       |
| `@wordpress/element`      | React alternatives (deprecated but available) |
| `@wordpress/scripts`      | Build tools and configuration                 |

### Using @wordpress/i18n

Always use i18n for translatable strings.

```javascript
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

// In component
<button>{__('Save', 'my-plugin')}</button>
<p>{__('No posts found', 'my-plugin')}</p>

// With translations (plural)
import { _n } from '@wordpress/i18n';
const message = _n(
  'One post found',
  '%d posts found',
  count,
  'my-plugin'
);
sprintf(message, count);
```

### Using @wordpress/api-fetch

Make API requests to WordPress REST endpoints.

```javascript
/**
 * WordPress dependencies
 */
import apiFetch from "@wordpress/api-fetch";

// In hook or component
const response = await apiFetch({
  path: "/wp/v2/posts",
  method: "GET",
});

const created = await apiFetch({
  path: "/wp/v2/posts",
  method: "POST",
  data: { title: "New Post", content: "Content..." },
});
```

### Using @wordpress/data

Access and manage WordPress data store.

```javascript
/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";

export function PostsList() {
  const posts = useSelect((select) =>
    select(coreStore).getEntityRecords("postType", "post"),
  );

  return posts?.map((post) => <div key={post.id}>{post.title.rendered}</div>);
}
```

---

## Styling

### SCSS Structure

Use SCSS for all styles with BEM naming.

```scss
// blocks/MyBlock/style.scss

.my-block {
  padding: 1rem;

  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  &__content {
    line-height: 1.6;

    &--empty {
      color: #ccc;
      font-style: italic;
    }
  }

  &:hover {
    .my-block__content {
      color: #000;
    }
  }
}
```

### CSS-in-JS (When Necessary)

Use WordPress `@wordpress/components` utilities or inline styles only when SCSS isn't feasible.

```javascript
// ✅ Prefer SCSS
import './styles.scss';

// ⚠️ If needed – inline styles for dynamic values
const cardStyle = {
  backgroundColor: color,
  borderColor: borderColor,
};
<div style={cardStyle}>...</div>

// ❌ Avoid – separate CSS-in-JS libraries
const styles = StyleSheet.create({...});
```

---

## Testing

### Jest Setup

Use Jest for unit tests. Configure via `jest.config.js` or `package.json`.

```javascript
// blocks/MyBlock/__tests__/edit.test.js
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Edit from "../edit";

describe("MyBlock Edit", () => {
  it("renders the edit component", () => {
    const setAttributes = jest.fn();
    render(
      <Edit attributes={{ title: "Test" }} setAttributes={setAttributes} />,
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("updates attributes on input change", async () => {
    const setAttributes = jest.fn();
    const user = userEvent.setup();

    render(<Edit attributes={{ title: "" }} setAttributes={setAttributes} />);

    const input = screen.getByPlaceholderText("Enter title...");
    await user.type(input, "New Title");

    expect(setAttributes).toHaveBeenCalledWith({ title: "New Title" });
  });
});
```

---

## Performance Optimization

### Memoization

Use `memo` for components that receive the same props.

```javascript
/**
 * WordPress dependencies
 */
import { memo } from "@wordpress/element";

/**
 * Card component (memoized to prevent re-renders)
 */
const Card = memo(function Card({ title, description }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
});

export default Card;
```

### useMemo & useCallback

Cache expensive computations and callbacks.

```javascript
/**
 * WordPress dependencies
 */
import { useState, useMemo, useCallback } from "@wordpress/element";

export function ExpensiveList({ items, onItemClick }) {
  const [filter, setFilter] = useState("");

  // Memoize filtered list computation
  const filteredItems = useMemo(
    () => items.filter((item) => item.title.includes(filter)),
    [items, filter],
  );

  // Memoize callback
  const handleClick = useCallback(
    (id) => {
      onItemClick(id);
    },
    [onItemClick],
  );

  return (
    <>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      {filteredItems.map((item) => (
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.title}
        </div>
      ))}
    </>
  );
}
```

---

## Error Handling

### Try/Catch in Effects

Handle errors gracefully in async operations.

```javascript
/**
 * WordPress dependencies
 */
import { useState, useEffect } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

export function PostsLoader() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await apiFetch({ path: "/wp/v2/posts" });
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return posts.map((post) => <Post key={post.id} {...post} />);
}
```

---

## Linting & Formatting

All JavaScript follows ESLint and Prettier configurations. Run:

```bash
npm run lint:js      # Check for lint errors
npm run format:js    # Format and fix issues
npm run test:js      # Run tests with coverage
```

See [linting-javascript.instructions.md](../linting-javascript.instructions.md) for details.

---

## Accessibility

### Semantic HTML

- Use `<button>` for interactive elements, never `<div onClick>`
- Use `<label>` with `htmlFor` for form inputs
- Prefer semantic HTML elements (`<main>`, `<nav>`, `<article>`)

### ARIA & Keyboard Navigation

```javascript
/**
 * Accessible menu component
 */
export function Menu({ items, onSelect }) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setFocusedIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      onSelect(items[focusedIndex]);
    }
  };

  return (
    <ul role="menu" onKeyDown={handleKeyDown}>
      {items.map((item, i) => (
        <li
          key={item.id}
          role="menuitem"
          tabIndex={i === focusedIndex ? 0 : -1}
          aria-current={i === focusedIndex ? "true" : "false"}
          onClick={() => onSelect(item)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}
```

---

## Common Patterns

### Loading States

```javascript
export function DataFetcher({ endpoint }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await apiFetch({ path: endpoint });
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [endpoint]);

  return { data, loading, error };
}
```

### Debounced Search

```javascript
/**
 * External dependencies
 */
import { debounce } from "lodash";

export function SearchPosts() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const debouncedSearch = debounce(async (query) => {
    if (query.length < 2) return;
    const data = await apiFetch({
      path: `/wp/v2/posts?search=${query}`,
    });
    setResults(data);
  }, 300);

  return (
    <>
      <input
        type="search"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          debouncedSearch(e.target.value);
        }}
      />
      <ul>
        {results.map((post) => (
          <li key={post.id}>{post.title.rendered}</li>
        ))}
      </ul>
    </>
  );
}
```

---

## References

- [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [JSDoc Standards](../inline-docs/inline-jsdoc.instructions.md)
- [React Hooks Documentation](https://react.dev/reference/react)
- [@wordpress/scripts](https://github.com/WordPress/gutenberg/tree/trunk/packages/scripts)
