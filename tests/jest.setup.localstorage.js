// tests/jest.setup.localstorage.js
// Defensive localStorage shim for Jest environment.
// In jsdom this will already exist; under node or misconfigured env we provide a minimal in‑memory implementation.

// -----------------------------------------------------------------------------
// Environment polyfills for Jest (jsdom or node) tests.
// - localStorage shim (if missing)
// - TextDecoder / TextEncoder (Node < 19 in some environments or stripped globals)
// Extend cautiously; avoid polluting global with large mocks.
// -----------------------------------------------------------------------------

(function ensureEnvironmentPolyfills() {
    if (typeof window === 'undefined') {
        global.window = {}; // minimal window object if absent
    }

    // localStorage shim
    if (typeof window.localStorage === 'undefined') {
        const store = new Map();
        window.localStorage = {
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

    // TextDecoder / TextEncoder polyfill (use Node util implementation if absent)
    if (
        typeof global.TextDecoder === 'undefined' ||
        typeof global.TextEncoder === 'undefined'
    ) {
        try {
            const { TextDecoder, TextEncoder } = require('util');
            if (typeof global.TextDecoder === 'undefined' && TextDecoder) {
                global.TextDecoder = TextDecoder;
            }
            if (typeof global.TextEncoder === 'undefined' && TextEncoder) {
                global.TextEncoder = TextEncoder;
            }
            // Mirror into window for code expecting window.TextDecoder/TextEncoder
            if (
                typeof window.TextDecoder === 'undefined' &&
                global.TextDecoder
            ) {
                window.TextDecoder = global.TextDecoder;
            }
            if (
                typeof window.TextEncoder === 'undefined' &&
                global.TextEncoder
            ) {
                window.TextEncoder = global.TextEncoder;
            }
        } catch (e) {
            // Silent: util should exist; if not, tests that require these will fail explicitly.
        }
    }
})();

// Basic sanity to avoid SecurityError style failures in libraries expecting localStorage.
try {
    window.localStorage.setItem('__jest_localstorage_sanity__', 'ok');
} catch (e) {
    // If this fails we at least avoid throwing during test bootstrap.
}

// Minimal self-check for TextDecoder availability (non-fatal)
try {
    if (typeof TextDecoder === 'function') {
        new TextDecoder('utf-8');
    }
} catch (_) {
    // Ignore; construction test only.
}
