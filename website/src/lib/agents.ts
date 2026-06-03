export interface Agent {
  slug: string;
  name: string;
  description: string;
  overview: string;
  capabilities: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  relatedAgents: string[];
  relatedSlides: number[];
  integrations: string[];
  useCases: string[];
}

export const agents: Agent[] = [
  {
    slug: "release",
    name: "Release Agent",
    description:
      "Automates versioning, changelog generation, and release workflows with semantic versioning discipline.",
    overview:
      "The Release Agent orchestrates versioning, changelog management, and release pipeline management across the repository ecosystem. It enforces semantic versioning, maintains documentation, and manages multi-platform artifact generation.",
    capabilities: [
      "Semantic Versioning (SemVer patch/minor/major)",
      "Changelog Automation (Keep-a-Changelog format)",
      "Release Validation (CI green, tests passing, docs current)",
      "Multi-Platform Artifacts (npm, GitHub Releases, plugin mirrors)",
      "Release Notes Generation",
      "Version Rollback Guards (prevent invalid progressions)",
    ],
    difficulty: "Intermediate",
    relatedAgents: ["planner", "reviewer", "meta"],
    relatedSlides: [13, 16],
    integrations: ["Planner Agent", "Reviewer Agent", "CI/CD Pipelines"],
    useCases: [
      "Feature releases with changelog validation",
      "Hotfix releases with expedited validation",
      "Security releases with coordinated disclosure",
      "Multi-platform artifact distribution",
    ],
  },
  {
    slug: "branding",
    name: "Branding Agent",
    description:
      "Manages brand identity, messaging consistency, and communication standards across repositories.",
    overview:
      "The Branding Agent ensures consistent voice, tone, and messaging across all repositories and communications. It validates brand compliance in documentation, release notes, and public-facing content.",
    capabilities: [
      "Brand Voice Enforcement (tone, terminology, style guide)",
      "Messaging Template Management",
      "Visual Identity Validation",
      "Release Notes Formatting",
      "Documentation Consistency Checks",
      "Cross-platform Messaging Alignment",
    ],
    difficulty: "Beginner",
    relatedAgents: ["release", "meta"],
    relatedSlides: [13, 18],
    integrations: ["Release Agent", "PR Templates", "Documentation"],
    useCases: [
      "Validate release notes for brand voice",
      "Enforce terminology across docs",
      "Align messaging for product launches",
      "Manage communication templates",
    ],
  },
  {
    slug: "meta",
    name: "Meta Agent",
    description:
      "Coordinates repository metadata, governance tracking, and system observability across the ecosystem.",
    overview:
      "The Meta Agent manages repository metadata, tracks governance metrics, and coordinates observability across the entire system. It maintains the source of truth for repository ownership, status, and compliance.",
    capabilities: [
      "Repository Metadata Management",
      "Ownership Tracking and Escalation",
      "Governance Metrics Collection",
      "Compliance Status Reporting",
      "Cross-repository Correlation",
      "Health Dashboard Integration",
    ],
    difficulty: "Advanced",
    relatedAgents: ["release", "reviewer", "planner"],
    relatedSlides: [13, 10],
    integrations: ["All Agents", "Metrics System", "Dashboards"],
    useCases: [
      "Track repository ownership and health",
      "Generate compliance reports",
      "Coordinate cross-team metrics",
      "Alert on governance drift",
    ],
  },
  {
    slug: "linting",
    name: "Linting Agent",
    description:
      "Enforces code quality standards, runs linting checks, and automates code formatting across the organization.",
    overview:
      "The Linting Agent ensures code quality through automated linting, formatting, and style validation. It runs checks on every PR and enforces organization-wide coding standards.",
    capabilities: [
      "Multi-language Linting (JavaScript, TypeScript, Python, etc.)",
      "Automated Code Formatting",
      "Style Guide Enforcement",
      "Pre-commit Hook Management",
      "Custom Rule Definition",
      "Performance & Security Linting",
    ],
    difficulty: "Intermediate",
    relatedAgents: ["reviewer", "release"],
    relatedSlides: [13, 9],
    integrations: ["CI/CD Pipeline", "PR Comments", "Pre-commit Hooks"],
    useCases: [
      "Validate code style on every PR",
      "Auto-fix formatting issues",
      "Enforce security best practices",
      "Maintain consistent code quality",
    ],
  },
  {
    slug: "labeling",
    name: "Labelling Agent",
    description:
      "Automates issue and PR labeling using AI-driven categorization and governance rules.",
    overview:
      "The Labelling Agent intelligently categorizes issues and PRs using AI analysis and governance rules. It reduces manual labeling overhead and improves routing, triage, and metrics accuracy.",
    capabilities: [
      "AI-Driven Auto-Labeling",
      "Governance Rule Enforcement",
      "One-hot Label Validation",
      "Label Suggestion from Content",
      "Routing & Triage Automation",
      "Metrics Aggregation from Labels",
    ],
    difficulty: "Intermediate",
    relatedAgents: ["reviewer", "planner", "meta"],
    relatedSlides: [13, 5, 17],
    integrations: ["Issue Templates", "PR Templates", "Triage Workflows"],
    useCases: [
      "Auto-label issues based on content",
      "Enforce label taxonomy",
      "Route issues to correct teams",
      "Improve triage efficiency",
    ],
  },
  {
    slug: "planner",
    name: "Planner Agent",
    description:
      "Manages project planning, milestone coordination, and release roadmap across teams and repositories.",
    overview:
      "The Planner Agent coordinates project planning, milestone definitions, and release roadmaps across the organization. It tracks dependencies, prioritizes work, and maintains visibility into project progress.",
    capabilities: [
      "Milestone Planning & Coordination",
      "Roadmap Management",
      "Dependency Tracking",
      "Release Window Definition",
      "Work Prioritization",
      "Progress Visibility & Reporting",
    ],
    difficulty: "Advanced",
    relatedAgents: ["release", "meta", "reviewer"],
    relatedSlides: [13, 12],
    integrations: ["Release Agent", "GitHub Projects", "Metrics"],
    useCases: [
      "Define release milestones",
      "Coordinate multi-team releases",
      "Track dependency chains",
      "Report progress to stakeholders",
    ],
  },
];

export function getAgent(slug: string): Agent | undefined {
  return agents.find((a) => a.slug === slug);
}

export function getAllAgents(): Agent[] {
  return agents;
}
