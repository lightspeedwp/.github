/**
 * Jest Setup: localStorage polyfill
 * Provides localStorage mock for jsdom test environment
 *
 * @fileoverview localStorage polyfill for jest/jsdom tests
 * @author LightSpeedWP Team
 * @version 1.0.0
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
