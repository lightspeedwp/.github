/**
 * Parallel Documentation Build Pipeline
 * Processes markdown files in parallel batches with caching and incremental builds
 * @module scripts/docs/build-parallel.js
 */

const glob = require("glob");
const {
  loadBuildCache,
  saveBuildCache,
  shouldRebuild,
  updateCacheEntry,
  getCacheStats,
  cleanStaleEntries,
} = require("./build-cache");

/**
 * Build a single documentation file
 * @param {string} docPath - Path to document to build
 * @returns {Promise<Object>} Build result with path, status, buildTime
 */
async function buildDoc(docPath) {
  const startTime = Date.now();

  try {
    // TODO: Implement actual build logic
    // In real implementation, this would:
    // 1. Parse markdown
    // 2. Generate HTML
    // 3. Process metadata
    // 4. Return success result
    // For now, throw to prevent accidental false success in production
    throw new Error(
      "buildDoc() not yet implemented - wire actual markdown build logic here",
    );
  } catch (error) {
    const buildTime = Date.now() - startTime;

    return {
      path: docPath,
      status: "error",
      buildTime,
      error: error.message,
    };
  }
}

/**
 * Build documentation files in parallel batches
 * @param {Array<string>} docFiles - Files to build
 * @param {number} concurrency - Number of parallel builds (default: 4)
 * @returns {Promise<Array>} Array of build results
 */
async function buildDocsParallel(docFiles, concurrency = 4) {
  if (docFiles.length === 0) {
    return [];
  }

  const results = [];

  for (let i = 0; i < docFiles.length; i += concurrency) {
    const batch = docFiles.slice(i, i + concurrency);
    const startBatch = Date.now();

    const batchResults = await Promise.all(batch.map((doc) => buildDoc(doc)));

    results.push(...batchResults);

    const batchTime = Date.now() - startBatch;
    console.log(
      `[Batch ${Math.floor(i / concurrency) + 1}] Built ${batch.length} docs in ${batchTime}ms`,
    );
  }

  return results;
}

/**
 * Perform incremental build with caching
 * Rebuilds only changed or new documents
 * @returns {Promise<Object>} Build summary
 */
async function incrementalBuild() {
  console.log("Starting incremental build...");

  const startTime = Date.now();
  const cache = loadBuildCache();

  // Find all markdown files
  const docFiles = glob.sync("docs/**/*.md", {
    ignore: ["docs/node_modules/**", "docs/.git/**"],
  });

  // Clean stale cache entries
  const staleRemoved = cleanStaleEntries(cache, docFiles);

  if (staleRemoved > 0) {
    console.log(`[Cache] Removed ${staleRemoved} stale entries`);
  }

  // Identify files that need rebuilding
  const toRebuild = docFiles.filter((doc) => shouldRebuild(doc, cache));

  console.log(
    `[Incremental] ${toRebuild.length}/${docFiles.length} docs need rebuild`,
  );

  if (toRebuild.length === 0) {
    console.log("[Cache] No changes detected; build complete");
    const stats = getCacheStats(cache);
    console.log("[Cache Statistics]", stats);
    return {
      status: "success",
      cached: docFiles.length,
      rebuilt: 0,
      buildTime: Date.now() - startTime,
      stats,
    };
  }

  // Build only changed/new docs in parallel
  const results = await buildDocsParallel(toRebuild, 4);

  // Update cache with results
  for (const result of results) {
    if (result.status === "success") {
      updateCacheEntry(cache, result.path, result);
    }
  }

  cache.lastBuild = new Date().toISOString();
  saveBuildCache(cache);

  // Summarize results
  const successful = results.filter((r) => r.status === "success").length;
  const failed = results.filter((r) => r.status === "error").length;
  const totalBuildTime = Date.now() - startTime;

  console.log(
    `[Build Complete] ${successful} successful, ${failed} failed in ${totalBuildTime}ms`,
  );

  const stats = getCacheStats(cache);
  console.log("[Cache Statistics]", stats);

  return {
    status: failed === 0 ? "success" : "partial",
    cached: docFiles.length - toRebuild.length,
    rebuilt: successful,
    failed,
    buildTime: totalBuildTime,
    stats,
  };
}

/**
 * Full rebuild (ignores cache)
 * @returns {Promise<Object>} Build summary
 */
async function fullBuild() {
  console.log("Starting full build (cache ignored)...");

  const startTime = Date.now();

  // Find all markdown files
  const docFiles = glob.sync("docs/**/*.md", {
    ignore: ["docs/node_modules/**", "docs/.git/**"],
  });

  console.log(`[Full Build] Building ${docFiles.length} docs...`);

  // Build all docs in parallel
  const results = await buildDocsParallel(docFiles, 4);

  // Create fresh cache
  const cache = {
    version: "1.0",
    lastBuild: new Date().toISOString(),
    docs: {},
  };

  for (const result of results) {
    if (result.status === "success") {
      updateCacheEntry(cache, result.path, result);
    }
  }

  saveBuildCache(cache);

  const successful = results.filter((r) => r.status === "success").length;
  const failed = results.filter((r) => r.status === "error").length;
  const totalBuildTime = Date.now() - startTime;

  console.log(
    `[Build Complete] ${successful} successful, ${failed} failed in ${totalBuildTime}ms`,
  );

  return {
    status: failed === 0 ? "success" : "partial",
    built: successful,
    failed,
    buildTime: totalBuildTime,
  };
}

// CLI entry point
if (require.main === module) {
  const command = process.argv[2] || "incremental";

  if (command === "full") {
    fullBuild().catch((error) => {
      console.error("Build failed:", error);
      process.exit(1);
    });
  } else {
    incrementalBuild().catch((error) => {
      console.error("Build failed:", error);
      process.exit(1);
    });
  }
}

module.exports = {
  buildDoc,
  buildDocsParallel,
  incrementalBuild,
  fullBuild,
};
