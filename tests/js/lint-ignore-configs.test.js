const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "../..");
const eslintConfigPath = path.join(repoRoot, "eslint.config.cjs");
const markdownlintConfigPath = path.join(repoRoot, ".markdownlint.config.cjs");
const markdownlintCli2ConfigPath = path.join(
  repoRoot,
  ".markdownlint-cli2.cjs",
);
const markdownlintIgnorePath = path.join(repoRoot, ".markdownlintignore");

describe("ESLint vendored skill ignores", () => {
  const ignoredPaths = [
    "agents/example/skills/plugin-provided/vendor.js",
    "agents/example/skills/platform-managed/vendor.ts",
    "agents/example/skills/directory-installed/vendor.tsx",
    "agents/example/skills/agent-attached/vendor.jsx",
    "agents/example/skills/local/vendor.js",
    "nested/agents/example/skills/local/plugin-provided/vendor.js",
  ];
  const ignoredFigmaTypings = [
    "plugin-api-standalone.d.ts",
    "skills/design-md-agent/figma-use/references/plugin-api-standalone.d.ts",
    "agents/example/references/plugin-api-standalone.d.ts",
  ];
  const lintedPaths = [
    "agents/example/skills/authored/source.js",
    "agents/example/local/source.js",
    "agents/example/skills/local-source/source.js",
    "agents/example/references/plugin-api-standalone.ts",
    "agents/example/references/custom-plugin-api-standalone.d.ts",
  ];
  let ignoredByPath;

  beforeAll(() => {
    const paths = [...ignoredPaths, ...ignoredFigmaTypings, ...lintedPaths];
    const script = `
      const { FlatESLint } = require("eslint/use-at-your-own-risk");
      const [configPath, serialisedPaths] = process.argv.slice(1);
      const paths = JSON.parse(serialisedPaths);
      const eslint = new FlatESLint({ overrideConfigFile: configPath });

      Promise.all(
        paths.map(async (filePath) => [filePath, await eslint.isPathIgnored(filePath)]),
      )
        .then((entries) => process.stdout.write(JSON.stringify(Object.fromEntries(entries))))
        .catch((error) => {
          console.error(error);
          process.exitCode = 1;
        });
    `;
    const env = { ...process.env, ESLINT_USE_FLAT_CONFIG: "true" };
    delete env.ESLINT_IGNORE;

    ignoredByPath = JSON.parse(
      execFileSync(
        process.execPath,
        ["-e", script, eslintConfigPath, JSON.stringify(paths)],
        { cwd: repoRoot, encoding: "utf8", env },
      ),
    );
  });

  test.each(ignoredPaths)("ignores vendored skill asset %s", (filePath) => {
    expect(ignoredByPath[filePath]).toBe(true);
  });

  test.each(ignoredFigmaTypings)(
    "ignores copied Figma typings %s",
    (filePath) => {
      expect(ignoredByPath[filePath]).toBe(true);
    },
  );

  test.each(lintedPaths)(
    "does not ignore first-party or near-match path %s",
    (filePath) => {
      expect(ignoredByPath[filePath]).toBe(false);
    },
  );
});

describe("Markdownlint ignore configuration", () => {
  const originalReadFileSync = fs.readFileSync.bind(fs);

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("loads every canonical ignore pattern into the CLI2 configuration", () => {
    const expectedPatterns = originalReadFileSync(
      markdownlintIgnorePath,
      "utf8",
    )
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));

    const cli2Config = require(markdownlintCli2ConfigPath);

    expect(cli2Config.ignores).toEqual(
      expect.arrayContaining(expectedPatterns),
    );
    expect(cli2Config.ignores).toEqual(
      expect.arrayContaining([
        "**/skills/local/**",
        "**/skills/agent-attached/**",
      ]),
    );
    expect(cli2Config.ignores).not.toContain("");
    expect(cli2Config.ignores.some((line) => line.startsWith("#"))).toBe(false);
  });

  it("trims patterns and removes comments and blank lines", () => {
    jest.spyOn(fs, "readFileSync").mockImplementation((filePath, ...args) => {
      if (path.resolve(filePath) === markdownlintIgnorePath) {
        return [
          "",
          "  # Ignore file comment  ",
          "  **/skills/local/**  ",
          "\t",
          "docs/generated/**\r",
        ].join("\n");
      }

      return originalReadFileSync(filePath, ...args);
    });

    const config = require(markdownlintConfigPath);

    expect(config.ignorePaths).toEqual(
      expect.arrayContaining(["**/skills/local/**", "docs/generated/**"]),
    );
    expect(config.ignorePaths).not.toContain("");
    expect(config.ignorePaths).not.toContain("# Ignore file comment");
  });

  it("keeps default ignores and warns when the ignore file is unreadable", () => {
    jest.spyOn(fs, "readFileSync").mockImplementation((filePath, ...args) => {
      if (path.resolve(filePath) === markdownlintIgnorePath) {
        throw new Error("permission denied");
      }

      return originalReadFileSync(filePath, ...args);
    });
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    const config = require(markdownlintConfigPath);

    expect(config.ignorePaths).toEqual(
      expect.arrayContaining(["node_modules/**", "coverage/**", "dist/**"]),
    );
    expect(config.ignorePaths).not.toContain("**/skills/local/**");
    expect(warn).toHaveBeenCalledWith(
      `Could not load ${markdownlintIgnorePath}, using defaults`,
    );
  });
});
