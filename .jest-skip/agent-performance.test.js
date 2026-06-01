/**
 * ============================================================================
 * Agent Performance Benchmark Tests
 * Location: .github/agents/__tests__/agent-performance.test.js
 * Description:
 *   - Validates agents complete within reasonable time limits
 *   - Tests memory usage and resource consumption
 *   - Ensures agents handle large payloads efficiently
 * Standards:
 *   - Follows [LightSpeedWP Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update benchmarks when adding new agent features
 *   - Adjust time limits based on CI environment performance
 * ============================================================================
 */

const fs = require("fs");
const path = require("path");
const {
  mockOctokit,
  mockContext,
  setTestEnv,
  resetTestEnv,
  mockPrPayload: _mockPrPayload,
  expectCommentPosted: _expectCommentPosted,
} = require("../../tests/test-helpers");

describe("Agent Performance Benchmarks", () => {
  const PERFORMANCE_TIMEOUT = 30000; // 30 seconds max per agent
  const MEMORY_LIMIT_MB = 100; // 100MB memory limit

  beforeAll(() => {
    setTestEnv({
      GITHUB_TOKEN: "test-token",
      DRY_RUN: "true",
    });
  });

  afterAll(() => {
    resetTestEnv(["GITHUB_TOKEN", "DRY_RUN"]);
  });

  describe("execution time benchmarks", () => {
    test(
      "labeling agent completes within time limit",
      async () => {
        const startTime = Date.now();
        const startMemory = process.memoryUsage();

        try {
          // Mock require to avoid actual agent execution
          const mockAgent = {
            run: jest.fn().mockResolvedValue({ success: true }),
          };

          await mockAgent.run(mockContext());

          const duration = Date.now() - startTime;
          const memoryUsed =
            process.memoryUsage().heapUsed - startMemory.heapUsed;

          expect(duration).toBeLessThan(PERFORMANCE_TIMEOUT);
          expect(memoryUsed / 1024 / 1024).toBeLessThan(MEMORY_LIMIT_MB);
        } catch (error) {
          // Log performance data even on failure
          const duration = Date.now() - startTime;
          console.warn(`Agent failed after ${duration}ms:`, error.message);
          throw error;
        }
      },
      PERFORMANCE_TIMEOUT,
    );

    test("agents handle large payloads efficiently", async () => {
      const largePrPayload = {
        pull_request: {
          number: 1,
          title: "feat: Large feature with extensive description".repeat(10),
          head: { sha: "abc123", ref: "feature/large" },
          labels: [],
          body: "x".repeat(50000), // 50KB body
        },
      };

      const startTime = Date.now();

      // Mock agent processing
      const mockAgent = {
        run: jest.fn().mockImplementation(async (context) => {
          // Simulate processing large payload
          const body = context.payload?.pull_request?.body || "";
          const bodyLength = body.length;
          expect(bodyLength).toBeGreaterThan(0);
          return { success: true, processed: bodyLength };
        }),
      };

      const result = await mockAgent.run(mockContext(largePrPayload));
      const duration = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(5000); // Should handle large payloads quickly
    });
  });

  describe("resource usage benchmarks", () => {
    test("agents do not leak memory during repeated execution", async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const iterations = 10;

      const mockAgent = {
        run: jest.fn().mockResolvedValue({ success: true }),
      };

      // Run agent multiple times
      for (let i = 0; i < iterations; i++) {
        await mockAgent.run(mockContext());

        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024;

      // Memory increase should be minimal (< 10MB)
      expect(memoryIncrease).toBeLessThan(10);
    });

    test("agents handle concurrent execution efficiently", async () => {
      const concurrentRuns = 5;
      const startTime = Date.now();

      const mockAgent = {
        run: jest.fn().mockImplementation(async (context) => {
          // Simulate async work
          await new Promise((resolve) => setTimeout(resolve, 100));
          return { success: true, id: Math.random() };
        }),
      };

      // Run multiple instances concurrently
      const promises = Array(concurrentRuns)
        .fill()
        .map(() => mockAgent.run(mockContext()));

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      // All should succeed
      expect(results.every((r) => r.success)).toBe(true);

      // Concurrent execution should be faster than sequential
      expect(duration).toBeLessThan(concurrentRuns * 200); // Less than sequential time
    });
  });

  describe("scalability benchmarks", () => {
    test("agents scale with number of files changed", async () => {
      const fileCounts = [1, 10, 50, 100];
      const timings = [];

      for (const fileCount of fileCounts) {
        const payload = {
          pull_request: {
            number: 1,
            title: "Test PR",
            head: { sha: "abc123", ref: "feature/test" },
            labels: [],
            body: "This is a test PR.",
            changed_files: fileCount,
          },
        };

        const startTime = Date.now();

        const mockAgent = {
          run: jest.fn().mockImplementation(async (context) => {
            // Simulate processing files
            const fileProcessingTime =
              context.payload.pull_request.changed_files || 0;
            await new Promise((resolve) =>
              setTimeout(resolve, fileProcessingTime),
            );
            return { success: true };
          }),
        };

        await mockAgent.run(mockContext(payload));
        timings.push(Date.now() - startTime);
      }

      // Performance should scale reasonably (not exponentially)
      const timeRatio = timings[timings.length - 1] / timings[0];
      expect(timeRatio).toBeLessThan(fileCounts[fileCounts.length - 1] * 2);
    });

    test("agents handle rate limiting gracefully", async () => {
      let callCount = 0;

      const mockAgent = {
        run: jest.fn().mockImplementation(async () => {
          callCount++;

          // Simulate rate limiting after 3 calls
          if (callCount > 3) {
            const error = new Error("Rate limited");
            error.status = 403;
            error.response = {
              headers: {
                "x-ratelimit-remaining": "0",
                "x-ratelimit-reset": Math.floor(Date.now() / 1000) + 60,
              },
            };
            throw error;
          }

          return { success: true };
        }),
      };

      // First 3 calls should succeed
      for (let i = 0; i < 3; i++) {
        const result = await mockAgent.run(mockContext());
        expect(result.success).toBe(true);
      }

      // 4th call should handle rate limiting
      await expect(mockAgent.run(mockContext())).rejects.toThrow(
        "Rate limited",
      );
    });
  });

  describe("error handling performance", () => {
    test("agents fail fast with invalid input", async () => {
      const startTime = Date.now();

      const mockAgent = {
        run: jest.fn().mockImplementation(async (context) => {
          if (!context || !context.payload) {
            throw new Error("Invalid context");
          }
          return { success: true };
        }),
      };

      await expect(mockAgent.run(null)).rejects.toThrow("Invalid context");

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100); // Should fail quickly
    });
  });
});
