jest.mock("octokit", () => {
  const mockInstance = {
    repos: {},
    pulls: {},
    issues: {},
    rateLimit: {
      get: jest.fn(),
    },
  };
  const MockOctokit = jest.fn().mockImplementation(() => mockInstance);
  MockOctokit.plugin = jest.fn().mockReturnValue(MockOctokit);
  return { Octokit: MockOctokit };
});

jest.mock(
  "@octokit/plugin-throttling",
  () => ({
    throttling: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  "@octokit/plugin-retry",
  () => ({
    retry: jest.fn(),
  }),
  { virtual: true },
);

const { Octokit } = require("octokit");
const OctokitClientFactory = require("../../lib/api/octokit-client");

describe("OctokitClientFactory", () => {
  let factory;

  beforeEach(() => {
    factory = new OctokitClientFactory();
    Octokit.plugin = jest.fn(() => jest.fn());
  });

  describe("constructor", () => {
    test("initializes with default config", () => {
      const f = new OctokitClientFactory();
      expect(f.config.baseUrl).toBe("https://api.github.com");
      expect(f.config.timeout).toBe(15000);
      expect(f.client).toBe(null);
      expect(f.authType).toBe(null);
    });

    test("accepts custom config", () => {
      const customConfig = {
        baseUrl: "https://github.enterprise.com/api/v3",
        timeout: 30000,
        userAgent: "custom-agent",
      };
      const f = new OctokitClientFactory(customConfig);
      expect(f.config.baseUrl).toBe("https://github.enterprise.com/api/v3");
      expect(f.config.timeout).toBe(30000);
      expect(f.config.userAgent).toBe("custom-agent");
    });
  });

  describe("createWithPAT", () => {
    test("creates client with valid PAT token", () => {
      const client = factory.createWithPAT("ghp_valid_token_123");
      expect(client).toBeDefined();
      expect(factory.authType).toBe("PAT");
      expect(factory.client).toBe(client);
    });

    test("throws on empty token", () => {
      expect(() => factory.createWithPAT("")).toThrow(
        "PAT token must be a non-empty string",
      );
    });

    test("throws on null token", () => {
      expect(() => factory.createWithPAT(null)).toThrow(
        "PAT token must be a non-empty string",
      );
    });

    test("throws on non-string token", () => {
      expect(() => factory.createWithPAT(12345)).toThrow(
        "PAT token must be a non-empty string",
      );
    });
  });

  describe("createWithOAuth", () => {
    test("creates client with valid OAuth token", () => {
      const client = factory.createWithOAuth("ghu_valid_oauth_token_123");
      expect(client).toBeDefined();
      expect(factory.authType).toBe("OAuth");
      expect(factory.client).toBe(client);
    });

    test("throws on empty token", () => {
      expect(() => factory.createWithOAuth("")).toThrow(
        "OAuth token must be a non-empty string",
      );
    });

    test("throws on null token", () => {
      expect(() => factory.createWithOAuth(null)).toThrow(
        "OAuth token must be a non-empty string",
      );
    });

    test("throws on non-string token", () => {
      expect(() => factory.createWithOAuth({ token: "test" })).toThrow(
        "OAuth token must be a non-empty string",
      );
    });
  });

  describe("createWithAppAuth", () => {
    const validAppCreds = {
      appId: 12345,
      privateKey: "valid_key_pem_format",
    };

    test("creates client with valid app credentials", () => {
      const client = factory.createWithAppAuth(validAppCreds);
      expect(client).toBeDefined();
      expect(factory.authType).toBe("AppAuth");
    });

    test("creates client with installation ID", () => {
      const credsWithInstallation = {
        ...validAppCreds,
        installationId: 67890,
      };
      const client = factory.createWithAppAuth(credsWithInstallation);
      expect(client).toBeDefined();
      expect(factory.authType).toBe("AppAuth");
    });

    test("throws on missing appId", () => {
      expect(() => {
        factory.createWithAppAuth({ privateKey: "key" });
      }).toThrow("AppAuth requires appId and privateKey");
    });

    test("throws on missing privateKey", () => {
      expect(() => {
        factory.createWithAppAuth({ appId: 123 });
      }).toThrow("AppAuth requires appId and privateKey");
    });

    test("throws on empty credentials", () => {
      expect(() => factory.createWithAppAuth({})).toThrow(
        "AppAuth requires appId and privateKey",
      );
    });
  });

  describe("createUnauthenticated", () => {
    test("creates unauthenticated client", () => {
      const client = factory.createUnauthenticated();
      expect(client).toBeDefined();
      expect(factory.authType).toBe("Unauthenticated");
    });
  });

  describe("getClient", () => {
    test("returns the current client", () => {
      const client = factory.createWithPAT("token");
      expect(factory.getClient()).toBe(client);
    });

    test("throws if client not initialised", () => {
      expect(() => factory.getClient()).toThrow(
        "Client not initialised. Call a createWith* method first.",
      );
    });
  });

  describe("getAuthType", () => {
    test("returns PAT auth type", () => {
      factory.createWithPAT("token");
      expect(factory.getAuthType()).toBe("PAT");
    });

    test("returns OAuth auth type", () => {
      factory.createWithOAuth("token");
      expect(factory.getAuthType()).toBe("OAuth");
    });

    test("returns AppAuth auth type", () => {
      factory.createWithAppAuth({
        appId: 123,
        privateKey: "key",
      });
      expect(factory.getAuthType()).toBe("AppAuth");
    });

    test("returns Unauthenticated type", () => {
      factory.createUnauthenticated();
      expect(factory.getAuthType()).toBe("Unauthenticated");
    });

    test("returns null if not initialised", () => {
      expect(factory.getAuthType()).toBe(null);
    });
  });

  describe("multiple clients", () => {
    test("can create multiple factory instances", () => {
      const factory1 = new OctokitClientFactory();
      const factory2 = new OctokitClientFactory();

      factory1.createWithPAT("token1");
      factory2.createWithOAuth("token2");

      expect(factory1.getAuthType()).toBe("PAT");
      expect(factory2.getAuthType()).toBe("OAuth");
    });

    test("can switch auth types on same factory", () => {
      factory.createWithPAT("token");
      expect(factory.getAuthType()).toBe("PAT");

      factory.createWithOAuth("oauth");
      expect(factory.getAuthType()).toBe("OAuth");

      factory.createUnauthenticated();
      expect(factory.getAuthType()).toBe("Unauthenticated");
    });
  });

  describe("configuration", () => {
    test("custom baseUrl is applied", () => {
      const customFactory = new OctokitClientFactory({
        baseUrl: "https://my.github.enterprise.com/api/v3",
      });
      expect(customFactory.config.baseUrl).toBe(
        "https://my.github.enterprise.com/api/v3",
      );
    });

    test("custom userAgent is applied", () => {
      const customFactory = new OctokitClientFactory({
        userAgent: "MyCustomAgent/1.0",
      });
      expect(customFactory.config.userAgent).toBe("MyCustomAgent/1.0");
    });

    test("custom timeout is applied", () => {
      const customFactory = new OctokitClientFactory({ timeout: 45000 });
      expect(customFactory.config.timeout).toBe(45000);
    });
  });

  describe("throttle callbacks", () => {
    test("onRateLimit logs and returns true", () => {
      factory.createWithPAT("token");
      // Grab the options passed to the MockOctokit constructor
      const ctorCalls = Octokit.mock.calls;
      const lastConfig = ctorCalls[ctorCalls.length - 1][0];
      const fakeOctokit = { log: { warn: jest.fn() } };

      const result = lastConfig.throttle.onRateLimit(
        60,
        { method: "GET", url: "/repos" },
        fakeOctokit,
      );

      expect(result).toBe(true);
      expect(fakeOctokit.log.warn).toHaveBeenCalledWith(
        expect.stringContaining("Rate limit hit"),
      );
    });

    test("onAbuseLimit logs and returns true", () => {
      factory.createWithPAT("token");
      const ctorCalls = Octokit.mock.calls;
      const lastConfig = ctorCalls[ctorCalls.length - 1][0];
      const fakeOctokit = { log: { warn: jest.fn() } };

      const result = lastConfig.throttle.onAbuseLimit(
        120,
        { method: "POST", url: "/issues" },
        fakeOctokit,
      );

      expect(result).toBe(true);
      expect(fakeOctokit.log.warn).toHaveBeenCalledWith(
        expect.stringContaining("Abuse limit hit"),
      );
    });
  });

  describe("client methods exist", () => {
    test("created client has expected Octokit methods", () => {
      const client = factory.createWithPAT("token");
      expect(typeof client.repos).toBe("object");
      expect(typeof client.pulls).toBe("object");
      expect(typeof client.issues).toBe("object");
    });
  });

  describe("getRateLimit", () => {
    const mockRateData = {
      limit: 5000,
      remaining: 4000,
      reset: Math.floor(Date.now() / 1000) + 3600,
    };

    test("returns rate limit data", async () => {
      factory.createWithPAT("token");
      factory.client.rateLimit.get.mockResolvedValue({
        data: { rate_limit: mockRateData },
      });

      const rateLimit = await factory.getRateLimit();
      expect(rateLimit.remaining).toBe(4000);
      expect(rateLimit.limit).toBe(5000);
    });

    test("throws when client not initialised", async () => {
      await expect(factory.getRateLimit()).rejects.toThrow(
        "Client not initialised",
      );
    });

    test("wraps API error with descriptive message", async () => {
      factory.createWithPAT("token");
      factory.client.rateLimit.get.mockRejectedValue(new Error("API error"));

      await expect(factory.getRateLimit()).rejects.toThrow(
        "Failed to get rate limit",
      );
    });
  });

  describe("isApproachingRateLimit", () => {
    test("returns true when below threshold", async () => {
      factory.createWithPAT("token");
      factory.client.rateLimit.get.mockResolvedValue({
        data: {
          rate_limit: { limit: 5000, remaining: 500, reset: 9999999999 },
        },
      });

      const result = await factory.isApproachingRateLimit(15);
      expect(result).toBe(true);
    });

    test("returns false when above threshold", async () => {
      factory.createWithPAT("token");
      factory.client.rateLimit.get.mockResolvedValue({
        data: {
          rate_limit: { limit: 5000, remaining: 4900, reset: 9999999999 },
        },
      });

      const result = await factory.isApproachingRateLimit(15);
      expect(result).toBe(false);
    });
  });

  describe("getTimeUntilReset", () => {
    test("returns milliseconds until reset", async () => {
      const futureReset = Math.floor(Date.now() / 1000) + 3600;
      factory.createWithPAT("token");
      factory.client.rateLimit.get.mockResolvedValue({
        data: {
          rate_limit: { limit: 5000, remaining: 4000, reset: futureReset },
        },
      });

      const ms = await factory.getTimeUntilReset();
      expect(ms).toBeGreaterThan(0);
      expect(ms).toBeLessThanOrEqual(3600 * 1000 + 100);
    });

    test("returns 0 if reset is in the past", async () => {
      factory.createWithPAT("token");
      factory.client.rateLimit.get.mockResolvedValue({
        data: {
          rate_limit: { limit: 5000, remaining: 0, reset: 1 },
        },
      });

      const ms = await factory.getTimeUntilReset();
      expect(ms).toBe(0);
    });
  });
});
