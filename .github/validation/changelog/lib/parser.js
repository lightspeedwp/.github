import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ChangelogParser {
  constructor(changelogPath = null) {
    this.changelogPath = changelogPath || path.join(__dirname, '..', '..', '..', 'CHANGELOG.md');
  }

  parseChangelog() {
    try {
      const content = fs.readFileSync(this.changelogPath, 'utf-8');
      return this.parseContent(content);
    } catch (error) {
      console.error(`Failed to read changelog at ${this.changelogPath}:`, error.message);
      return { entries: [], errors: [error.message] };
    }
  }

  parseContent(content) {
    const lines = content.split('\n');
    const entries = [];
    const errors = [];

    let inUnreleasedSection = false;
    let currentSection = null;
    let currentEntry = null;
    let entryLineStart = null;
    let entryId = 1;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const trimmedLine = line.trim();

      if (trimmedLine.match(/^##\s+\[Unreleased\]/i)) {
        inUnreleasedSection = true;
        continue;
      }

      if (trimmedLine.match(/^##\s+\[/) && inUnreleasedSection) {
        if (currentEntry) {
          entries.push(this.finializeEntry(currentEntry, entryId, entryLineStart));
          entryId++;
          currentEntry = null;
        }
        inUnreleasedSection = false;
        currentSection = null;
        continue;
      }

      if (!inUnreleasedSection) {
        continue;
      }

      if (trimmedLine.match(/^###\s+(Added|Changed|Deprecated|Removed|Fixed|Security)/i)) {
        if (currentEntry) {
          entries.push(this.finializeEntry(currentEntry, entryId, entryLineStart));
          entryId++;
        }
        currentSection = trimmedLine.replace(/^###\s+/, '').toLowerCase();
        currentEntry = null;
        continue;
      }

      if (trimmedLine.match(/^-\s+/) && currentSection) {
        if (currentEntry) {
          entries.push(this.finializeEntry(currentEntry, entryId, entryLineStart));
          entryId++;
        }
        entryLineStart = lineIndex + 1;
        const entryContent = trimmedLine.replace(/^-\s+/, '').trim();
        currentEntry = {
          content: entryContent,
          lines: [entryContent],
          section: currentSection,
          startLine: lineIndex + 1,
        };
      } else if (
        currentEntry &&
        trimmedLine &&
        !trimmedLine.match(/^###/) &&
        !trimmedLine.match(/^##/)
      ) {
        currentEntry.lines.push(trimmedLine);
        currentEntry.content = currentEntry.lines.join(' ');
      }
    }

    if (currentEntry) {
      entries.push(this.finializeEntry(currentEntry, entryId, entryLineStart));
    }

    return {
      entries,
      errors: errors.length > 0 ? errors : null,
      totalEntries: entries.length,
      unreleasedSectionFound: entries.length > 0 || !inUnreleasedSection,
    };
  }

  finializeEntry(entryData, entryId, lineStart) {
    const { content, section } = entryData;

    const prMatches = content.match(/#(\d+)/g) || [];
    const issueMatches = content.match(/issues\/#(\d+)/g) || [];

    const prNumbers = prMatches.map((m) => parseInt(m.slice(1)));
    const issueNumbers = issueMatches.map((m) => parseInt(m.match(/\d+/)[0]));

    const entry = {
      id: `unreleased-${entryId}`,
      content: content.trim(),
      line_number: lineStart,
      version_section: 'Unreleased',
      section: section,
      pr_numbers: prNumbers,
      issue_numbers: issueNumbers,
      references: [...prMatches, ...issueMatches],
    };

    return entry;
  }

  filterBySection(entries, sectionName) {
    return entries.filter((e) => e.section === sectionName.toLowerCase());
  }

  getEntriesWithPRLink(entries) {
    return entries.filter((e) => e.pr_numbers.length > 0);
  }

  getEntriesWithoutPRLink(entries) {
    return entries.filter((e) => e.pr_numbers.length === 0);
  }
}

export default ChangelogParser;
