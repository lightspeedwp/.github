const fs = require("fs");
const { execSync } = require("child_process");
const MetricsCollectionOrchestrator = require("../collect-metrics");

jest.mock("child_process");
jest.mock("fs");

describe("MetricsCollectionOrchestrator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.GITHUB_OUTPUT;
    fs.existsSync.mockReturnValue(true);
    fs.mkdirSync.mockImplementation(() => {});
    fs.writeFileSync.mockImplementation(() => {});
    fs.appendFileSync.mockImplementation(() => {});
  });

  describe("constructor", () => {
    it("initializes with default options", () => {
      const orchestrator = new MetricsCollectionOrchestrator();
      expect(orchestrator.context).toBe("all");
      expect(orchestrator.dry).toBe(false);
      expect(orchestrator.verbose).toBe(false);
    });

    it("initializes with custom options", () => {
      const orchestrator = new MetricsCollectionOrchestrator({
        context: "github-control-plane",
        dry: true,
        verbose: true,
      });
      expect(orchestrator.context).toBe("github-control-plane");
      expect(orchestrator.dry).toBe(true);
      expect(orchestrator.verbose).toBe(true);
    });

    it("initializes results structure", () => {
      const orchestrator = new MetricsCollectionOrchestrator();
      expect(orchestrator.results).toHaveProperty("timestamp");
      expect(orchestrator.results).toHaveProperty("contexts");
      expect(orchestrator.results.summary).toEqual({
        total: 0,
        successful: 0,
        failed: 0,
      });
    });
  });

  describe("getContexts", () => {
    it('returns all contexts when context is "all"', () => {
      const orchestrator = new MetricsCollectionOrchestrator({
        context: "all",
      });
      const contexts = orchestrator.getContexts();
      expect(contexts).toEqual([
        "github-control-plane",
        "wordpress-plugin",
        "wordpress-theme",
      ]);
    });

    it("returns single context when context is specified", () => {
      const orchestrator = new MetricsCollectionOrchestrator({
        context: "github-control-plane",
      });
      const contexts = orchestrator.getContexts();
      expect(contexts).toEqual(["github-control-plane"]);
    });

    it("throws error for invalid context", () => {
      const orchestrator = new MetricsCollectionOrchestrator({
        context: "invalid",
      });
      expect(() => orchestrator.getContexts()).toThrow(/Unknown context/);
    });
  });

  describe("validateSetup", () => {
    it("validates metrics agent exists", () => {
      const orchestrator = new MetricsCollectionOrchestrator();
      fs.existsSync.mockImplementation((path) => {
        if (path.includes("metrics-agent.js")) return false;
        return true;
      });

      expect(() => orchestrator.validateSetup()).toThrow(
        /Metrics agent not found/,
      );
    });

    it("validates config directory exists", () => {
      const orchestrator = new MetricsCollectionOrchestrator();
      fs.existsSync.mockImplementation((path) => {
        if (path.includes("config")) return false;
        return true;
      });

      expect(() => orchestrator.validateSetup()).toThrow(
        /Config directory not found/,
      );
    });

    it("passes validation when both paths exist", () => {
      const orchestrator = new MetricsCollectionOrchestrator();
      fs.existsSync.mockReturnValue(true);
      expect(() => orchestrator.validateSetup()).not.toThrow();
    });
  });

  describe("ensureOutputDir", () => {
    it("creates output directory if it does not exist", () => {
      fs.existsSync.mockReturnValueOnce(false);
      const orchestrator = new MetricsCollectionOrchestrator();
      orchestrator.ensureOutputDir();
      expect(fs.mkdirSync).toHaveBeenCalledWith(orchestrator.outputDir, {
        recursive: true,
      });
    });

    it("does not create directory if it already exists", () => {
      fs.existsSync.mockReturnValueOnce(true);
      const orchestrator = new MetricsCollectionOrchestrator();
      orchestrator.ensureOutputDir();
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe("collectMetrics", () => {
    it("collects metrics for valid context", async () => {
      fs.existsSync.mockReturnValue(true);
      execSync.mockReturnValue("Report saved to: /path/to/report.json");

      const orchestrator = new MetricsCollectionOrchestrator();
      await orchestrator.collectMetrics("github-control-plane");

      expect(execSync).toHaveBeenCalled();
      expect(orchestrator.results.contexts["github-control-plane"]).toEqual(
        expect.objectContaining({
          status: "success",
          reportFile: "/path/to/report.json",
        }),
      );
      expect(orchestrator.results.summary.successful).toBe(1);
    });

    it("handles dry run mode", async () => {
      const orchestrator = new MetricsCollectionOrchestrator({ dry: true });
      await orchestrator.collectMetrics("github-control-plane");

      expect(execSync).not.toHaveBeenCalled();
      expect(orchestrator.results.contexts["github-control-plane"].status).toBe(
        "dry-run",
      );
      expect(orchestrator.results.summary.successful).toBe(1);
    });

    it("handles missing config file", async () => {
      fs.existsSync.mockReturnValueOnce(false); // config file does not exist
      const orchestrator = new MetricsCollectionOrchestrator();
      await orchestrator.collectMetrics("github-control-plane");

      expect(orchestrator.results.contexts["github-control-plane"].status).toBe(
        "failed",
      );
      expect(orchestrator.results.summary.failed).toBe(1);
    });

    it("handles execution errors", async () => {
      fs.existsSync.mockReturnValue(true);
      execSync.mockImplementation(() => {
        throw new Error("Command failed");
      });

      const orchestrator = new MetricsCollectionOrchestrator();
      await orchestrator.collectMetrics("github-control-plane");

      expect(orchestrator.results.contexts["github-control-plane"].status).toBe(
        "failed",
      );
      expect(orchestrator.results.contexts["github-control-plane"].error).toBe(
        "Command failed",
      );
      expect(orchestrator.results.summary.failed).toBe(1);
    });

    it("increments total count", async () => {
      fs.existsSync.mockReturnValue(true);
      execSync.mockReturnValue("Report saved to: /path/to/report.json");

      const orchestrator = new MetricsCollectionOrchestrator();
      await orchestrator.collectMetrics("github-control-plane");

      expect(orchestrator.results.summary.total).toBe(1);
    });
  });

  describe("collect", () => {
    it("collects metrics for all contexts", async () => {
      fs.existsSync.mockReturnValue(true);
      execSync.mockReturnValue("Report saved to: /path/to/report.json");

      const orchestrator = new MetricsCollectionOrchestrator({
        context: "all",
      });
      await orchestrator.collect();

      expect(execSync).toHaveBeenCalledTimes(3);
      expect(orchestrator.results.summary.total).toBe(3);
      expect(orchestrator.results.summary.successful).toBe(3);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it("collects metrics for single context", async () => {
      fs.existsSync.mockReturnValue(true);
      execSync.mockReturnValue("Report saved to: /path/to/report.json");

      const orchestrator = new MetricsCollectionOrchestrator({
        context: "github-control-plane",
      });
      await orchestrator.collect();

      expect(execSync).toHaveBeenCalledTimes(1);
      expect(orchestrator.results.summary.total).toBe(1);
      expect(orchestrator.results.summary.successful).toBe(1);
    });

    it("writes results to file", async () => {
      fs.existsSync.mockReturnValue(true);
      execSync.mockReturnValue("Report saved to: /path/to/report.json");

      const orchestrator = new MetricsCollectionOrchestrator({
        context: "github-control-plane",
      });
      await orchestrator.collect();

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining("collection-"),
        expect.stringContaining('"timestamp"'),
      );
    });

    it("sets GitHub Actions output when env var is set", async () => {
      fs.existsSync.mockReturnValue(true);
      execSync.mockReturnValue("Report saved to: /path/to/report.json");
      process.env.GITHUB_OUTPUT = "/tmp/github-output";

      const orchestrator = new MetricsCollectionOrchestrator({
        context: "github-control-plane",
      });
      await orchestrator.collect();

      expect(fs.appendFileSync).toHaveBeenCalledWith(
        "/tmp/github-output",
        expect.stringMatching(/collection_timestamp=/),
      );
      expect(fs.appendFileSync).toHaveBeenCalledWith(
        "/tmp/github-output",
        expect.stringMatching(/results_file=/),
      );
    });

    it("exits with error when collection fails", async () => {
      fs.existsSync.mockReturnValue(true);
      execSync.mockImplementation(() => {
        throw new Error("Collection failed");
      });

      const orchestrator = new MetricsCollectionOrchestrator({
        context: "github-control-plane",
      });

      jest.spyOn(process, "exit").mockImplementation(() => {});
      await orchestrator.collect();

      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("validates setup before collection", async () => {
      fs.existsSync.mockReturnValueOnce(false);

      const orchestrator = new MetricsCollectionOrchestrator();
      jest.spyOn(process, "exit").mockImplementation(() => {});

      await orchestrator.collect();

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe("log", () => {
    it("logs messages with appropriate prefix", () => {
      jest.spyOn(console, "log").mockImplementation();
      const orchestrator = new MetricsCollectionOrchestrator({ verbose: true });

      orchestrator.log("test message", "info");
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("test message"),
      );
    });

    it("respects verbose flag", () => {
      jest.spyOn(console, "log").mockImplementation();
      const orchestrator = new MetricsCollectionOrchestrator({
        verbose: false,
      });

      orchestrator.log("debug message", "debug");
      expect(console.log).not.toHaveBeenCalled();

      orchestrator.log("info message", "info");
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe("getTimestamp", () => {
    it("returns ISO date string", () => {
      const orchestrator = new MetricsCollectionOrchestrator();
      const timestamp = orchestrator.getTimestamp();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
