/**
 * GitHub API Mock Responses
 * Provides realistic mock data for testing GitHub API interactions
 * Used with jest.mock() to replace actual HTTP requests
 */

const issuesFixture = require("../fixtures/issues.json");
const labelsFixture = require("../fixtures/labels.json");
const milestonesFixture = require("../fixtures/milestones.json");

/**
 * Mock GitHub API responses organized by endpoint
 */
const mockResponses = {
  /**
   * POST /repos/{owner}/{repo}/issues
   * Create an issue
   */
  createIssue: {
    success: {
      number: 1234,
      html_url: "https://github.com/lightspeedwp/.github/issues/1234",
      title: "New Issue",
      body: "Issue body",
      state: "open",
      labels: [
        {
          name: "type:feature",
          color: "a2eeef",
          description: "New feature",
        },
      ],
      milestone: {
        number: 1,
        title: "Phase 2",
        state: "open",
      },
      user: {
        login: "ashleyshaw",
      },
      created_at: "2026-08-18T14:52:00Z",
      updated_at: "2026-08-18T14:52:00Z",
    },
    missingTitle: {
      message: "Validation Failed",
      errors: [
        {
          message: "Missing field: title",
          field: "title",
        },
      ],
    },
    invalidMilestone: {
      message: "Validation Failed",
      errors: [
        {
          message: "Milestone not found",
          field: "milestone",
        },
      ],
    },
  },

  /**
   * GET /repos/{owner}/{repo}/milestones
   * Fetch milestones
   */
  fetchMilestones: {
    success: milestonesFixture.milestone_list_response,
    empty: [],
    withPagination: milestonesFixture.milestone_list_response,
    serverError: {
      message: "Internal Server Error",
      documentation_url: "https://docs.github.com/rest",
    },
  },

  /**
   * POST /repos/{owner}/{repo}/issues/{issue_number}/labels
   * Add labels to an issue
   */
  addLabels: {
    success: [
      {
        name: "type:bug",
        color: "d73a49",
        description: "Bug",
      },
      {
        name: "priority:high",
        color: "ff6b6b",
        description: "High priority",
      },
    ],
    empty: [],
    invalidLabel: {
      message: "Validation Failed",
      errors: [
        {
          message: "Label not found",
          field: "labels",
        },
      ],
    },
  },

  /**
   * POST /repos/{owner}/{repo}/issues/{issue_number}/comments
   * Create a comment
   */
  createComment: {
    success: {
      id: 12345678,
      url: "https://api.github.com/repos/lightspeedwp/.github/issues/comments/12345678",
      html_url:
        "https://github.com/lightspeedwp/.github/issues/1234#issuecomment-12345678",
      body: "This is a comment",
      user: {
        login: "ashleyshaw",
        type: "User",
      },
      created_at: "2026-08-18T14:52:00Z",
      updated_at: "2026-08-18T14:52:00Z",
    },
    emptyBody: {
      message: "Validation Failed",
      errors: [
        {
          message: "Body cannot be empty",
          field: "body",
        },
      ],
    },
  },

  /**
   * Rate limit errors
   */
  rateLimitExceeded: {
    message: "API rate limit exceeded for user ID 12345.",
    documentation_url: "https://docs.github.com/rest",
  },

  /**
   * Authentication errors
   */
  unauthorized: {
    message: "Bad credentials",
    documentation_url: "https://docs.github.com/rest",
  },

  /**
   * Not found errors
   */
  notFound: {
    message: "Not Found",
    documentation_url: "https://docs.github.com/rest",
  },

  /**
   * Server errors
   */
  serverError: {
    message: "Internal Server Error",
    documentation_url: "https://docs.github.com/rest",
  },
};

/**
 * Mock https.request for testing
 * Returns a mock request object with event handlers
 */
function createMockRequest(statusCode = 200, responseBody = null) {
  return {
    on: (event, callback) => {
      if (event === "error") {
        // Store error handler for later use
        this.errorHandler = callback;
      }
    },
    write: jest.fn(),
    end: jest.fn(function () {
      // Simulate async response
      setImmediate(() => {
        const mockResponse = {
          statusCode,
          on: (event, callback) => {
            if (event === "data") {
              callback(JSON.stringify(responseBody || {}));
            }
            if (event === "end") {
              callback();
            }
          },
        };

        // Call the request callback
        if (this.callback) {
          this.callback(mockResponse);
        }
      });
    }),
  };
}

/**
 * Mock https.request for successful responses
 */
function mockSuccessRequest(responseData) {
  return jest.fn((options, callback) => {
    const mockReq = createMockRequest(200, responseData);
    mockReq.callback = callback;
    return mockReq;
  });
}

/**
 * Mock https.request for error responses
 */
function mockErrorRequest(statusCode, errorData) {
  return jest.fn((options, callback) => {
    const mockReq = createMockRequest(statusCode, errorData);
    mockReq.callback = callback;
    return mockReq;
  });
}

/**
 * Mock https.request for network errors
 */
function mockNetworkErrorRequest() {
  return jest.fn((options, callback) => {
    const mockReq = {
      on: (event, handler) => {
        if (event === "error") {
          setImmediate(() => handler(new Error("ECONNREFUSED")));
        }
      },
      write: jest.fn(),
      end: jest.fn(),
    };
    return mockReq;
  });
}

/**
 * Mock https.request for rate limit responses
 */
function mockRateLimitRequest() {
  return mockErrorRequest(403, mockResponses.rateLimitExceeded);
}

/**
 * Get fixture data by type
 */
function getFixture(type, variant = "default") {
  switch (type) {
    case "issues":
      return issuesFixture;
    case "labels":
      return labelsFixture;
    case "milestones":
      return milestonesFixture;
    default:
      throw new Error(`Unknown fixture type: ${type}`);
  }
}

/**
 * Get mock response for endpoint
 */
function getMockResponse(endpoint, scenario = "success") {
  if (!mockResponses[endpoint]) {
    throw new Error(`Unknown endpoint: ${endpoint}`);
  }
  if (!mockResponses[endpoint][scenario]) {
    throw new Error(`Unknown scenario for ${endpoint}: ${scenario}`);
  }
  return mockResponses[endpoint][scenario];
}

module.exports = {
  // Mock request creators
  createMockRequest,
  mockSuccessRequest,
  mockErrorRequest,
  mockNetworkErrorRequest,
  mockRateLimitRequest,

  // Mock responses
  mockResponses,
  getMockResponse,

  // Fixtures
  getFixture,
  issuesFixture,
  labelsFixture,
  milestonesFixture,

  // HTTP status codes for reference
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },

  // Common error messages
  ERRORS: {
    RATE_LIMIT: "API rate limit exceeded",
    UNAUTHORIZED: "Bad credentials",
    NOT_FOUND: "Not Found",
    VALIDATION: "Validation Failed",
    SERVER_ERROR: "Internal Server Error",
  },
};
