/**
 * Build Cache Manager — Documentation build fingerprinting and caching
 * Enables incremental builds by tracking file changes via SHA-256 fingerprints
 * @module scripts/docs/build-cache.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const CACHE_FILE = "tmp/.docs-cache.json";

/**
 * Generate SHA-256 fingerprint of file contents
 * @param {string} filePath - Path to file
 * @returns {string|null} SHA-256 hash of file contents, or null on error
 */
function getDocFingerprint(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return crypto.createHash("sha256").update(content).digest("hex");
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Load build cache from disk
 * @returns {Object} Cache object with doc fingerprints and metadata
 */
function loadBuildCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
    }
  } catch (error) {
    console.warn(`Failed to load cache: ${error.message}`);
  }

  return {
    version: "1.0",
    lastBuild: null,
    buildTime: 0,
    docs: {},
  };
}

/**
 * Save build cache to disk
 * @param {Object} cache - Cache object to save
 */
function saveBuildCache(cache) {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  } catch (error) {
    console.error(`Failed to save cache: ${error.message}`);
  }
}

/**
 * Determine if a document needs rebuilding
 * @param {string} docPath - Path to document
 * @param {Object} cache - Current cache
 * @returns {boolean} True if doc needs rebuild
 */
function shouldRebuild(docPath, cache) {
  const currentFingerprint = getDocFingerprint(docPath);

  if (!currentFingerprint) {
    return true; // Rebuild on read errors
  }

  const cachedEntry = cache.docs[docPath];

  if (!cachedEntry) {
    return true; // New document
  }

  return currentFingerprint !== cachedEntry.fingerprint;
}

/**
 * Update cache entry for a document
 * @param {Object} cache - Cache to update
 * @param {string} docPath - Document path
 * @param {Object} buildResult - Build result data
 */
function updateCacheEntry(cache, docPath, buildResult) {
  const fingerprint = getDocFingerprint(docPath);

  if (!fingerprint) {
    return;
  }

  cache.docs[docPath] = {
    fingerprint,
    buildTime: buildResult.buildTime || 0,
    status: buildResult.status || "success",
    lastBuilt: new Date().toISOString(),
  };
}

/**
 * Get cache statistics
 * @param {Object} cache - Cache object
 * @returns {Object} Cache statistics
 */
function getCacheStats(cache) {
  const totalDocs = Object.keys(cache.docs).length;
  const totalBuildTime = Object.values(cache.docs).reduce(
    (sum, doc) => sum + (doc.buildTime || 0),
    0,
  );

  return {
    version: cache.version,
    lastBuild: cache.lastBuild,
    totalDocs,
    totalBuildTime: `${totalBuildTime}ms`,
    avgBuildTime:
      totalDocs > 0 ? `${(totalBuildTime / totalDocs).toFixed(0)}ms` : "N/A",
  };
}

/**
 * Clear stale cache entries (for docs that no longer exist)
 * @param {Object} cache - Cache to clean
 * @param {Array<string>} currentDocs - List of current doc paths
 * @returns {number} Number of entries removed
 */
function cleanStaleEntries(cache, currentDocs) {
  const docsSet = new Set(currentDocs);
  let removed = 0;

  for (const docPath of Object.keys(cache.docs)) {
    if (!docsSet.has(docPath)) {
      delete cache.docs[docPath];
      removed += 1;
    }
  }

  return removed;
}

module.exports = {
  getDocFingerprint,
  loadBuildCache,
  saveBuildCache,
  shouldRebuild,
  updateCacheEntry,
  getCacheStats,
  cleanStaleEntries,
  CACHE_FILE,
};
