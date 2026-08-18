jest.mock("octokit", () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    repos: {},
    pulls: {},
    issues: {},
    rateLimit: {
      get: jest.fn(),
    },
    plugin: jest.fn((x, y) => jest.fn()),
  })),
}));

jest.mock("@octokit/plugin-throttling", () => ({
  throttling: jest.fn(),
}));

jest.mock("@octokit/plugin-retry", () => ({
  retry: jest.fn(),
}));

const OctokitClientFactory = require("../../lib/api/octokit-client");

describe("OctokitClientFactory", () => {
  let factory;

  beforeEach(() => {
    factory = new OctokitClientFactory();
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

    test("throws if client not initialized", () => {
      expect(() => factory.getClient()).toThrow(
        "Client not initialized. Call a createWith* method first.",
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

    test("returns null if not initialized", () => {
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

  describe("client methods exist", () => {
    test("created client has expected Octokit methods", () => {
      const client = factory.createWithPAT("token");
      expect(typeof client.repos).toBe("object");
      expect(typeof client.pulls).toBe("object");
      expect(typeof client.issues).toBe("object");
    });
  });
});
