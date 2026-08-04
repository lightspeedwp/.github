/**
 * Structured JSON Logger for GitHub Actions agents
 *
 * Provides machine-parseable JSON logging with configurable levels.
 * Logs to stdout (info/debug/warn) and stderr (error).
 *
 * Usage:
 *   const { Logger } = require('./logger.js');
 *   const logger = new Logger(process.env.LOG_LEVEL || 'info');
 *   logger.info('Agent started', { event: 'start', pr: 123 });
 *   logger.error('Failed to post comment', { error: err.message });
 *
 * @module scripts/utils/logger.js
 */

class Logger {
  constructor(level = "info") {
    this.levelMap = { debug: 0, info: 1, warn: 2, error: 3 };
    const normalizedLevel = level.toLowerCase();
    if (this.levelMap[normalizedLevel] === undefined) {
      throw new Error(
        `Invalid log level: ${level}. Use: debug, info, warn, error`,
      );
    }
    this.level = normalizedLevel;
  }

  log(level, message, data = {}) {
    if (this.levelMap[level] < this.levelMap[this.level]) {
      return;
    }

    const output = {
      ...data,
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    const stream = level === "error" ? process.stderr : process.stdout;
    stream.write(JSON.stringify(output) + "\n");
  }

  debug(message, data) {
    this.log("debug", message, data);
  }

  info(message, data) {
    this.log("info", message, data);
  }

  warn(message, data) {
    this.log("warn", message, data);
  }

  error(message, data) {
    this.log("error", message, data);
  }
}

export { Logger };
