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
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  global.localStorage = localStorageMock;
}
