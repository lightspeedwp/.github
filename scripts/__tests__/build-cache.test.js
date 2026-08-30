/**
 * Tests for build cache and fingerprinting
 * Validates caching, incremental builds, and cache management
 */

const fs = require("fs");
const path = require("path");
const {
  getDocFingerprint,
  loadBuildCache,
  saveBuildCache,
  shouldRebuild,
  updateCacheEntry,
  getCacheStats,
  cleanStaleEntries,
} = require("../docs/build-cache");

jest.mock("fs");

describe("Build Cache", () => {
  let mockCache;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCache = {
      version: "1.0",
      lastBuild: "2026-08-30T10:00:00Z",
      buildTime: 1000,
      docs: {
        "docs/guide.md": {
          fingerprint: "hash123",
          buildTime: 500,
          status: "success",
        },
      },
    };
  });

  describe("getDocFingerprint", () => {
    test("should generate consistent fingerprint for file", () => {
      fs.readFileSync.mockReturnValue("# Test Document\nContent here");

      const hash1 = getDocFingerprint("docs/test.md");
      const hash2 = getDocFingerprint("docs/test.md");

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex
    });

    test("should return null on read error", () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error("File not found");
      });

      const hash = getDocFingerprint("docs/missing.md");
      expect(hash).toBeNull();
    });

    test("should generate different hashes for different content", () => {
      fs.readFileSync
        .mockReturnValueOnce("Content A")
        .mockReturnValueOnce("Content B");

      const hash1 = getDocFingerprint("docs/test1.md");
      const hash2 = getDocFingerprint("docs/test2.md");

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("loadBuildCache", () => {
    test("should load existing cache file", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockCache));

      const cache = loadBuildCache();
      expect(cache).toEqual(mockCache);
    });

    test("should return empty cache when file not found", () => {
      fs.existsSync.mockReturnValue(false);

      const cache = loadBuildCache();
      expect(cache).toHaveProperty("version", "1.0");
      expect(cache).toHaveProperty("docs", {});
    });

    test("should handle parse errors gracefully", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation(() => {
        throw new Error("Invalid JSON");
      });

      const cache = loadBuildCache();
      expect(cache).toHaveProperty("version", "1.0");
    });
  });

  describe("saveBuildCache", () => {
    test("should save cache to file", () => {
      saveBuildCache(mockCache);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        ".docs-cache.json",
        JSON.stringify(mockCache, null, 2),
        "utf8",
      );
    });

    test("should handle write errors gracefully", () => {
      fs.writeFileSync.mockImplementation(() => {
        throw new Error("Permission denied");
      });

      expect(() => saveBuildCache(mockCache)).not.toThrow();
    });
  });

  describe("shouldRebuild", () => {
    test("should return true for new documents", () => {
      fs.readFileSync.mockReturnValue("content");
      const result = shouldRebuild("docs/new.md", mockCache);
      expect(result).toBe(true);
    });

    test("should return false for unchanged documents", () => {
      fs.readFileSync.mockReturnValue("content");

      // Set up cache with matching fingerprint
      const fingerprint = require("crypto")
        .createHash("sha256")
        .update("content")
        .digest("hex");

      mockCache.docs["docs/existing.md"] = { fingerprint };

      const result = shouldRebuild("docs/existing.md", mockCache);
      expect(result).toBe(false);
    });

    test("should return true for changed documents", () => {
      fs.readFileSync.mockReturnValue("new content");

      mockCache.docs["docs/changed.md"] = {
        fingerprint: "oldhash123",
      };

      const result = shouldRebuild("docs/changed.md", mockCache);
      expect(result).toBe(true);
    });

    test("should return true on read error", () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error("Read error");
      });

      const result = shouldRebuild("docs/error.md", mockCache);
      expect(result).toBe(true);
    });
  });

  describe("updateCacheEntry", () => {
    test("should update cache entry with build result", () => {
      fs.readFileSync.mockReturnValue("content");

      const buildResult = { buildTime: 250, status: "success" };
      updateCacheEntry(mockCache, "docs/test.md", buildResult);

      const entry = mockCache.docs["docs/test.md"];
      expect(entry).toBeDefined();
      expect(entry.buildTime).toBe(250);
      expect(entry.status).toBe("success");
      expect(entry.lastBuilt).toBeDefined();
    });

    test("should not update on read error", () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error("Read error");
      });

      const originalSize = Object.keys(mockCache.docs).length;
      updateCacheEntry(mockCache, "docs/error.md", { buildTime: 100 });

      expect(Object.keys(mockCache.docs).length).toBe(originalSize);
    });
  });

  describe("getCacheStats", () => {
    test("should calculate correct cache statistics", () => {
      mockCache.docs["docs/doc1.md"] = { buildTime: 100, fingerprint: "hash1" };
      mockCache.docs["docs/doc2.md"] = { buildTime: 200, fingerprint: "hash2" };

      const stats = getCacheStats(mockCache);

      expect(stats.totalDocs).toBe(2);
      expect(stats.totalBuildTime).toMatch(/\d+ms/);
      expect(stats.avgBuildTime).toMatch(/\d+ms/);
    });

    test("should return N/A for empty cache", () => {
      const emptyCache = { version: "1.0", docs: {} };
      const stats = getCacheStats(emptyCache);

      expect(stats.totalDocs).toBe(0);
      expect(stats.avgBuildTime).toBe("N/A");
    });
  });

  describe("cleanStaleEntries", () => {
    test("should remove entries for deleted documents", () => {
      mockCache.docs["docs/deleted.md"] = { fingerprint: "hash" };
      mockCache.docs["docs/existing.md"] = { fingerprint: "hash" };

      const currentDocs = ["docs/existing.md"];
      const removed = cleanStaleEntries(mockCache, currentDocs);

      expect(removed).toBe(1);
      expect(mockCache.docs["docs/deleted.md"]).toBeUndefined();
      expect(mockCache.docs["docs/existing.md"]).toBeDefined();
    });

    test("should return zero when no stale entries", () => {
      const currentDocs = ["docs/guide.md"];
      const removed = cleanStaleEntries(mockCache, currentDocs);

      expect(removed).toBe(0);
    });

    test("should handle empty current docs", () => {
      const removed = cleanStaleEntries(mockCache, []);

      expect(removed).toBe(1);
      expect(Object.keys(mockCache.docs).length).toBe(0);
    });
  });
});
