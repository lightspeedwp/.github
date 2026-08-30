#!/usr/bin/env node

/**
 * Agent Index Generator
 * Generates searchable agent index from all .agent.md specification files
 * Outputs to docs/AGENT-INDEX.md
 */

import fs from "fs";
import path from "path";
import * as YAML from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AGENT_SPEC_DIR = path.join(__dirname, "../../agents");
const OUTPUT_FILE = path.join(__dirname, "../../docs/AGENT-INDEX.md");

// Category metadata
const CATEGORY_INFO = {
  configuration: { icon: "⚙️", description: "Configuration and setup agents" },
  analysis: { icon: "🔍", description: "Analysis and research agents" },
  integration: { icon: "🔗", description: "Integration and API agents" },
  planning: { icon: "📋", description: "Planning and roadmap agents" },
  governance: { icon: "📋", description: "Governance and process agents" },
  automation: { icon: "⚡", description: "Automation and workflow agents" },
  tooling: { icon: "🛠️", description: "Development tools and utilities" },
  mode: { icon: "🎯", description: "Operational modes and frameworks" },
};

// Parse YAML frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  try {
    return YAML.load(match[1]);
  } catch (error) {
    console.error(`Error parsing frontmatter: ${error.message}`);
    return null;
  }
}

// Parse agent spec file
function parseAgentSpec(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter) {
      console.warn(`Invalid frontmatter in ${filePath}`);
      return null;
    }

    // Extract first paragraph of content after frontmatter
    const contentMatch = content.match(
      /^---\n[\s\S]*?\n---\n+([\s\S]*?)(?:\n##|$)/,
    );
    const summary = contentMatch ? contentMatch[1].trim().split("\n")[0] : "";

    return {
      name: frontmatter.name || path.basename(filePath, ".agent.md"),
      description: frontmatter.description || summary || "",
      file: path.basename(filePath),
      path: path.relative(AGENT_SPEC_DIR, filePath),
      category: frontmatter.category || "unknown",
      status: frontmatter.status || "active",
      version: frontmatter.version || "1.0.0",
      implementation: frontmatter.implementation || null,
      tags: frontmatter.tags || [],
      created_date: frontmatter.created_date || "",
      last_updated: frontmatter.last_updated || "",
      author: frontmatter.author || "Unknown",
      language: frontmatter.language || "en",
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}: ${error.message}`);
    return null;
  }
}

// Collect all agent specs
function collectAgentSpecs() {
  const specs = [];

  // Find all .agent.md files
  function walkDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith(".agent.md")) {
        const spec = parseAgentSpec(filePath);
        if (spec) {
          specs.push(spec);
        }
      }
    }
  }

  // Start from repository root to catch all agents
  const repoRoot = path.join(__dirname, "../../");
  walkDir(repoRoot);

  return specs.sort((a, b) => a.name.localeCompare(b.name));
}

// Generate markdown index
function generateIndex(specs) {
  const today = new Date().toISOString().split("T")[0];
  let markdown = `---
file_type: documentation
title: Agent Index
description: Searchable index of all agent specifications
created_date: ${today}
last_updated: ${today}
author: Agent Index Generator
language: en
status: active
---

# Agent Index

Complete searchable index of all ${specs.length} agent specifications in the LightSpeed \`.github\` control plane.

**Generated**: ${today}

## Quick Stats

| Metric | Count |
| --- | --- |
| Total Agents | ${specs.length} |
| Active Agents | ${specs.filter((s) => s.status === "active").length} |
| Draft Agents | ${specs.filter((s) => s.status === "draft").length} |
| Deprecated Agents | ${specs.filter((s) => s.status === "deprecated").length} |

## Agents by Category

`;

  // Group by category
  const byCategory = {};
  for (const spec of specs) {
    const cat = spec.category || "unknown";
    if (!byCategory[cat]) {
      byCategory[cat] = [];
    }
    byCategory[cat].push(spec);
  }

  // Generate category sections
  for (const [category, agents] of Object.entries(byCategory)) {
    const catInfo = CATEGORY_INFO[category] || {
      icon: "📦",
      description: category,
    };
    markdown += `\n### ${catInfo.icon} ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
    markdown += `${catInfo.description}\n\n`;

    markdown += `| Agent | Status | Version | Tags |\n`;
    markdown += `| --- | --- | --- | --- |\n`;

    for (const agent of agents) {
      const statusBadge =
        agent.status === "active"
          ? "✅ Active"
          : agent.status === "draft"
            ? "📝 Draft"
            : "🚫 Deprecated";
      const tags =
        agent.tags.length > 0
          ? agent.tags.map((t) => `\`${t}\``).join(", ")
          : "—";
      const specLink = `[${agent.name}](../agents/${agent.file})`;

      markdown += `| ${specLink} | ${statusBadge} | ${agent.version} | ${tags} |\n`;
    }

    markdown += "\n";
  }

  // Add all agents section
  markdown += `\n## All Agents (Alphabetical)\n\n`;

  markdown += `| Agent | Category | Status | Version | Updated |\n`;
  markdown += `| --- | --- | --- | --- | --- |\n`;

  for (const spec of specs) {
    const statusBadge =
      spec.status === "active" ? "✅" : spec.status === "draft" ? "📝" : "🚫";
    const specLink = `[${spec.name}](../agents/${spec.file})`;
    const catInfo = CATEGORY_INFO[spec.category] || { icon: "📦" };

    markdown += `| ${specLink} | ${catInfo.icon} ${spec.category} | ${statusBadge} ${spec.status} | ${spec.version} | ${spec.last_updated} |\n`;
  }

  // Add discovery section
  markdown += `\n## Discovery\n\n`;
  markdown += `### By Implementation Status\n\n`;
  markdown += `**With Implementation Directory** (${specs.filter((s) => s.implementation).length})\n\n`;

  for (const spec of specs.filter((s) => s.implementation)) {
    markdown += `- [${spec.name}](../agents/${spec.file}) → [\`${spec.implementation}/\`](../agents/${spec.implementation}/)\n`;
  }

  markdown += `\n**Specification-Only** (${specs.filter((s) => !s.implementation).length})\n\n`;

  for (const spec of specs.filter((s) => !s.implementation)) {
    markdown += `- [${spec.name}](../agents/${spec.file}) — ${spec.description}\n`;
  }

  // Add tags section
  const allTags = new Set();
  for (const spec of specs) {
    for (const tag of spec.tags) {
      allTags.add(tag);
    }
  }

  if (allTags.size > 0) {
    markdown += `\n## Agents by Tag\n\n`;

    for (const tag of Array.from(allTags).sort()) {
      const tagged = specs.filter((s) => s.tags.includes(tag));
      markdown += `### \`${tag}\`\n\n`;

      for (const spec of tagged) {
        markdown += `- [${spec.name}](../agents/${spec.file})\n`;
      }

      markdown += "\n";
    }
  }

  // Add author section
  const byAuthor = {};
  for (const spec of specs) {
    const author = spec.author || "Unknown";
    if (!byAuthor[author]) {
      byAuthor[author] = [];
    }
    byAuthor[author].push(spec);
  }

  markdown += `\n## Agents by Author\n\n`;
  for (const [author, agents] of Object.entries(byAuthor).sort()) {
    markdown += `### ${author} (${agents.length})\n\n`;
    for (const agent of agents) {
      markdown += `- [${agent.name}](../agents/${agent.file}) — ${agent.description}\n`;
    }
    markdown += "\n";
  }

  // Add footer
  markdown += `\n---\n\n`;
  markdown += `## Related Documentation\n\n`;
  markdown += `- [Agent Developer Guide](./AGENT-DEVELOPER-GUIDE.md)\n`;
  markdown += `- [Agent Specification Audit - Phase 3 Results](./.github/reports/audit/AGENT-SPECS-PHASE3-RESULTS.md)\n`;
  markdown += `- [CONTRIBUTING.md](./CONTRIBUTING.md)\n\n`;
  markdown += `**Generated**: ${new Date().toISOString()}\n`;
  markdown += `**Total Agents**: ${specs.length}\n`;

  return markdown;
}

// Main execution
function main() {
  console.log("Generating agent index...");

  const specs = collectAgentSpecs();
  console.log(`Found ${specs.length} agent specifications`);

  const markdown = generateIndex(specs);

  // Ensure directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, markdown, "utf8");
  console.log(`✅ Agent index generated: ${OUTPUT_FILE}`);

  // Print summary
  console.log("\n📊 Agent Index Summary:");
  console.log(`   Total agents: ${specs.length}`);
  console.log(
    `   Active: ${specs.filter((s) => s.status === "active").length}`,
  );
  console.log(`   Draft: ${specs.filter((s) => s.status === "draft").length}`);
  console.log(
    `   Deprecated: ${specs.filter((s) => s.status === "deprecated").length}`,
  );

  const categories = {};
  for (const spec of specs) {
    categories[spec.category] = (categories[spec.category] || 0) + 1;
  }
  console.log("\n📂 By Category:");
  for (const [cat, count] of Object.entries(categories).sort()) {
    console.log(`   ${cat}: ${count}`);
  }

  return 0;
}

process.exit(main());
