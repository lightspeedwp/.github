const fs = require("fs");
const path = require("path");
const os = require("os");
const configLoader = require("../skills/adr-config-loader");

describe("ADR Config Loader", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "adr-config-test-"));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe("loadConfig", () => {
    test("should load repo config when found", () => {
      const configPath = path.join(tempDir, ".adr-config.json");
      const config = {
        adr: {
          directory: "docs/adr",
          template: "standard",
          number_format: { style: "sequential", zero_padded: true, width: 4 },
          approval_workflow: {
            enabled: false,
            method: "none",
            required_approvals: 1,
          },
          metadata: {
            required_fields: ["date", "status"],
            optional_fields: [],
          },
          custom_fields: {
            wordpress: {
              impact_areas: [],
              performance_tier: "medium",
              backwards_compatible: true,
            },
          },
          validation: {
            enforce_unique_titles: true,
            enforce_valid_references: true,
            enforce_status_transitions: false,
            minimum_content_length: 100,
          },
        },
      };

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      const loaded = configLoader.loadConfig(tempDir);
      expect(loaded.adr.directory).toBe("docs/adr");
      expect(loaded._source.repoConfig).toBe(true);
    });

    test("should throw ConfigNotFoundError when config not found", () => {
      expect(() => {
        configLoader.loadConfig(tempDir);
      }).toThrow(configLoader.ConfigNotFoundError);
    });

    test("should throw ConfigParseError on invalid JSON", () => {
      const configPath = path.join(tempDir, ".adr-config.json");
      fs.writeFileSync(configPath, "{ invalid json }");

      expect(() => {
        configLoader.loadConfig(tempDir);
      }).toThrow(configLoader.ConfigParseError);
    });

    test("should walk up directory tree to find config", () => {
      const configPath = path.join(tempDir, ".adr-config.json");
      const subDir = path.join(tempDir, "a", "b", "c");
      fs.mkdirSync(subDir, { recursive: true });

      const config = {
        adr: {
          directory: "docs/adr",
          template: "standard",
          number_format: { style: "sequential", zero_padded: true, width: 4 },
          approval_workflow: {
            enabled: false,
            method: "none",
            required_approvals: 1,
          },
          metadata: {
            required_fields: ["date", "status"],
            optional_fields: [],
          },
          custom_fields: {
            wordpress: {
              impact_areas: [],
              performance_tier: "medium",
              backwards_compatible: true,
            },
          },
          validation: {
            enforce_unique_titles: true,
            enforce_valid_references: true,
            enforce_status_transitions: false,
            minimum_content_length: 100,
          },
        },
      };

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      const loaded = configLoader.loadConfig(subDir);
      expect(loaded.adr.directory).toBe("docs/adr");
    });

    test("should merge org and repo configs", () => {
      const orgConfigPath = path.join(tempDir, "org-config.json");
      const repoConfigPath = path.join(tempDir, ".adr-config.json");

      const orgConfig = {
        adr: {
          directory: "docs/adr",
          template: "standard",
          number_format: { style: "sequential", zero_padded: true, width: 4 },
          approval_workflow: {
            enabled: false,
            method: "none",
            required_approvals: 1,
          },
          metadata: {
            required_fields: ["date", "status"],
            optional_fields: [],
          },
          custom_fields: {
            wordpress: {
              impact_areas: [],
              performance_tier: "medium",
              backwards_compatible: true,
            },
          },
          validation: {
            enforce_unique_titles: true,
            enforce_valid_references: true,
            enforce_status_transitions: false,
            minimum_content_length: 100,
          },
        },
      };

      const repoConfig = {
        adr: {
          template: "security",
          approval_workflow: { enabled: true, method: "codeowners" },
        },
      };

      fs.writeFileSync(orgConfigPath, JSON.stringify(orgConfig, null, 2));
      fs.writeFileSync(repoConfigPath, JSON.stringify(repoConfig, null, 2));

      const loaded = configLoader.loadConfig(tempDir, { orgConfigPath });
      expect(loaded.adr.template).toBe("security");
      expect(loaded.adr.approval_workflow.enabled).toBe(true);
      expect(loaded.adr.approval_workflow.method).toBe("codeowners");
      expect(loaded.adr.directory).toBe("docs/adr");
      expect(loaded._source.merged).toBe(true);
    });
  });

  describe("validateConfig", () => {
    test("should validate correct config", () => {
      const config = {
        adr: {
          directory: "docs/adr",
          template: "standard",
          number_format: { style: "sequential", zero_padded: true, width: 4 },
          approval_workflow: {
            enabled: false,
            method: "none",
            required_approvals: 1,
          },
          metadata: {
            required_fields: ["date", "status"],
            optional_fields: [],
          },
          custom_fields: {
            wordpress: {
              impact_areas: [],
              performance_tier: "medium",
              backwards_compatible: true,
            },
          },
          validation: {
            enforce_unique_titles: true,
            enforce_valid_references: true,
            enforce_status_transitions: false,
            minimum_content_length: 100,
          },
        },
      };

      const result = configLoader.validateConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test("should reject invalid template value", () => {
      const config = {
        adr: {
          directory: "docs/adr",
          template: "invalid-template",
          number_format: { style: "sequential", zero_padded: true, width: 4 },
          approval_workflow: {
            enabled: false,
            method: "none",
            required_approvals: 1,
          },
          metadata: {
            required_fields: ["date", "status"],
            optional_fields: [],
          },
          custom_fields: {
            wordpress: {
              impact_areas: [],
              performance_tier: "medium",
              backwards_compatible: true,
            },
          },
          validation: {
            enforce_unique_titles: true,
            enforce_valid_references: true,
            enforce_status_transitions: false,
            minimum_content_length: 100,
          },
        },
      };

      const result = configLoader.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("should reject missing required adr field", () => {
      const config = { adr: { template: "standard" } };
      const result = configLoader.validateConfig(config);
      expect(result.valid).toBe(false);
    });
  });

  describe("mergeConfigs", () => {
    test("should merge nested objects correctly", () => {
      const org = {
        adr: {
          directory: "docs/adr",
          template: "standard",
          approval_workflow: {
            enabled: false,
            method: "none",
            required_approvals: 1,
          },
        },
      };

      const repo = {
        adr: {
          template: "security",
          approval_workflow: { enabled: true, method: "codeowners" },
        },
      };

      const merged = configLoader.mergeConfigs(org, repo);
      expect(merged.adr.directory).toBe("docs/adr");
      expect(merged.adr.template).toBe("security");
      expect(merged.adr.approval_workflow.enabled).toBe(true);
      expect(merged.adr.approval_workflow.method).toBe("codeowners");
      expect(merged.adr.approval_workflow.required_approvals).toBe(1);
    });

    test("should not mutate original objects", () => {
      const org = { adr: { directory: "docs/adr" } };
      const repo = { adr: { template: "security" } };

      const merged = configLoader.mergeConfigs(org, repo);
      expect(org).toEqual({ adr: { directory: "docs/adr" } });
      expect(repo).toEqual({ adr: { template: "security" } });
      expect(merged.adr.directory).toBe("docs/adr");
      expect(merged.adr.template).toBe("security");
    });
  });

  describe("getDefaults", () => {
    test("should return default configuration", () => {
      const defaults = configLoader.getDefaults();
      expect(defaults.adr).toBeDefined();
      expect(defaults.adr.directory).toBe("docs/adr");
      expect(defaults.adr.template).toBe("standard");
      expect(defaults.adr.number_format.style).toBe("sequential");
    });

    test("should not mutate cached defaults", () => {
      const defaults1 = configLoader.getDefaults();
      defaults1.adr.directory = "modified";

      const defaults2 = configLoader.getDefaults();
      expect(defaults2.adr.directory).toBe("docs/adr");
    });
  });

  describe("error messages", () => {
    test("ConfigNotFoundError should include error name", () => {
      const error = new configLoader.ConfigNotFoundError("Test error");
      expect(error.name).toBe("ConfigNotFoundError");
      expect(error.message).toBe("Test error");
    });

    test("ConfigInvalidError should be thrown with validation errors", () => {
      const error = new configLoader.ConfigInvalidError("Invalid config");
      expect(error.name).toBe("ConfigInvalidError");
    });

    test("ConfigParseError should be thrown with parse errors", () => {
      const error = new configLoader.ConfigParseError("Parse failed");
      expect(error.name).toBe("ConfigParseError");
    });
  });

  describe("edge cases", () => {
    test("should handle minimal valid config", () => {
      const configPath = path.join(tempDir, ".adr-config.json");
      const config = { adr: { directory: "docs/adr" } };

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      const loaded = configLoader.loadConfig(tempDir);
      expect(loaded.adr.directory).toBe("docs/adr");
    });

    test("should handle config with all optional fields", () => {
      const configPath = path.join(tempDir, ".adr-config.json");
      const config = {
        adr: {
          directory: "architecture/decisions",
          template: "security",
          number_format: { style: "date-based", date_format: "YYYYMMDD" },
          approval_workflow: {
            enabled: true,
            method: "custom",
            custom_approvers: ["@team/architects", "@user1"],
          },
          metadata: {
            required_fields: ["date", "status", "authors", "security-impact"],
            optional_fields: ["supersedes", "tags"],
          },
          custom_fields: {
            wordpress: {
              impact_areas: ["security", "performance"],
              performance_tier: "critical",
            },
          },
          validation: {
            enforce_unique_titles: true,
            enforce_valid_references: true,
            enforce_status_transitions: true,
            minimum_content_length: 500,
          },
        },
      };

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      const loaded = configLoader.loadConfig(tempDir);
      expect(loaded.adr.template).toBe("security");
      expect(loaded.adr.number_format.style).toBe("date-based");
    });
  });
});
