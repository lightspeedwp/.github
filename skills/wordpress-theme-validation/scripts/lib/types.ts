/**
 * Shared types for the theme validator: the theme model, findings and the Check contract.
 */

export type Severity = 'error' | 'warning';

/** One problem found in one place. `line` is 1-based and best effort for JSON paths. */
export interface Finding {
  check: string;
  severity: Severity;
  file: string;
  line?: number;
  /** JSON path inside the file (dot separated), when the finding sits in a JSON tree. */
  path?: string;
  message: string;
  hint: string;
}

/** A theme file, by path relative to the theme root. */
export interface ThemeFile {
  path: string;
  text: string;
}

export interface JsonFile extends ThemeFile {
  /** The parsed value, or undefined when the file is not valid JSON. */
  json: unknown;
  parseError?: string;
}

export interface PatternFile extends ThemeFile {
  /** Header fields from the opening docblock, keyed by field name ("Title", "Slug"…). */
  headers: Record<string, string>;
}

/** One entry of the theme's allow-list: recorded debt that should not fail the run. */
export interface AllowEntry {
  check: string;
  /** Theme-relative file. `*` matches any run of characters. */
  file: string;
  /** Optional JSON path inside the file, matched exactly. */
  path?: string;
  /** How many matching findings are tolerated. More than this and none are allowed. */
  max?: number;
  reason?: string;
}

/** The theme's `.theme-validation.json`. Every field is optional. */
export interface ValidationConfig {
  textDomain?: string;
  /** Slug namespace for patterns. Defaults to the text domain. */
  namespace?: string;
  /** Block namespaces the theme depends on besides `core` (for example `woocommerce`). */
  blockNamespaces?: string[];
  allow?: AllowEntry[];
}

export interface Theme {
  root: string;
  config: ValidationConfig;
  textDomain: string;
  namespace: string;
  styleCss?: ThemeFile;
  themeJson?: JsonFile;
  /** `styles/**\/*.json`: style variations and block/section style partials. */
  partials: JsonFile[];
  templates: ThemeFile[];
  parts: ThemeFile[];
  patterns: PatternFile[];
  /** Theme PHP outside `patterns/` (functions.php, inc/…). */
  php: ThemeFile[];
}

/** One validation rule. Each check is its own class. */
export interface Check {
  readonly id: string;
  readonly severity: Severity;
  readonly description: string;
  run(theme: Theme): Finding[];
}
