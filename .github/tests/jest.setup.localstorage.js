// Jest polyfills for global environments that rely on `window`/`localStorage`/`TextDecoder`.
// Shared between repository-level and validation-suite configurations.
/* global window */

(function ensureEnvironmentPolyfills() {
  if (typeof window === "undefined") {
    global.window = {}; // minimal window object if absent
  }

  if (typeof globalThis.localStorage === "undefined") {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(String(key), String(value)),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear(),
      key: (i) => Array.from(store.keys())[i] || null,
      get length() {
        return store.size;
      },
    };
  }

  if (
    typeof global.TextDecoder === "undefined" ||
    typeof global.TextEncoder === "undefined"
  ) {
    try {
      const { TextDecoder, TextEncoder } = require("util");
      if (typeof global.TextDecoder === "undefined" && TextDecoder) {
        global.TextDecoder = TextDecoder;
      }
      if (typeof global.TextEncoder === "undefined" && TextEncoder) {
        global.TextEncoder = TextEncoder;
      }
      if (typeof window.TextDecoder === "undefined" && global.TextDecoder) {
        window.TextDecoder = global.TextDecoder;
      }
      if (typeof window.TextEncoder === "undefined" && global.TextEncoder) {
        window.TextEncoder = global.TextEncoder;
      }
    } catch (e) {
      // util should exist; if it does not, tests will fail explicitly.
    }
  }
})();

try {
  window.localStorage.setItem("__jest_localstorage_sanity__", "ok");
} catch (e) {
  // swallow errors to avoid breaking test bootstrapping.
}

try {
  if (typeof TextDecoder === "function") {
    new TextDecoder("utf-8");
  }
} catch (_) {
  // no-op: this is a non-fatal availability check.
}
