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
  {
    slug: "ai-readiness-estimator",
    name: "AI Readiness Estimator Agent",
    description:
      "Assesses organisational and technical readiness for AI implementation across projects.",
    overview:
      "The AI Readiness Estimator Agent conducts comprehensive assessments of organisational AI readiness, evaluating technical infrastructure, team capabilities, data maturity, and governance frameworks to guide AI adoption strategies.",
    capabilities: [
      "Technical Infrastructure Assessment",
      "Data Maturity Evaluation",
      "Team Capability Analysis",
      "Governance Framework Review",
      "Risk Identification & Mitigation",
      "Implementation Roadmap Generation",
    ],
    difficulty: "Advanced",
    relatedAgents: ["meta", "planner"],
    relatedSlides: [19, 20],
    integrations: ["Assessment Tools", "GitHub Projects", "Metrics"],
    useCases: [
      "Evaluate AI implementation readiness",
      "Identify capability gaps",
      "Plan AI adoption strategy",
      "Track maturity improvements",
    ],
  },
  {
    slug: "website-scope-estimator",
    name: "Website Scope Estimator Agent",
    description:
      "Estimates project scope, timeline, and resource requirements for website projects.",
    overview:
      "The Website Scope Estimator Agent analyses website project requirements and delivers accurate scope estimates, timeline projections, and resource allocations based on complexity analysis and historical data.",
    capabilities: [
      "Project Complexity Analysis",
      "Scope Estimation",
      "Timeline Forecasting",
      "Resource Planning",
      "Risk Assessment",
      "Budget Estimation",
    ],
    difficulty: "Intermediate",
    relatedAgents: ["planner", "proposal-desk"],
    relatedSlides: [21, 22],
    integrations: [
      "Project Management Tools",
      "Resource Tracking",
      "Analytics",
    ],
    useCases: [
      "Estimate website project scope",
      "Generate project timelines",
      "Allocate resources efficiently",
      "Support proposal accuracy",
    ],
  },
  {
    slug: "playwright-testing",
    name: "Playwright Testing Agent",
    description:
      "Automates browser testing, visual regression detection, and cross-browser validation using Playwright.",
    overview:
      "The Playwright Testing Agent provides comprehensive test automation across multiple browsers and platforms. It supports multi-provider configurations (Claude, Copilot, OpenAI) and enables organisations to maintain high-quality web applications with reliable automated testing.",
    capabilities: [
      "Multi-browser Testing",
      "Visual Regression Detection",
      "Cross-platform Validation",
      "Performance Testing",
      "Accessibility Testing",
      "Test Report Generation",
    ],
    difficulty: "Intermediate",
    relatedAgents: ["reviewer", "linting"],
    relatedSlides: [9, 23],
    integrations: ["Playwright Framework", "CI/CD Pipeline", "Reporting Tools"],
    useCases: [
      "Automate browser testing workflows",
      "Detect visual regressions",
      "Validate cross-browser compatibility",
      "Generate test reports",
    ],
  },
  {
    slug: "zendesk-support",
    name: "Zendesk Support Agent",
    description:
      "Integrates with Zendesk for support ticket management, customer issue resolution, and knowledge base maintenance.",
    overview:
      "The Zendesk Support Agent streamlines customer support workflows by automating ticket routing, providing intelligent response suggestions, maintaining knowledge bases, and tracking customer satisfaction metrics across support channels.",
    capabilities: [
      "Ticket Management & Routing",
      "Intelligent Response Suggestions",
      "Knowledge Base Maintenance",
      "Customer Satisfaction Tracking",
      "Multi-channel Support",
      "Analytics & Reporting",
    ],
    difficulty: "Intermediate",
    relatedAgents: ["meta", "labeling"],
    relatedSlides: [24, 25],
    integrations: ["Zendesk API", "Slack", "Email"],
    useCases: [
      "Automate ticket routing",
      "Provide response recommendations",
      "Maintain support knowledge bases",
      "Track support metrics",
    ],
  },
  {
    slug: "design-partner",
    name: "Design Partner Agent",
    description:
      "Facilitates design collaboration, feedback collection, and design system maintenance.",
    overview:
      "The Design Partner Agent collaborates with design teams to streamline feedback collection, maintain design consistency, manage design systems, and ensure alignment between design and implementation across projects.",
    capabilities: [
      "Design Feedback Collection",
      "Design System Management",
      "Component Documentation",
      "Design-to-Code Alignment",
      "Accessibility Compliance Checks",
      "Design Versioning & History",
    ],
    difficulty: "Beginner",
    relatedAgents: ["linting", "reviewer"],
    relatedSlides: [26, 27],
    integrations: ["Figma", "Design System Tools", "Code Repository"],
    useCases: [
      "Collect and organise design feedback",
      "Maintain design consistency",
      "Bridge design and development",
      "Ensure design accessibility",
    ],
  },
  {
    slug: "prd-factory-planner",
    name: "PRD Factory & Planner Agent",
    description:
      "Generates and manages Product Requirements Documents (PRDs) with structured planning and validation.",
    overview:
      "The PRD Factory & Planner Agent automates PRD creation from product briefs, manages requirements throughout the product lifecycle, and ensures alignment across teams through structured documentation and validation workflows.",
    capabilities: [
      "PRD Generation from Briefs",
      "Requirements Structuring",
      "Feature Specification",
      "Acceptance Criteria Definition",
      "Requirement Validation",
      "Version & Change Tracking",
    ],
    difficulty: "Intermediate",
    relatedAgents: ["planner", "reviewer"],
    relatedSlides: [28, 29],
    integrations: ["Project Management", "Documentation", "Approval Workflows"],
    useCases: [
      "Generate PRDs from product briefs",
      "Define feature specifications",
      "Ensure requirements clarity",
      "Track specification changes",
    ],
  },
  {
    slug: "website-content-strategist",
    name: "Website Content Strategist Agent",
    description:
      "Develops content strategies, creates editorial calendars, and optimises website messaging.",
    overview:
      "The Website Content Strategist Agent develops comprehensive content strategies aligned with business goals, manages editorial calendars, optimises website copy for user engagement, and ensures content consistency across all digital properties.",
    capabilities: [
      "Content Strategy Development",
      "Editorial Calendar Management",
      "Copy Optimisation",
      "SEO Content Recommendations",
      "Content Performance Analysis",
      "Brand Voice Consistency",
    ],
    difficulty: "Intermediate",
    relatedAgents: ["branding", "meta"],
    relatedSlides: [30, 31],
    integrations: ["CMS", "Analytics", "SEO Tools"],
    useCases: [
      "Develop website content strategies",
      "Create editorial calendars",
      "Optimise website messaging",
      "Analyse content performance",
    ],
  },
  {
    slug: "woo-config",
    name: "WooCommerce Configuration Agent",
    description:
      "Automates WooCommerce setup, configuration, and optimisation for eCommerce sites.",
    overview:
      "The WooCommerce Configuration Agent streamlines eCommerce store setup, product management, payment integration, shipping configuration, and performance optimisation to help businesses launch and scale online stores efficiently.",
    capabilities: [
      "Store Setup & Configuration",
      "Product Catalogue Management",
      "Payment Gateway Integration",
      "Shipping Rules Configuration",
      "Tax Configuration",
      "Performance Optimisation",
    ],
    difficulty: "Intermediate",
    relatedAgents: ["wp-config", "meta"],
    relatedSlides: [32, 33],
    integrations: [
      "WooCommerce API",
      "Payment Processors",
      "Shipping Providers",
    ],
    useCases: [
      "Configure eCommerce stores",
      "Manage product catalogues",
      "Optimise checkout flows",
      "Streamline order processing",
    ],
  },
  {
    slug: "wp-config",
    name: "WordPress Configuration Agent",
    description:
      "Manages WordPress site configuration, plugin management, and theme customisation.",
    overview:
      "The WordPress Configuration Agent automates WordPress site setup, plugin management, theme configuration, security hardening, and performance optimisation to support both content management and custom development workflows.",
    capabilities: [
      "Site Setup & Configuration",
      "Plugin Management",
      "Theme Customisation",
      "Security Hardening",
      "Performance Optimisation",
      "Update Management",
    ],
    difficulty: "Intermediate",
    relatedAgents: ["woo-config", "linting"],
    relatedSlides: [34, 35],
    integrations: ["WordPress API", "Plugin Repository", "Theme System"],
    useCases: [
      "Configure WordPress sites",
      "Manage plugins and themes",
      "Harden site security",
      "Optimise site performance",
    ],
  },
  {
    slug: "tour-operator-config",
    name: "Tour Operator Configuration Agent",
    description:
      "Specialises in configuring tour and travel operator workflows, booking systems, and itinerary management.",
    overview:
      "The Tour Operator Configuration Agent provides domain-specific solutions for travel and tour companies, automating booking management, itinerary creation, customer communications, and travel-specific compliance workflows.",
    capabilities: [
      "Booking System Configuration",
      "Itinerary Management",
      "Customer Communication Automation",
      "Pricing & Availability Rules",
      "Compliance Management",
      "Report Generation",
    ],
    difficulty: "Advanced",
    relatedAgents: ["planner", "zendesk-support"],
    relatedSlides: [36, 37],
    integrations: ["Booking Systems", "CRM", "Payment Processing"],
    useCases: [
      "Configure tour booking systems",
      "Automate itinerary management",
      "Streamline customer communications",
      "Manage travel compliance",
    ],
  },
  {
    slug: "proposal-desk",
    name: "Proposal Desk Agent",
    description:
      "Automates proposal generation, template management, and contract tracking.",
    overview:
      "The Proposal Desk Agent streamlines business proposal creation by generating customised proposals from templates, automating proposal workflows, tracking proposal status, and integrating with CRM systems for improved conversion tracking.",
    capabilities: [
      "Proposal Generation",
      "Template Management",
      "Customisation & Personalisation",
      "Pricing Calculations",
      "Status Tracking",
      "Integration with CRM",
    ],
    difficulty: "Beginner",
    relatedAgents: ["website-scope-estimator", "planner"],
    relatedSlides: [38, 39],
    integrations: ["CRM Systems", "Document Storage", "Email"],
    useCases: [
      "Generate customised proposals",
      "Manage proposal templates",
      "Track proposal status",
      "Integrate with sales workflows",
    ],
  },
  {
    slug: "prd",
    name: "PRD Agent",
    description:
      "Manages product requirement documents with AI-assisted creation and validation.",
    overview:
      "The PRD Agent provides intelligent product requirement documentation, supporting teams in defining clear specifications, acceptance criteria, and success metrics to guide development and ensure alignment across stakeholders.",
    capabilities: [
      "Requirement Definition",
      "Specification Writing",
      "Acceptance Criteria Authoring",
      "Success Metrics Definition",
      "Requirement Validation",
      "Dependency Mapping",
    ],
    difficulty: "Intermediate",
    relatedAgents: ["prd-factory-planner", "reviewer"],
    relatedSlides: [28, 40],
    integrations: ["Project Management", "Documentation", "Version Control"],
    useCases: [
      "Define product requirements",
      "Write feature specifications",
      "Establish acceptance criteria",
      "Document success metrics",
    ],
  },
  {
    slug: "pagespeed",
    name: "PageSpeed Agent",
    description:
      "Monitors, analyses, and optimises website performance using PageSpeed Insights.",
    overview:
      "The PageSpeed Agent continuously monitors web application performance, identifies optimisation opportunities, recommends improvements, and tracks performance metrics to ensure users experience fast, responsive websites across all devices.",
    capabilities: [
      "Performance Monitoring",
      "Metrics Analysis",
      "Optimisation Recommendations",
      "Competitive Benchmarking",
      "Improvement Tracking",
      "Report Generation",
    ],
    difficulty: "Beginner",
    relatedAgents: ["linting", "playwright-testing"],
    relatedSlides: [41, 42],
    integrations: ["PageSpeed Insights API", "Analytics", "Monitoring Tools"],
    useCases: [
      "Monitor website performance",
      "Identify optimisation opportunities",
      "Track performance improvements",
      "Generate performance reports",
    ],
  },
  {
    slug: "harvest-analytics",
    name: "Harvest Analytical Agent",
    description:
      "Integrates with Harvest for time tracking, project analytics, and resource utilisation reporting.",
    overview:
      "The Harvest Analytical Agent extracts insights from time tracking data, provides project profitability analysis, identifies resource utilisation patterns, and generates comprehensive reports to support business intelligence and resource planning.",
    capabilities: [
      "Time Tracking Integration",
      "Project Profitability Analysis",
      "Resource Utilisation Metrics",
      "Team Productivity Insights",
      "Budget vs. Actual Tracking",
      "Custom Report Generation",
    ],
    difficulty: "Intermediate",
    relatedAgents: ["meta", "planner"],
    relatedSlides: [43, 44],
    integrations: ["Harvest API", "BI Tools", "Dashboards"],
    useCases: [
      "Analyse project profitability",
      "Track resource utilisation",
      "Identify productivity trends",
      "Generate business reports",
    ],
  },
  {
    slug: "linear-advisor",
    name: "Linear Advisor Agent",
    description:
      "Provides issue management assistance using Linear, supporting triage, prioritisation, and workflow optimisation.",
    overview:
      "The Linear Advisor Agent enhances issue management workflows by providing intelligent triage suggestions, priority recommendations, workflow optimisation, and analytics to help teams efficiently manage product development and operations work.",
    capabilities: [
      "Issue Triage Assistance",
      "Priority Recommendations",
      "Workflow Optimisation",
      "Cycle Planning Support",
      "Analytics & Insights",
      "Team Communication",
    ],
    difficulty: "Beginner",
    relatedAgents: ["labeling", "planner"],
    relatedSlides: [45, 46],
    integrations: ["Linear API", "GitHub", "Slack"],
    useCases: [
      "Assist with issue triage",
      "Provide priority recommendations",
      "Optimise development workflows",
      "Support cycle planning",
    ],
  },
  {
    slug: "client-website-discovery",
    name: "Client Website Discovery Assistant",
    description:
      "Facilitates client discovery processes and documents requirements for website projects.",
    overview:
      "The Client Website Discovery Assistant guides teams through structured discovery interviews, captures client requirements, identifies project constraints, and documents findings to establish a solid foundation for website projects.",
    capabilities: [
      "Discovery Interview Guidance",
      "Requirement Capture",
      "Constraint Identification",
      "Stakeholder Mapping",
      "Documentation Generation",
      "Recommendation Synthesis",
    ],
    difficulty: "Beginner",
    relatedAgents: ["website-scope-estimator", "prd-factory-planner"],
    relatedSlides: [47, 48],
    integrations: ["CRM", "Documentation", "Project Management"],
    useCases: [
      "Guide discovery interviews",
      "Capture project requirements",
      "Document client constraints",
      "Generate discovery reports",
    ],
  },
];

export function getAgent(slug: string): Agent | undefined {
  return agents.find((a) => a.slug === slug);
}

export function getAllAgents(): Agent[] {
  return agents;
}
