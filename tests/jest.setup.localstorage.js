/**
 * Jest Setup: Node.js built-ins polyfill
 * Provides polyfills for Node.js built-ins in jsdom test environment
 *
 * @fileoverview Built-ins polyfills for jest/jsdom tests
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
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  global.localStorage = localStorageMock;
}

// Polyfill TextDecoder for ESM modules using @actions/core
if (typeof global.TextDecoder === "undefined") {
  const { TextDecoder, TextEncoder } = require("util");
  global.TextDecoder = TextDecoder;
  global.TextEncoder = TextEncoder;
}
