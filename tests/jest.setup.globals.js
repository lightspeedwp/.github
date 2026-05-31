/**
 * Jest global setup for polyfills and global configuration
 */

// Polyfill TextDecoder and TextEncoder for Node.js environments
if (typeof global.TextDecoder === "undefined") {
  const { TextDecoder, TextEncoder } = require("util");
  global.TextDecoder = TextDecoder;
  global.TextEncoder = TextEncoder;
}

// Polyfill localStorage if running in Node environment
if (typeof global.localStorage === "undefined") {
  const storage = {};
  global.localStorage = {
    getItem: (key) => storage[key] || null,
    setItem: (key, value) => {
      storage[key] = value.toString();
    },
    removeItem: (key) => {
      delete storage[key];
    },
    clear: () => {
      Object.keys(storage).forEach((key) => {
        delete storage[key];
      });
    },
  };
}
