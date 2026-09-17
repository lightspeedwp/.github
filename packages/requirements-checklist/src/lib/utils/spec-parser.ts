import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { ParsedSpecification } from '../types';

/**
 * Parse specification files in Markdown, YAML, or JSON format
 */
export class SpecParser {
  /**
   * Parse a specification file and extract structured content
   */
  static parse(filePath: string, format?: string): ParsedSpecification {
    const content = fs.readFileSync(filePath, 'utf-8');
    const detectedFormat = format || this.detectFormat(filePath);

    switch (detectedFormat) {
      case 'markdown':
        return this.parseMarkdown(content);
      case 'yaml':
        return this.parseYaml(content);
      case 'json':
        return this.parseJson(content);
      default:
        throw new Error(`Unsupported format: ${detectedFormat}`);
    }
  }

  /**
   * Detect file format from extension
   */
  private static detectFormat(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.md':
      case '.markdown':
        return 'markdown';
      case '.yaml':
      case '.yml':
        return 'yaml';
      case '.json':
        return 'json';
      default:
        throw new Error(`Cannot detect format for file: ${filePath}`);
    }
  }

  /**
   * Parse Markdown specification
   */
  private static parseMarkdown(content: string): ParsedSpecification {
    const lines = content.split('\n');
    const result: ParsedSpecification = {
      raw_content: content,
      user_stories: [],
      functional_requirements: [],
      success_criteria: [],
      assumptions: [],
      edge_cases: [],
      dependencies: [],
    };

    let currentSection = '';
    let buffer: string[] = [];

    for (const line of lines) {
      // Detect section headers
      if (line.startsWith('## ')) {
        currentSection = line.substring(3).toLowerCase();
      } else if (line.startsWith('### ')) {
        // Subsection - include in current section
        if (buffer.length > 0) {
          this.addToSection(result, currentSection, buffer.join('\n'));
          buffer = [];
        }
      } else if (line.trim()) {
        buffer.push(line);
      }
    }

    // Add remaining buffer
    if (buffer.length > 0) {
      this.addToSection(result, currentSection, buffer.join('\n'));
    }

    // Extract overview from first paragraph before first ##
    const overviewMatch = content.match(/^([\s\S]*?)(?:^## |$)/m);
    if (overviewMatch) {
      result.overview = overviewMatch[1].trim();
    }

    return result;
  }

  /**
   * Parse YAML specification
   */
  private static parseYaml(content: string): ParsedSpecification {
    const parsed = yaml.parse(content) as Record<string, unknown>;

    return {
      raw_content: content,
      overview: typeof parsed.overview === 'string' ? parsed.overview : undefined,
      user_stories: Array.isArray(parsed.user_stories)
        ? parsed.user_stories.map(String)
        : undefined,
      functional_requirements: Array.isArray(parsed.functional_requirements)
        ? parsed.functional_requirements.map(String)
        : undefined,
      success_criteria: Array.isArray(parsed.success_criteria)
        ? parsed.success_criteria.map(String)
        : undefined,
      assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions.map(String) : undefined,
      edge_cases: Array.isArray(parsed.edge_cases) ? parsed.edge_cases.map(String) : undefined,
      dependencies: Array.isArray(parsed.dependencies)
        ? parsed.dependencies.map(String)
        : undefined,
    };
  }

  /**
   * Parse JSON specification
   */
  private static parseJson(content: string): ParsedSpecification {
    const parsed = JSON.parse(content) as Record<string, unknown>;

    return {
      raw_content: content,
      overview: typeof parsed.overview === 'string' ? parsed.overview : undefined,
      user_stories: Array.isArray(parsed.user_stories)
        ? parsed.user_stories.map(String)
        : undefined,
      functional_requirements: Array.isArray(parsed.functional_requirements)
        ? parsed.functional_requirements.map(String)
        : undefined,
      success_criteria: Array.isArray(parsed.success_criteria)
        ? parsed.success_criteria.map(String)
        : undefined,
      assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions.map(String) : undefined,
      edge_cases: Array.isArray(parsed.edge_cases) ? parsed.edge_cases.map(String) : undefined,
      dependencies: Array.isArray(parsed.dependencies)
        ? parsed.dependencies.map(String)
        : undefined,
    };
  }

  /**
   * Add content to appropriate section
   */
  private static addToSection(spec: ParsedSpecification, section: string, content: string): void {
    switch (section) {
      case 'overview':
        spec.overview = (spec.overview || '') + '\n' + content;
        break;
      case 'user scenarios & testing':
      case 'user stories':
        spec.user_stories?.push(content);
        break;
      case 'requirements':
      case 'functional requirements':
        spec.functional_requirements?.push(content);
        break;
      case 'success criteria':
      case 'measurable outcomes':
        spec.success_criteria?.push(content);
        break;
      case 'assumptions':
        spec.assumptions?.push(content);
        break;
      case 'edge cases':
        spec.edge_cases?.push(content);
        break;
      case 'dependencies':
      case 'references':
        spec.dependencies?.push(content);
        break;
    }
  }
}
