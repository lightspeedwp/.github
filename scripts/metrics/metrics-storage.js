/**
 * Metrics Storage — Time-series data persistence and retrieval
 * Stores historical metrics with timestamps for trend analysis
 */

const fs = require("fs");
const path = require("path");

class MetricsStorage {
  constructor(storageDir = ".githu./.github/reports/metrics") {
    this.storageDir = storageDir;
    this.ensureStorageDir();
  }

  ensureStorageDir() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  getStoragePath(repository) {
    const sanitized = repository.replace(/\//g, "-");
    return path.join(this.storageDir, `${sanitized}-history.json`);
  }

  saveMetrics(repository, metrics, timestamp = Date.now()) {
    const filePath = this.getStoragePath(repository);
    let history = [];

    // Load existing history
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      history = JSON.parse(content);
    }

    // Validate metrics structure
    if (!this.validateMetrics(metrics)) {
      throw new Error("Invalid metrics structure");
    }

    // Add new entry
    history.push({
      timestamp,
      date: new Date(timestamp).toISOString(),
      metrics,
    });

    // Keep last 90 days (roughly 13 weeks)
    const ninetyDaysAgo = timestamp - 90 * 24 * 60 * 60 * 1000;
    history = history.filter((entry) => entry.timestamp >= ninetyDaysAgo);

    // Write to file
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2), "utf-8");
    return history.length;
  }

  loadMetrics(repository) {
    const filePath = this.getStoragePath(repository);

    if (!fs.existsSync(filePath)) {
      return [];
    }

    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  }

  getMetricsSince(repository, days = 7) {
    const history = this.loadMetrics(repository);
    const sinceTimestamp = Date.now() - days * 24 * 60 * 60 * 1000;

    return history.filter((entry) => entry.timestamp >= sinceTimestamp);
  }

  getLatestMetrics(repository) {
    const history = this.loadMetrics(repository);

    if (history.length === 0) {
      return null;
    }

    return history[history.length - 1];
  }

  validateMetrics(metrics) {
    // Basic validation
    if (!metrics || typeof metrics !== "object") {
      return false;
    }

    // Check for required metric categories
    const requiredFields = ["issues", "pull_requests", "contributors"];
    return requiredFields.every((field) => field in metrics);
  }

  deleteOldEntries(repository, days = 90) {
    const filePath = this.getStoragePath(repository);

    if (!fs.existsSync(filePath)) {
      return 0;
    }

    const history = this.loadMetrics(repository);
    const beforeCount = history.length;
    const cutoffTimestamp = Date.now() - days * 24 * 60 * 60 * 1000;

    const filtered = history.filter(
      (entry) => entry.timestamp >= cutoffTimestamp,
    );

    if (filtered.length < beforeCount) {
      fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), "utf-8");
    }

    return beforeCount - filtered.length;
  }

  getAllRepositories() {
    if (!fs.existsSync(this.storageDir)) {
      return [];
    }

    return fs
      .readdirSync(this.storageDir)
      .filter((file) => file.endsWith("-history.json"))
      .map((file) => file.replace("-history.json", "").replace(/-/g, "/"));
  }
}

module.exports = { MetricsStorage };
