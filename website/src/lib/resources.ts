// Resource utilities for the Awesome GitHub website

export const REPO_INFO = {
  owner: "lightspeedwp",
  repo: ".github",
  branches: {
    default: "develop",
    stable: "main",
  },
};

export type ResourceAction = "copy" | "download" | "github" | "vscode";
export type ResourceType =
  | "agents"
  | "instructions"
  | "skills"
  | "cookbook"
  | "learn"
  | "hooks"
  | "workflows"
  | "prompts"
  | "tools";

export interface ResourceFrontmatter {
  title: string;
  description: string;
  [key: string]: unknown;
}

export interface Resource {
  slug: string;
  title: string;
  description: string;
  frontmatter: ResourceFrontmatter;
  content?: string;
}

export interface ResourceTypeInfo {
  type: string;
  label: string;
  icon: string;
  description: string;
}

// Available resource types with metadata
// Icons are Phosphor icon names (https://github.com/phosphor-icons/web)
const RESOURCE_TYPES: Record<string, ResourceTypeInfo> = {
  agents: {
    type: "agents",
    label: "Agents",
    icon: "robot",
    description: "AI agent specifications and configurations",
  },
  instructions: {
    type: "instructions",
    label: "Instructions",
    icon: "clipboard",
    description: "Organization-wide instructions and standards",
  },
  skills: {
    type: "skills",
    label: "Skills",
    icon: "lightning-bold",
    description: "Self-contained reusable skills",
  },
  cookbook: {
    type: "cookbook",
    label: "Cookbook",
    icon: "chef-hat",
    description: "Recipes, playbooks, and implementation guides",
  },
  learn: {
    type: "learn",
    label: "Learning Centre",
    icon: "book",
    description: "Learning tracks and courses",
  },
  hooks: {
    type: "hooks",
    label: "Hooks",
    icon: "hook",
    description: "Portable hooks and guardrails",
  },
  workflows: {
    type: "workflows",
    label: "Workflows",
    icon: "gear",
    description: "Portable agentic workflows",
  },
  prompts: {
    type: "prompts",
    label: "Prompts",
    icon: "chat-circle",
    description: "Prompt library and templates",
  },
  tools: {
    type: "tools",
    label: "Tools",
    icon: "wrench",
    description: "Utility scripts and tools",
  },
};

/**
 * Get all available resource types
 */
export function getAvailableResourceTypes(): ResourceTypeInfo[] {
  return Object.values(RESOURCE_TYPES);
}

/**
 * Get a specific resource by type and slug
 * Note: This is a stub implementation. In production, this would load from content collections.
 */
export function getResource(_type: string, _slug: string): Resource | null {
  // Stub implementation - returns null for now
  // In production, this would load from Astro content collections
  return null;
}

/**
 * Get all resources of a specific type
 * Note: This is a stub implementation. In production, this would load from content collections.
 */
export function getResourcesByType(_type: string): Resource[] {
  // Stub implementation - returns empty array for now
  // In production, this would load from Astro content collections
  return [];
}

/**
 * Generate GitHub URLs for a resource with branch switching support
 */
export function generateResourceUrl(
  path: string,
  file: string,
  action: ResourceAction,
  branch: "main" | "develop" = "develop",
): string {
  const baseUrl = "https://github.com";
  const rawUrl = "https://raw.githubusercontent.com";
  const repoPath = `${REPO_INFO.owner}/${REPO_INFO.repo}`;
  const filePath = `${path}/${file}`;

  switch (action) {
    case "github":
      return `${baseUrl}/${repoPath}/blob/${branch}/${filePath}`;

    case "copy":
      return `${rawUrl}/${repoPath}/${branch}/${filePath}`;

    case "download":
      return `${rawUrl}/${repoPath}/${branch}/${filePath}`;

    case "vscode": {
      const rawFileUrl = encodeURIComponent(
        `${rawUrl}/${repoPath}/${branch}/${filePath}`,
      );
      return `vscode:github/install?url=${rawFileUrl}`;
    }

    default:
      return "";
  }
}

/**
 * Get available actions for a resource type
 */
export function getAvailableActions(type: string): ResourceAction[] {
  const actionMap: Record<string, ResourceAction[]> = {
    agents: ["copy", "download", "github", "vscode"],
    instructions: ["copy", "download", "github"],
    skills: ["copy", "download", "github", "vscode"],
    cookbook: ["copy", "download", "github"],
    learn: [],
    hooks: ["copy", "download", "github"],
    workflows: ["copy", "github"],
    prompts: ["copy", "github"],
    tools: ["copy", "download", "github"],
  };

  return actionMap[type] || [];
}

/**
 * Format difficulty level for display
 */
export function formatDifficulty(difficulty?: string): string {
  if (!difficulty) return "";
  const colors: Record<string, string> = {
    Beginner: "text-green-600",
    Intermediate: "text-yellow-600",
    Advanced: "text-red-600",
  };
  return colors[difficulty] || "";
}

/**
 * Format estimated read time
 */
export function formatReadTime(minutes?: number): string {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.ceil(minutes / 60);
  return `${hours}h`;
}

/**
 * Sort resources by a field
 */
export function sortResources<
  T extends {
    data?: Record<string, unknown>;
    frontmatter?: Record<string, unknown>;
  },
>(resources: T[], sortBy: "title" | "date" | "difficulty" = "title"): T[] {
  return [...resources].sort((a, b) => {
    const dataA = a.data || a.frontmatter || {};
    const dataB = b.data || b.frontmatter || {};

    switch (sortBy) {
      case "title":
        return (dataA.title || "").localeCompare(dataB.title || "");
      case "date": {
        const dateA = new Date(dataA.last_updated || 0).getTime();
        const dateB = new Date(dataB.last_updated || 0).getTime();
        return dateB - dateA;
      }
      case "difficulty": {
        const diffOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 };
        return (
          (diffOrder[dataA.difficulty] ?? 99) -
          (diffOrder[dataB.difficulty] ?? 99)
        );
      }
      default:
        return 0;
    }
  });
}

/**
 * Filter resources by tags and category
 */
export function filterResources<
  T extends {
    data?: Record<string, unknown>;
    frontmatter?: Record<string, unknown>;
  },
>(
  resources: T[],
  options: {
    tags?: string[];
    category?: string;
    difficulty?: string;
    search?: string;
  } = {},
): T[] {
  return resources.filter((resource) => {
    const { tags = [], category, difficulty, search } = options;
    const data = resource.data || resource.frontmatter || {};

    // Filter by tags
    if (tags.length > 0) {
      const resourceTags = data.tags || [];
      const hasTag = tags.some((tag) => resourceTags.includes(tag));
      if (!hasTag) return false;
    }

    // Filter by category
    if (category && data.category !== category) {
      return false;
    }

    // Filter by difficulty
    if (difficulty && data.difficulty !== difficulty) {
      return false;
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesTitle = data.title?.toLowerCase().includes(searchLower);
      const matchesDesc = data.description?.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDesc) return false;
    }

    return true;
  });
}
