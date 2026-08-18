const fs = require("fs");
const path = require("path");

/**
 * Discovery skill for finding the next available ADR number
 * Supports sequential, date-based, and custom numbering formats
 */
class ADRDiscovery {
  constructor(adrDirectory, numberFormat = {}) {
    this.adrDirectory = adrDirectory;
    this.numberFormat = {
      style: "sequential", // sequential, date-based, custom
      zeropadded: true,
      width: 4,
      ...numberFormat,
    };
  }

  /**
   * Find the next ADR number based on configured format
   */
  findNextNumber() {
    const existingAdrs = this.getExistingAdrs();

    switch (this.numberFormat.style) {
      case "sequential":
        return this.getNextSequential(existingAdrs);
      case "date-based":
        return this.getNextDateBased(existingAdrs);
      case "custom":
        return this.getNextCustom(existingAdrs);
      default:
        throw new Error(`Unknown number format: ${this.numberFormat.style}`);
    }
  }

  /**
   * Get all existing ADR numbers from the directory
   */
  getExistingAdrs() {
    if (!fs.existsSync(this.adrDirectory)) {
      return [];
    }

    const files = fs.readdirSync(this.adrDirectory);
    const adrFiles = files.filter(
      (f) => f.match(/^\d+/) || f.match(/^\d{4}-\d{2}-\d{2}/),
    );

    return adrFiles.sort();
  }

  /**
   * Get next sequential number
   * Examples: 0001, 0002, 0003...
   */
  getNextSequential(existingAdrs) {
    let nextNum = 1;

    if (existingAdrs.length > 0) {
      const lastAdr = existingAdrs[existingAdrs.length - 1];
      const match = lastAdr.match(/^(\d+)/);

      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }

    if (this.numberFormat.zeropadded) {
      const width = this.numberFormat.width || 4;
      return String(nextNum).padStart(width, "0");
    }

    return String(nextNum);
  }

  /**
   * Get next date-based number
   * Examples: 2026-08-18, 2026-08-18-1, 2026-08-18-2...
   */
  getNextDateBased(existingAdrs) {
    const today = this.getDateString();
    const todayAdrs = existingAdrs.filter((f) => f.startsWith(today));

    if (todayAdrs.length === 0) {
      return today;
    }

    // Find highest counter for today's date
    let maxCounter = 0;
    for (const adr of todayAdrs) {
      const match = adr.match(/^\d{4}-\d{2}-\d{2}-(\d+)/);
      if (match) {
        const counter = parseInt(match[1], 10);
        if (counter > maxCounter) {
          maxCounter = counter;
        }
      }
    }

    return `${today}-${maxCounter + 1}`;
  }

  /**
   * Get next custom number (must be implemented by user via config)
   */
  getNextCustom(existingAdrs) {
    // Custom format would be configured in the config file
    // This is a placeholder that returns the next sequential number
    return this.getNextSequential(existingAdrs);
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  getDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  /**
   * Generate full ADR filename for the next number
   * Includes slug from title
   */
  generateFilename(nextNumber, title) {
    const slug = this.titleToSlug(title);
    return `${nextNumber}-${slug}.md`;
  }

  /**
   * Convert title to slug (lowercase, kebab-case)
   */
  titleToSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }

  /**
   * Get next ADR number and filename
   */
  getNextAdrInfo(title) {
    const nextNumber = this.findNextNumber();
    const filename = this.generateFilename(nextNumber, title);
    const filepath = path.join(this.adrDirectory, filename);

    return {
      number: nextNumber,
      filename: filename,
      filepath: filepath,
      slug: this.titleToSlug(title),
    };
  }

  /**
   * Check if an ADR filename already exists
   */
  adrExists(filename) {
    const filepath = path.join(this.adrDirectory, filename);
    return fs.existsSync(filepath);
  }
}

module.exports = {
  ADRDiscovery,
};
