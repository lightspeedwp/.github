---
title: "Project Linker"
description: "Find active projects and issues for a repository"
name: project-linker
version: 1.0.1
created_date: 2026-08-12T00:00:00.000Z
last_updated: '2026-08-21'
authors:
  - Ash Shaw
maintainer: Ash Shaw
tags:
  - project
  - linking
  - discovery
  - issues
---

# Project Linker Skill

## Overview

Discovers related projects and GitHub issues for a repository during session closure. This skill integrates with the Chat Closure Agent to find context-relevant work that should be included in handoff prompts.

## When to Use

- Finding active projects related to current work
- Discovering related GitHub issues from git history
- Building project and issue context for continuation prompts
- Analyzing work scope and related deliverables
- Creating comprehensive session handoff documentation

## Input Parameters

### Required

- **repoPath** — Path to git repository (default: `"."`)
- **repoType** — Repository type: `"control-plane"`, `"wordpress-plugin"`, or `"wordpress-theme"`

### Optional

- **issueNumbers** — Pre-extracted issue numbers to enrich (array of `"#XXXX"`)
- **branchScope** — Branch scope for semantic project matching (string)
- **maxResults** — Maximum projects/issues to return (default: 10)

## Output Format

```javascript
{
  projects: [
    {
      name: "Chat Closure Agent",
      path: ".github/projects/active/chat-closure-agent-2026-08-12/",
      description: "Automate session handoff workflows",
      type: "active",
      link: "../../issues/1888"
    }
  ],
  issues: [
    {
      number: "#1888",
      title: "Epic: Chat Closure Agent Implementation",
      type: "epic",
      status: "🟢 Open",
      link: "../../issues/1888"
    }
  ],
  projectCount: 1,
  issueCount: 3
}
```

## Repository-Specific Discovery

### Control-Plane (.github) Repositories

Project discovery strategy:

```javascript
// Look for projects in .github/projects/active/
const projectPath = path.join(repoPath, '.github', 'projects', 'active')
const projects = fs.readdirSync(projectPath)
  .filter(dir => fs.existsSync(path.join(projectPath, dir, 'README.md')))
  .map(dir => parseProjectREADME(path.join(projectPath, dir, 'README.md')))
```

Extract related issues from project README files:

```javascript
// Find "Related Issues" section and extract issue links
const relatedIssuesPattern = /## Related Issues\n([\s\S]*?)(?:##|$)/
const matches = readme.match(relatedIssuesPattern)
// Parse `[#XXXX](../../issues/XXXX)` format
```

### WordPress Plugin Repositories

Project discovery strategy:

```javascript
// Parse plugin metadata from plugin.php
const pluginMetadata = parsePluginHeader(path.join(repoPath, 'plugin.php'))
// Extract from:
// * Plugin Name
// * Description
// * Author
// * GitHub links in header comments
```

Check composer.json for project metadata:

```javascript
const composer = JSON.parse(fs.readFileSync('composer.json'))
const projectUrl = composer.homepage || composer.repository?.url
// Extract GitHub project/issue references
```

### WordPress Theme Repositories

Project discovery strategy:

```javascript
// Parse theme metadata from style.css
const themeMetadata = parseThemeHeader(path.join(repoPath, 'style.css'))
// Extract from:
// * Theme Name
// * Description
// * Author
// * Theme URI
```

Check theme.json for project info:

```javascript
const themeJson = JSON.parse(fs.readFileSync('theme.json'))
// Extract from metadata section
// Look for documentation URLs or issue trackers
```

## Issue Number Enrichment

Enhance pre-extracted issue numbers with metadata:

```javascript
async function enrichIssueNumbers(issueNumbers) {
  return Promise.all(
    issueNumbers.map(async (num) => {
      try {
        const issue = await github.rest.issues.get({
          repo: '...',
          issue_number: parseInt(num.slice(1))
        })
        return {
          number: num,
          title: issue.title,
          type: detectIssueType(issue.labels),
          status: getStatusEmoji(issue.state)
        }
      } catch (error) {
        return { number: num, error: 'Could not fetch' }
      }
    })
  )
}
```

## Usage Examples

### Find All Projects

```javascript
const { findProjects } = require('./skills/project-linker')

const projects = findProjects('.', 'control-plane')
console.log(`Found ${projects.projectCount} projects`)
projects.projects.forEach(p => {
  console.log(`- ${p.name}: ${p.description}`)
})
```

### Enrich Issue Numbers

```javascript
const { enrichIssueNumbers } = require('./skills/project-linker')

const issues = ['#1850', '#1851', '#1852']
const enriched = await enrichIssueNumbers(issues)
enriched.forEach(i => {
  console.log(`${i.number}: ${i.title} (${i.type})`)
})
```

### Find Projects by Branch Scope

```javascript
const { findProjectsByScope } = require('./skills/project-linker')

const scope = 'chat-closure'
const related = findProjectsByScope('.', scope)
console.log(`Projects related to ${scope}:`)
related.forEach(p => console.log(`- ${p.name}`))
```

### Full Project & Issue Discovery

```javascript
const coreAnalysis = require('./shared/core-analysis')
const projectLinker = require('./skills/project-linker')

const metadata = coreAnalysis.analyzeRepository('.')
const discovered = projectLinker.discoverAll('.', metadata.repoType, {
  issueNumbers: metadata.issueNumbers,
  branchScope: metadata.parsedBranch.scope
})

console.log(`Projects: ${discovered.projectCount}`)
console.log(`Issues: ${discovered.issueCount}`)
```

## Integration with Memory & Handoff

The project-linker output is used by the continuation-prompt-builder:

```javascript
const projectLinker = require('./skills/project-linker')
const promptBuilder = require('./shared/continuation-prompt-builder')

const discovered = projectLinker.discoverAll(repoPath, repoType)
const prompt = promptBuilder.buildContinuationPrompt(coreAnalysisData, {
  projects: discovered.projects,
  issues: discovered.issues
})
```

## Error Handling

This skill handles these scenarios:

- **Project folder not found** — Returns empty projects array
- **README.md missing** — Skips project (incomplete setup)
- **Issue fetch fails** — Returns issue with error field
- **Invalid GitHub credentials** — Falls back to local parsing only
- **File encoding issues** — Uses UTF-8 with fallback to Latin-1

### Example Error Handling

```javascript
const coreAnalysis = require('./shared/core-analysis')
const projectLinker = require('./skills/project-linker')

try {
  const discovered = projectLinker.discoverAll(
    '.',
    coreAnalysis.detectRepoType('.')
  )
  console.log(`Found ${discovered.projectCount} projects`)
} catch (error) {
  if (error.message.includes('Unknown repo type')) {
    console.error('Repository type not supported')
  } else {
    console.error(`Project discovery failed: ${error.message}`)
  }
}
```

## Testing

This skill includes Jest unit tests:

```bash
npm test -- project-linker.test.js
```

Test fixtures include:

- Mock project READMEs (control-plane)
- Sample plugin.php headers (WordPress plugins)
- Sample style.css headers (WordPress themes)
- Mock GitHub API responses

## Performance Notes

- **Local parsing** (no API): ~50-100ms per repository
- **With GitHub API enrichment**: ~500ms-2s (depends on issue count)
- **Caching**: Project discovery results can be cached per session (immutable)

## Related Skills

- **git-metadata-extractor** — Extracts issue numbers from commits
- **continuation-prompt-builder** — Uses discovered projects/issues in prompts
- **memory-updater** — Stores discovered projects in memory entries

## Version History

### v1.0.0 (2026-08-12)

- Initial release
- Support for control-plane, WordPress plugins, WordPress themes
- Project discovery from file system and metadata
- Issue enrichment via GitHub API (optional)
- Integration with memory and handoff systems

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
