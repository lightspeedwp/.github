/**
 * Tests for validate-mermaid-accessibility.js
 * Validates Mermaid diagram accessibility compliance (accTitle and accDescr)
 */

const fs = require('fs')
const path = require('path')

const FIXTURE_DIR = path.join(__dirname, '../../..', 'tests/fixtures/mermaid-accessibility')

// Import or define the validation functions
function extractMermaidDiagrams(content) {
  const diagrams = []
  const regex = /```mermaid\r?\n([\s\S]*?)```/g
  let match

  while ((match = regex.exec(content)) !== null) {
    const diagramContent = match[1].trim()
    diagrams.push(diagramContent)
  }

  return diagrams
}

function validateAccessibility(content) {
  const issues = []
  const lines = content.split('\n')

  const firstMeaningfulLine = lines.find(
    (l) => l.trim() !== '' && !l.trim().startsWith('%%')
  )
  if (firstMeaningfulLine && firstMeaningfulLine.trim() === '---') {
    issues.push(
      "YAML front-matter (---) syntax is not supported by GitHub's Mermaid renderer. " +
        'Move accTitle and accDescr inline, after the diagram type declaration.'
    )
    return issues
  }

  if (
    firstMeaningfulLine &&
    /^\s*(accTitle|accDescr)\s*[:{\s]/.test(firstMeaningfulLine)
  ) {
    issues.push(
      'accTitle/accDescr must appear after the diagram type declaration, not before it. ' +
        'Move the diagram type (e.g. `flowchart TD`) to the first line.'
    )
    return issues
  }

  const hasAccTitle =
    /^\s*accTitle\s*:/m.test(content) || /^\s*accTitle\s+\S/m.test(content)
  if (!hasAccTitle) {
    issues.push(
      'Missing accTitle — add it inline after the diagram type (e.g. `    accTitle: My title`)'
    )
  }

  const hasAccDescr =
    /^\s*accDescr\s*:/m.test(content) ||
    /^\s*accDescr\s*\{/m.test(content) ||
    /^\s*accDescr\s+\S/m.test(content)
  if (!hasAccDescr) {
    issues.push(
      'Missing accDescr — add it inline after the diagram type (e.g. `    accDescr: My description`)'
    )
  }

  let inAccDescrBlock = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (/^accDescr\s*\{/.test(line)) {
      inAccDescrBlock = true
    }

    if (inAccDescrBlock && line === '}') {
      inAccDescrBlock = false
    }
  }

  if (inAccDescrBlock) {
    issues.push('Unclosed accDescr block — add a closing `}` on its own line')
  }

  return issues
}

describe('validate-mermaid-accessibility', () => {
  describe('extractMermaidDiagrams', () => {
    it('should extract mermaid diagram with accessibility attributes', () => {
      const content = `\`\`\`mermaid
graph TD
    accTitle: Process Flow
    accDescr: Shows workflow from start to end
    A[Start] --> B[Process] --> C[End]
\`\`\``
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams).toHaveLength(1)
      expect(diagrams[0]).toContain('accTitle')
      expect(diagrams[0]).toContain('accDescr')
    })

    it('should extract multiple diagrams separately', () => {
      const content = `\`\`\`mermaid
graph TD
    accTitle: First
    accDescr: First diagram
    A --> B
\`\`\`

\`\`\`mermaid
flowchart LR
    accTitle: Second
    accDescr: Second diagram
    X --> Y
\`\`\``
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams).toHaveLength(2)
      expect(diagrams[0]).toContain('graph TD')
      expect(diagrams[1]).toContain('flowchart LR')
    })
  })

  describe('validateAccessibility - accTitle validation', () => {
    it('should pass with accTitle colon format', () => {
      const diagram = `graph TD
    accTitle: My Process Flow
    A[Start] --> B[End]`
      const issues = validateAccessibility(diagram)

      expect(issues.filter((i) => i.includes('accTitle'))).toHaveLength(0)
    })

    it('should pass with accTitle space format', () => {
      const diagram = `flowchart LR
    accTitle My Flow
    A --> B`
      const issues = validateAccessibility(diagram)

      expect(issues.filter((i) => i.includes('accTitle'))).toHaveLength(0)
    })

    it('should fail with missing accTitle', () => {
      const diagram = `graph TD
    accDescr: Description
    A[Start] --> B[End]`
      const issues = validateAccessibility(diagram)

      expect(issues.some((i) => i.includes('Missing accTitle'))).toBe(true)
    })

    it('should fail with accTitle before diagram type', () => {
      const diagram = `accTitle: My Title
graph TD
    A --> B`
      const issues = validateAccessibility(diagram)

      expect(issues.some((i) => i.includes('must appear after'))).toBe(true)
    })
  })

  describe('validateAccessibility - accDescr validation', () => {
    it('should pass with accDescr colon format', () => {
      const diagram = `graph TD
    accTitle: Title
    accDescr: Detailed description of the diagram
    A[Start] --> B[End]`
      const issues = validateAccessibility(diagram)

      expect(issues.filter((i) => i.includes('accDescr'))).toHaveLength(0)
    })

    it('should pass with accDescr block format', () => {
      const diagram = `graph TD
    accTitle: Title
    accDescr {
      This is a detailed description
      spanning multiple lines
    }
    A[Start] --> B[End]`
      const issues = validateAccessibility(diagram)

      expect(issues.filter((i) => i.includes('accDescr'))).toHaveLength(0)
    })

    it('should pass with accDescr space format', () => {
      const diagram = `flowchart LR
    accTitle: Title
    accDescr Detailed description text
    A --> B`
      const issues = validateAccessibility(diagram)

      expect(issues.filter((i) => i.includes('accDescr'))).toHaveLength(0)
    })

    it('should fail with missing accDescr', () => {
      const diagram = `graph TD
    accTitle: My Title
    A[Start] --> B[End]`
      const issues = validateAccessibility(diagram)

      expect(issues.some((i) => i.includes('Missing accDescr'))).toBe(true)
    })

    it('should fail with accDescr before diagram type', () => {
      const diagram = `accDescr: Description
graph TD
    A --> B`
      const issues = validateAccessibility(diagram)

      expect(issues.some((i) => i.includes('must appear after'))).toBe(true)
    })

    it('should fail with unclosed accDescr block', () => {
      const diagram = `graph TD
    accTitle: Title
    accDescr {
      Description without closing
    A --> B`
      const issues = validateAccessibility(diagram)

      expect(issues.some((i) => i.includes('Unclosed accDescr block'))).toBe(true)
    })
  })

  describe('validateAccessibility - YAML front-matter rejection', () => {
    it('should reject YAML front-matter syntax', () => {
      const diagram = `---
title: My Title
---
graph TD
    A --> B`
      const issues = validateAccessibility(diagram)

      expect(issues.some((i) => i.includes('YAML front-matter'))).toBe(true)
    })

    it('should return early on YAML front-matter error', () => {
      const diagram = `---
title: My Title
---
graph TD
    A --> B`
      const issues = validateAccessibility(diagram)

      expect(issues).toHaveLength(1)
      expect(issues[0]).toContain('YAML front-matter')
    })
  })

  describe('validateAccessibility - comprehensive diagrams', () => {
    it('should validate fully compliant diagram', () => {
      const diagram = `flowchart TD
    accTitle: User Authentication Flow
    accDescr: Shows login process with validation steps
    A[User] -->|Email| B[Validation]
    B -->|Success| C[Authenticated]
    B -->|Failure| D[Error]`
      const issues = validateAccessibility(diagram)

      expect(issues).toHaveLength(0)
    })

    it('should detect multiple missing attributes', () => {
      const diagram = `graph TD
    A[Start]
    B[Process]
    C[End]
    A --> B --> C`
      const issues = validateAccessibility(diagram)

      expect(issues).toHaveLength(2)
      expect(issues.some((i) => i.includes('accTitle'))).toBe(true)
      expect(issues.some((i) => i.includes('accDescr'))).toBe(true)
    })
  })

  describe('fixture validation', () => {
    beforeAll(() => {
      // Ensure fixture directory exists
      if (!fs.existsSync(FIXTURE_DIR)) {
        fs.mkdirSync(FIXTURE_DIR, { recursive: true })
      }
    })

    it('should validate accessible diagram fixture', () => {
      const fixturePath = path.join(FIXTURE_DIR, 'accessible.md')
      if (fs.existsSync(fixturePath)) {
        const content = fs.readFileSync(fixturePath, 'utf8')
        const diagrams = extractMermaidDiagrams(content)

        expect(diagrams.length).toBeGreaterThan(0)
        const issues = validateAccessibility(diagrams[0])
        expect(issues).toHaveLength(0)
      }
    })

    it('should detect inaccessible diagram fixture', () => {
      const fixturePath = path.join(FIXTURE_DIR, 'inaccessible.md')
      if (fs.existsSync(fixturePath)) {
        const content = fs.readFileSync(fixturePath, 'utf8')
        const diagrams = extractMermaidDiagrams(content)

        expect(diagrams.length).toBeGreaterThan(0)
        const issues = validateAccessibility(diagrams[0])
        expect(issues.length).toBeGreaterThan(0)
      }
    })
  })

  describe('edge cases', () => {
    it('should handle whitespace variations in accTitle', () => {
      const diagram = `graph TD
    accTitle:   Title with spaces
    accDescr: Description
    A --> B`
      const issues = validateAccessibility(diagram)

      expect(issues.filter((i) => i.includes('accTitle'))).toHaveLength(0)
    })

    it('should handle comments before diagram type', () => {
      const diagram = `%% This is a comment
graph TD
    accTitle: Title
    accDescr: Description
    A --> B`
      const issues = validateAccessibility(diagram)

      expect(issues).toHaveLength(0)
    })

    it('should handle multiple comments and blank lines', () => {
      const diagram = `%% Comment 1
%% Comment 2

graph TD
    accTitle: Title
    accDescr: Description

    A --> B
    B --> C`
      const issues = validateAccessibility(diagram)

      expect(issues).toHaveLength(0)
    })

    it('should handle Windows line endings', () => {
      const diagram = `graph TD\r\n    accTitle: Title\r\n    accDescr: Description\r\n    A --> B`
      const issues = validateAccessibility(diagram)

      expect(issues).toHaveLength(0)
    })

    it('should handle long description text', () => {
      const longDesc = 'A'.repeat(500)
      const diagram = `graph TD
    accTitle: Title
    accDescr: ${longDesc}
    A --> B`
      const issues = validateAccessibility(diagram)

      expect(issues.filter((i) => i.includes('accDescr'))).toHaveLength(0)
    })

    it('should handle special characters in description', () => {
      const diagram = `graph TD
    accTitle: Process (v2.0)
    accDescr: Shows A→B→C with 50% completion
    A[Start] --> B[Process: 50%] --> C[End]`
      const issues = validateAccessibility(diagram)

      expect(issues).toHaveLength(0)
    })

    it('should handle nested brackets in description', () => {
      const diagram = `graph TD
    accTitle: [Process Flow]
    accDescr: Shows [A] leading to [B] leading to [C]
    A --> B --> C`
      const issues = validateAccessibility(diagram)

      expect(issues).toHaveLength(0)
    })
  })
})
