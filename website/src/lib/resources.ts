import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ResourceFrontmatter {
  title: string;
  description: string;
  version?: string;
  last_updated?: string;
  author?: string;
  maintainer?: string;
  file_type: string;
  category?: string;
  status?: string;
  visibility?: string;
  tags?: string[];
  owners?: string[];
  tools?: string[];
  handoffs?: Array<{
    label: string;
    agent: string;
    prompt: string;
    send: boolean;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Resource {
  slug: string;
  title: string;
  description: string;
  frontmatter: ResourceFrontmatter;
  content: string;
  type: string;
}

const resourceTypes = [
  "agents",
  "instructions",
  "skills",
  "hooks",
  "workflows",
  "plugins",
  "tools",
];

function renderMarkdown(markdown: string): string {
  let html = markdown;

  html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");

  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  html = html.replace(/^- (.*?)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");
  html = html.replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>");

  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";
  html = html.replace(/<p><\/p>/g, "");
  html = html.replace(/<p>(<h[1-3]>)/g, "$1");
  html = html.replace(/(<\/h[1-3]>)<\/p>/g, "$1");
  html = html.replace(/<p>(<ul>)/g, "$1");
  html = html.replace(/(<\/ul>)<\/p>/g, "$1");
  html = html.replace(/<p>(<blockquote>)/g, "$1");
  html = html.replace(/(<\/blockquote>)<\/p>/g, "$1");

  return html;
}

/**
 * Get the directory path for a resource type
 */
function getResourceDir(type: string): string {
  const baseDir = path.join(process.cwd(), "..", type);
  return baseDir;
}

/**
 * Get slug from filename
 */
function getSlugFromFile(filename: string): string {
  return filename
    .replace(/\.(agent|instruction|skill|hook|workflow|plugin|tool)?\.md$/, "")
    .toLowerCase();
}

/**
 * Load a single resource by type and slug
 */
export function getResource(type: string, slug: string): Resource | null {
  try {
    const resourceDir = getResourceDir(type);
    const files = fs.readdirSync(resourceDir);

    // Find matching file (handle different file naming conventions)
    const file = files.find((f) => {
      const fileSlug = getSlugFromFile(f);
      return fileSlug === slug && f.endsWith(".md");
    });

    if (!file) return null;

    const filePath = path.join(resourceDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      frontmatter: data as ResourceFrontmatter,
      content: renderMarkdown(content),
      type,
    };
  } catch {
    // Resource not found, return null
    return null;
  }
}

/**
 * Get all resources of a specific type
 */
export function getResourcesByType(type: string): Resource[] {
  try {
    const resourceDir = getResourceDir(type);

    if (!fs.existsSync(resourceDir)) {
      return [];
    }

    const files = fs.readdirSync(resourceDir).filter((f) => f.endsWith(".md"));

    return files
      .map((file) => {
        const slug = getSlugFromFile(file);
        const filePath = path.join(resourceDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        return {
          slug,
          title: data.title || slug,
          description: data.description || "",
          frontmatter: data as ResourceFrontmatter,
          content: renderMarkdown(content),
          type,
        };
      })
      .filter((r) => r.frontmatter.visibility !== "hidden")
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch {
    // Error loading resources, return empty array
    return [];
  }
}

/**
 * Get all available resource types
 */
export function getAvailableResourceTypes(): Array<{
  type: string;
  label: string;
  icon: string;
  count: number;
}> {
  const typeInfo: Record<string, { label: string; icon: string }> = {
    agents: { label: "Agents", icon: "🤖" },
    instructions: { label: "Instructions", icon: "📝" },
    skills: { label: "Skills", icon: "⚡" },
    hooks: { label: "Hooks", icon: "🛠️" },
    workflows: { label: "Workflows", icon: "⚙️" },
    plugins: { label: "Plugins", icon: "🔌" },
    tools: { label: "Tools", icon: "🔧" },
  };

  return resourceTypes.map((type) => ({
    type,
    label: typeInfo[type]?.label || type,
    icon: typeInfo[type]?.icon || "📦",
    count: getResourcesByType(type).length,
  }));
}

/**
 * Search resources across all types
 */
export function searchResources(query: string): Resource[] {
  const lowerQuery = query.toLowerCase();
  const results: Resource[] = [];

  for (const type of resourceTypes) {
    const resources = getResourcesByType(type);
    resources.forEach((resource) => {
      if (
        resource.title.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery) ||
        resource.frontmatter.tags?.some((tag) =>
          tag.toLowerCase().includes(lowerQuery),
        )
      ) {
        results.push(resource);
      }
    });
  }

  return results;
}
