/**
 * Tests for validate-mermaid-syntax.js
 * Validates Mermaid diagram syntax in markdown files
 */

const fs = require('fs')
const path = require('path')

const FIXTURE_DIR = path.join(__dirname, '../../..', 'tests/fixtures/mermaid')

// Import or define the validation functions
// For now, we'll test the patterns directly
const DIAGRAM_TYPES = {
  graph: /^\s*graph\b/m,
  flowchart: /^\s*flowchart\b/m,
  sequenceDiagram: /^\s*sequenceDiagram\b/m,
  stateDiagram: /^\s*(stateDiagram|stateDiagram-v2)\b/m,
  erDiagram: /^\s*erDiagram\b/m,
  gantt: /^\s*gantt\b/m,
  pie: /^\s*pie\b/m,
  mindmap: /^\s*mindmap\b/m,
}

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

function validateDiagramType(diagram) {
  for (const [type, regex] of Object.entries(DIAGRAM_TYPES)) {
    if (regex.test(diagram)) {
      return { valid: true, type }
    }
  }
  return { valid: false, type: null }
}

describe('validate-mermaid-syntax', () => {
  describe('extractMermaidDiagrams', () => {
    it('should extract single mermaid diagram from markdown', () => {
      const content = fs.readFileSync(
        path.join(FIXTURE_DIR, 'valid/graph.md'),
        'utf8'
      )
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams).toHaveLength(1)
      expect(diagrams[0]).toContain('graph TD')
    })

    it('should extract multiple diagrams from markdown', () => {
      const content = fs.readFileSync(
        path.join(FIXTURE_DIR, 'valid/multiple-diagrams.md'),
        'utf8'
      )
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams).toHaveLength(2)
      expect(diagrams[0]).toContain('graph TD')
      expect(diagrams[1]).toContain('flowchart LR')
    })

    it('should preserve diagram content exactly', () => {
      const content = '```mermaid\ngraph TD\n    A[Start] --> B[End]\n```'
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams[0]).toContain('A[Start]')
      expect(diagrams[0]).toContain('-->')
      expect(diagrams[0]).toContain('B[End]')
    })

    it('should handle whitespace properly', () => {
      const content = '```mermaid\n  graph TD\n    A --> B\n```'
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams[0].trim()).toMatch(/^graph TD/)
    })

    it('should ignore non-mermaid code blocks', () => {
      const content = '```javascript\nvar x = 1\n```\n```mermaid\ngraph TD\nA-->B\n```'
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams).toHaveLength(1)
      expect(diagrams[0]).toContain('graph TD')
    })

    it('should return empty array when no diagrams present', () => {
      const content = '# Just markdown\n\nNo diagrams here.'
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams).toHaveLength(0)
    })

    it('should handle empty diagrams', () => {
      const content = '```mermaid\n\n```'
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams).toHaveLength(1)
      expect(diagrams[0]).toBe('')
    })
  })

  describe('validateDiagramType', () => {
    it('should identify graph diagrams', () => {
      const diagram = 'graph TD\n    A --> B'
      const result = validateDiagramType(diagram)

      expect(result.valid).toBe(true)
      expect(result.type).toBe('graph')
    })

    it('should identify flowchart diagrams', () => {
      const diagram = 'flowchart LR\n    A --> B'
      const result = validateDiagramType(diagram)

      expect(result.valid).toBe(true)
      expect(result.type).toBe('flowchart')
    })

    it('should identify sequenceDiagram', () => {
      const diagram = 'sequenceDiagram\n    A->>B: message'
      const result = validateDiagramType(diagram)

      expect(result.valid).toBe(true)
      expect(result.type).toBe('sequenceDiagram')
    })

    it('should identify stateDiagram', () => {
      const diagram = 'stateDiagram-v2\n    [*] --> S1'
      const result = validateDiagramType(diagram)

      expect(result.valid).toBe(true)
      expect(result.type).toBe('stateDiagram')
    })

    it('should identify erDiagram', () => {
      const diagram = 'erDiagram\n    ENTITY1'
      const result = validateDiagramType(diagram)

      expect(result.valid).toBe(true)
      expect(result.type).toBe('erDiagram')
    })

    it('should identify gantt diagrams', () => {
      const diagram = 'gantt\n    title Test'
      const result = validateDiagramType(diagram)

      expect(result.valid).toBe(true)
      expect(result.type).toBe('gantt')
    })

    it('should identify pie diagrams', () => {
      const diagram = 'pie title Test\n    "A" : 10'
      const result = validateDiagramType(diagram)

      expect(result.valid).toBe(true)
      expect(result.type).toBe('pie')
    })

    it('should identify mindmap diagrams', () => {
      const diagram = 'mindmap\n    root'
      const result = validateDiagramType(diagram)

      expect(result.valid).toBe(true)
      expect(result.type).toBe('mindmap')
    })

    it('should reject invalid diagram type', () => {
      const diagram = 'invalidtype\n    A --> B'
      const result = validateDiagramType(diagram)

      expect(result.valid).toBe(false)
      expect(result.type).toBeNull()
    })

    it('should handle leading whitespace', () => {
      const diagram = '  graph TD\n    A --> B'
      const result = validateDiagramType(diagram)

      expect(result.valid).toBe(true)
      expect(result.type).toBe('graph')
    })

    it('should reject empty diagram', () => {
      const diagram = ''
      const result = validateDiagramType(diagram)

      expect(result.valid).toBe(false)
    })
  })

  describe('fixture validation', () => {
    it('should validate valid graph fixture', () => {
      const content = fs.readFileSync(
        path.join(FIXTURE_DIR, 'valid/graph.md'),
        'utf8'
      )
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams.length).toBeGreaterThan(0)
      const result = validateDiagramType(diagrams[0])
      expect(result.valid).toBe(true)
    })

    it('should validate valid flowchart fixture', () => {
      const content = fs.readFileSync(
        path.join(FIXTURE_DIR, 'valid/flowchart.md'),
        'utf8'
      )
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams.length).toBeGreaterThan(0)
      const result = validateDiagramType(diagrams[0])
      expect(result.valid).toBe(true)
      expect(result.type).toBe('flowchart')
    })

    it('should detect invalid syntax in fixture', () => {
      const content = fs.readFileSync(
        path.join(FIXTURE_DIR, 'invalid/missing-keyword.md'),
        'utf8'
      )
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams.length).toBeGreaterThan(0)
      const result = validateDiagramType(diagrams[0])
      expect(result.valid).toBe(false)
    })

    it('should handle valid sequence diagram fixture', () => {
      const content = fs.readFileSync(
        path.join(FIXTURE_DIR, 'valid/sequencediagram.md'),
        'utf8'
      )
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams.length).toBeGreaterThan(0)
      const result = validateDiagramType(diagrams[0])
      expect(result.valid).toBe(true)
      expect(result.type).toBe('sequenceDiagram')
    })

    it('should handle valid state diagram fixture', () => {
      const content = fs.readFileSync(
        path.join(FIXTURE_DIR, 'valid/statediagram.md'),
        'utf8'
      )
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams.length).toBeGreaterThan(0)
      const result = validateDiagramType(diagrams[0])
      expect(result.valid).toBe(true)
      expect(result.type).toBe('stateDiagram')
    })
  })

  describe('edge cases', () => {
    it('should handle diagrams with special characters', () => {
      const diagram = 'graph TD\n    A["Node with →"]'
      const diagrams = extractMermaidDiagrams(`\`\`\`mermaid\n${diagram}\n\`\`\``)

      expect(diagrams).toHaveLength(1)
      expect(diagrams[0]).toContain('→')
    })

    it('should handle nested brackets', () => {
      const diagram = 'graph TD\n    A["[Start]"] --> B["[End]"]'
      const diagrams = extractMermaidDiagrams(`\`\`\`mermaid\n${diagram}\n\`\`\``)

      expect(diagrams).toHaveLength(1)
      expect(diagrams[0]).toContain('[Start]')
    })

    it('should handle long diagram content', () => {
      const nodes = Array.from({ length: 50 }, (_, i) => `N${i}[Node ${i}]`).join('\n    ')
      const diagram = `graph TD\n    ${nodes}`
      const diagrams = extractMermaidDiagrams(`\`\`\`mermaid\n${diagram}\n\`\`\``)

      expect(diagrams[0]).toContain('N49')
    })

    it('should handle Windows line endings', () => {
      const content = '```mermaid\r\ngraph TD\r\n    A --> B\r\n```'
      const diagrams = extractMermaidDiagrams(content)

      expect(diagrams).toHaveLength(1)
    })
  })
})
