// Resource utilities for the Awesome GitHub website

export const REPO_INFO = {
  owner: 'lightspeedwp',
  repo: '.github',
  branches: {
    default: 'develop',
    stable: 'main',
  },
};

export type ResourceAction = 'copy' | 'download' | 'github' | 'vscode';
export type ResourceType = 'agents' | 'instructions' | 'skills' | 'cookbook' | 'learn' | 'hooks' | 'workflows' | 'prompts' | 'tools';

export interface ResourceMetadata {
  title: string;
  description: string;
  type: ResourceType;
  path: string;
  file: string;
  actions: ResourceAction[];
  tags?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  category?: string;
}

/**
 * Generate GitHub URLs for a resource with branch switching support
 */
export function generateResourceUrl(
  resource: ResourceMetadata,
  action: ResourceAction,
  branch: 'main' | 'develop' = 'develop'
): string {
  const baseUrl = 'https://github.com';
  const rawUrl = 'https://raw.githubusercontent.com';
  const repoPath = `${REPO_INFO.owner}/${REPO_INFO.repo}`;
  const filePath = `${resource.path}/${resource.file}`;

  switch (action) {
    case 'github':
      return `${baseUrl}/${repoPath}/blob/${branch}/${filePath}`;
    
    case 'copy':
      return `${rawUrl}/${repoPath}/${branch}/${filePath}`;
    
    case 'download':
      // Same as copy raw
      return `${rawUrl}/${repoPath}/${branch}/${filePath}`;
    
    case 'vscode':
      // VS Code custom instructions installer
      const rawFileUrl = encodeURIComponent(`${rawUrl}/${repoPath}/${branch}/${filePath}`);
      return `vscode:github/install?url=${rawFileUrl}`;
    
    default:
      return '';
  }
}

/**
 * Get available actions for a resource type
 */
export function getAvailableActions(type: ResourceType): ResourceAction[] {
  const actionMap: Record<ResourceType, ResourceAction[]> = {
    agents: ['copy', 'download', 'github', 'vscode'],
    instructions: ['copy', 'download', 'github'],
    skills: ['copy', 'download', 'github', 'vscode'],
    cookbook: ['copy', 'download', 'github'],
    learn: [],
    hooks: ['copy', 'download', 'github'],
    workflows: ['copy', 'github'],
    prompts: ['copy', 'github'],
    tools: ['copy', 'download', 'github'],
  };

  return actionMap[type] || [];
}

/**
 * Format difficulty level for display
 */
export function formatDifficulty(difficulty?: string): string {
  if (!difficulty) return '';
  const colors: Record<string, string> = {
    Beginner: 'text-green-600',
    Intermediate: 'text-yellow-600',
    Advanced: 'text-red-600',
  };
  return colors[difficulty] || '';
}

/**
 * Format estimated read time
 */
export function formatReadTime(minutes?: number): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.ceil(minutes / 60);
  return `${hours}h`;
}

/**
 * Sort resources by a field
 */
export function sortResources<T extends { data: any }>(
  resources: T[],
  sortBy: 'title' | 'date' | 'difficulty' = 'title'
): T[] {
  return [...resources].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.data.title.localeCompare(b.data.title);
      case 'date':
        const dateA = new Date(a.data.last_updated || 0).getTime();
        const dateB = new Date(b.data.last_updated || 0).getTime();
        return dateB - dateA; // newest first
      case 'difficulty':
        const diffOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 };
        return (diffOrder[a.data.difficulty] ?? 99) - (diffOrder[b.data.difficulty] ?? 99);
      default:
        return 0;
    }
  });
}

/**
 * Filter resources by tags and category
 */
export function filterResources<T extends { data: any }>(
  resources: T[],
  options: {
    tags?: string[];
    category?: string;
    difficulty?: string;
    search?: string;
  } = {}
): T[] {
  return resources.filter(resource => {
    const { tags = [], category, difficulty, search } = options;
    const data = resource.data;

    // Filter by tags
    if (tags.length > 0) {
      const resourceTags = data.tags || [];
      const hasTag = tags.some(tag => resourceTags.includes(tag));
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
      const matchesTitle = data.title.toLowerCase().includes(searchLower);
      const matchesDesc = data.description?.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDesc) return false;
    }

    return true;
  });
}
