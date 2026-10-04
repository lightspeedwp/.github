/**
 * Tests that githubApiRequest keeps the status and headers on a final failure,
 * which the label write queue relies on to classify rate limits (spec 008, T062a).
 */

import { githubApiRequest } from '../includes/github-api-optimized.js';

describe('githubApiRequest final errors', () => {
  const realFetch = global.fetch;

  afterEach(() => {
    global.fetch = realFetch;
  });

  /**
   * Replaces fetch with one response.
   * @param {number} status - HTTP status
   * @param {Record<string, string>} headerValues - Response headers
   * @param {object} body - JSON error body
   */
  function respondWith(status, headerValues, body) {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status,
      statusText: 'error',
      headers: { get: (name) => (name in headerValues ? headerValues[name] : null) },
      text: async () => JSON.stringify(body),
    });
  }

  test('keeps the status and headers on a 403 with quota left', async () => {
    respondWith(
      403,
      { 'x-ratelimit-remaining': '4999', 'retry-after': '7' },
      { message: 'Resource not accessible by integration' }
    );

    const error = await githubApiRequest('DELETE', '/repos/o/r/labels/x', null, {
      token: 'test',
      useCache: false,
    }).catch((caught) => caught);

    expect(error.message).toBe('GitHub API error: 403 Resource not accessible by integration');
    expect(error.status).toBe(403);
    expect(error.headers.get('retry-after')).toBe('7');
    expect(error.headers.get('x-ratelimit-remaining')).toBe('4999');
  });

  test('keeps the status on a 404', async () => {
    respondWith(404, {}, { message: 'Not Found' });

    const error = await githubApiRequest('DELETE', '/repos/o/r/labels/x', null, {
      token: 'test',
      useCache: false,
    }).catch((caught) => caught);

    expect(error.status).toBe(404);
    expect(error.headers).toBeDefined();
  });
});
