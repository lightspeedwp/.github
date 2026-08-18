/**
 * Jest Setup: localStorage polyfill
 * Provides localStorage mock for jsdom test environment
 *
 * @fileoverview localStorage polyfill for jest/jsdom tests
 * @author LightSpeedWP Team
 * @version 1.0.0
 */

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
