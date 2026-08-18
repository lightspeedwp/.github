const fs = require("fs");
const path = require("path");

class TemplateError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }
}

class TemplateNotFoundError extends TemplateError {
  constructor(message) {
    super("TemplateNotFoundError", message);
  }
}

class TemplateParseError extends TemplateError {
  constructor(message) {
    super("TemplateParseError", message);
  }
}

const VALID_TEMPLATES = ["standard", "lightweight", "security", "infrastructure"];

const PLACEHOLDER_PATTERN = /\{([A-Z_0-9]+)\}/g;

const DEFAULT_PLACEHOLDERS = {
  TITLE: "Untitled Decision",
  DATE: null, // Computed at substitution time
  STATUS: "PROPOSED",
  AUTHORS: "Unknown",
  SUPERSEDES: "",
  SUPERSEDED_BY: "",
  SECURITY_LEVEL: "Medium",
  THREAT_CATEGORY: "General",
  INFRASTRUCTURE_TIER: "Standard",
  SCALABILITY_RATING: "Medium",
  DECISION: "Decision text here",
  RATIONALE: "Rationale text here",
  CONSEQUENCES: "Consequences text here",
};

let templateCache = {};

function getTemplatesDirectory() {
  return path.join(__dirname, "../templates");
}

function validateTemplateType(templateType) {
  if (!VALID_TEMPLATES.includes(templateType)) {
    throw new TemplateNotFoundError(
      `Invalid template type: ${templateType}. Valid types: ${VALID_TEMPLATES.join(", ")}`,
    );
  }
}

function loadTemplate(templateType) {
  validateTemplateType(templateType);

  if (templateCache[templateType]) {
    return templateCache[templateType];
  }

  const templatesDir = getTemplatesDirectory();
  const templatePath = path.join(templatesDir, `${templateType}.md`);

  if (!fs.existsSync(templatePath)) {
    throw new TemplateNotFoundError(
      `Template not found: ${templatePath}. Available templates: ${VALID_TEMPLATES.join(", ")}`,
    );
  }

  try {
    const content = fs.readFileSync(templatePath, "utf-8");
    templateCache[templateType] = content;
    return content;
  } catch (error) {
    throw new TemplateParseError(
      `Failed to load template ${templateType}: ${error.message}`,
    );
  }
}

function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: "", body: content };
  }

  return {
    frontmatter: match[1],
    body: match[2],
  };
}

function parseFrontmatterYAML(yamlContent) {
  const lines = yamlContent.split("\n");
  const fields = {};

  for (const line of lines) {
    if (!line.trim()) continue;
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      const value = valueParts.join(":").trim();
      fields[key.trim()] = value === "" ? null : value;
    }
  }

  return fields;
}

function substitutePlaceholders(content, placeholders = {}) {
  const mergedPlaceholders = {
    ...DEFAULT_PLACEHOLDERS,
    ...placeholders,
  };

  return content.replace(PLACEHOLDER_PATTERN, (match, placeholder) => {
    if (placeholder in mergedPlaceholders) {
      const value = mergedPlaceholders[placeholder];
      return value === null || value === undefined ? "" : String(value);
    }
    return match;
  });
}

function renderTemplate(templateType, placeholders = {}) {
  const templateContent = loadTemplate(templateType);
  return substitutePlaceholders(templateContent, placeholders);
}

function getAvailableTemplates() {
  const templatesDir = getTemplatesDirectory();

  try {
    const files = fs.readdirSync(templatesDir);
    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(".md", ""))
      .filter((name) => VALID_TEMPLATES.includes(name));
  } catch (error) {
    throw new TemplateError(
      `Failed to list available templates: ${error.message}`,
    );
  }
}

function getTemplatePlaceholders(templateType) {
  validateTemplateType(templateType);

  const templateContent = loadTemplate(templateType);
  const placeholders = new Set();

  let match;
  const regex = new RegExp(PLACEHOLDER_PATTERN);

  while ((match = regex.exec(templateContent)) !== null) {
    placeholders.add(match[1]);
  }

  return Array.from(placeholders).sort();
}

function getTemplateInfo(templateType) {
  validateTemplateType(templateType);

  const content = loadTemplate(templateType);
  const { frontmatter, body } = extractFrontmatter(content);
  const frontmatterFields = parseFrontmatterYAML(frontmatter);
  const placeholders = getTemplatePlaceholders(templateType);

  return {
    type: templateType,
    frontmatterFields,
    placeholders,
    contentPreview: body.split("\n").slice(0, 3).join("\n"),
    size: content.length,
  };
}

function clearTemplateCache() {
  templateCache = {};
}

module.exports = {
  loadTemplate,
  renderTemplate,
  substitutePlaceholders,
  extractFrontmatter,
  parseFrontmatterYAML,
  getAvailableTemplates,
  getTemplatePlaceholders,
  getTemplateInfo,
  clearTemplateCache,
  VALID_TEMPLATES,
  DEFAULT_PLACEHOLDERS,
  TemplateError,
  TemplateNotFoundError,
  TemplateParseError,
};
