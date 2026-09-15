/**
 * Error classes for changelog validation system
 */

class ChangelogError extends Error {
  constructor(message, code = 'CHANGELOG_ERROR', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}

class ValidationError extends ChangelogError {
  constructor(message, details = null) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

class RuleApplicationError extends ChangelogError {
  constructor(message, ruleId = null, details = null) {
    super(message, 'RULE_APPLICATION_ERROR', { ruleId, ...details });
  }
}

class ConfigError extends ChangelogError {
  constructor(message, details = null) {
    super(message, 'CONFIG_ERROR', details);
  }
}

class FileError extends ChangelogError {
  constructor(message, filePath = null, details = null) {
    super(message, 'FILE_ERROR', { filePath, ...details });
  }
}

class GitHubAPIError extends ChangelogError {
  constructor(message, statusCode = null, details = null) {
    super(message, 'GITHUB_API_ERROR', { statusCode, ...details });
  }
}

module.exports = {
  ChangelogError,
  ValidationError,
  RuleApplicationError,
  ConfigError,
  FileError,
  GitHubAPIError,
};
