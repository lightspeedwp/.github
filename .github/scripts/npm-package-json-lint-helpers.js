/**
 * Helper utilities extracted from previous npmpackagejsonlint.config.js
 * These are NOT executed by npm-package-json-lint directly. They can be
 * composed into custom validation workflows if needed.
 */

/**
 * Validate LightSpeedWP package naming conventions.
 * @param {string} packageName
 * @returns {string[]} errors
 */
export function validateLightSpeedWPNaming(packageName) {
  const errors = [];
  if (packageName.startsWith("@lightspeedwp/")) {
    const nameWithoutScope = packageName.replace("@lightspeedwp/", "");
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(nameWithoutScope)) {
      errors.push("LightSpeedWP packages must use kebab-case naming");
    }
    const reservedNames = [
      "core",
      "common",
      "shared",
      "utils",
      "helpers",
      "lib",
      "library",
    ];
    if (reservedNames.includes(nameWithoutScope)) {
      errors.push(`Package name '${nameWithoutScope}' is reserved`);
    }
  }
  return errors;
}

/**
 * Validate WordPress plugin/theme specific fields.
 * @param {Record<string, any>} packageJson
 * @returns {string[]} errors
 */
export function validateWordPressFields(packageJson) {
  const errors = [];
  if (packageJson.keywords) {
    const wpKeywords = ["wordpress", "gutenberg", "blocks", "theme", "plugin"];
    const hasWpKeyword = wpKeywords.some((k) =>
      packageJson.keywords.includes(k),
    );
    if (hasWpKeyword) {
      if (!packageJson.engines || !packageJson.engines.node) {
        errors.push(
          "WordPress packages should specify Node.js engine requirements",
        );
      }
      if (packageJson.keywords.includes("gutenberg")) {
        const wpDeps = [
          "@wordpress/scripts",
          "@wordpress/element",
          "@wordpress/blocks",
        ];
        const hasWpDep = wpDeps.some(
          (dep) =>
            (packageJson.dependencies && packageJson.dependencies[dep]) ||
            (packageJson.devDependencies && packageJson.devDependencies[dep]),
        );
        if (!hasWpDep) {
          errors.push(
            "Gutenberg packages should include WordPress dependencies",
          );
        }
      }
    }
  }
  return errors;
}

/**
 * Generate package.json template for LightSpeedWP projects.
 * @param {string} projectName
 * @param {('library'|'plugin'|'theme')} projectType
 * @returns {Record<string, any>} template object
 */
export function generateTemplate(projectName, projectType = "library") {
  const base = {
    name: `@lightspeedwp/${projectName}`,
    version: "0.1.0",
    license: "GPL-3.0-or-later",
    author: {
      name: "LightSpeedWP Team",
      email: "support@lightspeedwp.agency",
      url: "https://lightspeedwp.agency",
    },
    repository: `https://github.com/lightspeedwp/${projectName}.git`,
    homepage: `https://github.com/lightspeedwp/${projectName}`,
    bugs: { url: `https://github.com/lightspeedwp/${projectName}/issues` },
    engines: { node: ">=18.0.0", npm: ">=9.0.0" },
  };

  const templates = {
    library: {
      ...base,
      description: `LightSpeedWP ${projectName} library`,
      keywords: ["lightspeedwp", "wordpress", "library"],
    },
    plugin: {
      ...base,
      description: `LightSpeedWP ${projectName} WordPress plugin`,
      keywords: ["lightspeedwp", "wordpress", "plugin", "gutenberg"],
      devDependencies: { "@wordpress/scripts": "^28.0.0" },
    },
    theme: {
      ...base,
      description: `LightSpeedWP ${projectName} WordPress theme`,
      keywords: ["lightspeedwp", "wordpress", "theme", "blocks"],
      devDependencies: { "@wordpress/scripts": "^28.0.0" },
    },
  };
  return templates[projectType] || templates.library;
}

/**
 * Validate environment settings for strict mode and required fields flags.
 * @param {{strictMode:boolean; requireFields:boolean;}} opts
 * @returns {string[]} warnings
 */
export function validateEnvironment(opts) {
  const warnings = [];
  if (opts.strictMode)
    warnings.push("Strict mode enabled: version-format escalated to error");
  if (!opts.requireFields)
    warnings.push(
      "Required field validation disabled: description/license/repository may be missing",
    );
  return warnings;
}
