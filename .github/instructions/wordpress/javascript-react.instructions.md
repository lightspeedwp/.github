---
applyTo: "**/*.{js,jsx,ts,tsx}"
description: "JavaScript and React development standards for WordPress Gutenberg blocks and modern WordPress development"
license: "GPL-3.0-or-later"
---

# JavaScript & React Guidelines for WordPress

## Modern JavaScript Standards

### ES6+ Features & Best Practices

```javascript
// Use const/let instead of var
const API_URL = "https://api.example.com";
let userData = null;

// Arrow functions for callbacks
const processUsers = (users) => {
  return users
    .filter((user) => user.active)
    .map((user) => ({ ...user, formatted: true }));
};

// Destructuring for cleaner code
const { name, email, ...restProps } = userObject;
const [first, second, ...remaining] = arrayData;

// Template literals for string interpolation
const message = `Hello ${name}, you have ${count} new messages`;

// Default parameters
function createUser(name, role = "subscriber", active = true) {
  return { name, role, active };
}

// Async/await for promises
async function fetchUserData(userId) {
  try {
    const response = await apiFetch({ path: `/users/${userId}` });
    return response;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}
```

### WordPress JavaScript APIs

```javascript
import { __ } from "@wordpress/i18n";
import { apiFetch } from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import { dispatch, select } from "@wordpress/data";

// Internationalization
const welcomeMessage = __("Welcome to our site", "textdomain");
const itemCount = sprintf(
  /* translators: %d: number of items */
  _n("%d item", "%d items", count, "textdomain"),
  count,
);

// API requests
const fetchPosts = async () => {
  const posts = await apiFetch({
    path: addQueryArgs("/wp/v2/posts", {
      per_page: 10,
      status: "publish",
    }),
  });
  return posts;
};

// Data store interactions
const { createNotice } = dispatch("core/notices");
const { getEditedPostContent } = select("core/editor");

createNotice("success", __("Post saved successfully", "textdomain"));
```

## React Components for Gutenberg

### Functional Components with Hooks

```jsx
import { useState, useEffect, useCallback } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, TextControl, ToggleControl } from "@wordpress/components";

// Custom hook for API data
function usePostData(postId) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await apiFetch({
          path: `/wp/v2/posts/${postId}`,
        });
        setPost(response);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { post, loading, error };
}

// Block edit component
function Edit({ attributes, setAttributes }) {
  const { title, showDate, postId } = attributes;
  const blockProps = useBlockProps();
  const { post, loading, error } = usePostData(postId);

  const updateTitle = useCallback(
    (newTitle) => {
      setAttributes({ title: newTitle });
    },
    [setAttributes],
  );

  const toggleShowDate = useCallback(
    (newShowDate) => {
      setAttributes({ showDate: newShowDate });
    },
    [setAttributes],
  );

  if (loading) {
    return (
      <div {...blockProps}>
        <div className="loading-spinner">{__("Loading...", "textdomain")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div {...blockProps}>
        <div className="error-message">
          {__("Error loading content:", "textdomain")} {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Settings", "textdomain")}>
          <TextControl
            label={__("Title", "textdomain")}
            value={title}
            onChange={updateTitle}
            help={__("Override the default title", "textdomain")}
          />
          <ToggleControl
            label={__("Show Date", "textdomain")}
            checked={showDate}
            onChange={toggleShowDate}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <h3>{title || post?.title?.rendered}</h3>
        {showDate && post?.date && (
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString()}
          </time>
        )}
        <div
          dangerouslySetInnerHTML={{
            __html: post?.excerpt?.rendered,
          }}
        />
      </div>
    </>
  );
}

export default Edit;
```

### Block Registration & Configuration

```javascript
import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import Edit from "./edit";
import Save from "./save";
import metadata from "./block.json";

// Register block type
registerBlockType(metadata.name, {
  ...metadata,
  title: __("Custom Post Block", "textdomain"),
  description: __(
    "Display a custom post with configurable options",
    "textdomain",
  ),
  keywords: [
    __("post", "textdomain"),
    __("content", "textdomain"),
    __("custom", "textdomain"),
  ],
  edit: Edit,
  save: Save,
  transforms: {
    from: [
      {
        type: "block",
        blocks: ["core/paragraph"],
        transform: (attributes) => {
          return createBlock("my-plugin/custom-post", {
            title: attributes.content,
          });
        },
      },
    ],
  },
  variations: [
    {
      name: "featured-post",
      title: __("Featured Post", "textdomain"),
      description: __("A featured post with enhanced styling", "textdomain"),
      attributes: {
        showDate: true,
        className: "is-style-featured",
      },
      scope: ["inserter", "transform"],
    },
  ],
});
```

### Custom Components & UI

```jsx
import { BaseControl, Button, Flex, FlexItem } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

// Reusable component with TypeScript-like props validation
function MediaSelector({ value, onSelect, allowedTypes = ["image"], label }) {
  const [isOpen, setIsOpen] = useState(false);

  const openMediaLibrary = () => {
    const mediaUploader = wp.media({
      title: label || __("Select Media", "textdomain"),
      button: {
        text: __("Use this media", "textdomain"),
      },
      multiple: false,
      library: {
        type: allowedTypes,
      },
    });

    mediaUploader.on("select", () => {
      const attachment = mediaUploader
        .state()
        .get("selection")
        .first()
        .toJSON();
      onSelect(attachment);
    });

    mediaUploader.open();
  };

  const removeMedia = () => {
    onSelect(null);
  };

  return (
    <BaseControl label={label}>
      {value ? (
        <Flex>
          <FlexItem>
            <img
              src={value.sizes?.thumbnail?.url || value.url}
              alt={value.alt || ""}
              style={{ maxWidth: "100px", height: "auto" }}
            />
          </FlexItem>
          <FlexItem>
            <Button isSecondary isSmall onClick={removeMedia}>
              {__("Remove", "textdomain")}
            </Button>
          </FlexItem>
        </Flex>
      ) : (
        <Button isPrimary onClick={openMediaLibrary}>
          {__("Select Media", "textdomain")}
        </Button>
      )}
    </BaseControl>
  );
}
```

### Data Management & State

```javascript
import { createReduxStore, register } from "@wordpress/data";

// Custom data store
const store = createReduxStore("my-plugin/data", {
  reducer(state = { posts: [], loading: false }, action) {
    switch (action.type) {
      case "SET_POSTS":
        return {
          ...state,
          posts: action.posts,
        };
      case "SET_LOADING":
        return {
          ...state,
          loading: action.loading,
        };
      default:
        return state;
    }
  },

  actions: {
    setPosts(posts) {
      return {
        type: "SET_POSTS",
        posts,
      };
    },
    setLoading(loading) {
      return {
        type: "SET_LOADING",
        loading,
      };
    },
    *fetchPosts() {
      yield { type: "SET_LOADING", loading: true };
      try {
        const posts = yield apiFetch({ path: "/wp/v2/posts" });
        yield { type: "SET_POSTS", posts };
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        yield { type: "SET_LOADING", loading: false };
      }
    },
  },

  selectors: {
    getPosts(state) {
      return state.posts;
    },
    getLoading(state) {
      return state.loading;
    },
    getPostById(state, postId) {
      return state.posts.find((post) => post.id === postId);
    },
  },
});

register(store);
```

### Frontend JavaScript (View Scripts)

```javascript
// Frontend interactivity for blocks
document.addEventListener("DOMContentLoaded", function () {
  const interactiveBlocks = document.querySelectorAll(
    ".wp-block-my-plugin-interactive",
  );

  interactiveBlocks.forEach((block) => {
    initializeInteractiveBlock(block);
  });
});

function initializeInteractiveBlock(block) {
  const toggleButton = block.querySelector(".toggle-button");
  const content = block.querySelector(".toggle-content");

  if (!toggleButton || !content) return;

  // Accessibility setup
  const contentId = `content-${Math.random().toString(36).substr(2, 9)}`;
  content.id = contentId;
  toggleButton.setAttribute("aria-controls", contentId);
  toggleButton.setAttribute("aria-expanded", "false");

  toggleButton.addEventListener("click", function (e) {
    e.preventDefault();

    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    const newState = !isExpanded;

    toggleButton.setAttribute("aria-expanded", newState.toString());
    content.hidden = !newState;

    // Animate if CSS transitions are supported
    if (newState) {
      content.style.maxHeight = content.scrollHeight + "px";
    } else {
      content.style.maxHeight = "0";
    }
  });

  // Initialize closed state
  content.hidden = true;
  content.style.maxHeight = "0";
  content.style.transition = "max-height 0.3s ease-out";
}

// Handle AJAX form submissions
function handleFormSubmission(form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Update UI to show loading state
    submitButton.disabled = true;
    submitButton.textContent = wpData.strings.submitting || "Submitting...";

    try {
      const response = await fetch(wpData.ajaxurl, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        showNotice("success", result.data.message);
        form.reset();
      } else {
        showNotice("error", result.data.message);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showNotice("error", wpData.strings.error || "An error occurred");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

function showNotice(type, message) {
  const notice = document.createElement("div");
  notice.className = `notice notice-${type}`;
  notice.innerHTML = `<p>${message}</p>`;

  const container =
    document.querySelector(".notice-container") || document.body;
  container.appendChild(notice);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notice.parentNode) {
      notice.parentNode.removeChild(notice);
    }
  }, 5000);
}
```

## Performance & Best Practices

### Code Splitting & Lazy Loading

```javascript
// Dynamic imports for code splitting
const LazyComponent = lazy(() => import("./LazyComponent"));

function MyBlock() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

// Conditionally load heavy libraries
async function loadChartLibrary() {
  const { Chart } = await import("chart.js");
  return Chart;
}
```

### Error Boundaries & Error Handling

```jsx
import { Component } from "@wordpress/element";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Block error:", error, errorInfo);

    // Report error to logging service if available
    if (window.errorReporting) {
      window.errorReporting.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="block-error-boundary">
          <h3>{__("Something went wrong", "textdomain")}</h3>
          <p>
            {__(
              "This block encountered an error and could not be displayed.",
              "textdomain",
            )}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Accessibility in JavaScript

```javascript
// Focus management for modals and dropdowns
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    if (e.key === "Escape") {
      closeModal();
    }
  });
}

// Announce dynamic content changes to screen readers
function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "screen-reader-text";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
```

Always prioritize performance, accessibility, and maintainability. Use modern JavaScript features appropriately while ensuring compatibility with the target WordPress and browser versions. Follow React and WordPress coding standards for consistent, reliable code.
