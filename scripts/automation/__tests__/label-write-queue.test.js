/**
 * Tests for the label consolidation write queue (spec 008, T062a; FR-023 point 6).
 */

import {
  createWriteQueue,
  githubWrite,
  rateLimitDelayMs,
  RateLimitError,
  RunPausedError,
} from '../includes/label-write-queue.js';

/**
 * Builds a fake clock whose sleep advances time instantly.
 * @returns {{ now: () => number, sleep: (ms: number) => Promise<void>, sleeps: number[] }}
 */
function fakeClock() {
  let time = 0;
  const sleeps = [];
  return {
    now: () => time,
    sleep: async (ms) => {
      sleeps.push(ms);
      time += ms;
    },
    sleeps,
  };
}

/**
 * Builds a headers object like fetch's Headers.
 * @param {Record<string, string>} values - Header values by lower-case name
 * @returns {{ get: (name: string) => string | null }}
 */
function headers(values) {
  return { get: (name) => (name in values ? values[name] : null) };
}

describe('label-write-queue', () => {
  describe('createWriteQueue', () => {
    test('runs writes one at a time, in order', async () => {
      const clock = fakeClock();
      const queue = createWriteQueue({ now: clock.now, sleep: clock.sleep });
      const events = [];
      const write = (name) => async () => {
        events.push(`start ${name}`);
        await clock.sleep(10);
        events.push(`end ${name}`);
        return name;
      };

      const results = await Promise.all([
        queue.run(write('a')),
        queue.run(write('b')),
        queue.run(write('c')),
      ]);

      expect(results).toEqual(['a', 'b', 'c']);
      expect(events).toEqual(['start a', 'end a', 'start b', 'end b', 'start c', 'end c']);
    });

    test('starts writes at least one second apart', async () => {
      const clock = fakeClock();
      const queue = createWriteQueue({ now: clock.now, sleep: clock.sleep });
      const starts = [];
      const write = () => async () => {
        starts.push(clock.now());
      };

      await Promise.all([queue.run(write()), queue.run(write()), queue.run(write())]);

      expect(starts).toEqual([0, 1000, 2000]);
    });

    test('pauses for the rate-limit delay, then retries the same write', async () => {
      const clock = fakeClock();
      const queue = createWriteQueue({ now: clock.now, sleep: clock.sleep });
      let calls = 0;

      const result = await queue.run(async () => {
        calls++;
        if (calls === 1) {
          throw new RateLimitError('secondary rate limit', 30000);
        }
        return 'done';
      });

      expect(result).toBe('done');
      expect(calls).toBe(2);
      expect(clock.sleeps).toContain(30000);
      expect(queue.stats()).toEqual({ writes: 1, pauses: 1 });
    });

    test('stops the run with RunPausedError when a write stays rate-limited', async () => {
      const clock = fakeClock();
      const queue = createWriteQueue({ now: clock.now, sleep: clock.sleep, maxPauses: 2 });
      let calls = 0;

      await expect(
        queue.run(async () => {
          calls++;
          throw new RateLimitError('rate limit', 5000);
        })
      ).rejects.toBeInstanceOf(RunPausedError);
      expect(calls).toBe(3);
    });

    test('once paused, later queued writes never start', async () => {
      const clock = fakeClock();
      const queue = createWriteQueue({ now: clock.now, sleep: clock.sleep, maxPauses: 0 });
      const later = jest.fn().mockResolvedValue('later');

      const first = queue.run(async () => {
        throw new RateLimitError('rate limit', 5000);
      });
      const second = queue.run(later);

      await expect(first).rejects.toBeInstanceOf(RunPausedError);
      await expect(second).rejects.toBeInstanceOf(RunPausedError);
      expect(later).not.toHaveBeenCalled();
    });

    test('does not retry other errors, and keeps running later writes', async () => {
      const clock = fakeClock();
      const queue = createWriteQueue({ now: clock.now, sleep: clock.sleep });
      let calls = 0;

      const failed = queue.run(async () => {
        calls++;
        throw new Error('422 Validation Failed');
      });
      const next = queue.run(async () => 'next');

      await expect(failed).rejects.toThrow('422 Validation Failed');
      await expect(next).resolves.toBe('next');
      expect(calls).toBe(1);
    });
  });

  describe('rateLimitDelayMs', () => {
    test('uses Retry-After seconds first', () => {
      expect(
        rateLimitDelayMs(headers({ 'retry-after': '12', 'x-ratelimit-reset': '999' }), 0)
      ).toBe(12000);
    });

    test('falls back to x-ratelimit-reset as a Unix time', () => {
      expect(rateLimitDelayMs(headers({ 'x-ratelimit-reset': '100' }), 40000)).toBe(60000);
    });

    test('never returns a negative delay', () => {
      expect(rateLimitDelayMs(headers({ 'x-ratelimit-reset': '10' }), 50000)).toBe(0);
    });

    test('reads an HTTP-date Retry-After as the time until that date', () => {
      const now = Date.parse('Sat, 03 Oct 2026 12:00:00 GMT');
      expect(
        rateLimitDelayMs(headers({ 'retry-after': 'Sat, 03 Oct 2026 12:05:00 GMT' }), now)
      ).toBe(300000);
    });

    test('an HTTP-date Retry-After in the past waits no time and beats the reset header', () => {
      const now = Date.parse('Sat, 03 Oct 2026 12:00:00 GMT');
      expect(
        rateLimitDelayMs(
          headers({ 'retry-after': 'Sat, 03 Oct 2026 11:59:00 GMT', 'x-ratelimit-reset': '9999999999' }),
          now
        )
      ).toBe(0);
    });

    test('falls through to the reset header when Retry-After is neither seconds nor a date', () => {
      expect(
        rateLimitDelayMs(headers({ 'retry-after': 'soon', 'x-ratelimit-reset': '100' }), 40000)
      ).toBe(60000);
    });

    test('returns null without rate-limit headers', () => {
      expect(rateLimitDelayMs(headers({}), 0)).toBeNull();
    });
  });

  describe('githubWrite', () => {
    test.each(['GET', 'get', 'HEAD', 'OPTIONS', 'TRACE', 'FETCH', ''])(
      'refuses %p, which is not a write verb',
      (method) => {
        const queue = createWriteQueue();
        expect(() => githubWrite(queue, method, '/repos/o/r/labels')).toThrow(
          'mutating requests only'
        );
      }
    );

    test('normalises a lower-case write verb', async () => {
      const queue = createWriteQueue({ sleep: async () => {} });
      const request = jest.fn().mockResolvedValue(null);

      await githubWrite(queue, 'delete', '/repos/o/r/labels/old', null, { token: 'test' }, request);

      expect(request).toHaveBeenCalledWith('DELETE', '/repos/o/r/labels/old', null, {
        token: 'test',
        useCache: false,
      });
    });

    test('sends the write uncached through the queue', async () => {
      const clock = fakeClock();
      const queue = createWriteQueue({ now: clock.now, sleep: clock.sleep });
      const request = jest.fn().mockResolvedValue({ name: 'aiops:agents' });

      const result = await githubWrite(
        queue,
        'PATCH',
        '/repos/o/r/labels/ai-ops:agents',
        { new_name: 'aiops:agents' },
        { token: 'test' },
        request
      );

      expect(result).toEqual({ name: 'aiops:agents' });
      expect(request).toHaveBeenCalledWith(
        'PATCH',
        '/repos/o/r/labels/ai-ops:agents',
        { new_name: 'aiops:agents' },
        { token: 'test', useCache: false }
      );
    });

    test('turns a GitHub rate-limit error into a pause and retry', async () => {
      const clock = fakeClock();
      const queue = createWriteQueue({ now: clock.now, sleep: clock.sleep });
      const request = jest
        .fn()
        .mockRejectedValueOnce(new Error('GitHub API error: 403 API rate limit exceeded'))
        .mockResolvedValueOnce(null);

      await expect(
        githubWrite(queue, 'DELETE', '/repos/o/r/labels/old', null, { token: 'test' }, request)
      ).resolves.toBeNull();
      expect(request).toHaveBeenCalledTimes(2);
      expect(queue.stats().pauses).toBe(1);
    });

    test('pauses for the delay in the final rate-limit response headers', async () => {
      const clock = fakeClock();
      const queue = createWriteQueue({ now: clock.now, sleep: clock.sleep });
      const limited = new Error('GitHub API error: 429 You have exceeded a secondary rate limit');
      limited.headers = headers({ 'retry-after': '120' });
      const request = jest.fn().mockRejectedValueOnce(limited).mockResolvedValueOnce(null);

      await githubWrite(queue, 'DELETE', '/repos/o/r/labels/old', null, { token: 'test' }, request);

      expect(clock.sleeps).toContain(120000);
    });

    test.each([
      ['a 429 with an unrelated message', 429, 'Too Many Requests', {}],
      ['a 403 with no quota left', 403, 'Forbidden', { 'x-ratelimit-remaining': '0' }],
      ['a 403 with Retry-After', 403, 'Forbidden', { 'retry-after': '5' }],
    ])('pauses on %s', async (_name, status, message, headerValues) => {
      const clock = fakeClock();
      const queue = createWriteQueue({ now: clock.now, sleep: clock.sleep });
      const limited = new Error(`GitHub API error: ${status} ${message}`);
      limited.status = status;
      limited.headers = headers(headerValues);
      const request = jest.fn().mockRejectedValueOnce(limited).mockResolvedValueOnce(null);

      await expect(
        githubWrite(queue, 'DELETE', '/repos/o/r/labels/old', null, { token: 'test' }, request)
      ).resolves.toBeNull();
      expect(queue.stats().pauses).toBe(1);
    });

    test('does not pause on a 403 permission error with quota left', async () => {
      const queue = createWriteQueue({ sleep: async () => {} });
      const denied = new Error('GitHub API error: 403 Resource not accessible by integration');
      denied.status = 403;
      denied.headers = headers({ 'x-ratelimit-remaining': '4999' });
      const request = jest.fn().mockRejectedValue(denied);

      await expect(
        githubWrite(queue, 'DELETE', '/repos/o/r/labels/old', null, { token: 'test' }, request)
      ).rejects.toThrow('403');
      expect(request).toHaveBeenCalledTimes(1);
    });

    test('passes other GitHub errors straight through', async () => {
      const queue = createWriteQueue({ sleep: async () => {} });
      const request = jest.fn().mockRejectedValue(new Error('GitHub API error: 404 Not Found'));

      await expect(
        githubWrite(queue, 'DELETE', '/repos/o/r/labels/missing', null, { token: 'test' }, request)
      ).rejects.toThrow('404 Not Found');
      expect(request).toHaveBeenCalledTimes(1);
    });
  });
});
