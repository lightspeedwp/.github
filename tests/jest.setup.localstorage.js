/**
 * Jest Setup: Node.js built-ins and localStorage polyfill
 * Provides polyfills for Node.js built-ins and localStorage in jsdom test environment
 *
 * @fileoverview Built-ins and localStorage polyfills for jest/jsdom tests
 * @author LightSpeedWP Team
 * @version 1.1.0
 */

// Polyfill TextDecoder and TextEncoder for test environments that don't have them
if (typeof global.TextDecoder === "undefined") {
  const { TextDecoder, TextEncoder } = require("util");
  global.TextDecoder = TextDecoder;
  global.TextEncoder = TextEncoder;
}

// Polyfill localStorage for jsdom environment
if (typeof global.localStorage === "undefined") {
  const store = new Map();
  const localStorageMock = {
    getItem: jest.fn((key) =>
      store.has(String(key)) ? store.get(String(key)) : null,
    ),
    setItem: jest.fn((key, value) => {
      store.set(String(key), String(value));
    }),
    removeItem: jest.fn((key) => {
      store.delete(String(key));
    }),
    clear: jest.fn(() => {
      store.clear();
    }),
    key: jest.fn((index) => Array.from(store.keys())[index] || null),
    get length() {
      return store.size;
    },
  };
  global.localStorage = localStorageMock;
}

// Polyfill TextDecoder and TextEncoder for ESM modules using @actions/core
if (
  typeof global.TextDecoder === "undefined" ||
  typeof global.TextEncoder === "undefined"
) {
  const { TextDecoder, TextEncoder } = require("util");
  if (typeof global.TextDecoder === "undefined") {
    global.TextDecoder = TextDecoder;
  }
  if (typeof global.TextEncoder === "undefined") {
    global.TextEncoder = TextEncoder;
  }
}
