const fs = require("fs");
const path = require("path");

class ValidationError extends Error {
  constructor(name, message, details = {}) {
    super(message);
    this.name = name;
    this.details = details;
  }
}

class ValidatorError extends ValidationError {
  constructor(message, details) {
    super("ValidatorError", message, details);
  }
}

function enforceUniqueTitles(adrDirectory) {
  if (!fs.existsSync(adrDirectory)) {
    throw new ValidatorError(
      `ADR directory does not exist: ${adrDirectory}`,
      { directory: adrDirectory },
    );
  }

  const files = fs
    .readdirSync(adrDirectory)
    .filter((f) => f.endsWith(".md"));
  const titles = {};
  const duplicates = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(adrDirectory, file), "utf-8");
    const titleMatch = content.match(/^title:\s*(.+?)$/m);

    if (titleMatch) {
      const title = titleMatch[1].trim();

      if (titles[title]) {
        duplicates.push({
          title,
          files: [titles[title], file],
        });
      } else {
        titles[title] = file;
      }
    }
  }

  return {
    valid: duplicates.length === 0,
    errors: duplicates.map((dup) => ({
      rule: "enforce-unique-titles",
      message: `Duplicate title "${dup.title}" found in files: ${dup.files.join(", ")}`,
      files: dup.files,
      title: dup.title,
    })),
  };
}

function enforceValidReferences(adrDirectory) {
  if (!fs.existsSync(adrDirectory)) {
    throw new ValidatorError(
      `ADR directory does not exist: ${adrDirectory}`,
      { directory: adrDirectory },
    );
  }

  const files = fs
    .readdirSync(adrDirectory)
    .filter((f) => f.endsWith(".md"));
  const adrNumbers = new Set();

  for (const file of files) {
    // Extract numeric IDs (e.g., "0001-slug.md")
    const numMatch = file.match(/^(\d+)-/);
    if (numMatch) {
      const number = numMatch[1];
      adrNumbers.add(number);
      adrNumbers.add(parseInt(number, 10).toString());
    }

    // Extract date-based IDs (e.g., "2026-08-18-slug.md")
    const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      adrNumbers.add(dateMatch[1]);
    }
  }

  const errors = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(adrDirectory, file), "utf-8");
    const references = [
      ...content.matchAll(/supersedes:\s*(\d+|\d{4}-\d{2}-\d{2})/gi),
      ...content.matchAll(/superseded[\s-]by:\s*(\d+|\d{4}-\d{2}-\d{2})/gi),
      ...content.matchAll(/ADR\s*#?(\d+|\d{4}-\d{2}-\d{2})/g),
    ];

    for (const match of references) {
      const refNumber = match[1];
      if (!adrNumbers.has(refNumber) && !adrNumbers.has(parseInt(refNumber, 10).toString())) {
        errors.push({
          rule: "enforce-valid-references",
          message: `Invalid reference to ADR #${refNumber} in file ${file}`,
          file,
          reference: refNumber,
          context: match[0],
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function enforceStatusTransitions(adrDirectory) {
  if (!fs.existsSync(adrDirectory)) {
    throw new ValidatorError(
      `ADR directory does not exist: ${adrDirectory}`,
      { directory: adrDirectory },
    );
  }

  const VALID_STATUSES = ["PROPOSED", "ACCEPTED", "SUPERSEDED", "REJECTED"];
  const VALID_TRANSITIONS = {
    PROPOSED: ["ACCEPTED", "REJECTED", "SUPERSEDED"],
    ACCEPTED: ["SUPERSEDED"],
    SUPERSEDED: [],
    REJECTED: [],
  };

  const files = fs
    .readdirSync(adrDirectory)
    .filter((f) => f.endsWith(".md"));
  const errors = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(adrDirectory, file), "utf-8");
    const statusMatch = content.match(/^status:\s*(.+?)$/m);

    if (statusMatch) {
      const status = statusMatch[1].trim().toUpperCase();

      if (!VALID_STATUSES.includes(status)) {
        errors.push({
          rule: "enforce-status-transitions",
          message: `Invalid status "${status}" in file ${file}. Valid statuses: ${VALID_STATUSES.join(", ")}`,
          file,
          status,
          validStatuses: VALID_STATUSES,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    validStatuses: VALID_STATUSES,
    validTransitions: VALID_TRANSITIONS,
  };
}

function enforceFormat(adrDirectory) {
  if (!fs.existsSync(adrDirectory)) {
    throw new ValidatorError(
      `ADR directory does not exist: ${adrDirectory}`,
      { directory: adrDirectory },
    );
  }

  const files = fs
    .readdirSync(adrDirectory)
    .filter((f) => f.endsWith(".md"));
  const errors = [];
  const requiredFields = ["title", "date", "status", "authors"];

  for (const file of files) {
    const content = fs.readFileSync(path.join(adrDirectory, file), "utf-8");
    const missingFields = [];

    for (const field of requiredFields) {
      if (!new RegExp(`^${field}:`, "m").test(content)) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      errors.push({
        rule: "enforce-format",
        message: `Missing required frontmatter fields in ${file}: ${missingFields.join(", ")}`,
        file,
        missingFields,
      });
    }

    if (!content.match(/^---\n[\s\S]*?\n---\n/m)) {
      errors.push({
        rule: "enforce-format",
        message: `Invalid frontmatter format in ${file}. Must start with --- and end with ---`,
        file,
        issue: "invalid-frontmatter",
      });
    }

    if (!content.match(/^# /m)) {
      errors.push({
        rule: "enforce-format",
        message: `Missing H1 title in ${file}. ADR should start with a level 1 heading`,
        file,
        issue: "missing-h1",
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    requiredFields,
  };
}

function enforceFilenameFormat(adrDirectory) {
  if (!fs.existsSync(adrDirectory)) {
    throw new ValidatorError(
      `ADR directory does not exist: ${adrDirectory}`,
      { directory: adrDirectory },
    );
  }

  const files = fs
    .readdirSync(adrDirectory)
    .filter((f) => f.endsWith(".md"));
  const errors = [];
  const FILENAME_PATTERN = /^(\d+)-(.+)\.md$/;

  for (const file of files) {
    if (!FILENAME_PATTERN.test(file)) {
      errors.push({
        rule: "enforce-filename-format",
        message: `Invalid filename format: ${file}. Should match pattern: NNNN-slug.md`,
        file,
        pattern: "NNNN-slug.md",
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    pattern: "NNNN-slug.md",
  };
}

function enforceMetadata(adrDirectory, requiredFields = ["title", "date", "status", "authors"]) {
  if (!fs.existsSync(adrDirectory)) {
    throw new ValidatorError(
      `ADR directory does not exist: ${adrDirectory}`,
      { directory: adrDirectory },
    );
  }

  const files = fs
    .readdirSync(adrDirectory)
    .filter((f) => f.endsWith(".md"));
  const errors = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(adrDirectory, file), "utf-8");
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let frontmatter = "";

    if (frontmatterMatch) {
      frontmatter = frontmatterMatch[1];
    }

    const missingFields = [];
    const emptyFields = [];
    const lines = frontmatter.split("\n");
    const parsedFields = {};

    for (const line of lines) {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        parsedFields[key] = value;
      }
    }

    for (const field of requiredFields) {
      if (!(field in parsedFields)) {
        missingFields.push(field);
      } else if (!parsedFields[field] || parsedFields[field] === "") {
        emptyFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      errors.push({
        rule: "enforce-metadata",
        message: `Missing required metadata fields in ${file}: ${missingFields.join(", ")}`,
        file,
        missingFields,
      });
    }

    if (emptyFields.length > 0) {
      errors.push({
        rule: "enforce-metadata",
        message: `Empty required metadata fields in ${file}: ${emptyFields.join(", ")}`,
        file,
        emptyFields,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    requiredFields,
  };
}

module.exports = {
  enforceUniqueTitles,
  enforceValidReferences,
  enforceStatusTransitions,
  enforceFormat,
  enforceFilenameFormat,
  enforceMetadata,
  ValidationError,
  ValidatorError,
};
