// Test fixtures for audit-label-coverage skill

const mockIssues = [
  {
    number: 1,
    title: "Fix authentication timeout",
    labels: [
      { name: "type:bug" },
      { name: "status:in-progress" },
      { name: "priority:high" },
      { name: "area:security" },
    ],
  },
  {
    number: 2,
    title: "Add two-factor authentication",
    labels: [{ name: "type:feature" }],
  },
  {
    number: 3,
    title: "Update CI pipeline",
    labels: [
      { name: "type:task" },
      { name: "status:ready" },
      { name: "area:ci" },
    ],
  },
  {
    number: 4,
    title: "Database optimization",
    labels: [
      { name: "type:improve" },
      { name: "status:in-progress" },
      { name: "priority:normal" },
      { name: "area:performance" },
      { name: "meta:needs-changelog" },
    ],
  },
  {
    number: 5,
    title: "Documentation review",
    labels: [],
  },
];

const mockCanonicalLabels = [
  { name: "type:bug", color: "9F3734", description: "Bug or defect" },
  {
    name: "type:feature",
    color: "3FB950",
    description: "Feature or enhancement",
  },
  { name: "type:task", color: "4393F8", description: "Task or to-do" },
  {
    name: "type:improve",
    color: "9198A1",
    description: "Improvement to existing behaviour",
  },
  {
    name: "status:in-progress",
    color: "1D76DB",
    description: "Work in progress",
  },
  {
    name: "status:ready",
    color: "0E8A16",
    description: "Groomed and ready to start",
  },
  {
    name: "priority:high",
    color: "D93F0B",
    description: "Must-do high priority",
  },
  { name: "priority:normal", color: "0052CC", description: "Default priority" },
  { name: "area:security", color: "810E18", description: "Security concerns" },
  { name: "area:ci", color: "BFD4F2", description: "Build and CI pipelines" },
  {
    name: "area:performance",
    color: "7E6007",
    description: "Performance optimization",
  },
  {
    name: "meta:needs-changelog",
    color: "E1E4E8",
    description: "Requires changelog",
  },
];

const mockAuditResultPartial = {
  total: 5,
  fullyLabeled: 2,
  partiallyLabeled: 2,
  unlabeled: 1,
  averageCoverage: 65,
  familyCoverage: {
    type: { labeled: 4, coverage: 80 },
    status: { labeled: 3, coverage: 60 },
    priority: { labeled: 2, coverage: 40 },
    area: { labeled: 3, coverage: 60 },
  },
  topMissingLabels: [
    { family: "priority", count: 3, percentage: 60 },
    { family: "status", count: 2, percentage: 40 },
    { family: "area", count: 2, percentage: 40 },
  ],
  topSuggestedLabels: [
    { label: "status:needs-triage", count: 3 },
    { label: "priority:normal", count: 3 },
    { label: "area:ci", count: 2 },
  ],
  issues: [
    {
      number: 1,
      title: "Fix authentication timeout",
      coverage: 100,
      missing: {},
      suggestions: [],
      labels: {
        type: ["type:bug"],
        status: ["status:in-progress"],
        priority: ["priority:high"],
        area: ["area:security"],
      },
    },
    {
      number: 2,
      title: "Add two-factor authentication",
      coverage: 25,
      missing: { status: true, priority: true, area: true },
      suggestions: ["status:*", "priority:*", "area:*"],
      labels: { type: ["type:feature"] },
    },
    {
      number: 3,
      title: "Update CI pipeline",
      coverage: 75,
      missing: { priority: true },
      suggestions: ["priority:*"],
      labels: {
        type: ["type:task"],
        status: ["status:ready"],
        area: ["area:ci"],
      },
    },
    {
      number: 4,
      title: "Database optimization",
      coverage: 100,
      missing: {},
      suggestions: [],
      labels: {
        type: ["type:improve"],
        status: ["status:in-progress"],
        priority: ["priority:normal"],
        area: ["area:performance"],
      },
    },
    {
      number: 5,
      title: "Documentation review",
      coverage: 0,
      missing: { type: true, status: true, priority: true, area: true },
      suggestions: ["type:*", "status:*", "priority:*", "area:*"],
      labels: {},
    },
  ],
};

module.exports = {
  mockIssues,
  mockCanonicalLabels,
  mockAuditResultPartial,
};
